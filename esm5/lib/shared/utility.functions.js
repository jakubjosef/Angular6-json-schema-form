/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { hasValue, inArray, isArray, isDefined, isObject, isEmpty, isMap, isSet, isString } from './validator.functions';
/**
 * 'addClasses' function
 *
 * Merges two space-delimited lists of CSS classes and removes duplicates.
 *
 * // {string | string[] | Set<string>} oldClasses
 * // {string | string[] | Set<string>} newClasses
 * // {string | string[] | Set<string>} - Combined classes
 * @param {?} oldClasses
 * @param {?} newClasses
 * @return {?}
 */
export function addClasses(oldClasses, newClasses) {
    /** @type {?} */
    var badType = function (i) { return !isSet(i) && !isArray(i) && !isString(i); };
    if (badType(newClasses)) {
        return oldClasses;
    }
    if (badType(oldClasses)) {
        oldClasses = '';
    }
    /** @type {?} */
    var toSet = function (i) { return isSet(i) ? i : isArray(i) ? new Set(i) : new Set(i.split(' ')); };
    /** @type {?} */
    var combinedSet = toSet(oldClasses);
    /** @type {?} */
    var newSet = toSet(newClasses);
    newSet.forEach(function (c) { return combinedSet.add(c); });
    if (isSet(oldClasses)) {
        return combinedSet;
    }
    if (isArray(oldClasses)) {
        return Array.from(combinedSet);
    }
    return Array.from(combinedSet).join(' ');
}
/**
 * 'copy' function
 *
 * Makes a shallow copy of a JavaScript object, array, Map, or Set.
 * If passed a JavaScript primitive value (string, number, boolean, or null),
 * it returns the value.
 *
 * // {Object|Array|string|number|boolean|null} object - The object to copy
 * // {boolean = false} errors - Show errors?
 * // {Object|Array|string|number|boolean|null} - The copied object
 * @param {?} object
 * @param {?=} errors
 * @return {?}
 */
export function copy(object, errors) {
    if (errors === void 0) { errors = false; }
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    if (isMap(object)) {
        return new Map(object);
    }
    if (isSet(object)) {
        return new Set(object);
    }
    if (isArray(object)) {
        return tslib_1.__spread(object);
    }
    if (isObject(object)) {
        return tslib_1.__assign({}, object);
    }
    if (errors) {
        console.error('copy error: Object to copy must be a JavaScript object or value.');
    }
    return object;
}
/**
 * 'forEach' function
 *
 * Iterates over all items in the first level of an object or array
 * and calls an iterator funciton on each item.
 *
 * The iterator function is called with four values:
 * 1. The current item's value
 * 2. The current item's key
 * 3. The parent object, which contains the current item
 * 4. The root object
 *
 * Setting the optional third parameter to 'top-down' or 'bottom-up' will cause
 * it to also recursively iterate over items in sub-objects or sub-arrays in the
 * specified direction.
 *
 * // {Object|Array} object - The object or array to iterate over
 * // {function} fn - the iterator funciton to call on each item
 * // {boolean = false} errors - Show errors?
 * // {void}
 * @param {?} object
 * @param {?} fn
 * @param {?=} recurse
 * @param {?=} rootObject
 * @param {?=} errors
 * @return {?}
 */
