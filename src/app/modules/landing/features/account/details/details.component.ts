import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserAuth } from '../../../service/user-auth/user-auth.service';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../models/user';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { mergeMap ,  map ,  filter } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  userModifyForm: FormGroup;
  errorMessage: string;
  isAdmin = false;

  private subscribers: Array<Subscription> = [];

  constructor(private _userAuth: UserAuth, private _userService: UserService) { }

  ngOnInit() {
    this.userModifyForm = new FormGroup({
      'email': new FormControl('', [])
    });

    this.subscribers.push(
      this._userAuth.isLoggedIn$
      .pipe(
        filter((loggedIn) => {
          return loggedIn !== '';
        }),
        mergeMap(adsf => this._userService.getUserById(this._userAuth.id)
       .map((user: User) => {
         this.isAdmin = user.isWriteAccessAdmin || false;
         return user;
       })
      ))
      .subscribe()
    );
  }

  submit() {
    if (!this.isAdmin) {
      return;
    }
    const values = this.userModifyForm.value;

    this._userService.getUser(values)
    .subscribe(
      (ret:any) => {
        this._userService.updateUser({id: ret._id, isWriteAccessAdmin: true})
        .subscribe(
          res => {
            console.log('this should have worked!😈');
          },
          err => {
            console.log('ERROR', err);
            this.errorMessage = this.errorMessage;
          }
        );
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].unsubscribe();
    }
  }
}
