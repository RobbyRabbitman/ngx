import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';
import { IconSprite, IconSprites, SvgIcon } from './svg-icon.directive';

describe('SvgIcon', () => {
  beforeEach(() => MockBuilder(SvgIcon));

  it('should create an instance', () =>
    expect(MockRender(SvgIcon).point.componentInstance).toBeTruthy());

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
    let icon: SvgIcon;
    let sprite: IconSprite;

    beforeEach(() => {
      svg = document.createElement('svg') as unknown as SVGElement;

      sprite = {
        classes: (icon) => ['some-sprite-class', `${icon}-class`],
        name: 'some-sprite',
        path: (icon) => `some/path/${icon}`,
      };

      icon = MockRender(SvgIcon).point.componentInstance;
    });

    it('should clear the child nodes of the svg', () => {
      const div = document.createElement('div');
      svg.appendChild(div);

      expect(svg.childElementCount).toEqual(1);
      expect(svg.firstChild).toBe(div);

      icon._render(svg, undefined, undefined);

      expect(svg.childElementCount).toEqual(0);
    });

    it('should remove old classes if they were present', () => {
      svg.classList.add('some-class-which-should-not-be-removed');

      expect(svg.classList.value).toEqual(
        'some-class-which-should-not-be-removed'
      );

      icon._render(svg, 'some-icon', sprite);

      expect(svg.classList.value).toEqual(
        'some-class-which-should-not-be-removed some-sprite-class some-icon-class'
      );
    });

    it('should append a new child node referencing the new icon of the new sprite if they are present', () => {
      icon._render(svg, 'some-icon', sprite);

      expect(svg.classList.value).toEqual('some-sprite-class some-icon-class');

      expect(svg.innerHTML).toEqual(`<use href="some/path/some-icon"></use>`);
    });
  });
});
