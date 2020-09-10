import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ParametersService } from './services/parameters.service';
import { DatatablesService } from './datatables/datatables.service';
import { DataTablesModule } from 'angular-datatables';
import { DatePipe, CommonModule } from '@angular/common';
import { ParameterTaxesService } from './services/parameter-taxes.service';
import {NgSelectModule} from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonService } from './services/common.service';
import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from './loading/loading.service';

@NgModule({
  declarations: [LoadingComponent],
  imports: [
    HttpClientModule,
    DataTablesModule,
    FormsModule,
  ],
  providers: [
    CommonService,
    ParametersService,
    ParameterTaxesService,
    DatatablesService,
    DatePipe,
    LoadingService,
  ],
  exports: [
    DataTablesModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    LoadingComponent,
  ]
})

export class SharedModule { }
