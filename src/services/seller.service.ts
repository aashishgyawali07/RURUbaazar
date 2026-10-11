/**
 * SELLER SERVICE (backend mockup layer).
 * Real flow: upload 3 images to a PRIVATE Storage bucket ('seller-kyc'), then insert a
 * `seller_applications` row with status 'pending' for admin review.
 *
 * Suggested RLS: sellers may INSERT/SELECT only rows where user_id = auth.uid();
 * the bucket policy must follow the same rule. KYC images must never be public.
 */
import { createClient } from '@/lib/supabase/client';
import type { SellerFiles, SellerFormValues } from '@/lib/validation/seller';
import type { ServiceResult } from '@/types';

// Flip to false once your Supabase project, bucket and table exist.
const USE_MOCK = true;

export async function submitSellerApplication(
  values: SellerFormValues, files: SellerFiles,
): Promise<ServiceResult<{ applicationId: string }>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 900)); // simulate latency
    console.info('[mock] seller application', values, Object.fromEntries(Object.entries(files).map(([k, f]) => [k, f?.name])));
    return { ok: true, data: { applicationId: `mock-${Date.now()}` } };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You must be logged in to apply.' };

  // Upload each document to <user_id>/<key>-<timestamp>.<ext>
  const paths: Record<string, string> = {};
  for (const [key, file] of Object.entries(files)) {
    if (!file) return { ok: false, error: 'Missing document.' };
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${user.id}/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('seller-kyc').upload(path, file, { upsert: false });
    if (error) return { ok: false, error: `Upload failed for ${key}. Please retry.` };
    paths[key] = path;
  }

  const { data, error } = await supabase
    .from('seller_applications')
    .insert({
      user_id: user.id,
      store_name: values.storeName.trim(),
      pan_number: values.panNumber,
      contact_number: values.contactNumber,
      email: values.email,
      pan_image_path: paths.panImage,
      citizenship_front_path: paths.citizenshipFront,
      citizenship_back_path: paths.citizenshipBack,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) return { ok: false, error: 'Could not save your application. Please retry.' };
  return { ok: true, data: { applicationId: data.id } };
}
