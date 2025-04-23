import { Component, OnInit,ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { Icons } from '../../../../environments/icons';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from '../../../../environments/environment';
import { version } from '../../../../environments/version';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  year: number;
  lang = 'en';

  gradientTop: number;
  gradientLeft: number;
  version = version;
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public el: ElementRef<HTMLElement>
    // public el= document.querySelector("#page-footer")
  ) { }

  get gradientStyle() {
    const top = -this.gradientTop /10;
    const left = -this.gradientLeft /10;

    return {
      'backgroundPositionX.px': left,
      'backgroundPositionY.px': top,
    };
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.gradientLeft = event.pageX - this.el.nativeElement.offsetLeft;
    this.gradientTop = event.pageY - this.el.nativeElement.offsetTop;
    // this.el.style.backgroundPositionX = -e.offsetX/4 + "px";
    // this.el.style.backgroundPositionY = -e.offsetY/4 + "px";
  }

  ngOnInit() {
    this.year = (new Date()).getFullYear();
    this.lang = window.localStorage.getItem('Lan').toLowerCase();

    const icons = Icons;
    for(let i=0; i<icons.length; i++) {
      const icon = icons[i];
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/" + icon + ".svg")
      );        
    }     
  }

}
