import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { COLDEFS_WITH_GROUPING, COLDEFS_WITHOUT_GROUPING } from "./columnDefs";

@Component({
  selector: "grid-options-panel",
  templateUrl: "grid-options-panel.component.html"
})
export class GridOptionsPanel  {
  @Input() agGridApi: any;
  @Input() agColumnApi: any;
  columnGrouping = false;
  sortAthleteCol = false;
  filterByArgentina = false;
  groupByCountry = false;

  updateColumnGrouping(event: any) {
    const withColumnGroups = event.target.checked;

    this.agGridApi.setColumnDefs(
      withColumnGroups ? COLDEFS_WITH_GROUPING : COLDEFS_WITHOUT_GROUPING
    );
  }

  updateGroupByCountry(event: any) {
    this.agColumnApi.applyColumnState({
      state: [
        {
          colId: "country",
          rowGroup: event.target.checked
        }
      ]
    });
  }
  updateFilterByArgentina(event: any) {
    const countryFilterComponent = this.agGridApi.getFilterInstance("country");
    const filterModel = event.target.checked ? { values: ["Argentina"] } : null;
    countryFilterComponent.setModel(filterModel);
    this.agGridApi.onFilterChanged();
  }
  updateSortAthleteAsc(event: any) {
    let athleteSort = event.target.checked ? "asc" : null;

    this.agColumnApi.applyColumnState({
      state: [{ colId: "athlete", sort: athleteSort }],
      defaultState: { sort: null }
    });
  }
}
