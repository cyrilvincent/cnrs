import { Injectable } from '@angular/core';
import { Entity, ViewModel, OptionVM} from './models';
import * as dbjson from '../../assets/db.json';
import {Observable, of, from, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  db: { [id: number]: Entity; } = {};

  constructor() {
    // tslint:disable-next-line: no-string-literal
    this.db = dbjson['default'];
  }

  get db$(): Observable<{ [id: number]: Entity; }> {
    return of(this.db);
  }
}
