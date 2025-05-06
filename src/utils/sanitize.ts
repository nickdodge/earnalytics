// Utility to sanitize input by stripping HTML tags
export function sanitizeInput(input: string): string {
  // Remove all HTML tags
  return input.replace(/<[^>]*>?/gm, '');
} 