import { EventEmitter, Injectable } from '@angular/core';
import { EquipmentNode, ViewModel, OptionVM, Equipment, Component} from './models';
import * as dbjson from '../../assets/db.json';
import * as levenshtein from 'js-levenshtein';
import { MockDb } from './mockdb'

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private db: { [id: number]: EquipmentNode; } = {};
  private mockdb = new MockDb();
  equipments: Equipment[] = [];
  leafs: EquipmentNode[] = [];
  nodes: EquipmentNode[] = [];
  rootId = 0;
  selectedEquipment: Equipment = null;
  sequenceNb = 1;

  changeEquipmentEvent: EventEmitter<Equipment> = new EventEmitter();

  constructor() {
    // tslint:disable-next-line: no-string-literal
    this.db = dbjson['default'];
    this.equipments = this.mockdb.getEquipments();
    this.selectedEquipment = this.equipments[0];
    this.generateLeafs();
  }

  changeEquipment(e: Equipment) {
    this.selectedEquipment = e;
    this.changeEquipmentEvent.emit(e);
  }

  private generateLeafs() {
    this.leafs = Object.values(this.db).filter(e => e.leaf);
    this.leafs.sort((a, b) => +(a.label > b.label) || -(a.label < b.label));
  }

  addEquipment(e: EquipmentNode) {
    this.nodes.push(e);
  }

  deleteEquipment(id: number) {
    this.nodes = this.nodes.filter(e => e.id !== id);
  }

  private getNodesByParentId(parentId: number): EquipmentNode[] {
    const res = Object.values(this.db).filter(v => v.parentId === parentId);
    return res;
  }

  private convertNodeToVM(entity: EquipmentNode, entities: EquipmentNode[], level: number): ViewModel {
    const vm: ViewModel = new ViewModel();
    vm.value = entity.id;
    vm.key = entity.id;
    vm.level = level;
    vm.entity = entity;
    if (entity.leaf) {
      vm.type = 'text';
      vm.value = '';
    }
    else {
      vm.type = 'select';
      vm.options = [];
      entities.sort((a, b) => a.order - b.order);
      for (const e of entities) {
        const option: OptionVM = new OptionVM();
        option.key = e.id;
        option.value = e.shortLabel;
        vm.options.push(option);
      }
    }
    return vm;
  }

  getVMById(id: number, level: number): ViewModel {
    const entity = this.db[id];
    const entities = this.getNodesByParentId(entity.id);
    const vm: ViewModel = this.convertNodeToVM(entity, entities, level);
    return vm;
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

  filter(value: string | EquipmentNode): EquipmentNode[] {
    if (typeof(value) === 'string') {
      let res = this.leafs.map(e => [e, this.distance(value, e.label)]);
      let res2 = res.filter(es => es[1] > 0);
      if (res2.length === 0) {
        res = this.leafs.map(e => [e, this.gestalts(value, e.label)]);
      }
      res2 = res.filter(es => es[1] > 0.3);
      res2.sort((a, b) => (b[1] as number) - (a[1] as number));
      return res2.slice(0, 50).map(es => es[0] as EquipmentNode);
    }
    else {
      return [];
    }
  }

  getNodeByLabel(s: string): EquipmentNode|null {
    const res = this.leafs.filter(e => e.label.toUpperCase() === s.toUpperCase());
    return res.length === 0 ? null : res[0];
  }

  getLevel(id: number): number {
    if (id === this.rootId) {
      return 0;
    }
    const node = this.db[id];
    return this.getLevel(node.parentId) + 1;
  }

  getSequence(): number {
    return this.sequenceNb++;
  }

  componentFactory(nodeId: number, label: string, comment: string): Component {
    const component: Component = {
       equipment: this.selectedEquipment,
       id: this.getSequence(),
       label,
       nodeId,
       comment
    };
    return component;
  }

}