export function forEach(object, fn, recurse, rootObject, errors) {
    if (recurse === void 0) { recurse = false; }
    if (rootObject === void 0) { rootObject = object; }
    if (errors === void 0) { errors = false; }
    if (isEmpty(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof fn === 'function') {
        try {
            for (var _a = tslib_1.__values(Object.keys(object)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                /** @type {?} */
                var value = object[key];
                if (recurse === 'bottom-up' && (isObject(value) || isArray(value))) {
                    forEach(value, fn, recurse, rootObject);
                }
                fn(value, key, object, rootObject);
                if (recurse === 'top-down' && (isObject(value) || isArray(value))) {
                    forEach(value, fn, recurse, rootObject);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEach error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEach error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
    var e_1, _c;
}
/**
 * 'forEachCopy' function
 *
 * Iterates over all items in the first level of an object or array
 * and calls an iterator function on each item. Returns a new object or array
 * with the same keys or indexes as the original, and values set to the results
 * of the iterator function.
 *
 * Does NOT recursively iterate over items in sub-objects or sub-arrays.
 *
 * // {Object | Array} object - The object or array to iterate over
 * // {function} fn - The iterator funciton to call on each item
 * // {boolean = false} errors - Show errors?
 * // {Object | Array} - The resulting object or array
 * @param {?} object
 * @param {?} fn
 * @param {?=} errors
 * @return {?}
 */
export function forEachCopy(object, fn, errors) {
    if (errors === void 0) { errors = false; }
    if (!hasValue(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof object !== 'function') {
        /** @type {?} */
        var newObject = isArray(object) ? [] : {};
        try {
            for (var _a = tslib_1.__values(Object.keys(object)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                newObject[key] = fn(object[key], key, object);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return newObject;
    }
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEachCopy error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEachCopy error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
    var e_2, _c;
}
/**
 * 'hasOwn' utility function
 *
 * Checks whether an object or array has a particular property.
 *
 * // {any} object - the object to check
 * // {string} property - the property to look for
 * // {boolean} - true if object has property, false if not
 * @param {?} object
 * @param {?} property
 * @return {?}
 */
export function hasOwn(object, property) {
    if (!object || !['number', 'string', 'symbol'].includes(typeof property) ||
        (!isObject(object) && !isArray(object) && !isMap(object) && !isSet(object))) {
        return false;
    }
    if (isMap(object) || isSet(object)) {
        return object.has(property);
    }
    if (typeof property === 'number') {
        if (isArray(object)) {
            return object[/** @type {?} */ (property)];
        }
        property = property + '';
    }
    return object.hasOwnProperty(property);
}
/**
 * 'mergeFilteredObject' utility function
 *
 * Shallowly merges two objects, setting key and values from source object
 * in target object, excluding specified keys.
 *
 * Optionally, it can also use functions to transform the key names and/or
 * the values of the merging object.
 *
 * // {PlainObject} targetObject - Target object to add keys and values to
 * // {PlainObject} sourceObject - Source object to copy keys and values from
 * // {string[]} excludeKeys - Array of keys to exclude
 * // {(string: string) => string = (k) => k} keyFn - Function to apply to keys
 * // {(any: any) => any = (v) => v} valueFn - Function to apply to values
 * // {PlainObject} - Returns targetObject
 * @param {?} targetObject
 * @param {?} sourceObject
 * @param {?=} excludeKeys
 * @param {?=} keyFn
 * @param {?=} valFn
 * @return {?}
 */
export function mergeFilteredObject(targetObject, sourceObject, excludeKeys, keyFn, valFn) {
    if (excludeKeys === void 0) { excludeKeys = /** @type {?} */ ([]); }
    if (keyFn === void 0) { keyFn = function (key) { return key; }; }
    if (valFn === void 0) { valFn = function (val) { return val; }; }
    if (!isObject(sourceObject)) {
        return targetObject;
    }
    if (!isObject(targetObject)) {
        targetObject = {};
    }
    try {
        for (var _a = tslib_1.__values(Object.keys(sourceObject)), _b = _a.next(); !_b.done; _b = _a.next()) {
            var key = _b.value;
            if (!inArray(key, excludeKeys) && isDefined(sourceObject[key])) {
                targetObject[keyFn(key)] = valFn(sourceObject[key]);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return targetObject;
    var e_3, _c;
}
/**
 * 'uniqueItems' function
 *
 * Accepts any number of string value inputs,
 * and returns an array of all input vaues, excluding duplicates.
 *
 * // {...string} ...items -
 * // {string[]} -
 * @param {...?} items
 * @return {?}
 */
export function uniqueItems() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    /** @type {?} */
    var returnItems = [];
    try {
        for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var item = items_1_1.value;
            if (!returnItems.includes(item)) {
                returnItems.push(item);
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return returnItems;
    var e_4, _a;
}
/**
 * 'commonItems' function
 *
 * Accepts any number of strings or arrays of string values,
 * and returns a single array containing only values present in all inputs.
 *
 * // {...string|string[]} ...arrays -
 * // {string[]} -
 * @param {...?} arrays
 * @return {?}
 */
export function commonItems() {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    /** @type {?} */
    var returnItems = null;
    var _loop_1 = function (array) {
        if (isString(array)) {
            array = [array];
        }
        returnItems = returnItems === null ? tslib_1.__spread(array) :
            returnItems.filter(function (item) { return array.includes(item); });
        if (!returnItems.length) {
            return { value: [] };
        }
    };
    try {
        for (var arrays_1 = tslib_1.__values(arrays), arrays_1_1 = arrays_1.next(); !arrays_1_1.done; arrays_1_1 = arrays_1.next()) {
            var array = arrays_1_1.value;
            var state_1 = _loop_1(array);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (arrays_1_1 && !arrays_1_1.done && (_a = arrays_1.return)) _a.call(arrays_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return returnItems;
    var e_5, _a;
}
/**
 * 'fixTitle' function
 *
 *
 * // {string} input -
 * // {string} -
 * @param {?} name
 * @return {?}
 */
export function fixTitle(name) {
    return name && toTitleCase(name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' '));
}
/**
 * 'toTitleCase' function
 *
 * Intelligently converts an input string to Title Case.
 *
 * Accepts an optional second parameter with a list of additional
 * words and abbreviations to force into a particular case.
 *
 * This function is built on prior work by John Gruber and David Gouch:
 * http://daringfireball.net/2008/08/title_case_update
 * https://github.com/gouch/to-title-case
 *
 * // {string} input -
 * // {string|string[]} forceWords? -
 * // {string} -
 * @param {?} input
 * @param {?=} forceWords
 * @return {?}
 */
export function toTitleCase(input, forceWords) {
    if (!isString(input)) {
        return input;
    }
    /** @type {?} */
    var forceArray = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en',
        'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'v.',
        'vs', 'vs.', 'via'];
    if (isString(forceWords)) {
        forceWords = (/** @type {?} */ (forceWords)).split('|');
    }
    if (isArray(forceWords)) {
        forceArray = forceArray.concat(forceWords);
    }
    /** @type {?} */
    var forceArrayLower = forceArray.map(function (w) { return w.toLowerCase(); });
    /** @type {?} */
    var noInitialCase = input === input.toUpperCase() || input === input.toLowerCase();
    /** @type {?} */
    var prevLastChar = '';
    input = input.trim();
    return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (word, idx) {
        if (!noInitialCase && word.slice(1).search(/[A-Z]|\../) !== -1) {
            return word;
        }
        else {
            /** @type {?} */
            var newWord = void 0;
            /** @type {?} */
            var forceWord = forceArray[forceArrayLower.indexOf(word.toLowerCase())];
            if (!forceWord) {
                if (noInitialCase) {
                    if (word.slice(1).search(/\../) !== -1) {
                        newWord = word.toLowerCase();
                    }
                    else {
                        newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
                    }
                }
                else {
                    newWord = word[0].toUpperCase() + word.slice(1);
                }
            }
            else if (forceWord === forceWord.toLowerCase() && (idx === 0 || idx + word.length === input.length ||
                prevLastChar === ':' || input[idx - 1].search(/[^\s-]/) !== -1 ||
                (input[idx - 1] !== '-' && input[idx + word.length] === '-'))) {
                newWord = forceWord[0].toUpperCase() + forceWord.slice(1);
            }
            else {
                newWord = forceWord;
            }
            prevLastChar = word.slice(-1);
            return newWord;
        }
    });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0eS5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC91dGlsaXR5LmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUN0RSxRQUFRLEVBQ1QsTUFBTSx1QkFBdUIsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWtCL0IsTUFBTSxxQkFDSixVQUEyQyxFQUMzQyxVQUEyQzs7SUFFM0MsSUFBTSxPQUFPLEdBQUcsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBeEMsQ0FBd0MsQ0FBQztJQUM5RCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztLQUFFO0lBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0tBQUU7O0lBQzdDLElBQU0sS0FBSyxHQUFHLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBOUQsQ0FBOEQsQ0FBQzs7SUFDbEYsSUFBTSxXQUFXLEdB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QUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBRWhFLENBQUMsQ0FBQyxDQUFDO2dCQUNELE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMzRDtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE9BQU8sR0FBRyxTQUFTLENBQUM7YUFDckI7WUFDRCxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDaEI7S0FDRixDQUFDLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGhhc1ZhbHVlLCBpbkFycmF5LCBpc0FycmF5LCBpc0RlZmluZWQsIGlzT2JqZWN0LCBpc0VtcHR5LCBpc01hcCwgaXNTZXQsXG4gIGlzU3RyaW5nLCBQbGFpbk9iamVjdFxufSBmcm9tICcuL3ZhbGlkYXRvci5mdW5jdGlvbnMnO1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb24gbGlicmFyeTpcbiAqXG4gKiBhZGRDbGFzc2VzLCBjb3B5LCBmb3JFYWNoLCBmb3JFYWNoQ29weSwgaGFzT3duLCBtZXJnZUZpbHRlcmVkT2JqZWN0LFxuICogdW5pcXVlSXRlbXMsIGNvbW1vbkl0ZW1zLCBmaXhUaXRsZSwgdG9UaXRsZUNhc2VcbiovXG5cbi8qKlxuICogJ2FkZENsYXNzZXMnIGZ1bmN0aW9uXG4gKlxuICogTWVyZ2VzIHR3byBzcGFjZS1kZWxpbWl0ZWQgbGlzdHMgb2YgQ1NTIGNsYXNzZXMgYW5kIHJlbW92ZXMgZHVwbGljYXRlcy5cbiAqXG4gKiAvLyB7c3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPn0gb2xkQ2xhc3Nlc1xuICogLy8ge3N0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz59IG5ld0NsYXNzZXNcbiAqIC8vIHtzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+fSAtIENvbWJpbmVkIGNsYXNzZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZENsYXNzZXMoXG4gIG9sZENsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4sXG4gIG5ld0NsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz5cbik6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4ge1xuICBjb25zdCBiYWRUeXBlID0gaSA9PiAhaXNTZXQoaSkgJiYgIWlzQXJyYXkoaSkgJiYgIWlzU3RyaW5nKGkpO1xuICBpZiAoYmFkVHlwZShuZXdDbGFzc2VzKSkgeyByZXR1cm4gb2xkQ2xhc3NlczsgfVxuICBpZiAoYmFkVHlwZShvbGRDbGFzc2VzKSkgeyBvbGRDbGFzc2VzID0gJyc7IH1cbiAgY29uc3QgdG9TZXQgPSBpID0+IGlzU2V0KGkpID8gaSA6IGlzQXJyYXkoaSkgPyBuZXcgU2V0KGkpIDogbmV3IFNldChpLnNwbGl0KCcgJykpO1xuICBjb25zdCBjb21iaW5lZFNldDogU2V0PGFueT4gPSB0b1NldChvbGRDbGFzc2VzKTtcbiAgY29uc3QgbmV3U2V0OiBTZXQ8YW55PiA9IHRvU2V0KG5ld0NsYXNzZXMpO1xuICBuZXdTZXQuZm9yRWFjaChjID0+IGNvbWJpbmVkU2V0LmFkZChjKSk7XG4gIGlmIChpc1NldChvbGRDbGFzc2VzKSkgeyByZXR1cm4gY29tYmluZWRTZXQ7IH1cbiAgaWYgKGlzQXJyYXkob2xkQ2xhc3NlcykpIHsgcmV0dXJuIEFycmF5LmZyb20oY29tYmluZWRTZXQpOyB9XG4gIHJldHVybiBBcnJheS5mcm9tKGNvbWJpbmVkU2V0KS5qb2luKCcgJyk7XG59XG5cbi8qKlxuICogJ2NvcHknIGZ1bmN0aW9uXG4gKlxuICogTWFrZXMgYSBzaGFsbG93IGNvcHkgb2YgYSBKYXZhU2NyaXB0IG9iamVjdCwgYXJyYXksIE1hcCwgb3IgU2V0LlxuICogSWYgcGFzc2VkIGEgSmF2YVNjcmlwdCBwcmltaXRpdmUgdmFsdWUgKHN0cmluZywgbnVtYmVyLCBib29sZWFuLCBvciBudWxsKSxcbiAqIGl0IHJldHVybnMgdGhlIHZhbHVlLlxuICpcbiAqIC8vIHtPYmplY3R8QXJyYXl8c3RyaW5nfG51bWJlcnxib29sZWFufG51bGx9IG9iamVjdCAtIFRoZSBvYmplY3QgdG8gY29weVxuICogLy8ge2Jvb2xlYW4gPSBmYWxzZX0gZXJyb3JzIC0gU2hvdyBlcnJvcnM/XG4gKiAvLyB7T2JqZWN0fEFycmF5fHN0cmluZ3xudW1iZXJ8Ym9vbGVhbnxudWxsfSAtIFRoZSBjb3BpZWQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5KG9iamVjdDogYW55LCBlcnJvcnMgPSBmYWxzZSk6IGFueSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ICE9PSAnb2JqZWN0JyB8fCBvYmplY3QgPT09IG51bGwpIHsgcmV0dXJuIG9iamVjdDsgfVxuICBpZiAoaXNNYXAob2JqZWN0KSkgICAgeyByZXR1cm4gbmV3IE1hcChvYmplY3QpOyB9XG4gIGlmIChpc1NldChvYmplY3QpKSAgICB7IHJldHVybiBuZXcgU2V0KG9iamVjdCk7IH1cbiAgaWYgKGlzQXJyYXkob2JqZWN0KSkgIHsgcmV0dXJuIFsgLi4ub2JqZWN0IF07ICAgfVxuICBpZiAoaXNPYmplY3Qob2JqZWN0KSkgeyByZXR1cm4geyAuLi5vYmplY3QgfTsgICB9XG4gIGlmIChlcnJvcnMpIHtcbiAgICBjb25zb2xlLmVycm9yKCdjb3B5IGVycm9yOiBPYmplY3QgdG8gY29weSBtdXN0IGJlIGEgSmF2YVNjcmlwdCBvYmplY3Qgb3IgdmFsdWUuJyk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxuLyoqXG4gKiAnZm9yRWFjaCcgZnVuY3Rpb25cbiAqXG4gKiBJdGVyYXRlcyBvdmVyIGFsbCBpdGVtcyBpbiB0aGUgZmlyc3QgbGV2ZWwgb2YgYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBhbmQgY2FsbHMgYW4gaXRlcmF0b3IgZnVuY2l0b24gb24gZWFjaCBpdGVtLlxuICpcbiAqIFRoZSBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBmb3VyIHZhbHVlczpcbiAqIDEuIFRoZSBjdXJyZW50IGl0ZW0ncyB2YWx1ZVxuICogMi4gVGhlIGN1cnJlbnQgaXRlbSdzIGtleVxuICogMy4gVGhlIHBhcmVudCBvYmplY3QsIHdoaWNoIGNvbnRhaW5zIHRoZSBjdXJyZW50IGl0ZW1cbiAqIDQuIFRoZSByb290IG9iamVjdFxuICpcbiAqIFNldHRpbmcgdGhlIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlciB0byAndG9wLWRvd24nIG9yICdib3R0b20tdXAnIHdpbGwgY2F1c2VcbiAqIGl0IHRvIGFsc28gcmVjdXJzaXZlbHkgaXRlcmF0ZSBvdmVyIGl0ZW1zIGluIHN1Yi1vYmplY3RzIG9yIHN1Yi1hcnJheXMgaW4gdGhlXG4gKiBzcGVjaWZpZWQgZGlyZWN0aW9uLlxuICpcbiAqIC8vIHtPYmplY3R8QXJyYXl9IG9iamVjdCAtIFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyXG4gKiAvLyB7ZnVuY3Rpb259IGZuIC0gdGhlIGl0ZXJhdG9yIGZ1bmNpdG9uIHRvIGNhbGwgb24gZWFjaCBpdGVtXG4gKiAvLyB7Ym9vbGVhbiA9IGZhbHNlfSBlcnJvcnMgLSBTaG93IGVycm9ycz9cbiAqIC8vIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaChcbiAgb2JqZWN0OiBhbnksIGZuOiAodjogYW55LCBrPzogc3RyaW5nIHwgbnVtYmVyLCBjPzogYW55LCByYz86IGFueSkgPT4gYW55LFxuICByZWN1cnNlOiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2UsIHJvb3RPYmplY3Q6IGFueSA9IG9iamVjdCwgZXJyb3JzID0gZmFsc2Vcbik6IHZvaWQge1xuICBpZiAoaXNFbXB0eShvYmplY3QpKSB7IHJldHVybjsgfVxuICBpZiAoKGlzT2JqZWN0KG9iamVjdCkgfHwgaXNBcnJheShvYmplY3QpKSAmJiB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3QpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgaWYgKHJlY3Vyc2UgPT09ICdib3R0b20tdXAnICYmIChpc09iamVjdCh2YWx1ZSkgfHwgaXNBcnJheSh2YWx1ZSkpKSB7XG4gICAgICAgIGZvckVhY2godmFsdWUsIGZuLCByZWN1cnNlLCByb290T2JqZWN0KTtcbiAgICAgIH1cbiAgICAgIGZuKHZhbHVlLCBrZXksIG9iamVjdCwgcm9vdE9iamVjdCk7XG4gICAgICBpZiAocmVjdXJzZSA9PT0gJ3RvcC1kb3duJyAmJiAoaXNPYmplY3QodmFsdWUpIHx8IGlzQXJyYXkodmFsdWUpKSkge1xuICAgICAgICBmb3JFYWNoKHZhbHVlLCBmbiwgcmVjdXJzZSwgcm9vdE9iamVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChlcnJvcnMpIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdmb3JFYWNoIGVycm9yOiBJdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgICBjb25zb2xlLmVycm9yKCdmdW5jdGlvbicsIGZuKTtcbiAgICB9XG4gICAgaWYgKCFpc09iamVjdChvYmplY3QpICYmICFpc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ZvckVhY2ggZXJyb3I6IElucHV0IG9iamVjdCBtdXN0IGJlIGFuIG9iamVjdCBvciBhcnJheS4nKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ29iamVjdCcsIG9iamVjdCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogJ2ZvckVhY2hDb3B5JyBmdW5jdGlvblxuICpcbiAqIEl0ZXJhdGVzIG92ZXIgYWxsIGl0ZW1zIGluIHRoZSBmaXJzdCBsZXZlbCBvZiBhbiBvYmplY3Qgb3IgYXJyYXlcbiAqIGFuZCBjYWxscyBhbiBpdGVyYXRvciBmdW5jdGlvbiBvbiBlYWNoIGl0ZW0uIFJldHVybnMgYSBuZXcgb2JqZWN0IG9yIGFycmF5XG4gKiB3aXRoIHRoZSBzYW1lIGtleXMgb3IgaW5kZXhlcyBhcyB0aGUgb3JpZ2luYWwsIGFuZCB2YWx1ZXMgc2V0IHRvIHRoZSByZXN1bHRzXG4gKiBvZiB0aGUgaXRlcmF0b3IgZnVuY3Rpb24uXG4gKlxuICogRG9lcyBOT1QgcmVjdXJzaXZlbHkgaXRlcmF0ZSBvdmVyIGl0ZW1zIGluIHN1Yi1vYmplY3RzIG9yIHN1Yi1hcnJheXMuXG4gKlxuICogLy8ge09iamVjdCB8IEFycmF5fSBvYmplY3QgLSBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGl0ZXJhdGUgb3ZlclxuICogLy8ge2Z1bmN0aW9ufSBmbiAtIFRoZSBpdGVyYXRvciBmdW5jaXRvbiB0byBjYWxsIG9uIGVhY2ggaXRlbVxuICogLy8ge2Jvb2xlYW4gPSBmYWxzZX0gZXJyb3JzIC0gU2hvdyBlcnJvcnM/XG4gKiAvLyB7T2JqZWN0IHwgQXJyYXl9IC0gVGhlIHJlc3VsdGluZyBvYmplY3Qgb3IgYXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2hDb3B5KFxuICBvYmplY3Q6IGFueSwgZm46ICh2OiBhbnksIGs/OiBzdHJpbmcgfCBudW1iZXIsIG8/OiBhbnksIHA/OiBzdHJpbmcpID0+IGFueSxcbiAgZXJyb3JzID0gZmFsc2Vcbik6IGFueSB7XG4gIGlmICghaGFzVmFsdWUob2JqZWN0KSkgeyByZXR1cm47IH1cbiAgaWYgKChpc09iamVjdChvYmplY3QpIHx8IGlzQXJyYXkob2JqZWN0KSkgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnN0IG5ld09iamVjdDogYW55ID0gaXNBcnJheShvYmplY3QpID8gW10gOiB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3QpKSB7XG4gICAgICBuZXdPYmplY3Rba2V5XSA9IGZuKG9iamVjdFtrZXldLCBrZXksIG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cbiAgaWYgKGVycm9ycykge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ZvckVhY2hDb3B5IGVycm9yOiBJdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgICBjb25zb2xlLmVycm9yKCdmdW5jdGlvbicsIGZuKTtcbiAgICB9XG4gICAgaWYgKCFpc09iamVjdChvYmplY3QpICYmICFpc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ZvckVhY2hDb3B5IGVycm9yOiBJbnB1dCBvYmplY3QgbXVzdCBiZSBhbiBvYmplY3Qgb3IgYXJyYXkuJyk7XG4gICAgICBjb25zb2xlLmVycm9yKCdvYmplY3QnLCBvYmplY3QpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqICdoYXNPd24nIHV0aWxpdHkgZnVuY3Rpb25cbiAqXG4gKiBDaGVja3Mgd2hldGhlciBhbiBvYmplY3Qgb3IgYXJyYXkgaGFzIGEgcGFydGljdWxhciBwcm9wZXJ0eS5cbiAqXG4gKiAvLyB7YW55fSBvYmplY3QgLSB0aGUgb2JqZWN0IHRvIGNoZWNrXG4gKiAvLyB7c3RyaW5nfSBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eSB0byBsb29rIGZvclxuICogLy8ge2Jvb2xlYW59IC0gdHJ1ZSBpZiBvYmplY3QgaGFzIHByb3BlcnR5LCBmYWxzZSBpZiBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc093bihvYmplY3Q6IGFueSwgcHJvcGVydHk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAoIW9iamVjdCB8fCAhWydudW1iZXInLCAnc3RyaW5nJywgJ3N5bWJvbCddLmluY2x1ZGVzKHR5cGVvZiBwcm9wZXJ0eSkgfHxcbiAgICAoIWlzT2JqZWN0KG9iamVjdCkgJiYgIWlzQXJyYXkob2JqZWN0KSAmJiAhaXNNYXAob2JqZWN0KSAmJiAhaXNTZXQob2JqZWN0KSlcbiAgKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoaXNNYXAob2JqZWN0KSB8fCBpc1NldChvYmplY3QpKSB7IHJldHVybiBvYmplY3QuaGFzKHByb3BlcnR5KTsgfVxuICBpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnbnVtYmVyJykge1xuICAgIGlmIChpc0FycmF5KG9iamVjdCkpIHsgcmV0dXJuIG9iamVjdFs8bnVtYmVyPnByb3BlcnR5XTsgfVxuICAgIHByb3BlcnR5ID0gcHJvcGVydHkgKyAnJztcbiAgfVxuICByZXR1cm4gb2JqZWN0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KTtcbn1cblxuLyoqXG4gKiAnbWVyZ2VGaWx0ZXJlZE9iamVjdCcgdXRpbGl0eSBmdW5jdGlvblxuICpcbiAqIFNoYWxsb3dseSBtZXJnZXMgdHdvIG9iamVjdHMsIHNldHRpbmcga2V5IGFuZCB2YWx1ZXMgZnJvbSBzb3VyY2Ugb2JqZWN0XG4gKiBpbiB0YXJnZXQgb2JqZWN0LCBleGNsdWRpbmcgc3BlY2lmaWVkIGtleXMuXG4gKlxuICogT3B0aW9uYWxseSwgaXQgY2FuIGFsc28gdXNlIGZ1bmN0aW9ucyB0byB0cmFuc2Zvcm0gdGhlIGtleSBuYW1lcyBhbmQvb3JcbiAqIHRoZSB2YWx1ZXMgb2YgdGhlIG1lcmdpbmcgb2JqZWN0LlxuICpcbiAqIC8vIHtQbGFpbk9iamVjdH0gdGFyZ2V0T2JqZWN0IC0gVGFyZ2V0IG9iamVjdCB0byBhZGQga2V5cyBhbmQgdmFsdWVzIHRvXG4gKiAvLyB7UGxhaW5PYmplY3R9IHNvdXJjZU9iamVjdCAtIFNvdXJjZSBvYmplY3QgdG8gY29weSBrZXlzIGFuZCB2YWx1ZXMgZnJvbVxuICogLy8ge3N0cmluZ1tdfSBleGNsdWRlS2V5cyAtIEFycmF5IG9mIGtleXMgdG8gZXhjbHVkZVxuICogLy8geyhzdHJpbmc6IHN0cmluZykgPT4gc3RyaW5nID0gKGspID0+IGt9IGtleUZuIC0gRnVuY3Rpb24gdG8gYXBwbHkgdG8ga2V5c1xuICogLy8geyhhbnk6IGFueSkgPT4gYW55ID0gKHYpID0+IHZ9IHZhbHVlRm4gLSBGdW5jdGlvbiB0byBhcHBseSB0byB2YWx1ZXNcbiAqIC8vIHtQbGFpbk9iamVjdH0gLSBSZXR1cm5zIHRhcmdldE9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VGaWx0ZXJlZE9iamVjdChcbiAgdGFyZ2V0T2JqZWN0OiBQbGFpbk9iamVjdCxcbiAgc291cmNlT2JqZWN0OiBQbGFpbk9iamVjdCxcbiAgZXhjbHVkZUtleXMgPSA8c3RyaW5nW10+W10sXG4gIGtleUZuID0gKGtleTogc3RyaW5nKTogc3RyaW5nID0+IGtleSxcbiAgdmFsRm4gPSAodmFsOiBhbnkpOiBhbnkgPT4gdmFsXG4pOiBQbGFpbk9iamVjdCB7XG4gIGlmICghaXNPYmplY3Qoc291cmNlT2JqZWN0KSkgeyByZXR1cm4gdGFyZ2V0T2JqZWN0OyB9XG4gIGlmICghaXNPYmplY3QodGFyZ2V0T2JqZWN0KSkgeyB0YXJnZXRPYmplY3QgPSB7fTsgfVxuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2VPYmplY3QpKSB7XG4gICAgaWYgKCFpbkFycmF5KGtleSwgZXhjbHVkZUtleXMpICYmIGlzRGVmaW5lZChzb3VyY2VPYmplY3Rba2V5XSkpIHtcbiAgICAgIHRhcmdldE9iamVjdFtrZXlGbihrZXkpXSA9IHZhbEZuKHNvdXJjZU9iamVjdFtrZXldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldE9iamVjdDtcbn1cblxuLyoqXG4gKiAndW5pcXVlSXRlbXMnIGZ1bmN0aW9uXG4gKlxuICogQWNjZXB0cyBhbnkgbnVtYmVyIG9mIHN0cmluZyB2YWx1ZSBpbnB1dHMsXG4gKiBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBhbGwgaW5wdXQgdmF1ZXMsIGV4Y2x1ZGluZyBkdXBsaWNhdGVzLlxuICpcbiAqIC8vIHsuLi5zdHJpbmd9IC4uLml0ZW1zIC1cbiAqIC8vIHtzdHJpbmdbXX0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcXVlSXRlbXMoLi4uaXRlbXMpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHJldHVybkl0ZW1zID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgIGlmICghcmV0dXJuSXRlbXMuaW5jbHVkZXMoaXRlbSkpIHsgcmV0dXJuSXRlbXMucHVzaChpdGVtKTsgfVxuICB9XG4gIHJldHVybiByZXR1cm5JdGVtcztcbn1cblxuLyoqXG4gKiAnY29tbW9uSXRlbXMnIGZ1bmN0aW9uXG4gKlxuICogQWNjZXB0cyBhbnkgbnVtYmVyIG9mIHN0cmluZ3Mgb3IgYXJyYXlzIG9mIHN0cmluZyB2YWx1ZXMsXG4gKiBhbmQgcmV0dXJucyBhIHNpbmdsZSBhcnJheSBjb250YWluaW5nIG9ubHkgdmFsdWVzIHByZXNlbnQgaW4gYWxsIGlucHV0cy5cbiAqXG4gKiAvLyB7Li4uc3RyaW5nfHN0cmluZ1tdfSAuLi5hcnJheXMgLVxuICogLy8ge3N0cmluZ1tdfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21tb25JdGVtcyguLi5hcnJheXMpOiBzdHJpbmdbXSB7XG4gIGxldCByZXR1cm5JdGVtcyA9IG51bGw7XG4gIGZvciAobGV0IGFycmF5IG9mIGFycmF5cykge1xuICAgIGlmIChpc1N0cmluZyhhcnJheSkpIHsgYXJyYXkgPSBbYXJyYXldOyB9XG4gICAgcmV0dXJuSXRlbXMgPSByZXR1cm5JdGVtcyA9PT0gbnVsbCA/IFsgLi4uYXJyYXkgXSA6XG4gICAgICByZXR1cm5JdGVtcy5maWx0ZXIoaXRlbSA9PiBhcnJheS5pbmNsdWRlcyhpdGVtKSk7XG4gICAgaWYgKCFyZXR1cm5JdGVtcy5sZW5ndGgpIHsgcmV0dXJuIFtdOyB9XG4gIH1cbiAgcmV0dXJuIHJldHVybkl0ZW1zO1xufVxuXG4vKipcbiAqICdmaXhUaXRsZScgZnVuY3Rpb25cbiAqXG4gKlxuICogLy8ge3N0cmluZ30gaW5wdXQgLVxuICogLy8ge3N0cmluZ30gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gZml4VGl0bGUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUgJiYgdG9UaXRsZUNhc2UobmFtZS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS5yZXBsYWNlKC9fL2csICcgJykpO1xufVxuXG4vKipcbiAqICd0b1RpdGxlQ2FzZScgZnVuY3Rpb25cbiAqXG4gKiBJbnRlbGxpZ2VudGx5IGNvbnZlcnRzIGFuIGlucHV0IHN0cmluZyB0byBUaXRsZSBDYXNlLlxuICpcbiAqIEFjY2VwdHMgYW4gb3B0aW9uYWwgc2Vjb25kIHBhcmFtZXRlciB3aXRoIGEgbGlzdCBvZiBhZGRpdGlvbmFsXG4gKiB3b3JkcyBhbmQgYWJicmV2aWF0aW9ucyB0byBmb3JjZSBpbnRvIGEgcGFydGljdWxhciBjYXNlLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgYnVpbHQgb24gcHJpb3Igd29yayBieSBKb2huIEdydWJlciBhbmQgRGF2aWQgR291Y2g6XG4gKiBodHRwOi8vZGFyaW5nZmlyZWJhbGwubmV0LzIwMDgvMDgvdGl0bGVfY2FzZV91cGRhdGVcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3VjaC90by10aXRsZS1jYXNlXG4gKlxuICogLy8ge3N0cmluZ30gaW5wdXQgLVxuICogLy8ge3N0cmluZ3xzdHJpbmdbXX0gZm9yY2VXb3Jkcz8gLVxuICogLy8ge3N0cmluZ30gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9UaXRsZUNhc2UoaW5wdXQ6IHN0cmluZywgZm9yY2VXb3Jkcz86IHN0cmluZ3xzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGlmICghaXNTdHJpbmcoaW5wdXQpKSB7IHJldHVybiBpbnB1dDsgfVxuICBsZXQgZm9yY2VBcnJheTogc3RyaW5nW10gPSBbJ2EnLCAnYW4nLCAnYW5kJywgJ2FzJywgJ2F0JywgJ2J1dCcsICdieScsICdlbicsXG4gICAnZm9yJywgJ2lmJywgJ2luJywgJ25vcicsICdvZicsICdvbicsICdvcicsICdwZXInLCAndGhlJywgJ3RvJywgJ3YnLCAndi4nLFxuICAgJ3ZzJywgJ3ZzLicsICd2aWEnXTtcbiAgaWYgKGlzU3RyaW5nKGZvcmNlV29yZHMpKSB7IGZvcmNlV29yZHMgPSAoPHN0cmluZz5mb3JjZVdvcmRzKS5zcGxpdCgnfCcpOyB9XG4gIGlmIChpc0FycmF5KGZvcmNlV29yZHMpKSB7IGZvcmNlQXJyYXkgPSBmb3JjZUFycmF5LmNvbmNhdChmb3JjZVdvcmRzKTsgfVxuICBjb25zdCBmb3JjZUFycmF5TG93ZXI6IHN0cmluZ1tdID0gZm9yY2VBcnJheS5tYXAodyA9PiB3LnRvTG93ZXJDYXNlKCkpO1xuICBjb25zdCBub0luaXRpYWxDYXNlOiBib29sZWFuID1cbiAgICBpbnB1dCA9PT0gaW5wdXQudG9VcHBlckNhc2UoKSB8fCBpbnB1dCA9PT0gaW5wdXQudG9Mb3dlckNhc2UoKTtcbiAgbGV0IHByZXZMYXN0Q2hhciA9ICcnO1xuICBpbnB1dCA9IGlucHV0LnRyaW0oKTtcbiAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1tBLVphLXowLTlcXHUwMEMwLVxcdTAwRkZdK1teXFxzLV0qL2csICh3b3JkLCBpZHgpID0+IHtcbiAgICBpZiAoIW5vSW5pdGlhbENhc2UgJiYgd29yZC5zbGljZSgxKS5zZWFyY2goL1tBLVpdfFxcLi4vKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB3b3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3V29yZDogc3RyaW5nO1xuICAgICAgY29uc3QgZm9yY2VXb3JkOiBzdHJpbmcgPVxuICAgICAgICBmb3JjZUFycmF5W2ZvcmNlQXJyYXlMb3dlci5pbmRleE9mKHdvcmQudG9Mb3dlckNhc2UoKSldO1xuICAgICAgaWYgKCFmb3JjZVdvcmQpIHtcbiAgICAgICAgaWYgKG5vSW5pdGlhbENhc2UpIHtcbiAgICAgICAgICBpZiAod29yZC5zbGljZSgxKS5zZWFyY2goL1xcLi4vKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIG5ld1dvcmQgPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1dvcmQgPSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1dvcmQgPSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBmb3JjZVdvcmQgPT09IGZvcmNlV29yZC50b0xvd2VyQ2FzZSgpICYmIChcbiAgICAgICAgICBpZHggPT09IDAgfHwgaWR4ICsgd29yZC5sZW5ndGggPT09IGlucHV0Lmxlbmd0aCB8fFxuICAgICAgICAgIHByZXZMYXN0Q2hhciA9PT0gJzonIHx8IGlucHV0W2lkeCAtIDFdLnNlYXJjaCgvW15cXHMtXS8pICE9PSAtMSB8fFxuICAgICAgICAgIChpbnB1dFtpZHggLSAxXSAhPT0gJy0nICYmIGlucHV0W2lkeCArIHdvcmQubGVuZ3RoXSA9PT0gJy0nKVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgbmV3V29yZCA9IGZvcmNlV29yZFswXS50b1VwcGVyQ2FzZSgpICsgZm9yY2VXb3JkLnNsaWNlKDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3V29yZCA9IGZvcmNlV29yZDtcbiAgICAgIH1cbiAgICAgIHByZXZMYXN0Q2hhciA9IHdvcmQuc2xpY2UoLTEpO1xuICAgICAgcmV0dXJuIG5ld1dvcmQ7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==