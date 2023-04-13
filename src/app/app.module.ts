import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridOptionsPanel } from './grid-options-panel.component';
import { MyCellRenderer } from './my-cell-renderer.component';
import { PDFExportPanelComponent } from './pdfexport-panel/pdfexport-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { ColorPickerComponent } from './pdfexport-panel/color-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    PDFExportPanelComponent,
    GridOptionsPanel,
    MyCellRenderer,
    ColorPickerComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AgGridModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
