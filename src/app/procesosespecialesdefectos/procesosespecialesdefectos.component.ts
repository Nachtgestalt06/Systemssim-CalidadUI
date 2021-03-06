import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Globals} from '../Globals';

declare var $: any;
declare var jQuery: any;
declare var M: any;
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl, FormGroup} from '@angular/forms';
import {ProcesosEspecialesService} from '../services/procesos-especiales/procesos-especiales.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-procesosespecialesdefectos',
  templateUrl: './procesosespecialesdefectos.component.html',
  styleUrls: ['./procesosespecialesdefectos.component.css']
})
export class ProcesosespecialesdefectosComponent implements OnInit, OnDestroy, AfterViewInit {
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

  formFilter: FormGroup;
  form: FormGroup;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  defectos = [];
  selectedFileEdit;
  noMostrar = true;

  displayedColumns: string[] = ['select', 'posicion', 'clave', 'nombre'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  dataSourceEdit = new MatTableDataSource<any>([]);
  displayedColumnsEdit: string[] = ['select', 'posicion', 'clave', 'nombre'];

  selectedFile;
  constructor(
    private _procesosServices: ProcesosEspecialesService,
    private _toast: ToastrService,
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewDefectoProcesosEspeciales').modal();
    $('#modalEditDefectoProcesosEspeciales').modal();
    $('#modalEnableDefectoProcesosEspeciales').modal();
    $('#lblModulo').text('Procesos Especiales - Defectos');
    this.initFormGroup();
    this.initFormGroupFilter();
    this.GetDefectosProcesosEspeciales();
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
      'IdUsuario': new FormControl(),
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(''),
      'Observaciones': new FormControl(''),
      'Imagen': new FormControl(),
    });
  }

  GetDefectosProcesosEspeciales() {
    this._procesosServices.listDefectos(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (res: any) => {
          if (res.Message.IsSuccessStatusCode) {
            console.log(res);
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.defectos = res.Vst_ProcesosEspeciales;
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

  GetEnabledDefectoProcesosEspeciales(id) {
    const options = {
      text: '¿Estas seguro de modificar este defecto?',
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
          this._procesosServices.inactivaActivaDefecto(id)
            .subscribe(
              res => {
                console.log(res);
                this._toast.success('Defecto actualizado con exito', '');
                this.GetDefectosProcesosEspeciales();
              },
              error => {
                console.log(error);
                this._toast.error('No se pudo establecer conexión a la base de datos', '');
              }
            );
        }
      });
  }

  NewDefectoProcesosEspeciales() {
    if ($('#CVE_NEW_PROCESOS_ESPECIALES').val() === '') {
      this._toast.warning('Se debe ingresar una clave de defecto cortador', '');
    } else if ($('#NOMBRE_NEW_PROCEOS_ESPECIALES').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de defecto cortador', '');
    // } else if ($('#OBSERVACIONES_NEW_PROCESOS_ESPECIALES').val() === '') {
    //   this._toast.warning('Se debe ingresar las observaciones del defecto procesos especiales', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'ProcesosEspeciales/ValidaProcesoEspecialSubModulo?SubModulo=27&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
        dataType: 'json',
        contents: 'application/json; charset=utf-8',
        method: 'get',
        async: false,
        success: function (json) {
          if (json.Message.IsSuccessStatusCode) {
            Result = json.Hecho;
          }
        },
        error: function () {
          console.log('No se pudo establecer conexión a la base de datos');
        }
      });
      if (Result) {
        let Mensaje = '';
        const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
        $.ajax({
          url: Globals.UriRioSulApi + 'ProcesosEspeciales/Defecto',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            IdSubModulo: 1,
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_NEW_PROCESOS_ESPECIALES').val(),
            Nombre: $('#NOMBRE_NEW_PROCESOS_ESPECIALES').val(),
            Descripcion: '',
            Observaciones: '',
            Imagen: ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto procesos especiales';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewDefectoProcesosEspeciales').modal('close');
        }
      } else {
        this._toast.warning('La clave de defecto procesos especiales ya se encuentra registrada en el sistema', '');
      }
    }
  }

  EditDefectoProcesosEspeciales() {
    if ($('#CVE_EDT_PROCESOS_ESPECIALES').val() === '') {
      this._toast.warning('Se debe ingresar una clave defecto procesos especiales', '');
    } else if ($('#CVE_EDT_DEFECTO_PROC_ESP').val() === '') {
      this._toast.warning('Se debe ingresar un nombre defecto cortador', '');
    } else if ($('#OBSERVACIONES_EDT_DEFECTO_PROC_ESP').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones de procesos especiales', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'ProcesosEspeciales/ValidaDefectoSubModuloProcesosEspeciales?SubModulo=27&Clave=' + $('#CVE_EDT_DEFECTO').val() + '&Nombre=' + $('#NOMBRE_EDT_DEFECTO').val(),
        dataType: 'json',
        contents: 'application/json; charset=utf-8',
        method: 'get',
        async: false,
        success: function (json) {
          if (json.Message.IsSuccessStatusCode) {
            Result = json.Hecho;
          }
        },
        error: function () {
          console.log('No se pudo establecer conexión a la base de datos');
        }
      });
      if (Result) {
        let Mensaje = '';
        const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
        $.ajax({
          url: Globals.UriRioSulApi + 'ProcesosEspeciales/ActualizaDefectoProcesosEspeciales',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            ID: $('#HDN_ID').val(),
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_EDT_DEFECTO_PROC_ESP').val(),
            Nombre: $('#NOMBRE_EDT_DEFECTO_PROC_ESP').val(),
            Descripcion: $('#DESCRIPCION_EDT_DEFECTO_PROC_ESP').val(),
            Observaciones: $('#OBSERVACIONES_EDT_DEFECTO_PROC_ESP').val(),
            Imagen: ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto proceso especial';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalEditDefectoProcesosEspeciales').modal('close');
        }
      } else {
        this._toast.warning('La clave defecto proceso especial ya se encuentra registrada en el sistema', '');
      }
    }
  }

  editDefecto(defecto) {
    console.log(defecto);
    this.form.patchValue(defecto);
    this.selectedFileEdit = defecto.Imagen;
    if (this.selectedFileEdit) {
      this.noMostrar = true;
    }
    setTimeout(() => M.updateTextFields(), 100);
  }

  EditDefectoProcesos() {
    console.log('EDITAR DEFECTO');
    this._procesosServices.updateDefecto(this.form.value)
      .subscribe(
        res => {
          console.log(res);
          this._toast.success('Defecto actualizado con exito', '');
          this.GetDefectosProcesosEspeciales();
          this.resetModalEdit();
          $('#modalEditDefectoProcesosEspeciales').modal('close');
        },
        error => {
          console.log(error);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  eliminar(defecto) {
    const options = {
      text: '¿Estas seguro de eliminar este defecto?',
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
        this._procesosServices.deleteDefecto(defecto.ID, 'Defecto')
          .subscribe(
            (res: any) => {
              console.log(res);
              if (res.Message.IsSuccessStatusCode) {
                this._toast.success('Defecto eliminado con exito', '');
                this.GetDefectosProcesosEspeciales();
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

  resetModalEdit() {
    this.initFormGroup();
    this.selectedFileEdit = null;
    this.selectedFile = null;
    this.noMostrar = false;
  }

  DisposeNewProcesosEspeciales() {
    $('#CVE_NEW_PROCESOS_ESPECIALES').val('');
    $('#NOMBRE_NEW_PROCEOS_ESPECIALES').val('');
    $('#DESCRIPCION_NEW_PROCESOS_ESPECIALES').val('');
    $('#OBSERVACIONES_NEW_PROCESOS_ESPECIALES').val('');
    $('#blah')[0].src = 'http://placehold.it/180';
  }

  processFile(imageInput: any, nuevo: boolean) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log(file);

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = event.target.result;
      // this.selectedFile.pending = true;
      nuevo ? this.form.get('Imagen').patchValue(event.target.result) : this.form.get('Imagen').patchValue(event.target.result);
      this.noMostrar = false;
    });

    reader.readAsDataURL(file);
  }

}
