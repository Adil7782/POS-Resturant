"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadProductsAction } from "@/app/actions/uploadProducts";

export function BulkUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Reset input so the same file can be re-uploaded if needed
    e.target.value = "";

    startTransition(async () => {
      const result = await uploadProductsAction(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const { created, updated, skipped, errors } = result;

      const summary = [
        created > 0 && `${created} created`,
        updated > 0 && `${updated} updated`,
        skipped > 0 && `${skipped} skipped`,
      ]
        .filter(Boolean)
        .join(", ");

      toast.success(`Bulk upload complete — ${summary || "no changes"}.`);

      if (errors.length > 0) {
        // Show first few row-level errors as individual warnings
        errors.slice(0, 5).forEach((msg) => toast.warning(msg));
        if (errors.length > 5) {
          toast.warning(`…and ${errors.length - 5} more row errors.`);
        }
      }

      router.refresh();
    });
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </>
        )}
      </Button>
    </>
  );
}
