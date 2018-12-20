import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, Output, EventEmitter } from '@angular/core';
import { formAnimation } from '../../../_animations/router.animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar, MatDialog, MatAutocompleteSelectedEvent, MatRadioChange } from '@angular/material';
import { Router } from '@angular/router';
import { VentasService } from '../ventas.service';
import { MainService } from '../../../_services/main.service';
import { Observable, Subscription } from 'rxjs';
import { BasicDialogComponent } from '../../_dialogs/basic-dialog/basic-dialog.component';
import { take, debounceTime, filter, switchMap, map, min } from 'rxjs/operators';
import { Configuraciones, Cliente, Articulos } from '../venta.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-captura-ventas',
  templateUrl: './captura-ventas.component.html',
  styleUrls: ['./captura-ventas.component.css'],
  animations: [formAnimation],
  host: { '[@formAnimation]': '' }

})
export class CapturaVentasComponent implements OnInit, OnDestroy {

  public title: string = "Resgitro de ventas";
  public ventaForm: FormGroup;
  public canDeactivateFlag: boolean = false;
  public changesSaved: boolean = false;
  _formChangesSub: Subscription;
  disabledSubmit: boolean = false;
  public guardarButton: boolean = false;
  url: string = environment.apiUrl;

  public configuraciones: Configuraciones;

  public idCliente: string;
  public clientesInputSub: Subscription;
  public clienteSpinner: boolean = false;
  public clientes: Cliente[];
  public rfcCliente: string;

  public articuloForm: FormGroup;
  public articulosInputSub: Subscription;
  public articuloSpinner: boolean = false;
  public articulos: Articulos[];
  public idArticulo: string;
  public articuloExistencia: number;
  public articuloSelected: Articulos;

  get detallesFA(): FormArray { return this.ventaForm.get('detalleVenta') as FormArray; };

  @ViewChildren('cantidadInputDetalle') cantidadInputDetalle !: QueryList<ElementRef>;
  public showSave: boolean = false;
  public mensualidades: any;

  @Output() change: EventEmitter<MatRadioChange>

  constructor(private fBuilder: FormBuilder, private snackBar: MatSnackBar,
    private dialog: MatDialog, private router: Router, public ventasServ: VentasService,
    public mainServ: MainService
  ) {

    this.ventaForm = this.fBuilder.group({
      folio: ["", Validators.required],
      cliente: ["", Validators.required],
      fecha: this.mainServ.moment().startOf('day'),
      estatus: "a",
      porcentajeEnganche: ["", Validators.required],
      enganche: [0, Validators.required],
      bonificacionEnganche: [0, Validators.required],
      total: [0, Validators.required],
      detalleVenta: this.fBuilder.array([]),
      abonos: ""
    });

    this.articuloForm = this.fBuilder.group({
      articulo: [""]
    });
  }

  ngOnInit() {
    this.getConfigs();
    this.getClientes();
    this.getArticulos();

    this._formChangesSub = this.ventaForm.valueChanges.subscribe(() => {
      this.canDeactivateFlag = true;
      this.disabledSubmit = false;
    });
  }

  ngOnDestroy() {
    this.clientesInputSub.unsubscribe();
    this.articulosInputSub.unsubscribe();
    this._formChangesSub.unsubscribe();
  }

  getErrorMessage(control: string) {
    return this.ventaForm.controls[control].hasError('required') ? 'Este campo es necesario.' : '';
  }

  getConfigs() {
    this.ventasServ.getConfiguraciones()
      .pipe(
        take(1)
      ).subscribe((res: any) => {
        if ('err' in res) {
          this.dialog.open(BasicDialogComponent, {
            data: {
              title: "Error!",
              content: res.err,
              buttons: [
                { text: "OK", closeRole: true, color: "primary" }
              ]
            }
          });
        } else {
          this.configuraciones = res;
          this.ventaForm.get('folio').patchValue(this.configuraciones.folioVenta);
        }
      });
  }

