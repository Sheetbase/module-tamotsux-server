# Sheetbase Module: @sheetbase/tamotsux-server

Tamotsu ORM that support multiple sheets.

<!-- <block:header> -->

[![Build Status](https://travis-ci.com/sheetbase/tamotsux-server.svg?branch=master)](https://travis-ci.com/sheetbase/tamotsux-server) [![Coverage Status](https://coveralls.io/repos/github/sheetbase/tamotsux-server/badge.svg?branch=master)](https://coveralls.io/github/sheetbase/tamotsux-server?branch=master) [![NPM](https://img.shields.io/npm/v/@sheetbase/tamotsux-server.svg)](https://www.npmjs.com/package/@sheetbase/tamotsux-server) [![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

## Install

Using npm: `npm install --save @sheetbase/tamotsux-server`

```ts
import * as Tamotsux from "@sheetbase/tamotsux-server";
```

As a library: `15fzNG5GZ7Ko6ygGYsMvthZLHovrc3eI_BEwFhwciOWVsBx47WCo13wvW`

Set the _Indentifier_ to **TamotsuxModule** and select the lastest version, [view code](https://script.google.com/d/15fzNG5GZ7Ko6ygGYsMvthZLHovrc3eI_BEwFhwciOWVsBx47WCo13wvW/edit?usp=sharing).

```ts
declare const TamotsuxModule: { Tamotsux: any };
const Tamotsux = TamotsuxModule.Tamotsux;
```

## Scopes

`https://www.googleapis.com/auth/spreadsheets`

## Usage

- Docs homepage: https://sheetbase.github.io/tamotsux-server

- API reference: https://sheetbase.github.io/tamotsux-server/api

### Examples

```ts
import * as Tamotsux from "./public_api";

const defaultSpreadsheet = SpreadsheetApp.openById(
  "1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI"
);

export function example1(): void {
  Tamotsux.initialize();
  const FooTable = Tamotsux.Table.define({
    sheetName: "foo",
    spreadsheet: defaultSpreadsheet
  });

  const first = FooTable.first();
  Logger.log(first);
}

export function example2(): void {
  Tamotsux.initialize(defaultSpreadsheet); // dafault
  const BarTable = Tamotsux.Table.define({ sheetName: "bar" });

  const all = BarTable.all();
  Logger.log(all);
}
```

## License

**@sheetbase/tamotsux-server** is released under the [MIT](https://github.com/sheetbase/tamotsux-server/blob/master/LICENSE) license.

<!-- <block:footer> -->

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/tamotsux-server/blob/master/LICENSE
[clasp_badge]: https://img.shields.io/badge/built%20with-clasp-4285f4.svg
[clasp_url]: https://github.com/google/clasp
[patreon_badge]: https://lamnhan.github.io/assets/images/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://lamnhan.github.io/assets/images/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase

<!-- </block:footer> -->
