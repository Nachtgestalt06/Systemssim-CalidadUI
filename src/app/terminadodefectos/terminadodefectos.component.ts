import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import 'jquery';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TerminadoService} from '../services/terminado/terminado.service';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {Router} from '@angular/router';
import swal from 'sweetalert';

declare var $: any;

@Component({
  selector: 'app-terminadodefectos',
  templateUrl: './terminadodefectos.component.html',
  styleUrls: ['./terminadodefectos.component.css']
})
export class TerminadodefectosComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('clave') claveField: ElementRef;
  @ViewChild('nombre') nombreField: ElementRef;
  @ViewChild('clave_edit') claveFieldEdit: ElementRef;
  @ViewChild('nombre_edit') nombreFieldEdit: ElementRef;
  @ViewChild('descripcion_edit') descripcionFieldEdit: ElementRef;
  @ViewChild('tblDefectosTerminado') tblDefectos: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('fileInput') fileInput;

  selectedFile: ImageSnippet;
  selectedFileEdit;
  noMostrar = true;

  form: FormGroup;
  formEdit: FormGroup;
  formSearch: FormGroup;
  json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));

  defectos = [];
  idDefecto;

  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  urlImagen = '';

  constructor(private _toast: ToastrService,
              public _terminadoService: TerminadoService,
              public router: Router
  ) {
  }

  ngOnInit() {
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
    const mensaje = (this.router.url === '/quality/calidad-defectos' ? 'Calidad - Defectos' : 'Terminado - Defectos');
    this.initFormGroup();
    this.initFormGroupEdit();
    $('.tooltipped').tooltip();
    $('#modalNewDefectoTerminado').modal();
    $('#modalEditDefectoTerminado').modal();
    $('#modalEnableDefectoTerminado').modal();
    $('#lblModulo').text(mensaje);
    this.getDefectosTerminado();
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
      'Nombre': new FormControl(''),
      'Descripcion': new FormControl('', [Validators.required]),
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
      'IdUsuario': new FormControl(this.json_Usuario.ID),
      'Clave': new FormControl('', [Validators.required]),
      'Nombre': new FormControl(''),
      'Descripcion': new FormControl('', [Validators.required]),
      'Observaciones': new FormControl(''),
      'Imagen': new FormControl(''),
    });
  }

  NewDefectoTerminado() {
    console.log(this.form.value);
    if (this.form.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de defecto terminado', '');
      this.claveField.nativeElement.focus();
    } else if (this.form.get('Descripcion').invalid) {
      this._toast.warning('Se debe ingresar una descripción de defecto', '');
      this.nombreField.nativeElement.focus();
    }

    // this.form.get('Imagen').patchValue(($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src));

    this._terminadoService.createDefecto(this.form.value)
      .subscribe(
        (res: any) => {
          console.log('RESPUESTA DE CREATE DEFECTO TERMINADO: ', res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se agrego correctamente el defecto terminado', '');
            $('#modalNewDefectoTerminado').modal('close');
            this.getDefectosTerminado();
            this.initFormGroup();
            this.selectedFile = null;
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  getDefectosTerminado() {
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

    this._terminadoService.listDefectos(clave, defecto)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.defectos = res.Vst_Terminado;
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

  getInfoDefectoTerminado(id) {
    this._terminadoService.getDefecto(id)
      .subscribe(
        (res: any) => {
          this.updateTextFields();
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.formEdit.patchValue(res.Vst_Terminado);
            this.selectedFileEdit = res.Vst_Terminado.Imagen;
            console.log('SELECTED FILE', this.selectedFile);
            if (this.selectedFileEdit) {
              this.noMostrar = true;
            }
            this.updateTextFields();
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  editDefectoTerminado() {
    console.log(this.formEdit.value);
    if (this.formEdit.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de defecto terminado', '');
      this.claveFieldEdit.nativeElement.focus();
    } else if (this.formEdit.get('Descripcion').invalid) {
      this._toast.warning('Se debe ingresar una descripción de defecto', '');
      this.nombreFieldEdit.nativeElement.focus();
    }
    // this.formEdit.get('Imagen').patchValue(($('#blahEdit')[0].src === 'http://placehold.it/180' ? '' : $('#blahEdit')[0].src));
    this._terminadoService.updateDefecto(this.formEdit.value)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se modifico correctamente el defecto', '');
            $('#modalEditDefectoTerminado').modal('close');
            this.getDefectosTerminado();
            this.initFormGroupEdit();
            this.selectedFile = null;
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  GetEnabledDefectoTerminado() {
    this._terminadoService.inactivaActiva(this.idDefecto)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se inactivó correctamente el defecto', '');
            $('#modalEnableDefectoTerminado').modal('close');
            this.getDefectosTerminado();
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  eliminar(defecto) {
    console.log('eliminar: ', defecto);
    swal({
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
    })
      .then((willDelete) => {
        if (willDelete) {
          this._terminadoService.deleteDefecto(defecto.ID)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res.Message.IsSuccessStatusCode) {
                  this._toast.success('Defecto eliminado con exito', '');
                  this.getDefectosTerminado();
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
    this.idDefecto = id;
    console.log(this.idDefecto);
  }

  updateTextFields() {
    // this.nombreFieldEdit.nativeElement.focus();
    this.descripcionFieldEdit.nativeElement.focus();
    this.claveFieldEdit.nativeElement.focus();
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  processFile(imageInput: any, nuevo: boolean) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log(file);

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = event.target.result;
      // this.selectedFile.pending = true;
      nuevo ? this.form.get('Imagen').patchValue(event.target.result) : this.formEdit.get('Imagen').patchValue(event.target.result);
      this.noMostrar = false;
    });

    reader.readAsDataURL(file);
  }

  cancelarModal() {
    this.initFormGroup();
    this.initFormGroupEdit();
    this.selectedFileEdit = null;
    this.selectedFile = null;
    this.noMostrar = false;
  }
}

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {
  }
}
