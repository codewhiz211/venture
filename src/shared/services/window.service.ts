import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  constructor(private route: ActivatedRoute) {}

  get windowRef() {
    return window;
  }

  get isDesktop() {
    return window.innerWidth >= 1024;
  }

  get isMobile() {
    return window.innerWidth < 600;
  }

  get isTablet() {
    return window.innerWidth >= 600 && window.innerWidth < 1025;
  }

  public isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  public addBodyClass(className: string) {
    const body = document.getElementById('body');
    if (body) {
      body.classList.add(className);
    }
  }

  public removeBodyClass(className: string) {
    const body = document.getElementById('body');
    if (body) {
      body.classList.remove(className);
    }
  }

  public isChrome() {
    let isChrome = false;
    // please note,
    // that IE11 now returns undefined again for window.chrome
    // and new Opera 30 outputs true for window.chrome
    // but needs to check if window.opr is not undefined
    // and new IE Edge outputs to true now for window.chrome
    // and if not iOS Chrome check
    // so use the below updated condition
    const myWindow: any = window;
    const isChromium = myWindow.chrome;
    const winNav = myWindow.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof myWindow.opr !== 'undefined';
    const isIEedge = winNav.userAgent.indexOf('Edge') > -1;
    const isIOSChrome = winNav.userAgent.match('CriOS');

    if (isIOSChrome) {
      isChrome = true;
    } else if (
      isChromium !== null &&
      typeof isChromium !== 'undefined' &&
      vendorName === 'Google Inc.' &&
      isOpera === false &&
      isIEedge === false
    ) {
      isChrome = true;
    }
    return isChrome;
  }

  public copyToClipboard(url: string) {
    const selBox = document.createElement('textarea');
    const range = document.createRange();

    selBox.contentEditable = String(true);
    selBox['readOnly'] = false;

    range.selectNodeContents(selBox);
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox['value'] = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox['select']();

    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    selBox['setSelectionRange'](0, 999999);

    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
