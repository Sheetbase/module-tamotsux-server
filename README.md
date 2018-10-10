# Sheetbase Module: @sheetbase/tamotsux-server

Tamotsu ORM that support multiple sheets.

<!-- <content> -->

[![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </content> -->

## Install

- Using npm: `npm install --save @sheetbase/tamotsux-server`

- As a library: `15fzNG5GZ7Ko6ygGYsMvthZLHovrc3eI_BEwFhwciOWVsBx47WCo13wvW`

  Set the _Indentifier_ to **Tamotsux** and select the lastest version, [view code](https://script.google.com/d/15fzNG5GZ7Ko6ygGYsMvthZLHovrc3eI_BEwFhwciOWVsBx47WCo13wvW/edit?usp=sharing).

## Scopes

`https://www.googleapis.com/auth/spreadsheets`

## Examples

```ts
function example1(): void {
  const mySpreadsheet = SpreadsheetApp.openById(
    "1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI"
  );
  Tamotsux.initialize();
  const FooTable = Tamotsux.Table.define({
    sheetName: "foo",
    spreadsheet: mySpreadsheet
  });
  const first = FooTable.first();
  Logger.log(first);
}

function example2(): void {
  const mySpreadsheet = SpreadsheetApp.openById(
    "1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI"
  );
  Tamotsux.initialize(mySpreadsheet); // dafault
  const BarTable = Tamotsux.Table.define({ sheetName: "bar" });
  const all = BarTable.all();
  Logger.log(all);
}
```

## Documentation

Homepage: https://github.com/itmammoth/Tamotsu

## License

**@sheetbase/tamotsux-server** is released under the [MIT](https://github.com/sheetbase/module-tamotsux-server/blob/master/LICENSE) license.

<!-- <footer> -->

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/module-tamotsux-server/blob/master/LICENSE
[clasp_badge]: https://img.shields.io/badge/built%20with-clasp-4285f4.svg
[clasp_url]: https://github.com/google/clasp
[patreon_badge]: https://ionicabizau.github.io/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://ionicabizau.github.io/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase

<!-- </footer> -->
