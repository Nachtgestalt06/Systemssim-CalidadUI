import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {DataTablesModule} from 'angular-datatables';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {ToastrModule} from 'ngx-toastr';
import {NavmenuComponent} from './navmenu/navmenu.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {UsuariosComponent} from './usuarios/usuarios.component';
import {ClientesComponent} from './clientes/clientes.component';
import {CorreoselectronicosComponent} from './correoselectronicos/correoselectronicos.component';
import {CorteComponent} from './corte/corte.component';
import {SegundasComponent} from './segundas/segundas.component';
import {TendidoComponent} from './tendido/tendido.component';
import {TipotendidoComponent} from './tipotendido/tipotendido.component';
import {MesaComponent} from './mesa/mesa.component';
import {DefectocorteComponent} from './defectocorte/defectocorte.component';
import {DefectoconfeccionComponent} from './defectoconfeccion/defectoconfeccion.component';
import {PosicioncorteComponent} from './posicioncorte/posicioncorte.component';
import {OperacionconfeccionComponent} from './operacionconfeccion/operacionconfeccion.component';
import {AreaconfeccionComponent} from './areaconfeccion/areaconfeccion.component';
import {PlantasComponent} from './plantas/plantas.component';
import {ProcesosespecialesdefectosComponent} from './procesosespecialesdefectos/procesosespecialesdefectos.component';
import {LavanderiadefectosComponent} from './lavanderiadefectos/lavanderiadefectos.component';
import {LavanderiaposicionComponent} from './lavanderiaposicion/lavanderiaposicion.component';
import {LavanderiaoperacionesComponent} from './lavanderiaoperaciones/lavanderiaoperaciones.component';
import {TerminadodefectosComponent} from './terminadodefectos/terminadodefectos.component';
import {ProcesosespecialesoperacionesComponent} from './procesosespecialesoperaciones/procesosespecialesoperaciones.component';
import {ProcesosespecialesposicionComponent} from './procesosespecialesposicion/procesosespecialesposicion.component';
import {ToleranciacorteComponent} from './toleranciacorte/toleranciacorte.component';
import {AuditoriacorteComponent} from './auditoriacorte/auditoriacorte.component';
import {AuditoriatendidoComponent} from './auditoriatendido/auditoriatendido.component';
import {AuditoriaconfeccionComponent} from './auditoriaconfeccion/auditoriaconfeccion.component';
import {AuditoriaprocesosespecialesComponent} from './auditoriaprocesosespeciales/auditoriaprocesosespeciales.component';
import {CatalogPageComponent} from './pages/catalog-page/catalog-page.component';
import {CutPageComponent} from './pages/cut-page/cut-page.component';
import {ConfectionPageComponent} from './pages/confection-page/confection-page.component';
import {GeneralPageComponent} from './pages/general-page/general-page.component';
import {ProcessesAndLaundryPageComponent} from './pages/processes-and-laundry-page/processes-and-laundry-page.component';
import {ReportsPageComponent} from './pages/reports-page/reports-page.component';
import {FinishedPageComponent} from './pages/finished-page/finished-page.component';
import {AdminPageComponent} from './pages/admin-page/admin-page.component';
import {TerminadoOperacionesComponent} from './terminado-operaciones/terminado-operaciones.component';
import {TerminadoPosicionComponent} from './terminado-posicion/terminado-posicion.component';
import {TerminadoOrigenComponent} from './terminado-origen/terminado-origen.component';
import {TerminadoAudiotoriaDefectosComponent} from './terminado-audiotoria-defectos/terminado-audiotoria-defectos.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CargaImagenesComponent} from './components/carga-imagenes/carga-imagenes.component';
import {NgDropFilesDirective} from './directives/ng-drop-files.directive';
import {EliminarComponent} from './dialogs/eliminar/eliminar.component';
import {MaterialModule} from './material/material.module';
import {AddEditOperacionTerminadoComponent} from './terminado-operaciones/add-edit-operacion-terminado/add-edit-operacion-terminado.component';
import {NumberPipePipe} from './pipes/number-pipe.pipe';
import {QualityPageComponent} from './pages/quality-page/quality-page.component';
import {CalidadAuditoriaComponent} from './calidad-auditoria/calidad-auditoria.component';
import {CalidadConsultaAuditoriaComponent} from './calidad-consulta-auditoria/calidad-consulta-auditoria.component';
import {TerminadoConsultaAuditoriaComponent} from './terminado-consulta-auditoria/terminado-consulta-auditoria.component';
import {DigitOnlyModule} from '@uiowa/digit-only';

