import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuditoriaCorteService} from '../../services/auditoria-corte/auditoria-corte.service';
import {MatTableDataSource} from '@angular/material';
import {forkJoin} from 'rxjs';
import {CorteService} from '../../services/corte/corte.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-agregar-corte',
  templateUrl: './agregar-corte.component.html',
  styleUrls: ['./agregar-corte.component.css']
})
export class AgregarCorteComponent implements OnInit, OnDestroy {
  @Input() otValida;
  @Input('ordenTrabajo') set ordenTrabajo(value) {
    console.log(value);
    this._ordenTrabajo = value;
    this.obtenerSeries(value);
  }
  @Output() Detalles = new EventEmitter();
  @Output() bloquearOT = new EventEmitter();

  private Det: Array<any> = [];
  private items: Array<any> = [];

  _ordenTrabajo: string;
  get ordenTrabajo(): string {
    return this._ordenTrabajo;
  }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'Serie', 'Bulto', 'Tendido', 'Tipo Tendido', 'Mesa', 'Posicion',
    'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo', 'Opciones'
  ];

  optionModule = [
    {value: 1, viewValue: 'Automático'},
    {value: 2, viewValue: 'Manual'},
    {value: 3, viewValue: 'Ambos'}
  ];

  tendidos = [];
  posiciones = [];
  defectos = [];
  mesas = [];
  bultos = [];
  series = [];

  selectedFile;
  valueChangesSerie$;
  form: FormGroup;

  constructor(private renderer: Renderer2,
              private _toast: ToastrService,
              private _auditoriaCorteService: AuditoriaCorteService,
              private _corteService: CorteService) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.obtenerCatalogos();
  }

  ngOnDestroy(): void {
    console.log('Estoy en ondestroy agregar-corte');
    this.valueChangesSerie$.unsubscribe();
  }

  initFormGroup() {
    this.form = new FormGroup({
      'IdCortador': new FormControl(),
      'Serie': new FormControl(null, Validators.required),
      'Bulto': new FormControl(null, Validators.required),
      'Tendido': new FormControl(null, Validators.required),
      'Mesa': new FormControl(null, Validators.required),
      'Posicion': new FormControl(null, Validators.required),
      'Defecto': new FormControl(null, Validators.required),
      'Cantidad': new FormControl(null, Validators.required),
      'Segundas': new FormControl(),
      'Nota': new FormControl(),
      'Imagen': new FormControl(),
      'Archivo': new FormControl(),
      'NombreArchivo': new FormControl()
    });

    this.valueChangesSerie$ = this.form.get('Serie').valueChanges
      .subscribe(
        serie => {
          if (serie) {
            if (this.otValida) {
              console.log(serie);
              this._auditoriaCorteService.getBultosByOTAndSerie(this._ordenTrabajo, serie.Series)
                .subscribe((bultos: any) => this.bultos = bultos.Bulto);
            }
          }
        }
      );
  }

  obtenerCatalogos() {
    const tendidos$ = this._corteService.listTendidos('', '', 'True');
    const posiciones$ = this._corteService.listPosiciones('', '', 'True');
    const defectos$ = this._corteService.listDefectos('', '', 'True');
    const mesas$ = this._corteService.listMesas('', '', 'True');

    forkJoin(tendidos$, posiciones$, defectos$, mesas$)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.tendidos = res[0].Vst_Cortadores;
          this.posiciones = res[1].Vst_Cortadores;
          this.defectos = res[2].Vst_Cortadores;
          this.mesas = res[3].Vst_Cortadores;
        }
      );
  }

  obtenerSeries(ot) {
    this._auditoriaCorteService.getSeries(ot)
      .subscribe((res: any) => {
        if (res.Message.IsSuccessStatusCode) {
          this.series = res.Serie;
        }
      });
  }

  ValidateAddCortadorAuditoria() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(field => { // {1}
        const control = this.form.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    if (this._ordenTrabajo !== '' && this.otValida) {
      this.bloquearOT.emit(true);
      const detalle = this.form.value;
      console.log('DETALLE: ', detalle);
      const detalleItem = {
        'Serie': detalle.Serie.Series,
        'Bulto': detalle.Bulto.Bulto,
        'IdTendido': detalle.Tendido.ID,
        'IdMesa': detalle.Mesa.ID,
        'IdPosicion': detalle.Posicion.ID,
        'IdDefecto': detalle.Defecto.ID,
        'Cantidad': +detalle.Cantidad,
        'Segundas': +detalle.Segundas,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      this.Detalles.emit(this.Det);
      const {Serie, Bulto, Tendido, Mesa, Posicion, Defecto, Cantidad, Nota, Imagen, Archivo} = detalle;
      const itemTable = {
        serie: Serie.Series,
        bulto: Bulto.Bulto,
        tendido: Tendido.Nombre,
        tipo_tendido: Tendido.TipoTendido,
        mesa: Mesa.Nombre,
        posicion: Posicion.Nombre,
        defecto: Defecto.Nombre,
        cantidad: Cantidad,
        nota: Nota,
        imagen: Imagen,
        archivo: Archivo
      };
      if (itemTable.tipo_tendido === 1) {
        itemTable.tipo_tendido = 'Automatico';
      } else if (itemTable.tipo_tendido === 2) {
        itemTable.tipo_tendido = 'Manual';
      } else {
        itemTable.tipo_tendido = 'Ambos';
      }
      this.items.push(itemTable);
      this.dataSource = new MatTableDataSource(this.items);
      this.initFormGroup();
      this.selectedFile = null;
    } else {
      this._toast.warning('Debe seleccionar una OT valida');
      const element = this.renderer.selectRootElement('#ddlOT');
      setTimeout(() => element.focus(), 0);
    }
  }

  eliminar(index) {
    this.Det.splice(index, 1);
    this.items.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.items);
  }

 // UTILERIAS
  processFile(imageInput: any, nuevo: boolean, tipo) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log(file);

    reader.addEventListener('load', (event: any) => {
      if (tipo === 'imagen') {
        this.form.get('Imagen').patchValue(event.target.result);
        this.selectedFile = event.target.result;
      } else if (tipo === 'archivo') {
        this.form.get('Archivo').patchValue(event.target.result);
      }
      // nuevo ? this.form.get('Imagen').patchValue(event.target.result) : this.formEdit.get('Imagen').patchValue(event.target.result);
    });
    reader.readAsDataURL(file);
  }

  openPdfInTab(archivo) {
    const base64ImageData = archivo;
    // let extension = this.base64MimeType(archivo);
    // console.log(extension);
    // data:application/pdf
    const contentType = `application/pdf`;

    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
  }

  openImage(imagen) {
    const base64ImageData = imagen;
    const extension = this.base64MimeType(imagen);
    console.log(extension);
    const contentType = `image/${extension}`;

    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
  }

  base64MimeType(encoded) {
    let result = null;

    if (typeof encoded !== 'string') {
      return result;
    }

    const mime = encoded.match(/data:image+\/([a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  }

}
