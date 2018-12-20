import { Component, OnInit, ViewChild } from '@angular/core';
import { componentAnimation } from '../../_animations/router.animations';
import { VentasDataSource, VentasService } from './ventas.service';
import { Venta } from './venta.interface';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MainService } from '../../_services/main.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  animations: [componentAnimation],
  host: { '[@componentAnimation]': '' }

})
export class VentasComponent implements OnInit {

  displayedColumns: string[] = ['folio', 'cliente', 'nombre', 'total', 'fecha', 'estatus'];
  dataSource: VentasDataSource;
  selectedRow: Venta;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sortData: MatSort;

  constructor(private snackBar: MatSnackBar, public router: Router, public mainServ: MainService,
    private dialog: MatDialog, public ventasServ: VentasService
  ) { }

  ngOnInit() {
    this.ventasServ.getVentas();
    this.dataSource = new VentasDataSource(this.ventasServ);
  }
}
