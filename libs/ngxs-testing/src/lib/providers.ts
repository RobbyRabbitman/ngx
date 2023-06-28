import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  inject,
} from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { NgxsConfig } from '@ngxs/store/src/symbols';
import { MockSelectors, MockStore } from './mock-store';
import { ORIGINAL_STORE } from './original-store';
import { NgxsTestingController } from './testing-controller';

/**
 *
 * @param states
 * @param options
 * @param defaultState
 * @returns the nessecary providers for mocking selectors.
 */
export const provideNgxsTesting = <T>(
  states?: StateClass[],
  options?: Partial<NgxsConfig>,
  defaultState?: Partial<T>
) => [
  { provide: Store, useClass: MockStore },
  { provide: ORIGINAL_STORE, useClass: Store },
  MockSelectors,
  NgxsTestingController,
  {
    provide: APP_INITIALIZER,
    useFactory: () => {
      const store = inject(Store);
      return () =>
        store.reset({ ...store.snapshot(), ...(defaultState ?? {}) });
    },
    multi: true,
  },
  ...(NgxsModule.forRoot(states, options).providers?.filter(
    (p) => p !== Store
  ) ?? []),
];

@NgModule()
export class NgxsTestingModule {
  /**
   *
   * @param states
   * @param options
   * @param defaultState
   * @returns this module with the nessecary providers for mocking selectors.
   */
  public static forRoot = <T>(
    states?: StateClass[] | undefined,
    options?: Partial<NgxsConfig> | undefined,
    defaultState?: Partial<T>
  ): ModuleWithProviders<NgxsModule> => ({
    ...NgxsModule.forRoot(states, options),
    providers: provideNgxsTesting(states, options, defaultState),
  });
}
