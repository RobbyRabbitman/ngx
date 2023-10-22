import { signal } from '@angular/core';
import { ifNonNull } from '@robby-rabbitman/ngx-common';

const source$ = signal<number | undefined>(undefined);

const s1 = signal('s1');
const s2 = signal('s2');

const factory = (x: number) => (x >= 0 ? s1 : s2);

const computed$ = ifNonNull(source$, factory);
computed$(); // undefined

source$.set(0);
computed$(); // 's1'

s1.set('changed s1');
computed$(); // 'changed s1'

source$.set(-1);
computed$(); // 's2'

s2.set('changed s2');
computed$(); // 'changed s2'

s1.set('changed s1 again');
computed$(); // 'changed s2'

source$.set(0);
computed$(); // 'changed s1 again'
