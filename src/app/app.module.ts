import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CanvasDropdownModule } from './canvas-dropdown/canvas-dropdown.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CanvasDropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
