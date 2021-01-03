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
import { filter, take } from "rxjs/operators";

/* Models */
import { Apod } from "./models/apod.model";

/* Services */
import { ApodInfoService } from "./shared/apod-info.service";
import { WindowResizedService } from "./shared/window-resized.service";
import { NasaApiService } from "./shared/nasa-api.service";
import { DatePipe } from "@angular/common";

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
  isMobile = false;
  private width$: ISubscription;
  isHome: boolean;

  constructor(
    private router: Router,
    private _title: Title,
    private apodInfo: ApodInfoService,
    private _windowResized: WindowResizedService,
    private _nasaApi: NasaApiService,
    private datePipe: DatePipe,
  ) {
    this._title.setTitle("Astronomy Picture Of The Day");
    this.router.events
      .subscribe((event: Event) => {
        this.navigationInterceptor(event);
      });
  }

  ngOnInit() {
    const date = sessionStorage.getItem("origin-date");
    this.apodOriginDate = new FormControl(date ? new Date(date) : new Date());

    this.width$ = this._windowResized.width$
      .subscribe((windowWidth) => {
        this.isMobile = windowWidth <= 600 ? true : false;
      });

    // setting isHome property
    // -- at component initialization
    this.isHome = this.router.url === "/" ? true : false;
    // -- for subsequent navigations
    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) =>
        this.isHome = event.url === "/" ? true : false
      );
  }

  ngOnDestroy() {
    this.width$.unsubscribe();
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
    const today = this.datePipe.transform(now, "yyyy-MM-dd");

    sessionStorage.setItem("origin-date", JSON.stringify(today));

    if (this.router.url === "/apod") {
      this._nasaApi.oneDayApod$(today)
        .pipe(take(1))
        .subscribe(
          (data: Apod) => {
            sessionStorage.setItem("apod", JSON.stringify(data));
            this.apodInfo.setOneDayInfo(data);

            // this._loadingBar.complete();
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            // this._loadingBar.stop();
          },
        );
    } else if (this.router.url === "/") {
      const threeDaysBeforeDate = new Date(
        now.getTime() - 24 * 60 * 60 * 1000 * 3,
      );
      const threeDaysBefore = this.datePipe.transform(
        threeDaysBeforeDate,
        "yyyy-MM-dd",
      );

      this._nasaApi.fourDaysApods$(
        today,
        threeDaysBefore,
      )
        .pipe(take(1))
        .subscribe(
          (data: Array<Apod>) => {
            sessionStorage.setItem(
              "last-four-days-apods",
              JSON.stringify(data),
            );
            this.apodInfo.setFourDaysInfo(data);

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
    if (this.router.url !== "/") {
      this.router.navigate(["/"]);
    }
  }
}
