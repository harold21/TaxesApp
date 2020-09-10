import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterTerritories, Territory } from '../models/territory.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerritoryService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getAllTerritories() {
    return this.httpClient.get<any>(`${environment.apiUrl}/TerritorioPreferente`);
  }

  getTerritoriesByFilters(params: FilterTerritories) {
    return this.httpClient
    .post<any>(`${environment.apiUrl}/TerritorioPreferente/filters`, params, this.httpOptions)
    .pipe(map((resp: { territorios: Territory[] }) => resp.territorios));
  }

  getTerritory(territoryId: number) {
    return this.httpClient
      .get(`${environment.apiUrl}/TerritorioPreferente/${ territoryId }`)
      .pipe(map((res: Territory) => res));
  }

  updateTerritory(territory: Territory) {
    return this.httpClient.put<any>(`${environment.apiUrl}/TerritorioPreferente`, territory);
  }

  createTerritory(territory: Territory) {
    return this.httpClient.post<any>(`${environment.apiUrl}/TerritorioPreferente`, territory);
  }
}
