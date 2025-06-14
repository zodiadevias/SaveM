import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { BusinessSignupComponent } from '../components/business-signup/business-signup.component';
import { BusinessReviewsComponent } from '../components/business-reviews/business-reviews.component';
import { BusinessMenuComponent } from '../components/business-menu/business-menu.component';
import { BusinessInboxComponent } from '../components/business-inbox/business-inbox.component';
import { BusinessHistoryComponent } from '../components/business-history/business-history.component';
import { BusinessProfileComponent } from '../components/business-profile/business-profile.component';
import { BusinessOrderComponent } from '../components/business-order/business-order.component';
import { StoreComponent } from '../components/store/store.component';
import { UserPaymentReviewOptionComponent } from '../components/user-payment-review-option/user-payment-review-option.component';
import { UserDeliveryComponent } from '../components/user-delivery/user-delivery.component';
import { ChatbotComponent } from '../components/chatbot/chatbot.component';
import { UserPickupComponent } from '../components/user-pickup/user-pickup.component';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';


export const routes: Routes = [

    {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {path: 'dashboard', component: DashboardComponent },
    {path: 'business/register', component: BusinessSignupComponent},
    {path: 'business/reviews', component: BusinessReviewsComponent},
    {path: 'business/menu', component: BusinessMenuComponent},
    {path: 'business/inbox', component: BusinessInboxComponent},
    {path: 'business/history', component: BusinessHistoryComponent},
    {path: 'business/profile', component: BusinessProfileComponent},
    {path: 'business/order', component: BusinessOrderComponent},
    {path: 'store/:id' , component: StoreComponent},
    {path: 'store', component: DashboardComponent},
    {path: 'payment', component: UserPaymentReviewOptionComponent},
    {path: 'delivery', component: UserDeliveryComponent},
    {path: 'chatbot', component: ChatbotComponent},
    {path: 'business', component: DashboardComponent},
    {path: 'pickup', component: UserPickupComponent},
    {path: 'profile', component: UserProfileComponent},

];
