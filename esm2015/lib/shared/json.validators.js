/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
export class JsonValidators {
    /**
     * @param {?=} input
     * @return {?}
     */
    static required(input) {
        if (input === undefined) {
            input = true;
        }
        switch (input) {
            case true:
                // Return required function (do not execute it yet)
                return (control, invert = false) => {
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
    }
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
     * @param {?} requiredType
     * @return {?}
     */
    static type(requiredType) {
        if (!hasValue(requiredType)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isValid = isArray(requiredType) ?
                (/** @type {?} */ (requiredType)).some(type => isType(currentValue, type)) :
                isType(currentValue, /** @type {?} */ (requiredType));
            return xor(isValid, invert) ?
                null : { 'type': { requiredType, currentValue } };
        };
    }
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
    static enum(allowedValues) {
        if (!isArray(allowedValues)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isEqual = (enumValue, inputValue) => enumValue === inputValue ||
                (isNumber(enumValue) && +inputValue === +enumValue) ||
                (isBoolean(enumValue, 'strict') &&
                    toJavaScriptType(inputValue, 'boolean') === enumValue) ||
                (enumValue === null && !hasValue(inputValue)) ||
                _.isEqual(enumValue, inputValue);
            /** @type {?} */
            const isValid = isArray(currentValue) ?
                currentValue.every(inputValue => allowedValues.some(enumValue => isEqual(enumValue, inputValue))) :
                allowedValues.some(enumValue => isEqual(enumValue, currentValue));
            return xor(isValid, invert) ?
                null : { 'enum': { allowedValues, currentValue } };
        };
    }
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
    static const(requiredValue) {
        if (!hasValue(requiredValue)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentValue = control.value;
            /** @type {?} */
            const isEqual = (constValue, inputValue) => constValue === inputValue ||
                isNumber(constValue) && +inputValue === +constValue ||
                isBoolean(constValue, 'strict') &&
                    toJavaScriptType(inputValue, 'boolean') === constValue ||
                constValue === null && !hasValue(inputValue);
            /** @type {?} */
            const isValid = isEqual(requiredValue, currentValue);
            return xor(isValid, invert) ?
                null : { 'const': { requiredValue, currentValue } };
        };
    }
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
    static minLength(minimumLength) {
        if (!hasValue(minimumLength)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let currentLength = isString(control.value) ? control.value.length : 0;
            /** @type {?} */
            let isValid = currentLength >= minimumLength;
            return xor(isValid, invert) ?
                null : { 'minLength': { minimumLength, currentLength } };
        };
    }
    ;
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
    static maxLength(maximumLength) {
        if (!hasValue(maximumLength)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            /** @type {?} */
            let currentLength = isString(control.value) ? control.value.length : 0;
            /** @type {?} */
            let isValid = currentLength <= maximumLength;
            return xor(isValid, invert) ?
                null : { 'maxLength': { maximumLength, currentLength } };
        };
    }
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
     * @param {?} pattern
     * @param {?=} wholeString
     * @return {?}
     */
    static pattern(pattern, wholeString = false) {
        if (!hasValue(pattern)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let regex;
            /** @type {?} */
            let requiredPattern;
            if (typeof pattern === 'string') {
                requiredPattern = (wholeString) ? `^${pattern}$` : pattern;
                regex = new RegExp(requiredPattern);
            }
            else {
                requiredPattern = pattern.toString();
                regex = pattern;
            }
            /** @type {?} */
            let currentValue = control.value;
            /** @type {?} */
            let isValid = isString(currentValue) ? regex.test(currentValue) : false;
            return xor(isValid, invert) ?
                null : { 'pattern': { requiredPattern, currentValue } };
        };
    }
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
    static format(requiredFormat) {
        if (!hasValue(requiredFormat)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let isValid;
            /** @type {?} */
            let currentValue = control.value;
            if (isString(currentValue)) {
                /** @type {?} */
                const formatTest = jsonSchemaFormatTests[requiredFormat];
                if (typeof formatTest === 'object') {
                    isValid = (/** @type {?} */ (formatTest)).test(/** @type {?} */ (currentValue));
                }
                else if (typeof formatTest === 'function') {
                    isValid = (/** @type {?} */ (formatTest))(/** @type {?} */ (currentValue));
                }
                else {
                    console.error(`format validator error: "${requiredFormat}" is not a recognized format.`);
                    isValid = true;
                }
            }
            else {
                // Allow JavaScript Date objects
                isValid = ['date', 'time', 'date-time'].includes(requiredFormat) &&
                    Object.prototype.toString.call(currentValue) === '[object Date]';
            }
            return xor(isValid, invert) ?
                null : { 'format': { requiredFormat, currentValue } };
        };
    }
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
    static minimum(minimumValue) {
        if (!hasValue(minimumValue)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let currentValue = control.value;
            /** @type {?} */
            let isValid = !isNumber(currentValue) || currentValue >= minimumValue;
            return xor(isValid, invert) ?
                null : { 'minimum': { minimumValue, currentValue } };
        };
    }
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
    static exclusiveMinimum(exclusiveMinimumValue) {
        if (!hasValue(exclusiveMinimumValue)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let currentValue = control.value;
            /** @type {?} */
            let isValid = !isNumber(currentValue) || +currentValue < exclusiveMinimumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMinimum': { exclusiveMinimumValue, currentValue } };
        };
    }
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
    static maximum(maximumValue) {
        if (!hasValue(maximumValue)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let currentValue = control.value;
            /** @type {?} */
            let isValid = !isNumber(currentValue) || +currentValue <= maximumValue;
            return xor(isValid, invert) ?
                null : { 'maximum': { maximumValue, currentValue } };
        };
    }
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
    static exclusiveMaximum(exclusiveMaximumValue) {
        if (!hasValue(exclusiveMaximumValue)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let currentValue = control.value;
            /** @type {?} */
            let isValid = !isNumber(currentValue) || +currentValue < exclusiveMaximumValue;
            return xor(isValid, invert) ?
                null : { 'exclusiveMaximum': { exclusiveMaximumValue, currentValue } };
        };
    }
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
    static multipleOf(multipleOfValue) {
        if (!hasValue(multipleOfValue)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let currentValue = control.value;
            /** @type {?} */
            let isValid = isNumber(currentValue) &&
                currentValue % multipleOfValue === 0;
            return xor(isValid, invert) ?
                null : { 'multipleOf': { multipleOfValue, currentValue } };
        };
    }
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
    static minProperties(minimumProperties) {
        if (!hasValue(minimumProperties)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let currentProperties = Object.keys(control.value).length || 0;
            /** @type {?} */
            let isValid = currentProperties >= minimumProperties;
            return xor(isValid, invert) ?
                null : { 'minProperties': { minimumProperties, currentProperties } };
        };
    }
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
    static maxProperties(maximumProperties) {
        if (!hasValue(maximumProperties)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            /** @type {?} */
            let currentProperties = Object.keys(control.value).length || 0;
            /** @type {?} */
            let isValid = currentProperties <= maximumProperties;
            return xor(isValid, invert) ?
                null : { 'maxProperties': { maximumProperties, currentProperties } };
        };
    }
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
    static dependencies(dependencies) {
        if (getType(dependencies) !== 'object' || isEmpty(dependencies)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let allErrors = _mergeObjects(forEachCopy(dependencies, (value, requiringField) => {
                if (!hasValue(control.value[requiringField])) {
                    return null;
                }
                /** @type {?} */
                let requiringFieldErrors = {};
                /** @type {?} */
                let requiredFields;
                /** @type {?} */
                let properties = {};
                if (getType(dependencies[requiringField]) === 'array') {
                    requiredFields = dependencies[requiringField];
                }
                else if (getType(dependencies[requiringField]) === 'object') {
                    requiredFields = dependencies[requiringField]['required'] || [];
                    properties = dependencies[requiringField]['properties'] || {};
                }
                // Validate property dependencies
                for (let requiredField of requiredFields) {
                    if (xor(!hasValue(control.value[requiredField]), invert)) {
                        requiringFieldErrors[requiredField] = { 'required': true };
                    }
                }
                // Validate schema dependencies
                requiringFieldErrors = _mergeObjects(requiringFieldErrors, forEachCopy(properties, (requirements, requiredField) => {
                    /** @type {?} */
                    let requiredFieldErrors = _mergeObjects(forEachCopy(requirements, (requirement, parameter) => {
                        /** @type {?} */
                        let validator = null;
                        if (requirement === 'maximum' || requirement === 'minimum') {
                            /** @type {?} */
                            let exclusive = !!requirements['exclusiveM' + requirement.slice(1)];
                            validator = JsonValidators[requirement](parameter, exclusive);
                        }
                        else if (typeof JsonValidators[requirement] === 'function') {
                            validator = JsonValidators[requirement](parameter);
                        }
                        return !isDefined(validator) ?
                            null : validator(control.value[requiredField]);
                    }));
                    return isEmpty(requiredFieldErrors) ?
                        null : { [requiredField]: requiredFieldErrors };
                }));
                return isEmpty(requiringFieldErrors) ?
                    null : { [requiringField]: requiringFieldErrors };
            }));
            return isEmpty(allErrors) ? null : allErrors;
        };
    }
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
    static minItems(minimumItems) {
        if (!hasValue(minimumItems)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let currentItems = isArray(control.value) ? control.value.length : 0;
            /** @type {?} */
            let isValid = currentItems >= minimumItems;
            return xor(isValid, invert) ?
                null : { 'minItems': { minimumItems, currentItems } };
        };
    }
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
    static maxItems(maximumItems) {
        if (!hasValue(maximumItems)) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            /** @type {?} */
            let currentItems = isArray(control.value) ? control.value.length : 0;
            /** @type {?} */
            let isValid = currentItems <= maximumItems;
            return xor(isValid, invert) ?
                null : { 'maxItems': { maximumItems, currentItems } };
        };
    }
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
    static uniqueItems(unique = true) {
        if (!unique) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let sorted = control.value.slice().sort();
            /** @type {?} */
            let duplicateItems = [];
            for (let i = 1; i < sorted.length; i++) {
                if (sorted[i - 1] === sorted[i] && duplicateItems.includes(sorted[i])) {
                    duplicateItems.push(sorted[i]);
                }
            }
            /** @type {?} */
            let isValid = !duplicateItems.length;
            return xor(isValid, invert) ?
                null : { 'uniqueItems': { duplicateItems } };
        };
    }
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
    static contains(requiredItem = true) {
        if (!requiredItem) {
            return JsonValidators.nullValidator;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value) || !isArray(control.value)) {
                return null;
            }
            /** @type {?} */
            const currentItems = control.value;
            /** @type {?} */
            const isValid = true;
            return xor(isValid, invert) ?
                null : { 'contains': { requiredItem, currentItems } };
        };
    }
    /**
     * No-op validator. Included for backward compatibility.
     * @param {?} control
     * @return {?}
     */
    static nullValidator(control) {
        return null;
    }
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
    static composeAnyOf(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        let presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (control, invert = false) => {
            /** @type {?} */
            let arrayOfErrors = _executeValidators(control, presentValidators, invert).filter(isDefined);
            /** @type {?} */
            let isValid = validators.length > arrayOfErrors.length;
            return xor(isValid, invert) ?
                null : _mergeObjects(...arrayOfErrors, { 'anyOf': !invert });
        };
    }
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
    static composeOneOf(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        let presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (control, invert = false) => {
            /** @type {?} */
            let arrayOfErrors = _executeValidators(control, presentValidators);
            /** @type {?} */
            let validControls = validators.length - arrayOfErrors.filter(isDefined).length;
            /** @type {?} */
            let isValid = validControls === 1;
            if (xor(isValid, invert)) {
                return null;
            }
            /** @type {?} */
            let arrayOfValids = _executeValidators(control, presentValidators, invert);
            return _mergeObjects(...arrayOfErrors, ...arrayOfValids, { 'oneOf': !invert });
        };
    }
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
    static composeAllOf(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        let presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (control, invert = false) => {
            /** @type {?} */
            let combinedErrors = _mergeErrors(_executeValidators(control, presentValidators, invert));
            /** @type {?} */
            let isValid = combinedErrors === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(combinedErrors, { 'allOf': !invert });
        };
    }
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
    static composeNot(validator) {
        if (!validator) {
            return null;
        }
        return (control, invert = false) => {
            if (isEmpty(control.value)) {
                return null;
            }
            /** @type {?} */
            let error = validator(control, !invert);
            /** @type {?} */
            let isValid = error === null;
            return (xor(isValid, invert)) ?
                null : _mergeObjects(error, { 'not': !invert });
        };
    }
    /**
     * 'compose' validator combination function
     *
     * // {IValidatorFn[]} validators - array of validators to combine
     * // {IValidatorFn} - single combined validator function
     * @param {?} validators
     * @return {?}
     */
    static compose(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        let presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (control, invert = false) => _mergeErrors(_executeValidators(control, presentValidators, invert));
    }
    ;
    /**
     * 'composeAsync' async validator combination function
     *
     * // {AsyncIValidatorFn[]} async validators - array of async validators
     * // {AsyncIValidatorFn} - single combined async validator function
     * @param {?} validators
     * @return {?}
     */
    static composeAsync(validators) {
        if (!validators) {
            return null;
        }
        /** @type {?} */
        let presentValidators = validators.filter(isDefined);
        if (presentValidators.length === 0) {
            return null;
        }
        return (control) => {
            /** @type {?} */
            const observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
            return map.call(forkJoin(observables), _mergeErrors);
        };
    }
    /**
     * Validator that requires controls to have a value greater than a number.
     * @param {?} min
     * @return {?}
     */
    static min(min) {
        if (!hasValue(min)) {
            return JsonValidators.nullValidator;
        }
        return (control) => {
            // don't validate empty values to allow optional controls
            if (isEmpty(control.value) || isEmpty(min)) {
                return null;
            }
            /** @type {?} */
            const value = parseFloat(control.value);
            /** @type {?} */
            const actual = control.value;
            // Controls with NaN values after parsing should be treated as not having a
            // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
            return isNaN(value) || value >= min ? null : { 'min': { min, actual } };
        };
    }
    /**
     * Validator that requires controls to have a value less than a number.
     * @param {?} max
     * @return {?}
     */
    static max(max) {
        if (!hasValue(max)) {
            return JsonValidators.nullValidator;
        }
        return (control) => {
            // don't validate empty values to allow optional controls
            if (isEmpty(control.value) || isEmpty(max)) {
                return null;
            }
            /** @type {?} */
            const value = parseFloat(control.value);
            /** @type {?} */
            const actual = control.value;
            // Controls with NaN values after parsing should be treated as not having a
            // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
            return isNaN(value) || value <= max ? null : { 'max': { max, actual } };
        };
    }
    /**
     * Validator that requires control value to be true.
     * @param {?} control
     * @return {?}
     */
    static requiredTrue(control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        return control.value === true ? null : { 'required': true };
    }
    /**
     * Validator that performs email validation.
     * @param {?} control
     * @return {?}
     */
    static email(control) {
        if (!control) {
            return JsonValidators.nullValidator;
        }
        /** @type {?} */
        const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi52YWxpZGF0b3JzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvanNvbi52YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQWMsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUU1QixPQUFPLEVBQ0wsa0JBQWtCLEVBQUUsdUJBQXVCLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFDeEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUNwRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFBRSxHQUFHLEVBRXJELE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxxQkFBcUIsRUFBeUIsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpRnhGLE1BQU07Ozs7O0lBc0NKLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBK0I7UUFDN0MsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQUU7UUFDMUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNkLEtBQUssSUFBSTs7Z0JBQ1AsTUFBTSxDQUFDLENBQUMsT0FBd0IsRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUF5QixFQUFFO29CQUN6RSxFQUFFLENBQUMs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QUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQztTQUN6RSxDQUFDO0tBQ0g7Ozs7OztJQUtELE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBd0I7UUFDMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUM7U0FBRTtRQUN0RCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDN0Q7Ozs7OztJQUtELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBd0I7UUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUM7U0FBRTs7UUFDdEQsTUFBTSxZQUFZLEdBQ2hCLDRMQUE0TCxDQUFDO1FBQy9MLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUNwRTtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE9ic2VydmFibGUsIGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHtcbiAgX2V4ZWN1dGVWYWxpZGF0b3JzLCBfZXhlY3V0ZUFzeW5jVmFsaWRhdG9ycywgX21lcmdlT2JqZWN0cywgX21lcmdlRXJyb3JzLFxuICBpc0VtcHR5LCBpc0RlZmluZWQsIGhhc1ZhbHVlLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzQm9vbGVhbiwgaXNBcnJheSxcbiAgZ2V0VHlwZSwgaXNUeXBlLCB0b0phdmFTY3JpcHRUeXBlLCB0b09ic2VydmFibGUsIHhvciwgU2NoZW1hUHJpbWl0aXZlVHlwZSxcbiAgUGxhaW5PYmplY3QsIElWYWxpZGF0b3JGbiwgQXN5bmNJVmFsaWRhdG9yRm5cbn0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IGZvckVhY2hDb3B5IH0gZnJvbSAnLi91dGlsaXR5LmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBqc29uU2NoZW1hRm9ybWF0VGVzdHMsIEpzb25TY2hlbWFGb3JtYXROYW1lcyB9IGZyb20gJy4vZm9ybWF0LXJlZ2V4LmNvbnN0YW50cyc7XG5cbi8qKlxuICogJ0pzb25WYWxpZGF0b3JzJyBjbGFzc1xuICpcbiAqIFByb3ZpZGVzIGFuIGV4dGVuZGVkIHNldCBvZiB2YWxpZGF0b3JzIHRvIGJlIHVzZWQgYnkgZm9ybSBjb250cm9scyxcbiAqIGNvbXBhdGlibGUgd2l0aCBzdGFuZGFyZCBKU09OIFNjaGVtYSB2YWxpZGF0aW9uIG9wdGlvbnMuXG4gKiBodHRwOi8vanNvbi1zY2hlbWEub3JnL2xhdGVzdC9qc29uLXNjaGVtYS12YWxpZGF0aW9uLmh0bWxcbiAqXG4gKiBOb3RlOiBUaGlzIGxpYnJhcnkgaXMgZGVzaWduZWQgYXMgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvciB0aGUgQW5ndWxhclxuICogVmFsaWRhdG9ycyBsaWJyYXJ5LCBhbmQgZXhjZXB0IGZvciBvbmUgc21hbGwgYnJlYWtpbmcgY2hhbmdlIHRvIHRoZSAncGF0dGVybidcbiAqIHZhbGlkYXRvciAoZGVzY3JpYmVkIGJlbG93KSBpdCBjYW4gZXZlbiBiZSBpbXBvcnRlZCBhcyBhIHN1YnN0aXR1dGUsIGxpa2Ugc286XG4gKlxuICogICBpbXBvcnQgeyBKc29uVmFsaWRhdG9ycyBhcyBWYWxpZGF0b3JzIH0gZnJvbSAnanNvbi12YWxpZGF0b3JzJztcbiAqXG4gKiBhbmQgaXQgc2hvdWxkIHdvcmsgd2l0aCBleGlzdGluZyBjb2RlIGFzIGEgY29tcGxldGUgcmVwbGFjZW1lbnQuXG4gKlxuICogVGhlIG9uZSBleGNlcHRpb24gaXMgdGhlICdwYXR0ZXJuJyB2YWxpZGF0b3IsIHdoaWNoIGhhcyBiZWVuIGNoYW5nZWQgdG9cbiAqIG1hdGNoZSBwYXJ0aWFsIHZhbHVlcyBieSBkZWZhdWx0ICh0aGUgc3RhbmRhcmQgJ3BhdHRlcm4nIHZhbGlkYXRvciB3cmFwcGVkXG4gKiBhbGwgcGF0dGVybnMgaW4gJ14nIGFuZCAnJCcsIGZvcmNpbmcgdGhlbSB0byBhbHdheXMgbWF0Y2ggYW4gZW50aXJlIHZhbHVlKS5cbiAqIEhvd2V2ZXIsIHRoZSBvbGQgYmVoYXZpb3IgY2FuIGJlIHJlc3RvcmVkIGJ5IHNpbXBseSBhZGRpbmcgJ14nIGFuZCAnJCdcbiAqIGFyb3VuZCB5b3VyIHBhdHRlcm5zLCBvciBieSBwYXNzaW5nIGFuIG9wdGlvbmFsIHNlY29uZCBwYXJhbWV0ZXIgb2YgVFJVRS5cbiAqIFRoaXMgY2hhbmdlIGlzIHRvIG1ha2UgdGhlICdwYXR0ZXJuJyB2YWxpZGF0b3IgbWF0Y2ggdGhlIGJlaGF2aW9yIG9mIGFcbiAqIEpTT04gU2NoZW1hIHBhdHRlcm4sIHdoaWNoIGFsbG93cyBwYXJ0aWFsIG1hdGNoZXMsIHJhdGhlciB0aGFuIHRoZSBiZWhhdmlvclxuICogb2YgYW4gSFRNTCBpbnB1dCBjb250cm9sIHBhdHRlcm4sIHdoaWNoIGRvZXMgbm90LlxuICpcbiAqIFRoaXMgbGlicmFyeSByZXBsYWNlcyBBbmd1bGFyJ3MgdmFsaWRhdG9ycyBhbmQgY29tYmluYXRpb24gZnVuY3Rpb25zXG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgdmFsaWRhdG9ycyBhbmQgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25zOlxuICpcbiAqIFZhbGlkYXRvcnM6XG4gKiAgIEZvciBhbGwgZm9ybUNvbnRyb2xzOiAgICAgcmVxdWlyZWQgKCopLCB0eXBlLCBlbnVtLCBjb25zdFxuICogICBGb3IgdGV4dCBmb3JtQ29udHJvbHM6ICAgIG1pbkxlbmd0aCAoKiksIG1heExlbmd0aCAoKiksIHBhdHRlcm4gKCopLCBmb3JtYXRcbiAqICAgRm9yIG51bWVyaWMgZm9ybUNvbnRyb2xzOiBtYXhpbXVtLCBleGNsdXNpdmVNYXhpbXVtLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW0sIGV4Y2x1c2l2ZU1pbmltdW0sIG11bHRpcGxlT2ZcbiAqICAgRm9yIGZvcm1Hcm91cCBvYmplY3RzOiAgICBtaW5Qcm9wZXJ0aWVzLCBtYXhQcm9wZXJ0aWVzLCBkZXBlbmRlbmNpZXNcbiAqICAgRm9yIGZvcm1BcnJheSBhcnJheXM6ICAgICBtaW5JdGVtcywgbWF4SXRlbXMsIHVuaXF1ZUl0ZW1zLCBjb250YWluc1xuICogICBOb3QgdXNlZCBieSBKU09OIFNjaGVtYTogIG1pbiAoKiksIG1heCAoKiksIHJlcXVpcmVkVHJ1ZSAoKiksIGVtYWlsICgqKVxuICogKFZhbGlkYXRvcnMgb3JpZ2luYWxseSBpbmNsdWRlZCB3aXRoIEFuZ3VsYXIgYXJlIG1ha2VkIHdpdGggKCopLilcbiAqXG4gKiBOT1RFIC8gVE9ETzogVGhlIGRlcGVuZGVuY2llcyB2YWxpZGF0b3IgaXMgbm90IGNvbXBsZXRlLlxuICogTk9URSAvIFRPRE86IFRoZSBjb250YWlucyB2YWxpZGF0b3IgaXMgbm90IGNvbXBsZXRlLlxuICpcbiAqIFZhbGlkYXRvcnMgbm90IHVzZWQgYnkgSlNPTiBTY2hlbWEgKGJ1dCBpbmNsdWRlZCBmb3IgY29tcGF0aWJpbGl0eSlcbiAqIGFuZCB0aGVpciBKU09OIFNjaGVtYSBlcXVpdmFsZW50czpcbiAqXG4gKiAgIEFuZ3VsYXIgdmFsaWRhdG9yIHwgSlNPTiBTY2hlbWEgZXF1aXZhbGVudFxuICogICAtLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICAgICBtaW4obnVtYmVyKSAgICAgfCAgIG1pbmltdW0obnVtYmVyKVxuICogICAgIG1heChudW1iZXIpICAgICB8ICAgbWF4aW11bShudW1iZXIpXG4gKiAgICAgcmVxdWlyZWRUcnVlKCkgIHwgICBjb25zdCh0cnVlKVxuICogICAgIGVtYWlsKCkgICAgICAgICB8ICAgZm9ybWF0KCdlbWFpbCcpXG4gKlxuICogVmFsaWRhdG9yIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uczpcbiAqICAgY29tcG9zZUFueU9mLCBjb21wb3NlT25lT2YsIGNvbXBvc2VBbGxPZiwgY29tcG9zZU5vdFxuICogKEFuZ3VsYXIncyBvcmlnaW5hbCBjb21iaW5hdGlvbiBmdW5jaXRvbiwgJ2NvbXBvc2UnLCBpcyBhbHNvIGluY2x1ZGVkIGZvclxuICogYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgdGhvdWdoIGl0IGlzIGZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIGNvbXBvc2VBbGxPZixcbiAqIGFzc2lkZSBmcm9tIGl0cyBtb3JlIGdlbmVyaWMgZXJyb3IgbWVzc2FnZS4pXG4gKlxuICogQWxsIHZhbGlkYXRvcnMgaGF2ZSBhbHNvIGJlZW4gZXh0ZW5kZWQgdG8gYWNjZXB0IGFuIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudFxuICogd2hpY2gsIGlmIHBhc3NlZCBhIFRSVUUgdmFsdWUsIGNhdXNlcyB0aGUgdmFsaWRhdG9yIHRvIHBlcmZvcm0gdGhlIG9wcG9zaXRlXG4gKiBvZiBpdHMgb3JpZ2luYWwgZmluY3Rpb24uIChUaGlzIGlzIHVzZWQgaW50ZXJuYWxseSB0byBlbmFibGUgJ25vdCcgYW5kXG4gKiAnY29tcG9zZU9uZU9mJyB0byBmdW5jdGlvbiBhbmQgcmV0dXJuIHVzZWZ1bCBlcnJvciBtZXNzYWdlcy4pXG4gKlxuICogVGhlICdyZXF1aXJlZCcgdmFsaWRhdG9yIGhhcyBhbHNvIGJlZW4gb3ZlcmxvYWRlZCBzbyB0aGF0IGlmIGNhbGxlZCB3aXRoXG4gKiBhIGJvb2xlYW4gcGFyYW1ldGVyIChvciBubyBwYXJhbWV0ZXJzKSBpdCByZXR1cm5zIHRoZSBvcmlnaW5hbCB2YWxpZGF0b3JcbiAqIGZ1bmN0aW9uIChyYXRoZXIgdGhhbiBleGVjdXRpbmcgaXQpLiBIb3dldmVyLCBpZiBpdCBpcyBjYWxsZWQgd2l0aCBhblxuICogQWJzdHJhY3RDb250cm9sIHBhcmFtZXRlciAoYXMgd2FzIHByZXZpb3VzbHkgcmVxdWlyZWQpLCBpdCBiZWhhdmVzXG4gKiBleGFjdGx5IGFzIGJlZm9yZS5cbiAqXG4gKiBUaGlzIGVuYWJsZXMgYWxsIHZhbGlkYXRvcnMgKGluY2x1ZGluZyAncmVxdWlyZWQnKSB0byBiZSBjb25zdHJ1Y3RlZCBpblxuICogZXhhY3RseSB0aGUgc2FtZSB3YXksIHNvIHRoZXkgY2FuIGJlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB1c2luZyB0aGVcbiAqIGVxdWl2YWxlbnQga2V5IG5hbWVzIGFuZCB2YWx1ZXMgdGFrZW4gZGlyZWN0bHkgZnJvbSBhIEpTT04gU2NoZW1hLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgcGFydGlhbGx5IGRlcml2ZWQgZnJvbSBBbmd1bGFyLFxuICogd2hpY2ggaXMgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcgR29vZ2xlLCBJbmMuXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyB0aGVyZWZvcmUgZ292ZXJuZWQgYnkgdGhlIHNhbWUgTUlULXN0eWxlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqXG4gKiBPcmlnaW5hbCBBbmd1bGFyIFZhbGlkYXRvcnM6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL2Zvcm1zL3NyYy92YWxpZGF0b3JzLnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBKc29uVmFsaWRhdG9ycyB7XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciBmdW5jdGlvbnM6XG4gICAqXG4gICAqIEZvciBhbGwgZm9ybUNvbnRyb2xzOiAgICAgcmVxdWlyZWQsIHR5cGUsIGVudW0sIGNvbnN0XG4gICAqIEZvciB0ZXh0IGZvcm1Db250cm9sczogICAgbWluTGVuZ3RoLCBtYXhMZW5ndGgsIHBhdHRlcm4sIGZvcm1hdFxuICAgKiBGb3IgbnVtZXJpYyBmb3JtQ29udHJvbHM6IG1heGltdW0sIGV4Y2x1c2l2ZU1heGltdW0sXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bSwgZXhjbHVzaXZlTWluaW11bSwgbXVsdGlwbGVPZlxuICAgKiBGb3IgZm9ybUdyb3VwIG9iamVjdHM6ICAgIG1pblByb3BlcnRpZXMsIG1heFByb3BlcnRpZXMsIGRlcGVuZGVuY2llc1xuICAgKiBGb3IgZm9ybUFycmF5IGFycmF5czogICAgIG1pbkl0ZW1zLCBtYXhJdGVtcywgdW5pcXVlSXRlbXMsIGNvbnRhaW5zXG4gICAqXG4gICAqIFRPRE86IGZpbmlzaCBkZXBlbmRlbmNpZXMgdmFsaWRhdG9yXG4gICAqL1xuXG4gIC8qKlxuICAgKiAncmVxdWlyZWQnIHZhbGlkYXRvclxuICAgKlxuICAgKiBUaGlzIHZhbGlkYXRvciBpcyBvdmVybG9hZGVkLCBjb21wYXJlZCB0byB0aGUgZGVmYXVsdCByZXF1aXJlZCB2YWxpZGF0b3IuXG4gICAqIElmIGNhbGxlZCB3aXRoIG5vIHBhcmFtZXRlcnMsIG9yIFRSVUUsIHRoaXMgdmFsaWRhdG9yIHJldHVybnMgdGhlXG4gICAqICdyZXF1aXJlZCcgdmFsaWRhdG9yIGZ1bmN0aW9uIChyYXRoZXIgdGhhbiBleGVjdXRpbmcgaXQpLiBUaGlzIG1hdGNoZXNcbiAgICogdGhlIGJlaGF2aW9yIG9mIGFsbCBvdGhlciB2YWxpZGF0b3JzIGluIHRoaXMgbGlicmFyeS5cbiAgICpcbiAgICogSWYgdGhpcyB2YWxpZGF0b3IgaXMgY2FsbGVkIHdpdGggYW4gQWJzdHJhY3RDb250cm9sIHBhcmFtZXRlclxuICAgKiAoYXMgd2FzIHByZXZpb3VzbHkgcmVxdWlyZWQpIGl0IGJlaGF2ZXMgdGhlIHNhbWUgYXMgQW5ndWxhcidzIGRlZmF1bHRcbiAgICogcmVxdWlyZWQgdmFsaWRhdG9yLCBhbmQgcmV0dXJucyBhbiBlcnJvciBpZiB0aGUgY29udHJvbCBpcyBlbXB0eS5cbiAgICpcbiAgICogT2xkIGJlaGF2aW9yOiAoaWYgaW5wdXQgdHlwZSA9IEFic3RyYWN0Q29udHJvbClcbiAgICogLy8ge0Fic3RyYWN0Q29udHJvbH0gY29udHJvbCAtIHJlcXVpcmVkIGNvbnRyb2xcbiAgICogLy8ge3tba2V5OiBzdHJpbmddOiBib29sZWFufX0gLSByZXR1cm5zIGVycm9yIG1lc3NhZ2UgaWYgbm8gaW5wdXRcbiAgICpcbiAgICogTmV3IGJlaGF2aW9yOiAoaWYgbm8gaW5wdXQsIG9yIGlucHV0IHR5cGUgPSBib29sZWFuKVxuICAgKiAvLyB7Ym9vbGVhbiA9IHRydWV9IHJlcXVpcmVkPyAtIHRydWUgdG8gdmFsaWRhdGUsIGZhbHNlIHRvIGRpc2FibGVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSByZXR1cm5zIHRoZSAncmVxdWlyZWQnIHZhbGlkYXRvciBmdW5jdGlvbiBpdHNlbGZcbiAgICovXG4gIHN0YXRpYyByZXF1aXJlZChpbnB1dDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xuICBzdGF0aWMgcmVxdWlyZWQoaW5wdXQ/OiBib29sZWFuKTogSVZhbGlkYXRvckZuO1xuXG4gIHN0YXRpYyByZXF1aXJlZChpbnB1dD86IEFic3RyYWN0Q29udHJvbHxib29sZWFuKTogVmFsaWRhdGlvbkVycm9yc3xudWxsfElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHsgaW5wdXQgPSB0cnVlOyB9XG4gICAgc3dpdGNoIChpbnB1dCkge1xuICAgICAgY2FzZSB0cnVlOiAvLyBSZXR1cm4gcmVxdWlyZWQgZnVuY3Rpb24gKGRvIG5vdCBleGVjdXRlIGl0IHlldClcbiAgICAgICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgICAgICBpZiAoaW52ZXJ0KSB7IHJldHVybiBudWxsOyB9IC8vIGlmIG5vdCByZXF1aXJlZCwgYWx3YXlzIHJldHVybiB2YWxpZFxuICAgICAgICAgIHJldHVybiBoYXNWYWx1ZShjb250cm9sLnZhbHVlKSA/IG51bGwgOiB7ICdyZXF1aXJlZCc6IHRydWUgfTtcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgZmFsc2U6IC8vIERvIG5vdGhpbmcgKGlmIGZpZWxkIGlzIG5vdCByZXF1aXJlZCwgaXQgaXMgYWx3YXlzIHZhbGlkKVxuICAgICAgICByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjtcbiAgICAgIGRlZmF1bHQ6IC8vIEV4ZWN1dGUgcmVxdWlyZWQgZnVuY3Rpb25cbiAgICAgICAgcmV0dXJuIGhhc1ZhbHVlKCg8QWJzdHJhY3RDb250cm9sPmlucHV0KS52YWx1ZSkgPyBudWxsIDogeyAncmVxdWlyZWQnOiB0cnVlIH07XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiAndHlwZScgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCB0byBvbmx5IGFjY2VwdCB2YWx1ZXMgb2YgYSBzcGVjaWZpZWQgdHlwZSxcbiAgICogb3Igb25lIG9mIGFuIGFycmF5IG9mIHR5cGVzLlxuICAgKlxuICAgKiBOb3RlOiBTY2hlbWFQcmltaXRpdmVUeXBlID0gJ3N0cmluZyd8J251bWJlcid8J2ludGVnZXInfCdib29sZWFuJ3wnbnVsbCdcbiAgICpcbiAgICogLy8ge1NjaGVtYVByaW1pdGl2ZVR5cGV8U2NoZW1hUHJpbWl0aXZlVHlwZVtdfSB0eXBlIC0gdHlwZShzKSB0byBhY2NlcHRcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyB0eXBlKHJlcXVpcmVkVHlwZTogU2NoZW1hUHJpbWl0aXZlVHlwZXxTY2hlbWFQcmltaXRpdmVUeXBlW10pOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUocmVxdWlyZWRUeXBlKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgY3VycmVudFZhbHVlOiBhbnkgPSBjb250cm9sLnZhbHVlO1xuICAgICAgY29uc3QgaXNWYWxpZCA9IGlzQXJyYXkocmVxdWlyZWRUeXBlKSA/XG4gICAgICAgICg8U2NoZW1hUHJpbWl0aXZlVHlwZVtdPnJlcXVpcmVkVHlwZSkuc29tZSh0eXBlID0+IGlzVHlwZShjdXJyZW50VmFsdWUsIHR5cGUpKSA6XG4gICAgICAgIGlzVHlwZShjdXJyZW50VmFsdWUsIDxTY2hlbWFQcmltaXRpdmVUeXBlPnJlcXVpcmVkVHlwZSk7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAndHlwZSc6IHsgcmVxdWlyZWRUeXBlLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2VudW0nIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGNvbnRyb2wgdG8gaGF2ZSBhIHZhbHVlIGZyb20gYW4gZW51bWVyYXRlZCBsaXN0IG9mIHZhbHVlcy5cbiAgICpcbiAgICogQ29udmVydHMgdHlwZXMgYXMgbmVlZGVkIHRvIGFsbG93IHN0cmluZyBpbnB1dHMgdG8gc3RpbGwgY29ycmVjdGx5XG4gICAqIG1hdGNoIG51bWJlciwgYm9vbGVhbiwgYW5kIG51bGwgZW51bSB2YWx1ZXMuXG4gICAqXG4gICAqIC8vIHthbnlbXX0gYWxsb3dlZFZhbHVlcyAtIGFycmF5IG9mIGFjY2VwdGFibGUgdmFsdWVzXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgZW51bShhbGxvd2VkVmFsdWVzOiBhbnlbXSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFpc0FycmF5KGFsbG93ZWRWYWx1ZXMpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWU6IGFueSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBjb25zdCBpc0VxdWFsID0gKGVudW1WYWx1ZSwgaW5wdXRWYWx1ZSkgPT5cbiAgICAgICAgZW51bVZhbHVlID09PSBpbnB1dFZhbHVlIHx8XG4gICAgICAgIChpc051bWJlcihlbnVtVmFsdWUpICYmICtpbnB1dFZhbHVlID09PSArZW51bVZhbHVlKSB8fFxuICAgICAgICAoaXNCb29sZWFuKGVudW1WYWx1ZSwgJ3N0cmljdCcpICYmXG4gICAgICAgICAgdG9KYXZhU2NyaXB0VHlwZShpbnB1dFZhbHVlLCAnYm9vbGVhbicpID09PSBlbnVtVmFsdWUpIHx8XG4gICAgICAgIChlbnVtVmFsdWUgPT09IG51bGwgJiYgIWhhc1ZhbHVlKGlucHV0VmFsdWUpKSB8fFxuICAgICAgICBfLmlzRXF1YWwoZW51bVZhbHVlLCBpbnB1dFZhbHVlKTtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSBpc0FycmF5KGN1cnJlbnRWYWx1ZSkgP1xuICAgICAgICBjdXJyZW50VmFsdWUuZXZlcnkoaW5wdXRWYWx1ZSA9PiBhbGxvd2VkVmFsdWVzLnNvbWUoZW51bVZhbHVlID0+XG4gICAgICAgICAgaXNFcXVhbChlbnVtVmFsdWUsIGlucHV0VmFsdWUpXG4gICAgICAgICkpIDpcbiAgICAgICAgYWxsb3dlZFZhbHVlcy5zb21lKGVudW1WYWx1ZSA9PiBpc0VxdWFsKGVudW1WYWx1ZSwgY3VycmVudFZhbHVlKSk7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnZW51bSc6IHsgYWxsb3dlZFZhbHVlcywgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb25zdCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCB0byBoYXZlIGEgc3BlY2lmaWMgdmFsdWUuXG4gICAqXG4gICAqIENvbnZlcnRzIHR5cGVzIGFzIG5lZWRlZCB0byBhbGxvdyBzdHJpbmcgaW5wdXRzIHRvIHN0aWxsIGNvcnJlY3RseVxuICAgKiBtYXRjaCBudW1iZXIsIGJvb2xlYW4sIGFuZCBudWxsIHZhbHVlcy5cbiAgICpcbiAgICogVE9ETzogbW9kaWZ5IHRvIHdvcmsgd2l0aCBvYmplY3RzXG4gICAqXG4gICAqIC8vIHthbnlbXX0gcmVxdWlyZWRWYWx1ZSAtIHJlcXVpcmVkIHZhbHVlXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgY29uc3QocmVxdWlyZWRWYWx1ZTogYW55KTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKHJlcXVpcmVkVmFsdWUpKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWU6IGFueSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBjb25zdCBpc0VxdWFsID0gKGNvbnN0VmFsdWUsIGlucHV0VmFsdWUpID0+XG4gICAgICAgIGNvbnN0VmFsdWUgPT09IGlucHV0VmFsdWUgfHxcbiAgICAgICAgaXNOdW1iZXIoY29uc3RWYWx1ZSkgJiYgK2lucHV0VmFsdWUgPT09ICtjb25zdFZhbHVlIHx8XG4gICAgICAgIGlzQm9vbGVhbihjb25zdFZhbHVlLCAnc3RyaWN0JykgJiZcbiAgICAgICAgICB0b0phdmFTY3JpcHRUeXBlKGlucHV0VmFsdWUsICdib29sZWFuJykgPT09IGNvbnN0VmFsdWUgfHxcbiAgICAgICAgY29uc3RWYWx1ZSA9PT0gbnVsbCAmJiAhaGFzVmFsdWUoaW5wdXRWYWx1ZSk7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gaXNFcXVhbChyZXF1aXJlZFZhbHVlLCBjdXJyZW50VmFsdWUpO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ2NvbnN0JzogeyByZXF1aXJlZFZhbHVlLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ21pbkxlbmd0aCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIHRleHQgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bUxlbmd0aCAtIG1pbmltdW0gYWxsb3dlZCBzdHJpbmcgbGVuZ3RoXG4gICAqIC8vIHtib29sZWFuID0gZmFsc2V9IGludmVydCAtIGluc3RlYWQgcmV0dXJuIGVycm9yIG9iamVjdCBvbmx5IGlmIHZhbGlkXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbWluTGVuZ3RoKG1pbmltdW1MZW5ndGg6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtaW5pbXVtTGVuZ3RoKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRMZW5ndGggPSBpc1N0cmluZyhjb250cm9sLnZhbHVlKSA/IGNvbnRyb2wudmFsdWUubGVuZ3RoIDogMDtcbiAgICAgIGxldCBpc1ZhbGlkID0gY3VycmVudExlbmd0aCA+PSBtaW5pbXVtTGVuZ3RoO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21pbkxlbmd0aCc6IHsgbWluaW11bUxlbmd0aCwgY3VycmVudExlbmd0aCB9IH07XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogJ21heExlbmd0aCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIHRleHQgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWF4aW11bUxlbmd0aCAtIG1heGltdW0gYWxsb3dlZCBzdHJpbmcgbGVuZ3RoXG4gICAqIC8vIHtib29sZWFuID0gZmFsc2V9IGludmVydCAtIGluc3RlYWQgcmV0dXJuIGVycm9yIG9iamVjdCBvbmx5IGlmIHZhbGlkXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbWF4TGVuZ3RoKG1heGltdW1MZW5ndGg6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtYXhpbXVtTGVuZ3RoKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBsZXQgY3VycmVudExlbmd0aCA9IGlzU3RyaW5nKGNvbnRyb2wudmFsdWUpID8gY29udHJvbC52YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgbGV0IGlzVmFsaWQgPSBjdXJyZW50TGVuZ3RoIDw9IG1heGltdW1MZW5ndGg7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnbWF4TGVuZ3RoJzogeyBtYXhpbXVtTGVuZ3RoLCBjdXJyZW50TGVuZ3RoIH0gfTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiAncGF0dGVybicgdmFsaWRhdG9yXG4gICAqXG4gICAqIE5vdGU6IE5PVCB0aGUgc2FtZSBhcyBBbmd1bGFyJ3MgZGVmYXVsdCBwYXR0ZXJuIHZhbGlkYXRvci5cbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sJ3MgdmFsdWUgdG8gbWF0Y2ggYSBzcGVjaWZpZWQgcmVndWxhciBleHByZXNzaW9uIHBhdHRlcm4uXG4gICAqXG4gICAqIFRoaXMgdmFsaWRhdG9yIGNoYW5nZXMgdGhlIGJlaGF2aW9yIG9mIGRlZmF1bHQgcGF0dGVybiB2YWxpZGF0b3JcbiAgICogYnkgcmVwbGFjaW5nIFJlZ0V4cChgXiR7cGF0dGVybn0kYCkgd2l0aCBSZWdFeHAoYCR7cGF0dGVybn1gKSxcbiAgICogd2hpY2ggYWxsb3dzIGZvciBwYXJ0aWFsIG1hdGNoZXMuXG4gICAqXG4gICAqIFRvIHJldHVybiB0byB0aGUgZGVmYXVsdCBmdW5jaXRvbmFsaXR5LCBhbmQgbWF0Y2ggdGhlIGVudGlyZSBzdHJpbmcsXG4gICAqIHBhc3MgVFJVRSBhcyB0aGUgb3B0aW9uYWwgc2Vjb25kIHBhcmFtZXRlci5cbiAgICpcbiAgICogLy8ge3N0cmluZ30gcGF0dGVybiAtIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJuXG4gICAqIC8vIHtib29sZWFuID0gZmFsc2V9IHdob2xlU3RyaW5nIC0gbWF0Y2ggd2hvbGUgdmFsdWUgc3RyaW5nP1xuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIHBhdHRlcm4ocGF0dGVybjogc3RyaW5nfFJlZ0V4cCwgd2hvbGVTdHJpbmcgPSBmYWxzZSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShwYXR0ZXJuKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IHJlZ2V4OiBSZWdFeHA7XG4gICAgICBsZXQgcmVxdWlyZWRQYXR0ZXJuOiBzdHJpbmc7XG4gICAgICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlcXVpcmVkUGF0dGVybiA9ICh3aG9sZVN0cmluZykgPyBgXiR7cGF0dGVybn0kYCA6IHBhdHRlcm47XG4gICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZXF1aXJlZFBhdHRlcm4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWlyZWRQYXR0ZXJuID0gcGF0dGVybi50b1N0cmluZygpO1xuICAgICAgICByZWdleCA9IHBhdHRlcm47XG4gICAgICB9XG4gICAgICBsZXQgY3VycmVudFZhbHVlOiBzdHJpbmcgPSBjb250cm9sLnZhbHVlO1xuICAgICAgbGV0IGlzVmFsaWQgPSBpc1N0cmluZyhjdXJyZW50VmFsdWUpID8gcmVnZXgudGVzdChjdXJyZW50VmFsdWUpIDogZmFsc2U7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAncGF0dGVybic6IHsgcmVxdWlyZWRQYXR0ZXJuLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2Zvcm1hdCcgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCB0byBoYXZlIGEgdmFsdWUgb2YgYSBjZXJ0YWluIGZvcm1hdC5cbiAgICpcbiAgICogVGhpcyB2YWxpZGF0b3IgY3VycmVudGx5IGNoZWNrcyB0aGUgZm9sbG93aW5nIGZvcm1zdHM6XG4gICAqICAgZGF0ZSwgdGltZSwgZGF0ZS10aW1lLCBlbWFpbCwgaG9zdG5hbWUsIGlwdjQsIGlwdjYsXG4gICAqICAgdXJpLCB1cmktcmVmZXJlbmNlLCB1cmktdGVtcGxhdGUsIHVybCwgdXVpZCwgY29sb3IsXG4gICAqICAganNvbi1wb2ludGVyLCByZWxhdGl2ZS1qc29uLXBvaW50ZXIsIHJlZ2V4XG4gICAqXG4gICAqIEZhc3QgZm9ybWF0IHJlZ3VsYXIgZXhwcmVzc2lvbnMgY29waWVkIGZyb20gQUpWOlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vZXBvYmVyZXpraW4vYWp2L2Jsb2IvbWFzdGVyL2xpYi9jb21waWxlL2Zvcm1hdHMuanNcbiAgICpcbiAgICogLy8ge0pzb25TY2hlbWFGb3JtYXROYW1lc30gcmVxdWlyZWRGb3JtYXQgLSBmb3JtYXQgdG8gY2hlY2tcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBmb3JtYXQocmVxdWlyZWRGb3JtYXQ6IEpzb25TY2hlbWFGb3JtYXROYW1lcyk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShyZXF1aXJlZEZvcm1hdCkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBpc1ZhbGlkOiBib29sZWFuO1xuICAgICAgbGV0IGN1cnJlbnRWYWx1ZTogc3RyaW5nfERhdGUgPSBjb250cm9sLnZhbHVlO1xuICAgICAgaWYgKGlzU3RyaW5nKGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0VGVzdDogRnVuY3Rpb258UmVnRXhwID0ganNvblNjaGVtYUZvcm1hdFRlc3RzW3JlcXVpcmVkRm9ybWF0XTtcbiAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXRUZXN0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlzVmFsaWQgPSAoPFJlZ0V4cD5mb3JtYXRUZXN0KS50ZXN0KDxzdHJpbmc+Y3VycmVudFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZm9ybWF0VGVzdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlzVmFsaWQgPSAoPEZ1bmN0aW9uPmZvcm1hdFRlc3QpKDxzdHJpbmc+Y3VycmVudFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBmb3JtYXQgdmFsaWRhdG9yIGVycm9yOiBcIiR7cmVxdWlyZWRGb3JtYXR9XCIgaXMgbm90IGEgcmVjb2duaXplZCBmb3JtYXQuYCk7XG4gICAgICAgICAgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEFsbG93IEphdmFTY3JpcHQgRGF0ZSBvYmplY3RzXG4gICAgICAgIGlzVmFsaWQgPSBbJ2RhdGUnLCAndGltZScsICdkYXRlLXRpbWUnXS5pbmNsdWRlcyhyZXF1aXJlZEZvcm1hdCkgJiZcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoY3VycmVudFZhbHVlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ2Zvcm1hdCc6IHsgcmVxdWlyZWRGb3JtYXQsIGN1cnJlbnRWYWx1ZSB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWluaW11bScgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgY29udHJvbCdzIG51bWVyaWMgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvXG4gICAqIGEgbWluaW11bSBhbW91bnQuXG4gICAqXG4gICAqIEFueSBub24tbnVtZXJpYyB2YWx1ZSBpcyBhbHNvIHZhbGlkIChhY2NvcmRpbmcgdG8gdGhlIEhUTUwgZm9ybXMgc3BlYyxcbiAgICogYSBub24tbnVtZXJpYyB2YWx1ZSBkb2Vzbid0IGhhdmUgYSBtaW5pbXVtKS5cbiAgICogaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjYXR0ci1pbnB1dC1tYXhcbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bSAtIG1pbmltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1pbmltdW0obWluaW11bVZhbHVlOiBudW1iZXIpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUobWluaW11bVZhbHVlKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBsZXQgaXNWYWxpZCA9ICFpc051bWJlcihjdXJyZW50VmFsdWUpIHx8IGN1cnJlbnRWYWx1ZSA+PSBtaW5pbXVtVmFsdWU7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnbWluaW11bSc6IHsgbWluaW11bVZhbHVlLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2V4Y2x1c2l2ZU1pbmltdW0nIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGNvbnRyb2wncyBudW1lcmljIHZhbHVlIHRvIGJlIGxlc3MgdGhhbiBhIG1heGltdW0gYW1vdW50LlxuICAgKlxuICAgKiBBbnkgbm9uLW51bWVyaWMgdmFsdWUgaXMgYWxzbyB2YWxpZCAoYWNjb3JkaW5nIHRvIHRoZSBIVE1MIGZvcm1zIHNwZWMsXG4gICAqIGEgbm9uLW51bWVyaWMgdmFsdWUgZG9lc24ndCBoYXZlIGEgbWF4aW11bSkuXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWF4XG4gICAqXG4gICAqIC8vIHtudW1iZXJ9IGV4Y2x1c2l2ZU1pbmltdW1WYWx1ZSAtIG1heGltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIGV4Y2x1c2l2ZU1pbmltdW0oZXhjbHVzaXZlTWluaW11bVZhbHVlOiBudW1iZXIpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUoZXhjbHVzaXZlTWluaW11bVZhbHVlKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBsZXQgaXNWYWxpZCA9ICFpc051bWJlcihjdXJyZW50VmFsdWUpIHx8ICtjdXJyZW50VmFsdWUgPCBleGNsdXNpdmVNaW5pbXVtVmFsdWU7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnZXhjbHVzaXZlTWluaW11bSc6IHsgZXhjbHVzaXZlTWluaW11bVZhbHVlLCBjdXJyZW50VmFsdWUgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ21heGltdW0nIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGNvbnRyb2wncyBudW1lcmljIHZhbHVlIHRvIGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0b1xuICAgKiBhIG1heGltdW0gYW1vdW50LlxuICAgKlxuICAgKiBBbnkgbm9uLW51bWVyaWMgdmFsdWUgaXMgYWxzbyB2YWxpZCAoYWNjb3JkaW5nIHRvIHRoZSBIVE1MIGZvcm1zIHNwZWMsXG4gICAqIGEgbm9uLW51bWVyaWMgdmFsdWUgZG9lc24ndCBoYXZlIGEgbWF4aW11bSkuXG4gICAqIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWF4XG4gICAqXG4gICAqIC8vIHtudW1iZXJ9IG1heGltdW1WYWx1ZSAtIG1heGltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1heGltdW0obWF4aW11bVZhbHVlOiBudW1iZXIpOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghaGFzVmFsdWUobWF4aW11bVZhbHVlKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICBsZXQgaXNWYWxpZCA9ICFpc051bWJlcihjdXJyZW50VmFsdWUpIHx8ICtjdXJyZW50VmFsdWUgPD0gbWF4aW11bVZhbHVlO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21heGltdW0nOiB7IG1heGltdW1WYWx1ZSwgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdleGNsdXNpdmVNYXhpbXVtJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sJ3MgbnVtZXJpYyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gYSBtYXhpbXVtIGFtb3VudC5cbiAgICpcbiAgICogQW55IG5vbi1udW1lcmljIHZhbHVlIGlzIGFsc28gdmFsaWQgKGFjY29yZGluZyB0byB0aGUgSFRNTCBmb3JtcyBzcGVjLFxuICAgKiBhIG5vbi1udW1lcmljIHZhbHVlIGRvZXNuJ3QgaGF2ZSBhIG1heGltdW0pLlxuICAgKiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1heFxuICAgKlxuICAgKiAvLyB7bnVtYmVyfSBleGNsdXNpdmVNYXhpbXVtVmFsdWUgLSBtYXhpbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBleGNsdXNpdmVNYXhpbXVtKGV4Y2x1c2l2ZU1heGltdW1WYWx1ZTogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKGV4Y2x1c2l2ZU1heGltdW1WYWx1ZSkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBjdXJyZW50VmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgICAgbGV0IGlzVmFsaWQgPSAhaXNOdW1iZXIoY3VycmVudFZhbHVlKSB8fCArY3VycmVudFZhbHVlIDwgZXhjbHVzaXZlTWF4aW11bVZhbHVlO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ2V4Y2x1c2l2ZU1heGltdW0nOiB7IGV4Y2x1c2l2ZU1heGltdW1WYWx1ZSwgY3VycmVudFZhbHVlIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdtdWx0aXBsZU9mJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgYSBjb250cm9sIHRvIGhhdmUgYSBudW1lcmljIHZhbHVlIHRoYXQgaXMgYSBtdWx0aXBsZVxuICAgKiBvZiBhIHNwZWNpZmllZCBudW1iZXIuXG4gICAqXG4gICAqIC8vIHtudW1iZXJ9IG11bHRpcGxlT2ZWYWx1ZSAtIG51bWJlciB2YWx1ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2ZcbiAgICogLy8ge0lWYWxpZGF0b3JGbn1cbiAgICovXG4gIHN0YXRpYyBtdWx0aXBsZU9mKG11bHRpcGxlT2ZWYWx1ZTogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG11bHRpcGxlT2ZWYWx1ZSkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBjdXJyZW50VmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgICAgbGV0IGlzVmFsaWQgPSBpc051bWJlcihjdXJyZW50VmFsdWUpICYmXG4gICAgICAgIGN1cnJlbnRWYWx1ZSAlIG11bHRpcGxlT2ZWYWx1ZSA9PT0gMDtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdtdWx0aXBsZU9mJzogeyBtdWx0aXBsZU9mVmFsdWUsIGN1cnJlbnRWYWx1ZSB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWluUHJvcGVydGllcycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgZm9ybSBncm91cCB0byBoYXZlIGEgbWluaW11bSBudW1iZXIgb2YgcHJvcGVydGllcyAoaS5lLiBoYXZlXG4gICAqIHZhbHVlcyBlbnRlcmVkIGluIGEgbWluaW11bSBudW1iZXIgb2YgY29udHJvbHMgd2l0aGluIHRoZSBncm91cCkuXG4gICAqXG4gICAqIC8vIHtudW1iZXJ9IG1pbmltdW1Qcm9wZXJ0aWVzIC0gbWluaW11bSBudW1iZXIgb2YgcHJvcGVydGllcyBhbGxvd2VkXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgbWluUHJvcGVydGllcyhtaW5pbXVtUHJvcGVydGllczogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1pbmltdW1Qcm9wZXJ0aWVzKSkgeyByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGN1cnJlbnRQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoY29udHJvbC52YWx1ZSkubGVuZ3RoIHx8IDA7XG4gICAgICBsZXQgaXNWYWxpZCA9IGN1cnJlbnRQcm9wZXJ0aWVzID49IG1pbmltdW1Qcm9wZXJ0aWVzO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21pblByb3BlcnRpZXMnOiB7IG1pbmltdW1Qcm9wZXJ0aWVzLCBjdXJyZW50UHJvcGVydGllcyB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWF4UHJvcGVydGllcycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIGEgZm9ybSBncm91cCB0byBoYXZlIGEgbWF4aW11bSBudW1iZXIgb2YgcHJvcGVydGllcyAoaS5lLiBoYXZlXG4gICAqIHZhbHVlcyBlbnRlcmVkIGluIGEgbWF4aW11bSBudW1iZXIgb2YgY29udHJvbHMgd2l0aGluIHRoZSBncm91cCkuXG4gICAqXG4gICAqIE5vdGU6IEhhcyBubyBlZmZlY3QgaWYgdGhlIGZvcm0gZ3JvdXAgZG9lcyBub3QgY29udGFpbiBtb3JlIHRoYW4gdGhlXG4gICAqIG1heGltdW0gbnVtYmVyIG9mIGNvbnRyb2xzLlxuICAgKlxuICAgKiAvLyB7bnVtYmVyfSBtYXhpbXVtUHJvcGVydGllcyAtIG1heGltdW0gbnVtYmVyIG9mIHByb3BlcnRpZXMgYWxsb3dlZFxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1heFByb3BlcnRpZXMobWF4aW11bVByb3BlcnRpZXM6IG51bWJlcik6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtYXhpbXVtUHJvcGVydGllcykpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoY29udHJvbC52YWx1ZSkubGVuZ3RoIHx8IDA7XG4gICAgICBsZXQgaXNWYWxpZCA9IGN1cnJlbnRQcm9wZXJ0aWVzIDw9IG1heGltdW1Qcm9wZXJ0aWVzO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21heFByb3BlcnRpZXMnOiB7IG1heGltdW1Qcm9wZXJ0aWVzLCBjdXJyZW50UHJvcGVydGllcyB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnZGVwZW5kZW5jaWVzJyB2YWxpZGF0b3JcbiAgICpcbiAgICogUmVxdWlyZXMgdGhlIGNvbnRyb2xzIGluIGEgZm9ybSBncm91cCB0byBtZWV0IGFkZGl0aW9uYWwgdmFsaWRhdGlvblxuICAgKiBjcml0ZXJpYSwgZGVwZW5kaW5nIG9uIHRoZSB2YWx1ZXMgb2Ygb3RoZXIgY29udHJvbHMgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogaHR0cHM6Ly9zcGFjZXRlbGVzY29wZS5naXRodWIuaW8vdW5kZXJzdGFuZGluZy1qc29uLXNjaGVtYS9yZWZlcmVuY2Uvb2JqZWN0Lmh0bWwjZGVwZW5kZW5jaWVzXG4gICAqXG4gICAqIC8vIHthbnl9IGRlcGVuZGVuY2llcyAtIHJlcXVpcmVkIGRlcGVuZGVuY2llc1xuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIGRlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXM6IGFueSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKGdldFR5cGUoZGVwZW5kZW5jaWVzKSAhPT0gJ29iamVjdCcgfHwgaXNFbXB0eShkZXBlbmRlbmNpZXMpKSB7XG4gICAgICByZXR1cm4gSnNvblZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjtcbiAgICB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGludmVydCA9IGZhbHNlKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBsZXQgYWxsRXJyb3JzID0gX21lcmdlT2JqZWN0cyhcbiAgICAgICAgZm9yRWFjaENvcHkoZGVwZW5kZW5jaWVzLCAodmFsdWUsIHJlcXVpcmluZ0ZpZWxkKSA9PiB7XG4gICAgICAgICAgaWYgKCFoYXNWYWx1ZShjb250cm9sLnZhbHVlW3JlcXVpcmluZ0ZpZWxkXSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgICAgICBsZXQgcmVxdWlyaW5nRmllbGRFcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgPSB7IH07XG4gICAgICAgICAgbGV0IHJlcXVpcmVkRmllbGRzOiBzdHJpbmdbXTtcbiAgICAgICAgICBsZXQgcHJvcGVydGllczogVmFsaWRhdGlvbkVycm9ycyA9IHsgfTtcbiAgICAgICAgICBpZiAoZ2V0VHlwZShkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdKSA9PT0gJ2FycmF5Jykge1xuICAgICAgICAgICAgcmVxdWlyZWRGaWVsZHMgPSBkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZ2V0VHlwZShkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJlcXVpcmVkRmllbGRzID0gZGVwZW5kZW5jaWVzW3JlcXVpcmluZ0ZpZWxkXVsncmVxdWlyZWQnXSB8fCBbXTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBkZXBlbmRlbmNpZXNbcmVxdWlyaW5nRmllbGRdWydwcm9wZXJ0aWVzJ10gfHwgeyB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFZhbGlkYXRlIHByb3BlcnR5IGRlcGVuZGVuY2llc1xuICAgICAgICAgIGZvciAobGV0IHJlcXVpcmVkRmllbGQgb2YgcmVxdWlyZWRGaWVsZHMpIHtcbiAgICAgICAgICAgIGlmICh4b3IoIWhhc1ZhbHVlKGNvbnRyb2wudmFsdWVbcmVxdWlyZWRGaWVsZF0pLCBpbnZlcnQpKSB7XG4gICAgICAgICAgICAgIHJlcXVpcmluZ0ZpZWxkRXJyb3JzW3JlcXVpcmVkRmllbGRdID0geyAncmVxdWlyZWQnOiB0cnVlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVmFsaWRhdGUgc2NoZW1hIGRlcGVuZGVuY2llc1xuICAgICAgICAgIHJlcXVpcmluZ0ZpZWxkRXJyb3JzID0gX21lcmdlT2JqZWN0cyhyZXF1aXJpbmdGaWVsZEVycm9ycyxcbiAgICAgICAgICAgIGZvckVhY2hDb3B5KHByb3BlcnRpZXMsIChyZXF1aXJlbWVudHMsIHJlcXVpcmVkRmllbGQpID0+IHtcbiAgICAgICAgICAgICAgbGV0IHJlcXVpcmVkRmllbGRFcnJvcnMgPSBfbWVyZ2VPYmplY3RzKFxuICAgICAgICAgICAgICAgIGZvckVhY2hDb3B5KHJlcXVpcmVtZW50cywgKHJlcXVpcmVtZW50LCBwYXJhbWV0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgIGxldCB2YWxpZGF0b3I6IElWYWxpZGF0b3JGbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAocmVxdWlyZW1lbnQgPT09ICdtYXhpbXVtJyB8fCByZXF1aXJlbWVudCA9PT0gJ21pbmltdW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBleGNsdXNpdmUgPSAhIXJlcXVpcmVtZW50c1snZXhjbHVzaXZlTScgKyByZXF1aXJlbWVudC5zbGljZSgxKV07XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvciA9IEpzb25WYWxpZGF0b3JzW3JlcXVpcmVtZW50XShwYXJhbWV0ZXIsIGV4Y2x1c2l2ZSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBKc29uVmFsaWRhdG9yc1tyZXF1aXJlbWVudF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yID0gSnNvblZhbGlkYXRvcnNbcmVxdWlyZW1lbnRdKHBhcmFtZXRlcik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gIWlzRGVmaW5lZCh2YWxpZGF0b3IpID9cbiAgICAgICAgICAgICAgICAgICAgbnVsbCA6IHZhbGlkYXRvcihjb250cm9sLnZhbHVlW3JlcXVpcmVkRmllbGRdKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICByZXR1cm4gaXNFbXB0eShyZXF1aXJlZEZpZWxkRXJyb3JzKSA/XG4gICAgICAgICAgICAgICAgbnVsbCA6IHsgW3JlcXVpcmVkRmllbGRdOiByZXF1aXJlZEZpZWxkRXJyb3JzIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIGlzRW1wdHkocmVxdWlyaW5nRmllbGRFcnJvcnMpID9cbiAgICAgICAgICAgIG51bGwgOiB7IFtyZXF1aXJpbmdGaWVsZF06IHJlcXVpcmluZ0ZpZWxkRXJyb3JzIH07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgICAgcmV0dXJuIGlzRW1wdHkoYWxsRXJyb3JzKSA/IG51bGwgOiBhbGxFcnJvcnM7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWluSXRlbXMnIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGZvcm0gYXJyYXkgdG8gaGF2ZSBhIG1pbmltdW0gbnVtYmVyIG9mIHZhbHVlcy5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWluaW11bUl0ZW1zIC0gbWluaW11bSBudW1iZXIgb2YgaXRlbXMgYWxsb3dlZFxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1pbkl0ZW1zKG1pbmltdW1JdGVtczogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1pbmltdW1JdGVtcykpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBjdXJyZW50SXRlbXMgPSBpc0FycmF5KGNvbnRyb2wudmFsdWUpID8gY29udHJvbC52YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgbGV0IGlzVmFsaWQgPSBjdXJyZW50SXRlbXMgPj0gbWluaW11bUl0ZW1zO1xuICAgICAgcmV0dXJuIHhvcihpc1ZhbGlkLCBpbnZlcnQpID9cbiAgICAgICAgbnVsbCA6IHsgJ21pbkl0ZW1zJzogeyBtaW5pbXVtSXRlbXMsIGN1cnJlbnRJdGVtcyB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnbWF4SXRlbXMnIHZhbGlkYXRvclxuICAgKlxuICAgKiBSZXF1aXJlcyBhIGZvcm0gYXJyYXkgdG8gaGF2ZSBhIG1heGltdW0gbnVtYmVyIG9mIHZhbHVlcy5cbiAgICpcbiAgICogLy8ge251bWJlcn0gbWF4aW11bUl0ZW1zIC0gbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgYWxsb3dlZFxuICAgKiAvLyB7SVZhbGlkYXRvckZufVxuICAgKi9cbiAgc3RhdGljIG1heEl0ZW1zKG1heGltdW1JdGVtczogbnVtYmVyKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1heGltdW1JdGVtcykpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRJdGVtcyA9IGlzQXJyYXkoY29udHJvbC52YWx1ZSkgPyBjb250cm9sLnZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICBsZXQgaXNWYWxpZCA9IGN1cnJlbnRJdGVtcyA8PSBtYXhpbXVtSXRlbXM7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAnbWF4SXRlbXMnOiB7IG1heGltdW1JdGVtcywgY3VycmVudEl0ZW1zIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICd1bmlxdWVJdGVtcycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXkgdG8gYmUgdW5pcXVlLlxuICAgKlxuICAgKiAvLyB7Ym9vbGVhbiA9IHRydWV9IHVuaXF1ZT8gLSB0cnVlIHRvIHZhbGlkYXRlLCBmYWxzZSB0byBkaXNhYmxlXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgdW5pcXVlSXRlbXModW5pcXVlID0gdHJ1ZSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCF1bmlxdWUpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGxldCBzb3J0ZWQ6IGFueVtdID0gY29udHJvbC52YWx1ZS5zbGljZSgpLnNvcnQoKTtcbiAgICAgIGxldCBkdXBsaWNhdGVJdGVtcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb3J0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvcnRlZFtpIC0gMV0gPT09IHNvcnRlZFtpXSAmJiBkdXBsaWNhdGVJdGVtcy5pbmNsdWRlcyhzb3J0ZWRbaV0pKSB7XG4gICAgICAgICAgZHVwbGljYXRlSXRlbXMucHVzaChzb3J0ZWRbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgaXNWYWxpZCA9ICFkdXBsaWNhdGVJdGVtcy5sZW5ndGg7XG4gICAgICByZXR1cm4geG9yKGlzVmFsaWQsIGludmVydCkgP1xuICAgICAgICBudWxsIDogeyAndW5pcXVlSXRlbXMnOiB7IGR1cGxpY2F0ZUl0ZW1zIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb250YWlucycgdmFsaWRhdG9yXG4gICAqXG4gICAqIFRPRE86IENvbXBsZXRlIHRoaXMgdmFsaWRhdG9yXG4gICAqXG4gICAqIFJlcXVpcmVzIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXkgdG8gYmUgdW5pcXVlLlxuICAgKlxuICAgKiAvLyB7Ym9vbGVhbiA9IHRydWV9IHVuaXF1ZT8gLSB0cnVlIHRvIHZhbGlkYXRlLCBmYWxzZSB0byBkaXNhYmxlXG4gICAqIC8vIHtJVmFsaWRhdG9yRm59XG4gICAqL1xuICBzdGF0aWMgY29udGFpbnMocmVxdWlyZWRJdGVtID0gdHJ1ZSk6IElWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFyZXF1aXJlZEl0ZW0pIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHkoY29udHJvbC52YWx1ZSkgfHwgIWlzQXJyYXkoY29udHJvbC52YWx1ZSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtcyA9IGNvbnRyb2wudmFsdWU7XG4gICAgICAvLyBjb25zdCBpc1ZhbGlkID0gY3VycmVudEl0ZW1zLnNvbWUoaXRlbSA9PlxuICAgICAgLy9cbiAgICAgIC8vICk7XG4gICAgICBjb25zdCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiB7ICdjb250YWlucyc6IHsgcmVxdWlyZWRJdGVtLCBjdXJyZW50SXRlbXMgfSB9O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTm8tb3AgdmFsaWRhdG9yLiBJbmNsdWRlZCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS5cbiAgICovXG4gIHN0YXRpYyBudWxsVmFsaWRhdG9yKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uczpcbiAgICogY29tcG9zZUFueU9mLCBjb21wb3NlT25lT2YsIGNvbXBvc2VBbGxPZiwgY29tcG9zZU5vdCxcbiAgICogY29tcG9zZSwgY29tcG9zZUFzeW5jXG4gICAqXG4gICAqIFRPRE86IEFkZCBjb21wb3NlQW55T2ZBc3luYywgY29tcG9zZU9uZU9mQXN5bmMsXG4gICAqICAgICAgICAgICBjb21wb3NlQWxsT2ZBc3luYywgY29tcG9zZU5vdEFzeW5jXG4gICAqL1xuXG4gIC8qKlxuICAgKiAnY29tcG9zZUFueU9mJyB2YWxpZGF0b3IgY29tYmluYXRpb24gZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhbiBhcnJheSBvZiB2YWxpZGF0b3JzIGFuZCByZXR1cm5zIGEgc2luZ2xlIHZhbGlkYXRvciB0aGF0XG4gICAqIGV2YWx1YXRlcyB0byB2YWxpZCBpZiBhbnkgb25lIG9yIG1vcmUgb2YgdGhlIHN1Ym1pdHRlZCB2YWxpZGF0b3JzIGFyZVxuICAgKiB2YWxpZC4gSWYgZXZlcnkgdmFsaWRhdG9yIGlzIGludmFsaWQsIGl0IHJldHVybnMgY29tYmluZWQgZXJyb3JzIGZyb21cbiAgICogYWxsIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIC8vIHtJVmFsaWRhdG9yRm5bXX0gdmFsaWRhdG9ycyAtIGFycmF5IG9mIHZhbGlkYXRvcnMgdG8gY29tYmluZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufSAtIHNpbmdsZSBjb21iaW5lZCB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICovXG4gIHN0YXRpYyBjb21wb3NlQW55T2YodmFsaWRhdG9yczogSVZhbGlkYXRvckZuW10pOiBJVmFsaWRhdG9yRm4ge1xuICAgIGlmICghdmFsaWRhdG9ycykgeyByZXR1cm4gbnVsbDsgfVxuICAgIGxldCBwcmVzZW50VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzRGVmaW5lZCk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBsZXQgYXJyYXlPZkVycm9ycyA9XG4gICAgICAgIF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycywgaW52ZXJ0KS5maWx0ZXIoaXNEZWZpbmVkKTtcbiAgICAgIGxldCBpc1ZhbGlkID0gdmFsaWRhdG9ycy5sZW5ndGggPiBhcnJheU9mRXJyb3JzLmxlbmd0aDtcbiAgICAgIHJldHVybiB4b3IoaXNWYWxpZCwgaW52ZXJ0KSA/XG4gICAgICAgIG51bGwgOiBfbWVyZ2VPYmplY3RzKC4uLmFycmF5T2ZFcnJvcnMsIHsgJ2FueU9mJzogIWludmVydCB9KTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb21wb3NlT25lT2YnIHZhbGlkYXRvciBjb21iaW5hdGlvbiBmdW5jdGlvblxuICAgKlxuICAgKiBBY2NlcHRzIGFuIGFycmF5IG9mIHZhbGlkYXRvcnMgYW5kIHJldHVybnMgYSBzaW5nbGUgdmFsaWRhdG9yIHRoYXRcbiAgICogZXZhbHVhdGVzIHRvIHZhbGlkIG9ubHkgaWYgZXhhY3RseSBvbmUgb2YgdGhlIHN1Ym1pdHRlZCB2YWxpZGF0b3JzXG4gICAqIGlzIHZhbGlkLiBPdGhlcndpc2UgcmV0dXJucyBjb21iaW5lZCBpbmZvcm1hdGlvbiBmcm9tIGFsbCB2YWxpZGF0b3JzLFxuICAgKiBib3RoIHZhbGlkIGFuZCBpbnZhbGlkLlxuICAgKlxuICAgKiAvLyB7SVZhbGlkYXRvckZuW119IHZhbGlkYXRvcnMgLSBhcnJheSBvZiB2YWxpZGF0b3JzIHRvIGNvbWJpbmVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSBzaW5nbGUgY29tYmluZWQgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZU9uZU9mKHZhbGlkYXRvcnM6IElWYWxpZGF0b3JGbltdKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBsZXQgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc0RlZmluZWQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgbGV0IGFycmF5T2ZFcnJvcnMgPVxuICAgICAgICBfZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMpO1xuICAgICAgbGV0IHZhbGlkQ29udHJvbHMgPVxuICAgICAgICB2YWxpZGF0b3JzLmxlbmd0aCAtIGFycmF5T2ZFcnJvcnMuZmlsdGVyKGlzRGVmaW5lZCkubGVuZ3RoO1xuICAgICAgbGV0IGlzVmFsaWQgPSB2YWxpZENvbnRyb2xzID09PSAxO1xuICAgICAgaWYgKHhvcihpc1ZhbGlkLCBpbnZlcnQpKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBsZXQgYXJyYXlPZlZhbGlkcyA9XG4gICAgICAgIF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycywgaW52ZXJ0KTtcbiAgICAgIHJldHVybiBfbWVyZ2VPYmplY3RzKC4uLmFycmF5T2ZFcnJvcnMsIC4uLmFycmF5T2ZWYWxpZHMsIHsgJ29uZU9mJzogIWludmVydCB9KTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqICdjb21wb3NlQWxsT2YnIHZhbGlkYXRvciBjb21iaW5hdGlvbiBmdW5jdGlvblxuICAgKlxuICAgKiBBY2NlcHRzIGFuIGFycmF5IG9mIHZhbGlkYXRvcnMgYW5kIHJldHVybnMgYSBzaW5nbGUgdmFsaWRhdG9yIHRoYXRcbiAgICogZXZhbHVhdGVzIHRvIHZhbGlkIG9ubHkgaWYgYWxsIHRoZSBzdWJtaXR0ZWQgdmFsaWRhdG9ycyBhcmUgaW5kaXZpZHVhbGx5XG4gICAqIHZhbGlkLiBPdGhlcndpc2UgaXQgcmV0dXJucyBjb21iaW5lZCBlcnJvcnMgZnJvbSBhbGwgaW52YWxpZCB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiAvLyB7SVZhbGlkYXRvckZuW119IHZhbGlkYXRvcnMgLSBhcnJheSBvZiB2YWxpZGF0b3JzIHRvIGNvbWJpbmVcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSBzaW5nbGUgY29tYmluZWQgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZUFsbE9mKHZhbGlkYXRvcnM6IElWYWxpZGF0b3JGbltdKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBsZXQgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc0RlZmluZWQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgbGV0IGNvbWJpbmVkRXJyb3JzID0gX21lcmdlRXJyb3JzKFxuICAgICAgICBfZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMsIGludmVydClcbiAgICAgICk7XG4gICAgICBsZXQgaXNWYWxpZCA9IGNvbWJpbmVkRXJyb3JzID09PSBudWxsO1xuICAgICAgcmV0dXJuICh4b3IoaXNWYWxpZCwgaW52ZXJ0KSkgP1xuICAgICAgICBudWxsIDogX21lcmdlT2JqZWN0cyhjb21iaW5lZEVycm9ycywgeyAnYWxsT2YnOiAhaW52ZXJ0IH0pO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogJ2NvbXBvc2VOb3QnIHZhbGlkYXRvciBpbnZlcnNpb24gZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb24gYW5kIGludmVydHMgaXRzIHJlc3VsdC5cbiAgICogUmV0dXJucyB2YWxpZCBpZiB0aGUgc3VibWl0dGVkIHZhbGlkYXRvciBpcyBpbnZhbGlkLCBhbmRcbiAgICogcmV0dXJucyBpbnZhbGlkIGlmIHRoZSBzdWJtaXR0ZWQgdmFsaWRhdG9yIGlzIHZhbGlkLlxuICAgKiAoTm90ZTogdGhpcyBmdW5jdGlvbiBjYW4gaXRzZWxmIGJlIGludmVydGVkXG4gICAqICAgLSBlLmcuIGNvbXBvc2VOb3QoY29tcG9zZU5vdCh2YWxpZGF0b3IpKSAtXG4gICAqICAgYnV0IHRoaXMgY2FuIGJlIGNvbmZ1c2luZyBhbmQgaXMgdGhlcmVmb3JlIG5vdCByZWNvbW1lbmRlZC4pXG4gICAqXG4gICAqIC8vIHtJVmFsaWRhdG9yRm5bXX0gdmFsaWRhdG9ycyAtIHZhbGlkYXRvcihzKSB0byBpbnZlcnRcbiAgICogLy8ge0lWYWxpZGF0b3JGbn0gLSBuZXcgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBvcHBvc2l0ZSByZXN1bHRcbiAgICovXG4gIHN0YXRpYyBjb21wb3NlTm90KHZhbGlkYXRvcjogSVZhbGlkYXRvckZuKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcikgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbnZlcnQgPSBmYWxzZSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgbGV0IGVycm9yID0gdmFsaWRhdG9yKGNvbnRyb2wsICFpbnZlcnQpO1xuICAgICAgbGV0IGlzVmFsaWQgPSBlcnJvciA9PT0gbnVsbDtcbiAgICAgIHJldHVybiAoeG9yKGlzVmFsaWQsIGludmVydCkpID9cbiAgICAgICAgbnVsbCA6IF9tZXJnZU9iamVjdHMoZXJyb3IsIHsgJ25vdCc6ICFpbnZlcnQgfSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnY29tcG9zZScgdmFsaWRhdG9yIGNvbWJpbmF0aW9uIGZ1bmN0aW9uXG4gICAqXG4gICAqIC8vIHtJVmFsaWRhdG9yRm5bXX0gdmFsaWRhdG9ycyAtIGFycmF5IG9mIHZhbGlkYXRvcnMgdG8gY29tYmluZVxuICAgKiAvLyB7SVZhbGlkYXRvckZufSAtIHNpbmdsZSBjb21iaW5lZCB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICovXG4gIHN0YXRpYyBjb21wb3NlKHZhbGlkYXRvcnM6IElWYWxpZGF0b3JGbltdKTogSVZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBsZXQgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc0RlZmluZWQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW52ZXJ0ID0gZmFsc2UpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT5cbiAgICAgIF9tZXJnZUVycm9ycyhfZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMsIGludmVydCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiAnY29tcG9zZUFzeW5jJyBhc3luYyB2YWxpZGF0b3IgY29tYmluYXRpb24gZnVuY3Rpb25cbiAgICpcbiAgICogLy8ge0FzeW5jSVZhbGlkYXRvckZuW119IGFzeW5jIHZhbGlkYXRvcnMgLSBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JzXG4gICAqIC8vIHtBc3luY0lWYWxpZGF0b3JGbn0gLSBzaW5nbGUgY29tYmluZWQgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZUFzeW5jKHZhbGlkYXRvcnM6IEFzeW5jSVZhbGlkYXRvckZuW10pOiBBc3luY0lWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCF2YWxpZGF0b3JzKSB7IHJldHVybiBudWxsOyB9XG4gICAgbGV0IHByZXNlbnRWYWxpZGF0b3JzID0gdmFsaWRhdG9ycy5maWx0ZXIoaXNEZWZpbmVkKTtcbiAgICBpZiAocHJlc2VudFZhbGlkYXRvcnMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID1cbiAgICAgICAgX2V4ZWN1dGVBc3luY1ZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMpLm1hcCh0b09ic2VydmFibGUpO1xuICAgICAgcmV0dXJuIG1hcC5jYWxsKGZvcmtKb2luKG9ic2VydmFibGVzKSwgX21lcmdlRXJyb3JzKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGRpdGlvbmFsIGFuZ3VsYXIgdmFsaWRhdG9ycyAobm90IHVzZWQgYnkgQW5ndWFsciBKU09OIFNjaGVtYSBGb3JtKVxuICAvLyBGcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi9tYXN0ZXIvcGFja2FnZXMvZm9ybXMvc3JjL3ZhbGlkYXRvcnMudHNcblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgY29udHJvbHMgdG8gaGF2ZSBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBhIG51bWJlci5cbiAgICovXG4gIHN0YXRpYyBtaW4obWluOiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gICAgaWYgKCFoYXNWYWx1ZShtaW4pKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgICAgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgICBpZiAoaXNFbXB0eShjb250cm9sLnZhbHVlKSB8fCBpc0VtcHR5KG1pbikpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VGbG9hdChjb250cm9sLnZhbHVlKTtcbiAgICAgIGNvbnN0IGFjdHVhbCA9IGNvbnRyb2wudmFsdWU7XG4gICAgICAvLyBDb250cm9scyB3aXRoIE5hTiB2YWx1ZXMgYWZ0ZXIgcGFyc2luZyBzaG91bGQgYmUgdHJlYXRlZCBhcyBub3QgaGF2aW5nIGFcbiAgICAgIC8vIG1pbmltdW0sIHBlciB0aGUgSFRNTCBmb3JtcyBzcGVjOiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1pblxuICAgICAgcmV0dXJuIGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA+PSBtaW4gPyBudWxsIDogeyAnbWluJzogeyBtaW4sIGFjdHVhbCB9IH07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyBjb250cm9scyB0byBoYXZlIGEgdmFsdWUgbGVzcyB0aGFuIGEgbnVtYmVyLlxuICAgKi9cbiAgc3RhdGljIG1heChtYXg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICBpZiAoIWhhc1ZhbHVlKG1heCkpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgIGlmIChpc0VtcHR5KGNvbnRyb2wudmFsdWUpIHx8IGlzRW1wdHkobWF4KSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGNvbnRyb2wudmFsdWUpO1xuICAgICAgY29uc3QgYWN0dWFsID0gY29udHJvbC52YWx1ZTtcbiAgICAgIC8vIENvbnRyb2xzIHdpdGggTmFOIHZhbHVlcyBhZnRlciBwYXJzaW5nIHNob3VsZCBiZSB0cmVhdGVkIGFzIG5vdCBoYXZpbmcgYVxuICAgICAgLy8gbWF4aW11bSwgcGVyIHRoZSBIVE1MIGZvcm1zIHNwZWM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWF4XG4gICAgICByZXR1cm4gaXNOYU4odmFsdWUpIHx8IHZhbHVlIDw9IG1heCA/IG51bGwgOiB7ICdtYXgnOiB7IG1heCwgYWN0dWFsIH0gfTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2wgdmFsdWUgdG8gYmUgdHJ1ZS5cbiAgICovXG4gIHN0YXRpYyByZXF1aXJlZFRydWUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICBpZiAoIWNvbnRyb2wpIHsgcmV0dXJuIEpzb25WYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7IH1cbiAgICByZXR1cm4gY29udHJvbC52YWx1ZSA9PT0gdHJ1ZSA/IG51bGwgOiB7ICdyZXF1aXJlZCc6IHRydWUgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCBwZXJmb3JtcyBlbWFpbCB2YWxpZGF0aW9uLlxuICAgKi9cbiAgc3RhdGljIGVtYWlsKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgaWYgKCFjb250cm9sKSB7IHJldHVybiBKc29uVmFsaWRhdG9ycy5udWxsVmFsaWRhdG9yOyB9XG4gICAgY29uc3QgRU1BSUxfUkVHRVhQID1cbiAgICAgIC9eKD89LnsxLDI1NH0kKSg/PS57MSw2NH1AKVstISMkJSYnKisvMC05PT9BLVpeX2BhLXp7fH1+XSsoXFwuWy0hIyQlJicqKy8wLTk9P0EtWl5fYGEtent8fX5dKykqQFtBLVphLXowLTldKFtBLVphLXowLTktXXswLDYxfVtBLVphLXowLTldKT8oXFwuW0EtWmEtejAtOV0oW0EtWmEtejAtOS1dezAsNjF9W0EtWmEtejAtOV0pPykqJC87XG4gICAgcmV0dXJuIEVNQUlMX1JFR0VYUC50ZXN0KGNvbnRyb2wudmFsdWUpID8gbnVsbCA6IHsgJ2VtYWlsJzogdHJ1ZSB9O1xuICB9XG59XG4iXX0=