import { Component, OnInit } from '@angular/core';
import { MainService } from '../../_services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public fecha: any = this._mainServ.moment().startOf('day').locale('es').format('ll');

  constructor(public _mainServ: MainService, public router: Router) { }

  ngOnInit() { }

}
