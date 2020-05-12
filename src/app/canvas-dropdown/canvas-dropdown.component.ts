import {
  Component,
  HostListener,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CanvasValueAccessor } from './CanvasValueAccessor';
import { IDropdownSettings, ListItem } from './canvas-dropdown.model';


const noop = () => {};

@Component({
  selector: 'app-multi-select',
  templateUrl: './canvas-dropdown.component.html',
  styleUrls: ['./canvas-dropdown.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CanvasDropdownComponent),
    multi: true}],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CanvasDropdownComponent extends CanvasValueAccessor implements OnInit  {
  public _settings: IDropdownSettings;

  public _data: Array<ListItem> = [];

  public selectedItems: Array<ListItem> = [];

  public isDropdownOpen = true;
  _placeholder = 'Select';
  private _sourceDataType = null;
  private _sourceDataFields: Array<String> = [];
  @Input() data;

  filter: ListItem = new ListItem(this.data);

  defaultSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'text',
    disabledField: 'isDisabled',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: false,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
    allowRemoteDataSearch: false,
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
    if (!this.data) {
      this._data = [];
    } else {
      const firstItem = this.data[0];
      this._sourceDataType = typeof firstItem;
      this._sourceDataFields = this.getFields(firstItem);
      this._data = this.data.map((item: any) =>
        typeof item === 'string' || typeof item === 'number'
          ? new ListItem(item)
          : new ListItem({
              id: item[this._settings.idField],
              text: item[this._settings.textField],
              isDisabled: item[this._settings.disabledField],
            })
      );
    }

  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  @Input()
  public set placeholder(value: string) {
    if (value) {
      this._placeholder = value;
    } else {
      this._placeholder = 'Select';
    }
  }

  @Input()
  disabled = false;

  @Input()
  public set settings(value: IDropdownSettings) {
    if (value) {
      console.log(value);
      this._settings = Object.assign(this.defaultSettings, value);
    } else {
      this._settings = Object.assign(this.defaultSettings);
    }
  }

  @Output() filterChange = new EventEmitter<any>();

  @Output() dropDownClose = new EventEmitter<any>();

  @Output() select = new EventEmitter<any>();

  @Output() deSelect = new EventEmitter<any>();

  @Output() selectAll = new EventEmitter<Array<any>>();

  @Output() deSelectAll = new EventEmitter<Array<any>>();

  @Output() selectedValues = new EventEmitter<any>();



  onFilterTextChange($event) {
    this.filterChange.emit($event);
  }

  onChange: (_: any) => void;

  onItemClick($event: any, item: ListItem) {
    if (this.disabled || item.isDisabled) {
      return false;
    }

    const found = this.isSelected(item);
    const allowAdd =
      this._settings.limitSelection === -1 ||
      (this._settings.limitSelection > 0 &&
        this.selectedItems.length < this._settings.limitSelection);
    if (!found) {
      if (allowAdd) {
        this.addSelected(item);
      }
    } else {
      this.removeSelected(item);
    }
    if (this._settings.singleSelection && this._settings.closeDropDownOnSelection) {
      this.closeDropdown();
    }
  }

  writeValue(value: any) {
    if (value !== undefined && value !== null && value.length > 0) {
      if (this._settings.singleSelection) {
        try {
          if (value.length >= 1) {
            const firstItem = value[0];
            this.selectedItems = [
              typeof firstItem === 'string' || typeof firstItem === 'number'
                ? new ListItem(firstItem)
                : new ListItem({
                    id: firstItem[this._settings.idField],
                    text: firstItem[this._settings.textField],
                    isDisabled: firstItem[this._settings.disabledField],
                  }),
            ];
          }
        } catch (e) {
          return e.body.msg;
        }
      } else {
        const _data = value.map((item: any) =>
          typeof item === 'string' || typeof item === 'number'
            ? new ListItem(item)
            : new ListItem({
                id: item[this._settings.idField],
                text: item[this._settings.textField],
                isDisabled: item[this._settings.disabledField],
              })
        );
        if (this._settings.limitSelection > 0) {
          this.selectedItems = _data.splice(0, this._settings.limitSelection);
        } else {
          this.selectedItems = _data;
        }
      }
    } else {
      this.selectedItems = [];
    }
    this.onChangeCallback(value);
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  trackByFn(item: any) {
    return item.id;
  }

  isSelected(clickedItem: ListItem) {
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem.id === item.id) {
        found = true;
      }
    });
    return found;
  }

  isLimitSelectionReached(): boolean {
    return this._settings.limitSelection === this.selectedItems.length;
  }

  isAllItemsSelected(): boolean {
    const itemDisabledCount = this._data.filter(item => item.isDisabled).length;
    if ((!this.data || this.data.length === 0) && this._settings.allowRemoteDataSearch) {
      return false;
    }
    return this._data.length === this.selectedItems.length + itemDisabledCount;
  }

  showButton(): boolean {
    if (!this._settings.singleSelection) {
      if (this._settings.limitSelection > 0) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  itemShowRemaining(): number {
    return this.selectedItems.length - this._settings.itemsShowLimit;
  }

  addSelected(item: ListItem) {
    if (this._settings.singleSelection) {
      this.selectedItems = [];
      this.selectedItems.push(item);
    } else {
      this.selectedItems.push(item);
    }
    this.onChangeCallback(this.emittedValue(this.selectedItems));
    this.select.emit(this.emittedValue(item));
  }

  removeSelected(itemSel: ListItem) {
    this.selectedItems.forEach(item => {
      if (itemSel.id === item.id) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this.onChangeCallback(this.emittedValue(this.selectedItems));
    this.deSelect.emit(this.emittedValue(itemSel));
  }

  getSelected() {
    this.selectedValues.emit(this.selectedItems);
  }

  emittedValue(val: any): any {
    const selected = [];
    if (Array.isArray(val)) {
      val.map(item => {
        selected.push(this.objectify(item));
      });
    } else {
      if (val) {
        return this.objectify(val);
      }
    }
    return selected;
  }

  objectify(val: ListItem) {
    if (this._sourceDataType === 'object') {
      const obj = {};
      obj[this._settings.idField] = val.id;
      obj[this._settings.textField] = val.text;
      if (this._sourceDataFields.includes(this._settings.disabledField)) {
        obj[this._settings.disabledField] = val.isDisabled;
      }
      return obj;
    }
    if (this._sourceDataType === 'number') {
      return Number(val.id);
    } else {
      return val.text;
    }
  }

  toggleDropdown(evt) {
    evt.preventDefault();
    if (this.disabled && this._settings.singleSelection) {
      return;
    }
    this._settings.defaultOpen = !this._settings.defaultOpen;
    if (!this._settings.defaultOpen) {
      this.dropDownClose.emit();
    }
  }

  closeDropdown() {
    this._settings.defaultOpen = false;
    if (this._settings.clearSearchFilter) {
      this.filter.text = '';
    }
    this.dropDownClose.emit();
  }

  toggleSelectAll() {
    if (this.disabled) {
      return false;
    }
    if (!this.isAllItemsSelected()) {
      this.selectedItems = this._data.filter(item => !item.isDisabled).slice();
      this.selectAll.emit(this.emittedValue(this.selectedItems));
    } else {
      this.selectedItems = [];
      this.deSelectAll.emit(this.emittedValue(this.selectedItems));
    }
    this.onChangeCallback(this.emittedValue(this.selectedItems));
  }


  reset() {
    if (this.disabled) {
      return false;
    }

      this.selectedItems = [];
      this.deSelectAll.emit(this.emittedValue(this.selectedItems));

    this.onChangeCallback(this.emittedValue(this.selectedItems));
  }

  getFields(inputData) {
    const fields = [];
    if (typeof inputData !== 'object') {
      return fields;
    }
    // tslint:disable-next-line:forin
    for (const prop in inputData) {
      fields.push(prop);
    }
    return fields;
  }
}