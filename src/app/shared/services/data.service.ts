import { Injectable } from '@angular/core';
import { collection, query, where, getDocs, Firestore, addDoc, deleteDoc, doc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  nmedicamento: string;
  identificacion: number;
  medicamento: string;
  entidad: string;
  direccionSeleccionada: string;

  constructor(public firestore: Firestore) {
    this.medicamento = '';
    this.entidad = '';
    this.direccionSeleccionada = '';
    this.nmedicamento = '';
    this.identificacion =0;
  }

  async createmedicament(nmedicamento: string, cantidad: string, direcciones: string[], entidad: string) {
    const docRef = await addDoc(collection(this.firestore, 'medicamentos'), {
      nmedicamento: nmedicamento,
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
    const querySnapshot = await getDocs(query(collection(this.firestore, 'medicamentos'), where('nmedicamento', '>=', nombre.toLowerCase()), where('nmedicamento', '<=', nombre.toLowerCase() + '\uf8ff')));
    return querySnapshot.docs.map(doc => doc.data());
  }

  async getDireccionesPorEntidad(entidad: string): Promise<string[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Farmacias'), where('Nombre', '==', entidad)));
    return querySnapshot.docs.map(doc => doc.data()['Direccion']) as string[];
  }

  async searchMedicamentoEnDireccion(nmedicamento: string, entidad: string, direcciones: string[]): Promise<boolean> {
    const medicamentos = await this.getMedicamentos();
    const medicamento = medicamentos.find(med => med['nmedicamento'].toLowerCase() === nmedicamento.toLowerCase() && med['entidad'] === entidad);
    return medicamento ? medicamento['direcciones'].some((dir: string) => direcciones.includes(dir)) : false;
  }

  setDatosCliente(nmedicamento: string, entidad: string, direccion: string) {
    this.nmedicamento = nmedicamento;
    this.entidad = entidad;
    this.direccionSeleccionada = direccion;
  }

  getDatosCliente() {
    
    return {
      nmedicamento: this.nmedicamento,
      entidad: this.entidad,
      direccionSeleccionada: this.direccionSeleccionada
    };
  }

  async crearReservaMedicamento(
    nombre: string,
    identificacion: string,
    nmedicamento: string,
    entidad: string,
    direccionSeleccionada: string,
    fechaReserva: string,
    horaReserva: string
  ) {
    try {
      await addDoc(collection(this.firestore, 'reservas'), {
        nombre,
        identificacion,
        nmedicamento,
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

  async eliminarMedicamento(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'medicamentos', id));
      console.log("Medicamento eliminado con éxito en Firestore.");
    } catch (error) {
      console.error("Error al eliminar medicamento:", error);
      throw error;
    }
  }

  async getReservas(): Promise<any[]> {
    const snapshot = await getDocs(collection(this.firestore, 'reservas'));
    return snapshot.docs.map(doc => doc.data());
  }
}

  


