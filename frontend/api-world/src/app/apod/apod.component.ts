import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApodService } from '../shared/apod.service';
declare const $: any;

import { Apod } from '../models/apod.model';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss']
})
export class ApodComponent implements OnInit {
  apod: Apod;

  constructor(
    private _sanitize: DomSanitizer,
    private _apod: ApodService,
  ) { }


  ngOnInit() {
    this.apod = JSON.parse(localStorage.getItem('apod'));

    this._apod.oneDayInfo$
      .subscribe((apod) => {
        console.log(apod);
        this.apod = apod;
      });

    // $(document).ready(function () {
    //   console.log($('.picture__image'));
    // });
  }

  openPictureDialog() {
    $(document).ready(function () {
      $('.apod__picture').toggleClass('apod__picture--fixed');
    });
  }
}
