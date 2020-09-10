import { ParameterTax } from './parameterTax.model';
import { TypeService } from './typeService.model';

export class ParametersFilter {
  companyCountry: string;
  clientCountry: string;
  agencyCountry: string;
  productCountry: string;
  providerCountry: string;

  constructor() {
    this.agencyCountry = '';
    this.clientCountry = '';
    this.companyCountry = '';
    this.productCountry = '';
    this.providerCountry = '';
  }
}

export class Parameter {
  idParametro: number;
  tipoServicio: TypeService;
  idAsociado: string;
  idPaisCliente: string;
  idPaisCompania: string;
  idPaisAgencia: string;
  idPaisProducto: string;
  idPaisProveedor: string;
  fechaAlta: string;
  fechaModificacion: string;
  activo: boolean;
  baja: string;
  parametroImpuesto: ParameterTax [];

  constructor() {
    this.idPaisCliente = '*';
    this.idPaisCompania = '*';
    this.idPaisAgencia = '*';
    this.idPaisProducto = '*';
    this.idPaisProveedor = '*';
    this.tipoServicio = {} as TypeService;
    this.tipoServicio.idTipoServicio = 0;
    this.parametroImpuesto = [] as ParameterTax [];
  }
}
