import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActionType,
  getSelectorMetadata,
  StateToken,
  Store,
} from '@ngxs/store';
import { SelectorFunc, TypedSelector } from '@ngxs/store/src/selectors';
import { concat } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MockSelector } from './mock-selector';
import { throwNgxsTestingError } from './ngxs-testing-errors';
import { ORIGINAL_STORE } from './original-store';

/**
 * Represents mocked selectors, which can be retrieved after they have been created.
 */
@Injectable()
export class MockSelectors {
  /**
   * A map of the mocked selectors.
   *
   * @ignore
   */
  private readonly _selectors = new Map<unknown, MockSelector<unknown>>();

  /**
   *
   * @param selector
   * @returns the mocked selector of the orignal selector. Returns the same instance for the same selector: get(a) = a' = b' = get(b) => a' = b' and a = b
   */
  public get<T>(selector: TypedSelector<T>) {
    const meta = getSelectorMetadata(selector);
    const key =
      meta.selectorName ??
      meta.originalFn?.toString() ??
      (selector instanceof StateToken ? selector : undefined);
    if (key == null)
      throwNgxsTestingError("The selector {{}} can't be mocked :(", selector);
    if (!this._selectors.has(key)) this._selectors.set(key, new MockSelector());
    return this._selectors.get(key) as MockSelector<T>;
  }
}

/**
 * Proxies {@link @ngxs/store#Store}.
 * When selecting it delegates to a mock selector, which replaces the original selector's value as soon as the value of the mock selector was set, otherwise the original value.
 */
@Injectable()
export class MockStore implements Required<Store> {
  /**
   * Reference to the mocked selectors.
   *
   * @ignore
   */
  private readonly _mockSelectors = inject(MockSelectors);

  /**
   * Reference to the original store.
   *
   * @ignore
   */
  private readonly _store = inject(ORIGINAL_STORE);

  public dispatch = (actionOrActions: ActionType | ActionType[]) =>
    this._store.dispatch(actionOrActions);

  public select = <T>(selector: unknown) =>
    concat(
      this._store
        .select(selector as SelectorFunc<T>)
        .pipe(
          takeUntil(
            toObservable(
              this._mockSelectors.get(selector as TypedSelector<T>).isSet
            ).pipe(filter(Boolean))
          )
        ),
      toObservable(this._mockSelectors.get(selector as TypedSelector<T>).value)
    );

  public selectOnce = <T>(selector: unknown) =>
    concat(
      this._store
        .selectOnce(selector as SelectorFunc<T>)
        .pipe(
          takeUntil(
            toObservable(
              this._mockSelectors.get(selector as TypedSelector<T>).isSet
            ).pipe(filter(Boolean))
          )
        ),
      toObservable(this._mockSelectors.get(selector as TypedSelector<T>).value)
    );

  public selectSnapshot = <T>(selector: unknown) =>
    this._mockSelectors.get(selector as TypedSelector<T>).isSet()
      ? this._mockSelectors.get(selector as TypedSelector<T>).value()
      : this._store.selectSnapshot(selector as SelectorFunc<T>);

  public subscribe = (fn?: (value: unknown) => void) =>
    this._store.subscribe(fn);

  public snapshot = () => this._store.snapshot();

  public reset = (state: unknown) => this._store.reset(state);
}
