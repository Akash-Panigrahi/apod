import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';

import { AstronomyPictureOf } from '../../models/astronomy-picture-of.model';
import { Apod } from '../../models/apod.model';

import { ApodInfoService } from '../../shared/apod-info.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, OnDestroy {
  apods: AstronomyPictureOf;
  private fourDaysInfo$: ISubscription;

  constructor(
    private _route: ActivatedRoute,
    private _sanitize: DomSanitizer,
    private _router: Router,
    private _apodInfo: ApodInfoService,
  ) { }

  ngOnInit() {
    // from resolver service
    this.apods = new AstronomyPictureOf(...this._route.snapshot.data.apod);

    this.fourDaysInfo$ = this._apodInfo.fourDaysInfo$
      .subscribe((data: Array<Apod>) => {
        if (data.length) {
          this.apods = new AstronomyPictureOf(...data);
        }
      });
  }

  setApod(apod: Apod): void {
    // this._home.apodOriginDate = new FormControl(new Date(apod.date));
    localStorage.setItem('origin-date', JSON.stringify(apod.date));
    localStorage.setItem('apod', JSON.stringify(apod));

    this._apodInfo.setOneDayInfo(apod);

    this._router.navigate(['apod']);
  }

  ngOnDestroy() {
    this.fourDaysInfo$.unsubscribe();
  }
}
