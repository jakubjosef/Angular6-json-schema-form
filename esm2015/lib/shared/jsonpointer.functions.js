/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { isDefined, isEmpty, isObject, isArray, isMap, isNumber, isString } from './validator.functions';
import { hasOwn, copy } from './utility.functions';
/** @typedef {?} */
var Pointer;
export { Pointer };
export class JsonPointer {
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
    static get(object, pointer, startSlice = 0, endSlice = null, getBoolean = false, errors = false) {
        if (object === null) {
            return getBoolean ? false : undefined;
        }
        /** @type {?} */
        let keyArray = this.parse(pointer, errors);
        if (typeof object === 'object' && keyArray !== null) {
            /** @type {?} */
            let subObject = object;
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
            for (let key of keyArray) {
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
                        console.error(`get error: "${key}" key not found in object.`);
                        console.error(pointer);
                        console.error(object);
                    }
                    return getBoolean ? false : undefined;
                }
            }
            return getBoolean ? true : subObject;
        }
        if (errors && keyArray === null) {
            console.error(`get error: Invalid JSON Pointer: ${pointer}`);
        }
        if (errors && typeof object !== 'object') {
            console.error('get error: Invalid object:');
            console.error(object);
        }
        return getBoolean ? false : undefined;
    }
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
    static getCopy(object, pointer, startSlice = 0, endSlice = null, getBoolean = false, errors = false) {
        /** @type {?} */
        const objectToCopy = this.get(object, pointer, startSlice, endSlice, getBoolean, errors);
        return this.forEachDeepCopy(objectToCopy);
    }
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
    static getFirst(items, defaultValue = null, getCopy = false) {
        if (isEmpty(items)) {
            return;
        }
        if (isArray(items)) {
            for (let item of items) {
                if (isEmpty(item)) {
                    continue;
                }
                if (isArray(item) && item.length >= 2) {
                    if (isEmpty(item[0]) || isEmpty(item[1])) {
                        continue;
                    }
                    /** @type {?} */
                    const value = getCopy ?
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
            return defaultValue;
        }
        if (isMap(items)) {
            for (let [object, pointer] of items) {
                if (object === null || !this.isJsonPointer(pointer)) {
                    continue;
                }
                /** @type {?} */
                const value = getCopy ?
                    this.getCopy(object, pointer) :
                    this.get(object, pointer);
                if (value) {
                    return value;
                }
            }
            return defaultValue;
        }
        console.error('getFirst error: Input not in correct format.\n' +
            'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
        return defaultValue;
    }
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
    static getFirstCopy(items, defaultValue = null) {
        /** @type {?} */
        const firstCopy = this.getFirst(items, defaultValue, true);
        return firstCopy;
    }
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
    static set(object, pointer, value, insert = false) {
        /** @type {?} */
        const keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            /** @type {?} */
            let subObject = object;
            for (let i = 0; i < keyArray.length - 1; ++i) {
                /** @type {?} */
                let key = keyArray[i];
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
            let lastKey = keyArray[keyArray.length - 1];
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
        console.error(`set error: Invalid JSON Pointer: ${pointer}`);
        return object;
    }
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
    static setCopy(object, pointer, value, insert = false) {
        /** @type {?} */
        const keyArray = this.parse(pointer);
        if (keyArray !== null) {
            /** @type {?} */
            let newObject = copy(object);
            /** @type {?} */
            let subObject = newObject;
            for (let i = 0; i < keyArray.length - 1; ++i) {
                /** @type {?} */
                let key = keyArray[i];
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
            let lastKey = keyArray[keyArray.length - 1];
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
        console.error(`setCopy error: Invalid JSON Pointer: ${pointer}`);
        return object;
    }
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
    static insert(object, pointer, value) {
        /** @type {?} */
        const updatedObject = this.set(object, pointer, value, true);
        return updatedObject;
    }
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
    static insertCopy(object, pointer, value) {
        /** @type {?} */
        const updatedObject = this.setCopy(object, pointer, value, true);
        return updatedObject;
    }
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
    static remove(object, pointer) {
        /** @type {?} */
        let keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            /** @type {?} */
            let lastKey = keyArray.pop();
            /** @type {?} */
            let parentObject = this.get(object, keyArray);
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
        console.error(`remove error: Invalid JSON Pointer: ${pointer}`);
        return object;
    }
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
    static has(object, pointer) {
        /** @type {?} */
        const hasValue = this.get(object, pointer, 0, null, true);
        return hasValue;
    }
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
    static dict(object) {
        /** @type {?} */
        let results = {};
        this.forEachDeep(object, (value, pointer) => {
            if (typeof value !== 'object') {
                results[pointer] = value;
            }
        });
        return results;
    }
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
    static forEachDeep(object, fn = (v) => v, bottomUp = false, pointer = '', rootObject = object) {
        if (typeof fn !== 'function') {
            console.error(`forEachDeep error: Iterator is not a function:`, fn);
            return;
        }
        if (!bottomUp) {
            fn(object, pointer, rootObject);
        }
        if (isObject(object) || isArray(object)) {
            for (let key of Object.keys(object)) {
                /** @type {?} */
                const newPointer = pointer + '/' + this.escape(key);
                this.forEachDeep(object[key], fn, bottomUp, newPointer, rootObject);
            }
        }
        if (bottomUp) {
            fn(object, pointer, rootObject);
        }
    }
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
    static forEachDeepCopy(object, fn = (v) => v, bottomUp = false, pointer = '', rootObject = object) {
        if (typeof fn !== 'function') {
            console.error(`forEachDeepCopy error: Iterator is not a function:`, fn);
            return null;
        }
        if (isObject(object) || isArray(object)) {
            /** @type {?} */
            let newObject = isArray(object) ? [...object] : Object.assign({}, object);
            if (!bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            for (let key of Object.keys(newObject)) {
                /** @type {?} */
                const newPointer = pointer + '/' + this.escape(key);
                newObject[key] = this.forEachDeepCopy(newObject[key], fn, bottomUp, newPointer, rootObject);
            }
            if (bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            return newObject;
        }
        else {
            return fn(object, pointer, rootObject);
        }
    }
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
    static escape(key) {
        /** @type {?} */
        const escaped = key.toString().replace(/~/g, '~0').replace(/\//g, '~1');
        return escaped;
    }
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
    static unescape(key) {
        /** @type {?} */
        const unescaped = key.toString().replace(/~1/g, '/').replace(/~0/g, '~');
        return unescaped;
    }
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
    static parse(pointer, errors = false) {
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error(`parse error: Invalid JSON Pointer: ${pointer}`);
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
    }
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
    static compile(pointer, defaultValue = '', errors = false) {
        if (pointer === '#') {
            return '';
        }
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error(`compile error: Invalid JSON Pointer: ${pointer}`);
            }
            return null;
        }
        if (isArray(pointer)) {
            if ((/** @type {?} */ (pointer)).length === 0) {
                return '';
            }
            return '/' + (/** @type {?} */ (pointer)).map(key => key === '' ? defaultValue : this.escape(key)).join('/');
        }
        if (typeof pointer === 'string') {
            if (pointer[0] === '#') {
                pointer = pointer.slice(1);
            }
            return pointer;
        }
    }
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
    static toKey(pointer, errors = false) {
        /** @type {?} */
        let keyArray = this.parse(pointer, errors);
        if (keyArray === null) {
            return null;
        }
        if (!keyArray.length) {
            return '';
        }
        return keyArray[keyArray.length - 1];
    }
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
    static isJsonPointer(value) {
        if (isArray(value)) {
            return value.every(key => typeof key === 'string');
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
    }
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
    static isSubPointer(shortPointer, longPointer, trueIfMatching = false, errors = false) {
        if (!this.isJsonPointer(shortPointer) || !this.isJsonPointer(longPointer)) {
            if (errors) {
                /** @type {?} */
                let invalid = '';
                if (!this.isJsonPointer(shortPointer)) {
                    invalid += ` 1: ${shortPointer}`;
                }
                if (!this.isJsonPointer(longPointer)) {
                    invalid += ` 2: ${longPointer}`;
                }
                console.error(`isSubPointer error: Invalid JSON Pointer ${invalid}`);
            }
            return;
        }
        shortPointer = this.compile(shortPointer, '', errors);
        longPointer = this.compile(longPointer, '', errors);
        return shortPointer === longPointer ? trueIfMatching :
            `${shortPointer}/` === longPointer.slice(0, shortPointer.length + 1);
    }
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
    static toIndexedPointer(genericPointer, indexArray, arrayMap = null) {
        if (this.isJsonPointer(genericPointer) && isArray(indexArray)) {
            /** @type {?} */
            let indexedPointer = this.compile(genericPointer);
            if (isMap(arrayMap)) {
                /** @type {?} */
                let arrayIndex = 0;
                return indexedPointer.replace(/\/\-(?=\/|$)/g, (key, stringIndex) => arrayMap.has((/** @type {?} */ (indexedPointer)).slice(0, stringIndex)) ?
                    '/' + indexArray[arrayIndex++] : key);
            }
            else {
                for (let pointerIndex of indexArray) {
                    indexedPointer = indexedPointer.replace('/-', '/' + pointerIndex);
                }
                return indexedPointer;
            }
        }
        if (!this.isJsonPointer(genericPointer)) {
            console.error(`toIndexedPointer error: Invalid JSON Pointer: ${genericPointer}`);
        }
        if (!isArray(indexArray)) {
            console.error(`toIndexedPointer error: Invalid indexArray: ${indexArray}`);
        }
    }
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
     * @param {?} indexedPointer
     * @param {?=} arrayMap
     * @return {?}
     */
    static toGenericPointer(indexedPointer, arrayMap = new Map()) {
        if (this.isJsonPointer(indexedPointer) && isMap(arrayMap)) {
            /** @type {?} */
            let pointerArray = this.parse(indexedPointer);
            for (let i = 1; i < pointerArray.length; i++) {
                /** @type {?} */
                const subPointer = this.compile(pointerArray.slice(0, i));
                if (arrayMap.has(subPointer) &&
                    arrayMap.get(subPointer) <= +pointerArray[i]) {
                    pointerArray[i] = '-';
                }
            }
            return this.compile(pointerArray);
        }
        if (!this.isJsonPointer(indexedPointer)) {
            console.error(`toGenericPointer error: invalid JSON Pointer: ${indexedPointer}`);
        }
        if (!isMap(arrayMap)) {
            console.error(`toGenericPointer error: invalid arrayMap: ${arrayMap}`);
        }
    }
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
    static toControlPointer(dataPointer, formGroup, controlMustExist = false) {
        /** @type {?} */
        const dataPointerArray = this.parse(dataPointer);
        /** @type {?} */
        let controlPointerArray = [];
        /** @type {?} */
        let subGroup = formGroup;
        if (dataPointerArray !== null) {
            for (let key of dataPointerArray) {
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
                    console.error(`toControlPointer error: Unable to find "${key}" item in FormGroup.`);
                    console.error(dataPointer);
                    console.error(formGroup);
                    return;
                }
                else {
                    controlPointerArray.push(key);
                    subGroup = { controls: {} };
                }
            }
            return this.compile(controlPointerArray);
        }
        console.error(`toControlPointer error: Invalid JSON Pointer: ${dataPointer}`);
    }
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
    static toSchemaPointer(dataPointer, schema) {
        if (this.isJsonPointer(dataPointer) && typeof schema === 'object') {
            /** @type {?} */
            const pointerArray = this.parse(dataPointer);
            if (!pointerArray.length) {
                return '';
            }
            /** @type {?} */
            const firstKey = pointerArray.shift();
            if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
                if ((schema.properties || {})[firstKey]) {
                    return `/properties/${this.escape(firstKey)}` +
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
                const arrayItem = firstKey === '-' || firstKey === '' ? 0 : +firstKey;
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
            console.error(`toSchemaPointer error: Data pointer ${dataPointer} ` +
                `not compatible with schema ${schema}`);
            return null;
        }
        if (!this.isJsonPointer(dataPointer)) {
            console.error(`toSchemaPointer error: Invalid JSON Pointer: ${dataPointer}`);
        }
        if (typeof schema !== 'object') {
            console.error(`toSchemaPointer error: Invalid JSON Schema: ${schema}`);
        }
        return null;
    }
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
    static toDataPointer(schemaPointer, schema, errors = false) {
        if (this.isJsonPointer(schemaPointer) && typeof schema === 'object' &&
            this.has(schema, schemaPointer)) {
            /** @type {?} */
            const pointerArray = this.parse(schemaPointer);
            if (!pointerArray.length) {
                return '';
            }
            /** @type {?} */
            let dataPointer = '';
            /** @type {?} */
            const firstKey = pointerArray.shift();
            if (firstKey === 'properties' ||
                (firstKey === 'items' && isArray(schema.items))) {
                /** @type {?} */
                const secondKey = pointerArray.shift();
                /** @type {?} */
                const pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
                return pointerSuffix === null ? null : '/' + secondKey + pointerSuffix;
            }
            else if (firstKey === 'additionalItems' ||
                (firstKey === 'items' && isObject(schema.items))) {
                /** @type {?} */
                const pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey]);
                return pointerSuffix === null ? null : '/-' + pointerSuffix;
            }
            else if (['allOf', 'anyOf', 'oneOf'].includes(firstKey)) {
                /** @type {?} */
                const secondKey = pointerArray.shift();
                return this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
            }
            else if (firstKey === 'not') {
                return this.toDataPointer(pointerArray, schema[firstKey]);
            }
            else if (['contains', 'definitions', 'dependencies', 'additionalItems',
                'additionalProperties', 'patternProperties', 'propertyNames'].includes(firstKey)) {
                if (errors) {
                    console.error(`toDataPointer error: Ambiguous location`);
                }
            }
            return '';
        }
        if (errors) {
            if (!this.isJsonPointer(schemaPointer)) {
                console.error(`toDataPointer error: Invalid JSON Pointer: ${schemaPointer}`);
            }
            if (typeof schema !== 'object') {
                console.error(`toDataPointer error: Invalid JSON Schema: ${schema}`);
            }
            if (typeof schema !== 'object') {
                console.error(`toDataPointer error: Pointer ${schemaPointer} invalid for Schema: ${schema}`);
            }
        }
        return null;
    }
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
    static parseObjectPath(path) {
        if (isArray(path)) {
            return /** @type {?} */ (path);
        }
        if (this.isJsonPointer(path)) {
            return this.parse(path);
        }
        if (typeof path === 'string') {
            /** @type {?} */
            let index = 0;
            /** @type {?} */
            let parts = [];
            while (index < path.length) {
                /** @type {?} */
                const nextDot = path.indexOf('.', index);
                /** @type {?} */
                const nextOB = path.indexOf('[', index); // next open bracket
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
                    const quote = path.charAt(nextOB + 1);
                    if (quote === '"' || quote === "'") {
                        /** @type {?} */
                        let nextCB = path.indexOf(quote + ']', nextOB); // next close bracket
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
                        let nextCB = path.indexOf(']', nextOB); // next close bracket
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
    }
}
JsonPointer.decorators = [
    { type: Injectable },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBvaW50ZXIuZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvanNvbnBvaW50ZXIuZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFDTCxTQUFTLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQ2pFLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7OztBQW1CbkQsTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZUosTUFBTSxDQUFDLEdBQUcsQ0FDUixNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsV0FBbUIsSUFBSSxFQUN4RCxVQUFVLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxLQUFLO1FBRWxDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7U0FBRTs7UUFDL0QsSUFBSSxRQUFRLEdBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDOztZQUNwRCxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENB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QUM7NEJBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7eUJBQUU7d0JBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzFDLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3FCQUNwQjtvQkFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQUMsS0FBSyxFQUFFLENBQUM7cUJBQUU7aUJBQzdDO2FBQ0Y7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUM7S0FDN0U7OztZQWoyQkYsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgaXNEZWZpbmVkLCBpc0VtcHR5LCBpc09iamVjdCwgaXNBcnJheSwgaXNNYXAsIGlzTnVtYmVyLCBpc1N0cmluZ1xufSBmcm9tICcuL3ZhbGlkYXRvci5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgaGFzT3duLCBjb3B5IH0gZnJvbSAnLi91dGlsaXR5LmZ1bmN0aW9ucyc7XG5cbi8qKlxuICogJ0pzb25Qb2ludGVyJyBjbGFzc1xuICpcbiAqIFNvbWUgdXRpbGl0aWVzIGZvciB1c2luZyBKU09OIFBvaW50ZXJzIHdpdGggSlNPTiBvYmplY3RzXG4gKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNjkwMVxuICpcbiAqIGdldCwgZ2V0Q29weSwgZ2V0Rmlyc3QsIHNldCwgc2V0Q29weSwgaW5zZXJ0LCBpbnNlcnRDb3B5LCByZW1vdmUsIGhhcywgZGljdCxcbiAqIGZvckVhY2hEZWVwLCBmb3JFYWNoRGVlcENvcHksIGVzY2FwZSwgdW5lc2NhcGUsIHBhcnNlLCBjb21waWxlLCB0b0tleSxcbiAqIGlzSnNvblBvaW50ZXIsIGlzU3ViUG9pbnRlciwgdG9JbmRleGVkUG9pbnRlciwgdG9HZW5lcmljUG9pbnRlcixcbiAqIHRvQ29udHJvbFBvaW50ZXIsIHRvU2NoZW1hUG9pbnRlciwgdG9EYXRhUG9pbnRlciwgcGFyc2VPYmplY3RQYXRoXG4gKlxuICogU29tZSBmdW5jdGlvbnMgYmFzZWQgb24gbWFudWVsc3RvZmVyJ3MganNvbi1wb2ludGVyIHV0aWxpdGllc1xuICogaHR0cHM6Ly9naXRodWIuY29tL21hbnVlbHN0b2Zlci9qc29uLXBvaW50ZXJcbiAqL1xuZXhwb3J0IHR5cGUgUG9pbnRlciA9IHN0cmluZyB8IHN0cmluZ1tdO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSnNvblBvaW50ZXIge1xuXG4gIC8qKlxuICAgKiAnZ2V0JyBmdW5jdGlvblxuICAgKlxuICAgKiBVc2VzIGEgSlNPTiBQb2ludGVyIHRvIHJldHJpZXZlIGEgdmFsdWUgZnJvbSBhbiBvYmplY3QuXG4gICAqXG4gICAqIC8vICB7IG9iamVjdCB9IG9iamVjdCAtIE9iamVjdCB0byBnZXQgdmFsdWUgZnJvbVxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyAgeyBudW1iZXIgPSAwIH0gc3RhcnRTbGljZSAtIFplcm8tYmFzZWQgaW5kZXggb2YgZmlyc3QgUG9pbnRlciBrZXkgdG8gdXNlXG4gICAqIC8vICB7IG51bWJlciB9IGVuZFNsaWNlIC0gWmVyby1iYXNlZCBpbmRleCBvZiBsYXN0IFBvaW50ZXIga2V5IHRvIHVzZVxuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSBnZXRCb29sZWFuIC0gUmV0dXJuIG9ubHkgdHJ1ZSBvciBmYWxzZT9cbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBub3QgZm91bmQ/XG4gICAqIC8vIHsgb2JqZWN0IH0gLSBMb2NhdGVkIHZhbHVlIChvciB0cnVlIG9yIGZhbHNlIGlmIGdldEJvb2xlYW4gPSB0cnVlKVxuICAgKi9cbiAgc3RhdGljIGdldChcbiAgICBvYmplY3QsIHBvaW50ZXIsIHN0YXJ0U2xpY2UgPSAwLCBlbmRTbGljZTogbnVtYmVyID0gbnVsbCxcbiAgICBnZXRCb29sZWFuID0gZmFsc2UsIGVycm9ycyA9IGZhbHNlXG4gICkge1xuICAgIGlmIChvYmplY3QgPT09IG51bGwpIHsgcmV0dXJuIGdldEJvb2xlYW4gPyBmYWxzZSA6IHVuZGVmaW5lZDsgfVxuICAgIGxldCBrZXlBcnJheTogYW55W10gPSB0aGlzLnBhcnNlKHBvaW50ZXIsIGVycm9ycyk7XG4gICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIGtleUFycmF5ICE9PSBudWxsKSB7XG4gICAgICBsZXQgc3ViT2JqZWN0ID0gb2JqZWN0O1xuICAgICAgaWYgKHN0YXJ0U2xpY2UgPj0ga2V5QXJyYXkubGVuZ3RoIHx8IGVuZFNsaWNlIDw9IC1rZXlBcnJheS5sZW5ndGgpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgICAgaWYgKHN0YXJ0U2xpY2UgPD0gLWtleUFycmF5Lmxlbmd0aCkgeyBzdGFydFNsaWNlID0gMDsgfVxuICAgICAgaWYgKCFpc0RlZmluZWQoZW5kU2xpY2UpIHx8IGVuZFNsaWNlID49IGtleUFycmF5Lmxlbmd0aCkgeyBlbmRTbGljZSA9IGtleUFycmF5Lmxlbmd0aDsgfVxuICAgICAga2V5QXJyYXkgPSBrZXlBcnJheS5zbGljZShzdGFydFNsaWNlLCBlbmRTbGljZSk7XG4gICAgICBmb3IgKGxldCBrZXkgb2Yga2V5QXJyYXkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJy0nICYmIGlzQXJyYXkoc3ViT2JqZWN0KSAmJiBzdWJPYmplY3QubGVuZ3RoKSB7XG4gICAgICAgICAga2V5ID0gc3ViT2JqZWN0Lmxlbmd0aCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTWFwKHN1Yk9iamVjdCkgJiYgc3ViT2JqZWN0LmhhcyhrZXkpKSB7XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0LmdldChrZXkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdWJPYmplY3QgPT09ICdvYmplY3QnICYmIHN1Yk9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgICAgIGhhc093bihzdWJPYmplY3QsIGtleSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0W2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgZ2V0IGVycm9yOiBcIiR7a2V5fVwiIGtleSBub3QgZm91bmQgaW4gb2JqZWN0LmApO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihwb2ludGVyKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iob2JqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGdldEJvb2xlYW4gPyBmYWxzZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGdldEJvb2xlYW4gPyB0cnVlIDogc3ViT2JqZWN0O1xuICAgIH1cbiAgICBpZiAoZXJyb3JzICYmIGtleUFycmF5ID09PSBudWxsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBnZXQgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmIChlcnJvcnMgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2dldCBlcnJvcjogSW52YWxpZCBvYmplY3Q6Jyk7XG4gICAgICBjb25zb2xlLmVycm9yKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBnZXRCb29sZWFuID8gZmFsc2UgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogJ2dldENvcHknIGZ1bmN0aW9uXG4gICAqXG4gICAqIFVzZXMgYSBKU09OIFBvaW50ZXIgdG8gZGVlcGx5IGNsb25lIGEgdmFsdWUgZnJvbSBhbiBvYmplY3QuXG4gICAqXG4gICAqIC8vICB7IG9iamVjdCB9IG9iamVjdCAtIE9iamVjdCB0byBnZXQgdmFsdWUgZnJvbVxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyAgeyBudW1iZXIgPSAwIH0gc3RhcnRTbGljZSAtIFplcm8tYmFzZWQgaW5kZXggb2YgZmlyc3QgUG9pbnRlciBrZXkgdG8gdXNlXG4gICAqIC8vICB7IG51bWJlciB9IGVuZFNsaWNlIC0gWmVyby1iYXNlZCBpbmRleCBvZiBsYXN0IFBvaW50ZXIga2V5IHRvIHVzZVxuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSBnZXRCb29sZWFuIC0gUmV0dXJuIG9ubHkgdHJ1ZSBvciBmYWxzZT9cbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBub3QgZm91bmQ/XG4gICAqIC8vIHsgb2JqZWN0IH0gLSBMb2NhdGVkIHZhbHVlIChvciB0cnVlIG9yIGZhbHNlIGlmIGdldEJvb2xlYW4gPSB0cnVlKVxuICAgKi9cbiAgc3RhdGljIGdldENvcHkoXG4gICAgb2JqZWN0LCBwb2ludGVyLCBzdGFydFNsaWNlID0gMCwgZW5kU2xpY2U6IG51bWJlciA9IG51bGwsXG4gICAgZ2V0Qm9vbGVhbiA9IGZhbHNlLCBlcnJvcnMgPSBmYWxzZVxuICApIHtcbiAgICBjb25zdCBvYmplY3RUb0NvcHkgPVxuICAgICAgdGhpcy5nZXQob2JqZWN0LCBwb2ludGVyLCBzdGFydFNsaWNlLCBlbmRTbGljZSwgZ2V0Qm9vbGVhbiwgZXJyb3JzKTtcbiAgICByZXR1cm4gdGhpcy5mb3JFYWNoRGVlcENvcHkob2JqZWN0VG9Db3B5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnZ2V0Rmlyc3QnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFRha2VzIGFuIGFycmF5IG9mIEpTT04gUG9pbnRlcnMgYW5kIG9iamVjdHMsXG4gICAqIGNoZWNrcyBlYWNoIG9iamVjdCBmb3IgYSB2YWx1ZSBzcGVjaWZpZWQgYnkgdGhlIHBvaW50ZXIsXG4gICAqIGFuZCByZXR1cm5zIHRoZSBmaXJzdCB2YWx1ZSBmb3VuZC5cbiAgICpcbiAgICogLy8gIHsgW29iamVjdCwgcG9pbnRlcl1bXSB9IGl0ZW1zIC0gQXJyYXkgb2Ygb2JqZWN0cyBhbmQgcG9pbnRlcnMgdG8gY2hlY2tcbiAgICogLy8gIHsgYW55ID0gbnVsbCB9IGRlZmF1bHRWYWx1ZSAtIFZhbHVlIHRvIHJldHVybiBpZiBub3RoaW5nIGZvdW5kXG4gICAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGdldENvcHkgLSBSZXR1cm4gYSBjb3B5IGluc3RlYWQ/XG4gICAqIC8vICAtIEZpcnN0IHZhbHVlIGZvdW5kXG4gICAqL1xuICBzdGF0aWMgZ2V0Rmlyc3QoaXRlbXMsIGRlZmF1bHRWYWx1ZTogYW55ID0gbnVsbCwgZ2V0Q29weSA9IGZhbHNlKSB7XG4gICAgaWYgKGlzRW1wdHkoaXRlbXMpKSB7IHJldHVybjsgfVxuICAgIGlmIChpc0FycmF5KGl0ZW1zKSkge1xuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICBpZiAoaXNFbXB0eShpdGVtKSkgeyBjb250aW51ZTsgfVxuICAgICAgICBpZiAoaXNBcnJheShpdGVtKSAmJiBpdGVtLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgaWYgKGlzRW1wdHkoaXRlbVswXSkgfHwgaXNFbXB0eShpdGVtWzFdKSkgeyBjb250aW51ZTsgfVxuICAgICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0Q29weSA/XG4gICAgICAgICAgICB0aGlzLmdldENvcHkoaXRlbVswXSwgaXRlbVsxXSkgOlxuICAgICAgICAgICAgdGhpcy5nZXQoaXRlbVswXSwgaXRlbVsxXSk7XG4gICAgICAgICAgaWYgKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dldEZpcnN0IGVycm9yOiBJbnB1dCBub3QgaW4gY29ycmVjdCBmb3JtYXQuXFxuJyArXG4gICAgICAgICAgJ1Nob3VsZCBiZTogWyBbIG9iamVjdDEsIHBvaW50ZXIxIF0sIFsgb2JqZWN0IDIsIHBvaW50ZXIyIF0sIGV0Yy4uLiBdJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIGlmIChpc01hcChpdGVtcykpIHtcbiAgICAgIGZvciAobGV0IFtvYmplY3QsIHBvaW50ZXJdIG9mIGl0ZW1zKSB7XG4gICAgICAgIGlmIChvYmplY3QgPT09IG51bGwgfHwgIXRoaXMuaXNKc29uUG9pbnRlcihwb2ludGVyKSkgeyBjb250aW51ZTsgfVxuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldENvcHkgP1xuICAgICAgICAgIHRoaXMuZ2V0Q29weShvYmplY3QsIHBvaW50ZXIpIDpcbiAgICAgICAgICB0aGlzLmdldChvYmplY3QsIHBvaW50ZXIpO1xuICAgICAgICBpZiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKCdnZXRGaXJzdCBlcnJvcjogSW5wdXQgbm90IGluIGNvcnJlY3QgZm9ybWF0LlxcbicgK1xuICAgICAgJ1Nob3VsZCBiZTogWyBbIG9iamVjdDEsIHBvaW50ZXIxIF0sIFsgb2JqZWN0IDIsIHBvaW50ZXIyIF0sIGV0Yy4uLiBdJyk7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnZ2V0Rmlyc3RDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBTaW1pbGFyIHRvIGdldEZpcnN0LCBidXQgYWx3YXlzIHJldHVybnMgYSBjb3B5LlxuICAgKlxuICAgKiAvLyAgeyBbb2JqZWN0LCBwb2ludGVyXVtdIH0gaXRlbXMgLSBBcnJheSBvZiBvYmplY3RzIGFuZCBwb2ludGVycyB0byBjaGVja1xuICAgKiAvLyAgeyBhbnkgPSBudWxsIH0gZGVmYXVsdFZhbHVlIC0gVmFsdWUgdG8gcmV0dXJuIGlmIG5vdGhpbmcgZm91bmRcbiAgICogLy8gIC0gQ29weSBvZiBmaXJzdCB2YWx1ZSBmb3VuZFxuICAgKi9cbiAgc3RhdGljIGdldEZpcnN0Q29weShpdGVtcywgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsKSB7XG4gICAgY29uc3QgZmlyc3RDb3B5ID0gdGhpcy5nZXRGaXJzdChpdGVtcywgZGVmYXVsdFZhbHVlLCB0cnVlKTtcbiAgICByZXR1cm4gZmlyc3RDb3B5O1xuICB9XG5cbiAgLyoqXG4gICAqICdzZXQnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFVzZXMgYSBKU09OIFBvaW50ZXIgdG8gc2V0IGEgdmFsdWUgb24gYW4gb2JqZWN0LlxuICAgKiBBbHNvIGNyZWF0ZXMgYW55IG1pc3Npbmcgc3ViIG9iamVjdHMgb3IgYXJyYXlzIHRvIGNvbnRhaW4gdGhhdCB2YWx1ZS5cbiAgICpcbiAgICogSWYgdGhlIG9wdGlvbmFsIGZvdXJ0aCBwYXJhbWV0ZXIgaXMgVFJVRSBhbmQgdGhlIGlubmVyLW1vc3QgY29udGFpbmVyXG4gICAqIGlzIGFuIGFycmF5LCB0aGUgZnVuY3Rpb24gd2lsbCBpbnNlcnQgdGhlIHZhbHVlIGFzIGEgbmV3IGl0ZW0gYXQgdGhlXG4gICAqIHNwZWNpZmllZCBsb2NhdGlvbiBpbiB0aGUgYXJyYXksIHJhdGhlciB0aGFuIG92ZXJ3cml0aW5nIHRoZSBleGlzdGluZ1xuICAgKiB2YWx1ZSAoaWYgYW55KSBhdCB0aGF0IGxvY2F0aW9uLlxuICAgKlxuICAgKiBTbyBzZXQoWzEsIDIsIDNdLCAnLzEnLCA0KSA9PiBbMSwgNCwgM11cbiAgICogYW5kXG4gICAqIFNvIHNldChbMSwgMiwgM10sICcvMScsIDQsIHRydWUpID0+IFsxLCA0LCAyLCAzXVxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBUaGUgb2JqZWN0IHRvIHNldCB2YWx1ZSBpblxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIFRoZSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gICB2YWx1ZSAtIFRoZSBuZXcgdmFsdWUgdG8gc2V0XG4gICAqIC8vICB7IGJvb2xlYW4gfSBpbnNlcnQgLSBpbnNlcnQgdmFsdWU/XG4gICAqIC8vIHsgb2JqZWN0IH0gLSBUaGUgb3JpZ2luYWwgb2JqZWN0LCBtb2RpZmllZCB3aXRoIHRoZSBzZXQgdmFsdWVcbiAgICovXG4gIHN0YXRpYyBzZXQob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSwgaW5zZXJ0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBrZXlBcnJheSA9IHRoaXMucGFyc2UocG9pbnRlcik7XG4gICAgaWYgKGtleUFycmF5ICE9PSBudWxsICYmIGtleUFycmF5Lmxlbmd0aCkge1xuICAgICAgbGV0IHN1Yk9iamVjdCA9IG9iamVjdDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5QXJyYXkubGVuZ3RoIC0gMTsgKytpKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlBcnJheVtpXTtcbiAgICAgICAgaWYgKGtleSA9PT0gJy0nICYmIGlzQXJyYXkoc3ViT2JqZWN0KSkge1xuICAgICAgICAgIGtleSA9IHN1Yk9iamVjdC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTWFwKHN1Yk9iamVjdCkgJiYgc3ViT2JqZWN0LmhhcyhrZXkpKSB7XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0LmdldChrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghaGFzT3duKHN1Yk9iamVjdCwga2V5KSkge1xuICAgICAgICAgICAgc3ViT2JqZWN0W2tleV0gPSAoa2V5QXJyYXlbaSArIDFdLm1hdGNoKC9eKFxcZCt8LSkkLykpID8gW10gOiB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBsYXN0S2V5ID0ga2V5QXJyYXlba2V5QXJyYXkubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoaXNBcnJheShzdWJPYmplY3QpICYmIGxhc3RLZXkgPT09ICctJykge1xuICAgICAgICBzdWJPYmplY3QucHVzaCh2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGluc2VydCAmJiBpc0FycmF5KHN1Yk9iamVjdCkgJiYgIWlzTmFOKCtsYXN0S2V5KSkge1xuICAgICAgICBzdWJPYmplY3Quc3BsaWNlKGxhc3RLZXksIDAsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNNYXAoc3ViT2JqZWN0KSkge1xuICAgICAgICBzdWJPYmplY3Quc2V0KGxhc3RLZXksIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Yk9iamVjdFtsYXN0S2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gICAgY29uc29sZS5lcnJvcihgc2V0IGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtwb2ludGVyfWApO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogJ3NldENvcHknIGZ1bmN0aW9uXG4gICAqXG4gICAqIENvcGllcyBhbiBvYmplY3QgYW5kIHVzZXMgYSBKU09OIFBvaW50ZXIgdG8gc2V0IGEgdmFsdWUgb24gdGhlIGNvcHkuXG4gICAqIEFsc28gY3JlYXRlcyBhbnkgbWlzc2luZyBzdWIgb2JqZWN0cyBvciBhcnJheXMgdG8gY29udGFpbiB0aGF0IHZhbHVlLlxuICAgKlxuICAgKiBJZiB0aGUgb3B0aW9uYWwgZm91cnRoIHBhcmFtZXRlciBpcyBUUlVFIGFuZCB0aGUgaW5uZXItbW9zdCBjb250YWluZXJcbiAgICogaXMgYW4gYXJyYXksIHRoZSBmdW5jdGlvbiB3aWxsIGluc2VydCB0aGUgdmFsdWUgYXMgYSBuZXcgaXRlbSBhdCB0aGVcbiAgICogc3BlY2lmaWVkIGxvY2F0aW9uIGluIHRoZSBhcnJheSwgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcgdGhlIGV4aXN0aW5nIHZhbHVlLlxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBUaGUgb2JqZWN0IHRvIGNvcHkgYW5kIHNldCB2YWx1ZSBpblxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIFRoZSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gICB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBzZXRcbiAgICogLy8gIHsgYm9vbGVhbiB9IGluc2VydCAtIGluc2VydCB2YWx1ZT9cbiAgICogLy8geyBvYmplY3QgfSAtIFRoZSBuZXcgb2JqZWN0IHdpdGggdGhlIHNldCB2YWx1ZVxuICAgKi9cbiAgc3RhdGljIHNldENvcHkob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSwgaW5zZXJ0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBrZXlBcnJheSA9IHRoaXMucGFyc2UocG9pbnRlcik7XG4gICAgaWYgKGtleUFycmF5ICE9PSBudWxsKSB7XG4gICAgICBsZXQgbmV3T2JqZWN0ID0gY29weShvYmplY3QpO1xuICAgICAgbGV0IHN1Yk9iamVjdCA9IG5ld09iamVjdDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5QXJyYXkubGVuZ3RoIC0gMTsgKytpKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlBcnJheVtpXTtcbiAgICAgICAgaWYgKGtleSA9PT0gJy0nICYmIGlzQXJyYXkoc3ViT2JqZWN0KSkge1xuICAgICAgICAgIGtleSA9IHN1Yk9iamVjdC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTWFwKHN1Yk9iamVjdCkgJiYgc3ViT2JqZWN0LmhhcyhrZXkpKSB7XG4gICAgICAgICAgc3ViT2JqZWN0LnNldChrZXksIGNvcHkoc3ViT2JqZWN0LmdldChrZXkpKSk7XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0LmdldChrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghaGFzT3duKHN1Yk9iamVjdCwga2V5KSkge1xuICAgICAgICAgICAgc3ViT2JqZWN0W2tleV0gPSAoa2V5QXJyYXlbaSArIDFdLm1hdGNoKC9eKFxcZCt8LSkkLykpID8gW10gOiB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3ViT2JqZWN0W2tleV0gPSBjb3B5KHN1Yk9iamVjdFtrZXldKTtcbiAgICAgICAgICBzdWJPYmplY3QgPSBzdWJPYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IGxhc3RLZXkgPSBrZXlBcnJheVtrZXlBcnJheS5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChpc0FycmF5KHN1Yk9iamVjdCkgJiYgbGFzdEtleSA9PT0gJy0nKSB7XG4gICAgICAgIHN1Yk9iamVjdC5wdXNoKHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaW5zZXJ0ICYmIGlzQXJyYXkoc3ViT2JqZWN0KSAmJiAhaXNOYU4oK2xhc3RLZXkpKSB7XG4gICAgICAgIHN1Yk9iamVjdC5zcGxpY2UobGFzdEtleSwgMCwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChpc01hcChzdWJPYmplY3QpKSB7XG4gICAgICAgIHN1Yk9iamVjdC5zZXQobGFzdEtleSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViT2JqZWN0W2xhc3RLZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3T2JqZWN0O1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKGBzZXRDb3B5IGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtwb2ludGVyfWApO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogJ2luc2VydCcgZnVuY3Rpb25cbiAgICpcbiAgICogQ2FsbHMgJ3NldCcgd2l0aCBpbnNlcnQgPSBUUlVFXG4gICAqXG4gICAqIC8vICB7IG9iamVjdCB9IG9iamVjdCAtIG9iamVjdCB0byBpbnNlcnQgdmFsdWUgaW5cbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gICB2YWx1ZSAtIHZhbHVlIHRvIGluc2VydFxuICAgKiAvLyB7IG9iamVjdCB9XG4gICAqL1xuICBzdGF0aWMgaW5zZXJ0KG9iamVjdCwgcG9pbnRlciwgdmFsdWUpIHtcbiAgICBjb25zdCB1cGRhdGVkT2JqZWN0ID0gdGhpcy5zZXQob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHVwZGF0ZWRPYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogJ2luc2VydENvcHknIGZ1bmN0aW9uXG4gICAqXG4gICAqIENhbGxzICdzZXRDb3B5JyB3aXRoIGluc2VydCA9IFRSVUVcbiAgICpcbiAgICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0IC0gb2JqZWN0IHRvIGluc2VydCB2YWx1ZSBpblxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyAgIHZhbHVlIC0gdmFsdWUgdG8gaW5zZXJ0XG4gICAqIC8vIHsgb2JqZWN0IH1cbiAgICovXG4gIHN0YXRpYyBpbnNlcnRDb3B5KG9iamVjdCwgcG9pbnRlciwgdmFsdWUpIHtcbiAgICBjb25zdCB1cGRhdGVkT2JqZWN0ID0gdGhpcy5zZXRDb3B5KG9iamVjdCwgcG9pbnRlciwgdmFsdWUsIHRydWUpO1xuICAgIHJldHVybiB1cGRhdGVkT2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdyZW1vdmUnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFVzZXMgYSBKU09OIFBvaW50ZXIgdG8gcmVtb3ZlIGEga2V5IGFuZCBpdHMgYXR0cmlidXRlIGZyb20gYW4gb2JqZWN0XG4gICAqXG4gICAqIC8vICB7IG9iamVjdCB9IG9iamVjdCAtIG9iamVjdCB0byBkZWxldGUgYXR0cmlidXRlIGZyb21cbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8geyBvYmplY3QgfVxuICAgKi9cbiAgc3RhdGljIHJlbW92ZShvYmplY3QsIHBvaW50ZXIpIHtcbiAgICBsZXQga2V5QXJyYXkgPSB0aGlzLnBhcnNlKHBvaW50ZXIpO1xuICAgIGlmIChrZXlBcnJheSAhPT0gbnVsbCAmJiBrZXlBcnJheS5sZW5ndGgpIHtcbiAgICAgIGxldCBsYXN0S2V5ID0ga2V5QXJyYXkucG9wKCk7XG4gICAgICBsZXQgcGFyZW50T2JqZWN0ID0gdGhpcy5nZXQob2JqZWN0LCBrZXlBcnJheSk7XG4gICAgICBpZiAoaXNBcnJheShwYXJlbnRPYmplY3QpKSB7XG4gICAgICAgIGlmIChsYXN0S2V5ID09PSAnLScpIHsgbGFzdEtleSA9IHBhcmVudE9iamVjdC5sZW5ndGggLSAxOyB9XG4gICAgICAgIHBhcmVudE9iamVjdC5zcGxpY2UobGFzdEtleSwgMSk7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHBhcmVudE9iamVjdCkpIHtcbiAgICAgICAgZGVsZXRlIHBhcmVudE9iamVjdFtsYXN0S2V5XTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGNvbnNvbGUuZXJyb3IoYHJlbW92ZSBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7cG9pbnRlcn1gKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdoYXMnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFRlc3RzIGlmIGFuIG9iamVjdCBoYXMgYSB2YWx1ZSBhdCB0aGUgbG9jYXRpb24gc3BlY2lmaWVkIGJ5IGEgSlNPTiBQb2ludGVyXG4gICAqXG4gICAqIC8vICB7IG9iamVjdCB9IG9iamVjdCAtIG9iamVjdCB0byBjaGVrIGZvciB2YWx1ZVxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyB7IGJvb2xlYW4gfVxuICAgKi9cbiAgc3RhdGljIGhhcyhvYmplY3QsIHBvaW50ZXIpIHtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IHRoaXMuZ2V0KG9iamVjdCwgcG9pbnRlciwgMCwgbnVsbCwgdHJ1ZSk7XG4gICAgcmV0dXJuIGhhc1ZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqICdkaWN0JyBmdW5jdGlvblxuICAgKlxuICAgKiBSZXR1cm5zIGEgKHBvaW50ZXIgLT4gdmFsdWUpIGRpY3Rpb25hcnkgZm9yIGFuIG9iamVjdFxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSBUaGUgb2JqZWN0IHRvIGNyZWF0ZSBhIGRpY3Rpb25hcnkgZnJvbVxuICAgKiAvLyB7IG9iamVjdCB9IC0gVGhlIHJlc3VsdGluZyBkaWN0aW9uYXJ5IG9iamVjdFxuICAgKi9cbiAgc3RhdGljIGRpY3Qob2JqZWN0KSB7XG4gICAgbGV0IHJlc3VsdHM6IGFueSA9IHt9O1xuICAgIHRoaXMuZm9yRWFjaERlZXAob2JqZWN0LCAodmFsdWUsIHBvaW50ZXIpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJlc3VsdHNbcG9pbnRlcl0gPSB2YWx1ZTsgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgLyoqXG4gICAqICdmb3JFYWNoRGVlcCcgZnVuY3Rpb25cbiAgICpcbiAgICogSXRlcmF0ZXMgb3ZlciBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCBvciBpdGVtcyBpbiBhbiBhcnJheVxuICAgKiBhbmQgaW52b2tlcyBhbiBpdGVyYXRlZSBmdW5jdGlvbiBmb3IgZWFjaCBrZXkvdmFsdWUgb3IgaW5kZXgvdmFsdWUgcGFpci5cbiAgICogQnkgZGVmYXVsdCwgaXRlcmF0ZXMgb3ZlciBpdGVtcyB3aXRoaW4gb2JqZWN0cyBhbmQgYXJyYXlzIGFmdGVyIGNhbGxpbmdcbiAgICogdGhlIGl0ZXJhdGVlIGZ1bmN0aW9uIG9uIHRoZSBjb250YWluaW5nIG9iamVjdCBvciBhcnJheSBpdHNlbGYuXG4gICAqXG4gICAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiAodmFsdWUsIHBvaW50ZXIsIHJvb3RPYmplY3QpLFxuICAgKiB3aGVyZSBwb2ludGVyIGlzIGEgSlNPTiBwb2ludGVyIGluZGljYXRpbmcgdGhlIGxvY2F0aW9uIG9mIHRoZSBjdXJyZW50XG4gICAqIHZhbHVlIHdpdGhpbiB0aGUgcm9vdCBvYmplY3QsIGFuZCByb290T2JqZWN0IGlzIHRoZSByb290IG9iamVjdCBpbml0aWFsbHlcbiAgICogc3VibWl0dGVkIHRvIHRoIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBJZiBhIHRoaXJkIG9wdGlvbmFsIHBhcmFtZXRlciAnYm90dG9tVXAnIGlzIHNldCB0byBUUlVFLCB0aGUgaXRlcmF0b3JcbiAgICogZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgb24gc3ViLW9iamVjdHMgYW5kIGFycmF5cyBhZnRlciBiZWluZ1xuICAgKiBjYWxsZWQgb24gdGhlaXIgY29udGVudHMsIHJhdGhlciB0aGFuIGJlZm9yZSwgd2hpY2ggaXMgdGhlIGRlZmF1bHQuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gY2FuIGFsc28gb3B0aW9uYWxseSBiZSBjYWxsZWQgZGlyZWN0bHkgb24gYSBzdWItb2JqZWN0IGJ5XG4gICAqIGluY2x1ZGluZyBvcHRpb25hbCA0dGggYW5kIDV0aCBwYXJhbWV0ZXJzcyB0byBzcGVjaWZ5IHRoZSBpbml0aWFsXG4gICAqIHJvb3Qgb2JqZWN0IGFuZCBwb2ludGVyLlxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSB0aGUgaW5pdGlhbCBvYmplY3Qgb3IgYXJyYXlcbiAgICogLy8gIHsgKHY6IGFueSwgcD86IHN0cmluZywgbz86IGFueSkgPT4gYW55IH0gZnVuY3Rpb24gLSBpdGVyYXRlZSBmdW5jdGlvblxuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSBib3R0b21VcCAtIG9wdGlvbmFsLCBzZXQgdG8gVFJVRSB0byByZXZlcnNlIGRpcmVjdGlvblxuICAgKiAvLyAgeyBvYmplY3QgPSBvYmplY3QgfSByb290T2JqZWN0IC0gb3B0aW9uYWwsIHJvb3Qgb2JqZWN0IG9yIGFycmF5XG4gICAqIC8vICB7IHN0cmluZyA9ICcnIH0gcG9pbnRlciAtIG9wdGlvbmFsLCBKU09OIFBvaW50ZXIgdG8gb2JqZWN0IHdpdGhpbiByb290T2JqZWN0XG4gICAqIC8vIHsgb2JqZWN0IH0gLSBUaGUgbW9kaWZpZWQgb2JqZWN0XG4gICAqL1xuICBzdGF0aWMgZm9yRWFjaERlZXAoXG4gICAgb2JqZWN0LCBmbjogKHY6IGFueSwgcD86IHN0cmluZywgbz86IGFueSkgPT4gYW55ID0gKHYpID0+IHYsXG4gICAgYm90dG9tVXAgPSBmYWxzZSwgcG9pbnRlciA9ICcnLCByb290T2JqZWN0ID0gb2JqZWN0XG4gICkge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGZvckVhY2hEZWVwIGVycm9yOiBJdGVyYXRvciBpcyBub3QgYSBmdW5jdGlvbjpgLCBmbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYm90dG9tVXApIHsgZm4ob2JqZWN0LCBwb2ludGVyLCByb290T2JqZWN0KTsgfVxuICAgIGlmIChpc09iamVjdChvYmplY3QpIHx8IGlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iamVjdCkpIHtcbiAgICAgICAgY29uc3QgbmV3UG9pbnRlciA9IHBvaW50ZXIgKyAnLycgKyB0aGlzLmVzY2FwZShrZXkpO1xuICAgICAgICB0aGlzLmZvckVhY2hEZWVwKG9iamVjdFtrZXldLCBmbiwgYm90dG9tVXAsIG5ld1BvaW50ZXIsIHJvb3RPYmplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYm90dG9tVXApIHsgZm4ob2JqZWN0LCBwb2ludGVyLCByb290T2JqZWN0KTsgfVxuICB9XG5cbiAgLyoqXG4gICAqICdmb3JFYWNoRGVlcENvcHknIGZ1bmN0aW9uXG4gICAqXG4gICAqIFNpbWlsYXIgdG8gZm9yRWFjaERlZXAsIGJ1dCByZXR1cm5zIGEgY29weSBvZiB0aGUgb3JpZ2luYWwgb2JqZWN0LCB3aXRoXG4gICAqIHRoZSBzYW1lIGtleXMgYW5kIGluZGV4ZXMsIGJ1dCB3aXRoIHZhbHVlcyByZXBsYWNlZCB3aXRoIHRoZSByZXN1bHQgb2ZcbiAgICogdGhlIGl0ZXJhdGVlIGZ1bmN0aW9uLlxuICAgKlxuICAgKiAvLyAgeyBvYmplY3QgfSBvYmplY3QgLSB0aGUgaW5pdGlhbCBvYmplY3Qgb3IgYXJyYXlcbiAgICogLy8gIHsgKHY6IGFueSwgaz86IHN0cmluZywgbz86IGFueSwgcD86IGFueSkgPT4gYW55IH0gZnVuY3Rpb24gLSBpdGVyYXRlZSBmdW5jdGlvblxuICAgKiAvLyAgeyBib29sZWFuID0gZmFsc2UgfSBib3R0b21VcCAtIG9wdGlvbmFsLCBzZXQgdG8gVFJVRSB0byByZXZlcnNlIGRpcmVjdGlvblxuICAgKiAvLyAgeyBvYmplY3QgPSBvYmplY3QgfSByb290T2JqZWN0IC0gb3B0aW9uYWwsIHJvb3Qgb2JqZWN0IG9yIGFycmF5XG4gICAqIC8vICB7IHN0cmluZyA9ICcnIH0gcG9pbnRlciAtIG9wdGlvbmFsLCBKU09OIFBvaW50ZXIgdG8gb2JqZWN0IHdpdGhpbiByb290T2JqZWN0XG4gICAqIC8vIHsgb2JqZWN0IH0gLSBUaGUgY29waWVkIG9iamVjdFxuICAgKi9cbiAgc3RhdGljIGZvckVhY2hEZWVwQ29weShcbiAgICBvYmplY3QsIGZuOiAodjogYW55LCBwPzogc3RyaW5nLCBvPzogYW55KSA9PiBhbnkgPSAodikgPT4gdixcbiAgICBib3R0b21VcCA9IGZhbHNlLCBwb2ludGVyID0gJycsIHJvb3RPYmplY3QgPSBvYmplY3RcbiAgKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS5lcnJvcihgZm9yRWFjaERlZXBDb3B5IGVycm9yOiBJdGVyYXRvciBpcyBub3QgYSBmdW5jdGlvbjpgLCBmbik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0KG9iamVjdCkgfHwgaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBsZXQgbmV3T2JqZWN0ID0gaXNBcnJheShvYmplY3QpID8gWyAuLi5vYmplY3QgXSA6IHsgLi4ub2JqZWN0IH07XG4gICAgICBpZiAoIWJvdHRvbVVwKSB7IG5ld09iamVjdCA9IGZuKG5ld09iamVjdCwgcG9pbnRlciwgcm9vdE9iamVjdCk7IH1cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhuZXdPYmplY3QpKSB7XG4gICAgICAgIGNvbnN0IG5ld1BvaW50ZXIgPSBwb2ludGVyICsgJy8nICsgdGhpcy5lc2NhcGUoa2V5KTtcbiAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB0aGlzLmZvckVhY2hEZWVwQ29weShcbiAgICAgICAgICBuZXdPYmplY3Rba2V5XSwgZm4sIGJvdHRvbVVwLCBuZXdQb2ludGVyLCByb290T2JqZWN0XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoYm90dG9tVXApIHsgbmV3T2JqZWN0ID0gZm4obmV3T2JqZWN0LCBwb2ludGVyLCByb290T2JqZWN0KTsgfVxuICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKG9iamVjdCwgcG9pbnRlciwgcm9vdE9iamVjdCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICdlc2NhcGUnIGZ1bmN0aW9uXG4gICAqXG4gICAqIEVzY2FwZXMgYSBzdHJpbmcgcmVmZXJlbmNlIGtleVxuICAgKlxuICAgKiAvLyAgeyBzdHJpbmcgfSBrZXkgLSBzdHJpbmcga2V5IHRvIGVzY2FwZVxuICAgKiAvLyB7IHN0cmluZyB9IC0gZXNjYXBlZCBrZXlcbiAgICovXG4gIHN0YXRpYyBlc2NhcGUoa2V5KSB7XG4gICAgY29uc3QgZXNjYXBlZCA9IGtleS50b1N0cmluZygpLnJlcGxhY2UoL34vZywgJ34wJykucmVwbGFjZSgvXFwvL2csICd+MScpO1xuICAgIHJldHVybiBlc2NhcGVkO1xuICB9XG5cbiAgLyoqXG4gICAqICd1bmVzY2FwZScgZnVuY3Rpb25cbiAgICpcbiAgICogVW5lc2NhcGVzIGEgc3RyaW5nIHJlZmVyZW5jZSBrZXlcbiAgICpcbiAgICogLy8gIHsgc3RyaW5nIH0ga2V5IC0gc3RyaW5nIGtleSB0byB1bmVzY2FwZVxuICAgKiAvLyB7IHN0cmluZyB9IC0gdW5lc2NhcGVkIGtleVxuICAgKi9cbiAgc3RhdGljIHVuZXNjYXBlKGtleSkge1xuICAgIGNvbnN0IHVuZXNjYXBlZCA9IGtleS50b1N0cmluZygpLnJlcGxhY2UoL34xL2csICcvJykucmVwbGFjZSgvfjAvZywgJ34nKTtcbiAgICByZXR1cm4gdW5lc2NhcGVkO1xuICB9XG5cbiAgLyoqXG4gICAqICdwYXJzZScgZnVuY3Rpb25cbiAgICpcbiAgICogQ29udmVydHMgYSBzdHJpbmcgSlNPTiBQb2ludGVyIGludG8gYSBhcnJheSBvZiBrZXlzXG4gICAqIChpZiBpbnB1dCBpcyBhbHJlYWR5IGFuIGFuIGFycmF5IG9mIGtleXMsIGl0IGlzIHJldHVybmVkIHVuY2hhbmdlZClcbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBpbnZhbGlkIHBvaW50ZXI/XG4gICAqIC8vIHsgc3RyaW5nW10gfSAtIEpTT04gUG9pbnRlciBhcnJheSBvZiBrZXlzXG4gICAqL1xuICBzdGF0aWMgcGFyc2UocG9pbnRlciwgZXJyb3JzID0gZmFsc2UpIHtcbiAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihwb2ludGVyKSkge1xuICAgICAgaWYgKGVycm9ycykgeyBjb25zb2xlLmVycm9yKGBwYXJzZSBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7cG9pbnRlcn1gKTsgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHBvaW50ZXIpKSB7IHJldHVybiA8c3RyaW5nW10+cG9pbnRlcjsgfVxuICAgIGlmICh0eXBlb2YgcG9pbnRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICgoPHN0cmluZz5wb2ludGVyKVswXSA9PT0gJyMnKSB7IHBvaW50ZXIgPSBwb2ludGVyLnNsaWNlKDEpOyB9XG4gICAgICBpZiAoPHN0cmluZz5wb2ludGVyID09PSAnJyB8fCA8c3RyaW5nPnBvaW50ZXIgPT09ICcvJykgeyByZXR1cm4gW107IH1cbiAgICAgIHJldHVybiAoPHN0cmluZz5wb2ludGVyKS5zbGljZSgxKS5zcGxpdCgnLycpLm1hcCh0aGlzLnVuZXNjYXBlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ2NvbXBpbGUnIGZ1bmN0aW9uXG4gICAqXG4gICAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGtleXMgaW50byBhIEpTT04gUG9pbnRlciBzdHJpbmdcbiAgICogKGlmIGlucHV0IGlzIGFscmVhZHkgYSBzdHJpbmcsIGl0IGlzIG5vcm1hbGl6ZWQgYW5kIHJldHVybmVkKVxuICAgKlxuICAgKiBUaGUgb3B0aW9uYWwgc2Vjb25kIHBhcmFtZXRlciBpcyBhIGRlZmF1bHQgd2hpY2ggd2lsbCByZXBsYWNlIGFueSBlbXB0eSBrZXlzLlxuICAgKlxuICAgKiAvLyAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiAvLyAgeyBzdHJpbmcgfCBudW1iZXIgPSAnJyB9IGRlZmF1bHRWYWx1ZSAtIERlZmF1bHQgdmFsdWVcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBpbnZhbGlkIHBvaW50ZXI/XG4gICAqIC8vIHsgc3RyaW5nIH0gLSBKU09OIFBvaW50ZXIgc3RyaW5nXG4gICAqL1xuICBzdGF0aWMgY29tcGlsZShwb2ludGVyLCBkZWZhdWx0VmFsdWUgPSAnJywgZXJyb3JzID0gZmFsc2UpIHtcbiAgICBpZiAocG9pbnRlciA9PT0gJyMnKSB7IHJldHVybiAnJzsgfVxuICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKHBvaW50ZXIpKSB7XG4gICAgICBpZiAoZXJyb3JzKSB7IGNvbnNvbGUuZXJyb3IoYGNvbXBpbGUgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7IH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheShwb2ludGVyKSkge1xuICAgICAgaWYgKCg8c3RyaW5nW10+cG9pbnRlcikubGVuZ3RoID09PSAwKSB7IHJldHVybiAnJzsgfVxuICAgICAgcmV0dXJuICcvJyArICg8c3RyaW5nW10+cG9pbnRlcikubWFwKFxuICAgICAgICBrZXkgPT4ga2V5ID09PSAnJyA/IGRlZmF1bHRWYWx1ZSA6IHRoaXMuZXNjYXBlKGtleSlcbiAgICAgICkuam9pbignLycpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBvaW50ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAocG9pbnRlclswXSA9PT0gJyMnKSB7IHBvaW50ZXIgPSBwb2ludGVyLnNsaWNlKDEpOyB9XG4gICAgICByZXR1cm4gcG9pbnRlcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ3RvS2V5JyBmdW5jdGlvblxuICAgKlxuICAgKiBFeHRyYWN0cyBuYW1lIG9mIHRoZSBmaW5hbCBrZXkgZnJvbSBhIEpTT04gUG9pbnRlci5cbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBpbnZhbGlkIHBvaW50ZXI/XG4gICAqIC8vIHsgc3RyaW5nIH0gLSB0aGUgZXh0cmFjdGVkIGtleVxuICAgKi9cbiAgc3RhdGljIHRvS2V5KHBvaW50ZXIsIGVycm9ycyA9IGZhbHNlKSB7XG4gICAgbGV0IGtleUFycmF5ID0gdGhpcy5wYXJzZShwb2ludGVyLCBlcnJvcnMpO1xuICAgIGlmIChrZXlBcnJheSA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGlmICgha2V5QXJyYXkubGVuZ3RoKSB7IHJldHVybiAnJzsgfVxuICAgIHJldHVybiBrZXlBcnJheVtrZXlBcnJheS5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnaXNKc29uUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogQ2hlY2tzIGEgc3RyaW5nIG9yIGFycmF5IHZhbHVlIHRvIGRldGVybWluZSBpZiBpdCBpcyBhIHZhbGlkIEpTT04gUG9pbnRlci5cbiAgICogUmV0dXJucyB0cnVlIGlmIGEgc3RyaW5nIGlzIGVtcHR5LCBvciBzdGFydHMgd2l0aCAnLycgb3IgJyMvJy5cbiAgICogUmV0dXJucyB0cnVlIGlmIGFuIGFycmF5IGNvbnRhaW5zIG9ubHkgc3RyaW5nIHZhbHVlcy5cbiAgICpcbiAgICogLy8gICB2YWx1ZSAtIHZhbHVlIHRvIGNoZWNrXG4gICAqIC8vIHsgYm9vbGVhbiB9IC0gdHJ1ZSBpZiB2YWx1ZSBpcyBhIHZhbGlkIEpTT04gUG9pbnRlciwgb3RoZXJ3aXNlIGZhbHNlXG4gICAqL1xuICBzdGF0aWMgaXNKc29uUG9pbnRlcih2YWx1ZSkge1xuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlLmV2ZXJ5KGtleSA9PiB0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyk7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICcjJykgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgaWYgKHZhbHVlWzBdID09PSAnLycgfHwgdmFsdWUuc2xpY2UoMCwgMikgPT09ICcjLycpIHtcbiAgICAgICAgcmV0dXJuICEvKH5bXjAxXXx+JCkvZy50ZXN0KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqICdpc1N1YlBvaW50ZXInIGZ1bmN0aW9uXG4gICAqXG4gICAqIENoZWNrcyB3aGV0aGVyIG9uZSBKU09OIFBvaW50ZXIgaXMgYSBzdWJzZXQgb2YgYW5vdGhlci5cbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IHNob3J0UG9pbnRlciAtIHBvdGVudGlhbCBzdWJzZXQgSlNPTiBQb2ludGVyXG4gICAqIC8vICB7IFBvaW50ZXIgfSBsb25nUG9pbnRlciAtIHBvdGVudGlhbCBzdXBlcnNldCBKU09OIFBvaW50ZXJcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gdHJ1ZUlmTWF0Y2hpbmcgLSByZXR1cm4gdHJ1ZSBpZiBwb2ludGVycyBtYXRjaD9cbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBpbnZhbGlkIHBvaW50ZXI/XG4gICAqIC8vIHsgYm9vbGVhbiB9IC0gdHJ1ZSBpZiBzaG9ydFBvaW50ZXIgaXMgYSBzdWJzZXQgb2YgbG9uZ1BvaW50ZXIsIGZhbHNlIGlmIG5vdFxuICAgKi9cbiAgc3RhdGljIGlzU3ViUG9pbnRlcihcbiAgICBzaG9ydFBvaW50ZXIsIGxvbmdQb2ludGVyLCB0cnVlSWZNYXRjaGluZyA9IGZhbHNlLCBlcnJvcnMgPSBmYWxzZVxuICApIHtcbiAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihzaG9ydFBvaW50ZXIpIHx8ICF0aGlzLmlzSnNvblBvaW50ZXIobG9uZ1BvaW50ZXIpKSB7XG4gICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgIGxldCBpbnZhbGlkID0gJydcbiAgICAgICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIoc2hvcnRQb2ludGVyKSkgeyBpbnZhbGlkICs9IGAgMTogJHtzaG9ydFBvaW50ZXJ9YDsgfVxuICAgICAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihsb25nUG9pbnRlcikpIHsgaW52YWxpZCArPSBgIDI6ICR7bG9uZ1BvaW50ZXJ9YDsgfVxuICAgICAgICBjb25zb2xlLmVycm9yKGBpc1N1YlBvaW50ZXIgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyICR7aW52YWxpZH1gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2hvcnRQb2ludGVyID0gdGhpcy5jb21waWxlKHNob3J0UG9pbnRlciwgJycsIGVycm9ycyk7XG4gICAgbG9uZ1BvaW50ZXIgPSB0aGlzLmNvbXBpbGUobG9uZ1BvaW50ZXIsICcnLCBlcnJvcnMpO1xuICAgIHJldHVybiBzaG9ydFBvaW50ZXIgPT09IGxvbmdQb2ludGVyID8gdHJ1ZUlmTWF0Y2hpbmcgOlxuICAgICAgYCR7c2hvcnRQb2ludGVyfS9gID09PSBsb25nUG9pbnRlci5zbGljZSgwLCBzaG9ydFBvaW50ZXIubGVuZ3RoICsgMSk7XG4gIH1cblxuICAvKipcbiAgICogJ3RvSW5kZXhlZFBvaW50ZXInIGZ1bmN0aW9uXG4gICAqXG4gICAqIE1lcmdlcyBhbiBhcnJheSBvZiBudW1lcmljIGluZGV4ZXMgYW5kIGEgZ2VuZXJpYyBwb2ludGVyIHRvIGNyZWF0ZSBhblxuICAgKiBpbmRleGVkIHBvaW50ZXIgZm9yIGEgc3BlY2lmaWMgaXRlbS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIG1lcmdpbmcgdGhlIGdlbmVyaWMgcG9pbnRlciAnL2Zvby8tL2Jhci8tL2JheicgYW5kXG4gICAqIHRoZSBhcnJheSBbNCwgMl0gd291bGQgcmVzdWx0IGluIHRoZSBpbmRleGVkIHBvaW50ZXIgJy9mb28vNC9iYXIvMi9iYXonXG4gICAqXG4gICAqIFxuICAgKiAvLyAgeyBQb2ludGVyIH0gZ2VuZXJpY1BvaW50ZXIgLSBUaGUgZ2VuZXJpYyBwb2ludGVyXG4gICAqIC8vICB7IG51bWJlcltdIH0gaW5kZXhBcnJheSAtIFRoZSBhcnJheSBvZiBudW1lcmljIGluZGV4ZXNcbiAgICogLy8gIHsgTWFwPHN0cmluZywgbnVtYmVyPiB9IGFycmF5TWFwIC0gQW4gb3B0aW9uYWwgYXJyYXkgbWFwXG4gICAqIC8vIHsgc3RyaW5nIH0gLSBUaGUgbWVyZ2VkIHBvaW50ZXIgd2l0aCBpbmRleGVzXG4gICAqL1xuICBzdGF0aWMgdG9JbmRleGVkUG9pbnRlcihcbiAgICBnZW5lcmljUG9pbnRlciwgaW5kZXhBcnJheSwgYXJyYXlNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBudWxsXG4gICkge1xuICAgIGlmICh0aGlzLmlzSnNvblBvaW50ZXIoZ2VuZXJpY1BvaW50ZXIpICYmIGlzQXJyYXkoaW5kZXhBcnJheSkpIHtcbiAgICAgIGxldCBpbmRleGVkUG9pbnRlciA9IHRoaXMuY29tcGlsZShnZW5lcmljUG9pbnRlcik7XG4gICAgICBpZiAoaXNNYXAoYXJyYXlNYXApKSB7XG4gICAgICAgIGxldCBhcnJheUluZGV4ID0gMDtcbiAgICAgICAgcmV0dXJuIGluZGV4ZWRQb2ludGVyLnJlcGxhY2UoL1xcL1xcLSg/PVxcL3wkKS9nLCAoa2V5LCBzdHJpbmdJbmRleCkgPT5cbiAgICAgICAgICBhcnJheU1hcC5oYXMoKDxzdHJpbmc+aW5kZXhlZFBvaW50ZXIpLnNsaWNlKDAsIHN0cmluZ0luZGV4KSkgP1xuICAgICAgICAgICAgJy8nICsgaW5kZXhBcnJheVthcnJheUluZGV4KytdIDoga2V5XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBwb2ludGVySW5kZXggb2YgaW5kZXhBcnJheSkge1xuICAgICAgICAgIGluZGV4ZWRQb2ludGVyID0gaW5kZXhlZFBvaW50ZXIucmVwbGFjZSgnLy0nLCAnLycgKyBwb2ludGVySW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleGVkUG9pbnRlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIoZ2VuZXJpY1BvaW50ZXIpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGB0b0luZGV4ZWRQb2ludGVyIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtnZW5lcmljUG9pbnRlcn1gKTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KGluZGV4QXJyYXkpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGB0b0luZGV4ZWRQb2ludGVyIGVycm9yOiBJbnZhbGlkIGluZGV4QXJyYXk6ICR7aW5kZXhBcnJheX1gKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqICd0b0dlbmVyaWNQb2ludGVyJyBmdW5jdGlvblxuICAgKlxuICAgKiBDb21wYXJlcyBhbiBpbmRleGVkIHBvaW50ZXIgdG8gYW4gYXJyYXkgbWFwIGFuZCByZW1vdmVzIGxpc3QgYXJyYXlcbiAgICogaW5kZXhlcyAoYnV0IGxlYXZlcyB0dXBsZSBhcnJyYXkgaW5kZXhlcyBhbmQgYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRpbmdcbiAgICogbnVtZXJpYyBrZXlzKSB0byBjcmVhdGUgYSBnZW5lcmljIHBvaW50ZXIuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCB1c2luZyB0aGUgaW5kZXhlZCBwb2ludGVyICcvZm9vLzEvYmFyLzIvYmF6LzMnIGFuZFxuICAgKiB0aGUgYXJyYXlNYXAgW1snL2ZvbycsIDBdLCBbJy9mb28vLS9iYXInLCAzXSwgWycvZm9vLy0vYmFyLy0vYmF6JywgMF1dXG4gICAqIHdvdWxkIHJlc3VsdCBpbiB0aGUgZ2VuZXJpYyBwb2ludGVyICcvZm9vLy0vYmFyLzIvYmF6Ly0nXG4gICAqIFVzaW5nIHRoZSBpbmRleGVkIHBvaW50ZXIgJy9mb28vMS9iYXIvNC9iYXovMycgYW5kIHRoZSBzYW1lIGFycmF5TWFwXG4gICAqIHdvdWxkIHJlc3VsdCBpbiB0aGUgZ2VuZXJpYyBwb2ludGVyICcvZm9vLy0vYmFyLy0vYmF6Ly0nXG4gICAqICh0aGUgYmFyIGFycmF5IGhhcyAzIHR1cGxlIGl0ZW1zLCBzbyBpbmRleCAyIGlzIHJldGFpbmVkLCBidXQgNCBpcyByZW1vdmVkKVxuICAgKlxuICAgKiBUaGUgc3RydWN0dXJlIG9mIHRoZSBhcnJheU1hcCBpczogW1sncGF0aCB0byBhcnJheScsIG51bWJlciBvZiB0dXBsZSBpdGVtc10uLi5dXG4gICAqXG4gICAqIFxuICAgKiAvLyAgeyBQb2ludGVyIH0gaW5kZXhlZFBvaW50ZXIgLSBUaGUgaW5kZXhlZCBwb2ludGVyIChhcnJheSBvciBzdHJpbmcpXG4gICAqIC8vICB7IE1hcDxzdHJpbmcsIG51bWJlcj4gfSBhcnJheU1hcCAtIFRoZSBvcHRpb25hbCBhcnJheSBtYXAgKGZvciBwcmVzZXJ2aW5nIHR1cGxlIGluZGV4ZXMpXG4gICAqIC8vIHsgc3RyaW5nIH0gLSBUaGUgZ2VuZXJpYyBwb2ludGVyIHdpdGggaW5kZXhlcyByZW1vdmVkXG4gICAqL1xuICBzdGF0aWMgdG9HZW5lcmljUG9pbnRlcihpbmRleGVkUG9pbnRlciwgYXJyYXlNYXAgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpKSB7XG4gICAgaWYgKHRoaXMuaXNKc29uUG9pbnRlcihpbmRleGVkUG9pbnRlcikgJiYgaXNNYXAoYXJyYXlNYXApKSB7XG4gICAgICBsZXQgcG9pbnRlckFycmF5ID0gdGhpcy5wYXJzZShpbmRleGVkUG9pbnRlcik7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvaW50ZXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzdWJQb2ludGVyID0gdGhpcy5jb21waWxlKHBvaW50ZXJBcnJheS5zbGljZSgwLCBpKSk7XG4gICAgICAgIGlmIChhcnJheU1hcC5oYXMoc3ViUG9pbnRlcikgJiZcbiAgICAgICAgICBhcnJheU1hcC5nZXQoc3ViUG9pbnRlcikgPD0gK3BvaW50ZXJBcnJheVtpXVxuICAgICAgICApIHtcbiAgICAgICAgICBwb2ludGVyQXJyYXlbaV0gPSAnLSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUocG9pbnRlckFycmF5KTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIoaW5kZXhlZFBvaW50ZXIpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGB0b0dlbmVyaWNQb2ludGVyIGVycm9yOiBpbnZhbGlkIEpTT04gUG9pbnRlcjogJHtpbmRleGVkUG9pbnRlcn1gKTtcbiAgICB9XG4gICAgaWYgKCFpc01hcChhcnJheU1hcCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYHRvR2VuZXJpY1BvaW50ZXIgZXJyb3I6IGludmFsaWQgYXJyYXlNYXA6ICR7YXJyYXlNYXB9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICd0b0NvbnRyb2xQb2ludGVyJyBmdW5jdGlvblxuICAgKlxuICAgKiBBY2NlcHRzIGEgSlNPTiBQb2ludGVyIGZvciBhIGRhdGEgb2JqZWN0IGFuZCByZXR1cm5zIGEgSlNPTiBQb2ludGVyIGZvciB0aGVcbiAgICogbWF0Y2hpbmcgY29udHJvbCBpbiBhbiBBbmd1bGFyIEZvcm1Hcm91cC5cbiAgICpcbiAgICogLy8gIHsgUG9pbnRlciB9IGRhdGFQb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpIHRvIGEgZGF0YSBvYmplY3RcbiAgICogLy8gIHsgRm9ybUdyb3VwIH0gZm9ybUdyb3VwIC0gQW5ndWxhciBGb3JtR3JvdXAgdG8gZ2V0IHZhbHVlIGZyb21cbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gY29udHJvbE11c3RFeGlzdCAtIE9ubHkgcmV0dXJuIGlmIGNvbnRyb2wgZXhpc3RzP1xuICAgKiAvLyB7IFBvaW50ZXIgfSAtIEpTT04gUG9pbnRlciAoc3RyaW5nKSB0byB0aGUgZm9ybUdyb3VwIG9iamVjdFxuICAgKi9cbiAgc3RhdGljIHRvQ29udHJvbFBvaW50ZXIoZGF0YVBvaW50ZXIsIGZvcm1Hcm91cCwgY29udHJvbE11c3RFeGlzdCA9IGZhbHNlKSB7XG4gICAgY29uc3QgZGF0YVBvaW50ZXJBcnJheSA9IHRoaXMucGFyc2UoZGF0YVBvaW50ZXIpO1xuICAgIGxldCBjb250cm9sUG9pbnRlckFycmF5OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBzdWJHcm91cCA9IGZvcm1Hcm91cDtcbiAgICBpZiAoZGF0YVBvaW50ZXJBcnJheSAhPT0gbnVsbCkge1xuICAgICAgZm9yIChsZXQga2V5IG9mIGRhdGFQb2ludGVyQXJyYXkpIHtcbiAgICAgICAgaWYgKGhhc093bihzdWJHcm91cCwgJ2NvbnRyb2xzJykpIHtcbiAgICAgICAgICBjb250cm9sUG9pbnRlckFycmF5LnB1c2goJ2NvbnRyb2xzJyk7XG4gICAgICAgICAgc3ViR3JvdXAgPSBzdWJHcm91cC5jb250cm9scztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnJheShzdWJHcm91cCkgJiYgKGtleSA9PT0gJy0nKSkge1xuICAgICAgICAgIGNvbnRyb2xQb2ludGVyQXJyYXkucHVzaCgoc3ViR3JvdXAubGVuZ3RoIC0gMSkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgc3ViR3JvdXAgPSBzdWJHcm91cFtzdWJHcm91cC5sZW5ndGggLSAxXTtcbiAgICAgICAgfSBlbHNlIGlmIChoYXNPd24oc3ViR3JvdXAsIGtleSkpIHtcbiAgICAgICAgICBjb250cm9sUG9pbnRlckFycmF5LnB1c2goa2V5KTtcbiAgICAgICAgICBzdWJHcm91cCA9IHN1Ykdyb3VwW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAoY29udHJvbE11c3RFeGlzdCkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYHRvQ29udHJvbFBvaW50ZXIgZXJyb3I6IFVuYWJsZSB0byBmaW5kIFwiJHtrZXl9XCIgaXRlbSBpbiBGb3JtR3JvdXAuYCk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihkYXRhUG9pbnRlcik7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtR3JvdXApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250cm9sUG9pbnRlckFycmF5LnB1c2goa2V5KTtcbiAgICAgICAgICBzdWJHcm91cCA9IHsgY29udHJvbHM6IHt9IH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUoY29udHJvbFBvaW50ZXJBcnJheSk7XG4gICAgfVxuICAgIGNvbnNvbGUuZXJyb3IoYHRvQ29udHJvbFBvaW50ZXIgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke2RhdGFQb2ludGVyfWApO1xuICB9XG5cbiAgLyoqXG4gICAqICd0b1NjaGVtYVBvaW50ZXInIGZ1bmN0aW9uXG4gICAqXG4gICAqIEFjY2VwdHMgYSBKU09OIFBvaW50ZXIgdG8gYSB2YWx1ZSBpbnNpZGUgYSBkYXRhIG9iamVjdCBhbmQgYSBKU09OIHNjaGVtYVxuICAgKiBmb3IgdGhhdCBvYmplY3QuXG4gICAqXG4gICAqIFJldHVybnMgYSBQb2ludGVyIHRvIHRoZSBzdWItc2NoZW1hIGZvciB0aGUgdmFsdWUgaW5zaWRlIHRoZSBvYmplY3QncyBzY2hlbWEuXG4gICAqXG4gICAqIC8vICB7IFBvaW50ZXIgfSBkYXRhUG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KSB0byBhbiBvYmplY3RcbiAgICogLy8gICBzY2hlbWEgLSBKU09OIHNjaGVtYSBmb3IgdGhlIG9iamVjdFxuICAgKiAvLyB7IFBvaW50ZXIgfSAtIEpTT04gUG9pbnRlciAoc3RyaW5nKSB0byB0aGUgb2JqZWN0J3Mgc2NoZW1hXG4gICAqL1xuICBzdGF0aWMgdG9TY2hlbWFQb2ludGVyKGRhdGFQb2ludGVyLCBzY2hlbWEpIHtcbiAgICBpZiAodGhpcy5pc0pzb25Qb2ludGVyKGRhdGFQb2ludGVyKSAmJiB0eXBlb2Ygc2NoZW1hID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgcG9pbnRlckFycmF5ID0gdGhpcy5wYXJzZShkYXRhUG9pbnRlcik7XG4gICAgICBpZiAoIXBvaW50ZXJBcnJheS5sZW5ndGgpIHsgcmV0dXJuICcnOyB9XG4gICAgICBjb25zdCBmaXJzdEtleSA9IHBvaW50ZXJBcnJheS5zaGlmdCgpO1xuICAgICAgaWYgKHNjaGVtYS50eXBlID09PSAnb2JqZWN0JyB8fCBzY2hlbWEucHJvcGVydGllcyB8fCBzY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKChzY2hlbWEucHJvcGVydGllcyB8fCB7fSlbZmlyc3RLZXldKSB7XG4gICAgICAgICAgcmV0dXJuIGAvcHJvcGVydGllcy8ke3RoaXMuZXNjYXBlKGZpcnN0S2V5KX1gICtcbiAgICAgICAgICAgIHRoaXMudG9TY2hlbWFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hLnByb3BlcnRpZXNbZmlyc3RLZXldKTtcbiAgICAgICAgfSBlbHNlICBpZiAoc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgcmV0dXJuICcvYWRkaXRpb25hbFByb3BlcnRpZXMnICtcbiAgICAgICAgICAgIHRoaXMudG9TY2hlbWFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKChzY2hlbWEudHlwZSA9PT0gJ2FycmF5JyB8fCBzY2hlbWEuaXRlbXMpICYmXG4gICAgICAgIChpc051bWJlcihmaXJzdEtleSkgfHwgZmlyc3RLZXkgPT09ICctJyB8fCBmaXJzdEtleSA9PT0gJycpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgYXJyYXlJdGVtID0gZmlyc3RLZXkgPT09ICctJyB8fCBmaXJzdEtleSA9PT0gJycgPyAwIDogK2ZpcnN0S2V5O1xuICAgICAgICBpZiAoaXNBcnJheShzY2hlbWEuaXRlbXMpKSB7XG4gICAgICAgICAgaWYgKGFycmF5SXRlbSA8IHNjaGVtYS5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnL2l0ZW1zLycgKyBhcnJheUl0ZW0gK1xuICAgICAgICAgICAgICB0aGlzLnRvU2NoZW1hUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYS5pdGVtc1thcnJheUl0ZW1dKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjaGVtYS5hZGRpdGlvbmFsSXRlbXMpIHtcbiAgICAgICAgICAgIHJldHVybiAnL2FkZGl0aW9uYWxJdGVtcycgK1xuICAgICAgICAgICAgICB0aGlzLnRvU2NoZW1hUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYS5hZGRpdGlvbmFsSXRlbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChzY2hlbWEuaXRlbXMpKSB7XG4gICAgICAgICAgcmV0dXJuICcvaXRlbXMnICsgdGhpcy50b1NjaGVtYVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWEuaXRlbXMpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHNjaGVtYS5hZGRpdGlvbmFsSXRlbXMpKSB7XG4gICAgICAgICAgcmV0dXJuICcvYWRkaXRpb25hbEl0ZW1zJyArXG4gICAgICAgICAgICB0aGlzLnRvU2NoZW1hUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYS5hZGRpdGlvbmFsSXRlbXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zb2xlLmVycm9yKGB0b1NjaGVtYVBvaW50ZXIgZXJyb3I6IERhdGEgcG9pbnRlciAke2RhdGFQb2ludGVyfSBgICtcbiAgICAgICAgYG5vdCBjb21wYXRpYmxlIHdpdGggc2NoZW1hICR7c2NoZW1hfWApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKGRhdGFQb2ludGVyKSkge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9TY2hlbWFQb2ludGVyIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtkYXRhUG9pbnRlcn1gKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzY2hlbWEgIT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGB0b1NjaGVtYVBvaW50ZXIgZXJyb3I6IEludmFsaWQgSlNPTiBTY2hlbWE6ICR7c2NoZW1hfWApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAndG9EYXRhUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhIEpTT04gUG9pbnRlciB0byBhIHN1Yi1zY2hlbWEgaW5zaWRlIGEgSlNPTiBzY2hlbWEgYW5kIHRoZSBzY2hlbWEuXG4gICAqXG4gICAqIElmIHBvc3NpYmxlLCByZXR1cm5zIGEgZ2VuZXJpYyBQb2ludGVyIHRvIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluc2lkZVxuICAgKiB0aGUgZGF0YSBvYmplY3QgZGVzY3JpYmVkIGJ5IHRoZSBKU09OIHNjaGVtYS5cbiAgICpcbiAgICogUmV0dXJucyBudWxsIGlmIHRoZSBzdWItc2NoZW1hIGlzIGluIGFuIGFtYmlndW91cyBsb2NhdGlvbiAoc3VjaCBhc1xuICAgKiBkZWZpbml0aW9ucyBvciBhZGRpdGlvbmFsUHJvcGVydGllcykgd2hlcmUgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVcbiAgICogbG9jYXRpb24gY2Fubm90IGJlIGRldGVybWluZWQuXG4gICAqXG4gICAqIC8vICB7IFBvaW50ZXIgfSBzY2hlbWFQb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpIHRvIGEgSlNPTiBzY2hlbWFcbiAgICogLy8gICBzY2hlbWEgLSB0aGUgSlNPTiBzY2hlbWFcbiAgICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvcnM/XG4gICAqIC8vIHsgUG9pbnRlciB9IC0gSlNPTiBQb2ludGVyIChzdHJpbmcpIHRvIHRoZSB2YWx1ZSBpbiB0aGUgZGF0YSBvYmplY3RcbiAgICovXG4gIHN0YXRpYyB0b0RhdGFQb2ludGVyKHNjaGVtYVBvaW50ZXIsIHNjaGVtYSwgZXJyb3JzID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy5pc0pzb25Qb2ludGVyKHNjaGVtYVBvaW50ZXIpICYmIHR5cGVvZiBzY2hlbWEgPT09ICdvYmplY3QnICYmXG4gICAgICB0aGlzLmhhcyhzY2hlbWEsIHNjaGVtYVBvaW50ZXIpXG4gICAgKSB7XG4gICAgICBjb25zdCBwb2ludGVyQXJyYXkgPSB0aGlzLnBhcnNlKHNjaGVtYVBvaW50ZXIpO1xuICAgICAgaWYgKCFwb2ludGVyQXJyYXkubGVuZ3RoKSB7IHJldHVybiAnJzsgfVxuICAgICAgbGV0IGRhdGFQb2ludGVyID0gJyc7XG4gICAgICBjb25zdCBmaXJzdEtleSA9IHBvaW50ZXJBcnJheS5zaGlmdCgpO1xuICAgICAgaWYgKGZpcnN0S2V5ID09PSAncHJvcGVydGllcycgfHxcbiAgICAgICAgKGZpcnN0S2V5ID09PSAnaXRlbXMnICYmIGlzQXJyYXkoc2NoZW1hLml0ZW1zKSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBzZWNvbmRLZXkgPSBwb2ludGVyQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgY29uc3QgcG9pbnRlclN1ZmZpeCA9IHRoaXMudG9EYXRhUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYVtmaXJzdEtleV1bc2Vjb25kS2V5XSk7XG4gICAgICAgIHJldHVybiBwb2ludGVyU3VmZml4ID09PSBudWxsID8gbnVsbCA6ICcvJyArIHNlY29uZEtleSArIHBvaW50ZXJTdWZmaXg7XG4gICAgICB9IGVsc2UgaWYgKGZpcnN0S2V5ID09PSAnYWRkaXRpb25hbEl0ZW1zJyB8fFxuICAgICAgICAoZmlyc3RLZXkgPT09ICdpdGVtcycgJiYgaXNPYmplY3Qoc2NoZW1hLml0ZW1zKSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBwb2ludGVyU3VmZml4ID0gdGhpcy50b0RhdGFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hW2ZpcnN0S2V5XSk7XG4gICAgICAgIHJldHVybiBwb2ludGVyU3VmZml4ID09PSBudWxsID8gbnVsbCA6ICcvLScgKyBwb2ludGVyU3VmZml4O1xuICAgICAgfSBlbHNlIGlmIChbJ2FsbE9mJywgJ2FueU9mJywgJ29uZU9mJ10uaW5jbHVkZXMoZmlyc3RLZXkpKSB7XG4gICAgICAgIGNvbnN0IHNlY29uZEtleSA9IHBvaW50ZXJBcnJheS5zaGlmdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy50b0RhdGFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hW2ZpcnN0S2V5XVtzZWNvbmRLZXldKTtcbiAgICAgIH0gZWxzZSBpZiAoZmlyc3RLZXkgPT09ICdub3QnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvRGF0YVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWFbZmlyc3RLZXldKTtcbiAgICAgIH0gZWxzZSBpZiAoWydjb250YWlucycsICdkZWZpbml0aW9ucycsICdkZXBlbmRlbmNpZXMnLCAnYWRkaXRpb25hbEl0ZW1zJyxcbiAgICAgICAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJywgJ3BhdHRlcm5Qcm9wZXJ0aWVzJywgJ3Byb3BlcnR5TmFtZXMnXS5pbmNsdWRlcyhmaXJzdEtleSlcbiAgICAgICkge1xuICAgICAgICBpZiAoZXJyb3JzKSB7IGNvbnNvbGUuZXJyb3IoYHRvRGF0YVBvaW50ZXIgZXJyb3I6IEFtYmlndW91cyBsb2NhdGlvbmApOyB9XG4gICAgICB9XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChlcnJvcnMpIHtcbiAgICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKHNjaGVtYVBvaW50ZXIpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYHRvRGF0YVBvaW50ZXIgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3NjaGVtYVBvaW50ZXJ9YCk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgdG9EYXRhUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFNjaGVtYTogJHtzY2hlbWF9YCk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgdG9EYXRhUG9pbnRlciBlcnJvcjogUG9pbnRlciAke3NjaGVtYVBvaW50ZXJ9IGludmFsaWQgZm9yIFNjaGVtYTogJHtzY2hlbWF9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICdwYXJzZU9iamVjdFBhdGgnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFBhcnNlcyBhIEphdmFTY3JpcHQgb2JqZWN0IHBhdGggaW50byBhbiBhcnJheSBvZiBrZXlzLCB3aGljaFxuICAgKiBjYW4gdGhlbiBiZSBwYXNzZWQgdG8gY29tcGlsZSgpIHRvIGNvbnZlcnQgaW50byBhIHN0cmluZyBKU09OIFBvaW50ZXIuXG4gICAqXG4gICAqIEJhc2VkIG9uIG1pa2UtbWFyY2FjY2kncyBleGNlbGxlbnQgb2JqZWN0cGF0aCBwYXJzZSBmdW5jdGlvbjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL21pa2UtbWFyY2FjY2kvb2JqZWN0cGF0aFxuICAgKlxuICAgKiAvLyAgeyBQb2ludGVyIH0gcGF0aCAtIFRoZSBvYmplY3QgcGF0aCB0byBwYXJzZVxuICAgKiAvLyB7IHN0cmluZ1tdIH0gLSBUaGUgcmVzdWx0aW5nIGFycmF5IG9mIGtleXNcbiAgICovXG4gIHN0YXRpYyBwYXJzZU9iamVjdFBhdGgocGF0aCkge1xuICAgIGlmIChpc0FycmF5KHBhdGgpKSB7IHJldHVybiA8c3RyaW5nW10+cGF0aDsgfVxuICAgIGlmICh0aGlzLmlzSnNvblBvaW50ZXIocGF0aCkpIHsgcmV0dXJuIHRoaXMucGFyc2UocGF0aCk7IH1cbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgbGV0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgd2hpbGUgKGluZGV4IDwgcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbmV4dERvdCA9IHBhdGguaW5kZXhPZignLicsIGluZGV4KTtcbiAgICAgICAgY29uc3QgbmV4dE9CID0gcGF0aC5pbmRleE9mKCdbJywgaW5kZXgpOyAvLyBuZXh0IG9wZW4gYnJhY2tldFxuICAgICAgICBpZiAobmV4dERvdCA9PT0gLTEgJiYgbmV4dE9CID09PSAtMSkgeyAvLyBsYXN0IGl0ZW1cbiAgICAgICAgICBwYXJ0cy5wdXNoKHBhdGguc2xpY2UoaW5kZXgpKTtcbiAgICAgICAgICBpbmRleCA9IHBhdGgubGVuZ3RoO1xuICAgICAgICB9IGVsc2UgaWYgKG5leHREb3QgIT09IC0xICYmIChuZXh0RG90IDwgbmV4dE9CIHx8IG5leHRPQiA9PT0gLTEpKSB7IC8vIGRvdCBub3RhdGlvblxuICAgICAgICAgIHBhcnRzLnB1c2gocGF0aC5zbGljZShpbmRleCwgbmV4dERvdCkpO1xuICAgICAgICAgIGluZGV4ID0gbmV4dERvdCArIDE7XG4gICAgICAgIH0gZWxzZSB7IC8vIGJyYWNrZXQgbm90YXRpb25cbiAgICAgICAgICBpZiAobmV4dE9CID4gaW5kZXgpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2gocGF0aC5zbGljZShpbmRleCwgbmV4dE9CKSk7XG4gICAgICAgICAgICBpbmRleCA9IG5leHRPQjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcXVvdGUgPSBwYXRoLmNoYXJBdChuZXh0T0IgKyAxKTtcbiAgICAgICAgICBpZiAocXVvdGUgPT09ICdcIicgfHwgcXVvdGUgPT09IFwiJ1wiKSB7IC8vIGVuY2xvc2luZyBxdW90ZXNcbiAgICAgICAgICAgIGxldCBuZXh0Q0IgPSBwYXRoLmluZGV4T2YocXVvdGUgKyAnXScsIG5leHRPQik7IC8vIG5leHQgY2xvc2UgYnJhY2tldFxuICAgICAgICAgICAgd2hpbGUgKG5leHRDQiAhPT0gLTEgJiYgcGF0aC5jaGFyQXQobmV4dENCIC0gMSkgPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICBuZXh0Q0IgPSBwYXRoLmluZGV4T2YocXVvdGUgKyAnXScsIG5leHRDQiArIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5leHRDQiA9PT0gLTEpIHsgbmV4dENCID0gcGF0aC5sZW5ndGg7IH1cbiAgICAgICAgICAgIHBhcnRzLnB1c2gocGF0aC5zbGljZShpbmRleCArIDIsIG5leHRDQilcbiAgICAgICAgICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXCcgKyBxdW90ZSwgJ2cnKSwgcXVvdGUpKTtcbiAgICAgICAgICAgIGluZGV4ID0gbmV4dENCICsgMjtcbiAgICAgICAgICB9IGVsc2UgeyAvLyBubyBlbmNsb3NpbmcgcXVvdGVzXG4gICAgICAgICAgICBsZXQgbmV4dENCID0gcGF0aC5pbmRleE9mKCddJywgbmV4dE9CKTsgLy8gbmV4dCBjbG9zZSBicmFja2V0XG4gICAgICAgICAgICBpZiAobmV4dENCID09PSAtMSkgeyBuZXh0Q0IgPSBwYXRoLmxlbmd0aDsgfVxuICAgICAgICAgICAgcGFydHMucHVzaChwYXRoLnNsaWNlKGluZGV4ICsgMSwgbmV4dENCKSk7XG4gICAgICAgICAgICBpbmRleCA9IG5leHRDQiArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwYXRoLmNoYXJBdChpbmRleCkgPT09ICcuJykgeyBpbmRleCsrOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJ0cztcbiAgICB9XG4gICAgY29uc29sZS5lcnJvcigncGFyc2VPYmplY3RQYXRoIGVycm9yOiBJbnB1dCBvYmplY3QgcGF0aCBtdXN0IGJlIGEgc3RyaW5nLicpO1xuICB9XG59XG4iXX0=