export const NGXS_TESTING_ERRORS = {
  "The selector {{}} can't be mocked :(": (selector: unknown) => [selector],
  'Tried to pop a snapshot but there are no snapshots': () => [],
} as const;

export const buildNgxsTestingMessage = <
  M extends keyof typeof NGXS_TESTING_ERRORS
>(
  message: M,
  ...parameters: Parameters<(typeof NGXS_TESTING_ERRORS)[M]>
) =>
  `NGXS Testing: ${NGXS_TESTING_ERRORS[message](parameters).reduce(
    (populated: string, arg) => populated.replace('{{}}', String(arg)),
    String(message)
  )}`;

export const throwNgxsTestingError = <
  M extends keyof typeof NGXS_TESTING_ERRORS
>(
  message: M,
  ...parameters: Parameters<(typeof NGXS_TESTING_ERRORS)[M]>
) => {
  throw new Error(buildNgxsTestingMessage(message, ...parameters));
};
