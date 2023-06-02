import { Component, OnInit } from '@angular/core';
import { withModule } from '@angular/core/testing';
import { MessageService, PrimeIcons } from 'primeng/api';
import { CalculatedRouteModel } from 'src/app/models/calculatedRouteModel';
import { Carrier } from 'src/app/models/carrier';
import { DeliveryPath } from 'src/app/models/deliverPath';
import { DeliveryPoint } from 'src/app/models/delivery-point';
import { DirectionResponse } from 'src/app/models/direction.response';
import { Order } from 'src/app/models/order';
import { Point } from 'src/app/models/point';
import { TruckType } from 'src/app/models/truckType';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service';
import { CarrierService } from 'src/app/services/carrier.service';
import { CompanyService } from 'src/app/services/company-service';
import { GoogleApiService } from 'src/app/services/google.api.service';
import { OrdersService } from 'src/app/services/order-service';
declare var google: any;

@Component({
  selector: 'map-audit',
  templateUrl: './map-audit.component.html',
  styleUrls: ['./map-audit.component.scss']
})

export class MapAuditComponent implements OnInit {
  
  options: any;
  overlays: any;
  dialogVisible: boolean = false;
  selectedPosition: any;
  markerTitle: any;
  infoWindow: any;
  draggable: boolean = false;
  generations: number = 0;
  populations: number = 0;
  mutations: number = 0;
  isInversion: any;
  generationsError: boolean = false;
  populationsError: boolean = false;
  points: Point[] = [];
  markersNums: Map<number,string> = new Map<number,string>();
  pointLines: Map<string, number> = new Map<string, number>();
  pathSum:number = 0;
  shortestPath: [number[], number] = [[], 0];
  currentPaths: Map<number[], number> = new Map<number[], number>();
  totallPaths: Map<number[], number> = new Map<number[], number>();
  crossoverPercent = 60;
  totalOrders: Order[] = [];
  selectedPath: any;
  display: boolean = false;
  savedPathName: string = "";
  map: any;
  algoritms: any;
  selectedAlgorithm: any;
  compaines: any;
  selectedCompany: any;
  companyOrders: Order[] = [];
  companyLocationDictionary: Map<string, [number, number]> | undefined;
  depoPoint = {lat: 50.005869, lng: 36.234519 };
  depoDeliveryPoint: DeliveryPoint = {id: 0, address:'', isDestination: false, isOrigin: false, x: 0, y:0, algorithmOrder:0};
  directionsRenderers: any[] = [];
  directionService: any;
  requestCount: number = 1;
  totalDistance: number = 0;
  totalTime: number = 0;
  carriers: Carrier[] = [];
  selectedCarrier: any;
  companiesOrdersPaths: DeliveryPath[] = [];
  googleApiRequestCount = 0;
  requestTimeOut = 100;
  events: any[] = [];
  defaultRoutePoints: Point[] = [];
  geneticAlgorithmResultsPoints: Point[][] = [];
  isMapLoading:boolean = false;
  savedRoutes: CalculatedRouteModel[] = [];
  selectedRoute: any;
  currentRoute: any;

  constructor(private messageService: MessageService, 
        private breadcrumbService: BreadcrumbService,
        private orderService: OrdersService,
        private carrierService: CarrierService,
        private googleApiService: GoogleApiService,
        private companyService: CompanyService) {
    this.breadcrumbService.setItems([
        { label: ' Map-audit', icon: 'pi pi-map', routerLink:['/map-audit'] },
      ]);
    this.algoritms = [
      {name:"Genetic", id:1}
    ];
    this.compaines = [
      { name: "AV Logistics", id:1 },
      { name: "DHL", id:2 },
      { name: "Nova Poshta", id:3 },
    ];
    this.selectedCompany = this.compaines[0];
   
  }

  ngOnInit() {
    this.options = {
        center: {lat: 50.012741, lng: 36.243768},
        zoom: 15
    };
    this.infoWindow = new google.maps.InfoWindow();
    this.overlays = [];
    this.initDepo();
    if (this.selectedCompany) {
      this.orderService.getOrdersByCarrier(this.selectedCompany).subscribe((orders) => {
        this.companyOrders = orders;
        this.loadOrders();
      });
    }
    this.directionService = new google.maps.DirectionsService()
    this.loadSessionRoutes();
    this.carrierService.getAll().subscribe((carriers) => {
      this.carriers = carriers;
      this.carriers.forEach(x => {
        x.info = `${x.name} - Truck Type: ${TruckType[x.truckType]} - ${x.fuelConsumptionInLitersInTownPer100Km} litres per 100 km`;
      });
      this.selectedCarrier = carriers[0];
    });
  }

  setMap(event:any) {
    this.map = event.map;
  }

  getOrders() {
    this.orderService.getOrdersByCarrier(this.selectedCompany).subscribe((orders) => {
      this.companyOrders = orders;
      this.loadOrders();
      this.orderService.getDeliveryPathsByCarrier(this.selectedCarrier).subscribe((paths) => {
        this.companiesOrdersPaths = paths;
      })
    });
  }

  loadDistanceAndDurationForOrders() {
    let locations:Point[] = [];
    this.companyOrders.forEach(o => {
      o.deliveryPoints.forEach(p => {
        locations.push(p);
      });
    });
  }

