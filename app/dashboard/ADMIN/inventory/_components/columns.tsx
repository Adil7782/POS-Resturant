"use client"

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Loader2, Trash2, Edit, MoreHorizontal, Ban, Sparkle, Copy } from "lucide-react";
import axios from "axios";

import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table"

import { toast } from 'sonner';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import ConfirmModel from "@/components/models/confirm-model";
import { Inventory, Product } from "@/app/generated/prisma/client";


interface ActionCellProps {
    row: any;
    user?: {
        email: string;
        role: string;
    };
}

const ActionCell = ({ row, user }: ActionCellProps) => {
    // const ActionCell = ({ row }: { row: any }) => {
    const { id } = row.original;


    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);



    const handleCreateActivityLog = async (activity: string) => {
        const payload = {
            part: "OBB Sheet",
            activity,
        }
        console.log("Created activity log: ", activity);

        try {
            await axios.post('/api/activity-log', payload);
        } catch (error: any) {
            console.error("ACTIVITY_LOG_ERROR", error);
        }
    }

    const onDelete = async (obbSheetId: string) => {
        try {
            setIsLoading(true);


            await axios.delete(`/api/obb-sheet/${obbSheetId}`);
            router.refresh();
            toast.success(`${row.original.name} added to cart`);

            toast({
                title: "Successfully removed OBB sheet!",
                variant: 'success',
            });
            // await handleCreateActivityLog(
            //     `Deleted OBB sheet ${row.original.name} by ${realUser?.email ?? "unknown"} (${realUser?.role})`
            // );
        } catch (error: any) {
            console.error("ERROR", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        } finally {
            setIsLoading(false);
        }
    }





    return (
        <div className="flex gap-2">
            <div className="w-full flex justify-between items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                        <Link href={`/obb-sheets/${id}`}>
                            <DropdownMenuItem
                                disabled={isLoading}
                                className="gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />

                        <DropdownMenuSeparator />

                        <DropdownMenuSeparator />
                        <ConfirmModel onConfirm={() => onDelete(id)}>
                            <Button
                                size='sm'
                                disabled={isLoading}
                                variant='destructive'
                                className="w-full gap-2 justify-start"
                            >
                                <Loader2 className={cn("animate-spin w-4 h-4 hidden", isLoading && "flex")} />
                                <Trash2 className={cn("w-4 h-4", isLoading && 'hidden')} />
                                Delete
                            </Button>
                        </ConfirmModel>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className={cn("w-2.5 h-2.5 bg-orange-600 rounded-full", row.original.isActive === true && "w-2 h-2 bg-green-600 animate-ping")} />
            </div>
        </div>
    )
}

export const columns: ColumnDef<Inventory & { product: Product }>[] = [
    {
        accessorKey: "product.name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-5"
                >
                    Name (line-style)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("name");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    {
        accessorKey: "productId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-5"
                >
                    Style
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("style");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    {
        accessorKey: "unit.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-1 flex items-center gap-1 min-w-0"
            >
                Unit <ArrowUpDown className="h-3 w-3" />
            </Button>
        ),
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "productionLine.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-1 flex items-center gap-1 min-w-0"
            >
                Line <ArrowUpDown className="h-3 w-3" />
            </Button>
        ),
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "buyer",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-5"
                >
                    Buyer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("buyer");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    {
        accessorKey: "colour",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-5"
                >
                    Colour
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("colour");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    // {
    //     accessorKey: "name",
    //     header: "Name (line-style)",
    // },
    // {
    //     accessorKey: "style",
    //     header: "Style",
    // },
    // {
    //     accessorKey: "unit.name",
    //     header: "Unit",
    // },
    // {
    //     accessorKey: "productionLine.name",
    //     header: "Line",
    // },
    // {
    //     accessorKey: "buyer",
    //     header: "Buyer",
    // },
    // {
    //     accessorKey: "colour",
    //     header: "Color",
    // },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Last Update
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dateValue: Date = row.getValue("updatedAt");
            const date = new Date(dateValue);



        }
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Action
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <ActionCell row={row} />,
        sortingFn: (rowA, rowB) => {
            const isActiveA = rowA.original.isActive;
            const isActiveB = rowB.original.isActive;
            if (isActiveA === isActiveB) return 0;
            return isActiveA ? 1 : -1;
        },
    },

    // {
    //     id: "actions",
    //     header: "Action",
    //     cell: ({ row }) => <ActionCell row={row} />
    // }
]
