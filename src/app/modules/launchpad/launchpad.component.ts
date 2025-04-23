import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-launchpad',
  templateUrl: './launchpad.component.html',
  styleUrls: ['./launchpad.component.scss']
})
export class LaunchpadComponent implements OnInit {
    constructor(private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document) {
    }
    ngOnInit() {
        this.loadScripts();
    }

    private loadScripts() {
       const s = this.renderer2.createElement('script');
       s.type = 'text/javascript';
       s.innerHTML = `
        window._adftrack = Array.isArray(window._adftrack) ? window._adftrack : (window._adftrack ? [window._adftrack] : []);
        window._adftrack.push({
            pm: 2100765,
            divider: encodeURIComponent('|'),
            pagename: encodeURIComponent('LP')
        });
        (function () { var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://a2.adform.net/serving/scripts/trackpoint/async/'; var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); })();
       `;
        const s2 = this.renderer2.createElement('noscript');
        s2.innerHTML = `
    <p style="margin:0;padding:0;border:0;">
        <img src="https://a2.adform.net/Serving/TrackPoint/?pm=2100765&ADFPageName=LP&ADFdivider=|" width="1" height="1" alt="" />
    </p>
        `;
       this.renderer2.appendChild(this._document.body, s);
        this.renderer2.appendChild(this._document.body, s2);

    }
}