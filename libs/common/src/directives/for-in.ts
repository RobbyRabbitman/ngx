import { NgFor } from '@angular/common';
import { Directive, Input, NgIterable, inject } from '@angular/core';
import { throwCommonError } from '../error/common.errors';

/**
 * Types that can be used with the {@link ForIn} directive.
 */
export type ForInIterable<T> =
  | NgIterable<T>
  | null
  | undefined
  | object
  | string;

/**
 * A structural directive that renders a template for each own enumerable property of an object:
 * ```html
 * <li *ngxFor="let key in someObject">...</li>
 * ```
 *
 * The behavior is familar **BUT** not the *same* like JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in for...in}, which iterates over each own and inheritet enumerable property of an object.
 * In addition when passing a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map} or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}, it will iterate over the keys, using its keys() method.
 *
 *
 * The context of this directive is the same like the {@link NgFor} provides. For example you can get a reference to the current index:
 *
 * ```html
 * <li *ngxFor="let key in someObject; let index = index">...</li>
 * ```
 *
 * @see {@link ForInIterable}
 * @see {@link NgFor}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in for...in}
 */
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
  /**
   * This directive iterates over the 'keys' of an argument, but its logic is equal to the built in {@link NgFor},
   * therefore it is used as a host directive, so that it can inherit its behavior.
   *
   * @internal
   */
  private readonly _ngFor: NgFor<T> = inject(NgFor);

  @Input('ngxForIn')
  public set _ngxForIn(ngxForIn: ForInIterable<T>) {
    // the iterable, the ngFor will iterate over
    let iterable: typeof this._ngFor.ngForOf = null;

    // map or set => pluck keys into an array.
    if (ngxForIn instanceof Map || ngxForIn instanceof Set)
      iterable = [...ngxForIn.keys()];
    // any other object => use Object.keys
    // NOTE: must be checked after checking a Map, since a Map is an Object.
    else if (ngxForIn instanceof Object)
      iterable = Object.keys(ngxForIn) as NgIterable<T>;
    // js for...in of a string iterates over the length => [0, 1, ..., n] where n = length of string
    else if (typeof ngxForIn === 'string')
      iterable = Object.keys(
        Array.from({ length: ngxForIn.length })
      ) as NgIterable<T>;
    // ngFor handles nullish values friendly => delegate (beacuse why should this directive behave differently)
    else if (ngxForIn == null) iterable = ngxForIn;
    // any other case can't be handled => throw error
    else throwCommonError("Can't iterate over {{}}", ngxForIn);

    this._ngFor.ngForOf = iterable;
  }
}
