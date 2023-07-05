import { throwNgxsTestingError } from './ngxs-testing-errors';

describe('ngxs-testing-errors', () => {
  it("The selector {{}} can't be mocked :(", () =>
    expect(() =>
      throwNgxsTestingError("The selector {{}} can't be mocked :(", 42)
    ).toThrowError(
      new Error("NGXS Testing: The selector 42 can't be mocked :(")
    ));

  it('Tried to pop a snapshot but there are no snapshots', () =>
    expect(() =>
      throwNgxsTestingError(
        'Tried to pop a snapshot but there are no snapshots'
      )
    ).toThrowError(
      new Error(
        'NGXS Testing: Tried to pop a snapshot but there are no snapshots'
      )
    ));
});
