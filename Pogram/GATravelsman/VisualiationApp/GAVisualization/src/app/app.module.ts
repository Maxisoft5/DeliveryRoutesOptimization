import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app.component';
import { MapAuditComponent } from './components/map-audit/map-audit.component';
import { MapAuditAirComponent } from './components/map-audit-air/map-audit-air.component';
import { MapAuditModule } from './components/map-audit/map-audit.module';
import { MapAuditAirModule } from './components/map-audit-air/map-audit-air.module';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {MenubarModule} from 'primeng/menubar';
import { HttpClientModule } from '@angular/common/http';
import { MainMenuModule } from './components/main-menu/main-menu.module';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

const appRoutes: Routes = [
  { path: 'main-menu', component: MainMenuComponent},
  { path: 'carrier-land-audit', component: MapAuditComponent},
  { path: 'carrier-air-audit', component: MapAuditAirComponent}
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    MapAuditModule,
    MapAuditAirModule,
    HttpClientModule,
    BreadcrumbModule,
    MenubarModule,
    MainMenuModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
