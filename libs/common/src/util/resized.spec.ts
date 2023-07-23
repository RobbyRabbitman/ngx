import {
  ElementRef,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { Observable, Subject } from 'rxjs';
import {
  MockResizeObserver,
  setupMockResizeObserver,
} from './resize-observer.mock.spec';
import { RESIZED, Resized, provideResized, resized } from './resized';

describe('resized', () => {
  setupMockResizeObserver();

  it('should be created', () =>
    expect(resized(document.createElement('div'))).toBeInstanceOf(Observable));

  it('should emit when the target was resized', () => {
    const target = document.createElement('div');
    const someOtherElement = document.createElement('span');

    const observer = jest.fn();

    const subscription = resized(target).subscribe(observer);

    const resizeObserver = MockResizeObserver.latest();

    resizeObserver.emit({ target }, { target: someOtherElement });

    expect(observer).toHaveBeenCalledWith({ target });
    expect(observer).not.toHaveBeenCalledWith({ target: someOtherElement });

    subscription.unsubscribe();
  });

  it('should disconnect when the stream completes', () => {
    const subscription = resized(document.createElement('div')).subscribe();

    const resizeObserver = MockResizeObserver.latest();

    jest.spyOn(resizeObserver, 'disconnect');

    subscription.unsubscribe();

    expect(resizeObserver.disconnect).toHaveBeenCalled();
  });
});

describe('Resized', () => {
  const resize = (value: ResizeObserverEntry) =>
    (ngMocks.get(RESIZED) as Subject<ResizeObserverEntry>).next(value);

  beforeEach(() =>
    MockBuilder(Resized).mock(RESIZED, new Subject<ResizeObserverEntry>())
  );

  it('should be created', () => expect(MockRender(Resized)).toBeTruthy());

  it('should emit resized events', () => {
    const resized = jest.fn();

    MockRender(Resized, { ngxResized: resized });

    resize(42 as unknown as ResizeObserverEntry);

    expect(resized).toHaveBeenCalledWith(42);

    resize(1 as unknown as ResizeObserverEntry);

    expect(resized).toHaveBeenCalledWith(1);
  });
});

describe('provideResized', () => {
  it('should provide a resized observable', () =>
    runInInjectionContext(
      Injector.create({
        providers: [
          {
            provide: ElementRef,
            useValue: { nativeElement: document.createElement('div') },
          },
          provideResized(),
        ],
      }),
      () => expect(inject(RESIZED)).toBeInstanceOf(Observable)
    ));
});
