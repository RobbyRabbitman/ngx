import { TestBed } from '@angular/core/testing';
import { StateToken, Store, TypedSelector } from '@ngxs/store';
import { BehaviorSubject, first, firstValueFrom } from 'rxjs';
import { MockSelectors, MockStore } from './mock-store';
import { ORIGINAL_STORE } from './original-store';

describe('MockSelectors', () => {
  let selectors: MockSelectors;

  beforeEach(() => (selectors = new MockSelectors()));

  it('should be idempotent', () => {
    const a = new StateToken<unknown>('a');

    const b = new StateToken<unknown>('b');

    expect(selectors.get(a)).toBe(selectors.get(a));

    expect(selectors.get(b)).toBe(selectors.get(b));

    expect(selectors.get(a)).not.toBe(selectors.get(b));
  });

  it("should throw an error when a selector can't be mocked", () => {
    const a = 42;

    expect(() =>
      selectors.get(a as unknown as TypedSelector<unknown>)
    ).toThrowError("NGXS Testing: The selector 42 can't be mocked :(");
  });
});

describe('MockStore', () => {
  let mockStore: MockStore;
  let mockSelectors: MockSelectors;
  let proxiedStore: Store;
  let proxiedStoreState$: BehaviorSubject<{ origin: 'proxy'; value: number }>;

  beforeEach(() => {
    proxiedStoreState$ = new BehaviorSubject({ origin: 'proxy', value: 42 });

    return TestBed.configureTestingModule({
      providers: [
        MockSelectors,
        MockStore,
        {
          provide: ORIGINAL_STORE,
          useValue: {
            reset: jest.fn(),
            dispatch: jest.fn(),
            snapshot: jest.fn(),
            subscribe: jest.fn(),
            select: jest.fn().mockImplementation(() => proxiedStoreState$),
            selectOnce: jest
              .fn()
              .mockImplementation(() => proxiedStoreState$.pipe(first())),
            selectSnapshot: jest
              .fn()
              .mockImplementation(() => proxiedStoreState$.value),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    mockStore = TestBed.inject(MockStore);

    mockSelectors = TestBed.inject(MockSelectors);

    proxiedStore = TestBed.inject(ORIGINAL_STORE);
  });

  it('should forward select and switch to the mock selectors value when it was set', async () => {
    const selector = new StateToken<unknown>('');

    const value$ = mockStore.select(selector);

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'proxy',
      value: 42,
    });

    proxiedStoreState$.next({
      origin: 'proxy',
      value: -1,
    });

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'proxy',
      value: -1,
    });

    const mockSelector = mockSelectors.get(selector);

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'proxy',
      value: -1,
    });

    mockSelector.set({
      origin: 'mock',
      value: 42,
    });

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'mock',
      value: 42,
    });

    mockSelector.set({
      origin: 'mock',
      value: -1,
    });

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'mock',
      value: -1,
    });
  });

  it('should forward selectOnce when the mock selectors value was not set else return the value of the mock selector', async () => {
    const selector = new StateToken<unknown>('');

    const value$ = mockStore.selectOnce(selector);

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'proxy',
      value: 42,
    });

    proxiedStoreState$.next({
      origin: 'proxy',
      value: -1,
    });

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'proxy',
      value: -1,
    });

    const mockSelector = mockSelectors.get(selector);

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'proxy',
      value: -1,
    });

    mockSelector.set({
      origin: 'mock',
      value: 42,
    });

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'mock',
      value: 42,
    });

    mockSelector.set({
      origin: 'mock',
      value: -1,
    });

    expect(await firstValueFrom(value$)).toEqual({
      origin: 'mock',
      value: -1,
    });
  });

  it('should forward selectSnapshot when the mock selectors value was not set else return the value of the mock selector', async () => {
    const selector = new StateToken<unknown>('');

    expect(mockStore.selectSnapshot(selector)).toEqual({
      origin: 'proxy',
      value: 42,
    });

    proxiedStoreState$.next({
      origin: 'proxy',
      value: -1,
    });

    expect(mockStore.selectSnapshot(selector)).toEqual({
      origin: 'proxy',
      value: -1,
    });

    const mockSelector = mockSelectors.get(selector);

    expect(mockStore.selectSnapshot(selector)).toEqual({
      origin: 'proxy',
      value: -1,
    });

    mockSelector.set({
      origin: 'mock',
      value: 42,
    });

    expect(mockStore.selectSnapshot(selector)).toEqual({
      origin: 'mock',
      value: 42,
    });

    mockSelector.set({
      origin: 'mock',
      value: -1,
    });

    expect(mockStore.selectSnapshot(selector)).toEqual({
      origin: 'mock',
      value: -1,
    });
  });

  it('should forward reset', () => {
    const state = 42;
    mockStore.reset(state);
    expect(proxiedStore.reset).toHaveBeenCalledWith(state);
  });

  it('should forward snapshot', () => {
    mockStore.snapshot();
    expect(proxiedStore.snapshot).toHaveBeenCalled();
  });

  it('should forward dispatch', () => {
    mockStore.dispatch({ type: 'foo' });
    expect(proxiedStore.dispatch).toHaveBeenCalledWith({ type: 'foo' });
  });

  it('should forward subscribe', () => {
    const fn = () => undefined;
    mockStore.subscribe(fn);
    expect(proxiedStore.subscribe).toHaveBeenCalledWith(fn);
  });
});
