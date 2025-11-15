import React from "react";
// Nhập các component Card từ shadcn/ui
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"; // Đường dẫn mặc định của shadcn

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen p-12 bg-slate-50 text-slate-900 font-sans box-border">
            {/* Phần Header vẫn giữ nguyên vì nó đã được style tốt với Tailwind */}
            <header className="max-w-3xl mx-auto mb-8 text-center">
                <h1 className="m-0 text-2xl font-extrabold">Ngoc Lam shop managerment</h1>
                <p className="mt-2 text-sm text-slate-500 mb-0">Choose a section to manage</p>
            </header>

            <main className="max-w-3xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2">
                {/* Bọc component <Card> trong thẻ <a> để biến toàn bộ thẻ thành một liên kết.
                  Loại bỏ các class styling khỏi thẻ <a> và để <Card> xử lý.
                */}
                <a
                    href="/images" // (Tôi đã sửa lỗi chính tả từ "inages" -> "images")
                    aria-label="Go to Images"
                    className="no-underline" // Xóa gạch chân mặc định của link
                >
                    <Card className="hover:shadow-md transform transition hover:-translate-y-1">
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                            <CardDescription>View and manage product images</CardDescription>
                        </CardHeader>
                    </Card>
                </a>

                <a
                    href="/products"
                    aria-label="Go to Products"
                    className="no-underline"
                >
                    <Card className="hover:shadow-md transform transition hover:-translate-y-1">
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                            <CardDescription>View and manage products</CardDescription>
                        </CardHeader>
                    </Card>
                </a>
            </main>
        </div>
    );
};

export default HomePage;