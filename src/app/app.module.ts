import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { AgGridModule } from "ag-grid-angular";
import { HttpClientModule } from "@angular/common/http";

import { MyCellRenderer } from "./my-cell-renderer.component";
import { GridOptionsPanel } from './grid-options-panel.component';
import { PDFExportPanel } from './pdfExport/pdf-export-panel.component';
import { ColorPickerComponent } from './pdfExport/color-picker.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule.withComponents([MyCellRenderer])
  ],
  declarations: [AppComponent, MyCellRenderer, GridOptionsPanel, PDFExportPanel, ColorPickerComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