  getClientes() {
    this.clientesInputSub = this.ventaForm.controls['cliente'].valueChanges
      .pipe(
        debounceTime(500),
        filter(cliente => {
          this.clientes = [];
          return !!cliente;
        }),
        filter(cliente => {
          this.clientes = [];
          return cliente.length >= 3
        }),
        switchMap((cliente) => {
          this.clienteSpinner = true;
          return this.mainServ.http.get<Cliente[]>(`${this.url}/ventasAPI/clientes/${cliente}`)
        }),
        map(clientes => {
          this.clienteSpinner = false;
          return clientes;
        })
      ).subscribe((clientes: Cliente[]) => {
        this.clientes = clientes;
      });
  }

  getArticulos() {
    this.articulosInputSub = this.articuloForm.controls['articulo'].valueChanges
      .pipe(
        debounceTime(500),
        filter(articulo => {
          this.articulos = [];
          return !!articulo;
        }),
        filter(articulo => {
          this.articulos = [];
          return articulo.length >= 3
        }),
        switchMap((articulo) => {
          this.articuloSpinner = true;
          return this.mainServ.http.get<Articulos[]>(`${this.url}/ventasAPI/articulos/${articulo}`)
        }),
        map(articulos => {
          this.articuloSpinner = false;
          return articulos;
        })
      ).subscribe((articulos: Articulos[]) => {
        this.articulos = articulos;
      });
  }

  onSubmit() {
    if (this.ventaForm.valid) {
      this.ventaForm.get('cliente').patchValue(this.idCliente.trim());

      if (this.ventaForm.get('abonos').value == "") {
        this.dialog.open(BasicDialogComponent, {
          width: '320px',
          data: {
            title: "Atencion!",
            content: "Debe seleccionar un plazo para realizar el pago de su compra.",
            buttons: [
              { text: "OK", closeRole: true, color: "primary" }
            ]
          }
        });

        return;
      }

      this.ventasServ.nuevaVenta(this.ventaForm.value)
        .pipe(
          take(1)
        ).subscribe((res: any) => {
          if ('err' in res) {
            this.dialog.open(BasicDialogComponent, {
              data: {
                title: "Error!",
                content: res.err,
                buttons: [
                  { text: "OK", closeRole: true, color: "primary" }
                ]
              }
            });
          } else {
            this.ventasServ.addTableNewRow(res);

            this.configuraciones.folioVenta += 1;
            this.ventasServ.updateConfiguracion(this.configuraciones, this.configuraciones._id)
              .pipe(
                take(1)
              ).subscribe((res: any) => {
                this.changesSaved = true;
                this.router.navigate(['/ventas']).then(() => {
                  this.guardarButton = false;
                  this.snackBar.open('Bien hecho, tu venta a sido registrada correctamente!', 'OK', { duration: 2400 });
                });
              });
          }
        });
    }
  }

  onSiguiente() {
    if (this.ventaForm.invalid) {
      this.dialog.open(BasicDialogComponent, {
        width: '320px',
        data: {
          title: "Atencion!",
          content: "Los datos ingresados no son correctos, favor de verificar.",
          buttons: [
            { text: "OK", closeRole: true, color: "primary" }
          ]
        }
      });
    } else {
      this.buildMensualidades();
      this.showSave = true;
    }
  }

  setNombreCliente(cliente: Cliente) {
    return `${cliente._id} - ${cliente.nombreCompleto.nombres} ${cliente.nombreCompleto.apellidoPaterno} ${cliente.nombreCompleto.apellidoMaterno}`;
  }

  resetCliente() {
    this.ventaForm.controls['cliente'].reset();
    this.rfcCliente = undefined;
    this.idCliente = undefined
  }

  selectedCliente(event: MatAutocompleteSelectedEvent) {
    this.rfcCliente = event.option.id;
    this.idCliente = event.option.value.split("-")[0];
  }

