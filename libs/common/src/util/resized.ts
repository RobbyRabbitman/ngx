import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
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
export const resized = (element: Element) =>
  new Observable<ResizeObserverEntry>((subscriber) => {
    const observer = new ResizeObserver((entries) =>
      subscriber.next(entries.at(0))
    );
    observer.observe(element);
    return () => observer.disconnect();
  });

/**
 * Token which represents a stream of resizes.
 */
export const RESIZED = new InjectionToken<Observable<ResizeObserverEntry>>(
  'NGX Resized'
);

/**
 *
 * @returns provides {@link RESIZED} with the element being observed referenced by {@link ElementRef}.
 */
export const provideResized = () => ({
  provide: RESIZED,
  useFactory: () => resized(inject(ElementRef).nativeElement),
});

/**
 * Attaches a {@link ResizeObserver}.
 *
 * @see {@link Resized.resized$}
 */
@Directive({
  selector: '[ngxResized]',
  standalone: true,
  providers: [provideResized()],
})
export class Resized {
  /**
   * Emits according to a {@link ResizeObserver} observing this host.
   */
  @Output('ngxResized')
  public readonly resized$ = (() => {
    const cdr = inject(ChangeDetectorRef);
    const resized$ = new EventEmitter<ResizeObserverEntry>();

    inject(RESIZED)
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
