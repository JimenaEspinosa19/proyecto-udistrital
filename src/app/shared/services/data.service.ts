import { Injectable } from '@angular/core';
import { collection, query, where, getDocs, Firestore, addDoc, deleteDoc, doc, setDoc, updateDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  [x: string]: any;
  nmedicamento: string;
  cantidad: string;
  identificacion: number;
  medicamento: string;
  entidad: string;
  direccionSeleccionada: string;
  ciudad: string;
  direcciones: string = "";
  datosCliente: any;


  constructor(public firestore: Firestore) {
    this,this.cantidad = '';
    this.medicamento = '';
    this.entidad = '';
    this.ciudad = '';
    this.direccionSeleccionada = '';
    this.nmedicamento = '';
    this.direcciones = '';
    this.identificacion =0;
  }

  async createmedicament(nmedicamento: string, cantidad: string, direcciones: string[], entidad: string, ciudad: string) {
    const docRef = await addDoc(collection(this.firestore, 'Medicamentos'), {
      nmedicamento: nmedicamento,
      cantidad: cantidad,
      entidad: entidad,
      direcciones: direcciones,
      ciudad: ciudad
    });
    console.log("Document written with ID: ", docRef.id);
  }


  async getMedicamentos() {
    try {
      const snapshot = await getDocs(query(collection(this.firestore, 'Nombre medicamentos')));
      const data = snapshot.docs.map(doc => doc.data());
      console.log('Datos de medicamentos obtenidos:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener datos de medicamentos:', error);
      throw error;
    }
  }
  async getMedicamentosTodos() {
    const snapshot = await getDocs(query(collection(this.firestore, 'Medicamentos')));
    return snapshot.docs.map(doc => doc.data());
  }

  async getEntregarapida() {
    const snapshot = await getDocs(query(collection(this.firestore, 'Entrega rapida')));
    return snapshot.docs.map(doc => doc.data());
  }


  async searchMedicamentos(nombre: string) {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Nombre medicamentos'), where('Nombre', '>=', nombre.toLowerCase()), where('Nombre', '<=', nombre.toLowerCase() + '\uf8ff')));
    return querySnapshot.docs.map(doc => doc.data());
  }

  async getDireccionesPorEntidad(entidad: string): Promise<string[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Farmacias'), where('Nombre', '==', entidad)));
    return querySnapshot.docs.map(doc => doc.data()['Direccion']) as string[];
  }


  setDatosCliente(nmedicamento: string, entidad: string, direccionSeleccionada: string, cantidad: string, ciudad: string) {
    this.nmedicamento = nmedicamento;
    this.entidad = entidad;
    this.direccionSeleccionada = direccionSeleccionada; 
    this.cantidad = cantidad;
    this.ciudad = ciudad;
  }
  
  getDatosCliente() {
    return {
      nmedicamento: this.nmedicamento,
      entidad: this.entidad,
      direccionSeleccionada: this.direccionSeleccionada, 
      cantidad: this.cantidad,
      ciudad: this.ciudad
    };
  }

  async crearReservaMedicamento(
    nombre: string,
    identificacion: string,
    nmedicamento: string,
    cantidad:string,
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
        cantidad,
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

  async updateMedicament(medicamento: any) {
    try {
      console.log("Nombre:", medicamento.nmedicamento);
      console.log("Entidad:", medicamento.entidad);
      console.log("Dirección seleccionada:", medicamento.direcciones);
     
      if (!medicamento.nmedicamento || !medicamento.entidad || !medicamento.direcciones) {
        console.error("Los campos Nombre, entidad o direccionSeleccionada no están definidos.");
        return;
      }
       
      console.log("Nombre:", medicamento.nmedicamento);

      const querySnapshot = await getDocs(query(collection(this.firestore, 'Medicamentos'), 
      where('nmedicamento', '==', medicamento.nmedicamento),
      where('entidad', '==', medicamento.entidad),
      where('ciudad', '==', medicamento.ciudad),
      where('direcciones', 'array-contains', medicamento.direcciones[0])
  ));
  
  if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await setDoc(docRef, medicamento, { merge: true });
   
      console.log("Medicamento actualizado con éxito en Firestore.");
  } else {
    
      console.log("No se encontró el medicamento en Firestore para actualizar.");
  }

} catch (error) {
  console.error("Error al actualizar medicamento:", error);
  throw error;
}
}

  async getEntidadesPorCiudad(ciudad: string): Promise<string[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Farmacias'), where('Ciudad', '==', ciudad)));
    const entidades = new Set<string>();
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data['Nombre']) { 
        entidades.add(data['Nombre']);
      }
    });
    return Array.from(entidades);

  }
  
  async getDireccionesPorEntidadYCiudad(entidad: string, ciudad: string): Promise<string[]> {
    try {
        console.log('Consultando direcciones por entidad y ciudad...');
        const querySnapshot = await getDocs(
            query(
                collection(this.firestore, 'Farmacias'), 
                where('Nombre', '==', entidad),
                where('Ciudad', '==', ciudad)
            )
        );

        const direccionesSet = new Set<string>(); 
        querySnapshot.forEach(doc => {
            const data = doc.data();
            console.log('Datos del documento:', data);
            if (data['Direccion']) {
                direccionesSet.add(data['Direccion']); 
            }
        });

        const direcciones: string[] = Array.from(direccionesSet); 

        console.log('Direcciones encontradas:', direcciones);
        return direcciones;
    } catch (error) {
        console.error('Error al obtener direcciones por entidad y ciudad:', error);
        throw error;
    }
}
  
  async getCiudades(): Promise<string[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'Farmacias'));
    const ciudades = new Set<string>();
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data['Ciudad']) { 
        ciudades.add(data['Ciudad']);
      }
    });
    return Array.from(ciudades);

  }

  
  async searchMedicamentosTodos(nmedicamento: string, entidad: string, direccionSeleccionada: string, ciudad: string): Promise<boolean> {
    console.log('Nombre:', nmedicamento);
    console.log('Entidad:', entidad);
    console.log('Dirección:', direccionSeleccionada);
    console.log('Ciudad:', ciudad);

    const medicamentos = await this.getMedicamentosTodos();
    console.log('Medicamentos:', medicamentos);

    return medicamentos.some(medicamento =>
      medicamento['nmedicamento'].toLowerCase() === nmedicamento.toLowerCase() &&
      medicamento['entidad'] === entidad &&
      medicamento['direcciones'].includes(direccionSeleccionada) &&
      medicamento['ciudad'] === ciudad,
      console.log('prueba', medicamentos)
      
    );
 
}


  async getMedicamentoByNombreEntidadDireccion(nombre: string, entidad: string, direccion: string) {
    console.log('Nombre:', nombre);
    console.log('Entidad:', entidad);
    console.log('Dirección:', direccion);

    const medicamentos = await this.getMedicamentos();
    console.log('Medicamentos:', medicamentos);

    return medicamentos.find(medicamento =>
      medicamento['nmedicamento'].toLowerCase() === nombre.toLowerCase() &&
      medicamento['entidad'] === entidad &&
      medicamento['direcciones'].includes(direccion)
    );
  }


