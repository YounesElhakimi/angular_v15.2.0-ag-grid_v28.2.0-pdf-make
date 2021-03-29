import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { COLDEFS_WITH_GROUPING, COLDEFS_WITHOUT_GROUPING } from "./columnDefs";

@Component({
  selector: "grid-options-panel",
  template: `
    <form (ngSubmit)="onSubmit()">
      <h4 class="text-secondary">Grid Options</h4>
      <span class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="grid-setting-column-groups"
          [(ngModel)]="columnGrouping"
          (change)="updateColumnGrouping($event)"
        />
        <label class="form-check-label" for="grid-setting-column-groups">
          Column Groups
        </label>
      </span>

      <span class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="grid-setting-group-country"
          [(ngModel)]="groupByCountry"
          (change)="updateGroupByCountry($event)"
        />
        <label class="form-check-label" for="grid-setting-group-country">
          Group by "country"
        </label>
      </span>
      <span class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="grid-setting-filter-argentina"
          [(ngModel)]="filterByArgentina"
          (change)="updateFilterByArgentina($event)"
        />
        <label class="form-check-label" for="grid-setting-filter-argentina">
          Filter by "Argentina"
        </label>
      </span>
      <span class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="grid-setting-sort-athlete-asc"
          [(ngModel)]="sortAthleteCol"
          (change)="updateSortAthleteAsc($event)"
        />
        <label class="form-check-label" for="grid-setting-sort-athlete-asc">
          Sort Athlete (ascending)
        </label>
      </span>
    </form>
  `
})
export class GridOptionsPanel implements OnInit {
  @Input() agGridApi;
  @Input() agColumnApi;

  updateColumnGrouping(event) {
    const withColumnGroups = event.target.checked;

    this.agGridApi.setColumnDefs(
      withColumnGroups ? COLDEFS_WITH_GROUPING : COLDEFS_WITHOUT_GROUPING
    );
  }

  updateGroupByCountry(event) {
    this.agColumnApi.applyColumnState({
      state: [
        {
          colId: "country",
          rowGroup: event.target.checked
        }
      ]
    });
  }
  updateFilterByArgentina(event) {
    const countryFilterComponent = this.agGridApi.getFilterInstance("country");
    const filterModel = event.target.checked ? { values: ["Argentina"] } : null;
    countryFilterComponent.setModel(filterModel);
    this.agGridApi.onFilterChanged();
  }
  updateSortAthleteAsc(event) {
    let athleteSort = event.target.checked ? "asc" : null;

    this.agColumnApi.applyColumnState({
      state: [{ colId: "athlete", sort: athleteSort }],
      defaultState: { sort: null }
    });
  }
}
