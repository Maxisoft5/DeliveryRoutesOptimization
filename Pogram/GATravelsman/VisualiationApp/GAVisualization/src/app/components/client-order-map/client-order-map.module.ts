import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { GMapModule } from "primeng/gmap";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { ClientOrderMapComponent } from "./client-order-map.component";
import {CalendarModule} from 'primeng/calendar';
import { OrdersService } from "src/app/services/order-service";
import { CarrierService } from "src/app/services/carrier.service";

@NgModule({
    declarations: [
      ClientOrderMapComponent
    ],
    imports: [
      GMapModule,
      MessagesModule,
      MessageModule,
      CheckboxModule,
      DropdownModule,
      FormsModule,
      InputTextModule,
      ButtonModule,
      InputNumberModule,
      BreadcrumbModule,
      DialogModule,
      CommonModule,
      CalendarModule,
      FormsModule
    ],
    providers: [OrdersService, CarrierService],
    bootstrap: [],
    exports:[ClientOrderMapComponent]
  })
  

  export class ClientOrderMapModule { }