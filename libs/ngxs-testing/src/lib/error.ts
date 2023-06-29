export const NGXS_TESTING_ERRORS = {
  'not able to mock selector': (selector: unknown) =>
    `The selector ${selector} can't be mocked :(`,
  'tried to pop a snapshot but there are no snapshots': () => '',
} as const;

export const buildNgxsTestingMessage = <
  M extends keyof typeof NGXS_TESTING_ERRORS
>(
  message: M,
  ...parameters: Parameters<(typeof NGXS_TESTING_ERRORS)[M]>
) => `NGXS Testing: ${NGXS_TESTING_ERRORS[message](parameters)}`;

export const throwNgxsTestingError = <
  M extends keyof typeof NGXS_TESTING_ERRORS
>(
  message: M,
  ...parameters: Parameters<(typeof NGXS_TESTING_ERRORS)[M]>
) => {
  throw new Error(buildNgxsTestingMessage(message, ...parameters));
};
