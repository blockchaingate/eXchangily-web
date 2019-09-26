import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-social-bar',
  templateUrl: './social-bar.component.html',
  styleUrls: ['./social-bar.component.scss']
})
export class SocialBarComponent implements OnInit, OnDestroy {
  visible = true;
  private maxRange = 100;

  constructor() { }

  ngOnInit() {
    // document.addEventListener('mousemove', this.mouseMove.bind(this));
    // setTimeout(() => {
    //   this.visible = false;
    // }, 800);
  }

  private mouseMove(e: any) {
    const wWidth = window.innerWidth;
    const mouseX = e.clientX;

    const range = wWidth - mouseX;
    if ( range <=  this.maxRange) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  ngOnDestroy() {
    // document.removeEventListener('mousemove', this.mouseMove);
  }
}
