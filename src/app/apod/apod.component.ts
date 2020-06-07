import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApodInfoService } from '../shared/apod-info.service';
import { ISubscription } from 'rxjs/Subscription';

declare const $: any;

import { Apod } from '../models/apod.model';

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

    this.oneDayInfo$ = this._apodInfo.oneDayInfo$
      .subscribe((data) => {
        this.apod = data;
      });

    if (localStorage.getItem('origin-date')) {
      this.apod = JSON.parse(localStorage.getItem('apod'));
    }
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
