import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GMapModule } from 'primeng/gmap';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from 'primeng/inputnumber';
import { MapAuditComponent } from './map-audit.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {DropdownModule} from 'primeng/dropdown';
import { OrdersService } from 'src/app/services/order-service';
import { CompanyService } from 'src/app/services/company-service';
import { GoogleApiService } from 'src/app/services/google.api.service';
import {TimelineModule} from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

@NgModule({
  declarations: [
    MapAuditComponent
  ],
  imports: [
    GMapModule,
    MessagesModule,
    MessageModule,
    CheckboxModule,
    DropdownModule,
    FormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    ButtonModule,
    PanelModule,
    InputNumberModule,
    BreadcrumbModule,
    DialogModule,
    TimelineModule,
    CardModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, OrdersService, CompanyService, GoogleApiService],
  bootstrap: [],
  exports:[MapAuditComponent]
})

export class MapAuditModule { }