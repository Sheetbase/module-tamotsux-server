import { IModule } from './types/module';

var proccess = proccess || this;
declare const TamotsuxModule: {(): IModule};
const Tamotsux: IModule = proccess['Tamotsux'] || TamotsuxModule();

export function example1(): void {
	const mySpreadsheet = SpreadsheetApp.openById('1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
	Tamotsux.initialize();
	const FooTable = Tamotsux.Table.define({ sheetName: 'foo', spreadsheet: mySpreadsheet });
	const first = FooTable.first();
	Logger.log(first);
}

export function example2(): void {
	const mySpreadsheet = SpreadsheetApp.openById('1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
	Tamotsux.initialize(mySpreadsheet); // dafault
	const BarTable = Tamotsux.Table.define({ sheetName: 'bar'});
	const all = BarTable.all();
	Logger.log(all);
}
