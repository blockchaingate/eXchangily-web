import { HttpService } from '../../../../services/http.service';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map } from 'rxjs';

const filePath = 'assets/countries.json';

@Component({
  selector: 'app-country-picker',
  templateUrl: './country-picker.component.html',
  styleUrls: ['./country-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountryPickerComponent),
      multi: true
    }
  ]
})
export class CountryPickerComponent implements ControlValueAccessor {
  @Input() country;

  countries;
  propagateChange: any;
  validateFn: any;

  constructor(private http: HttpService) {
    this.http.get(filePath).pipe(map(res => res))
    .subscribe((res) => {
      this.countries = res;
    });
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.country = value;
    }
  }

  selectCountry(value: any) {
    const country = value.target.value;
    this.propagateChange(country);
  }

  registerOnTouched() {
  }

  registerOnChange(fn: Function) {
    this.propagateChange = fn;
  }
}
