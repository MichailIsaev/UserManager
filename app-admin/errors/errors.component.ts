import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginComponent} from 'app/login/login.component';
import {AuthGuardService} from 'app/auth-guard.service.ts';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  ELEMENT_DATA: Error[] = [

  ];

  delimiters = [
    { value: 10 },
    { value: 20 },
    { value: 50 },
    { value: 100 },
  ];

  check: boolean = false;

  size: number = 10;
  page: number = 1;
  pages: number = 1;
  data: Error[];
  data_size: number;
  headers : Headers;

  const task_manager_port = 44444;
  const user_manager_port = 55555;

  displayedColumns = ['id', 'exceptionClass', 'stackTrace', 'date'];
  dataSource = new MatTableDataSource<Error>(this.ELEMENT_DATA);

  constructor(private http: HttpClient,
              private login: LoginComponent,
              private guard: AuthGuardService,
              private cookies : CookieService) {
  }

  ngOnInit() {
    this.getErrorRecords(1, 1000000);
  }




  getErrorRecords(page: number, size: number) {
    this.http.get('http://localhost:' +
      this.task_manager_port + '/error_records?page=' +
      page + '&size=' + size  ,{
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer' + this.cookies.get("access_token")
        })
      }
    ).subscribe(data => {
      this.parse(data);
    });
  }


  nextPage() {
    if (this.page < this.pages) {
      this.page += 1;
      this.onPaginatorChange();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page -= 1;
      this.onPaginatorChange();
    }
  }

  onPaginatorChange() {
    this.getErrorRecords(this.page, this.size);
  }


  resize() {
    this.page = 1;
    this.onPaginatorChange();
  }

  parse(data) {
    data = JSON.parse(JSON.stringify(data));
    this.ELEMENT_DATA = [];
    Object.values(data).forEach(item => {
      this.ELEMENT_DATA.push({
        id: item.id,
        exceptionClass: item.exceptionClass,
        message: item.message,
        stackTrace: item.stackTrace,
        date: item.date//).format('hh:mm DD.MM.YYYY'),
      });
    });

    if (!this.check) {
      this.data_size = this.ELEMENT_DATA.length;
      this.resize();
      this.check = true;
    }

    if (this.data_size % this.size == 0) {
      this.pages = parseInt(this.data_size / this.size);
    }
    else {
      this.pages = parseInt(this.data_size / this.size) + 1;
    }
    this.dataSource = new MatTableDataSource<Error>(this.ELEMENT_DATA);
  }
}

export interface Error {
  id: UUID;
  exceptionClass: string;
  message: string;
  stackTrace: string;
  date: Date;
}
