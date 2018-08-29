import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import { ISubscription } from 'rxjs/Subscription';

@Injectable()
export class WindowResizedService implements OnDestroy {
  width$: Observable<number>;
  private $windowResize: ISubscription;

  constructor() {
    const windowSize$ = new BehaviorSubject(getWindowSize());

    this.width$ = windowSize$.map(windowSize => windowSize.width);

    this.$windowResize = Observable.fromEvent(window, 'resize')
      .map(getWindowSize)
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
