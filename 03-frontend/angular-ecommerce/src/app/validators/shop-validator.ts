import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidator {

    static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
        const inputValue = control?.value?.trim();
        if (inputValue?.length === 0) {
            return { 'notOnlyWhitespace': true };
        } else return null; // valud
    }
}
