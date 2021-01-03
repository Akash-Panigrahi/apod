import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class IfApodInStorageGuard implements CanActivate {
  constructor(
    private router: Router,
  ) {}

  canActivate() {
    if (!sessionStorage.getItem("apod")) {
      this.router.navigate(["/"]);
    }

    return true;
  }
}
