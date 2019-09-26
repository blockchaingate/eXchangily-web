import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VimeoService {
  private videoLightBoxMin = 840;

  get minDesktopWidth(): number {
    return this.videoLightBoxMin;
  }

  get mobileWidth(): number {
    const view = ((<any> window).visualViewport) ? (<any> window).visualViewport.width : window.innerWidth;
    return view;
  }

  constructor() { }
}
