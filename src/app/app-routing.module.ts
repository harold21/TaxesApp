import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { HomeComponent } from './home/home.component';
import { TaxesComponent } from './taxes/taxes.component';
import { TaxDetailComponent } from './taxes/tax-detail/tax-detail.component';
import { ParametersComponent } from './parameters/parameters.component';
import { ParameterDetailComponent } from './parameters/parameter-detail/parameter-detail.component';
import { PreferredTerritoriesComponent } from './preferred-territories/preferred-territories.component';
import {
  PreferredTerritoriesDetailComponent
  } from './preferred-territories/preferred-territories-detail/preferred-territories-detail.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'taxes', component: TaxesComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'tax-datail', component: TaxDetailComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'tax-datail/:id', component: TaxDetailComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'parameters', component: ParametersComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'parameter-detail', component: ParameterDetailComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'parameter-detail/:id', component: ParameterDetailComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'preferred-territories', component: PreferredTerritoriesComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'preferred-territory-detail', component: PreferredTerritoriesDetailComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'preferred-territory-detail/:id', component: PreferredTerritoriesDetailComponent, canActivate: [ AuthenticationGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
