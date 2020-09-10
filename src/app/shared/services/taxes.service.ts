import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterTaxes, BasicTax, Tax } from '../models/tax.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxesService {
  constructor(private httpClient: HttpClient) {}

  getAllTaxes() {
    return this.httpClient
    .get<any>(`${environment.apiUrl}/Impuesto`)
    .pipe(map((resp: { impuestos: Tax[] }) => resp.impuestos));
  }

  getTaxesByFilters(params: FilterTaxes) {
    return this.httpClient
    .post<any>(`${environment.apiUrl}/Impuesto/filters`, params)
    .pipe(map((resp: { impuestos: Tax[] }) => resp.impuestos));
  }

  getTax(taxId: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}/Impuesto/${taxId}`)
    .pipe(map((res: Tax) => res));
  }

  updateTax(tax: Tax) {
    return this.httpClient.put<any>(`${environment.apiUrl}/Impuesto`, tax);
  }

  createTax(tax) {
    return this.httpClient.post<any>(`${environment.apiUrl}/Impuesto`, tax);
  }

  getShortAllTaxes() {
    return this.httpClient
      .get(`${environment.apiUrl}/Impuesto`)
      .pipe(
        map((resp: { impuestos: Tax[] }) => {
          // tslint:disable-next-line: no-angle-bracket-type-assertion
          return resp.impuestos.map(x => <BasicTax> {
            idImpuesto: x.idImpuesto, nombre: x.nombre, valor: x.valor
          });
        })
      );
  }
}
