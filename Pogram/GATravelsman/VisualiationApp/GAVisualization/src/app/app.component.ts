import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from './services/breadcrumb-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  
  items: MenuItem[] = [];
  menuItems: MenuItem[] = [];

  home!: MenuItem;
  subscription: Subscription = new Subscription;
  
  constructor(breadcrumbService: BreadcrumbService) {
    this.subscription = breadcrumbService.itemsHandler
    .subscribe((response) => {
      this.items = response;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
      this.items = [
        {label: ' Main Menu', icon: 'pi pi-map', routerLink:['/main-menu']},
        {label: ' Carrier Land Map', icon: 'pi pi-car', routerLink:['/carrier-land-audit']},
        {label: ' Air Map', icon: 'pi pi-telegram', routerLink:['/carrier-air-audit']}
      ];

      this.menuItems = [
        {label: ' Main Menu', icon: 'pi pi-map', routerLink:['/main-menu']},
        {label: ' Carrier Land Map', icon: 'pi pi-car', routerLink:['/carrier-land-audit'] },
        {label: ' Carrier Air Map', icon: 'pi pi-telegram', routerLink:['/carrier-air-audit']},
      ];

      this.home = {icon: 'pi pi-home', routerLink: '/'};
  }


}
