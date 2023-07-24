import { NgFor } from '@angular/common';
import { Directive, Input, NgIterable, inject } from '@angular/core';

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
export class ForIn<T, U extends NgIterable<T> = NgIterable<T>> {
  private readonly _ngFor = inject(NgFor);

  @Input('ngxForIn')
  public set _ngxForIn(ngxForIn: U) {
    this._ngFor.ngForOf = Object.keys(ngxForIn);
  }
}
