import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-shop-validator',
  templateUrl: './shop-validator.component.html',
  styleUrls: ['./shop-validator.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShopValidatorComponent),
      multi: true
    }
  ]
})
export class ShopValidatorComponent implements ControlValueAccessor {

  @Input() formControl: FormControl<any> | null = null;
  @Input() fieldName: string = "noFieldName";
  @Input() maxLength: number = 2;

  constructor() { }

  value: any;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Optional: disable state
  setDisabledState?(isDisabled: boolean): void {
    // handle disabling if needed
  }

  // Example of updating the value:
  updateValue(newValue: any) {
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
  }

}
