import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-lavanderiadefectos',
  templateUrl: './lavanderiadefectos.component.html',
  styleUrls: ['./lavanderiadefectos.component.css']
})
export class LavanderiadefectosComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewDefectoLavanderia').modal();
    $('#modalEditDefectoLavanderia').modal();
    $('#modalEnableDefectoLavanderia').modal();
    $('#lblModulo').text('Lavandería - Defectos');
  }

  GetDefectosLavanderia() {
    let sOptions = '';
    let _request = '';
    if ($('#CLAVE_CORTADOR').val() !== '' && $('#NOMBRE_CORTADOR').val() === '') {
      _request += '?Clave=' +  $('#CLAVE_CORTADOR').val();
    } else if ($('#NOMBRE_CORTADOR').val() !== '' && $('#CLAVE_CORTADOR').val() === '') {
      _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val();
    } else {
      _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val() + '?Clave=' +  $('#CLAVE_CORTADOR').val();
    }
    $.ajax({
      url: Globals.UriRioSulApi + 'Lavanderia/ObtieneDefectoLavanderia' + _request,
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let index = 1;
          for (let i = 0; i < json.Vst_Cortadores.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_Cortadores[i].ID + '); DisposeEditDefectoCortador(); GetInfoDefectoLavanderia();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditDefectoCortador" data-position="bottom" data-tooltip="Edita el defecto  seleccionado"><i class="material-icons right">edit</i></a></td>';
            sOptions += '<td>' + index + '</td>';
            sOptions += '<td>' + json.Vst_Cortadores[i].Clave + '</td>';
            sOptions += '<td>' + json.Vst_Cortadores[i].Nombre + '</td>';
            if (json.Vst_Cortadores[i].Activo) {
              sOptions += '<td style="text-align: center">SI</td>';
            } else {
              sOptions += '<td style="text-align: center">NO</td>';
            }
            if (json.Vst_Cortadores[i].Activo === true) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoCortador" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoCortador" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbDefectoLavanderia').html('');
          $('#tlbDefectoLavanderia').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbDefectoLavanderia').append('<thead><th></th><th>No.</th><th>Clave Defecto</th><th>Nombre Defecto</th><th>Estatus</th><th></th></thead>');
          $('#tlbDefectoLavanderia').DataTable({
            sorting: true,
            bDestroy: true,
            ordering: true,
            bPaginate: true,
            pageLength: 6,
            bInfo: true,
            dom: 'Bfrtip',
            processing: true,
            buttons: [
              'copyHtml5',
              'excelHtml5',
              'csvHtml5',
              'pdfHtml5'
             ]
          });
          $('.tooltipped').tooltip();
        }
      },
      error: function () {
        console.log('No se pudo establecer conexion a la base de datos');
      }
    });
  }

  GetEnabledDefectoLavanderia() {
    $.ajax({
      url: Globals.UriRioSulApi + 'Lavanderia/ActivaInactivaLavanderia?IdLavanderia=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableDefectoLavanderia').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetDefectosLavanderia();
  }

  NewDefectoLavanderia() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de defecto cortador', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de defecto cortador', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del defecto cortador', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Lavanderia/ValidaLavanderiaSubModulo?SubModulo=17&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
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
          url: Globals.UriRioSulApi + 'Lavanderia/NuevoDefectoLavanderia',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            IdSubModulo: 1,
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_NEW_CORTADOR').val(),
            Nombre: $('#NOMBRE_NEW_CORTADOR').val(),
            Descripcion: $('#DESCRIPCION_NEW_CORTADOR').val(),
            Observaciones: $('#OBSERVACIONES_NEW_CORTADOR').val(),
            Imagen:  ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto cortador';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewDefectoLavanderia').modal('close');
        }
      } else {
        this._toast.warning('La clave de defecto cortador ya se encuentra registrada en el sistema', '');
      }
    }
  }

  EditDefectoLavanderia() {
    if ($('#CVE_EDT_DEFECTO').val() === '') {
      this._toast.warning('Se debe ingresar una clave defecto cortador', '');
    } else if ($('#NOMBRE_EDT_DEFECTO').val() === '') {
      this._toast.warning('Se debe ingresar un nombre defecto cortador', '');
    } else if ($('#OBSERVACIONES_EDT_DEFECTO').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del cortador', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Lavanderia/ValidaLavanderiaSubModulo?SubModulo=17&Clave=' + $('#CVE_EDT_DEFECTO').val() + '&Nombre=' + $('#NOMBRE_EDT_DEFECTO').val(),
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
          url: Globals.UriRioSulApi + 'Lavanderia/ActualizaDefectoLavanderia',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            ID: $('#HDN_ID').val(),
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_EDT_DEFECTO').val(),
            Nombre: $('#NOMBRE_EDT_DEFECTO').val(),
            Descripcion: $('#DESCRIPCION_EDT_DEFECTO').val(),
            Observaciones: $('#OBSERVACIONES_EDT_DEFECTO').val(),
            Imagen: ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto cortador';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalEditDefectoLavanderia').modal('close');
        }
      } else {
        this._toast.warning('La clave defecto cortador ya se encuentra registrada en el sistema', '');
      }
    }
  }

  DisposeNewDefectoLavanderia() {
    $('#CVE_NEW_CORTADOR').val('');
    $('#NOMBRE_NEW_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
    $('#blah')[0].src = 'http://placehold.it/180';
  }

}