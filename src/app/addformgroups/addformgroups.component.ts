import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";

@Component({
  selector: "app-addformgroups",
  templateUrl: "./addformgroups.component.html"
})
export class AddformgroupsComponent implements OnInit {
  public form: FormGroup;
  values = {};
  nb = 2;
  db = {} // db complet en json

  vm = [
    {
      value: "user 0",
      label: "label 0",
      key: 0,
      level: 0,
      type: "text",
    },
    {
      value: "b",
      label: "label 1",
      key: 1,
      level: 1,
      type: "select",
      options: [
        {key: 'a',  value: 'A'},
        {key: 'b',  value: 'B'},
        {key: 'c',  value: 'C'},
        {key: 'd', value: 'D'}
      ],
    }
  ]
  
  constructor(private fb: FormBuilder) {
    for(let key=0;key<100;key++) {
      let level = key // simplification du pb
      this.db[key]=level;
    }
  }



  ngOnInit() {
    let array = []
    this.vm.forEach(
      item => array.push(this.fb.group(item))
    )
    this.form = this.fb.group({
      date: this.fb.control(new Date()),
      users: this.fb.array(array)
    });
  }

  addFormControl() {
    console.log("Add level");
    let array = this.form.controls.users as FormArray;
    let item = {
      value: "g",
      key: this.nb,
      label: "new "+this.nb,
      level: this.nb,
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
    let array = this.form.controls.users as FormArray;
    this.vm.pop();
    array.removeAt(array.length - 1);
    this.nb -= 1;
    
  }

  show() {
    this.values = this.form.getRawValue();
  }

  change(value) {
    console.log("Change from "+value.source.id+"=>"+value.value);
    let key = value.source.id;
    let level = this.db[key];
    if (level < this.nb - 1) {
      for(let i = level; i < this.nb; i++) {
        this.removeFormControl();
      }
    }
    this.addFormControl();
    this.show();
  }
}