async getEPSByCiudad(ciudad: string): Promise<string[]> {
  const querySnapshot = await getDocs(query(collection(this.firestore, 'Farmacias'), where('Ciudad', '==', ciudad)));
  const epsSet = new Set<string>();
  querySnapshot.forEach(doc => {
    const eps = doc.data()['Eps'];
    epsSet.add(eps);
  });
  return Array.from(epsSet);
}


async getEntidadesPorCiudadYEPS(ciudad: string, eps: string): Promise<string[]> {
  const querySnapshot = await getDocs(query(collection(this.firestore, 'Farmacias'), where('Ciudad', '==', ciudad), where('Eps', '==', eps)));
  const entidades = new Set<string>();
  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data['Nombre']) { 
      entidades.add(data['Nombre']);
    }
  });
  return Array.from(entidades);
}

async ObtenerDireccionesPorEntidadYCiudad(entidad: string, ciudad: string): Promise<string[]> {
  try {
    console.log('Consultando direcciones por entidad y ciudad...');
    console.log('Entidad:', entidad);
    console.log('Ciudad:', ciudad);

    const querySnapshot = await getDocs(
        query(
            collection(this.firestore, 'Farmacias'), 
            where('Nombre', '==', entidad),
            where('Ciudad', '==', ciudad)
        )
    );

    const direcciones: string[] = [];
    querySnapshot.forEach(doc => {
        const data = doc.data();
        const direccion = data['Direccion'];
        direcciones.push(direccion);
    });
    
    console.log('Direcciones encontradas:', direcciones);
    
    return direcciones;
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    return []; 
  }
}

