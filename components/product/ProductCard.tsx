import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/type/product";

export interface ProductVariant {
    id: number;
    name?: string;
}


type Props = {
    product: Product;
    onClick?: () => void;
    currency?: string;
};

function getMainImageUrl(product: Product): string | null {
    if (!product?.images?.length) return null;
    const main = product.images.find((i) => i.is_main) ?? product.images[0];
    return main?.image?.url ?? null;
}

export default function ProductCard({
    product,
    onClick,
    currency = "USD",
}: Props) {
    const imageUrl = getMainImageUrl(product);
    const formattedPrice = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(product.price);

    return (
        <Button
            onClick={onClick}
            variant="ghost"
            className="h-auto p-0 w-[260px]"
        >
            <Card className="w-full border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                    <div className="w-full h-40 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center mb-3">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-gray-400 text-sm">No image</div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-sm font-bold text-green-700">
                            {formattedPrice}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Button>
    );
}