import { Routes , RouterModule } from "@angular/router";
import { UsersComponent } from './users/users.component';
import { UshistoryComponent } from './ushistory/ushistory.component';
import { ErrorsComponent } from './errors/errors.component';
import { LoginComponent } from './login/login.component';
import {AuthGuardService} from './auth-guard.service.ts';
import { ViewComponentComponent, DialogOverviewExampleDialog, DialogSearchExampleDialog , Sidenav} from './view-component/view-component.component';



export const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "errors",
    component: ErrorsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "history",
    component: UshistoryComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "view",
    component: ViewComponentComponent,
    canActivate: [AuthGuardService],
  }
];

export const routing = RouterModule.forRoot(routes);
