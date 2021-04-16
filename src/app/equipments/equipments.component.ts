import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Entity, ViewModel, OptionVM} from '../models';
import * as dbjson from '../../assets/db.json';
import {Observable} from 'rxjs';
import {map, max, startWith} from 'rxjs/operators';
import * as levenshtein from 'js-levenshtein';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 0,
  touchendHideDelay: 0,
};

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
  db: { [id: number]: Entity; } = {};
  vms: ViewModel[] = [];
  isAdd = false;
  equipments: Entity[] = [];
  rootId = 0;
  isLabel = -1;
  leafs: Entity[] = [];
  filtered: Observable<Entity[]>;
  searchControl = new FormControl();
  entitySearch: Entity = null;

  @ViewChild('#myInput')
  search: ElementRef;

  constructor(private fb: FormBuilder) {
    // tslint:disable-next-line: no-string-literal
    this.db = dbjson['default'];
    this.generateLeafs();
  }

  ngOnInit() {
    this.initSearchFilter();
    this.initFormBuilder();
    this.addControl(this.rootId);
  }

  initSearchFilter() {
    this.filtered = this.searchControl.valueChanges
      .pipe(startWith(''), map(value => this.filter(value)));
  }

  initFormBuilder() {
    const array: FormGroup[] = [];
    this.vms.forEach(
      item => array.push(this.fb.group(item))
    );
    this.form = this.fb.group({
      date: this.fb.control(new Date()),
      vms: this.fb.array(array)
    });
  }

  generateLeafs() {
    this.leafs = Object.values(this.db).filter(e => e.leaf);
    this.leafs.sort((a, b) => +(a.label > b.label) || -(a.label < b.label))
  }

  getEntitiesByParentId(parentId: number): Entity[] {
    const res = Object.values(this.db).filter(
      v => typeof(v.parentId) === 'number' ?
       v.parentId === parentId :
       (v.parentId as number[]).includes(parentId));
    return res;
  }

  convertEntityToVM(entity: Entity, entities: Entity[]): ViewModel {
    const vm: ViewModel = new ViewModel();
    vm.value = entity.id;
    vm.key = entity.id;
    vm.level = this.level;
    vm.entity = entity;
    this.isLabel = -1;
    if (entity.leaf) {
      vm.type = 'text';
      vm.value = '';
      this.isAdd = true;
    }
    /*else if (entities.length == 1) {
      vm.type = "label";
      this.isLabel = entities[0].id;
    }*/
    else {
      this.isAdd = false;
      vm.type = 'select';
      vm.options = [];
      entities.sort((a, b) => a.order - b.order);
      for (const e of entities) {
        const option: OptionVM = new OptionVM();
        option.key = e.id;
        option.value = e.shortLabel;
        vm.options.push(option);
      }
    }
    return vm;
  }

  getVMById(id: number): ViewModel {
    const entity = this.db[id];
    const entities = this.getEntitiesByParentId(entity.id);
    const vm: ViewModel = this.convertEntityToVM(entity, entities);
    return vm;
  }

  addControl(id: number) {
    console.log('Add control');
    const array = this.form.controls.vms as FormArray;
    const item: ViewModel = this.getVMById(id);
    this.vms.push(item);
    const gitem: FormGroup = this.fb.group(item);
    array.push(gitem);
    this.level += 1;
    /*if(this.isLabel) {
      this.addControl(this.isLabel);
    }*/
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
    // this.show();
  }

  clear() {
    const nb = this.level;
    for (let i = 0; i <= nb; i++) {
      this.removeLastControl();
    }
    this.level = 0;
    this.addControl(this.rootId);
  }

  add() {
    const values = this.form.getRawValue();
    const v = values.vms[values.vms.length - 1];
    this.equipments.push(v.entity);
  }

  delete(id: number) {
    this.equipments = this.equipments.filter(e => e.id !== id);
  }

  filter(value: string | Entity): Entity[] {
    if (typeof(value) === 'string') {
      let res = this.leafs.map(e => [e, this.distance(value, e.label)]);
      let res2 = res.filter(es => es[1] > 0);
      if (res2.length === 0) {
        res = this.leafs.map(e => [e, this.gestalts(value, e.label)]);
      }
      res2 = res.filter(es => es[1] > 0.3);
      res2.sort((a, b) => (b[1] as number) - (a[1] as number));
      return res2.slice(0, 50).map(es => es[0] as Entity);
    }
    else {
      return [];
    }
  }

  normalize(s: string) {
    const s1 = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž-(),';
    const s2 = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz    ';
    const tab = s.split('');
    const length = s.length;
    for (let i = 0; i < length; i++) {
      const index = s1.indexOf(tab[i]);
      if (index !== -1) {
        tab[i] = s2[index];
      }
    }
    return tab.join('').toUpperCase().trim();
  }

  distance(s1: string, s2: string) {
    s1 = this.normalize(s1);
    s2 = this.normalize(s2);
    if (s2.startsWith(s1)) {
      return 1;
    }
    if (s2.includes(s1)) {
      return 0.99;
    }
    return 0;
  }

  gestalt(s1: string, s2: string) {
    if (s1 === '') {
      return 0;
    }
    s1 = this.normalize(s1);
    s2 = this.normalize(s2);
    if (s2.startsWith(s1)) {
      return 1;
    }
    const score = levenshtein(s1, s2);
    return 1 - score / (s1.length + s2.length);
  }

  gestalts(s1: string, s2: string) {
    s1 = this.normalize(s1).trim();
    s2 = this.normalize(s2).trim();
    const tab1 = s1.split(' ');
    const tab2 = s2.split(' ');
    for (let i = 0; i < tab1.length - 1; i++) {
        if (!tab2.includes(tab1[i])) {
          return 0;
        }
    }
    if (tab2.includes(tab1[tab1.length - 1])) {
      return 1;
    }
    const scores = tab2.map(s => this.gestalt(tab1[tab1.length - 1], s));
    return Math.max(...scores);




  }

  getByLabel(s: string): Entity|null {
    const res = this.leafs.filter(e => e.label.toUpperCase() === s.toUpperCase());
    return res.length === 0 ? null : res[0];
  }

  searchAction(value: any) {
    console.log(value.option.value);
    this.entitySearch = this.getByLabel(value.option.value);
  }

  addSearch() {
    this.equipments.push(this.entitySearch);
    this.search.nativeElement.select();
  }

  save() {
    window.alert('Not implemented yet');
  }
}
