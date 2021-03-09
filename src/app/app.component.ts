import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { COLDEFS_WITHOUT_GROUPING } from "./columnDefs";
import { MyCellRenderer } from "./my-cell-renderer.component";
import "ag-grid-enterprise";
import "../styles.scss";

@Component({
  selector: "my-app",
  template: `
    <div>
      <div class="form-wrap">
        <grid-options-panel
          [agGridApi]="gridApi"
          [agColumnApi]="columnApi"
        ></grid-options-panel>
        <pdf-export-panel
          [agGridApi]="gridApi"
          [agColumnApi]="columnApi"
        ></pdf-export-panel>
      </div>
      <div class="grid-container">
        <ag-grid-angular
          style="height: 100%;"
          class="ag-theme-alpine"
          [gridOptions]="gridOptions"
          (columnEverythingChanged)="onColumnEverythingChanged($event)"
          (firstDataRendered)="onFirstDataRendered($event)"
          (gridReady)="onGridReady($event)"
        >
        </ag-grid-angular>
      </div>
    </div>
  `
})
export class AppComponent {
  gridApi;
  columnApi;

  gridOptions;
  rowData;

  constructor(private http: HttpClient) {
    this.gridOptions = {
      rowData: this.rowData,
      columnDefs: COLDEFS_WITHOUT_GROUPING,
      suppressPropertyNamesCheck: true,
      defaultColDef: {
        cellRenderer: "myCellRenderer",
        filter: true,
        sortable: true,
        resizable: true,
        enableRowGroup: true,
        menuTabs: ["filterMenuTab"]
      },
      frameworkComponents: {
        myCellRenderer: MyCellRenderer
      },
      groupSelectsChildren: true,
      rowSelection: "multiple"
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    let rowData = this.http
      .get("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe(data => {
        data.forEach(r => {
          r.date = new Date();
        });
        params.api.setRowData(data.slice(1500, 2000));
      });
  }

  onFirstDataRendered(params) {
    params.columnApi.autoSizeAllColumns();
  }

  onColumnEverythingChanged(params) {
    let selectionCol = params.columnApi.getColumn("selection-col");
    if (selectionCol) {
      params.columnApi.moveColumn(selectionCol, 0);
    }
  }
}
