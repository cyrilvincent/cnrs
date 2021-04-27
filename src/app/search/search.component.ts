import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EquipmentNode} from '../shared/models';
import { Observable } from 'rxjs';
import { EquipmentService } from '../shared/equipments.service';
import {map, startWith} from 'rxjs/operators';
import { SearchService } from '../shared/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  filtered: Observable<EquipmentNode[]>;
  searchControl = new FormControl();
  entitySearch: EquipmentNode = null;

  @ViewChild('search')
  search: ElementRef;

  constructor(public service: EquipmentService, public searchService: SearchService) { }

  ngOnInit(): void {
    this.initSearchFilter();
    this.service.changeEquipmentEvent.subscribe(e => this.searchControl.setValue(''));
  }

  private initSearchFilter() {
    this.filtered = this.searchControl.valueChanges
      .pipe(startWith(''), map(value => this.searchService.filter(value, this.service.selectedEquipment.nodeId)));
  }

  searchAction(value: any) {
    this.entitySearch = this.searchService.getNodeByLabel(value.option.value);
  }

  addSearch() {
    this.service.addComponant(this.entitySearch.id, this.entitySearch.label, '');
  }

}
