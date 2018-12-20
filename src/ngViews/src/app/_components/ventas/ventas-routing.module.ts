import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentasComponent } from './ventas.component';

const routes: Routes = [
  {
    path: "", component: VentasComponent, children: [
      { path: "form", loadChildren: "src/app/_components/ventas/captura-ventas/captura-ventas.module#CapturaVentasModule" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
