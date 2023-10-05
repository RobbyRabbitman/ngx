import { signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { ifNonNull } from './if-non-null';

interface IfNonNullArgs<S = unknown> {
  source: S;
}

const meta = {
  title: 'Common/Signals/If Non Null',
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
    }),
    applicationConfig({ providers: [provideAnimations()] }),
  ],
  render: (args) => ({
    props: (() => {
      const source$ = signal(args.source);
      const then$ = (value: unknown) => signal(`then branch: ${value}`);
      const else$ = signal('else branch');

      return {
        source$,
        then$,
        else$,
        computed$: ifNonNull(source$, then$, else$),
      };
    })(),
    template: `
    <div style="display:flex; flex-direction: column; gap: 1rem; align-items: start">

      <mat-form-field>
        <mat-label *ngIf="!source$()">Type something :)</mat-label>
        <input (input)="source$.set($event.target.value)" [value]="source$()" matInput />
      </mat-form-field>

      <button mat-raised-button color="primary" (click)="source$.set(null)">Set source to null</button>

      <span>Computed: {{ computed$() }}</span>

    </div>
    `,
  }),
  args: {
    source: '42',
  },
} satisfies Meta<IfNonNullArgs>;

export default meta;

export const Basic = {} satisfies StoryObj<IfNonNullArgs>;
