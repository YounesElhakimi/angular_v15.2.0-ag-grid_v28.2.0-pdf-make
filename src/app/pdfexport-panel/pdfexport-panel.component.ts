import { Component, Input } from '@angular/core';
import printDoc from "./printDoc";

@Component({
  // standalone: true,
  selector: 'zg-app-pdfexport-panel',
  templateUrl: './pdfexport-panel.component.html',
  styles: [],
})
export class PDFExportPanelComponent {
  @Input() agGridApi: any;
  @Input() agColumnApi: any;

  PDF_HEADER_COLOR = "#f8f8f8";
  PDF_INNER_BORDER_COLOR = "#dde2eb";
  PDF_OUTER_BORDER_COLOR = "#babfc7";
  PDF_LOGO =
    "https://raw.githubusercontent.com/AhmedAGadir/ag-grid-todo-list-react-typescript/master/src/assets/new-ag-grid-logo.png";
  PDF_PAGE_ORITENTATION = "landscape";
  PDF_WITH_HEADER_IMAGE = true;
  PDF_WITH_FOOTER_PAGE_COUNT = true;
  PDF_HEADER_HEIGHT = 25;
  PDF_ROW_HEIGHT = 15;
  PDF_ODD_BKG_COLOR = "#fcfcfc";
  PDF_EVEN_BKG_COLOR = "#ffffff";
  PDF_WITH_CELL_FORMATTING = true;
  PDF_WITH_COLUMNS_AS_LINKS = true;
  PDF_SELECTED_ROWS_ONLY = false;

  submitFormHandler(event: any) {
    event.preventDefault();
    const printParams = {
      PDF_HEADER_COLOR: this.PDF_HEADER_COLOR,
      PDF_INNER_BORDER_COLOR: this.PDF_INNER_BORDER_COLOR,
      PDF_OUTER_BORDER_COLOR: this.PDF_OUTER_BORDER_COLOR,
      PDF_LOGO: this.PDF_LOGO,
      PDF_PAGE_ORITENTATION: this.PDF_PAGE_ORITENTATION,
      PDF_WITH_HEADER_IMAGE: this.PDF_WITH_HEADER_IMAGE,
      PDF_WITH_FOOTER_PAGE_COUNT: this.PDF_WITH_FOOTER_PAGE_COUNT,
      PDF_HEADER_HEIGHT: this.PDF_HEADER_HEIGHT,
      PDF_ROW_HEIGHT: this.PDF_ROW_HEIGHT,
      PDF_ODD_BKG_COLOR: this.PDF_ODD_BKG_COLOR,
      PDF_EVEN_BKG_COLOR: this.PDF_EVEN_BKG_COLOR,
      PDF_WITH_CELL_FORMATTING: this.PDF_WITH_CELL_FORMATTING,
      PDF_WITH_COLUMNS_AS_LINKS: this.PDF_WITH_COLUMNS_AS_LINKS,
      PDF_SELECTED_ROWS_ONLY: this.PDF_SELECTED_ROWS_ONLY
    };
    // console.log('=====================  agGridApi ============================');
    // console.log(this.agGridApi);
    // console.log('======================  agColumnApi ===========================');
    // console.log(this.agColumnApi);
    // console.log('======================  agColumnApi.columnController.columnDefs ===========================');

    // console.log(this.agColumnApi.columnModel.columnDefs);
    // console.log('=================================================');

    console.log('******************* this.agColumnApi Not working version ***********************');
    let colGroups = this.agColumnApi.getAllDisplayedColumnGroups()
    console.log(colGroups);


    console.log('******************************************');

    printDoc(printParams, this.agGridApi, this.agColumnApi);
  }

   onOddColorChange(color: string) {
    this.PDF_ODD_BKG_COLOR = color;
}

 onEvenColorChange(color: string) {
    this.PDF_EVEN_BKG_COLOR = color;
}

  parseInt(val: any) {
    return parseInt(val);
  }

}
