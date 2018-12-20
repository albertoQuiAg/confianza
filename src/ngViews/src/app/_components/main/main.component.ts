import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { MainService } from '../../_services/main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public links: Array<
    {
      label: string,
      url: string,
      lvl2: Array<{ label: string, url: string, icon: string }>
      icon: string
    }>;

  constructor(public _mainServ: MainService) { }

  ngOnInit() { }
}
