import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { catchError, last, map, tap } from 'rxjs/operators';
import { FileUploadModel } from '../model/fileUploadedModel';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FileUploadComponent implements OnInit {
  @Input() text = 'Upload';
  @Input() param = 'file';
  @Input() target = 'https://file.io';
  @Input() accept = 'text/*';
  // tslint:disable-next-line:no-output-native
  @Output() complete = new EventEmitter<string>();
  fileInformation: any;
  private files: Array<FileUploadModel> = [];

  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) { }

  ngOnInit() {
  }

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;

    fileUpload.onchange = () => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({
          data: file,
          state: 'in',
          inProgress: false,
          progress: 0,
          canRetry: false,
          canCancel: true
        });
      }

      this.uploadFiles();
    };

    fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();

    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);

    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel) {
    const fd = new FormData();
    fd.append(this.param, file.data);

    const req = new HttpRequest('POST', this.target, fd, {
      reportProgress: true
    });

    file.inProgress = true;
    file.sub = this._http.request(req).pipe(
      map(event => {
        switch (event.type) {
              case HttpEventType.UploadProgress:
                    file.progress = Math.round(event.loaded * 100 / event.total);
                    break;
              case HttpEventType.Response:
                    return event;
        }
      }),
      tap(message => { }),
      last(),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        file.canRetry = true;
        return of(`${file.data.name} upload failed.`);
      })
    ).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {
          this.removeFileFromArray(file);
          this.complete.emit(event.body);
        }
      }
    );
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);

    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
}
