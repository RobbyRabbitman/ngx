import { NgFor, NgForOfContext } from '@angular/common';
import {
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import { throwCommonError } from '../error/common.errors';

/**
 * Types that can be used with the {@link ForIn} directive.
 */
export type ForInTypes<T> =
  | null
  | undefined
  | Map<T, unknown>
  | Set<T>
  | object
  | string;

/**
 * The type of the context of a template the {@link ForIn} directive renders.
 */
export type ForInContext<T> = NgForOfContext<T> & {
  ngxForIn: ForInTypes<T>;
};

/**
 * A structural directive that renders a template for each own enumerable property of an object:
 * ```html
 * <li *ngxFor="let key in someObject">...</li>
 * ```
 *
 * The behavior is familar but **not** the *same* like JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in for...in}, which iterates over each own and inheritet enumerable property of an object.
 * In addition when passing a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map} or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}, it will iterate over the keys, using its keys() method.
 *
 *
 * The context of this directive is the same like the {@link NgFor} provides. For example you can get a reference to the current index:
 *
 * ```html
 * <li *ngxFor="let key in someObject; let index = index">...</li>
 * ```
 *
 * @template T the type of the enumerable properties of the object being iterated over
 *
 * @see {@link ForInTypes}
 * @see {@link NgFor}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in for...in}
 */
@Directive({
  selector: '[ngxForIn][ngxFor]',
  standalone: true,
  hostDirectives: [NgFor],
})
export class ForIn<T> implements DoCheck {
  /**
   * This directive iterates over the enumerable properties of an argument, but its logic is equal to the built in {@link NgFor},
   * therefore it is used as a host directive, so that it can inherit its behavior.
   *
   * @internal
   */
  private readonly _ngFor: NgFor<T> = inject(NgFor);

  private readonly _viewContainerRef = inject(ViewContainerRef);

  private _ngxForIn$ = signal<ForInTypes<T>>(undefined);

  @Input('ngxForIn')
  public set ngxForIn(ngxForIn: ForInTypes<T>) {
    this._ngxForIn$.set(ngxForIn);

    // the iterable, the ngFor will iterate over
    let iterable: typeof this._ngFor.ngForOf = null;

    // Map or Set => pluck keys into an array.
    if (ngxForIn instanceof Map || ngxForIn instanceof Set)
      iterable = [...ngxForIn.keys()];
    // any other Object => use Object.keys
    // NOTE: must be checked after checking a Map or Set, since a Maps and Sets are Objects.
    else if (ngxForIn instanceof Object)
      iterable = Object.keys(ngxForIn) as T[];
    // provide js for...in behavior => [0, 1, ..., n] where n = length of string
    else if (typeof ngxForIn === 'string')
      iterable = Object.keys(Array.from({ length: ngxForIn.length })) as T[];
    // ngFor handles nullish values friendly => delegate (because why should this directive behave differently)
    else if (ngxForIn == null) iterable = ngxForIn;
    // any other case can't be handled => throw error
    else throwCommonError("Can't iterate over {{}}", ngxForIn);

    this._ngFor.ngForOf = iterable;
  }

  public get ngxForIn() {
    return this._ngxForIn$();
  }

  /**
   * @see {@link NgFor.ngForTemplate}
   */
  @Input('ngxForTemplate')
  public set ngxForTemplate(template: TemplateRef<ForInContext<T>>) {
    this._ngFor.ngForTemplate = template;
  }

  public get ngxForTemplate() {
    return this._ngFor.ngForTemplate as TemplateRef<ForInContext<T>>;
  }

  /**
   * @see {@link NgFor.ngForTrackBy}
   */
  @Input('ngxForTrackBy')
  public set ngxForTrackBy(trackBy: TrackByFunction<T>) {
    this._ngFor.ngForTrackBy = trackBy;
  }

  public get ngxForTrackBy() {
    return this._ngFor.ngForTrackBy;
  }

  /**
   * In the {@link NgFor.ngDoCheck} the context of the views are being set, use the ngDoCheck hook of this directive to add the ngxForIn property.
   * This works, since the ngDoCheck of host directives are called before the ngDoCheck of the host.
   *
   * @ignore
   */
  public ngDoCheck(): void {
    for (let index = 0; index < this._viewContainerRef.length; index++)
      Object.assign(
        (
          this._viewContainerRef.get(index) as EmbeddedViewRef<
            NgForOfContext<T>
          >
        ).context,
        { ngxForIn: this._ngxForIn$() } satisfies Pick<
          ForInContext<T>,
          'ngxForIn'
        >
      );
  }

  /**
   * Asserts the correct type for this {@link ngxForTemplate}.
   */
  public static ngTemplateContextGuard = <T>(
    directive: ForIn<T>,
    context: unknown
  ): context is ForInContext<T> => true;
}
