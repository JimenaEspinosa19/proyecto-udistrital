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
  directionsRenderer: google.maps.DirectionsRenderer | undefined;

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
  directionRenderers: google.maps.DirectionsRenderer[] = [];
  distanciasTiempo: { distancia: string, tiempoEstimado: string }[] = [];
  routeMarkers: google.maps.Marker[] = [];
  nuevosMarcadores!: google.maps.Marker[];
  selectedRouteRenderer: google.maps.DirectionsRenderer | undefined;
  routeMarkersWithNumbers: google.maps.Marker[] = [];

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
  }

  mapRuta(): void {
    this.limpiarMapa();

    const directionService = new google.maps.DirectionsService();
    const directionRender = new google.maps.DirectionsRenderer();
    directionRender.setMap(this.mapa);

    this.directionsRenderer = directionRender;

    directionService.route({
      origin: new google.maps.LatLng(this.posicionActual.coords.latitude, this.posicionActual.coords.longitude),
      destination: this.direccionRecibida,
      travelMode: this.modoTransporte as google.maps.TravelMode, 
      provideRouteAlternatives: true
    }, (resultado, estado) => {
      if (estado === google.maps.DirectionsStatus.OK && resultado.routes && resultado.routes.length > 0 && resultado.routes[0].legs && resultado.routes[0].legs.length > 0) {
        console.log(resultado);
        this.distanciasTiempo = [];
        this.nuevosMarcadores = []; 
        for (let i = 0; i < resultado.routes.length; i++) {
          const route = resultado.routes[i];
          const dt = {
            distancia: route.legs[0].distance.text,
            tiempoEstimado: route.legs[0].duration.text
          };
          this.distanciasTiempo.push(dt);

          const routeRender = new google.maps.DirectionsRenderer();
       
          this.directionRenderers.push(routeRender);
          routeRender.setMap(this.mapa);
          routeRender.setDirections(resultado);
          routeRender.setRouteIndex(i);

          const middleIndex = Math.floor(route.overview_path.length / 2);
          const middlePoint = route.overview_path[middleIndex];
          const marker = new google.maps.Marker({
            position: middlePoint,
            label: (i + 1).toString(), 
            map: this.mapa
          });
          this.nuevosMarcadores.push(marker); 
        }

        this.distancia = resultado.routes[0].legs[0].distance.text;
        this.tiempoEstimado = resultado.routes[0].legs[0].duration.text; 
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

    if (this.nuevosMarcadores) {
      this.nuevosMarcadores.forEach(marker => {
        marker.setMap(null);
      });
      this.nuevosMarcadores = [];
    }

    this.directionRenderers.forEach(renderer => {
      renderer.setMap(null);
    });
    this.directionRenderers = [];

    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
    }

    if (this.selectedRouteRenderer) {
      this.selectedRouteRenderer.setMap(null);
      this.selectedRouteRenderer = undefined;
    }

    this.routeMarkersWithNumbers.forEach(marker => {
      marker.setMap(null);
    });
    this.routeMarkersWithNumbers = [];
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
      marker.setDraggable(true);
      marker.setMap(this.mapa);

      google.maps.event.addListener(marker, 'click', (event) => { 
        marker.setMap(null);
      });
    });
  }

  volver() {
    this.router.navigate(['/medicamentos']);
  }

  seleccionarRuta(index: number): void {
    this.limpiarMapa();

    const rutaSeleccionada = this.distanciasTiempo[index];

    if (rutaSeleccionada) {
      const directionService = new google.maps.DirectionsService();
      const directionRender = new google.maps.DirectionsRenderer();
      directionRender.setMap(this.mapa);

      directionService.route({
        origin: new google.maps.LatLng(this.posicionActual.coords.latitude, this.posicionActual.coords.longitude),
        destination: this.direccionRecibida,
        travelMode: this.modoTransporte as google.maps.TravelMode,
        provideRouteAlternatives: true
      }, (resultado, estado) => {
        if (estado === google.maps.DirectionsStatus.OK) {
          this.routeMarkers.forEach(marker => {
            marker.setMap(null);
          });
          this.routeMarkers = [];

          directionRender.setDirections(resultado);
          directionRender.setRouteIndex(index);
          this.selectedRouteRenderer = directionRender;

          const route = resultado.routes[index];
          if (route && route.legs && route.legs.length > 0) {
            const middleIndex = Math.floor(route.overview_path.length / 2);
            const middlePoint = route.overview_path[middleIndex];
            const marker = new google.maps.Marker({
              position: middlePoint,
              label: (index + 1).toString(),
              map: this.mapa
            });
            this.routeMarkers.push(marker);
          }
        } else {
          console.error('No se pudo calcular la ruta:', estado);
        }
      });
    } else {
      console.error('No se encontró ninguna ruta para el índice proporcionado.');
    }
  }
}
