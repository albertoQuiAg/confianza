import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { filter } from '../../node_modules/rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  navStartSub: Subscription;
  navEndSub: Subscription;
  navCancelSub: Subscription;
  progressBar: boolean = false;
  loadingScreen: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.setRouterEvents();
  }

  ngOnDestroy() {
    this.navStartSub.unsubscribe();
    this.navEndSub.unsubscribe();
    this.navCancelSub.unsubscribe();
  }

  setRouterEvents() {
    this.navStartSub = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.progressBar = true;
      this.loadingScreen = document.getElementById('loadingScreen');
    });

    this.navEndSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.progressBar = false;

      if (this.loadingScreen) {
        this.loadingScreen.style.opacity = 0;
        setTimeout(() => {
          this.loadingScreen.remove();
        }, 600)
      }
    });

    this.navCancelSub = this.router.events.pipe(
      filter(event => event instanceof NavigationCancel)
    ).subscribe(() => {
      this.progressBar = false;
    });
  }
}
