"use server";

import * as XLSX from "xlsx";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getuser";

interface ExcelRow {
  SKU: string | number;
  Name: string;
  Category: string;
  "Price (Rs.)": number;
  "Cost (Rs.)": number;
  Description?: string;
  "Add to inventory"?: number;
}

const REQUIRED_HEADERS = ["SKU", "Name", "Category", "Price (Rs.)", "Cost (Rs.)"];

export type UploadResult =
  | { success: true; created: number; updated: number; skipped: number; errors: string[] }
  | { success: false; error: string };

export async function uploadProductsAction(formData: FormData): Promise<UploadResult> {
  const user = await getUserFromToken();
  if (!user || user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized." };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "No file provided." };
  }

  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return { success: false, error: "Invalid file format. Please upload a .xlsx file." };
  }

  let rows: ExcelRow[];
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return { success: false, error: "The uploaded file contains no sheets." };
    }
    const sheet = workbook.Sheets[sheetName];
    rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);
  } catch {
    return { success: false, error: "Failed to parse the file. Ensure it is a valid .xlsx file." };
  }

  if (rows.length === 0) {
    return { success: false, error: "The spreadsheet is empty." };
  }

  // Validate headers by inspecting the first row's keys
  const firstRowKeys = Object.keys(rows[0]);
  const missingHeaders = REQUIRED_HEADERS.filter((h) => !firstRowKeys.includes(h));
  if (missingHeaders.length > 0) {
    return {
      success: false,
      error: `Missing required columns: ${missingHeaders.join(", ")}.`,
    };
  }

  let created = 0;
  let updated = 0;
  const rowErrors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // row 1 is the header

    const sku = String(row.SKU ?? "").trim();
    const name = String(row.Name ?? "").trim();
    const categoryName = String(row.Category ?? "").trim();
    const price = Number(row["Price (Rs.)"]);
    const cost = Number(row["Cost (Rs.)"]);
    const description = row.Description ? String(row.Description).trim() : null;
    const addToInventory = Math.max(0, Math.floor(Number(row["Add to inventory"] ?? 0)));

    if (!sku) { rowErrors.push(`Row ${rowNum}: SKU is required.`); continue; }
    if (!name) { rowErrors.push(`Row ${rowNum}: Name is required.`); continue; }
    if (!categoryName) { rowErrors.push(`Row ${rowNum} (${sku}): Category is required.`); continue; }
    if (isNaN(price) || price < 0) { rowErrors.push(`Row ${rowNum} (${sku}): Invalid price.`); continue; }
    if (isNaN(cost) || cost < 0) { rowErrors.push(`Row ${rowNum} (${sku}): Invalid cost.`); continue; }

    try {
      // Each row gets its own short-lived transaction so the connection pool
      // is never held open for the entire upload duration (avoids P2028).
      await prisma.$transaction(
        async (tx) => {
          // Find or create category
          const category = await tx.category.upsert({
            where: { name: categoryName },
            create: { name: categoryName },
            update: {},
          });

          const existingProduct = await tx.product.findUnique({ where: { sku } });
          const isInventoryTracked = addToInventory > 0 || (existingProduct?.isInventoryTracked ?? false);

          const product = await tx.product.upsert({
            where: { sku },
            create: {
              name,
              sku,
              categoryId: category.id,
              price,
              cost,
              description,
              isInventoryTracked: addToInventory > 0,
            },
            update: {
              name,
              categoryId: category.id,
              price,
              cost,
              description,
              isInventoryTracked,
            },
          });

          if (existingProduct) {
            updated++;
          } else {
            created++;
          }

          if (addToInventory > 0) {
            await tx.inventory.upsert({
              where: { productId: product.id },
              update: {
                quantityOnHand: { increment: addToInventory },
                lastRestockedAt: new Date(),
              },
              create: {
                productId: product.id,
                quantityOnHand: addToInventory,
                lastRestockedAt: new Date(),
              },
            });

            await tx.inventoryLog.create({
              data: {
                productId: product.id,
                type: "restock",
                quantityChange: addToInventory,
                notes: "Bulk upload",
              },
            });
          }
        },
        { timeout: 10_000 } // 10 s per row — plenty for a single upsert chain
      );
    } catch (err) {
      console.error(`[uploadProducts] Row ${rowNum} (${sku}) failed:`, err);
      rowErrors.push(`Row ${rowNum} (${sku}): Database error — row skipped.`);
    }
  }

  return { success: true, created, updated, skipped: rowErrors.length, errors: rowErrors };
}
