import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";

let emailRegex = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";

@Component({
  selector: "app-addformgroups",
  templateUrl: "./addformgroups.component.html"
})
export class AddformgroupsComponent implements OnInit {
  public usersForm: FormGroup;
  values = {};
  nb = 2;

  constructor(private fb: FormBuilder) {}

  json = [
    {
      value: "user 0",
      label: "label 0",
      key: 'k0',
      level: 0,
      type: "text",
    },
    {
      value: "b",
      label: "label 1",
      key: 'k1',
      level: 1,
      type: "select",
      options: [
        {key: 'a',  value: 'A'},
        {key: 'b',  value: 'B'},
        {key: 'c',   value: 'C'},
        {key: 'd', value: 'D'}
      ],
    }
    // <ng-container *ngFor="let userFormGroup of usersForm.controls['users']['controls']; let i = index">
    // <ng-container *ngFor="let item of json; let i = index">
  ]

  ngOnInit() {
    let array = []
    this.json.forEach(
      item => array.push(this.fb.group(item))
    )
    this.usersForm = this.fb.group({
      date: this.fb.control(new Date()),
      users: this.fb.array(array)
    });
  }

  addFormControl() {
    console.log("Add level");
    let usersArray = this.usersForm.controls.users as FormArray;
    let item = {
      value: "g",
      key: "k"+this.nb,
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
    this.json.push(item);
    let newUsergroup: FormGroup = this.fb.group(item);
    usersArray.push(newUsergroup);
  }
  
  removeFormControl() {
    console.log("Remove last level");
    let usersArray = this.usersForm.controls.users as FormArray;
    //usersArray.removeAt(i);
    this.json.pop();
    usersArray.removeAt(usersArray.length - 1);
    this.nb -= 1;
    
  }

  show() {
    this.values = this.usersForm.getRawValue();
  }

  change(value) {
    console.log("Change from "+value.source.id+"=>"+value.value);
    let level = parseInt(value.source.id.substring(1))
    if (level < this.nb - 1) {
      for(let i = level; i < this.nb; i++) {
        this.removeFormControl();
      }
    }
    this.addFormControl();
    this.show();
  }
}
