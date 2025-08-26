/**
 * Formats a Mina address to a shorter format
 * @param address - address to format
 * @returns formatted address
 */
export function formatAddress(address: string) {
  if (!validateMinaAddress(address)) throw new Error("Invalid Mina address");
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Checks the validity of a Mina address
 * @param address - address to check
 * @returns true if the address is valid, false if not
 */
export function validateMinaAddress(address: string): boolean {
  // Check basic conditions
  if (!address || typeof address !== "string") {
    return false;
  }

  // Mina addresses must start with "B62q"
  if (!address.startsWith("B62q")) {
    return false;
  }

  // Mina addresses have a length of 55 characters
  if (address.length !== 55) {
    return false;
  }

  // Check that the address contains only valid base58 symbols
  // Base58 alphabet: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
  // (excluding 0, O, I, l to avoid confusion)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  if (!base58Regex.test(address)) {
    return false;
  }

  return true;
}
