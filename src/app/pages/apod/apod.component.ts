import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { take } from 'rxjs/operators';

declare const $: any;

import { ApodInfoService } from '../../shared/apod-info.service';
import { Apod } from '../../models/apod.model';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss']
})
export class ApodComponent implements OnInit {
  apod: Apod;
  url;

  constructor(
    public _sanitize: DomSanitizer,
    private _apodInfo: ApodInfoService,
  ) { }

  ngOnInit() {
    this._apodInfo.oneDayInfo$
      .pipe(take(1))
      .subscribe((data: Apod) => {
        this.apod = data;
        this.url = data.url;
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

  toggleHD(e: MatSlideToggleChange): void {
    this.url = e.checked ? this.apod.hdurl : this.apod.url;
  }
}
