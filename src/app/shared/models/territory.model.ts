import { City } from './city.model';
import { Destination } from './destination.model';

export class Territory {
    idConfiguracion: number;
    afecta: number;
    idPais: string;
    idPaisTerritorioPreferente: string;
    territoriosPreferentesCiudad: City[];
    territoriosPreferentesDestino: Destination[];
  }

export class FilterTerritories {
  paisId: string;
}
