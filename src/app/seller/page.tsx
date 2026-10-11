import { redirect } from 'next/navigation';

// /seller has no content of its own: send people to the dashboard instead of a 404.
export default function SellerIndexPage() {
  redirect('/seller/dashboard');
}
