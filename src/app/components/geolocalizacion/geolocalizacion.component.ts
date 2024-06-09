///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>
import { HttpClient } from '@angular/common/http'; 
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { ElementRef, ViewChild, Renderer2 } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.component.html',
  styleUrls: ['./geolocalizacion.component.css']
})
export class GeolocalizacionComponent {
  directionsRenderers: google.maps.DirectionsRenderer[] = [];
  publicRoutes: any[] = []; // Array to store public transport routes

  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputPlaces') inputPlaces!: ElementRef;

  mapa!: google.maps.Map;
  markers: google.maps.Marker[];
  distancia!: string;
  tiempoEstimado!: string;
  formMapas!: FormGroup;
  direccionRecibida: string = '';
  http: any;
  transporteDuraciones: any[] = [];
  modoTransporte: string = 'DRIVING'; 
  posicionActual: any;
  
  constructor(private renderer: Renderer2, private route: ActivatedRoute, private router: Router) {
    this.markers = [];
  }

  ngOnInit(): void {
    this.direccionRecibida = history.state.direccionSeleccionada;
    console.log('Dirección recibida:', this.direccionRecibida);
  }

  ngAfterViewInit(): void {
    const opciones = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.posicionActual = position; 
        await this.cargarMapa(position);
      }, null, opciones);
    } else {
      console.log("Navegador no compatible");
    }
  }

  onSubmit() {
    console.log("Datos del formulario: ", this.formMapas.value)
  };

  mapRuta(): void {
    this.limpiarMapa();

    const directionService = new google.maps.DirectionsService();
    
    directionService.route({
      origin: new google.maps.LatLng(this.posicionActual.coords.latitude, this.posicionActual.coords.longitude),
      destination: this.direccionRecibida,
      travelMode: this.modoTransporte as google.maps.TravelMode 
    }, (resultado, estado) => {
      if (estado === google.maps.DirectionsStatus.OK && resultado.routes && resultado.routes.length > 0) {
        console.log(resultado);
        this.publicRoutes = resultado.routes; // Store the routes for displaying in the list

        // Iterar sobre todas las rutas encontradas
        resultado.routes.forEach((route, index) => {
          const directionRender = new google.maps.DirectionsRenderer({
            map: this.mapa,
            directions: resultado,
            routeIndex: index
          });

          // Almacenar cada DirectionsRenderer creado
          this.directionsRenderers.push(directionRender);

          // Mostrar distancia y tiempo estimado solo para la primera ruta
          if (index === 0 && route.legs && route.legs.length > 0) {
            this.distancia = route.legs[0].distance.text;
            this.tiempoEstimado = route.legs[0].duration.text;
          }
        });
      } else {
        console.error('No se pudo calcular la ruta:', estado);
      }
    });
  }

  limpiarMapa(): void {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];

    // Limpiar todas las rutas anteriores
    this.directionsRenderers.forEach(renderer => renderer.setMap(null));
    this.directionsRenderers = [];
  }
  
  seleccionarModo(modo: string) {
    this.modoTransporte = modo;
    this.actualizarModoTransporte();
  }

  actualizarModoTransporte(): void {
    this.mapRuta(); 
  }

  cargarMapa(position: any): any {
    const opciones = {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.mapa = new google.maps.Map(this.renderer.selectRootElement(this.divMap.nativeElement), opciones)

    const markerPosition = new google.maps.Marker({
      position: this.mapa.getCenter(),
      title: "Ubicaciones de google",
    });

    markerPosition.setMap(this.mapa);
    this.markers.push(markerPosition);

    google.maps.event.addListener(this.mapa, 'click', (evento: google.maps.MapMouseEvent) => {
      const marker = new google.maps.Marker({
        position: evento.latLng,
        animation: google.maps.Animation.DROP,
      });
      marker.setDraggable(true)
      marker.setMap(this.mapa);

      google.maps.event.addListener(marker, 'click', (event) => { 
        marker.setMap(null);
      });
    });
  }

  volver(){
    this.router.navigate(['/medicamentos']);
  }
}
