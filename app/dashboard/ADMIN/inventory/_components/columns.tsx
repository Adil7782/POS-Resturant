"use client"

import { useState } from "react";
import { ArrowUpDown, Pencil } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Inventory, Product } from "@/app/generated/prisma/client";
import { EditStockModal } from "./edit-stock-modal";

type InventoryRow = Inventory & { product: Product };

const ActionCell = ({ row }: { row: { original: InventoryRow } }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit Stock
            </Button>
            {open && (
                <EditStockModal
                    item={row.original}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
};

export const columns: ColumnDef<InventoryRow>[] = [
    {
        accessorKey: "product.name",
        id: "productName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-3"
            >
                Product
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-medium">{row.original.product.name}</span>
        ),
    },
    {
        accessorKey: "product.sku",
        id: "sku",
        header: "SKU",
        cell: ({ row }) => (
            <span className="text-muted-foreground text-sm">
                {row.original.product.sku ?? "—"}
            </span>
        ),
    },
    {
        accessorKey: "product.price",
        id: "price",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-3"
            >
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span>Rs. {row.original.product.price.toFixed(2)}</span>
        ),
    },
    {
        accessorKey: "quantityOnHand",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-3"
            >
                Stock
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const qty = row.original.quantityOnHand;
            const reorder = row.original.reorderLevel;
            const low = qty <= reorder;
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{qty}</span>
                    {low && (
                        <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">Low</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "reorderLevel",
        header: "Reorder At",
        cell: ({ row }) => <span>{row.original.reorderLevel}</span>,
    },
    {
        accessorKey: "lastRestockedAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-3"
            >
                Last Restocked
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.original.lastRestockedAt;
            if (!date) return <span className="text-muted-foreground text-sm">Never</span>;
            return (
                <span className="text-sm">
                    {new Date(date).toLocaleDateString("en-MY", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionCell row={row} />,
    },
];
