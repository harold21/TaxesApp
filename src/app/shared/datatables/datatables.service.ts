import { Injectable } from '@angular/core';

@Injectable()
export class DatatablesService {

  buildOptions(settings: DataTables.Settings): DataTables.Settings {
    return Object.assign({
      dom: '<t><l><p>',
      paging: true,
      pagingType: 'simple_numbers',
      pageLength: 10,
      info: true,
      serverSide: false,
      processing: false,
      searching: false,
      autoWidth: false,
      ordering: true,
      lengthChange: true,
      responsive: true,
      searchDelay: 400,
      language: {
        info: '_START_ - _END_ / _TOTAL_',
        infoEmpty: '0 - 0 / 0',
        emptyTable: 'Ningún registro encontrado',
        search: '',
        lengthMenu: '_MENU_', // hides the length title
        zeroRecords: 'No hay datos disponibles',
        paginate: {
          next: '>', // points to a custom font
          previous: '<' // points to a custom font
        }
      }
    }, settings, {
      initComplete: (initSettings, json) => {
        if (settings.initComplete) {
          settings.initComplete(initSettings, json);
        }
      },
      drawCallback: drawSettings => {
        if (settings.drawCallback) {
          settings.drawCallback(drawSettings);
        }
      }
    });
  }

}
