export class BasicTax {
 idImpuesto: number;
 nombre: string;
 valor: number;
}

export class Tax extends BasicTax {
  idPais: string;
  idEstado: string;
  idCiudad: string;
  descripcion: string;
  tipo: string;
  aplicaXNoche: boolean;
  seDiscrimina: boolean;
  gravaLocalEnTerritorioInterno: boolean;
  idSAP: string;
  idSAPCompra: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  activo: boolean;
  baja: boolean;
}

export class FilterTaxes {
  pais: string;
  nombreImpuesto: string;
}
