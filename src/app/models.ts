export interface Entity {
    id: number;
    label: string;
    level: number;
    parentId: number;
    order: number;
}

export class ViewModel {
    value: number|string;
    label: string;
    key: number;
    level: number;
    parentId: number;
    type: string;
    options: OptionVM[];
}

export class OptionVM {
    key: number;
    value: string;
}