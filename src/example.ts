import * as Tamotsux from './public_api';

const defaultSpreadsheet = SpreadsheetApp.openById('1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI');

export function example1(): void {
  Tamotsux.initialize();
  const FooTable = Tamotsux.Table.define({
    sheetName: 'foo',
    spreadsheet: defaultSpreadsheet,
  });

  const first = FooTable.first();
  Logger.log(first);
}

export function example2(): void {
  Tamotsux.initialize(defaultSpreadsheet); // dafault
  const BarTable = Tamotsux.Table.define({ sheetName: 'bar' });

  const all = BarTable.all();
  Logger.log(all);
}
