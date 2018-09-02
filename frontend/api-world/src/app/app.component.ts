import { Component } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import {
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  Event,
  Router
} from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(
    private _loadingBar: SlimLoadingBarService,
    private _router: Router,
    private _title: Title,
  ) {
    this._title.setTitle('Astronomy Picture Of The Day');
    this._router.events
      .subscribe((event: Event) => {
        this.navigationInterceptor(event);
      });
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this._loadingBar.start();
    }

    if (event instanceof NavigationEnd) {
      this._loadingBar.complete();
    }

    if (event instanceof NavigationCancel) {
      this._loadingBar.stop();
    }

    if (event instanceof NavigationError) {
      this._loadingBar.stop();
    }
  }
}
