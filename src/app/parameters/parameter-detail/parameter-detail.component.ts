import { Component, OnInit, ViewChild, ErrorHandler } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Parameter } from 'src/app/shared/models/parameter.model';
import { Country } from 'src/app/shared/models/country.model';
import { DatatablesService } from 'src/app/shared/datatables/datatables.service';
import { ParametersService } from 'src/app/shared/services/parameters.service';
import { BasicTax } from 'src/app/shared/models/tax.model';
import { TaxesService } from 'src/app/shared/services/taxes.service';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from 'src/app/shared/services/common.service';
import { TypeService } from 'src/app/shared/models/typeService.model';
import { Affects } from 'src/app/shared/models/affect.model';
import { ParameterTax, Affect } from 'src/app/shared/models/parameterTax.model';
import { isNullOrUndefined } from 'util';
import { debounceTime } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Subject, merge } from 'rxjs';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-parameter-detail',
  templateUrl: './parameter-detail.component.html',
  styleUrls: ['./parameter-detail.component.css']
})
export class ParameterDetailComponent implements OnInit {
  idParameter: any;
  public parameter: Parameter = new Parameter();
  public parameterTax: ParameterTax = new ParameterTax();
  public parameterTaxArray: ParameterTax[] = [] as ParameterTax[];
  public countries: Country[];
  public typeService: TypeService[];
  public affects: Affects[];
  public dtOptions: DataTables.Settings = {};
  public taxes: BasicTax[];
  public valueSelect = {} as BasicTax;
  public editable: boolean;
  dtTrigger: Subject<any> = new Subject();
  public selectedAffect: any = new Affect();
  public selectedTypeService: any = new TypeService();
  public taxeIsEmpty = false;
  private subject = new Subject<string>();
  notifyMessage: string;
  alertTitle = 'Vista de Parametros';
  errorMessage = 'Opps error al guardar';
  successMessage = 'Guardado con Exito';
  errorNoTaxesMessage = 'Tiene que tener al menos un Impuesto asignado';

