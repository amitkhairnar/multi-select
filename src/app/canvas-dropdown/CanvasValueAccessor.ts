import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forwardRef } from '@angular/core';

export abstract class CanvasValueAccessor implements ControlValueAccessor {
  val: any = '';

  get value (): any { return this.val; }
  set value (v: any) {
    if (v !== this.val) {
      this.val = v;
      this.onChange(v);
    }
  }

  writeValue (value: any) {
    this.val = value;
    this.onChange(value);
  }

  onChange = (_) => { };

  onTouched = () => { };

  registerOnChange (fn: (_: any) => void): void { this.onChange = fn; }

  registerOnTouched (fn: () => void): void { this.onTouched = fn; }
}
