import { Component, OnInit } from '@angular/core';
import { TaxesService } from '../../shared/services/taxes.service';
import { CommonService } from '../../shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tax } from '../../shared/models/tax.model';
import { Country } from 'src/app/shared/models/country.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-tax-detail',
  templateUrl: './tax-detail.component.html',
  styleUrls: ['./tax-detail.component.css']
})
export class TaxDetailComponent implements OnInit {
  countries$: Country[];
  states$: any;
  cities$: any;
  types$: any;
  tax = new Tax();
  id: number;
  private subject = new Subject<string>();
  notifyMessage: string;
  alertTitle = 'Vista de Impuestos';
  errorMessage = 'Opps error al guardar';
  successMessage = 'Guardado con Exito';

  constructor(
    private route: ActivatedRoute, private router: Router,
    private taxesService: TaxesService, private commonService: CommonService) {
      this.commonService.getCountries().subscribe(c => {
          this.countries$ = c;
        },
        error => {
          this.showMessage(error.message);
        });

      this.id = +this.route.snapshot.paramMap.get('id');

      if (this.id) {
        this.taxesService.getTax(this.id).subscribe(Response => {
          this.tax = Response;
        },
        error => {
          this.showMessage(error.message);
        });
      }
    }

  save(tax: Tax) {
    if (!(tax.nombre && tax.idPais && tax.tipo && tax.valor)) {
      swal.fire('Campos obligatorios', this.alertTitle, 'warning');
      return;
    }

    if (this.id) {
      tax.idImpuesto = +this.id;
      this.taxesService.updateTax(tax).subscribe(response => {
        swal.fire(this.successMessage, this.alertTitle, 'success')
        .then(() => {
          this.router.navigate(['../taxes']);
        }
        );
      }, error => {
        swal.fire(this.errorMessage, this.alertTitle, 'error');
      });
    } else {
      this.taxesService.createTax(tax).subscribe(response => {
        swal.fire(this.successMessage, this.alertTitle, 'success')
          .then(() => {
            this.router.navigate(['../taxes']);
          });
       }, error => {
        swal.fire(this.errorMessage, this.alertTitle, 'error');
       });
    }
  }

  cancel() {
    this.router.navigate(['../taxes']);
  }

  setAlertConfig() {
    this.subject.subscribe((message) => this.notifyMessage = message);
    this.subject.pipe(debounceTime(4000))
      .subscribe(() => this.notifyMessage = null);
  }

  public showMessage(message: string) {
    this.subject.next(`${ message }`);
  }

  ngOnInit(): void {
    this.setAlertConfig();
  }

}
