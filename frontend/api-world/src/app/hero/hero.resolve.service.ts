import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageNotFoundInfoService } from './../shared/page-not-found-info.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class HeroResolve implements Resolve<{}> {

  constructor(
    private _http: HttpClient,
    private _pageNotFoundInfo: PageNotFoundInfoService,
    private _router: Router
  ) { }

  resolve(): Observable<{}> {
    function yyyyMMdd(date) {
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    const now = new Date();
    const today = yyyyMMdd(now);
    const threeDaysBefore = yyyyMMdd(new Date(new Date().setDate(now.getDate() - 3)));

    const originDate = localStorage.getItem('origin-date');

    if (originDate && (new Date(originDate) === new Date())) {
      return Observable.of(JSON.parse(localStorage.getItem('last-four-days-apods')));
    }

    return this._http
      .get(`https://api.nasa.gov/planetary/apod?api_key=${environment.NASA_API_KEY}&start_date=${threeDaysBefore}&end_date=${today}`)
      .map((data: Array<{}>) => {
        localStorage.setItem('origin-date', JSON.stringify(yyyyMMdd(now)));
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