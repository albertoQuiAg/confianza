import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CapturaVentasComponent } from './captura-ventas.component';
import { CanDeactivateService } from '../../../_services/can-deactivate.service';

const routes: Routes = [
  { path: "", component: CapturaVentasComponent, canDeactivate: [CanDeactivateService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapturaVentasRoutingModule { }
