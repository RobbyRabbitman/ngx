import { signal } from '@angular/core';

/**
 * Read-only signal which is undefined.
 */
export const EMPTY = signal(undefined).asReadonly();
