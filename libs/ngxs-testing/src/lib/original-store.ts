import { InjectionToken } from '@angular/core';
import { Store } from '@ngxs/store';

/**
 * Token which represents the proxied {@link Store}.
 *
 * @see {@link provideNgxsTesting}
 */
export const ORIGINAL_STORE = new InjectionToken<Store>('NGXS Original Store');
