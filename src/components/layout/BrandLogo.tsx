import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/site-config';

interface Props {
  /** Tailwind height classes; width follows the logo's aspect ratio. */
  className?: string;
  /** Pass null to render the bare image (no link). */
  href?: string | null;
  priority?: boolean;
}

/** The RURUbaazar wordmark from /public/RURUbaazar.png. */
export function BrandLogo({ className = 'h-7 sm:h-8', href = '/', priority = false }: Props) {
  const img = (
    <Image src={SITE.logo.src} alt={SITE.name} width={SITE.logo.width} height={SITE.logo.height}
           priority={priority} className={`w-auto ${className}`} />
  );
  if (href === null) return img;
  return <Link href={href} aria-label={`${SITE.name} home`} className="inline-flex shrink-0 items-center">{img}</Link>;
}
