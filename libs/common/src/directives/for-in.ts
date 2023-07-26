import { NgFor } from '@angular/common';
import { Directive, Input, NgIterable, inject } from '@angular/core';
import { throwCommonError } from '../error/common.errors';

export type ForInIterable<T> =
  | NgIterable<T>
  | null
  | undefined
  | object
  | string;

@Directive({
  selector: '[ngxForIn][ngxFor]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgFor,
      inputs: ['ngForTrackBy:ngxForTrackBy', 'ngForTemplate:ngxForTemplate'],
    },
  ],
})
export class ForIn<T> {
  private readonly _ngFor: NgFor<T> = inject(NgFor);

  @Input('ngxForIn')
  public set _ngxForIn(ngxForIn: ForInIterable<T>) {
    // align with this._ngFor.ngForOf
    let iterable: NgIterable<T> | null | undefined = null;

    if (ngxForIn instanceof Map) iterable = [...ngxForIn.keys()];
    else if (ngxForIn instanceof Object)
      iterable = Object.keys(ngxForIn) as NgIterable<T>;
    else if (ngxForIn == null) iterable = ngxForIn;
    else if (typeof ngxForIn === 'string')
      iterable = Object.keys(
        Array.from({ length: ngxForIn.length })
      ) as NgIterable<T>;
    else throwCommonError("Can't iterate over {{}}", ngxForIn);

    this._ngFor.ngForOf = iterable;
  }
}
