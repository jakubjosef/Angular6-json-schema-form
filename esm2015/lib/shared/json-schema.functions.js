/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as _ from 'lodash';
import { getType, hasValue, inArray, isArray, isNumber, isObject, isString } from './validator.functions';
import { forEach, hasOwn, mergeFilteredObject } from './utility.functions';
import { mergeSchemas } from './merge-schemas.function';
import { JsonPointer } from './jsonpointer.functions';
/**
 * 'buildSchemaFromLayout' function
 *
 * TODO: Build a JSON Schema from a JSON Form layout
 *
 * //   layout - The JSON Form layout
 * //  - The new JSON Schema
 * @param {?} layout
 * @return {?}
 */
export function buildSchemaFromLayout(layout) {
    return;
    // let newSchema: any = { };
    // const walkLayout = (layoutItems: any[], callback: Function): any[] => {
    //   let returnArray: any[] = [];
    //   for (let layoutItem of layoutItems) {
    //     const returnItem: any = callback(layoutItem);
    //     if (returnItem) { returnArray = returnArray.concat(callback(layoutItem)); }
    //     if (layoutItem.items) {
    //       returnArray = returnArray.concat(walkLayout(layoutItem.items, callback));
    //     }
    //   }
    //   return returnArray;
    // };
    // walkLayout(layout, layoutItem => {
    //   let itemKey: string;
    //   if (typeof layoutItem === 'string') {
    //     itemKey = layoutItem;
    //   } else if (layoutItem.key) {
    //     itemKey = layoutItem.key;
    //   }
    //   if (!itemKey) { return; }
    //   //
    // });
}
/**
 * 'buildSchemaFromData' function
 *
 * Build a JSON Schema from a data object
 *
 * //   data - The data object
 * //  { boolean = false } requireAllFields - Require all fields?
 * //  { boolean = true } isRoot - is root
 * //  - The new JSON Schema
 * @param {?} data
 * @param {?=} requireAllFields
 * @param {?=} isRoot
 * @return {?}
 */
export function buildSchemaFromData(data, requireAllFields = false, isRoot = true) {
    /** @type {?} */
    let newSchema = {};
    /** @type {?} */
    const getFieldType = (value) => {
        /** @type {?} */
        const fieldType = getType(value, 'strict');
        return { integer: 'number', null: 'string' }[fieldType] || fieldType;
    };
    /** @type {?} */
    const buildSubSchema = (value) => buildSchemaFromData(value, requireAllFields, false);
    if (isRoot) {
        newSchema.$schema = 'http://json-schema.org/draft-06/schema#';
    }
    newSchema.type = getFieldType(data);
    if (newSchema.type === 'object') {
        newSchema.properties = {};
        if (requireAllFields) {
            newSchema.required = [];
        }
        for (let key of Object.keys(data)) {
            newSchema.properties[key] = buildSubSchema(data[key]);
            if (requireAllFields) {
                newSchema.required.push(key);
            }
        }
    }
    else if (newSchema.type === 'array') {
        newSchema.items = data.map(buildSubSchema);
        // If all items are the same type, use an object for items instead of an array
        if ((new Set(data.map(getFieldType))).size === 1) {
            newSchema.items = newSchema.items.reduce((a, b) => (Object.assign({}, a, b)), {});
        }
        if (requireAllFields) {
            newSchema.minItems = 1;
        }
    }
    return newSchema;
}
/**
 * 'getFromSchema' function
 *
 * Uses a JSON Pointer for a value within a data object to retrieve
 * the schema for that value within schema for the data object.
 *
 * The optional third parameter can also be set to return something else:
 * 'schema' (default): the schema for the value indicated by the data pointer
 * 'parentSchema': the schema for the value's parent object or array
 * 'schemaPointer': a pointer to the value's schema within the object's schema
 * 'parentSchemaPointer': a pointer to the schema for the value's parent object or array
 *
 * //   schema - The schema to get the sub-schema from
 * //  { Pointer } dataPointer - JSON Pointer (string or array)
 * //  { string = 'schema' } returnType - what to return?
 * //  - The located sub-schema
 * @param {?} schema
 * @param {?} dataPointer
 * @param {?=} returnType
 * @return {?}
 */
export function getFromSchema(schema, dataPointer, returnType = 'schema') {
    /** @type {?} */
    const dataPointerArray = JsonPointer.parse(dataPointer);
    if (dataPointerArray === null) {
        console.error(`getFromSchema error: Invalid JSON Pointer: ${dataPointer}`);
        return null;
    }
    /** @type {?} */
    let subSchema = schema;
    /** @type {?} */
    const schemaPointer = [];
    /** @type {?} */
    const length = dataPointerArray.length;
    if (returnType.slice(0, 6) === 'parent') {
        dataPointerArray.length--;
    }
    for (let i = 0; i < length; ++i) {
        /** @type {?} */
        const parentSchema = subSchema;
        /** @type {?} */
        const key = dataPointerArray[i];
        /** @type {?} */
        let subSchemaFound = false;
        if (typeof subSchema !== 'object') {
            console.error(`getFromSchema error: Unable to find "${key}" key in schema.`);
            console.error(schema);
            console.error(dataPointer);
            return null;
        }
        if (subSchema.type === 'array' && (!isNaN(key) || key === '-')) {
            if (hasOwn(subSchema, 'items')) {
                if (isObject(subSchema.items)) {
                    subSchemaFound = true;
                    subSchema = subSchema.items;
                    schemaPointer.push('items');
                }
                else if (isArray(subSchema.items)) {
                    if (!isNaN(key) && subSchema.items.length >= +key) {
                        subSchemaFound = true;
                        subSchema = subSchema.items[+key];
                        schemaPointer.push('items', key);
                    }
                }
            }
            if (!subSchemaFound && isObject(subSchema.additionalItems)) {
                subSchemaFound = true;
                subSchema = subSchema.additionalItems;
                schemaPointer.push('additionalItems');
            }
            else if (subSchema.additionalItems !== false) {
                subSchemaFound = true;
                subSchema = {};
                schemaPointer.push('additionalItems');
            }
        }
        else if (subSchema.type === 'object') {
            if (isObject(subSchema.properties) && hasOwn(subSchema.properties, key)) {
                subSchemaFound = true;
                subSchema = subSchema.properties[key];
                schemaPointer.push('properties', key);
            }
            else if (isObject(subSchema.additionalProperties)) {
                subSchemaFound = true;
                subSchema = subSchema.additionalProperties;
                schemaPointer.push('additionalProperties');
            }
            else if (subSchema.additionalProperties !== false) {
                subSchemaFound = true;
                subSchema = {};
                schemaPointer.push('additionalProperties');
            }
        }
        if (!subSchemaFound) {
            console.error(`getFromSchema error: Unable to find "${key}" item in schema.`);
            console.error(schema);
            console.error(dataPointer);
            return;
        }
    }
    return returnType.slice(-7) === 'Pointer' ? schemaPointer : subSchema;
}
/**
 * 'removeRecursiveReferences' function
 *
 * Checks a JSON Pointer against a map of recursive references and returns
 * a JSON Pointer to the shallowest equivalent location in the same object.
 *
 * Using this functions enables an object to be constructed with unlimited
 * recursion, while maintaing a fixed set of metadata, such as field data types.
 * The object can grow as large as it wants, and deeply recursed nodes can
 * just refer to the metadata for their shallow equivalents, instead of having
 * to add additional redundant metadata for each recursively added node.
 *
 * Example:
 *
 * pointer:         '/stuff/and/more/and/more/and/more/and/more/stuff'
 * recursiveRefMap: [['/stuff/and/more/and/more', '/stuff/and/more/']]
 * returned:        '/stuff/and/more/stuff'
 *
 * //  { Pointer } pointer -
 * //  { Map<string, string> } recursiveRefMap -
 * //  { Map<string, number> = new Map() } arrayMap - optional
 * // { string } -
 * @param {?} pointer
 * @param {?} recursiveRefMap
 * @param {?=} arrayMap
 * @return {?}
 */
export function removeRecursiveReferences(pointer, recursiveRefMap, arrayMap = new Map()) {
    if (!pointer) {
        return '';
    }
    /** @type {?} */
    let genericPointer = JsonPointer.toGenericPointer(JsonPointer.compile(pointer), arrayMap);
    if (genericPointer.indexOf('/') === -1) {
        return genericPointer;
    }
    /** @type {?} */
    let possibleReferences = true;
    while (possibleReferences) {
        possibleReferences = false;
        recursiveRefMap.forEach((toPointer, fromPointer) => {
            if (JsonPointer.isSubPointer(toPointer, fromPointer)) {
                while (JsonPointer.isSubPointer(fromPointer, genericPointer, true)) {
                    genericPointer = JsonPointer.toGenericPointer(toPointer + genericPointer.slice(fromPointer.length), arrayMap);
                    possibleReferences = true;
                }
            }
        });
    }
    return genericPointer;
}
/**
 * 'getInputType' function
 *
 * //   schema
 * //  { any = null } layoutNode
 * // { string }
 * @param {?} schema
 * @param {?=} layoutNode
 * @return {?}
 */
export function getInputType(schema, layoutNode = null) {
    /** @type {?} */
    let controlType = JsonPointer.getFirst([
        [schema, '/x-schema-form/type'],
        [schema, '/x-schema-form/widget/component'],
        [schema, '/x-schema-form/widget'],
        [schema, '/widget/component'],
        [schema, '/widget']
    ]);
    if (isString(controlType)) {
        return checkInlineType(controlType, schema, layoutNode);
    }
    /** @type {?} */
    let schemaType = schema.type;
    if (schemaType) {
        if (isArray(schemaType)) {
            // If multiple types listed, use most inclusive type
            schemaType =
                inArray('object', schemaType) && hasOwn(schema, 'properties') ? 'object' :
                    inArray('array', schemaType) && hasOwn(schema, 'items') ? 'array' :
                        inArray('array', schemaType) && hasOwn(schema, 'additionalItems') ? 'array' :
                            inArray('string', schemaType) ? 'string' :
                                inArray('number', schemaType) ? 'number' :
                                    inArray('integer', schemaType) ? 'integer' :
                                        inArray('boolean', schemaType) ? 'boolean' : 'unknown';
        }
        if (schemaType === 'boolean') {
            return 'checkbox';
        }
        if (schemaType === 'object') {
            if (hasOwn(schema, 'properties') || hasOwn(schema, 'additionalProperties')) {
                return 'section';
            }
            // TODO: Figure out how to handle additionalProperties
            if (hasOwn(schema, '$ref')) {
                return '$ref';
            }
        }
        if (schemaType === 'array') {
            /** @type {?} */
            let itemsObject = JsonPointer.getFirst([
                [schema, '/items'],
                [schema, '/additionalItems']
            ]) || {};
            return hasOwn(itemsObject, 'enum') && schema.maxItems !== 1 ?
                checkInlineType('checkboxes', schema, layoutNode) : 'array';
        }
        if (schemaType === 'null') {
            return 'none';
        }
        if (JsonPointer.has(layoutNode, '/options/titleMap') ||
            hasOwn(schema, 'enum') || getTitleMapFromOneOf(schema, null, true)) {
            return 'select';
        }
        if (schemaType === 'number' || schemaType === 'integer') {
            return (schemaType === 'integer' || hasOwn(schema, 'multipleOf')) &&
                hasOwn(schema, 'maximum') && hasOwn(schema, 'minimum') ? 'range' : schemaType;
        }
        if (schemaType === 'string') {
            return {
                'color': 'color',
                'date': 'date',
                'date-time': 'datetime-local',
                'email': 'email',
                'uri': 'url',
            }[schema.format] || 'text';
        }
    }
    if (hasOwn(schema, '$ref')) {
        return '$ref';
    }
    if (isArray(schema.oneOf) || isArray(schema.anyOf)) {
        return 'one-of';
    }
    console.error(`getInputType error: Unable to determine input type for ${schemaType}`);
    console.error('schema', schema);
    if (layoutNode) {
        console.error('layoutNode', layoutNode);
    }
    return 'none';
}
/**
 * 'checkInlineType' function
 *
 * Checks layout and schema nodes for 'inline: true', and converts
 * 'radios' or 'checkboxes' to 'radios-inline' or 'checkboxes-inline'
 *
 * //  { string } controlType -
 * //   schema -
 * //  { any = null } layoutNode -
 * // { string }
 * @param {?} controlType
 * @param {?} schema
 * @param {?=} layoutNode
 * @return {?}
 */
export function checkInlineType(controlType, schema, layoutNode = null) {
    if (!isString(controlType) || (controlType.slice(0, 8) !== 'checkbox' && controlType.slice(0, 5) !== 'radio')) {
        return controlType;
    }
    if (JsonPointer.getFirst([
        [layoutNode, '/inline'],
        [layoutNode, '/options/inline'],
        [schema, '/inline'],
        [schema, '/x-schema-form/inline'],
        [schema, '/x-schema-form/options/inline'],
        [schema, '/x-schema-form/widget/inline'],
        [schema, '/x-schema-form/widget/component/inline'],
        [schema, '/x-schema-form/widget/component/options/inline'],
        [schema, '/widget/inline'],
        [schema, '/widget/component/inline'],
        [schema, '/widget/component/options/inline'],
    ]) === true) {
        return controlType.slice(0, 5) === 'radio' ?
            'radios-inline' : 'checkboxes-inline';
    }
    else {
        return controlType;
    }
}
/**
 * 'isInputRequired' function
 *
 * Checks a JSON Schema to see if an item is required
 *
 * //   schema - the schema to check
 * //  { string } schemaPointer - the pointer to the item to check
 * // { boolean } - true if the item is required, false if not
 * @param {?} schema
 * @param {?} schemaPointer
 * @return {?}
 */
