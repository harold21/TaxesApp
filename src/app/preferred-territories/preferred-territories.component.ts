import { Component, OnInit, ViewChild } from '@angular/core';
import { Country } from '../shared/models/country.model';
import { DataTableDirective } from 'angular-datatables';
import { DatatablesService } from '../shared/datatables/datatables.service';
import { FilterTerritories } from '../shared/models/territory.model';
import { TerritoryService } from '../shared/services/territories.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LoadingService } from '../shared/loading/loading.service';

@Component({
  selector: 'app-preferred-territories',
  templateUrl: './preferred-territories.component.html',
  styleUrls: ['./preferred-territories.component.css']
})
export class PreferredTerritoriesComponent implements OnInit {
  country: string;
  filteredTerritories: FilterTerritories;
  countries$: Country[];
  public dtOptions: DataTables.Settings = {};
  private subject = new Subject<string>();
  notifyMessage: string;
  @ViewChild(DataTableDirective) public dtElement: DataTableDirective;

  constructor(
              private territoryService: TerritoryService, private datatablesService: DatatablesService,
              private router: Router, private commonService: CommonService,  private loadingService: LoadingService, ) {
    this.loadingService.show();
    this.commonService.getCountries().subscribe(c => {
      this.countries$ = c;
      this.loadingService.hide();
    },error => {
        this.showMessage(this.notifyMessage);
    });
  }

  ngOnInit(): void {
    this.initializeFilters();
    this.initializeTable();
    this.setAlertConfig();
  }

  initializeFilters() {
    this.filteredTerritories = { paisId: '' };
  }

  public async reloadTable() {
      const dtInstance = await (await (this.dtElement.dtInstance)).ajax.reload();
  }

  setAlertConfig() {
    this.subject.subscribe((message) => this.notifyMessage = message);
    this.subject.pipe(debounceTime(4000))
      .subscribe(() => this.notifyMessage = null);
  }

  public showMessage(message: string) {
    this.subject.next(`${ message }`);
  }

  initializeTable() {
    this.dtOptions = this.datatablesService.buildOptions({
      ajax: (dataTablesTerritories: any, callback) => {
        this.territoryService.getTerritoriesByFilters(this.filteredTerritories)
          .subscribe(resp =>  { callback({ data: resp }); });
      }, columns: [
          { data: 'idPaisTerritorioPreferente', orderable: true },
          { data: 'idPais', orderable: true },
          { data: 'afecta', orderable: true },
          { data: 'territoriosPreferentesDestino[].nombreDestino', orderable: true },
          { data: 'territoriosPreferentesCiudad[].nombreCiudad', orderable: true },
          { name: 'configurar', data: 'data', orderable: false,
            render: () => '<a href="javascript:void(0)"> Editar</a>'
          }
        ],
      rowCallback: (row: Node, data: any) => {
        $('td a', row).off('click');
        $('td a', row).on('click', () => { this.router.navigate(['/preferred-territory-detail', data.idConfiguracion]); });
        return row;
      }
    });
  }
}
