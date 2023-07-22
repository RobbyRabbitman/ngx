import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

/**
 *
 * @param element
 * @returns an observable based on a {@link ResizeObserver} observing the specified element.
 *
 */
export const resized = <E extends Element>(element: E) =>
  new Observable<ResizeObserverEntry>((subscriber) => {
    const observer = new ResizeObserver((entries) =>
      subscriber.next(entries.at(0))
    );
    observer.observe(element);
    return () => observer.disconnect();
  });

/**
 * Attaches a {@link ResizeObserver}.
 *
 * @see {@link Resized.resized$}
 */
@Directive({
  selector: '[ngxResized]',
  standalone: true,
})
export class Resized {
  /**
   * Emits according to a {@link ResizeObserver} observing this host.
   */
  @Output('ngxResized')
  public readonly resized$ = (() => {
    const cdr = inject(ChangeDetectorRef);
    const resized$ = new EventEmitter<ResizeObserverEntry>();

    resized(inject(ElementRef).nativeElement)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (entry) => {
          resized$.emit(entry);
          cdr.detectChanges();
        },
      });

    return resized$;
  })();
}
