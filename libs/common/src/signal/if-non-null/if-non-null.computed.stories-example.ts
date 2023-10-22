import { signal } from '@angular/core';
import { ifNonNull } from '@robby-rabbitman/ngx-common';

const source$ = signal<number | undefined>(undefined);

const then$ = signal('then branch');

const else$ = signal('else branch');

const computed$ = ifNonNull(source$, then$, else$);
computed$(); // 'else branch'

else$.set('changed else branch');
computed$(); // 'changed else branch'

source$.set(42);
computed$(); // 'then branch'

then$.set('changed then branch');
computed$(); // 'changed then branch'
