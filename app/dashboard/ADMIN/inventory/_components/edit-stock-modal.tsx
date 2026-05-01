"use client"

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Inventory, Product } from "@/app/generated/prisma/client";

interface EditStockModalProps {
    item: Inventory & { product: Product };
    open: boolean;
    onClose: () => void;
}

export function EditStockModal({ item, open, onClose }: EditStockModalProps) {
    const router = useRouter();
    const [quantityOnHand, setQuantityOnHand] = useState(String(item.quantityOnHand));
    const [reorderLevel, setReorderLevel] = useState(String(item.reorderLevel));
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await axios.patch(`/api/inventory/${item.id}`, {
                quantityOnHand,
                reorderLevel,
            });
            toast.success(`${item.product.name} stock updated`);
            router.refresh();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.error ?? "Failed to update stock");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Update Stock — {item.product.name}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-1.5">
                        <Label htmlFor="qty">Current Stock (Qty on Hand)</Label>
                        <Input
                            id="qty"
                            type="number"
                            min={0}
                            value={quantityOnHand}
                            onChange={(e) => setQuantityOnHand(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="reorder">Reorder Level</Label>
                        <Input
                            id="reorder"
                            type="number"
                            min={0}
                            value={reorderLevel}
                            onChange={(e) => setReorderLevel(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
