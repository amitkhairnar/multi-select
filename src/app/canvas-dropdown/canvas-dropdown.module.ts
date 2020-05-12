import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasDropdownComponent } from './canvas-dropdown.component';
import { CanvasDataFilterPipe } from './canvas-data-filter.pipe';
import { ClickOutsideDirective } from './click-outside.directive';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CanvasDropdownComponent,
    CanvasDataFilterPipe,
  ClickOutsideDirective],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    CanvasDropdownComponent,
    ClickOutsideDirective,
    CanvasDataFilterPipe
  ]
})
export class CanvasDropdownModule { }
