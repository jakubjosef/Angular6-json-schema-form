/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import * as _ from 'lodash';
import { isArray, isEmpty, isNumber, isObject, isString } from './validator.functions';
import { hasOwn, uniqueItems, commonItems } from './utility.functions';
/**
 * 'mergeSchemas' function
 *
 * Merges multiple JSON schemas into a single schema with combined rules.
 *
 * If able to logically merge properties from all schemas,
 * returns a single schema object containing all merged properties.
 *
 * Example: ({ a: b, max: 1 }, { c: d, max: 2 }) => { a: b, c: d, max: 1 }
 *
 * If unable to logically merge, returns an allOf schema object containing
 * an array of the original schemas;
 *
 * Example: ({ a: b }, { a: d }) => { allOf: [ { a: b }, { a: d } ] }
 *
 * //   schemas - one or more input schemas
 * //  - merged schema
 * @param {...?} schemas
 * @return {?}
 */
export function mergeSchemas() {
    var schemas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schemas[_i] = arguments[_i];
    }
    schemas = schemas.filter(function (schema) { return !isEmpty(schema); });
    if (schemas.some(function (schema) { return !isObject(schema); })) {
        return null;
    }
    /** @type {?} */
    var combinedSchema = {};
    try {
        for (var schemas_1 = tslib_1.__values(schemas), schemas_1_1 = schemas_1.next(); !schemas_1_1.done; schemas_1_1 = schemas_1.next()) {
            var schema = schemas_1_1.value;
            var _loop_1 = function (key) {
                /** @type {?} */
                var combinedValue = combinedSchema[key];
                /** @type {?} */
                var schemaValue = schema[key];
                if (!hasOwn(combinedSchema, key) || _.isEqual(combinedValue, schemaValue)) {
                    combinedSchema[key] = schemaValue;
                }
                else {
                    switch (key) {
                        case 'allOf':
                            // Combine all items from both arrays
                            if (isArray(combinedValue) && isArray(schemaValue)) {
                                combinedSchema.allOf = mergeSchemas.apply(void 0, tslib_1.__spread(combinedValue, schemaValue));
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'additionalItems':
                        case 'additionalProperties':
                        case 'contains':
                        case 'propertyNames':
                            // Merge schema objects
                            if (isObject(combinedValue) && isObject(schemaValue)) {
                                combinedSchema[key] = mergeSchemas(combinedValue, schemaValue);
                                // additionalProperties == false in any schema overrides all other values
                            }
                            else if (key === 'additionalProperties' &&
                                (combinedValue === false || schemaValue === false)) {
                                combinedSchema.combinedSchema = false;
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'anyOf':
                        case 'oneOf':
                        case 'enum':
                            // Keep only items that appear in both arrays
                            if (isArray(combinedValue) && isArray(schemaValue)) {
                                combinedSchema[key] = combinedValue.filter(function (item1) {
                                    return schemaValue.findIndex(function (item2) { return _.isEqual(item1, item2); }) > -1;
                                });
                                if (!combinedSchema[key].length) {
                                    return { value: { allOf: tslib_1.__spread(schemas) } };
                                }
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'definitions':
                            // Combine keys from both objects
                            if (isObject(combinedValue) && isObject(schemaValue)) {
                                /** @type {?} */
                                var combinedObject = tslib_1.__assign({}, combinedValue);
                                try {
                                    for (var _a = tslib_1.__values(Object.keys(schemaValue)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                        var subKey = _b.value;
                                        if (!hasOwn(combinedObject, subKey) ||
                                            _.isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                            combinedObject[subKey] = schemaValue[subKey];
                                            // Don't combine matching keys with different values
                                        }
                                        else {
                                            return { value: { allOf: tslib_1.__spread(schemas) } };
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
                                combinedSchema.definitions = combinedObject;
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'dependencies':
                            // Combine all keys from both objects
                            // and merge schemas on matching keys,
                            // converting from arrays to objects if necessary
                            if (isObject(combinedValue) && isObject(schemaValue)) {
                                /** @type {?} */
                                var combinedObject = tslib_1.__assign({}, combinedValue);
                                try {
                                    for (var _d = tslib_1.__values(Object.keys(schemaValue)), _e = _d.next(); !_e.done; _e = _d.next()) {
                                        var subKey = _e.value;
                                        if (!hasOwn(combinedObject, subKey) ||
                                            _.isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                            combinedObject[subKey] = schemaValue[subKey];
                                            // If both keys are arrays, include all items from both arrays,
                                            // excluding duplicates
                                        }
                                        else if (isArray(schemaValue[subKey]) && isArray(combinedObject[subKey])) {
                                            combinedObject[subKey] = uniqueItems.apply(void 0, tslib_1.__spread(combinedObject[subKey], schemaValue[subKey]));
                                            // If either key is an object, merge the schemas
                                        }
                                        else if ((isArray(schemaValue[subKey]) || isObject(schemaValue[subKey])) &&
                                            (isArray(combinedObject[subKey]) || isObject(combinedObject[subKey]))) {
                                            /** @type {?} */
                                            var required = isArray(combinedSchema.required) ?
                                                combinedSchema.required : [];
                                            /** @type {?} */
                                            var combinedDependency = isArray(combinedObject[subKey]) ?
                                                { required: uniqueItems.apply(void 0, tslib_1.__spread(required, [combinedObject[subKey]])) } :
                                                combinedObject[subKey];
                                            /** @type {?} */
                                            var schemaDependency = isArray(schemaValue[subKey]) ?
                                                { required: uniqueItems.apply(void 0, tslib_1.__spread(required, [schemaValue[subKey]])) } :
                                                schemaValue[subKey];
                                            combinedObject[subKey] =
                                                mergeSchemas(combinedDependency, schemaDependency);
                                        }
                                        else {
                                            return { value: { allOf: tslib_1.__spread(schemas) } };
                                        }
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                                combinedSchema.dependencies = combinedObject;
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'items':
                            // If arrays, keep only items that appear in both arrays
                            if (isArray(combinedValue) && isArray(schemaValue)) {
                                combinedSchema.items = combinedValue.filter(function (item1) {
                                    return schemaValue.findIndex(function (item2) { return _.isEqual(item1, item2); }) > -1;
                                });
                                if (!combinedSchema.items.length) {
                                    return { value: { allOf: tslib_1.__spread(schemas) } };
                                }
                                // If both keys are objects, merge them
                            }
                            else if (isObject(combinedValue) && isObject(schemaValue)) {
                                combinedSchema.items = mergeSchemas(combinedValue, schemaValue);
                                // If object + array, combine object with each array item
                            }
                            else if (isArray(combinedValue) && isObject(schemaValue)) {
                                combinedSchema.items =
                                    combinedValue.map(function (item) { return mergeSchemas(item, schemaValue); });
                            }
                            else if (isObject(combinedValue) && isArray(schemaValue)) {
                                combinedSchema.items =
                                    schemaValue.map(function (item) { return mergeSchemas(item, combinedValue); });
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'multipleOf':
                            // TODO: Adjust to correctly handle decimal values
                            // If numbers, set to least common multiple
                            if (isNumber(combinedValue) && isNumber(schemaValue)) {
                                /** @type {?} */
                                var gcd_1 = function (x, y) { return !y ? x : gcd_1(y, x % y); };
                                /** @type {?} */
                                var lcm = function (x, y) { return (x * y) / gcd_1(x, y); };
                                combinedSchema.multipleOf = lcm(combinedValue, schemaValue);
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'maximum':
                        case 'exclusiveMaximum':
                        case 'maxLength':
                        case 'maxItems':
                        case 'maxProperties':
                            // If numbers, set to lowest value
                            if (isNumber(combinedValue) && isNumber(schemaValue)) {
                                combinedSchema[key] = Math.min(combinedValue, schemaValue);
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'minimum':
                        case 'exclusiveMinimum':
                        case 'minLength':
                        case 'minItems':
                        case 'minProperties':
                            // If numbers, set to highest value
                            if (isNumber(combinedValue) && isNumber(schemaValue)) {
                                combinedSchema[key] = Math.max(combinedValue, schemaValue);
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'not':
                            // Combine not values into anyOf array
                            if (isObject(combinedValue) && isObject(schemaValue)) {
                                /** @type {?} */
                                var notAnyOf = [combinedValue, schemaValue]
                                    .reduce(function (notAnyOfArray, notSchema) {
                                    return isArray(notSchema.anyOf) &&
                                        Object.keys(notSchema).length === 1 ? tslib_1.__spread(notAnyOfArray, notSchema.anyOf) : tslib_1.__spread(notAnyOfArray, [notSchema]);
                                }, []);
                                // TODO: Remove duplicate items from array
                                combinedSchema.not = { anyOf: notAnyOf };
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'patternProperties':
                            // Combine all keys from both objects
                            // and merge schemas on matching keys
                            if (isObject(combinedValue) && isObject(schemaValue)) {
                                /** @type {?} */
                                var combinedObject = tslib_1.__assign({}, combinedValue);
                                try {
                                    for (var _g = tslib_1.__values(Object.keys(schemaValue)), _h = _g.next(); !_h.done; _h = _g.next()) {
                                        var subKey = _h.value;
                                        if (!hasOwn(combinedObject, subKey) ||
                                            _.isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                            combinedObject[subKey] = schemaValue[subKey];
                                            // If both keys are objects, merge them
                                        }
                                        else if (isObject(schemaValue[subKey]) && isObject(combinedObject[subKey])) {
                                            combinedObject[subKey] =
                                                mergeSchemas(combinedObject[subKey], schemaValue[subKey]);
                                        }
                                        else {
                                            return { value: { allOf: tslib_1.__spread(schemas) } };
                                        }
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_h && !_h.done && (_j = _g.return)) _j.call(_g);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                                combinedSchema.patternProperties = combinedObject;
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'properties':
                            // Combine all keys from both objects
                            // unless additionalProperties === false
                            // and merge schemas on matching keys
                            if (isObject(combinedValue) && isObject(schemaValue)) {
                                /** @type {?} */
                                var combinedObject_1 = tslib_1.__assign({}, combinedValue);
                                // If new schema has additionalProperties,
                                // merge or remove non-matching property keys in combined schema
                                if (hasOwn(schemaValue, 'additionalProperties')) {
                                    Object.keys(combinedValue)
                                        .filter(function (combinedKey) { return !Object.keys(schemaValue).includes(combinedKey); })
                                        .forEach(function (nonMatchingKey) {
                                        if (schemaValue.additionalProperties === false) {
                                            delete combinedObject_1[nonMatchingKey];
                                        }
                                        else if (isObject(schemaValue.additionalProperties)) {
                                            combinedObject_1[nonMatchingKey] = mergeSchemas(combinedObject_1[nonMatchingKey], schemaValue.additionalProperties);
                                        }
                                    });
                                }
                                try {
                                    for (var _k = tslib_1.__values(Object.keys(schemaValue)), _l = _k.next(); !_l.done; _l = _k.next()) {
                                        var subKey = _l.value;
                                        if (_.isEqual(combinedObject_1[subKey], schemaValue[subKey]) || (!hasOwn(combinedObject_1, subKey) &&
                                            !hasOwn(combinedObject_1, 'additionalProperties'))) {
                                            combinedObject_1[subKey] = schemaValue[subKey];
                                            // If combined schema has additionalProperties,
                                            // merge or ignore non-matching property keys in new schema
                                        }
                                        else if (!hasOwn(combinedObject_1, subKey) &&
                                            hasOwn(combinedObject_1, 'additionalProperties')) {
                                            // If combinedObject.additionalProperties === false,
                                            // do nothing (don't set key)
                                            // If additionalProperties is object, merge with new key
                                            if (isObject(combinedObject_1.additionalProperties)) {
                                                combinedObject_1[subKey] = mergeSchemas(combinedObject_1.additionalProperties, schemaValue[subKey]);
                                            }
                                            // If both keys are objects, merge them
                                        }
                                        else if (isObject(schemaValue[subKey]) &&
                                            isObject(combinedObject_1[subKey])) {
                                            combinedObject_1[subKey] =
                                                mergeSchemas(combinedObject_1[subKey], schemaValue[subKey]);
                                        }
                                        else {
                                            return { value: { allOf: tslib_1.__spread(schemas) } };
                                        }
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (_l && !_l.done && (_m = _k.return)) _m.call(_k);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                                combinedSchema.properties = combinedObject_1;
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'required':
                            // If arrays, include all items from both arrays, excluding duplicates
                            if (isArray(combinedValue) && isArray(schemaValue)) {
                                combinedSchema.required = uniqueItems.apply(void 0, tslib_1.__spread(combinedValue, schemaValue));
                                // If booleans, aet true if either true
                            }
                            else if (typeof schemaValue === 'boolean' &&
                                typeof combinedValue === 'boolean') {
                                combinedSchema.required = !!combinedValue || !!schemaValue;
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case '$schema':
                        case '$id':
                        case 'id':
                            // Don't combine these keys
                            break;
                        case 'title':
                        case 'description':
                            // Return the last value, overwriting any previous one
                            // These properties are not used for validation, so conflicts don't matter
                            combinedSchema[key] = schemaValue;
                            break;
                        case 'type':
                            if ((isArray(schemaValue) || isString(schemaValue)) &&
                                (isArray(combinedValue) || isString(combinedValue))) {
                                /** @type {?} */
                                var combinedTypes = commonItems(combinedValue, schemaValue);
                                if (!combinedTypes.length) {
                                    return { value: { allOf: tslib_1.__spread(schemas) } };
                                }
                                combinedSchema.type = combinedTypes.length > 1 ? combinedTypes : combinedTypes[0];
                            }
                            else {
                                return { value: { allOf: tslib_1.__spread(schemas) } };
                            }
                            break;
                        case 'uniqueItems':
                            // Set true if either true
                            combinedSchema.uniqueItems = !!combinedValue || !!schemaValue;
                            break;
                        default: return { value: { allOf: tslib_1.__spread(schemas) } };
                    }
                }
                var e_1, _c, e_2, _f, e_3, _j, e_4, _m;
            };
            try {
                for (var _a = tslib_1.__values(Object.keys(schema)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    var state_1 = _loop_1(key);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (schemas_1_1 && !schemas_1_1.done && (_d = schemas_1.return)) _d.call(schemas_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return combinedSchema;
    var e_6, _d, e_5, _c;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2Utc2NoZW1hcy5mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2pzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJsaWIvc2hhcmVkL21lcmdlLXNjaGVtYXMuZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUU1QixPQUFPLEVBQ0wsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFDL0MsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJ2RSxNQUFNO0lBQXVCLGlCQUFVO1NBQVYsVUFBVSxFQUFWLHFCQUFVLEVBQVYsSUFBVTtRQUFWLDRCQUFVOztJQUNyQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUM7SUFDckQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFqQixDQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztLQUFFOztJQUMvRCxJQUFNLGNBQWMsR0FBUSxFQUFFLENBQUM7O1FBQy9CLEdBQUcsQ0FBQyxDQUFpQixJQUFBLFlBQUEsaUJBQUEsT0FBTyxDQUFBLGdDQUFBO1lBQXZCLElBQU0sTUFBTSxvQkFBQTtvQ0FDSixHQUFHOztnQkFDWixJQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7O2dCQUMxQyxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7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aUJBc1NiOzs7Ozs7Ozs7U0FDRjs7Ozs7Ozs7O0lBQ0QsTUFBTSxDQUFDLGNBQWMsQ0FBQzs7Q0FDdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGlzQXJyYXksIGlzRW1wdHksIGlzTnVtYmVyLCBpc09iamVjdCwgaXNTdHJpbmdcbn0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IGhhc093biwgdW5pcXVlSXRlbXMsIGNvbW1vbkl0ZW1zIH0gZnJvbSAnLi91dGlsaXR5LmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBKc29uUG9pbnRlciwgUG9pbnRlciB9IGZyb20gJy4vanNvbnBvaW50ZXIuZnVuY3Rpb25zJztcblxuLyoqXG4gKiAnbWVyZ2VTY2hlbWFzJyBmdW5jdGlvblxuICpcbiAqIE1lcmdlcyBtdWx0aXBsZSBKU09OIHNjaGVtYXMgaW50byBhIHNpbmdsZSBzY2hlbWEgd2l0aCBjb21iaW5lZCBydWxlcy5cbiAqXG4gKiBJZiBhYmxlIHRvIGxvZ2ljYWxseSBtZXJnZSBwcm9wZXJ0aWVzIGZyb20gYWxsIHNjaGVtYXMsXG4gKiByZXR1cm5zIGEgc2luZ2xlIHNjaGVtYSBvYmplY3QgY29udGFpbmluZyBhbGwgbWVyZ2VkIHByb3BlcnRpZXMuXG4gKlxuICogRXhhbXBsZTogKHsgYTogYiwgbWF4OiAxIH0sIHsgYzogZCwgbWF4OiAyIH0pID0+IHsgYTogYiwgYzogZCwgbWF4OiAxIH1cbiAqXG4gKiBJZiB1bmFibGUgdG8gbG9naWNhbGx5IG1lcmdlLCByZXR1cm5zIGFuIGFsbE9mIHNjaGVtYSBvYmplY3QgY29udGFpbmluZ1xuICogYW4gYXJyYXkgb2YgdGhlIG9yaWdpbmFsIHNjaGVtYXM7XG4gKlxuICogRXhhbXBsZTogKHsgYTogYiB9LCB7IGE6IGQgfSkgPT4geyBhbGxPZjogWyB7IGE6IGIgfSwgeyBhOiBkIH0gXSB9XG4gKlxuICogLy8gICBzY2hlbWFzIC0gb25lIG9yIG1vcmUgaW5wdXQgc2NoZW1hc1xuICogLy8gIC0gbWVyZ2VkIHNjaGVtYVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VTY2hlbWFzKC4uLnNjaGVtYXMpIHtcbiAgc2NoZW1hcyA9IHNjaGVtYXMuZmlsdGVyKHNjaGVtYSA9PiAhaXNFbXB0eShzY2hlbWEpKTtcbiAgaWYgKHNjaGVtYXMuc29tZShzY2hlbWEgPT4gIWlzT2JqZWN0KHNjaGVtYSkpKSB7IHJldHVybiBudWxsOyB9XG4gIGNvbnN0IGNvbWJpbmVkU2NoZW1hOiBhbnkgPSB7fTtcbiAgZm9yIChjb25zdCBzY2hlbWEgb2Ygc2NoZW1hcykge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYSkpIHtcbiAgICAgIGNvbnN0IGNvbWJpbmVkVmFsdWUgPSBjb21iaW5lZFNjaGVtYVtrZXldO1xuICAgICAgY29uc3Qgc2NoZW1hVmFsdWUgPSBzY2hlbWFba2V5XTtcbiAgICAgIGlmICghaGFzT3duKGNvbWJpbmVkU2NoZW1hLCBrZXkpIHx8IF8uaXNFcXVhbChjb21iaW5lZFZhbHVlLCBzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgY29tYmluZWRTY2hlbWFba2V5XSA9IHNjaGVtYVZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICBjYXNlICdhbGxPZic6XG4gICAgICAgICAgICAvLyBDb21iaW5lIGFsbCBpdGVtcyBmcm9tIGJvdGggYXJyYXlzXG4gICAgICAgICAgICBpZiAoaXNBcnJheShjb21iaW5lZFZhbHVlKSAmJiBpc0FycmF5KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5hbGxPZiA9IG1lcmdlU2NoZW1hcyguLi5jb21iaW5lZFZhbHVlLCAuLi5zY2hlbWFWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhZGRpdGlvbmFsSXRlbXMnOiBjYXNlICdhZGRpdGlvbmFsUHJvcGVydGllcyc6XG4gICAgICAgICAgY2FzZSAnY29udGFpbnMnOiBjYXNlICdwcm9wZXJ0eU5hbWVzJzpcbiAgICAgICAgICAgIC8vIE1lcmdlIHNjaGVtYSBvYmplY3RzXG4gICAgICAgICAgICBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hW2tleV0gPSBtZXJnZVNjaGVtYXMoY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgLy8gYWRkaXRpb25hbFByb3BlcnRpZXMgPT0gZmFsc2UgaW4gYW55IHNjaGVtYSBvdmVycmlkZXMgYWxsIG90aGVyIHZhbHVlc1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAga2V5ID09PSAnYWRkaXRpb25hbFByb3BlcnRpZXMnICYmXG4gICAgICAgICAgICAgIChjb21iaW5lZFZhbHVlID09PSBmYWxzZSB8fCBzY2hlbWFWYWx1ZSA9PT0gZmFsc2UpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEuY29tYmluZWRTY2hlbWEgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2FueU9mJzogY2FzZSAnb25lT2YnOiBjYXNlICdlbnVtJzpcbiAgICAgICAgICAgIC8vIEtlZXAgb25seSBpdGVtcyB0aGF0IGFwcGVhciBpbiBib3RoIGFycmF5c1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoY29tYmluZWRWYWx1ZSkgJiYgaXNBcnJheShzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWFba2V5XSA9IGNvbWJpbmVkVmFsdWUuZmlsdGVyKGl0ZW0xID0+XG4gICAgICAgICAgICAgICAgc2NoZW1hVmFsdWUuZmluZEluZGV4KGl0ZW0yID0+IF8uaXNFcXVhbChpdGVtMSwgaXRlbTIpKSA+IC0xXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGlmICghY29tYmluZWRTY2hlbWFba2V5XS5sZW5ndGgpIHsgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07IH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2RlZmluaXRpb25zJzpcbiAgICAgICAgICAgIC8vIENvbWJpbmUga2V5cyBmcm9tIGJvdGggb2JqZWN0c1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGNvbWJpbmVkVmFsdWUpICYmIGlzT2JqZWN0KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb25zdCBjb21iaW5lZE9iamVjdCA9IHsgLi4uY29tYmluZWRWYWx1ZSB9O1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN1YktleSBvZiBPYmplY3Qua2V5cyhzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc093bihjb21iaW5lZE9iamVjdCwgc3ViS2V5KSB8fFxuICAgICAgICAgICAgICAgICAgXy5pc0VxdWFsKGNvbWJpbmVkT2JqZWN0W3N1YktleV0sIHNjaGVtYVZhbHVlW3N1YktleV0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAvLyBEb24ndCBjb21iaW5lIG1hdGNoaW5nIGtleXMgd2l0aCBkaWZmZXJlbnQgdmFsdWVzXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5kZWZpbml0aW9ucyA9IGNvbWJpbmVkT2JqZWN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZGVwZW5kZW5jaWVzJzpcbiAgICAgICAgICAgIC8vIENvbWJpbmUgYWxsIGtleXMgZnJvbSBib3RoIG9iamVjdHNcbiAgICAgICAgICAgIC8vIGFuZCBtZXJnZSBzY2hlbWFzIG9uIG1hdGNoaW5nIGtleXMsXG4gICAgICAgICAgICAvLyBjb252ZXJ0aW5nIGZyb20gYXJyYXlzIHRvIG9iamVjdHMgaWYgbmVjZXNzYXJ5XG4gICAgICAgICAgICBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT2JqZWN0ID0geyAuLi5jb21iaW5lZFZhbHVlIH07XG4gICAgICAgICAgICAgIGZvciAoY29uc3Qgc3ViS2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmICghaGFzT3duKGNvbWJpbmVkT2JqZWN0LCBzdWJLZXkpIHx8XG4gICAgICAgICAgICAgICAgICBfLmlzRXF1YWwoY29tYmluZWRPYmplY3Rbc3ViS2V5XSwgc2NoZW1hVmFsdWVbc3ViS2V5XSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV0gPSBzY2hlbWFWYWx1ZVtzdWJLZXldO1xuICAgICAgICAgICAgICAgIC8vIElmIGJvdGgga2V5cyBhcmUgYXJyYXlzLCBpbmNsdWRlIGFsbCBpdGVtcyBmcm9tIGJvdGggYXJyYXlzLFxuICAgICAgICAgICAgICAgIC8vIGV4Y2x1ZGluZyBkdXBsaWNhdGVzXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgIGlzQXJyYXkoc2NoZW1hVmFsdWVbc3ViS2V5XSkgJiYgaXNBcnJheShjb21iaW5lZE9iamVjdFtzdWJLZXldKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgY29tYmluZWRPYmplY3Rbc3ViS2V5XSA9XG4gICAgICAgICAgICAgICAgICAgIHVuaXF1ZUl0ZW1zKC4uLmNvbWJpbmVkT2JqZWN0W3N1YktleV0sIC4uLnNjaGVtYVZhbHVlW3N1YktleV0pO1xuICAgICAgICAgICAgICAgIC8vIElmIGVpdGhlciBrZXkgaXMgYW4gb2JqZWN0LCBtZXJnZSB0aGUgc2NoZW1hc1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAoaXNBcnJheShzY2hlbWFWYWx1ZVtzdWJLZXldKSB8fCBpc09iamVjdChzY2hlbWFWYWx1ZVtzdWJLZXldKSkgJiZcbiAgICAgICAgICAgICAgICAgIChpc0FycmF5KGNvbWJpbmVkT2JqZWN0W3N1YktleV0pIHx8IGlzT2JqZWN0KGNvbWJpbmVkT2JqZWN0W3N1YktleV0pKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgLy8gSWYgZWl0aGVyIGtleSBpcyBhbiBhcnJheSwgY29udmVydCBpdCB0byBhbiBvYmplY3QgZmlyc3RcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVpcmVkID0gaXNBcnJheShjb21iaW5lZFNjaGVtYS5yZXF1aXJlZCkgP1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5yZXF1aXJlZCA6IFtdO1xuICAgICAgICAgICAgICAgICAgY29uc3QgY29tYmluZWREZXBlbmRlbmN5ID0gaXNBcnJheShjb21iaW5lZE9iamVjdFtzdWJLZXldKSA/XG4gICAgICAgICAgICAgICAgICAgIHsgcmVxdWlyZWQ6IHVuaXF1ZUl0ZW1zKC4uLnJlcXVpcmVkLCBjb21iaW5lZE9iamVjdFtzdWJLZXldKSB9IDpcbiAgICAgICAgICAgICAgICAgICAgY29tYmluZWRPYmplY3Rbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHNjaGVtYURlcGVuZGVuY3kgPSBpc0FycmF5KHNjaGVtYVZhbHVlW3N1YktleV0pID9cbiAgICAgICAgICAgICAgICAgICAgeyByZXF1aXJlZDogdW5pcXVlSXRlbXMoLi4ucmVxdWlyZWQsIHNjaGVtYVZhbHVlW3N1YktleV0pIH0gOlxuICAgICAgICAgICAgICAgICAgICBzY2hlbWFWYWx1ZVtzdWJLZXldO1xuICAgICAgICAgICAgICAgICAgY29tYmluZWRPYmplY3Rbc3ViS2V5XSA9XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlU2NoZW1hcyhjb21iaW5lZERlcGVuZGVuY3ksIHNjaGVtYURlcGVuZGVuY3kpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEuZGVwZW5kZW5jaWVzID0gY29tYmluZWRPYmplY3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdpdGVtcyc6XG4gICAgICAgICAgICAvLyBJZiBhcnJheXMsIGtlZXAgb25seSBpdGVtcyB0aGF0IGFwcGVhciBpbiBib3RoIGFycmF5c1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoY29tYmluZWRWYWx1ZSkgJiYgaXNBcnJheShzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEuaXRlbXMgPSBjb21iaW5lZFZhbHVlLmZpbHRlcihpdGVtMSA9PlxuICAgICAgICAgICAgICAgIHNjaGVtYVZhbHVlLmZpbmRJbmRleChpdGVtMiA9PiBfLmlzRXF1YWwoaXRlbTEsIGl0ZW0yKSkgPiAtMVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBpZiAoIWNvbWJpbmVkU2NoZW1hLml0ZW1zLmxlbmd0aCkgeyByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTsgfVxuICAgICAgICAgICAgLy8gSWYgYm90aCBrZXlzIGFyZSBvYmplY3RzLCBtZXJnZSB0aGVtXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGNvbWJpbmVkVmFsdWUpICYmIGlzT2JqZWN0KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5pdGVtcyA9IG1lcmdlU2NoZW1hcyhjb21iaW5lZFZhbHVlLCBzY2hlbWFWYWx1ZSk7XG4gICAgICAgICAgICAvLyBJZiBvYmplY3QgKyBhcnJheSwgY29tYmluZSBvYmplY3Qgd2l0aCBlYWNoIGFycmF5IGl0ZW1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb21iaW5lZFZhbHVlKSAmJiBpc09iamVjdChzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEuaXRlbXMgPVxuICAgICAgICAgICAgICAgIGNvbWJpbmVkVmFsdWUubWFwKGl0ZW0gPT4gbWVyZ2VTY2hlbWFzKGl0ZW0sIHNjaGVtYVZhbHVlKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGNvbWJpbmVkVmFsdWUpICYmIGlzQXJyYXkoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLml0ZW1zID1cbiAgICAgICAgICAgICAgICBzY2hlbWFWYWx1ZS5tYXAoaXRlbSA9PiBtZXJnZVNjaGVtYXMoaXRlbSwgY29tYmluZWRWYWx1ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbXVsdGlwbGVPZic6XG4gICAgICAgICAgICAvLyBUT0RPOiBBZGp1c3QgdG8gY29ycmVjdGx5IGhhbmRsZSBkZWNpbWFsIHZhbHVlc1xuICAgICAgICAgICAgLy8gSWYgbnVtYmVycywgc2V0IHRvIGxlYXN0IGNvbW1vbiBtdWx0aXBsZVxuICAgICAgICAgICAgaWYgKGlzTnVtYmVyKGNvbWJpbmVkVmFsdWUpICYmIGlzTnVtYmVyKHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb25zdCBnY2QgPSAoeCwgeSkgPT4gIXkgPyB4IDogZ2NkKHksIHggJSB5KTtcbiAgICAgICAgICAgICAgY29uc3QgbGNtID0gKHgsIHkpID0+ICh4ICogeSkgLyBnY2QoeCwgeSk7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLm11bHRpcGxlT2YgPSBsY20oY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbWF4aW11bSc6IGNhc2UgJ2V4Y2x1c2l2ZU1heGltdW0nOiBjYXNlICdtYXhMZW5ndGgnOlxuICAgICAgICAgIGNhc2UgJ21heEl0ZW1zJzogY2FzZSAnbWF4UHJvcGVydGllcyc6XG4gICAgICAgICAgICAvLyBJZiBudW1iZXJzLCBzZXQgdG8gbG93ZXN0IHZhbHVlXG4gICAgICAgICAgICBpZiAoaXNOdW1iZXIoY29tYmluZWRWYWx1ZSkgJiYgaXNOdW1iZXIoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hW2tleV0gPSBNYXRoLm1pbihjb21iaW5lZFZhbHVlLCBzY2hlbWFWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdtaW5pbXVtJzogY2FzZSAnZXhjbHVzaXZlTWluaW11bSc6IGNhc2UgJ21pbkxlbmd0aCc6XG4gICAgICAgICAgY2FzZSAnbWluSXRlbXMnOiBjYXNlICdtaW5Qcm9wZXJ0aWVzJzpcbiAgICAgICAgICAgIC8vIElmIG51bWJlcnMsIHNldCB0byBoaWdoZXN0IHZhbHVlXG4gICAgICAgICAgICBpZiAoaXNOdW1iZXIoY29tYmluZWRWYWx1ZSkgJiYgaXNOdW1iZXIoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hW2tleV0gPSBNYXRoLm1heChjb21iaW5lZFZhbHVlLCBzY2hlbWFWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdub3QnOlxuICAgICAgICAgICAgLy8gQ29tYmluZSBub3QgdmFsdWVzIGludG8gYW55T2YgYXJyYXlcbiAgICAgICAgICAgIGlmIChpc09iamVjdChjb21iaW5lZFZhbHVlKSAmJiBpc09iamVjdChzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29uc3Qgbm90QW55T2YgPSBbY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWVdXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgobm90QW55T2ZBcnJheSwgbm90U2NoZW1hKSA9PlxuICAgICAgICAgICAgICAgICAgaXNBcnJheShub3RTY2hlbWEuYW55T2YpICYmXG4gICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhub3RTY2hlbWEpLmxlbmd0aCA9PT0gMSA/XG4gICAgICAgICAgICAgICAgICAgIFsgLi4ubm90QW55T2ZBcnJheSwgLi4ubm90U2NoZW1hLmFueU9mIF0gOlxuICAgICAgICAgICAgICAgICAgICBbIC4uLm5vdEFueU9mQXJyYXksIG5vdFNjaGVtYSBdXG4gICAgICAgICAgICAgICAgLCBbXSk7XG4gICAgICAgICAgICAgIC8vIFRPRE86IFJlbW92ZSBkdXBsaWNhdGUgaXRlbXMgZnJvbSBhcnJheVxuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5ub3QgPSB7IGFueU9mOiBub3RBbnlPZiB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncGF0dGVyblByb3BlcnRpZXMnOlxuICAgICAgICAgICAgLy8gQ29tYmluZSBhbGwga2V5cyBmcm9tIGJvdGggb2JqZWN0c1xuICAgICAgICAgICAgLy8gYW5kIG1lcmdlIHNjaGVtYXMgb24gbWF0Y2hpbmcga2V5c1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGNvbWJpbmVkVmFsdWUpICYmIGlzT2JqZWN0KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb25zdCBjb21iaW5lZE9iamVjdCA9IHsgLi4uY29tYmluZWRWYWx1ZSB9O1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN1YktleSBvZiBPYmplY3Qua2V5cyhzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc093bihjb21iaW5lZE9iamVjdCwgc3ViS2V5KSB8fFxuICAgICAgICAgICAgICAgICAgXy5pc0VxdWFsKGNvbWJpbmVkT2JqZWN0W3N1YktleV0sIHNjaGVtYVZhbHVlW3N1YktleV0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAvLyBJZiBib3RoIGtleXMgYXJlIG9iamVjdHMsIG1lcmdlIHRoZW1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgaXNPYmplY3Qoc2NoZW1hVmFsdWVbc3ViS2V5XSkgJiYgaXNPYmplY3QoY29tYmluZWRPYmplY3Rbc3ViS2V5XSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV0gPVxuICAgICAgICAgICAgICAgICAgICBtZXJnZVNjaGVtYXMoY29tYmluZWRPYmplY3Rbc3ViS2V5XSwgc2NoZW1hVmFsdWVbc3ViS2V5XSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5wYXR0ZXJuUHJvcGVydGllcyA9IGNvbWJpbmVkT2JqZWN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncHJvcGVydGllcyc6XG4gICAgICAgICAgICAvLyBDb21iaW5lIGFsbCBrZXlzIGZyb20gYm90aCBvYmplY3RzXG4gICAgICAgICAgICAvLyB1bmxlc3MgYWRkaXRpb25hbFByb3BlcnRpZXMgPT09IGZhbHNlXG4gICAgICAgICAgICAvLyBhbmQgbWVyZ2Ugc2NoZW1hcyBvbiBtYXRjaGluZyBrZXlzXG4gICAgICAgICAgICBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT2JqZWN0ID0geyAuLi5jb21iaW5lZFZhbHVlIH07XG4gICAgICAgICAgICAgIC8vIElmIG5ldyBzY2hlbWEgaGFzIGFkZGl0aW9uYWxQcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAvLyBtZXJnZSBvciByZW1vdmUgbm9uLW1hdGNoaW5nIHByb3BlcnR5IGtleXMgaW4gY29tYmluZWQgc2NoZW1hXG4gICAgICAgICAgICAgIGlmIChoYXNPd24oc2NoZW1hVmFsdWUsICdhZGRpdGlvbmFsUHJvcGVydGllcycpKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29tYmluZWRWYWx1ZSlcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIoY29tYmluZWRLZXkgPT4gIU9iamVjdC5rZXlzKHNjaGVtYVZhbHVlKS5pbmNsdWRlcyhjb21iaW5lZEtleSkpXG4gICAgICAgICAgICAgICAgICAuZm9yRWFjaChub25NYXRjaGluZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWFWYWx1ZS5hZGRpdGlvbmFsUHJvcGVydGllcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29tYmluZWRPYmplY3Rbbm9uTWF0Y2hpbmdLZXldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHNjaGVtYVZhbHVlLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W25vbk1hdGNoaW5nS2V5XSA9IG1lcmdlU2NoZW1hcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W25vbk1hdGNoaW5nS2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVtYVZhbHVlLmFkZGl0aW9uYWxQcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9yIChjb25zdCBzdWJLZXkgb2YgT2JqZWN0LmtleXMoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8uaXNFcXVhbChjb21iaW5lZE9iamVjdFtzdWJLZXldLCBzY2hlbWFWYWx1ZVtzdWJLZXldKSB8fCAoXG4gICAgICAgICAgICAgICAgICAhaGFzT3duKGNvbWJpbmVkT2JqZWN0LCBzdWJLZXkpICYmXG4gICAgICAgICAgICAgICAgICAhaGFzT3duKGNvbWJpbmVkT2JqZWN0LCAnYWRkaXRpb25hbFByb3BlcnRpZXMnKVxuICAgICAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV0gPSBzY2hlbWFWYWx1ZVtzdWJLZXldO1xuICAgICAgICAgICAgICAgIC8vIElmIGNvbWJpbmVkIHNjaGVtYSBoYXMgYWRkaXRpb25hbFByb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgLy8gbWVyZ2Ugb3IgaWdub3JlIG5vbi1tYXRjaGluZyBwcm9wZXJ0eSBrZXlzIGluIG5ldyBzY2hlbWFcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgIWhhc093bihjb21iaW5lZE9iamVjdCwgc3ViS2V5KSAmJlxuICAgICAgICAgICAgICAgICAgaGFzT3duKGNvbWJpbmVkT2JqZWN0LCAnYWRkaXRpb25hbFByb3BlcnRpZXMnKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgLy8gSWYgY29tYmluZWRPYmplY3QuYWRkaXRpb25hbFByb3BlcnRpZXMgPT09IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAoZG9uJ3Qgc2V0IGtleSlcbiAgICAgICAgICAgICAgICAgIC8vIElmIGFkZGl0aW9uYWxQcm9wZXJ0aWVzIGlzIG9iamVjdCwgbWVyZ2Ugd2l0aCBuZXcga2V5XG4gICAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QoY29tYmluZWRPYmplY3QuYWRkaXRpb25hbFByb3BlcnRpZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV0gPSBtZXJnZVNjaGVtYXMoXG4gICAgICAgICAgICAgICAgICAgICAgY29tYmluZWRPYmplY3QuYWRkaXRpb25hbFByb3BlcnRpZXMsIHNjaGVtYVZhbHVlW3N1YktleV1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBib3RoIGtleXMgYXJlIG9iamVjdHMsIG1lcmdlIHRoZW1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgaXNPYmplY3Qoc2NoZW1hVmFsdWVbc3ViS2V5XSkgJiZcbiAgICAgICAgICAgICAgICAgIGlzT2JqZWN0KGNvbWJpbmVkT2JqZWN0W3N1YktleV0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID1cbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VTY2hlbWFzKGNvbWJpbmVkT2JqZWN0W3N1YktleV0sIHNjaGVtYVZhbHVlW3N1YktleV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEucHJvcGVydGllcyA9IGNvbWJpbmVkT2JqZWN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncmVxdWlyZWQnOlxuICAgICAgICAgICAgLy8gSWYgYXJyYXlzLCBpbmNsdWRlIGFsbCBpdGVtcyBmcm9tIGJvdGggYXJyYXlzLCBleGNsdWRpbmcgZHVwbGljYXRlc1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoY29tYmluZWRWYWx1ZSkgJiYgaXNBcnJheShzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEucmVxdWlyZWQgPSB1bmlxdWVJdGVtcyguLi5jb21iaW5lZFZhbHVlLCAuLi5zY2hlbWFWYWx1ZSk7XG4gICAgICAgICAgICAvLyBJZiBib29sZWFucywgYWV0IHRydWUgaWYgZWl0aGVyIHRydWVcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgIHR5cGVvZiBzY2hlbWFWYWx1ZSA9PT0gJ2Jvb2xlYW4nICYmXG4gICAgICAgICAgICAgIHR5cGVvZiBjb21iaW5lZFZhbHVlID09PSAnYm9vbGVhbidcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5yZXF1aXJlZCA9ICEhY29tYmluZWRWYWx1ZSB8fCAhIXNjaGVtYVZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnJHNjaGVtYSc6IGNhc2UgJyRpZCc6IGNhc2UgJ2lkJzpcbiAgICAgICAgICAgIC8vIERvbid0IGNvbWJpbmUgdGhlc2Uga2V5c1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3RpdGxlJzogY2FzZSAnZGVzY3JpcHRpb24nOlxuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBsYXN0IHZhbHVlLCBvdmVyd3JpdGluZyBhbnkgcHJldmlvdXMgb25lXG4gICAgICAgICAgICAvLyBUaGVzZSBwcm9wZXJ0aWVzIGFyZSBub3QgdXNlZCBmb3IgdmFsaWRhdGlvbiwgc28gY29uZmxpY3RzIGRvbid0IG1hdHRlclxuICAgICAgICAgICAgY29tYmluZWRTY2hlbWFba2V5XSA9IHNjaGVtYVZhbHVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3R5cGUnOlxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAoaXNBcnJheShzY2hlbWFWYWx1ZSkgfHwgaXNTdHJpbmcoc2NoZW1hVmFsdWUpKSAmJlxuICAgICAgICAgICAgICAoaXNBcnJheShjb21iaW5lZFZhbHVlKSB8fCBpc1N0cmluZyhjb21iaW5lZFZhbHVlKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBjb25zdCBjb21iaW5lZFR5cGVzID0gY29tbW9uSXRlbXMoY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgICBpZiAoIWNvbWJpbmVkVHlwZXMubGVuZ3RoKSB7IHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9OyB9XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLnR5cGUgPSBjb21iaW5lZFR5cGVzLmxlbmd0aCA+IDEgPyBjb21iaW5lZFR5cGVzIDogY29tYmluZWRUeXBlc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3VuaXF1ZUl0ZW1zJzpcbiAgICAgICAgICAgIC8vIFNldCB0cnVlIGlmIGVpdGhlciB0cnVlXG4gICAgICAgICAgICBjb21iaW5lZFNjaGVtYS51bmlxdWVJdGVtcyA9ICEhY29tYmluZWRWYWx1ZSB8fCAhIXNjaGVtYVZhbHVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29tYmluZWRTY2hlbWE7XG59XG4iXX0=