import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Entity} from '../shared/models';
import { Observable } from 'rxjs';
import { EquipmentService } from '../shared/equipments.service';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  filtered: Observable<Entity[]>;
  searchControl = new FormControl();
  entitySearch: Entity = null;

  @ViewChild('search')
  search: ElementRef;

  constructor(public service: EquipmentService) { }

  ngOnInit(): void {
    this.initSearchFilter();
  }

  private initSearchFilter() {
    this.filtered = this.searchControl.valueChanges
      .pipe(startWith(''), map(value => this.service.filter(value)));
  }

  searchAction(value: any) {
    console.log(value.option.value);
    this.entitySearch = this.service.getByLabel(value.option.value);
  }

  addSearch() {
    this.service.addEquipment(this.entitySearch);
  }

}