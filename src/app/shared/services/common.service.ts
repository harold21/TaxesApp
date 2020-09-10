import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Country } from '../models/country.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Affects } from '../models/affect.model';
import { TypeService } from '../models/typeService.model';
import { Destination } from '../models/destination.model';
import { City } from '../models/city.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class CommonService {
  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get(`${environment.apiUrl}/general/paises`)
      .pipe(map((res: { paises: Country[] }) => res.paises));
  }

  getAffects(): Observable<Affects[]> {
    return this.httpClient
      .get(`${environment.apiUrl}/general/afecta`)
      .pipe(map((res: { afecta: Affects[] }) => res.afecta));
  }

  getTypeOfService(): Observable<TypeService[]> {
    return this.httpClient
      .get(`${environment.apiUrl}/general/tiposervicio`)
      .pipe(map((res: { tipoServicio: TypeService[] }) => res.tipoServicio));
  }

  getDestinations(countryId: string) {
    return this.httpClient
      .get(`${environment.apiUrl}/general/destinos/${ countryId }`)
      .pipe(map((res: { destinos: Destination[] }) => res.destinos));
  }

  getCities(countryId: string) {
    return this.httpClient
      .get(`${environment.apiUrl}/general/ciudades/${ countryId }`)
      .pipe(map((res: { ciudades: City[] }) => res.ciudades));
  }
}
