import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';
import type { Product, CreateProductForm, UpdateProductRequest } from '@/type/product';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  fetchProducts: (page?: number) => Promise<void>;
  createProduct: (data: CreateProductForm) => Promise<boolean>;
  updateProduct: (data: UpdateProductRequest) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
  setCurrentPage: (page: number) => void;
}

export const useProducts = (initialPage: number = 1, pageSize: number = 20): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(
    async (page?: number) => {
      const pageToFetch = page ?? currentPage;
      setLoading(true);
      try {
        const data = await productService.getProducts(pageToFetch, pageSize);
        setProducts(data.data || []);
        setTotal(data.total);
        setTotalPages(data.total_pages);
        // Update currentPage to match the response page if fetching specific page
        if (page !== undefined) {
          setCurrentPage(data.page);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize]
  );

  const createProduct = useCallback(
    async (data: CreateProductForm): Promise<boolean> => {
      try {
        await productService.createProduct(data);
        await fetchProducts(currentPage);
        return true;
      } catch (error) {
        console.error('Error creating product:', error);
        return false;
      }
    },
    [currentPage, fetchProducts]
  );

  const updateProduct = useCallback(
    async (data: UpdateProductRequest): Promise<boolean> => {
      try {
        await productService.updateProduct(data);
        await fetchProducts(currentPage);
        return true;
      } catch (error) {
        console.error('Error updating product:', error);
        return false;
      }
    },
    [currentPage, fetchProducts]
  );

  const deleteProduct = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await productService.deleteProduct(id);
        await fetchProducts(currentPage);
        return true;
      } catch (error) {
        console.error('Error deleting product:', error);
        return false;
      }
    },
    [currentPage, fetchProducts]
  );

  // Fetch products when currentPage or pageSize changes
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts(currentPage, pageSize);
        setProducts(data.data || []);
        setTotal(data.total);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentPage, pageSize]);

  return {
    products,
    loading,
    currentPage,
    totalPages,
    total,
    pageSize,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    setCurrentPage,
  };
};
