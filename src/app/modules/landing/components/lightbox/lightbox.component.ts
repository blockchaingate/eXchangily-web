import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements OnInit, OnDestroy {
  @ViewChild('lightbox', {static: true}) lightbox: ElementRef;
  @ViewChild('content', {static: true}) content: ElementRef;
  @Input() exitRoute: string;

  offset;
  constructor(private _router: Router) { }
  loadComplete = false;

  private clickable = false;
  private contentParent: any;

  ngOnInit() {
    this.offset = `${window.pageYOffset}px`;
    this.contentParent = this.content.nativeElement.parentNode;
    this.content.nativeElement.parentNode.removeChild(this.content.nativeElement);
    this.lightbox.nativeElement.parentNode.removeChild(this.lightbox.nativeElement);

    // remove href to prevent user from tabbing out of screen and breaking app
    const anchors = document.body.getElementsByClassName('app-wrap')[0].getElementsByTagName('a');
    for (let i = 0; i < anchors.length; i++) {
      const href = anchors[i].getAttribute('href');
      anchors[i].setAttribute('tmp-href', href);
      anchors[i].removeAttribute('href');
    }
    this.lightboxSetup();
  }

  private lightboxSetup() {
    document.body.style.overflow = 'hidden';
    const wrap = document.body.getElementsByClassName('app-wrap')[0];
    wrap.setAttribute('disabled', 'disabled');

    document.body.appendChild(this.lightbox.nativeElement);
    document.body.appendChild(this.content.nativeElement);
    document.addEventListener('keyup', this.checkKey.bind(this));
    this.lightbox.nativeElement.addEventListener('click', this.destroy.bind(this));
    this.loadComplete = true;
  }

  private lightboxDestroy() {
    document.removeEventListener('keyup', this.checkKey);
    this.lightbox.nativeElement.removeEventListener('click', this.destroy);

    // re-enable all the buttons
    const wrap = document.body.getElementsByClassName('app-wrap')[0];
    wrap.removeAttribute('disabled');

    // put href links back
    const anchors = document.body.getElementsByClassName('app-wrap')[0].getElementsByTagName('a');
    for (let i = 0; i < anchors.length; i++) {
      const href = anchors[i].getAttribute('tmp-href');
      anchors[i].setAttribute('href', href);
      anchors[i].removeAttribute('tmp-href');
    }
    this.lightbox.nativeElement.parentNode.removeChild(this.lightbox.nativeElement);
    this.content.nativeElement.parentNode.removeChild(this.content.nativeElement);

    document.body.style.overflow = 'initial';
  }

  checkKey(event) {
    if (event.keyCode === 27) {
      this.destroy();
    }
  }

  destroy(e?: any): void {
    const routes = [this.exitRoute];
    this._router.navigate(routes);
  }

  ngOnDestroy() {
    this.lightboxDestroy();
  }
}
