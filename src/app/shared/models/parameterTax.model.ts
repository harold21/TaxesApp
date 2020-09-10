import { BasicTax } from './tax.model';

export class ParameterTax {
  idConfiguracion: number;
  afecta: Affect;
  impuesto: BasicTax;
  exento: boolean;

  constructor() {
    this.afecta = new  Affect();
    this.impuesto = new BasicTax();
    this.exento = false;
  }
}

export class Affect{
  idAfecta: number;
  nombre: string;
}

