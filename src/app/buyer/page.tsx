import { BuyerDashboardShell } from '@/components/buyer/BuyerDashboardShell';
import { getAllProducts, getMostPurchased } from '@/services/product.service';

// Server Component: fetch on the server, pass plain props to the UI shell.
export default async function BuyerHomePage() {
  const [all, top] = await Promise.all([getAllProducts(), getMostPurchased(4)]);
  return <BuyerDashboardShell mostPurchased={top.ok ? top.data : []} products={all.ok ? all.data : []} />;
}
