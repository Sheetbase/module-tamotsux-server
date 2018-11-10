export interface Model {
    [key: string]: any;
    save(): void;
    destroy(): void;
    isValid(): boolean;
    isNewRecord(): boolean;
}

export interface TableType extends TableInstance {
    define(classProperties: ClassProperties, instanceProperties?: InstanceProperties): TableType;
}

export interface TableInstance {
    first(): Model;
    last(): Model;
    find(id: any): Model;
    all(): Model;
    pluck(column: string): string[];
    sum(column: string): number;
    max(column: string): number;
    min(column: string): number;
    where(
        conditions: {[key: string]: any} | {(model: Model)},
    ): TableInstance;
    order(
        comparator: string | {(model1: Model, model2: Model)},
    ): TableInstance;
    create(
        model_or_attributes: {[key: string]: any} | Model,
    ): void;
}

export interface ClassProperties {
    sheetName: string;
    spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet;
    idColumn?: string;
    autoIncrement?: boolean;
}

export interface InstanceProperties {
    validate?(on: string);
}