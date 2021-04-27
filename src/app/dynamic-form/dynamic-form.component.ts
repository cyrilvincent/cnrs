import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Equipment, ViewModel} from '../shared/models';
import { EquipmentService } from '../shared/equipments.service';
import { MatSelect } from '@angular/material/select';
import { VMService } from '../shared/vm.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  form: FormGroup;
  values: any = {};
  level = 0;
  vms: ViewModel[] = [];
  addItem = false;

  @ViewChild('equipmentSelect')
  equipmentSelect: ElementRef<MatSelect>;

  constructor(private fb: FormBuilder, public service: EquipmentService, public vmService: VMService) { }

  ngOnInit(): void {
    this.initFormBuilder();
    this.addControl(this.service.selectedEquipment.nodeId);
    this.service.changeEquipmentEvent.subscribe(e => this.clear());
  }

  private initFormBuilder() {
    const array: FormGroup[] = [];
    this.vms.forEach(
      item => array.push(this.fb.group(item))
    );
    this.form = this.fb.group({
      date: this.fb.control(new Date()),
      vms: this.fb.array(array)
    });
  }

  addControl(id: number) {
    console.log('Add control ' + id);
    const array = this.form.controls.vms as FormArray;
    const item: ViewModel = this.vmService.getVMById(id, this.level);
    this.addItem = item.entity.leaf;
    this.vms.push(item);
    const gitem: FormGroup = this.fb.group(item);
    array.push(gitem);
    this.level += 1;
  }

  removeLastControl() {
    console.log('Remove last control');
    const array = this.form.controls.vms as FormArray;
    this.vms.pop();
    array.removeAt(array.length - 1);
    this.level -= 1;
  }

  change(value: any) {
    const id: number = value.value[0];
    const parent: ViewModel = value.value[1];
    console.log('Change from ' + parent.key + '=>' + id);
    const nb = this.level;
    for (let i = parent.level + 1; i < nb; i++) {
        this.removeLastControl();
    }
    this.addControl(id);
  }

  lastChange(value: any) {
  }

  clear() {
    const nb = this.level;
    for (let i = 0; i <= nb; i++) {
      this.removeLastControl();
    }
    this.level = 0;
    this.addControl(this.service.selectedEquipment.nodeId);
  }

  add() {
    const values = this.form.getRawValue();
    const v: ViewModel = values.vms[values.vms.length - 1];
    this.service.addComponant(v.key, v.entity.label, v.text);
  }

}