import {registerLocaleData} from '@angular/common';
import localeMx from '@angular/common/locales/es-MX';
import {NumberFormatPipe} from './pipes/number-format.pipe';
import {MarcaClienteComponent} from './marca-cliente/marca-cliente.component';
import {AuditoriaLavanderiaComponent} from './auditoria-lavanderia/auditoria-lavanderia.component';
import {AuditoriaLavanderiaConsultaComponent} from './auditoria-lavanderia-consulta/auditoria-lavanderia-consulta.component';
import {AuditoriaProcesosConsultaComponent} from './auditoria-procesos-consulta/auditoria-procesos-consulta.component';
import {AuditoriaCorteConsultaComponent} from './auditoria-corte-consulta/auditoria-corte-consulta.component';
import {AuditoriaTendidoConsultaComponent} from './auditoria-tendido-consulta/auditoria-tendido-consulta.component';
import {AgregarTendidoComponent} from './auditoriacorte/agregar-tendido/agregar-tendido.component';
import {AgregarCorteComponent} from './auditoriacorte/agregar-corte/agregar-corte.component';
import {EditarCorteComponent} from './auditoriacorte/editar-corte/editar-corte.component';
import {EditarTendidoComponent} from './auditoriacorte/editar-tendido/editar-tendido.component';
import {AuditoriaConfeccionConsultaComponent} from './auditoria-confeccion-consulta/auditoria-confeccion-consulta.component';
import {ConsultaGeneralComponent} from './consulta-general/consulta-general.component';
import {CorteConsultaComponent} from './consulta-general/corte-consulta/corte-consulta.component';
import {ConfeccionConsultaComponent} from './consulta-general/confeccion-consulta/confeccion-consulta.component';
import {ProcesosConsultaComponent} from './consulta-general/procesos-consulta/procesos-consulta.component';
import {LavanderiaConsultaComponent} from './consulta-general/lavanderia-consulta/lavanderia-consulta.component';
import {TerminadoConsultaComponent} from './consulta-general/terminado-consulta/terminado-consulta.component';
import {ResumenConsultaComponent} from './consulta-general/resumen-consulta/resumen-consulta.component';
import {ReporteCorteComponent} from './reportes/reporte-corte/reporte-corte.component';
import {ReporteConfeccionComponent} from './reportes/reporte-confeccion/reporte-confeccion.component';
import {ReporteTerminadoComponent} from './reportes/reporte-terminado/reporte-terminado.component';
import {ReporteCostoCotizadoComponent} from './reportes/reporte-costo-cotizado/reporte-costo-cotizado.component';

