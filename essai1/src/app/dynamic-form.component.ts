import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';
import { QuestionControlService } from './question-control.service';
import { QuestionService } from './question.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<string>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private qcs: QuestionControlService, public service: QuestionService) {
    service.changedEvent.subscribe(
      x => this.change()
    )
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }

  change() {
    console.log("Try to dynamic");
    this.payLoad = JSON.stringify(this.form.getRawValue())
    //this.service.changed(this.form.getRawValue());
    //this.form = this.qcs.toFormGroup(this.questions);
    let q = this.service.getQuestion();
    this.form = this.qcs.addQuestionGroup(this.form, q)
  }

  

}
