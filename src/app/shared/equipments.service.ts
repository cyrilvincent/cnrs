import { Injectable } from '@angular/core';
import { Entity, ViewModel, OptionVM} from './models';
import * as dbjson from '../../assets/db.json';
import {Observable, of, from, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  db: { [id: number]: Entity; } = {};
  leafs: Entity[] = [];

  constructor() {
    // tslint:disable-next-line: no-string-literal
    this.db = dbjson['default'];
  }

  get db$(): Observable<{ [id: number]: Entity; }> {
    return of(this.db);
  }

  get leaf$(): Observable<Entity[]> {
    return of(this.leafs);
  }

  generateLeafs() {
    this.leafs = Object.values(this.db).filter(e => e.leaf);
    this.leafs.sort((a, b) => +(a.label > b.label) || -(a.label < b.label));
  }

  normalize(s: string) {
    const s1 = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž-(),';
    const s2 = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz    ';
    const tab = s.split('');
    const length = s.length;
    for (let i = 0; i < length; i++) {
      const index = s1.indexOf(tab[i]);
      if (index !== -1) {
        tab[i] = s2[index];
      }
    }
    return tab.join('').toUpperCase().trim();
  }
}
