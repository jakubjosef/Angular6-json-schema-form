/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { _executeValidators, _executeAsyncValidators, _mergeObjects, _mergeErrors, isEmpty, isDefined, hasValue, isString, isNumber, isBoolean, isArray, getType, isType, toJavaScriptType, toObservable, xor } from './validator.functions';
import { forEachCopy } from './utility.functions';
import { jsonSchemaFormatTests } from './format-regex.constants';
/**
 * 'JsonValidators' class
 *
 * Provides an extended set of validators to be used by form controls,
 * compatible with standard JSON Schema validation options.
 * http://json-schema.org/latest/json-schema-validation.html
 *
 * Note: This library is designed as a drop-in replacement for the Angular
 * Validators library, and except for one small breaking change to the 'pattern'
 * validator (described below) it can even be imported as a substitute, like so:
 *
 *   import { JsonValidators as Validators } from 'json-validators';
 *
 * and it should work with existing code as a complete replacement.
 *
 * The one exception is the 'pattern' validator, which has been changed to
 * matche partial values by default (the standard 'pattern' validator wrapped
 * all patterns in '^' and '$', forcing them to always match an entire value).
 * However, the old behavior can be restored by simply adding '^' and '$'
 * around your patterns, or by passing an optional second parameter of TRUE.
 * This change is to make the 'pattern' validator match the behavior of a
 * JSON Schema pattern, which allows partial matches, rather than the behavior
 * of an HTML input control pattern, which does not.
 *
 * This library replaces Angular's validators and combination functions
 * with the following validators and transformation functions:
 *
 * Validators:
 *   For all formControls:     required (*), type, enum, const
 *   For text formControls:    minLength (*), maxLength (*), pattern (*), format
 *   For numeric formControls: maximum, exclusiveMaximum,
 *                             minimum, exclusiveMinimum, multipleOf
 *   For formGroup objects:    minProperties, maxProperties, dependencies
 *   For formArray arrays:     minItems, maxItems, uniqueItems, contains
 *   Not used by JSON Schema:  min (*), max (*), requiredTrue (*), email (*)
 * (Validators originally included with Angular are maked with (*).)
 *
 * NOTE / TODO: The dependencies validator is not complete.
 * NOTE / TODO: The contains validator is not complete.
 *
 * Validators not used by JSON Schema (but included for compatibility)
 * and their JSON Schema equivalents:
 *
 *   Angular validator | JSON Schema equivalent
 *   ------------------|-----------------------
 *     min(number)     |   minimum(number)
 *     max(number)     |   maximum(number)
 *     requiredTrue()  |   const(true)
 *     email()         |   format('email')
 *
 * Validator transformation functions:
 *   composeAnyOf, composeOneOf, composeAllOf, composeNot
 * (Angular's original combination funciton, 'compose', is also included for
 * backward compatibility, though it is functionally equivalent to composeAllOf,
 * asside from its more generic error message.)
 *
 * All validators have also been extended to accept an optional second argument
 * which, if passed a TRUE value, causes the validator to perform the opposite
 * of its original finction. (This is used internally to enable 'not' and
 * 'composeOneOf' to function and return useful error messages.)
 *
 * The 'required' validator has also been overloaded so that if called with
 * a boolean parameter (or no parameters) it returns the original validator
 * function (rather than executing it). However, if it is called with an
 * AbstractControl parameter (as was previously required), it behaves
 * exactly as before.
 *
 * This enables all validators (including 'required') to be constructed in
 * exactly the same way, so they can be automatically applied using the
 * equivalent key names and values taken directly from a JSON Schema.
 *
 * This source code is partially derived from Angular,
 * which is Copyright (c) 2014-2017 Google, Inc.
 * Use of this source code is therefore governed by the same MIT-style license
 * that can be found in the LICENSE file at https://angular.io/license
 *
 * Original Angular Validators:
 * https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 */
var /**
 * 'JsonValidators' class
 *
 * Provides an extended set of validators to be used by form controls,
 * compatible with standard JSON Schema validation options.
 * http://json-schema.org/latest/json-schema-validation.html
 *
 * Note: This library is designed as a drop-in replacement for the Angular
 * Validators library, and except for one small breaking change to the 'pattern'
 * validator (described below) it can even be imported as a substitute, like so:
 *
 *   import { JsonValidators as Validators } from 'json-validators';
 *
 * and it should work with existing code as a complete replacement.
 *
 * The one exception is the 'pattern' validator, which has been changed to
 * matche partial values by default (the standard 'pattern' validator wrapped
 * all patterns in '^' and '$', forcing them to always match an entire value).
 * However, the old behavior can be restored by simply adding '^' and '$'
 * around your patterns, or by passing an optional second parameter of TRUE.
 * This change is to make the 'pattern' validator match the behavior of a
 * JSON Schema pattern, which allows partial matches, rather than the behavior
 * of an HTML input control pattern, which does not.
 *
 * This library replaces Angular's validators and combination functions
 * with the following validators and transformation functions:
 *
 * Validators:
 *   For all formControls:     required (*), type, enum, const
 *   For text formControls:    minLength (*), maxLength (*), pattern (*), format
 *   For numeric formControls: maximum, exclusiveMaximum,
 *                             minimum, exclusiveMinimum, multipleOf
 *   For formGroup objects:    minProperties, maxProperties, dependencies
 *   For formArray arrays:     minItems, maxItems, uniqueItems, contains
 *   Not used by JSON Schema:  min (*), max (*), requiredTrue (*), email (*)
 * (Validators originally included with Angular are maked with (*).)
 *
 * NOTE / TODO: The dependencies validator is not complete.
 * NOTE / TODO: The contains validator is not complete.
 *
 * Validators not used by JSON Schema (but included for compatibility)
 * and their JSON Schema equivalents:
 *
 *   Angular validator | JSON Schema equivalent
 *   ------------------|-----------------------
 *     min(number)     |   minimum(number)
 *     max(number)     |   maximum(number)
 *     requiredTrue()  |   const(true)
 *     email()         |   format('email')
 *
 * Validator transformation functions:
 *   composeAnyOf, composeOneOf, composeAllOf, composeNot
 * (Angular's original combination funciton, 'compose', is also included for
 * backward compatibility, though it is functionally equivalent to composeAllOf,
 * asside from its more generic error message.)
 *
 * All validators have also been extended to accept an optional second argument
 * which, if passed a TRUE value, causes the validator to perform the opposite
 * of its original finction. (This is used internally to enable 'not' and
 * 'composeOneOf' to function and return useful error messages.)
 *
 * The 'required' validator has also been overloaded so that if called with
 * a boolean parameter (or no parameters) it returns the original validator
 * function (rather than executing it). However, if it is called with an
 * AbstractControl parameter (as was previously required), it behaves
 * exactly as before.
 *
 * This enables all validators (including 'required') to be constructed in
 * exactly the same way, so they can be automatically applied using the
 * equivalent key names and values taken directly from a JSON Schema.
 *
 * This source code is partially derived from Angular,
 * which is Copyright (c) 2014-2017 Google, Inc.
 * Use of this source code is therefore governed by the same MIT-style license
 * that can be found in the LICENSE file at https://angular.io/license
 *
 * Original Angular Validators:
 * https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 */
