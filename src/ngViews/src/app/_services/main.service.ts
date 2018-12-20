import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as _moment from 'moment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  public breakPoint: boolean;
  public moment: any = _moment;

  constructor(public _bpo: BreakpointObserver, public http: HttpClient) {
    _bpo.observe('(min-width: 900px)').subscribe((bp: any) => {
      this.breakPoint = bp.matches
    });
  }
}