// the second parameter 'fr' is optional
registerLocaleData(localeMx);

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    LoginComponent,
    HomeComponent,
    UsuariosComponent,
    ClientesComponent,
    CorreoselectronicosComponent,
    CorteComponent,
    TendidoComponent,
    TipotendidoComponent,
    MesaComponent,
    DefectocorteComponent,
    DefectoconfeccionComponent,
    PosicioncorteComponent,
    OperacionconfeccionComponent,
    AreaconfeccionComponent,
    SegundasComponent,
    PlantasComponent,
    ProcesosespecialesdefectosComponent,
    LavanderiadefectosComponent,
    LavanderiaoperacionesComponent,
    LavanderiaposicionComponent,
    TerminadodefectosComponent,
    ProcesosespecialesoperacionesComponent,
    ProcesosespecialesposicionComponent,
    ToleranciacorteComponent,
    AuditoriacorteComponent,
    AuditoriatendidoComponent,
    AuditoriaconfeccionComponent,
    AuditoriaprocesosespecialesComponent,
    CatalogPageComponent,
    CutPageComponent,
    ConfectionPageComponent,
    GeneralPageComponent,
    ProcessesAndLaundryPageComponent,
    ReportsPageComponent,
    FinishedPageComponent,
    AdminPageComponent,
    TerminadoOperacionesComponent,
    TerminadoPosicionComponent,
    TerminadoOrigenComponent,
    TerminadoAudiotoriaDefectosComponent,
    CargaImagenesComponent,
    NgDropFilesDirective,
    EliminarComponent,
    AddEditOperacionTerminadoComponent,
    NumberPipePipe,
    QualityPageComponent,
    CalidadAuditoriaComponent,
    CalidadConsultaAuditoriaComponent,
    TerminadoConsultaAuditoriaComponent,
    NumberFormatPipe,
    MarcaClienteComponent,
    AuditoriaLavanderiaComponent,
    AuditoriaLavanderiaConsultaComponent,
    AuditoriaProcesosConsultaComponent,
    AuditoriaCorteConsultaComponent,
    AuditoriaTendidoConsultaComponent,
    AgregarTendidoComponent,
    AgregarCorteComponent,
    EditarCorteComponent,
    EditarTendidoComponent,
    AuditoriaConfeccionConsultaComponent,
    ConsultaGeneralComponent,
    CorteConsultaComponent,
    ConfeccionConsultaComponent,
    ProcesosConsultaComponent,
    LavanderiaConsultaComponent,
    TerminadoConsultaComponent,
    ResumenConsultaComponent,
    ReporteCorteComponent,
    ReporteConfeccionComponent,
    ReporteTerminadoComponent,
    ReporteCostoCotizadoComponent,
  ],
  entryComponents: [
    AddEditOperacionTerminadoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    DataTablesModule,
    DigitOnlyModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    RouterModule.forRoot([
      {path: 'navmenu', component: NavmenuComponent},
      {path: 'login', component: LoginComponent},
      {path: 'home', component: HomeComponent},
      {
        path: 'admin', component: AdminPageComponent, children: [
          {path: '', redirectTo: 'usuarios', pathMatch: 'full'},
          {path: 'usuarios', component: UsuariosComponent}
        ]
      },
      {
        path: 'catalog', component: CatalogPageComponent, children: [
          {path: '', redirectTo: 'clientes', pathMatch: 'full'},
          {path: 'clientes', component: ClientesComponent},
          {path: 'correoselectronicos', component: CorreoselectronicosComponent},
          {path: 'segundas', component: SegundasComponent},
          {path: 'marca-cliente', component: MarcaClienteComponent}
        ]
      },
      {
        path: 'cut', component: CutPageComponent, children: [
          {path: '', redirectTo: 'corte', pathMatch: 'full'},
          {path: 'corte', component: CorteComponent},
          {path: 'defectocorte', component: DefectocorteComponent},
          {path: 'mesa', component: MesaComponent},
          {path: 'posicioncorte', component: PosicioncorteComponent},
          {path: 'tendido', component: TendidoComponent},
          {path: 'tipotendido', component: TipotendidoComponent},
          {path: 'toleranciacorte', component: ToleranciacorteComponent},
          {path: 'auditoriacorte', component: AuditoriacorteComponent},
          {path: 'auditoriacorte-consulta', component: AuditoriaCorteConsultaComponent},
          {path: 'auditoriatendido', component: AuditoriatendidoComponent},
          {path: 'auditoriatendido-consulta', component: AuditoriaTendidoConsultaComponent}
        ]
      },
      {
        path: 'confection', component: ConfectionPageComponent, children: [
          {path: '', redirectTo: 'defectoconfeccion', pathMatch: 'full'},
          {path: 'areaconfeccion', component: AreaconfeccionComponent},
          {path: 'defectoconfeccion', component: DefectoconfeccionComponent},
          {path: 'operacionconfeccion', component: OperacionconfeccionComponent},
          {path: 'plantas', component: PlantasComponent},
          {path: 'auditoriaconfeccion', component: AuditoriaconfeccionComponent},
          {path: 'auditoriaconfeccion-consulta', component: AuditoriaConfeccionConsultaComponent}
        ]
      },
      {
        path: 'general', component: GeneralPageComponent, children: []
      },
      {
        path: 'processes-and-laundry', component: ProcessesAndLaundryPageComponent, children: [
          {path: '', redirectTo: 'lavanderiadefectos', pathMatch: 'full'},
          {path: 'lavanderiadefectos', component: LavanderiadefectosComponent},
          {path: 'lavanderiaoperaciones', component: LavanderiaoperacionesComponent},
          {path: 'lavanderiaposicion', component: LavanderiaposicionComponent},
          {path: 'procesosespecialesdefectos', component: ProcesosespecialesdefectosComponent},
          {path: 'procesosespecialesoperaciones', component: ProcesosespecialesoperacionesComponent},
          {path: 'procesosespecialesposicion', component: ProcesosespecialesposicionComponent},
          {path: 'auditoriaprocesosespeciales', component: AuditoriaprocesosespecialesComponent},
          {path: 'auditorialavanderia', component: AuditoriaLavanderiaComponent},
          {path: 'auditorialavanderiaconsulta', component: AuditoriaLavanderiaConsultaComponent},
          {path: 'auditoriaprocesosespecialesconsulta', component: AuditoriaProcesosConsultaComponent},
        ]
      },
      {
        path: 'reports', component: ReportsPageComponent, children: [
          {path: '', redirectTo: 'consulta-general', pathMatch: 'full'},
          {path: 'consulta-general', component: ConsultaGeneralComponent},
          {path: 'reporte-corte', component: ReporteCorteComponent},
          {path: 'reporte-confeccion', component: ReporteConfeccionComponent},
          {path: 'reporte-terminado', component: ReporteTerminadoComponent},
          {path: 'costo-cotizado', component: ReporteCostoCotizadoComponent},
        ]
      },
      {
        path: 'finished', component: FinishedPageComponent, children: [
          {path: '', redirectTo: 'terminado-operaciones', pathMatch: 'full'},
          {path: 'terminadodefectos', component: TerminadodefectosComponent},
          {path: 'terminado-operaciones', component: TerminadoOperacionesComponent},
          {path: 'terminado-posicion', component: TerminadoPosicionComponent},
          {path: 'terminado-origen', component: TerminadoOrigenComponent},
          {path: 'terminado-auditoria-defectos', component: TerminadoAudiotoriaDefectosComponent},
          {path: 'terminado-auditoria-consulta', component: TerminadoConsultaAuditoriaComponent},
        ]
      },
      {
        path: 'quality', component: QualityPageComponent, children: [
          {path: '', redirectTo: 'calidad-operaciones', pathMatch: 'full'},
          {path: 'calidad-defectos', component: TerminadodefectosComponent},
          {path: 'calidad-operaciones', component: TerminadoOperacionesComponent},
          {path: 'calidad-posicion', component: TerminadoPosicionComponent},
          {path: 'calidad-origen', component: TerminadoOrigenComponent},
          {path: 'calidad-auditoria-registro', component: CalidadAuditoriaComponent},
          {path: 'calidad-auditoria-consulta', component: CalidadConsultaAuditoriaComponent},
        ]
      },
      {path: '**', redirectTo: ''}
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
