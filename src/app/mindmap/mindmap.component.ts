import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MindMapMain } from 'mind-map';

@Component({
  selector: 'app-mindmap',
  templateUrl: './mindmap.component.html',
  styleUrls: ['./mindmap.component.css'],
})

export class MindmapComponent implements OnInit {
  mindMap: any = null;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    const options = {
      container:'jsmind_container',
      editable:true,
      theme:'orange'
  };
    const mind = {
      "meta":{
          "name":"example",
          "author":"hizzgdev@163.com",
          "version":"0.2"
      },
      "format":"node_array",
      "data":[
          {"id":"root", "isroot":true, "topic":"jsMind"},
  
          {"id":"easy", "parentid":"root", "topic":"Easy", "direction":"left"},
          {"id":"easy1", "parentid":"easy", "topic":"Easy to show"},
          {"id":"easy2", "parentid":"easy", "topic":"Easy to edit"},
          {"id":"easy3", "parentid":"easy", "topic":"Easy to store"},
          {"id":"easy4", "parentid":"easy", "topic":"Easy to embed"},
  
          {"id":"open", "parentid":"root", "topic":"Open Source", "direction":"right"},
          {"id":"open1", "parentid":"open", "topic":"on GitHub"},
          {"id":"open2", "parentid":"open", "topic":"BSD License"},
  
          {"id":"powerful", "parentid":"root", "topic":"Powerful", "direction":"right"},
          {"id":"powerful1", "parentid":"powerful", "topic":"Base on Javascript"},
          {"id":"powerful2", "parentid":"powerful", "topic":"Base on HTML5"},
          {"id":"powerful3", "parentid":"powerful", "topic":"Depends on you"},
      ]
  };
    this.mindMap = MindMapMain.show(options, mind);
  }

  
}
