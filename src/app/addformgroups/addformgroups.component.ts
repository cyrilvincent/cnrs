import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { environment } from 'src/environments/environment';
import { Entity, ViewModel, OptionVM} from '../models';
import * as dbjson from '../../assets/db.json';

@Component({
  selector: "app-addformgroups",
  templateUrl: "./addformgroups.component.html",
  styleUrls: ['./addformgroups.component.scss']
})
export class AddformgroupsComponent implements OnInit {
  form: FormGroup;
  values: any = {};
  level: number = 0;
  db: { [id: number] : Entity; } = {}
  vms: ViewModel[] = [];
  environment = environment;
  isAdd = false;
  equipments: ViewModel[] = [];
  rootId = 0;
  
  constructor(private fb: FormBuilder) {
    this.db = dbjson["default"];
  }

  ngOnInit() {
    const array: FormGroup[] = []
    this.vms.forEach(
      item => array.push(this.fb.group(item))
    )
    this.form = this.fb.group({
      date: this.fb.control(new Date()),
      vms: this.fb.array(array)
    });
    this.addControl(this.rootId);
  }

  getEntitiesByParentId(parentId: number):{ [id: number] : Entity; } {
    const res = Object.values(this.db).filter(v => typeof(v.parentId) == "number" ? (v.parentId == parentId) : ((v.parentId as number[]).includes(parentId))  );
    return [...new Set(res)];
  }

  convertEntityToVM(entity, entities): ViewModel {
    const vm: ViewModel = new ViewModel();
    vm.value = entity.id;
    vm.label = entity.label;
    vm.key = entity.id;
    vm.level = this.level;
    if (entities.length == 0) {
      vm.type = "text";
      vm.value = "";
      vm.isLeaf = true;
      this.isAdd = true;
    }
    else {
      this.isAdd = false;
      vm.isLeaf = false;
      vm.type = "select";
      vm.options = [];
      entities.sort((a, b) => a.order - b.order);
      for (let e of entities) {
        let option: OptionVM = new OptionVM();
        option.key = e.id;
        option.value = e.shortLabel;
        vm.options.push(option);
      }
    }
    return vm;
  }

  getVMById(id: number):ViewModel {
    const entity = this.db[id];
    const entities = this.getEntitiesByParentId(entity.id);
    const vm: ViewModel = this.convertEntityToVM(entity, entities)
    return vm;
  }
  
  addControl(id: number) {
    console.log("Add control");
    const array = this.form.controls.vms as FormArray;
    const item: ViewModel = this.getVMById(id);
    this.vms.push(item)
    const gitem: FormGroup = this.fb.group(item);
    array.push(gitem);
    this.level += 1;
  }

  removeLastControl() {
    console.log("Remove last control");
    const array = this.form.controls.vms as FormArray;
    this.vms.pop();
    array.removeAt(array.length - 1);
    this.level -= 1; 
  }

  show() {
    this.values = this.form.getRawValue();
  }

  change(value: any) {
    const id: number = value.value[0];
    const parent: ViewModel = value.value[1];
    console.log("Change from "+parent.key+"=>"+id);
    const nb = this.level
    for(let i = parent.level + 1; i < nb; i++) {
        this.removeLastControl();
    }
    this.addControl(id);
  }

  lastChange(value: any) {
    //this.show();
  }

  clear() {
    const nb = this.level;
    for(let i = 0; i <= nb; i++) {
      this.removeLastControl();
    }
    this.level = 0;
    this.addControl(this.rootId);
  }

  add() {
    const values = this.form.getRawValue()
    const v = values.vms[values.vms.length - 1];
    this.equipments.push(v);
  }

  delete(id: number) {
    this.equipments = this.equipments.filter(vm => vm.key != id);
  }
}
