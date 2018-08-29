import { Component, OnInit } from '@angular/core';
import { PageNotFoundInfoService } from './../shared/page-not-found-info.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private pageNotFoundInfo: PageNotFoundInfoService,
  ) { }

  ngOnInit() {
    console.log(this.pageNotFoundInfo.errorInfo);
    this.pageNotFoundInfo.errorInfo
      .subscribe(err => console.log(err));
  }

}
