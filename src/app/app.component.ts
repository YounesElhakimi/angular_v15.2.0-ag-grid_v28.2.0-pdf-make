import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { COLDEFS_WITHOUT_GROUPING } from "./columnDefs";
import { MyCellRenderer } from "./my-cell-renderer.component";
import "ag-grid-enterprise";
import { ColDef, GridOptions } from "ag-grid-enterprise";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  gridApi: any;
  columnApi: any;

  gridOptions: GridOptions<any>;
  rowData: any;

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


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    let rowData = this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe(data => {
        data.forEach(r => {
          r.date = new Date();
        });

        params.api.setRowData(data.slice(1500, 2000));
      });
  }

  onFirstDataRendered(params: any) {
    params.columnApi.autoSizeAllColumns();
  }

  onColumnEverythingChanged(params: any) {
    let selectionCol = params.columnApi.getColumn("selection-col");
    if (selectionCol) {
      params.columnApi.moveColumn(selectionCol, 0);
    }
  }

}
