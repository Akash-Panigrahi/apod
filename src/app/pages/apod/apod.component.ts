import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { take } from "rxjs/operators";

import { ApodInfoService } from "../../shared/apod-info.service";
import { Apod } from "../../models/apod.model";

@Component({
  selector: "app-apod",
  templateUrl: "./apod.component.html",
  styleUrls: ["./apod.component.scss"],
})
export class ApodComponent implements OnInit {
  apod: Apod;
  url;
  showPictureDialog = false;

  constructor(
    public sanitize: DomSanitizer,
    private apodInfo: ApodInfoService,
  ) {}

  ngOnInit() {
    this.apodInfo.oneDayInfo$
      .pipe(take(1))
      .subscribe((data: Apod) => {
        this.apod = data;
        this.url = data.url;
      });

    if (sessionStorage.getItem("origin-date")) {
      this.apod = JSON.parse(sessionStorage.getItem("apod"));
    }
  }

  togglePictureDialog() {
    this.showPictureDialog = !this.showPictureDialog;
  }

  toggleHD(e: MatSlideToggleChange): void {
    this.url = e.checked ? this.apod.hdurl : this.apod.url;
  }
}
