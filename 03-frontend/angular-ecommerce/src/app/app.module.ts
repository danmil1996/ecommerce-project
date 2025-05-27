import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OKTA_CONFIG, OktaAuthGuard, OktaAuthModule, OktaCallbackComponent } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CartStatusComponentComponent } from './components/cart-status-component/cart-status-component.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { LoginComponent } from './components/login/login.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ShopValidatorComponent } from './components/shop-validator/shop-validator.component';
import myAppConfig from './config/my-app-config';
import { ProductService } from './services/product.service';

const oktaConfig = myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  const router = injector.get(Router);
  // Redirect to the login page
  router.navigate(['/login']);
}

const routes: Routes = [
  {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage }

  },

  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},

  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  
  
  {path: '',redirectTo: '/products', pathMatch: 'full'},
  {path: '**',redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchBarComponent,
    ProductDetailsComponent,
    CartStatusComponentComponent,
    CartDetailsComponent,
    CheckoutComponent,
    ShopValidatorComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: {oktaAuth}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
