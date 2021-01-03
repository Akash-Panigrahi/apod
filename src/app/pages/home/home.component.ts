import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { catchError, map, take } from "rxjs/operators";

import { AstronomyPictureOf } from "../../models/astronomy-picture-of.model";
import { Apod } from "../../models/apod.model";
import { ApodInfoService } from "../../shared/apod-info.service";
import { DatePipe } from "@angular/common";
import { of, throwError } from "rxjs";
import { NasaApiService } from "src/app/shared/nasa-api.service";
import { HttpErrorResponse } from "@angular/common/http";
import { PageNotFoundInfoService } from "src/app/shared/page-not-found-info.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  apods: AstronomyPictureOf;

  constructor(
    public sanitize: DomSanitizer,
    private router: Router,
    private apodInfo: ApodInfoService,
    private datePipe: DatePipe,
    private nasaApi: NasaApiService,
    private pageNotFoundInfo: PageNotFoundInfoService,
  ) {}

  ngOnInit() {
    const now = new Date();
    const today = this.datePipe.transform(now, "yyyy-MM-dd");
    const threeDaysBeforeDate = new Date(
      now.getTime() - 24 * 60 * 60 * 1000 * 3,
    );
    const threeDaysBefore = this.datePipe.transform(
      threeDaysBeforeDate,
      "yyyy-MM-dd",
    );
    const originDate = sessionStorage.getItem("origin-date");

    if (originDate && (new Date(originDate) === new Date())) {
      return of(JSON.parse(sessionStorage.getItem("last-four-days-apods")));
    }

    this.nasaApi.fourDaysApods$(today, threeDaysBefore)
      .pipe(
        take(1),
        map((data: Array<{}>) => {
          sessionStorage.setItem("origin-date", today);
          sessionStorage.setItem("last-four-days-apods", JSON.stringify(data));

          return data;
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 400 || err.status === 404 || err.status === 403) {
            this.pageNotFoundInfo.setErrorInfo(err);
            this.router.navigate(["404"]);

            return throwError(err);
          }
        }),
      )
      .subscribe((apod) => {
        this.apods = new AstronomyPictureOf(...apod);
      });

    this.apodInfo.fourDaysInfo$
      .pipe(take(1))
      .subscribe((data: Array<Apod>) => {
        if (data.length) {
          this.apods = new AstronomyPictureOf(...data);
        }
      });
  }

  setApod(apod: Apod): void {
    // this._home.apodOriginDate = new FormControl(new Date(apod.date));
    sessionStorage.setItem("origin-date", JSON.stringify(apod.date));
    sessionStorage.setItem("apod", JSON.stringify(apod));

    this.apodInfo.setOneDayInfo(apod);

    this.router.navigate(["apod"]);
  }
}
