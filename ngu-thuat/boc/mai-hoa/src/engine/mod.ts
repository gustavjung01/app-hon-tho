export function mod1(value: number, divisor: number): number {
  const remainder = value % divisor;
  return remainder === 0 ? divisor : remainder;
}
