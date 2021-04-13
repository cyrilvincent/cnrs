import { Injectable, EventEmitter } from '@angular/core';

import { DropdownQuestion } from './question-dropdown';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';
import { Observable, of } from 'rxjs';

@Injectable()
export class QuestionService {

  changedEvent = new EventEmitter<string>();
  questions: QuestionBase<string>[] = [

    new DropdownQuestion({
      key: 'brave',
      label: 'Bravery Rating',
      options: [
        {key: 'solid',  value: 'Solid'},
        {key: 'great',  value: 'Great'},
        {key: 'good',   value: 'Good'},
        {key: 'unproven', value: 'Unproven'}
      ],
      value: 'solid',
      order: 3
    }),

    new TextboxQuestion({
      key: 'firstName',
      label: 'First name',
      value: 'Bombasto',
      required: true,
      order: 1
    }),

    new TextboxQuestion({
      key: 'emailAddress',
      label: 'Email',
      type: 'email',
      order: 2
    })
  ];

  questions$: Observable<QuestionBase<string>[]>
  // TODO: get from a remote source of question metadata
  getQuestions() {
    this.questions$ = of(this.questions.sort((a, b) => a.order - b.order));
  }

  addQuestion() {
    let question = new DropdownQuestion({
      key: 'new',
      label: 'New',
      options: [
        {key: 'a',  value: 'A'},
        {key: 'b',  value: 'B'},
        {key: 'c',  value: 'C'}
      ],
      value: 'a',
      order: 4
    });
    this.questions.push(question);
  }

  getQuestion() {
    let question = new DropdownQuestion({
      key: 'new',
      label: 'New',
      options: [
        {key: 'a',  value: 'A'},
        {key: 'b',  value: 'B'},
        {key: 'c',  value: 'C'}
      ],
      value: 'a',
      order: 4
    });
    return question;
  }

  change() {
    console.log("Change from service ")
    this.changedEvent.emit("value")
  }

  changed(json) {
    console.log("Changed "+json["brave"]);
    this.questions[2].value = json["brave"];
    if (this.questions.length > 3) {
      this.questions[3].value = json["new"];
    }
    else {
      this.addQuestion();
    }
  }
}
