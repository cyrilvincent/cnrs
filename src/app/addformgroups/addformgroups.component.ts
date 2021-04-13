import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { environment } from 'src/environments/environment';
import * as dbjson from '../../assets/db.json';

@Component({
  selector: "app-addformgroups",
  templateUrl: "./addformgroups.component.html",
  styleUrls: ['./addformgroups.component.scss']
})
export class AddformgroupsComponent implements OnInit {
  public form: FormGroup;
  values = {};
  nb = 0;
  db: { [id: number] : any; } = {}
  vms = [];
  environment = environment;
  isAdd = false;
  equipments = [];
  
  constructor(private fb: FormBuilder) {
    this.db = dbjson["default"];
  }

  ngOnInit() {
    let array = []
    this.vms.forEach(
      item => array.push(this.fb.group(item))
    )
    this.form = this.fb.group({
      date: this.fb.control(new Date()),
      vms: this.fb.array(array)
    });
    this.addControl(0);
  }

  getEntitiesByParentId(parentId: number) {
    parent = this.db[parentId];
    let res = Object.values(this.db).filter(v => v.parentId == parentId );
    return res;
  }

  convertEntityToVM(entity, entities) {
    let vm = {}
    vm["value"] = entity.id;
    vm["label"] = entity.label;
    vm["key"] = entity.id;
    vm["level"] = entity.level;
    vm["parentId"] = entity.parentId;
    if (entities.length == 0) {
      vm["type"] = "text";
      vm["value"] = "";
      this.isAdd = true;
    }
    else {
      this.isAdd = false;
      vm["type"] = "select";
      vm["options"] = [];
      entities.sort((a, b) => a.order - b.order);
      for (let e of entities) {
        let option = {}
        option["key"] = e.id;
        option["value"] = e.shortLabel;
        vm["options"].push(option);
      }
    }
    return vm;
  }

  getVMById(id: number) {
    let entity = this.db[id];
    let entities = this.getEntitiesByParentId(entity.id);
    let vm = this.convertEntityToVM(entity, entities)
    return vm;
  }
  
  addControl(id) {
    console.log("Add control");
    let array = this.form.controls.vms as FormArray;
    let item = this.getVMById(id);
    this.vms.push(item)
    let gitem: FormGroup = this.fb.group(item);
    array.push(gitem);
    this.nb += 1;
  }

  removeFormControl() {
    console.log("Remove last level");
    let array = this.form.controls.vms as FormArray;
    this.vms.pop();
    array.removeAt(array.length - 1);
    this.nb -= 1; 
  }

  show() {
    this.values = this.form.getRawValue();
  }

  change(value) {
    let id = value.value;
    let entity = this.db[id];
    console.log("Change from "+entity.parentId+"=>"+id);
    let level = entity.level;
    let nb = this.nb
    for(let i = level; i < nb; i++) {
        this.removeFormControl();
    }
    this.addControl(id);
    //this.show();
  }

  lastChange(value) {
    //this.show();
  }

  clear() {
    let nb = this.nb;
    for(let i = 0; i <= nb; i++) {
      this.removeFormControl();
    }
    this.nb = 0;
    this.addControl(0);
  }

  add() {
    let values = this.form.getRawValue()
    let v = values.vms[values.vms.length - 1];
    this.equipments.push(v.label);
  }
}
