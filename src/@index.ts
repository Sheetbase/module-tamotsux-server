/**
 * 
 * Name: @sheetbase/tamotsux-server
 * Description: Tamotsu ORM that support multiple sheets.
 * Version: 0.0.26
 * Author: Sheetbase
 * Homepage: https://sheetbase.net
 * License: MIT
 * Repo: https://github.com/sheetbase/module-tamotsux-server.git
 *
 */

declare const tamotsuxModuleExports: {(): any};
const tamotsux = tamotsuxModuleExports();
const Tamotsux = tamotsux;

for (const key of Object.keys(tamotsux)) {
	this[key] = tamotsux[key];
}

export { tamotsux, Tamotsux };

export function sheetbase_tamotsux_example1(): void {
	const mySpreadsheet = SpreadsheetApp.openById('1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
	Tamotsux.initialize();
	const FooTable = Tamotsux.Table.define({ sheetName: 'foo', spreadsheet: mySpreadsheet });
	const first = FooTable.first();
	Logger.log(first);
}

export function sheetbase_tamotsux_example2(): void {
	const mySpreadsheet = SpreadsheetApp.openById('1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');
	Tamotsux.initialize(mySpreadsheet); // dafault
	const BarTable = Tamotsux.Table.define({ sheetName: 'bar'});
	const all = BarTable.all();
	Logger.log(all);
}
