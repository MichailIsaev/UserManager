import { FormControl } from '@angular/forms';
import { AppComponent } from './app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import React from 'react';
import TimePicker from 'material-ui/TimePicker';
import { MatDividerModule } from '@angular/material/divider';
import { Routes, RouterModule, Router, RouterLink, RouterLinkActive } from "@angular/router"
import { routes } from "./app.routes";
import {
  MatFormFieldModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

import { HttpModule } from '@angular/http';
import { CdkTableModule } from '@angular/cdk/table';
import 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { ViewComponentComponent, DialogOverviewExampleDialog, DialogSearchExampleDialog , Sidenav} from './view-component/view-component.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { UsersComponent , DialogOverviewDialog } from './users/users.component';
import { UshistoryComponent } from './ushistory/ushistory.component';
import { ErrorsComponent } from './errors/errors.component';
import { LoginComponent } from './login/login.component';
import {AuthGuardService} from './auth-guard.service.ts';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [
    AppComponent,
    ViewComponentComponent,
    DialogOverviewExampleDialog,
    PaginatorComponent,
    DialogSearchExampleDialog,
    DialogOverviewDialog,
    Sidenav,
    UsersComponent,
    UshistoryComponent,
    ErrorsComponent,
    LoginComponent,
  ],
  imports: [
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatDividerModule,
    MatListModule,
    MatSidenavModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [ViewComponentComponent, DialogOverviewExampleDialog, DialogSearchExampleDialog , UsersComponent , DialogOverviewDialog],
  providers: [AuthGuardService , LoginComponent , CookieService],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
