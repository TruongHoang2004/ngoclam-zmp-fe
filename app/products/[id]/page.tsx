"use client";
import ProductDetailPage from "@/components/product/ProductDetailPage";
import { useParams } from "next/navigation";

export default function Home() {
    const params = useParams();
    const productId = params?.id;

    return (
        <ProductDetailPage id={Number(productId)} />
    );
}
