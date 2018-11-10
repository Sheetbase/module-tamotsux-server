/**
 * A Sheetbase Module
 * Name: @sheetbase/tamotsux-server
 * Export name: Tamotsux
 * Description: Tamotsu ORM that support multiple sheets.
 * Version: 0.0.4
 * Author: ITMammoth
 * Homepage: https://github.com/itmammoth/Tamotsu
 * License: MIT
 * Repo: https://github.com/sheetbase/tamotsux-server.git
 */

var defaultSpreadsheet = SpreadsheetApp.openById(
  "1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI"
);
function example1() {
  Tamotsux.initialize();
  var FooTable = Tamotsux.Table.define({
    sheetName: "foo",
    spreadsheet: defaultSpreadsheet
  });
  var first = FooTable.first();
  Logger.log(first);
}

function example2() {
  Tamotsux.initialize(defaultSpreadsheet); // dafault
  var BarTable = Tamotsux.Table.define({ sheetName: "bar" });
  var all = BarTable.all();
  Logger.log(all);
}