JsonValidators = /** @class */ (function () {
    function JsonValidators() {
    }
    /**
     * @param {?=} input
     * @return {?}
     */
    JsonValidators.required = /**
     * @param {?=} input
     * @return {?}
     */
    function (input) {
        if (input === undefined) {
            input = true;
        }
        switch (input) {
            case true:
                // Return required function (do not execute it yet)
                return function (control, invert) {
                    if (invert === void 0) { invert = false; }
                    if (invert) {
                        return null;
                    } // if not required, always return valid
                    return hasValue(control.value) ? null : { 'required': true };
                };
            case false:
                // Do nothing (if field is not required, it is always valid)
                return JsonValidators.nullValidator;
            default:
                // Execute required function
                return hasValue((/** @type {?} */ (input)).value) ? null : { 'required': true };
        }
    };
    ;
    /**
     * 'type' validator
     *
     * Requires a control to only accept values of a specified type,
     * or one of an array of types.
     *
     * Note: SchemaPrimitiveType = 'string'|'number'|'integer'|'boolean'|'null'
     *
     * // {SchemaPrimitiveType|SchemaPrimitiveType[]} type - type(s) to accept
     * // {IValidatorFn}
     */
    /**
     * 'type' validator
     *
     * Requires a control to only accept values of a specified type,
     * or one of an array of types.
     *
     * Note: SchemaPrimitiveType = 'string'|'number'|'integer'|'boolean'|'null'
     *
     * // {SchemaPrimitiveType|SchemaPrimitiveType[]} type - type(s) to accept
     * // {IValidatorFn}
     * @param {?} requiredType
     * @return {?}
     */
    JsonValidators.type = /**
     * 'type' validator
     *
     * Requires a control to only accept values of a specified type,
     * or one of an array of types.
     *
     * Note: SchemaPrimitiveType = 'string'|'number'|'integer'|'boolean'|'null'
     *
     * // {SchemaPrimitiveType|SchemaPrimitiveType[]} type - type(s) to accept
     * // {IValidatorFn}
     * @param {?} requiredType
     * @return {?}
     */
    function (requiredType) {
        if (!hasValue(requiredType)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = isArray(requiredType) ?
                (/** @type {?} */ (requiredType)).some(function (type) { return isType(currentValue, type); }) :
                isType(currentValue, /** @type {?} */ (requiredType));
            return xor(isValid, invert) ?
                null : { 'type': { requiredType: requiredType, currentValue: currentValue } };
        };
    };
    /**
     * 'enum' validator
     *
     * Requires a control to have a value from an enumerated list of values.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null enum values.
     *
     * // {any[]} allowedValues - array of acceptable values
     * // {IValidatorFn}
     */
    /**
     * 'enum' validator
     *
     * Requires a control to have a value from an enumerated list of values.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null enum values.
     *
     * // {any[]} allowedValues - array of acceptable values
     * // {IValidatorFn}
     * @param {?} allowedValues
     * @return {?}
     */
    JsonValidators.enum = /**
     * 'enum' validator
     *
     * Requires a control to have a value from an enumerated list of values.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null enum values.
     *
     * // {any[]} allowedValues - array of acceptable values
     * // {IValidatorFn}
     * @param {?} allowedValues
     * @return {?}
     */
    function (allowedValues) {
        if (!isArray(allowedValues)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isEqual = function (enumValue, inputValue) {
                return enumValue === inputValue ||
                    (isNumber(enumValue) && +inputValue === +enumValue) ||
                    (isBoolean(enumValue, 'strict') &&
                        toJavaScriptType(inputValue, 'boolean') === enumValue) ||
                    (enumValue === null && !hasValue(inputValue)) ||
                    _.isEqual(enumValue, inputValue);
            };
            /** @type {?} */
            var isValid = isArray(currentValue) ?
                currentValue.every(function (inputValue) { return allowedValues.some(function (enumValue) {
                    return isEqual(enumValue, inputValue);
                }); }) :
                allowedValues.some(function (enumValue) { return isEqual(enumValue, currentValue); });
            return xor(isValid, invert) ?
                null : { 'enum': { allowedValues: allowedValues, currentValue: currentValue } };
        };
    };
    /**
     * 'const' validator
     *
     * Requires a control to have a specific value.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null values.
     *
     * TODO: modify to work with objects
     *
     * // {any[]} requiredValue - required value
     * // {IValidatorFn}
     */
    /**
     * 'const' validator
     *
     * Requires a control to have a specific value.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null values.
     *
     * TODO: modify to work with objects
     *
     * // {any[]} requiredValue - required value
     * // {IValidatorFn}
     * @param {?} requiredValue
     * @return {?}
     */
    JsonValidators.const = /**
     * 'const' validator
     *
     * Requires a control to have a specific value.
     *
     * Converts types as needed to allow string inputs to still correctly
     * match number, boolean, and null values.
     *
     * TODO: modify to work with objects
     *
     * // {any[]} requiredValue - required value
     * // {IValidatorFn}
     * @param {?} requiredValue
     * @return {?}
     */
    function (requiredValue) {
        if (!hasValue(requiredValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isEqual = function (constValue, inputValue) {
                return constValue === inputValue ||
                    isNumber(constValue) && +inputValue === +constValue ||
                    isBoolean(constValue, 'strict') &&
                        toJavaScriptType(inputValue, 'boolean') === constValue ||
                    constValue === null && !hasValue(inputValue);
            };
            /** @type {?} */
            var isValid = isEqual(requiredValue, currentValue);
            return xor(isValid, invert) ?
                null : { 'const': { requiredValue: requiredValue, currentValue: currentValue } };
        };
    };
    /**
     * 'minLength' validator
     *
     * Requires a control's text value to be greater than a specified length.
     *
     * // {number} minimumLength - minimum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     */
    /**
     * 'minLength' validator
     *
     * Requires a control's text value to be greater than a specified length.
     *
     * // {number} minimumLength - minimum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     * @param {?} minimumLength
     * @return {?}
     */
    JsonValidators.minLength = /**
     * 'minLength' validator
     *
     * Requires a control's text value to be greater than a specified length.
     *
     * // {number} minimumLength - minimum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     * @param {?} minimumLength
     * @return {?}
     */
    function (minimumLength) {
        if (!hasValue(minimumLength)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentLength = isString(control.value) ? control.value.length : 0;
            /** @type {?} */
            var isValid = currentLength >= minimumLength;
            return xor(isValid, invert) ?
                null : { 'minLength': { minimumLength: minimumLength, currentLength: currentLength } };
        };
    };
    ;
    /**
     * 'maxLength' validator
     *
     * Requires a control's text value to be less than a specified length.
     *
     * // {number} maximumLength - maximum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     */
    /**
     * 'maxLength' validator
     *
     * Requires a control's text value to be less than a specified length.
     *
     * // {number} maximumLength - maximum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     * @param {?} maximumLength
     * @return {?}
     */
    JsonValidators.maxLength = /**
     * 'maxLength' validator
     *
     * Requires a control's text value to be less than a specified length.
     *
     * // {number} maximumLength - maximum allowed string length
     * // {boolean = false} invert - instead return error object only if valid
     * // {IValidatorFn}
     * @param {?} maximumLength
     * @return {?}
     */
    function (maximumLength) {
        if (!hasValue(maximumLength)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var currentLength = isString(control.value) ? control.value.length : 0;
            /** @type {?} */
            var isValid = currentLength <= maximumLength;
            return xor(isValid, invert) ?
                null : { 'maxLength': { maximumLength: maximumLength, currentLength: currentLength } };
        };
    };
    ;
    /**
     * 'pattern' validator
     *
     * Note: NOT the same as Angular's default pattern validator.
     *
     * Requires a control's value to match a specified regular expression pattern.
     *
     * This validator changes the behavior of default pattern validator
     * by replacing RegExp(`^${pattern}$`) with RegExp(`${pattern}`),
     * which allows for partial matches.
     *
     * To return to the default funcitonality, and match the entire string,
     * pass TRUE as the optional second parameter.
     *
     * // {string} pattern - regular expression pattern
     * // {boolean = false} wholeString - match whole value string?
     * // {IValidatorFn}
     */
    /**
     * 'pattern' validator
     *
     * Note: NOT the same as Angular's default pattern validator.
     *
     * Requires a control's value to match a specified regular expression pattern.
     *
     * This validator changes the behavior of default pattern validator
     * by replacing RegExp(`^${pattern}$`) with RegExp(`${pattern}`),
     * which allows for partial matches.
     *
     * To return to the default funcitonality, and match the entire string,
     * pass TRUE as the optional second parameter.
     *
     * // {string} pattern - regular expression pattern
     * // {boolean = false} wholeString - match whole value string?
     * // {IValidatorFn}
     * @param {?} pattern
     * @param {?=} wholeString
     * @return {?}
     */
    JsonValidators.pattern = /**
     * 'pattern' validator
     *
     * Note: NOT the same as Angular's default pattern validator.
     *
     * Requires a control's value to match a specified regular expression pattern.
     *
     * This validator changes the behavior of default pattern validator
     * by replacing RegExp(`^${pattern}$`) with RegExp(`${pattern}`),
     * which allows for partial matches.
     *
     * To return to the default funcitonality, and match the entire string,
     * pass TRUE as the optional second parameter.
     *
     * // {string} pattern - regular expression pattern
     * // {boolean = false} wholeString - match whole value string?
     * // {IValidatorFn}
     * @param {?} pattern
     * @param {?=} wholeString
     * @return {?}
     */
    function (pattern, wholeString) {
        if (wholeString === void 0) { wholeString = false; }
        if (!hasValue(pattern)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var regex;
            /** @type {?} */
            var requiredPattern;
            if (typeof pattern === 'string') {
                requiredPattern = (wholeString) ? "^" + pattern + "$" : pattern;
                regex = new RegExp(requiredPattern);
            }
            else {
                requiredPattern = pattern.toString();
                regex = pattern;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = isString(currentValue) ? regex.test(currentValue) : false;
            return xor(isValid, invert) ?
                null : { 'pattern': { requiredPattern: requiredPattern, currentValue: currentValue } };
        };
    };
    /**
     * 'format' validator
     *
     * Requires a control to have a value of a certain format.
     *
     * This validator currently checks the following formsts:
     *   date, time, date-time, email, hostname, ipv4, ipv6,
     *   uri, uri-reference, uri-template, url, uuid, color,
     *   json-pointer, relative-json-pointer, regex
     *
     * Fast format regular expressions copied from AJV:
     * https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
     *
     * // {JsonSchemaFormatNames} requiredFormat - format to check
     * // {IValidatorFn}
     */
    /**
     * 'format' validator
     *
     * Requires a control to have a value of a certain format.
     *
     * This validator currently checks the following formsts:
     *   date, time, date-time, email, hostname, ipv4, ipv6,
     *   uri, uri-reference, uri-template, url, uuid, color,
     *   json-pointer, relative-json-pointer, regex
     *
     * Fast format regular expressions copied from AJV:
     * https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
     *
     * // {JsonSchemaFormatNames} requiredFormat - format to check
     * // {IValidatorFn}
     * @param {?} requiredFormat
     * @return {?}
     */
    JsonValidators.format = /**
     * 'format' validator
     *
     * Requires a control to have a value of a certain format.
     *
     * This validator currently checks the following formsts:
     *   date, time, date-time, email, hostname, ipv4, ipv6,
     *   uri, uri-reference, uri-template, url, uuid, color,
     *   json-pointer, relative-json-pointer, regex
     *
     * Fast format regular expressions copied from AJV:
     * https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
     *
     * // {JsonSchemaFormatNames} requiredFormat - format to check
     * // {IValidatorFn}
     * @param {?} requiredFormat
     * @return {?}
     */
    function (requiredFormat) {
        if (!hasValue(requiredFormat)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var isValid;
            /** @type {?} */
            var currentValue = control.value;
            if (isString(currentValue)) {
                /** @type {?} */
                var formatTest = jsonSchemaFormatTests[requiredFormat];
                if (typeof formatTest === 'object') {
                    isValid = (/** @type {?} */ (formatTest)).test(/** @type {?} */ (currentValue));
                }
                else if (typeof formatTest === 'function') {
                    isValid = (/** @type {?} */ (formatTest))(/** @type {?} */ (currentValue));
                }
                else {
                    console.error("format validator error: \"" + requiredFormat + "\" is not a recognized format.");
                    isValid = true;
                }
            }
            else {
                // Allow JavaScript Date objects
                isValid = ['date', 'time', 'date-time'].includes(requiredFormat) &&
                    Object.prototype.toString.call(currentValue) === '[object Date]';
            }
            return xor(isValid, invert) ?
                null : { 'format': { requiredFormat: requiredFormat, currentValue: currentValue } };
        };
    };
    /**
     * 'minimum' validator
     *
     * Requires a control's numeric value to be greater than or equal to
     * a minimum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a minimum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} minimum - minimum allowed value
     * // {IValidatorFn}
     */
    /**
     * 'minimum' validator
     *
     * Requires a control's numeric value to be greater than or equal to
     * a minimum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a minimum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} minimum - minimum allowed value
     * // {IValidatorFn}
     * @param {?} minimumValue
     * @return {?}
     */
    JsonValidators.minimum = /**
     * 'minimum' validator
     *
     * Requires a control's numeric value to be greater than or equal to
     * a minimum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a minimum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} minimum - minimum allowed value
     * // {IValidatorFn}
     * @param {?} minimumValue
     * @return {?}
     */
    function (minimumValue) {
        if (!hasValue(minimumValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = !isNumber(currentValue) || currentValue >= minimumValue;
            return xor(isValid, invert) ?
                null : { 'minimum': { minimumValue: minimumValue, currentValue: currentValue } };
        };
    };
    /**
     * 'exclusiveMinimum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMinimumValue - maximum allowed value
     * // {IValidatorFn}
     */
    /**
     * 'exclusiveMinimum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMinimumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} exclusiveMinimumValue
     * @return {?}
     */
    JsonValidators.exclusiveMinimum = /**
     * 'exclusiveMinimum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMinimumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} exclusiveMinimumValue
     * @return {?}
     */
    function (exclusiveMinimumValue) {
        if (!hasValue(exclusiveMinimumValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = !isNumber(currentValue) || +currentValue < exclusiveMinimumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMinimum': { exclusiveMinimumValue: exclusiveMinimumValue, currentValue: currentValue } };
        };
    };
    /**
     * 'maximum' validator
     *
     * Requires a control's numeric value to be less than or equal to
     * a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} maximumValue - maximum allowed value
     * // {IValidatorFn}
     */
    /**
     * 'maximum' validator
     *
     * Requires a control's numeric value to be less than or equal to
     * a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} maximumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} maximumValue
     * @return {?}
     */
    JsonValidators.maximum = /**
     * 'maximum' validator
     *
     * Requires a control's numeric value to be less than or equal to
     * a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} maximumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} maximumValue
     * @return {?}
     */
    function (maximumValue) {
        if (!hasValue(maximumValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = !isNumber(currentValue) || +currentValue <= maximumValue;
            return xor(isValid, invert) ?
                null : { 'maximum': { maximumValue: maximumValue, currentValue: currentValue } };
        };
    };
    /**
     * 'exclusiveMaximum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMaximumValue - maximum allowed value
     * // {IValidatorFn}
     */
    /**
     * 'exclusiveMaximum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMaximumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} exclusiveMaximumValue
     * @return {?}
     */
    JsonValidators.exclusiveMaximum = /**
     * 'exclusiveMaximum' validator
     *
     * Requires a control's numeric value to be less than a maximum amount.
     *
     * Any non-numeric value is also valid (according to the HTML forms spec,
     * a non-numeric value doesn't have a maximum).
     * https://www.w3.org/TR/html5/forms.html#attr-input-max
     *
     * // {number} exclusiveMaximumValue - maximum allowed value
     * // {IValidatorFn}
     * @param {?} exclusiveMaximumValue
     * @return {?}
     */
    function (exclusiveMaximumValue) {
        if (!hasValue(exclusiveMaximumValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = !isNumber(currentValue) || +currentValue < exclusiveMaximumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMaximum': { exclusiveMaximumValue: exclusiveMaximumValue, currentValue: currentValue } };
        };
    };
    /**
     * 'multipleOf' validator
     *
     * Requires a control to have a numeric value that is a multiple
     * of a specified number.
     *
     * // {number} multipleOfValue - number value must be a multiple of
     * // {IValidatorFn}
     */
    /**
     * 'multipleOf' validator
     *
     * Requires a control to have a numeric value that is a multiple
     * of a specified number.
     *
     * // {number} multipleOfValue - number value must be a multiple of
     * // {IValidatorFn}
     * @param {?} multipleOfValue
     * @return {?}
     */
    JsonValidators.multipleOf = /**
     * 'multipleOf' validator
     *
     * Requires a control to have a numeric value that is a multiple
     * of a specified number.
     *
     * // {number} multipleOfValue - number value must be a multiple of
     * // {IValidatorFn}
     * @param {?} multipleOfValue
     * @return {?}
     */
    function (multipleOfValue) {
        if (!hasValue(multipleOfValue)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentValue = control.value;
            /** @type {?} */
            var isValid = isNumber(currentValue) &&
                currentValue % multipleOfValue === 0;
            return xor(isValid, invert) ?
                null : { 'multipleOf': { multipleOfValue: multipleOfValue, currentValue: currentValue } };
        };
    };
    /**
     * 'minProperties' validator
     *
     * Requires a form group to have a minimum number of properties (i.e. have
     * values entered in a minimum number of controls within the group).
     *
     * // {number} minimumProperties - minimum number of properties allowed
     * // {IValidatorFn}
     */
    /**
     * 'minProperties' validator
     *
     * Requires a form group to have a minimum number of properties (i.e. have
     * values entered in a minimum number of controls within the group).
     *
     * // {number} minimumProperties - minimum number of properties allowed
     * // {IValidatorFn}
     * @param {?} minimumProperties
     * @return {?}
     */
    JsonValidators.minProperties = /**
     * 'minProperties' validator
     *
     * Requires a form group to have a minimum number of properties (i.e. have
     * values entered in a minimum number of controls within the group).
     *
     * // {number} minimumProperties - minimum number of properties allowed
     * // {IValidatorFn}
     * @param {?} minimumProperties
     * @return {?}
     */
    function (minimumProperties) {
        if (!hasValue(minimumProperties)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentProperties = Object.keys(control.value).length || 0;
            /** @type {?} */
            var isValid = currentProperties >= minimumProperties;
            return xor(isValid, invert) ?
                null : { 'minProperties': { minimumProperties: minimumProperties, currentProperties: currentProperties } };
        };
    };
    /**
     * 'maxProperties' validator
     *
     * Requires a form group to have a maximum number of properties (i.e. have
     * values entered in a maximum number of controls within the group).
     *
     * Note: Has no effect if the form group does not contain more than the
     * maximum number of controls.
     *
     * // {number} maximumProperties - maximum number of properties allowed
     * // {IValidatorFn}
     */
    /**
     * 'maxProperties' validator
     *
     * Requires a form group to have a maximum number of properties (i.e. have
     * values entered in a maximum number of controls within the group).
     *
     * Note: Has no effect if the form group does not contain more than the
     * maximum number of controls.
     *
     * // {number} maximumProperties - maximum number of properties allowed
     * // {IValidatorFn}
     * @param {?} maximumProperties
     * @return {?}
     */
    JsonValidators.maxProperties = /**
     * 'maxProperties' validator
     *
     * Requires a form group to have a maximum number of properties (i.e. have
     * values entered in a maximum number of controls within the group).
     *
     * Note: Has no effect if the form group does not contain more than the
     * maximum number of controls.
     *
     * // {number} maximumProperties - maximum number of properties allowed
     * // {IValidatorFn}
     * @param {?} maximumProperties
     * @return {?}
     */
    function (maximumProperties) {
        if (!hasValue(maximumProperties)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var currentProperties = Object.keys(control.value).length || 0;
            /** @type {?} */
            var isValid = currentProperties <= maximumProperties;
            return xor(isValid, invert) ?
                null : { 'maxProperties': { maximumProperties: maximumProperties, currentProperties: currentProperties } };
        };
    };
    /**
     * 'dependencies' validator
     *
     * Requires the controls in a form group to meet additional validation
     * criteria, depending on the values of other controls in the group.
     *
     * Examples:
     * https://spacetelescope.github.io/understanding-json-schema/reference/object.html#dependencies
     *
     * // {any} dependencies - required dependencies
     * // {IValidatorFn}
     */
    /**
     * 'dependencies' validator
     *
     * Requires the controls in a form group to meet additional validation
     * criteria, depending on the values of other controls in the group.
     *
     * Examples:
     * https://spacetelescope.github.io/understanding-json-schema/reference/object.html#dependencies
     *
     * // {any} dependencies - required dependencies
     * // {IValidatorFn}
     * @param {?} dependencies
     * @return {?}
     */
    JsonValidators.dependencies = /**
     * 'dependencies' validator
     *
     * Requires the controls in a form group to meet additional validation
     * criteria, depending on the values of other controls in the group.
     *
     * Examples:
     * https://spacetelescope.github.io/understanding-json-schema/reference/object.html#dependencies
     *
     * // {any} dependencies - required dependencies
     * // {IValidatorFn}
     * @param {?} dependencies
     * @return {?}
     */
    function (dependencies) {
        if (getType(dependencies) !== 'object' || isEmpty(dependencies)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var allErrors = _mergeObjects(forEachCopy(dependencies, function (value, requiringField) {
                if (!hasValue(control.value[requiringField])) {
                    return null;
                }
                /** @type {?} */
                var requiringFieldErrors = {};
                /** @type {?} */
                var requiredFields;
                /** @type {?} */
                var properties = {};
                if (getType(dependencies[requiringField]) === 'array') {
                    requiredFields = dependencies[requiringField];
                }
                else if (getType(dependencies[requiringField]) === 'object') {
                    requiredFields = dependencies[requiringField]['required'] || [];
                    properties = dependencies[requiringField]['properties'] || {};
                }
                try {
                    // Validate property dependencies
                    for (var requiredFields_1 = tslib_1.__values(requiredFields), requiredFields_1_1 = requiredFields_1.next(); !requiredFields_1_1.done; requiredFields_1_1 = requiredFields_1.next()) {
                        var requiredField = requiredFields_1_1.value;
                        if (xor(!hasValue(control.value[requiredField]), invert)) {
                            requiringFieldErrors[requiredField] = { 'required': true };
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (requiredFields_1_1 && !requiredFields_1_1.done && (_a = requiredFields_1.return)) _a.call(requiredFields_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // Validate schema dependencies
                requiringFieldErrors = _mergeObjects(requiringFieldErrors, forEachCopy(properties, function (requirements, requiredField) {
                    /** @type {?} */
                    var requiredFieldErrors = _mergeObjects(forEachCopy(requirements, function (requirement, parameter) {
                        /** @type {?} */
                        var validator = null;
                        if (requirement === 'maximum' || requirement === 'minimum') {
                            /** @type {?} */
                            var exclusive = !!requirements['exclusiveM' + requirement.slice(1)];
                            validator = JsonValidators[requirement](parameter, exclusive);
                        }
                        else if (typeof JsonValidators[requirement] === 'function') {
                            validator = JsonValidators[requirement](parameter);
                        }
                        return !isDefined(validator) ?
                            null : validator(control.value[requiredField]);
                    }));
                    return isEmpty(requiredFieldErrors) ?
                        null : (_a = {}, _a[requiredField] = requiredFieldErrors, _a);
                    var _a;
                }));
                return isEmpty(requiringFieldErrors) ?
                    null : (_b = {}, _b[requiringField] = requiringFieldErrors, _b);
                var e_1, _a, _b;
            }));
            return isEmpty(allErrors) ? null : allErrors;
        };
    };
    /**
     * 'minItems' validator
     *
     * Requires a form array to have a minimum number of values.
     *
     * // {number} minimumItems - minimum number of items allowed
     * // {IValidatorFn}
     */
    /**
     * 'minItems' validator
     *
     * Requires a form array to have a minimum number of values.
     *
     * // {number} minimumItems - minimum number of items allowed
     * // {IValidatorFn}
     * @param {?} minimumItems
     * @return {?}
     */
    JsonValidators.minItems = /**
     * 'minItems' validator
     *
     * Requires a form array to have a minimum number of values.
     *
     * // {number} minimumItems - minimum number of items allowed
     * // {IValidatorFn}
     * @param {?} minimumItems
     * @return {?}
     */
    function (minimumItems) {
        if (!hasValue(minimumItems)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentItems = isArray(control.value) ? control.value.length : 0;
            /** @type {?} */
            var isValid = currentItems >= minimumItems;
            return xor(isValid, invert) ?
                null : { 'minItems': { minimumItems: minimumItems, currentItems: currentItems } };
        };
    };
    /**
     * 'maxItems' validator
     *
     * Requires a form array to have a maximum number of values.
     *
     * // {number} maximumItems - maximum number of items allowed
     * // {IValidatorFn}
     */
    /**
     * 'maxItems' validator
     *
     * Requires a form array to have a maximum number of values.
     *
     * // {number} maximumItems - maximum number of items allowed
     * // {IValidatorFn}
     * @param {?} maximumItems
     * @return {?}
     */
    JsonValidators.maxItems = /**
     * 'maxItems' validator
     *
     * Requires a form array to have a maximum number of values.
     *
     * // {number} maximumItems - maximum number of items allowed
     * // {IValidatorFn}
     * @param {?} maximumItems
     * @return {?}
     */
    function (maximumItems) {
        if (!hasValue(maximumItems)) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var currentItems = isArray(control.value) ? control.value.length : 0;
            /** @type {?} */
            var isValid = currentItems <= maximumItems;
            return xor(isValid, invert) ?
                null : { 'maxItems': { maximumItems: maximumItems, currentItems: currentItems } };
        };
    };
    /**
     * 'uniqueItems' validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     */
    /**
     * 'uniqueItems' validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     * @param {?=} unique
     * @return {?}
     */
    JsonValidators.uniqueItems = /**
     * 'uniqueItems' validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     * @param {?=} unique
     * @return {?}
     */
    function (unique) {
        if (unique === void 0) { unique = true; }
        if (!unique) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var sorted = control.value.slice().sort();
            /** @type {?} */
            var duplicateItems = [];
            for (var i = 1; i < sorted.length; i++) {
                if (sorted[i - 1] === sorted[i] && duplicateItems.includes(sorted[i])) {
                    duplicateItems.push(sorted[i]);
                }
            }
            /** @type {?} */
            var isValid = !duplicateItems.length;
            return xor(isValid, invert) ?
                null : { 'uniqueItems': { duplicateItems: duplicateItems } };
        };
    };
    /**
     * 'contains' validator
     *
     * TODO: Complete this validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     */
    /**
     * 'contains' validator
     *
     * TODO: Complete this validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     * @param {?=} requiredItem
     * @return {?}
     */
    JsonValidators.contains = /**
     * 'contains' validator
     *
     * TODO: Complete this validator
     *
     * Requires values in a form array to be unique.
     *
     * // {boolean = true} unique? - true to validate, false to disable
     * // {IValidatorFn}
     * @param {?=} requiredItem
     * @return {?}
     */
    function (requiredItem) {
        if (requiredItem === void 0) { requiredItem = true; }
        if (!requiredItem) {
            return JsonValidators.nullValidator;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value) || !isArray(control.value)) {
                return null;
            }
            /** @type {?} */
            var currentItems = control.value;
            /** @type {?} */
            var isValid = true;
            return xor(isValid, invert) ?
                null : { 'contains': { requiredItem: requiredItem, currentItems: currentItems } };
        };
    };
    /**
     * No-op validator. Included for backward compatibility.
     */
    /**
     * No-op validator. Included for backward compatibility.
     * @param {?} control
     * @return {?}
     */
    JsonValidators.nullValidator = /**
     * No-op validator. Included for backward compatibility.
     * @param {?} control
     * @return {?}
     */
    function (control) {
        return null;
    };
    /**
     * Validator transformation functions:
     * composeAnyOf, composeOneOf, composeAllOf, composeNot,
     * compose, composeAsync
     *
     * TODO: Add composeAnyOfAsync, composeOneOfAsync,
     *           composeAllOfAsync, composeNotAsync
     */
    /**
     * 'composeAnyOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid if any one or more of the submitted validators are
     * valid. If every validator is invalid, it returns combined errors from
     * all validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     */
    /**
     * 'composeAnyOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid if any one or more of the submitted validators are
     * valid. If every validator is invalid, it returns combined errors from
     * all validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.composeAnyOf = /**
     * 'composeAnyOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid if any one or more of the submitted validators are
     * valid. If every validator is invalid, it returns combined errors from
     * all validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var arrayOfErrors = _executeValidators(control, presentValidators, invert).filter(isDefined);
            /** @type {?} */
            var isValid = validators.length > arrayOfErrors.length;
            return xor(isValid, invert) ?
                null : _mergeObjects.apply(void 0, tslib_1.__spread(arrayOfErrors, [{ 'anyOf': !invert }]));
        };
    };
    /**
     * 'composeOneOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if exactly one of the submitted validators
     * is valid. Otherwise returns combined information from all validators,
     * both valid and invalid.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     */
    /**
     * 'composeOneOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if exactly one of the submitted validators
     * is valid. Otherwise returns combined information from all validators,
     * both valid and invalid.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.composeOneOf = /**
     * 'composeOneOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if exactly one of the submitted validators
     * is valid. Otherwise returns combined information from all validators,
     * both valid and invalid.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var arrayOfErrors = _executeValidators(control, presentValidators);
            /** @type {?} */
            var validControls = validators.length - arrayOfErrors.filter(isDefined).length;
            /** @type {?} */
            var isValid = validControls === 1;
            if (xor(isValid, invert)) {
                return null;
            }
            /** @type {?} */
            var arrayOfValids = _executeValidators(control, presentValidators, invert);
            return _mergeObjects.apply(void 0, tslib_1.__spread(arrayOfErrors, arrayOfValids, [{ 'oneOf': !invert }]));
        };
    };
    /**
     * 'composeAllOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if all the submitted validators are individually
     * valid. Otherwise it returns combined errors from all invalid validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     */
    /**
     * 'composeAllOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if all the submitted validators are individually
     * valid. Otherwise it returns combined errors from all invalid validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.composeAllOf = /**
     * 'composeAllOf' validator combination function
     *
     * Accepts an array of validators and returns a single validator that
     * evaluates to valid only if all the submitted validators are individually
     * valid. Otherwise it returns combined errors from all invalid validators.
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            /** @type {?} */
            var combinedErrors = _mergeErrors(_executeValidators(control, presentValidators, invert));
            /** @type {?} */
            var isValid = combinedErrors === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(combinedErrors, { 'allOf': !invert });
        };
    };
    /**
     * 'composeNot' validator inversion function
     *
     * Accepts a single validator function and inverts its result.
     * Returns valid if the submitted validator is invalid, and
     * returns invalid if the submitted validator is valid.
     * (Note: this function can itself be inverted
     *   - e.g. composeNot(composeNot(validator)) -
     *   but this can be confusing and is therefore not recommended.)
     *
     * // {IValidatorFn[]} validators - validator(s) to invert
     * // {IValidatorFn} - new validator function that returns opposite result
     */
    /**
     * 'composeNot' validator inversion function
     *
     * Accepts a single validator function and inverts its result.
     * Returns valid if the submitted validator is invalid, and
     * returns invalid if the submitted validator is valid.
     * (Note: this function can itself be inverted
     *   - e.g. composeNot(composeNot(validator)) -
     *   but this can be confusing and is therefore not recommended.)
     *
     * // {IValidatorFn[]} validators - validator(s) to invert
     * // {IValidatorFn} - new validator function that returns opposite result
     * @param {?} validator
     * @return {?}
     */
    JsonValidators.composeNot = /**
     * 'composeNot' validator inversion function
     *
     * Accepts a single validator function and inverts its result.
     * Returns valid if the submitted validator is invalid, and
     * returns invalid if the submitted validator is valid.
     * (Note: this function can itself be inverted
     *   - e.g. composeNot(composeNot(validator)) -
     *   but this can be confusing and is therefore not recommended.)
     *
     * // {IValidatorFn[]} validators - validator(s) to invert
     * // {IValidatorFn} - new validator function that returns opposite result
     * @param {?} validator
     * @return {?}
     */
    function (validator) {
        if (!validator) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            var error = validator(control, !invert);
            /** @type {?} */
            var isValid = error === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(error, { 'not': !invert });
        };
    };
    /**
     * 'compose' validator combination function
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     */
    /**
     * 'compose' validator combination function
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.compose = /**
     * 'compose' validator combination function
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control, invert) {
            if (invert === void 0) { invert = false; }
            return _mergeErrors(_executeValidators(control, presentValidators, invert));
        };
    };
    ;
    /**
     * 'composeAsync' async validator combination function
     *
     * // {AsyncIValidatorFn[]} async validators - array of async validators
     * // {AsyncIValidatorFn} - single combined async validator function
     */
    /**
     * 'composeAsync' async validator combination function
     *
     * // {AsyncIValidatorFn[]} async validators - array of async validators
     * // {AsyncIValidatorFn} - single combined async validator function
     * @param {?} validators
     * @return {?}
     */
    JsonValidators.composeAsync = /**
     * 'composeAsync' async validator combination function
     *
     * // {AsyncIValidatorFn[]} async validators - array of async validators
     * // {AsyncIValidatorFn} - single combined async validator function
     * @param {?} validators
     * @return {?}
     */
    function (validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        var presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return function (control) {
            /** @type {?} */
            var observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
            return map.call(forkJoin(observables), _mergeErrors);
        };
    };
    // Additional angular validators (not used by Angualr JSON Schema Form)
    // From https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
    /**
     * Validator that requires controls to have a value greater than a number.
     */
    /**
     * Validator that requires controls to have a value greater than a number.
     * @param {?} min
     * @return {?}
     */
    JsonValidators.min = /**
     * Validator that requires controls to have a value greater than a number.
     * @param {?} min
     * @return {?}
     */
    function (min) {
        if (!hasValue(min)) {
            return JsonValidators.nullValidator;
        }
        return function (control) {
            // don't validate empty values to allow optional controls
            if (isEmpty(control.value) || isEmpty(min)) {
                return null;
            }
            /** @type {?} */
            var value = parseFloat(control.value);
            /** @type {?} */
            var actual = control.value;
            // Controls with NaN values after parsing should be treated as not having a
            // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
            return isNaN(value) || value >= min ? null : { 'min': { min: min, actual: actual } };
        };
    };
    /**
     * Validator that requires controls to have a value less than a number.
     */
    /**
     * Validator that requires controls to have a value less than a number.
     * @param {?} max
     * @return {?}
     */
    JsonValidators.max = /**
     * Validator that requires controls to have a value less than a number.
     * @param {?} max
     * @return {?}
     */
    function (max) {
        if (!hasValue(max)) {
            return JsonValidators.nullValidator;
        }
        return function (control) {
            // don't validate empty values to allow optional controls
            if (isEmpty(control.value) || isEmpty(max)) {
                return null;
            }
            /** @type {?} */
            var value = parseFloat(control.value);
            /** @type {?} */
            var actual = control.value;
            // Controls with NaN values after parsing should be treated as not having a
            // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
            return isNaN(value) || value <= max ? null : { 'max': { max: max, actual: actual } };
        };
    };
    /**
     * Validator that requires control value to be true.
     */
    /**
     * Validator that requires control value to be true.
     * @param {?} control
     * @return {?}
     */
    JsonValidators.requiredTrue = /**
     * Validator that requires control value to be true.
     * @param {?} control
     * @return {?}
     */
    function (control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        return control.value === true ? null : { 'required': true };
    };
    /**
     * Validator that performs email validation.
     */
    /**
     * Validator that performs email validation.
     * @param {?} control
     * @return {?}
     */
    JsonValidators.email = /**
     * Validator that performs email validation.
     * @param {?} control
     * @return {?}
     */
    function (control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        /** @type {?} */
        var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    };
    return JsonValidators;
}());
/**
 * 'JsonValidators' class
 *
 * Provides an extended set of validators to be used by form controls,
 * compatible with standard JSON Schema validation options.
 * http://json-schema.org/latest/json-schema-validation.html
 *
 * Note: This library is designed as a drop-in replacement for the Angular
 * Validators library, and except for one small breaking change to the 'pattern'
 * validator (described below) it can even be imported as a substitute, like so:
 *
 *   import { JsonValidators as Validators } from 'json-validators';
 *
 * and it should work with existing code as a complete replacement.
 *
 * The one exception is the 'pattern' validator, which has been changed to
 * matche partial values by default (the standard 'pattern' validator wrapped
 * all patterns in '^' and '$', forcing them to always match an entire value).
 * However, the old behavior can be restored by simply adding '^' and '$'
 * around your patterns, or by passing an optional second parameter of TRUE.
 * This change is to make the 'pattern' validator match the behavior of a
 * JSON Schema pattern, which allows partial matches, rather than the behavior
 * of an HTML input control pattern, which does not.
 *
 * This library replaces Angular's validators and combination functions
 * with the following validators and transformation functions:
 *
 * Validators:
 *   For all formControls:     required (*), type, enum, const
 *   For text formControls:    minLength (*), maxLength (*), pattern (*), format
 *   For numeric formControls: maximum, exclusiveMaximum,
 *                             minimum, exclusiveMinimum, multipleOf
 *   For formGroup objects:    minProperties, maxProperties, dependencies
 *   For formArray arrays:     minItems, maxItems, uniqueItems, contains
 *   Not used by JSON Schema:  min (*), max (*), requiredTrue (*), email (*)
 * (Validators originally included with Angular are maked with (*).)
 *
 * NOTE / TODO: The dependencies validator is not complete.
 * NOTE / TODO: The contains validator is not complete.
 *
 * Validators not used by JSON Schema (but included for compatibility)
 * and their JSON Schema equivalents:
 *
 *   Angular validator | JSON Schema equivalent
 *   ------------------|-----------------------
 *     min(number)     |   minimum(number)
 *     max(number)     |   maximum(number)
 *     requiredTrue()  |   const(true)
 *     email()         |   format('email')
 *
 * Validator transformation functions:
 *   composeAnyOf, composeOneOf, composeAllOf, composeNot
 * (Angular's original combination funciton, 'compose', is also included for
 * backward compatibility, though it is functionally equivalent to composeAllOf,
 * asside from its more generic error message.)
 *
 * All validators have also been extended to accept an optional second argument
 * which, if passed a TRUE value, causes the validator to perform the opposite
 * of its original finction. (This is used internally to enable 'not' and
 * 'composeOneOf' to function and return useful error messages.)
 *
 * The 'required' validator has also been overloaded so that if called with
 * a boolean parameter (or no parameters) it returns the original validator
 * function (rather than executing it). However, if it is called with an
 * AbstractControl parameter (as was previously required), it behaves
 * exactly as before.
 *
 * This enables all validators (including 'required') to be constructed in
 * exactly the same way, so they can be automatically applied using the
 * equivalent key names and values taken directly from a JSON Schema.
 *
 * This source code is partially derived from Angular,
 * which is Copyright (c) 2014-2017 Google, Inc.
 * Use of this source code is therefore governed by the same MIT-style license
 * that can be found in the LICENSE file at https://angular.io/license
 *
 * Original Angular Validators:
 * https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 */
