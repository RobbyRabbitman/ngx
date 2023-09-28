export const COMMON_ERRORS = {
  "Can't iterate over {{}}": (value: unknown) => [value],
} as const;

export const buildCommonErrorMessage = <M extends keyof typeof COMMON_ERRORS>(
  message: M,
  ...parameters: Parameters<(typeof COMMON_ERRORS)[M]>
) =>
  `NGX Common: ${COMMON_ERRORS[message](parameters).reduce(
    (populated: string, arg) => populated.replace('{{}}', String(arg)),
    String(message)
  )}`;

export const throwCommonError = <M extends keyof typeof COMMON_ERRORS>(
  message: M,
  ...parameters: Parameters<(typeof COMMON_ERRORS)[M]>
) => {
  throw new Error(buildCommonErrorMessage(message, ...parameters));
};
