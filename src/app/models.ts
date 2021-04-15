export interface Entity {
    id: number;
    label: string;
    shortLabel: string;
    parentId: number|number[];
    order: number;
    leaf: boolean;
}

export class ViewModel {
    value: number|string;
    label: string;
    key: number;
    level: number;
    type: string;
    options: OptionVM[];
    isLeaf: boolean;
    entity: Entity;
}

export class OptionVM {
    key: number;
    value: string;
}