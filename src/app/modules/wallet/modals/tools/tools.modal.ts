import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'tools-modal',
    templateUrl: './tools.modal.html',
    styleUrls: ['./tools.modal.css']
})
export class ToolsModal implements OnInit{
    @ViewChild('toolsModal', {static: true}) public toolsModal: ModalDirective;
    @Output() confirmedTools = new EventEmitter<string>();
    ngOnInit() {
    }

    show() {
        this.toolsModal.show();
    }
    hide() {
        this.toolsModal.hide();
    }   
    
    BTCinFAB() {
        this.confirmedTools.emit('BTCinFAB');
    }
}