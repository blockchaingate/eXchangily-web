import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements OnInit {
  private _currentPosition = 0;

  roadMap = Array(14);

  constructor() {
  }

  ngOnInit() {
  }

  get currentPosition() {
    return `translateX(${this._currentPosition}px)`;
  }

  get nextDisabled() {
    const maxRightOffset = 0.625 * window.innerWidth - 3200;
    return this._currentPosition < maxRightOffset;
  }

  get prevDisabled() {
    const maxLeftOffset = 280;
    return this._currentPosition >= maxLeftOffset;
  }

  forward() {
    this._currentPosition -= 280;
  }

  backward() {
    this._currentPosition += 280;
  }
}
