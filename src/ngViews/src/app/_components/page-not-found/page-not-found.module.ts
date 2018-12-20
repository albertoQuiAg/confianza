import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundRoutingModule } from './page-not-found-routing.module';
import { PageNotFoundComponent } from './page-not-found.component';
import { MaterialComponentsModule } from '../../_app-modules/material-components.module';

@NgModule({
  imports: [
    CommonModule,
    PageNotFoundRoutingModule,
    MaterialComponentsModule
  ],
  declarations: [PageNotFoundComponent]
})
export class PageNotFoundModule { }
