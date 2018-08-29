import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageSub = new Subject<{} | boolean>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
    this.storageSub.next({ key, value: JSON.parse(value) });
  }

  getItem(key: string): string {
    return localStorage.getItem(key);
  }

  removeItem(key) {
    localStorage.removeItem(key);
    this.storageSub.next(true);
  }
}