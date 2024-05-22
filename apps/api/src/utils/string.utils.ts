export function snakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function snakeCaseKeys(keys: string[]): string[] {
  return keys.map(key => snakeCase(key));
}
