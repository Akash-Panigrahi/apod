import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApodInfoService } from '../shared/apod-info.service';
import { ISubscription } from 'rxjs/Subscription';

declare const $: any;

import { Apod } from '../models/apod.model';
import { DateUtilsService } from '../shared/helpers/date-utils.service';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss']
})
export class ApodComponent implements OnInit, OnDestroy {
  apod: Apod;
  private oneDayInfo$: ISubscription;

  constructor(
    public _sanitize: DomSanitizer,
    private _apodInfo: ApodInfoService,
  ) { }


  ngOnInit() {

    /*
      If   -- user directly routes to /apod,
      Then -- show user today's apod
    */

    /*
      If   -- origin-date matches today's date
      Then -- serve from localStorage
      Else -- hit service for today's apod
    */

    if (JSON.parse(localStorage.getItem('origin-date')) === DateUtilsService.yyyyMMdd(new Date)) {
      this.apod = JSON.parse(localStorage.getItem('apod'));
    }


    this.oneDayInfo$ = this._apodInfo.oneDayInfo$
      .subscribe((data) => {
        this.apod = data;
      });
  }

  openPictureDialog() {
    $(document).ready(function () {
      $('.apod__picture').toggleClass('apod__picture--fixed');
    });
  }

  ngOnDestroy() {
    this.oneDayInfo$.unsubscribe();
  }
}
