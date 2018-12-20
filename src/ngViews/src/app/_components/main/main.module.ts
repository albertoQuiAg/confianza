import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MaterialComponentsModule } from '../../_app-modules/material-components.module';
import { NavbarComponent } from '../navbar/navbar.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialComponentsModule
  ],
  declarations: [
    MainComponent,
    NavbarComponent
  ]
})
export class MainModule { }
