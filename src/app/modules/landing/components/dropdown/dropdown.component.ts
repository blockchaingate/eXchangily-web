
import {fromEvent as observableFromEvent} from 'rxjs';
import { Component, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

interface DropdownData {
  text: string;
  value: string;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnDestroy {
  @Input() items: Array<DropdownData>;
  @Input() title: string;
  @Output() Select: EventEmitter<string> = new EventEmitter();
  @ViewChild('dropdown', {static: true}) dropdown: ElementRef;

  open = false;
  private subscriber: Subscription;

  constructor() {
  }

  toggle() {
    this.open = !(this.open);

    if (this.open && !this.subscriber) {
      this.subscriber = observableFromEvent(document, 'click')
      .subscribe((e: Event) => {
        const container = this.dropdown.nativeElement;
        if (!container.contains(e.target)) {
          this.open = false;
        }
      });
    }
  }

  select(value: string) {
    this.open = false;
    this.Select.emit(value);
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }
}
