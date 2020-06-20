import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IfApodInStorageGuard implements CanActivate {

  constructor(
    private _router: Router,
  ) { }

  canActivate() {
    if (!localStorage.getItem('apod')) {
      this._router.navigate(['/']);
    }

    return true;
  }
}
