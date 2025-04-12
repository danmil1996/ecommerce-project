import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidator } from 'src/app/validators/shop-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: []
})
export class CheckoutComponent implements OnInit {

  // Order Details
  totalQuantity: number = 0;
  totalPrice: number = 0.00;

  // Credit Card
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  // Countries and States
  countryList: Country[] = [];
  billingAddStateList:  State[] = [];
  shippingAddStateList: State[] = [];

  chkFormGroup: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private service: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setFormControl();
    this.setCreaditCardFormData ();
    this.getCountries();
    this.getTotals();
  }

  getTotals() {
    // Tot Price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );  
    // Tot Quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  setCreaditCardFormData() {
    const currMonth = new Date().getMonth() + 1;
    this.service.getCreditCardMonthsArray(currMonth).subscribe(
      data => this.creditCardMonths = data
    );
    this.service.getCreditCardYearsArray().subscribe(
      data => this.creditCardYears = data
    );
  }  

  setFormControl (): void {
    this.chkFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      ShopValidator.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      ShopValidator.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, 
                                    Validators.pattern (/^[^\s@]+@[^\s@]+\.[^\s@]+$/)])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    ShopValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                  ShopValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    ShopValidator.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    ShopValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                  ShopValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    ShopValidator.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), 
          ShopValidator.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]),
        exiprationMonth: new FormControl('', [Validators.required]),
        exiprationYear: new FormControl('', [Validators.required])
      })
    });
  }

  /************ GETTERS ***************/
  get firstName(): FormControl<any> { return this.chkFormGroup.get('customer.firstName') as FormControl<any>; }
  get lastName(): FormControl<any>  { return this.chkFormGroup.get('customer.lastName')  as FormControl<any>; }
  get email(): FormControl<any>     { return this.chkFormGroup.get('customer.email') as FormControl<any>; }
  
  get shpAddStreet(): FormControl<any>    { return this.chkFormGroup.get('shippingAddress.street') as FormControl<any>; }
  get shpAddCity(): FormControl<any>      { return this.chkFormGroup.get('shippingAddress.city') as FormControl<any>; }
  get shpAddZipCode(): FormControl<any>   { return this.chkFormGroup.get('shippingAddress.zipCode') as FormControl<any>; }
  get shpAddState(): FormControl<any>     { return this.chkFormGroup.get('shippingAddress.state') as FormControl<any>; }
  get shpAddCountry(): FormControl<any>   { return this.chkFormGroup.get('shippingAddress.country') as FormControl<any>; }  

  get billAddStreet(): FormControl<any>   { return this.chkFormGroup.get('billingAddress.street') as FormControl<any>; }
  get billAddCity(): FormControl<any>     { return this.chkFormGroup.get('billingAddress.city') as FormControl<any>; }
  get billAddZipCode(): FormControl<any>  { return this.chkFormGroup.get('billingAddress.zipCode') as FormControl<any>; }
  get billAddState(): FormControl<any>    { return this.chkFormGroup.get('billingAddress.state') as FormControl<any>; }
  get billAddCountry(): FormControl<any>  { return this.chkFormGroup.get('billingAddress.country') as FormControl<any>; }
  
  get cardType(): FormControl<any>       { return this.chkFormGroup.get('creditCard.cardType') as FormControl<any>; }
  get nameOnCard(): FormControl<any>     { return this.chkFormGroup.get('creditCard.nameOnCard') as FormControl<any>; }
  get cardNumber(): FormControl<any>     { return this.chkFormGroup.get('creditCard.cardNumber') as FormControl<any>; }
  get securityCode(): FormControl<any>   { return this.chkFormGroup.get('creditCard.securityCode') as FormControl<any>; }
  get exiprationMonth(): FormControl<any> { return this.chkFormGroup.get('creditCard.exiprationMonth') as FormControl<any>; }
  get exiprationYear(): FormControl<any>  { return this.chkFormGroup.get('creditCard.exiprationYear') as FormControl<any>; }

  onSubmit () {
    if (this.chkFormGroup.invalid) {
      this.chkFormGroup.markAllAsTouched();
    } else { 
      this.sendTheOrder();
    }
  }

  sendTheOrder() {
    let purchase = this.createPurchaseObject();

    // call REST API via checkout service
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    });
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    // reset form
    this.chkFormGroup.reset();
    // redirect to the shop page
    this.router.navigateByUrl("/products");
  }

  private createPurchaseObject() {
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create order items form cart items
    let orderItems: OrderItem[] = cartItems.map(tmpCartItem => new OrderItem(tmpCartItem));

    // populate purchase - customer, order, order items, shipping and billing address
    let purchase = new Purchase();
    purchase.order = order;
    purchase.orderItems = orderItems;
    purchase.customer = this.chkFormGroup.controls['customer'].value;

    this.setShipAndBillAddresses(purchase);
    return purchase;
  }

  private setShipAndBillAddresses(purchase: Purchase): void {
    // Shipping address
    purchase.shippingAddress = this.chkFormGroup.controls['shippingAddress'].value;
    // Shipping - Country
    const shipCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    if (purchase.shippingAddress) purchase.shippingAddress.country = shipCountry.name;
    // Shipping - State
    const shipState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    if (purchase.shippingAddress && purchase.shippingAddress.state) purchase.shippingAddress.state = shipState.name;

    // Billing address
    purchase.billingAddress = this.chkFormGroup.controls['billingAddress'].value;
    // Billing - Country
    const billCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    purchase.billingAddress = this.chkFormGroup.controls['billingAddress'].value;
    if (purchase.billingAddress) purchase.billingAddress.country = billCountry.name;
    // Billing - State
    const billState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    if (purchase.billingAddress && purchase.billingAddress.state) purchase.billingAddress.state = billState.name;
  }

  /************ CREDIT CARD ***************/
  onChangeCardYear($event: any) {
    const selectedYear: number = Number($event);
    const currentYear: number = new Date().getFullYear();
    let startMonth: number = selectedYear === currentYear ? new Date().getMonth() + 1 : 1;
    this.service.getCreditCardMonthsArray(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }

  /************ ADDRESS ***************/

  getCountries() {
    this.service.getCountries$().subscribe(
      data => this.countryList = data
    );
  }

  copyShippingToBillingAddress($event: any) {
    var formGroup = this.chkFormGroup.controls['billingAddress'];
    if ($event.target.checked) {
      formGroup.setValue(this.chkFormGroup.controls['shippingAddress'].value);
      this.billingAddStateList = this.shippingAddStateList;
    } else {
      formGroup.reset();
      this.billingAddStateList = [];
    }
  }

  onChangeShippingAddCountry(country: Country) {
    if (country && country?.code) {
      this.service.getStates$(country.code).subscribe(
        data => {
          this.shippingAddStateList = data
          if (this.shippingAddStateList?.length > 0) {
            const formGroup = this.chkFormGroup.controls['shippingAddress'];
            formGroup.get('state')?.setValue(this.shippingAddStateList[0]);
          } // if
        }
      );
    } else {
      this.shippingAddStateList = [];
    }
  }

  onChangeBillingAddCountry(country: Country) {
    if (country && country?.code) {
      this.service.getStates$(country.code).subscribe(
        data => {
          this.billingAddStateList = data
          if (this.billingAddStateList?.length > 0) {
            const formGroup = this.chkFormGroup.controls['billingAddress'];
            formGroup.get('state')?.setValue(this.billingAddStateList[0]);
          } // if
        }
      );
    } else {
      this.billingAddStateList = [];
    }
  }

}
