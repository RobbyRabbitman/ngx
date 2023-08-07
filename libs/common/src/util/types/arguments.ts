export type Arguments<F> = F extends (...args: infer A) => any ? A : never;
