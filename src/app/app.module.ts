import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MainComponent } from './views/main/main.component';
import { BoxComponent } from './components/box/box.component';
import { StrobeBoxComponent } from './components/effects/strobe-box/strobe-box.component';
import { DropdownListComponent } from './components/controls/dropdown-list/dropdown-list.component';
import { FormsModule } from '@angular/forms';
import { StrobeControlsComponent } from './components/controls/strobe-controls/strobe-controls.component';
import { ShiftControlsComponent } from './components/controls/shift-controls/shift-controls.component';
import { ShiftBoxComponent } from './components/effects/shift-box/shift-box.component';
import { ToggleComponent } from './components/controls/toggle/toggle.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    BoxComponent,
    StrobeBoxComponent,
    DropdownListComponent,
    StrobeControlsComponent,
    ShiftControlsComponent,
    ShiftBoxComponent,
    ToggleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
