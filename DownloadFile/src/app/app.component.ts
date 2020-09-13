import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DownloadFile';

  constructor(
    private fileService: FileService,
    private toastr: ToastrService,
  ) {}

  downloadExcel(): void {
    console.log('Uy ahora como descargo');

    const fileName = `reporte_${Math.random()}.xlsx`;

    this.fileService.getReport().subscribe(response => {
      this.manageExcelFile(response, fileName);
      this.toastr.success('Reporte descargado exitosamente');
    });
  }

  manageExcelFile(response: any, fileName: string): void {
    debugger;
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);

    const filtePath = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
    const downloadLink = document.createElement('a');
    downloadLink.href = filtePath;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
