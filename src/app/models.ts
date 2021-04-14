export interface Entity {
    id: number;
    label: string;
    parentId: number|number[];
    order: number;
}

export class ViewModel {
    value: number|string;
    label: string;
    key: number;
    level: number;
    type: string;
    options: OptionVM[];
    isLeaf: boolean;
}

export class OptionVM {
    key: number;
    value: string;
}