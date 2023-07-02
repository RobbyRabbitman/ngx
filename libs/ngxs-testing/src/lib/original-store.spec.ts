import { ORIGINAL_STORE } from './original-store';

describe('ORIGINAL_STORE', () => {
  it("should be named 'NGXS Original Store'", () =>
    expect(ORIGINAL_STORE.toString()).toEqual(
      'InjectionToken NGXS Original Store'
    ));
});
