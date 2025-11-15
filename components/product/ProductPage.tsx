"use client";

import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import type { Product, CreateProductForm, UpdateProductRequest } from '@/type/product';
import type { ColumnDef } from '@tanstack/react-table';
import type { BaseTableState } from '@/components/common/BaseTable';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BaseTable from '@/components/common/BaseTable';
import ProductDialog from '@/components/product/ProductDialog';
import { ProductColumn } from './ProductColumn';

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
  } = useProducts(1, 20);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [tableState, setTableState] = useState<BaseTableState>({
    pagination: { pageIndex: 0, pageSize: 20 },
    sorting: [],
    columnFilters: [],
  });

  // Handle table state changes
  const handleTableStateChange = (newState: BaseTableState) => {
    setTableState(newState);
    // Update current page (BaseTable uses 0-based index, our API uses 1-based)
    if (newState.pagination.pageIndex !== tableState.pagination.pageIndex) {
      setCurrentPage(newState.pagination.pageIndex + 1);
    }
  };

  // Define columns

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
    if (!confirm('Are you sure you want to delete this product?')) return;

    const success = await deleteProduct(id);
    if (success) {
      alert('Product deleted successfully');
    } else {
      alert('Failed to delete product');
    }
  };

  const columns = ProductColumn(openEditModal, handleDeleteProduct);

  const handleRowClick = (row: Product) => {
    router.push(`/products/${row.id}`);
  };

  // Sync table state with hook pagination
  React.useEffect(() => {
    setTableState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: currentPage - 1, // Convert 1-based to 0-based
        pageSize: pageSize,
      },
    }));
  }, [currentPage, pageSize]);

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
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                <p className="text-3xl font-bold text-foreground mt-2">{total}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="p-6">
            <BaseTable
              data={products}
              columns={columns}
              count={total}
              isLoading={loading}
              tableState={tableState}
              onTableStateChange={handleTableStateChange}
              onRowClick={handleRowClick}
              showPagination={true}
            />
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