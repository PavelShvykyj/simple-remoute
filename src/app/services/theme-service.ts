import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private metaThemeColor: HTMLMetaElement | null;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.metaThemeColor = document.querySelector('meta[name="theme-color"]');
  }

  updateThemeColor() {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    // Get the relevant Ionic CSS variable
    const colorVariable = prefersLight
      ? getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary-tint')
      : getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary');

    if (this.metaThemeColor) {
      this.renderer.setAttribute(this.metaThemeColor, 'content', colorVariable.trim());
    }
  }

  initThemeListener() {
    const prefersLightMedia = window.matchMedia('(prefers-color-scheme: light)');
    this.updateThemeColor(); // Initial update
    prefersLightMedia.addEventListener('change', () => this.updateThemeColor()); // Listen for changes
  }
}
