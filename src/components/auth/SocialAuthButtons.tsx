import { Button } from '@/components/ui/Button';
import type { OAuthProvider } from '@/types';

interface Props { onSelect: (p: OAuthProvider) => void; disabled?: boolean }

/** Presentational: provider buttons. Replace with official brand logos/guidelines before launch. */
export function SocialAuthButtons({ onSelect, disabled }: Props) {
  return (
    <div className="grid gap-3">
      <Button type="button" variant="secondary" disabled={disabled} onClick={() => onSelect('google')}>
        Continue with Google
      </Button>
      <Button type="button" variant="secondary" disabled={disabled} onClick={() => onSelect('facebook')}>
        Continue with Facebook
      </Button>
    </div>
  );
}