  checkCliente() {
    setTimeout(() => {
      if (this.ventaForm.get('cliente').value == "") {
        this.rfcCliente = undefined;
        this.idCliente = undefined;
      }

      if (this.ventaForm.get('cliente').value == null) return;

      if (this.ventaForm.get('cliente').value != "" && this.idCliente == undefined) {
        this.snackBar.open(`El cliente ${this.ventaForm.get('cliente').value} no existe.`, 'OK', {
          duration: 3200
        });
      }
    }, 100);
  }

  addArticulo() {
    let msg: string = this.articuloForm.get('articulo').value == "" ? "Seleccione un articulo." :
      this.articuloForm.get('articulo').value == null ? "Seleccione un articulo" :
        !this.idArticulo ? "El articulo no es valido o no existe" :
          !this.articuloExistencia ? "El articulo seleccionado no cuenta con existencia, favor de verificar." : "";

    if (msg.length > 0) {
      this.snackBar.open(msg, 'OK', {
        duration: 3200
      });
    } else {
      this.addFA(this.articuloSelected, 1);
      this.resetArticulo();
    }
  }

  selectedArticulo(event: MatAutocompleteSelectedEvent) {
    this.idArticulo = event.option.id;

    let index: number = this.articulos.findIndex(x => x._id == this.idArticulo);
    this.articuloExistencia = this.articulos[index].existencia;
    this.articuloSelected = this.articulos[index];
  }

  checkArticulo() {
    setTimeout(() => {
      if (this.articuloForm.get('articulo').value == "") {
        this.idArticulo = undefined;
        this.articuloExistencia = undefined;
        this.articuloSelected = undefined;
      }

      if (this.articuloForm.get('articulo').value == null) return;

      if (this.articuloForm.get('articulo').value != "" && this.idArticulo == undefined) {
        this.snackBar.open(`El Articulo ${this.articuloForm.get('articulo').value} no existe.`, 'OK', {
          duration: 3200
        });
      }
    }, 100);
  }

  resetArticulo() {
    this.articuloForm.get('articulo').reset();
    this.idArticulo = undefined;
    this.articuloExistencia = undefined;
    this.articuloSelected = undefined;
  }

  addFA(articulo: Articulos, cantidad: number) {
    this.detallesFA.push(this.createFA(articulo, cantidad));
    setTimeout(() => {
      this.cantidadInputDetalle.toArray()[this.detallesFA.length - 1].nativeElement.focus();
      this.calculaEngancheBonificacionTotal();
    });
  }