export function isInputRequired(schema, schemaPointer) {
    if (!isObject(schema)) {
        console.error('isInputRequired error: Input schema must be an object.');
        return false;
    }
    /** @type {?} */
    const listPointerArray = JsonPointer.parse(schemaPointer);
    if (isArray(listPointerArray)) {
        if (!listPointerArray.length) {
            return schema.required === true;
        }
        /** @type {?} */
        const keyName = listPointerArray.pop();
        /** @type {?} */
        const nextToLastKey = listPointerArray[listPointerArray.length - 1];
        if (['properties', 'additionalProperties', 'patternProperties', 'items', 'additionalItems']
            .includes(nextToLastKey)) {
            listPointerArray.pop();
        }
        /** @type {?} */
        const parentSchema = JsonPointer.get(schema, listPointerArray) || {};
        if (isArray(parentSchema.required)) {
            return parentSchema.required.includes(keyName);
        }
        if (parentSchema.type === 'array') {
            return hasOwn(parentSchema, 'minItems') &&
                isNumber(keyName) &&
                +parentSchema.minItems > +keyName;
        }
    }
    return false;
}
;
/**
 * 'updateInputOptions' function
 *
 * //   layoutNode
 * //   schema
 * //   jsf
 * // { void }
 * @param {?} layoutNode
 * @param {?} schema
 * @param {?} jsf
 * @return {?}
 */
export function updateInputOptions(layoutNode, schema, jsf) {
    if (!isObject(layoutNode) || !isObject(layoutNode.options)) {
        return;
    }
    /** @type {?} */
    let newOptions = {};
    /** @type {?} */
    const fixUiKeys = key => key.slice(0, 3).toLowerCase() === 'ui:' ? key.slice(3) : key;
    mergeFilteredObject(newOptions, jsf.formOptions.defautWidgetOptions, [], fixUiKeys);
    [[JsonPointer.get(schema, '/ui:widget/options'), []],
        [JsonPointer.get(schema, '/ui:widget'), []],
        [schema, [
                'additionalProperties', 'additionalItems', 'properties', 'items',
                'required', 'type', 'x-schema-form', '$ref'
            ]],
        [JsonPointer.get(schema, '/x-schema-form/options'), []],
        [JsonPointer.get(schema, '/x-schema-form'), ['items', 'options']],
        [layoutNode, [
                '_id', '$ref', 'arrayItem', 'arrayItemType', 'dataPointer', 'dataType',
                'items', 'key', 'name', 'options', 'recursiveReference', 'type', 'widget'
            ]],
        [layoutNode.options, []],
    ].forEach(([object, excludeKeys]) => mergeFilteredObject(newOptions, object, excludeKeys, fixUiKeys));
    if (!hasOwn(newOptions, 'titleMap')) {
        /** @type {?} */
        let newTitleMap = null;
        newTitleMap = getTitleMapFromOneOf(schema, newOptions.flatList);
        if (newTitleMap) {
            newOptions.titleMap = newTitleMap;
        }
        if (!hasOwn(newOptions, 'titleMap') && !hasOwn(newOptions, 'enum') && hasOwn(schema, 'items')) {
            if (JsonPointer.has(schema, '/items/titleMap')) {
                newOptions.titleMap = schema.items.titleMap;
            }
            else if (JsonPointer.has(schema, '/items/enum')) {
                newOptions.enum = schema.items.enum;
                if (!hasOwn(newOptions, 'enumNames') && JsonPointer.has(schema, '/items/enumNames')) {
                    newOptions.enumNames = schema.items.enumNames;
                }
            }
            else if (JsonPointer.has(schema, '/items/oneOf')) {
                newTitleMap = getTitleMapFromOneOf(schema.items, newOptions.flatList);
                if (newTitleMap) {
                    newOptions.titleMap = newTitleMap;
                }
            }
        }
    }
    // If schema type is integer, enforce by setting multipleOf = 1
    if (schema.type === 'integer' && !hasValue(newOptions.multipleOf)) {
        newOptions.multipleOf = 1;
    }
    // Copy any typeahead word lists to options.typeahead.source
    if (JsonPointer.has(newOptions, '/autocomplete/source')) {
        newOptions.typeahead = newOptions.autocomplete;
    }
    else if (JsonPointer.has(newOptions, '/tagsinput/source')) {
        newOptions.typeahead = newOptions.tagsinput;
    }
    else if (JsonPointer.has(newOptions, '/tagsinput/typeahead/source')) {
        newOptions.typeahead = newOptions.tagsinput.typeahead;
    }
    layoutNode.options = newOptions;
}
/**
 * 'getTitleMapFromOneOf' function
 *
 * //  { schema } schema
 * //  { boolean = null } flatList
 * //  { boolean = false } validateOnly
 * // { validators }
 * @param {?=} schema
 * @param {?=} flatList
 * @param {?=} validateOnly
 * @return {?}
 */
export function getTitleMapFromOneOf(schema = {}, flatList = null, validateOnly = false) {
    /** @type {?} */
    let titleMap = null;
    /** @type {?} */
    const oneOf = schema.oneOf || schema.anyOf || null;
    if (isArray(oneOf) && oneOf.every(item => item.title)) {
        if (oneOf.every(item => isArray(item.enum) && item.enum.length === 1)) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map(item => ({ name: item.title, value: item.enum[0] }));
        }
        else if (oneOf.every(item => item.const)) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map(item => ({ name: item.title, value: item.const }));
        }
        // if flatList !== false and some items have colons, make grouped map
        if (flatList !== false && (titleMap || [])
            .filter(title => ((title || {}).name || '').indexOf(': ')).length > 1) {
            /** @type {?} */
            const newTitleMap = titleMap.map(title => {
                let [group, name] = title.name.split(/: (.+)/);
                return group && name ? Object.assign({}, title, { group, name }) : title;
            });
            // If flatList === true or at least one group has multiple items, use grouped map
            if (flatList === true || newTitleMap.some((title, index) => index &&
                hasOwn(title, 'group') && title.group === newTitleMap[index - 1].group)) {
                titleMap = newTitleMap;
            }
        }
    }
    return validateOnly ? false : titleMap;
}
/**
 * 'getControlValidators' function
 *
 * //  schema
 * // { validators }
 * @param {?} schema
 * @return {?}
 */
