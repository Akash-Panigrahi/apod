import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  Event,
  Router,
} from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { FormControl } from "@angular/forms";
import { ISubscription } from "rxjs/Subscription";
import { filter } from "rxjs/operators";

/* Models */
import { Apod } from "./models/apod.model";

/* Services */
import { ApodInfoService } from "./shared/apod-info.service";
import { WindowResizedService } from "./shared/window-resized.service";
import { DateUtilsService } from "./shared/helpers/date-utils.service";
import { NasaApiService } from "./shared/nasa-api.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "app";
  apodOriginDate: FormControl;
  minDate = new Date("1995-06-16");
  maxDate = new Date();

  private oneDayApod$: ISubscription;
  private fourDaysApods$: ISubscription;
  private width$: ISubscription;

  isHome: boolean;
  isMobile = false;

  constructor(
    private _router: Router,
    private _title: Title,
    private _apodInfo: ApodInfoService,
    private _windowResized: WindowResizedService,
    private _nasaApi: NasaApiService,
  ) {
    this._title.setTitle("Astronomy Picture Of The Day");
    this._router.events
      .subscribe((event: Event) => {
        this.navigationInterceptor(event);
      });
  }

  ngOnInit() {
    const date = localStorage.getItem("origin-date");
    this.apodOriginDate = new FormControl(date ? new Date(date) : new Date());

    this.width$ = this._windowResized.width$
      .subscribe((windowWidth) => {
        this.isMobile = windowWidth <= 600 ? true : false;
      });

    // setting isHome property
    // -- at component initialization
    this.isHome = this._router.url === "/" ? true : false;
    // -- for subsequent navigations
    this._router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) =>
        this.isHome = event.url === "/" ? true : false
      );
  }

  ngOnDestroy() {
    this.width$.unsubscribe();
    this.oneDayApod$.unsubscribe();
    this.fourDaysApods$.unsubscribe();
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      // this._loadingBar.start();
    }

    if (event instanceof NavigationEnd) {
      // this._loadingBar.complete();
    }

    if (event instanceof NavigationCancel) {
      // this._loadingBar.stop();
    }

    if (event instanceof NavigationError) {
      // this._loadingBar.stop();
    }
  }

  updateApod(e: MatDatepickerInputEvent<Date>) {
    // this._loadingBar.start();

    const now = new Date(e.value);
    const today = DateUtilsService.yyyyMMdd(now);

    localStorage.setItem("origin-date", JSON.stringify(today));

    if (this._router.url === "/apod") {
      this.oneDayApod$ = this._nasaApi.oneDayApod$(today)
        .subscribe(
          (data: Apod) => {
            localStorage.setItem("apod", JSON.stringify(data));
            this._apodInfo.setOneDayInfo(data);

            // this._loadingBar.complete();
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            // this._loadingBar.stop();
          },
        );
    } else if (this._router.url === "/") {
      const threeDaysBefore = DateUtilsService.yyyyMMdd(
        DateUtilsService.getStartDate(now),
      );

      this.fourDaysApods$ = this._nasaApi.fourDaysApods$(today, threeDaysBefore)
        .subscribe(
          (data: Array<Apod>) => {
            localStorage.setItem("last-four-days-apods", JSON.stringify(data));
            this._apodInfo.setFourDaysInfo(data);

            // this._loadingBar.complete();
          },
          (err: HttpErrorResponse) => {
            console.log("hey");
            console.error(err);
            // this._loadingBar.stop();
          },
        );
    }
  }

  goToHome() {
    if (this._router.url !== "/") {
      this._router.navigate(["/"]);
    }
  }
}
