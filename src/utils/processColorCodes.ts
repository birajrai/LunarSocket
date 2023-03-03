/**
 * In a notification or a console message, messages are glitched when using color codes (`§`).
 * This utility function will add the same amount of spaces for each § the message has
 */
export default function processSpecialCharacters(str: string): string {
  const count = str.split('§').length - 1;
  return str + ' '.repeat(count);
}

export function removeColorCodes(str: string): string {
  return str.replace(/§./g, '');
}
