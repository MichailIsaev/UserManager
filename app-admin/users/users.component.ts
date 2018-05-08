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
import { LoginComponent } from 'app/login/login.component';
import { AuthGuardService } from 'app/auth-guard.service.ts';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  const task_manager_port = 44444;
  const user_manager_port = 55555;

  name: string;
  mail: string;
  authority: string;

  ELEMENT_DATA: User[] = [

  ];

  delimiters = [
    { value: 10 },
    { value: 20 },
    { value: 50 },
    { value: 100 },
  ];


  size: number = 10;
  page: number = 1;
  pages: number = 1;
  lastRequest: string;


  displayedColumns = ['name', 'email', 'authority', 'description', 'delete'];
  dataSource = new MatTableDataSource<User>(this.ELEMENT_DATA);

  constructor(public dialog: MatDialog,
    public http: HttpClient,
    private snackBar: MatSnackBar,
    private guard: AuthGuardService,
    private login: LoginComponent,
    private cookies : CookieService) { }

  ngOnInit() {
    this.getUsers(1 , this.size);
  }



  getUsers(page: number, size: number) {
    this.http.get('http://localhost:55555/users?page=' + page + '&size=' + size,
      {
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
    if (this.lastRequest == 'All') {
      this.ELEMENT_DATA = [];
      this.getUsers(this.page, this.size);
    }
    else if (this.lastRequest == 'ByName') {
      this.ELEMENT_DATA = [];
      this.findByName(this.name, this.page, this.size);
    }
    else if (this.lastRequest == 'ByEmail') {
      this.ELEMENT_DATA = [];
      this.findByMail(this.mail, this.page, this.size);
    }
    this.dataSource._updateChangeSubscription();
  }

  resize() {
    this.page = 1;
    this.onPaginatorChange();
  }

  parse(data) {
    var data_size = data.size;
    var users = data.users;
    this.ELEMENT_DATA = []
    Object.values(users).forEach(item => {
      this.ELEMENT_DATA.push({
        name: item.name,
        email: item.email,
        authority: item.authorities,
        description: item.description,
      });
    });
    if (data_size % this.size == 0) {
      this.pages = parseInt(data_size / this.size);
    }
    else {
      this.pages = parseInt(data_size / this.size) + 1;
    }
    this.dataSource = new MatTableDataSource<User>(this.ELEMENT_DATA);
  }

  findByName(name: string, page: number, size: number) {
    if (name == "") {
      this.getUsers(page, size);
      this.lastRequest = 'All';
    }
    else {
      this.http.get('http://localhost:55555/users?name=' + name + '&page=' + page + '&size=' + size,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer' + this.cookies.get("access_token")
          })
        }).subscribe(data => {
          this.parse(data);
          this.lastRequest = 'ByName';
        });
    }
  }

  findByMail(mail: string, page: number, size: number) {
    if (mail == "") {
      this.getUsers(page, size);
      this.lastRequest = 'All';
    }
    else {
      this.http.get('http://localhost:55555/users?email=' + mail,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer' + this.cookies.get("access_token")
          })
        }).subscribe(data => {
          this.parse(data);
          this.lastRequest = 'ByEmail';
        });
    }
  }

  /*findByEmail(email : string){
    //if(email != ""){
      this.http.get('http://localhost:55555/users?email=' + email).subscribe(data => {
        this.ELEMENT_DATA = []
        Object.values(data).forEach(item => {
          this.ELEMENT_DATA.push({
            name: item.name,
            email: item.email,
            description: item.description,
            notification_time: item.notification_time//moment(item.date).format('hh:mm DD.MM.YYYY'),
          });
        });
        /*if (data_size % this.size == 0) {
          this.pages = parseInt(data_size / this.size);
        }
        else {
          this.pages = parseInt(data_size / this.size) + 1;
        }*/
  //this.dataSource = new MatTableDataSource<User>(this.ELEMENT_DATA);
  //});
  //  }
  //else{
  //this.getUsers();
  //  }
  //}*/


  deleteRow(row) {
    var index = this.dataSource.data.indexOf(row);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.http.delete('http://localhost:55555/users/?email=' + row.email,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer' + this.cookies.get("access_token")
        })
      }).subscribe(data => {

      });
    this.openSnackBar('Email of deleted task : ' + row.email, 'OK');
  }

  /*deleteAll() {
    this.dataSource.data = [];
    this.dataSource._updateChangeSubscription();
    this.http.get('http://localhost:8080/tasks/*').subscribe(data => {

    });
    this.openSnackBar('All tasks deleted.', 'OK');
  }*/

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewDialog, {
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

export interface User {
  name: string;
  email: string;
  authority: string;
  description: string;
}

@Component({
  selector: 'dialog-overview',
  templateUrl: './dialog-overview.html',
  styleUrls: ['./dialog-overview.css']
})
export class DialogOverviewDialog {

  const user_manager_port = 55555;

  constructor(private login: LoginComponent,
              private cookies: CookieService,
              private http: HttpClient,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  generatePass() {
    let crypto = UUID.UUID();
    crypto = crypto.toString();
    crypto += crypto
    crypto.replace('1', Math.round(1).toString())
    return crypto;
  }

  addUser(name: string, email: string, description: string) {
    return this.http.post(
      'http://localhost:55555/users',
      JSON.stringify({
        email: email,
        authorities: [
          "OTHER"
        ],
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
        enabled: true,
        name: name,
        description: description,
        password: this.generatePass()
      })
      , {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer' + this.cookies.get("access_token")
        })
      }).subscribe(data => {
      });
  }

  refresh(): void {
    window.location.reload();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
