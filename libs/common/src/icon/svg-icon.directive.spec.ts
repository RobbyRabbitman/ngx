import { Injector, inject, runInInjectionContext } from '@angular/core';
import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';
import {
  MockResizeObserver,
  setupMockResizeObserver,
} from '../util/resize-observer.mock.spec';
import {
  IconSprite,
  IconSprites,
  SvgIcon,
  provideIconSprites,
} from './svg-icon.directive';

describe('SvgIcon', () => {
  beforeEach(() => MockBuilder(SvgIcon));

  setupMockResizeObserver();

  it('should create an instance', () =>
    expect(MockRender(SvgIcon).point.componentInstance).toBeTruthy());

  it('sprites should be registrable via DI', () => {
    const sprites = [
      {
        name: 'foo',
        path: (icon) => `path/to/foo/sprite#${icon}`,
      },
      {
        name: 'bar',
        path: (icon) => `path/to/bar/sprite#${icon}`,
      },
    ] as IconSprite[];
    runInInjectionContext(
      Injector.create({
        providers: [
          {
            provide: IconSprites,
            useValue: { register: jest.fn() },
          },
          provideIconSprites(...sprites),
        ],
      }),
      () =>
        sprites.forEach((sprite, i) =>
          expect(inject(IconSprites).register).toHaveBeenNthCalledWith(
            i + 1,
            sprite
          )
        )
    );
  });

  describe('after icon and sprite have been set should', () => {
    let fixture: MockedComponentFixture;

    let params: {
      icon: string | undefined;
      sprite: string | undefined;
    };

    let svg: SVGElement;

    const expectRenderedIcon = () => {
      expect(svg.classList.value).toEqual('some-sprite-class some-icon-class');
      expect(ngMocks.formatHtml(fixture.point)).toEqual(
        `<use href="some/path/some-icon"></use>`
      );
    };

    beforeEach(() => {
      params = {
        icon: undefined as string | undefined,
        sprite: undefined as string | undefined,
      };

      fixture = MockRender(
        `<svg [ngxSvgIcon]="icon" [sprite]="sprite"></svg>`,
        params
      );

      svg = fixture.point.nativeElement;

      ngMocks.get(IconSprites).register({
        classes: (icon) => ['some-sprite-class', `${icon}-class`],
        name: 'some-sprite',
        path: (icon) => `some/path/${icon}`,
      });

      ngMocks.get(IconSprites).register({
        classes: (icon) => ['some-other-sprite-class', `${icon}-other-class`],
        name: 'some-other-sprite',
        path: (icon) => `some/other/path/${icon}`,
      });

      params.icon = 'some-icon';
      params.sprite = 'some-sprite';

      fixture.detectChanges();
    });

    beforeEach(() => expectRenderedIcon());

    it('render an icon', () => expectRenderedIcon());

    it('rerender after icon has changed', () => {
      params.icon = 'some-other-icon';

      fixture.detectChanges();

      expect(svg.classList.value).toEqual(
        'some-sprite-class some-other-icon-class'
      );
      expect(ngMocks.formatHtml(fixture.point)).toEqual(
        `<use href="some/path/some-other-icon"></use>`
      );
    });

    it('rerender after sprite has changed', () => {
      params.sprite = 'some-other-sprite';

      fixture.detectChanges();

      expect(svg.classList.value).toEqual(
        'some-other-sprite-class some-icon-other-class'
      );
      expect(ngMocks.formatHtml(fixture.point)).toEqual(
        `<use href="some/other/path/some-icon"></use>`
      );
    });

    it('rerender after icon and sprite has changed', () => {
      params.icon = 'some-other-icon';
      params.sprite = 'some-other-sprite';

      fixture.detectChanges();

      expect(svg.classList.value).toEqual(
        'some-other-sprite-class some-other-icon-other-class'
      );
      expect(ngMocks.formatHtml(fixture.point)).toEqual(
        `<use href="some/other/path/some-other-icon"></use>`
      );
    });
  });

  describe('when handling a change', () => {
    let svg: SVGElement;
    let render: (
      element: SVGElement,
      icon?: string,
      sprite?: IconSprite
    ) => void;
    let sprite: IconSprite;

    beforeEach(() => {
      svg = document.createElement('svg') as unknown as SVGElement;

      sprite = {
        classes: (icon) => ['some-sprite-class', `${icon}-class`],
        name: 'some-sprite',
        path: (icon) => `some/path/${icon}`,
      };

      render = (
        MockRender(SvgIcon).point.componentInstance as unknown as {
          _render: (
            element: SVGElement,
            icon?: string,
            sprite?: IconSprite
          ) => void;
        }
      )._render;
    });

    it('should clear the child nodes of the svg', () => {
      const div = document.createElement('div');
      svg.appendChild(div);

      expect(svg.childElementCount).toEqual(1);
      expect(svg.firstChild).toBe(div);

      render(svg, undefined, undefined);

      expect(svg.childElementCount).toEqual(0);
    });

    it('should remove old classes if they were present', () => {
      svg.classList.add('some-class-which-should-not-be-removed');

      expect(svg.classList.value).toEqual(
        'some-class-which-should-not-be-removed'
      );

      render(svg, 'some-icon', sprite);

      expect(svg.classList.value).toEqual(
        'some-class-which-should-not-be-removed some-sprite-class some-icon-class'
      );
    });

    it('should append a new child node referencing the new icon of the new sprite if they are present', () => {
      render(svg, 'some-icon', sprite);

      expect(svg.classList.value).toEqual('some-sprite-class some-icon-class');

      expect(svg.innerHTML).toEqual(`<use href="some/path/some-icon"></use>`);
    });

    it('should crop the svg relative to its viewBox', () => {
      render(svg, 'some-icon', sprite);

      MockResizeObserver.latest().emit({
        contentRect: { width: 350, height: 150 } as DOMRectReadOnly,
      });

      MockResizeObserver.latest().emit({
        contentRect: { width: 42, height: 42 } as DOMRectReadOnly,
      });

      expect(svg.getAttribute('viewBox')).toEqual('0 0 42 42');
    });
  });
});
