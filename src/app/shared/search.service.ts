import { Injectable } from '@angular/core';
import { EquipmentNode} from './models';
import * as levenshtein from 'js-levenshtein';
import { EquipmentService } from './equipments.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(public service: EquipmentService) {
  }

  private normalize(s: string) {
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

  private gestalt(s1: string, s2: string) {
    if (s1 === '') {
      return 0;
    }
    s1 = this.normalize(s1);
    s2 = this.normalize(s2);
    if (s2.startsWith(s1)) {
      return 1;
    }
    const score = levenshtein(s1, s2);
    return 1 - score / (s1.length + s2.length);
  }

  private gestalts(s1: string, s2: string) {
    s1 = this.normalize(s1).trim();
    s2 = this.normalize(s2).trim();
    const tab1 = s1.split(' ');
    const tab2 = s2.split(' ');
    for (let i = 0; i < tab1.length - 1; i++) {
        if (!tab2.includes(tab1[i])) {
          return 0;
        }
    }
    if (tab2.includes(tab1[tab1.length - 1])) {
      return 1;
    }
    const scores = tab2.map(s => this.gestalt(tab1[tab1.length - 1], s));
    return Math.max(...scores);
  }

  private distance(s1: string, s2: string) {
    s1 = this.normalize(s1);
    s2 = this.normalize(s2);
    if (s2.startsWith(s1)) {
      return 1;
    }
    if (s2.includes(s1)) {
      return 0.99;
    }
    return 0;
  }

  filter(value: string | EquipmentNode, ancestorId: number): EquipmentNode[] {
    if (typeof(value) === 'string') {
      let res = this.service.leafs.map(e => [e, this.distance(value, e.label)]);
      let res2 = res.filter(es => es[1] > 0);
      if (res2.length === 0) {
        res = this.service.leafs.map(e => [e, this.gestalts(value, e.label)]);
      }
      res2 = res.filter(es => es[1] > 0.3);
      res2 = res2.filter(es => this.service.hasAncestor((es[0] as EquipmentNode).id, ancestorId));
      res2.sort((a, b) => (b[1] as number) - (a[1] as number));
      return res2.slice(0, 50).map(es => es[0] as EquipmentNode);
    }
    else {
      return [];
    }
  }

  getNodeByLabel(s: string): EquipmentNode|null {
    const res = this.service.leafs.filter(e => e.label.toUpperCase() === s.toUpperCase());
    return res.length === 0 ? null : res[0];
  }

}
