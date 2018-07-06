/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
export function buildFormGroupTemplate(jsf, nodeValue = null, setValues = true, schemaPointer = '', dataPointer = '', templatePointer = '') {
    /** @type {?} */
    const schema = JsonPointer.get(jsf.schema, schemaPointer);
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
    const schemaType = JsonPointer.get(schema, '/type');
    /** @type {?} */
    let controlType = (hasOwn(schema, 'properties') || hasOwn(schema, 'additionalProperties')) &&
        schemaType === 'object' ? 'FormGroup' :
        (hasOwn(schema, 'items') || hasOwn(schema, 'additionalItems')) &&
            schemaType === 'array' ? 'FormArray' :
            !schemaType && hasOwn(schema, '$ref') ? '$ref' : 'FormControl';
    /** @type {?} */
    const shortDataPointer = removeRecursiveReferences(dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
    if (!jsf.dataMap.has(shortDataPointer)) {
        jsf.dataMap.set(shortDataPointer, new Map());
    }
    /** @type {?} */
    const nodeOptions = jsf.dataMap.get(shortDataPointer);
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
    let controls;
    /** @type {?} */
    let validators = getControlValidators(schema);
    switch (controlType) {
        case 'FormGroup':
            controls = {};
            if (hasOwn(schema, 'ui:order') || hasOwn(schema, 'properties')) {
                /** @type {?} */
                let propertyKeys = schema['ui:order'] || Object.keys(schema.properties);
                if (propertyKeys.includes('*') && !hasOwn(schema.properties, '*')) {
                    /** @type {?} */
                    const unnamedKeys = Object.keys(schema.properties)
                        .filter(key => !propertyKeys.includes(key));
                    for (let i = propertyKeys.length - 1; i >= 0; i--) {
                        if (propertyKeys[i] === '*') {
                            propertyKeys.splice(i, 1, ...unnamedKeys);
                        }
                    }
                }
                propertyKeys
                    .filter(key => hasOwn(schema.properties, key) ||
                    hasOwn(schema, 'additionalProperties'))
                    .forEach(key => controls[key] = buildFormGroupTemplate(jsf, JsonPointer.get(nodeValue, [/** @type {?} */ (key)]), setValues, schemaPointer + (hasOwn(schema.properties, key) ?
                    '/properties/' + key : '/additionalProperties'), dataPointer + '/' + key, templatePointer + '/controls/' + key));
                jsf.formOptions.fieldsRequired = setRequiredFields(schema, controls);
            }
            return { controlType, controls, validators };
        case 'FormArray':
            controls = [];
            /** @type {?} */
            const minItems = Math.max(schema.minItems || 0, nodeOptions.get('minItems') || 0);
            /** @type {?} */
            const maxItems = Math.min(schema.maxItems || 1000, nodeOptions.get('maxItems') || 1000);
            /** @type {?} */
            let additionalItemsPointer = null;
            if (isArray(schema.items)) {
                /** @type {?} */
                const tupleItems = nodeOptions.get('tupleItems') ||
                    (isArray(schema.items) ? Math.min(schema.items.length, maxItems) : 0);
                for (let i = 0; i < tupleItems; i++) {
                    if (i < minItems) {
                        controls.push(buildFormGroupTemplate(jsf, isArray(nodeValue) ? nodeValue[i] : nodeValue, setValues, schemaPointer + '/items/' + i, dataPointer + '/' + i, templatePointer + '/controls/' + i));
                    }
                    else {
                        /** @type {?} */
                        const schemaRefPointer = removeRecursiveReferences(schemaPointer + '/items/' + i, jsf.schemaRecursiveRefMap);
                        /** @type {?} */
                        const itemRefPointer = removeRecursiveReferences(shortDataPointer + '/' + i, jsf.dataRecursiveRefMap, jsf.arrayMap);
                        /** @type {?} */
                        const itemRecursive = itemRefPointer !== shortDataPointer + '/' + i;
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
                const schemaRefPointer = removeRecursiveReferences(additionalItemsPointer, jsf.schemaRecursiveRefMap);
                /** @type {?} */
                const itemRefPointer = removeRecursiveReferences(shortDataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
                /** @type {?} */
                const itemRecursive = itemRefPointer !== shortDataPointer + '/-';
                if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                    jsf.templateRefLibrary[itemRefPointer] = null;
                    jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + '/controls/-');
                }
                /** @type {?} */
                const itemOptions = nodeOptions;
                if (!itemRecursive || hasOwn(validators, 'required')) {
                    /** @type {?} */
                    const arrayLength = Math.min(Math.max(itemRecursive ? 0 :
                        (itemOptions.get('tupleItems') + itemOptions.get('listItems')) || 0, isArray(nodeValue) ? nodeValue.length : 0), maxItems);
                    for (let i = controls.length; i < arrayLength; i++) {
                        controls.push(isArray(nodeValue) ?
                            buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaRefPointer, dataPointer + '/-', templatePointer + '/controls/-') :
                            itemRecursive ?
                                null : _.cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
            }
            return { controlType, controls, validators };
        case '$ref':
            /** @type {?} */
            const schemaRef = JsonPointer.compile(schema.$ref);
            /** @type {?} */
            const dataRef = JsonPointer.toDataPointer(schemaRef, schema);
            /** @type {?} */
            const refPointer = removeRecursiveReferences(dataRef, jsf.dataRecursiveRefMap, jsf.arrayMap);
            if (refPointer && !hasOwn(jsf.templateRefLibrary, refPointer)) {
                // Set to null first to prevent recursive reference from causing endless loop
                jsf.templateRefLibrary[refPointer] = null;
                /** @type {?} */
                const newTemplate = buildFormGroupTemplate(jsf, setValues, setValues, schemaRef);
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
            const value = {
                value: setValues && isPrimitive(nodeValue) ? nodeValue : null,
                disabled: nodeOptions.get('disabled') || false
            };
            return { controlType, value, validators };
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
    let validatorFns = [];
    /** @type {?} */
    let validatorFn = null;
    if (hasOwn(template, 'validators')) {
        forEach(template.validators, (parameters, validator) => {
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
                let groupControls = {};
                forEach(template.controls, (controls, key) => {
                    /** @type {?} */
                    let newControl = buildFormGroup(controls);
                    if (newControl) {
                        groupControls[key] = newControl;
                    }
                });
                return new FormGroup(groupControls, validatorFn);
            case 'FormArray':
                return new FormArray(_.filter(_.map(template.controls, controls => buildFormGroup(controls))), validatorFn);
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
export function mergeValues(...valuesToMerge) {
    /** @type {?} */
    let mergedValues = null;
    for (let currentValue of valuesToMerge) {
        if (!isEmpty(currentValue)) {
            if (typeof currentValue === 'object' &&
                (isEmpty(mergedValues) || typeof mergedValues !== 'object')) {
                if (isArray(currentValue)) {
                    mergedValues = [...currentValue];
                }
                else if (isObject(currentValue)) {
                    mergedValues = Object.assign({}, currentValue);
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
                let newValues = [];
                for (let value of currentValue) {
                    newValues.push(mergeValues(mergedValues, value));
                }
                mergedValues = newValues;
            }
            else if (isArray(mergedValues) && isObject(currentValue)) {
                /** @type {?} */
                let newValues = [];
                for (let value of mergedValues) {
                    newValues.push(mergeValues(value, currentValue));
                }
                mergedValues = newValues;
            }
            else if (isArray(mergedValues) && isArray(currentValue)) {
                /** @type {?} */
                let newValues = [];
                for (let i = 0; i < Math.max(mergedValues.length, currentValue.length); i++) {
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
    return mergedValues;
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
    let fieldsRequired = false;
    if (hasOwn(schema, 'required') && !isEmpty(schema.required)) {
        fieldsRequired = true;
        /** @type {?} */
        let requiredArray = isArray(schema.required) ? schema.required : [schema.required];
        requiredArray = forEach(requiredArray, key => JsonPointer.set(formControlTemplate, '/' + key + '/validators/required', []));
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
export function formatFormData(formData, dataMap, recursiveRefMap, arrayMap, returnEmptyFields = false, fixErrors = false) {
    if (formData === null || typeof formData !== 'object') {
        return formData;
    }
    /** @type {?} */
    let formattedData = isArray(formData) ? [] : {};
    JsonPointer.forEachDeep(formData, (value, dataPointer) => {
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
            let genericPointer = JsonPointer.has(dataMap, [dataPointer, 'schemaType']) ? dataPointer :
                removeRecursiveReferences(dataPointer, recursiveRefMap, arrayMap);
            if (JsonPointer.has(dataMap, [genericPointer, 'schemaType'])) {
                /** @type {?} */
                const schemaType = dataMap.get(genericPointer).get('schemaType');
                if (schemaType === 'null') {
                    JsonPointer.set(formattedData, dataPointer, null);
                }
                else if ((hasValue(value) || returnEmptyFields) &&
                    inArray(schemaType, ['string', 'integer', 'number', 'boolean'])) {
                    /** @type {?} */
                    const newValue = (fixErrors || (value === null && returnEmptyFields)) ?
                        toSchemaType(value, schemaType) : toJavaScriptType(value, schemaType);
                    if (isDefined(newValue) || returnEmptyFields) {
                        JsonPointer.set(formattedData, dataPointer, newValue);
                    }
                    // If returnEmptyFields === false,
                    // only add empty arrays and objects to required keys
                }
                else if (schemaType === 'object' && !returnEmptyFields) {
                    (dataMap.get(genericPointer).get('required') || []).forEach(key => {
                        /** @type {?} */
                        const keySchemaType = dataMap.get(`${genericPointer}/${key}`).get('schemaType');
                        if (keySchemaType === 'array') {
                            JsonPointer.set(formattedData, `${dataPointer}/${key}`, []);
                        }
                        else if (keySchemaType === 'object') {
                            JsonPointer.set(formattedData, `${dataPointer}/${key}`, {});
                        }
                    });
                }
                // Finish incomplete 'date-time' entries
                if (dataMap.get(genericPointer).get('schemaFormat') === 'date-time') {
                    // "2000-03-14T01:59:26.535" -> "2000-03-14T01:59:26.535Z" (add "Z")
                    if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, `${value}Z`);
                        // "2000-03-14T01:59" -> "2000-03-14T01:59:00Z" (add ":00Z")
                    }
                    else if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, `${value}:00Z`);
                        // "2000-03-14" -> "2000-03-14T00:00:00Z" (add "T00:00:00Z")
                    }
                    else if (fixErrors && /^\d\d\d\d-[0-1]\d-[0-3]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, `${value}:00:00:00Z`);
                    }
                }
            }
            else if (typeof value !== 'object' || isDate(value) ||
                (value === null && returnEmptyFields)) {
                console.error('formatFormData error: ' +
                    `Schema type not found for form value at ${genericPointer}`);
                console.error('dataMap', dataMap);
                console.error('recursiveRefMap', recursiveRefMap);
                console.error('genericPointer', genericPointer);
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
export function getControl(formGroup, dataPointer, returnGroup = false) {
    if (!isObject(formGroup) || !JsonPointer.isJsonPointer(dataPointer)) {
        if (!JsonPointer.isJsonPointer(dataPointer)) {
            // If dataPointer input is not a valid JSON pointer, check to
            // see if it is instead a valid object path, using dot notaion
            if (typeof dataPointer === 'string') {
                /** @type {?} */
                const formControl = formGroup.get(dataPointer);
                if (formControl) {
                    return formControl;
                }
            }
            console.error(`getControl error: Invalid JSON Pointer: ${dataPointer}`);
        }
        if (!isObject(formGroup)) {
            console.error(`getControl error: Invalid formGroup: ${formGroup}`);
        }
        return null;
    }
    /** @type {?} */
    let dataPointerArray = JsonPointer.parse(dataPointer);
    if (returnGroup) {
        dataPointerArray = dataPointerArray.slice(0, -1);
    }
    // If formGroup input is a real formGroup (not a formGroup template)
    // try using formGroup.get() to return the control
    if (typeof formGroup.get === 'function' &&
        dataPointerArray.every(key => key.indexOf('.') === -1)) {
        /** @type {?} */
        const formControl = formGroup.get(dataPointerArray.join('.'));
        if (formControl) {
            return formControl;
        }
    }
    /** @type {?} */
    let subGroup = formGroup;
    for (let key of dataPointerArray) {
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
            console.error(`getControl error: Unable to find "${key}" item in FormGroup.`);
            console.error(dataPointer);
            console.error(formGroup);
            return;
        }
    }
    return subGroup;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1ncm91cC5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9mb3JtLWdyb3VwLmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNZLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUNuRCxNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sS0FBSyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBRTVCLE9BQU8sRUFDTCxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUM3RSxnQkFBZ0IsRUFBRSxZQUFZLEVBQy9CLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQVcsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFDUyxvQkFBb0IsRUFBZ0IseUJBQXlCLEVBQzVFLE1BQU0seUJBQXlCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNDakMsTUFBTSxpQ0FDSixHQUFRLEVBQUUsWUFBaUIsSUFBSSxFQUFFLFNBQVMsR0FBRyxJQUFJLEVBQ2pELGFBQWEsR0FBRyxFQUFFLEVBQUUsV0FBVyxHQUFHLEVBQUUsRUFBRSxlQUFlLEdBQUcsRUFBRTs7SUFFMUQsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzFELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMs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QyxJQUFJLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztTQUFFO1FBQ25FLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDMUI7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMscUNBQXFDLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztZQUM5RSxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDO1NBQ1I7S0FDRjtJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7Q0FDakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBYnN0cmFjdENvbnRyb2wsIEZvcm1BcnJheSwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgVmFsaWRhdG9yRm5cbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGhhc1ZhbHVlLCBpbkFycmF5LCBpc0FycmF5LCBpc0VtcHR5LCBpc0RhdGUsIGlzT2JqZWN0LCBpc0RlZmluZWQsIGlzUHJpbWl0aXZlLFxuICB0b0phdmFTY3JpcHRUeXBlLCB0b1NjaGVtYVR5cGUsIFNjaGVtYVByaW1pdGl2ZVR5cGVcbn0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IGZvckVhY2gsIGhhc093biB9IGZyb20gJy4vdXRpbGl0eS5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgUG9pbnRlciwgSnNvblBvaW50ZXIgfSBmcm9tICcuL2pzb25wb2ludGVyLmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBKc29uVmFsaWRhdG9ycyB9IGZyb20gJy4vanNvbi52YWxpZGF0b3JzJztcbmltcG9ydCB7XG4gIGNvbWJpbmVBbGxPZiwgZ2V0Q29udHJvbFZhbGlkYXRvcnMsIGdldFN1YlNjaGVtYSwgcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlc1xufSBmcm9tICcuL2pzb24tc2NoZW1hLmZ1bmN0aW9ucyc7XG5cbi8qKlxuICogRm9ybUdyb3VwIGZ1bmN0aW9uIGxpYnJhcnk6XG4gKlxuICogYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZTogIEJ1aWxkcyBhIEZvcm1Hcm91cFRlbXBsYXRlIGZyb20gc2NoZW1hXG4gKlxuICogYnVpbGRGb3JtR3JvdXA6ICAgICAgICAgIEJ1aWxkcyBhbiBBbmd1bGFyIEZvcm1Hcm91cCBmcm9tIGEgRm9ybUdyb3VwVGVtcGxhdGVcbiAqXG4gKiBtZXJnZVZhbHVlczpcbiAqXG4gKiBzZXRSZXF1aXJlZEZpZWxkczpcbiAqXG4gKiBmb3JtYXRGb3JtRGF0YTpcbiAqXG4gKiBnZXRDb250cm9sOlxuICpcbiAqIC0tLS0gVE9ETzogLS0tLVxuICogVE9ETzogYWRkIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGVGcm9tTGF5b3V0IGZ1bmN0aW9uXG4gKiBidWlsZEZvcm1Hcm91cFRlbXBsYXRlRnJvbUxheW91dDogQnVpbGRzIGEgRm9ybUdyb3VwVGVtcGxhdGUgZnJvbSBhIGZvcm0gbGF5b3V0XG4gKi9cblxuLyoqXG4gKiAnYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZScgZnVuY3Rpb25cbiAqXG4gKiBCdWlsZHMgYSB0ZW1wbGF0ZSBmb3IgYW4gQW5ndWxhciBGb3JtR3JvdXAgZnJvbSBhIEpTT04gU2NoZW1hLlxuICpcbiAqIFRPRE86IGFkZCBzdXBwb3J0IGZvciBwYXR0ZXJuIHByb3BlcnRpZXNcbiAqIGh0dHBzOi8vc3BhY2V0ZWxlc2NvcGUuZ2l0aHViLmlvL3VuZGVyc3RhbmRpbmctanNvbi1zY2hlbWEvcmVmZXJlbmNlL29iamVjdC5odG1sXG4gKlxuICogLy8gIHthbnl9IGpzZiAtXG4gKiAvLyAge2FueSA9IG51bGx9IG5vZGVWYWx1ZSAtXG4gKiAvLyAge2Jvb2xlYW4gPSB0cnVlfSBtYXBBcnJheXMgLVxuICogLy8gIHtzdHJpbmcgPSAnJ30gc2NoZW1hUG9pbnRlciAtXG4gKiAvLyAge3N0cmluZyA9ICcnfSBkYXRhUG9pbnRlciAtXG4gKiAvLyAge2FueSA9ICcnfSB0ZW1wbGF0ZVBvaW50ZXIgLVxuICogLy8ge2FueX0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAganNmOiBhbnksIG5vZGVWYWx1ZTogYW55ID0gbnVsbCwgc2V0VmFsdWVzID0gdHJ1ZSxcbiAgc2NoZW1hUG9pbnRlciA9ICcnLCBkYXRhUG9pbnRlciA9ICcnLCB0ZW1wbGF0ZVBvaW50ZXIgPSAnJ1xuKSB7XG4gIGNvbnN0IHNjaGVtYSA9IEpzb25Qb2ludGVyLmdldChqc2Yuc2NoZW1hLCBzY2hlbWFQb2ludGVyKTtcbiAgaWYgKHNldFZhbHVlcykge1xuICAgIGlmICghaXNEZWZpbmVkKG5vZGVWYWx1ZSkgJiYgKFxuICAgICAganNmLmZvcm1PcHRpb25zLnNldFNjaGVtYURlZmF1bHRzID09PSB0cnVlIHx8XG4gICAgICAoanNmLmZvcm1PcHRpb25zLnNldFNjaGVtYURlZmF1bHRzID09PSAnYXV0bycgJiYgaXNFbXB0eShqc2YuZm9ybVZhbHVlcykpXG4gICAgKSkge1xuICAgICAgbm9kZVZhbHVlID0gSnNvblBvaW50ZXIuZ2V0KGpzZi5zY2hlbWEsIHNjaGVtYVBvaW50ZXIgKyAnL2RlZmF1bHQnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbm9kZVZhbHVlID0gbnVsbDtcbiAgfVxuICAvLyBUT0RPOiBJZiBub2RlVmFsdWUgc3RpbGwgbm90IHNldCwgY2hlY2sgbGF5b3V0IGZvciBkZWZhdWx0IHZhbHVlXG4gIGNvbnN0IHNjaGVtYVR5cGU6IHN0cmluZyB8IHN0cmluZ1tdID0gSnNvblBvaW50ZXIuZ2V0KHNjaGVtYSwgJy90eXBlJyk7XG4gIGxldCBjb250cm9sVHlwZSA9XG4gICAgKGhhc093bihzY2hlbWEsICdwcm9wZXJ0aWVzJykgfHwgaGFzT3duKHNjaGVtYSwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJykpICYmXG4gICAgICBzY2hlbWFUeXBlID09PSAnb2JqZWN0JyA/ICdGb3JtR3JvdXAnIDpcbiAgICAoaGFzT3duKHNjaGVtYSwgJ2l0ZW1zJykgfHwgaGFzT3duKHNjaGVtYSwgJ2FkZGl0aW9uYWxJdGVtcycpKSAmJlxuICAgICAgc2NoZW1hVHlwZSA9PT0gJ2FycmF5JyA/ICdGb3JtQXJyYXknIDpcbiAgICAhc2NoZW1hVHlwZSAmJiBoYXNPd24oc2NoZW1hLCAnJHJlZicpID8gJyRyZWYnIDogJ0Zvcm1Db250cm9sJztcbiAgY29uc3Qgc2hvcnREYXRhUG9pbnRlciA9XG4gICAgcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhkYXRhUG9pbnRlciwganNmLmRhdGFSZWN1cnNpdmVSZWZNYXAsIGpzZi5hcnJheU1hcCk7XG4gIGlmICghanNmLmRhdGFNYXAuaGFzKHNob3J0RGF0YVBvaW50ZXIpKSB7XG4gICAganNmLmRhdGFNYXAuc2V0KHNob3J0RGF0YVBvaW50ZXIsIG5ldyBNYXAoKSk7XG4gIH1cbiAgY29uc3Qgbm9kZU9wdGlvbnMgPSBqc2YuZGF0YU1hcC5nZXQoc2hvcnREYXRhUG9pbnRlcik7XG4gIGlmICghbm9kZU9wdGlvbnMuaGFzKCdzY2hlbWFUeXBlJykpIHtcbiAgICBub2RlT3B0aW9ucy5zZXQoJ3NjaGVtYVBvaW50ZXInLCBzY2hlbWFQb2ludGVyKTtcbiAgICBub2RlT3B0aW9ucy5zZXQoJ3NjaGVtYVR5cGUnLCBzY2hlbWEudHlwZSk7XG4gICAgaWYgKHNjaGVtYS5mb3JtYXQpIHtcbiAgICAgIG5vZGVPcHRpb25zLnNldCgnc2NoZW1hRm9ybWF0Jywgc2NoZW1hLmZvcm1hdCk7XG4gICAgICBpZiAoIXNjaGVtYS50eXBlKSB7IG5vZGVPcHRpb25zLnNldCgnc2NoZW1hVHlwZScsICdzdHJpbmcnKTsgfVxuICAgIH1cbiAgICBpZiAoY29udHJvbFR5cGUpIHtcbiAgICAgIG5vZGVPcHRpb25zLnNldCgndGVtcGxhdGVQb2ludGVyJywgdGVtcGxhdGVQb2ludGVyKTtcbiAgICAgIG5vZGVPcHRpb25zLnNldCgndGVtcGxhdGVUeXBlJywgY29udHJvbFR5cGUpO1xuICAgIH1cbiAgfVxuICBsZXQgY29udHJvbHM6IGFueTtcbiAgbGV0IHZhbGlkYXRvcnMgPSBnZXRDb250cm9sVmFsaWRhdG9ycyhzY2hlbWEpO1xuICBzd2l0Y2ggKGNvbnRyb2xUeXBlKSB7XG5cbiAgICBjYXNlICdGb3JtR3JvdXAnOlxuICAgICAgY29udHJvbHMgPSB7fTtcbiAgICAgIGlmIChoYXNPd24oc2NoZW1hLCAndWk6b3JkZXInKSB8fCBoYXNPd24oc2NoZW1hLCAncHJvcGVydGllcycpKSB7XG4gICAgICAgIGxldCBwcm9wZXJ0eUtleXMgPSBzY2hlbWFbJ3VpOm9yZGVyJ10gfHwgT2JqZWN0LmtleXMoc2NoZW1hLnByb3BlcnRpZXMpO1xuICAgICAgICBpZiAocHJvcGVydHlLZXlzLmluY2x1ZGVzKCcqJykgJiYgIWhhc093bihzY2hlbWEucHJvcGVydGllcywgJyonKSkge1xuICAgICAgICAgIGNvbnN0IHVubmFtZWRLZXlzID0gT2JqZWN0LmtleXMoc2NoZW1hLnByb3BlcnRpZXMpXG4gICAgICAgICAgICAuZmlsdGVyKGtleSA9PiAhcHJvcGVydHlLZXlzLmluY2x1ZGVzKGtleSkpO1xuICAgICAgICAgIGZvciAobGV0IGkgPSBwcm9wZXJ0eUtleXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUtleXNbaV0gPT09ICcqJykge1xuICAgICAgICAgICAgICBwcm9wZXJ0eUtleXMuc3BsaWNlKGksIDEsIC4uLnVubmFtZWRLZXlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJvcGVydHlLZXlzXG4gICAgICAgICAgLmZpbHRlcihrZXkgPT4gaGFzT3duKHNjaGVtYS5wcm9wZXJ0aWVzLCBrZXkpIHx8XG4gICAgICAgICAgICBoYXNPd24oc2NoZW1hLCAnYWRkaXRpb25hbFByb3BlcnRpZXMnKVxuICAgICAgICAgIClcbiAgICAgICAgICAuZm9yRWFjaChrZXkgPT4gY29udHJvbHNba2V5XSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICBqc2YsIEpzb25Qb2ludGVyLmdldChub2RlVmFsdWUsIFs8c3RyaW5nPmtleV0pLCBzZXRWYWx1ZXMsXG4gICAgICAgICAgICBzY2hlbWFQb2ludGVyICsgKGhhc093bihzY2hlbWEucHJvcGVydGllcywga2V5KSA/XG4gICAgICAgICAgICAgICcvcHJvcGVydGllcy8nICsga2V5IDogJy9hZGRpdGlvbmFsUHJvcGVydGllcydcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBkYXRhUG9pbnRlciArICcvJyArIGtleSxcbiAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArICcvY29udHJvbHMvJyArIGtleVxuICAgICAgICAgICkpO1xuICAgICAgICBqc2YuZm9ybU9wdGlvbnMuZmllbGRzUmVxdWlyZWQgPSBzZXRSZXF1aXJlZEZpZWxkcyhzY2hlbWEsIGNvbnRyb2xzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGNvbnRyb2xUeXBlLCBjb250cm9scywgdmFsaWRhdG9ycyB9O1xuXG4gICAgY2FzZSAnRm9ybUFycmF5JzpcbiAgICAgIGNvbnRyb2xzID0gW107XG4gICAgICBjb25zdCBtaW5JdGVtcyA9XG4gICAgICAgIE1hdGgubWF4KHNjaGVtYS5taW5JdGVtcyB8fCAwLCBub2RlT3B0aW9ucy5nZXQoJ21pbkl0ZW1zJykgfHwgMCk7XG4gICAgICBjb25zdCBtYXhJdGVtcyA9XG4gICAgICAgIE1hdGgubWluKHNjaGVtYS5tYXhJdGVtcyB8fCAxMDAwLCBub2RlT3B0aW9ucy5nZXQoJ21heEl0ZW1zJykgfHwgMTAwMCk7XG4gICAgICBsZXQgYWRkaXRpb25hbEl0ZW1zUG9pbnRlcjogc3RyaW5nID0gbnVsbDtcbiAgICAgIGlmIChpc0FycmF5KHNjaGVtYS5pdGVtcykpIHsgLy8gJ2l0ZW1zJyBpcyBhbiBhcnJheSA9IHR1cGxlIGl0ZW1zXG4gICAgICAgIGNvbnN0IHR1cGxlSXRlbXMgPSBub2RlT3B0aW9ucy5nZXQoJ3R1cGxlSXRlbXMnKSB8fFxuICAgICAgICAgIChpc0FycmF5KHNjaGVtYS5pdGVtcykgPyBNYXRoLm1pbihzY2hlbWEuaXRlbXMubGVuZ3RoLCBtYXhJdGVtcykgOiAwKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0dXBsZUl0ZW1zOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSA8IG1pbkl0ZW1zKSB7XG4gICAgICAgICAgICBjb250cm9scy5wdXNoKGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoXG4gICAgICAgICAgICAgIGpzZiwgaXNBcnJheShub2RlVmFsdWUpID8gbm9kZVZhbHVlW2ldIDogbm9kZVZhbHVlLCBzZXRWYWx1ZXMsXG4gICAgICAgICAgICAgIHNjaGVtYVBvaW50ZXIgKyAnL2l0ZW1zLycgKyBpLFxuICAgICAgICAgICAgICBkYXRhUG9pbnRlciArICcvJyArIGksXG4gICAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArICcvY29udHJvbHMvJyArIGlcbiAgICAgICAgICAgICkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzY2hlbWFSZWZQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICAgICAgICAgICAgc2NoZW1hUG9pbnRlciArICcvaXRlbXMvJyArIGksIGpzZi5zY2hlbWFSZWN1cnNpdmVSZWZNYXBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBpdGVtUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgICAgIHNob3J0RGF0YVBvaW50ZXIgKyAnLycgKyBpLCBqc2YuZGF0YVJlY3Vyc2l2ZVJlZk1hcCwganNmLmFycmF5TWFwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgaXRlbVJlY3Vyc2l2ZSA9IGl0ZW1SZWZQb2ludGVyICE9PSBzaG9ydERhdGFQb2ludGVyICsgJy8nICsgaTtcbiAgICAgICAgICAgIGlmICghaGFzT3duKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnksIGl0ZW1SZWZQb2ludGVyKSkge1xuICAgICAgICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSA9IG51bGw7XG4gICAgICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdID0gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICBqc2YsIG51bGwsIHNldFZhbHVlcyxcbiAgICAgICAgICAgICAgICBzY2hlbWFSZWZQb2ludGVyLFxuICAgICAgICAgICAgICAgIGl0ZW1SZWZQb2ludGVyLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArICcvY29udHJvbHMvJyArIGlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRyb2xzLnB1c2goXG4gICAgICAgICAgICAgIGlzQXJyYXkobm9kZVZhbHVlKSA/XG4gICAgICAgICAgICAgICAgYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICAgIGpzZiwgbm9kZVZhbHVlW2ldLCBzZXRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgICBzY2hlbWFQb2ludGVyICsgJy9pdGVtcy8nICsgaSxcbiAgICAgICAgICAgICAgICAgIGRhdGFQb2ludGVyICsgJy8nICsgaSxcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlUG9pbnRlciArICcvY29udHJvbHMvJyArIGlcbiAgICAgICAgICAgICAgICApIDpcbiAgICAgICAgICAgICAgaXRlbVJlY3Vyc2l2ZSA/XG4gICAgICAgICAgICAgICAgbnVsbCA6IF8uY2xvbmVEZWVwKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiAnYWRkaXRpb25hbEl0ZW1zJyBpcyBhbiBvYmplY3QgPSBhZGRpdGlvbmFsIGxpc3QgaXRlbXMgKGFmdGVyIHR1cGxlIGl0ZW1zKVxuICAgICAgICBpZiAoc2NoZW1hLml0ZW1zLmxlbmd0aCA8IG1heEl0ZW1zICYmIGlzT2JqZWN0KHNjaGVtYS5hZGRpdGlvbmFsSXRlbXMpKSB7XG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zUG9pbnRlciA9IHNjaGVtYVBvaW50ZXIgKyAnL2FkZGl0aW9uYWxJdGVtcyc7XG4gICAgICAgIH1cblxuICAgICAgLy8gSWYgJ2l0ZW1zJyBpcyBhbiBvYmplY3QgPSBsaXN0IGl0ZW1zIG9ubHkgKG5vIHR1cGxlIGl0ZW1zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkaXRpb25hbEl0ZW1zUG9pbnRlciA9IHNjaGVtYVBvaW50ZXIgKyAnL2l0ZW1zJztcbiAgICAgIH1cblxuICAgICAgaWYgKGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIpIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zUG9pbnRlciwganNmLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBpdGVtUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgc2hvcnREYXRhUG9pbnRlciArICcvLScsIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLCBqc2YuYXJyYXlNYXBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgaXRlbVJlY3Vyc2l2ZSA9IGl0ZW1SZWZQb2ludGVyICE9PSBzaG9ydERhdGFQb2ludGVyICsgJy8tJztcbiAgICAgICAgaWYgKCFoYXNPd24oanNmLnRlbXBsYXRlUmVmTGlicmFyeSwgaXRlbVJlZlBvaW50ZXIpKSB7XG4gICAgICAgICAganNmLnRlbXBsYXRlUmVmTGlicmFyeVtpdGVtUmVmUG9pbnRlcl0gPSBudWxsO1xuICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdID0gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgIGpzZiwgbnVsbCwgc2V0VmFsdWVzLFxuICAgICAgICAgICAgc2NoZW1hUmVmUG9pbnRlcixcbiAgICAgICAgICAgIGl0ZW1SZWZQb2ludGVyLFxuICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgJy9jb250cm9scy8tJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc3QgaXRlbU9wdGlvbnMgPSBqc2YuZGF0YU1hcC5nZXQoaXRlbVJlZlBvaW50ZXIpIHx8IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgaXRlbU9wdGlvbnMgPSBub2RlT3B0aW9ucztcbiAgICAgICAgaWYgKCFpdGVtUmVjdXJzaXZlIHx8IGhhc093bih2YWxpZGF0b3JzLCAncmVxdWlyZWQnKSkge1xuICAgICAgICAgIGNvbnN0IGFycmF5TGVuZ3RoID0gTWF0aC5taW4oTWF0aC5tYXgoXG4gICAgICAgICAgICBpdGVtUmVjdXJzaXZlID8gMCA6XG4gICAgICAgICAgICAgIChpdGVtT3B0aW9ucy5nZXQoJ3R1cGxlSXRlbXMnKSArIGl0ZW1PcHRpb25zLmdldCgnbGlzdEl0ZW1zJykpIHx8IDAsXG4gICAgICAgICAgICBpc0FycmF5KG5vZGVWYWx1ZSkgPyBub2RlVmFsdWUubGVuZ3RoIDogMFxuICAgICAgICAgICksIG1heEl0ZW1zKTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gY29udHJvbHMubGVuZ3RoOyBpIDwgYXJyYXlMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29udHJvbHMucHVzaChcbiAgICAgICAgICAgICAgaXNBcnJheShub2RlVmFsdWUpID9cbiAgICAgICAgICAgICAgICBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAganNmLCBub2RlVmFsdWVbaV0sIHNldFZhbHVlcyxcbiAgICAgICAgICAgICAgICAgIHNjaGVtYVJlZlBvaW50ZXIsXG4gICAgICAgICAgICAgICAgICBkYXRhUG9pbnRlciArICcvLScsXG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyAnL2NvbnRyb2xzLy0nXG4gICAgICAgICAgICAgICAgKSA6XG4gICAgICAgICAgICAgICAgaXRlbVJlY3Vyc2l2ZSA/XG4gICAgICAgICAgICAgICAgICBudWxsIDogXy5jbG9uZURlZXAoanNmLnRlbXBsYXRlUmVmTGlicmFyeVtpdGVtUmVmUG9pbnRlcl0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHsgY29udHJvbFR5cGUsIGNvbnRyb2xzLCB2YWxpZGF0b3JzIH07XG5cbiAgICBjYXNlICckcmVmJzpcbiAgICAgIGNvbnN0IHNjaGVtYVJlZiA9IEpzb25Qb2ludGVyLmNvbXBpbGUoc2NoZW1hLiRyZWYpO1xuICAgICAgY29uc3QgZGF0YVJlZiA9IEpzb25Qb2ludGVyLnRvRGF0YVBvaW50ZXIoc2NoZW1hUmVmLCBzY2hlbWEpO1xuICAgICAgY29uc3QgcmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgIGRhdGFSZWYsIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLCBqc2YuYXJyYXlNYXBcbiAgICAgICk7XG4gICAgICBpZiAocmVmUG9pbnRlciAmJiAhaGFzT3duKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnksIHJlZlBvaW50ZXIpKSB7XG4gICAgICAgIC8vIFNldCB0byBudWxsIGZpcnN0IHRvIHByZXZlbnQgcmVjdXJzaXZlIHJlZmVyZW5jZSBmcm9tIGNhdXNpbmcgZW5kbGVzcyBsb29wXG4gICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbcmVmUG9pbnRlcl0gPSBudWxsO1xuICAgICAgICBjb25zdCBuZXdUZW1wbGF0ZSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUoanNmLCBzZXRWYWx1ZXMsIHNldFZhbHVlcywgc2NoZW1hUmVmKTtcbiAgICAgICAgaWYgKG5ld1RlbXBsYXRlKSB7XG4gICAgICAgICAganNmLnRlbXBsYXRlUmVmTGlicmFyeVtyZWZQb2ludGVyXSA9IG5ld1RlbXBsYXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W3JlZlBvaW50ZXJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIGNhc2UgJ0Zvcm1Db250cm9sJzpcbiAgICAgIGNvbnN0IHZhbHVlID0ge1xuICAgICAgICB2YWx1ZTogc2V0VmFsdWVzICYmIGlzUHJpbWl0aXZlKG5vZGVWYWx1ZSkgPyBub2RlVmFsdWUgOiBudWxsLFxuICAgICAgICBkaXNhYmxlZDogbm9kZU9wdGlvbnMuZ2V0KCdkaXNhYmxlZCcpIHx8IGZhbHNlXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHsgY29udHJvbFR5cGUsIHZhbHVlLCB2YWxpZGF0b3JzIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiAnYnVpbGRGb3JtR3JvdXAnIGZ1bmN0aW9uXG4gKlxuICogLy8ge2FueX0gdGVtcGxhdGUgLVxuICogLy8ge0Fic3RyYWN0Q29udHJvbH1cbiovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGb3JtR3JvdXAodGVtcGxhdGU6IGFueSk6IEFic3RyYWN0Q29udHJvbCB7XG4gIGxldCB2YWxpZGF0b3JGbnM6IFZhbGlkYXRvckZuW10gPSBbXTtcbiAgbGV0IHZhbGlkYXRvckZuOiBWYWxpZGF0b3JGbiA9IG51bGw7XG4gIGlmIChoYXNPd24odGVtcGxhdGUsICd2YWxpZGF0b3JzJykpIHtcbiAgICBmb3JFYWNoKHRlbXBsYXRlLnZhbGlkYXRvcnMsIChwYXJhbWV0ZXJzLCB2YWxpZGF0b3IpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgSnNvblZhbGlkYXRvcnNbdmFsaWRhdG9yXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWxpZGF0b3JGbnMucHVzaChKc29uVmFsaWRhdG9yc1t2YWxpZGF0b3JdLmFwcGx5KG51bGwsIHBhcmFtZXRlcnMpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodmFsaWRhdG9yRm5zLmxlbmd0aCAmJlxuICAgICAgaW5BcnJheSh0ZW1wbGF0ZS5jb250cm9sVHlwZSwgWydGb3JtR3JvdXAnLCAnRm9ybUFycmF5J10pXG4gICAgKSB7XG4gICAgICB2YWxpZGF0b3JGbiA9IHZhbGlkYXRvckZucy5sZW5ndGggPiAxID9cbiAgICAgICAgSnNvblZhbGlkYXRvcnMuY29tcG9zZSh2YWxpZGF0b3JGbnMpIDogdmFsaWRhdG9yRm5zWzBdO1xuICAgIH1cbiAgfVxuICBpZiAoaGFzT3duKHRlbXBsYXRlLCAnY29udHJvbFR5cGUnKSkge1xuICAgIHN3aXRjaCAodGVtcGxhdGUuY29udHJvbFR5cGUpIHtcbiAgICAgIGNhc2UgJ0Zvcm1Hcm91cCc6XG4gICAgICAgIGxldCBncm91cENvbnRyb2xzOiB7IFtrZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbCB9ID0ge307XG4gICAgICAgIGZvckVhY2godGVtcGxhdGUuY29udHJvbHMsIChjb250cm9scywga2V5KSA9PiB7XG4gICAgICAgICAgbGV0IG5ld0NvbnRyb2w6IEFic3RyYWN0Q29udHJvbCA9IGJ1aWxkRm9ybUdyb3VwKGNvbnRyb2xzKTtcbiAgICAgICAgICBpZiAobmV3Q29udHJvbCkgeyBncm91cENvbnRyb2xzW2tleV0gPSBuZXdDb250cm9sOyB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3IEZvcm1Hcm91cChncm91cENvbnRyb2xzLCB2YWxpZGF0b3JGbik7XG4gICAgICBjYXNlICdGb3JtQXJyYXknOlxuICAgICAgICByZXR1cm4gbmV3IEZvcm1BcnJheShfLmZpbHRlcihfLm1hcCh0ZW1wbGF0ZS5jb250cm9scyxcbiAgICAgICAgICBjb250cm9scyA9PiBidWlsZEZvcm1Hcm91cChjb250cm9scylcbiAgICAgICAgKSksIHZhbGlkYXRvckZuKTtcbiAgICAgIGNhc2UgJ0Zvcm1Db250cm9sJzpcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbCh0ZW1wbGF0ZS52YWx1ZSwgdmFsaWRhdG9yRm5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogJ21lcmdlVmFsdWVzJyBmdW5jdGlvblxuICpcbiAqIC8vICB7YW55W119IC4uLnZhbHVlc1RvTWVyZ2UgLSBNdWx0aXBsZSB2YWx1ZXMgdG8gbWVyZ2VcbiAqIC8vIHthbnl9IC0gTWVyZ2VkIHZhbHVlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VWYWx1ZXMoLi4udmFsdWVzVG9NZXJnZSkge1xuICBsZXQgbWVyZ2VkVmFsdWVzOiBhbnkgPSBudWxsO1xuICBmb3IgKGxldCBjdXJyZW50VmFsdWUgb2YgdmFsdWVzVG9NZXJnZSkge1xuICAgIGlmICghaXNFbXB0eShjdXJyZW50VmFsdWUpKSB7XG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRWYWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgKGlzRW1wdHkobWVyZ2VkVmFsdWVzKSB8fCB0eXBlb2YgbWVyZ2VkVmFsdWVzICE9PSAnb2JqZWN0JylcbiAgICAgICkge1xuICAgICAgICBpZiAoaXNBcnJheShjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgICAgbWVyZ2VkVmFsdWVzID0gWyAuLi5jdXJyZW50VmFsdWUgXTtcbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgICAgbWVyZ2VkVmFsdWVzID0geyAuLi5jdXJyZW50VmFsdWUgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY3VycmVudFZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBtZXJnZWRWYWx1ZXMgPSBjdXJyZW50VmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG1lcmdlZFZhbHVlcykgJiYgaXNPYmplY3QoY3VycmVudFZhbHVlKSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKG1lcmdlZFZhbHVlcywgY3VycmVudFZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QobWVyZ2VkVmFsdWVzKSAmJiBpc0FycmF5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiBjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICBuZXdWYWx1ZXMucHVzaChtZXJnZVZhbHVlcyhtZXJnZWRWYWx1ZXMsIHZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgbWVyZ2VkVmFsdWVzID0gbmV3VmFsdWVzO1xuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KG1lcmdlZFZhbHVlcykgJiYgaXNPYmplY3QoY3VycmVudFZhbHVlKSkge1xuICAgICAgICBsZXQgbmV3VmFsdWVzID0gW107XG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIG1lcmdlZFZhbHVlcykge1xuICAgICAgICAgIG5ld1ZhbHVlcy5wdXNoKG1lcmdlVmFsdWVzKHZhbHVlLCBjdXJyZW50VmFsdWUpKTtcbiAgICAgICAgfVxuICAgICAgICBtZXJnZWRWYWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgICB9IGVsc2UgaWYgKGlzQXJyYXkobWVyZ2VkVmFsdWVzKSAmJiBpc0FycmF5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWF4KG1lcmdlZFZhbHVlcy5sZW5ndGgsIGN1cnJlbnRWYWx1ZS5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSA8IG1lcmdlZFZhbHVlcy5sZW5ndGggJiYgaSA8IGN1cnJlbnRWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlcy5wdXNoKG1lcmdlVmFsdWVzKG1lcmdlZFZhbHVlc1tpXSwgY3VycmVudFZhbHVlW2ldKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpIDwgbWVyZ2VkVmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV3VmFsdWVzLnB1c2gobWVyZ2VkVmFsdWVzW2ldKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGkgPCBjdXJyZW50VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZXMucHVzaChjdXJyZW50VmFsdWVbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtZXJnZWRWYWx1ZXMgPSBuZXdWYWx1ZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBtZXJnZWRWYWx1ZXM7XG59XG5cbi8qKlxuICogJ3NldFJlcXVpcmVkRmllbGRzJyBmdW5jdGlvblxuICpcbiAqIC8vIHtzY2hlbWF9IHNjaGVtYSAtIEpTT04gU2NoZW1hXG4gKiAvLyB7b2JqZWN0fSBmb3JtQ29udHJvbFRlbXBsYXRlIC0gRm9ybSBDb250cm9sIFRlbXBsYXRlIG9iamVjdFxuICogLy8ge2Jvb2xlYW59IC0gdHJ1ZSBpZiBhbnkgZmllbGRzIGhhdmUgYmVlbiBzZXQgdG8gcmVxdWlyZWQsIGZhbHNlIGlmIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UmVxdWlyZWRGaWVsZHMoc2NoZW1hOiBhbnksIGZvcm1Db250cm9sVGVtcGxhdGU6IGFueSk6IGJvb2xlYW4ge1xuICBsZXQgZmllbGRzUmVxdWlyZWQgPSBmYWxzZTtcbiAgaWYgKGhhc093bihzY2hlbWEsICdyZXF1aXJlZCcpICYmICFpc0VtcHR5KHNjaGVtYS5yZXF1aXJlZCkpIHtcbiAgICBmaWVsZHNSZXF1aXJlZCA9IHRydWU7XG4gICAgbGV0IHJlcXVpcmVkQXJyYXkgPSBpc0FycmF5KHNjaGVtYS5yZXF1aXJlZCkgPyBzY2hlbWEucmVxdWlyZWQgOiBbc2NoZW1hLnJlcXVpcmVkXTtcbiAgICByZXF1aXJlZEFycmF5ID0gZm9yRWFjaChyZXF1aXJlZEFycmF5LFxuICAgICAga2V5ID0+IEpzb25Qb2ludGVyLnNldChmb3JtQ29udHJvbFRlbXBsYXRlLCAnLycgKyBrZXkgKyAnL3ZhbGlkYXRvcnMvcmVxdWlyZWQnLCBbXSlcbiAgICApO1xuICB9XG4gIHJldHVybiBmaWVsZHNSZXF1aXJlZDtcblxuICAvLyBUT0RPOiBBZGQgc3VwcG9ydCBmb3IgcGF0dGVyblByb3BlcnRpZXNcbiAgLy8gaHR0cHM6Ly9zcGFjZXRlbGVzY29wZS5naXRodWIuaW8vdW5kZXJzdGFuZGluZy1qc29uLXNjaGVtYS9yZWZlcmVuY2Uvb2JqZWN0Lmh0bWwjcGF0dGVybi1wcm9wZXJ0aWVzXG59XG5cbi8qKlxuICogJ2Zvcm1hdEZvcm1EYXRhJyBmdW5jdGlvblxuICpcbiAqIC8vIHthbnl9IGZvcm1EYXRhIC0gQW5ndWxhciBGb3JtR3JvdXAgZGF0YSBvYmplY3RcbiAqIC8vIHtNYXA8c3RyaW5nLCBhbnk+fSBkYXRhTWFwIC1cbiAqIC8vIHtNYXA8c3RyaW5nLCBzdHJpbmc+fSByZWN1cnNpdmVSZWZNYXAgLVxuICogLy8ge01hcDxzdHJpbmcsIG51bWJlcj59IGFycmF5TWFwIC1cbiAqIC8vIHtib29sZWFuID0gZmFsc2V9IGZpeEVycm9ycyAtIGlmIFRSVUUsIHRyaWVzIHRvIGZpeCBkYXRhXG4gKiAvLyB7YW55fSAtIGZvcm1hdHRlZCBkYXRhIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Rm9ybURhdGEoXG4gIGZvcm1EYXRhOiBhbnksIGRhdGFNYXA6IE1hcDxzdHJpbmcsIGFueT4sXG4gIHJlY3Vyc2l2ZVJlZk1hcDogTWFwPHN0cmluZywgc3RyaW5nPiwgYXJyYXlNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4sXG4gIHJldHVybkVtcHR5RmllbGRzID0gZmFsc2UsIGZpeEVycm9ycyA9IGZhbHNlXG4pOiBhbnkge1xuICBpZiAoZm9ybURhdGEgPT09IG51bGwgfHwgdHlwZW9mIGZvcm1EYXRhICE9PSAnb2JqZWN0JykgeyByZXR1cm4gZm9ybURhdGEgfVxuICBsZXQgZm9ybWF0dGVkRGF0YSA9IGlzQXJyYXkoZm9ybURhdGEpID8gW10gOiB7fTtcbiAgSnNvblBvaW50ZXIuZm9yRWFjaERlZXAoZm9ybURhdGEsICh2YWx1ZSwgZGF0YVBvaW50ZXIpID0+IHtcblxuICAgIC8vIElmIHJldHVybkVtcHR5RmllbGRzID09PSB0cnVlLFxuICAgIC8vIGFkZCBlbXB0eSBhcnJheXMgYW5kIG9iamVjdHMgdG8gYWxsIGFsbG93ZWQga2V5c1xuICAgIGlmIChyZXR1cm5FbXB0eUZpZWxkcyAmJiBpc0FycmF5KHZhbHVlKSkge1xuICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGRhdGFQb2ludGVyLCBbXSk7XG4gICAgfSBlbHNlIGlmIChyZXR1cm5FbXB0eUZpZWxkcyAmJiBpc09iamVjdCh2YWx1ZSkgJiYgIWlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZ2VuZXJpY1BvaW50ZXIgPVxuICAgICAgICBKc29uUG9pbnRlci5oYXMoZGF0YU1hcCwgW2RhdGFQb2ludGVyLCAnc2NoZW1hVHlwZSddKSA/IGRhdGFQb2ludGVyIDpcbiAgICAgICAgICByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKGRhdGFQb2ludGVyLCByZWN1cnNpdmVSZWZNYXAsIGFycmF5TWFwKTtcbiAgICAgIGlmIChKc29uUG9pbnRlci5oYXMoZGF0YU1hcCwgW2dlbmVyaWNQb2ludGVyLCAnc2NoZW1hVHlwZSddKSkge1xuICAgICAgICBjb25zdCBzY2hlbWFUeXBlOiBTY2hlbWFQcmltaXRpdmVUeXBlIHwgU2NoZW1hUHJpbWl0aXZlVHlwZVtdID1cbiAgICAgICAgICBkYXRhTWFwLmdldChnZW5lcmljUG9pbnRlcikuZ2V0KCdzY2hlbWFUeXBlJyk7XG4gICAgICAgIGlmIChzY2hlbWFUeXBlID09PSAnbnVsbCcpIHtcbiAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIG51bGwpO1xuICAgICAgICB9IGVsc2UgaWYgKChoYXNWYWx1ZSh2YWx1ZSkgfHwgcmV0dXJuRW1wdHlGaWVsZHMpICYmXG4gICAgICAgICAgaW5BcnJheShzY2hlbWFUeXBlLCBbJ3N0cmluZycsICdpbnRlZ2VyJywgJ251bWJlcicsICdib29sZWFuJ10pXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gKGZpeEVycm9ycyB8fCAodmFsdWUgPT09IG51bGwgJiYgcmV0dXJuRW1wdHlGaWVsZHMpKSA/XG4gICAgICAgICAgICB0b1NjaGVtYVR5cGUodmFsdWUsIHNjaGVtYVR5cGUpIDogdG9KYXZhU2NyaXB0VHlwZSh2YWx1ZSwgc2NoZW1hVHlwZSk7XG4gICAgICAgICAgaWYgKGlzRGVmaW5lZChuZXdWYWx1ZSkgfHwgcmV0dXJuRW1wdHlGaWVsZHMpIHtcbiAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgbmV3VmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAvLyBJZiByZXR1cm5FbXB0eUZpZWxkcyA9PT0gZmFsc2UsXG4gICAgICAgIC8vIG9ubHkgYWRkIGVtcHR5IGFycmF5cyBhbmQgb2JqZWN0cyB0byByZXF1aXJlZCBrZXlzXG4gICAgICAgIH0gZWxzZSBpZiAoc2NoZW1hVHlwZSA9PT0gJ29iamVjdCcgJiYgIXJldHVybkVtcHR5RmllbGRzKSB7XG4gICAgICAgICAgKGRhdGFNYXAuZ2V0KGdlbmVyaWNQb2ludGVyKS5nZXQoJ3JlcXVpcmVkJykgfHwgW10pLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleVNjaGVtYVR5cGUgPVxuICAgICAgICAgICAgICBkYXRhTWFwLmdldChgJHtnZW5lcmljUG9pbnRlcn0vJHtrZXl9YCkuZ2V0KCdzY2hlbWFUeXBlJyk7XG4gICAgICAgICAgICBpZiAoa2V5U2NoZW1hVHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgYCR7ZGF0YVBvaW50ZXJ9LyR7a2V5fWAsIFtdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5U2NoZW1hVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgSnNvblBvaW50ZXIuc2V0KGZvcm1hdHRlZERhdGEsIGAke2RhdGFQb2ludGVyfS8ke2tleX1gLCB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5pc2ggaW5jb21wbGV0ZSAnZGF0ZS10aW1lJyBlbnRyaWVzXG4gICAgICAgIGlmIChkYXRhTWFwLmdldChnZW5lcmljUG9pbnRlcikuZ2V0KCdzY2hlbWFGb3JtYXQnKSA9PT0gJ2RhdGUtdGltZScpIHtcbiAgICAgICAgICAvLyBcIjIwMDAtMDMtMTRUMDE6NTk6MjYuNTM1XCIgLT4gXCIyMDAwLTAzLTE0VDAxOjU5OjI2LjUzNVpcIiAoYWRkIFwiWlwiKVxuICAgICAgICAgIGlmICgvXlxcZFxcZFxcZFxcZC1bMC0xXVxcZC1bMC0zXVxcZFt0XFxzXVswLTJdXFxkOlswLTVdXFxkOlswLTVdXFxkKD86XFwuXFxkKyk/JC9pLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIGAke3ZhbHVlfVpgKTtcbiAgICAgICAgICAvLyBcIjIwMDAtMDMtMTRUMDE6NTlcIiAtPiBcIjIwMDAtMDMtMTRUMDE6NTk6MDBaXCIgKGFkZCBcIjowMFpcIilcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eXFxkXFxkXFxkXFxkLVswLTFdXFxkLVswLTNdXFxkW3RcXHNdWzAtMl1cXGQ6WzAtNV1cXGQkL2kudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgYCR7dmFsdWV9OjAwWmApO1xuICAgICAgICAgIC8vIFwiMjAwMC0wMy0xNFwiIC0+IFwiMjAwMC0wMy0xNFQwMDowMDowMFpcIiAoYWRkIFwiVDAwOjAwOjAwWlwiKVxuICAgICAgICAgIH0gZWxzZSBpZiAoZml4RXJyb3JzICYmIC9eXFxkXFxkXFxkXFxkLVswLTFdXFxkLVswLTNdXFxkJC9pLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIGAke3ZhbHVlfTowMDowMDowMFpgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCBpc0RhdGUodmFsdWUpIHx8XG4gICAgICAgICh2YWx1ZSA9PT0gbnVsbCAmJiByZXR1cm5FbXB0eUZpZWxkcylcbiAgICAgICkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdmb3JtYXRGb3JtRGF0YSBlcnJvcjogJyArXG4gICAgICAgICAgYFNjaGVtYSB0eXBlIG5vdCBmb3VuZCBmb3IgZm9ybSB2YWx1ZSBhdCAke2dlbmVyaWNQb2ludGVyfWApO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdkYXRhTWFwJywgZGF0YU1hcCk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlY3Vyc2l2ZVJlZk1hcCcsIHJlY3Vyc2l2ZVJlZk1hcCk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dlbmVyaWNQb2ludGVyJywgZ2VuZXJpY1BvaW50ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmb3JtYXR0ZWREYXRhO1xufVxuXG4vKipcbiAqICdnZXRDb250cm9sJyBmdW5jdGlvblxuICpcbiAqIFVzZXMgYSBKU09OIFBvaW50ZXIgZm9yIGEgZGF0YSBvYmplY3QgdG8gcmV0cmlldmUgYSBjb250cm9sIGZyb21cbiAqIGFuIEFuZ3VsYXIgZm9ybUdyb3VwIG9yIGZvcm1Hcm91cCB0ZW1wbGF0ZS4gKE5vdGU6IHRob3VnaCBhIGZvcm1Hcm91cFxuICogdGVtcGxhdGUgaXMgbXVjaCBzaW1wbGVyLCBpdHMgYmFzaWMgc3RydWN0dXJlIGlzIGlkZW50aWFsIHRvIGEgZm9ybUdyb3VwKS5cbiAqXG4gKiBJZiB0aGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyICdyZXR1cm5Hcm91cCcgaXMgc2V0IHRvIFRSVUUsIHRoZSBncm91cFxuICogY29udGFpbmluZyB0aGUgY29udHJvbCBpcyByZXR1cm5lZCwgcmF0aGVyIHRoYW4gdGhlIGNvbnRyb2wgaXRzZWxmLlxuICpcbiAqIC8vIHtGb3JtR3JvdXB9IGZvcm1Hcm91cCAtIEFuZ3VsYXIgRm9ybUdyb3VwIHRvIGdldCB2YWx1ZSBmcm9tXG4gKiAvLyB7UG9pbnRlcn0gZGF0YVBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAqIC8vIHtib29sZWFuID0gZmFsc2V9IHJldHVybkdyb3VwIC0gSWYgdHJ1ZSwgcmV0dXJuIGdyb3VwIGNvbnRhaW5pbmcgY29udHJvbFxuICogLy8ge2dyb3VwfSAtIExvY2F0ZWQgdmFsdWUgKG9yIG51bGwsIGlmIG5vIGNvbnRyb2wgZm91bmQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sKFxuICBmb3JtR3JvdXA6IGFueSwgZGF0YVBvaW50ZXI6IFBvaW50ZXIsIHJldHVybkdyb3VwID0gZmFsc2Vcbik6IGFueSB7XG4gIGlmICghaXNPYmplY3QoZm9ybUdyb3VwKSB8fCAhSnNvblBvaW50ZXIuaXNKc29uUG9pbnRlcihkYXRhUG9pbnRlcikpIHtcbiAgICBpZiAoIUpzb25Qb2ludGVyLmlzSnNvblBvaW50ZXIoZGF0YVBvaW50ZXIpKSB7XG4gICAgICAvLyBJZiBkYXRhUG9pbnRlciBpbnB1dCBpcyBub3QgYSB2YWxpZCBKU09OIHBvaW50ZXIsIGNoZWNrIHRvXG4gICAgICAvLyBzZWUgaWYgaXQgaXMgaW5zdGVhZCBhIHZhbGlkIG9iamVjdCBwYXRoLCB1c2luZyBkb3Qgbm90YWlvblxuICAgICAgaWYgKHR5cGVvZiBkYXRhUG9pbnRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgZm9ybUNvbnRyb2wgPSBmb3JtR3JvdXAuZ2V0KGRhdGFQb2ludGVyKTtcbiAgICAgICAgaWYgKGZvcm1Db250cm9sKSB7IHJldHVybiBmb3JtQ29udHJvbDsgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5lcnJvcihgZ2V0Q29udHJvbCBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7ZGF0YVBvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3QoZm9ybUdyb3VwKSkge1xuICAgICAgY29uc29sZS5lcnJvcihgZ2V0Q29udHJvbCBlcnJvcjogSW52YWxpZCBmb3JtR3JvdXA6ICR7Zm9ybUdyb3VwfWApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBsZXQgZGF0YVBvaW50ZXJBcnJheSA9IEpzb25Qb2ludGVyLnBhcnNlKGRhdGFQb2ludGVyKTtcbiAgaWYgKHJldHVybkdyb3VwKSB7IGRhdGFQb2ludGVyQXJyYXkgPSBkYXRhUG9pbnRlckFycmF5LnNsaWNlKDAsIC0xKTsgfVxuXG4gIC8vIElmIGZvcm1Hcm91cCBpbnB1dCBpcyBhIHJlYWwgZm9ybUdyb3VwIChub3QgYSBmb3JtR3JvdXAgdGVtcGxhdGUpXG4gIC8vIHRyeSB1c2luZyBmb3JtR3JvdXAuZ2V0KCkgdG8gcmV0dXJuIHRoZSBjb250cm9sXG4gIGlmICh0eXBlb2YgZm9ybUdyb3VwLmdldCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIGRhdGFQb2ludGVyQXJyYXkuZXZlcnkoa2V5ID0+IGtleS5pbmRleE9mKCcuJykgPT09IC0xKVxuICApIHtcbiAgICBjb25zdCBmb3JtQ29udHJvbCA9IGZvcm1Hcm91cC5nZXQoZGF0YVBvaW50ZXJBcnJheS5qb2luKCcuJykpO1xuICAgIGlmIChmb3JtQ29udHJvbCkgeyByZXR1cm4gZm9ybUNvbnRyb2w7IH1cbiAgfVxuXG4gIC8vIElmIGZvcm1Hcm91cCBpbnB1dCBpcyBhIGZvcm1Hcm91cCB0ZW1wbGF0ZSxcbiAgLy8gb3IgZm9ybUdyb3VwLmdldCgpIGZhaWxlZCB0byByZXR1cm4gdGhlIGNvbnRyb2wsXG4gIC8vIHNlYXJjaCB0aGUgZm9ybUdyb3VwIG9iamVjdCBmb3IgZGF0YVBvaW50ZXIncyBjb250cm9sXG4gIGxldCBzdWJHcm91cCA9IGZvcm1Hcm91cDtcbiAgZm9yIChsZXQga2V5IG9mIGRhdGFQb2ludGVyQXJyYXkpIHtcbiAgICBpZiAoaGFzT3duKHN1Ykdyb3VwLCAnY29udHJvbHMnKSkgeyBzdWJHcm91cCA9IHN1Ykdyb3VwLmNvbnRyb2xzOyB9XG4gICAgaWYgKGlzQXJyYXkoc3ViR3JvdXApICYmIChrZXkgPT09ICctJykpIHtcbiAgICAgIHN1Ykdyb3VwID0gc3ViR3JvdXBbc3ViR3JvdXAubGVuZ3RoIC0gMV07XG4gICAgfSBlbHNlIGlmIChoYXNPd24oc3ViR3JvdXAsIGtleSkpIHtcbiAgICAgIHN1Ykdyb3VwID0gc3ViR3JvdXBba2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihgZ2V0Q29udHJvbCBlcnJvcjogVW5hYmxlIHRvIGZpbmQgXCIke2tleX1cIiBpdGVtIGluIEZvcm1Hcm91cC5gKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZGF0YVBvaW50ZXIpO1xuICAgICAgY29uc29sZS5lcnJvcihmb3JtR3JvdXApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3ViR3JvdXA7XG59XG4iXX0=