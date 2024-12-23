// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ofNullable<T, C extends new (value: T) => any>(
  value: T | null,
  constructor: C,
): InstanceType<C> | null {
  return value ? new constructor(value) : null;
}
