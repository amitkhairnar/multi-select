import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {list : any[];
  title = 'DropDown';

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(){
  }

  ngOnInit() {
    this.dropdownList = [
      { Id: 1, val: 'United States' },
      { Id: 2, val: 'India' },
      { Id: 3, val: 'China' },
      { Id: 4, val: 'Japan' },
      { Id: 5, val: 'Germany' },
      { Id: 6, val: 'Australia' },
      { Id: 7, val: 'United Kingdom' },
      { Id: 8, val: 'Sweden' },
      { Id: 9, val: 'Norway' },
      { Id: 10,val: 'Dubai' }
    ];

  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  onSelectedValues(items: any){
    console.log(items);
  }

}
