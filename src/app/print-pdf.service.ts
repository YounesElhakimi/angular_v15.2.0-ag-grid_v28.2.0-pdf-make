import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Margins, TDocumentDefinitions } from 'pdfmake/interfaces';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PrintPDFService {
  constructor() {}

  printParams: any;
  agGridApi: any;
  agGridColumnApi: any;
  cellsExeptions: String[] = ['modifier', 'supprimer', 'action'];

  setCellsExeptions(cells: string[]) {
    this.cellsExeptions = cells.map((cell) => cell.toLowerCase());
  }
  getColumnGroupsToExport() {
    let displayedColumnGroups =
      this.agGridColumnApi.getAllDisplayedColumnGroups();

    let isColumnGrouping = displayedColumnGroups.some((col: any) =>
      col.hasOwnProperty('children')
    );

    if (!isColumnGrouping) {
      return null;
    }

    let columnGroupsToExport: {}[] = [];

    for (let colGroup of displayedColumnGroups) {
      // cells exeptions
      // if (
      //   this.cellsExeptions.includes(colGroup.colDef.headerName.toLowerCase())
      // )
      //   continue;

      let isColSpanning = colGroup.children.length > 1;
      let numberOfEmptyHeaderCellsToAdd = 0;

      if (isColSpanning) {
        let headerCell = this.createHeaderCell(colGroup);

        columnGroupsToExport.push(headerCell);
        // subtract 1 as the column group counts as a header
        numberOfEmptyHeaderCellsToAdd--;
      }

      // add an empty header cell now for every column being spanned
      colGroup.displayedChildren.forEach((childCol: any) => {
        let pdfExportOptions = this.getPdfExportOptions(childCol.getColId());

        if (!pdfExportOptions || !pdfExportOptions.skipColumn) {
          numberOfEmptyHeaderCellsToAdd++;
        }
      });

      for (let i = 0; i < numberOfEmptyHeaderCellsToAdd; i++) {
        columnGroupsToExport.push({});
      }
    }
    // displayedColumnGroups.forEach((colGroup: any) => {
    //   let isColSpanning = colGroup.children.length > 1;
    //   let numberOfEmptyHeaderCellsToAdd = 0;

    //   if (isColSpanning) {
    //     let headerCell = this.createHeaderCell(colGroup);

    //     columnGroupsToExport.push(headerCell);
    //     // subtract 1 as the column group counts as a header
    //     numberOfEmptyHeaderCellsToAdd--;
    //   }

    //   // add an empty header cell now for every column being spanned
    //   colGroup.displayedChildren.forEach((childCol: any) => {
    //     let pdfExportOptions = this.getPdfExportOptions(childCol.getColId());

    //     if (!pdfExportOptions || !pdfExportOptions.skipColumn) {
    //       numberOfEmptyHeaderCellsToAdd++;
    //     }
    //   });

    //   for (let i = 0; i < numberOfEmptyHeaderCellsToAdd; i++) {
    //     columnGroupsToExport.push({});
    //   }
    // });

    return columnGroupsToExport;
  }

  getColumnsToExport() {
    let columnsToExport: {}[] = [];

    for (const col of this.agGridColumnApi.getAllDisplayedColumns()) {
      // cells exeptions
      // if (this.cellsExeptions.includes(col.colDef.headerName.toLowerCase()))
      //   continue;

      let pdfExportOptions = this.getPdfExportOptions(col.getColId());

      if (pdfExportOptions && pdfExportOptions.skipColumn) {
        return;
      }
      let headerCell = this.createHeaderCell(col);

      columnsToExport.push(headerCell);
    }

    // this.agGridColumnApi.getAllDisplayedColumns().forEach((col: any) => {
    //   let pdfExportOptions = this.getPdfExportOptions(col.getColId());

    //   if (pdfExportOptions && pdfExportOptions.skipColumn) {
    //     return;
    //   }
    //   let headerCell = this.createHeaderCell(col);

    //   columnsToExport.push(headerCell);
    // });

    return columnsToExport;
  }

  getRowsToExport(columnsToExport: any) {
    let rowsToExport: any[] = [];

    this.agGridApi.forEachNodeAfterFilterAndSort((node: any) => {
      if (this.printParams.PDF_SELECTED_ROWS_ONLY && !node.isSelected()) {
        return;
      }
      let rowToExport = columnsToExport.map((param: any) => {
        let colId = param.colId;
        let cellValue = this.toString(this.agGridApi.getValue(colId, node));
        let tableCell = this.createTableCell(cellValue, colId);

        return tableCell;
      });

      rowsToExport.push(rowToExport);
    });

    return rowsToExport;
  }

  getExportedColumnsWidths(columnsToExport: any) {
    console.log('getExportedColumnsWidths columnsToExport : ',columnsToExport);

    return columnsToExport.map(() => 100 / columnsToExport.length + '%');
  }

  createHeaderCell(col: any) {
    let headerCell: any = {};

    let isColGroup = col.hasOwnProperty('children');

    if (isColGroup) {
      headerCell.text = col.originalColumnGroup.colGroupDef.headerName;
      headerCell.colSpan = col.children.length;
      headerCell.colId = col.groupId;
    } else {
      let headerName = col.colDef.headerName;

      if (col.sort) {
        headerName += ` (${col.sort})`;
      }
      if (col.filterActive) {
        headerName += ` [FILTERING]`;
      }

      headerCell.text = headerName;
      headerCell.colId = col.getColId();
    }

    headerCell['style'] = 'tableHeader';

    return headerCell;
  }

  createTableCell(cellValue: any, colId: any) {
    const tableCell: any = {
      text: cellValue !== undefined ? cellValue : '',
      // noWrap: printParams.PDF_PAGE_ORITENTATION === "landscape",
      style: 'tableCell',
    };

    const pdfExportOptions = this.getPdfExportOptions(colId);

    if (pdfExportOptions) {
      const { styles, createURL } = pdfExportOptions;

      if (this.printParams.PDF_WITH_CELL_FORMATTING && styles) {
        Object.entries(styles).forEach(([key, value]) => {
          tableCell[key] = value;
        });
      }

      if (this.printParams.PDF_WITH_COLUMNS_AS_LINKS && createURL) {
        tableCell['link'] = createURL(cellValue);
        tableCell['color'] = 'blue';
        tableCell['decoration'] = 'underline';
      }
    }

    return tableCell;
  }

  getPdfExportOptions(colId: any) {
    let col = this.agGridColumnApi.getColumn(colId);

    return col.colDef.pdfExportOptions;
  }

  getDocDefinition() {
    return (() => {
      const columnGroupsToExport = this.getColumnGroupsToExport();

      const columnsToExport = this.getColumnsToExport();

      const widths = this.getExportedColumnsWidths(columnsToExport);

      const rowsToExport = this.getRowsToExport(columnsToExport);

      const body = columnGroupsToExport
        ? [columnGroupsToExport, columnsToExport, ...rowsToExport]
        : [columnsToExport, ...rowsToExport];

      const headerRows = columnGroupsToExport ? 2 : 1;

      const header = this.printParams.PDF_WITH_HEADER_IMAGE
        ? {
            image: 'ag-grid-logo',
            width: 150,
            alignment: 'center',
            margin: [0, 10, 0, 10],
          }
        : null;

      const footer = this.printParams.PDF_WITH_FOOTER_PAGE_COUNT
        ? function (currentPage: any, pageCount: any) {
            return {
              text: currentPage.toString() + ' of ' + pageCount,
              margin: [20],
            };
          }
        : null;

      const pageMargins: Margins = [
        10,
        this.printParams.PDF_WITH_HEADER_IMAGE ? 70 : 20,
        10,
        this.printParams.PDF_WITH_FOOTER_PAGE_COUNT ? 40 : 10,
      ];

      const heights = (rowIndex: any) =>
        rowIndex < headerRows
          ? this.printParams.PDF_HEADER_HEIGHT
          : this.printParams.PDF_ROW_HEIGHT;

      const fillColor = (rowIndex: any, node: any, columnIndex: any) => {
        if (rowIndex < node.table.headerRows) {
          return this.printParams.PDF_HEADER_COLOR;
        }

        return rowIndex % 2 === 0
          ? this.printParams.PDF_ODD_BKG_COLOR
          : this.printParams.PDF_EVEN_BKG_COLOR;
      };

      const hLineWidth = (i: number, node: any) =>
        i === 0 || i === node.table.body.length ? 1 : 1;

      const vLineWidth = (i: number, node: any) =>
        i === 0 || i === node.table.widths.length ? 1 : 0;

      const hLineColor = (i: number, node: any) =>
        i === 0 || i === node.table.body.length
          ? this.printParams.PDF_OUTER_BORDER_COLOR
          : this.printParams.PDF_INNER_BORDER_COLOR;

      const vLineColor = (i: number, node: any) =>
        i === 0 || i === node.table.widths.length
          ? this.printParams.PDF_OUTER_BORDER_COLOR
          : this.printParams.PDF_INNER_BORDER_COLOR;

      const docDefintiion: TDocumentDefinitions = {
        pageOrientation: this.printParams.PDF_PAGE_ORITENTATION,
        //  header,
        //  footer,
        content: [
          {
            style: 'myTable',
            table: {
              headerRows,
              widths,
              body,
              heights,
            },
            layout: {
              fillColor,
              hLineWidth,
              vLineWidth,
              hLineColor,
              vLineColor,
            },
          },
        ],
        images: {
          'ag-grid-logo': this.printParams.PDF_LOGO,
        },
        styles: {
          myTable: {
            margin: [0, 0, 0, 0],
          },
          tableHeader: {
            bold: true,
            margin: [0, this.printParams.PDF_HEADER_HEIGHT / 3, 0, 0],
          },
          tableCell: {
            // margin: [0, 15, 0, 0]
          },
        },
        pageMargins,
      };

      return docDefintiion;
    })();
  }

  download() {
    if (!this.printParams || !this.agGridApi || !this.agGridColumnApi) {
      console.log('the params is undef');

      return;
    }
    console.log('Exporting to PDF...');
    const docDefinition: TDocumentDefinitions = this.getDocDefinition();

    try {
      pdfMake.createPdf(docDefinition).download();
    } catch (error) {
      console.log('error : ', error);
    }
  }

  initParams(printParams: any, agGridApi: any, agGridColumnApi: any) {
    this.printParams = printParams;
    this.agGridApi = agGridApi;
    this.agGridColumnApi = agGridColumnApi;
  }

  printDoc(printParams: any, agGridApi: any, agGridColumnApi: any) {
    this.initParams(printParams, agGridApi, agGridColumnApi);
    this.download();
  }

  toString(param: any) {
    if (typeof param === 'string') {
      return param;
    } else if (param instanceof String) {
      return param.toString();
    } else if (param instanceof Date) {
      return param.toDateString();
    } else if (typeof param === 'boolean' || param instanceof Boolean) {
      return param.toString();
    }

    return 'this type not hundled';
  }
}
