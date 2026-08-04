// Tiny classNames helper — joins truthy args, no dependency needed.
export function cn(...args) {
  return args.flat().filter(Boolean).join(' ')
}
export default cn
