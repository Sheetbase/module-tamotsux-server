export interface IModule {
    initialize(spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet): void;
    onInitialized(callback: {()}): void;
    Table: ITable;
}

export interface IModel {
    [key: string]: any;
    save(): void;
    destroy(): void;
    isValid(): boolean;
    isNewRecord(): boolean;
} 

export interface ITable extends ITableInstance {
    define(classProperties: IClassProperties, instanceProperties?: IInstanceProperties): ITable;
}

export interface ITableInstance {
    first(): IModel;
    last(): IModel;
    find(id: any): IModel;
    all(): IModel;
    pluck(column: string): string[];
    sum(column: string): number;
    max(column: string): number;
    min(column: string): number;
    where(
        conditions: {[key: string]: any} | {(model: IModel)}
    ): ITableInstance;
    order(
        comparator: string | {(model1: IModel, model2: IModel)}
    ): ITableInstance;
    create(
        model_or_attributes: {[key: string]: any} | IModel
    ): void;
}

export interface IClassProperties {
    sheetName: string;
    spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet;
    idColumn?: string;
    autoIncrement?: boolean;
}

export interface IInstanceProperties {
    validate?(on: string);
}