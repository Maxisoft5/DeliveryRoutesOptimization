import { Component } from "@angular/core";
import { MessageService } from "primeng/api";

@Component({
    selector: 'main-nemu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss']
  })
  
  export class MainMenuComponent {

    path: any;
    msgs = [];
    constructor(private messageService: MessageService) {

    }

    onSave(closeFunc:any) {
    }

    
  }