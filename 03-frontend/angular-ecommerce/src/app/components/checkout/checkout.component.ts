import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart-service.service';
import { ShopFormService } from 'src/app/services/shop-form-service.service';
import { ShopValidator } from 'src/app/validators/shop-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // Order Details
  totalQuantity: number = 0;
  totalPrice: number = 0.00;

  // Credit Card
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  // COuntry and State
  countryList: Country[] = [];
  billingAddStateList:  State[] = [];
  shippingAddStateList: State[] = [];

  chkFormGroup: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private service: ShopFormService,
    private cartService: CartService
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
      return;
    }
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
