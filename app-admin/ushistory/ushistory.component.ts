import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginComponent} from 'app/login/login.component';
import {AuthGuardService} from 'app/auth-guard.service.ts';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-ushistory',
  templateUrl: './ushistory.component.html',
  styleUrls: ['./ushistory.component.css']
})
export class UshistoryComponent implements OnInit {

  ELEMENT_DATA: History[] = [

  ];

  delimiters = [
    { value: 10 },
    { value: 20 },
    { value: 50 },
    { value: 100 },
  ];

  check : boolean = false;

  size: number = 20;
  page: number = 1;
  pages : number = 1;
  data : History[];
  datah_size : number;

  const task_manager_port = 44444;
  const user_manager_port = 55555;

  displayedColumns = ['eventDate', 'task_id', 'user' ,  'event'];
  dataSource = new MatTableDataSource<History>(this.ELEMENT_DATA);

  constructor(private http: HttpClient,
              private login: LoginComponent,
              private cookies: CookieService) {
  }

  ngOnInit() {
    this.getHistory(1 , 1000000);
  }

  getHistory(page :number, size : number){
    this.http.get('http://localhost:' + this.task_manager_port + '/history?page=' +
    page + '&size=' + size ,   {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer' + this.cookies.get("access_token")
        })
      }).subscribe(data => {
      this.parse(data);
    });
  }

  nextPage(){
    if (this.page < this.pages) {
      this.page += 1;
      this.onPaginatorChange();
    }
  }

  previousPage(){
    if (this.page > 1) {
      this.page -= 1;
      this.onPaginatorChange();
    }
  }

  onPaginatorChange(){
    this.getHistory(this.page , this.size);
  }

  resize(){
    this.page = 1;
    this.onPaginatorChange();
  }

  parse(data) {
    data = JSON.parse(JSON.stringify(data));
    this.ELEMENT_DATA = [];
    Object.values(data).forEach(item => {
      this.ELEMENT_DATA.push({
        eventDate: item.eventDate,
        task_id : item.currentTask.id,
        user: item.currentTask.user,
        event: item.event,//moment(item.date).format('hh:mm DD.MM.YYYY'),
      });
    });

    if(!this.check){
      this.datah_size = this.ELEMENT_DATA.length;
      this.check = true;
      this.resize();
    }

    if (this.datah_size % this.size == 0) {
        this.pages = parseInt(this.datah_size / this.size);
    }
    else {
        this.pages = parseInt(this.datah_size/ this.size) + 1;
    }
    this.dataSource = new MatTableDataSource<Error>(this.ELEMENT_DATA);
  }

}

export interface History{
  eventDate : Date;
  task_id : UUID;
  user : string;
  event : string;
}

export interface Task {
  id: UUID;
  name: string;
  describe: string;
  targetTime: Date;
  contacts: string;
  reaction: Reaction;
  status: string;
}
