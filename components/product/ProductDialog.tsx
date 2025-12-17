"use client";

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import type { Product, CreateProductForm, UpdateProductRequest, CreateProductVariant } from '@/type/product';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryService } from '@/services/categoryService';
import { Category } from '@/type/category';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  product?: Product | null;
  onSubmit: (data: CreateProductForm | UpdateProductRequest) => Promise<boolean>;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onOpenChange,
  mode,
  product,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateProductForm>({
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    variants: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.listCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category_id: 0,
        variants: [],
      });
    } else {
      resetForm();
    }
  }, [mode, product, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category_id: 0,
      variants: [],
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.price <= 0) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        const success = await onSubmit(formData);
        if (success) {
          toast.success('Product created successfully');
          onOpenChange(false);
          resetForm();
        } else {
          toast.error('Failed to create product');
        }
      } else {
        const updateData: UpdateProductRequest = {
          id: product!.id,
          name: formData.name || undefined,
          description: formData.description || undefined,
          price: formData.price || undefined,
        };
        const success = await onSubmit(updateData);
        if (success) {
          toast.success('Product updated successfully');
          onOpenChange(false);
          resetForm();
        } else {
          toast.error('Failed to update product');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...(formData.variants || []), { name: '', price: 0, stock: 0 }],
    });
  };

  const removeVariant = (index: number) => {
    const newVariants = (formData.variants || []).filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const updateVariant = (index: number, field: keyof CreateProductVariant, value: string | number) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Product' : 'Edit Product'}
          </DialogTitle>
        </DialogHeader>



        <div className="space-y-4 py-4 mx-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Product Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category_id?.toString()}
              onValueChange={(value) => setFormData({ ...formData, category_id: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Enter product description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Price (in VNĐ) *
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              placeholder="Enter price in cents (e.g., 1000 for $10.00)"
            />
          </div>

          {mode === 'create' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Product Variants</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addVariant}
                >
                  <Plus size={16} />
                  Add Variant
                </Button>
              </div>
              {(formData.variants || []).map((variant, index) => (
                <Card key={index} className="relative p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeVariant(index)}
                  >
                    <X size={16} className="text-destructive" />
                  </Button>
                  <div className="space-y-2 pr-8">
                    <Input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      placeholder="Variant name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', parseInt(e.target.value) || 0)}
                        placeholder="Price (cents)"
                      />
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                        placeholder="Stock"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
