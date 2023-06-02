import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Carrier } from "src/app/models/carrier";
import { Order } from "src/app/models/order";
import { Point } from "src/app/models/point";
import { TruckType } from "src/app/models/truckType";
import { CarrierService } from "src/app/services/carrier.service";
import { OrdersService } from "src/app/services/order-service";
declare var google: any;

@Component({
    selector: 'client-order-map',
    templateUrl: './client-order-map.component.html',
    styleUrls: ['./client-order-map.component.scss']
  })
  
  export class ClientOrderMapComponent implements OnInit {

    @Input('path') path: any;
    @Input('isAir') isAir: any;
    @Output() closeEvent: EventEmitter<any> = new EventEmitter();

    map: any;
    options: any;
    overlays: any;
    dialogOriginVisible = false;
    dialogDestinationVisible = false;
    selectedOriginPosition: any;
    selectedDestinationPosition: any;
    markerTitle: any;
    volume: any;
    weight: any;
    productName: any;
    selectedCompany: any;
    companies:any;
    originAddress: any;
    destinationAddress: any;
    distance: any;
    departureDate: any;
    duration: any;
    arrivalDate: any;
    isFormDirty: any;
    directionsRenderer: any;
    deliveryPoint: Point[] =[];
    carriers: Carrier[] = [];
    selectedCarrier: any;

    constructor(private orderService:OrdersService, private carrierService: CarrierService) {
        this.directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    }

    isControlEmpty(name: string) {
        switch (name) {
            case "carrier": {
                this.isFormDirty = this.selectedCompany == null;
                return this.selectedCompany == null; 
            }
            case "departureDate": {
                this.isFormDirty = this.departureDate == null;
                return this.departureDate == null;
            }
            case "volume": {
                this.isFormDirty = this.volume == null;
                return this.volume == null;
            }
            case "weight": {
                this.isFormDirty = this.weight == null;
                return this.weight == null;
            }
            case "productName": {
                this.isFormDirty = this.productName == null;
                return this.productName == null;
            }
            default:
                return false;
        }
    }

    ngOnInit() {
        this.options = {
            center: {lat: 50.012741, lng: 36.243768},
            zoom: 15
        };
        this.overlays = [];
        this.companies = [
            { name: "AV Logistics", id:1 },
            { name: "DHL", id:2 },
            { name: "Nova Poshta", id:3 }
        ];
        this.carrierService.getAll().subscribe((carriers) => {
            this.carriers = carriers;
            this.carriers.forEach(x => {
                x.info = `${x.name} - Truck Type: ${TruckType[x.truckType]} - ${x.fuelConsumptionInLitersInTownPer100Km} litres per 100 km`;
            });
        });

    }

    setMap(event:any) {
        this.map = event.map;
    }

    addOriginMarker() {
        const icon = {
            url: `../assets/icons/postal-code.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
         
        let mark = new google.maps.Marker({position:{lat: this.selectedOriginPosition.lat(), lng: this.selectedOriginPosition.lng()}, 
            animation: google.maps.Animation.DROP,
            title: this.originAddress, icon: icon});

        let origin: Point = {id:0,x:this.selectedOriginPosition.lat(), y: this.selectedOriginPosition.lng(), address: this.originAddress, 
                    isOrigin: true, 
                    isDestination: false, geneticAlgoritmOrder: 0};
        this.deliveryPoint?.push(origin);
        
        this.overlays.push(mark);
        this.dialogOriginVisible = false;
    }

    addDestinationMarker() {
        const icon = {
            url: `../assets/icons/moving-company.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
         
        let mark = new google.maps.Marker({position:{lat: this.selectedDestinationPosition.lat(), lng: this.selectedDestinationPosition.lng()}, 
            animation: google.maps.Animation.DROP,
            title: this.originAddress, icon: icon});
        this.overlays.push(mark);
        let destination: Point = {id:0, x:this.selectedDestinationPosition.lat(), y: this.selectedDestinationPosition.lng(), 
            address: this.destinationAddress, 
            isOrigin: false,
            geneticAlgoritmOrder: 0,
            isDestination: true};
        this.deliveryPoint?.push(destination);
        this.dialogDestinationVisible = false;
    }

    saveOrder() {
        let order: Order = { productName: this.productName, deliveryPoints: this.deliveryPoint, weight: this.weight, volume: this.volume, 
            arrivalTime: this.arrivalDate,
            departureTime: this.departureDate, companyId: this.selectedCompany}
        this.orderService.addOrder(order).subscribe((order) => {
            this.closeEvent.emit();
        });
    }

    cancelOrder() {

    }

    setRoute(pointA:any, pointB:any) {
        let directionsService = new google.maps.DirectionsService();
        this.directionsRenderer.setMap(this.map);
       
        directionsService
        .route({
          origin: pointA,
          destination: pointB,
          // Note that Javascript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          travelMode: 'DRIVING'
        })
        .then((response:any) => {
            this.directionsRenderer.setDirections(response);
          this.distance = response.routes[0].legs[0].distance.text;
          this.duration = response.routes[0].legs[0].duration.text;
          let minutes = response.routes[0].legs[0].duration.value / 60;
          if (this.departureDate) {
            let arrival = new Date(this.departureDate);
            for (let i = 0; i < minutes; i++) {
                arrival.setTime(arrival.getTime() + 1 * 60000);
            }
            this.arrivalDate = arrival;
          }
        })
        .catch((e:any) => window.alert(e));
      }

    handleOverlayClick(event: any)  {

    }

    cancelDestination() {
        this.destinationAddress = null;
        this.selectedDestinationPosition = null;
        this.dialogDestinationVisible = false;
        this.directionsRenderer.setMap(null);
    }

    cancelOrigin() {
        this.originAddress = null;
        this.selectedOriginPosition = null;
        this.dialogOriginVisible = false;
    }

    handleMapClick(event: { latLng: any; }) {
        if (!this.selectedOriginPosition) {
            this.dialogOriginVisible = true;
            this.selectedOriginPosition = event.latLng;
            let geocoder = new google.maps.Geocoder();
            let latlng = new google.maps.LatLng(this.selectedOriginPosition.lat(), this.selectedOriginPosition.lng());
            geocoder.geocode({ 'latLng': latlng }, (results: { formatted_address: string; }[], status: any) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        this.originAddress = results[1].formatted_address
                    }
                }
            });
        } else {
            if (!this.dialogOriginVisible && !this.selectedDestinationPosition) {
                this.dialogDestinationVisible = true;
                this.selectedDestinationPosition = event.latLng;
                let geocoder = new google.maps.Geocoder();
                let latlng = new google.maps.LatLng(this.selectedDestinationPosition.lat(), this.selectedDestinationPosition.lng());
                geocoder.geocode({ 'latLng': latlng }, (results: { formatted_address: string; }[], status: any) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            this.destinationAddress = results[1].formatted_address
                        }
                    }
                });
                let pointA = {lat: this.selectedOriginPosition.lat(), lng: this.selectedOriginPosition.lng()};
                let pointB = {lat: this.selectedDestinationPosition.lat(), lng: this.selectedDestinationPosition.lng()};
                this.setRoute(pointA, pointB);
           }
        }
    }
  }