import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {
  constructor(private fb: FormBuilder) { }

  toFormGroup(questions: QuestionBase<string>[] ) {
    /*const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                                              : new FormControl(question.value || '');
    });
    return new FormGroup(group);*/
    
    let l = [];
    questions.forEach(q => {
      l.push(this.fb.group({
        value: q.value,
        key: q.key,
        options: q.options,
      }))
    })
    let array: FormArray = this.fb.array(l);
    let group: FormGroup = this.fb.group({root: l});
    return group;
  }

  addQuestionGroup(group: FormGroup, question: QuestionBase<string>) {
    group.addControl(question.key, new FormControl(question.value))
    return group;
  }

}
