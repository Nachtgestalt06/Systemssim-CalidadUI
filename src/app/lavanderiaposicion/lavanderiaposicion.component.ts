import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Globals} from '../Globals';

declare var $: any;
declare var jQuery: any;
import 'jquery';
import {ToastrService} from '../../../node_modules/ngx-toastr';
import {FormControl, FormGroup} from '@angular/forms';
import {LavanderiaService} from '../services/lavanderia/lavanderia.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import swal from 'sweetalert';
import {map, tap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

declare var M: any;

@Component({
  selector: 'app-lavanderiaposicion',
  templateUrl: './lavanderiaposicion.component.html',
  styleUrls: ['./lavanderiaposicion.component.css']
})
export class LavanderiaposicionComponent implements OnInit, OnDestroy, AfterViewInit {
  dtOptions = {
    language: {
      // pageLength: 6,
      processing: 'Procesando...',
      search: 'Buscar:',
      lengthMenu: 'Mostrar _MENU_ elementos',
      info: '_START_ - _END_ de _TOTAL_ elementos',
      infoEmpty: 'Mostrando ningún elemento.',
      infoFiltered: '(filtrado _MAX_ elementos total)',
      infoPostFix: '',
      loadingRecords: 'Cargando registros...',
      zeroRecords: 'No se encontraron registros',
      emptyTable: 'No hay datos disponibles en la tabla',
      paginate: {
        first: 'Primero',
        previous: 'Anterior',
        next: 'Siguiente',
        last: 'Último'
      },
    }
  };
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  displayedColumns: string[] = ['select', 'posicion', 'clave', 'nombre'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  dataSourceEdit = new MatTableDataSource<any>([]);
  displayedColumnsEdit: string[] = ['select', 'posicion', 'clave', 'nombre'];

  posiciones = [];
  idOperacion;
  formFilter: FormGroup;
  form: FormGroup;

  constructor(
    private _lavanderiaService: LavanderiaService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewPosicionLavanderia').modal();
    $('#modalEditPosicionLavanderia').modal();
    $('#modalEnablePosicionProcesosEspeciales').modal();
    $('#lblModulo').text('Procesos Especiales - Posición');
    this.initFormGroupFilter();
    this.initFormGroup();
    this.GetPosicionLavanderia();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  initFormGroupFilter() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  initFormGroup() {
    this.form = new FormGroup({
      'ID': new FormControl(),
      'IdSubModulo': new FormControl(),
      'IdUsuario': new FormControl(),
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(),
      'Observaciones': new FormControl(),
      'Imagen': new FormControl(''),
      'Operacion': new FormControl()
    });
  }

  GetPosicionLavanderia() {
    // let _request;
    this._lavanderiaService.listPosiciones(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (res: any) => {
          if (res.Message.IsSuccessStatusCode) {
            console.log(res);
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.posiciones = res.Vst_Lavanderia;
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          }
        },
        error => {
          console.log(error);
          this._toast.error('No se pudo establecer conexion a la base de datos', '');
        }
      );
  }

  GetEnabledPosicionLavanderia(id) {
    const options = {
      text: '¿Estas seguro de modificar esta operación?',
      buttons: {
        cancel: {
          text: 'Cancelar',
          closeModal: true,
          value: false,
          visible: true
        },
        confirm: {
          text: 'Aceptar',
          value: true,
        }
      }
    };
    swal(options)
      .then((willDelete) => {
        if (willDelete) {
          this._lavanderiaService.inactivaActivaPosicion(id)
            .subscribe(
              res => {
                console.log(res);
                this._toast.success('Operación actualizada con exito', '');
                this.GetPosicionLavanderia();
              },
              error => {
                console.log(error);
                this._toast.error('No se pudo establecer conexión a la base de datos', '');
              }
            );
        }
      });

  }

  editPosicion() {
    const payload = this.form.value;
    payload.Operacion = this.selection.selected;
    this._lavanderiaService.updatePosicion(payload)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Posición actualizada con exito', '');
            $('#modalEditPosicionLavanderia').modal('close');
            this.GetPosicionLavanderia();
          } else {
            this._toast.warning('Algo no ha salido bien', '');
          }
        },
        error => {
          console.log(error);
          this._toast.error('Error al conectar a la base de datos', '');
        }
      );
  }

  eliminar(posicion) {
    const options = {
      text: '¿Estas seguro de eliminar esta posición?',
      buttons: {
        cancel: {
          text: 'Cancelar',
          closeModal: true,
          value: false,
          visible: true
        },
        confirm: {
          text: 'Aceptar',
          value: true,
        }
      }
    };
    swal(options).then((willDelete) => {
      if (willDelete) {
        this._lavanderiaService.deleteDefecto(posicion.ID, 'Posicion')
          .subscribe(
            (res: any) => {
              console.log(res);
              if (res.Message.IsSuccessStatusCode) {
                this._toast.success('Posición eliminada con exito', '');
                this.GetPosicionLavanderia();
              } else {
                const mensaje = res.Hecho.split(',');
                this._toast.warning(mensaje[0], mensaje[2]);
              }
            },
            error => {
              console.log(error);
              this._toast.error('Error al conectar a la base de datos', '');
            }
          );
      }
    });
  }

  NewPosicionLavanderia() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición de procesos especiales', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de posición de procesos especiales', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones de posición de procesos especiales', '');
    } else {
      const json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
      this.form.controls['IdUsuario'].patchValue(json_Usuario.ID);
      console.log('SELECCIONADOS: ', this.selection.selected);
      this.form.controls['Operacion'].patchValue(this.selection.selected);
      this._lavanderiaService.createPosicion(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Posición guardada con exito', '');
              $('#modalNewPosicionLavanderia').modal('close');
              this.GetPosicionLavanderia();
            } else {
              this._toast.warning('Algo no ha salido bien', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          });
    }
  }

  DisposeNewPosicionProcesosEspeciales() {
    $('#CLAVE_CORTADOR').val('');
    $('#NOMBRE_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
  }

  getOperacionesActivas() {
    this.initFormGroup();
    this.selection = new SelectionModel(true, []);
    this._lavanderiaService.listOperaciones('', '', 'True')
      .pipe(
        map((res: any) => {
            res.Vst_Lavanderia.forEach(x => {
              delete x.Imagen;
            });
            return res;
          }
        ),
        tap(res => console.log('Despues de eliminar imagen: ', res))
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.dataSource = new MatTableDataSource(res.Vst_Lavanderia);
        }
      );
  }

  getDetalle(id) {
    this.idOperacion = id;
    this._lavanderiaService.listOperaciones('', '', 'True')
      .subscribe(
        (res: any) => {
          console.log(res);
          this.dataSourceEdit = new MatTableDataSource(res.Vst_Lavanderia);
          this.selection = new SelectionModel(true, []);
          this._lavanderiaService.getPosicion(id)
            .subscribe(
              (res: any) => {
                console.log(res);
                this.form.patchValue(res.Vst_Lavanderia);
                setTimeout(() => M.updateTextFields(), 100);
                const defectos = res.Operacion;
                const copyDataSourceEdit = [];
                this.dataSourceEdit.data.forEach((x, i) => {
                  defectos.forEach(y => {
                    console.log('Operaciones:', x);
                    console.log('Y:', y);
                    if (y.Clave === x.Clave) {
                      copyDataSourceEdit.push(x);
                    }
                  });
                });
                console.log('Seleccion: ', copyDataSourceEdit);
                this.selection = new SelectionModel(true, copyDataSourceEdit);
              }
            );
        }
      );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
