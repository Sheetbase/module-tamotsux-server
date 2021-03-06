// tslint:disable:only-arrow-functions forin max-line-length

import { ClassProperties, InstanceProperties } from './types';

/**
 * Sheetbase Modifications
 * This file was modified by Sheetbase.
 * See: <sheetbase>...</sheetbase>
 *
 */

/**
 * FILE: src/extenstions/extension.js
 */
if (typeof Object.assign !== 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      const output = Object(target);
      for (let index = 1; index < arguments.length; index++) {
        const source = arguments[index];
        if (source !== undefined && source !== null) {
          for (const nextKey in source) {
            if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

/**
 * FILE: src/models/Relation_.js
 */
const createRelation_ = function() {
  const Relation_ = function(TableClass) {
    this.Table = TableClass;
    this.predicates = [];
  };

  Object.defineProperties(Relation_.prototype, {
    where: { value(predicate) {
      this.predicates.push(predicate);
      return this;
    }},

    all: { value() {
      const records = [];
      const that = this;
      this.Table.allValues().forEach(function(values, i) {
        const record = new that.Table(that.Table.objectFrom(values), { row_: i + 2 });
        let passed = true;
        for (let i = 0; i < that.predicates.length; i++) {
          passed = passed && evaluate(that.predicates[i], record);
          if (!passed) break;
        }
        if (passed) records.push(record);
      });

      if (!this.comparator) return records;
      return compare(this.comparator, records);
    }},

    first: { value() {
      const records = this.all();
      return records.length > 0 ? records[0] : null;
    }},

    last: { value() {
      const records = this.all();
      return records.length > 0 ? records[records.length - 1] : null;
    }},

    pluck: { value(column) {
      const result = [];
      const that = this;
      this.all().forEach(function(record) {
        result.push(record[column]);
      });
      return result;
    }},

    sum: { value(column) {
      let total = 0;
      const that = this;
      this.all().forEach(function(record) {
        total += Number(record[column]);
      });
      return total;
    }},

    max: { value(column) {
      return Math.max.apply(null, this.pluck(column));
    }},

    min: { value(column) {
      return Math.min.apply(null, this.pluck(column));
    }},

    order: { value(comparator) {
      this.comparator = comparator;
      return this;
    }},
  });

  const evaluate = function(predicate, record) {
    const t = typeof predicate;
    if (t === 'function') {
      return predicate(record);
    } else if (t === 'object') {
      return evaludateAsObject(predicate, record);
    } else {
      throw new Error('Invalid where condition [' + predicate + ']');
    }
  };

  const evaludateAsObject = function(object, record) {
    let passed = true;
    for (const attr in object) {
      passed = passed && record[attr] === object[attr];
      if (!passed) return false;
    }
    return true;
  };

  const compare = function(comparator, records) {
    const t = typeof comparator;
    if (t === 'function') return records.sort(comparator);
    if (t === 'string') return records.sort(createComparator(comparator));
    throw new Error('Invalid order comparator [' + comparator + ']');
  };

  const createComparator = function(strComparator) {
    const funcs = [];
    strComparator.split(',').forEach(function(part) {
      let attr, order;
      [attr, order] = part.trim().split(/\s+(?=(?:asc|desc))/i);
      order = (order || 'asc');
      if (order.toLocaleLowerCase() === 'asc') {
        funcs.push(function(a, b) {
          if (a[attr] < b[attr]) return -1;
          if (a[attr] > b[attr]) return  1;
          return 0;
        });
      } else if (order.toLocaleLowerCase() === 'desc') {
        funcs.push(function(a, b) {
          if (a[attr] > b[attr]) return -1;
          if (a[attr] < b[attr]) return  1;
          return 0;
        });
      } else {
        throw new Error('Invalid order comparator [' + strComparator + ']');
      }
    });

    return createCombinedComparator(funcs);
  };

  const createCombinedComparator = function(comparators) {
    return function(a, b) {
      for (let i = 0; i < comparators.length; i++) {
        const r = comparators[i](a, b);
        if (r !== 0) return r;
      }
      return 0;
    };
  };

  return Relation_;
};

/**
 * FILE: src/models/Table.js
 */
const createTable_ = function() {
  const Table = function(attributes, options) {
    options = (options || {});
    this.row_ = options.row_;

    attributes = (attributes || {});
    const that = this;
    this.__class.columns().forEach(function(c) {
      that[c] = attributes[c];
    });
  };

  Object.assign(Table, {

    sheet() {
      if (!this.sheet_memo_) {
        /*<sheetbase>*/
        // this.sheet_memo_ = ss_.getSheetByName(this.sheetName);
        this.sheet_memo_ = (this.spreadsheet || ss_).getSheetByName(this.sheetName);
        /*</sheetbase>*/
      }
      return this.sheet_memo_;
    },

    first() {
      const values = this.allValues();
      if (values.length === 0) return null;
      return new this(this.objectFrom(values[0]), { row_: 2 });
    },

    last() {
      const values = this.allValues();
      if (values.length === 0) return null;
      return new this(this.objectFrom(values[values.length - 1]), { row_: values.length + 1 });
    },

    find(id) {
      const values = this.allValues();
      for (let i = 0; i < values.length; i++) {
        if (values[i][this.idColumnIndex()] === id) {
          return new this(this.objectFrom(values[i]), { row_: i + 2 });
        }
      }
      throw new Error('Record not found [id=' + id + ']');
    },

    all() {
      const records = [];
      const that = this;
      this.allValues().forEach(function(values, i) {
        records.push(new that(that.objectFrom(values), { row_: i + 2 }));
      });
      return records;
    },

    pluck(column) {
      const result = [];
      const that = this;
      this.allValues().forEach(function(values) {
        result.push(values[that.columnIndexOf(column)]);
      });
      return result;
    },

    sum(column) {
      let total = 0;
      const that = this;
      this.allValues().forEach(function(values) {
        total += Number(values[that.columnIndexOf(column)]);
      });
      return total;
    },

    max(column) {
      return Math.max.apply(null, this.pluck(column));
    },

    min(column) {
      return Math.min.apply(null, this.pluck(column));
    },

    where(predicate) {
      const r = new Relation_(this);
      return r.where(predicate);
    },

    order(comparator) {
      const r = new Relation_(this);
      return r.order(comparator);
    },

    columns() {
      if (!this.columns_memo_) {
        this.columns_memo_ = this.dataRange().offset(0, 0, 1).getValues()[0];
      }
      return this.columns_memo_;
    },

    columnIndexOf(column) {
      const index = this.columns().indexOf(column);
      if (index === -1) throw new Error('Invalid column given!');
      return index;
    },

    columnABCFor(column) {
      return indexToABC(this.columnIndexOf(column) + 1);
    },

    dataRange() {
      return this.sheet().getDataRange();
    },

    rangeByRow(row_) {
      return this.dataRange().offset(row_ - 1, 0, 1);
    },

    objectFrom(values) {
      const obj = {};
      this.columns().forEach(function(c, i) {
        obj[c] = values[i];
      });
      return obj;
    },

    valuesFrom(record) {
      const values = [];
      this.columns().forEach(function(c, i) {
        values.push(typeof record[c] === 'undefined' ? null : record[c]);
      });
      return values;
    },

    allValues() {
      const allValues = this.dataRange().getValues();
      allValues.shift();
      return allValues;
    },

    create(recordOrAttributes) {
      const record = recordOrAttributes.__class === this ? recordOrAttributes : new this(recordOrAttributes);
      delete record.row_;

      if (!record.isValid()) return false;

      const that = this;

      const appendRow = function(values) {
        const row = that.sheet().getLastRow() + 1;
        that.sheet().getRange(row, 1, 1, that.columns().length).setValues([values]);
        record.row_ = row;
      };

      const values = this.valuesFrom(record);
      if (isPresent(record[this.idColumn])) {
        appendRow(values);
      } else {
        this.withNextId(function(nextId) {
          values[that.idColumnIndex()] = nextId;
          appendRow(values);
          record[that.idColumn] = nextId;
        });
      }

      return record;
    },

    update(recordOrAttributes) {
      const record = this.find(recordOrAttributes[this.idColumn]);
      record.setAttributes(recordOrAttributes);
      if (recordOrAttributes.__class === this) {
        recordOrAttributes.row_ = record.row_;
      }

      if (record.isValid()) {
        const values = this.valuesFrom(record);
        this.rangeByRow(record.row_).setValues([values]);
        return true;
      }
      return false;
    },

    createOrUpdate(recordOrAttributes) {
      const id = recordOrAttributes[this.idColumn];
      if (isPresent(id)) {
        const condition = {};
        condition[this.idColumn] = id;
        if (this.where(condition).first()) {
          return this.update(recordOrAttributes);
        } else {
          return this.create(recordOrAttributes);
        }
      } else {
        return this.create(recordOrAttributes);
      }
    },

    destroy(record) {
      this.sheet().deleteRow(record.row_);
    },

    withNextId(callback) {
    const ids = this.idValues();
      const nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
      callback(nextId);
    },

    idValues() {
      const idValues = [];
      const that = this;
      this.allValues().forEach(function(values) {
        idValues.push(values[that.idColumnIndex()]);
      });
      return idValues;
    },

    idColumnIndex() {
      if (!this.idColumnIndex_memo_) {
        const i = this.columns().indexOf(this.idColumn);
        if (i === -1) throw new Error('Not found id column "' + this.idColumn + '" on ' + this.sheet().getName());
        this.idColumnIndex_memo_ = i;
      }
      return this.idColumnIndex_memo_;
    },
  });

  Object.defineProperties(Table.prototype, {
    save: { value() {
      this.errors = {};
      const updateOrCreate = this.isNewRecord() ? 'create' : 'update';
      return this.__class[updateOrCreate](this);
    }},
    updateAttributes: { value(attributes) {
      const that = this;
      this.__class.columns().forEach(function(c, i) {
        if (c in attributes) {
          that[c] = attributes[c];
        }
      });
      return this.save();
    }},
    destroy: { value() {
      this.__class.destroy(this);
    }},
    validate: { value(on) {
      // override it if you need
    }},
    isValid: { value() {
      this.errors = {};
      if (!this.__class.autoIncrement && isBlank(this[this.__class.idColumn])) {
        this.errors[this.__class.idColumn] = 'can\'t be blank';
      }
      this.validate(this.isNewRecord() ? 'create' : 'update');
      return noKeys(this.errors);
    }},
    isNewRecord: { value() {
      return !this.row_;
    }},
    getAttributes: { value() {
      const obj = {};
      const that = this;
      this.__class.columns().forEach(function (c, i) {
        obj[c] = typeof that[c] === 'undefined' ? null : that[c];
      });
      return obj;
    }},
    setAttributes: { value(attributes) {
      const that = this;
      this.__class.columns().forEach(function (c, i) {
        that[c] = typeof attributes[c] === 'undefined' ? null : attributes[c];
      });
    }},
  });

  Table.define = function(classProps: ClassProperties, instanceProps?: InstanceProperties) {
    const Parent = this;
    const Child = function() { return Parent.apply(this, arguments); };
    Object.assign(Child, Parent);
    Child.prototype = Object.create(Parent.prototype);
    Object.defineProperties(Child.prototype, {
      __class: { value: Child },
      constructor: { value: Child },
    });
    for (const name in instanceProps) {
      Object.defineProperty(Child.prototype, name, { value: instanceProps[name] });
    }

    Object.assign(Child, Object.assign({
      idColumn: '#',
      autoIncrement: true,
    }, classProps));

    return Child;
  };

  const indexToABC = function(index) {
    let n = index - 1;
    const ordA = 'A'.charCodeAt(0);
    const ordZ = 'Z'.charCodeAt(0);
    const len = ordZ - ordA + 1;

    let s = '';
    while (n >= 0) {
      s = String.fromCharCode(n % len + ordA) + s;
      n = Math.floor(n / len) - 1;
    }
    return s;
  };

  const noKeys = function(object) {
    return Object.keys(object || {}).length === 0;
  };

  const isBlank = function(value) {
    return typeof value === 'undefined' || value === null || String(value).trim() === '';
  };

  const isPresent = function(value) {
    return typeof value !== 'undefined' && value !== null && String(value) !== '';
  };

  return Table;
};

/**
 * FILE: src/init.js
 */
let ss_;
let Table;
let Relation_;
const callbacks_ = [];

/**
 * Initializes Tamotsu with the given objects
 *
 * @param {Spreadsheet} spreadsheet Spreadsheet object you will handle.<br>
 *                                  When not given, SpreadsheetApp.getActive() is used.
 */
function initialize(spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet) {
  ss_ = spreadsheet || SpreadsheetApp.getActive();
  Table = createTable_();
  Relation_ = createRelation_();
  callbacks_.forEach(function(callback) {
    callback(spreadsheet);
  });
}

/**
 * Register the given function as a callback on initialized
 *
 * @param {function} callback A function that is to be added to the callback list.
 */
function onInitialized(callback) {
  callbacks_.push(callback);
}

/*<sheetbase>*/
export { initialize, onInitialized, Table };
/*</sheetbase>*/