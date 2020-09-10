import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})

export class LoadingComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private count: number = 0;
  public show: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.loadingService.loadingState.subscribe(state => {
      if (state.show) {
        this.count++;
      } else {
        this.count--;
      }

      if (this.count <= 0) {
        this.count = 0;
        this.show = false;
      } else {
        this.show = true;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
