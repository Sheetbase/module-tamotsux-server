# Sheetbase Module: tamotsux-server

A version of original Tomatsu library, that supports multiple Spreadsheets. See: https://github.com/itmammoth/Tamotsu

## Install

- NPM: ``$ npm install --save @sheetbase/tamotsux-server``

- As library: ``15fzNG5GZ7Ko6ygGYsMvthZLHovrc3eI_BEwFhwciOWVsBx47WCo13wvW`` (set Indentifier to **Tamotsux**, [view code](https://script.google.com/d/15fzNG5GZ7Ko6ygGYsMvthZLHovrc3eI_BEwFhwciOWVsBx47WCo13wvW/edit?usp=sharing))

## Usage

Pass a parammeter of spreadsheet (the Spreadsheet Object) when define table.

If spreadsheet param not defined, the Spreadsheet in Tamotsu.initialize([Spreadsheet]) will be used.

```ts
const mySpreadsheet = SpreadsheetApp.openById('1Jh316...');
const myOtherSpreadsheet = SpreadsheetApp.openById('1Pl413...');

Tamotsux.initialize(mySpreadsheet); // init and set 'mySpreadsheet' as default
const AgentTable = Tamotsux.Table.define({ sheetName: 'Agents', spreadsheet: mySpreadsheet });
const FlowerTable = Tamotsux.Table.define({ sheetName: 'Flowers', spreadsheet: myOtherSpreadsheet });

const firstAgent = AgentTable.first();
const allFlowers = FlowerTable.all();

Logger.log(firstAgent);
Logger.log(allFlowers);
```

## License

[MIT][license-url]

[license-url]: https://github.com/sheetbase/module-tamotsux-server/blob/master/LICENSE
