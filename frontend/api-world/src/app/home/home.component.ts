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
import { FormControl } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';

/* Models */
import { Apod } from '../models/apod.model';

/* Services */
import { StorageService } from '../shared/storage.service';
import { ApodInfoService } from '../shared/apod-info.service';
import { WindowResizedService } from '../shared/window-resized.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { HomeService } from './home.service';
import { DateUtilsService } from '../shared/helpers/date-utils.service';

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

  private oneDayApod$: ISubscription;
  private fourDaysApods$: ISubscription;
  private width$: ISubscription;

  isMobile = false;

  constructor(
    private _router: Router,
    private _storage: StorageService,
    private _apodInfo: ApodInfoService,
    private _windowResizedService: WindowResizedService,
    private _loadingBar: SlimLoadingBarService,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _homeService: HomeService,
  ) { }

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
    const today = DateUtilsService.yyyyMMdd(now);

    this._storage.setItem('origin-date', JSON.stringify(today));

    if (this._router.url === '/apod') {

      this.oneDayApod$ = this._homeService.oneDayApod$(today)
        .subscribe(
          (data: Apod) => {
            localStorage.setItem('apod', JSON.stringify(data));
            this._apodInfo.setOneDayInfo(data);

            this._loadingBar.complete();
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this._loadingBar.stop();
          }
        );

    } else if (this._router.url === '/') {

      const threeDaysBefore = DateUtilsService.yyyyMMdd(DateUtilsService.getStartDate(now));

      this.fourDaysApods$ = this._homeService.fourDaysApods$(today, threeDaysBefore)
        .subscribe(
          (data: Array<Apod>) => {
            localStorage.setItem('last-four-days-apods', JSON.stringify(data));
            this._apodInfo.setFourDaysInfo(data);

            this._loadingBar.complete();
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this._loadingBar.stop();
          }
        );

    }
  }

  goToHome() {
    if (this._router.url === '/apod') {
      this._router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    this.width$.unsubscribe();
    this.oneDayApod$.unsubscribe();
    this.fourDaysApods$.unsubscribe();
  }
}
