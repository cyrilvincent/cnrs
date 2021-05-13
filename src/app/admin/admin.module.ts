import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { EquipmentNodesTreeComponent } from './equipment-nodes-tree/equipment-nodes-tree.component';
import { MaterialModule} from '../material.module';



@NgModule({
  declarations: [
    AdminComponent,
    EquipmentNodesTreeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    AdminComponent,
  ]
})
export class AdminModule { }
