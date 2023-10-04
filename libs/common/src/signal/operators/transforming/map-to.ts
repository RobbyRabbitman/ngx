import { Signal } from '@angular/core';
import { signalize } from '../../signalize';
import { OperatorFunction } from '../types';
import { map } from './map';

export const mapTo =
  <T, R>(value: R | Signal<R>): OperatorFunction<T, R> =>
  (source) =>
    map(signalize(value))(source);
