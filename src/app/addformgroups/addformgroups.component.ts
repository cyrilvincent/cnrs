import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MockDb } from '../db'

@Component({
  selector: "app-addformgroups",
  templateUrl: "./addformgroups.component.html"
})
export class AddformgroupsComponent implements OnInit {
  public form: FormGroup;
  values = {};
  nb = 0;
  db = {} // db complet en json
  db2: { [id: number] : any; } = {}

  vm = [
    /*{
      value: "user 0",
      label: "label 0",
      key: 0,
      level: 0,
      type: "text",
      parentId: -1,
    },
    {
      value: "b",
      label: "label 1",
      key: 1,
      level: 1,
      parentId: 0,
      type: "select",
      options: [
        {key: 'a',  value: 'A'},
        {key: 'b',  value: 'B'},
        {key: 'c',  value: 'C'},
        {key: 'd', value: 'D'}
      ],
    }*/
  ]
  
  constructor(private fb: FormBuilder) {
    this.db2 = new MockDb().db;
    for(let key=0;key<100;key++) {
      let level = key // simplification du pb
      this.db[key]={id:key, level:level, parentId:key-1}
    }
  }

  ngOnInit() {
    let array = []
    this.vm.forEach(
      item => array.push(this.fb.group(item))
    )
    this.form = this.fb.group({
      date: this.fb.control(new Date()),
      vms: this.fb.array(array)
    });
    this.addControl(0);
  }

  getEntitiesByParentId(parentId: number) {
    parent = this.db2[parentId];
    let res = Object.values(this.db2).filter(v => v.parentId == parentId );
    return res;
  }

  convertEntityToVM(entity, entities) {
    let vm = {}
    vm["value"] = entity.id;
    vm["label"] = entity.label;
    vm["key"] = entity.id;
    vm["level"] = entity.level;
    vm["parentId"] = entity.parentId;
    vm["type"] = "select";
    vm["options"] = [];
    for (let e of entities) {
      let option = {}
      option["key"] = e.id;
      option["value"] = e.label;
      vm["options"].push(option);
    }
    return vm;
  }

  getVMById(id: number) {
    let entity = this.db2[id];
    let entities = this.getEntitiesByParentId(entity.id);
    let vm = this.convertEntityToVM(entity, entities)
    return vm;
  }
  
  addControl(id) {
    console.log("Add control");
    let array = this.form.controls.vms as FormArray;
    let item = this.getVMById(id);
    this.vm.push(item)
    let gitem: FormGroup = this.fb.group(item);
    array.push(gitem);
    this.nb += 1;
  }

  addFormControl() {
    console.log("Add level");
    let array = this.form.controls.vms as FormArray;
    let item = {
      value: "g",
      key: this.nb,
      label: "new "+this.nb,
      level: this.nb,
      parentId: this.nb - 1,
      type: "select",
      options: [
        {key: 'e',  value: 'E'},
        {key: 'f',  value: 'F'},
        {key: 'g',   value: 'G'},
        {key: 'h', value: 'H'}
      ],
    }

    this.nb += 1;
    this.vm.push(item);
    let gitem: FormGroup = this.fb.group(item);
    array.push(gitem);

  }
  
  removeFormControl() {
    console.log("Remove last level");
    let array = this.form.controls.vms as FormArray;
    this.vm.pop();
    array.removeAt(array.length - 1);   
  }

  show() {
    this.values = this.form.getRawValue();
    let vms = this.getVMById(0);
    console.log(vms);
  }

  change(value) {
    let id = value.value;
    let entity = this.db2[id];

    console.log("Change from "+entity.parentId+"=>"+id);
    let level = entity.level;
    for(let i = level; i < this.nb; i++) {
        this.removeFormControl();
    }
    this.nb += level - this.nb
    //this.addFormControl();
    this.addControl(id);
    this.show();

  }
}