export function getControlValidators(schema) {
    if (!isObject(schema)) {
        return null;
    }
    /** @type {?} */
    let validators = {};
    if (hasOwn(schema, 'type')) {
        switch (schema.type) {
            case 'string':
                forEach(['pattern', 'format', 'minLength', 'maxLength'], (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'number':
            case 'integer':
                forEach(['Minimum', 'Maximum'], (ucLimit) => {
                    /** @type {?} */
                    let eLimit = 'exclusive' + ucLimit;
                    /** @type {?} */
                    let limit = ucLimit.toLowerCase();
                    if (hasOwn(schema, limit)) {
                        /** @type {?} */
                        let exclusive = hasOwn(schema, eLimit) && schema[eLimit] === true;
                        validators[limit] = [schema[limit], exclusive];
                    }
                });
                forEach(['multipleOf', 'type'], (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'object':
                forEach(['minProperties', 'maxProperties', 'dependencies'], (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'array':
                forEach(['minItems', 'maxItems', 'uniqueItems'], (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
        }
    }
    if (hasOwn(schema, 'enum')) {
        validators.enum = [schema.enum];
    }
    return validators;
}
/**
 * 'resolveSchemaReferences' function
 *
 * Find all $ref links in schema and save links and referenced schemas in
 * schemaRefLibrary, schemaRecursiveRefMap, and dataRecursiveRefMap
 *
 * //  schema
 * //  schemaRefLibrary
 * // { Map<string, string> } schemaRecursiveRefMap
 * // { Map<string, string> } dataRecursiveRefMap
 * // { Map<string, number> } arrayMap
 * //
 * @param {?} schema
 * @param {?} schemaRefLibrary
 * @param {?} schemaRecursiveRefMap
 * @param {?} dataRecursiveRefMap
 * @param {?} arrayMap
 * @return {?}
 */
export function resolveSchemaReferences(schema, schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, arrayMap) {
    if (!isObject(schema)) {
        console.error('resolveSchemaReferences error: schema must be an object.');
        return;
    }
    /** @type {?} */
    const refLinks = new Set();
    /** @type {?} */
    const refMapSet = new Set();
    /** @type {?} */
    const refMap = new Map();
    /** @type {?} */
    const recursiveRefMap = new Map();
    /** @type {?} */
    const refLibrary = {};
    // Search schema for all $ref links, and build full refLibrary
    JsonPointer.forEachDeep(schema, (subSchema, subSchemaPointer) => {
        if (hasOwn(subSchema, '$ref') && isString(subSchema['$ref'])) {
            /** @type {?} */
            const refPointer = JsonPointer.compile(subSchema['$ref']);
            refLinks.add(refPointer);
            refMapSet.add(subSchemaPointer + '~~' + refPointer);
            refMap.set(subSchemaPointer, refPointer);
        }
    });
    refLinks.forEach(ref => refLibrary[ref] = getSubSchema(schema, ref));
    /** @type {?} */
    let checkRefLinks = true;
    while (checkRefLinks) {
        checkRefLinks = false;
        Array.from(refMap).forEach(([fromRef1, toRef1]) => Array.from(refMap)
            .filter(([fromRef2, toRef2]) => JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
            !JsonPointer.isSubPointer(toRef2, toRef1, true) &&
            !refMapSet.has(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2))
            .forEach(([fromRef2, toRef2]) => {
            refMapSet.add(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2);
            checkRefLinks = true;
        }));
    }
    // Build full recursiveRefMap
    // First pass - save all internally recursive refs from refMapSet
    Array.from(refMapSet)
        .map(refLink => refLink.split('~~'))
        .filter(([fromRef, toRef]) => JsonPointer.isSubPointer(toRef, fromRef))
        .forEach(([fromRef, toRef]) => recursiveRefMap.set(fromRef, toRef));
    // Second pass - create recursive versions of any other refs that link to recursive refs
    Array.from(refMap)
        .filter(([fromRef1, toRef1]) => Array.from(recursiveRefMap.keys())
        .every(fromRef2 => !JsonPointer.isSubPointer(fromRef1, fromRef2, true)))
        .forEach(([fromRef1, toRef1]) => Array.from(recursiveRefMap)
        .filter(([fromRef2, toRef2]) => !recursiveRefMap.has(fromRef1 + fromRef2.slice(toRef1.length)) &&
        JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
        !JsonPointer.isSubPointer(toRef1, fromRef1, true))
        .forEach(([fromRef2, toRef2]) => recursiveRefMap.set(fromRef1 + fromRef2.slice(toRef1.length), fromRef1 + toRef2.slice(toRef1.length))));
    /** @type {?} */
    let compiledSchema = Object.assign({}, schema);
    delete compiledSchema.definitions;
    compiledSchema =
        getSubSchema(compiledSchema, '', refLibrary, recursiveRefMap);
    // Make sure all remaining schema $refs are recursive, and build final
    // schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, & arrayMap
    JsonPointer.forEachDeep(compiledSchema, (subSchema, subSchemaPointer) => {
        if (isString(subSchema['$ref'])) {
            /** @type {?} */
            let refPointer = JsonPointer.compile(subSchema['$ref']);
            if (!JsonPointer.isSubPointer(refPointer, subSchemaPointer, true)) {
                refPointer = removeRecursiveReferences(subSchemaPointer, recursiveRefMap);
                JsonPointer.set(compiledSchema, subSchemaPointer, { $ref: `#${refPointer}` });
            }
            if (!hasOwn(schemaRefLibrary, 'refPointer')) {
                schemaRefLibrary[refPointer] = !refPointer.length ? compiledSchema :
                    getSubSchema(compiledSchema, refPointer, schemaRefLibrary, recursiveRefMap);
            }
            if (!schemaRecursiveRefMap.has(subSchemaPointer)) {
                schemaRecursiveRefMap.set(subSchemaPointer, refPointer);
            }
            /** @type {?} */
            const fromDataRef = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!dataRecursiveRefMap.has(fromDataRef)) {
                /** @type {?} */
                const toDataRef = JsonPointer.toDataPointer(refPointer, compiledSchema);
                dataRecursiveRefMap.set(fromDataRef, toDataRef);
            }
        }
        if (subSchema.type === 'array' &&
            (hasOwn(subSchema, 'items') || hasOwn(subSchema, 'additionalItems'))) {
            /** @type {?} */
            const dataPointer = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!arrayMap.has(dataPointer)) {
                /** @type {?} */
                const tupleItems = isArray(subSchema.items) ? subSchema.items.length : 0;
                arrayMap.set(dataPointer, tupleItems);
            }
        }
    }, true);
    return compiledSchema;
}
/**
 * 'getSubSchema' function
 *
 * //   schema
 * //  { Pointer } pointer
 * //  { object } schemaRefLibrary
 * //  { Map<string, string> } schemaRecursiveRefMap
 * //  { string[] = [] } usedPointers
 * //
 * @param {?} schema
 * @param {?} pointer
 * @param {?=} schemaRefLibrary
 * @param {?=} schemaRecursiveRefMap
 * @param {?=} usedPointers
 * @return {?}
 */
export function getSubSchema(schema, pointer, schemaRefLibrary = null, schemaRecursiveRefMap = null, usedPointers = []) {
    if (!schemaRefLibrary || !schemaRecursiveRefMap) {
        return JsonPointer.getCopy(schema, pointer);
    }
    if (typeof pointer !== 'string') {
        pointer = JsonPointer.compile(pointer);
    }
    usedPointers = [...usedPointers, pointer];
    /** @type {?} */
    let newSchema = null;
    if (pointer === '') {
        newSchema = _.cloneDeep(schema);
    }
    else {
        /** @type {?} */
        const shortPointer = removeRecursiveReferences(pointer, schemaRecursiveRefMap);
        if (shortPointer !== pointer) {
            usedPointers = [...usedPointers, shortPointer];
        }
        newSchema = JsonPointer.getFirstCopy([
            [schemaRefLibrary, [shortPointer]],
            [schema, pointer],
            [schema, shortPointer]
        ]);
    }
    return JsonPointer.forEachDeepCopy(newSchema, (subSchema, subPointer) => {
        if (isObject(subSchema)) {
            // Replace non-recursive $ref links with referenced schemas
            if (isString(subSchema.$ref)) {
                /** @type {?} */
                const refPointer = JsonPointer.compile(subSchema.$ref);
                if (refPointer.length && usedPointers.every(ptr => !JsonPointer.isSubPointer(refPointer, ptr, true))) {
                    /** @type {?} */
                    const refSchema = getSubSchema(schema, refPointer, schemaRefLibrary, schemaRecursiveRefMap, usedPointers);
                    if (Object.keys(subSchema).length === 1) {
                        return refSchema;
                    }
                    else {
                        /** @type {?} */
                        const extraKeys = Object.assign({}, subSchema);
                        delete extraKeys.$ref;
                        return mergeSchemas(refSchema, extraKeys);
                    }
                }
            }
            // TODO: Convert schemas with 'type' arrays to 'oneOf'
            // Combine allOf subSchemas
            if (isArray(subSchema.allOf)) {
                return combineAllOf(subSchema);
            }
            // Fix incorrectly placed array object required lists
            if (subSchema.type === 'array' && isArray(subSchema.required)) {
                return fixRequiredArrayProperties(subSchema);
            }
        }
        return subSchema;
    }, true, /** @type {?} */ (pointer));
}
/**
 * 'combineAllOf' function
 *
 * Attempt to convert an allOf schema object into
 * a non-allOf schema object with equivalent rules.
 *
 * //   schema - allOf schema object
 * //  - converted schema object
 * @param {?} schema
 * @return {?}
 */
export function combineAllOf(schema) {
    if (!isObject(schema) || !isArray(schema.allOf)) {
        return schema;
    }
    /** @type {?} */
    let mergedSchema = mergeSchemas(...schema.allOf);
    if (Object.keys(schema).length > 1) {
        /** @type {?} */
        const extraKeys = Object.assign({}, schema);
        delete extraKeys.allOf;
        mergedSchema = mergeSchemas(mergedSchema, extraKeys);
    }
    return mergedSchema;
}
/**
 * 'fixRequiredArrayProperties' function
 *
 * Fixes an incorrectly placed required list inside an array schema, by moving
 * it into items.properties or additionalItems.properties, where it belongs.
 *
 * //   schema - allOf schema object
 * //  - converted schema object
 * @param {?} schema
 * @return {?}
 */
export function fixRequiredArrayProperties(schema) {
    if (schema.type === 'array' && isArray(schema.required)) {
        /** @type {?} */
        let itemsObject = hasOwn(schema.items, 'properties') ? 'items' :
            hasOwn(schema.additionalItems, 'properties') ? 'additionalItems' : null;
        if (itemsObject && !hasOwn(schema[itemsObject], 'required') && (hasOwn(schema[itemsObject], 'additionalProperties') ||
            schema.required.every(key => hasOwn(schema[itemsObject].properties, key)))) {
            schema = _.cloneDeep(schema);
            schema[itemsObject].required = schema.required;
            delete schema.required;
        }
    }
    return schema;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEuZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvanNvbi1zY2hlbWEuZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUU1QixPQUFPLEVBQ0wsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUF1QixRQUFRLEVBQUUsUUFBUSxFQUM1RSxRQUFRLEVBQ1QsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsT0FBTyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsRUFDckMsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFdBQVcsRUFBVyxNQUFNLHlCQUF5QixDQUFDOzs7Ozs7Ozs7OztBQTJDL0QsTUFBTSxnQ0FBZ0MsTUFBTTtJQUMxQyxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBdUJSOzs7Ozs7Ozs7Ozs7Ozs7QUFZRCxNQUFNLDhCQUNKLElBQUksRUFBRSxnQkFBZ0IsR0FBRyxLQUFLLEVBQUUsTUFBTSxHQUFHLElBQUk7O0lBRTdDLElBQUksU0FBUyxHQUFRLEVBQUUsQ0FBQzs7SUFDeEIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFVLEVBQVUsRUFBRTs7UUFDMUMsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxTQUFTLENBQUM7S0FDdEUsQ0FBQzs7SUFDRixNQUFNLGNBQWMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQy9CLG1CQUFtQixDQUFD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O1lBQ3RFLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzthQUFFO1lBQ2xDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzNFO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzthQUFFO1lBQ2xDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3pFOztRQUdELEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxLQUFLLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO2FBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUN0RSxDQUFDLENBQUMsQ0FBQzs7WUFHRCxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMs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SyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FDMUUsQ0FBQyxDQUFDLENBQUM7WUFDRixNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDL0MsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQ3hCO0tBQ0Y7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0NBQ2YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGdldFR5cGUsIGhhc1ZhbHVlLCBpbkFycmF5LCBpc0FycmF5LCBpc0VtcHR5LCBpc0Z1bmN0aW9uLCBpc051bWJlciwgaXNPYmplY3QsXG4gIGlzU3RyaW5nXG59IGZyb20gJy4vdmFsaWRhdG9yLmZ1bmN0aW9ucyc7XG5pbXBvcnQge1xuICBmb3JFYWNoLCBoYXNPd24sIG1lcmdlRmlsdGVyZWRPYmplY3QsIHVuaXF1ZUl0ZW1zLCBjb21tb25JdGVtc1xufSBmcm9tICcuL3V0aWxpdHkuZnVuY3Rpb25zJztcbmltcG9ydCB7IG1lcmdlU2NoZW1hcyB9IGZyb20gJy4vbWVyZ2Utc2NoZW1hcy5mdW5jdGlvbic7XG5pbXBvcnQgeyBKc29uUG9pbnRlciwgUG9pbnRlciB9IGZyb20gJy4vanNvbnBvaW50ZXIuZnVuY3Rpb25zJztcbmltcG9ydCB7IEpzb25WYWxpZGF0b3JzIH0gZnJvbSAnLi9qc29uLnZhbGlkYXRvcnMnO1xuXG4vKipcbiAqIEpTT04gU2NoZW1hIGZ1bmN0aW9uIGxpYnJhcnk6XG4gKlxuICogYnVpbGRTY2hlbWFGcm9tTGF5b3V0OiAgIFRPRE86IFdyaXRlIHRoaXMgZnVuY3Rpb25cbiAqXG4gKiBidWlsZFNjaGVtYUZyb21EYXRhOlxuICpcbiAqIGdldEZyb21TY2hlbWE6XG4gKlxuICogcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlczpcbiAqXG4gKiBnZXRJbnB1dFR5cGU6XG4gKlxuICogY2hlY2tJbmxpbmVUeXBlOlxuICpcbiAqIGlzSW5wdXRSZXF1aXJlZDpcbiAqXG4gKiB1cGRhdGVJbnB1dE9wdGlvbnM6XG4gKlxuICogZ2V0VGl0bGVNYXBGcm9tT25lT2Y6XG4gKlxuICogZ2V0Q29udHJvbFZhbGlkYXRvcnM6XG4gKlxuICogcmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXM6XG4gKlxuICogZ2V0U3ViU2NoZW1hOlxuICpcbiAqIGNvbWJpbmVBbGxPZjpcbiAqXG4gKiBmaXhSZXF1aXJlZEFycmF5UHJvcGVydGllczpcbiAqL1xuXG4vKipcbiAqICdidWlsZFNjaGVtYUZyb21MYXlvdXQnIGZ1bmN0aW9uXG4gKlxuICogVE9ETzogQnVpbGQgYSBKU09OIFNjaGVtYSBmcm9tIGEgSlNPTiBGb3JtIGxheW91dFxuICpcbiAqIC8vICAgbGF5b3V0IC0gVGhlIEpTT04gRm9ybSBsYXlvdXRcbiAqIC8vICAtIFRoZSBuZXcgSlNPTiBTY2hlbWFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2NoZW1hRnJvbUxheW91dChsYXlvdXQpIHtcbiAgcmV0dXJuO1xuICAvLyBsZXQgbmV3U2NoZW1hOiBhbnkgPSB7IH07XG4gIC8vIGNvbnN0IHdhbGtMYXlvdXQgPSAobGF5b3V0SXRlbXM6IGFueVtdLCBjYWxsYmFjazogRnVuY3Rpb24pOiBhbnlbXSA9PiB7XG4gIC8vICAgbGV0IHJldHVybkFycmF5OiBhbnlbXSA9IFtdO1xuICAvLyAgIGZvciAobGV0IGxheW91dEl0ZW0gb2YgbGF5b3V0SXRlbXMpIHtcbiAgLy8gICAgIGNvbnN0IHJldHVybkl0ZW06IGFueSA9IGNhbGxiYWNrKGxheW91dEl0ZW0pO1xuICAvLyAgICAgaWYgKHJldHVybkl0ZW0pIHsgcmV0dXJuQXJyYXkgPSByZXR1cm5BcnJheS5jb25jYXQoY2FsbGJhY2sobGF5b3V0SXRlbSkpOyB9XG4gIC8vICAgICBpZiAobGF5b3V0SXRlbS5pdGVtcykge1xuICAvLyAgICAgICByZXR1cm5BcnJheSA9IHJldHVybkFycmF5LmNvbmNhdCh3YWxrTGF5b3V0KGxheW91dEl0ZW0uaXRlbXMsIGNhbGxiYWNrKSk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiByZXR1cm5BcnJheTtcbiAgLy8gfTtcbiAgLy8gd2Fsa0xheW91dChsYXlvdXQsIGxheW91dEl0ZW0gPT4ge1xuICAvLyAgIGxldCBpdGVtS2V5OiBzdHJpbmc7XG4gIC8vICAgaWYgKHR5cGVvZiBsYXlvdXRJdGVtID09PSAnc3RyaW5nJykge1xuICAvLyAgICAgaXRlbUtleSA9IGxheW91dEl0ZW07XG4gIC8vICAgfSBlbHNlIGlmIChsYXlvdXRJdGVtLmtleSkge1xuICAvLyAgICAgaXRlbUtleSA9IGxheW91dEl0ZW0ua2V5O1xuICAvLyAgIH1cbiAgLy8gICBpZiAoIWl0ZW1LZXkpIHsgcmV0dXJuOyB9XG4gIC8vICAgLy9cbiAgLy8gfSk7XG59XG5cbi8qKlxuICogJ2J1aWxkU2NoZW1hRnJvbURhdGEnIGZ1bmN0aW9uXG4gKlxuICogQnVpbGQgYSBKU09OIFNjaGVtYSBmcm9tIGEgZGF0YSBvYmplY3RcbiAqXG4gKiAvLyAgIGRhdGEgLSBUaGUgZGF0YSBvYmplY3RcbiAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IHJlcXVpcmVBbGxGaWVsZHMgLSBSZXF1aXJlIGFsbCBmaWVsZHM/XG4gKiAvLyAgeyBib29sZWFuID0gdHJ1ZSB9IGlzUm9vdCAtIGlzIHJvb3RcbiAqIC8vICAtIFRoZSBuZXcgSlNPTiBTY2hlbWFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2NoZW1hRnJvbURhdGEoXG4gIGRhdGEsIHJlcXVpcmVBbGxGaWVsZHMgPSBmYWxzZSwgaXNSb290ID0gdHJ1ZVxuKSB7XG4gIGxldCBuZXdTY2hlbWE6IGFueSA9IHt9O1xuICBjb25zdCBnZXRGaWVsZFR5cGUgPSAodmFsdWU6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZmllbGRUeXBlID0gZ2V0VHlwZSh2YWx1ZSwgJ3N0cmljdCcpO1xuICAgIHJldHVybiB7IGludGVnZXI6ICdudW1iZXInLCBudWxsOiAnc3RyaW5nJyB9W2ZpZWxkVHlwZV0gfHwgZmllbGRUeXBlO1xuICB9O1xuICBjb25zdCBidWlsZFN1YlNjaGVtYSA9ICh2YWx1ZSkgPT5cbiAgICBidWlsZFNjaGVtYUZyb21EYXRhKHZhbHVlLCByZXF1aXJlQWxsRmllbGRzLCBmYWxzZSk7XG4gIGlmIChpc1Jvb3QpIHsgbmV3U2NoZW1hLiRzY2hlbWEgPSAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNi9zY2hlbWEjJzsgfVxuICBuZXdTY2hlbWEudHlwZSA9IGdldEZpZWxkVHlwZShkYXRhKTtcbiAgaWYgKG5ld1NjaGVtYS50eXBlID09PSAnb2JqZWN0Jykge1xuICAgIG5ld1NjaGVtYS5wcm9wZXJ0aWVzID0ge307XG4gICAgaWYgKHJlcXVpcmVBbGxGaWVsZHMpIHsgbmV3U2NoZW1hLnJlcXVpcmVkID0gW107IH1cbiAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZGF0YSkpIHtcbiAgICAgIG5ld1NjaGVtYS5wcm9wZXJ0aWVzW2tleV0gPSBidWlsZFN1YlNjaGVtYShkYXRhW2tleV0pO1xuICAgICAgaWYgKHJlcXVpcmVBbGxGaWVsZHMpIHsgbmV3U2NoZW1hLnJlcXVpcmVkLnB1c2goa2V5KTsgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChuZXdTY2hlbWEudHlwZSA9PT0gJ2FycmF5Jykge1xuICAgIG5ld1NjaGVtYS5pdGVtcyA9IGRhdGEubWFwKGJ1aWxkU3ViU2NoZW1hKTtcbiAgICAvLyBJZiBhbGwgaXRlbXMgYXJlIHRoZSBzYW1lIHR5cGUsIHVzZSBhbiBvYmplY3QgZm9yIGl0ZW1zIGluc3RlYWQgb2YgYW4gYXJyYXlcbiAgICBpZiAoKG5ldyBTZXQoZGF0YS5tYXAoZ2V0RmllbGRUeXBlKSkpLnNpemUgPT09IDEpIHtcbiAgICAgIG5ld1NjaGVtYS5pdGVtcyA9IG5ld1NjaGVtYS5pdGVtcy5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KTtcbiAgICB9XG4gICAgaWYgKHJlcXVpcmVBbGxGaWVsZHMpIHsgbmV3U2NoZW1hLm1pbkl0ZW1zID0gMTsgfVxuICB9XG4gIHJldHVybiBuZXdTY2hlbWE7XG59XG5cbi8qKlxuICogJ2dldEZyb21TY2hlbWEnIGZ1bmN0aW9uXG4gKlxuICogVXNlcyBhIEpTT04gUG9pbnRlciBmb3IgYSB2YWx1ZSB3aXRoaW4gYSBkYXRhIG9iamVjdCB0byByZXRyaWV2ZVxuICogdGhlIHNjaGVtYSBmb3IgdGhhdCB2YWx1ZSB3aXRoaW4gc2NoZW1hIGZvciB0aGUgZGF0YSBvYmplY3QuXG4gKlxuICogVGhlIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlciBjYW4gYWxzbyBiZSBzZXQgdG8gcmV0dXJuIHNvbWV0aGluZyBlbHNlOlxuICogJ3NjaGVtYScgKGRlZmF1bHQpOiB0aGUgc2NoZW1hIGZvciB0aGUgdmFsdWUgaW5kaWNhdGVkIGJ5IHRoZSBkYXRhIHBvaW50ZXJcbiAqICdwYXJlbnRTY2hlbWEnOiB0aGUgc2NoZW1hIGZvciB0aGUgdmFsdWUncyBwYXJlbnQgb2JqZWN0IG9yIGFycmF5XG4gKiAnc2NoZW1hUG9pbnRlcic6IGEgcG9pbnRlciB0byB0aGUgdmFsdWUncyBzY2hlbWEgd2l0aGluIHRoZSBvYmplY3QncyBzY2hlbWFcbiAqICdwYXJlbnRTY2hlbWFQb2ludGVyJzogYSBwb2ludGVyIHRvIHRoZSBzY2hlbWEgZm9yIHRoZSB2YWx1ZSdzIHBhcmVudCBvYmplY3Qgb3IgYXJyYXlcbiAqXG4gKiAvLyAgIHNjaGVtYSAtIFRoZSBzY2hlbWEgdG8gZ2V0IHRoZSBzdWItc2NoZW1hIGZyb21cbiAqIC8vICB7IFBvaW50ZXIgfSBkYXRhUG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICogLy8gIHsgc3RyaW5nID0gJ3NjaGVtYScgfSByZXR1cm5UeXBlIC0gd2hhdCB0byByZXR1cm4/XG4gKiAvLyAgLSBUaGUgbG9jYXRlZCBzdWItc2NoZW1hXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGcm9tU2NoZW1hKHNjaGVtYSwgZGF0YVBvaW50ZXIsIHJldHVyblR5cGUgPSAnc2NoZW1hJykge1xuICBjb25zdCBkYXRhUG9pbnRlckFycmF5OiBhbnlbXSA9IEpzb25Qb2ludGVyLnBhcnNlKGRhdGFQb2ludGVyKTtcbiAgaWYgKGRhdGFQb2ludGVyQXJyYXkgPT09IG51bGwpIHtcbiAgICBjb25zb2xlLmVycm9yKGBnZXRGcm9tU2NoZW1hIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtkYXRhUG9pbnRlcn1gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBsZXQgc3ViU2NoZW1hID0gc2NoZW1hO1xuICBjb25zdCBzY2hlbWFQb2ludGVyID0gW107XG4gIGNvbnN0IGxlbmd0aCA9IGRhdGFQb2ludGVyQXJyYXkubGVuZ3RoO1xuICBpZiAocmV0dXJuVHlwZS5zbGljZSgwLCA2KSA9PT0gJ3BhcmVudCcpIHsgZGF0YVBvaW50ZXJBcnJheS5sZW5ndGgtLTsgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgcGFyZW50U2NoZW1hID0gc3ViU2NoZW1hO1xuICAgIGNvbnN0IGtleSA9IGRhdGFQb2ludGVyQXJyYXlbaV07XG4gICAgbGV0IHN1YlNjaGVtYUZvdW5kID0gZmFsc2U7XG4gICAgaWYgKHR5cGVvZiBzdWJTY2hlbWEgIT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBnZXRGcm9tU2NoZW1hIGVycm9yOiBVbmFibGUgdG8gZmluZCBcIiR7a2V5fVwiIGtleSBpbiBzY2hlbWEuYCk7XG4gICAgICBjb25zb2xlLmVycm9yKHNjaGVtYSk7XG4gICAgICBjb25zb2xlLmVycm9yKGRhdGFQb2ludGVyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoc3ViU2NoZW1hLnR5cGUgPT09ICdhcnJheScgJiYgKCFpc05hTihrZXkpIHx8IGtleSA9PT0gJy0nKSkge1xuICAgICAgaWYgKGhhc093bihzdWJTY2hlbWEsICdpdGVtcycpKSB7XG4gICAgICAgIGlmIChpc09iamVjdChzdWJTY2hlbWEuaXRlbXMpKSB7XG4gICAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICAgIHN1YlNjaGVtYSA9IHN1YlNjaGVtYS5pdGVtcztcbiAgICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ2l0ZW1zJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShzdWJTY2hlbWEuaXRlbXMpKSB7XG4gICAgICAgICAgaWYgKCFpc05hTihrZXkpICYmIHN1YlNjaGVtYS5pdGVtcy5sZW5ndGggPj0gK2tleSkge1xuICAgICAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgc3ViU2NoZW1hID0gc3ViU2NoZW1hLml0ZW1zWytrZXldO1xuICAgICAgICAgICAgc2NoZW1hUG9pbnRlci5wdXNoKCdpdGVtcycsIGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXN1YlNjaGVtYUZvdW5kICYmIGlzT2JqZWN0KHN1YlNjaGVtYS5hZGRpdGlvbmFsSXRlbXMpKSB7XG4gICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgc3ViU2NoZW1hID0gc3ViU2NoZW1hLmFkZGl0aW9uYWxJdGVtcztcbiAgICAgICAgc2NoZW1hUG9pbnRlci5wdXNoKCdhZGRpdGlvbmFsSXRlbXMnKTtcbiAgICAgIH0gZWxzZSBpZiAoc3ViU2NoZW1hLmFkZGl0aW9uYWxJdGVtcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICBzdWJTY2hlbWEgPSB7IH07XG4gICAgICAgIHNjaGVtYVBvaW50ZXIucHVzaCgnYWRkaXRpb25hbEl0ZW1zJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdWJTY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc09iamVjdChzdWJTY2hlbWEucHJvcGVydGllcykgJiYgaGFzT3duKHN1YlNjaGVtYS5wcm9wZXJ0aWVzLCBrZXkpKSB7XG4gICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZVxuICAgICAgICBzdWJTY2hlbWEgPSBzdWJTY2hlbWEucHJvcGVydGllc1trZXldO1xuICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ3Byb3BlcnRpZXMnLCBrZXkpO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChzdWJTY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXMpKSB7XG4gICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZVxuICAgICAgICBzdWJTY2hlbWEgPSBzdWJTY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXM7XG4gICAgICAgIHNjaGVtYVBvaW50ZXIucHVzaCgnYWRkaXRpb25hbFByb3BlcnRpZXMnKTtcbiAgICAgIH0gZWxzZSBpZiAoc3ViU2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzICE9PSBmYWxzZSkge1xuICAgICAgICBzdWJTY2hlbWFGb3VuZCA9IHRydWVcbiAgICAgICAgc3ViU2NoZW1hID0geyB9O1xuICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghc3ViU2NoZW1hRm91bmQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGdldEZyb21TY2hlbWEgZXJyb3I6IFVuYWJsZSB0byBmaW5kIFwiJHtrZXl9XCIgaXRlbSBpbiBzY2hlbWEuYCk7XG4gICAgICBjb25zb2xlLmVycm9yKHNjaGVtYSk7XG4gICAgICBjb25zb2xlLmVycm9yKGRhdGFQb2ludGVyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldHVyblR5cGUuc2xpY2UoLTcpID09PSAnUG9pbnRlcicgPyBzY2hlbWFQb2ludGVyIDogc3ViU2NoZW1hO1xufVxuXG4vKipcbiAqICdyZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzJyBmdW5jdGlvblxuICpcbiAqIENoZWNrcyBhIEpTT04gUG9pbnRlciBhZ2FpbnN0IGEgbWFwIG9mIHJlY3Vyc2l2ZSByZWZlcmVuY2VzIGFuZCByZXR1cm5zXG4gKiBhIEpTT04gUG9pbnRlciB0byB0aGUgc2hhbGxvd2VzdCBlcXVpdmFsZW50IGxvY2F0aW9uIGluIHRoZSBzYW1lIG9iamVjdC5cbiAqXG4gKiBVc2luZyB0aGlzIGZ1bmN0aW9ucyBlbmFibGVzIGFuIG9iamVjdCB0byBiZSBjb25zdHJ1Y3RlZCB3aXRoIHVubGltaXRlZFxuICogcmVjdXJzaW9uLCB3aGlsZSBtYWludGFpbmcgYSBmaXhlZCBzZXQgb2YgbWV0YWRhdGEsIHN1Y2ggYXMgZmllbGQgZGF0YSB0eXBlcy5cbiAqIFRoZSBvYmplY3QgY2FuIGdyb3cgYXMgbGFyZ2UgYXMgaXQgd2FudHMsIGFuZCBkZWVwbHkgcmVjdXJzZWQgbm9kZXMgY2FuXG4gKiBqdXN0IHJlZmVyIHRvIHRoZSBtZXRhZGF0YSBmb3IgdGhlaXIgc2hhbGxvdyBlcXVpdmFsZW50cywgaW5zdGVhZCBvZiBoYXZpbmdcbiAqIHRvIGFkZCBhZGRpdGlvbmFsIHJlZHVuZGFudCBtZXRhZGF0YSBmb3IgZWFjaCByZWN1cnNpdmVseSBhZGRlZCBub2RlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogcG9pbnRlcjogICAgICAgICAnL3N0dWZmL2FuZC9tb3JlL2FuZC9tb3JlL2FuZC9tb3JlL2FuZC9tb3JlL3N0dWZmJ1xuICogcmVjdXJzaXZlUmVmTWFwOiBbWycvc3R1ZmYvYW5kL21vcmUvYW5kL21vcmUnLCAnL3N0dWZmL2FuZC9tb3JlLyddXVxuICogcmV0dXJuZWQ6ICAgICAgICAnL3N0dWZmL2FuZC9tb3JlL3N0dWZmJ1xuICpcbiAqIC8vICB7IFBvaW50ZXIgfSBwb2ludGVyIC1cbiAqIC8vICB7IE1hcDxzdHJpbmcsIHN0cmluZz4gfSByZWN1cnNpdmVSZWZNYXAgLVxuICogLy8gIHsgTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKSB9IGFycmF5TWFwIC0gb3B0aW9uYWxcbiAqIC8vIHsgc3RyaW5nIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgcG9pbnRlciwgcmVjdXJzaXZlUmVmTWFwLCBhcnJheU1hcCA9IG5ldyBNYXAoKVxuKSB7XG4gIGlmICghcG9pbnRlcikgeyByZXR1cm4gJyc7IH1cbiAgbGV0IGdlbmVyaWNQb2ludGVyID1cbiAgICBKc29uUG9pbnRlci50b0dlbmVyaWNQb2ludGVyKEpzb25Qb2ludGVyLmNvbXBpbGUocG9pbnRlciksIGFycmF5TWFwKTtcbiAgaWYgKGdlbmVyaWNQb2ludGVyLmluZGV4T2YoJy8nKSA9PT0gLTEpIHsgcmV0dXJuIGdlbmVyaWNQb2ludGVyOyB9XG4gIGxldCBwb3NzaWJsZVJlZmVyZW5jZXMgPSB0cnVlO1xuICB3aGlsZSAocG9zc2libGVSZWZlcmVuY2VzKSB7XG4gICAgcG9zc2libGVSZWZlcmVuY2VzID0gZmFsc2U7XG4gICAgcmVjdXJzaXZlUmVmTWFwLmZvckVhY2goKHRvUG9pbnRlciwgZnJvbVBvaW50ZXIpID0+IHtcbiAgICAgIGlmIChKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9Qb2ludGVyLCBmcm9tUG9pbnRlcikpIHtcbiAgICAgICAgd2hpbGUgKEpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcihmcm9tUG9pbnRlciwgZ2VuZXJpY1BvaW50ZXIsIHRydWUpKSB7XG4gICAgICAgICAgZ2VuZXJpY1BvaW50ZXIgPSBKc29uUG9pbnRlci50b0dlbmVyaWNQb2ludGVyKFxuICAgICAgICAgICAgdG9Qb2ludGVyICsgZ2VuZXJpY1BvaW50ZXIuc2xpY2UoZnJvbVBvaW50ZXIubGVuZ3RoKSwgYXJyYXlNYXBcbiAgICAgICAgICApO1xuICAgICAgICAgIHBvc3NpYmxlUmVmZXJlbmNlcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZ2VuZXJpY1BvaW50ZXI7XG59XG5cbi8qKlxuICogJ2dldElucHV0VHlwZScgZnVuY3Rpb25cbiAqXG4gKiAvLyAgIHNjaGVtYVxuICogLy8gIHsgYW55ID0gbnVsbCB9IGxheW91dE5vZGVcbiAqIC8vIHsgc3RyaW5nIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldElucHV0VHlwZShzY2hlbWEsIGxheW91dE5vZGU6IGFueSA9IG51bGwpIHtcbiAgLy8geC1zY2hlbWEtZm9ybSA9IEFuZ3VsYXIgU2NoZW1hIEZvcm0gY29tcGF0aWJpbGl0eVxuICAvLyB3aWRnZXQgJiBjb21wb25lbnQgPSBSZWFjdCBKc29uc2NoZW1hIEZvcm0gY29tcGF0aWJpbGl0eVxuICBsZXQgY29udHJvbFR5cGUgPSBKc29uUG9pbnRlci5nZXRGaXJzdChbXG4gICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL3R5cGUnXSxcbiAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vd2lkZ2V0L2NvbXBvbmVudCddLFxuICAgIFtzY2hlbWEsICcveC1zY2hlbWEtZm9ybS93aWRnZXQnXSxcbiAgICBbc2NoZW1hLCAnL3dpZGdldC9jb21wb25lbnQnXSxcbiAgICBbc2NoZW1hLCAnL3dpZGdldCddXG4gIF0pO1xuICBpZiAoaXNTdHJpbmcoY29udHJvbFR5cGUpKSB7IHJldHVybiBjaGVja0lubGluZVR5cGUoY29udHJvbFR5cGUsIHNjaGVtYSwgbGF5b3V0Tm9kZSk7IH1cbiAgbGV0IHNjaGVtYVR5cGUgPSBzY2hlbWEudHlwZTtcbiAgaWYgKHNjaGVtYVR5cGUpIHtcbiAgICBpZiAoaXNBcnJheShzY2hlbWFUeXBlKSkgeyAvLyBJZiBtdWx0aXBsZSB0eXBlcyBsaXN0ZWQsIHVzZSBtb3N0IGluY2x1c2l2ZSB0eXBlXG4gICAgICBzY2hlbWFUeXBlID1cbiAgICAgICAgaW5BcnJheSgnb2JqZWN0Jywgc2NoZW1hVHlwZSkgJiYgaGFzT3duKHNjaGVtYSwgJ3Byb3BlcnRpZXMnKSA/ICdvYmplY3QnIDpcbiAgICAgICAgaW5BcnJheSgnYXJyYXknLCBzY2hlbWFUeXBlKSAmJiBoYXNPd24oc2NoZW1hLCAnaXRlbXMnKSA/ICdhcnJheScgOlxuICAgICAgICBpbkFycmF5KCdhcnJheScsIHNjaGVtYVR5cGUpICYmIGhhc093bihzY2hlbWEsICdhZGRpdGlvbmFsSXRlbXMnKSA/ICdhcnJheScgOlxuICAgICAgICBpbkFycmF5KCdzdHJpbmcnLCBzY2hlbWFUeXBlKSA/ICdzdHJpbmcnIDpcbiAgICAgICAgaW5BcnJheSgnbnVtYmVyJywgc2NoZW1hVHlwZSkgPyAnbnVtYmVyJyA6XG4gICAgICAgIGluQXJyYXkoJ2ludGVnZXInLCBzY2hlbWFUeXBlKSA/ICdpbnRlZ2VyJyA6XG4gICAgICAgIGluQXJyYXkoJ2Jvb2xlYW4nLCBzY2hlbWFUeXBlKSA/ICdib29sZWFuJyA6ICd1bmtub3duJztcbiAgICB9XG4gICAgaWYgKHNjaGVtYVR5cGUgPT09ICdib29sZWFuJykgeyByZXR1cm4gJ2NoZWNrYm94JzsgfVxuICAgIGlmIChzY2hlbWFUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGhhc093bihzY2hlbWEsICdwcm9wZXJ0aWVzJykgfHwgaGFzT3duKHNjaGVtYSwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJykpIHtcbiAgICAgICAgcmV0dXJuICdzZWN0aW9uJztcbiAgICAgIH1cbiAgICAgIC8vIFRPRE86IEZpZ3VyZSBvdXQgaG93IHRvIGhhbmRsZSBhZGRpdGlvbmFsUHJvcGVydGllc1xuICAgICAgaWYgKGhhc093bihzY2hlbWEsICckcmVmJykpIHsgcmV0dXJuICckcmVmJzsgfVxuICAgIH1cbiAgICBpZiAoc2NoZW1hVHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgbGV0IGl0ZW1zT2JqZWN0ID0gSnNvblBvaW50ZXIuZ2V0Rmlyc3QoW1xuICAgICAgICBbc2NoZW1hLCAnL2l0ZW1zJ10sXG4gICAgICAgIFtzY2hlbWEsICcvYWRkaXRpb25hbEl0ZW1zJ11cbiAgICAgIF0pIHx8IHt9O1xuICAgICAgcmV0dXJuIGhhc093bihpdGVtc09iamVjdCwgJ2VudW0nKSAmJiBzY2hlbWEubWF4SXRlbXMgIT09IDEgP1xuICAgICAgICBjaGVja0lubGluZVR5cGUoJ2NoZWNrYm94ZXMnLCBzY2hlbWEsIGxheW91dE5vZGUpIDogJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHNjaGVtYVR5cGUgPT09ICdudWxsJykgeyByZXR1cm4gJ25vbmUnOyB9XG4gICAgaWYgKEpzb25Qb2ludGVyLmhhcyhsYXlvdXROb2RlLCAnL29wdGlvbnMvdGl0bGVNYXAnKSB8fFxuICAgICAgaGFzT3duKHNjaGVtYSwgJ2VudW0nKSB8fCBnZXRUaXRsZU1hcEZyb21PbmVPZihzY2hlbWEsIG51bGwsIHRydWUpXG4gICAgKSB7IHJldHVybiAnc2VsZWN0JzsgfVxuICAgIGlmIChzY2hlbWFUeXBlID09PSAnbnVtYmVyJyB8fCBzY2hlbWFUeXBlID09PSAnaW50ZWdlcicpIHtcbiAgICAgIHJldHVybiAoc2NoZW1hVHlwZSA9PT0gJ2ludGVnZXInIHx8IGhhc093bihzY2hlbWEsICdtdWx0aXBsZU9mJykpICYmXG4gICAgICAgIGhhc093bihzY2hlbWEsICdtYXhpbXVtJykgJiYgaGFzT3duKHNjaGVtYSwgJ21pbmltdW0nKSA/ICdyYW5nZScgOiBzY2hlbWFUeXBlO1xuICAgIH1cbiAgICBpZiAoc2NoZW1hVHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdjb2xvcic6ICdjb2xvcicsXG4gICAgICAgICdkYXRlJzogJ2RhdGUnLFxuICAgICAgICAnZGF0ZS10aW1lJzogJ2RhdGV0aW1lLWxvY2FsJyxcbiAgICAgICAgJ2VtYWlsJzogJ2VtYWlsJyxcbiAgICAgICAgJ3VyaSc6ICd1cmwnLFxuICAgICAgfVtzY2hlbWEuZm9ybWF0XSB8fCAndGV4dCc7XG4gICAgfVxuICB9XG4gIGlmIChoYXNPd24oc2NoZW1hLCAnJHJlZicpKSB7IHJldHVybiAnJHJlZic7IH1cbiAgaWYgKGlzQXJyYXkoc2NoZW1hLm9uZU9mKSB8fCBpc0FycmF5KHNjaGVtYS5hbnlPZikpIHsgcmV0dXJuICdvbmUtb2YnOyB9XG4gIGNvbnNvbGUuZXJyb3IoYGdldElucHV0VHlwZSBlcnJvcjogVW5hYmxlIHRvIGRldGVybWluZSBpbnB1dCB0eXBlIGZvciAke3NjaGVtYVR5cGV9YCk7XG4gIGNvbnNvbGUuZXJyb3IoJ3NjaGVtYScsIHNjaGVtYSk7XG4gIGlmIChsYXlvdXROb2RlKSB7IGNvbnNvbGUuZXJyb3IoJ2xheW91dE5vZGUnLCBsYXlvdXROb2RlKTsgfVxuICByZXR1cm4gJ25vbmUnO1xufVxuXG4vKipcbiAqICdjaGVja0lubGluZVR5cGUnIGZ1bmN0aW9uXG4gKlxuICogQ2hlY2tzIGxheW91dCBhbmQgc2NoZW1hIG5vZGVzIGZvciAnaW5saW5lOiB0cnVlJywgYW5kIGNvbnZlcnRzXG4gKiAncmFkaW9zJyBvciAnY2hlY2tib3hlcycgdG8gJ3JhZGlvcy1pbmxpbmUnIG9yICdjaGVja2JveGVzLWlubGluZSdcbiAqXG4gKiAvLyAgeyBzdHJpbmcgfSBjb250cm9sVHlwZSAtXG4gKiAvLyAgIHNjaGVtYSAtXG4gKiAvLyAgeyBhbnkgPSBudWxsIH0gbGF5b3V0Tm9kZSAtXG4gKiAvLyB7IHN0cmluZyB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0lubGluZVR5cGUoY29udHJvbFR5cGUsIHNjaGVtYSwgbGF5b3V0Tm9kZTogYW55ID0gbnVsbCkge1xuICBpZiAoIWlzU3RyaW5nKGNvbnRyb2xUeXBlKSB8fCAoXG4gICAgY29udHJvbFR5cGUuc2xpY2UoMCwgOCkgIT09ICdjaGVja2JveCcgJiYgY29udHJvbFR5cGUuc2xpY2UoMCwgNSkgIT09ICdyYWRpbydcbiAgKSkge1xuICAgIHJldHVybiBjb250cm9sVHlwZTtcbiAgfVxuICBpZiAoXG4gICAgSnNvblBvaW50ZXIuZ2V0Rmlyc3QoW1xuICAgICAgW2xheW91dE5vZGUsICcvaW5saW5lJ10sXG4gICAgICBbbGF5b3V0Tm9kZSwgJy9vcHRpb25zL2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy9pbmxpbmUnXSxcbiAgICAgIFtzY2hlbWEsICcveC1zY2hlbWEtZm9ybS9pbmxpbmUnXSxcbiAgICAgIFtzY2hlbWEsICcveC1zY2hlbWEtZm9ybS9vcHRpb25zL2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL3dpZGdldC9pbmxpbmUnXSxcbiAgICAgIFtzY2hlbWEsICcveC1zY2hlbWEtZm9ybS93aWRnZXQvY29tcG9uZW50L2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL3dpZGdldC9jb21wb25lbnQvb3B0aW9ucy9pbmxpbmUnXSxcbiAgICAgIFtzY2hlbWEsICcvd2lkZ2V0L2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy93aWRnZXQvY29tcG9uZW50L2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy93aWRnZXQvY29tcG9uZW50L29wdGlvbnMvaW5saW5lJ10sXG4gICAgXSkgPT09IHRydWVcbiAgKSB7XG4gICAgcmV0dXJuIGNvbnRyb2xUeXBlLnNsaWNlKDAsIDUpID09PSAncmFkaW8nID9cbiAgICAgICdyYWRpb3MtaW5saW5lJyA6ICdjaGVja2JveGVzLWlubGluZSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvbnRyb2xUeXBlO1xuICB9XG59XG5cbi8qKlxuICogJ2lzSW5wdXRSZXF1aXJlZCcgZnVuY3Rpb25cbiAqXG4gKiBDaGVja3MgYSBKU09OIFNjaGVtYSB0byBzZWUgaWYgYW4gaXRlbSBpcyByZXF1aXJlZFxuICpcbiAqIC8vICAgc2NoZW1hIC0gdGhlIHNjaGVtYSB0byBjaGVja1xuICogLy8gIHsgc3RyaW5nIH0gc2NoZW1hUG9pbnRlciAtIHRoZSBwb2ludGVyIHRvIHRoZSBpdGVtIHRvIGNoZWNrXG4gKiAvLyB7IGJvb2xlYW4gfSAtIHRydWUgaWYgdGhlIGl0ZW0gaXMgcmVxdWlyZWQsIGZhbHNlIGlmIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnB1dFJlcXVpcmVkKHNjaGVtYSwgc2NoZW1hUG9pbnRlcikge1xuICBpZiAoIWlzT2JqZWN0KHNjaGVtYSkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdpc0lucHV0UmVxdWlyZWQgZXJyb3I6IElucHV0IHNjaGVtYSBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgbGlzdFBvaW50ZXJBcnJheSA9IEpzb25Qb2ludGVyLnBhcnNlKHNjaGVtYVBvaW50ZXIpO1xuICBpZiAoaXNBcnJheShsaXN0UG9pbnRlckFycmF5KSkge1xuICAgIGlmICghbGlzdFBvaW50ZXJBcnJheS5sZW5ndGgpIHsgcmV0dXJuIHNjaGVtYS5yZXF1aXJlZCA9PT0gdHJ1ZTsgfVxuICAgIGNvbnN0IGtleU5hbWUgPSBsaXN0UG9pbnRlckFycmF5LnBvcCgpO1xuICAgIGNvbnN0IG5leHRUb0xhc3RLZXkgPSBsaXN0UG9pbnRlckFycmF5W2xpc3RQb2ludGVyQXJyYXkubGVuZ3RoIC0gMV07XG4gICAgaWYgKFsncHJvcGVydGllcycsICdhZGRpdGlvbmFsUHJvcGVydGllcycsICdwYXR0ZXJuUHJvcGVydGllcycsICdpdGVtcycsICdhZGRpdGlvbmFsSXRlbXMnXVxuICAgICAgLmluY2x1ZGVzKG5leHRUb0xhc3RLZXkpXG4gICAgKSB7XG4gICAgICBsaXN0UG9pbnRlckFycmF5LnBvcCgpO1xuICAgIH1cbiAgICBjb25zdCBwYXJlbnRTY2hlbWEgPSBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCBsaXN0UG9pbnRlckFycmF5KSB8fCB7fTtcbiAgICBpZiAoaXNBcnJheShwYXJlbnRTY2hlbWEucmVxdWlyZWQpKSB7XG4gICAgICByZXR1cm4gcGFyZW50U2NoZW1hLnJlcXVpcmVkLmluY2x1ZGVzKGtleU5hbWUpO1xuICAgIH1cbiAgICBpZiAocGFyZW50U2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICAgIHJldHVybiBoYXNPd24ocGFyZW50U2NoZW1hLCAnbWluSXRlbXMnKSAmJlxuICAgICAgICBpc051bWJlcihrZXlOYW1lKSAmJlxuICAgICAgICArcGFyZW50U2NoZW1hLm1pbkl0ZW1zID4gK2tleU5hbWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogJ3VwZGF0ZUlucHV0T3B0aW9ucycgZnVuY3Rpb25cbiAqXG4gKiAvLyAgIGxheW91dE5vZGVcbiAqIC8vICAgc2NoZW1hXG4gKiAvLyAgIGpzZlxuICogLy8geyB2b2lkIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUlucHV0T3B0aW9ucyhsYXlvdXROb2RlLCBzY2hlbWEsIGpzZikge1xuICBpZiAoIWlzT2JqZWN0KGxheW91dE5vZGUpIHx8ICFpc09iamVjdChsYXlvdXROb2RlLm9wdGlvbnMpKSB7IHJldHVybjsgfVxuXG4gIC8vIFNldCBhbGwgb3B0aW9uIHZhbHVlcyBpbiBsYXlvdXROb2RlLm9wdGlvbnNcbiAgbGV0IG5ld09wdGlvbnM6IGFueSA9IHsgfTtcbiAgY29uc3QgZml4VWlLZXlzID0ga2V5ID0+IGtleS5zbGljZSgwLCAzKS50b0xvd2VyQ2FzZSgpID09PSAndWk6JyA/IGtleS5zbGljZSgzKSA6IGtleTtcbiAgbWVyZ2VGaWx0ZXJlZE9iamVjdChuZXdPcHRpb25zLCBqc2YuZm9ybU9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucywgW10sIGZpeFVpS2V5cyk7XG4gIFsgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3VpOndpZGdldC9vcHRpb25zJyksIFtdIF0sXG4gICAgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3VpOndpZGdldCcpLCBbXSBdLFxuICAgIFsgc2NoZW1hLCBbXG4gICAgICAnYWRkaXRpb25hbFByb3BlcnRpZXMnLCAnYWRkaXRpb25hbEl0ZW1zJywgJ3Byb3BlcnRpZXMnLCAnaXRlbXMnLFxuICAgICAgJ3JlcXVpcmVkJywgJ3R5cGUnLCAneC1zY2hlbWEtZm9ybScsICckcmVmJ1xuICAgIF0gXSxcbiAgICBbIEpzb25Qb2ludGVyLmdldChzY2hlbWEsICcveC1zY2hlbWEtZm9ybS9vcHRpb25zJyksIFtdIF0sXG4gICAgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0nKSwgWydpdGVtcycsICdvcHRpb25zJ10gXSxcbiAgICBbIGxheW91dE5vZGUsIFtcbiAgICAgICdfaWQnLCAnJHJlZicsICdhcnJheUl0ZW0nLCAnYXJyYXlJdGVtVHlwZScsICdkYXRhUG9pbnRlcicsICdkYXRhVHlwZScsXG4gICAgICAnaXRlbXMnLCAna2V5JywgJ25hbWUnLCAnb3B0aW9ucycsICdyZWN1cnNpdmVSZWZlcmVuY2UnLCAndHlwZScsICd3aWRnZXQnXG4gICAgXSBdLFxuICAgIFsgbGF5b3V0Tm9kZS5vcHRpb25zLCBbXSBdLFxuICBdLmZvckVhY2goKFsgb2JqZWN0LCBleGNsdWRlS2V5cyBdKSA9PlxuICAgIG1lcmdlRmlsdGVyZWRPYmplY3QobmV3T3B0aW9ucywgb2JqZWN0LCBleGNsdWRlS2V5cywgZml4VWlLZXlzKVxuICApO1xuICBpZiAoIWhhc093bihuZXdPcHRpb25zLCAndGl0bGVNYXAnKSkge1xuICAgIGxldCBuZXdUaXRsZU1hcDogYW55ID0gbnVsbDtcbiAgICBuZXdUaXRsZU1hcCA9IGdldFRpdGxlTWFwRnJvbU9uZU9mKHNjaGVtYSwgbmV3T3B0aW9ucy5mbGF0TGlzdCk7XG4gICAgaWYgKG5ld1RpdGxlTWFwKSB7IG5ld09wdGlvbnMudGl0bGVNYXAgPSBuZXdUaXRsZU1hcDsgfVxuICAgIGlmICghaGFzT3duKG5ld09wdGlvbnMsICd0aXRsZU1hcCcpICYmICFoYXNPd24obmV3T3B0aW9ucywgJ2VudW0nKSAmJiBoYXNPd24oc2NoZW1hLCAnaXRlbXMnKSkge1xuICAgICAgaWYgKEpzb25Qb2ludGVyLmhhcyhzY2hlbWEsICcvaXRlbXMvdGl0bGVNYXAnKSkge1xuICAgICAgICBuZXdPcHRpb25zLnRpdGxlTWFwID0gc2NoZW1hLml0ZW1zLnRpdGxlTWFwO1xuICAgICAgfSBlbHNlIGlmIChKc29uUG9pbnRlci5oYXMoc2NoZW1hLCAnL2l0ZW1zL2VudW0nKSkge1xuICAgICAgICBuZXdPcHRpb25zLmVudW0gPSBzY2hlbWEuaXRlbXMuZW51bTtcbiAgICAgICAgaWYgKCFoYXNPd24obmV3T3B0aW9ucywgJ2VudW1OYW1lcycpICYmIEpzb25Qb2ludGVyLmhhcyhzY2hlbWEsICcvaXRlbXMvZW51bU5hbWVzJykpIHtcbiAgICAgICAgICBuZXdPcHRpb25zLmVudW1OYW1lcyA9IHNjaGVtYS5pdGVtcy5lbnVtTmFtZXM7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoSnNvblBvaW50ZXIuaGFzKHNjaGVtYSwgJy9pdGVtcy9vbmVPZicpKSB7XG4gICAgICAgIG5ld1RpdGxlTWFwID0gZ2V0VGl0bGVNYXBGcm9tT25lT2Yoc2NoZW1hLml0ZW1zLCBuZXdPcHRpb25zLmZsYXRMaXN0KTtcbiAgICAgICAgaWYgKG5ld1RpdGxlTWFwKSB7IG5ld09wdGlvbnMudGl0bGVNYXAgPSBuZXdUaXRsZU1hcDsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHNjaGVtYSB0eXBlIGlzIGludGVnZXIsIGVuZm9yY2UgYnkgc2V0dGluZyBtdWx0aXBsZU9mID0gMVxuICBpZiAoc2NoZW1hLnR5cGUgPT09ICdpbnRlZ2VyJyAmJiAhaGFzVmFsdWUobmV3T3B0aW9ucy5tdWx0aXBsZU9mKSkge1xuICAgIG5ld09wdGlvbnMubXVsdGlwbGVPZiA9IDE7XG4gIH1cblxuICAvLyBDb3B5IGFueSB0eXBlYWhlYWQgd29yZCBsaXN0cyB0byBvcHRpb25zLnR5cGVhaGVhZC5zb3VyY2VcbiAgaWYgKEpzb25Qb2ludGVyLmhhcyhuZXdPcHRpb25zLCAnL2F1dG9jb21wbGV0ZS9zb3VyY2UnKSkge1xuICAgIG5ld09wdGlvbnMudHlwZWFoZWFkID0gbmV3T3B0aW9ucy5hdXRvY29tcGxldGU7XG4gIH0gZWxzZSBpZiAoSnNvblBvaW50ZXIuaGFzKG5ld09wdGlvbnMsICcvdGFnc2lucHV0L3NvdXJjZScpKSB7XG4gICAgbmV3T3B0aW9ucy50eXBlYWhlYWQgPSBuZXdPcHRpb25zLnRhZ3NpbnB1dDtcbiAgfSBlbHNlIGlmIChKc29uUG9pbnRlci5oYXMobmV3T3B0aW9ucywgJy90YWdzaW5wdXQvdHlwZWFoZWFkL3NvdXJjZScpKSB7XG4gICAgbmV3T3B0aW9ucy50eXBlYWhlYWQgPSBuZXdPcHRpb25zLnRhZ3NpbnB1dC50eXBlYWhlYWQ7XG4gIH1cblxuICBsYXlvdXROb2RlLm9wdGlvbnMgPSBuZXdPcHRpb25zO1xufVxuXG4vKipcbiAqICdnZXRUaXRsZU1hcEZyb21PbmVPZicgZnVuY3Rpb25cbiAqXG4gKiAvLyAgeyBzY2hlbWEgfSBzY2hlbWFcbiAqIC8vICB7IGJvb2xlYW4gPSBudWxsIH0gZmxhdExpc3RcbiAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IHZhbGlkYXRlT25seVxuICogLy8geyB2YWxpZGF0b3JzIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRpdGxlTWFwRnJvbU9uZU9mKFxuICBzY2hlbWE6IGFueSA9IHt9LCBmbGF0TGlzdDogYm9vbGVhbiA9IG51bGwsIHZhbGlkYXRlT25seSA9IGZhbHNlXG4pIHtcbiAgbGV0IHRpdGxlTWFwID0gbnVsbDtcbiAgY29uc3Qgb25lT2YgPSBzY2hlbWEub25lT2YgfHwgc2NoZW1hLmFueU9mIHx8IG51bGw7XG4gIGlmIChpc0FycmF5KG9uZU9mKSAmJiBvbmVPZi5ldmVyeShpdGVtID0+IGl0ZW0udGl0bGUpKSB7XG4gICAgaWYgKG9uZU9mLmV2ZXJ5KGl0ZW0gPT4gaXNBcnJheShpdGVtLmVudW0pICYmIGl0ZW0uZW51bS5sZW5ndGggPT09IDEpKSB7XG4gICAgICBpZiAodmFsaWRhdGVPbmx5KSB7IHJldHVybiB0cnVlOyB9XG4gICAgICB0aXRsZU1hcCA9IG9uZU9mLm1hcChpdGVtID0+ICh7IG5hbWU6IGl0ZW0udGl0bGUsIHZhbHVlOiBpdGVtLmVudW1bMF0gfSkpO1xuICAgIH0gZWxzZSBpZiAob25lT2YuZXZlcnkoaXRlbSA9PiBpdGVtLmNvbnN0KSkge1xuICAgICAgaWYgKHZhbGlkYXRlT25seSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgdGl0bGVNYXAgPSBvbmVPZi5tYXAoaXRlbSA9PiAoeyBuYW1lOiBpdGVtLnRpdGxlLCB2YWx1ZTogaXRlbS5jb25zdCB9KSk7XG4gICAgfVxuXG4gICAgLy8gaWYgZmxhdExpc3QgIT09IGZhbHNlIGFuZCBzb21lIGl0ZW1zIGhhdmUgY29sb25zLCBtYWtlIGdyb3VwZWQgbWFwXG4gICAgaWYgKGZsYXRMaXN0ICE9PSBmYWxzZSAmJiAodGl0bGVNYXAgfHwgW10pXG4gICAgICAuZmlsdGVyKHRpdGxlID0+ICgodGl0bGUgfHwge30pLm5hbWUgfHwgJycpLmluZGV4T2YoJzogJykpLmxlbmd0aCA+IDFcbiAgICApIHtcblxuICAgICAgLy8gU3BsaXQgbmFtZSBvbiBmaXJzdCBjb2xvbiB0byBjcmVhdGUgZ3JvdXBlZCBtYXAgKG5hbWUgLT4gZ3JvdXA6IG5hbWUpXG4gICAgICBjb25zdCBuZXdUaXRsZU1hcCA9IHRpdGxlTWFwLm1hcCh0aXRsZSA9PiB7XG4gICAgICAgIGxldCBbZ3JvdXAsIG5hbWVdID0gdGl0bGUubmFtZS5zcGxpdCgvOiAoLispLyk7XG4gICAgICAgIHJldHVybiBncm91cCAmJiBuYW1lID8geyAuLi50aXRsZSwgZ3JvdXAsIG5hbWUgfSA6IHRpdGxlO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIElmIGZsYXRMaXN0ID09PSB0cnVlIG9yIGF0IGxlYXN0IG9uZSBncm91cCBoYXMgbXVsdGlwbGUgaXRlbXMsIHVzZSBncm91cGVkIG1hcFxuICAgICAgaWYgKGZsYXRMaXN0ID09PSB0cnVlIHx8IG5ld1RpdGxlTWFwLnNvbWUoKHRpdGxlLCBpbmRleCkgPT4gaW5kZXggJiZcbiAgICAgICAgaGFzT3duKHRpdGxlLCAnZ3JvdXAnKSAmJiB0aXRsZS5ncm91cCA9PT0gbmV3VGl0bGVNYXBbaW5kZXggLSAxXS5ncm91cFxuICAgICAgKSkge1xuICAgICAgICB0aXRsZU1hcCA9IG5ld1RpdGxlTWFwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsaWRhdGVPbmx5ID8gZmFsc2UgOiB0aXRsZU1hcDtcbn1cblxuLyoqXG4gKiAnZ2V0Q29udHJvbFZhbGlkYXRvcnMnIGZ1bmN0aW9uXG4gKlxuICogLy8gIHNjaGVtYVxuICogLy8geyB2YWxpZGF0b3JzIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xWYWxpZGF0b3JzKHNjaGVtYSkge1xuICBpZiAoIWlzT2JqZWN0KHNjaGVtYSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgbGV0IHZhbGlkYXRvcnM6IGFueSA9IHsgfTtcbiAgaWYgKGhhc093bihzY2hlbWEsICd0eXBlJykpIHtcbiAgICBzd2l0Y2ggKHNjaGVtYS50eXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBmb3JFYWNoKFsncGF0dGVybicsICdmb3JtYXQnLCAnbWluTGVuZ3RoJywgJ21heExlbmd0aCddLCAocHJvcCkgPT4ge1xuICAgICAgICAgIGlmIChoYXNPd24oc2NoZW1hLCBwcm9wKSkgeyB2YWxpZGF0b3JzW3Byb3BdID0gW3NjaGVtYVtwcm9wXV07IH1cbiAgICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6IGNhc2UgJ2ludGVnZXInOlxuICAgICAgICBmb3JFYWNoKFsnTWluaW11bScsICdNYXhpbXVtJ10sICh1Y0xpbWl0KSA9PiB7XG4gICAgICAgICAgbGV0IGVMaW1pdCA9ICdleGNsdXNpdmUnICsgdWNMaW1pdDtcbiAgICAgICAgICBsZXQgbGltaXQgPSB1Y0xpbWl0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgaWYgKGhhc093bihzY2hlbWEsIGxpbWl0KSkge1xuICAgICAgICAgICAgbGV0IGV4Y2x1c2l2ZSA9IGhhc093bihzY2hlbWEsIGVMaW1pdCkgJiYgc2NoZW1hW2VMaW1pdF0gPT09IHRydWU7XG4gICAgICAgICAgICB2YWxpZGF0b3JzW2xpbWl0XSA9IFtzY2hlbWFbbGltaXRdLCBleGNsdXNpdmVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZvckVhY2goWydtdWx0aXBsZU9mJywgJ3R5cGUnXSwgKHByb3ApID0+IHtcbiAgICAgICAgICBpZiAoaGFzT3duKHNjaGVtYSwgcHJvcCkpIHsgdmFsaWRhdG9yc1twcm9wXSA9IFtzY2hlbWFbcHJvcF1dOyB9XG4gICAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBmb3JFYWNoKFsnbWluUHJvcGVydGllcycsICdtYXhQcm9wZXJ0aWVzJywgJ2RlcGVuZGVuY2llcyddLCAocHJvcCkgPT4ge1xuICAgICAgICAgIGlmIChoYXNPd24oc2NoZW1hLCBwcm9wKSkgeyB2YWxpZGF0b3JzW3Byb3BdID0gW3NjaGVtYVtwcm9wXV07IH1cbiAgICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgZm9yRWFjaChbJ21pbkl0ZW1zJywgJ21heEl0ZW1zJywgJ3VuaXF1ZUl0ZW1zJ10sIChwcm9wKSA9PiB7XG4gICAgICAgICAgaWYgKGhhc093bihzY2hlbWEsIHByb3ApKSB7IHZhbGlkYXRvcnNbcHJvcF0gPSBbc2NoZW1hW3Byb3BdXTsgfVxuICAgICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoaGFzT3duKHNjaGVtYSwgJ2VudW0nKSkgeyB2YWxpZGF0b3JzLmVudW0gPSBbc2NoZW1hLmVudW1dOyB9XG4gIHJldHVybiB2YWxpZGF0b3JzO1xufVxuXG4vKipcbiAqICdyZXNvbHZlU2NoZW1hUmVmZXJlbmNlcycgZnVuY3Rpb25cbiAqXG4gKiBGaW5kIGFsbCAkcmVmIGxpbmtzIGluIHNjaGVtYSBhbmQgc2F2ZSBsaW5rcyBhbmQgcmVmZXJlbmNlZCBzY2hlbWFzIGluXG4gKiBzY2hlbWFSZWZMaWJyYXJ5LCBzY2hlbWFSZWN1cnNpdmVSZWZNYXAsIGFuZCBkYXRhUmVjdXJzaXZlUmVmTWFwXG4gKlxuICogLy8gIHNjaGVtYVxuICogLy8gIHNjaGVtYVJlZkxpYnJhcnlcbiAqIC8vIHsgTWFwPHN0cmluZywgc3RyaW5nPiB9IHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcFxuICogLy8geyBNYXA8c3RyaW5nLCBzdHJpbmc+IH0gZGF0YVJlY3Vyc2l2ZVJlZk1hcFxuICogLy8geyBNYXA8c3RyaW5nLCBudW1iZXI+IH0gYXJyYXlNYXBcbiAqIC8vIFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXMoXG4gIHNjaGVtYSwgc2NoZW1hUmVmTGlicmFyeSwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwLCBkYXRhUmVjdXJzaXZlUmVmTWFwLCBhcnJheU1hcFxuKSB7XG4gIGlmICghaXNPYmplY3Qoc2NoZW1hKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3Jlc29sdmVTY2hlbWFSZWZlcmVuY2VzIGVycm9yOiBzY2hlbWEgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHJlZkxpbmtzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IHJlZk1hcFNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCByZWZNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCByZWN1cnNpdmVSZWZNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCByZWZMaWJyYXJ5OiBhbnkgPSB7fTtcblxuICAvLyBTZWFyY2ggc2NoZW1hIGZvciBhbGwgJHJlZiBsaW5rcywgYW5kIGJ1aWxkIGZ1bGwgcmVmTGlicmFyeVxuICBKc29uUG9pbnRlci5mb3JFYWNoRGVlcChzY2hlbWEsIChzdWJTY2hlbWEsIHN1YlNjaGVtYVBvaW50ZXIpID0+IHtcbiAgICBpZiAoaGFzT3duKHN1YlNjaGVtYSwgJyRyZWYnKSAmJiBpc1N0cmluZyhzdWJTY2hlbWFbJyRyZWYnXSkpIHtcbiAgICAgIGNvbnN0IHJlZlBvaW50ZXIgPSBKc29uUG9pbnRlci5jb21waWxlKHN1YlNjaGVtYVsnJHJlZiddKTtcbiAgICAgIHJlZkxpbmtzLmFkZChyZWZQb2ludGVyKTtcbiAgICAgIHJlZk1hcFNldC5hZGQoc3ViU2NoZW1hUG9pbnRlciArICd+ficgKyByZWZQb2ludGVyKTtcbiAgICAgIHJlZk1hcC5zZXQoc3ViU2NoZW1hUG9pbnRlciwgcmVmUG9pbnRlcik7XG4gICAgfVxuICB9KTtcbiAgcmVmTGlua3MuZm9yRWFjaChyZWYgPT4gcmVmTGlicmFyeVtyZWZdID0gZ2V0U3ViU2NoZW1hKHNjaGVtYSwgcmVmKSk7XG5cbiAgLy8gRm9sbG93IGFsbCByZWYgbGlua3MgYW5kIHNhdmUgaW4gcmVmTWFwU2V0LFxuICAvLyB0byBmaW5kIGFueSBtdWx0aS1saW5rIHJlY3Vyc2l2ZSByZWZlcm5jZXNcbiAgbGV0IGNoZWNrUmVmTGlua3MgPSB0cnVlO1xuICB3aGlsZSAoY2hlY2tSZWZMaW5rcykge1xuICAgIGNoZWNrUmVmTGlua3MgPSBmYWxzZTtcbiAgICBBcnJheS5mcm9tKHJlZk1hcCkuZm9yRWFjaCgoW2Zyb21SZWYxLCB0b1JlZjFdKSA9PiBBcnJheS5mcm9tKHJlZk1hcClcbiAgICAgIC5maWx0ZXIoKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT5cbiAgICAgICAgSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKHRvUmVmMSwgZnJvbVJlZjIsIHRydWUpICYmXG4gICAgICAgICFKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYyLCB0b1JlZjEsIHRydWUpICYmXG4gICAgICAgICFyZWZNYXBTZXQuaGFzKGZyb21SZWYxICsgZnJvbVJlZjIuc2xpY2UodG9SZWYxLmxlbmd0aCkgKyAnfn4nICsgdG9SZWYyKVxuICAgICAgKVxuICAgICAgLmZvckVhY2goKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT4ge1xuICAgICAgICByZWZNYXBTZXQuYWRkKGZyb21SZWYxICsgZnJvbVJlZjIuc2xpY2UodG9SZWYxLmxlbmd0aCkgKyAnfn4nICsgdG9SZWYyKTtcbiAgICAgICAgY2hlY2tSZWZMaW5rcyA9IHRydWU7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvLyBCdWlsZCBmdWxsIHJlY3Vyc2l2ZVJlZk1hcFxuICAvLyBGaXJzdCBwYXNzIC0gc2F2ZSBhbGwgaW50ZXJuYWxseSByZWN1cnNpdmUgcmVmcyBmcm9tIHJlZk1hcFNldFxuICBBcnJheS5mcm9tKHJlZk1hcFNldClcbiAgICAubWFwKHJlZkxpbmsgPT4gcmVmTGluay5zcGxpdCgnfn4nKSlcbiAgICAuZmlsdGVyKChbZnJvbVJlZiwgdG9SZWZdKSA9PiBKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYsIGZyb21SZWYpKVxuICAgIC5mb3JFYWNoKChbZnJvbVJlZiwgdG9SZWZdKSA9PiByZWN1cnNpdmVSZWZNYXAuc2V0KGZyb21SZWYsIHRvUmVmKSk7XG4gIC8vIFNlY29uZCBwYXNzIC0gY3JlYXRlIHJlY3Vyc2l2ZSB2ZXJzaW9ucyBvZiBhbnkgb3RoZXIgcmVmcyB0aGF0IGxpbmsgdG8gcmVjdXJzaXZlIHJlZnNcbiAgQXJyYXkuZnJvbShyZWZNYXApXG4gICAgLmZpbHRlcigoW2Zyb21SZWYxLCB0b1JlZjFdKSA9PiBBcnJheS5mcm9tKHJlY3Vyc2l2ZVJlZk1hcC5rZXlzKCkpXG4gICAgICAuZXZlcnkoZnJvbVJlZjIgPT4gIUpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcihmcm9tUmVmMSwgZnJvbVJlZjIsIHRydWUpKVxuICAgIClcbiAgICAuZm9yRWFjaCgoW2Zyb21SZWYxLCB0b1JlZjFdKSA9PiBBcnJheS5mcm9tKHJlY3Vyc2l2ZVJlZk1hcClcbiAgICAgIC5maWx0ZXIoKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT5cbiAgICAgICAgIXJlY3Vyc2l2ZVJlZk1hcC5oYXMoZnJvbVJlZjEgKyBmcm9tUmVmMi5zbGljZSh0b1JlZjEubGVuZ3RoKSkgJiZcbiAgICAgICAgSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKHRvUmVmMSwgZnJvbVJlZjIsIHRydWUpICYmXG4gICAgICAgICFKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYxLCBmcm9tUmVmMSwgdHJ1ZSlcbiAgICAgIClcbiAgICAgIC5mb3JFYWNoKChbZnJvbVJlZjIsIHRvUmVmMl0pID0+IHJlY3Vyc2l2ZVJlZk1hcC5zZXQoXG4gICAgICAgIGZyb21SZWYxICsgZnJvbVJlZjIuc2xpY2UodG9SZWYxLmxlbmd0aCksXG4gICAgICAgIGZyb21SZWYxICsgdG9SZWYyLnNsaWNlKHRvUmVmMS5sZW5ndGgpXG4gICAgICApKVxuICAgICk7XG5cbiAgLy8gQ3JlYXRlIGNvbXBpbGVkIHNjaGVtYSBieSByZXBsYWNpbmcgYWxsIG5vbi1yZWN1cnNpdmUgJHJlZiBsaW5rcyB3aXRoXG4gIC8vIHRoaWVpciBsaW5rZWQgc2NoZW1hcyBhbmQsIHdoZXJlIHBvc3NpYmxlLCBjb21iaW5pbmcgc2NoZW1hcyBpbiBhbGxPZiBhcnJheXMuXG4gIGxldCBjb21waWxlZFNjaGVtYSA9IHsgLi4uc2NoZW1hIH07XG4gIGRlbGV0ZSBjb21waWxlZFNjaGVtYS5kZWZpbml0aW9ucztcbiAgY29tcGlsZWRTY2hlbWEgPVxuICAgIGdldFN1YlNjaGVtYShjb21waWxlZFNjaGVtYSwgJycsIHJlZkxpYnJhcnksIHJlY3Vyc2l2ZVJlZk1hcCk7XG5cbiAgLy8gTWFrZSBzdXJlIGFsbCByZW1haW5pbmcgc2NoZW1hICRyZWZzIGFyZSByZWN1cnNpdmUsIGFuZCBidWlsZCBmaW5hbFxuICAvLyBzY2hlbWFSZWZMaWJyYXJ5LCBzY2hlbWFSZWN1cnNpdmVSZWZNYXAsIGRhdGFSZWN1cnNpdmVSZWZNYXAsICYgYXJyYXlNYXBcbiAgSnNvblBvaW50ZXIuZm9yRWFjaERlZXAoY29tcGlsZWRTY2hlbWEsIChzdWJTY2hlbWEsIHN1YlNjaGVtYVBvaW50ZXIpID0+IHtcbiAgICBpZiAoaXNTdHJpbmcoc3ViU2NoZW1hWyckcmVmJ10pKSB7XG4gICAgICBsZXQgcmVmUG9pbnRlciA9IEpzb25Qb2ludGVyLmNvbXBpbGUoc3ViU2NoZW1hWyckcmVmJ10pO1xuICAgICAgaWYgKCFKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIocmVmUG9pbnRlciwgc3ViU2NoZW1hUG9pbnRlciwgdHJ1ZSkpIHtcbiAgICAgICAgcmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoc3ViU2NoZW1hUG9pbnRlciwgcmVjdXJzaXZlUmVmTWFwKTtcbiAgICAgICAgSnNvblBvaW50ZXIuc2V0KGNvbXBpbGVkU2NoZW1hLCBzdWJTY2hlbWFQb2ludGVyLCB7ICRyZWY6IGAjJHtyZWZQb2ludGVyfWAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWhhc093bihzY2hlbWFSZWZMaWJyYXJ5LCAncmVmUG9pbnRlcicpKSB7XG4gICAgICAgIHNjaGVtYVJlZkxpYnJhcnlbcmVmUG9pbnRlcl0gPSAhcmVmUG9pbnRlci5sZW5ndGggPyBjb21waWxlZFNjaGVtYSA6XG4gICAgICAgICAgZ2V0U3ViU2NoZW1hKGNvbXBpbGVkU2NoZW1hLCByZWZQb2ludGVyLCBzY2hlbWFSZWZMaWJyYXJ5LCByZWN1cnNpdmVSZWZNYXApO1xuICAgICAgfVxuICAgICAgaWYgKCFzY2hlbWFSZWN1cnNpdmVSZWZNYXAuaGFzKHN1YlNjaGVtYVBvaW50ZXIpKSB7XG4gICAgICAgIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcC5zZXQoc3ViU2NoZW1hUG9pbnRlciwgcmVmUG9pbnRlcik7XG4gICAgICB9XG4gICAgICBjb25zdCBmcm9tRGF0YVJlZiA9IEpzb25Qb2ludGVyLnRvRGF0YVBvaW50ZXIoc3ViU2NoZW1hUG9pbnRlciwgY29tcGlsZWRTY2hlbWEpO1xuICAgICAgaWYgKCFkYXRhUmVjdXJzaXZlUmVmTWFwLmhhcyhmcm9tRGF0YVJlZikpIHtcbiAgICAgICAgY29uc3QgdG9EYXRhUmVmID0gSnNvblBvaW50ZXIudG9EYXRhUG9pbnRlcihyZWZQb2ludGVyLCBjb21waWxlZFNjaGVtYSk7XG4gICAgICAgIGRhdGFSZWN1cnNpdmVSZWZNYXAuc2V0KGZyb21EYXRhUmVmLCB0b0RhdGFSZWYpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3ViU2NoZW1hLnR5cGUgPT09ICdhcnJheScgJiZcbiAgICAgIChoYXNPd24oc3ViU2NoZW1hLCAnaXRlbXMnKSB8fCBoYXNPd24oc3ViU2NoZW1hLCAnYWRkaXRpb25hbEl0ZW1zJykpXG4gICAgKSB7XG4gICAgICBjb25zdCBkYXRhUG9pbnRlciA9IEpzb25Qb2ludGVyLnRvRGF0YVBvaW50ZXIoc3ViU2NoZW1hUG9pbnRlciwgY29tcGlsZWRTY2hlbWEpO1xuICAgICAgaWYgKCFhcnJheU1hcC5oYXMoZGF0YVBvaW50ZXIpKSB7XG4gICAgICAgIGNvbnN0IHR1cGxlSXRlbXMgPSBpc0FycmF5KHN1YlNjaGVtYS5pdGVtcykgPyBzdWJTY2hlbWEuaXRlbXMubGVuZ3RoIDogMDtcbiAgICAgICAgYXJyYXlNYXAuc2V0KGRhdGFQb2ludGVyLCB0dXBsZUl0ZW1zKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHRydWUpO1xuICByZXR1cm4gY29tcGlsZWRTY2hlbWE7XG59XG5cbi8qKlxuICogJ2dldFN1YlNjaGVtYScgZnVuY3Rpb25cbiAqXG4gKiAvLyAgIHNjaGVtYVxuICogLy8gIHsgUG9pbnRlciB9IHBvaW50ZXJcbiAqIC8vICB7IG9iamVjdCB9IHNjaGVtYVJlZkxpYnJhcnlcbiAqIC8vICB7IE1hcDxzdHJpbmcsIHN0cmluZz4gfSBzY2hlbWFSZWN1cnNpdmVSZWZNYXBcbiAqIC8vICB7IHN0cmluZ1tdID0gW10gfSB1c2VkUG9pbnRlcnNcbiAqIC8vIFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ViU2NoZW1hKFxuICBzY2hlbWEsIHBvaW50ZXIsIHNjaGVtYVJlZkxpYnJhcnkgPSBudWxsLFxuICBzY2hlbWFSZWN1cnNpdmVSZWZNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBudWxsLCB1c2VkUG9pbnRlcnM6IHN0cmluZ1tdID0gW11cbikge1xuICBpZiAoIXNjaGVtYVJlZkxpYnJhcnkgfHwgIXNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCkge1xuICAgIHJldHVybiBKc29uUG9pbnRlci5nZXRDb3B5KHNjaGVtYSwgcG9pbnRlcik7XG4gIH1cbiAgaWYgKHR5cGVvZiBwb2ludGVyICE9PSAnc3RyaW5nJykgeyBwb2ludGVyID0gSnNvblBvaW50ZXIuY29tcGlsZShwb2ludGVyKTsgfVxuICB1c2VkUG9pbnRlcnMgPSBbIC4uLnVzZWRQb2ludGVycywgcG9pbnRlciBdO1xuICBsZXQgbmV3U2NoZW1hOiBhbnkgPSBudWxsO1xuICBpZiAocG9pbnRlciA9PT0gJycpIHtcbiAgICBuZXdTY2hlbWEgPSBfLmNsb25lRGVlcChzY2hlbWEpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNob3J0UG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMocG9pbnRlciwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwKTtcbiAgICBpZiAoc2hvcnRQb2ludGVyICE9PSBwb2ludGVyKSB7IHVzZWRQb2ludGVycyA9IFsgLi4udXNlZFBvaW50ZXJzLCBzaG9ydFBvaW50ZXIgXTsgfVxuICAgIG5ld1NjaGVtYSA9IEpzb25Qb2ludGVyLmdldEZpcnN0Q29weShbXG4gICAgICBbc2NoZW1hUmVmTGlicmFyeSwgW3Nob3J0UG9pbnRlcl1dLFxuICAgICAgW3NjaGVtYSwgcG9pbnRlcl0sXG4gICAgICBbc2NoZW1hLCBzaG9ydFBvaW50ZXJdXG4gICAgXSk7XG4gIH1cbiAgcmV0dXJuIEpzb25Qb2ludGVyLmZvckVhY2hEZWVwQ29weShuZXdTY2hlbWEsIChzdWJTY2hlbWEsIHN1YlBvaW50ZXIpID0+IHtcbiAgICBpZiAoaXNPYmplY3Qoc3ViU2NoZW1hKSkge1xuXG4gICAgICAvLyBSZXBsYWNlIG5vbi1yZWN1cnNpdmUgJHJlZiBsaW5rcyB3aXRoIHJlZmVyZW5jZWQgc2NoZW1hc1xuICAgICAgaWYgKGlzU3RyaW5nKHN1YlNjaGVtYS4kcmVmKSkge1xuICAgICAgICBjb25zdCByZWZQb2ludGVyID0gSnNvblBvaW50ZXIuY29tcGlsZShzdWJTY2hlbWEuJHJlZik7XG4gICAgICAgIGlmIChyZWZQb2ludGVyLmxlbmd0aCAmJiB1c2VkUG9pbnRlcnMuZXZlcnkocHRyID0+XG4gICAgICAgICAgIUpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcihyZWZQb2ludGVyLCBwdHIsIHRydWUpXG4gICAgICAgICkpIHtcbiAgICAgICAgICBjb25zdCByZWZTY2hlbWEgPSBnZXRTdWJTY2hlbWEoXG4gICAgICAgICAgICBzY2hlbWEsIHJlZlBvaW50ZXIsIHNjaGVtYVJlZkxpYnJhcnksIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCwgdXNlZFBvaW50ZXJzXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoc3ViU2NoZW1hKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiByZWZTY2hlbWE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dHJhS2V5cyA9IHsgLi4uc3ViU2NoZW1hIH07XG4gICAgICAgICAgICBkZWxldGUgZXh0cmFLZXlzLiRyZWY7XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VTY2hlbWFzKHJlZlNjaGVtYSwgZXh0cmFLZXlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVE9ETzogQ29udmVydCBzY2hlbWFzIHdpdGggJ3R5cGUnIGFycmF5cyB0byAnb25lT2YnXG5cbiAgICAgIC8vIENvbWJpbmUgYWxsT2Ygc3ViU2NoZW1hc1xuICAgICAgaWYgKGlzQXJyYXkoc3ViU2NoZW1hLmFsbE9mKSkgeyByZXR1cm4gY29tYmluZUFsbE9mKHN1YlNjaGVtYSk7IH1cblxuICAgICAgLy8gRml4IGluY29ycmVjdGx5IHBsYWNlZCBhcnJheSBvYmplY3QgcmVxdWlyZWQgbGlzdHNcbiAgICAgIGlmIChzdWJTY2hlbWEudHlwZSA9PT0gJ2FycmF5JyAmJiBpc0FycmF5KHN1YlNjaGVtYS5yZXF1aXJlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpeFJlcXVpcmVkQXJyYXlQcm9wZXJ0aWVzKHN1YlNjaGVtYSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdWJTY2hlbWE7XG4gIH0sIHRydWUsIDxzdHJpbmc+cG9pbnRlcik7XG59XG5cbi8qKlxuICogJ2NvbWJpbmVBbGxPZicgZnVuY3Rpb25cbiAqXG4gKiBBdHRlbXB0IHRvIGNvbnZlcnQgYW4gYWxsT2Ygc2NoZW1hIG9iamVjdCBpbnRvXG4gKiBhIG5vbi1hbGxPZiBzY2hlbWEgb2JqZWN0IHdpdGggZXF1aXZhbGVudCBydWxlcy5cbiAqXG4gKiAvLyAgIHNjaGVtYSAtIGFsbE9mIHNjaGVtYSBvYmplY3RcbiAqIC8vICAtIGNvbnZlcnRlZCBzY2hlbWEgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lQWxsT2Yoc2NoZW1hKSB7XG4gIGlmICghaXNPYmplY3Qoc2NoZW1hKSB8fCAhaXNBcnJheShzY2hlbWEuYWxsT2YpKSB7IHJldHVybiBzY2hlbWE7IH1cbiAgbGV0IG1lcmdlZFNjaGVtYSA9IG1lcmdlU2NoZW1hcyguLi5zY2hlbWEuYWxsT2YpO1xuICBpZiAoT2JqZWN0LmtleXMoc2NoZW1hKS5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgZXh0cmFLZXlzID0geyAuLi5zY2hlbWEgfTtcbiAgICBkZWxldGUgZXh0cmFLZXlzLmFsbE9mO1xuICAgIG1lcmdlZFNjaGVtYSA9IG1lcmdlU2NoZW1hcyhtZXJnZWRTY2hlbWEsIGV4dHJhS2V5cyk7XG4gIH1cbiAgcmV0dXJuIG1lcmdlZFNjaGVtYTtcbn1cblxuLyoqXG4gKiAnZml4UmVxdWlyZWRBcnJheVByb3BlcnRpZXMnIGZ1bmN0aW9uXG4gKlxuICogRml4ZXMgYW4gaW5jb3JyZWN0bHkgcGxhY2VkIHJlcXVpcmVkIGxpc3QgaW5zaWRlIGFuIGFycmF5IHNjaGVtYSwgYnkgbW92aW5nXG4gKiBpdCBpbnRvIGl0ZW1zLnByb3BlcnRpZXMgb3IgYWRkaXRpb25hbEl0ZW1zLnByb3BlcnRpZXMsIHdoZXJlIGl0IGJlbG9uZ3MuXG4gKlxuICogLy8gICBzY2hlbWEgLSBhbGxPZiBzY2hlbWEgb2JqZWN0XG4gKiAvLyAgLSBjb252ZXJ0ZWQgc2NoZW1hIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZml4UmVxdWlyZWRBcnJheVByb3BlcnRpZXMoc2NoZW1hKSB7XG4gIGlmIChzY2hlbWEudHlwZSA9PT0gJ2FycmF5JyAmJiBpc0FycmF5KHNjaGVtYS5yZXF1aXJlZCkpIHtcbiAgICBsZXQgaXRlbXNPYmplY3QgPSBoYXNPd24oc2NoZW1hLml0ZW1zLCAncHJvcGVydGllcycpID8gJ2l0ZW1zJyA6XG4gICAgICBoYXNPd24oc2NoZW1hLmFkZGl0aW9uYWxJdGVtcywgJ3Byb3BlcnRpZXMnKSA/ICdhZGRpdGlvbmFsSXRlbXMnIDogbnVsbDtcbiAgICBpZiAoaXRlbXNPYmplY3QgJiYgIWhhc093bihzY2hlbWFbaXRlbXNPYmplY3RdLCAncmVxdWlyZWQnKSAmJiAoXG4gICAgICBoYXNPd24oc2NoZW1hW2l0ZW1zT2JqZWN0XSwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJykgfHxcbiAgICAgIHNjaGVtYS5yZXF1aXJlZC5ldmVyeShrZXkgPT4gaGFzT3duKHNjaGVtYVtpdGVtc09iamVjdF0ucHJvcGVydGllcywga2V5KSlcbiAgICApKSB7XG4gICAgICBzY2hlbWEgPSBfLmNsb25lRGVlcChzY2hlbWEpO1xuICAgICAgc2NoZW1hW2l0ZW1zT2JqZWN0XS5yZXF1aXJlZCA9IHNjaGVtYS5yZXF1aXJlZDtcbiAgICAgIGRlbGV0ZSBzY2hlbWEucmVxdWlyZWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBzY2hlbWE7XG59XG4iXX0=