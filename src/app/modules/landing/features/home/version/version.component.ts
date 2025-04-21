import { Component, OnInit } from '@angular/core';
import { version } from '../../../../../../environments/version';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
    version = '';
    
    ngOnInit() {
        this.version = environment.production.toString() + ' ' + version;
    }    
}
