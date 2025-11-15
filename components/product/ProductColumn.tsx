import { Product } from "@/type/product";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../ui/button";

export function ProductColumn(openEditModal: (product: Product) => void, handleDeleteProduct: (id: number) => void) {
    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue('name')}</div>
                ),
            },
            {
                accessorKey: 'description',
                header: 'Description',
                cell: ({ row }) => {
                    const description = row.getValue('description') as string;
                    return (
                        <div className="max-w-xs truncate text-muted-foreground">
                            {description || '-'}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'price',
                header: 'Price',
                cell: ({ row }) => {
                    const price = row.getValue('price') as number;
                    return <div>${(price / 100).toFixed(2)}</div>;
                },
            },
            {
                accessorKey: 'variants',
                header: 'Variants',
                cell: ({ row }) => {
                    const product = row.original;
                    return (
                        <div className="text-muted-foreground">
                            {product.variants?.length || 0}
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => {
                    const product = row.original;
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(product);
                                }}
                            >
                                <Pencil size={18} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProduct(product.id);
                                }}
                            >
                                <Trash2 size={18} className="text-destructive" />
                            </Button>
                        </div>
                    );
                },
            },
        ],
        []
    );
    return columns;
}