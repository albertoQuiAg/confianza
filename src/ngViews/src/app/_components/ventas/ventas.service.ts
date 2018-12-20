import { Injectable } from '@angular/core';
import { MainService } from '../../_services/main.service';
import { Venta, Configuraciones } from './venta.interface';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/table';
import { PageEvent, Sort } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  ventaSelected: Venta;
  url: string = environment.apiUrl;
  datachange: BehaviorSubject<Venta[]>;
  get data(): Venta[] { return this.datachange.value };
  ventasLength: number;
  isLoadingVentas: boolean = true;

  constructor(public mainServ: MainService) { }

  getVentas() {
    this.datachange = new BehaviorSubject<Venta[]>([]);
    this.ventasLength = 0;
    this.isLoadingVentas = true;

    this.mainServ.http.get<Venta[]>(`${this.url}/ventasAPI/ventas`).
      pipe(
        take(1),
        map(res => {
          this.isLoadingVentas = false;
          this.ventasLength = res.length;
          return res;
        })
      ).subscribe((ventas: Venta[]) => {
        ventas.forEach((venta) => {
          const copiedData: Venta[] = this.data.slice();
          copiedData.push(venta);
          this.datachange.next(copiedData);
        });
      });
  }

  nuevaVenta(venta: Venta) {
    return this.mainServ.http.post<Venta>(`${this.url}/ventasAPI/venta`, venta)
      .pipe(
        map(res => res)
      );
  }

  getConfiguraciones() {
    return this.mainServ.http.get<any>(`${this.url}/ventasAPI/configuraciones`)
      .pipe(
        map(res => res)
      );
  }

  updateConfiguracion(configuracion: Configuraciones, id: string) {
    return this.mainServ.http.put<Configuraciones>(`${this.url}/ventasAPI/configuraciones/${id}`, configuracion)
      .pipe(
        map(res => res)
      );
  }

  addTableNewRow(venta: Venta) {
    const copiedData: Venta[] = this.data.slice();
    copiedData.push(venta);
    this.ventasLength = copiedData.length;
    this.datachange.next(copiedData);
  }
}

export class VentasDataSource extends DataSource<Venta> {

  pageChanges: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>({ length: 0, pageIndex: 0, pageSize: 10 });
  sortChanges: BehaviorSubject<Sort> = new BehaviorSubject<Sort>({ active: 'folio', direction: 'asc' });

  constructor(private ventasDatabase: VentasService) {
    super();
  }

  connect(): Observable<Venta[]> {
    return combineLatest(this.ventasDatabase.datachange, this.pageChanges, this.sortChanges)
      .pipe(
        map(res => this.processData(res[0], res[1], res[2]))
      )
  }

  disconnect() {
    this.ventasDatabase.datachange.complete();
    this.pageChanges.complete();
    this.sortChanges.complete();
  }

  processData(ventas: Venta[], currentPage: PageEvent, currentSort: Sort): Venta[] {
    const startIndex = currentPage.pageIndex * currentPage.pageSize;

    if (!currentSort.active || currentSort.direction == '') {
      return ventas.splice(startIndex, currentPage.pageSize);
    }

    return ventas.slice().sort((a: Venta, b: Venta) => {
      let isAsc = currentSort.direction == 'asc';
      switch (currentSort.active) {
        case 'folio': return this.compare(a.folio, b.folio, isAsc); 
        default: return 0;
      }
    }).splice(startIndex, currentPage.pageSize);
  }

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

