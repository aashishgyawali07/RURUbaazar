'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { buttonClasses } from '@/components/ui/button-styles';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useAddProduct } from '@/hooks/useAddProduct';
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '@/lib/validation/product';
import { FileUploadField } from './FileUploadField';

/** Add-product form. Markup only; logic in useAddProduct. */
export function AddProductForm() {
  const p = useAddProduct();

  if (p.createdName) {
    return (
      <div role="status" className="rounded-2xl border border-surface-border bg-white p-10 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-success"><Icon name="check" className="h-7 w-7" /></span>
        <h2 className="mt-4 font-display text-2xl font-bold">“{p.createdName}” added</h2>
        <p className="mt-1 text-sm text-ink-soft">This is a demo: nothing was saved yet.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" onClick={p.reset}>Add another</Button>
          <Link href="/seller/products" className={buttonClasses()}>Back to products</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={p.handleSubmit} noValidate className="space-y-8 rounded-2xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
      <fieldset className="space-y-5">
        <legend className="font-display text-lg font-bold">Details</legend>
        <Input label="Product name" name="name" value={p.values.name} onChange={p.handleChange} error={p.errors.name} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Category" name="category" options={PRODUCT_CATEGORIES} value={p.values.category} onChange={p.handleChange} />
          <Select label="Visibility" name="status" options={PRODUCT_STATUSES} value={p.values.status} onChange={p.handleChange} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Price (NPR)" name="priceNpr" inputMode="numeric" value={p.values.priceNpr} onChange={p.handleChange} error={p.errors.priceNpr} />
          <Input label="Stock quantity" name="stock" inputMode="numeric" value={p.values.stock} onChange={p.handleChange} error={p.errors.stock} />
        </div>
        <Textarea label="Description" name="description" value={p.values.description} onChange={p.handleChange} error={p.errors.description} />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-display text-lg font-bold">Photo</legend>
        <FileUploadField label="Main product image" file={p.image} error={p.errors.image} onChange={p.handleImage} />
      </fieldset>

      {p.errors.form && <p role="alert" className="text-sm text-danger">{p.errors.form}</p>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" loading={p.submitting}>Save product</Button>
        <Link href="/seller/products" className={buttonClasses({ variant: 'secondary', size: 'lg' })}>Cancel</Link>
      </div>
    </form>
  );
}
