var exports = exports || {};
var module = module || { exports: exports };
/**
 * Sheetbase module
 * Name: @sheetbase/tamotsux-server
 * Export name: Tamotsux
 * Description: Tamotsu ORM that support multiple sheets.
 * Version: 0.0.2
 * Author: ITMammoth
 * Homepage: https://github.com/itmammoth/Tamotsu
 * License: MIT
 * Repo: https://github.com/sheetbase/module-tamotsux-server.git
 */

/**
 * Sheetbase Modifications
 * This file was modified by Sheetbase.
 * See: <sheetbase>...</sheetbase>
 * 
 */
/*<sheetbase>*/function TamotsuxModule() {
    var moduleExports = moduleExports || {};/*</sheetbase>*/



    /**
    * FILE: src/extenstions/extension.js
    */
	if (typeof Object.assign != 'function') {
	  (function () {
		Object.assign = function (target) {
		  'use strict';
		  if (target === undefined || target === null) {
			throw new TypeError('Cannot convert undefined or null to object');
		  }

		  var output = Object(target);
		  for (var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if (source !== undefined && source !== null) {
			  for (var nextKey in source) {
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
    * FILE: src/init.js
    */
    var ss_;
    var Table;
    var Relation_;
    var callbacks_ = [];

    /**
     * Initializes Tamotsu with the given objects
     *
     * @param {Spreadsheet} spreadsheet Spreadsheet object you will handle.<br>
     *                                  When not given, SpreadsheetApp.getActive() is used.
     */
    function initialize(spreadsheet) {
        ss_ = spreadsheet || SpreadsheetApp.getActive();
        Table = createTable_();
        Relation_ = createRelation_();
        callbacks_.forEach(function (callback) {
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



    /**
    * FILE: src/models/Relation_.js
    */
    var createRelation_ = function () {
        var Relation_ = function (TableClass) {
            this.Table = TableClass;
            this.predicates = [];
        };

        Object.defineProperties(Relation_.prototype, {
            where: {
                value: function (predicate) {
                    this.predicates.push(predicate);
                    return this;
                }
            },

            all: {
                value: function () {
                    var records = [];
                    var that = this;
                    this.Table.allValues().forEach(function (values, i) {
                        var record = new that.Table(that.Table.objectFrom(values), { row_: i + 2 });
                        var passed = true;
                        for (var i = 0; i < that.predicates.length; i++) {
                            passed = passed && evaluate(that.predicates[i], record);
                            if (!passed) break;
                        }
                        if (passed) records.push(record);
                    });

                    if (!this.comparator) return records;
                    return compare(this.comparator, records);
                }
            },

            first: {
                value: function () {
                    var records = this.all();
                    return records.length > 0 ? records[0] : null;
                }
            },

            last: {
                value: function () {
                    var records = this.all();
                    return records.length > 0 ? records[records.length - 1] : null;
                }
            },

            pluck: {
                value: function (column) {
                    var result = [];
                    var that = this;
                    this.all().forEach(function (record) {
                        result.push(record[column]);
                    });
                    return result;
                }
            },

            sum: {
                value: function (column) {
                    var total = 0;
                    var that = this;
                    this.all().forEach(function (record) {
                        total += Number(record[column]);
                    });
                    return total;
                }
            },

            max: {
                value: function (column) {
                    return Math.max.apply(null, this.pluck(column));
                }
            },

            min: {
                value: function (column) {
                    return Math.min.apply(null, this.pluck(column));
                }
            },

            order: {
                value: function (comparator) {
                    this.comparator = comparator;
                    return this;
                }
            },
        });

        var evaluate = function (predicate, record) {
            var t = typeof predicate;
            if (t === 'function') {
                return predicate(record);
            } else if (t === 'object') {
                return evaludateAsObject(predicate, record);
            } else {
                throw 'Invalid where condition [' + predicate + ']';
            }
        };

        var evaludateAsObject = function (object, record) {
            var passed = true;
            for (var attr in object) {
                passed = passed && record[attr] === object[attr];
                if (!passed) return false;
            }
            return true;
        };

        var compare = function (comparator, records) {
            var t = typeof comparator;
            if (t === 'function') return records.sort(comparator);
            if (t === 'string') return records.sort(createComparator(comparator));
            throw 'Invalid order comparator [' + comparator + ']';
        };

        var createComparator = function (strComparator) {
            var funcs = [];
            strComparator.split(',').forEach(function (part) {
                var attr, order;
                [attr, order] = part.trim().split(/\s+(?=(?:asc|desc))/i);
                order = (order || 'asc');
                if (order.toLocaleLowerCase() === 'asc') {
                    funcs.push(function (a, b) {
                        if (a[attr] < b[attr]) return -1;
                        if (a[attr] > b[attr]) return 1;
                        return 0;
                    });
                } else if (order.toLocaleLowerCase() === 'desc') {
                    funcs.push(function (a, b) {
                        if (a[attr] > b[attr]) return -1;
                        if (a[attr] < b[attr]) return 1;
                        return 0;
                    });
                } else {
                    throw 'Invalid order comparator [' + strComparator + ']';
                }
            });

            return createCombinedComparator(funcs);
        };

        var createCombinedComparator = function (comparators) {
            return function (a, b) {
                for (var i = 0; i < comparators.length; i++) {
                    var r = comparators[i](a, b);
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
    var createTable_ = function () {
        var Table = function (attributes, options) {
            options = (options || {});
            this.row_ = options.row_;

            attributes = (attributes || {});
            var that = this;
            this.__class.columns().forEach(function (c) {
                that[c] = attributes[c];
            });
        };

        Object.assign(Table, {

            sheet: function () {
                if (!this.sheet_memo_) {
                    /*<sheetbase>*/
                    // this.sheet_memo_ = ss_.getSheetByName(this.sheetName);
                    this.sheet_memo_ = (this.spreadsheet||ss_).getSheetByName(this.sheetName);
                    /*</sheetbase>*/
                }
                return this.sheet_memo_;
            },

            first: function () {
                var values = this.allValues();
                if (values.length === 0) return null;
                return new this(this.objectFrom(values[0]), { row_: 2 });
            },

            last: function () {
                var values = this.allValues();
                if (values.length === 0) return null;
                return new this(this.objectFrom(values[values.length - 1]), { row_: values.length + 1 });
            },

            find: function (id) {
                var values = this.allValues();
                for (var i = 0; i < values.length; i++) {
                    if (values[i][this.idColumnIndex()] === id) {
                        return new this(this.objectFrom(values[i]), { row_: i + 2 });
                    }
                }
                throw 'Record not found [id=' + id + ']';
            },

            all: function () {
                var records = [];
                var that = this;
                this.allValues().forEach(function (values, i) {
                    records.push(new that(that.objectFrom(values), { row_: i + 2 }));
                });
                return records;
            },

            pluck: function (column) {
                var result = [];
                var that = this;
                this.allValues().forEach(function (values) {
                    result.push(values[that.columnIndexOf(column)]);
                });
                return result;
            },

            sum: function (column) {
                var total = 0;
                var that = this;
                this.allValues().forEach(function (values) {
                    total += Number(values[that.columnIndexOf(column)]);
                });
                return total;
            },

            max: function (column) {
                return Math.max.apply(null, this.pluck(column));
            },

            min: function (column) {
                return Math.min.apply(null, this.pluck(column));
            },

            where: function (predicate) {
                var r = new Relation_(this);
                return r.where(predicate);
            },

            order: function (comparator) {
                var r = new Relation_(this);
                return r.order(comparator);
            },

            columns: function () {
                if (!this.columns_memo_) {
                    this.columns_memo_ = this.dataRange().offset(0, 0, 1).getValues()[0];
                }
                return this.columns_memo_;
            },

            columnIndexOf: function (column) {
                var index = this.columns().indexOf(column);
                if (index === -1) throw 'Invalid column given!';
                return index;
            },

            columnABCFor: function (column) {
                return indexToABC(this.columnIndexOf(column) + 1);
            },

            dataRange: function () {
                return this.sheet().getDataRange();
            },

            rangeByRow: function (row_) {
                return this.dataRange().offset(row_ - 1, 0, 1);
            },

            objectFrom: function (values) {
                var obj = {};
                this.columns().forEach(function (c, i) {
                    obj[c] = values[i];
                });
                return obj;
            },

            valuesFrom: function (record) {
                var values = [];
                this.columns().forEach(function (c, i) {
                    values.push(record[c] == undefined ? null : record[c]);
                });
                return values;
            },

            allValues: function () {
                var allValues = this.dataRange().getValues();
                allValues.shift();
                return allValues;
            },

            create: function (recordOrAttributes) {
                var record = recordOrAttributes.__class === this ? recordOrAttributes : new this(recordOrAttributes);
                delete record.row_;

                if (!record.isValid()) return false;

                var that = this;

                var appendRow = function (values) {
                    var row = that.sheet().getLastRow() + 1;
                    that.sheet().getRange(row, 1, 1, that.columns().length).setValues([values]);
                    record.row_ = row;
                };

                var values = this.valuesFrom(record);
                if (record[this.idColumn]) {
                    appendRow(values);
                } else {
                    this.withNextId(function (nextId) {
                        values[that.idColumnIndex()] = nextId;
                        appendRow(values);
                        record[that.idColumn] = nextId;
                    });
                }

                return record;
            },

            update: function (record) {
                if (record.isValid()) {
                    var values = this.valuesFrom(record);
                    this.rangeByRow(record.row_).setValues([values]);
                    return true;
                }
                return false;
            },

            destroy: function (record) {
                this.sheet().deleteRow(record.row_);
            },

            withNextId: function (callback) {
                var ids = this.idValues();
                var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
                callback(nextId);
            },

            idValues: function () {
                var idValues = [];
                var that = this;
                this.allValues().forEach(function (values) {
                    idValues.push(values[that.idColumnIndex()]);
                });
                return idValues;
            },

            idColumnIndex: function () {
                if (!this.idColumnIndex_memo_) {
                    var i = this.columns().indexOf(this.idColumn);
                    if (i === -1) throw 'Not found id column "' + this.idColumn + '" on ' + this.sheet().getName();
                    this.idColumnIndex_memo_ = i;
                }
                return this.idColumnIndex_memo_;
            },
        });

        Object.defineProperties(Table.prototype, {
            save: {
                value: function () {
                    this.errors = {};
                    var updateOrCreate = this.isNewRecord() ? 'create' : 'update';
                    return this.__class[updateOrCreate](this);
                }
            },
            destroy: {
                value: function () {
                    this.__class.destroy(this);
                }
            },
            validate: {
                value: function (on) {
                    // override it if you need
                }
            },
            isValid: {
                value: function () {
                    this.errors = {};
                    if (!this.__class.autoIncrement && isBlank(this[this.__class.idColumn])) {
                        this.errors[this.__class.idColumn] = "can't be blank";
                    }
                    this.validate(this.isNewRecord() ? 'create' : 'update');
                    return noKeys(this.errors);
                }
            },
            isNewRecord: {
                value: function () {
                    return !this.row_;
                }
            },
        });

        Table.define = function (classProps, instanceProps) {
            var Parent = this;
            var Child = function () { return Parent.apply(this, arguments); };
            Object.assign(Child, Parent);
            Child.prototype = Object.create(Parent.prototype);
            Object.defineProperties(Child.prototype, {
                '__class': { value: Child },
                'constructor': { value: Child }
            });
            for (var name in instanceProps) {
                Object.defineProperty(Child.prototype, name, { value: instanceProps[name] });
            }

            Object.assign(Child, Object.assign({
                idColumn: '#',
                autoIncrement: true,
            }, classProps));

            return Child;
        };

        var indexToABC = function (index) {
            var n = index - 1;
            var ordA = 'A'.charCodeAt(0);
            var ordZ = 'Z'.charCodeAt(0);
            var len = ordZ - ordA + 1;

            var s = '';
            while (n >= 0) {
                s = String.fromCharCode(n % len + ordA) + s;
                n = Math.floor(n / len) - 1;
            }
            return s;
        };

        var noKeys = function (object) {
            return Object.keys(object || {}).length === 0;
        };

        var isBlank = function (value) {
            return typeof value === 'undefined' || value === null || String(value).trim() === '';
        };

        return Table;
    };



/*<sheetbase>*/
    moduleExports.initialize = initialize;
    moduleExports.onInitialized = onInitialized;
    moduleExports.Table = createTable_();
    return moduleExports;
}
exports.TamotsuxModule = TamotsuxModule;
/*</sheetbase>*/
// add to the global namespace
var proccess = proccess || this;
proccess['Tamotsux'] = TamotsuxModule();
