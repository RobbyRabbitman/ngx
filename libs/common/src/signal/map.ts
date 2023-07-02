import { OperatorFunction, createOperatorFunction } from './types';

export const map = <I, O>(projector: (value: I) => O): OperatorFunction<I, O> =>
  createOperatorFunction((source) => projector(source()));
