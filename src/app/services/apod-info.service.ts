import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Apod } from '../models/apod.model';

@Injectable({
  providedIn: 'root'
})
export class ApodInfoService {
  private oneDaySource = new BehaviorSubject({});
  oneDayInfo$ = this.oneDaySource.asObservable();

  private fourDaysSource = new BehaviorSubject([]);
  fourDaysInfo$ = this.fourDaysSource.asObservable();

  setOneDayInfo(oneDay: object) {
    this.oneDaySource.next(oneDay);
  }

  setFourDaysInfo(oneDay: Array<Apod>) {
    this.fourDaysSource.next(oneDay);
  }
}