  initDepo() {
    const icon = {
      url: `../assets/icons/post-office.svg`, // url
          scaledSize: new google.maps.Size(40, 40)};
      let mark = new google.maps.Marker({position:{lat: this.depoPoint.lat, lng: this.depoPoint.lng}, 
          animation: google.maps.Animation.DROP,
          title: 'Post office', icon: icon});
      this.overlays.push(mark);
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(this.depoPoint.lat, this.depoPoint.lng);
      geocoder.geocode({ 'latLng': latlng }, (results: { formatted_address: string; }[], status: any) => {
          if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                  this.depoDeliveryPoint.address = results[1].formatted_address;
              }
          }
      });
  }

  loadTimeLine(points: Point[]) {
    this.events = [ {status: this.depoDeliveryPoint.address, icon: "pi pi-envelope", info: "Post Office"}];
    points.forEach(x => {
      if (x.isOrigin) {
        let event = {status: x.address, icon: "pi pi-map-marker", info: "Origin"};
        this.events.push(event);
      } else {
        let event = {status: x.address, icon: "pi pi-car", info: "Destination"};
        this.events.push(event);
      }
    });
    this.events.push({status: this.depoDeliveryPoint.address, icon: "pi pi-envelope", info: "Post Office"});
  }

  loadSessionRoutes() {
    let routes = sessionStorage.getItem('savedRoutes');
    if (routes) {
      this.savedRoutes = JSON.parse(routes);
      // let event = {value: this.savedRoutes[0].deliveryPaths}; 
      // this.onSaveRouteChange(event);
    }
  }

  getDefaultRoute() {
    let generationResults: Point[][][] = [];
    let test: Point[][] = [];
    let defaultPath = this.initDefaultPath();
    test.push(defaultPath);
    generationResults.push(test);
    this.isMapLoading = true;
    this.googleApiService.getCalculatedDefaultPathsForOrders(generationResults).subscribe((res) => {
      this.isMapLoading = false;
      let minValue: CalculatedRouteModel = res[0];
      this.selectedRoute = minValue;
      this.currentRoute = minValue;
      this.selectedRoute.name = `Time: ${(this.selectedRoute.durationSumm / 60).toFixed(2)} minutes, ${(this.selectedRoute.durationSumm / 60 / 60).toFixed(2)} minutes, Distance: ${this.selectedRoute.distanceSumm / 1000} km`;
      this.totalDistance = minValue.distanceSumm / 1000;
      this.totalTime = minValue.durationSumm / 60 / 60;
    });
    this.clearMarkers();
    this.initDepo();
    this.setRoute({lat: this.depoPoint.lat, lng: this.depoPoint.lng}, {lat: defaultPath[0].x, lng: defaultPath[0].y} );
    for (let i=0; i < defaultPath.length-1; i++) {
      this.sleep(i*1000).then(() => {
      if (defaultPath[i].isOrigin) {
        const icon = {
          url: `../assets/icons/postal-code.svg`, // url
              scaledSize: new google.maps.Size(40, 40)};
          let mark = new google.maps.Marker({position:{lat: defaultPath[i].x, lng: defaultPath[i].y}, 
              animation: google.maps.Animation.DROP,
              title: defaultPath[i].address, icon: icon});
          this.overlays.push(mark);
      }
      if (defaultPath[i].isDestination) {
        const icon = {
          url: `../assets/icons/moving-company.svg`, // url
              scaledSize: new google.maps.Size(40, 40)};
          let mark = new google.maps.Marker({position:{lat: defaultPath[i].x, lng: defaultPath[i].y}, 
              animation: google.maps.Animation.DROP,
              title: defaultPath[i].address, icon: icon});
          this.overlays.push(mark);
      }
      if (!this.defaultRoutePoints.some(x => x.address == defaultPath[i].address)) {
        this.defaultRoutePoints.push(defaultPath[i]);
      } 
      if (!this.defaultRoutePoints.some(x => x.address == defaultPath[i+1].address)) {
        this.defaultRoutePoints.push(defaultPath[i+1]);
      } 
      if (i == defaultPath.length -2) {
        const icon = {
          url: `../assets/icons/moving-company.svg`, // url
              scaledSize: new google.maps.Size(40, 40)};
          let mark = new google.maps.Marker({position:{lat: defaultPath[i+1].x, lng: defaultPath[i+1].y}, 
              animation: google.maps.Animation.DROP,
              title: defaultPath[i+1].address, icon: icon});
          this.overlays.push(mark);
        this.loadTimeLine(this.defaultRoutePoints);
      }
      this.setRoute({lat: defaultPath[i].x, lng: defaultPath[i].y}, {lat: defaultPath[i+1].x, lng: defaultPath[i+1].y} );
     });
    }
    this.setRoute({lat: defaultPath[defaultPath.length-1].x, lng: defaultPath[defaultPath.length-1].y}, {lat: this.depoPoint.lat, lng: this.depoPoint.lng} );
  }

  loadOrders() {
    let totalPoints: Point[] = [];
    this.companyOrders.forEach(x => {
      if (x.deliveryPoints) {
        x.deliveryPoints.forEach(point => {
          totalPoints.push(point);
          if (point.isOrigin) {
            const icon = {
              url: `../assets/icons/postal-code.svg`, // url
                  scaledSize: new google.maps.Size(40, 40)};
              let mark = new google.maps.Marker({position:{lat: point.x, lng: point.y}, 
                  animation: google.maps.Animation.DROP,
                  title: point.address, icon: icon});
              this.overlays.push(mark);
          } 
          if (point.isDestination) {
            const icon = {
              url: `../assets/icons/moving-company.svg`, // url
                  scaledSize: new google.maps.Size(40, 40)};
              let mark = new google.maps.Marker({position:{lat: point.x, lng: point.y}, 
                  animation: google.maps.Animation.DROP,
                  title: point.address, icon: icon});
              this.overlays.push(mark);
            }
        });
        if (x.deliveryPoints.length == 2) {
           this.setRoute({lat: x.deliveryPoints[0].x, lng: x.deliveryPoints[0].y}, {lat: x.deliveryPoints[1].x, lng: x.deliveryPoints[1].y} );
        }
      }
    });
  }
 
  handleMapClick(event: { latLng: any; }) {
    this.dialogVisible = true;
    this.selectedPosition = event.latLng;
  }

  addMarker() {
    if (this.overlays.filter((x: { anchorPoint: any; }) => x.anchorPoint).length == 11) {
      this.overlays = [];
    }
    const icon = {
      url: `../assets/icons/num${this.overlays.filter((x: { anchorPoint: any; }) => x.anchorPoint).length+1}.png`, // url
      //scaledSize: new google.maps.Size(20, 20),
    };
    
    let mark = new google.maps.Marker({position:{lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng()}, animation: google.maps.Animation.DROP,
      title: this.markerTitle, draggable: this.draggable, icon: icon});
    
  }

  handleOverlayClick(event: any) {
    let isMarker = event.overlay.getTitle != undefined;

    if (isMarker) {
        let title = event.overlay.getTitle();
        this.infoWindow.setContent('' + title + '');
        this.infoWindow.open(event.map, event.overlay);
        event.map.setCenter(event.overlay.getPosition());

        this.messageService.add({severity:'info', summary:'Marker Selected', detail: title});
    }
    else {
        this.messageService.add({severity:'info', summary:'Shape Selected', detail: ''});
    }
  }

  async setRouteDistance(pointA:any, pointB:any, map: any, array: Point[], sum: number) {
    const sleep = (delay:any) => new Promise((resolve) => setTimeout(resolve, delay));
    var request = {
      origin: pointA,
      destination: pointB,
      travelMode: 'DRIVING'
    };
    let delay = this.requestCount * 1000;
    if (this.requestCount > 8) 
      {
        setTimeout(() => {
          this.directionService.route(request, async (result:any, status:any) => {
            if (status == 'OK') {
              let distanceValue = result.routes[0].legs[0].distance.value;
              sum += distanceValue;
              map.map.set(array, sum);
            } else {
              await sleep(2000);
            }
          });
        }, delay)        
        this.requestCount = 1;
      } else {
        this.requestCount++;
        this.directionService.route(request, async (result:any, status:any) => {
          if (status == 'OK') {
            let distanceValue = result.routes[0].legs[0].distance.value;
            sum += distanceValue;
            map.map.set(array, sum);
          } else {
            await sleep(2000);
          }
        });
      }
  }

  setPostMapRoute(pointA:any, pointB:any) {
    if (this.requestCount > 7) {
      this.requestCount = 0;
      setTimeout(() => {
      let directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true, polylineOptions: {
        strokeColor: "red"
      }});
      directionsRenderer.setMap(this.map);
      this.directionsRenderers.push(directionsRenderer);
      
      var request = {
        origin: pointA,
        destination: pointB,
        travelMode: 'DRIVING'
      };
      this.directionService.route(request, (result:any, status:any) => {
        if (status == 'OK') {
          directionsRenderer.setDirections(result);
          let distanceValue = result.routes[0].legs[0].distance.value;
          if (distanceValue == 0) {
            this.totalDistance += 1;
          } else {
            this.totalDistance += distanceValue/ 1000;
          }
          let timeValue = result.routes[0].legs[0].duration.value;
          if (timeValue == 0) {
            this.totalTime += 0;
          } else {
            let minutes = timeValue / 60;
            let hours = minutes / 60;
            this.totalTime += hours;
          }
        }
      });
     }, 5000);
    } else {
      let directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true,polylineOptions: {
        strokeColor: "red"
      }});
      this.requestCount++;
      directionsRenderer.setMap(this.map);
      this.requestCount++;
      this.directionsRenderers.push(directionsRenderer);
      
      var request = {
        origin: pointA,
        destination: pointB,
        travelMode: 'DRIVING'
      };
      this.directionService.route(request, (result:any, status:any) => {
        this.requestCount++;
        if (status == 'OK') {
          directionsRenderer.setDirections(result);
          let distanceValue = result.routes[0].legs[0].distance.value;
          if (distanceValue == 0) {
            this.totalDistance +=1;
          } else {
            this.totalDistance += distanceValue/ 1000;
          }
          let timeValue = result.routes[0].legs[0].duration.value;
          if (timeValue == 0) {
            this.totalTime += 0;
          } else {
            let minutes = timeValue / 60;
            let hours = minutes / 60;
            this.totalTime += hours;
          }
        }
      });
    }
  }

  sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  setRoute(pointA:any, pointB:any) {
    const randomColor = this.getRandomColor();
    let directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true,polylineOptions: {
      strokeColor: randomColor
    }});
    directionsRenderer.setMap(this.map);
    this.directionsRenderers.push(directionsRenderer);
    this.directionService
      .route({
        origin: pointA,
        destination: pointB,
        travelMode: 'DRIVING'
      })
      .then((response:any) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e:any) =>{
        console.log(e);
      });
  }

  apply() {
    this.directionsRenderers.forEach(async x => {
      x.setMap(null);
    });
    if (this.companyOrders) {
      let currentPoint = {};
       for (let i = 0; i < this.companyOrders.length; i++) {
          if (i == 0 && this.companyOrders.length == 1) {
            let pointA = {lat:this.depoPoint.lat, lng: this.depoPoint.lng};
            let pointB = {lat: this.companyOrders[i].deliveryPoints[0].x, lng: this.companyOrders[i].deliveryPoints[0].y };
            this.setPostMapRoute(pointA, pointB);
            pointA = pointB;
            pointB = {lat: this.companyOrders[i].deliveryPoints[1].x, lng: this.companyOrders[i].deliveryPoints[1].y };
            this.setPostMapRoute(pointA, pointB);
          } 
          if (i == 0 && this.companyOrders.length > 1) {
            let pointA = {lat:this.depoPoint.lat, lng: this.depoPoint.lng};
            let pointB = {lat: this.companyOrders[i].deliveryPoints[0].x, lng: this.companyOrders[i].deliveryPoints[0].y };
            currentPoint = pointB;
            this.setPostMapRoute(pointA, pointB);
          } 
          this.companyOrders[i].deliveryPoints.forEach(p => {
             let origin = {lat: this.companyOrders[i].deliveryPoints[0].x, lng: this.companyOrders[i].deliveryPoints[0].y };
             this.setPostMapRoute(currentPoint, origin);
             currentPoint = origin;
          });
       }
       for (let i = 0; i < this.companyOrders.length; i++) {

        this.companyOrders[i].deliveryPoints.forEach(p => {
          if (i == this.companyOrders.length-1) {
            let destination = {lat: this.companyOrders[i].deliveryPoints[1].x, lng: this.companyOrders[i].deliveryPoints[1].y };
            this.setPostMapRoute(currentPoint, destination);
            let depo = {lat: this.depoPoint.lat, lng: this.depoPoint.lng };
            this.setPostMapRoute(destination, depo);
          } else {
            let destination = {lat: this.companyOrders[i].deliveryPoints[1].x, lng: this.companyOrders[i].deliveryPoints[1].y };
            this.setPostMapRoute(currentPoint, destination);
            currentPoint = destination;
          }
       });
     }
    }
  }

  setAlgorithmOrder() {
    let order = 0;
    this.totalOrders.forEach(o => {
      o.deliveryPoints[0].geneticAlgoritmOrder = ++order;
    });
    this.totalOrders.forEach(o => {
      o.deliveryPoints[1].geneticAlgoritmOrder = ++order;
    });
  }

  onSaveRouteChange(event: any) {
    this.clearMarkers();
    this.isMapLoading = true;
    let paths: DeliveryPath[] = event.value;
    let sumDistance = 0;
    let sumDuration = 0;
    paths.forEach(p => {
      sumDistance += p.distance;
      sumDuration += p.hours;
    });
    this.totalTime = sumDuration / 60 / 60;
    this.totalDistance = sumDistance / 1000;
    this.setRoute({lat: this.depoPoint.lat, lng: this.depoPoint.lng}, {lat: paths[0].from?.x, lng: paths[0].from?.y} );
      for (let i = 0; i < paths.length; i++) {
        this.sleep(i * 1000).then(() => {
        if (paths[i].from?.isOrigin) {
          const icon = {
            url: `../assets/icons/postal-code.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
            let mark = new google.maps.Marker({position:{lat: paths[i].from?.x, lng: paths[i].from?.y}, 
                animation: google.maps.Animation.DROP,
                title: paths[i].from?.address, icon: icon});
            this.overlays.push(mark);
        }
        if (paths[i].to?.isOrigin) {
          const icon = {
            url: `../assets/icons/postal-code.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
            let mark = new google.maps.Marker({position:{lat: paths[i].to?.x, lng: paths[i].to?.y}, 
                animation: google.maps.Animation.DROP,
                title: paths[i].to?.address, icon: icon});
            this.overlays.push(mark);
        }
        if (paths[i].from?.isDestination) {
          const icon = {
            url: `../assets/icons/moving-company.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
            let mark = new google.maps.Marker({position:{lat: paths[i].from?.x, lng: paths[i].from?.y}, 
                animation: google.maps.Animation.DROP,
                title: paths[i].from?.address, icon: icon});
            this.overlays.push(mark);
        }
        if (paths[i].to?.isDestination) {
          const icon = {
            url: `../assets/icons/moving-company.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
            let mark = new google.maps.Marker({position:{lat: paths[i].to?.x, lng: paths[i].to?.y}, 
                animation: google.maps.Animation.DROP,
                title: paths[i].to?.address, icon: icon});
            this.overlays.push(mark);
        }
        this.setRoute({lat: paths[i].from?.x, lng: paths[i].from?.y},
          {lat: paths[i].to?.x, lng: paths[i].to?.y} );
       });
       if (i == paths.length-1) {
        this.isMapLoading = false;
        this.setRoute({lat: paths[paths.length-1].to?.x, lng: paths[paths.length-1].to?.y},
          {lat: this.depoPoint.lat, lng: this.depoPoint.lng} );
        let timeLinePoints: Point[] = [];
        paths.forEach(d => {
          if(d.from) {
            let from: Point = { isDestination: d.from?.isDestination, isOrigin: d.from.isOrigin, address: d.from.address, id: d.from.id, x: d.from.x, y: d.from.y, geneticAlgoritmOrder: d.from.algorithmOrder};
            timeLinePoints.push(from);
          }
          if(d.to) {
            let to: Point = { isDestination: d.to?.isDestination, isOrigin: d.to.isOrigin, address: d.to.address, id: d.to.id, x: d.to.x, y: d.to.y, geneticAlgoritmOrder: d.to.algorithmOrder};
            timeLinePoints.push(to);
          }
        });
        this.loadTimeLine(timeLinePoints);
      }
      }
  }

  runGeneticAlgorithmPath() {
    let populations: number[][] = [];
    this.geneticAlgorithmResultsPoints = [];
    let orderPonts:Point[] = [];
    for (let i = 0; i < this.populations; i++) {
      orderPonts = [];
      if (this.defaultRoutePoints && this.defaultRoutePoints.length) {
        let originIds = this.defaultRoutePoints.filter(x => x.isOrigin).map(x => x.id);
        let destinationIds = this.defaultRoutePoints.filter(x => x.isDestination).map(x => x.id);
        let unique = this.getUniquePopulation(originIds, destinationIds, populations);
        populations.push(unique);
      } else {
        this.companyOrders.forEach(or => {
          or.deliveryPoints.forEach(p => {
            if (p.isOrigin) {
              orderPonts.push(p);
            }
          });
        });
        this.companyOrders.forEach(or => {
          or.deliveryPoints.forEach(p => {
            if (p.isDestination) {
              orderPonts.push(p);
            }
          });
        });
        let originIds = orderPonts.filter(x => x.isOrigin).map(x => x.id);
        let destinationIds = orderPonts.filter(x => x.isDestination).map(x => x.id);
        let unique = this.getUniquePopulation(originIds, destinationIds, populations);
        populations.push(unique);
      }
    }
    console.log("populations " + populations);
    let crossedPopulations: number[][] = [];
    for (let i = 0; i < populations.length; i++) {
      let crossoverPercent = this.getRandomInt(1, 4);
      if (crossoverPercent <= this.crossoverPercent) {
        let crossedRes = this.getCrossedPopulation(populations[i]);
        crossedPopulations.push(crossedRes);
      }
    }
    console.log("crossedPopulations: " + crossedPopulations);
    crossedPopulations.forEach(x => {
        let pointRoute: Point[] = [];
        let origins = x.filter((u, i) => i < x.length / 2);
        let destination = x.filter((u, i) => i >= x.length / 2);
        origins.forEach(y => {
          let point;
          if (this.defaultRoutePoints && this.defaultRoutePoints.length) {
            point = this.defaultRoutePoints.find(x => x.id == y);
          } else {
            point = orderPonts.find(x => x.id == y);
          }
          if (point) {
            point.isDestination = false;
            point.isOrigin = true;
            pointRoute.push(point);
          }
        });
        destination.forEach(y => {
          let point;
          if (this.defaultRoutePoints && this.defaultRoutePoints.length) {
            point = this.defaultRoutePoints.find(x => x.id == y);
          } else {
            point = orderPonts.find(x => x.id == y);
          }
          if (point) {
            point.isDestination = true;
            point.isOrigin = false;
            pointRoute.push(point);
          }
        });
        this.geneticAlgorithmResultsPoints.push(pointRoute);
    });
    console.log("geneticAlgorithmResultsPoints: " + this.geneticAlgorithmResultsPoints);
    this.loadGeneticRoutes();
  }

  saveRoute() {
    this.currentRoute.name = `Time: ${(this.currentRoute.durationSumm / 60).toFixed(2)} minutes, ${(this.currentRoute.durationSumm / 60/  60).toFixed(2)} minutes, Distance: ${(this.currentRoute.distanceSumm / 1000).toFixed(2)}`;
    this.savedRoutes.push(this.currentRoute);
    sessionStorage.setItem('savedRoutes', JSON.stringify(this.savedRoutes));
  }

  loadGeneticRoutes() {
    let generationResults: Point[][][] = [];
    generationResults.push(this.geneticAlgorithmResultsPoints);
    this.isMapLoading = true;
    this.googleApiService.getCalculatedDefaultPathsForOrders(generationResults).subscribe((res) => {
      this.isMapLoading = false;
      let minValue: CalculatedRouteModel = res[0];
      this.currentRoute = minValue;
      this.selectedRoute = minValue;
      let timeLinePoints: Point[] = [];
      minValue.deliveryPaths.forEach(d => {
        if(d.from) {
          let from: Point = { isDestination: d.from?.isDestination, isOrigin: d.from.isOrigin, address: d.from.address, id: d.from.id, x: d.from.x, y: d.from.y, geneticAlgoritmOrder: d.from.algorithmOrder};
          timeLinePoints.push(from);
        }
        if(d.to) {
          let to: Point = { isDestination: d.to?.isDestination, isOrigin: d.to.isOrigin, address: d.to.address, id: d.to.id, x: d.to.x, y: d.to.y, geneticAlgoritmOrder: d.to.algorithmOrder};
          timeLinePoints.push(to);
        }
      });
      this.loadTimeLine(timeLinePoints);
      this.clearMarkers();
      this.totalDistance = minValue.distanceSumm / 1000;
      this.totalTime = minValue.durationSumm / 60 / 60;
      this.initDepo();
      this.setRoute({lat: this.depoPoint.lat, lng: this.depoPoint.lng}, {lat: minValue.deliveryPaths[0].from?.x, lng: minValue.deliveryPaths[0].from?.y} );
      for (let i = 0; i < minValue.deliveryPaths.length; i++) {
        this.sleep(i * 1000).then(() => {
        if (minValue.deliveryPaths[i].from?.isOrigin) {
          const icon = {
            url: `../assets/icons/postal-code.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
            let mark = new google.maps.Marker({position:{lat: minValue.deliveryPaths[i].from?.x, lng: minValue.deliveryPaths[i].from?.y}, 
                animation: google.maps.Animation.DROP,
                title: minValue.deliveryPaths[i].from?.address, icon: icon});
            this.overlays.push(mark);
        }
        if (minValue.deliveryPaths[i].to?.isOrigin) {
          const icon = {
            url: `../assets/icons/postal-code.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
            let mark = new google.maps.Marker({position:{lat: minValue.deliveryPaths[i].to?.x, lng: minValue.deliveryPaths[i].to?.y}, 
                animation: google.maps.Animation.DROP,
                title: minValue.deliveryPaths[i].to?.address, icon: icon});
            this.overlays.push(mark);
        }
        if (minValue.deliveryPaths[i].from?.isDestination) {
          const icon = {
            url: `../assets/icons/moving-company.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
            let mark = new google.maps.Marker({position:{lat: minValue.deliveryPaths[i].from?.x, lng: minValue.deliveryPaths[i].from?.y}, 
                animation: google.maps.Animation.DROP,
                title: minValue.deliveryPaths[i].from?.address, icon: icon});
            this.overlays.push(mark);
        }
        if (minValue.deliveryPaths[i].to?.isDestination) {
          const icon = {
            url: `../assets/icons/moving-company.svg`, // url
                scaledSize: new google.maps.Size(40, 40)};
            let mark = new google.maps.Marker({position:{lat: minValue.deliveryPaths[i].to?.x, lng: minValue.deliveryPaths[i].to?.y}, 
                animation: google.maps.Animation.DROP,
                title: minValue.deliveryPaths[i].to?.address, icon: icon});
            this.overlays.push(mark);
        }
        this.setRoute({lat: minValue.deliveryPaths[i].from?.x, lng: minValue.deliveryPaths[i].from?.y},
          {lat: minValue.deliveryPaths[i].to?.x, lng: minValue.deliveryPaths[i].to?.y} );
       });
       if (i == minValue.deliveryPaths.length-1){
        this.isMapLoading = false;
        this.setRoute({lat: minValue.deliveryPaths[minValue.deliveryPaths.length-1].to?.x, lng: minValue.deliveryPaths[minValue.deliveryPaths.length-1].to?.y},
          {lat: this.depoPoint.lat, lng: this.depoPoint.lng} );
       }
      }

    });
  }


  getCrossedPopulation(population: number[]) {
    let result:number[] = [];
    let originsRes = [];
    let destinationRes = [];
    let origins1 = population.filter((u, i) => i < population.length / 2);
    let destinations1 = population.filter((u, i) => i >= population.length / 2);
    if (origins1.length > 1) {
      if (origins1.length == 2) {
        originsRes.push(origins1[origins1.length-1]);
        originsRes.push(origins1[0]);
      } else {
        let breakPoint = this.getRandomInt(1, origins1.length-1);
        let originsTake = origins1.filter((u, i) => i < breakPoint);
        let originsSkip = origins1.filter((u, i) => i >= breakPoint);
        originsTake.forEach(t => {
          originsRes.push(t);
        });
        originsSkip.forEach(s => {
          originsRes.push(s);
        });
      }
    }
    if (destinations1.length > 1) {
      if (destinations1.length == 2) {
        destinationRes.push(destinations1[destinations1.length-1]);
        destinationRes.push(destinations1[0]);
      } else {
        let breakPoint = this.getRandomInt(1, destinations1.length-1);
        let destinationTake = destinations1.filter((u, i) => i < breakPoint);
        let destinationSkip = destinations1.filter((u, i) => i >= breakPoint);
        destinationTake.forEach(t => {
          destinationRes.push(t);
        });
        destinationSkip.forEach(s => {
          destinationRes.push(s);
        });
      }
    }
    originsRes.forEach(o => {
      result.push(o);
    });
    destinationRes.forEach(d => {
      result.push(d);
    });
    return result;
  }


  getUniquePopulation(originIds:number[], destinationIds:number[], populations:number[][]) {
    let originIndexes: number[] = [];
    let destinationIndexes: number[] = [];
    let originPopulation: number[] = [];
    let destinationPopulation: number[]=[];
    let result: number[]=[];
    let notAdded = true;
    while (notAdded) {
      for (let j = 0; j < originIds.length; j++) {
        let num = Math.floor(Math.random() * originIds.length) + 1;
        if (!originIndexes.includes(num) && originIndexes.length < originIds.length)
        {
          originPopulation.push(originIds[num-1]);
          originIndexes.push(num);
        }
        else
        {
          while (originIndexes.includes(num) && originIndexes.length < originIds.length)
          {
            num = Math.floor(Math.random() * originIds.length) + 1;
          }
          originPopulation.push(originIds[num-1]);
          originIndexes.push(num);
        }
      }

      for (let i =0; i < destinationIds.length; i++) {
        let num = Math.floor(Math.random() * destinationIds.length) + 1;
        if (!destinationIndexes.includes(num) && destinationIndexes.length < destinationIds.length)
        {
          destinationIndexes.push(num);
          destinationPopulation.push(destinationIds[num-1]);
        }
        else
        {
          while (destinationIndexes.includes(num) && destinationIndexes.length < destinationIds.length)
          {
            num = Math.floor(Math.random() * destinationIds.length) + 1;
          }
          destinationIndexes.push(num);
          destinationPopulation.push(destinationIds[num-1]);
        }
      }
      originPopulation.forEach(o => {
        result.push(o);
      });
      destinationPopulation.forEach(d => {
        result.push(d);
      });

      if (populations.some(x => this.isArraysTheSame(x, result))) {
        notAdded = true;
        result = [];
        destinationPopulation = [];
        originPopulation = [];
        originIndexes = [];
        destinationIndexes = [];
      } else {
        notAdded = false;
      }
    }
    return result;

  }

  isArraysTheSame(array1:number[], array2: number[]) {
    let res = true;
    if (array1.length == array2.length) {
      for (let i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
          res = false;
        } 
      }
      return res;
    } else {
      return false
    }
  }

  mapAsDeliveryPoints(points: Point[]): DeliveryPoint[] {
    let result: DeliveryPoint[] = [];
    points.forEach(p => {
      let deliveryPoint: DeliveryPoint = { id:p.id, address:p.address, x: p.x, y: p.y, isOrigin: p.isOrigin, isDestination: p.isDestination, algorithmOrder: p.geneticAlgoritmOrder };
      result.push(deliveryPoint);
    });
    return result;
  }

  // calculateDistanceSumForPopulations(populations:[Point[]]) {
  //   let result =  new Map<Point[], number>();
  //   let objResult = {map: result};
  //   this.requestCount = 1;
  //   const sleep = (delay:any) => new Promise((resolve) => setTimeout(resolve, delay));
  //   populations.forEach(async p => {
  //     let sum = 0;
  //      for (let i = 0; i < p.length-1; i++) {
  //         let origin = {lat: p[i].x, lng: p[i].y };
  //         let destination = {lat: p[i+1].x, lng: p[i+1].y };
  //         setTimeout(async () => {
  //           await this.setRouteDistance(origin, destination, objResult, p, sum);
  //         }, 3000+i*1000);
  //      }
  //   });
  //   return objResult;
  // }

  initDefaultPath():Point[]  {
    let populations:[number[]] = [[]];
    populations.pop();
    let result:Point[] = [];
    let totalOrigins: Point[] = [];
    let totalDestinations: Point[] = [];
    this.companyOrders.forEach(o => {
        o.deliveryPoints.forEach(p => {
          if (p.isOrigin) {
            totalOrigins.push(p);
          } else {
            totalDestinations.push(p);
          }
        });
    });
    totalOrigins.forEach(o => {
      result.push(o);
    });
    totalDestinations.forEach(o => {
      result.push(o);
    });
    // for (let i = 0; i < this.populations; i++) {
    //   let combination:number[] = [];
    //   let pointCombination:Point[] = [];
    //   for (let j = 0; j < totalOrigins.length; j++) {
    //     let index = Math.floor(Math.random() * totalOrigins.length);
    //     if (!combination.includes(index) && combination.length < totalOrigins.length)
    //     {
    //         pointCombination.push(totalOrigins[index]);
    //         combination.push(index);
    //     }
    //     else
    //     {
    //       while (combination.includes(index) && combination.length < totalOrigins.length)
    //       {
    //         index = Math.floor(Math.random() * totalOrigins.length);
    //       }
    //       pointCombination.push(totalOrigins[index]);
    //       combination.push(index);
    //     }
    //   }
    //   for (let j = 0; j < totalDestinations.length; j++) {
    //     let index = Math.floor(Math.random() * totalDestinations.length);
    //     if (!combination.includes(index) && combination.length < totalDestinations.length)
    //     {
    //         pointCombination.push(totalDestinations[index]);
    //         combination.push(index);
    //     }
    //     else
    //     {
    //       while (combination.includes(index) && combination.length < totalDestinations.length)
    //       {
    //         index = Math.floor(Math.random() * totalDestinations.length) + 1;
    //       }
    //       pointCombination.push(totalDestinations[index]);
    //       combination.push(index);
    //     }
    //   }

    //   if (!this.isDuplicate(combination, populations)) {
    //     populations.push(combination);
    //   } else {
    //     i--;
    //   }
     
    //   result.push(pointCombination);
    // }

    return result;
  }

  async run() {
  
    let populations:[number[]] = [[]];
    populations.pop();

     // Init populations - add sequances of unique numbers (size = points length) for each of the population
    for (let i = 0; i < this.populations; i++) {

      let combination:number[] = [];

      for (let j = 0; j < this.points.length; j++) {

        let num = Math.floor(Math.random() * this.points.length) + 1;
        if (!combination.includes(num) && combination.length < this.points.length)
        {
            combination.push(num);
        }
        else
        {
          while (combination.includes(num) && combination.length < this.points.length)
          {
             num = Math.floor(Math.random() * this.points.length) + 1;
          }
          combination.push(num);
        }
      }
      if (!this.isDuplicate(combination, populations)) {
        populations.push(combination);
      } else {
        i--;
      }
    }

    // calc summ of populations path
    let populationsPaths = new Map<number[], number>();

    for (let i = 0; i < populations.length; i++) {

      let pathSum = 0;
      for (let j = 0; j < populations[i].length-1; j++) {

         let pathNum = this.pointLines.get((populations[i][j]).toString() + (populations[i][j+1]).toString());
         if (pathNum) {
          pathSum += pathNum;
         }
      }
      populationsPaths.set(populations[i], pathSum);
    }

    let copyPopulations = populations;

    // for each generation take all unique pars and swap their numbers
    for (let i =0; i < this.generations; i++) {

      let tournamentList = [];
      if (this.currentPaths.size) {
        let keys = [];
        for (const [key, value] of this.currentPaths) {
          keys.push(key);
        }
        tournamentList = this.getTournamentList(keys, keys.length);
      } else {
        tournamentList = this.getTournamentList(copyPopulations, copyPopulations.length);
      }

      let tournamtEven = [];
      let tournamtOdd = [];

      for (let j = 0; j < tournamentList.length; j++) {
        if (j % 2 == 0) {
          tournamtEven.push(tournamentList[j]);
        } else {
          tournamtOdd.push(tournamentList[j]);
        }
      }

      let crossingResult = [];
      for (let j = 0; j < tournamtEven.length; j++) {
        let crossoverPercent = this.genRand(0.01, 1, 2);
        if (this.crossoverPercent >= crossoverPercent) {
          if (tournamtEven[j] && tournamtOdd[j]) {
            let crossed = this.crossing(tournamtEven[j].array, tournamtOdd[j].array);
             let pathSum = 0;
              for (let u = 0; u < crossed[0].length-1; u++) {

                let pathNum = this.pointLines.get((crossed[0][u]).toString() + (crossed[0][u+1]).toString());
                if (pathNum) {
                  pathSum += pathNum;
                }
              }
             
              crossingResult.push({array: crossed[0], sum: pathSum});
              this.currentPaths.set(crossed[0], pathSum);
              this.totallPaths.set(crossed[0], pathSum);
              pathSum = 0;
              for (let u = 0; u < crossed[1].length-1; u++) {

                let pathNum = this.pointLines.get((crossed[1][u]).toString() + (crossed[1][u+1]).toString());
                if (pathNum) {
                  pathSum += pathNum;
                }
              }
              crossingResult.push({array: crossed[1], sum: pathSum});
              this.currentPaths.set(crossed[1], pathSum);
              this.totallPaths.set(crossed[0], pathSum);
          }
        }
      }

      const sortResult = new Map([...this.currentPaths.entries()].sort((a, b) => a[1] - b[1]));
      let newMap = new Map<number[], number>();
      let counter = 0;
      for (const [key, value] of this.currentPaths) {
        if (counter == this.populations) {
          break;
        }
        newMap.set(key, value);
        counter++;
      }
      this.currentPaths = newMap;
    }

    const sortResult = new Map([...this.totallPaths.entries()].sort((a, b) => a[1] - b[1]));
    const minResult = [...sortResult][0];

    let existsPolyLine = this.overlays.filter((x: { geodesic: any; }) => x.geodesic)[0];
    for (let i = 0; i < this.overlays.length; i++) {
        if (existsPolyLine == this.overlays[i]) {
          this.overlays.splice(i, 1);
        }
    }

    this.clearMarkers();
   }

  reloadMarkers(): void {
    let copy = this.overlays;
    this.clearMarkers();
    for (let i = 0; i < copy.length; i++) {
      this.overlays.push(copy[i]);
    }
  }

  clearMarkers() {
    this.overlays = [];
    this.shortestPath = [[],0];
    this.pathSum = 0;
    this.directionsRenderers.forEach(async x => {
      x.setMap(null);
    });
  }

  savePath() {
    this.display = true;
  }

  confirmSavePath() {
    this.display = false;
    
  }

  isDuplicate(array:number[], populations:[number[]]):boolean {

    let isDuplicate = false;
    for (let i = 0; i < populations.length; i++) {
      let arr = populations[i];
      let count = 0;
      for (let j=0; j < arr.length; j++) {
        if (arr[j] == array[j]) {
          count++;
        }
      }
      if (count == array.length) {
        isDuplicate = true;
        i = populations.length;
      }
    }
    return isDuplicate;
  }

  getLineLength(pointStart: Point , pointEnd: Point) {
	  var res = Math.sqrt(Math.pow((pointEnd.x - pointStart.y), 2) + Math.pow((pointEnd.y - pointStart.y), 2));
	  return res;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } 

  crossing(firstParent: number[], secondParent: number[]):[number[], number[]] {

    let firstResult: number[] = [];
    let secondResult: number[] = [];
    let breakPoint = this.getRandomInt(2, firstParent.length-2);

    let x1 = firstParent.filter((u, i) => i < breakPoint);
    let copyX1 = x1;
    let y1 = secondParent.filter((u, i) => i < breakPoint);
    let copyY1 = y1;
    let y2 = secondParent.filter((u, i) => i >= breakPoint);
    let copyY2 = y2;
    let x2 = firstParent.filter((u, i) => i >= breakPoint);
    let copyX2 = x2;

    for (let i = 0; i < x1.length; i++) {
      firstResult.push(x1[i]);
    }

    y1 = y1.filter(x=> !x1.includes(x));
    y2 = y2.filter(x=> !x1.includes(x));

    for (let i = 0; i < y2.length; i++) {
      firstResult.push(y2[i]);
    }

    x2 = x2.filter(x => !y2.includes(x));

    if (firstResult.length != firstParent.length) {
      for (let i = 0; i < x2.length && firstResult.length != firstParent.length; i++) {
        firstResult.push(x2[i]);
      }
    }

    for (let i = 0; i < copyY1.length; i++) {
      secondResult.push(copyY1[i]);
    }

    copyX2 = copyX2.filter(x=> !copyY1.includes(x));
    copyX1 = copyX1.filter(x=> !copyY1.includes(x));

    for (let i = 0; i < copyX2.length; i++) {
      secondResult.push(copyX2[i]);
    }

    copyY2 = copyY2.filter(x => !copyX2.includes(x));

    if (secondResult.length != secondParent.length) {
      for (let i = 0; i < copyY2.length && secondResult.length != firstParent.length; i++) {
        secondResult.push(copyY2[i]);
      }
    }

    let randomInteger = this.randomInteger(1, 99);
    if (this.mutations > randomInteger) {
      let index1 = this.randomInteger(0, firstParent.length-1);
      let index2 = this.randomInteger(0, secondParent.length-1);
      while (index1 == index2) {
        index2 = this.randomInteger(0, secondParent.length-1);
      }
      let temp1 = firstResult[index1];
      firstResult[index1] = firstParent[index2];
      firstResult[index2] = temp1;
      let temp2 = secondResult[index1];
      secondResult[index1] = secondResult[index2];
      secondResult[index2] = temp2;
    }

    return [firstResult, secondResult]
  }

  genRand(min: number, max: number, decimalPlaces: number) {  
    var rand = Math.random()*(max-min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand*power) / power;
  }

  randomInteger(min: number, max: number) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  mutate(items: number[]) {

    let rFirst = Math.floor(Math.random() * items.length);
    let rSecond = Math.floor(Math.random() * items.length);

    while (rFirst == rSecond)
    {
      rSecond = Math.floor(Math.random() * this.points.length);
    }
    var temp = items[rFirst];
    items[rFirst] = items[rSecond];
    items[rSecond] = temp;

  }

  inversions(parent: number[]):number[] {
    let res:number[] = [];
    let pointBreak = Math.floor(Math.random() * parent.length);
    var invFirstPart = parent.filter((u, i) => i < pointBreak);
    var invSecondPart = parent.filter((u, i) => i >= pointBreak);
    for (let i = 0; i < invFirstPart.length; i++) {
      res.push(invFirstPart[i]);
    }
    for (let i = 0; i < invSecondPart.length; i++) {
      res.push(invSecondPart[i]);
    }
    return res;
  }

  getTournamentList(populations: string | any[], populationSize: any) {
    let result = [];
    for (let i = 0; i < populationSize; i++) {
      
      let r1 = Math.floor(Math.random() * populations.length);
      let r2 = Math.floor(Math.random() * populations.length);
      let r3 = Math.floor(Math.random() * populations.length);

      while (r2 == r1) {
         r2 = Math.floor(Math.random() * populations.length);
      }

      while (r2 == r3 || r3 == r1) {
         r3 = Math.floor(Math.random() * populations.length);
      }

      let r1Sum = 0, r2Sum = 0, r3Sum = 0;
      for (let j = 0; j < populations[r1].length - 1; j++)
      {
        let len = this.pointLines.get(populations[r1][j].toString() + populations[r1][j+1].toString());
        if (len) {
          r1Sum += len;
        }
      }

      for (let j = 0; j < populations[r2].length - 1; j++)
      {
        let len = this.pointLines.get(populations[r2][j].toString() + populations[r2][j+1].toString());
        if (len) {
          r2Sum += len;
        }
      }

      for (let j = 0; j < populations[r3].length - 1; j++)
      {
        let len = this.pointLines.get(populations[r3][j].toString() + populations[r3][j+1].toString());
        if (len) {
          r3Sum += len;
        }
      }

      if (r1Sum > r2Sum && r1Sum > r3Sum) {
        result.push({array:populations[r1], sum: r1Sum});
      }

      if (r2Sum > r1Sum && r2Sum > r3Sum) {
        result.push({array:populations[r2], sum: r2Sum});
      }

      if (r3Sum > r2Sum && r3Sum > r1Sum) {
        result.push({array:populations[r3], sum: r3Sum});
      }
    }

    return result;
  }

}
