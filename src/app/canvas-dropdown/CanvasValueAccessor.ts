import { ControlValueAccessor } from '@angular/forms';

export abstract class CanvasValueAccessor<T> implements ControlValueAccessor {
  val: T ;

  get value (): T { return this.val; }
  set value (val: T) {
    if (val !== this.val) {
      this.onChange(val);
    }
  }

  writeValue (value: any) {
    this.onChange(value);
  }

  onChange = (_) => { };

  onTouched = () => { };

  registerOnChange (fn: (_: any) => void): void { this.onChange = fn; }

  registerOnTouched (fn: () => void): void { this.onTouched = fn; }
}
