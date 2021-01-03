import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageNotFoundInfoService {
  private errorSource = new BehaviorSubject({});
  errorInfo = this.errorSource.asObservable();

  setErrorInfo(error: object) {
    this.errorSource.next(error);
  }
}
