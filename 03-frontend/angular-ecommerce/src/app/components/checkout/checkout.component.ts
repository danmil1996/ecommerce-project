import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidator } from 'src/app/validators/shop-validator';
import { environment } from 'src/environments/environment';

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

  storage: Storage = sessionStorage;

  
   // initialize Stripe API
   stripe = Stripe(environment.stripePublishableKey);

   paymentInfo: PaymentInfo = new PaymentInfo();
   cardElement: any;
   displayError: any = "";
  
   isPaymentButDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setUpStripePaymentForm();
    this.setFormControl();
    this.getCountries();
    this.getTotals();
  }

  setUpStripePaymentForm() {
    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });
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

  setFormControl (): void {

    // read the user's email address from browser storage
    let theEmail = this.storage.getItem('userEmail');
    if(theEmail==undefined){
      theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    }


    this.chkFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      ShopValidator.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      ShopValidator.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, 
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
    if (this.chkFormGroup.invalid || this.displayError.textContent !== "") {
      this.chkFormGroup.markAllAsTouched();
      return;
    } else {
      this.sendTheOrder();
    }
  }

  sendTheOrder() {
    let purchase = this.createPurchaseObject();

     // compute payment info
     this.paymentInfo.amount = Math.round (this.totalPrice * 100); // Stripe expects amount in cents
     this.paymentInfo.currency = "USD";
     this.paymentInfo.receiptEmail = purchase.customer?.email;
 
     // if valid form then
     // - create payment intent
     // - confirm card payment
     // - place order

     this.isPaymentButDisabled = true;


     this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe( // 1. create payment intent
      (paymentIntentResponse) => {
        this.stripe.confirmCardPayment( // 2. confirm card payment
          paymentIntentResponse.client_secret,
          { payment_method: { 
            card: this.cardElement,
            billing_details: this.getBilAddObj(purchase)}
          },
          { handleActions: false }
        ).then((result: any) => {
          if (result.error) { // there is an error
            alert(`There was an error: ${result.error.message}`); // inform the customer
            this.isPaymentButDisabled = false;
          } else {
            // 3. create an order
            this.checkoutService.placeOrder(purchase).subscribe({ // call REST API via the CheckoutService
              next: (response: any) => {
                alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                // reset cart
                this.resetCart();
                this.isPaymentButDisabled = false;
              },
              error: (err: any) => {
                alert(`There was an error: ${err.message}`);
                this.isPaymentButDisabled = false;
              }
            })
          }            
        });
      }
    );
  }

  getBilAddObj(purchase: Purchase) {
    if (!purchase || !purchase.customer || !purchase.billingAddress)
      return {};
    else return {
      email: purchase?.customer?.email,
      name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
      address: {
        line1: purchase.billingAddress.street,
        city: purchase.billingAddress.city,
        state: purchase.billingAddress.state,
        postal_code: purchase.billingAddress.zipCode,
        country: this.billAddCountry.value.code
      }
    }
  }

  resetCart() {
    // reset cart data
    this.cartService.clearCart();
    // reset form
    this.chkFormGroup.reset();
    // redirect to the shop page
    this.router.navigateByUrl("/products");
  }

  private createPurchaseObject(): Purchase {
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
