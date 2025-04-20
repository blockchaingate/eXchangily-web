import { Injectable } from '@angular/core';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';

@Injectable() 
export class AlertService {
    constructor(private _snackBar: MatSnackBar) {

    }
    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 100000,
          panelClass: ['custom-snackbar']
        });
    }

    openSnackBarSuccess(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 100000,
        panelClass: ['custom-snackbar-success']
      });
  }    
}
