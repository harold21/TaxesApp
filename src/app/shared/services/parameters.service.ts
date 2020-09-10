import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ParametersFilter, Parameter } from '../models/parameter.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export  class ParametersService {
  constructor(private httpClient: HttpClient) {}
  controller = 'Parametro';

  getParametersByFilters(params: ParametersFilter) {
    return this.httpClient
    .post<any>(`${ environment.apiUrl }/${this.controller}/filters`, params)
    .pipe(map((resp: { parametros: Parameter[] }) => resp.parametros));
  }

  getParametersById(id: number) {
    return this.httpClient.get<any>(`${ environment.apiUrl}/${this.controller}/${id}` );
  }

  updateParameters(parameter: Parameter) {
    return this.httpClient.put<any>(`${ environment.apiUrl}/${this.controller}`,parameter );
  }

  addParameters(parameter: Parameter) {
    return this.httpClient.post<any>(`${ environment.apiUrl}/${this.controller}`,parameter );
  }

  disableParametersById(id: number) {
    return this.httpClient.get<any>(`${ environment.apiUrl}/${this.controller}/${id}` );
  }
}


