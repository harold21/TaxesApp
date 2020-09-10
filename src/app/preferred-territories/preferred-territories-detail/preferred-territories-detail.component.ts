import { Component, OnInit } from '@angular/core';
import { Territory } from 'src/app/shared/models/territory.model';
import { Destination } from 'src/app/shared/models/destination.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TerritoryService } from 'src/app/shared/services/territories.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Country } from 'src/app/shared/models/country.model';
import { City } from 'src/app/shared/models/city.model';
import { Affect } from 'src/app/shared/models/parameterTax.model';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-preferred-territories-detail',
  templateUrl: './preferred-territories-detail.component.html',
  styleUrls: ['./preferred-territories-detail.component.css']
})
export class PreferredTerritoriesDetailComponent implements OnInit {
  territory = new Territory();
  destinations$: Destination[];
  cities$: City[];
  afecta$: Affect[];
  countries$: Country[];
  id: number;
  selectedCities: string[];
  selectedDestinations: string[];
  private subject = new Subject<string>();
  alertTitle = 'Vista de Territorios';
  notifyMessage: string;
  errorMessage = 'Opps error al guardar';
  successMessage = 'Guardado con Exito';

  constructor(
              private route: ActivatedRoute, private router: Router,
              private territoryService: TerritoryService, private commonService: CommonService, private loadingService: LoadingService) {

    this.commonService.getCountries().subscribe(c => { this.countries$ = c; },
      error => {
        this.showMessage(error.message);
      });

    this.commonService.getAffects().subscribe(a => { this.afecta$ = a; },
      error => {
        this.showMessage(error.message);
      });

    this.id = +this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.territoryService.getTerritory(this.id)
        .subscribe(response => {
          this.loadingService.show();
          this.territory = response;
          this.commonService.getDestinations(this.territory.idPais)
            .subscribe(d => {
              this.destinations$ = d;
              this.selectedDestinations = this.territory.territoriosPreferentesDestino.map(( { idDestino }) => idDestino);
            });
          this.commonService.getCities(this.territory.idPais)
            .subscribe(c => {
              this.cities$ = c;
              this.selectedCities = this.territory.territoriosPreferentesCiudad.map(( { idCiudad }) => idCiudad);
            });
          this.loadingService.hide();
        },
        error => {
          this.showMessage(error.message);
        });
    }
   }

  ngOnInit(): void {
    this.setAlertConfig();
  }

  save(territory: Territory) {
    if (!(territory.idPaisTerritorioPreferente && territory.idPais && territory.afecta)) {
      swal.fire('Campos obligatorios', this.alertTitle, 'warning');
      return;
    }

    if (this.id) {
      territory.idConfiguracion = +this.id;
      this.territoryService.updateTerritory(territory).subscribe(response => {
        swal.fire(this.successMessage, this.alertTitle, 'success')
        .then(() => {
          this.router.navigate(['../preferred-territories']);
        }
        );
      }, error => {
        swal.fire(this.errorMessage, this.alertTitle, 'error');
      });
    } else {
      territory.afecta = +territory.afecta;
      this.territoryService.createTerritory(territory).subscribe(response => {
        swal.fire(this.successMessage, this.alertTitle, 'success')
        .then(() => {
          this.router.navigate(['../preferred-territories']);
        }
        );
       }, error => {
        swal.fire(this.errorMessage, this.alertTitle, 'error');
       });
    }
  }

  onChangeCountry(country: string) {
    if (country) {
      this.commonService.getDestinations(country).subscribe(d => { this.destinations$ = d; },
        error => {
          this.showMessage(error.message);
        }
        );
      this.commonService.getCities(country).subscribe(c => { this.cities$ = c; });
    }
  }

  cancel() {
    this.router.navigate(['../preferred-territories']);
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
