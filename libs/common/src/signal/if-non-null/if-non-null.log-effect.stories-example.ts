import { effect, signal } from '@angular/core';
import { ifNonNull } from '@robby-rabbitman/ngx-common';

const source$ = signal<number | undefined>(undefined);

const log = (x: number) => console.log(x);

// a typical effect structure
effect(() => {
  const source = source$();
  if (source != null) log(source);
});

// equivalent to

// written with ifNonNull
effect(ifNonNull(source$, log));

source$.set(42); // output: 42
source$.set(undefined); // nothing happens
