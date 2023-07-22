import { MockBuilder, MockRender } from 'ng-mocks';
import { Observable } from 'rxjs';
import { Resized, resized } from './resized';

describe('resized', () => {
  it('should be created', () =>
    expect(resized(document.createElement('div'))).toBeInstanceOf(Observable));

  it('should emit values', () => {
    const target = document.createElement('div');

    const observer = jest.fn();

    const subscription = resized(target).subscribe(observer);

    target.innerHTML = 'some content';
    target.style.width = '500px';

    expect(observer).toHaveBeenCalled();

    subscription.unsubscribe();
  });
});

describe('Resized', () => {
  beforeEach(() => MockBuilder(Resized));

  it('should be created', () => expect(MockRender(Resized)).toBeTruthy());

  it('should emit resized events', () => {
    const resized = jest.fn();

    const fixture = MockRender(Resized, { resized });

    fixture.elementRef.nativeElement.style.width = '500px';

    fixture.detectChanges();

    expect(resized).toHaveBeenCalled();
  });
});
