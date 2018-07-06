/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { hasValue, inArray, isArray, isEmpty, isDate, isObject, isDefined, isPrimitive, toJavaScriptType, toSchemaType } from './validator.functions';
import { forEach, hasOwn } from './utility.functions';
import { JsonPointer } from './jsonpointer.functions';
import { JsonValidators } from './json.validators';
import { getControlValidators, removeRecursiveReferences } from './json-schema.functions';
/**
 * 'buildFormGroupTemplate' function
 *
 * Builds a template for an Angular FormGroup from a JSON Schema.
 *
 * TODO: add support for pattern properties
 * https://spacetelescope.github.io/understanding-json-schema/reference/object.html
 *
 * //  {any} jsf -
 * //  {any = null} nodeValue -
 * //  {boolean = true} mapArrays -
 * //  {string = ''} schemaPointer -
 * //  {string = ''} dataPointer -
 * //  {any = ''} templatePointer -
 * // {any} -
 * @param {?} jsf
 * @param {?=} nodeValue
 * @param {?=} setValues
 * @param {?=} schemaPointer
 * @param {?=} dataPointer
 * @param {?=} templatePointer
 * @return {?}
 */
export function buildFormGroupTemplate(jsf, nodeValue, setValues, schemaPointer, dataPointer, templatePointer) {
    if (nodeValue === void 0) { nodeValue = null; }
    if (setValues === void 0) { setValues = true; }
    if (schemaPointer === void 0) { schemaPointer = ''; }
    if (dataPointer === void 0) { dataPointer = ''; }
    if (templatePointer === void 0) { templatePointer = ''; }
    /** @type {?} */
    var schema = JsonPointer.get(jsf.schema, schemaPointer);
    if (setValues) {
        if (!isDefined(nodeValue) && (jsf.formOptions.setSchemaDefaults === true ||
            (jsf.formOptions.setSchemaDefaults === 'auto' && isEmpty(jsf.formValues)))) {
            nodeValue = JsonPointer.get(jsf.schema, schemaPointer + '/default');
        }
    }
    else {
        nodeValue = null;
    }
    /** @type {?} */
    var schemaType = JsonPointer.get(schema, '/type');
    /** @type {?} */
    var controlType = (hasOwn(schema, 'properties') || hasOwn(schema, 'additionalProperties')) &&
        schemaType === 'object' ? 'FormGroup' :
        (hasOwn(schema, 'items') || hasOwn(schema, 'additionalItems')) &&
            schemaType === 'array' ? 'FormArray' :
            !schemaType && hasOwn(schema, '$ref') ? '$ref' : 'FormControl';
    /** @type {?} */
    var shortDataPointer = removeRecursiveReferences(dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
    if (!jsf.dataMap.has(shortDataPointer)) {
        jsf.dataMap.set(shortDataPointer, new Map());
    }
    /** @type {?} */
    var nodeOptions = jsf.dataMap.get(shortDataPointer);
    if (!nodeOptions.has('schemaType')) {
        nodeOptions.set('schemaPointer', schemaPointer);
        nodeOptions.set('schemaType', schema.type);
        if (schema.format) {
            nodeOptions.set('schemaFormat', schema.format);
            if (!schema.type) {
                nodeOptions.set('schemaType', 'string');
            }
        }
        if (controlType) {
            nodeOptions.set('templatePointer', templatePointer);
            nodeOptions.set('templateType', controlType);
        }
    }
    /** @type {?} */
    var controls;
    /** @type {?} */
    var validators = getControlValidators(schema);
    switch (controlType) {
        case 'FormGroup':
            controls = {};
            if (hasOwn(schema, 'ui:order') || hasOwn(schema, 'properties')) {
                /** @type {?} */
                var propertyKeys_1 = schema['ui:order'] || Object.keys(schema.properties);
                if (propertyKeys_1.includes('*') && !hasOwn(schema.properties, '*')) {
                    /** @type {?} */
                    var unnamedKeys = Object.keys(schema.properties)
                        .filter(function (key) { return !propertyKeys_1.includes(key); });
                    for (var i = propertyKeys_1.length - 1; i >= 0; i--) {
                        if (propertyKeys_1[i] === '*') {
                            propertyKeys_1.splice.apply(propertyKeys_1, tslib_1.__spread([i, 1], unnamedKeys));
                        }
                    }
                }
                propertyKeys_1
                    .filter(function (key) { return hasOwn(schema.properties, key) ||
                    hasOwn(schema, 'additionalProperties'); })
                    .forEach(function (key) { return controls[key] = buildFormGroupTemplate(jsf, JsonPointer.get(nodeValue, [/** @type {?} */ (key)]), setValues, schemaPointer + (hasOwn(schema.properties, key) ?
                    '/properties/' + key : '/additionalProperties'), dataPointer + '/' + key, templatePointer + '/controls/' + key); });
                jsf.formOptions.fieldsRequired = setRequiredFields(schema, controls);
            }
            return { controlType: controlType, controls: controls, validators: validators };
        case 'FormArray':
            controls = [];
            /** @type {?} */
            var minItems = Math.max(schema.minItems || 0, nodeOptions.get('minItems') || 0);
            /** @type {?} */
            var maxItems = Math.min(schema.maxItems || 1000, nodeOptions.get('maxItems') || 1000);
            /** @type {?} */
            var additionalItemsPointer = null;
            if (isArray(schema.items)) {
                /** @type {?} */
                var tupleItems = nodeOptions.get('tupleItems') ||
                    (isArray(schema.items) ? Math.min(schema.items.length, maxItems) : 0);
                for (var i = 0; i < tupleItems; i++) {
                    if (i < minItems) {
                        controls.push(buildFormGroupTemplate(jsf, isArray(nodeValue) ? nodeValue[i] : nodeValue, setValues, schemaPointer + '/items/' + i, dataPointer + '/' + i, templatePointer + '/controls/' + i));
                    }
                    else {
                        /** @type {?} */
                        var schemaRefPointer = removeRecursiveReferences(schemaPointer + '/items/' + i, jsf.schemaRecursiveRefMap);
                        /** @type {?} */
                        var itemRefPointer = removeRecursiveReferences(shortDataPointer + '/' + i, jsf.dataRecursiveRefMap, jsf.arrayMap);
                        /** @type {?} */
                        var itemRecursive = itemRefPointer !== shortDataPointer + '/' + i;
                        if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                            jsf.templateRefLibrary[itemRefPointer] = null;
                            jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + '/controls/' + i);
                        }
                        controls.push(isArray(nodeValue) ?
                            buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaPointer + '/items/' + i, dataPointer + '/' + i, templatePointer + '/controls/' + i) :
                            itemRecursive ?
                                null : _.cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
                // If 'additionalItems' is an object = additional list items (after tuple items)
                if (schema.items.length < maxItems && isObject(schema.additionalItems)) {
                    additionalItemsPointer = schemaPointer + '/additionalItems';
                }
                // If 'items' is an object = list items only (no tuple items)
            }
            else {
                additionalItemsPointer = schemaPointer + '/items';
            }
            if (additionalItemsPointer) {
                /** @type {?} */
                var schemaRefPointer = removeRecursiveReferences(additionalItemsPointer, jsf.schemaRecursiveRefMap);
                /** @type {?} */
                var itemRefPointer = removeRecursiveReferences(shortDataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
                /** @type {?} */
                var itemRecursive = itemRefPointer !== shortDataPointer + '/-';
                if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                    jsf.templateRefLibrary[itemRefPointer] = null;
                    jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + '/controls/-');
                }
                /** @type {?} */
                var itemOptions = nodeOptions;
                if (!itemRecursive || hasOwn(validators, 'required')) {
                    /** @type {?} */
                    var arrayLength = Math.min(Math.max(itemRecursive ? 0 :
                        (itemOptions.get('tupleItems') + itemOptions.get('listItems')) || 0, isArray(nodeValue) ? nodeValue.length : 0), maxItems);
                    for (var i = controls.length; i < arrayLength; i++) {
                        controls.push(isArray(nodeValue) ?
                            buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaRefPointer, dataPointer + '/-', templatePointer + '/controls/-') :
                            itemRecursive ?
                                null : _.cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
            }
            return { controlType: controlType, controls: controls, validators: validators };
        case '$ref':
            /** @type {?} */
            var schemaRef = JsonPointer.compile(schema.$ref);
            /** @type {?} */
            var dataRef = JsonPointer.toDataPointer(schemaRef, schema);
            /** @type {?} */
            var refPointer = removeRecursiveReferences(dataRef, jsf.dataRecursiveRefMap, jsf.arrayMap);
            if (refPointer && !hasOwn(jsf.templateRefLibrary, refPointer)) {
                // Set to null first to prevent recursive reference from causing endless loop
                jsf.templateRefLibrary[refPointer] = null;
                /** @type {?} */
                var newTemplate = buildFormGroupTemplate(jsf, setValues, setValues, schemaRef);
                if (newTemplate) {
                    jsf.templateRefLibrary[refPointer] = newTemplate;
                }
                else {
                    delete jsf.templateRefLibrary[refPointer];
                }
            }
            return null;
        case 'FormControl':
            /** @type {?} */
            var value = {
                value: setValues && isPrimitive(nodeValue) ? nodeValue : null,
                disabled: nodeOptions.get('disabled') || false
            };
            return { controlType: controlType, value: value, validators: validators };
        default:
            return null;
    }
}
/**
 * 'buildFormGroup' function
 *
 * // {any} template -
 * // {AbstractControl}
 * @param {?} template
 * @return {?}
 */
export function buildFormGroup(template) {
    /** @type {?} */
    var validatorFns = [];
    /** @type {?} */
    var validatorFn = null;
    if (hasOwn(template, 'validators')) {
        forEach(template.validators, function (parameters, validator) {
            if (typeof JsonValidators[validator] === 'function') {
                validatorFns.push(JsonValidators[validator].apply(null, parameters));
            }
        });
        if (validatorFns.length &&
            inArray(template.controlType, ['FormGroup', 'FormArray'])) {
            validatorFn = validatorFns.length > 1 ?
                JsonValidators.compose(validatorFns) : validatorFns[0];
        }
    }
    if (hasOwn(template, 'controlType')) {
        switch (template.controlType) {
            case 'FormGroup':
                /** @type {?} */
                var groupControls_1 = {};
                forEach(template.controls, function (controls, key) {
                    /** @type {?} */
                    var newControl = buildFormGroup(controls);
                    if (newControl) {
                        groupControls_1[key] = newControl;
                    }
                });
                return new FormGroup(groupControls_1, validatorFn);
            case 'FormArray':
                return new FormArray(_.filter(_.map(template.controls, function (controls) { return buildFormGroup(controls); })), validatorFn);
            case 'FormControl':
                return new FormControl(template.value, validatorFns);
        }
    }
    return null;
}
/**
 * 'mergeValues' function
 *
 * //  {any[]} ...valuesToMerge - Multiple values to merge
 * // {any} - Merged values
 * @param {...?} valuesToMerge
 * @return {?}
 */
export function mergeValues() {
    var valuesToMerge = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        valuesToMerge[_i] = arguments[_i];
    }
    /** @type {?} */
    var mergedValues = null;
    try {
        for (var valuesToMerge_1 = tslib_1.__values(valuesToMerge), valuesToMerge_1_1 = valuesToMerge_1.next(); !valuesToMerge_1_1.done; valuesToMerge_1_1 = valuesToMerge_1.next()) {
            var currentValue = valuesToMerge_1_1.value;
            if (!isEmpty(currentValue)) {
                if (typeof currentValue === 'object' &&
                    (isEmpty(mergedValues) || typeof mergedValues !== 'object')) {
                    if (isArray(currentValue)) {
                        mergedValues = tslib_1.__spread(currentValue);
                    }
                    else if (isObject(currentValue)) {
                        mergedValues = tslib_1.__assign({}, currentValue);
                    }
                }
                else if (typeof currentValue !== 'object') {
                    mergedValues = currentValue;
                }
                else if (isObject(mergedValues) && isObject(currentValue)) {
                    Object.assign(mergedValues, currentValue);
                }
                else if (isObject(mergedValues) && isArray(currentValue)) {
                    /** @type {?} */
                    var newValues = [];
                    try {
                        for (var currentValue_1 = tslib_1.__values(currentValue), currentValue_1_1 = currentValue_1.next(); !currentValue_1_1.done; currentValue_1_1 = currentValue_1.next()) {
                            var value = currentValue_1_1.value;
                            newValues.push(mergeValues(mergedValues, value));
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (currentValue_1_1 && !currentValue_1_1.done && (_a = currentValue_1.return)) _a.call(currentValue_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    mergedValues = newValues;
                }
                else if (isArray(mergedValues) && isObject(currentValue)) {
                    /** @type {?} */
                    var newValues = [];
                    try {
                        for (var mergedValues_1 = tslib_1.__values(mergedValues), mergedValues_1_1 = mergedValues_1.next(); !mergedValues_1_1.done; mergedValues_1_1 = mergedValues_1.next()) {
                            var value = mergedValues_1_1.value;
                            newValues.push(mergeValues(value, currentValue));
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (mergedValues_1_1 && !mergedValues_1_1.done && (_b = mergedValues_1.return)) _b.call(mergedValues_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    mergedValues = newValues;
                }
                else if (isArray(mergedValues) && isArray(currentValue)) {
                    /** @type {?} */
                    var newValues = [];
                    for (var i = 0; i < Math.max(mergedValues.length, currentValue.length); i++) {
                        if (i < mergedValues.length && i < currentValue.length) {
                            newValues.push(mergeValues(mergedValues[i], currentValue[i]));
                        }
                        else if (i < mergedValues.length) {
                            newValues.push(mergedValues[i]);
                        }
                        else if (i < currentValue.length) {
                            newValues.push(currentValue[i]);
                        }
                    }
                    mergedValues = newValues;
                }
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (valuesToMerge_1_1 && !valuesToMerge_1_1.done && (_c = valuesToMerge_1.return)) _c.call(valuesToMerge_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return mergedValues;
    var e_3, _c, e_1, _a, e_2, _b;
}
/**
 * 'setRequiredFields' function
 *
 * // {schema} schema - JSON Schema
 * // {object} formControlTemplate - Form Control Template object
 * // {boolean} - true if any fields have been set to required, false if not
 * @param {?} schema
 * @param {?} formControlTemplate
 * @return {?}
 */
export function setRequiredFields(schema, formControlTemplate) {
    /** @type {?} */
    var fieldsRequired = false;
    if (hasOwn(schema, 'required') && !isEmpty(schema.required)) {
        fieldsRequired = true;
        /** @type {?} */
        var requiredArray = isArray(schema.required) ? schema.required : [schema.required];
        requiredArray = forEach(requiredArray, function (key) { return JsonPointer.set(formControlTemplate, '/' + key + '/validators/required', []); });
    }
    return fieldsRequired;
    // TODO: Add support for patternProperties
    // https://spacetelescope.github.io/understanding-json-schema/reference/object.html#pattern-properties
}
/**
 * 'formatFormData' function
 *
 * // {any} formData - Angular FormGroup data object
 * // {Map<string, any>} dataMap -
 * // {Map<string, string>} recursiveRefMap -
 * // {Map<string, number>} arrayMap -
 * // {boolean = false} fixErrors - if TRUE, tries to fix data
 * // {any} - formatted data object
 * @param {?} formData
 * @param {?} dataMap
 * @param {?} recursiveRefMap
 * @param {?} arrayMap
 * @param {?=} returnEmptyFields
 * @param {?=} fixErrors
 * @return {?}
 */
export function formatFormData(formData, dataMap, recursiveRefMap, arrayMap, returnEmptyFields, fixErrors) {
    if (returnEmptyFields === void 0) { returnEmptyFields = false; }
    if (fixErrors === void 0) { fixErrors = false; }
    if (formData === null || typeof formData !== 'object') {
        return formData;
    }
    /** @type {?} */
    var formattedData = isArray(formData) ? [] : {};
    JsonPointer.forEachDeep(formData, function (value, dataPointer) {
        // If returnEmptyFields === true,
        // add empty arrays and objects to all allowed keys
        if (returnEmptyFields && isArray(value)) {
            JsonPointer.set(formattedData, dataPointer, []);
        }
        else if (returnEmptyFields && isObject(value) && !isDate(value)) {
            JsonPointer.set(formattedData, dataPointer, {});
        }
        else {
            /** @type {?} */
            var genericPointer_1 = JsonPointer.has(dataMap, [dataPointer, 'schemaType']) ? dataPointer :
                removeRecursiveReferences(dataPointer, recursiveRefMap, arrayMap);
            if (JsonPointer.has(dataMap, [genericPointer_1, 'schemaType'])) {
                /** @type {?} */
                var schemaType = dataMap.get(genericPointer_1).get('schemaType');
                if (schemaType === 'null') {
                    JsonPointer.set(formattedData, dataPointer, null);
                }
                else if ((hasValue(value) || returnEmptyFields) &&
                    inArray(schemaType, ['string', 'integer', 'number', 'boolean'])) {
                    /** @type {?} */
                    var newValue = (fixErrors || (value === null && returnEmptyFields)) ?
                        toSchemaType(value, schemaType) : toJavaScriptType(value, schemaType);
                    if (isDefined(newValue) || returnEmptyFields) {
                        JsonPointer.set(formattedData, dataPointer, newValue);
                    }
                    // If returnEmptyFields === false,
                    // only add empty arrays and objects to required keys
                }
                else if (schemaType === 'object' && !returnEmptyFields) {
                    (dataMap.get(genericPointer_1).get('required') || []).forEach(function (key) {
                        /** @type {?} */
                        var keySchemaType = dataMap.get(genericPointer_1 + "/" + key).get('schemaType');
                        if (keySchemaType === 'array') {
                            JsonPointer.set(formattedData, dataPointer + "/" + key, []);
                        }
                        else if (keySchemaType === 'object') {
                            JsonPointer.set(formattedData, dataPointer + "/" + key, {});
                        }
                    });
                }
                // Finish incomplete 'date-time' entries
                if (dataMap.get(genericPointer_1).get('schemaFormat') === 'date-time') {
                    // "2000-03-14T01:59:26.535" -> "2000-03-14T01:59:26.535Z" (add "Z")
                    if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, value + "Z");
                        // "2000-03-14T01:59" -> "2000-03-14T01:59:00Z" (add ":00Z")
                    }
                    else if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, value + ":00Z");
                        // "2000-03-14" -> "2000-03-14T00:00:00Z" (add "T00:00:00Z")
                    }
                    else if (fixErrors && /^\d\d\d\d-[0-1]\d-[0-3]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, value + ":00:00:00Z");
                    }
                }
            }
            else if (typeof value !== 'object' || isDate(value) ||
                (value === null && returnEmptyFields)) {
                console.error('formatFormData error: ' +
                    ("Schema type not found for form value at " + genericPointer_1));
                console.error('dataMap', dataMap);
                console.error('recursiveRefMap', recursiveRefMap);
                console.error('genericPointer', genericPointer_1);
            }
        }
    });
    return formattedData;
}
/**
 * 'getControl' function
 *
 * Uses a JSON Pointer for a data object to retrieve a control from
 * an Angular formGroup or formGroup template. (Note: though a formGroup
 * template is much simpler, its basic structure is idential to a formGroup).
 *
 * If the optional third parameter 'returnGroup' is set to TRUE, the group
 * containing the control is returned, rather than the control itself.
 *
 * // {FormGroup} formGroup - Angular FormGroup to get value from
 * // {Pointer} dataPointer - JSON Pointer (string or array)
 * // {boolean = false} returnGroup - If true, return group containing control
 * // {group} - Located value (or null, if no control found)
 * @param {?} formGroup
 * @param {?} dataPointer
 * @param {?=} returnGroup
 * @return {?}
 */
export function getControl(formGroup, dataPointer, returnGroup) {
    if (returnGroup === void 0) { returnGroup = false; }
    if (!isObject(formGroup) || !JsonPointer.isJsonPointer(dataPointer)) {
        if (!JsonPointer.isJsonPointer(dataPointer)) {
            // If dataPointer input is not a valid JSON pointer, check to
            // see if it is instead a valid object path, using dot notaion
            if (typeof dataPointer === 'string') {
                /** @type {?} */
                var formControl = formGroup.get(dataPointer);
                if (formControl) {
                    return formControl;
                }
            }
            console.error("getControl error: Invalid JSON Pointer: " + dataPointer);
        }
        if (!isObject(formGroup)) {
            console.error("getControl error: Invalid formGroup: " + formGroup);
        }
        return null;
    }
    /** @type {?} */
    var dataPointerArray = JsonPointer.parse(dataPointer);
    if (returnGroup) {
        dataPointerArray = dataPointerArray.slice(0, -1);
    }
    // If formGroup input is a real formGroup (not a formGroup template)
    // try using formGroup.get() to return the control
    if (typeof formGroup.get === 'function' &&
        dataPointerArray.every(function (key) { return key.indexOf('.') === -1; })) {
        /** @type {?} */
        var formControl = formGroup.get(dataPointerArray.join('.'));
        if (formControl) {
            return formControl;
        }
    }
    /** @type {?} */
    var subGroup = formGroup;
    try {
        for (var dataPointerArray_1 = tslib_1.__values(dataPointerArray), dataPointerArray_1_1 = dataPointerArray_1.next(); !dataPointerArray_1_1.done; dataPointerArray_1_1 = dataPointerArray_1.next()) {
            var key = dataPointerArray_1_1.value;
            if (hasOwn(subGroup, 'controls')) {
                subGroup = subGroup.controls;
            }
            if (isArray(subGroup) && (key === '-')) {
                subGroup = subGroup[subGroup.length - 1];
            }
            else if (hasOwn(subGroup, key)) {
                subGroup = subGroup[key];
            }
            else {
                console.error("getControl error: Unable to find \"" + key + "\" item in FormGroup.");
                console.error(dataPointer);
                console.error(formGroup);
                return;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (dataPointerArray_1_1 && !dataPointerArray_1_1.done && (_a = dataPointerArray_1.return)) _a.call(dataPointerArray_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return subGroup;
    var e_4, _a;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1ncm91cC5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9mb3JtLWdyb3VwLmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDWSxTQUFTLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFDbkQsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUU1QixPQUFPLEVBQ0wsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFDN0UsZ0JBQWdCLEVBQUUsWUFBWSxFQUMvQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFXLFdBQVcsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQ1Msb0JBQW9CLEVBQWdCLHlCQUF5QixFQUM1RSxNQUFNLHlCQUF5QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ2pDLE1BQU0saUNBQ0osR0FBUSxFQUFFLFNBQXFCLEVBQUUsU0FBZ0IsRUFDakQsYUFBa0IsRUFBRSxXQUFnQixFQUFFLGVBQW9CO0lBRGhELDBCQUFBLEVBQUEsZ0JBQXFCO0lBQUUsMEJBQUEsRUFBQSxnQkFBZ0I7SUFDakQsOEJBQUEsRUFBQSxrQkFBa0I7SUFBRSw0QkFBQSxFQUFBLGdCQUFnQjtJQUFFLGdDQUFBLEVBQUEsb0JBQW9COztJQUUxRCxJQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDMUQsRUFB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Q3pCLE1BQU0sQ0FBQzthQUNSO1NBQ0Y7Ozs7Ozs7OztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7O0NBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWJzdHJhY3RDb250cm9sLCBGb3JtQXJyYXksIEZvcm1Db250cm9sLCBGb3JtR3JvdXAsIFZhbGlkYXRvckZuXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQge1xuICBoYXNWYWx1ZSwgaW5BcnJheSwgaXNBcnJheSwgaXNFbXB0eSwgaXNEYXRlLCBpc09iamVjdCwgaXNEZWZpbmVkLCBpc1ByaW1pdGl2ZSxcbiAgdG9KYXZhU2NyaXB0VHlwZSwgdG9TY2hlbWFUeXBlLCBTY2hlbWFQcmltaXRpdmVUeXBlXG59IGZyb20gJy4vdmFsaWRhdG9yLmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBmb3JFYWNoLCBoYXNPd24gfSBmcm9tICcuL3V0aWxpdHkuZnVuY3Rpb25zJztcbmltcG9ydCB7IFBvaW50ZXIsIEpzb25Qb2ludGVyIH0gZnJvbSAnLi9qc29ucG9pbnRlci5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgSnNvblZhbGlkYXRvcnMgfSBmcm9tICcuL2pzb24udmFsaWRhdG9ycyc7XG5pbXBvcnQge1xuICBjb21iaW5lQWxsT2YsIGdldENvbnRyb2xWYWxpZGF0b3JzLCBnZXRTdWJTY2hlbWEsIHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXNcbn0gZnJvbSAnLi9qc29uLXNjaGVtYS5mdW5jdGlvbnMnO1xuXG4vKipcbiAqIEZvcm1Hcm91cCBmdW5jdGlvbiBsaWJyYXJ5OlxuICpcbiAqIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGU6ICBCdWlsZHMgYSBGb3JtR3JvdXBUZW1wbGF0ZSBmcm9tIHNjaGVtYVxuICpcbiAqIGJ1aWxkRm9ybUdyb3VwOiAgICAgICAgICBCdWlsZHMgYW4gQW5ndWxhciBGb3JtR3JvdXAgZnJvbSBhIEZvcm1Hcm91cFRlbXBsYXRlXG4gKlxuICogbWVyZ2VWYWx1ZXM6XG4gKlxuICogc2V0UmVxdWlyZWRGaWVsZHM6XG4gKlxuICogZm9ybWF0Rm9ybURhdGE6XG4gKlxuICogZ2V0Q29udHJvbDpcbiAqXG4gKiAtLS0tIFRPRE86IC0tLS1cbiAqIFRPRE86IGFkZCBidWlsZEZvcm1Hcm91cFRlbXBsYXRlRnJvbUxheW91dCBmdW5jdGlvblxuICogYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZUZyb21MYXlvdXQ6IEJ1aWxkcyBhIEZvcm1Hcm91cFRlbXBsYXRlIGZyb20gYSBmb3JtIGxheW91dFxuICovXG5cbi8qKlxuICogJ2J1aWxkRm9ybUdyb3VwVGVtcGxhdGUnIGZ1bmN0aW9uXG4gKlxuICogQnVpbGRzIGEgdGVtcGxhdGUgZm9yIGFuIEFuZ3VsYXIgRm9ybUdyb3VwIGZyb20gYSBKU09OIFNjaGVtYS5cbiAqXG4gKiBUT0RPOiBhZGQgc3VwcG9ydCBmb3IgcGF0dGVybiBwcm9wZXJ0aWVzXG4gKiBodHRwczovL3NwYWNldGVsZXNjb3BlLmdpdGh1Yi5pby91bmRlcnN0YW5kaW5nLWpzb24tc2NoZW1hL3JlZmVyZW5jZS9vYmplY3QuaHRtbFxuICpcbiAqIC8vICB7YW55fSBqc2YgLVxuICogLy8gIHthbnkgPSBudWxsfSBub2RlVmFsdWUgLVxuICogLy8gIHtib29sZWFuID0gdHJ1ZX0gbWFwQXJyYXlzIC1cbiAqIC8vICB7c3RyaW5nID0gJyd9IHNjaGVtYVBvaW50ZXIgLVxuICogLy8gIHtzdHJpbmcgPSAnJ30gZGF0YVBvaW50ZXIgLVxuICogLy8gIHthbnkgPSAnJ30gdGVtcGxhdGVQb2ludGVyIC1cbiAqIC8vIHthbnl9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gIGpzZjogYW55LCBub2RlVmFsdWU6IGFueSA9IG51bGwsIHNldFZhbHVlcyA9IHRydWUsXG4gIHNjaGVtYVBvaW50ZXIgPSAnJywgZGF0YVBvaW50ZXIgPSAnJywgdGVtcGxhdGVQb2ludGVyID0gJydcbikge1xuICBjb25zdCBzY2hlbWEgPSBKc29uUG9pbnRlci5nZXQoanNmLnNjaGVtYSwgc2NoZW1hUG9pbnRlcik7XG4gIGlmIChzZXRWYWx1ZXMpIHtcbiAgICBpZiAoIWlzRGVmaW5lZChub2RlVmFsdWUpICYmIChcbiAgICAgIGpzZi5mb3JtT3B0aW9ucy5zZXRTY2hlbWFEZWZhdWx0cyA9PT0gdHJ1ZSB8fFxuICAgICAgKGpzZi5mb3JtT3B0aW9ucy5zZXRTY2hlbWFEZWZhdWx0cyA9PT0gJ2F1dG8nICYmIGlzRW1wdHkoanNmLmZvcm1WYWx1ZXMpKVxuICAgICkpIHtcbiAgICAgIG5vZGVWYWx1ZSA9IEpzb25Qb2ludGVyLmdldChqc2Yuc2NoZW1hLCBzY2hlbWFQb2ludGVyICsgJy9kZWZhdWx0Jyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG5vZGVWYWx1ZSA9IG51bGw7XG4gIH1cbiAgLy8gVE9ETzogSWYgbm9kZVZhbHVlIHN0aWxsIG5vdCBzZXQsIGNoZWNrIGxheW91dCBmb3IgZGVmYXVsdCB2YWx1ZVxuICBjb25zdCBzY2hlbWFUeXBlOiBzdHJpbmcgfCBzdHJpbmdbXSA9IEpzb25Qb2ludGVyLmdldChzY2hlbWEsICcvdHlwZScpO1xuICBsZXQgY29udHJvbFR5cGUgPVxuICAgIChoYXNPd24oc2NoZW1hLCAncHJvcGVydGllcycpIHx8IGhhc093bihzY2hlbWEsICdhZGRpdGlvbmFsUHJvcGVydGllcycpKSAmJlxuICAgICAgc2NoZW1hVHlwZSA9PT0gJ29iamVjdCcgPyAnRm9ybUdyb3VwJyA6XG4gICAgKGhhc093bihzY2hlbWEsICdpdGVtcycpIHx8IGhhc093bihzY2hlbWEsICdhZGRpdGlvbmFsSXRlbXMnKSkgJiZcbiAgICAgIHNjaGVtYVR5cGUgPT09ICdhcnJheScgPyAnRm9ybUFycmF5JyA6XG4gICAgIXNjaGVtYVR5cGUgJiYgaGFzT3duKHNjaGVtYSwgJyRyZWYnKSA/ICckcmVmJyA6ICdGb3JtQ29udHJvbCc7XG4gIGNvbnN0IHNob3J0RGF0YVBvaW50ZXIgPVxuICAgIHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoZGF0YVBvaW50ZXIsIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLCBqc2YuYXJyYXlNYXApO1xuICBpZiAoIWpzZi5kYXRhTWFwLmhhcyhzaG9ydERhdGFQb2ludGVyKSkge1xuICAgIGpzZi5kYXRhTWFwLnNldChzaG9ydERhdGFQb2ludGVyLCBuZXcgTWFwKCkpO1xuICB9XG4gIGNvbnN0IG5vZGVPcHRpb25zID0ganNmLmRhdGFNYXAuZ2V0KHNob3J0RGF0YVBvaW50ZXIpO1xuICBpZiAoIW5vZGVPcHRpb25zLmhhcygnc2NoZW1hVHlwZScpKSB7XG4gICAgbm9kZU9wdGlvbnMuc2V0KCdzY2hlbWFQb2ludGVyJywgc2NoZW1hUG9pbnRlcik7XG4gICAgbm9kZU9wdGlvbnMuc2V0KCdzY2hlbWFUeXBlJywgc2NoZW1hLnR5cGUpO1xuICAgIGlmIChzY2hlbWEuZm9ybWF0KSB7XG4gICAgICBub2RlT3B0aW9ucy5zZXQoJ3NjaGVtYUZvcm1hdCcsIHNjaGVtYS5mb3JtYXQpO1xuICAgICAgaWYgKCFzY2hlbWEudHlwZSkgeyBub2RlT3B0aW9ucy5zZXQoJ3NjaGVtYVR5cGUnLCAnc3RyaW5nJyk7IH1cbiAgICB9XG4gICAgaWYgKGNvbnRyb2xUeXBlKSB7XG4gICAgICBub2RlT3B0aW9ucy5zZXQoJ3RlbXBsYXRlUG9pbnRlcicsIHRlbXBsYXRlUG9pbnRlcik7XG4gICAgICBub2RlT3B0aW9ucy5zZXQoJ3RlbXBsYXRlVHlwZScsIGNvbnRyb2xUeXBlKTtcbiAgICB9XG4gIH1cbiAgbGV0IGNvbnRyb2xzOiBhbnk7XG4gIGxldCB2YWxpZGF0b3JzID0gZ2V0Q29udHJvbFZhbGlkYXRvcnMoc2NoZW1hKTtcbiAgc3dpdGNoIChjb250cm9sVHlwZSkge1xuXG4gICAgY2FzZSAnRm9ybUdyb3VwJzpcbiAgICAgIGNvbnRyb2xzID0ge307XG4gICAgICBpZiAoaGFzT3duKHNjaGVtYSwgJ3VpOm9yZGVyJykgfHwgaGFzT3duKHNjaGVtYSwgJ3Byb3BlcnRpZXMnKSkge1xuICAgICAgICBsZXQgcHJvcGVydHlLZXlzID0gc2NoZW1hWyd1aTpvcmRlciddIHx8IE9iamVjdC5rZXlzKHNjaGVtYS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgaWYgKHByb3BlcnR5S2V5cy5pbmNsdWRlcygnKicpICYmICFoYXNPd24oc2NoZW1hLnByb3BlcnRpZXMsICcqJykpIHtcbiAgICAgICAgICBjb25zdCB1bm5hbWVkS2V5cyA9IE9iamVjdC5rZXlzKHNjaGVtYS5wcm9wZXJ0aWVzKVxuICAgICAgICAgICAgLmZpbHRlcihrZXkgPT4gIXByb3BlcnR5S2V5cy5pbmNsdWRlcyhrZXkpKTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gcHJvcGVydHlLZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHlLZXlzW2ldID09PSAnKicpIHtcbiAgICAgICAgICAgICAgcHJvcGVydHlLZXlzLnNwbGljZShpLCAxLCAuLi51bm5hbWVkS2V5cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb3BlcnR5S2V5c1xuICAgICAgICAgIC5maWx0ZXIoa2V5ID0+IGhhc093bihzY2hlbWEucHJvcGVydGllcywga2V5KSB8fFxuICAgICAgICAgICAgaGFzT3duKHNjaGVtYSwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJylcbiAgICAgICAgICApXG4gICAgICAgICAgLmZvckVhY2goa2V5ID0+IGNvbnRyb2xzW2tleV0gPSBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICAgICAgICAgICAganNmLCBKc29uUG9pbnRlci5nZXQobm9kZVZhbHVlLCBbPHN0cmluZz5rZXldKSwgc2V0VmFsdWVzLFxuICAgICAgICAgICAgc2NoZW1hUG9pbnRlciArIChoYXNPd24oc2NoZW1hLnByb3BlcnRpZXMsIGtleSkgP1xuICAgICAgICAgICAgICAnL3Byb3BlcnRpZXMvJyArIGtleSA6ICcvYWRkaXRpb25hbFByb3BlcnRpZXMnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgZGF0YVBvaW50ZXIgKyAnLycgKyBrZXksXG4gICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyAnL2NvbnRyb2xzLycgKyBrZXlcbiAgICAgICAgICApKTtcbiAgICAgICAganNmLmZvcm1PcHRpb25zLmZpZWxkc1JlcXVpcmVkID0gc2V0UmVxdWlyZWRGaWVsZHMoc2NoZW1hLCBjb250cm9scyk7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBjb250cm9sVHlwZSwgY29udHJvbHMsIHZhbGlkYXRvcnMgfTtcblxuICAgIGNhc2UgJ0Zvcm1BcnJheSc6XG4gICAgICBjb250cm9scyA9IFtdO1xuICAgICAgY29uc3QgbWluSXRlbXMgPVxuICAgICAgICBNYXRoLm1heChzY2hlbWEubWluSXRlbXMgfHwgMCwgbm9kZU9wdGlvbnMuZ2V0KCdtaW5JdGVtcycpIHx8IDApO1xuICAgICAgY29uc3QgbWF4SXRlbXMgPVxuICAgICAgICBNYXRoLm1pbihzY2hlbWEubWF4SXRlbXMgfHwgMTAwMCwgbm9kZU9wdGlvbnMuZ2V0KCdtYXhJdGVtcycpIHx8IDEwMDApO1xuICAgICAgbGV0IGFkZGl0aW9uYWxJdGVtc1BvaW50ZXI6IHN0cmluZyA9IG51bGw7XG4gICAgICBpZiAoaXNBcnJheShzY2hlbWEuaXRlbXMpKSB7IC8vICdpdGVtcycgaXMgYW4gYXJyYXkgPSB0dXBsZSBpdGVtc1xuICAgICAgICBjb25zdCB0dXBsZUl0ZW1zID0gbm9kZU9wdGlvbnMuZ2V0KCd0dXBsZUl0ZW1zJykgfHxcbiAgICAgICAgICAoaXNBcnJheShzY2hlbWEuaXRlbXMpID8gTWF0aC5taW4oc2NoZW1hLml0ZW1zLmxlbmd0aCwgbWF4SXRlbXMpIDogMCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHVwbGVJdGVtczsgaSsrKSB7XG4gICAgICAgICAgaWYgKGkgPCBtaW5JdGVtcykge1xuICAgICAgICAgICAgY29udHJvbHMucHVzaChidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICAgICAgICAgICAgICBqc2YsIGlzQXJyYXkobm9kZVZhbHVlKSA/IG5vZGVWYWx1ZVtpXSA6IG5vZGVWYWx1ZSwgc2V0VmFsdWVzLFxuICAgICAgICAgICAgICBzY2hlbWFQb2ludGVyICsgJy9pdGVtcy8nICsgaSxcbiAgICAgICAgICAgICAgZGF0YVBvaW50ZXIgKyAnLycgKyBpLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyAnL2NvbnRyb2xzLycgKyBpXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc2NoZW1hUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgICAgIHNjaGVtYVBvaW50ZXIgKyAnL2l0ZW1zLycgKyBpLCBqc2Yuc2NoZW1hUmVjdXJzaXZlUmVmTWFwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgaXRlbVJlZlBvaW50ZXIgPSByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICAgICAgICAgICAgICBzaG9ydERhdGFQb2ludGVyICsgJy8nICsgaSwganNmLmRhdGFSZWN1cnNpdmVSZWZNYXAsIGpzZi5hcnJheU1hcFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1SZWN1cnNpdmUgPSBpdGVtUmVmUG9pbnRlciAhPT0gc2hvcnREYXRhUG9pbnRlciArICcvJyArIGk7XG4gICAgICAgICAgICBpZiAoIWhhc093bihqc2YudGVtcGxhdGVSZWZMaWJyYXJ5LCBpdGVtUmVmUG9pbnRlcikpIHtcbiAgICAgICAgICAgICAganNmLnRlbXBsYXRlUmVmTGlicmFyeVtpdGVtUmVmUG9pbnRlcl0gPSBudWxsO1xuICAgICAgICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICAgICAganNmLCBudWxsLCBzZXRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgc2NoZW1hUmVmUG9pbnRlcixcbiAgICAgICAgICAgICAgICBpdGVtUmVmUG9pbnRlcixcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyAnL2NvbnRyb2xzLycgKyBpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250cm9scy5wdXNoKFxuICAgICAgICAgICAgICBpc0FycmF5KG5vZGVWYWx1ZSkgP1xuICAgICAgICAgICAgICAgIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICAgICAgICBqc2YsIG5vZGVWYWx1ZVtpXSwgc2V0VmFsdWVzLFxuICAgICAgICAgICAgICAgICAgc2NoZW1hUG9pbnRlciArICcvaXRlbXMvJyArIGksXG4gICAgICAgICAgICAgICAgICBkYXRhUG9pbnRlciArICcvJyArIGksXG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyAnL2NvbnRyb2xzLycgKyBpXG4gICAgICAgICAgICAgICAgKSA6XG4gICAgICAgICAgICAgIGl0ZW1SZWN1cnNpdmUgP1xuICAgICAgICAgICAgICAgIG51bGwgOiBfLmNsb25lRGVlcChqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgJ2FkZGl0aW9uYWxJdGVtcycgaXMgYW4gb2JqZWN0ID0gYWRkaXRpb25hbCBsaXN0IGl0ZW1zIChhZnRlciB0dXBsZSBpdGVtcylcbiAgICAgICAgaWYgKHNjaGVtYS5pdGVtcy5sZW5ndGggPCBtYXhJdGVtcyAmJiBpc09iamVjdChzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKSkge1xuICAgICAgICAgIGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIgPSBzY2hlbWFQb2ludGVyICsgJy9hZGRpdGlvbmFsSXRlbXMnO1xuICAgICAgICB9XG5cbiAgICAgIC8vIElmICdpdGVtcycgaXMgYW4gb2JqZWN0ID0gbGlzdCBpdGVtcyBvbmx5IChubyB0dXBsZSBpdGVtcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIgPSBzY2hlbWFQb2ludGVyICsgJy9pdGVtcyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChhZGRpdGlvbmFsSXRlbXNQb2ludGVyKSB7XG4gICAgICAgIGNvbnN0IHNjaGVtYVJlZlBvaW50ZXIgPSByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICAgICAgICAgIGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIsIGpzZi5zY2hlbWFSZWN1cnNpdmVSZWZNYXBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgaXRlbVJlZlBvaW50ZXIgPSByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICAgICAgICAgIHNob3J0RGF0YVBvaW50ZXIgKyAnLy0nLCBqc2YuZGF0YVJlY3Vyc2l2ZVJlZk1hcCwganNmLmFycmF5TWFwXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGl0ZW1SZWN1cnNpdmUgPSBpdGVtUmVmUG9pbnRlciAhPT0gc2hvcnREYXRhUG9pbnRlciArICcvLSc7XG4gICAgICAgIGlmICghaGFzT3duKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnksIGl0ZW1SZWZQb2ludGVyKSkge1xuICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdID0gbnVsbDtcbiAgICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICBqc2YsIG51bGwsIHNldFZhbHVlcyxcbiAgICAgICAgICAgIHNjaGVtYVJlZlBvaW50ZXIsXG4gICAgICAgICAgICBpdGVtUmVmUG9pbnRlcixcbiAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArICcvY29udHJvbHMvLSdcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnN0IGl0ZW1PcHRpb25zID0ganNmLmRhdGFNYXAuZ2V0KGl0ZW1SZWZQb2ludGVyKSB8fCBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IGl0ZW1PcHRpb25zID0gbm9kZU9wdGlvbnM7XG4gICAgICAgIGlmICghaXRlbVJlY3Vyc2l2ZSB8fCBoYXNPd24odmFsaWRhdG9ycywgJ3JlcXVpcmVkJykpIHtcbiAgICAgICAgICBjb25zdCBhcnJheUxlbmd0aCA9IE1hdGgubWluKE1hdGgubWF4KFxuICAgICAgICAgICAgaXRlbVJlY3Vyc2l2ZSA/IDAgOlxuICAgICAgICAgICAgICAoaXRlbU9wdGlvbnMuZ2V0KCd0dXBsZUl0ZW1zJykgKyBpdGVtT3B0aW9ucy5nZXQoJ2xpc3RJdGVtcycpKSB8fCAwLFxuICAgICAgICAgICAgaXNBcnJheShub2RlVmFsdWUpID8gbm9kZVZhbHVlLmxlbmd0aCA6IDBcbiAgICAgICAgICApLCBtYXhJdGVtcyk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IGNvbnRyb2xzLmxlbmd0aDsgaSA8IGFycmF5TGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRyb2xzLnB1c2goXG4gICAgICAgICAgICAgIGlzQXJyYXkobm9kZVZhbHVlKSA/XG4gICAgICAgICAgICAgICAgYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICAgIGpzZiwgbm9kZVZhbHVlW2ldLCBzZXRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgICBzY2hlbWFSZWZQb2ludGVyLFxuICAgICAgICAgICAgICAgICAgZGF0YVBvaW50ZXIgKyAnLy0nLFxuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgJy9jb250cm9scy8tJ1xuICAgICAgICAgICAgICAgICkgOlxuICAgICAgICAgICAgICAgIGl0ZW1SZWN1cnNpdmUgP1xuICAgICAgICAgICAgICAgICAgbnVsbCA6IF8uY2xvbmVEZWVwKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGNvbnRyb2xUeXBlLCBjb250cm9scywgdmFsaWRhdG9ycyB9O1xuXG4gICAgY2FzZSAnJHJlZic6XG4gICAgICBjb25zdCBzY2hlbWFSZWYgPSBKc29uUG9pbnRlci5jb21waWxlKHNjaGVtYS4kcmVmKTtcbiAgICAgIGNvbnN0IGRhdGFSZWYgPSBKc29uUG9pbnRlci50b0RhdGFQb2ludGVyKHNjaGVtYVJlZiwgc2NoZW1hKTtcbiAgICAgIGNvbnN0IHJlZlBvaW50ZXIgPSByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICAgICAgICBkYXRhUmVmLCBqc2YuZGF0YVJlY3Vyc2l2ZVJlZk1hcCwganNmLmFycmF5TWFwXG4gICAgICApO1xuICAgICAgaWYgKHJlZlBvaW50ZXIgJiYgIWhhc093bihqc2YudGVtcGxhdGVSZWZMaWJyYXJ5LCByZWZQb2ludGVyKSkge1xuICAgICAgICAvLyBTZXQgdG8gbnVsbCBmaXJzdCB0byBwcmV2ZW50IHJlY3Vyc2l2ZSByZWZlcmVuY2UgZnJvbSBjYXVzaW5nIGVuZGxlc3MgbG9vcFxuICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W3JlZlBvaW50ZXJdID0gbnVsbDtcbiAgICAgICAgY29uc3QgbmV3VGVtcGxhdGUgPSBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKGpzZiwgc2V0VmFsdWVzLCBzZXRWYWx1ZXMsIHNjaGVtYVJlZik7XG4gICAgICAgIGlmIChuZXdUZW1wbGF0ZSkge1xuICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbcmVmUG9pbnRlcl0gPSBuZXdUZW1wbGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUganNmLnRlbXBsYXRlUmVmTGlicmFyeVtyZWZQb2ludGVyXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBjYXNlICdGb3JtQ29udHJvbCc6XG4gICAgICBjb25zdCB2YWx1ZSA9IHtcbiAgICAgICAgdmFsdWU6IHNldFZhbHVlcyAmJiBpc1ByaW1pdGl2ZShub2RlVmFsdWUpID8gbm9kZVZhbHVlIDogbnVsbCxcbiAgICAgICAgZGlzYWJsZWQ6IG5vZGVPcHRpb25zLmdldCgnZGlzYWJsZWQnKSB8fCBmYWxzZVxuICAgICAgfTtcbiAgICAgIHJldHVybiB7IGNvbnRyb2xUeXBlLCB2YWx1ZSwgdmFsaWRhdG9ycyB9O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogJ2J1aWxkRm9ybUdyb3VwJyBmdW5jdGlvblxuICpcbiAqIC8vIHthbnl9IHRlbXBsYXRlIC1cbiAqIC8vIHtBYnN0cmFjdENvbnRyb2x9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybUdyb3VwKHRlbXBsYXRlOiBhbnkpOiBBYnN0cmFjdENvbnRyb2wge1xuICBsZXQgdmFsaWRhdG9yRm5zOiBWYWxpZGF0b3JGbltdID0gW107XG4gIGxldCB2YWxpZGF0b3JGbjogVmFsaWRhdG9yRm4gPSBudWxsO1xuICBpZiAoaGFzT3duKHRlbXBsYXRlLCAndmFsaWRhdG9ycycpKSB7XG4gICAgZm9yRWFjaCh0ZW1wbGF0ZS52YWxpZGF0b3JzLCAocGFyYW1ldGVycywgdmFsaWRhdG9yKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIEpzb25WYWxpZGF0b3JzW3ZhbGlkYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsaWRhdG9yRm5zLnB1c2goSnNvblZhbGlkYXRvcnNbdmFsaWRhdG9yXS5hcHBseShudWxsLCBwYXJhbWV0ZXJzKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHZhbGlkYXRvckZucy5sZW5ndGggJiZcbiAgICAgIGluQXJyYXkodGVtcGxhdGUuY29udHJvbFR5cGUsIFsnRm9ybUdyb3VwJywgJ0Zvcm1BcnJheSddKVxuICAgICkge1xuICAgICAgdmFsaWRhdG9yRm4gPSB2YWxpZGF0b3JGbnMubGVuZ3RoID4gMSA/XG4gICAgICAgIEpzb25WYWxpZGF0b3JzLmNvbXBvc2UodmFsaWRhdG9yRm5zKSA6IHZhbGlkYXRvckZuc1swXTtcbiAgICB9XG4gIH1cbiAgaWYgKGhhc093bih0ZW1wbGF0ZSwgJ2NvbnRyb2xUeXBlJykpIHtcbiAgICBzd2l0Y2ggKHRlbXBsYXRlLmNvbnRyb2xUeXBlKSB7XG4gICAgICBjYXNlICdGb3JtR3JvdXAnOlxuICAgICAgICBsZXQgZ3JvdXBDb250cm9sczogeyBba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2wgfSA9IHt9O1xuICAgICAgICBmb3JFYWNoKHRlbXBsYXRlLmNvbnRyb2xzLCAoY29udHJvbHMsIGtleSkgPT4ge1xuICAgICAgICAgIGxldCBuZXdDb250cm9sOiBBYnN0cmFjdENvbnRyb2wgPSBidWlsZEZvcm1Hcm91cChjb250cm9scyk7XG4gICAgICAgICAgaWYgKG5ld0NvbnRyb2wpIHsgZ3JvdXBDb250cm9sc1trZXldID0gbmV3Q29udHJvbDsgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JtR3JvdXAoZ3JvdXBDb250cm9scywgdmFsaWRhdG9yRm4pO1xuICAgICAgY2FzZSAnRm9ybUFycmF5JzpcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JtQXJyYXkoXy5maWx0ZXIoXy5tYXAodGVtcGxhdGUuY29udHJvbHMsXG4gICAgICAgICAgY29udHJvbHMgPT4gYnVpbGRGb3JtR3JvdXAoY29udHJvbHMpXG4gICAgICAgICkpLCB2YWxpZGF0b3JGbik7XG4gICAgICBjYXNlICdGb3JtQ29udHJvbCc6XG4gICAgICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2wodGVtcGxhdGUudmFsdWUsIHZhbGlkYXRvckZucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqICdtZXJnZVZhbHVlcycgZnVuY3Rpb25cbiAqXG4gKiAvLyAge2FueVtdfSAuLi52YWx1ZXNUb01lcmdlIC0gTXVsdGlwbGUgdmFsdWVzIHRvIG1lcmdlXG4gKiAvLyB7YW55fSAtIE1lcmdlZCB2YWx1ZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVmFsdWVzKC4uLnZhbHVlc1RvTWVyZ2UpIHtcbiAgbGV0IG1lcmdlZFZhbHVlczogYW55ID0gbnVsbDtcbiAgZm9yIChsZXQgY3VycmVudFZhbHVlIG9mIHZhbHVlc1RvTWVyZ2UpIHtcbiAgICBpZiAoIWlzRW1wdHkoY3VycmVudFZhbHVlKSkge1xuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50VmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgICAgIChpc0VtcHR5KG1lcmdlZFZhbHVlcykgfHwgdHlwZW9mIG1lcmdlZFZhbHVlcyAhPT0gJ29iamVjdCcpXG4gICAgICApIHtcbiAgICAgICAgaWYgKGlzQXJyYXkoY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgIG1lcmdlZFZhbHVlcyA9IFsgLi4uY3VycmVudFZhbHVlIF07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgIG1lcmdlZFZhbHVlcyA9IHsgLi4uY3VycmVudFZhbHVlIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGN1cnJlbnRWYWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgbWVyZ2VkVmFsdWVzID0gY3VycmVudFZhbHVlO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChtZXJnZWRWYWx1ZXMpICYmIGlzT2JqZWN0KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihtZXJnZWRWYWx1ZXMsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG1lcmdlZFZhbHVlcykgJiYgaXNBcnJheShjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgbmV3VmFsdWVzLnB1c2gobWVyZ2VWYWx1ZXMobWVyZ2VkVmFsdWVzLCB2YWx1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIG1lcmdlZFZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShtZXJnZWRWYWx1ZXMpICYmIGlzT2JqZWN0KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiBtZXJnZWRWYWx1ZXMpIHtcbiAgICAgICAgICBuZXdWYWx1ZXMucHVzaChtZXJnZVZhbHVlcyh2YWx1ZSwgY3VycmVudFZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgbWVyZ2VkVmFsdWVzID0gbmV3VmFsdWVzO1xuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KG1lcmdlZFZhbHVlcykgJiYgaXNBcnJheShjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1heChtZXJnZWRWYWx1ZXMubGVuZ3RoLCBjdXJyZW50VmFsdWUubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgICAgaWYgKGkgPCBtZXJnZWRWYWx1ZXMubGVuZ3RoICYmIGkgPCBjdXJyZW50VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZXMucHVzaChtZXJnZVZhbHVlcyhtZXJnZWRWYWx1ZXNbaV0sIGN1cnJlbnRWYWx1ZVtpXSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaSA8IG1lcmdlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlcy5wdXNoKG1lcmdlZFZhbHVlc1tpXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpIDwgY3VycmVudFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV3VmFsdWVzLnB1c2goY3VycmVudFZhbHVlW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWVyZ2VkVmFsdWVzID0gbmV3VmFsdWVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWVyZ2VkVmFsdWVzO1xufVxuXG4vKipcbiAqICdzZXRSZXF1aXJlZEZpZWxkcycgZnVuY3Rpb25cbiAqXG4gKiAvLyB7c2NoZW1hfSBzY2hlbWEgLSBKU09OIFNjaGVtYVxuICogLy8ge29iamVjdH0gZm9ybUNvbnRyb2xUZW1wbGF0ZSAtIEZvcm0gQ29udHJvbCBUZW1wbGF0ZSBvYmplY3RcbiAqIC8vIHtib29sZWFufSAtIHRydWUgaWYgYW55IGZpZWxkcyBoYXZlIGJlZW4gc2V0IHRvIHJlcXVpcmVkLCBmYWxzZSBpZiBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFJlcXVpcmVkRmllbGRzKHNjaGVtYTogYW55LCBmb3JtQ29udHJvbFRlbXBsYXRlOiBhbnkpOiBib29sZWFuIHtcbiAgbGV0IGZpZWxkc1JlcXVpcmVkID0gZmFsc2U7XG4gIGlmIChoYXNPd24oc2NoZW1hLCAncmVxdWlyZWQnKSAmJiAhaXNFbXB0eShzY2hlbWEucmVxdWlyZWQpKSB7XG4gICAgZmllbGRzUmVxdWlyZWQgPSB0cnVlO1xuICAgIGxldCByZXF1aXJlZEFycmF5ID0gaXNBcnJheShzY2hlbWEucmVxdWlyZWQpID8gc2NoZW1hLnJlcXVpcmVkIDogW3NjaGVtYS5yZXF1aXJlZF07XG4gICAgcmVxdWlyZWRBcnJheSA9IGZvckVhY2gocmVxdWlyZWRBcnJheSxcbiAgICAgIGtleSA9PiBKc29uUG9pbnRlci5zZXQoZm9ybUNvbnRyb2xUZW1wbGF0ZSwgJy8nICsga2V5ICsgJy92YWxpZGF0b3JzL3JlcXVpcmVkJywgW10pXG4gICAgKTtcbiAgfVxuICByZXR1cm4gZmllbGRzUmVxdWlyZWQ7XG5cbiAgLy8gVE9ETzogQWRkIHN1cHBvcnQgZm9yIHBhdHRlcm5Qcm9wZXJ0aWVzXG4gIC8vIGh0dHBzOi8vc3BhY2V0ZWxlc2NvcGUuZ2l0aHViLmlvL3VuZGVyc3RhbmRpbmctanNvbi1zY2hlbWEvcmVmZXJlbmNlL29iamVjdC5odG1sI3BhdHRlcm4tcHJvcGVydGllc1xufVxuXG4vKipcbiAqICdmb3JtYXRGb3JtRGF0YScgZnVuY3Rpb25cbiAqXG4gKiAvLyB7YW55fSBmb3JtRGF0YSAtIEFuZ3VsYXIgRm9ybUdyb3VwIGRhdGEgb2JqZWN0XG4gKiAvLyB7TWFwPHN0cmluZywgYW55Pn0gZGF0YU1hcCAtXG4gKiAvLyB7TWFwPHN0cmluZywgc3RyaW5nPn0gcmVjdXJzaXZlUmVmTWFwIC1cbiAqIC8vIHtNYXA8c3RyaW5nLCBudW1iZXI+fSBhcnJheU1hcCAtXG4gKiAvLyB7Ym9vbGVhbiA9IGZhbHNlfSBmaXhFcnJvcnMgLSBpZiBUUlVFLCB0cmllcyB0byBmaXggZGF0YVxuICogLy8ge2FueX0gLSBmb3JtYXR0ZWQgZGF0YSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEZvcm1EYXRhKFxuICBmb3JtRGF0YTogYW55LCBkYXRhTWFwOiBNYXA8c3RyaW5nLCBhbnk+LFxuICByZWN1cnNpdmVSZWZNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4sIGFycmF5TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+LFxuICByZXR1cm5FbXB0eUZpZWxkcyA9IGZhbHNlLCBmaXhFcnJvcnMgPSBmYWxzZVxuKTogYW55IHtcbiAgaWYgKGZvcm1EYXRhID09PSBudWxsIHx8IHR5cGVvZiBmb3JtRGF0YSAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZvcm1EYXRhIH1cbiAgbGV0IGZvcm1hdHRlZERhdGEgPSBpc0FycmF5KGZvcm1EYXRhKSA/IFtdIDoge307XG4gIEpzb25Qb2ludGVyLmZvckVhY2hEZWVwKGZvcm1EYXRhLCAodmFsdWUsIGRhdGFQb2ludGVyKSA9PiB7XG5cbiAgICAvLyBJZiByZXR1cm5FbXB0eUZpZWxkcyA9PT0gdHJ1ZSxcbiAgICAvLyBhZGQgZW1wdHkgYXJyYXlzIGFuZCBvYmplY3RzIHRvIGFsbCBhbGxvd2VkIGtleXNcbiAgICBpZiAocmV0dXJuRW1wdHlGaWVsZHMgJiYgaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgW10pO1xuICAgIH0gZWxzZSBpZiAocmV0dXJuRW1wdHlGaWVsZHMgJiYgaXNPYmplY3QodmFsdWUpICYmICFpc0RhdGUodmFsdWUpKSB7XG4gICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGdlbmVyaWNQb2ludGVyID1cbiAgICAgICAgSnNvblBvaW50ZXIuaGFzKGRhdGFNYXAsIFtkYXRhUG9pbnRlciwgJ3NjaGVtYVR5cGUnXSkgPyBkYXRhUG9pbnRlciA6XG4gICAgICAgICAgcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhkYXRhUG9pbnRlciwgcmVjdXJzaXZlUmVmTWFwLCBhcnJheU1hcCk7XG4gICAgICBpZiAoSnNvblBvaW50ZXIuaGFzKGRhdGFNYXAsIFtnZW5lcmljUG9pbnRlciwgJ3NjaGVtYVR5cGUnXSkpIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hVHlwZTogU2NoZW1hUHJpbWl0aXZlVHlwZSB8IFNjaGVtYVByaW1pdGl2ZVR5cGVbXSA9XG4gICAgICAgICAgZGF0YU1hcC5nZXQoZ2VuZXJpY1BvaW50ZXIpLmdldCgnc2NoZW1hVHlwZScpO1xuICAgICAgICBpZiAoc2NoZW1hVHlwZSA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIGlmICgoaGFzVmFsdWUodmFsdWUpIHx8IHJldHVybkVtcHR5RmllbGRzKSAmJlxuICAgICAgICAgIGluQXJyYXkoc2NoZW1hVHlwZSwgWydzdHJpbmcnLCAnaW50ZWdlcicsICdudW1iZXInLCAnYm9vbGVhbiddKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IChmaXhFcnJvcnMgfHwgKHZhbHVlID09PSBudWxsICYmIHJldHVybkVtcHR5RmllbGRzKSkgP1xuICAgICAgICAgICAgdG9TY2hlbWFUeXBlKHZhbHVlLCBzY2hlbWFUeXBlKSA6IHRvSmF2YVNjcmlwdFR5cGUodmFsdWUsIHNjaGVtYVR5cGUpO1xuICAgICAgICAgIGlmIChpc0RlZmluZWQobmV3VmFsdWUpIHx8IHJldHVybkVtcHR5RmllbGRzKSB7XG4gICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgcmV0dXJuRW1wdHlGaWVsZHMgPT09IGZhbHNlLFxuICAgICAgICAvLyBvbmx5IGFkZCBlbXB0eSBhcnJheXMgYW5kIG9iamVjdHMgdG8gcmVxdWlyZWQga2V5c1xuICAgICAgICB9IGVsc2UgaWYgKHNjaGVtYVR5cGUgPT09ICdvYmplY3QnICYmICFyZXR1cm5FbXB0eUZpZWxkcykge1xuICAgICAgICAgIChkYXRhTWFwLmdldChnZW5lcmljUG9pbnRlcikuZ2V0KCdyZXF1aXJlZCcpIHx8IFtdKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXlTY2hlbWFUeXBlID1cbiAgICAgICAgICAgICAgZGF0YU1hcC5nZXQoYCR7Z2VuZXJpY1BvaW50ZXJ9LyR7a2V5fWApLmdldCgnc2NoZW1hVHlwZScpO1xuICAgICAgICAgICAgaWYgKGtleVNjaGVtYVR5cGUgPT09ICdhcnJheScpIHtcbiAgICAgICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGAke2RhdGFQb2ludGVyfS8ke2tleX1gLCBbXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleVNjaGVtYVR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBgJHtkYXRhUG9pbnRlcn0vJHtrZXl9YCwge30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmluaXNoIGluY29tcGxldGUgJ2RhdGUtdGltZScgZW50cmllc1xuICAgICAgICBpZiAoZGF0YU1hcC5nZXQoZ2VuZXJpY1BvaW50ZXIpLmdldCgnc2NoZW1hRm9ybWF0JykgPT09ICdkYXRlLXRpbWUnKSB7XG4gICAgICAgICAgLy8gXCIyMDAwLTAzLTE0VDAxOjU5OjI2LjUzNVwiIC0+IFwiMjAwMC0wMy0xNFQwMTo1OToyNi41MzVaXCIgKGFkZCBcIlpcIilcbiAgICAgICAgICBpZiAoL15cXGRcXGRcXGRcXGQtWzAtMV1cXGQtWzAtM11cXGRbdFxcc11bMC0yXVxcZDpbMC01XVxcZDpbMC01XVxcZCg/OlxcLlxcZCspPyQvaS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBgJHt2YWx1ZX1aYCk7XG4gICAgICAgICAgLy8gXCIyMDAwLTAzLTE0VDAxOjU5XCIgLT4gXCIyMDAwLTAzLTE0VDAxOjU5OjAwWlwiIChhZGQgXCI6MDBaXCIpXG4gICAgICAgICAgfSBlbHNlIGlmICgvXlxcZFxcZFxcZFxcZC1bMC0xXVxcZC1bMC0zXVxcZFt0XFxzXVswLTJdXFxkOlswLTVdXFxkJC9pLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIGAke3ZhbHVlfTowMFpgKTtcbiAgICAgICAgICAvLyBcIjIwMDAtMDMtMTRcIiAtPiBcIjIwMDAtMDMtMTRUMDA6MDA6MDBaXCIgKGFkZCBcIlQwMDowMDowMFpcIilcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpeEVycm9ycyAmJiAvXlxcZFxcZFxcZFxcZC1bMC0xXVxcZC1bMC0zXVxcZCQvaS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBgJHt2YWx1ZX06MDA6MDA6MDBaYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgaXNEYXRlKHZhbHVlKSB8fFxuICAgICAgICAodmFsdWUgPT09IG51bGwgJiYgcmV0dXJuRW1wdHlGaWVsZHMpXG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignZm9ybWF0Rm9ybURhdGEgZXJyb3I6ICcgK1xuICAgICAgICAgIGBTY2hlbWEgdHlwZSBub3QgZm91bmQgZm9yIGZvcm0gdmFsdWUgYXQgJHtnZW5lcmljUG9pbnRlcn1gKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignZGF0YU1hcCcsIGRhdGFNYXApO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdyZWN1cnNpdmVSZWZNYXAnLCByZWN1cnNpdmVSZWZNYXApO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdnZW5lcmljUG9pbnRlcicsIGdlbmVyaWNQb2ludGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZm9ybWF0dGVkRGF0YTtcbn1cblxuLyoqXG4gKiAnZ2V0Q29udHJvbCcgZnVuY3Rpb25cbiAqXG4gKiBVc2VzIGEgSlNPTiBQb2ludGVyIGZvciBhIGRhdGEgb2JqZWN0IHRvIHJldHJpZXZlIGEgY29udHJvbCBmcm9tXG4gKiBhbiBBbmd1bGFyIGZvcm1Hcm91cCBvciBmb3JtR3JvdXAgdGVtcGxhdGUuIChOb3RlOiB0aG91Z2ggYSBmb3JtR3JvdXBcbiAqIHRlbXBsYXRlIGlzIG11Y2ggc2ltcGxlciwgaXRzIGJhc2ljIHN0cnVjdHVyZSBpcyBpZGVudGlhbCB0byBhIGZvcm1Hcm91cCkuXG4gKlxuICogSWYgdGhlIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlciAncmV0dXJuR3JvdXAnIGlzIHNldCB0byBUUlVFLCB0aGUgZ3JvdXBcbiAqIGNvbnRhaW5pbmcgdGhlIGNvbnRyb2wgaXMgcmV0dXJuZWQsIHJhdGhlciB0aGFuIHRoZSBjb250cm9sIGl0c2VsZi5cbiAqXG4gKiAvLyB7Rm9ybUdyb3VwfSBmb3JtR3JvdXAgLSBBbmd1bGFyIEZvcm1Hcm91cCB0byBnZXQgdmFsdWUgZnJvbVxuICogLy8ge1BvaW50ZXJ9IGRhdGFQb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gKiAvLyB7Ym9vbGVhbiA9IGZhbHNlfSByZXR1cm5Hcm91cCAtIElmIHRydWUsIHJldHVybiBncm91cCBjb250YWluaW5nIGNvbnRyb2xcbiAqIC8vIHtncm91cH0gLSBMb2NhdGVkIHZhbHVlIChvciBudWxsLCBpZiBubyBjb250cm9sIGZvdW5kKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbChcbiAgZm9ybUdyb3VwOiBhbnksIGRhdGFQb2ludGVyOiBQb2ludGVyLCByZXR1cm5Hcm91cCA9IGZhbHNlXG4pOiBhbnkge1xuICBpZiAoIWlzT2JqZWN0KGZvcm1Hcm91cCkgfHwgIUpzb25Qb2ludGVyLmlzSnNvblBvaW50ZXIoZGF0YVBvaW50ZXIpKSB7XG4gICAgaWYgKCFKc29uUG9pbnRlci5pc0pzb25Qb2ludGVyKGRhdGFQb2ludGVyKSkge1xuICAgICAgLy8gSWYgZGF0YVBvaW50ZXIgaW5wdXQgaXMgbm90IGEgdmFsaWQgSlNPTiBwb2ludGVyLCBjaGVjayB0b1xuICAgICAgLy8gc2VlIGlmIGl0IGlzIGluc3RlYWQgYSB2YWxpZCBvYmplY3QgcGF0aCwgdXNpbmcgZG90IG5vdGFpb25cbiAgICAgIGlmICh0eXBlb2YgZGF0YVBvaW50ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGZvcm1Db250cm9sID0gZm9ybUdyb3VwLmdldChkYXRhUG9pbnRlcik7XG4gICAgICAgIGlmIChmb3JtQ29udHJvbCkgeyByZXR1cm4gZm9ybUNvbnRyb2w7IH1cbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuZXJyb3IoYGdldENvbnRyb2wgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke2RhdGFQb2ludGVyfWApO1xuICAgIH1cbiAgICBpZiAoIWlzT2JqZWN0KGZvcm1Hcm91cCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGdldENvbnRyb2wgZXJyb3I6IEludmFsaWQgZm9ybUdyb3VwOiAke2Zvcm1Hcm91cH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRhdGFQb2ludGVyQXJyYXkgPSBKc29uUG9pbnRlci5wYXJzZShkYXRhUG9pbnRlcik7XG4gIGlmIChyZXR1cm5Hcm91cCkgeyBkYXRhUG9pbnRlckFycmF5ID0gZGF0YVBvaW50ZXJBcnJheS5zbGljZSgwLCAtMSk7IH1cblxuICAvLyBJZiBmb3JtR3JvdXAgaW5wdXQgaXMgYSByZWFsIGZvcm1Hcm91cCAobm90IGEgZm9ybUdyb3VwIHRlbXBsYXRlKVxuICAvLyB0cnkgdXNpbmcgZm9ybUdyb3VwLmdldCgpIHRvIHJldHVybiB0aGUgY29udHJvbFxuICBpZiAodHlwZW9mIGZvcm1Hcm91cC5nZXQgPT09ICdmdW5jdGlvbicgJiZcbiAgICBkYXRhUG9pbnRlckFycmF5LmV2ZXJ5KGtleSA9PiBrZXkuaW5kZXhPZignLicpID09PSAtMSlcbiAgKSB7XG4gICAgY29uc3QgZm9ybUNvbnRyb2wgPSBmb3JtR3JvdXAuZ2V0KGRhdGFQb2ludGVyQXJyYXkuam9pbignLicpKTtcbiAgICBpZiAoZm9ybUNvbnRyb2wpIHsgcmV0dXJuIGZvcm1Db250cm9sOyB9XG4gIH1cblxuICAvLyBJZiBmb3JtR3JvdXAgaW5wdXQgaXMgYSBmb3JtR3JvdXAgdGVtcGxhdGUsXG4gIC8vIG9yIGZvcm1Hcm91cC5nZXQoKSBmYWlsZWQgdG8gcmV0dXJuIHRoZSBjb250cm9sLFxuICAvLyBzZWFyY2ggdGhlIGZvcm1Hcm91cCBvYmplY3QgZm9yIGRhdGFQb2ludGVyJ3MgY29udHJvbFxuICBsZXQgc3ViR3JvdXAgPSBmb3JtR3JvdXA7XG4gIGZvciAobGV0IGtleSBvZiBkYXRhUG9pbnRlckFycmF5KSB7XG4gICAgaWYgKGhhc093bihzdWJHcm91cCwgJ2NvbnRyb2xzJykpIHsgc3ViR3JvdXAgPSBzdWJHcm91cC5jb250cm9sczsgfVxuICAgIGlmIChpc0FycmF5KHN1Ykdyb3VwKSAmJiAoa2V5ID09PSAnLScpKSB7XG4gICAgICBzdWJHcm91cCA9IHN1Ykdyb3VwW3N1Ykdyb3VwLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSBpZiAoaGFzT3duKHN1Ykdyb3VwLCBrZXkpKSB7XG4gICAgICBzdWJHcm91cCA9IHN1Ykdyb3VwW2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGdldENvbnRyb2wgZXJyb3I6IFVuYWJsZSB0byBmaW5kIFwiJHtrZXl9XCIgaXRlbSBpbiBGb3JtR3JvdXAuYCk7XG4gICAgICBjb25zb2xlLmVycm9yKGRhdGFQb2ludGVyKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybUdyb3VwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN1Ykdyb3VwO1xufVxuIl19