import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { EquipmentsComponent } from "./equipments/equipments.component";
import { MaterialModule} from "./material.module";
import { MindmapComponent } from "./mindmap/mindmap.component";
import { EntityListComponent } from './entity-list/entity-list.component';
import { SearchComponent } from './search/search.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { EquipmentSelectComponent } from './equipment-select/equipment-select.component';
import { PlatformComponent } from './platform/platform.component';
import { EquipmentTreeComponent } from './equipment-tree/equipment-tree.component';
import { EquipmentAddComponent } from './equipment-add/equipment-add.component';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from "@angular/material/tooltip";

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 0,
  touchendHideDelay: 0,
};

@NgModule({
  declarations: [AppComponent, EquipmentsComponent, MindmapComponent, EntityListComponent, SearchComponent, DynamicFormComponent, EquipmentSelectComponent, PlatformComponent, EquipmentTreeComponent, EquipmentAddComponent],
  imports: [BrowserModule, ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
