import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { BusinessSignupComponent } from '../components/business-signup/business-signup.component';


export const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'business/register', component: BusinessSignupComponent}

];
