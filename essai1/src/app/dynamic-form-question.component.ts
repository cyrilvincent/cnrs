import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';
import { QuestionService } from './question.service';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<string>;
  @Input() form: FormGroup;

  constructor(public service: QuestionService) {}

  get isValid() { 
    // return this.form.controls["root"]['controls'][this.question.key].valid; 
    return true;
  }

  changed() {
    this.service.change();
  }
}
