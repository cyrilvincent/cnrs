import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { EquipmentService } from '../shared/equipments.service';
import { TreeNode } from '../shared/models';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-equipment-tree',
  templateUrl: './equipment-tree.component.html',
  styleUrls: ['./equipment-tree.component.css']
})
export class EquipmentTreeComponent implements OnInit {

  treeControl;
  treeFlattener;
  dataSource;

  constructor(public service: EquipmentService) { 
    this.treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
    this.dataSource  = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit(): void {
    this.initDataSource()
    this.service.changeComponentEvent.subscribe(x => this.initDataSource())
  }

  initDataSource(): void {
    this.dataSource.data = this.service.getEquipmentsTree();
  }

  private transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.entity.label,
      level,
    };
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
