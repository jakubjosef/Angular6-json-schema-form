/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { isDefined, isEmpty, isObject, isArray, isMap, isNumber, isString } from './validator.functions';
import { hasOwn, copy } from './utility.functions';
/** @typedef {?} */
var Pointer;
export { Pointer };
var JsonPointer = /** @class */ (function () {
    function JsonPointer() {
    }
    /**
     * 'get' function
     *
     * Uses a JSON Pointer to retrieve a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     */
    /**
     * 'get' function
     *
     * Uses a JSON Pointer to retrieve a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     * @param {?} object
     * @param {?} pointer
     * @param {?=} startSlice
     * @param {?=} endSlice
     * @param {?=} getBoolean
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.get = /**
     * 'get' function
     *
     * Uses a JSON Pointer to retrieve a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     * @param {?} object
     * @param {?} pointer
     * @param {?=} startSlice
     * @param {?=} endSlice
     * @param {?=} getBoolean
     * @param {?=} errors
     * @return {?}
     */
    function (object, pointer, startSlice, endSlice, getBoolean, errors) {
        if (startSlice === void 0) { startSlice = 0; }
        if (endSlice === void 0) { endSlice = null; }
        if (getBoolean === void 0) { getBoolean = false; }
        if (errors === void 0) { errors = false; }
        if (object === null) {
            return getBoolean ? false : undefined;
        }
        /** @type {?} */
        var keyArray = this.parse(pointer, errors);
        if (typeof object === 'object' && keyArray !== null) {
            /** @type {?} */
            var subObject = object;
            if (startSlice >= keyArray.length || endSlice <= -keyArray.length) {
                return object;
            }
            if (startSlice <= -keyArray.length) {
                startSlice = 0;
            }
            if (!isDefined(endSlice) || endSlice >= keyArray.length) {
                endSlice = keyArray.length;
            }
            keyArray = keyArray.slice(startSlice, endSlice);
            try {
                for (var keyArray_1 = tslib_1.__values(keyArray), keyArray_1_1 = keyArray_1.next(); !keyArray_1_1.done; keyArray_1_1 = keyArray_1.next()) {
                    var key = keyArray_1_1.value;
                    if (key === '-' && isArray(subObject) && subObject.length) {
                        key = subObject.length - 1;
                    }
                    if (isMap(subObject) && subObject.has(key)) {
                        subObject = subObject.get(key);
                    }
                    else if (typeof subObject === 'object' && subObject !== null &&
                        hasOwn(subObject, key)) {
                        subObject = subObject[key];
                    }
                    else {
                        if (errors) {
                            console.error("get error: \"" + key + "\" key not found in object.");
                            console.error(pointer);
                            console.error(object);
                        }
                        return getBoolean ? false : undefined;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (keyArray_1_1 && !keyArray_1_1.done && (_a = keyArray_1.return)) _a.call(keyArray_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return getBoolean ? true : subObject;
        }
        if (errors && keyArray === null) {
            console.error("get error: Invalid JSON Pointer: " + pointer);
        }
        if (errors && typeof object !== 'object') {
            console.error('get error: Invalid object:');
            console.error(object);
        }
        return getBoolean ? false : undefined;
        var e_1, _a;
    };
    /**
     * 'getCopy' function
     *
     * Uses a JSON Pointer to deeply clone a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     */
    /**
     * 'getCopy' function
     *
     * Uses a JSON Pointer to deeply clone a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     * @param {?} object
     * @param {?} pointer
     * @param {?=} startSlice
     * @param {?=} endSlice
     * @param {?=} getBoolean
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.getCopy = /**
     * 'getCopy' function
     *
     * Uses a JSON Pointer to deeply clone a value from an object.
     *
     * //  { object } object - Object to get value from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { number = 0 } startSlice - Zero-based index of first Pointer key to use
     * //  { number } endSlice - Zero-based index of last Pointer key to use
     * //  { boolean = false } getBoolean - Return only true or false?
     * //  { boolean = false } errors - Show error if not found?
     * // { object } - Located value (or true or false if getBoolean = true)
     * @param {?} object
     * @param {?} pointer
     * @param {?=} startSlice
     * @param {?=} endSlice
     * @param {?=} getBoolean
     * @param {?=} errors
     * @return {?}
     */
    function (object, pointer, startSlice, endSlice, getBoolean, errors) {
        if (startSlice === void 0) { startSlice = 0; }
        if (endSlice === void 0) { endSlice = null; }
        if (getBoolean === void 0) { getBoolean = false; }
        if (errors === void 0) { errors = false; }
        /** @type {?} */
        var objectToCopy = this.get(object, pointer, startSlice, endSlice, getBoolean, errors);
        return this.forEachDeepCopy(objectToCopy);
    };
    /**
     * 'getFirst' function
     *
     * Takes an array of JSON Pointers and objects,
     * checks each object for a value specified by the pointer,
     * and returns the first value found.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  { boolean = false } getCopy - Return a copy instead?
     * //  - First value found
     */
    /**
     * 'getFirst' function
     *
     * Takes an array of JSON Pointers and objects,
     * checks each object for a value specified by the pointer,
     * and returns the first value found.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  { boolean = false } getCopy - Return a copy instead?
     * //  - First value found
     * @param {?} items
     * @param {?=} defaultValue
     * @param {?=} getCopy
     * @return {?}
     */
    JsonPointer.getFirst = /**
     * 'getFirst' function
     *
     * Takes an array of JSON Pointers and objects,
     * checks each object for a value specified by the pointer,
     * and returns the first value found.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  { boolean = false } getCopy - Return a copy instead?
     * //  - First value found
     * @param {?} items
     * @param {?=} defaultValue
     * @param {?=} getCopy
     * @return {?}
     */
    function (items, defaultValue, getCopy) {
        if (defaultValue === void 0) { defaultValue = null; }
        if (getCopy === void 0) { getCopy = false; }
        if (isEmpty(items)) {
            return;
        }
        if (isArray(items)) {
            try {
                for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                    var item = items_1_1.value;
                    if (isEmpty(item)) {
                        continue;
                    }
                    if (isArray(item) && item.length >= 2) {
                        if (isEmpty(item[0]) || isEmpty(item[1])) {
                            continue;
                        }
                        /** @type {?} */
                        var value = getCopy ?
                            this.getCopy(item[0], item[1]) :
                            this.get(item[0], item[1]);
                        if (value) {
                            return value;
                        }
                        continue;
                    }
                    console.error('getFirst error: Input not in correct format.\n' +
                        'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
                    return;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return defaultValue;
        }
        if (isMap(items)) {
            try {
                for (var items_2 = tslib_1.__values(items), items_2_1 = items_2.next(); !items_2_1.done; items_2_1 = items_2.next()) {
                    var _b = tslib_1.__read(items_2_1.value, 2), object = _b[0], pointer = _b[1];
                    if (object === null || !this.isJsonPointer(pointer)) {
                        continue;
                    }
                    /** @type {?} */
                    var value = getCopy ?
                        this.getCopy(object, pointer) :
                        this.get(object, pointer);
                    if (value) {
                        return value;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (items_2_1 && !items_2_1.done && (_c = items_2.return)) _c.call(items_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return defaultValue;
        }
        console.error('getFirst error: Input not in correct format.\n' +
            'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
        return defaultValue;
        var e_2, _a, e_3, _c;
    };
    /**
     * 'getFirstCopy' function
     *
     * Similar to getFirst, but always returns a copy.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  - Copy of first value found
     */
    /**
     * 'getFirstCopy' function
     *
     * Similar to getFirst, but always returns a copy.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  - Copy of first value found
     * @param {?} items
     * @param {?=} defaultValue
     * @return {?}
     */
    JsonPointer.getFirstCopy = /**
     * 'getFirstCopy' function
     *
     * Similar to getFirst, but always returns a copy.
     *
     * //  { [object, pointer][] } items - Array of objects and pointers to check
     * //  { any = null } defaultValue - Value to return if nothing found
     * //  - Copy of first value found
     * @param {?} items
     * @param {?=} defaultValue
     * @return {?}
     */
    function (items, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        /** @type {?} */
        var firstCopy = this.getFirst(items, defaultValue, true);
        return firstCopy;
    };
    /**
     * 'set' function
     *
     * Uses a JSON Pointer to set a value on an object.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing
     * value (if any) at that location.
     *
     * So set([1, 2, 3], '/1', 4) => [1, 4, 3]
     * and
     * So set([1, 2, 3], '/1', 4, true) => [1, 4, 2, 3]
     *
     * //  { object } object - The object to set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The new value to set
     * //  { boolean } insert - insert value?
     * // { object } - The original object, modified with the set value
     */
    /**
     * 'set' function
     *
     * Uses a JSON Pointer to set a value on an object.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing
     * value (if any) at that location.
     *
     * So set([1, 2, 3], '/1', 4) => [1, 4, 3]
     * and
     * So set([1, 2, 3], '/1', 4, true) => [1, 4, 2, 3]
     *
     * //  { object } object - The object to set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The new value to set
     * //  { boolean } insert - insert value?
     * // { object } - The original object, modified with the set value
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @param {?=} insert
     * @return {?}
     */
    JsonPointer.set = /**
     * 'set' function
     *
     * Uses a JSON Pointer to set a value on an object.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing
     * value (if any) at that location.
     *
     * So set([1, 2, 3], '/1', 4) => [1, 4, 3]
     * and
     * So set([1, 2, 3], '/1', 4, true) => [1, 4, 2, 3]
     *
     * //  { object } object - The object to set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The new value to set
     * //  { boolean } insert - insert value?
     * // { object } - The original object, modified with the set value
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @param {?=} insert
     * @return {?}
     */
    function (object, pointer, value, insert) {
        if (insert === void 0) { insert = false; }
        /** @type {?} */
        var keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            /** @type {?} */
            var subObject = object;
            for (var i = 0; i < keyArray.length - 1; ++i) {
                /** @type {?} */
                var key = keyArray[i];
                if (key === '-' && isArray(subObject)) {
                    key = subObject.length;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject = subObject.get(key);
                }
                else {
                    if (!hasOwn(subObject, key)) {
                        subObject[key] = (keyArray[i + 1].match(/^(\d+|-)$/)) ? [] : {};
                    }
                    subObject = subObject[key];
                }
            }
            /** @type {?} */
            var lastKey = keyArray[keyArray.length - 1];
            if (isArray(subObject) && lastKey === '-') {
                subObject.push(value);
            }
            else if (insert && isArray(subObject) && !isNaN(+lastKey)) {
                subObject.splice(lastKey, 0, value);
            }
            else if (isMap(subObject)) {
                subObject.set(lastKey, value);
            }
            else {
                subObject[lastKey] = value;
            }
            return object;
        }
        console.error("set error: Invalid JSON Pointer: " + pointer);
        return object;
    };
    /**
     * 'setCopy' function
     *
     * Copies an object and uses a JSON Pointer to set a value on the copy.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing value.
     *
     * //  { object } object - The object to copy and set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The value to set
     * //  { boolean } insert - insert value?
     * // { object } - The new object with the set value
     */
    /**
     * 'setCopy' function
     *
     * Copies an object and uses a JSON Pointer to set a value on the copy.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing value.
     *
     * //  { object } object - The object to copy and set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The value to set
     * //  { boolean } insert - insert value?
     * // { object } - The new object with the set value
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @param {?=} insert
     * @return {?}
     */
    JsonPointer.setCopy = /**
     * 'setCopy' function
     *
     * Copies an object and uses a JSON Pointer to set a value on the copy.
     * Also creates any missing sub objects or arrays to contain that value.
     *
     * If the optional fourth parameter is TRUE and the inner-most container
     * is an array, the function will insert the value as a new item at the
     * specified location in the array, rather than overwriting the existing value.
     *
     * //  { object } object - The object to copy and set value in
     * //  { Pointer } pointer - The JSON Pointer (string or array)
     * //   value - The value to set
     * //  { boolean } insert - insert value?
     * // { object } - The new object with the set value
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @param {?=} insert
     * @return {?}
     */
    function (object, pointer, value, insert) {
        if (insert === void 0) { insert = false; }
        /** @type {?} */
        var keyArray = this.parse(pointer);
        if (keyArray !== null) {
            /** @type {?} */
            var newObject = copy(object);
            /** @type {?} */
            var subObject = newObject;
            for (var i = 0; i < keyArray.length - 1; ++i) {
                /** @type {?} */
                var key = keyArray[i];
                if (key === '-' && isArray(subObject)) {
                    key = subObject.length;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject.set(key, copy(subObject.get(key)));
                    subObject = subObject.get(key);
                }
                else {
                    if (!hasOwn(subObject, key)) {
                        subObject[key] = (keyArray[i + 1].match(/^(\d+|-)$/)) ? [] : {};
                    }
                    subObject[key] = copy(subObject[key]);
                    subObject = subObject[key];
                }
            }
            /** @type {?} */
            var lastKey = keyArray[keyArray.length - 1];
            if (isArray(subObject) && lastKey === '-') {
                subObject.push(value);
            }
            else if (insert && isArray(subObject) && !isNaN(+lastKey)) {
                subObject.splice(lastKey, 0, value);
            }
            else if (isMap(subObject)) {
                subObject.set(lastKey, value);
            }
            else {
                subObject[lastKey] = value;
            }
            return newObject;
        }
        console.error("setCopy error: Invalid JSON Pointer: " + pointer);
        return object;
    };
    /**
     * 'insert' function
     *
     * Calls 'set' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     */
    /**
     * 'insert' function
     *
     * Calls 'set' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @return {?}
     */
    JsonPointer.insert = /**
     * 'insert' function
     *
     * Calls 'set' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @return {?}
     */
    function (object, pointer, value) {
        /** @type {?} */
        var updatedObject = this.set(object, pointer, value, true);
        return updatedObject;
    };
    /**
     * 'insertCopy' function
     *
     * Calls 'setCopy' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     */
    /**
     * 'insertCopy' function
     *
     * Calls 'setCopy' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @return {?}
     */
    JsonPointer.insertCopy = /**
     * 'insertCopy' function
     *
     * Calls 'setCopy' with insert = TRUE
     *
     * //  { object } object - object to insert value in
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //   value - value to insert
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @param {?} value
     * @return {?}
     */
    function (object, pointer, value) {
        /** @type {?} */
        var updatedObject = this.setCopy(object, pointer, value, true);
        return updatedObject;
    };
    /**
     * 'remove' function
     *
     * Uses a JSON Pointer to remove a key and its attribute from an object
     *
     * //  { object } object - object to delete attribute from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { object }
     */
    /**
     * 'remove' function
     *
     * Uses a JSON Pointer to remove a key and its attribute from an object
     *
     * //  { object } object - object to delete attribute from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @return {?}
     */
    JsonPointer.remove = /**
     * 'remove' function
     *
     * Uses a JSON Pointer to remove a key and its attribute from an object
     *
     * //  { object } object - object to delete attribute from
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { object }
     * @param {?} object
     * @param {?} pointer
     * @return {?}
     */
    function (object, pointer) {
        /** @type {?} */
        var keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            /** @type {?} */
            var lastKey = keyArray.pop();
            /** @type {?} */
            var parentObject = this.get(object, keyArray);
            if (isArray(parentObject)) {
                if (lastKey === '-') {
                    lastKey = parentObject.length - 1;
                }
                parentObject.splice(lastKey, 1);
            }
            else if (isObject(parentObject)) {
                delete parentObject[lastKey];
            }
            return object;
        }
        console.error("remove error: Invalid JSON Pointer: " + pointer);
        return object;
    };
    /**
     * 'has' function
     *
     * Tests if an object has a value at the location specified by a JSON Pointer
     *
     * //  { object } object - object to chek for value
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { boolean }
     */
    /**
     * 'has' function
     *
     * Tests if an object has a value at the location specified by a JSON Pointer
     *
     * //  { object } object - object to chek for value
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { boolean }
     * @param {?} object
     * @param {?} pointer
     * @return {?}
     */
    JsonPointer.has = /**
     * 'has' function
     *
     * Tests if an object has a value at the location specified by a JSON Pointer
     *
     * //  { object } object - object to chek for value
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * // { boolean }
     * @param {?} object
     * @param {?} pointer
     * @return {?}
     */
    function (object, pointer) {
        /** @type {?} */
        var hasValue = this.get(object, pointer, 0, null, true);
        return hasValue;
    };
    /**
     * 'dict' function
     *
     * Returns a (pointer -> value) dictionary for an object
     *
     * //  { object } object - The object to create a dictionary from
     * // { object } - The resulting dictionary object
     */
    /**
     * 'dict' function
     *
     * Returns a (pointer -> value) dictionary for an object
     *
     * //  { object } object - The object to create a dictionary from
     * // { object } - The resulting dictionary object
     * @param {?} object
     * @return {?}
     */
    JsonPointer.dict = /**
     * 'dict' function
     *
     * Returns a (pointer -> value) dictionary for an object
     *
     * //  { object } object - The object to create a dictionary from
     * // { object } - The resulting dictionary object
     * @param {?} object
     * @return {?}
     */
    function (object) {
        /** @type {?} */
        var results = {};
        this.forEachDeep(object, function (value, pointer) {
            if (typeof value !== 'object') {
                results[pointer] = value;
            }
        });
        return results;
    };
    /**
     * 'forEachDeep' function
     *
     * Iterates over own enumerable properties of an object or items in an array
     * and invokes an iteratee function for each key/value or index/value pair.
     * By default, iterates over items within objects and arrays after calling
     * the iteratee function on the containing object or array itself.
     *
     * The iteratee is invoked with three arguments: (value, pointer, rootObject),
     * where pointer is a JSON pointer indicating the location of the current
     * value within the root object, and rootObject is the root object initially
     * submitted to th function.
     *
     * If a third optional parameter 'bottomUp' is set to TRUE, the iterator
     * function will be called on sub-objects and arrays after being
     * called on their contents, rather than before, which is the default.
     *
     * This function can also optionally be called directly on a sub-object by
     * including optional 4th and 5th parameterss to specify the initial
     * root object and pointer.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, p?: string, o?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The modified object
     */
    /**
     * 'forEachDeep' function
     *
     * Iterates over own enumerable properties of an object or items in an array
     * and invokes an iteratee function for each key/value or index/value pair.
     * By default, iterates over items within objects and arrays after calling
     * the iteratee function on the containing object or array itself.
     *
     * The iteratee is invoked with three arguments: (value, pointer, rootObject),
     * where pointer is a JSON pointer indicating the location of the current
     * value within the root object, and rootObject is the root object initially
     * submitted to th function.
     *
     * If a third optional parameter 'bottomUp' is set to TRUE, the iterator
     * function will be called on sub-objects and arrays after being
     * called on their contents, rather than before, which is the default.
     *
     * This function can also optionally be called directly on a sub-object by
     * including optional 4th and 5th parameterss to specify the initial
     * root object and pointer.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, p?: string, o?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The modified object
     * @param {?} object
     * @param {?=} fn
     * @param {?=} bottomUp
     * @param {?=} pointer
     * @param {?=} rootObject
     * @return {?}
     */
    JsonPointer.forEachDeep = /**
     * 'forEachDeep' function
     *
     * Iterates over own enumerable properties of an object or items in an array
     * and invokes an iteratee function for each key/value or index/value pair.
     * By default, iterates over items within objects and arrays after calling
     * the iteratee function on the containing object or array itself.
     *
     * The iteratee is invoked with three arguments: (value, pointer, rootObject),
     * where pointer is a JSON pointer indicating the location of the current
     * value within the root object, and rootObject is the root object initially
     * submitted to th function.
     *
     * If a third optional parameter 'bottomUp' is set to TRUE, the iterator
     * function will be called on sub-objects and arrays after being
     * called on their contents, rather than before, which is the default.
     *
     * This function can also optionally be called directly on a sub-object by
     * including optional 4th and 5th parameterss to specify the initial
     * root object and pointer.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, p?: string, o?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The modified object
     * @param {?} object
     * @param {?=} fn
     * @param {?=} bottomUp
     * @param {?=} pointer
     * @param {?=} rootObject
     * @return {?}
     */
    function (object, fn, bottomUp, pointer, rootObject) {
        if (fn === void 0) { fn = function (v) { return v; }; }
        if (bottomUp === void 0) { bottomUp = false; }
        if (pointer === void 0) { pointer = ''; }
        if (rootObject === void 0) { rootObject = object; }
        if (typeof fn !== 'function') {
            console.error("forEachDeep error: Iterator is not a function:", fn);
            return;
        }
        if (!bottomUp) {
            fn(object, pointer, rootObject);
        }
        if (isObject(object) || isArray(object)) {
            try {
                for (var _a = tslib_1.__values(Object.keys(object)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    /** @type {?} */
                    var newPointer = pointer + '/' + this.escape(key);
                    this.forEachDeep(object[key], fn, bottomUp, newPointer, rootObject);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        if (bottomUp) {
            fn(object, pointer, rootObject);
        }
        var e_4, _c;
    };
    /**
     * 'forEachDeepCopy' function
     *
     * Similar to forEachDeep, but returns a copy of the original object, with
     * the same keys and indexes, but with values replaced with the result of
     * the iteratee function.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, k?: string, o?: any, p?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The copied object
     */
    /**
     * 'forEachDeepCopy' function
     *
     * Similar to forEachDeep, but returns a copy of the original object, with
     * the same keys and indexes, but with values replaced with the result of
     * the iteratee function.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, k?: string, o?: any, p?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The copied object
     * @param {?} object
     * @param {?=} fn
     * @param {?=} bottomUp
     * @param {?=} pointer
     * @param {?=} rootObject
     * @return {?}
     */
    JsonPointer.forEachDeepCopy = /**
     * 'forEachDeepCopy' function
     *
     * Similar to forEachDeep, but returns a copy of the original object, with
     * the same keys and indexes, but with values replaced with the result of
     * the iteratee function.
     *
     * //  { object } object - the initial object or array
     * //  { (v: any, k?: string, o?: any, p?: any) => any } function - iteratee function
     * //  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
     * //  { object = object } rootObject - optional, root object or array
     * //  { string = '' } pointer - optional, JSON Pointer to object within rootObject
     * // { object } - The copied object
     * @param {?} object
     * @param {?=} fn
     * @param {?=} bottomUp
     * @param {?=} pointer
     * @param {?=} rootObject
     * @return {?}
     */
    function (object, fn, bottomUp, pointer, rootObject) {
        if (fn === void 0) { fn = function (v) { return v; }; }
        if (bottomUp === void 0) { bottomUp = false; }
        if (pointer === void 0) { pointer = ''; }
        if (rootObject === void 0) { rootObject = object; }
        if (typeof fn !== 'function') {
            console.error("forEachDeepCopy error: Iterator is not a function:", fn);
            return null;
        }
        if (isObject(object) || isArray(object)) {
            /** @type {?} */
            var newObject = isArray(object) ? tslib_1.__spread(object) : tslib_1.__assign({}, object);
            if (!bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            try {
                for (var _a = tslib_1.__values(Object.keys(newObject)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    /** @type {?} */
                    var newPointer = pointer + '/' + this.escape(key);
                    newObject[key] = this.forEachDeepCopy(newObject[key], fn, bottomUp, newPointer, rootObject);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_5) throw e_5.error; }
            }
            if (bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            return newObject;
        }
        else {
            return fn(object, pointer, rootObject);
        }
        var e_5, _c;
    };
    /**
     * 'escape' function
     *
     * Escapes a string reference key
     *
     * //  { string } key - string key to escape
     * // { string } - escaped key
     */
    /**
     * 'escape' function
     *
     * Escapes a string reference key
     *
     * //  { string } key - string key to escape
     * // { string } - escaped key
     * @param {?} key
     * @return {?}
     */
    JsonPointer.escape = /**
     * 'escape' function
     *
     * Escapes a string reference key
     *
     * //  { string } key - string key to escape
     * // { string } - escaped key
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var escaped = key.toString().replace(/~/g, '~0').replace(/\//g, '~1');
        return escaped;
    };
    /**
     * 'unescape' function
     *
     * Unescapes a string reference key
     *
     * //  { string } key - string key to unescape
     * // { string } - unescaped key
     */
    /**
     * 'unescape' function
     *
     * Unescapes a string reference key
     *
     * //  { string } key - string key to unescape
     * // { string } - unescaped key
     * @param {?} key
     * @return {?}
     */
    JsonPointer.unescape = /**
     * 'unescape' function
     *
     * Unescapes a string reference key
     *
     * //  { string } key - string key to unescape
     * // { string } - unescaped key
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var unescaped = key.toString().replace(/~1/g, '/').replace(/~0/g, '~');
        return unescaped;
    };
    /**
     * 'parse' function
     *
     * Converts a string JSON Pointer into a array of keys
     * (if input is already an an array of keys, it is returned unchanged)
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string[] } - JSON Pointer array of keys
     */
    /**
     * 'parse' function
     *
     * Converts a string JSON Pointer into a array of keys
     * (if input is already an an array of keys, it is returned unchanged)
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string[] } - JSON Pointer array of keys
     * @param {?} pointer
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.parse = /**
     * 'parse' function
     *
     * Converts a string JSON Pointer into a array of keys
     * (if input is already an an array of keys, it is returned unchanged)
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string[] } - JSON Pointer array of keys
     * @param {?} pointer
     * @param {?=} errors
     * @return {?}
     */
    function (pointer, errors) {
        if (errors === void 0) { errors = false; }
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error("parse error: Invalid JSON Pointer: " + pointer);
            }
            return null;
        }
        if (isArray(pointer)) {
            return /** @type {?} */ (pointer);
        }
        if (typeof pointer === 'string') {
            if ((/** @type {?} */ (pointer))[0] === '#') {
                pointer = pointer.slice(1);
            }
            if (/** @type {?} */ (pointer) === '' || /** @type {?} */ (pointer) === '/') {
                return [];
            }
            return (/** @type {?} */ (pointer)).slice(1).split('/').map(this.unescape);
        }
    };
    /**
     * 'compile' function
     *
     * Converts an array of keys into a JSON Pointer string
     * (if input is already a string, it is normalized and returned)
     *
     * The optional second parameter is a default which will replace any empty keys.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { string | number = '' } defaultValue - Default value
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - JSON Pointer string
     */
    /**
     * 'compile' function
     *
     * Converts an array of keys into a JSON Pointer string
     * (if input is already a string, it is normalized and returned)
     *
     * The optional second parameter is a default which will replace any empty keys.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { string | number = '' } defaultValue - Default value
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - JSON Pointer string
     * @param {?} pointer
     * @param {?=} defaultValue
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.compile = /**
     * 'compile' function
     *
     * Converts an array of keys into a JSON Pointer string
     * (if input is already a string, it is normalized and returned)
     *
     * The optional second parameter is a default which will replace any empty keys.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { string | number = '' } defaultValue - Default value
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - JSON Pointer string
     * @param {?} pointer
     * @param {?=} defaultValue
     * @param {?=} errors
     * @return {?}
     */
    function (pointer, defaultValue, errors) {
        var _this = this;
        if (defaultValue === void 0) { defaultValue = ''; }
        if (errors === void 0) { errors = false; }
        if (pointer === '#') {
            return '';
        }
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error("compile error: Invalid JSON Pointer: " + pointer);
            }
            return null;
        }
        if (isArray(pointer)) {
            if ((/** @type {?} */ (pointer)).length === 0) {
                return '';
            }
            return '/' + (/** @type {?} */ (pointer)).map(function (key) { return key === '' ? defaultValue : _this.escape(key); }).join('/');
        }
        if (typeof pointer === 'string') {
            if (pointer[0] === '#') {
                pointer = pointer.slice(1);
            }
            return pointer;
        }
    };
    /**
     * 'toKey' function
     *
     * Extracts name of the final key from a JSON Pointer.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - the extracted key
     */
    /**
     * 'toKey' function
     *
     * Extracts name of the final key from a JSON Pointer.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - the extracted key
     * @param {?} pointer
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.toKey = /**
     * 'toKey' function
     *
     * Extracts name of the final key from a JSON Pointer.
     *
     * //  { Pointer } pointer - JSON Pointer (string or array)
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { string } - the extracted key
     * @param {?} pointer
     * @param {?=} errors
     * @return {?}
     */
    function (pointer, errors) {
        if (errors === void 0) { errors = false; }
        /** @type {?} */
        var keyArray = this.parse(pointer, errors);
        if (keyArray === null) {
            return null;
        }
        if (!keyArray.length) {
            return '';
        }
        return keyArray[keyArray.length - 1];
    };
    /**
     * 'isJsonPointer' function
     *
     * Checks a string or array value to determine if it is a valid JSON Pointer.
     * Returns true if a string is empty, or starts with '/' or '#/'.
     * Returns true if an array contains only string values.
     *
     * //   value - value to check
     * // { boolean } - true if value is a valid JSON Pointer, otherwise false
     */
    /**
     * 'isJsonPointer' function
     *
     * Checks a string or array value to determine if it is a valid JSON Pointer.
     * Returns true if a string is empty, or starts with '/' or '#/'.
     * Returns true if an array contains only string values.
     *
     * //   value - value to check
     * // { boolean } - true if value is a valid JSON Pointer, otherwise false
     * @param {?} value
     * @return {?}
     */
    JsonPointer.isJsonPointer = /**
     * 'isJsonPointer' function
     *
     * Checks a string or array value to determine if it is a valid JSON Pointer.
     * Returns true if a string is empty, or starts with '/' or '#/'.
     * Returns true if an array contains only string values.
     *
     * //   value - value to check
     * // { boolean } - true if value is a valid JSON Pointer, otherwise false
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (isArray(value)) {
            return value.every(function (key) { return typeof key === 'string'; });
        }
        else if (isString(value)) {
            if (value === '' || value === '#') {
                return true;
            }
            if (value[0] === '/' || value.slice(0, 2) === '#/') {
                return !/(~[^01]|~$)/g.test(value);
            }
        }
        return false;
    };
    /**
     * 'isSubPointer' function
     *
     * Checks whether one JSON Pointer is a subset of another.
     *
     * //  { Pointer } shortPointer - potential subset JSON Pointer
     * //  { Pointer } longPointer - potential superset JSON Pointer
     * //  { boolean = false } trueIfMatching - return true if pointers match?
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { boolean } - true if shortPointer is a subset of longPointer, false if not
     */
    /**
     * 'isSubPointer' function
     *
     * Checks whether one JSON Pointer is a subset of another.
     *
     * //  { Pointer } shortPointer - potential subset JSON Pointer
     * //  { Pointer } longPointer - potential superset JSON Pointer
     * //  { boolean = false } trueIfMatching - return true if pointers match?
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { boolean } - true if shortPointer is a subset of longPointer, false if not
     * @param {?} shortPointer
     * @param {?} longPointer
     * @param {?=} trueIfMatching
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.isSubPointer = /**
     * 'isSubPointer' function
     *
     * Checks whether one JSON Pointer is a subset of another.
     *
     * //  { Pointer } shortPointer - potential subset JSON Pointer
     * //  { Pointer } longPointer - potential superset JSON Pointer
     * //  { boolean = false } trueIfMatching - return true if pointers match?
     * //  { boolean = false } errors - Show error if invalid pointer?
     * // { boolean } - true if shortPointer is a subset of longPointer, false if not
     * @param {?} shortPointer
     * @param {?} longPointer
     * @param {?=} trueIfMatching
     * @param {?=} errors
     * @return {?}
     */
    function (shortPointer, longPointer, trueIfMatching, errors) {
        if (trueIfMatching === void 0) { trueIfMatching = false; }
        if (errors === void 0) { errors = false; }
        if (!this.isJsonPointer(shortPointer) || !this.isJsonPointer(longPointer)) {
            if (errors) {
                /** @type {?} */
                var invalid = '';
                if (!this.isJsonPointer(shortPointer)) {
                    invalid += " 1: " + shortPointer;
                }
                if (!this.isJsonPointer(longPointer)) {
                    invalid += " 2: " + longPointer;
                }
                console.error("isSubPointer error: Invalid JSON Pointer " + invalid);
            }
            return;
        }
        shortPointer = this.compile(shortPointer, '', errors);
        longPointer = this.compile(longPointer, '', errors);
        return shortPointer === longPointer ? trueIfMatching :
            shortPointer + "/" === longPointer.slice(0, shortPointer.length + 1);
    };
    /**
     * 'toIndexedPointer' function
     *
     * Merges an array of numeric indexes and a generic pointer to create an
     * indexed pointer for a specific item.
     *
     * For example, merging the generic pointer '/foo/-/bar/-/baz' and
     * the array [4, 2] would result in the indexed pointer '/foo/4/bar/2/baz'
     *
     *
     * //  { Pointer } genericPointer - The generic pointer
     * //  { number[] } indexArray - The array of numeric indexes
     * //  { Map<string, number> } arrayMap - An optional array map
     * // { string } - The merged pointer with indexes
     */
    /**
     * 'toIndexedPointer' function
     *
     * Merges an array of numeric indexes and a generic pointer to create an
     * indexed pointer for a specific item.
     *
     * For example, merging the generic pointer '/foo/-/bar/-/baz' and
     * the array [4, 2] would result in the indexed pointer '/foo/4/bar/2/baz'
     *
     *
     * //  { Pointer } genericPointer - The generic pointer
     * //  { number[] } indexArray - The array of numeric indexes
     * //  { Map<string, number> } arrayMap - An optional array map
     * // { string } - The merged pointer with indexes
     * @param {?} genericPointer
     * @param {?} indexArray
     * @param {?=} arrayMap
     * @return {?}
     */
    JsonPointer.toIndexedPointer = /**
     * 'toIndexedPointer' function
     *
     * Merges an array of numeric indexes and a generic pointer to create an
     * indexed pointer for a specific item.
     *
     * For example, merging the generic pointer '/foo/-/bar/-/baz' and
     * the array [4, 2] would result in the indexed pointer '/foo/4/bar/2/baz'
     *
     *
     * //  { Pointer } genericPointer - The generic pointer
     * //  { number[] } indexArray - The array of numeric indexes
     * //  { Map<string, number> } arrayMap - An optional array map
     * // { string } - The merged pointer with indexes
     * @param {?} genericPointer
     * @param {?} indexArray
     * @param {?=} arrayMap
     * @return {?}
     */
    function (genericPointer, indexArray, arrayMap) {
        if (arrayMap === void 0) { arrayMap = null; }
        if (this.isJsonPointer(genericPointer) && isArray(indexArray)) {
            /** @type {?} */
            var indexedPointer_1 = this.compile(genericPointer);
            if (isMap(arrayMap)) {
                /** @type {?} */
                var arrayIndex_1 = 0;
                return indexedPointer_1.replace(/\/\-(?=\/|$)/g, function (key, stringIndex) {
                    return arrayMap.has((/** @type {?} */ (indexedPointer_1)).slice(0, stringIndex)) ?
                        '/' + indexArray[arrayIndex_1++] : key;
                });
            }
            else {
                try {
                    for (var indexArray_1 = tslib_1.__values(indexArray), indexArray_1_1 = indexArray_1.next(); !indexArray_1_1.done; indexArray_1_1 = indexArray_1.next()) {
                        var pointerIndex = indexArray_1_1.value;
                        indexedPointer_1 = indexedPointer_1.replace('/-', '/' + pointerIndex);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (indexArray_1_1 && !indexArray_1_1.done && (_a = indexArray_1.return)) _a.call(indexArray_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                return indexedPointer_1;
            }
        }
        if (!this.isJsonPointer(genericPointer)) {
            console.error("toIndexedPointer error: Invalid JSON Pointer: " + genericPointer);
        }
        if (!isArray(indexArray)) {
            console.error("toIndexedPointer error: Invalid indexArray: " + indexArray);
        }
        var e_6, _a;
    };
    ;
    /**
     * 'toGenericPointer' function
     *
     * Compares an indexed pointer to an array map and removes list array
     * indexes (but leaves tuple arrray indexes and all object keys, including
     * numeric keys) to create a generic pointer.
     *
     * For example, using the indexed pointer '/foo/1/bar/2/baz/3' and
     * the arrayMap [['/foo', 0], ['/foo/-/bar', 3], ['/foo/-/bar/-/baz', 0]]
     * would result in the generic pointer '/foo/-/bar/2/baz/-'
     * Using the indexed pointer '/foo/1/bar/4/baz/3' and the same arrayMap
     * would result in the generic pointer '/foo/-/bar/-/baz/-'
     * (the bar array has 3 tuple items, so index 2 is retained, but 4 is removed)
     *
     * The structure of the arrayMap is: [['path to array', number of tuple items]...]
     *
     *
     * //  { Pointer } indexedPointer - The indexed pointer (array or string)
     * //  { Map<string, number> } arrayMap - The optional array map (for preserving tuple indexes)
     * // { string } - The generic pointer with indexes removed
     */
    /**
     * 'toGenericPointer' function
     *
     * Compares an indexed pointer to an array map and removes list array
     * indexes (but leaves tuple arrray indexes and all object keys, including
     * numeric keys) to create a generic pointer.
     *
     * For example, using the indexed pointer '/foo/1/bar/2/baz/3' and
     * the arrayMap [['/foo', 0], ['/foo/-/bar', 3], ['/foo/-/bar/-/baz', 0]]
     * would result in the generic pointer '/foo/-/bar/2/baz/-'
     * Using the indexed pointer '/foo/1/bar/4/baz/3' and the same arrayMap
     * would result in the generic pointer '/foo/-/bar/-/baz/-'
     * (the bar array has 3 tuple items, so index 2 is retained, but 4 is removed)
     *
     * The structure of the arrayMap is: [['path to array', number of tuple items]...]
     *
     *
     * //  { Pointer } indexedPointer - The indexed pointer (array or string)
     * //  { Map<string, number> } arrayMap - The optional array map (for preserving tuple indexes)
     * // { string } - The generic pointer with indexes removed
     * @param {?} indexedPointer
     * @param {?=} arrayMap
     * @return {?}
     */
    JsonPointer.toGenericPointer = /**
     * 'toGenericPointer' function
     *
     * Compares an indexed pointer to an array map and removes list array
     * indexes (but leaves tuple arrray indexes and all object keys, including
     * numeric keys) to create a generic pointer.
     *
     * For example, using the indexed pointer '/foo/1/bar/2/baz/3' and
     * the arrayMap [['/foo', 0], ['/foo/-/bar', 3], ['/foo/-/bar/-/baz', 0]]
     * would result in the generic pointer '/foo/-/bar/2/baz/-'
     * Using the indexed pointer '/foo/1/bar/4/baz/3' and the same arrayMap
     * would result in the generic pointer '/foo/-/bar/-/baz/-'
     * (the bar array has 3 tuple items, so index 2 is retained, but 4 is removed)
     *
     * The structure of the arrayMap is: [['path to array', number of tuple items]...]
     *
     *
     * //  { Pointer } indexedPointer - The indexed pointer (array or string)
     * //  { Map<string, number> } arrayMap - The optional array map (for preserving tuple indexes)
     * // { string } - The generic pointer with indexes removed
     * @param {?} indexedPointer
     * @param {?=} arrayMap
     * @return {?}
     */
    function (indexedPointer, arrayMap) {
        if (arrayMap === void 0) { arrayMap = new Map(); }
        if (this.isJsonPointer(indexedPointer) && isMap(arrayMap)) {
            /** @type {?} */
            var pointerArray = this.parse(indexedPointer);
            for (var i = 1; i < pointerArray.length; i++) {
                /** @type {?} */
                var subPointer = this.compile(pointerArray.slice(0, i));
                if (arrayMap.has(subPointer) &&
                    arrayMap.get(subPointer) <= +pointerArray[i]) {
                    pointerArray[i] = '-';
                }
            }
            return this.compile(pointerArray);
        }
        if (!this.isJsonPointer(indexedPointer)) {
            console.error("toGenericPointer error: invalid JSON Pointer: " + indexedPointer);
        }
        if (!isMap(arrayMap)) {
            console.error("toGenericPointer error: invalid arrayMap: " + arrayMap);
        }
    };
    /**
     * 'toControlPointer' function
     *
     * Accepts a JSON Pointer for a data object and returns a JSON Pointer for the
     * matching control in an Angular FormGroup.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to a data object
     * //  { FormGroup } formGroup - Angular FormGroup to get value from
     * //  { boolean = false } controlMustExist - Only return if control exists?
     * // { Pointer } - JSON Pointer (string) to the formGroup object
     */
    /**
     * 'toControlPointer' function
     *
     * Accepts a JSON Pointer for a data object and returns a JSON Pointer for the
     * matching control in an Angular FormGroup.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to a data object
     * //  { FormGroup } formGroup - Angular FormGroup to get value from
     * //  { boolean = false } controlMustExist - Only return if control exists?
     * // { Pointer } - JSON Pointer (string) to the formGroup object
     * @param {?} dataPointer
     * @param {?} formGroup
     * @param {?=} controlMustExist
     * @return {?}
     */
    JsonPointer.toControlPointer = /**
     * 'toControlPointer' function
     *
     * Accepts a JSON Pointer for a data object and returns a JSON Pointer for the
     * matching control in an Angular FormGroup.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to a data object
     * //  { FormGroup } formGroup - Angular FormGroup to get value from
     * //  { boolean = false } controlMustExist - Only return if control exists?
     * // { Pointer } - JSON Pointer (string) to the formGroup object
     * @param {?} dataPointer
     * @param {?} formGroup
     * @param {?=} controlMustExist
     * @return {?}
     */
    function (dataPointer, formGroup, controlMustExist) {
        if (controlMustExist === void 0) { controlMustExist = false; }
        /** @type {?} */
        var dataPointerArray = this.parse(dataPointer);
        /** @type {?} */
        var controlPointerArray = [];
        /** @type {?} */
        var subGroup = formGroup;
        if (dataPointerArray !== null) {
            try {
                for (var dataPointerArray_1 = tslib_1.__values(dataPointerArray), dataPointerArray_1_1 = dataPointerArray_1.next(); !dataPointerArray_1_1.done; dataPointerArray_1_1 = dataPointerArray_1.next()) {
                    var key = dataPointerArray_1_1.value;
                    if (hasOwn(subGroup, 'controls')) {
                        controlPointerArray.push('controls');
                        subGroup = subGroup.controls;
                    }
                    if (isArray(subGroup) && (key === '-')) {
                        controlPointerArray.push((subGroup.length - 1).toString());
                        subGroup = subGroup[subGroup.length - 1];
                    }
                    else if (hasOwn(subGroup, key)) {
                        controlPointerArray.push(key);
                        subGroup = subGroup[key];
                    }
                    else if (controlMustExist) {
                        console.error("toControlPointer error: Unable to find \"" + key + "\" item in FormGroup.");
                        console.error(dataPointer);
                        console.error(formGroup);
                        return;
                    }
                    else {
                        controlPointerArray.push(key);
                        subGroup = { controls: {} };
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (dataPointerArray_1_1 && !dataPointerArray_1_1.done && (_a = dataPointerArray_1.return)) _a.call(dataPointerArray_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return this.compile(controlPointerArray);
        }
        console.error("toControlPointer error: Invalid JSON Pointer: " + dataPointer);
        var e_7, _a;
    };
    /**
     * 'toSchemaPointer' function
     *
     * Accepts a JSON Pointer to a value inside a data object and a JSON schema
     * for that object.
     *
     * Returns a Pointer to the sub-schema for the value inside the object's schema.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to an object
     * //   schema - JSON schema for the object
     * // { Pointer } - JSON Pointer (string) to the object's schema
     */
    /**
     * 'toSchemaPointer' function
     *
     * Accepts a JSON Pointer to a value inside a data object and a JSON schema
     * for that object.
     *
     * Returns a Pointer to the sub-schema for the value inside the object's schema.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to an object
     * //   schema - JSON schema for the object
     * // { Pointer } - JSON Pointer (string) to the object's schema
     * @param {?} dataPointer
     * @param {?} schema
     * @return {?}
     */
    JsonPointer.toSchemaPointer = /**
     * 'toSchemaPointer' function
     *
     * Accepts a JSON Pointer to a value inside a data object and a JSON schema
     * for that object.
     *
     * Returns a Pointer to the sub-schema for the value inside the object's schema.
     *
     * //  { Pointer } dataPointer - JSON Pointer (string or array) to an object
     * //   schema - JSON schema for the object
     * // { Pointer } - JSON Pointer (string) to the object's schema
     * @param {?} dataPointer
     * @param {?} schema
     * @return {?}
     */
    function (dataPointer, schema) {
        if (this.isJsonPointer(dataPointer) && typeof schema === 'object') {
            /** @type {?} */
            var pointerArray = this.parse(dataPointer);
            if (!pointerArray.length) {
                return '';
            }
            /** @type {?} */
            var firstKey = pointerArray.shift();
            if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
                if ((schema.properties || {})[firstKey]) {
                    return "/properties/" + this.escape(firstKey) +
                        this.toSchemaPointer(pointerArray, schema.properties[firstKey]);
                }
                else if (schema.additionalProperties) {
                    return '/additionalProperties' +
                        this.toSchemaPointer(pointerArray, schema.additionalProperties);
                }
            }
            if ((schema.type === 'array' || schema.items) &&
                (isNumber(firstKey) || firstKey === '-' || firstKey === '')) {
                /** @type {?} */
                var arrayItem = firstKey === '-' || firstKey === '' ? 0 : +firstKey;
                if (isArray(schema.items)) {
                    if (arrayItem < schema.items.length) {
                        return '/items/' + arrayItem +
                            this.toSchemaPointer(pointerArray, schema.items[arrayItem]);
                    }
                    else if (schema.additionalItems) {
                        return '/additionalItems' +
                            this.toSchemaPointer(pointerArray, schema.additionalItems);
                    }
                }
                else if (isObject(schema.items)) {
                    return '/items' + this.toSchemaPointer(pointerArray, schema.items);
                }
                else if (isObject(schema.additionalItems)) {
                    return '/additionalItems' +
                        this.toSchemaPointer(pointerArray, schema.additionalItems);
                }
            }
            console.error("toSchemaPointer error: Data pointer " + dataPointer + " " +
                ("not compatible with schema " + schema));
            return null;
        }
        if (!this.isJsonPointer(dataPointer)) {
            console.error("toSchemaPointer error: Invalid JSON Pointer: " + dataPointer);
        }
        if (typeof schema !== 'object') {
            console.error("toSchemaPointer error: Invalid JSON Schema: " + schema);
        }
        return null;
    };
    /**
     * 'toDataPointer' function
     *
     * Accepts a JSON Pointer to a sub-schema inside a JSON schema and the schema.
     *
     * If possible, returns a generic Pointer to the corresponding value inside
     * the data object described by the JSON schema.
     *
     * Returns null if the sub-schema is in an ambiguous location (such as
     * definitions or additionalProperties) where the corresponding value
     * location cannot be determined.
     *
     * //  { Pointer } schemaPointer - JSON Pointer (string or array) to a JSON schema
     * //   schema - the JSON schema
     * //  { boolean = false } errors - Show errors?
     * // { Pointer } - JSON Pointer (string) to the value in the data object
     */
    /**
     * 'toDataPointer' function
     *
     * Accepts a JSON Pointer to a sub-schema inside a JSON schema and the schema.
     *
     * If possible, returns a generic Pointer to the corresponding value inside
     * the data object described by the JSON schema.
     *
     * Returns null if the sub-schema is in an ambiguous location (such as
     * definitions or additionalProperties) where the corresponding value
     * location cannot be determined.
     *
     * //  { Pointer } schemaPointer - JSON Pointer (string or array) to a JSON schema
     * //   schema - the JSON schema
     * //  { boolean = false } errors - Show errors?
     * // { Pointer } - JSON Pointer (string) to the value in the data object
     * @param {?} schemaPointer
     * @param {?} schema
     * @param {?=} errors
     * @return {?}
     */
    JsonPointer.toDataPointer = /**
     * 'toDataPointer' function
     *
     * Accepts a JSON Pointer to a sub-schema inside a JSON schema and the schema.
     *
     * If possible, returns a generic Pointer to the corresponding value inside
     * the data object described by the JSON schema.
     *
     * Returns null if the sub-schema is in an ambiguous location (such as
     * definitions or additionalProperties) where the corresponding value
     * location cannot be determined.
     *
     * //  { Pointer } schemaPointer - JSON Pointer (string or array) to a JSON schema
     * //   schema - the JSON schema
     * //  { boolean = false } errors - Show errors?
     * // { Pointer } - JSON Pointer (string) to the value in the data object
     * @param {?} schemaPointer
     * @param {?} schema
     * @param {?=} errors
     * @return {?}
     */
    function (schemaPointer, schema, errors) {
        if (errors === void 0) { errors = false; }
        if (this.isJsonPointer(schemaPointer) && typeof schema === 'object' &&
            this.has(schema, schemaPointer)) {
            /** @type {?} */
            var pointerArray = this.parse(schemaPointer);
            if (!pointerArray.length) {
                return '';
            }
            /** @type {?} */
            var dataPointer = '';
            /** @type {?} */
            var firstKey = pointerArray.shift();
            if (firstKey === 'properties' ||
                (firstKey === 'items' && isArray(schema.items))) {
                /** @type {?} */
                var secondKey = pointerArray.shift();
                /** @type {?} */
                var pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
                return pointerSuffix === null ? null : '/' + secondKey + pointerSuffix;
            }
            else if (firstKey === 'additionalItems' ||
                (firstKey === 'items' && isObject(schema.items))) {
                /** @type {?} */
                var pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey]);
                return pointerSuffix === null ? null : '/-' + pointerSuffix;
            }
            else if (['allOf', 'anyOf', 'oneOf'].includes(firstKey)) {
                /** @type {?} */
                var secondKey = pointerArray.shift();
                return this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
            }
            else if (firstKey === 'not') {
                return this.toDataPointer(pointerArray, schema[firstKey]);
            }
            else if (['contains', 'definitions', 'dependencies', 'additionalItems',
                'additionalProperties', 'patternProperties', 'propertyNames'].includes(firstKey)) {
                if (errors) {
                    console.error("toDataPointer error: Ambiguous location");
                }
            }
            return '';
        }
        if (errors) {
            if (!this.isJsonPointer(schemaPointer)) {
                console.error("toDataPointer error: Invalid JSON Pointer: " + schemaPointer);
            }
            if (typeof schema !== 'object') {
                console.error("toDataPointer error: Invalid JSON Schema: " + schema);
            }
            if (typeof schema !== 'object') {
                console.error("toDataPointer error: Pointer " + schemaPointer + " invalid for Schema: " + schema);
            }
        }
        return null;
    };
    /**
     * 'parseObjectPath' function
     *
     * Parses a JavaScript object path into an array of keys, which
     * can then be passed to compile() to convert into a string JSON Pointer.
     *
     * Based on mike-marcacci's excellent objectpath parse function:
     * https://github.com/mike-marcacci/objectpath
     *
     * //  { Pointer } path - The object path to parse
     * // { string[] } - The resulting array of keys
     */
    /**
     * 'parseObjectPath' function
     *
     * Parses a JavaScript object path into an array of keys, which
     * can then be passed to compile() to convert into a string JSON Pointer.
     *
     * Based on mike-marcacci's excellent objectpath parse function:
     * https://github.com/mike-marcacci/objectpath
     *
     * //  { Pointer } path - The object path to parse
     * // { string[] } - The resulting array of keys
     * @param {?} path
     * @return {?}
     */
    JsonPointer.parseObjectPath = /**
     * 'parseObjectPath' function
     *
     * Parses a JavaScript object path into an array of keys, which
     * can then be passed to compile() to convert into a string JSON Pointer.
     *
     * Based on mike-marcacci's excellent objectpath parse function:
     * https://github.com/mike-marcacci/objectpath
     *
     * //  { Pointer } path - The object path to parse
     * // { string[] } - The resulting array of keys
     * @param {?} path
     * @return {?}
     */
    function (path) {
        if (isArray(path)) {
            return /** @type {?} */ (path);
        }
        if (this.isJsonPointer(path)) {
            return this.parse(path);
        }
        if (typeof path === 'string') {
            /** @type {?} */
            var index = 0;
            /** @type {?} */
            var parts = [];
            while (index < path.length) {
                /** @type {?} */
                var nextDot = path.indexOf('.', index);
                /** @type {?} */
                var nextOB = path.indexOf('[', index); // next open bracket
                if (nextDot === -1 && nextOB === -1) {
                    // last item
                    parts.push(path.slice(index));
                    index = path.length;
                }
                else if (nextDot !== -1 && (nextDot < nextOB || nextOB === -1)) {
                    // dot notation
                    parts.push(path.slice(index, nextDot));
                    index = nextDot + 1;
                }
                else {
                    // bracket notation
                    if (nextOB > index) {
                        parts.push(path.slice(index, nextOB));
                        index = nextOB;
                    }
                    /** @type {?} */
                    var quote = path.charAt(nextOB + 1);
                    if (quote === '"' || quote === "'") {
                        /** @type {?} */
                        var nextCB = path.indexOf(quote + ']', nextOB); // next close bracket
                        while (nextCB !== -1 && path.charAt(nextCB - 1) === '\\') {
                            nextCB = path.indexOf(quote + ']', nextCB + 2);
                        }
                        if (nextCB === -1) {
                            nextCB = path.length;
                        }
                        parts.push(path.slice(index + 2, nextCB)
                            .replace(new RegExp('\\' + quote, 'g'), quote));
                        index = nextCB + 2;
                    }
                    else {
                        /** @type {?} */
                        var nextCB = path.indexOf(']', nextOB); // next close bracket
                        if (nextCB === -1) {
                            nextCB = path.length;
                        }
                        parts.push(path.slice(index + 1, nextCB));
                        index = nextCB + 1;
                    }
                    if (path.charAt(index) === '.') {
                        index++;
                    }
                }
            }
            return parts;
        }
        console.error('parseObjectPath error: Input object path must be a string.');
    };
    JsonPointer.decorators = [
        { type: Injectable },
    ];
    return JsonPointer;
}());
export { JsonPointer };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBvaW50ZXIuZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvanNvbnBvaW50ZXIuZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQ0wsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUNqRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0scUJBQXFCLENBQUM7Ozs7Ozs7SUFxQmpEOzs7Ozs7Ozs7Ozs7T0FZRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ0ksZUFBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBVixVQUNFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBYyxFQUFFLFFBQXVCLEVBQ3hELFVBQWtCLEVBQUUsTUFBYztRQURqQiwyQkFBQSxFQUFBLGNBQWM7UUFBRSx5QkFBQSxFQUFBLGVBQXVCO1FBQ3hELDJCQUFBLEVBQUEsa0JBQWtCO1FBQUUsdUJBQUEsRUFBQSxjQUFjO1FBRWxDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7U0FBRTs7UUFDL0QsSUFBSSxRQUFRLEdBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDOztZQUNwRCxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUM7WUFDdkIsRUFB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QVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIGlzRGVmaW5lZCwgaXNFbXB0eSwgaXNPYmplY3QsIGlzQXJyYXksIGlzTWFwLCBpc051bWJlciwgaXNTdHJpbmdcbn0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IGhhc093biwgY29weSB9IGZyb20gJy4vdXRpbGl0eS5mdW5jdGlvbnMnO1xuXG4vKipcbiAqICdKc29uUG9pbnRlcicgY2xhc3NcbiAqXG4gKiBTb21lIHV0aWxpdGllcyBmb3IgdXNpbmcgSlNPTiBQb2ludGVycyB3aXRoIEpTT04gb2JqZWN0c1xuICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY5MDFcbiAqXG4gKiBnZXQsIGdldENvcHksIGdldEZpcnN0LCBzZXQsIHNldENvcHksIGluc2VydCwgaW5zZXJ0Q29weSwgcmVtb3ZlLCBoYXMsIGRpY3QsXG4gKiBmb3JFYWNoRGVlcCwgZm9yRWFjaERlZXBDb3B5LCBlc2NhcGUsIHVuZXNjYXBlLCBwYXJzZSwgY29tcGlsZSwgdG9LZXksXG4gKiBpc0pzb25Qb2ludGVyLCBpc1N1YlBvaW50ZXIsIHRvSW5kZXhlZFBvaW50ZXIsIHRvR2VuZXJpY1BvaW50ZXIsXG4gKiB0b0NvbnRyb2xQb2ludGVyLCB0b1NjaGVtYVBvaW50ZXIsIHRvRGF0YVBvaW50ZXIsIHBhcnNlT2JqZWN0UGF0aFxuICpcbiAqIFNvbWUgZnVuY3Rpb25zIGJhc2VkIG9uIG1hbnVlbHN0b2ZlcidzIGpzb24tcG9pbnRlciB1dGlsaXRpZXNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYW51ZWxzdG9mZXIvanNvbi1wb2ludGVyXG4gKi9cbmV4cG9ydCB0eXBlIFBvaW50ZXIgPSBzdHJpbmcgfCBzdHJpbmdbXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEpzb25Qb2ludGVyIHtcblxuICAvKipcbiAgICogJ2dldCcgZnVuY3Rpb25cbiAgICpcbiAgICogVXNlcyBhIEpTT04gUG9pbnRlciB0byByZXRyaWV2ZSBhIHZhbHVlIGZyb20gYW4gb2JqZWN0LlxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBPYmplY3QgdG8gZ2V0IHZhbHVlIGZyb21cbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gIHsgbnVtYmVyID0gMCB9IHN0YXJ0U2xpY2UgLSBaZXJvLWJhc2VkIGluZGV4IG9mIGZpcnN0IFBvaW50ZXIga2V5IHRvIHVzZVxuICAgKiAvLyAgeyBudW1iZXIgfSBlbmRTbGljZSAtIFplcm8tYmFzZWQgaW5kZXggb2YgbGFzdCBQb2ludGVyIGtleSB0byB1c2VcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZ2V0Qm9vbGVhbiAtIFJldHVybiBvbmx5IHRydWUgb3IgZmFsc2U/XG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3IgaWYgbm90IGZvdW5kP1xuICAgKiAvLyB7IG9iamVjdCB9IC0gTG9jYXRlZCB2YWx1ZSAob3IgdHJ1ZSBvciBmYWxzZSBpZiBnZXRCb29sZWFuID0gdHJ1ZSlcbiAgICovXG4gIHN0YXRpYyBnZXQoXG4gICAgb2JqZWN0LCBwb2ludGVyLCBzdGFydFNsaWNlID0gMCwgZW5kU2xpY2U6IG51bWJlciA9IG51bGwsXG4gICAgZ2V0Qm9vbGVhbiA9IGZhbHNlLCBlcnJvcnMgPSBmYWxzZVxuICApIHtcbiAgICBpZiAob2JqZWN0ID09PSBudWxsKSB7IHJldHVybiBnZXRCb29sZWFuID8gZmFsc2UgOiB1bmRlZmluZWQ7IH1cbiAgICBsZXQga2V5QXJyYXk6IGFueVtdID0gdGhpcy5wYXJzZShwb2ludGVyLCBlcnJvcnMpO1xuICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBrZXlBcnJheSAhPT0gbnVsbCkge1xuICAgICAgbGV0IHN1Yk9iamVjdCA9IG9iamVjdDtcbiAgICAgIGlmIChzdGFydFNsaWNlID49IGtleUFycmF5Lmxlbmd0aCB8fCBlbmRTbGljZSA8PSAta2V5QXJyYXkubGVuZ3RoKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICAgIGlmIChzdGFydFNsaWNlIDw9IC1rZXlBcnJheS5sZW5ndGgpIHsgc3RhcnRTbGljZSA9IDA7IH1cbiAgICAgIGlmICghaXNEZWZpbmVkKGVuZFNsaWNlKSB8fCBlbmRTbGljZSA+PSBrZXlBcnJheS5sZW5ndGgpIHsgZW5kU2xpY2UgPSBrZXlBcnJheS5sZW5ndGg7IH1cbiAgICAgIGtleUFycmF5ID0ga2V5QXJyYXkuc2xpY2Uoc3RhcnRTbGljZSwgZW5kU2xpY2UpO1xuICAgICAgZm9yIChsZXQga2V5IG9mIGtleUFycmF5KSB7XG4gICAgICAgIGlmIChrZXkgPT09ICctJyAmJiBpc0FycmF5KHN1Yk9iamVjdCkgJiYgc3ViT2JqZWN0Lmxlbmd0aCkge1xuICAgICAgICAgIGtleSA9IHN1Yk9iamVjdC5sZW5ndGggLSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc01hcChzdWJPYmplY3QpICYmIHN1Yk9iamVjdC5oYXMoa2V5KSkge1xuICAgICAgICAgIHN1Yk9iamVjdCA9IHN1Yk9iamVjdC5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3ViT2JqZWN0ID09PSAnb2JqZWN0JyAmJiBzdWJPYmplY3QgIT09IG51bGwgJiZcbiAgICAgICAgICBoYXNPd24oc3ViT2JqZWN0LCBrZXkpXG4gICAgICAgICkge1xuICAgICAgICAgIHN1Yk9iamVjdCA9IHN1Yk9iamVjdFtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGdldCBlcnJvcjogXCIke2tleX1cIiBrZXkgbm90IGZvdW5kIGluIG9iamVjdC5gKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocG9pbnRlcik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKG9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBnZXRCb29sZWFuID8gZmFsc2UgOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBnZXRCb29sZWFuID8gdHJ1ZSA6IHN1Yk9iamVjdDtcbiAgICB9XG4gICAgaWYgKGVycm9ycyAmJiBrZXlBcnJheSA9PT0gbnVsbCkge1xuICAgICAgY29uc29sZS5lcnJvcihgZ2V0IGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtwb2ludGVyfWApO1xuICAgIH1cbiAgICBpZiAoZXJyb3JzICYmIHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdnZXQgZXJyb3I6IEludmFsaWQgb2JqZWN0OicpO1xuICAgICAgY29uc29sZS5lcnJvcihvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0Qm9vbGVhbiA/IGZhbHNlIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqICdnZXRDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBVc2VzIGEgSlNPTiBQb2ludGVyIHRvIGRlZXBseSBjbG9uZSBhIHZhbHVlIGZyb20gYW4gb2JqZWN0LlxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBPYmplY3QgdG8gZ2V0IHZhbHVlIGZyb21cbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gIHsgbnVtYmVyID0gMCB9IHN0YXJ0U2xpY2UgLSBaZXJvLWJhc2VkIGluZGV4IG9mIGZpcnN0IFBvaW50ZXIga2V5IHRvIHVzZVxuICAgKiAvLyAgeyBudW1iZXIgfSBlbmRTbGljZSAtIFplcm8tYmFzZWQgaW5kZXggb2YgbGFzdCBQb2ludGVyIGtleSB0byB1c2VcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZ2V0Qm9vbGVhbiAtIFJldHVybiBvbmx5IHRydWUgb3IgZmFsc2U/XG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3IgaWYgbm90IGZvdW5kP1xuICAgKiAvLyB7IG9iamVjdCB9IC0gTG9jYXRlZCB2YWx1ZSAob3IgdHJ1ZSBvciBmYWxzZSBpZiBnZXRCb29sZWFuID0gdHJ1ZSlcbiAgICovXG4gIHN0YXRpYyBnZXRDb3B5KFxuICAgIG9iamVjdCwgcG9pbnRlciwgc3RhcnRTbGljZSA9IDAsIGVuZFNsaWNlOiBudW1iZXIgPSBudWxsLFxuICAgIGdldEJvb2xlYW4gPSBmYWxzZSwgZXJyb3JzID0gZmFsc2VcbiAgKSB7XG4gICAgY29uc3Qgb2JqZWN0VG9Db3B5ID1cbiAgICAgIHRoaXMuZ2V0KG9iamVjdCwgcG9pbnRlciwgc3RhcnRTbGljZSwgZW5kU2xpY2UsIGdldEJvb2xlYW4sIGVycm9ycyk7XG4gICAgcmV0dXJuIHRoaXMuZm9yRWFjaERlZXBDb3B5KG9iamVjdFRvQ29weSk7XG4gIH1cblxuICAvKipcbiAgICogJ2dldEZpcnN0JyBmdW5jdGlvblxuICAgKlxuICAgKiBUYWtlcyBhbiBhcnJheSBvZiBKU09OIFBvaW50ZXJzIGFuZCBvYmplY3RzLFxuICAgKiBjaGVja3MgZWFjaCBvYmplY3QgZm9yIGEgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSBwb2ludGVyLFxuICAgKiBhbmQgcmV0dXJucyB0aGUgZmlyc3QgdmFsdWUgZm91bmQuXG4gICAqXG4gICAqIC8vICB7IFtvYmplY3QsIHBvaW50ZXJdW10gfSBpdGVtcyAtIEFycmF5IG9mIG9iamVjdHMgYW5kIHBvaW50ZXJzIHRvIGNoZWNrXG4gICAqIC8vICB7IGFueSA9IG51bGwgfSBkZWZhdWx0VmFsdWUgLSBWYWx1ZSB0byByZXR1cm4gaWYgbm90aGluZyBmb3VuZFxuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSBnZXRDb3B5IC0gUmV0dXJuIGEgY29weSBpbnN0ZWFkP1xuICAgKiAvLyAgLSBGaXJzdCB2YWx1ZSBmb3VuZFxuICAgKi9cbiAgc3RhdGljIGdldEZpcnN0KGl0ZW1zLCBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGwsIGdldENvcHkgPSBmYWxzZSkge1xuICAgIGlmIChpc0VtcHR5KGl0ZW1zKSkgeyByZXR1cm47IH1cbiAgICBpZiAoaXNBcnJheShpdGVtcykpIHtcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgaWYgKGlzRW1wdHkoaXRlbSkpIHsgY29udGludWU7IH1cbiAgICAgICAgaWYgKGlzQXJyYXkoaXRlbSkgJiYgaXRlbS5sZW5ndGggPj0gMikge1xuICAgICAgICAgIGlmIChpc0VtcHR5KGl0ZW1bMF0pIHx8IGlzRW1wdHkoaXRlbVsxXSkpIHsgY29udGludWU7IH1cbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IGdldENvcHkgP1xuICAgICAgICAgICAgdGhpcy5nZXRDb3B5KGl0ZW1bMF0sIGl0ZW1bMV0pIDpcbiAgICAgICAgICAgIHRoaXMuZ2V0KGl0ZW1bMF0sIGl0ZW1bMV0pO1xuICAgICAgICAgIGlmICh2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmVycm9yKCdnZXRGaXJzdCBlcnJvcjogSW5wdXQgbm90IGluIGNvcnJlY3QgZm9ybWF0LlxcbicgK1xuICAgICAgICAgICdTaG91bGQgYmU6IFsgWyBvYmplY3QxLCBwb2ludGVyMSBdLCBbIG9iamVjdCAyLCBwb2ludGVyMiBdLCBldGMuLi4gXScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBpZiAoaXNNYXAoaXRlbXMpKSB7XG4gICAgICBmb3IgKGxldCBbb2JqZWN0LCBwb2ludGVyXSBvZiBpdGVtcykge1xuICAgICAgICBpZiAob2JqZWN0ID09PSBudWxsIHx8ICF0aGlzLmlzSnNvblBvaW50ZXIocG9pbnRlcikpIHsgY29udGludWU7IH1cbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRDb3B5ID9cbiAgICAgICAgICB0aGlzLmdldENvcHkob2JqZWN0LCBwb2ludGVyKSA6XG4gICAgICAgICAgdGhpcy5nZXQob2JqZWN0LCBwb2ludGVyKTtcbiAgICAgICAgaWYgKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgY29uc29sZS5lcnJvcignZ2V0Rmlyc3QgZXJyb3I6IElucHV0IG5vdCBpbiBjb3JyZWN0IGZvcm1hdC5cXG4nICtcbiAgICAgICdTaG91bGQgYmU6IFsgWyBvYmplY3QxLCBwb2ludGVyMSBdLCBbIG9iamVjdCAyLCBwb2ludGVyMiBdLCBldGMuLi4gXScpO1xuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogJ2dldEZpcnN0Q29weScgZnVuY3Rpb25cbiAgICpcbiAgICogU2ltaWxhciB0byBnZXRGaXJzdCwgYnV0IGFsd2F5cyByZXR1cm5zIGEgY29weS5cbiAgICpcbiAgICogLy8gIHsgW29iamVjdCwgcG9pbnRlcl1bXSB9IGl0ZW1zIC0gQXJyYXkgb2Ygb2JqZWN0cyBhbmQgcG9pbnRlcnMgdG8gY2hlY2tcbiAgICogLy8gIHsgYW55ID0gbnVsbCB9IGRlZmF1bHRWYWx1ZSAtIFZhbHVlIHRvIHJldHVybiBpZiBub3RoaW5nIGZvdW5kXG4gICAqIC8vICAtIENvcHkgb2YgZmlyc3QgdmFsdWUgZm91bmRcbiAgICovXG4gIHN0YXRpYyBnZXRGaXJzdENvcHkoaXRlbXMsIGRlZmF1bHRWYWx1ZTogYW55ID0gbnVsbCkge1xuICAgIGNvbnN0IGZpcnN0Q29weSA9IHRoaXMuZ2V0Rmlyc3QoaXRlbXMsIGRlZmF1bHRWYWx1ZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIGZpcnN0Q29weTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnc2V0JyBmdW5jdGlvblxuICAgKlxuICAgKiBVc2VzIGEgSlNPTiBQb2ludGVyIHRvIHNldCBhIHZhbHVlIG9uIGFuIG9iamVjdC5cbiAgICogQWxzbyBjcmVhdGVzIGFueSBtaXNzaW5nIHN1YiBvYmplY3RzIG9yIGFycmF5cyB0byBjb250YWluIHRoYXQgdmFsdWUuXG4gICAqXG4gICAqIElmIHRoZSBvcHRpb25hbCBmb3VydGggcGFyYW1ldGVyIGlzIFRSVUUgYW5kIHRoZSBpbm5lci1tb3N0IGNvbnRhaW5lclxuICAgKiBpcyBhbiBhcnJheSwgdGhlIGZ1bmN0aW9uIHdpbGwgaW5zZXJ0IHRoZSB2YWx1ZSBhcyBhIG5ldyBpdGVtIGF0IHRoZVxuICAgKiBzcGVjaWZpZWQgbG9jYXRpb24gaW4gdGhlIGFycmF5LCByYXRoZXIgdGhhbiBvdmVyd3JpdGluZyB0aGUgZXhpc3RpbmdcbiAgICogdmFsdWUgKGlmIGFueSkgYXQgdGhhdCBsb2NhdGlvbi5cbiAgICpcbiAgICogU28gc2V0KFsxLCAyLCAzXSwgJy8xJywgNCkgPT4gWzEsIDQsIDNdXG4gICAqIGFuZFxuICAgKiBTbyBzZXQoWzEsIDIsIDNdLCAnLzEnLCA0LCB0cnVlKSA9PiBbMSwgNCwgMiwgM11cbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gVGhlIG9iamVjdCB0byBzZXQgdmFsdWUgaW5cbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBUaGUgSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIC8vICAgdmFsdWUgLSBUaGUgbmV3IHZhbHVlIHRvIHNldFxuICAgKiAvLyAgeyBib29sZWFuIH0gaW5zZXJ0IC0gaW5zZXJ0IHZhbHVlP1xuICAgKiAvLyB7IG9iamVjdCB9IC0gVGhlIG9yaWdpbmFsIG9iamVjdCwgbW9kaWZpZWQgd2l0aCB0aGUgc2V0IHZhbHVlXG4gICAqL1xuICBzdGF0aWMgc2V0KG9iamVjdCwgcG9pbnRlciwgdmFsdWUsIGluc2VydCA9IGZhbHNlKSB7XG4gICAgY29uc3Qga2V5QXJyYXkgPSB0aGlzLnBhcnNlKHBvaW50ZXIpO1xuICAgIGlmIChrZXlBcnJheSAhPT0gbnVsbCAmJiBrZXlBcnJheS5sZW5ndGgpIHtcbiAgICAgIGxldCBzdWJPYmplY3QgPSBvYmplY3Q7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleUFycmF5Lmxlbmd0aCAtIDE7ICsraSkge1xuICAgICAgICBsZXQga2V5ID0ga2V5QXJyYXlbaV07XG4gICAgICAgIGlmIChrZXkgPT09ICctJyAmJiBpc0FycmF5KHN1Yk9iamVjdCkpIHtcbiAgICAgICAgICBrZXkgPSBzdWJPYmplY3QubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc01hcChzdWJPYmplY3QpICYmIHN1Yk9iamVjdC5oYXMoa2V5KSkge1xuICAgICAgICAgIHN1Yk9iamVjdCA9IHN1Yk9iamVjdC5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIWhhc093bihzdWJPYmplY3QsIGtleSkpIHtcbiAgICAgICAgICAgIHN1Yk9iamVjdFtrZXldID0gKGtleUFycmF5W2kgKyAxXS5tYXRjaCgvXihcXGQrfC0pJC8pKSA/IFtdIDoge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1Yk9iamVjdCA9IHN1Yk9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgbGFzdEtleSA9IGtleUFycmF5W2tleUFycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGlzQXJyYXkoc3ViT2JqZWN0KSAmJiBsYXN0S2V5ID09PSAnLScpIHtcbiAgICAgICAgc3ViT2JqZWN0LnB1c2godmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChpbnNlcnQgJiYgaXNBcnJheShzdWJPYmplY3QpICYmICFpc05hTigrbGFzdEtleSkpIHtcbiAgICAgICAgc3ViT2JqZWN0LnNwbGljZShsYXN0S2V5LCAwLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGlzTWFwKHN1Yk9iamVjdCkpIHtcbiAgICAgICAgc3ViT2JqZWN0LnNldChsYXN0S2V5LCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJPYmplY3RbbGFzdEtleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGNvbnNvbGUuZXJyb3IoYHNldCBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7cG9pbnRlcn1gKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdzZXRDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBDb3BpZXMgYW4gb2JqZWN0IGFuZCB1c2VzIGEgSlNPTiBQb2ludGVyIHRvIHNldCBhIHZhbHVlIG9uIHRoZSBjb3B5LlxuICAgKiBBbHNvIGNyZWF0ZXMgYW55IG1pc3Npbmcgc3ViIG9iamVjdHMgb3IgYXJyYXlzIHRvIGNvbnRhaW4gdGhhdCB2YWx1ZS5cbiAgICpcbiAgICogSWYgdGhlIG9wdGlvbmFsIGZvdXJ0aCBwYXJhbWV0ZXIgaXMgVFJVRSBhbmQgdGhlIGlubmVyLW1vc3QgY29udGFpbmVyXG4gICAqIGlzIGFuIGFycmF5LCB0aGUgZnVuY3Rpb24gd2lsbCBpbnNlcnQgdGhlIHZhbHVlIGFzIGEgbmV3IGl0ZW0gYXQgdGhlXG4gICAqIHNwZWNpZmllZCBsb2NhdGlvbiBpbiB0aGUgYXJyYXksIHJhdGhlciB0aGFuIG92ZXJ3cml0aW5nIHRoZSBleGlzdGluZyB2YWx1ZS5cbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gVGhlIG9iamVjdCB0byBjb3B5IGFuZCBzZXQgdmFsdWUgaW5cbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBUaGUgSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIC8vICAgdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0XG4gICAqIC8vICB7IGJvb2xlYW4gfSBpbnNlcnQgLSBpbnNlcnQgdmFsdWU/XG4gICAqIC8vIHsgb2JqZWN0IH0gLSBUaGUgbmV3IG9iamVjdCB3aXRoIHRoZSBzZXQgdmFsdWVcbiAgICovXG4gIHN0YXRpYyBzZXRDb3B5KG9iamVjdCwgcG9pbnRlciwgdmFsdWUsIGluc2VydCA9IGZhbHNlKSB7XG4gICAgY29uc3Qga2V5QXJyYXkgPSB0aGlzLnBhcnNlKHBvaW50ZXIpO1xuICAgIGlmIChrZXlBcnJheSAhPT0gbnVsbCkge1xuICAgICAgbGV0IG5ld09iamVjdCA9IGNvcHkob2JqZWN0KTtcbiAgICAgIGxldCBzdWJPYmplY3QgPSBuZXdPYmplY3Q7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleUFycmF5Lmxlbmd0aCAtIDE7ICsraSkge1xuICAgICAgICBsZXQga2V5ID0ga2V5QXJyYXlbaV07XG4gICAgICAgIGlmIChrZXkgPT09ICctJyAmJiBpc0FycmF5KHN1Yk9iamVjdCkpIHtcbiAgICAgICAgICBrZXkgPSBzdWJPYmplY3QubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc01hcChzdWJPYmplY3QpICYmIHN1Yk9iamVjdC5oYXMoa2V5KSkge1xuICAgICAgICAgIHN1Yk9iamVjdC5zZXQoa2V5LCBjb3B5KHN1Yk9iamVjdC5nZXQoa2V5KSkpO1xuICAgICAgICAgIHN1Yk9iamVjdCA9IHN1Yk9iamVjdC5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIWhhc093bihzdWJPYmplY3QsIGtleSkpIHtcbiAgICAgICAgICAgIHN1Yk9iamVjdFtrZXldID0gKGtleUFycmF5W2kgKyAxXS5tYXRjaCgvXihcXGQrfC0pJC8pKSA/IFtdIDoge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1Yk9iamVjdFtrZXldID0gY29weShzdWJPYmplY3Rba2V5XSk7XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBsYXN0S2V5ID0ga2V5QXJyYXlba2V5QXJyYXkubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoaXNBcnJheShzdWJPYmplY3QpICYmIGxhc3RLZXkgPT09ICctJykge1xuICAgICAgICBzdWJPYmplY3QucHVzaCh2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGluc2VydCAmJiBpc0FycmF5KHN1Yk9iamVjdCkgJiYgIWlzTmFOKCtsYXN0S2V5KSkge1xuICAgICAgICBzdWJPYmplY3Quc3BsaWNlKGxhc3RLZXksIDAsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNNYXAoc3ViT2JqZWN0KSkge1xuICAgICAgICBzdWJPYmplY3Quc2V0KGxhc3RLZXksIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Yk9iamVjdFtsYXN0S2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICB9XG4gICAgY29uc29sZS5lcnJvcihgc2V0Q29weSBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7cG9pbnRlcn1gKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdpbnNlcnQnIGZ1bmN0aW9uXG4gICAqXG4gICAqIENhbGxzICdzZXQnIHdpdGggaW5zZXJ0ID0gVFJVRVxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBvYmplY3QgdG8gaW5zZXJ0IHZhbHVlIGluXG4gICAqIC8vICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIC8vICAgdmFsdWUgLSB2YWx1ZSB0byBpbnNlcnRcbiAgICogLy8geyBvYmplY3QgfVxuICAgKi9cbiAgc3RhdGljIGluc2VydChvYmplY3QsIHBvaW50ZXIsIHZhbHVlKSB7XG4gICAgY29uc3QgdXBkYXRlZE9iamVjdCA9IHRoaXMuc2V0KG9iamVjdCwgcG9pbnRlciwgdmFsdWUsIHRydWUpO1xuICAgIHJldHVybiB1cGRhdGVkT2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdpbnNlcnRDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBDYWxscyAnc2V0Q29weScgd2l0aCBpbnNlcnQgPSBUUlVFXG4gICAqXG4gICAqIC8vICB7IG9iamVjdCB9IG9iamVjdCAtIG9iamVjdCB0byBpbnNlcnQgdmFsdWUgaW5cbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gICB2YWx1ZSAtIHZhbHVlIHRvIGluc2VydFxuICAgKiAvLyB7IG9iamVjdCB9XG4gICAqL1xuICBzdGF0aWMgaW5zZXJ0Q29weShvYmplY3QsIHBvaW50ZXIsIHZhbHVlKSB7XG4gICAgY29uc3QgdXBkYXRlZE9iamVjdCA9IHRoaXMuc2V0Q29weShvYmplY3QsIHBvaW50ZXIsIHZhbHVlLCB0cnVlKTtcbiAgICByZXR1cm4gdXBkYXRlZE9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiAncmVtb3ZlJyBmdW5jdGlvblxuICAgKlxuICAgKiBVc2VzIGEgSlNPTiBQb2ludGVyIHRvIHJlbW92ZSBhIGtleSBhbmQgaXRzIGF0dHJpYnV0ZSBmcm9tIGFuIG9iamVjdFxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBvYmplY3QgdG8gZGVsZXRlIGF0dHJpYnV0ZSBmcm9tXG4gICAqIC8vICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIC8vIHsgb2JqZWN0IH1cbiAgICovXG4gIHN0YXRpYyByZW1vdmUob2JqZWN0LCBwb2ludGVyKSB7XG4gICAgbGV0IGtleUFycmF5ID0gdGhpcy5wYXJzZShwb2ludGVyKTtcbiAgICBpZiAoa2V5QXJyYXkgIT09IG51bGwgJiYga2V5QXJyYXkubGVuZ3RoKSB7XG4gICAgICBsZXQgbGFzdEtleSA9IGtleUFycmF5LnBvcCgpO1xuICAgICAgbGV0IHBhcmVudE9iamVjdCA9IHRoaXMuZ2V0KG9iamVjdCwga2V5QXJyYXkpO1xuICAgICAgaWYgKGlzQXJyYXkocGFyZW50T2JqZWN0KSkge1xuICAgICAgICBpZiAobGFzdEtleSA9PT0gJy0nKSB7IGxhc3RLZXkgPSBwYXJlbnRPYmplY3QubGVuZ3RoIC0gMTsgfVxuICAgICAgICBwYXJlbnRPYmplY3Quc3BsaWNlKGxhc3RLZXksIDEpO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChwYXJlbnRPYmplY3QpKSB7XG4gICAgICAgIGRlbGV0ZSBwYXJlbnRPYmplY3RbbGFzdEtleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKGByZW1vdmUgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiAnaGFzJyBmdW5jdGlvblxuICAgKlxuICAgKiBUZXN0cyBpZiBhbiBvYmplY3QgaGFzIGEgdmFsdWUgYXQgdGhlIGxvY2F0aW9uIHNwZWNpZmllZCBieSBhIEpTT04gUG9pbnRlclxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBvYmplY3QgdG8gY2hlayBmb3IgdmFsdWVcbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8geyBib29sZWFuIH1cbiAgICovXG4gIHN0YXRpYyBoYXMob2JqZWN0LCBwb2ludGVyKSB7XG4gICAgY29uc3QgaGFzVmFsdWUgPSB0aGlzLmdldChvYmplY3QsIHBvaW50ZXIsIDAsIG51bGwsIHRydWUpO1xuICAgIHJldHVybiBoYXNWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnZGljdCcgZnVuY3Rpb25cbiAgICpcbiAgICogUmV0dXJucyBhIChwb2ludGVyIC0+IHZhbHVlKSBkaWN0aW9uYXJ5IGZvciBhbiBvYmplY3RcbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gVGhlIG9iamVjdCB0byBjcmVhdGUgYSBkaWN0aW9uYXJ5IGZyb21cbiAgICogLy8geyBvYmplY3QgfSAtIFRoZSByZXN1bHRpbmcgZGljdGlvbmFyeSBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBkaWN0KG9iamVjdCkge1xuICAgIGxldCByZXN1bHRzOiBhbnkgPSB7fTtcbiAgICB0aGlzLmZvckVhY2hEZWVwKG9iamVjdCwgKHZhbHVlLCBwb2ludGVyKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXN1bHRzW3BvaW50ZXJdID0gdmFsdWU7IH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIC8qKlxuICAgKiAnZm9yRWFjaERlZXAnIGZ1bmN0aW9uXG4gICAqXG4gICAqIEl0ZXJhdGVzIG92ZXIgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3Qgb3IgaXRlbXMgaW4gYW4gYXJyYXlcbiAgICogYW5kIGludm9rZXMgYW4gaXRlcmF0ZWUgZnVuY3Rpb24gZm9yIGVhY2gga2V5L3ZhbHVlIG9yIGluZGV4L3ZhbHVlIHBhaXIuXG4gICAqIEJ5IGRlZmF1bHQsIGl0ZXJhdGVzIG92ZXIgaXRlbXMgd2l0aGluIG9iamVjdHMgYW5kIGFycmF5cyBhZnRlciBjYWxsaW5nXG4gICAqIHRoZSBpdGVyYXRlZSBmdW5jdGlvbiBvbiB0aGUgY29udGFpbmluZyBvYmplY3Qgb3IgYXJyYXkgaXRzZWxmLlxuICAgKlxuICAgKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBwb2ludGVyLCByb290T2JqZWN0KSxcbiAgICogd2hlcmUgcG9pbnRlciBpcyBhIEpTT04gcG9pbnRlciBpbmRpY2F0aW5nIHRoZSBsb2NhdGlvbiBvZiB0aGUgY3VycmVudFxuICAgKiB2YWx1ZSB3aXRoaW4gdGhlIHJvb3Qgb2JqZWN0LCBhbmQgcm9vdE9iamVjdCBpcyB0aGUgcm9vdCBvYmplY3QgaW5pdGlhbGx5XG4gICAqIHN1Ym1pdHRlZCB0byB0aCBmdW5jdGlvbi5cbiAgICpcbiAgICogSWYgYSB0aGlyZCBvcHRpb25hbCBwYXJhbWV0ZXIgJ2JvdHRvbVVwJyBpcyBzZXQgdG8gVFJVRSwgdGhlIGl0ZXJhdG9yXG4gICAqIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIG9uIHN1Yi1vYmplY3RzIGFuZCBhcnJheXMgYWZ0ZXIgYmVpbmdcbiAgICogY2FsbGVkIG9uIHRoZWlyIGNvbnRlbnRzLCByYXRoZXIgdGhhbiBiZWZvcmUsIHdoaWNoIGlzIHRoZSBkZWZhdWx0LlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGNhbiBhbHNvIG9wdGlvbmFsbHkgYmUgY2FsbGVkIGRpcmVjdGx5IG9uIGEgc3ViLW9iamVjdCBieVxuICAgKiBpbmNsdWRpbmcgb3B0aW9uYWwgNHRoIGFuZCA1dGggcGFyYW1ldGVyc3MgdG8gc3BlY2lmeSB0aGUgaW5pdGlhbFxuICAgKiByb290IG9iamVjdCBhbmQgcG9pbnRlci5cbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gdGhlIGluaXRpYWwgb2JqZWN0IG9yIGFycmF5XG4gICAqIC8vICB7ICh2OiBhbnksIHA/OiBzdHJpbmcsIG8/OiBhbnkpID0+IGFueSB9IGZ1bmN0aW9uIC0gaXRlcmF0ZWUgZnVuY3Rpb25cbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gYm90dG9tVXAgLSBvcHRpb25hbCwgc2V0IHRvIFRSVUUgdG8gcmV2ZXJzZSBkaXJlY3Rpb25cbiAgICogLy8gIHsgb2JqZWN0ID0gb2JqZWN0IH0gcm9vdE9iamVjdCAtIG9wdGlvbmFsLCByb290IG9iamVjdCBvciBhcnJheVxuICAgKiAvLyAgeyBzdHJpbmcgPSAnJyB9IHBvaW50ZXIgLSBvcHRpb25hbCwgSlNPTiBQb2ludGVyIHRvIG9iamVjdCB3aXRoaW4gcm9vdE9iamVjdFxuICAgKiAvLyB7IG9iamVjdCB9IC0gVGhlIG1vZGlmaWVkIG9iamVjdFxuICAgKi9cbiAgc3RhdGljIGZvckVhY2hEZWVwKFxuICAgIG9iamVjdCwgZm46ICh2OiBhbnksIHA/OiBzdHJpbmcsIG8/OiBhbnkpID0+IGFueSA9ICh2KSA9PiB2LFxuICAgIGJvdHRvbVVwID0gZmFsc2UsIHBvaW50ZXIgPSAnJywgcm9vdE9iamVjdCA9IG9iamVjdFxuICApIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBmb3JFYWNoRGVlcCBlcnJvcjogSXRlcmF0b3IgaXMgbm90IGEgZnVuY3Rpb246YCwgZm4pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWJvdHRvbVVwKSB7IGZuKG9iamVjdCwgcG9pbnRlciwgcm9vdE9iamVjdCk7IH1cbiAgICBpZiAoaXNPYmplY3Qob2JqZWN0KSB8fCBpc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3QpKSB7XG4gICAgICAgIGNvbnN0IG5ld1BvaW50ZXIgPSBwb2ludGVyICsgJy8nICsgdGhpcy5lc2NhcGUoa2V5KTtcbiAgICAgICAgdGhpcy5mb3JFYWNoRGVlcChvYmplY3Rba2V5XSwgZm4sIGJvdHRvbVVwLCBuZXdQb2ludGVyLCByb290T2JqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJvdHRvbVVwKSB7IGZuKG9iamVjdCwgcG9pbnRlciwgcm9vdE9iamVjdCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiAnZm9yRWFjaERlZXBDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBTaW1pbGFyIHRvIGZvckVhY2hEZWVwLCBidXQgcmV0dXJucyBhIGNvcHkgb2YgdGhlIG9yaWdpbmFsIG9iamVjdCwgd2l0aFxuICAgKiB0aGUgc2FtZSBrZXlzIGFuZCBpbmRleGVzLCBidXQgd2l0aCB2YWx1ZXMgcmVwbGFjZWQgd2l0aCB0aGUgcmVzdWx0IG9mXG4gICAqIHRoZSBpdGVyYXRlZSBmdW5jdGlvbi5cbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gdGhlIGluaXRpYWwgb2JqZWN0IG9yIGFycmF5XG4gICAqIC8vICB7ICh2OiBhbnksIGs/OiBzdHJpbmcsIG8/OiBhbnksIHA/OiBhbnkpID0+IGFueSB9IGZ1bmN0aW9uIC0gaXRlcmF0ZWUgZnVuY3Rpb25cbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gYm90dG9tVXAgLSBvcHRpb25hbCwgc2V0IHRvIFRSVUUgdG8gcmV2ZXJzZSBkaXJlY3Rpb25cbiAgICogLy8gIHsgb2JqZWN0ID0gb2JqZWN0IH0gcm9vdE9iamVjdCAtIG9wdGlvbmFsLCByb290IG9iamVjdCBvciBhcnJheVxuICAgKiAvLyAgeyBzdHJpbmcgPSAnJyB9IHBvaW50ZXIgLSBvcHRpb25hbCwgSlNPTiBQb2ludGVyIHRvIG9iamVjdCB3aXRoaW4gcm9vdE9iamVjdFxuICAgKiAvLyB7IG9iamVjdCB9IC0gVGhlIGNvcGllZCBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBmb3JFYWNoRGVlcENvcHkoXG4gICAgb2JqZWN0LCBmbjogKHY6IGFueSwgcD86IHN0cmluZywgbz86IGFueSkgPT4gYW55ID0gKHYpID0+IHYsXG4gICAgYm90dG9tVXAgPSBmYWxzZSwgcG9pbnRlciA9ICcnLCByb290T2JqZWN0ID0gb2JqZWN0XG4gICkge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGZvckVhY2hEZWVwQ29weSBlcnJvcjogSXRlcmF0b3IgaXMgbm90IGEgZnVuY3Rpb246YCwgZm4pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChpc09iamVjdChvYmplY3QpIHx8IGlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgbGV0IG5ld09iamVjdCA9IGlzQXJyYXkob2JqZWN0KSA/IFsgLi4ub2JqZWN0IF0gOiB7IC4uLm9iamVjdCB9O1xuICAgICAgaWYgKCFib3R0b21VcCkgeyBuZXdPYmplY3QgPSBmbihuZXdPYmplY3QsIHBvaW50ZXIsIHJvb3RPYmplY3QpOyB9XG4gICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMobmV3T2JqZWN0KSkge1xuICAgICAgICBjb25zdCBuZXdQb2ludGVyID0gcG9pbnRlciArICcvJyArIHRoaXMuZXNjYXBlKGtleSk7XG4gICAgICAgIG5ld09iamVjdFtrZXldID0gdGhpcy5mb3JFYWNoRGVlcENvcHkoXG4gICAgICAgICAgbmV3T2JqZWN0W2tleV0sIGZuLCBib3R0b21VcCwgbmV3UG9pbnRlciwgcm9vdE9iamVjdFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKGJvdHRvbVVwKSB7IG5ld09iamVjdCA9IGZuKG5ld09iamVjdCwgcG9pbnRlciwgcm9vdE9iamVjdCk7IH1cbiAgICAgIHJldHVybiBuZXdPYmplY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbihvYmplY3QsIHBvaW50ZXIsIHJvb3RPYmplY3QpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAnZXNjYXBlJyBmdW5jdGlvblxuICAgKlxuICAgKiBFc2NhcGVzIGEgc3RyaW5nIHJlZmVyZW5jZSBrZXlcbiAgICpcbiAgICogLy8gIHsgc3RyaW5nIH0ga2V5IC0gc3RyaW5nIGtleSB0byBlc2NhcGVcbiAgICogLy8geyBzdHJpbmcgfSAtIGVzY2FwZWQga2V5XG4gICAqL1xuICBzdGF0aWMgZXNjYXBlKGtleSkge1xuICAgIGNvbnN0IGVzY2FwZWQgPSBrZXkudG9TdHJpbmcoKS5yZXBsYWNlKC9+L2csICd+MCcpLnJlcGxhY2UoL1xcLy9nLCAnfjEnKTtcbiAgICByZXR1cm4gZXNjYXBlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiAndW5lc2NhcGUnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFVuZXNjYXBlcyBhIHN0cmluZyByZWZlcmVuY2Uga2V5XG4gICAqXG4gICAqIC8vICB7IHN0cmluZyB9IGtleSAtIHN0cmluZyBrZXkgdG8gdW5lc2NhcGVcbiAgICogLy8geyBzdHJpbmcgfSAtIHVuZXNjYXBlZCBrZXlcbiAgICovXG4gIHN0YXRpYyB1bmVzY2FwZShrZXkpIHtcbiAgICBjb25zdCB1bmVzY2FwZWQgPSBrZXkudG9TdHJpbmcoKS5yZXBsYWNlKC9+MS9nLCAnLycpLnJlcGxhY2UoL34wL2csICd+Jyk7XG4gICAgcmV0dXJuIHVuZXNjYXBlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiAncGFyc2UnIGZ1bmN0aW9uXG4gICAqXG4gICAqIENvbnZlcnRzIGEgc3RyaW5nIEpTT04gUG9pbnRlciBpbnRvIGEgYXJyYXkgb2Yga2V5c1xuICAgKiAoaWYgaW5wdXQgaXMgYWxyZWFkeSBhbiBhbiBhcnJheSBvZiBrZXlzLCBpdCBpcyByZXR1cm5lZCB1bmNoYW5nZWQpXG4gICAqXG4gICAqIC8vICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3IgaWYgaW52YWxpZCBwb2ludGVyP1xuICAgKiAvLyB7IHN0cmluZ1tdIH0gLSBKU09OIFBvaW50ZXIgYXJyYXkgb2Yga2V5c1xuICAgKi9cbiAgc3RhdGljIHBhcnNlKHBvaW50ZXIsIGVycm9ycyA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIocG9pbnRlcikpIHtcbiAgICAgIGlmIChlcnJvcnMpIHsgY29uc29sZS5lcnJvcihgcGFyc2UgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7IH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheShwb2ludGVyKSkgeyByZXR1cm4gPHN0cmluZ1tdPnBvaW50ZXI7IH1cbiAgICBpZiAodHlwZW9mIHBvaW50ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoKDxzdHJpbmc+cG9pbnRlcilbMF0gPT09ICcjJykgeyBwb2ludGVyID0gcG9pbnRlci5zbGljZSgxKTsgfVxuICAgICAgaWYgKDxzdHJpbmc+cG9pbnRlciA9PT0gJycgfHwgPHN0cmluZz5wb2ludGVyID09PSAnLycpIHsgcmV0dXJuIFtdOyB9XG4gICAgICByZXR1cm4gKDxzdHJpbmc+cG9pbnRlcikuc2xpY2UoMSkuc3BsaXQoJy8nKS5tYXAodGhpcy51bmVzY2FwZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICdjb21waWxlJyBmdW5jdGlvblxuICAgKlxuICAgKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBrZXlzIGludG8gYSBKU09OIFBvaW50ZXIgc3RyaW5nXG4gICAqIChpZiBpbnB1dCBpcyBhbHJlYWR5IGEgc3RyaW5nLCBpdCBpcyBub3JtYWxpemVkIGFuZCByZXR1cm5lZClcbiAgICpcbiAgICogVGhlIG9wdGlvbmFsIHNlY29uZCBwYXJhbWV0ZXIgaXMgYSBkZWZhdWx0IHdoaWNoIHdpbGwgcmVwbGFjZSBhbnkgZW1wdHkga2V5cy5cbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gIHsgc3RyaW5nIHwgbnVtYmVyID0gJycgfSBkZWZhdWx0VmFsdWUgLSBEZWZhdWx0IHZhbHVlXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3IgaWYgaW52YWxpZCBwb2ludGVyP1xuICAgKiAvLyB7IHN0cmluZyB9IC0gSlNPTiBQb2ludGVyIHN0cmluZ1xuICAgKi9cbiAgc3RhdGljIGNvbXBpbGUocG9pbnRlciwgZGVmYXVsdFZhbHVlID0gJycsIGVycm9ycyA9IGZhbHNlKSB7XG4gICAgaWYgKHBvaW50ZXIgPT09ICcjJykgeyByZXR1cm4gJyc7IH1cbiAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihwb2ludGVyKSkge1xuICAgICAgaWYgKGVycm9ycykgeyBjb25zb2xlLmVycm9yKGBjb21waWxlIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtwb2ludGVyfWApOyB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkocG9pbnRlcikpIHtcbiAgICAgIGlmICgoPHN0cmluZ1tdPnBvaW50ZXIpLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJyc7IH1cbiAgICAgIHJldHVybiAnLycgKyAoPHN0cmluZ1tdPnBvaW50ZXIpLm1hcChcbiAgICAgICAga2V5ID0+IGtleSA9PT0gJycgPyBkZWZhdWx0VmFsdWUgOiB0aGlzLmVzY2FwZShrZXkpXG4gICAgICApLmpvaW4oJy8nKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwb2ludGVyID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHBvaW50ZXJbMF0gPT09ICcjJykgeyBwb2ludGVyID0gcG9pbnRlci5zbGljZSgxKTsgfVxuICAgICAgcmV0dXJuIHBvaW50ZXI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICd0b0tleScgZnVuY3Rpb25cbiAgICpcbiAgICogRXh0cmFjdHMgbmFtZSBvZiB0aGUgZmluYWwga2V5IGZyb20gYSBKU09OIFBvaW50ZXIuXG4gICAqXG4gICAqIC8vICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3IgaWYgaW52YWxpZCBwb2ludGVyP1xuICAgKiAvLyB7IHN0cmluZyB9IC0gdGhlIGV4dHJhY3RlZCBrZXlcbiAgICovXG4gIHN0YXRpYyB0b0tleShwb2ludGVyLCBlcnJvcnMgPSBmYWxzZSkge1xuICAgIGxldCBrZXlBcnJheSA9IHRoaXMucGFyc2UocG9pbnRlciwgZXJyb3JzKTtcbiAgICBpZiAoa2V5QXJyYXkgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAoIWtleUFycmF5Lmxlbmd0aCkgeyByZXR1cm4gJyc7IH1cbiAgICByZXR1cm4ga2V5QXJyYXlba2V5QXJyYXkubGVuZ3RoIC0gMV07XG4gIH1cblxuICAvKipcbiAgICogJ2lzSnNvblBvaW50ZXInIGZ1bmN0aW9uXG4gICAqXG4gICAqIENoZWNrcyBhIHN0cmluZyBvciBhcnJheSB2YWx1ZSB0byBkZXRlcm1pbmUgaWYgaXQgaXMgYSB2YWxpZCBKU09OIFBvaW50ZXIuXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhIHN0cmluZyBpcyBlbXB0eSwgb3Igc3RhcnRzIHdpdGggJy8nIG9yICcjLycuXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhbiBhcnJheSBjb250YWlucyBvbmx5IHN0cmluZyB2YWx1ZXMuXG4gICAqXG4gICAqIC8vICAgdmFsdWUgLSB2YWx1ZSB0byBjaGVja1xuICAgKiAvLyB7IGJvb2xlYW4gfSAtIHRydWUgaWYgdmFsdWUgaXMgYSB2YWxpZCBKU09OIFBvaW50ZXIsIG90aGVyd2lzZSBmYWxzZVxuICAgKi9cbiAgc3RhdGljIGlzSnNvblBvaW50ZXIodmFsdWUpIHtcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5ldmVyeShrZXkgPT4gdHlwZW9mIGtleSA9PT0gJ3N0cmluZycpO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICBpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAnIycpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIGlmICh2YWx1ZVswXSA9PT0gJy8nIHx8IHZhbHVlLnNsaWNlKDAsIDIpID09PSAnIy8nKSB7XG4gICAgICAgIHJldHVybiAhLyh+W14wMV18fiQpL2cudGVzdCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnaXNTdWJQb2ludGVyJyBmdW5jdGlvblxuICAgKlxuICAgKiBDaGVja3Mgd2hldGhlciBvbmUgSlNPTiBQb2ludGVyIGlzIGEgc3Vic2V0IG9mIGFub3RoZXIuXG4gICAqXG4gICAqIC8vICB7IFBvaW50ZXIgfSBzaG9ydFBvaW50ZXIgLSBwb3RlbnRpYWwgc3Vic2V0IEpTT04gUG9pbnRlclxuICAgKiAvLyAgeyBQb2ludGVyIH0gbG9uZ1BvaW50ZXIgLSBwb3RlbnRpYWwgc3VwZXJzZXQgSlNPTiBQb2ludGVyXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IHRydWVJZk1hdGNoaW5nIC0gcmV0dXJuIHRydWUgaWYgcG9pbnRlcnMgbWF0Y2g/XG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3IgaWYgaW52YWxpZCBwb2ludGVyP1xuICAgKiAvLyB7IGJvb2xlYW4gfSAtIHRydWUgaWYgc2hvcnRQb2ludGVyIGlzIGEgc3Vic2V0IG9mIGxvbmdQb2ludGVyLCBmYWxzZSBpZiBub3RcbiAgICovXG4gIHN0YXRpYyBpc1N1YlBvaW50ZXIoXG4gICAgc2hvcnRQb2ludGVyLCBsb25nUG9pbnRlciwgdHJ1ZUlmTWF0Y2hpbmcgPSBmYWxzZSwgZXJyb3JzID0gZmFsc2VcbiAgKSB7XG4gICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIoc2hvcnRQb2ludGVyKSB8fCAhdGhpcy5pc0pzb25Qb2ludGVyKGxvbmdQb2ludGVyKSkge1xuICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICBsZXQgaW52YWxpZCA9ICcnXG4gICAgICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKHNob3J0UG9pbnRlcikpIHsgaW52YWxpZCArPSBgIDE6ICR7c2hvcnRQb2ludGVyfWA7IH1cbiAgICAgICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIobG9uZ1BvaW50ZXIpKSB7IGludmFsaWQgKz0gYCAyOiAke2xvbmdQb2ludGVyfWA7IH1cbiAgICAgICAgY29uc29sZS5lcnJvcihgaXNTdWJQb2ludGVyIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlciAke2ludmFsaWR9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNob3J0UG9pbnRlciA9IHRoaXMuY29tcGlsZShzaG9ydFBvaW50ZXIsICcnLCBlcnJvcnMpO1xuICAgIGxvbmdQb2ludGVyID0gdGhpcy5jb21waWxlKGxvbmdQb2ludGVyLCAnJywgZXJyb3JzKTtcbiAgICByZXR1cm4gc2hvcnRQb2ludGVyID09PSBsb25nUG9pbnRlciA/IHRydWVJZk1hdGNoaW5nIDpcbiAgICAgIGAke3Nob3J0UG9pbnRlcn0vYCA9PT0gbG9uZ1BvaW50ZXIuc2xpY2UoMCwgc2hvcnRQb2ludGVyLmxlbmd0aCArIDEpO1xuICB9XG5cbiAgLyoqXG4gICAqICd0b0luZGV4ZWRQb2ludGVyJyBmdW5jdGlvblxuICAgKlxuICAgKiBNZXJnZXMgYW4gYXJyYXkgb2YgbnVtZXJpYyBpbmRleGVzIGFuZCBhIGdlbmVyaWMgcG9pbnRlciB0byBjcmVhdGUgYW5cbiAgICogaW5kZXhlZCBwb2ludGVyIGZvciBhIHNwZWNpZmljIGl0ZW0uXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBtZXJnaW5nIHRoZSBnZW5lcmljIHBvaW50ZXIgJy9mb28vLS9iYXIvLS9iYXonIGFuZFxuICAgKiB0aGUgYXJyYXkgWzQsIDJdIHdvdWxkIHJlc3VsdCBpbiB0aGUgaW5kZXhlZCBwb2ludGVyICcvZm9vLzQvYmFyLzIvYmF6J1xuICAgKlxuICAgKiBcbiAgICogLy8gIHsgUG9pbnRlciB9IGdlbmVyaWNQb2ludGVyIC0gVGhlIGdlbmVyaWMgcG9pbnRlclxuICAgKiAvLyAgeyBudW1iZXJbXSB9IGluZGV4QXJyYXkgLSBUaGUgYXJyYXkgb2YgbnVtZXJpYyBpbmRleGVzXG4gICAqIC8vICB7IE1hcDxzdHJpbmcsIG51bWJlcj4gfSBhcnJheU1hcCAtIEFuIG9wdGlvbmFsIGFycmF5IG1hcFxuICAgKiAvLyB7IHN0cmluZyB9IC0gVGhlIG1lcmdlZCBwb2ludGVyIHdpdGggaW5kZXhlc1xuICAgKi9cbiAgc3RhdGljIHRvSW5kZXhlZFBvaW50ZXIoXG4gICAgZ2VuZXJpY1BvaW50ZXIsIGluZGV4QXJyYXksIGFycmF5TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbnVsbFxuICApIHtcbiAgICBpZiAodGhpcy5pc0pzb25Qb2ludGVyKGdlbmVyaWNQb2ludGVyKSAmJiBpc0FycmF5KGluZGV4QXJyYXkpKSB7XG4gICAgICBsZXQgaW5kZXhlZFBvaW50ZXIgPSB0aGlzLmNvbXBpbGUoZ2VuZXJpY1BvaW50ZXIpO1xuICAgICAgaWYgKGlzTWFwKGFycmF5TWFwKSkge1xuICAgICAgICBsZXQgYXJyYXlJbmRleCA9IDA7XG4gICAgICAgIHJldHVybiBpbmRleGVkUG9pbnRlci5yZXBsYWNlKC9cXC9cXC0oPz1cXC98JCkvZywgKGtleSwgc3RyaW5nSW5kZXgpID0+XG4gICAgICAgICAgYXJyYXlNYXAuaGFzKCg8c3RyaW5nPmluZGV4ZWRQb2ludGVyKS5zbGljZSgwLCBzdHJpbmdJbmRleCkpID9cbiAgICAgICAgICAgICcvJyArIGluZGV4QXJyYXlbYXJyYXlJbmRleCsrXSA6IGtleVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgcG9pbnRlckluZGV4IG9mIGluZGV4QXJyYXkpIHtcbiAgICAgICAgICBpbmRleGVkUG9pbnRlciA9IGluZGV4ZWRQb2ludGVyLnJlcGxhY2UoJy8tJywgJy8nICsgcG9pbnRlckluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5kZXhlZFBvaW50ZXI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKGdlbmVyaWNQb2ludGVyKSkge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9JbmRleGVkUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7Z2VuZXJpY1BvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmICghaXNBcnJheShpbmRleEFycmF5KSkge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9JbmRleGVkUG9pbnRlciBlcnJvcjogSW52YWxpZCBpbmRleEFycmF5OiAke2luZGV4QXJyYXl9YCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiAndG9HZW5lcmljUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogQ29tcGFyZXMgYW4gaW5kZXhlZCBwb2ludGVyIHRvIGFuIGFycmF5IG1hcCBhbmQgcmVtb3ZlcyBsaXN0IGFycmF5XG4gICAqIGluZGV4ZXMgKGJ1dCBsZWF2ZXMgdHVwbGUgYXJycmF5IGluZGV4ZXMgYW5kIGFsbCBvYmplY3Qga2V5cywgaW5jbHVkaW5nXG4gICAqIG51bWVyaWMga2V5cykgdG8gY3JlYXRlIGEgZ2VuZXJpYyBwb2ludGVyLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdXNpbmcgdGhlIGluZGV4ZWQgcG9pbnRlciAnL2Zvby8xL2Jhci8yL2Jhei8zJyBhbmRcbiAgICogdGhlIGFycmF5TWFwIFtbJy9mb28nLCAwXSwgWycvZm9vLy0vYmFyJywgM10sIFsnL2Zvby8tL2Jhci8tL2JheicsIDBdXVxuICAgKiB3b3VsZCByZXN1bHQgaW4gdGhlIGdlbmVyaWMgcG9pbnRlciAnL2Zvby8tL2Jhci8yL2Jhei8tJ1xuICAgKiBVc2luZyB0aGUgaW5kZXhlZCBwb2ludGVyICcvZm9vLzEvYmFyLzQvYmF6LzMnIGFuZCB0aGUgc2FtZSBhcnJheU1hcFxuICAgKiB3b3VsZCByZXN1bHQgaW4gdGhlIGdlbmVyaWMgcG9pbnRlciAnL2Zvby8tL2Jhci8tL2Jhei8tJ1xuICAgKiAodGhlIGJhciBhcnJheSBoYXMgMyB0dXBsZSBpdGVtcywgc28gaW5kZXggMiBpcyByZXRhaW5lZCwgYnV0IDQgaXMgcmVtb3ZlZClcbiAgICpcbiAgICogVGhlIHN0cnVjdHVyZSBvZiB0aGUgYXJyYXlNYXAgaXM6IFtbJ3BhdGggdG8gYXJyYXknLCBudW1iZXIgb2YgdHVwbGUgaXRlbXNdLi4uXVxuICAgKlxuICAgKiBcbiAgICogLy8gIHsgUG9pbnRlciB9IGluZGV4ZWRQb2ludGVyIC0gVGhlIGluZGV4ZWQgcG9pbnRlciAoYXJyYXkgb3Igc3RyaW5nKVxuICAgKiAvLyAgeyBNYXA8c3RyaW5nLCBudW1iZXI+IH0gYXJyYXlNYXAgLSBUaGUgb3B0aW9uYWwgYXJyYXkgbWFwIChmb3IgcHJlc2VydmluZyB0dXBsZSBpbmRleGVzKVxuICAgKiAvLyB7IHN0cmluZyB9IC0gVGhlIGdlbmVyaWMgcG9pbnRlciB3aXRoIGluZGV4ZXMgcmVtb3ZlZFxuICAgKi9cbiAgc3RhdGljIHRvR2VuZXJpY1BvaW50ZXIoaW5kZXhlZFBvaW50ZXIsIGFycmF5TWFwID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKSkge1xuICAgIGlmICh0aGlzLmlzSnNvblBvaW50ZXIoaW5kZXhlZFBvaW50ZXIpICYmIGlzTWFwKGFycmF5TWFwKSkge1xuICAgICAgbGV0IHBvaW50ZXJBcnJheSA9IHRoaXMucGFyc2UoaW5kZXhlZFBvaW50ZXIpO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2ludGVyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3ViUG9pbnRlciA9IHRoaXMuY29tcGlsZShwb2ludGVyQXJyYXkuc2xpY2UoMCwgaSkpO1xuICAgICAgICBpZiAoYXJyYXlNYXAuaGFzKHN1YlBvaW50ZXIpICYmXG4gICAgICAgICAgYXJyYXlNYXAuZ2V0KHN1YlBvaW50ZXIpIDw9ICtwb2ludGVyQXJyYXlbaV1cbiAgICAgICAgKSB7XG4gICAgICAgICAgcG9pbnRlckFycmF5W2ldID0gJy0nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jb21waWxlKHBvaW50ZXJBcnJheSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKGluZGV4ZWRQb2ludGVyKSkge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9HZW5lcmljUG9pbnRlciBlcnJvcjogaW52YWxpZCBKU09OIFBvaW50ZXI6ICR7aW5kZXhlZFBvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmICghaXNNYXAoYXJyYXlNYXApKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGB0b0dlbmVyaWNQb2ludGVyIGVycm9yOiBpbnZhbGlkIGFycmF5TWFwOiAke2FycmF5TWFwfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAndG9Db250cm9sUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhIEpTT04gUG9pbnRlciBmb3IgYSBkYXRhIG9iamVjdCBhbmQgcmV0dXJucyBhIEpTT04gUG9pbnRlciBmb3IgdGhlXG4gICAqIG1hdGNoaW5nIGNvbnRyb2wgaW4gYW4gQW5ndWxhciBGb3JtR3JvdXAuXG4gICAqXG4gICAqIC8vICB7IFBvaW50ZXIgfSBkYXRhUG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KSB0byBhIGRhdGEgb2JqZWN0XG4gICAqIC8vICB7IEZvcm1Hcm91cCB9IGZvcm1Hcm91cCAtIEFuZ3VsYXIgRm9ybUdyb3VwIHRvIGdldCB2YWx1ZSBmcm9tXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGNvbnRyb2xNdXN0RXhpc3QgLSBPbmx5IHJldHVybiBpZiBjb250cm9sIGV4aXN0cz9cbiAgICogLy8geyBQb2ludGVyIH0gLSBKU09OIFBvaW50ZXIgKHN0cmluZykgdG8gdGhlIGZvcm1Hcm91cCBvYmplY3RcbiAgICovXG4gIHN0YXRpYyB0b0NvbnRyb2xQb2ludGVyKGRhdGFQb2ludGVyLCBmb3JtR3JvdXAsIGNvbnRyb2xNdXN0RXhpc3QgPSBmYWxzZSkge1xuICAgIGNvbnN0IGRhdGFQb2ludGVyQXJyYXkgPSB0aGlzLnBhcnNlKGRhdGFQb2ludGVyKTtcbiAgICBsZXQgY29udHJvbFBvaW50ZXJBcnJheTogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgc3ViR3JvdXAgPSBmb3JtR3JvdXA7XG4gICAgaWYgKGRhdGFQb2ludGVyQXJyYXkgIT09IG51bGwpIHtcbiAgICAgIGZvciAobGV0IGtleSBvZiBkYXRhUG9pbnRlckFycmF5KSB7XG4gICAgICAgIGlmIChoYXNPd24oc3ViR3JvdXAsICdjb250cm9scycpKSB7XG4gICAgICAgICAgY29udHJvbFBvaW50ZXJBcnJheS5wdXNoKCdjb250cm9scycpO1xuICAgICAgICAgIHN1Ykdyb3VwID0gc3ViR3JvdXAuY29udHJvbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXkoc3ViR3JvdXApICYmIChrZXkgPT09ICctJykpIHtcbiAgICAgICAgICBjb250cm9sUG9pbnRlckFycmF5LnB1c2goKHN1Ykdyb3VwLmxlbmd0aCAtIDEpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIHN1Ykdyb3VwID0gc3ViR3JvdXBbc3ViR3JvdXAubGVuZ3RoIC0gMV07XG4gICAgICAgIH0gZWxzZSBpZiAoaGFzT3duKHN1Ykdyb3VwLCBrZXkpKSB7XG4gICAgICAgICAgY29udHJvbFBvaW50ZXJBcnJheS5wdXNoKGtleSk7XG4gICAgICAgICAgc3ViR3JvdXAgPSBzdWJHcm91cFtrZXldO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnRyb2xNdXN0RXhpc3QpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGB0b0NvbnRyb2xQb2ludGVyIGVycm9yOiBVbmFibGUgdG8gZmluZCBcIiR7a2V5fVwiIGl0ZW0gaW4gRm9ybUdyb3VwLmApO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZGF0YVBvaW50ZXIpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybUdyb3VwKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udHJvbFBvaW50ZXJBcnJheS5wdXNoKGtleSk7XG4gICAgICAgICAgc3ViR3JvdXAgPSB7IGNvbnRyb2xzOiB7fSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jb21waWxlKGNvbnRyb2xQb2ludGVyQXJyYXkpO1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKGB0b0NvbnRyb2xQb2ludGVyIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtkYXRhUG9pbnRlcn1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAndG9TY2hlbWFQb2ludGVyJyBmdW5jdGlvblxuICAgKlxuICAgKiBBY2NlcHRzIGEgSlNPTiBQb2ludGVyIHRvIGEgdmFsdWUgaW5zaWRlIGEgZGF0YSBvYmplY3QgYW5kIGEgSlNPTiBzY2hlbWFcbiAgICogZm9yIHRoYXQgb2JqZWN0LlxuICAgKlxuICAgKiBSZXR1cm5zIGEgUG9pbnRlciB0byB0aGUgc3ViLXNjaGVtYSBmb3IgdGhlIHZhbHVlIGluc2lkZSB0aGUgb2JqZWN0J3Mgc2NoZW1hLlxuICAgKlxuICAgKiAvLyAgeyBQb2ludGVyIH0gZGF0YVBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSkgdG8gYW4gb2JqZWN0XG4gICAqIC8vICAgc2NoZW1hIC0gSlNPTiBzY2hlbWEgZm9yIHRoZSBvYmplY3RcbiAgICogLy8geyBQb2ludGVyIH0gLSBKU09OIFBvaW50ZXIgKHN0cmluZykgdG8gdGhlIG9iamVjdCdzIHNjaGVtYVxuICAgKi9cbiAgc3RhdGljIHRvU2NoZW1hUG9pbnRlcihkYXRhUG9pbnRlciwgc2NoZW1hKSB7XG4gICAgaWYgKHRoaXMuaXNKc29uUG9pbnRlcihkYXRhUG9pbnRlcikgJiYgdHlwZW9mIHNjaGVtYSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IHBvaW50ZXJBcnJheSA9IHRoaXMucGFyc2UoZGF0YVBvaW50ZXIpO1xuICAgICAgaWYgKCFwb2ludGVyQXJyYXkubGVuZ3RoKSB7IHJldHVybiAnJzsgfVxuICAgICAgY29uc3QgZmlyc3RLZXkgPSBwb2ludGVyQXJyYXkuc2hpZnQoKTtcbiAgICAgIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcgfHwgc2NoZW1hLnByb3BlcnRpZXMgfHwgc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmICgoc2NoZW1hLnByb3BlcnRpZXMgfHwge30pW2ZpcnN0S2V5XSkge1xuICAgICAgICAgIHJldHVybiBgL3Byb3BlcnRpZXMvJHt0aGlzLmVzY2FwZShmaXJzdEtleSl9YCArXG4gICAgICAgICAgICB0aGlzLnRvU2NoZW1hUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYS5wcm9wZXJ0aWVzW2ZpcnN0S2V5XSk7XG4gICAgICAgIH0gZWxzZSAgaWYgKHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcykge1xuICAgICAgICAgIHJldHVybiAnL2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyArXG4gICAgICAgICAgICB0aGlzLnRvU2NoZW1hUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgoc2NoZW1hLnR5cGUgPT09ICdhcnJheScgfHwgc2NoZW1hLml0ZW1zKSAmJlxuICAgICAgICAoaXNOdW1iZXIoZmlyc3RLZXkpIHx8IGZpcnN0S2V5ID09PSAnLScgfHwgZmlyc3RLZXkgPT09ICcnKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGFycmF5SXRlbSA9IGZpcnN0S2V5ID09PSAnLScgfHwgZmlyc3RLZXkgPT09ICcnID8gMCA6ICtmaXJzdEtleTtcbiAgICAgICAgaWYgKGlzQXJyYXkoc2NoZW1hLml0ZW1zKSkge1xuICAgICAgICAgIGlmIChhcnJheUl0ZW0gPCBzY2hlbWEuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJy9pdGVtcy8nICsgYXJyYXlJdGVtICtcbiAgICAgICAgICAgICAgdGhpcy50b1NjaGVtYVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWEuaXRlbXNbYXJyYXlJdGVtXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gJy9hZGRpdGlvbmFsSXRlbXMnICtcbiAgICAgICAgICAgICAgdGhpcy50b1NjaGVtYVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qoc2NoZW1hLml0ZW1zKSkge1xuICAgICAgICAgIHJldHVybiAnL2l0ZW1zJyArIHRoaXMudG9TY2hlbWFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hLml0ZW1zKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKSkge1xuICAgICAgICAgIHJldHVybiAnL2FkZGl0aW9uYWxJdGVtcycgK1xuICAgICAgICAgICAgdGhpcy50b1NjaGVtYVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5lcnJvcihgdG9TY2hlbWFQb2ludGVyIGVycm9yOiBEYXRhIHBvaW50ZXIgJHtkYXRhUG9pbnRlcn0gYCArXG4gICAgICAgIGBub3QgY29tcGF0aWJsZSB3aXRoIHNjaGVtYSAke3NjaGVtYX1gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihkYXRhUG9pbnRlcikpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYHRvU2NoZW1hUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7ZGF0YVBvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc2NoZW1hICE9PSAnb2JqZWN0Jykge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9TY2hlbWFQb2ludGVyIGVycm9yOiBJbnZhbGlkIEpTT04gU2NoZW1hOiAke3NjaGVtYX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogJ3RvRGF0YVBvaW50ZXInIGZ1bmN0aW9uXG4gICAqXG4gICAqIEFjY2VwdHMgYSBKU09OIFBvaW50ZXIgdG8gYSBzdWItc2NoZW1hIGluc2lkZSBhIEpTT04gc2NoZW1hIGFuZCB0aGUgc2NoZW1hLlxuICAgKlxuICAgKiBJZiBwb3NzaWJsZSwgcmV0dXJucyBhIGdlbmVyaWMgUG9pbnRlciB0byB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSBpbnNpZGVcbiAgICogdGhlIGRhdGEgb2JqZWN0IGRlc2NyaWJlZCBieSB0aGUgSlNPTiBzY2hlbWEuXG4gICAqXG4gICAqIFJldHVybnMgbnVsbCBpZiB0aGUgc3ViLXNjaGVtYSBpcyBpbiBhbiBhbWJpZ3VvdXMgbG9jYXRpb24gKHN1Y2ggYXNcbiAgICogZGVmaW5pdGlvbnMgb3IgYWRkaXRpb25hbFByb3BlcnRpZXMpIHdoZXJlIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlXG4gICAqIGxvY2F0aW9uIGNhbm5vdCBiZSBkZXRlcm1pbmVkLlxuICAgKlxuICAgKiAvLyAgeyBQb2ludGVyIH0gc2NoZW1hUG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KSB0byBhIEpTT04gc2NoZW1hXG4gICAqIC8vICAgc2NoZW1hIC0gdGhlIEpTT04gc2NoZW1hXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3JzP1xuICAgKiAvLyB7IFBvaW50ZXIgfSAtIEpTT04gUG9pbnRlciAoc3RyaW5nKSB0byB0aGUgdmFsdWUgaW4gdGhlIGRhdGEgb2JqZWN0XG4gICAqL1xuICBzdGF0aWMgdG9EYXRhUG9pbnRlcihzY2hlbWFQb2ludGVyLCBzY2hlbWEsIGVycm9ycyA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuaXNKc29uUG9pbnRlcihzY2hlbWFQb2ludGVyKSAmJiB0eXBlb2Ygc2NoZW1hID09PSAnb2JqZWN0JyAmJlxuICAgICAgdGhpcy5oYXMoc2NoZW1hLCBzY2hlbWFQb2ludGVyKVxuICAgICkge1xuICAgICAgY29uc3QgcG9pbnRlckFycmF5ID0gdGhpcy5wYXJzZShzY2hlbWFQb2ludGVyKTtcbiAgICAgIGlmICghcG9pbnRlckFycmF5Lmxlbmd0aCkgeyByZXR1cm4gJyc7IH1cbiAgICAgIGxldCBkYXRhUG9pbnRlciA9ICcnO1xuICAgICAgY29uc3QgZmlyc3RLZXkgPSBwb2ludGVyQXJyYXkuc2hpZnQoKTtcbiAgICAgIGlmIChmaXJzdEtleSA9PT0gJ3Byb3BlcnRpZXMnIHx8XG4gICAgICAgIChmaXJzdEtleSA9PT0gJ2l0ZW1zJyAmJiBpc0FycmF5KHNjaGVtYS5pdGVtcykpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qgc2Vjb25kS2V5ID0gcG9pbnRlckFycmF5LnNoaWZ0KCk7XG4gICAgICAgIGNvbnN0IHBvaW50ZXJTdWZmaXggPSB0aGlzLnRvRGF0YVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWFbZmlyc3RLZXldW3NlY29uZEtleV0pO1xuICAgICAgICByZXR1cm4gcG9pbnRlclN1ZmZpeCA9PT0gbnVsbCA/IG51bGwgOiAnLycgKyBzZWNvbmRLZXkgKyBwb2ludGVyU3VmZml4O1xuICAgICAgfSBlbHNlIGlmIChmaXJzdEtleSA9PT0gJ2FkZGl0aW9uYWxJdGVtcycgfHxcbiAgICAgICAgKGZpcnN0S2V5ID09PSAnaXRlbXMnICYmIGlzT2JqZWN0KHNjaGVtYS5pdGVtcykpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgcG9pbnRlclN1ZmZpeCA9IHRoaXMudG9EYXRhUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYVtmaXJzdEtleV0pO1xuICAgICAgICByZXR1cm4gcG9pbnRlclN1ZmZpeCA9PT0gbnVsbCA/IG51bGwgOiAnLy0nICsgcG9pbnRlclN1ZmZpeDtcbiAgICAgIH0gZWxzZSBpZiAoWydhbGxPZicsICdhbnlPZicsICdvbmVPZiddLmluY2x1ZGVzKGZpcnN0S2V5KSkge1xuICAgICAgICBjb25zdCBzZWNvbmRLZXkgPSBwb2ludGVyQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9EYXRhUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYVtmaXJzdEtleV1bc2Vjb25kS2V5XSk7XG4gICAgICB9IGVsc2UgaWYgKGZpcnN0S2V5ID09PSAnbm90Jykge1xuICAgICAgICByZXR1cm4gdGhpcy50b0RhdGFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hW2ZpcnN0S2V5XSk7XG4gICAgICB9IGVsc2UgaWYgKFsnY29udGFpbnMnLCAnZGVmaW5pdGlvbnMnLCAnZGVwZW5kZW5jaWVzJywgJ2FkZGl0aW9uYWxJdGVtcycsXG4gICAgICAgICdhZGRpdGlvbmFsUHJvcGVydGllcycsICdwYXR0ZXJuUHJvcGVydGllcycsICdwcm9wZXJ0eU5hbWVzJ10uaW5jbHVkZXMoZmlyc3RLZXkpXG4gICAgICApIHtcbiAgICAgICAgaWYgKGVycm9ycykgeyBjb25zb2xlLmVycm9yKGB0b0RhdGFQb2ludGVyIGVycm9yOiBBbWJpZ3VvdXMgbG9jYXRpb25gKTsgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAoZXJyb3JzKSB7XG4gICAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihzY2hlbWFQb2ludGVyKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGB0b0RhdGFQb2ludGVyIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtzY2hlbWFQb2ludGVyfWApO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBzY2hlbWEgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYHRvRGF0YVBvaW50ZXIgZXJyb3I6IEludmFsaWQgSlNPTiBTY2hlbWE6ICR7c2NoZW1hfWApO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBzY2hlbWEgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYHRvRGF0YVBvaW50ZXIgZXJyb3I6IFBvaW50ZXIgJHtzY2hlbWFQb2ludGVyfSBpbnZhbGlkIGZvciBTY2hlbWE6ICR7c2NoZW1hfWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAncGFyc2VPYmplY3RQYXRoJyBmdW5jdGlvblxuICAgKlxuICAgKiBQYXJzZXMgYSBKYXZhU2NyaXB0IG9iamVjdCBwYXRoIGludG8gYW4gYXJyYXkgb2Yga2V5cywgd2hpY2hcbiAgICogY2FuIHRoZW4gYmUgcGFzc2VkIHRvIGNvbXBpbGUoKSB0byBjb252ZXJ0IGludG8gYSBzdHJpbmcgSlNPTiBQb2ludGVyLlxuICAgKlxuICAgKiBCYXNlZCBvbiBtaWtlLW1hcmNhY2NpJ3MgZXhjZWxsZW50IG9iamVjdHBhdGggcGFyc2UgZnVuY3Rpb246XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWtlLW1hcmNhY2NpL29iamVjdHBhdGhcbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IHBhdGggLSBUaGUgb2JqZWN0IHBhdGggdG8gcGFyc2VcbiAgICogLy8geyBzdHJpbmdbXSB9IC0gVGhlIHJlc3VsdGluZyBhcnJheSBvZiBrZXlzXG4gICAqL1xuICBzdGF0aWMgcGFyc2VPYmplY3RQYXRoKHBhdGgpIHtcbiAgICBpZiAoaXNBcnJheShwYXRoKSkgeyByZXR1cm4gPHN0cmluZ1tdPnBhdGg7IH1cbiAgICBpZiAodGhpcy5pc0pzb25Qb2ludGVyKHBhdGgpKSB7IHJldHVybiB0aGlzLnBhcnNlKHBhdGgpOyB9XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGxldCBwYXJ0czogc3RyaW5nW10gPSBbXTtcbiAgICAgIHdoaWxlIChpbmRleCA8IHBhdGgubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IG5leHREb3QgPSBwYXRoLmluZGV4T2YoJy4nLCBpbmRleCk7XG4gICAgICAgIGNvbnN0IG5leHRPQiA9IHBhdGguaW5kZXhPZignWycsIGluZGV4KTsgLy8gbmV4dCBvcGVuIGJyYWNrZXRcbiAgICAgICAgaWYgKG5leHREb3QgPT09IC0xICYmIG5leHRPQiA9PT0gLTEpIHsgLy8gbGFzdCBpdGVtXG4gICAgICAgICAgcGFydHMucHVzaChwYXRoLnNsaWNlKGluZGV4KSk7XG4gICAgICAgICAgaW5kZXggPSBwYXRoLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0RG90ICE9PSAtMSAmJiAobmV4dERvdCA8IG5leHRPQiB8fCBuZXh0T0IgPT09IC0xKSkgeyAvLyBkb3Qgbm90YXRpb25cbiAgICAgICAgICBwYXJ0cy5wdXNoKHBhdGguc2xpY2UoaW5kZXgsIG5leHREb3QpKTtcbiAgICAgICAgICBpbmRleCA9IG5leHREb3QgKyAxO1xuICAgICAgICB9IGVsc2UgeyAvLyBicmFja2V0IG5vdGF0aW9uXG4gICAgICAgICAgaWYgKG5leHRPQiA+IGluZGV4KSB7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKHBhdGguc2xpY2UoaW5kZXgsIG5leHRPQikpO1xuICAgICAgICAgICAgaW5kZXggPSBuZXh0T0I7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHF1b3RlID0gcGF0aC5jaGFyQXQobmV4dE9CICsgMSk7XG4gICAgICAgICAgaWYgKHF1b3RlID09PSAnXCInIHx8IHF1b3RlID09PSBcIidcIikgeyAvLyBlbmNsb3NpbmcgcXVvdGVzXG4gICAgICAgICAgICBsZXQgbmV4dENCID0gcGF0aC5pbmRleE9mKHF1b3RlICsgJ10nLCBuZXh0T0IpOyAvLyBuZXh0IGNsb3NlIGJyYWNrZXRcbiAgICAgICAgICAgIHdoaWxlIChuZXh0Q0IgIT09IC0xICYmIHBhdGguY2hhckF0KG5leHRDQiAtIDEpID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgbmV4dENCID0gcGF0aC5pbmRleE9mKHF1b3RlICsgJ10nLCBuZXh0Q0IgKyAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXh0Q0IgPT09IC0xKSB7IG5leHRDQiA9IHBhdGgubGVuZ3RoOyB9XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKHBhdGguc2xpY2UoaW5kZXggKyAyLCBuZXh0Q0IpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwnICsgcXVvdGUsICdnJyksIHF1b3RlKSk7XG4gICAgICAgICAgICBpbmRleCA9IG5leHRDQiArIDI7XG4gICAgICAgICAgfSBlbHNlIHsgLy8gbm8gZW5jbG9zaW5nIHF1b3Rlc1xuICAgICAgICAgICAgbGV0IG5leHRDQiA9IHBhdGguaW5kZXhPZignXScsIG5leHRPQik7IC8vIG5leHQgY2xvc2UgYnJhY2tldFxuICAgICAgICAgICAgaWYgKG5leHRDQiA9PT0gLTEpIHsgbmV4dENCID0gcGF0aC5sZW5ndGg7IH1cbiAgICAgICAgICAgIHBhcnRzLnB1c2gocGF0aC5zbGljZShpbmRleCArIDEsIG5leHRDQikpO1xuICAgICAgICAgICAgaW5kZXggPSBuZXh0Q0IgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGF0aC5jaGFyQXQoaW5kZXgpID09PSAnLicpIHsgaW5kZXgrKzsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFydHM7XG4gICAgfVxuICAgIGNvbnNvbGUuZXJyb3IoJ3BhcnNlT2JqZWN0UGF0aCBlcnJvcjogSW5wdXQgb2JqZWN0IHBhdGggbXVzdCBiZSBhIHN0cmluZy4nKTtcbiAgfVxufVxuIl19