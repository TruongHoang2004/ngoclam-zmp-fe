"use client";

import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import type { Product, CreateProductForm, UpdateProductRequest } from '@/type/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductDialog from '@/components/product/ProductDialog';
import ProductCard from '@/components/product/ProductCard';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProductManager: React.FC = () => {
  const router = useRouter();
  const {
    products,
    loading,
    total,
    createProduct,
    updateProduct,
    deleteProduct,
    setCurrentPage,
    currentPage,
    pageSize,
    totalPages,
  } = useProducts(1, 20);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modal handlers
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Form handlers
  const handleCreateProduct = async (data: CreateProductForm | UpdateProductRequest) => {
    return await createProduct(data as CreateProductForm);
  };

  const handleUpdateProduct = async (data: CreateProductForm | UpdateProductRequest) => {
    return await updateProduct(data as UpdateProductRequest);
  };

  const handleDeleteProduct = async (id: number) => {
    const success = await deleteProduct(id);
    if (success) {
      toast.success('Product deleted successfully');
    } else {
      toast.error('Failed to delete product');
    }
  };

  const handleRowClick = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
            <p className="text-muted-foreground mt-1">Manage your shop products</p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus size={20} />
            Add Product
          </Button>
        </div>

        {/* Stats */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
                <p className="text-3xl font-bold text-foreground mt-2">{total}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Products Grid */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button onClick={openCreateModal}>
                  <Plus size={20} />
                  Create First Product
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="relative group">
                      <ProductCard
                        product={product}
                        onClick={() => handleRowClick(product)}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(product);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePaginationChange(currentPage - 1)}
                              className="cursor-pointer"
                            />
                          </PaginationItem>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => handlePaginationChange(page)}
                                  isActive={page === currentPage}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          return null;
                        })}

                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePaginationChange(currentPage + 1)}
                              className="cursor-pointer"
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Dialog */}
      <ProductDialog
        open={showModal}
        onOpenChange={setShowModal}
        mode={modalMode}
        product={selectedProduct}
        onSubmit={modalMode === 'create' ? handleCreateProduct : handleUpdateProduct}
      />
    </div>
  );
};

export default ProductManager;