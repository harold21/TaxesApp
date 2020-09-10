import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxesService } from '../shared/services/taxes.service';
import { CommonService } from '../shared/services/common.service';
import { FilterTaxes } from '../shared/models/tax.model';
import { DatatablesService } from '../shared/datatables/datatables.service';
import { DataTableDirective } from 'angular-datatables';
import { Country } from '../shared/models/country.model';
import { LoadingService } from '../shared/loading/loading.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css']
})
export class TaxesComponent implements OnInit {
  filteredTaxes: FilterTaxes;
  countries$: Country[];
  public dtOptions: DataTables.Settings = {};
  private subject = new Subject<string>();
  notifyMessage: string;
  @ViewChild(DataTableDirective) public dtElement: DataTableDirective;

  constructor(
    private taxesService: TaxesService, private datatablesService: DatatablesService,
    private router: Router, private commonService: CommonService, private loadingService: LoadingService) {
    this.commonService.getCountries()
      .subscribe(c => { this.countries$ = c; },
        error => {
          this.showMessage(error.message);
      });
  }

  ngOnInit(): void {
    this.initializeFilters();
    this.initializeTable();
    this.setAlertConfig();
  }

  setAlertConfig() {
    this.subject.subscribe((message) => this.notifyMessage = message);
    this.subject.pipe(debounceTime(4000))
      .subscribe(() => this.notifyMessage = null);
  }

  initializeFilters() {
    this.filteredTaxes = { pais: '', nombreImpuesto: '' };
  }

  public async reloadTable() {
    const dtInstance = await (await (this.dtElement.dtInstance)).ajax.reload();
  }

  public showMessage(message: string) {
    this.subject.next(`${ message }`);
  }

  initializeTable() {
    this.loadingService.show();
    this.dtOptions = this.datatablesService.buildOptions({
      ajax: (dataTablesTaxes: any, callback) => {
        this.taxesService.getTaxesByFilters(this.filteredTaxes)
        .subscribe(resp => {
          callback({ data: resp });
          this.loadingService.hide();
        });
      }, columns: [
          { data: 'idPais', orderable: true },
          { data: 'nombre', orderable: true },
          { data: 'tipo', orderable: true },
          { data: 'valor', orderable: true },
          { name: 'configurar', data: 'data', orderable: false,
            render: () => '<a href="javascript:void(0)"> Editar</a>'
          }
        ],
      rowCallback: (row: Node, data: any) => {
        $('td a', row).off('click');
        $('td a', row).on('click', () => { this.router.navigate(['/tax-datail', data.idImpuesto]); });
        return row;
      }
    });
  }
}