  createFA(articulo: Articulos, cantidad: number) {
    let precio: number = articulo.precio * (1 + (this.configuraciones.tasaFinanciamiento * this.configuraciones.plazoMax) / 100);

    return this.fBuilder.group({
      articulo: this.fBuilder.group({
        descripcion: articulo.descripcion,
        modelo: articulo.modelo,
        precio: Number((precio).toFixed(2)),
        existencia: { value: articulo.existencia, disabled: true }
      }),
      cantidad: [cantidad, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)]],
      importe: [Number((precio).toFixed(2)) * cantidad, [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  calculaImporte(index: number, cantidad: number) {
    if (isNaN(cantidad)) {
      this.snackBar.open('Solo se permiten números', 'OK', {
        duration: 3200
      });

      this.detallesFA.at(index).get('cantidad').patchValue(1);
      this.detallesFA.at(index).get('importe').patchValue(1 * this.detallesFA.at(index).get('articulo').get('precio').value);
    } else {
      if (cantidad > this.detallesFA.at(index).get('articulo').get('existencia').value) {
        this.snackBar.open('La cantidad excede el inventario.', 'OK', {
          duration: 3200
        });

        this.detallesFA.at(index).get('cantidad').patchValue(1);
        this.detallesFA.at(index).get('importe').patchValue(1 * this.detallesFA.at(index).get('articulo').get('precio').value);
      } else {
        this.detallesFA.at(index).get('importe').patchValue(cantidad * this.detallesFA.at(index).get('articulo').get('precio').value);
      }
    }

    this.calculaEngancheBonificacionTotal();
  }

  removeDetalle(index: number) {
    this.detallesFA.removeAt(index);
    setTimeout(() => {
      this.calculaEngancheBonificacionTotal();
    });
  }

  calculaEngancheBonificacionTotal() {
    let importes: number = 0;
    let enganche: number = 0;
    let bonificacion: number = 0;

    this.detallesFA.controls.forEach(detalle => {
      importes += detalle.get('importe').value;
    });

    enganche = (this.configuraciones.porcientoEnganche / 100) * importes;
    bonificacion = enganche * ((this.configuraciones.tasaFinanciamiento * this.configuraciones.plazoMax) / 100);

    this.ventaForm.get('enganche').patchValue(Number((enganche).toFixed(2)));
    this.ventaForm.get('bonificacionEnganche').patchValue(Number((bonificacion).toFixed(2)))
    this.ventaForm.get('total').patchValue(Number((importes - enganche - bonificacion).toFixed(2)));
    this.ventaForm.get('porcentajeEnganche').patchValue(this.configuraciones.porcientoEnganche);
  }

  buildMensualidades() {
    let totalAdeudo: number = this.ventaForm.get('total').value;
    let precioContado: number = Number((totalAdeudo / (1 + ((this.configuraciones.tasaFinanciamiento * this.configuraciones.plazoMax) / 100))).toFixed(2))
    this.mensualidades = [
      {
        numero: 0,
        label: "Pago de contado",
        abono: precioContado,
        totalAPagar: precioContado,
        ahorro: Number((totalAdeudo - precioContado).toFixed(2))
      },
      {
        numero: 3,
        label: "3 abonos de",
        abono: Number((precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 3) / 100) / 3).toFixed(2)),
        totalAPagar: Number((precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 3) / 100)).toFixed(2)),
        ahorro: Number((totalAdeudo - precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 3) / 100)).toFixed(2))
      },
      {
        numero: 6,
        label: "6 abonos de",
        abono: Number((precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 6) / 100) / 6).toFixed(2)),
        totalAPagar: Number((precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 6) / 100)).toFixed(2)),
        ahorro: Number((totalAdeudo - precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 6) / 100)).toFixed(2))
      },
      {
        numero: 9,
        label: "9 abonos de",
        abono: Number((precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 9) / 100) / 9).toFixed(2)),
        totalAPagar: Number((precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 9) / 100)).toFixed(2)),
        ahorro: Number((totalAdeudo - precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 9) / 100)).toFixed(2))
      },
      {
        numero: 12,
        label: "12 abonos de",
        abono: Number((precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 12) / 100) / 12).toFixed(2)),
        totalAPagar: Number((precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 12) / 100)).toFixed(2)),
        ahorro: Number((totalAdeudo - precioContado * (1 + (this.configuraciones.tasaFinanciamiento * 12) / 100)).toFixed(2))
      }
    ];
  }

  onAbonosChange(event: MatRadioChange) {
    let index: number = this.mensualidades.findIndex(x => x.numero == event.value);

    const { abono, ahorro, totalAPagar, numero } = this.mensualidades[index];
    this.ventaForm.get('abonos').patchValue({
      numero: numero,
      abono: abono,
      totalAPagar: totalAPagar,
      ahorro: ahorro,
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.canDeactivateFlag && !this.changesSaved) {
      let dialogRef: any = this.dialog.open(BasicDialogComponent, {
        data: {
          title: "Atención!",
          content: "¿Desea descartar los cambios?",
          buttons: [
            { text: 'DESACUERDO', closeRole: false, color: 'primary' },
            { text: 'DE ACUERDO', closeRole: true, color: 'primary' }
          ]
        }
      });

      return dialogRef.afterClosed();
    }

    return true;
  }
}
