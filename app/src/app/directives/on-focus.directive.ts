import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appOnFocus]'
})
export class OnFocusDirective {

  private el: ElementRef;
  constructor(
    private _el: ElementRef,
    public renderer: Renderer2
  ) {
    this.el = this._el;
  }

  @HostListener('focus', ['$event']) onFocus(e) {
    const parent = this._el.nativeElement.closest('.field');
    this.renderer.addClass(parent, 'fl-label-state');
    this.renderer.removeClass(parent, 'fl-placeholder-state');
    return;
  }

  @HostListener('blur', ['$event']) onblur(e) {
    if (this._el.nativeElement.value == '') {
      const parent = this._el.nativeElement.closest('.field');
      this.renderer.removeClass(parent, 'fl-label-state');
      this.renderer.addClass(parent, 'fl-placeholder-state');
    }
    return;
  }

}
