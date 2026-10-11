/** Display formatting only. Never use formatted strings for calculations. */
export function formatNpr(amount: number): string {
  return `NPR ${amount.toLocaleString('en-NP')}`;
}
