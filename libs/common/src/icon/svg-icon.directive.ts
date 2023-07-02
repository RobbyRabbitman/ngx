import {
  Directive,
  ElementRef,
  Injectable,
  Input,
  effect,
  inject,
  signal,
} from '@angular/core';

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
   * @returns a list of classes which are needed to properly display an icon of this sprite.
   */
  classBuilder: (icon: string) => string[];
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
  public _element = inject(ElementRef).nativeElement as SVGElement;

  /**
   * @ignore
   */
  public _sprites = inject(IconSprites);

  /**
   * The icon to render of this {@link SvgIcon.sprite}.
   */
  public icon = signal<string | undefined>(undefined);

  /**
   * The name of the sprite of this {@link SvgIcon}.
   *
   * @see {@link IconSprite}
   */
  public sprite = signal<string | undefined>(undefined);

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
  public _renderEffect = effect(() => {
    const sprite = this.sprite();
    this._handleChange(
      this._element,
      this.icon(),
      sprite != null ? this._sprites.get(sprite) : undefined
    );
  });

  public _classes?: string[];

  /**
   * @ignore
   */
  public _handleChange = (
    element: SVGElement,
    icon?: string,
    sprite?: IconSprite
  ) => {
    // clear child nodes of this svg
    element.replaceChildren();

    // remove old classes
    element.classList.remove(...(this._classes ?? []));

    // append a new child node referencing the new icon of the new sprite if they are present.
    if (icon != null && sprite != null) {
      const useElement = document.createElementNS(element.namespaceURI, 'use');

      element.appendChild(useElement);

      element.classList.add(...(this._classes = sprite.classBuilder(icon)));

      useElement.setAttribute('href', sprite.path(icon));
    }
  };
}
