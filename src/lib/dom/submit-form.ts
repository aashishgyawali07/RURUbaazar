/**
 * Builds a hidden <form> and POSTs it (top-level navigation).
 * Needed for eSewa, whose ePay v2 endpoint accepts a form POST rather than a redirect URL.
 * Client-only (touches `document`).
 */
export function submitHiddenForm(action: string, fields: Record<string, string>): void {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;
  form.style.display = 'none';
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
