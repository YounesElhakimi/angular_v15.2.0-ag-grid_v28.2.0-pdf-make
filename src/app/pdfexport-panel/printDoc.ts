import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Margins, TDocumentDefinitions } from 'pdfmake/interfaces';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import getDocDefinition from "./docDefinition";

function printDoc(printParams: any, gridApi: any, columnApi: any) {
  console.log("Exporting to PDF...");
  const docDefinition: TDocumentDefinitions = getDocDefinition(printParams, gridApi, columnApi) as any;
  pdfMake.createPdf(docDefinition).download();
}

export default printDoc;
