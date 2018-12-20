import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapturaVentasRoutingModule } from './captura-ventas-routing.module';
import { CapturaVentasComponent } from './captura-ventas.component';
import { MaterialComponentsModule } from '../../../_app-modules/material-components.module';

@NgModule({
  imports: [
    CommonModule,
    CapturaVentasRoutingModule,
    MaterialComponentsModule

  ],
  declarations: [CapturaVentasComponent]
})
export class CapturaVentasModule { }
