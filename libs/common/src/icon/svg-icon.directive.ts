import {
  Directive,
  ENVIRONMENT_INITIALIZER,
  ElementRef,
  Injectable,
  Input,
  Provider,
  effect,
  inject,
  signal,
} from '@angular/core';
import { first, skip } from 'rxjs';
import { resized } from '../util/resized';

/**
 * Represents an icon sprite.
 *
 * @see {@link SvgIcon.sprite}
 * @see {@link IconSprites.register}
 */
export interface IconSprite {
  /**
   * A unique name identifying this sprite.
   */
  name: string;

  /**
   *
   * @param icon
   * @returns a url pointing to the specified icon of this sprite.
   */
  path: (icon: string) => string;

  /**
   *
   * @param icon
   * @returns a list of classes that are applied to the svg icon.
   */
  classes?: (icon: string) => string[];
}

/**
 * This service registers icon sprites, which can be rendered with a {@link SvgIcon}.
 */
@Injectable({ providedIn: 'root' })
export class IconSprites {
  /**
   * <{@link IconSprite.name}, {@link IconSprite}>
   */
  public sprites = new Map<string, IconSprite>();

  /**
   * Registers a sprite. The icons in this sprite will be available by the {@link SvgIcon}.
   *
   * @param sprite
   *
   * @see {@link SvgIcon.sprite}
   */
  public register = (sprite: IconSprite) =>
    this.sprites.set(sprite.name, sprite);

  /**
   *
   * @param name
   * @returns a registered sprite by its name.
   */
  public get = (name: string) => this.sprites.get(name);
}

/**
 *
 * @param sprites
 * @returns an environment provider which registers icon sprites.
 */
export const provideIconSprites = (...sprites: IconSprite[]): Provider => ({
  provide: ENVIRONMENT_INITIALIZER,
  multi: true,
  useFactory: () => {
    const service = inject(IconSprites);
    return () => sprites.forEach((sprite) => service.register(sprite));
  },
});

/**
 * Renders an icon of a registered {@link IconSprite}
 */
@Directive({
  selector: 'svg[ngxSvgIcon]',
  standalone: true,
})
export class SvgIcon {
  /**
   * @ignore
   */
  private readonly _element = inject(ElementRef)
    .nativeElement as SVGGraphicsElement;

  /**
   * @ignore
   */
  private readonly _sprites = inject(IconSprites);

  /**
   * The icon to render of this {@link SvgIcon.sprite}.
   */
  public readonly icon = signal<string | undefined>(undefined);

  /**
   * The name of the sprite of this {@link SvgIcon}.
   *
   * @see {@link IconSprite}
   */
  public readonly sprite = signal<string | undefined>(undefined);

  @Input('ngxSvgIcon')
  public set _icon(icon: string | undefined) {
    this.icon.set(icon);
  }

  @Input('sprite')
  public set _sprite(sprite: string | undefined) {
    this.sprite.set(sprite);
  }

  /**
   * Hanlde icon and sprite changes.
   *
   * @ignore
   */
  private readonly _renderEffect = effect(() => {
    const sprite = this.sprite();
    this._render(
      this._element,
      this.icon(),
      sprite != null ? this._sprites.get(sprite) : undefined
    );
  });

  /**
   * @ignore
   */
  private readonly _render = (() => {
    let classes: string[] = [];
    return (element: SVGElement, icon?: string, sprite?: IconSprite) => {
      // clear child nodes of this svg
      element.replaceChildren();

      // remove old classes
      element.classList.remove(...(classes ?? []));

      // append a new child node referencing the new icon of the new sprite if they are present.
      if (icon != null && sprite != null) {
        const useElement = document.createElementNS(
          element.namespaceURI,
          'use'
        );

        element.appendChild(useElement);

        // add classes if classes function was configured
        if (sprite.classes != null)
          element.classList.add(...(classes = sprite.classes(icon)));

        useElement.setAttribute('href', sprite.path(icon));

        // crop svg
        resized(useElement)
          .pipe(
            // after icon was created => skip first
            skip(1),
            // after icon was rendered => first resize
            first()
          )
          .subscribe({
            next: ({ contentRect }) =>
              this._element.setAttribute(
                'viewBox',
                `0 0 ${contentRect.width} ${contentRect.height}`
              ),
          });
      }
    };
  })();
}
