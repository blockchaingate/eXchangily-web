import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private apiServ: ApiService) {

  }
  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    console.log('code=', code);
    this.apiServ.getExTransaction(code).subscribe(
      (res: any) => {
        console.log('res==', res);
        if(res && res.ok) {

        }
      }
    );
  }
}