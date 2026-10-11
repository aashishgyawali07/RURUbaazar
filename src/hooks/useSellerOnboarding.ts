'use client';
/**
 * BUSINESS LOGIC for the seller registration form.
 * Owns: field state, file state, validation, submit lifecycle.
 * Does NOT own: any markup.
 */
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { submitSellerApplication } from '@/services/seller.service';
import {
  validateFile, validateSeller,
  type SellerErrors, type SellerFileKey, type SellerFiles, type SellerFormValues,
} from '@/lib/validation/seller';

const INITIAL_VALUES: SellerFormValues = { storeName: '', panNumber: '', contactNumber: '', email: '' };
const INITIAL_FILES: SellerFiles = { panImage: null, citizenshipFront: null, citizenshipBack: null };

export function useSellerOnboarding() {
  const [values, setValues] = useState<SellerFormValues>(INITIAL_VALUES);
  const [files, setFiles] = useState<SellerFiles>(INITIAL_FILES);
  const [errors, setErrors] = useState<SellerErrors & { form?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  /** Generic text-field handler: <input name="..."> must match a SellerFormValues key. */
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Digits-only fields are sanitised at the source so bad input never enters state.
    const cleaned = name === 'panNumber' || name === 'contactNumber' ? value.replace(/\D/g, '') : value;
    setValues((prev) => ({ ...prev, [name]: cleaned }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  /** Validates immediately on selection so the user gets feedback before submitting. */
  function handleFile(key: SellerFileKey, file: File | null) {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setErrors((prev) => ({ ...prev, [key]: file ? validateFile(file) : undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validateSeller(values, files);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    const res = await submitSellerApplication(values, files);
    setSubmitting(false);
    if (res.ok) setSubmittedId(res.data.applicationId);
    else setErrors({ form: res.error });
  }

  return { values, files, errors, submitting, submittedId, handleChange, handleFile, handleSubmit };
}
