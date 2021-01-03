import { Component, OnDestroy, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { ApodInfoService } from "../../services/apod-info.service";
import { Apod } from "../../models/apod.model";

@Component({
  selector: "app-apod",
  templateUrl: "./apod.component.html",
  styleUrls: ["./apod.component.scss"],
})
export class ApodComponent implements OnInit, OnDestroy {
  apod: Apod;
  url;
  showPictureDialog = false;
  destroy = new Subject();

  constructor(
    public sanitize: DomSanitizer,
    private apodInfo: ApodInfoService,
  ) {}

  ngOnInit() {
    this.apodInfo.oneDayInfo$
      .pipe(takeUntil(this.destroy))
      .subscribe((data: Apod) => {
        this.apod = data;
        this.url = data.url;
      });

    if (sessionStorage.getItem("origin-date")) {
      this.apod = JSON.parse(sessionStorage.getItem("apod"));
    }
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  togglePictureDialog() {
    this.showPictureDialog = !this.showPictureDialog;
  }

  toggleHD(e: MatSlideToggleChange): void {
    this.url = e.checked ? this.apod.hdurl : this.apod.url;
  }
}
