import { NgModule } from "@angular/core";
import {TableModule} from 'primeng/table';
import { OrdersService } from "src/app/services/order-service";

@NgModule({
    declarations: [

    ],
    imports: [
      TableModule
    ],
    providers: [OrdersService],
    bootstrap: []
  })
  
  export class DrayCarrierOrdersModule { }