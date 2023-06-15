import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from "./user-signup/user-signup.component";
import { WaiterComponent } from "./waiter/waiter.component";
import {CookComponent} from "./cook/cook.component";
import {BartenderComponent} from "./bartender/bartender.component";
import {HomeComponent} from "./home/home.component";
import {CashierComponent} from "./cashier/cashier.component";
import {ItemsMenuComponent} from "./items-menu/items-menu.component";
import {ordersStatusComponent} from "./orders-status/orders-status.component";
import {UsersListComponent} from "./users-list/users-list.component";



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'signup', component: UserSignupComponent },
  { path: 'cashiers', component: CashierComponent },
  { path: 'cooks', component: CookComponent },
  { path: 'bartenders', component: BartenderComponent },
  { path: 'waiters', component: WaiterComponent },
  { path: 'menu', component: ItemsMenuComponent },
  { path: 'orders', component: ordersStatusComponent },
  { path: 'userslist', component: UsersListComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
