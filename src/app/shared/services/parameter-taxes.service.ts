import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class ParameterTaxesService {

  constructor (private httpClient: HttpClient, ) {};

  controller: string = 'ParametroImpuesto';


  deleteParameterTaxesById(id: number) {
    return this.httpClient.delete<any>(`${environment.apiUrl}/${this.controller}/${id}` );
  }

  addParameterTaxes(parameterTax: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/${this.controller}`,parameterTax );
  }

}
