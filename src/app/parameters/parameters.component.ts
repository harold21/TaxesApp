import { Component, OnInit, ViewChild } from '@angular/core';
import { ParametersService } from '../shared/services/parameters.service';
import { Country } from '../shared/models/country.model';
import { Router } from '@angular/router';
import { DatatablesService } from '../shared/datatables/datatables.service';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe } from '@angular/common';
import { ParametersFilter } from '../shared/models/parameter.model';
import { CommonService } from '../shared/services/common.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LoadingService } from '../shared/loading/loading.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {
  static readonly keyLocalStorage = 'FiltersParameters';
  public countries: Country[];
  public parameterFilters: ParametersFilter = new ParametersFilter();
  public dtOptions: DataTables.Settings = {};
  private subject = new Subject<string>();
  notifyMessage: string;
  @ViewChild(DataTableDirective) public dtElement: DataTableDirective;

  constructor(
    private commonService: CommonService,
    private parametersService: ParametersService,
    private loadingService: LoadingService,
    private router: Router,
    private datatablesService: DatatablesService,
    private datePipe: DatePipe
  ) {}
  ngOnInit() {
    this.setAlertConfig();
    this.initializeFilters();
    this.initializeSelects();
    this.initializeTable();
  }

  initializeTable() {
    this.loadingService.show();
    this.dtOptions = this.datatablesService.buildOptions({
      ajax: (dataTablesParameters: any, callback) => {
        this.parametersService
          .getParametersByFilters(this.parameterFilters)
          .subscribe(resp => {
            callback({ data: resp });
            this.loadingService.hide();
          });
      },
      columns: [
        {
          data: 'idParametro',
          orderable: false
        },
        {
          data: 'idPaisCompania',
          orderable: true
        },
        {
          data: 'idPaisCliente',
          orderable: true
        },
        {
          data: 'idPaisAgencia',
          orderable: true
        },
        {
          data: 'idPaisProducto',
          orderable: true
        },
        {
          data: 'idPaisProveedor',
          orderable: true
        },
        {
          data: 'tipoServicio',
          orderable: true
        },
        {
          data: 'cantidadImpuestos',
          orderable: true
        },
        {
          data: 'fechaModificacion',
          orderable: true,
          render: (data: Date) => {
            return this.datePipe.transform(data, 'dd-MM-yyyy');
          }
        },
        {
          data: 'fechaAlta',
          orderable: true,
          render: (data: Date) => {
            return this.datePipe.transform(data, 'dd-MM-yyyy');
          }
        },
        {
          name: 'acciones',
          data: 'data',
          orderable: false,
          render: (data: any) => {
            return '<a href="javascript:void(0)"> Editar</a>';
          }
        }
      ],
      rowCallback: (row: Node, data: any) => {
        $('a', row).off('click');
        $('a', row).on('click', () => {
          this.saveLocalStorage();
          this.router.navigate(['/parameter-detail/', data.idParametro]);
        });
        return row;
      }
    });
  }

  initializeFilters() {
    const filters = JSON.parse(
      localStorage.getItem(ParametersComponent.keyLocalStorage)
    ) as ParametersFilter;
    this.parameterFilters =
      filters == null ? this.initializeParameters() : filters;
  }

  initializeParameters() {
    return new ParametersFilter();
  }

  public async reloadTable() {
    const dtIntance = await this.dtElement.dtInstance;
    dtIntance.ajax.reload();
  }

  cleanFilters() {
    localStorage.setItem(
      ParametersComponent.keyLocalStorage,
      JSON.stringify(this.initializeParameters())
    );
    this.initializeFilters();
    this.initializeSelects();
    this.reloadTable();
  }

  saveLocalStorage() {
    localStorage.setItem(
      ParametersComponent.keyLocalStorage,
      JSON.stringify(this.parameterFilters)
    );
  }

  initializeSelects(): any {
    this.commonService.getCountries().subscribe(response => {
      this.countries = response;
      this.countries.unshift({ idPais: '*', nombrePais: 'Comodin'} as Country);
      this.countries.unshift({ idPais: '', nombrePais: 'Todos'} as Country);
      this.loadingService.hide();
    },
    error => {
      this.loadingService.hide();
      this.showMessage(error.message);
    });
  }

  public showMessage(message: string) {
    this.subject.next(`${ message }`);
  }

  setAlertConfig() {
    this.subject.subscribe((message) => this.notifyMessage = message);
    this.subject.pipe(debounceTime(4000))
      .subscribe(() => this.notifyMessage = null);
  }
}
