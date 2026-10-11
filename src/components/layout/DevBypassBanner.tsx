/** Visible reminder that route protection is off. Rendered only while the bypass is active. */
export function DevBypassBanner() {
  return (
    <div role="status" className="bg-warning px-4 py-1.5 text-center text-xs font-medium text-white">
      Dev mode: authentication bypass is ON. Pages are not protected.
    </div>
  );
}
