import { NgFor } from '@angular/common';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { ForIn } from './for-in';

describe('ForInDirective', () => {
  beforeEach(() => MockBuilder(ForIn).keep(NgFor));

  it('should create an instance', () =>
    expect(MockRender(`<ng-template ngxFor></ng-template>`)).toBeTruthy());

  it('should iterate over keys', () => {
    const params = { iterable: { foo: true, bar: true } };

    const fixture = MockRender(
      `<div *ngxFor="let key in iterable">{{ key }}</div>`,
      params
    );

    fixture.detectChanges();

    expect(ngMocks.formatHtml(fixture)).toContain(
      '<div>foo</div><div>bar</div>'
    );
  });

  it('should accept a template', async () => {
    const params = { iterable: { foo: true, bar: true } };

    const fixture = MockRender(
      `<ng-container *ngxFor="let key in iterable; template: tpl">{{ key }}</ng-container>
      <ng-template #tpl let-key><div>{{ key }}</div></ng-template>
      `,
      params
    );

    fixture.detectChanges();

    expect(ngMocks.formatHtml(fixture)).toContain(
      '<div>foo</div><div>bar</div>'
    );
  });
});
