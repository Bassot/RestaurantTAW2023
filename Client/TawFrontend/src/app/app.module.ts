import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt";
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import {getToken, UserService} from "./User/user.service";
import { CashierComponent } from './cashier/cashier.component';
import { WaiterComponent } from './waiter/waiter.component';
import { CookComponent } from './cook/cook.component';
import { BartenderComponent } from './bartender/bartender.component';
import { HomeComponent } from './home/home.component';
import {TableService} from "./Table/table.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ItemsMenuComponent} from "./items-menu/items-menu.component";
import {ItemService} from "./Item/item.service";
import {ordersStatusComponent} from "./orders-status/orders-status.component";
@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserSignupComponent,
    WaiterComponent,
    CookComponent,
    BartenderComponent,
    CashierComponent,
    HomeComponent,
    WaiterComponent,
    ItemsMenuComponent,
    ordersStatusComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
    ],
  providers: [
    UserService,
    TableService,
    ItemService,
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
