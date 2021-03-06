import { Injectable } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';
import { EquipmentNode, TreeNode } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  treeNode: TreeNode[] = [];

  constructor(private service: EquipmentService) {
    this.service.changeNodeEvent.subscribe(x => this.loadTreeNode());
  }

  getEquipmentNodesTree(): TreeNode[] {
    const nodeMap = new Map<number, TreeNode>();
    const root = new TreeNode();
    root.entity = {
      id: -1,
      label: 'Racine'
    };
    nodeMap.set(root.entity.id, root);
    for (const [_, v] of Object.entries(this.service.db)) {
      const node = new TreeNode();
      node.entity = v;
      nodeMap.set(v.id, node);
    }
    for (const k of nodeMap.keys()) {
      const node: TreeNode = nodeMap.get(k);
      if (k !== -1) {
        const enode: EquipmentNode = node.entity as EquipmentNode;
        const parent: TreeNode = nodeMap.get(enode.parentId);
        parent.children.push(node);
      }
    }
    return [root];
  }

  loadTreeNode() {
    const v = localStorage.getItem('db_version');
    if (v !== null && v === '0' && localStorage.getItem('treeNode') !== null) {
      this.treeNode = JSON.parse(localStorage.getItem('treeNode'));
    }
    else {
      this.treeNode = this.getEquipmentNodesTree();
    }
  }

  saveTreeNode() {
    const json = JSON.stringify(this.treeNode);
    localStorage.setItem('treeNode', json);
  }
}
