import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { GemsComponent } from './gems/gems.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatDividerModule} from '@angular/material/divider';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gems', component: GemsComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GemsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    BrowserAnimationsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
  bootstrap: [
    AppComponent
  ],
  exports: [RouterModule]
})
export class AppModule { }
