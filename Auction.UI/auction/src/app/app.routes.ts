import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuctionFormComponent } from './components/auction-form/auction-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'newauction', component: AuctionFormComponent }
];