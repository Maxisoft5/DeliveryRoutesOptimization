import { NgModule } from '@angular/core';
import { GMapModule } from 'primeng/gmap';
import { MainMenuComponent } from './main-menu.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import {CardModule} from 'primeng/card';
import { MapAuditModule } from '../map-audit/map-audit.module';
import { ClientOrderMapModule } from '../client-order-map/client-order-map.module';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [
    MainMenuComponent
  ],
  imports: [
    GMapModule,
    OverlayPanelModule,
    ButtonModule,
    CardModule,
    MapAuditModule,
    ClientOrderMapModule,
    MessagesModule,
    MessageModule
  ],
  providers: [MessageService],
  bootstrap: []
})

export class MainMenuModule { }