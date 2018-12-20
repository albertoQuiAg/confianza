import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { MaterialComponentsModule } from '../../_app-modules/material-components.module';

@NgModule({
  imports: [
    CommonModule,
    VentasRoutingModule,
    MaterialComponentsModule
  ],
  declarations: [VentasComponent]
})
export class VentasModule { }
