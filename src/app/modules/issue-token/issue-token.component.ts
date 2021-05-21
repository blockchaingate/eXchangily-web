import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-issue-token',
    templateUrl: './issue-token.component.html',
    styleUrls: ['./issue-token.component.scss']
  })

export class IssueTokenComponent  implements OnInit{

  isEditable = true;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {

  }  
}
