import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from "@angular/router";
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthGuardService } from 'app/auth-guard.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';


import 'rxjs/add/operator/catch';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient,
    private router: Router,
    private guard: AuthGuardService,
    private snackBar: MatSnackBar,
    private cookies: CookieService) {
  }

  ngOnInit() {
  }


  headers: HttpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', 'Basic ' + btoa('client:secret'))
    .set('Access-Control-Allow-Headers', '*')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', 'POST,OPTIONS,GET')
    .set('Access-Control-Allow-Credentials', 'true');


  loginUser(username: string, password: string) {
    return this.http.post('http://localhost:55555/oauth/token',
      new HttpParams()
        .set('grant_type', 'password')
        .set('username', username)
        .set('password', password)
      , { headers: this.headers })
      .subscribe((data) => {
        if (data) {
          this.cookies.set('authenticated' , true);
          this.cookies.set('mail' , username);
          this.cookies.set('access_token', data.access_token);
          this.cookies.set('refresh_token', data.refresh_token);
          this.cookies.set('expires_in', data.expires_in);
          this.router.navigate(['/users']);
        }
      }
      ,
      (err) => {
        this.openSnackBar('Bad credentials !', 'OK');
      }
      )
    );
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }


  logout() {
    this.cookies.set('authenticated' , false);
    this.cookies.deleteAll();
    this.router.navigate(['/login']);
  }
}
