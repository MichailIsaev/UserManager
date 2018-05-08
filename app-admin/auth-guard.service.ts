import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from "@angular/router";
import { LoginComponent } from './login/login.component.ts';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
              private http: HttpClient,
              private cookies : CookieService) { }

  checkAdmin() {
    this.http.get('http://localhost:55555/users?email=' + this.cookies.get("mail"),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer' + this.cookies.get("access_token")
        })
      }).subscribe(data => {
        this.cookies.set('authority' , data.users[0].authorities);
        if (data.users[0].authorities != 'SUPER_USER') {
          this.cookies.set('authenticated' , false);
          this.router.navigate(['/login']);
        }
      });

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.checkAdmin();

    if (next.url[0].path == '/login') {
      if (this.cookies.get("authenticated") == null) {
        return false;
      }
      else
        return true;
    }

    if (this.cookies.get("authenticated")) {
      return true;
    }


    this.router.navigate(['/login']);
    return false;
  }
}