export { JsonValidators };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi52YWxpZGF0b3JzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvanNvbi52YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFjLFFBQVEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFFNUIsT0FBTyxFQUNMLGtCQUFrQixFQUFFLHVCQUF1QixFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQ3hFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFDcEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUVyRCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUscUJBQXFCLEVBQXlCLE1BQU0sMEJBQTBCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUZ4Rjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7O0lBc0NTLHVCQUFROzs7O0lBQWYsVUFBZ0IsS0FBK0I7UUFDN0MsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQUU7UUFDMUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNkLEtBQUss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Ozs7Ozs7Ozs7Ozs7O0FBL3ZCRCwwQkErdkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE9ic2VydmFibGUsIGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHtcbiAgX2V4ZWN1dGVWYWxpZGF0b3JzLCBfZXhlY3V0ZUFzeW5jVmFsaWRhdG9ycywgX21lcmdlT2JqZWN0cywgX21lcmdlRXJyb3JzLFxuICBpc0VtcHR5LCBpc0RlZmluZWQsIGhhc1ZhbHVlLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzQm9vbGVhbiwgaXNBcnJheSxcbiAgZ2V0VHlwZSwgaXNUeXBlLCB0b0phdmFTY3JpcHRUeXBlLCB0b09ic2VydmFibGUsIHhvciwgU2NoZW1hUHJpbWl0aXZlVHlwZSxcbiAgUGxhaW5PYmplY3QsIElWYWxpZGF0b3JGbiwgQXN5bmNJVmFsaWRhdG9yRm5cbn0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IGZvckVhY2hDb3B5IH0gZnJvbSAnLi91dGlsaXR5LmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBqc29uU2NoZW1hRm9ybWF0VGVzdHMsIEpzb25TY2hlbWFGb3JtYXROYW1lcyB9IGZyb20gJy4vZm9ybWF0LXJlZ2V4LmNvbnN0YW50cyc7XG5cbi8qKlxuICogJ0pzb25WYWxpZGF0b3JzJyBjbGFzc1xuICpcbiAqIFByb3ZpZGVzIGFuIGV4dGVuZGVkIHNldCBvZiB2YWxpZGF0b3JzIHRvIGJlIHVzZWQgYnkgZm9ybSBjb250cm9scyxcbiAqIGNvbXBhdGlibGUgd2l0aCBzdGFuZGFyZCBKU09OIFNjaGVtYSB2YWxpZGF0aW9uIG9wdGlvbnMuXG4gKiBodHRwOi8vanNvbi1zY2hlbWEub3JnL2xhdGVzdC9qc29uLXNjaGVtYS12YWxpZGF0aW9uLmh0bWxcbiAqXG4gKiBOb3RlOiBUaGlzIGxpYnJhcnkgaXMgZGVzaWduZWQgYXMgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvciB0aGUgQW5ndWxhclxuICogVmFsaWRhdG9ycyBsaWJyYXJ5LCBhbmQgZXhjZXB0IGZvciBvbmUgc21hbGwgYnJlYWtpbmcgY2hhbmdlIHRvIHRoZSAncGF0dGVybidcbiAqIHZhbGlkYXRvciAoZGVzY3JpYmVkIGJlbG93KSBpdCBjYW4gZXZlbiBiZSBpbXBvcnRlZCBhcyBhIHN1YnN0aXR1dGUsIGxpa2Ugc286XG4gKlxuICogICBpbXBvcnQgeyBKc29uVmFsaWRhdG9ycyBhcyBWYWxpZGF0b3JzIH0gZnJvbSAnanNvbi12YWxpZGF0b3JzJztcbiAqXG4gKiBhbmQgaXQgc2hvdWxkIHdvcmsgd2l0aCBleGlzdGluZyBjb2RlIGFzIGEgY29tcGxldGUgcmVwbGFjZW1lbnQuXG4gKlxuICogVGhlIG9uZSBleGNlcHRpb24gaXMgdGhlICdwYXR0ZXJuJyB2YWxpZGF0b3IsIHdoaWNoIGhhcyBiZWVuIGNoYW5nZWQgdG9cbiAqIG1hdGNoZSBwYXJ0aWFsIHZhbHVlcyBieSBkZWZhdWx0ICh0aGUgc3RhbmRhcmQgJ3BhdHRlcm4nIHZhbGlkYXRvciB3cmFwcGVkXG4gKiBhbGwgcGF0dGVybnMgaW4gJ14nIGFuZCAnJCcsIGZvcmNpbmcgdGhlbSB0byBhbHdheXMgbWF0Y2ggYW4gZW50aXJlIHZhbHVlKS5cbiAqIEhvd2V2ZXIsIHRoZSBvbGQgYmVoYXZpb3IgY2FuIGJlIHJlc3RvcmVkIGJ5IHNpbXBseSBhZGRpbmcgJ14nIGFuZCAnJCdcbiAqIGFyb3VuZCB5b3VyIHBhdHRlcm5zLCBvciBieSBwYXNzaW5nIGFuIG9wdGlvbmFsIHNlY29uZCBwYXJhbWV0ZXIgb2YgVFJVRS5cbiAqIFRoaXMgY2hhbmdlIGlzIHRvIG1ha2UgdGhlICdwYXR0ZXJuJyB2YWxpZGF0b3IgbWF0Y2ggdGhlIGJlaGF2aW9yIG9mIGFcbiAqIEpTT04gU2NoZW1hIHBhdHRlcm4sIHdoaWNoIGFsbG93cyBwYXJ0aWFsIG1hdGNoZXMsIHJhdGhlciB0aGFuIHRoZSBiZWhhdmlvclxuICogb2YgYW4gSFRNTCBpbnB1dCBjb250cm9sIHBhdHRlcm4sIHdoaWNoIGRvZXMgbm90LlxuICpcbiAqIFRoaXMgbGlicmFyeSByZXBsYWNlcyBBbmd1bGFyJ3MgdmFsaWRhdG9ycyBhbmQgY29tYmluYXRpb24gZnVuY3Rpb25zXG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgdmFsaWRhdG9ycyBhbmQgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25zOlxuICpcbiAqIFZhbGlkYXRvcnM6XG4gKiAgIEZvciBhbGwgZm9ybUNvbnRyb2xzOiAgICAgcmVxdWlyZWQgKCopLCB0eXBlLCBlbnVtLCBjb25zdFxuICogICBGb3IgdGV4dCBmb3JtQ29udHJvbHM6ICAgIG1pbkxlbmd0aCAoKiksIG1heExlbmd0aCAoKiksIHBhdHRlcm4gKCopLCBmb3JtYXRcbiAqICAgRm9yIG51bWVyaWMgZm9ybUNvbnRyb2xzOiBtYXhpbXVtLCBleGNsdXNpdmVNYXhpbXVtLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW0sIGV4Y2x1c2l2ZU1pbmltdW0sIG11bHRpcGxlT2ZcbiAqICAgRm9yIGZvcm1Hcm91cCBvYmplY3RzOiAgICBtaW5Qcm9wZXJ0aWVzLCBtYXhQcm9wZXJ0aWVzLCBkZXBlbmRlbmNpZXNcbiAqICAgRm9yIGZvcm1BcnJheSBhcnJheXM6ICAgICBtaW5JdGVtcywgbWF4SXRlbXMsIHVuaXF1ZUl0ZW1zLCBjb250YWluc1xuICogICBOb3QgdXNlZCBieSBKU09OIFNjaGVtYTogIG1pbiAoKiksIG1heCAoKiksIHJlcXVpcmVkVHJ1ZSAoKiksIGVtYWlsICgqKVxuICogKFZhbGlkYXRvcnMgb3JpZ2luYWxseSBpbmNsdWRlZCB3aXRoIEFuZ3VsYXIgYXJlIG1ha2VkIHdpdGggKCopLilcbiAqXG4gKiBOT1RFIC8gVE9ETzogVGhlIGRlcGVuZGVuY2llcyB2YWxpZGF0b3IgaXMgbm90IGNvbXBsZXRlLlxuICogTk9URSAvIFRPRE86IFRoZSBjb250YWlucyB2YWxpZGF0b3IgaXMgbm90IGNvbXBsZXRlLlxuICpcbiAqIFZhbGlkYXRvcnMgbm90IHVzZWQgYnkgSlNPTiBTY2hlbWEgKGJ1dCBpbmNsdWRlZCBmb3IgY29tcGF0aWJpbGl0eSlcbiAqIGFuZCB0aGVpciBKU09OIFNjaGVtYSBlcXVpdmFsZW50czpcbiAqXG4gKiAgIEFuZ3VsYXIgdmFsaWRhdG9yIHwgSlNPTiBTY2hlbWEgZXF1aXZhbGVudFxuICogICAtLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICAgICBtaW4obnVtYmVyKSAgICAgfCAgIG1pbmltdW0obnVtYmVyKVxuICogICAgIG1heChudW1iZXIpICAgICB8ICAgbWF4aW11bShudW1iZXIpXG4gKiAgICAgcmVxdWlyZWRUcnVlKCkgIHwgICBjb25zdCh0cnVlKVxuICogICAgIGVtYWlsKCkgICAgICAgICB8ICAgZm9ybWF0KCdlbWFpbCcpXG4gKlxuICogVmFsaWRhdG9yIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uczpcbiAqICAgY29tcG9zZUFueU9mLCBjb21wb3NlT25lT2YsIGNvbXBvc2VBbGxPZiwgY29tcG9zZU5vdFxuICogKEFuZ3VsYXIncyBvcmlnaW5hbCBjb21iaW5hdGlvbiBmdW5jaXRvbiwgJ2NvbXBvc2UnLCBpcyBhbHNvIGluY2x1ZGVkIGZvclxuICogYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgdGhvdWdoIGl0IGlzIGZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIGNvbXBvc2VBbGxPZixcbiAqIGFzc2lkZSBmcm9tIGl0cyBtb3JlIGdlbmVyaWMgZXJyb3IgbWVzc2FnZS4pXG4gKlxuICogQWxsIHZhbGlkYXRvcnMgaGF2ZSBhbHNvIGJlZW4gZXh0ZW5kZWQgdG8gYWNjZXB0IGFuIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudFxuICogd2hpY2gsIGlmIHBhc3NlZCBhIFRSVUUgdmFsdWUsIGNhdXNlcyB0aGUgdmFsaWRhdG9yIHRvIHBlcmZvcm0gdGhlIG9wcG9zaXRlXG4gKiBvZiBpdHMgb3JpZ2luYWwgZmluY3Rpb24uIChUaGlzIGlzIHVzZWQgaW50ZXJuYWxseSB0byBlbmFibGUgJ25vdCcgYW5kXG4gKiAnY29tcG9zZU9uZU9mJyB0byBmdW5jdGlvbiBhbmQgcmV0dXJuIHVzZWZ1bCBlcnJvciBtZXNzYWdlcy4pXG4gKlxuICogVGhlICdyZXF1aXJlZCcgdmFsaWRhdG9yIGhhcyBhbHNvIGJlZW4gb3ZlcmxvYWRlZCBzbyB0aGF0IGlmIGNhbGxlZCB3aXRoXG4gKiBhIGJvb2xlYW4gcGFyYW1ldGVyIChvciBubyBwYXJhbWV0ZXJzKSBpdCByZXR1cm5zIHRoZSBvcmlnaW5hbCB2YWxpZGF0b3JcbiAqIGZ1bmN0aW9uIChyYXRoZXIgdGhhbiBleGVjdXRpbmcgaXQpLiBIb3dldmVyLCBpZiBpdCBpcyBjYWxsZWQgd2l0aCBhblxuICogQWJzdHJhY3RDb250cm9sIHBhcmFtZXRlciAoYXMgd2FzIHByZXZpb3VzbHkgcmVxdWlyZWQpLCBpdCBiZWhhdmVzXG4gKiBleGFjdGx5IGFzIGJlZm9yZS5cbiAqXG4gKiBUaGlzIGVuYWJsZXMgYWxsIHZhbGlkYXRvcnMgKGluY2x1ZGluZyAncmVxdWlyZWQnKSB0byBiZSBjb25zdHJ1Y3RlZCBpblxuICogZXhhY3RseSB0aGUgc2FtZSB3YXksIHNvIHRoZXkgY2FuIGJlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB1c2luZyB0aGVcbiAqIGVxdWl2YWxlbnQga2V5IG5hbWVzIGFuZCB2YWx1ZXMgdGFrZW4gZGlyZWN0bHkgZnJvbSBhIEpTT04gU2NoZW1hLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgcGFydGlhbGx5IGRlcml2ZWQgZnJvbSBBbmd1bGFyLFxuICogd2hpY2ggaXMgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcgR29vZ2xlLCBJbmMuXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyB0aGVyZWZvcmUgZ292ZXJuZWQgYnkgdGhlIHNhbWUgTUlULXN0eWxlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqXG4gKiBPcmlnaW5hbCBBbmd1bGFyIFZhbGlkYXRvcnM6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL2Zvcm1zL3NyYy92YWxpZGF0b3JzLnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBKc29uVmFsaWRhdG9ycyB7XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciBmdW5jdGlvbnM6XG4gICAqXG4gICAqIEZvciBhbGwgZm9ybUNvbnRyb2xzOiAgICAgcmVxdWlyZWQsIHR5cGUsIGVudW0sIGNvbnN0XG4gICAqIEZvciB0ZXh0IGZvcm1Db250cm9sczogICAgbWluTGVuZ3RoLCBtYXhMZW5ndGgsIHBhdHRlcm4sIGZvcm1hdFxuICAgKiBGb3IgbnVtZXJpYyBmb3JtQ29udHJvbHM6IG1heGltdW0sIGV4Y2x1c2l2ZU1heGltdW0sXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bSwgZXhjbHVzaXZlTWluaW11bSwgbXVsdGlwbGVPZlxuICAgKiBGb3IgZm9ybUdyb3VwIG9iamVjdHM6ICAgIG1pblByb3BlcnRpZXMsIG1heFByb3BlcnRpZXMsIGRlcGVuZGVuY2llc1xuICAgKiBGb3IgZm9ybUFycmF5IGFycmF5czogICAgIG1pbkl0ZW1zLCBtYXhJdGVtcywgdW5pcXVlSXRlbXMsIGNvbnRhaW5zXG4gICAqXG4gICAqIFRPRE86IGZpbmlzaCBkZXBlbmRlbmNpZXMgdmFsaWRhdG9yXG4gICAqL1xuXG4gIC8qKlxuICAgKiAncmVxdWlyZWQnIHZhbGlkYXRvclxuICAgKlxuICAgKiBUaGlzIHZhbGlkYXRvciBpcyBvdmVybG9hZGVkLCBjb21wYXJlZCB0byB0aGUgZGVmYXVsdCByZXF1aXJlZCB2YWxpZGF0b3IuXG4gICAqIElmIGNhbGxlZCB3aXRoIG5vIHBhcmFtZXRlcnMsIG9yIFRSVUUsIHRoaXMgdmFsaWRhdG9yIHJldHVybnMgdGhlXG4gICAqICdyZXF1aXJlZCcgdmFsaWRhdG9yIGZ1bmN0aW9uIChyYXRoZXIgdGhhbiBleGVjdXRpbmcgaXQpLiBUaGlzIG1hdGNoZXNcbiAgICogdGhlIGJlaGF2aW9yIG9mIGFsbCBvdGhlciB2YWxpZGF0b3JzIGluIHRoaXMgbGlicmFyeS5cbiAgICpcbiAgICogSWYgdGhpcyB2YWxpZGF0b3IgaXMgY2FsbGVkIHdpdGggYW4gQWJzdHJhY3RDb250cm9sIHBhcmFtZXRlclxuICAgKiAoYXMgd2FzIHByZXZpb3VzbHkgcmVxdWlyZWQpIGl0IGJlaGF2ZXMgdGhlIHNhbWUgYXMgQW5ndWxhcidzIGRlZmF1bHRcbiAgICogcmVxdWlyZWQgdmFsaWRhdG9yLCBhbmQgcmV0dXJucyBhbiBlcnJvciBpZiB0aGUgY29udHJvbCBpcyBlbXB0eS5cbiAgICpcbiAgICogT2xkIGJlaGF2aW9yOiAoaWYgaW5wdXQgdHlwZSA9IEFic3RyYWN0Q29udHJvbClcbiAgICogLy8ge0Fic3RyYWN0Q29udHJvbH0gY29udHJvbCAtIHJlcXVpcmVkIGNvbnRyb2xcbiAgICogLy8ge3tba2V5OiBzdHJpbmddOiBib29sZWFufX0gLSByZXR1cm5zIGVycm9yIG1lc3NhZ2UgaWYgbm8gaW5wdXRcbiAgICpcbiAgICogTmV3IGJlaGF2aW9yOiAoaWYgbm8gaW5wdXQsIG9yIGlucHV0IHR5cGUgPSBib29sZWFuKVxuICAgKiAvLyB7Ym9vbGVhbiA9IHRydWV9IHJlcXVpcmVkPyAtIHRydWUgdG8gdmFsaWRhdGUsIGZhbHNlIHRvIGRpc2FibGVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSByZXR1cm5zIHRoZSAncmVxdWlyZWQnIHZhbGlkYXRvciBmdW5jdGlvbiBpdHNlbGZcbiAgICovXG4gIHN0YXRpYyByZXF1aXJlZChpbnB1dDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xuICBzdGF0aWMgcmVxdWlyZWQoaW5wdXQ/OiBib29sZWFuKTogSVZhbGlkYXRvckZuO1xuXG4gIHN0YXRpYyByZXF1aXJlZChpbnB1dD86IEFic3RyYWN0Q29udHJvbHxib29sZWFuKTogVmFsaWRhdGlvbkVycm9yc3xudWxsfElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHsgaW5wdXQgPSB0cnVlOyB9XG4gICAgc3dpdGNoIChpbnB1dCkge1xuICAgICAgY2FzZSB0cnVlOiAvLyBSZXR1cm4gcmVxdWlyZWQgZnVuY3Rpb24gKGRvIG5vdCBleGVjdXRlIGl0IHlldClcbiAgICAgICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgICAgICBpZiAoaW52ZXJ0KSB7IHJldHVybiBudWxsOyB9IC8vIGlmIG5vdCByZXF1aXJlZCwgYWx3YXlzIHJldHVybiB2YWxpZFxuICAgICAgICAgIHJldHVybiBoYXNWYWx1ZShjb250cm9sLnZhbHVlKSA/IG51bGwgOiB7ICdyZXF1aXJlZCc6IHRydWUgfTtcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgZmFsc2U6IC8vIERvIG5vdGhpbmcgKGlmIGZpZWxkIGlzIG5vdCByZXF1aXJlZCwgaXQgaXMgYWx3YXlzIHZhbGlkKVxuICAgICAgICByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjtcbiAgICAgIGRlZmF1bHQ6IC8vIEV4ZWN1dGUgcmVxdWlyZWQgZnVuY3Rpb25cbiAgICAgICAgcmV0dXJuIGhhc1ZhbHVlKCg8QWJzdHJhY3RDb250cm9sPmlucHV0KS52YWx1ZSkgPyBudWxsIDogeyAncmVxdWlyZWQnOiB0cnVlIH07XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiAndHlwZScgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCB0byBvbmx5IGFjY2VwdCB2YWx1ZXMgb2YgYSBzcGVjaWZpZWQgdHlwZSxcbiAgICogb3Igb25lIG9mIGFuIGFycmF5IG9mIHR5cGVzLlxuICAgKlxuICAgKiBOb3RlOiBTY2hlbWFQcmltaXRpdmVUeXBlID0gJ3N0cmluZyd8J251bWJlcid8J2ludGVnZXInfCdib29sZWFuJ3wnbnVsbCdcbiAgICpcbiAgICogLy8ge1NjaGVtYVByaW1pdGl2ZVR5cGV8U2NoZW1hUHJpbWl0aXZlVHlwZVtdfSB0eXBlIC0gdHlwZShzKSB0byBhY2NlcHRcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyB0eXBlKHJlcXVpcmVkVHlwZTogU2NoZW1hUHJpbWl0aXZlVHlwZXxTY2hlbWFQcmltaXRpdmVUeXBlW10pOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUocmVxdWlyZWRUeXBlKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgY3VycmVudFZhbHVlOiBhbnkgPSBjb250cm9sLnZhbHVlO1xuICAgICAgY29uc3QgaXNWYWxpZCA9IGlzQXJyYXkocmVxdWlyZWRUeXBlKSA/XG4gICAgICAgICg8U2NoZW1hUHJpbWl0aXZlVHlwZVtdPnJlcXVpcmVkVHlwZSkuc29tZSh0eXBlID0+IGlzVHlwZShjdXJyZW50VmFsdWUsIHR5cGUpKSA6XG4gICAgICAgIGlzVHlwZShjdXJyZW50VmFsdWUsIDxTY2hlbWFQcmltaXRpdmVUeXBlPnJlcXVpcmVkVHlwZSk7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAndHlwZSc6IHsgcmVxdWlyZWRUeXBlLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2VudW0nIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGNvbnRyb2wgdG8gaGF2ZSBhIHZhbHVlIGZyb20gYW4gZW51bWVyYXRlZCBsaXN0IG9mIHZhbHVlcy5cbiAgICpcbiAgICogQ29udmVydHMgdHlwZXMgYXMgbmVlZGVkIHRvIGFsbG93IHN0cmluZyBpbnB1dHMgdG8gc3RpbGwgY29ycmVjdGx5XG4gICAqIG1hdGNoIG51bWJlciwgYm9vbGVhbiwgYW5kIG51bGwgZW51bSB2YWx1ZXMuXG4gICAqXG4gICAqIC8vIHthbnlbXX0gYWxsb3dlZFZhbHVlcyAtIGFycmF5IG9mIGFjY2VwdGFibGUgdmFsdWVzXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgZW51bShhbGxvd2VkVmFsdWVzOiBhbnlbXSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFpc0FycmF5KGFsbG93ZWRWYWx1ZXMpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWU6IGFueSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBjb25zdCBpc0VxdWFsID0gKGVudW1WYWx1ZSwgaW5wdXRWYWx1ZSkgPT5cbiAgICAgICAgZW51bVZhbHVlID09PSBpbnB1dFZhbHVlIHx8XG4gICAgICAgIChpc051bWJlcihlbnVtVmFsdWUpICYmICtpbnB1dFZhbHVlID09PSArZW51bVZhbHVlKSB8fFxuICAgICAgICAoaXNCb29sZWFuKGVudW1WYWx1ZSwgJ3N0cmljdCcpICYmXG4gICAgICAgICAgdG9KYXZhU2NyaXB0VHlwZShpbnB1dFZhbHVlLCAnYm9vbGVhbicpID09PSBlbnVtVmFsdWUpIHx8XG4gICAgICAgIChlbnVtVmFsdWUgPT09IG51bGwgJiYgIWhhc1ZhbHVlKGlucHV0VmFsdWUpKSB8fFxuICAgICAgICBfLmlzRXF1YWwoZW51bVZhbHVlLCBpbnB1dFZhbHVlKTtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSBpc0FycmF5KGN1cnJlbnRWYWx1ZSkgP1xuICAgICAgICBjdXJyZW50VmFsdWUuZXZlcnkoaW5wdXRWYWx1ZSA9PiBhbGxvd2VkVmFsdWVzLnNvbWUoZW51bVZhbHVlID0+XG4gICAgICAgICAgaXNFcXVhbChlbnVtVmFsdWUsIGlucHV0VmFsdWUpXG4gICAgICAgICkpIDpcbiAgICAgICAgYWxsb3dlZFZhbHVlcy5zb21lKGVudW1WYWx1ZSA9PiBpc0VxdWFsKGVudW1WYWx1ZSwgY3VycmVudFZhbHVlKSk7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnZW51bSc6IHsgYWxsb3dlZFZhbHVlcywgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb25zdCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCB0byBoYXZlIGEgc3BlY2lmaWMgdmFsdWUuXG4gICAqXG4gICAqIENvbnZlcnRzIHR5cGVzIGFzIG5lZWRlZCB0byBhbGxvdyBzdHJpbmcgaW5wdXRzIHRvIHN0aWxsIGNvcnJlY3RseVxuICAgKiBtYXRjaCBudW1iZXIsIGJvb2xlYW4sIGFuZCBudWxsIHZhbHVlcy5cbiAgICpcbiAgICogVE9ETzogbW9kaWZ5IHRvIHdvcmsgd2l0aCBvYmplY3RzXG4gICAqXG4gICAqIC8vIHthbnlbXX0gcmVxdWlyZWRWYWx1ZSAtIHJlcXVpcmVkIHZhbHVlXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgY29uc3QocmVxdWlyZWRWYWx1ZTogYW55KTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKHJlcXVpcmVkVmFsdWUpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWU6IGFueSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBjb25zdCBpc0VxdWFsID0gKGNvbnN0VmFsdWUsIGlucHV0VmFsdWUpID0+XG4gICAgICAgIGNvbnN0VmFsdWUgPT09IGlucHV0VmFsdWUgfHxcbiAgICAgICAgaXNOdW1iZXIoY29uc3RWYWx1ZSkgJiYgK2lucHV0VmFsdWUgPT09ICtjb25zdFZhbHVlIHx8XG4gICAgICAgIGlzQm9vbGVhbihjb25zdFZhbHVlLCAnc3RyaWN0JykgJiZcbiAgICAgICAgICB0b0phdmFTY3JpcHRUeXBlKGlucHV0VmFsdWUsICdib29sZWFuJykgPT09IGNvbnN0VmFsdWUgfHxcbiAgICAgICAgY29uc3RWYWx1ZSA9PT0gbnVsbCAmJiAhaGFzVmFsdWUoaW5wdXRWYWx1ZSk7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gaXNFcXVhbChyZXF1aXJlZFZhbHVlLCBjdXJyZW50VmFsdWUpO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ2NvbnN0JzogeyByZXF1aXJlZFZhbHVlLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ21pbkxlbmd0aCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIHRleHQgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bUxlbmd0aCAtIG1pbmltdW0gYWxsb3dlZCBzdHJpbmcgbGVuZ3RoXG4gICAqIC8vIHtib29sZWFuID0gZmFsc2V9IGludmVydCAtIGluc3RlYWQgcmV0dXJuIGVycm9yIG9iamVjdCBvbmx5IGlmIHZhbGlkXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbWluTGVuZ3RoKG1pbmltdW1MZW5ndGg6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtaW5pbXVtTGVuZ3RoKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRMZW5ndGggPSBpc1N0cmluZyhjb250cm9sLnZhbHVlKSA/IGNvbnRyb2wudmFsdWUubGVuZ3RoIDogMDtcbiAgICAgIGxldCBpc1ZhbGlkID0gY3VycmVudExlbmd0aCA+PSBtaW5pbXVtTGVuZ3RoO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21pbkxlbmd0aCc6IHsgbWluaW11bUxlbmd0aCwgY3VycmVudExlbmd0aCB9IH07XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogJ21heExlbmd0aCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIHRleHQgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWF4aW11bUxlbmd0aCAtIG1heGltdW0gYWxsb3dlZCBzdHJpbmcgbGVuZ3RoXG4gICAqIC8vIHtib29sZWFuID0gZmFsc2V9IGludmVydCAtIGluc3RlYWQgcmV0dXJuIGVycm9yIG9iamVjdCBvbmx5IGlmIHZhbGlkXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbWF4TGVuZ3RoKG1heGltdW1MZW5ndGg6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtYXhpbXVtTGVuZ3RoKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBsZXQgY3VycmVudExlbmd0aCA9IGlzU3RyaW5nKGNvbnRyb2wudmFsdWUpID8gY29udHJvbC52YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgbGV0IGlzVmFsaWQgPSBjdXJyZW50TGVuZ3RoIDw9IG1heGltdW1MZW5ndGg7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnbWF4TGVuZ3RoJzogeyBtYXhpbXVtTGVuZ3RoLCBjdXJyZW50TGVuZ3RoIH0gfTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiAncGF0dGVybicgdmFsaWRhdG9yXG4gICAqXG4gICAqIE5vdGU6IE5PVCB0aGUgc2FtZSBhcyBBbmd1bGFyJ3MgZGVmYXVsdCBwYXR0ZXJuIHZhbGlkYXRvci5cbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sJ3MgdmFsdWUgdG8gbWF0Y2ggYSBzcGVjaWZpZWQgcmVndWxhciBleHByZXNzaW9uIHBhdHRlcm4uXG4gICAqXG4gICAqIFRoaXMgdmFsaWRhdG9yIGNoYW5nZXMgdGhlIGJlaGF2aW9yIG9mIGRlZmF1bHQgcGF0dGVybiB2YWxpZGF0b3JcbiAgICogYnkgcmVwbGFjaW5nIFJlZ0V4cChgXiR7cGF0dGVybn0kYCkgd2l0aCBSZWdFeHAoYCR7cGF0dGVybn1gKSxcbiAgICogd2hpY2ggYWxsb3dzIGZvciBwYXJ0aWFsIG1hdGNoZXMuXG4gICAqXG4gICAqIFRvIHJldHVybiB0byB0aGUgZGVmYXVsdCBmdW5jaXRvbmFsaXR5LCBhbmQgbWF0Y2ggdGhlIGVudGlyZSBzdHJpbmcsXG4gICAqIHBhc3MgVFJVRSBhcyB0aGUgb3B0aW9uYWwgc2Vjb25kIHBhcmFtZXRlci5cbiAgICpcbiAgICogLy8ge3N0cmluZ30gcGF0dGVybiAtIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJuXG4gICAqIC8vIHtib29sZWFuID0gZmFsc2V9IHdob2xlU3RyaW5nIC0gbWF0Y2ggd2hvbGUgdmFsdWUgc3RyaW5nP1xuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIHBhdHRlcm4ocGF0dGVybjogc3RyaW5nfFJlZ0V4cCwgd2hvbGVTdHJpbmcgPSBmYWxzZSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShwYXR0ZXJuKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IHJlZ2V4OiBSZWdFeHA7XG4gICAgICBsZXQgcmVxdWlyZWRQYXR0ZXJuOiBzdHJpbmc7XG4gICAgICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlcXVpcmVkUGF0dGVybiA9ICh3aG9sZVN0cmluZykgPyBgXiR7cGF0dGVybn0kYCA6IHBhdHRlcm47XG4gICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZXF1aXJlZFBhdHRlcm4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWlyZWRQYXR0ZXJuID0gcGF0dGVybi50b1N0cmluZygpO1xuICAgICAgICByZWdleCA9IHBhdHRlcm47XG4gICAgICB9XG4gICAgICBsZXQgY3VycmVudFZhbHVlOiBzdHJpbmcgPSBjb250cm9sLnZhbHVlO1xuICAgICAgbGV0IGlzVmFsaWQgPSBpc1N0cmluZyhjdXJyZW50VmFsdWUpID8gcmVnZXgudGVzdChjdXJyZW50VmFsdWUpIDogZmFsc2U7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAncGF0dGVybic6IHsgcmVxdWlyZWRQYXR0ZXJuLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2Zvcm1hdCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCB0byBoYXZlIGEgdmFsdWUgb2YgYSBjZXJ0YWluIGZvcm1hdC5cbiAgICpcbiAgICogVGhpcyB2YWxpZGF0b3IgY3VycmVudGx5IGNoZWNrcyB0aGUgZm9sbG93aW5nIGZvcm1zdHM6XG4gICAqICAgZGF0ZSwgdGltZSwgZGF0ZS10aW1lLCBlbWFpbCwgaG9zdG5hbWUsIGlwdjQsIGlwdjYsXG4gICAqICAgdXJpLCB1cmktcmVmZXJlbmNlLCB1cmktdGVtcGxhdGUsIHVybCwgdXVpZCwgY29sb3IsXG4gICAqICAganNvbi1wb2ludGVyLCByZWxhdGl2ZS1qc29uLXBvaW50ZXIsIHJlZ2V4XG4gICAqXG4gICAqIEZhc3QgZm9ybWF0IHJlZ3VsYXIgZXhwcmVzc2lvbnMgY29waWVkIGZyb20gQUpWOlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vZXBvYmVyZXpraW4vYWp2L2Jsb2IvbWFzdGVyL2xpYi9jb21waWxlL2Zvcm1hdHMuanNcbiAgICpcbiAgICogLy8ge0pzb25TY2hlbWFGb3JtYXROYW1lc30gcmVxdWlyZWRGb3JtYXQgLSBmb3JtYXQgdG8gY2hlY2tcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBmb3JtYXQocmVxdWlyZWRGb3JtYXQ6IEpzb25TY2hlbWFGb3JtYXROYW1lcyk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShyZXF1aXJlZEZvcm1hdCkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBpc1ZhbGlkOiBib29sZWFuO1xuICAgICAgbGV0IGN1cnJlbnRWYWx1ZTogc3RyaW5nfERhdGUgPSBjb250cm9sLnZhbHVlO1xuICAgICAgaWYgKGlzU3RyaW5nKGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0VGVzdDogRnVuY3Rpb258UmVnRXhwID0ganNvblNjaGVtYUZvcm1hdFRlc3RzW3JlcXVpcmVkRm9ybWF0XTtcbiAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXRUZXN0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlzVmFsaWQgPSAoPFJlZ0V4cD5mb3JtYXRUZXN0KS50ZXN0KDxzdHJpbmc+Y3VycmVudFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZm9ybWF0VGVzdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlzVmFsaWQgPSAoPEZ1bmN0aW9uPmZvcm1hdFRlc3QpKDxzdHJpbmc+Y3VycmVudFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBmb3JtYXQgdmFsaWRhdG9yIGVycm9yOiBcIiR7cmVxdWlyZWRGb3JtYXR9XCIgaXMgbm90IGEgcmVjb2duaXplZCBmb3JtYXQuYCk7XG4gICAgICAgICAgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEFsbG93IEphdmFTY3JpcHQgRGF0ZSBvYmplY3RzXG4gICAgICAgIGlzVmFsaWQgPSBbJ2RhdGUnLCAndGltZScsICdkYXRlLXRpbWUnXS5pbmNsdWRlcyhyZXF1aXJlZEZvcm1hdCkgJiZcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoY3VycmVudFZhbHVlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ2Zvcm1hdCc6IHsgcmVxdWlyZWRGb3JtYXQsIGN1cnJlbnRWYWx1ZSB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWluaW11bScgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIG51bWVyaWMgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvXG4gICAqIGEgbWluaW11bSBhbW91bnQuXG4gICAqXG4gICAqIEFueSBub24tbnVtZXJpYyB2YWx1ZSBpcyBhbHNvIHZhbGlkIChhY2NvcmRpbmcgdG8gdGhlIEhUTUwgZm9ybXMgc3BlYyxcbiAgICogYSBub24tbnVtZXJpYyB2YWx1ZSBkb2Vzbid0IGhhdmUgYSBtaW5pbXVtKS5cbiAgICogaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjYXR0ci1pbnB1dC1tYXhcbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bSAtIG1pbmltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1pbmltdW0obWluaW11bVZhbHVlOiBudW1iZXIpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUobWluaW11bVZhbHVlKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBsZXQgaXNWYWxpZCA9ICFpc051bWJlcihjdXJyZW50VmFsdWUpIHx8IGN1cnJlbnRWYWx1ZSA+PSBtaW5pbXVtVmFsdWU7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnbWluaW11bSc6IHsgbWluaW11bVZhbHVlLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2V4Y2x1c2l2ZU1pbmltdW0nIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGNvbnRyb2wncyBudW1lcmljIHZhbHVlIHRvIGJlIGxlc3MgdGhhbiBhIG1heGltdW0gYW1vdW50LlxuICAgKlxuICAgKiBBbnkgbm9uLW51bWVyaWMgdmFsdWUgaXMgYWxzbyB2YWxpZCAoYWNjb3JkaW5nIHRvIHRoZSBIVE1MIGZvcm1zIHNwZWMsXG4gICAqIGEgbm9uLW51bWVyaWMgdmFsdWUgZG9lc24ndCBoYXZlIGEgbWF4aW11bSkuXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWF4XG4gICAqXG4gICAqIC8vIHtudW1iZXJ9IGV4Y2x1c2l2ZU1pbmltdW1WYWx1ZSAtIG1heGltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIGV4Y2x1c2l2ZU1pbmltdW0oZXhjbHVzaXZlTWluaW11bVZhbHVlOiBudW1iZXIpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUoZXhjbHVzaXZlTWluaW11bVZhbHVlKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBsZXQgaXNWYWxpZCA9ICFpc051bWJlcihjdXJyZW50VmFsdWUpIHx8ICtjdXJyZW50VmFsdWUgPCBleGNsdXNpdmVNaW5pbXVtVmFsdWU7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnZXhjbHVzaXZlTWluaW11bSc6IHsgZXhjbHVzaXZlTWluaW11bVZhbHVlLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ21heGltdW0nIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGNvbnRyb2wncyBudW1lcmljIHZhbHVlIHRvIGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0b1xuICAgKiBhIG1heGltdW0gYW1vdW50LlxuICAgKlxuICAgKiBBbnkgbm9uLW51bWVyaWMgdmFsdWUgaXMgYWxzbyB2YWxpZCAoYWNjb3JkaW5nIHRvIHRoZSBIVE1MIGZvcm1zIHNwZWMsXG4gICAqIGEgbm9uLW51bWVyaWMgdmFsdWUgZG9lc24ndCBoYXZlIGEgbWF4aW11bSkuXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWF4XG4gICAqXG4gICAqIC8vIHtudW1iZXJ9IG1heGltdW1WYWx1ZSAtIG1heGltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1heGltdW0obWF4aW11bVZhbHVlOiBudW1iZXIpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUobWF4aW11bVZhbHVlKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBsZXQgaXNWYWxpZCA9ICFpc051bWJlcihjdXJyZW50VmFsdWUpIHx8ICtjdXJyZW50VmFsdWUgPD0gbWF4aW11bVZhbHVlO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21heGltdW0nOiB7IG1heGltdW1WYWx1ZSwgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdleGNsdXNpdmVNYXhpbXVtJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sJ3MgbnVtZXJpYyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gYSBtYXhpbXVtIGFtb3VudC5cbiAgICpcbiAgICogQW55IG5vbi1udW1lcmljIHZhbHVlIGlzIGFsc28gdmFsaWQgKGFjY29yZGluZyB0byB0aGUgSFRNTCBmb3JtcyBzcGVjLFxuICAgKiBhIG5vbi1udW1lcmljIHZhbHVlIGRvZXNuJ3QgaGF2ZSBhIG1heGltdW0pLlxuICAgKiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1heFxuICAgKlxuICAgKiAvLyB7bnVtYmVyfSBleGNsdXNpdmVNYXhpbXVtVmFsdWUgLSBtYXhpbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBleGNsdXNpdmVNYXhpbXVtKGV4Y2x1c2l2ZU1heGltdW1WYWx1ZTogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKGV4Y2x1c2l2ZU1heGltdW1WYWx1ZSkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBjdXJyZW50VmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgICAgbGV0IGlzVmFsaWQgPSAhaXNOdW1iZXIoY3VycmVudFZhbHVlKSB8fCArY3VycmVudFZhbHVlIDwgZXhjbHVzaXZlTWF4aW11bVZhbHVlO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ2V4Y2x1c2l2ZU1heGltdW0nOiB7IGV4Y2x1c2l2ZU1heGltdW1WYWx1ZSwgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdtdWx0aXBsZU9mJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sIHRvIGhhdmUgYSBudW1lcmljIHZhbHVlIHRoYXQgaXMgYSBtdWx0aXBsZVxuICAgKiBvZiBhIHNwZWNpZmllZCBudW1iZXIuXG4gICAqXG4gICAqIC8vIHtudW1iZXJ9IG11bHRpcGxlT2ZWYWx1ZSAtIG51bWJlciB2YWx1ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2ZcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBtdWx0aXBsZU9mKG11bHRpcGxlT2ZWYWx1ZTogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG11bHRpcGxlT2ZWYWx1ZSkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBjdXJyZW50VmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgICAgbGV0IGlzVmFsaWQgPSBpc051bWJlcihjdXJyZW50VmFsdWUpICYmXG4gICAgICAgIGN1cnJlbnRWYWx1ZSAlIG11bHRpcGxlT2ZWYWx1ZSA9PT0gMDtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdtdWx0aXBsZU9mJzogeyBtdWx0aXBsZU9mVmFsdWUsIGN1cnJlbnRWYWx1ZSB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWluUHJvcGVydGllcycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgZm9ybSBncm91cCB0byBoYXZlIGEgbWluaW11bSBudW1iZXIgb2YgcHJvcGVydGllcyAoaS5lLiBoYXZlXG4gICAqIHZhbHVlcyBlbnRlcmVkIGluIGEgbWluaW11bSBudW1iZXIgb2YgY29udHJvbHMgd2l0aGluIHRoZSBncm91cCkuXG4gICAqXG4gICAqIC8vIHtudW1iZXJ9IG1pbmltdW1Qcm9wZXJ0aWVzIC0gbWluaW11bSBudW1iZXIgb2YgcHJvcGVydGllcyBhbGxvd2VkXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbWluUHJvcGVydGllcyhtaW5pbXVtUHJvcGVydGllczogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1pbmltdW1Qcm9wZXJ0aWVzKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoY29udHJvbC52YWx1ZSkubGVuZ3RoIHx8IDA7XG4gICAgICBsZXQgaXNWYWxpZCA9IGN1cnJlbnRQcm9wZXJ0aWVzID49IG1pbmltdW1Qcm9wZXJ0aWVzO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21pblByb3BlcnRpZXMnOiB7IG1pbmltdW1Qcm9wZXJ0aWVzLCBjdXJyZW50UHJvcGVydGllcyB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWF4UHJvcGVydGllcycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgZm9ybSBncm91cCB0byBoYXZlIGEgbWF4aW11bSBudW1iZXIgb2YgcHJvcGVydGllcyAoaS5lLiBoYXZlXG4gICAqIHZhbHVlcyBlbnRlcmVkIGluIGEgbWF4aW11bSBudW1iZXIgb2YgY29udHJvbHMgd2l0aGluIHRoZSBncm91cCkuXG4gICAqXG4gICAqIE5vdGU6IEhhcyBubyBlZmZlY3QgaWYgdGhlIGZvcm0gZ3JvdXAgZG9lcyBub3QgY29udGFpbiBtb3JlIHRoYW4gdGhlXG4gICAqIG1heGltdW0gbnVtYmVyIG9mIGNvbnRyb2xzLlxuICAgKlxuICAgKiAvLyB7bnVtYmVyfSBtYXhpbXVtUHJvcGVydGllcyAtIG1heGltdW0gbnVtYmVyIG9mIHByb3BlcnRpZXMgYWxsb3dlZFxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1heFByb3BlcnRpZXMobWF4aW11bVByb3BlcnRpZXM6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtYXhpbXVtUHJvcGVydGllcykpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoY29udHJvbC52YWx1ZSkubGVuZ3RoIHx8IDA7XG4gICAgICBsZXQgaXNWYWxpZCA9IGN1cnJlbnRQcm9wZXJ0aWVzIDw9IG1heGltdW1Qcm9wZXJ0aWVzO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21heFByb3BlcnRpZXMnOiB7IG1heGltdW1Qcm9wZXJ0aWVzLCBjdXJyZW50UHJvcGVydGllcyB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnZGVwZW5kZW5jaWVzJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgdGhlIGNvbnRyb2xzIGluIGEgZm9ybSBncm91cCB0byBtZWV0IGFkZGl0aW9uYWwgdmFsaWRhdGlvblxuICAgKiBjcml0ZXJpYSwgZGVwZW5kaW5nIG9uIHRoZSB2YWx1ZXMgb2Ygb3RoZXIgY29udHJvbHMgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogaHR0cHM6Ly9zcGFjZXRlbGVzY29wZS5naXRodWIuaW8vdW5kZXJzdGFuZGluZy1qc29uLXNjaGVtYS9yZWZlcmVuY2Uvb2JqZWN0Lmh0bWwjZGVwZW5kZW5jaWVzXG4gICAqXG4gICAqIC8vIHthbnl9IGRlcGVuZGVuY2llcyAtIHJlcXVpcmVkIGRlcGVuZGVuY2llc1xuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIGRlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXM6IGFueSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKGdldFR5cGUoZGVwZW5kZW5jaWVzKSAhPT0gJ29iamVjdCcgfHwgaXNFbXB0eShkZXBlbmRlbmNpZXMpKSB7XG4gICAgICByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjtcbiAgICB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBsZXQgYWxsRXJyb3JzID0gX21lcmdlT2JqZWN0cyhcbiAgICAgICAgZm9yRWFjaENvcHkoZGVwZW5kZW5jaWVzLCAodmFsdWUsIHJlcXVpcmluZ0ZpZWxkKSA9PiB7XG4gICAgICAgICAgaWYgKCFoYXNWYWx1ZShjb250cm9sLnZhbHVlW3JlcXVpcmluZ0ZpZWxkXSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgICAgICBsZXQgcmVxdWlyaW5nRmllbGRFcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgPSB7IH07XG4gICAgICAgICAgbGV0IHJlcXVpcmVkRmllbGRzOiBzdHJpbmdbXTtcbiAgICAgICAgICBsZXQgcHJvcGVydGllczogVmFsaWRhdGlvbkVycm9ycyA9IHsgfTtcbiAgICAgICAgICBpZiAoZ2V0VHlwZShkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdKSA9PT0gJ2FycmF5Jykge1xuICAgICAgICAgICAgcmVxdWlyZWRGaWVsZHMgPSBkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZ2V0VHlwZShkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJlcXVpcmVkRmllbGRzID0gZGVwZW5kZW5jaWVzW3JlcXVpcmluZ0ZpZWxkXVsncmVxdWlyZWQnXSB8fCBbXTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdWydwcm9wZXJ0aWVzJ10gfHwgeyB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFZhbGlkYXRlIHByb3BlcnR5IGRlcGVuZGVuY2llc1xuICAgICAgICAgIGZvciAobGV0IHJlcXVpcmVkRmllbGQgb2YgcmVxdWlyZWRGaWVsZHMpIHtcbiAgICAgICAgICAgIGlmICh4b3IoIWhhc1ZhbHVlKGNvbnRyb2wudmFsdWVbcmVxdWlyZWRGaWVsZF0pLCBpbnZlcnQpKSB7XG4gICAgICAgICAgICAgIHJlcXVpcmluZ0ZpZWxkRXJyb3JzW3JlcXVpcmVkRmllbGRdID0geyAncmVxdWlyZWQnOiB0cnVlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVmFsaWRhdGUgc2NoZW1hIGRlcGVuZGVuY2llc1xuICAgICAgICAgIHJlcXVpcmluZ0ZpZWxkRXJyb3JzID0gX21lcmdlT2JqZWN0cyhyZXF1aXJpbmdGaWVsZEVycm9ycyxcbiAgICAgICAgICAgIGZvckVhY2hDb3B5KHByb3BlcnRpZXMsIChyZXF1aXJlbWVudHMsIHJlcXVpcmVkRmllbGQpID0+IHtcbiAgICAgICAgICAgICAgbGV0IHJlcXVpcmVkRmllbGRFcnJvcnMgPSBfbWVyZ2VPYmplY3RzKFxuICAgICAgICAgICAgICAgIGZvckVhY2hDb3B5KHJlcXVpcmVtZW50cywgKHJlcXVpcmVtZW50LCBwYXJhbWV0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgIGxldCB2YWxpZGF0b3I6IElWYWxpZGF0b3JGbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAocmVxdWlyZW1lbnQgPT09ICdtYXhpbXVtJyB8fCByZXF1aXJlbWVudCA9PT0gJ21pbmltdW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBleGNsdXNpdmUgPSAhIXJlcXVpcmVtZW50c1snZXhjbHVzaXZlTScgKyByZXF1aXJlbWVudC5zbGljZSgxKV07XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvciA9IEpzb25WYWxpZGF0b3JzW3JlcXVpcmVtZW50XShwYXJhbWV0ZXIsIGV4Y2x1c2l2ZSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBKc29uVmFsaWRhdG9yc1tyZXF1aXJlbWVudF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yID0gSnNvblZhbGlkYXRvcnNbcmVxdWlyZW1lbnRdKHBhcmFtZXRlcik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gIWlzRGVmaW5lZCh2YWxpZGF0b3IpID9cbiAgICAgICAgICAgICAgICAgICAgbnVsbCA6IHZhbGlkYXRvcihjb250cm9sLnZhbHVlW3JlcXVpcmVkRmllbGRdKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICByZXR1cm4gaXNFbXB0eShyZXF1aXJlZEZpZWxkRXJyb3JzKSA/XG4gICAgICAgICAgICAgICAgbnVsbCA6IHsgW3JlcXVpcmVkRmllbGRdOiByZXF1aXJlZEZpZWxkRXJyb3JzIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIGlzRW1wdHkocmVxdWlyaW5nRmllbGRFcnJvcnMpID9cbiAgICAgICAgICAgIG51bGwgOiB7IFtyZXF1aXJpbmdGaWVsZF06IHJlcXVpcmluZ0ZpZWxkRXJyb3JzIH07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgICAgcmV0dXJuIGlzRW1wdHkoYWxsRXJyb3JzKSA/IG51bGwgOiBhbGxFcnJvcnM7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWluSXRlbXMnIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGZvcm0gYXJyYXkgdG8gaGF2ZSBhIG1pbmltdW0gbnVtYmVyIG9mIHZhbHVlcy5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bUl0ZW1zIC0gbWluaW11bSBudW1iZXIgb2YgaXRlbXMgYWxsb3dlZFxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1pbkl0ZW1zKG1pbmltdW1JdGVtczogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1pbmltdW1JdGVtcykpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBjdXJyZW50SXRlbXMgPSBpc0FycmF5KGNvbnRyb2wudmFsdWUpID8gY29udHJvbC52YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgbGV0IGlzVmFsaWQgPSBjdXJyZW50SXRlbXMgPj0gbWluaW11bUl0ZW1zO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21pbkl0ZW1zJzogeyBtaW5pbXVtSXRlbXMsIGN1cnJlbnRJdGVtcyB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWF4SXRlbXMnIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGZvcm0gYXJyYXkgdG8gaGF2ZSBhIG1heGltdW0gbnVtYmVyIG9mIHZhbHVlcy5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWF4aW11bUl0ZW1zIC0gbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgYWxsb3dlZFxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1heEl0ZW1zKG1heGltdW1JdGVtczogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1heGltdW1JdGVtcykpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRJdGVtcyA9IGlzQXJyYXkoY29udHJvbC52YWx1ZSkgPyBjb250cm9sLnZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICBsZXQgaXNWYWxpZCA9IGN1cnJlbnRJdGVtcyA8PSBtYXhpbXVtSXRlbXM7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnbWF4SXRlbXMnOiB7IG1heGltdW1JdGVtcywgY3VycmVudEl0ZW1zIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICd1bmlxdWVJdGVtcycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXkgdG8gYmUgdW5pcXVlLlxuICAgKlxuICAgKiAvLyB7Ym9vbGVhbiA9IHRydWV9IHVuaXF1ZT8gLSB0cnVlIHRvIHZhbGlkYXRlLCBmYWxzZSB0byBkaXNhYmxlXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgdW5pcXVlSXRlbXModW5pcXVlID0gdHJ1ZSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCF1bmlxdWUpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBzb3J0ZWQ6IGFueVtdID0gY29udHJvbC52YWx1ZS5zbGljZSgpLnNvcnQoKTtcbiAgICAgIGxldCBkdXBsaWNhdGVJdGVtcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb3J0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvcnRlZFtpIC0gMV0gPT09IHNvcnRlZFtpXSAmJiBkdXBsaWNhdGVJdGVtcy5pbmNsdWRlcyhzb3J0ZWRbaV0pKSB7XG4gICAgICAgICAgZHVwbGljYXRlSXRlbXMucHVzaChzb3J0ZWRbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgaXNWYWxpZCA9ICFkdXBsaWNhdGVJdGVtcy5sZW5ndGg7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAndW5pcXVlSXRlbXMnOiB7IGR1cGxpY2F0ZUl0ZW1zIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb250YWlucycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFRPRE86IENvbXBsZXRlIHRoaXMgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXkgdG8gYmUgdW5pcXVlLlxuICAgKlxuICAgKiAvLyB7Ym9vbGVhbiA9IHRydWV9IHVuaXF1ZT8gLSB0cnVlIHRvIHZhbGlkYXRlLCBmYWxzZSB0byBkaXNhYmxlXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgY29udGFpbnMocmVxdWlyZWRJdGVtID0gdHJ1ZSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFyZXF1aXJlZEl0ZW0pIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkgfHwgIWlzQXJyYXkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtcyA9IGNvbnRyb2wudmFsdWU7XG4gICAgICAvLyBjb25zdCBpc1ZhbGlkID0gY3VycmVudEl0ZW1zLnNvbWUoaXRlbSA9PlxuICAgICAgLy9cbiAgICAgIC8vICk7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdjb250YWlucyc6IHsgcmVxdWlyZWRJdGVtLCBjdXJyZW50SXRlbXMgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTm8tb3AgdmFsaWRhdG9yLiBJbmNsdWRlZCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS5cbiAgICovXG4gIHN0YXRpYyBudWxsVmFsaWRhdG9yKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uczpcbiAgICogY29tcG9zZUFueU9mLCBjb21wb3NlT25lT2YsIGNvbXBvc2VBbGxPZiwgY29tcG9zZU5vdCxcbiAgICogY29tcG9zZSwgY29tcG9zZUFzeW5jXG4gICAqXG4gICAqIFRPRE86IEFkZCBjb21wb3NlQW55T2ZBc3luYywgY29tcG9zZU9uZU9mQXN5bmMsXG4gICAqICAgICAgICAgICBjb21wb3NlQWxsT2ZBc3luYywgY29tcG9zZU5vdEFzeW5jXG4gICAqL1xuXG4gIC8qKlxuICAgKiAnY29tcG9zZUFueU9mJyB2YWxpZGF0b3IgY29tYmluYXRpb24gZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhbiBhcnJheSBvZiB2YWxpZGF0b3JzIGFuZCByZXR1cm5zIGEgc2luZ2xlIHZhbGlkYXRvciB0aGF0XG4gICAqIGV2YWx1YXRlcyB0byB2YWxpZCBpZiBhbnkgb25lIG9yIG1vcmUgb2YgdGhlIHN1Ym1pdHRlZCB2YWxpZGF0b3JzIGFyZVxuICAgKiB2YWxpZC4gSWYgZXZlcnkgdmFsaWRhdG9yIGlzIGludmFsaWQsIGl0IHJldHVybnMgY29tYmluZWQgZXJyb3JzIGZyb21cbiAgICogYWxsIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIC8vIHtJVmFsaWRhdG9yRm5bXX0gdmFsaWRhdG9ycyAtIGFycmF5IG9mIHZhbGlkYXRvcnMgdG8gY29tYmluZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufSAtIHNpbmdsZSBjb21iaW5lZCB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICovXG4gIHN0YXRpYyBjb21wb3NlQW55T2YodmFsaWRhdG9yczogSVZhbGlkYXRvckZuW10pOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghdmFsaWRhdG9ycykgeyByZXR1cm4gbnVsbDsgfVxuICAgIGxldCBwcmVzZW50VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzRGVmaW5lZCk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBsZXQgYXJyYXlPZkVycm9ycyA9XG4gICAgICAgIF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycywgaW52ZXJ0KS5maWx0ZXIoaXNEZWZpbmVkKTtcbiAgICAgIGxldCBpc1ZhbGlkID0gdmFsaWRhdG9ycy5sZW5ndGggPiBhcnJheU9mRXJyb3JzLmxlbmd0aDtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiBfbWVyZ2VPYmplY3RzKC4uLmFycmF5T2ZFcnJvcnMsIHsgJ2FueU9mJzogIWludmVydCB9KTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb21wb3NlT25lT2YnIHZhbGlkYXRvciBjb21iaW5hdGlvbiBmdW5jdGlvblxuICAgKlxuICAgKiBBY2NlcHRzIGFuIGFycmF5IG9mIHZhbGlkYXRvcnMgYW5kIHJldHVybnMgYSBzaW5nbGUgdmFsaWRhdG9yIHRoYXRcbiAgICogZXZhbHVhdGVzIHRvIHZhbGlkIG9ubHkgaWYgZXhhY3RseSBvbmUgb2YgdGhlIHN1Ym1pdHRlZCB2YWxpZGF0b3JzXG4gICAqIGlzIHZhbGlkLiBPdGhlcndpc2UgcmV0dXJucyBjb21iaW5lZCBpbmZvcm1hdGlvbiBmcm9tIGFsbCB2YWxpZGF0b3JzLFxuICAgKiBib3RoIHZhbGlkIGFuZCBpbnZhbGlkLlxuICAgKlxuICAgKiAvLyB7SVZhbGlkYXRvckZuW119IHZhbGlkYXRvcnMgLSBhcnJheSBvZiB2YWxpZGF0b3JzIHRvIGNvbWJpbmVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSBzaW5nbGUgY29tYmluZWQgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZU9uZU9mKHZhbGlkYXRvcnM6IElWYWxpZGF0b3JGbltdKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBsZXQgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc0RlZmluZWQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgbGV0IGFycmF5T2ZFcnJvcnMgPVxuICAgICAgICBfZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMpO1xuICAgICAgbGV0IHZhbGlkQ29udHJvbHMgPVxuICAgICAgICB2YWxpZGF0b3JzLmxlbmd0aCAtIGFycmF5T2ZFcnJvcnMuZmlsdGVyKGlzRGVmaW5lZCkubGVuZ3RoO1xuICAgICAgbGV0IGlzVmFsaWQgPSB2YWxpZENvbnRyb2xzID09PSAxO1xuICAgICAgaWYgKHhvcihpc1ZhbGlkLCBpbnZlcnQpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBsZXQgYXJyYXlPZlZhbGlkcyA9XG4gICAgICAgIF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycywgaW52ZXJ0KTtcbiAgICAgIHJldHVybiBfbWVyZ2VPYmplY3RzKC4uLmFycmF5T2ZFcnJvcnMsIC4uLmFycmF5T2ZWYWxpZHMsIHsgJ29uZU9mJzogIWludmVydCB9KTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb21wb3NlQWxsT2YnIHZhbGlkYXRvciBjb21iaW5hdGlvbiBmdW5jdGlvblxuICAgKlxuICAgKiBBY2NlcHRzIGFuIGFycmF5IG9mIHZhbGlkYXRvcnMgYW5kIHJldHVybnMgYSBzaW5nbGUgdmFsaWRhdG9yIHRoYXRcbiAgICogZXZhbHVhdGVzIHRvIHZhbGlkIG9ubHkgaWYgYWxsIHRoZSBzdWJtaXR0ZWQgdmFsaWRhdG9ycyBhcmUgaW5kaXZpZHVhbGx5XG4gICAqIHZhbGlkLiBPdGhlcndpc2UgaXQgcmV0dXJucyBjb21iaW5lZCBlcnJvcnMgZnJvbSBhbGwgaW52YWxpZCB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiAvLyB7SVZhbGlkYXRvckZuW119IHZhbGlkYXRvcnMgLSBhcnJheSBvZiB2YWxpZGF0b3JzIHRvIGNvbWJpbmVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSBzaW5nbGUgY29tYmluZWQgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZUFsbE9mKHZhbGlkYXRvcnM6IElWYWxpZGF0b3JGbltdKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBsZXQgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc0RlZmluZWQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgbGV0IGNvbWJpbmVkRXJyb3JzID0gX21lcmdlRXJyb3JzKFxuICAgICAgICBfZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMsIGludmVydClcbiAgICAgICk7XG4gICAgICBsZXQgaXNWYWxpZCA9IGNvbWJpbmVkRXJyb3JzID09PSBudWxsO1xuICAgICAgcmV0dXJuICh4b3IoaXNWYWxpZCwgaW52ZXJ0KSkgP1xuICAgICAgICBudWxsIDogX21lcmdlT2JqZWN0cyhjb21iaW5lZEVycm9ycywgeyAnYWxsT2YnOiAhaW52ZXJ0IH0pO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2NvbXBvc2VOb3QnIHZhbGlkYXRvciBpbnZlcnNpb24gZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb24gYW5kIGludmVydHMgaXRzIHJlc3VsdC5cbiAgICogUmV0dXJucyB2YWxpZCBpZiB0aGUgc3VibWl0dGVkIHZhbGlkYXRvciBpcyBpbnZhbGlkLCBhbmRcbiAgICogcmV0dXJucyBpbnZhbGlkIGlmIHRoZSBzdWJtaXR0ZWQgdmFsaWRhdG9yIGlzIHZhbGlkLlxuICAgKiAoTm90ZTogdGhpcyBmdW5jdGlvbiBjYW4gaXRzZWxmIGJlIGludmVydGVkXG4gICAqICAgLSBlLmcuIGNvbXBvc2VOb3QoY29tcG9zZU5vdCh2YWxpZGF0b3IpKSAtXG4gICAqICAgYnV0IHRoaXMgY2FuIGJlIGNvbmZ1c2luZyBhbmQgaXMgdGhlcmVmb3JlIG5vdCByZWNvbW1lbmRlZC4pXG4gICAqXG4gICAqIC8vIHtJVmFsaWRhdG9yRm5bXX0gdmFsaWRhdG9ycyAtIHZhbGlkYXRvcihzKSB0byBpbnZlcnRcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSBuZXcgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBvcHBvc2l0ZSByZXN1bHRcbiAgICovXG4gIHN0YXRpYyBjb21wb3NlTm90KHZhbGlkYXRvcjogSVZhbGlkYXRvckZuKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcikgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGVycm9yID0gdmFsaWRhdG9yKGNvbnRyb2wsICFpbnZlcnQpO1xuICAgICAgbGV0IGlzVmFsaWQgPSBlcnJvciA9PT0gbnVsbDtcbiAgICAgIHJldHVybiAoeG9yKGlzVmFsaWQsIGludmVydCkpID9cbiAgICAgICAgbnVsbCA6IF9tZXJnZU9iamVjdHMoZXJyb3IsIHsgJ25vdCc6ICFpbnZlcnQgfSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnY29tcG9zZScgdmFsaWRhdG9yIGNvbWJpbmF0aW9uIGZ1bmN0aW9uXG4gICAqXG4gICAqIC8vIHtJVmFsaWRhdG9yRm5bXX0gdmFsaWRhdG9ycyAtIGFycmF5IG9mIHZhbGlkYXRvcnMgdG8gY29tYmluZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufSAtIHNpbmdsZSBjb21iaW5lZCB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICovXG4gIHN0YXRpYyBjb21wb3NlKHZhbGlkYXRvcnM6IElWYWxpZGF0b3JGbltdKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBsZXQgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc0RlZmluZWQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT5cbiAgICAgIF9tZXJnZUVycm9ycyhfZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMsIGludmVydCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiAnY29tcG9zZUFzeW5jJyBhc3luYyB2YWxpZGF0b3IgY29tYmluYXRpb24gZnVuY3Rpb25cbiAgICpcbiAgICogLy8ge0FzeW5jSVZhbGlkYXRvckZuW119IGFzeW5jIHZhbGlkYXRvcnMgLSBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JzXG4gICAqIC8vIHtBc3luY0lWYWxpZGF0b3JGbn0gLSBzaW5nbGUgY29tYmluZWQgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZUFzeW5jKHZhbGlkYXRvcnM6IEFzeW5jSVZhbGlkYXRvckZuW10pOiBBc3luY0lWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCF2YWxpZGF0b3JzKSB7IHJldHVybiBudWxsOyB9XG4gICAgbGV0IHByZXNlbnRWYWxpZGF0b3JzID0gdmFsaWRhdG9ycy5maWx0ZXIoaXNEZWZpbmVkKTtcbiAgICBpZiAocHJlc2VudFZhbGlkYXRvcnMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID1cbiAgICAgICAgX2V4ZWN1dGVBc3luY1ZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMpLm1hcCh0b09ic2VydmFibGUpO1xuICAgICAgcmV0dXJuIG1hcC5jYWxsKGZvcmtKb2luKG9ic2VydmFibGVzKSwgX21lcmdlRXJyb3JzKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGRpdGlvbmFsIGFuZ3VsYXIgdmFsaWRhdG9ycyAobm90IHVzZWQgYnkgQW5ndWFsciBKU09OIFNjaGVtYSBGb3JtKVxuICAvLyBGcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi9tYXN0ZXIvcGFja2FnZXMvZm9ybXMvc3JjL3ZhbGlkYXRvcnMudHNcblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgY29udHJvbHMgdG8gaGF2ZSBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBhIG51bWJlci5cbiAgICovXG4gIHN0YXRpYyBtaW4obWluOiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtaW4pKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSB8fCBpc0VtcHR5KG1pbikpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VGbG9hdChjb250cm9sLnZhbHVlKTtcbiAgICAgIGNvbnN0IGFjdHVhbCA9IGNvbnRyb2wudmFsdWU7XG4gICAgICAvLyBDb250cm9scyB3aXRoIE5hTiB2YWx1ZXMgYWZ0ZXIgcGFyc2luZyBzaG91bGQgYmUgdHJlYXRlZCBhcyBub3QgaGF2aW5nIGFcbiAgICAgIC8vIG1pbmltdW0sIHBlciB0aGUgSFRNTCBmb3JtcyBzcGVjOiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1pblxuICAgICAgcmV0dXJuIGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA+PSBtaW4gPyBudWxsIDogeyAnbWluJzogeyBtaW4sIGFjdHVhbCB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyBjb250cm9scyB0byBoYXZlIGEgdmFsdWUgbGVzcyB0aGFuIGEgbnVtYmVyLlxuICAgKi9cbiAgc3RhdGljIG1heChtYXg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1heCkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpIHx8IGlzRW1wdHkobWF4KSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGNvbnRyb2wudmFsdWUpO1xuICAgICAgY29uc3QgYWN0dWFsID0gY29udHJvbC52YWx1ZTtcbiAgICAgIC8vIENvbnRyb2xzIHdpdGggTmFOIHZhbHVlcyBhZnRlciBwYXJzaW5nIHNob3VsZCBiZSB0cmVhdGVkIGFzIG5vdCBoYXZpbmcgYVxuICAgICAgLy8gbWF4aW11bSwgcGVyIHRoZSBIVE1MIGZvcm1zIHNwZWM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWF4XG4gICAgICByZXR1cm4gaXNOYU4odmFsdWUpIHx8IHZhbHVlIDw9IG1heCA/IG51bGwgOiB7ICdtYXgnOiB7IG1heCwgYWN0dWFsIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2wgdmFsdWUgdG8gYmUgdHJ1ZS5cbiAgICovXG4gIHN0YXRpYyByZXF1aXJlZFRydWUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICBpZiAoIWNvbnRyb2wpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gY29udHJvbC52YWx1ZSA9PT0gdHJ1ZSA/IG51bGwgOiB7ICdyZXF1aXJlZCc6IHRydWUgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCBwZXJmb3JtcyBlbWFpbCB2YWxpZGF0aW9uLlxuICAgKi9cbiAgc3RhdGljIGVtYWlsKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgaWYgKCFjb250cm9sKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgY29uc3QgRU1BSUxfUkVHRVhQID1cbiAgICAgIC9eKD89LnsxLDI1NH0kKSg/PS57MSw2NH1AKVstISMkJSYnKisvMC05PT9BLVpeX2BhLXp7fH1+XSsoXFwuWy0hIyQlJicqKy8wLTk9P0EtWl5fYGEtent8fX5dKykqQFtBLVphLXowLTldKFtBLVphLXowLTktXXswLDYxfVtBLVphLXowLTldKT8oXFwuW0EtWmEtejAtOV0oW0EtWmEtejAtOS1dezAsNjF9W0EtWmEtejAtOV0pPykqJC87XG4gICAgcmV0dXJuIEVNQUlMX1JFR0VYUC50ZXN0KGNvbnRyb2wudmFsdWUpID8gbnVsbCA6IHsgJ2VtYWlsJzogdHJ1ZSB9O1xuICB9XG59XG4iXX0=