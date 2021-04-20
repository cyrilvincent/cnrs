import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Entity, ViewModel} from '../shared/models';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import { EquipmentService } from '../shared/equipments.service';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 0,
  touchendHideDelay: 0,
}; // TODO Move on app

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss'],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
  ],
})
export class EquipmentsComponent implements OnInit {
  form: FormGroup;
  values: any = {};
  level = 0;
  vms: ViewModel[] = [];
  addItem = false;
  filtered: Observable<Entity[]>;
  searchControl = new FormControl();
  entitySearch: Entity = null;

  @ViewChild('search')
  search: ElementRef;


  constructor(private fb: FormBuilder, public service: EquipmentService) {
  }

  ngOnInit() {
    this.initSearchFilter();
    this.initFormBuilder();
    this.addControl(this.service.rootId);
  }

  private initSearchFilter() {
    this.filtered = this.searchControl.valueChanges
      .pipe(startWith(''), map(value => this.service.filter(value)));
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
    console.log('Add control');
    const array = this.form.controls.vms as FormArray;
    const item: ViewModel = this.service.getVMById(id, this.level);
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
    this.addControl(this.service.rootId);
  }

  add() {
    const values = this.form.getRawValue();
    const v = values.vms[values.vms.length - 1];
    this.service.addEquipment(v.entity);
  }

  searchAction(value: any) {
    console.log(value.option.value);
    this.entitySearch = this.service.getByLabel(value.option.value);
  }

  addSearch() {
    this.service.addEquipment(this.entitySearch);
  }


}
