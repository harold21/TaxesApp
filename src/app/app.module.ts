import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
/*Authentication*/
import { AuthenticationGuard, MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InsertAuthTokenInterceptor } from './helpers/InsertAuthTokenInterceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import { HomeComponent } from './home/home.component';
import { TaxesComponent } from './taxes/taxes.component';
import { TaxDetailComponent } from './taxes/tax-detail/tax-detail.component';
import { ParametersComponent } from './parameters/parameters.component';
import { ParameterDetailComponent } from './parameters/parameter-detail/parameter-detail.component';
import { PreferredTerritoriesComponent } from './preferred-territories/preferred-territories.component';
import { PreferredTerritoriesDetailComponent
  } from './preferred-territories/preferred-territories-detail/preferred-territories-detail.component';

import { SharedModule } from './shared/shared.module';
import { TaxesService } from './shared/services/taxes.service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    BsNavbarComponent,
    HomeComponent,
    TaxesComponent,
    TaxDetailComponent,
    ParametersComponent,
    ParameterDetailComponent,
    PreferredTerritoriesComponent,
    PreferredTerritoriesDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    NgSelectModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    SweetAlert2Module.forRoot(),
    MsAdalAngular6Module.forRoot({
      tenant: 'fd98da37-eee4-4a48-967e-ae7774084ea3',
      clientId: environment.msAdalClientId,
      redirectUri: window.location.origin,
      endpoints: {
        'http://controlpanel.bestday.com': 'xxx-bae6-4760-b434-xxx'
      },
      navigateToLoginRequestUrl: false,
      cacheLocation: 'localStorage'
    })
  ],
  providers: [
    TaxesService,
    AuthenticationGuard,
    { provide: HTTP_INTERCEPTORS, useClass: InsertAuthTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
