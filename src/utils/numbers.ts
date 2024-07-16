/**
 * Converts a number to its Roman numeral representation.
 * @param num - The number to convert (must be a positive integer between 1 and 3999).
 * @returns The Roman numeral representation as a string.
 * @throws Error if the input is not a positive integer between 1 and 3999.
 */
export function numberToRoman(num: number): string {
  if (num < 1 || num > 3999 || !Number.isInteger(num)) {
    throw new Error("Input must be a positive integer between 1 and 3999");
  }

  const romanNumerals: [number, string][] = [
    [1000, "m"],
    [900, "cm"],
    [500, "d"],
    [400, "cd"],
    [100, "c"],
    [90, "xc"],
    [50, "l"],
    [40, "xl"],
    [10, "x"],
    [9, "ix"],
    [5, "v"],
    [4, "iv"],
    [1, "i"],
  ];

  let result = "";
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }

  return result;
}

/**
 * Converts a number to its alphabetic representation (a, b, c, ..., z, aa, ab, ...).
 * @param num - The number to convert (must be a positive integer).
 * @returns The alphabetic representation as a string.
 * @throws Error if the input is not a positive integer.
 */
export function numberToAlpha(num: number): string {
  if (num < 1 || !Number.isInteger(num)) {
    throw new Error("Input must be a positive integer");
  }

  let result = "";
  while (num > 0) {
    num--;
    result = String.fromCharCode(97 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }

  return result;
}
