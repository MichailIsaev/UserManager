import { Component, OnInit, ViewChild, Inject, Output, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UUID } from 'angular2-uuid';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginatorComponent } from 'app/paginator/paginator.component'
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { LoginComponent} from 'app/login/login.component';
import {AuthGuardService} from 'app/auth-guard.service.ts';
import { CookieService } from 'ngx-cookie-service';


import * as _moment from 'moment';
const moment = _moment;

const task_manager_port = 44444;
const user_manager_port = 55555;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-view-component',
  templateUrl: './view-component.component.html',
  styleUrls: ['./view-component.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS
    },

  ]
})
export class ViewComponentComponent implements OnInit {



  ELEMENT_DATA: Element[] = [

  ];

  dialogComponent: Object;
  time: string;
  data: Object;
  from: Object;
  to: Object;
  displayedColumns = ['name', 'describe', 'targetTime', 'reaction', 'contacts', 'status', 'delete'];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  minDate = new Date();
  startDate = new FormControl(new Date(+this.minDate + 86400000));
  selection = new SelectionModel<Element>(true, []);
  size: number = 20;
  pages: number = 0;
  page: number = 1;
  name: string;
  lastRequest: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient, public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    //this.page = 1;
    var from = +new Date(event.value))
    var to = from + 86400000;
    this.from = from;
    this.to = to;
    this.ELEMENT_DATA = [];
    this.http.get('http://localhost:8080/tasks?from=' + from + '&to=' + to + '&next=' + this.page + '&size=' + this.size).subscribe(data => {
      var dataset = Object.values(data);
      if (Object.values(dataset[1]).length == 0) {
        this.dataSource.data = [];
        this.dataSource._updateChangeSubscription();
      }
      this.parse(data);
      this.lastRequest = 'Time';
    });
  }

  getHistoryRecords() {
    this.http.get('http://localhost:8080/tasks/history').subscribe(data => {
      alert(JSON.stringify(data))
    });
  }

  getErrorRecords() {
    this.http.get('http://localhost:8080/tasks/error_records').subscribe(data => {
      alert(data)
    });
  }

  resize() {
    this.onPaginatorChange();
  }


  startSearch(): void {
    let dialogRef = this.dialog.open(DialogSearchExampleDialog, {

    });
    alert(this.size)
    dialogRef.beforeClose().subscribe(result => {
      this.ELEMENT_DATA = [];
      this.dialogComponent = dialogRef.componentInstance;
      this.name = this.dialogComponent.name;
      alert('Name : ' + this.name);
      if (this.name != "") {
        this.http.get('http://localhost:8080/tasks?name=' + this.name + '&next=' + this.page + '&size=' + this.size).subscribe(data => {
          this.parse(data);
          this.lastRequest = this.dialogComponent.lastRequest;
          console.log('The dialog was closed');
        });
      }
      else {
        this.http.get('http://localhost:8080/tasks?next=' + this.page + '&size=' + this.size).subscribe(data => {
          this.parse(data);
          this.lastRequest = this.dialogComponent.lastRequest;
          console.log('The dialog was closed');
        });
      }
    });
  }

  onPaginatorChange(): void {
    if (this.lastRequest == 'Time') {
      this.ELEMENT_DATA = [];
      this.http.get('http://localhost:8080/tasks?from=' + this.from + '&to=' + this.to + '&next=' + this.page + '&size=' + this.size).subscribe(data => {
        this.parse(data);
        this.lastRequest = 'Time';
      });

    }
    else if (this.lastRequest == 'All') {
      this.ELEMENT_DATA = [];
      this.http.get('http://localhost:8080/tasks?next=' + this.page + '&size=' + this.size).subscribe(data => {
        this.parse(data);
        this.lastRequest = 'All';
      });

    }
    else if (this.lastRequest == 'Name') {
      alert('Name')
      this.ELEMENT_DATA = [];
      this.http.get('http://localhost:8080/tasks?name=' + this.name + '&next=' + this.page + '&size=' + this.size).subscribe(data => {
        this.parse(data);
        this.lastRequest = 'Name';
      });

    }
    else { alert('Something`s happening wrong') }


  }

  parse(data) {
    var data_size = data[0];
    data = Object.values(data[1]);
    data.forEach(item => {
      this.ELEMENT_DATA.push({
        id: item.id,
        name: item.name,
        describe: item.describe,
        targetTime: moment(item.targetTime).format('hh:mm DD.MM.YYYY'),
        reaction: JSON.parse(JSON.stringify(item.reaction)).type,
        contacts: item.contacts,
        status: item.status,
      });
    });
    if (data_size % this.size == 0) {
      this.pages = parseInt(data_size / this.size);
    }
    else {
      this.pages = parseInt(data_size / this.size) + 1;
    }
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.ngAfterViewInit();
  }

  deleteRow(row) {
    var index = this.dataSource.data.indexOf(row);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.http.delete('http://localhost:8080/tasks/' + row.id).subscribe(data => {

    });
    this.openSnackBar('Id of deleted task : ' + row.id, 'OK');
  }

  deleteAll() {
    this.dataSource.data = [];
    this.dataSource._updateChangeSubscription();
    this.http.get('http://localhost:8080/tasks/*').subscribe(data => {

    });
    this.openSnackBar('All tasks deleted.', 'OK');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {

  }

}

export interface Element {
  id: UUID;
  name: string;
  describe: string;
  targetTime: Date;
  contacts: string;
  reaction: Reaction;
  status: string;
}

export interface Reaction {
  type: string;
  value: string;
}



@Component({
  selector: 'dialog-overview',
  templateUrl: './dialog-overview.html',
  styleUrls: ['./dialog-overview.css']
})
export class DialogOverviewExampleDialog {


  uuid: UUID = UUID.UUID();
  num: number;

  types = [
    { value: 'SENDER', viewValue: 'MailSender' },
    { value: 'OUTPUT', viewValue: 'Output' },
    { value: 'SLEEP', viewValue: 'Sleep' }
  ];


  constructor(private http: HttpClient,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  postData(name: string, describe: string, date: string, time: string, type: string, value: string, contacts: string) {
    let uuid = UUID.UUID();
    return this.http.post(
      'http://localhost:8080/tasks',
      JSON.stringify({
        id: uuid,
        name: name,
        describe: describe,
        targetTime: +new Date(date + ' ' + time),
        reaction: {
          type: type,
          value: value
        },
        contacts: contacts.split(','),
        status: 'SCHEDULED'
      })
      , {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*'
        }),
        observe: 'response'
      }).subscribe(data => JSON.stringify(data));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'dialog-search',
  templateUrl: './dialog-search.html',
  styleUrls: [],
})
export class DialogSearchExampleDialog {
  lastRequest: string;
  name: string;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onSearchClick(taskName) {
    this.name = taskName;
    if (taskName != "")
      this.lastRequest = 'Name';
    else
      this.lastRequest = 'All';

    this.dialogRef.close();

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'sidenav',
  templateUrl: 'sidenav.html',
  styleUrls: ['sidenav.css'],
})
export class Sidenav {
  @ViewChild('sidenav') sidenav: MatSidenav;

  current = 'Users';

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute ,
    private login: LoginComponent,
    private guard: AuthGuardService) {

  }


  logout(){
    this.login.logout();
  }

  setCurrent(scope : string) {
    this.current = scope;
  }


  close() {
    this.sidenav.close();
  }
}
