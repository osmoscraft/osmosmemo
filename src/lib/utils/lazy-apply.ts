export type Callable<T extends any[], K> = (...args: T) => K;

/**
 * Given an array of functions, call them one by one
 * with the provides array of arguments, until a truthy value is returned.
 * Truthy value is any value/object that is not one of `undefined`, `null`, `0`, `""`, `false`
 * @returns the first truthy return value from the function(s) called.
 */
export function lazyApply<ArgsType extends any[], ReturnType>(
  fnCalls: Callable<ArgsType, any>[],
  args: ArgsType
): ReturnType | undefined {
  for (let fnCall of fnCalls) {
    const returnValue = fnCall.apply(null, args);
    if (returnValue) {
      return returnValue;
    }
  }

  return undefined;
}
