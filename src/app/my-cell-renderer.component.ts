import { Component } from "@angular/core";
import { AgRendererComponent } from "ag-grid-angular";

import { ICellRenderer, ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "my-cell-renderer",
  template: `
    <div [ngStyle]="cellStyles">
      <div *ngIf="value === undefined; else valueDefinedBlock"></div>
      <ng-template #valueDefinedBlock>
        <span *ngIf="link; else notALinkBlock">
          <a [href]="link" target="popup" (click)="openLink($event)">
            {{ value }}
          </a>
        </span>
        <ng-template #notALinkBlock>
          <span>{{ value }}</span>
        </ng-template>
      </ng-template>
    </div>
  `
})
export class MyCellRenderer  {

  cellStyles: any;
  link : string | URL | undefined;
  value = undefined;

  agInit(params: any) {
    this.value = params.value;

    const pdfExportOptions = params.column.colDef.pdfExportOptions;

    if (pdfExportOptions) {
      if (pdfExportOptions.styles) {
        const {
          fontSize,
          bold,
          alignment,
          background,
          color
        } = pdfExportOptions.styles;

        let styles = {
          fontSize: fontSize ? fontSize + "px" : null,
          fontWeight: bold ? "bold" : null,
          textAlign: alignment ? alignment : null,
          background: background ? background : null,
          color: color ? color : null,
        };

        // styles.fontSize = fontSize ? fontSize + "px" : null;
        // styles.fontWeight = bold ? "bold" : null;
        // styles.textAlign = alignment ? alignment : null;
        // styles.background = background ? background : null;
        // styles.color = color ? color : null;

        this.cellStyles = styles;
      }

      if (pdfExportOptions.createURL) {
        this.link = pdfExportOptions.createURL(params.value);
      }
    }
  }

  openLink(e:any) {
    window.open(this.link, "popup", "width=600,height=600");
    return false;
  }
}
