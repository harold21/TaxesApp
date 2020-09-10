import { Injectable } from '@angular/core';
import { Subject, Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class LoadingService {
  private loaderSubject: ReplaySubject<LoadingState>;
  public loadingState: Observable<LoadingState>;

  constructor() {
    this.loaderSubject = new ReplaySubject<LoadingState>();
    this.loadingState = this.loaderSubject.asObservable();
  }

  show() {
    this.loaderSubject.next({ show: true });
  }

  hide() {
    this.loaderSubject.next({ show: false });
  }
}

export interface LoadingState {
  show: boolean;
}

