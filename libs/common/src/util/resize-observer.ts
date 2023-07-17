import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';

export const resized = <E extends Element>(element: E) =>
  new Observable<ResizeObserverEntry[]>((subscriber) => {
    const observer = new ResizeObserver((entries) => subscriber.next(entries));
    observer.observe(element);
    return () => observer.disconnect();
  });

@Directive({
  selector: '[ngxResized]',
  standalone: true,
})
export class Resized<E extends Element> {
  private readonly _element: E = inject(ElementRef).nativeElement;

  @Output('resized')
  public readonly resized$ = (() => {
    const resized$ = new EventEmitter<E>();

    resized(this._element)
      .pipe(
        map(() => this._element),
        takeUntilDestroyed()
      )
      .subscribe({ next: (element) => resized$.next(element) });

    return resized$;
  })();
}
