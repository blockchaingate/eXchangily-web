import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  imgWechatShow: boolean;
  constructor() { }

  ngOnInit() {
    this.imgWechatShow = false;
  }

  coordinates(event: MouseEvent): void {
    const clientX = event.offsetX;
    const clientY = event.offsetY;
    console.log('clientX=' + clientX + ',clientY=' + clientY);
    if (clientX >= 0 && clientY >= 0) {
        if (clientX <= 26 && clientY <= 26) {
            this.imgWechatShow = true;
        } else {
            this.imgWechatShow = false;
        }
    }
  }  
}
