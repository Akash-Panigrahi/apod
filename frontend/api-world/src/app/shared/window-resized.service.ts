import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISubscription } from 'rxjs/Subscription';

@Injectable()
export class WindowResizedService implements OnDestroy {
  width$: Observable<number>;
  private $windowResize: ISubscription;

  constructor() {
    const windowSize$ = new BehaviorSubject(getWindowSize());

    this.width$ = windowSize$
      .pipe(map(windowSize => windowSize.width));

    this.$windowResize = fromEvent(window, 'resize')
      .pipe(map(getWindowSize))
      .subscribe(windowSize$);
  }

  ngOnDestroy() {
    this.$windowResize.unsubscribe();
  }
}

function getWindowSize() {
  return {
    width: window.innerWidth
  };
}
