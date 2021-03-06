import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {PosicionTerminadoService} from '../services/terminado/posicion-terminado.service';
import 'jquery';
import {OrigenTerminadoService} from '../services/terminado/origen-terminado.service';
import {Router} from '@angular/router';
import swal from 'sweetalert';
declare var $: any;

@Component({
  selector: 'app-terminado-origen',
  templateUrl: './terminado-origen.component.html',
  styleUrls: ['./terminado-origen.component.css']
})
export class TerminadoOrigenComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('clave') claveField: ElementRef;
  @ViewChild('nombre') nombreField: ElementRef;
  @ViewChild('clave_edit') claveFieldEdit: ElementRef;
  @ViewChild('nombre_edit') nombreFieldEdit: ElementRef;
  @ViewChild('descripcion_edit') descripcionFieldEdit: ElementRef;
  @ViewChild('tblDefectosTerminado') tblDefectos: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  form: FormGroup;
  formEdit: FormGroup;
  formSearch: FormGroup;
  json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));

  idOrigen;
  origenes = [];

  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private _toast: ToastrService,
              public _terminadoOrigenService: OrigenTerminadoService,
              public router: Router) {
  }

  ngOnInit() {
    const mensaje = (this.router.url === '/quality/calidad-origen' ? 'Calidad - Origen' : 'Terminado - Origen');
    $('#lblModulo').text(mensaje);
    this.dtOptions = {
      language: {
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
    this.initFormGroup();
    this.initFormGroupEdit();
    $('.tooltipped').tooltip();
    $('#modalNewOrigenTerminado').modal();
    $('#modalEditOrigenTerminado').modal();
    $('#modalEnableOrigenTerminado').modal();
    this.getOrigenesTerminado();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  initFormGroup() {
    this.form = new FormGroup({
      'IdSubModulo': new FormControl(1),
      'IdUsuario': new FormControl(this.json_Usuario.ID),
      'Clave': new FormControl(null, [Validators.required]),
      'Nombre': new FormControl('', [Validators.required]),
      'Descripcion': new FormControl(''),
      'Observaciones': new FormControl(''),
      'Imagen': new FormControl(''),
    });

    this.formSearch = new FormGroup({
      'clave': new FormControl(''),
      'defecto': new FormControl('')
    });
  }

  initFormGroupEdit() {
    this.formEdit = new FormGroup({
      'ID': new FormControl(''),
      'Clave': new FormControl('', [Validators.required]),
      'Nombre': new FormControl('', [Validators.required]),
    });
  }

  NewOrigenTerminado() {
    console.log(this.form.value);
    if (this.form.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de posicion', '');
      this.claveField.nativeElement.focus();
    } else if (this.form.get('Nombre').invalid) {
      this._toast.warning('Se debe ingresar el campo posición', '');
      this.nombreField.nativeElement.focus();
    }

    this._terminadoOrigenService.createOrigen(this.form.value)
      .subscribe(
        (res: any) => {
          console.log('RESPUESTA DE CREATE POSICION TERMINADO: ', res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se agrego correctamente la posición', '');
            $('#modalNewOrigenTerminado').modal('close');
            this.getOrigenesTerminado();
            this.initFormGroup();
          } else {
            this._toast.warning('Ha ocurrido un error al agregar posición', '');
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  getOrigenesTerminado() {
    let clave = '';
    let defecto = '';
    if (this.formSearch.get('clave').value !== '' && this.formSearch.get('defecto').value === '') {
      clave = this.formSearch.get('clave').value;
    } else if (this.formSearch.get('clave').value === '' && this.formSearch.get('defecto').value !== '') {
      defecto = this.formSearch.get('defecto').value;
    } else {
      clave = this.formSearch.get('clave').value;
      defecto = this.formSearch.get('defecto').value;
    }

    this._terminadoOrigenService.listOrigenes(clave, defecto)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.origenes = res.c_origen_t;
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  getInfoOrigenTerminado(id) {
    this._terminadoOrigenService.getOrigen(id)
      .subscribe(
        (res: any) => {
          this.updateTextFields();
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.formEdit.patchValue(res.c_origen_t);
            this.updateTextFields();
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  editOrigenTerminado() {
    if (this.formEdit.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de posición', '');
      this.claveFieldEdit.nativeElement.focus();
    } else if (this.formEdit.get('Nombre').invalid) {
      this._toast.warning('Se debe ingresar el campo posición', '');
      this.nombreFieldEdit.nativeElement.focus();
    }
    this._terminadoOrigenService.updateOrigen(this.formEdit.value)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se agrego correctamente la posición', '');
            $('#modalEditOrigenTerminado').modal('close');
            this.getOrigenesTerminado();
            this.initFormGroupEdit();
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  GetEnabledOrigenTerminado() {
    this._terminadoOrigenService.inactivaActiva(this.idOrigen)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se inactivó correctamente el origen', '');
            $('#modalEnableOrigenTerminado').modal('close');
            this.getOrigenesTerminado();
          } else {
            const mensaje = res.Hecho.split(',');
            this._toast.warning(mensaje[0], mensaje[2]);
            $('#modalEnablePosicionTerminado').modal('close');
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  eliminar(origen) {
    console.log('eliminar: ', origen);
    swal({
      text: '¿Estas seguro de eliminar este origen?',
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
    })
      .then((willDelete) => {
        if (willDelete) {
          this._terminadoOrigenService.deleteOrigen(origen.ID)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res.Message.IsSuccessStatusCode) {
                  this._toast.success('Origen eliminado con exito', '');
                  this.getOrigenesTerminado();
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


  cambiarID(id) {
    this.idOrigen = id;
    console.log(this.idOrigen);
  }

  updateTextFields() {
    // this.nombreFieldEdit.nativeElement.focus();
    this.descripcionFieldEdit.nativeElement.focus();
    this.claveFieldEdit.nativeElement.focus();
  }

}
