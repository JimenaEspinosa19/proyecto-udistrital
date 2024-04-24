import { Injectable } from '@angular/core';
import { collection, query, where, getDocs, Firestore, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  nombreCliente: string;
  entidad: string;
  direccionSeleccionada: string;

  constructor(public firestore: Firestore) {
    this.nombreCliente = '';
    this.entidad = '';
    this.direccionSeleccionada = '';
  }

  async createmedicament(nombre: string, cantidad: string, direcciones: string[], entidad: string) {
    const docRef = await addDoc(collection(this.firestore, 'medicamentos'), {
      nombre: nombre,
      cantidad: cantidad,
      entidad: entidad,
      direcciones: direcciones,
    });
    console.log("Document written with ID: ", docRef.id);
  }

  async getMedicamentos() {
    const snapshot = await getDocs(query(collection(this.firestore, 'medicamentos')));
    return snapshot.docs.map(doc => doc.data());
  }

  async searchMedicamentos(nombre: string) {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'medicamentos'), where('nombre', '>=', nombre.toLowerCase()), where('nombre', '<=', nombre.toLowerCase() + '\uf8ff')));
    return querySnapshot.docs.map(doc => doc.data());
  }

  async getDireccionesPorEntidad(entidad: string): Promise<string[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Farmacias'), where('Nombre', '==', entidad)));
    return querySnapshot.docs.map(doc => doc.data()['Direccion']) as string[];
  }

  async searchMedicamentoEnDireccion(nombre: string, entidad: string, direcciones: string[]): Promise<boolean> {
    const medicamentos = await this.getMedicamentos();
    const medicamento = medicamentos.find(med => med['nombre'].toLowerCase() === nombre.toLowerCase() && med['entidad'] === entidad);
    return medicamento ? medicamento['direcciones'].some((dir: string) => direcciones.includes(dir)) : false;
  }

  setDatosCliente(nombre: string, entidad: string, direccion: string) {
    this.nombreCliente = nombre;
    this.entidad = entidad;
    this.direccionSeleccionada = direccion;
  }

  getDatosCliente() {
    
    return {
      nombreCliente: this.nombreCliente,
      entidad: this.entidad,
      direccionSeleccionada: this.direccionSeleccionada
    };
  }

  async crearReservaMedicamento(
    nombreCliente: string,
    entidad: string,
    direccionSeleccionada: string,
    fechaReserva: string,
    horaReserva: string
  ) {
    try {
      await addDoc(collection(this.firestore, 'reservas'), {
        nombreCliente,
        entidad,
        direccionSeleccionada,
        fechaReserva,
        horaReserva
      });
      console.log("Reserva de medicamento creada con éxito en Firestore.");
    } catch (error) {
      console.error("Error al crear reserva de medicamento:", error);
      throw error;
    }
  }

}
