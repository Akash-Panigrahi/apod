import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

/* Services */
import { PageNotFoundInfoService } from './../shared/page-not-found-info.service';
import { DateUtilsService } from '../shared/helpers/date-utils.service';
import { NasaApiService } from '../shared/nasa-api.service';

@Injectable()
export class HeroResolve implements Resolve<{}> {

  constructor(
    private _pageNotFoundInfo: PageNotFoundInfoService,
    private _router: Router,
    private _nasaApi: NasaApiService
  ) { }

  resolve(): Observable<{}> {

    const now = new Date();
    const today = DateUtilsService.yyyyMMdd(now);
    const threeDaysBefore = DateUtilsService.yyyyMMdd(DateUtilsService.getStartDate(now));
    const originDate = localStorage.getItem('origin-date');

    if (originDate && (new Date(originDate) === new Date())) {
      return Observable.of(JSON.parse(localStorage.getItem('last-four-days-apods')));
    }

    return this._nasaApi.fourDaysApods$(today, threeDaysBefore)
      .map((data: Array<{}>) => {
        localStorage.setItem('origin-date', today);
        localStorage.setItem('last-four-days-apods', JSON.stringify(data));

        return data;
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status === 400 || err.status === 404 || err.status === 403) {
          this._pageNotFoundInfo.setErrorInfo(err);
          this._router.navigate(['404']);

          return Observable.throw(err);
        }
      });
  }

}