  @ViewChild(DataTableDirective) public dtElement: DataTableDirective;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private taxesService: TaxesService,
    private parametersService: ParametersService,
    private commonService: CommonService,
    private datatablesService: DatatablesService,
    private loadingService: LoadingService
  ) {
    this.idParameter = this.activatedRoute.snapshot.params.id;
    this.editable = this.idParameter != null;
  }

  ngOnInit(): void {
    this.setAlertConfig();
    this.initializeSelects();
    if (this.editable) {
      this.loadingService.show();
      this.parametersService
        .getParametersById(this.idParameter)
        .subscribe((response: Parameter) => {
          this.parameter = response;
          this.parameterTaxArray = response.parametroImpuesto;
          this.selectedTypeService = this.parameter.tipoServicio;

          this.initializeTable();
          this.reloadTable();
          this.loadingService.hide();
        }, error => {
          this.showMessage(error);
        });
    } else {
      this.parameter = this.initializeParameters();
    }

  }

  private initializeTable() {
    this.dtOptions = this.datatablesService.buildOptions({
      data: this.parameterTaxArray,
      columns: [
        {
          data: 'afecta.nombre',
          orderable: true
        },
        {
          data: 'impuesto.nombre',
          orderable: true
        },
        {
          data: 'impuesto.valor',
          orderable: true
        },
        {
          data: 'exento',
          orderable: false,
          className: 'row-checkBox',
          render: (data: boolean) => {
            return `<input type="checkbox" ${
              data ? 'checked' : ''
            } disabled class="form-check-input">`;
          }
        },
        {
          name: '',
          data: 'data',
          orderable: false,
          render: (data: any) => {
            return '<a href="javascript:void(0)">Eliminar</a>';
          }
        }
      ],
      rowCallback: (row: Node, data: ParameterTax) => {
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        (<any> $('td a', row)).unbind('click').bind('click', () => {
          const index = this.parameterTaxArray.indexOf(data);
          this.parameterTaxArray.splice(index, 1);
          this.refreshTable();
        });
        return row;
      }
    });
  }

  setAffect(selected: Affects) {
    if (selected) {
      this.parameterTax.afecta = selected;
    }
  }

  setTypeService(selected: TypeService) {
    if (selected) {
      this.parameter.tipoServicio = selected;
    }
  }

  setTax(selected: BasicTax) {
    if (selected) {
      this.parameterTax.impuesto = this.getNewTax(selected);
    }
  }

  private refreshTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  private reloadTable() {
    this.dtTrigger.next();
    this.refreshTable();
  }

  disable() {
    if (
      confirm(
        '¿Estas seguro que desea desactivar la configuración de Parámetros-Impuestos?'
      )
    ) {
      this.parametersService
        .disableParametersById(this.idParameter)
        .subscribe(response => {
          this.router.navigate(['../parameters']);
        });
    }
  }

  addParameterTaxes() {
    if (this.parameterTax.impuesto.idImpuesto === undefined) {
      this.taxeIsEmpty = true;
      return;
    } else {
      this.taxeIsEmpty = false;
    }
    this.parameterTaxArray.push(this.parameterTax);
    this.parameterTax = new ParameterTax();
    this.selectedAffect = this.getNewAffect(this.affects[0]);
    this.parameterTax.afecta = this.selectedAffect;
    this.parameterTax.impuesto.valor = null;

    if (!this.editable && this.parameterTaxArray.length === 1) {
      this.initializeTable();
      this.reloadTable();
    } else {
      this.refreshTable();
    }
  }

  addParameter() {
    this.parameter.parametroImpuesto = this.parameterTaxArray;
    if (this.parameterTaxArray.length > 0) {
      if (this.editable) {
        this.parametersService
        .updateParameters(this.parameter)
        .subscribe(response => {
          swal.fire(this.successMessage, this.alertTitle, 'success')
          .then(() => {
            this.router.navigate(['../parameters']);
          }
          );
        }, error => {
          swal.fire(this.errorMessage, this.alertTitle, 'error');
        });
      } else {
        this.parametersService
        .addParameters(this.parameter)
        .subscribe(response => {
          swal.fire(this.successMessage, this.alertTitle, 'success')
          .then(() => {
            this.router.navigate(['../parameters']);
          });
       }, error => {
        swal.fire(this.errorMessage, this.alertTitle, 'error');
        });
      }
    } else {
      swal.fire(this.errorNoTaxesMessage, '', 'error');
    }
  }

  private initializeSelects(): any {
    this.loadingService.show();
    const initializeSelect = () => {
      return this.commonService
        .getCountries()
        .pipe(
          mergeMap((countries: Country[]) =>
            this.taxesService
              .getShortAllTaxes()
              .pipe(
                mergeMap((taxes: BasicTax[]) =>
                  this.commonService
                    .getTypeOfService()
                    .pipe(
                      mergeMap((typeServices: TypeService[]) =>
                        this.commonService
                          .getAffects()
                          .pipe(
                            map((affects: Affects[]) => [
                              countries,
                              taxes,
                              typeServices,
                              affects
                            ])
                          )
                      )
                    )
                )
              )
          )
        );
    };

    initializeSelect().subscribe(result => {
      this.countries = result[0] as Country[];
      this.countries.unshift({
        idPais: '*',
        nombrePais: 'Comodin'
      } as Country);

      this.taxes = result[1] as BasicTax[];
      this.typeService = result[2] as TypeService[];
      this.parameter.tipoServicio = this.getNewTypeService(this.typeService[0]);
      this.selectedTypeService = this.getNewTypeService(this.typeService[0]);

      this.affects = result[3] as Affect[];
      this.parameterTax.afecta = this.getNewAffect(this.affects[0]);
      this.selectedAffect = this.getNewAffect(this.affects[0]);
      this.loadingService.hide();
    },
    error => {
      this.loadingService.hide();
      this.showMessage(error.message);
    });
  }

  private getNewAffect(afecta: Affect): Affect {
    return { idAfecta: afecta.idAfecta, nombre: afecta.nombre };
  }

  private getNewTax(tax: BasicTax): BasicTax {
    return { idImpuesto: tax.idImpuesto, valor: tax.valor, nombre: tax.nombre };
  }

  private getNewTypeService(typeService: TypeService): TypeService {
    return {
      idTipoServicio: typeService.idTipoServicio,
      descripcion: typeService.descripcion
    };
  }

  initializeParameters(): any {
    return new Parameter();
  }

  setAlertConfig() {
    this.subject.subscribe((message) => this.notifyMessage = message);
    this.subject.pipe(debounceTime(4000))
      .subscribe(() => this.notifyMessage = null);
  }

  public showMessage(message: string) {
    this.subject.next(`${ message }`);
  }
}
