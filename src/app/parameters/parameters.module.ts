import { NgModule } from '@angular/core';
import { ParameterDetailComponent } from './parameter-detail/parameter-detail.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ParameterDetailComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    NgSelectModule,
    NgbModule,
  ]
})
export class ParametersModule { }