async getPacientes() {
    const snapshot = await getDocs(query(collection(this.firestore, 'Pacientes')));
    return snapshot.docs.map(doc => doc.data());
  }
  
  async getReservas(): Promise<any[]> {
    const snapshot = await getDocs(collection(this.firestore, 'reservas'));
    return snapshot.docs.map(doc => doc.data());
  }
  
  async eliminarReserva(reservaData: any): Promise<void> {
    console.log(reservaData);

    const { nombre, entidad, direccionSeleccionada, fechaReserva, horaReserva, identificacion, nmedicamento } = reservaData;
   
    try {
      const querySnapshot = await getDocs(
        query(collection(this.firestore, 'reservas'), 
        where('nombre', '==', nombre),
        where('entidad', '==', entidad),
        where('direccionSeleccionada', '==', direccionSeleccionada),
        where('fechaReserva', '==', fechaReserva),
        where('horaReserva', '==', horaReserva),
        where('identificacion', '==', identificacion),
        where('nmedicamento', '==', nmedicamento))
      );
  
      querySnapshot.forEach(doc => {
        deleteDoc(doc.ref);
      });
      console.log('Reserva eliminada correctamente de la base de datos');
    } catch (error) {
      console.error('Error al eliminar la reserva de la base de datos:', error);
    }
  }


  async eliminarMedicamento(reservaData: any): Promise<void> {


    const {nmedicamento, entidad, direcciones ,ciudad,cantidad} = reservaData;
    

    try {
      const querySnapshot = await getDocs(
        query(collection(this.firestore, 'Medicamentos'), 
        where('nmedicamento', '==', nmedicamento),
        where('entidad', '==', entidad),
        where('direcciones', '==', direcciones),
        where('ciudad', '==', ciudad),
        where('cantidad', '==', cantidad))
      );
  
      querySnapshot.forEach(doc => {
        deleteDoc(doc.ref);
      });
      console.log('Medicamento eliminado correctamente de la base de datos');
    } catch (error) {
      console.error('Error al eliminar el medicamento de la base de datos:', error);
    }
  }

  async eliminarMedicamentoVencer(reservaData: any): Promise<void> {


    const {nombre, cantidad, fechaVencimiento ,telefono} = reservaData;
    

    try {
      const querySnapshot = await getDocs(
        query(collection(this.firestore, 'Entrega rapida'), 
        where('nombre', '==', nombre),
        where('cantidad', '==', cantidad),
        where('fechaVencimiento', '==', fechaVencimiento),
        where('telefono', '==', telefono)),
      
      );
  
      querySnapshot.forEach(doc => {
        deleteDoc(doc.ref);
      });
      console.log('Medicamento eliminado correctamente de la base de datos');
    } catch (error) {
      console.error('Error al eliminar el medicamento de la base de datos:', error);
    }
  }


  async agregarMedicamento(nombre: string, cantidad: number, fechaVencimiento: string, telefono: string) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'Entrega rapida'), {
        nombre: nombre,
        cantidad: cantidad,
        fechaVencimiento: fechaVencimiento,
        telefono: telefono
      });
      console.log('Medicamento agregado con ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error al agregar medicamento: ', e);
      throw e;
    }
  }

  async crearNotificacion(data: any) {
    try {
      await addDoc(collection(this.firestore, 'Notificaciones'), data);
    } catch (error) {
      throw error;
    }
  }

  async getPuntosCercanosDisponibles(ciudad: string, entidad: string, cantidad: number) {
    const querySnapshot = await getDocs(
      query(collection(this.firestore, 'Medicamentos'), 
        where('nmedicamento', '==', this.nmedicamento),
        where('ciudad', '==', ciudad),
        where('entidad', '==', entidad),
        where('cantidad', '>=', cantidad)
      )
    );
    
    const direccionesDisponibles: string[] = [];
    querySnapshot.forEach(doc => {
      const direccion = doc.data()['direccion'];
      direccionesDisponibles.push(direccion);
    });
  
    return direccionesDisponibles;
  }

  async modificarCantidadMedicamento(nmedicamento: string, ciudad: string, entidad: string, direcciones: string[], nuevaCantidad: number) {
    try {
      console.log("nmedicamento:", nmedicamento);
      console.log("ciudad:", ciudad);
      console.log("entidad:", entidad);
      console.log("direcciones:", this.direccionSeleccionada);
      console.log("nuevaCantidad:", nuevaCantidad);
  
      const q = query(collection(this.firestore, 'Medicamentos'), 
        where('nmedicamento', '==', nmedicamento),
        where('entidad', '==', entidad),
        where('ciudad', '==', ciudad),
        where('direcciones', '==', this.direccionSeleccionada)
      );
  
      const querySnapshot = await getDocs(q);
      console.log("querySnapshot:", querySnapshot);
  
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        console.log("docRef:", docRef);
        await setDoc(docRef, { cantidad: nuevaCantidad }, { merge: true });
        console.log('Cantidad modificada en la base de datos.');
      } else {
        console.error('No se encontró ningún documento con los criterios especificados.');
      }
    } catch (error) {
      console.error('Error al modificar la cantidad:', error);
    }
  }

  async getNotificaciones() {
    const snapshot = await getDocs(query(collection(this.firestore, 'Notificaciones')));
    return snapshot.docs.map(doc => doc.data());
  }

  
}  