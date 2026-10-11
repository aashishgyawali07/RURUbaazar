'use client';
/** BUSINESS LOGIC for the Add Product form. No markup. */
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { createProduct } from '@/services/seller-product.service';
import { validateFile } from '@/lib/validation/seller'; // generic image type/size check, reused
import { PRODUCT_CATEGORIES, validateProduct, type ProductErrors, type ProductFormValues } from '@/lib/validation/product';

const INITIAL: ProductFormValues = { name: '', category: PRODUCT_CATEGORIES[0], priceNpr: '', stock: '', description: '', status: 'Active' };

export function useAddProduct() {
  const [values, setValues] = useState<ProductFormValues>(INITIAL);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<ProductErrors & { form?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [createdName, setCreatedName] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const cleaned = name === 'priceNpr' || name === 'stock' ? value.replace(/\D/g, '') : value; // digits only
    setValues((p) => ({ ...p, [name]: cleaned }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  }

  function handleImage(file: File | null) {
    setImage(file);
    setErrors((p) => ({ ...p, image: file ? validateFile(file) : undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validateProduct(values, image, validateFile);
    setErrors(v);
    if (Object.keys(v).length || !image) return;

    setSubmitting(true);
    const res = await createProduct(values, image);
    setSubmitting(false);
    if (res.ok) setCreatedName(values.name.trim());
    else setErrors({ form: res.error });
  }

  function reset() { setValues(INITIAL); setImage(null); setErrors({}); setCreatedName(null); }

  return { values, image, errors, submitting, createdName, handleChange, handleImage, handleSubmit, reset };
}
