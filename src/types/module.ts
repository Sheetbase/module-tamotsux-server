export interface ITamotsuxModule {
    initialize: {(spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet)};
    onInitialized: {(callback: {()})};
    Table: ITable;
}

export interface IModel {
    [key: string]: any;
    save: {(): void};
    destroy: {(): void};
    isValid: {(): boolean};
    isNewRecord: {(): boolean};
} 

export interface ITable extends ITableInstance {
    define: {(classProperties: IClassProperties, instanceProperties?: IInstanceProperties): ITable};
}

interface ITableInstance {
    first: {(): IModel};
    last: {(): IModel};
    find: {(id: any): IModel};
    all: {(): IModel};
    pluck: {(column: string): string[]};
    sum: {(column: string): number};
    max: {(column: string): number};
    min: {(column: string): number};
    where: {(
        conditions: {[key: string]: any} | {(model: IModel)}
    ): ITableInstance};
    order: {(
        comparator: string | {(model1: IModel, model2: IModel)}
    ): ITableInstance};
    create: {(
        model_or_attributes: {[key: string]: any} | IModel
    ): void};
}

interface IClassProperties {
    sheetName: string;
    spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet;
    idColumn?: string;
    autoIncrement?: boolean;
}

interface IInstanceProperties {
    validate?: {(on: string)};
}