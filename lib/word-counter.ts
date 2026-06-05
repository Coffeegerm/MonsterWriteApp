/**
 * Counts words in a string, handling all whitespace edge cases.
 * Returns 0 for empty or whitespace-only input.
 */
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}
