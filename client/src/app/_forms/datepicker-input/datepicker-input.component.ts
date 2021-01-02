import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BsDatepickerConfig, DatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-datepicker-input',
  templateUrl: './datepicker-input.component.html',
  styleUrls: ['./datepicker-input.component.css']
})
export class DatepickerInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() type: string = "text";
  @Input() maxDate: Date;

  datePickerConfig: BsDatepickerConfig;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.setConfigDatePicker();
  }

  setConfigDatePicker(): void {
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.dateInputFormat = "DD/MM/YYYY";
    this.datePickerConfig.containerClass = "theme-red";
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }
}
