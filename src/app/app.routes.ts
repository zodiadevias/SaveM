import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { BusinessSignupComponent } from '../components/business-signup/business-signup.component';
import { BusinessReviewsComponent } from '../components/business-reviews/business-reviews.component';
import { BusinessMenuComponent } from '../components/business-menu/business-menu.component';


export const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'business/register', component: BusinessSignupComponent},
    { path: 'business/reviews', component: BusinessReviewsComponent},
    { path: 'business/menu', component: BusinessMenuComponent}

];
