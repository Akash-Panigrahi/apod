import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2
} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';

/* Models */
import { Apod } from '../models/apod.model';

/* Services */
import { StorageService } from '../shared/storage.service';
import { ApodService } from '../shared/apod.service';
import { WindowResizedService } from '../shared/window-resized.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [WindowResizedService]
})
export class HomeComponent implements OnInit, OnDestroy {
  apodOriginDate = new FormControl(new Date());
  minDate = new Date('1995-06-16');
  maxDate = new Date();
  // originDate: string = JSON.parse(localStorage.getItem('origin-date'));
  // originDate: Date = new Date(JSON.parse(localStorage.getItem('origin-date')));

  private oneDayApod$: ISubscription;
  private fourDaysApods$: ISubscription;
  private width$: ISubscription;

  isMobile = false;

  constructor(
    private _router: Router,
    private _storage: StorageService,
    private _apod: ApodService,
    private _windowResizedService: WindowResizedService,
    private _loadingBar: SlimLoadingBarService,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _home: HomeService
  ) { }


  private yyyyMMdd(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  ngOnInit() {
    this.width$ = this._windowResizedService.width$
      .subscribe(windowWidth => {
        this.isMobile = windowWidth <= 600 ? true : false;
      });
  }

  updateApod(e: MatDatepickerInputEvent<Date>) {
    this._loadingBar.interval = 0;
    this._loadingBar.start();

    const now = new Date(e.value);
    const today = this.yyyyMMdd(now);

    this._storage.setItem('origin-date', JSON.stringify(today));

    if (this._router.url === '/apod') {

      this.oneDayApod$ = this._home.oneDayApod$(today)
        .subscribe(
          (data: Apod) => {
            localStorage.setItem('apod', JSON.stringify(data));
            this._apod.setOneDayInfo(data);

            this._loadingBar.complete();
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this._loadingBar.stop();
          }
        );

    } else if (this._router.url === '/') {

      const threeDaysBefore = this.yyyyMMdd(this.getStartDate(now));

      this.fourDaysApods$ = this._home.fourDaysApods$(today, threeDaysBefore)
        .subscribe(
          (data: Array<Apod>) => {
            localStorage.setItem('last-four-days-apods', JSON.stringify(data));
            this._apod.setFourDaysInfo(data);

            this._loadingBar.complete();
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this._loadingBar.stop();
          }
        );

    }

  }

  private getStartDate(currentDate: Date): Date {
    const monthDays = [31, , 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();

    // if leap year
    monthDays[1] = year % 4 ? 28 : 29;

    const prevMonthDays = month ? monthDays[month - 1] : 31;
    const prevMonth = month ? month - 1 : 12;
    const prevYear = prevMonth === 12 ? year - 1 : year;
    const prevDate = prevMonthDays - 3 + date;

    return new Date(prevYear, prevMonth, prevDate);
  }

  ngOnDestroy() {
    this.width$.unsubscribe();
    this.oneDayApod$.unsubscribe();
    this.fourDaysApods$.unsubscribe();
  }
}
