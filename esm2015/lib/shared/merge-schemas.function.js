/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
export function mergeSchemas(...schemas) {
    schemas = schemas.filter(schema => !isEmpty(schema));
    if (schemas.some(schema => !isObject(schema))) {
        return null;
    }
    /** @type {?} */
    const combinedSchema = {};
    for (const schema of schemas) {
        for (const key of Object.keys(schema)) {
            /** @type {?} */
            const combinedValue = combinedSchema[key];
            /** @type {?} */
            const schemaValue = schema[key];
            if (!hasOwn(combinedSchema, key) || _.isEqual(combinedValue, schemaValue)) {
                combinedSchema[key] = schemaValue;
            }
            else {
                switch (key) {
                    case 'allOf':
                        // Combine all items from both arrays
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.allOf = mergeSchemas(...combinedValue, ...schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
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
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'anyOf':
                    case 'oneOf':
                    case 'enum':
                        // Keep only items that appear in both arrays
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema[key] = combinedValue.filter(item1 => schemaValue.findIndex(item2 => _.isEqual(item1, item2)) > -1);
                            if (!combinedSchema[key].length) {
                                return { allOf: [...schemas] };
                            }
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'definitions':
                        // Combine keys from both objects
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const combinedObject = Object.assign({}, combinedValue);
                            for (const subKey of Object.keys(schemaValue)) {
                                if (!hasOwn(combinedObject, subKey) ||
                                    _.isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // Don't combine matching keys with different values
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.definitions = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'dependencies':
                        // Combine all keys from both objects
                        // and merge schemas on matching keys,
                        // converting from arrays to objects if necessary
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const combinedObject = Object.assign({}, combinedValue);
                            for (const subKey of Object.keys(schemaValue)) {
                                if (!hasOwn(combinedObject, subKey) ||
                                    _.isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // If both keys are arrays, include all items from both arrays,
                                    // excluding duplicates
                                }
                                else if (isArray(schemaValue[subKey]) && isArray(combinedObject[subKey])) {
                                    combinedObject[subKey] =
                                        uniqueItems(...combinedObject[subKey], ...schemaValue[subKey]);
                                    // If either key is an object, merge the schemas
                                }
                                else if ((isArray(schemaValue[subKey]) || isObject(schemaValue[subKey])) &&
                                    (isArray(combinedObject[subKey]) || isObject(combinedObject[subKey]))) {
                                    /** @type {?} */
                                    const required = isArray(combinedSchema.required) ?
                                        combinedSchema.required : [];
                                    /** @type {?} */
                                    const combinedDependency = isArray(combinedObject[subKey]) ?
                                        { required: uniqueItems(...required, combinedObject[subKey]) } :
                                        combinedObject[subKey];
                                    /** @type {?} */
                                    const schemaDependency = isArray(schemaValue[subKey]) ?
                                        { required: uniqueItems(...required, schemaValue[subKey]) } :
                                        schemaValue[subKey];
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedDependency, schemaDependency);
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.dependencies = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'items':
                        // If arrays, keep only items that appear in both arrays
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.items = combinedValue.filter(item1 => schemaValue.findIndex(item2 => _.isEqual(item1, item2)) > -1);
                            if (!combinedSchema.items.length) {
                                return { allOf: [...schemas] };
                            }
                            // If both keys are objects, merge them
                        }
                        else if (isObject(combinedValue) && isObject(schemaValue)) {
                            combinedSchema.items = mergeSchemas(combinedValue, schemaValue);
                            // If object + array, combine object with each array item
                        }
                        else if (isArray(combinedValue) && isObject(schemaValue)) {
                            combinedSchema.items =
                                combinedValue.map(item => mergeSchemas(item, schemaValue));
                        }
                        else if (isObject(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.items =
                                schemaValue.map(item => mergeSchemas(item, combinedValue));
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'multipleOf':
                        // TODO: Adjust to correctly handle decimal values
                        // If numbers, set to least common multiple
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            /** @type {?} */
                            const gcd = (x, y) => !y ? x : gcd(y, x % y);
                            /** @type {?} */
                            const lcm = (x, y) => (x * y) / gcd(x, y);
                            combinedSchema.multipleOf = lcm(combinedValue, schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
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
                            return { allOf: [...schemas] };
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
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'not':
                        // Combine not values into anyOf array
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const notAnyOf = [combinedValue, schemaValue]
                                .reduce((notAnyOfArray, notSchema) => isArray(notSchema.anyOf) &&
                                Object.keys(notSchema).length === 1 ?
                                [...notAnyOfArray, ...notSchema.anyOf] :
                                [...notAnyOfArray, notSchema], []);
                            // TODO: Remove duplicate items from array
                            combinedSchema.not = { anyOf: notAnyOf };
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'patternProperties':
                        // Combine all keys from both objects
                        // and merge schemas on matching keys
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const combinedObject = Object.assign({}, combinedValue);
                            for (const subKey of Object.keys(schemaValue)) {
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
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.patternProperties = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'properties':
                        // Combine all keys from both objects
                        // unless additionalProperties === false
                        // and merge schemas on matching keys
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            /** @type {?} */
                            const combinedObject = Object.assign({}, combinedValue);
                            // If new schema has additionalProperties,
                            // merge or remove non-matching property keys in combined schema
                            if (hasOwn(schemaValue, 'additionalProperties')) {
                                Object.keys(combinedValue)
                                    .filter(combinedKey => !Object.keys(schemaValue).includes(combinedKey))
                                    .forEach(nonMatchingKey => {
                                    if (schemaValue.additionalProperties === false) {
                                        delete combinedObject[nonMatchingKey];
                                    }
                                    else if (isObject(schemaValue.additionalProperties)) {
                                        combinedObject[nonMatchingKey] = mergeSchemas(combinedObject[nonMatchingKey], schemaValue.additionalProperties);
                                    }
                                });
                            }
                            for (const subKey of Object.keys(schemaValue)) {
                                if (_.isEqual(combinedObject[subKey], schemaValue[subKey]) || (!hasOwn(combinedObject, subKey) &&
                                    !hasOwn(combinedObject, 'additionalProperties'))) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // If combined schema has additionalProperties,
                                    // merge or ignore non-matching property keys in new schema
                                }
                                else if (!hasOwn(combinedObject, subKey) &&
                                    hasOwn(combinedObject, 'additionalProperties')) {
                                    // If combinedObject.additionalProperties === false,
                                    // do nothing (don't set key)
                                    // If additionalProperties is object, merge with new key
                                    if (isObject(combinedObject.additionalProperties)) {
                                        combinedObject[subKey] = mergeSchemas(combinedObject.additionalProperties, schemaValue[subKey]);
                                    }
                                    // If both keys are objects, merge them
                                }
                                else if (isObject(schemaValue[subKey]) &&
                                    isObject(combinedObject[subKey])) {
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedObject[subKey], schemaValue[subKey]);
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.properties = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'required':
                        // If arrays, include all items from both arrays, excluding duplicates
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.required = uniqueItems(...combinedValue, ...schemaValue);
                            // If booleans, aet true if either true
                        }
                        else if (typeof schemaValue === 'boolean' &&
                            typeof combinedValue === 'boolean') {
                            combinedSchema.required = !!combinedValue || !!schemaValue;
                        }
                        else {
                            return { allOf: [...schemas] };
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
                            const combinedTypes = commonItems(combinedValue, schemaValue);
                            if (!combinedTypes.length) {
                                return { allOf: [...schemas] };
                            }
                            combinedSchema.type = combinedTypes.length > 1 ? combinedTypes : combinedTypes[0];
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'uniqueItems':
                        // Set true if either true
                        combinedSchema.uniqueItems = !!combinedValue || !!schemaValue;
                        break;
                    default:
                        return { allOf: [...schemas] };
                }
            }
        }
    }
    return combinedSchema;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2Utc2NoZW1hcy5mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2pzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJsaWIvc2hhcmVkL21lcmdlLXNjaGVtYXMuZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sS0FBSyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBRTVCLE9BQU8sRUFDTCxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUMvQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQnZFLE1BQU0sdUJBQXVCLEdBQUcsT0FBTztJQUNyQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztLQUFFOztJQUMvRCxNQUFNLGNBQWMsR0FBUSxFQUFFLENBQUM7SUFDL0IsR0FBRyxDQUFDLENBQUMsTUFBTSxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztRQUM3QixHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDdEMsTUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUMxQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFD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Q0FBRSxFQUFFLENBQUM7eUJBQ2xDO3dCQUNILEtBQUssQ0FBQztvQkFDTixLQUFLLGFBQWE7O3dCQUVoQixjQUFjLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQzt3QkFDaEUsS0FBSyxDQUFDO29CQUNOO3dCQUNFLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFFLEdBQUcsT0FBTyxDQUFFLEVBQUUsQ0FBQztpQkFDcEM7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDO0NBQ3ZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQge1xuICBpc0FycmF5LCBpc0VtcHR5LCBpc051bWJlciwgaXNPYmplY3QsIGlzU3RyaW5nXG59IGZyb20gJy4vdmFsaWRhdG9yLmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBoYXNPd24sIHVuaXF1ZUl0ZW1zLCBjb21tb25JdGVtcyB9IGZyb20gJy4vdXRpbGl0eS5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgSnNvblBvaW50ZXIsIFBvaW50ZXIgfSBmcm9tICcuL2pzb25wb2ludGVyLmZ1bmN0aW9ucyc7XG5cbi8qKlxuICogJ21lcmdlU2NoZW1hcycgZnVuY3Rpb25cbiAqXG4gKiBNZXJnZXMgbXVsdGlwbGUgSlNPTiBzY2hlbWFzIGludG8gYSBzaW5nbGUgc2NoZW1hIHdpdGggY29tYmluZWQgcnVsZXMuXG4gKlxuICogSWYgYWJsZSB0byBsb2dpY2FsbHkgbWVyZ2UgcHJvcGVydGllcyBmcm9tIGFsbCBzY2hlbWFzLFxuICogcmV0dXJucyBhIHNpbmdsZSBzY2hlbWEgb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG1lcmdlZCBwcm9wZXJ0aWVzLlxuICpcbiAqIEV4YW1wbGU6ICh7IGE6IGIsIG1heDogMSB9LCB7IGM6IGQsIG1heDogMiB9KSA9PiB7IGE6IGIsIGM6IGQsIG1heDogMSB9XG4gKlxuICogSWYgdW5hYmxlIHRvIGxvZ2ljYWxseSBtZXJnZSwgcmV0dXJucyBhbiBhbGxPZiBzY2hlbWEgb2JqZWN0IGNvbnRhaW5pbmdcbiAqIGFuIGFycmF5IG9mIHRoZSBvcmlnaW5hbCBzY2hlbWFzO1xuICpcbiAqIEV4YW1wbGU6ICh7IGE6IGIgfSwgeyBhOiBkIH0pID0+IHsgYWxsT2Y6IFsgeyBhOiBiIH0sIHsgYTogZCB9IF0gfVxuICpcbiAqIC8vICAgc2NoZW1hcyAtIG9uZSBvciBtb3JlIGlucHV0IHNjaGVtYXNcbiAqIC8vICAtIG1lcmdlZCBzY2hlbWFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlU2NoZW1hcyguLi5zY2hlbWFzKSB7XG4gIHNjaGVtYXMgPSBzY2hlbWFzLmZpbHRlcihzY2hlbWEgPT4gIWlzRW1wdHkoc2NoZW1hKSk7XG4gIGlmIChzY2hlbWFzLnNvbWUoc2NoZW1hID0+ICFpc09iamVjdChzY2hlbWEpKSkgeyByZXR1cm4gbnVsbDsgfVxuICBjb25zdCBjb21iaW5lZFNjaGVtYTogYW55ID0ge307XG4gIGZvciAoY29uc3Qgc2NoZW1hIG9mIHNjaGVtYXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzY2hlbWEpKSB7XG4gICAgICBjb25zdCBjb21iaW5lZFZhbHVlID0gY29tYmluZWRTY2hlbWFba2V5XTtcbiAgICAgIGNvbnN0IHNjaGVtYVZhbHVlID0gc2NoZW1hW2tleV07XG4gICAgICBpZiAoIWhhc093bihjb21iaW5lZFNjaGVtYSwga2V5KSB8fCBfLmlzRXF1YWwoY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgIGNvbWJpbmVkU2NoZW1hW2tleV0gPSBzY2hlbWFWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgY2FzZSAnYWxsT2YnOlxuICAgICAgICAgICAgLy8gQ29tYmluZSBhbGwgaXRlbXMgZnJvbSBib3RoIGFycmF5c1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoY29tYmluZWRWYWx1ZSkgJiYgaXNBcnJheShzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEuYWxsT2YgPSBtZXJnZVNjaGVtYXMoLi4uY29tYmluZWRWYWx1ZSwgLi4uc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWRkaXRpb25hbEl0ZW1zJzogY2FzZSAnYWRkaXRpb25hbFByb3BlcnRpZXMnOlxuICAgICAgICAgIGNhc2UgJ2NvbnRhaW5zJzogY2FzZSAncHJvcGVydHlOYW1lcyc6XG4gICAgICAgICAgICAvLyBNZXJnZSBzY2hlbWEgb2JqZWN0c1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGNvbWJpbmVkVmFsdWUpICYmIGlzT2JqZWN0KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYVtrZXldID0gbWVyZ2VTY2hlbWFzKGNvbWJpbmVkVmFsdWUsIHNjaGVtYVZhbHVlKTtcbiAgICAgICAgICAgIC8vIGFkZGl0aW9uYWxQcm9wZXJ0aWVzID09IGZhbHNlIGluIGFueSBzY2hlbWEgb3ZlcnJpZGVzIGFsbCBvdGhlciB2YWx1ZXNcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgIGtleSA9PT0gJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyAmJlxuICAgICAgICAgICAgICAoY29tYmluZWRWYWx1ZSA9PT0gZmFsc2UgfHwgc2NoZW1hVmFsdWUgPT09IGZhbHNlKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLmNvbWJpbmVkU2NoZW1hID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhbnlPZic6IGNhc2UgJ29uZU9mJzogY2FzZSAnZW51bSc6XG4gICAgICAgICAgICAvLyBLZWVwIG9ubHkgaXRlbXMgdGhhdCBhcHBlYXIgaW4gYm90aCBhcnJheXNcbiAgICAgICAgICAgIGlmIChpc0FycmF5KGNvbWJpbmVkVmFsdWUpICYmIGlzQXJyYXkoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hW2tleV0gPSBjb21iaW5lZFZhbHVlLmZpbHRlcihpdGVtMSA9PlxuICAgICAgICAgICAgICAgIHNjaGVtYVZhbHVlLmZpbmRJbmRleChpdGVtMiA9PiBfLmlzRXF1YWwoaXRlbTEsIGl0ZW0yKSkgPiAtMVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBpZiAoIWNvbWJpbmVkU2NoZW1hW2tleV0ubGVuZ3RoKSB7IHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9OyB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdkZWZpbml0aW9ucyc6XG4gICAgICAgICAgICAvLyBDb21iaW5lIGtleXMgZnJvbSBib3RoIG9iamVjdHNcbiAgICAgICAgICAgIGlmIChpc09iamVjdChjb21iaW5lZFZhbHVlKSAmJiBpc09iamVjdChzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29uc3QgY29tYmluZWRPYmplY3QgPSB7IC4uLmNvbWJpbmVkVmFsdWUgfTtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCBzdWJLZXkgb2YgT2JqZWN0LmtleXMoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNPd24oY29tYmluZWRPYmplY3QsIHN1YktleSkgfHxcbiAgICAgICAgICAgICAgICAgIF8uaXNFcXVhbChjb21iaW5lZE9iamVjdFtzdWJLZXldLCBzY2hlbWFWYWx1ZVtzdWJLZXldKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgY29tYmluZWRPYmplY3Rbc3ViS2V5XSA9IHNjaGVtYVZhbHVlW3N1YktleV07XG4gICAgICAgICAgICAgICAgLy8gRG9uJ3QgY29tYmluZSBtYXRjaGluZyBrZXlzIHdpdGggZGlmZmVyZW50IHZhbHVlc1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEuZGVmaW5pdGlvbnMgPSBjb21iaW5lZE9iamVjdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2RlcGVuZGVuY2llcyc6XG4gICAgICAgICAgICAvLyBDb21iaW5lIGFsbCBrZXlzIGZyb20gYm90aCBvYmplY3RzXG4gICAgICAgICAgICAvLyBhbmQgbWVyZ2Ugc2NoZW1hcyBvbiBtYXRjaGluZyBrZXlzLFxuICAgICAgICAgICAgLy8gY29udmVydGluZyBmcm9tIGFycmF5cyB0byBvYmplY3RzIGlmIG5lY2Vzc2FyeVxuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGNvbWJpbmVkVmFsdWUpICYmIGlzT2JqZWN0KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb25zdCBjb21iaW5lZE9iamVjdCA9IHsgLi4uY29tYmluZWRWYWx1ZSB9O1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN1YktleSBvZiBPYmplY3Qua2V5cyhzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc093bihjb21iaW5lZE9iamVjdCwgc3ViS2V5KSB8fFxuICAgICAgICAgICAgICAgICAgXy5pc0VxdWFsKGNvbWJpbmVkT2JqZWN0W3N1YktleV0sIHNjaGVtYVZhbHVlW3N1YktleV0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAvLyBJZiBib3RoIGtleXMgYXJlIGFycmF5cywgaW5jbHVkZSBhbGwgaXRlbXMgZnJvbSBib3RoIGFycmF5cyxcbiAgICAgICAgICAgICAgICAvLyBleGNsdWRpbmcgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICBpc0FycmF5KHNjaGVtYVZhbHVlW3N1YktleV0pICYmIGlzQXJyYXkoY29tYmluZWRPYmplY3Rbc3ViS2V5XSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV0gPVxuICAgICAgICAgICAgICAgICAgICB1bmlxdWVJdGVtcyguLi5jb21iaW5lZE9iamVjdFtzdWJLZXldLCAuLi5zY2hlbWFWYWx1ZVtzdWJLZXldKTtcbiAgICAgICAgICAgICAgICAvLyBJZiBlaXRoZXIga2V5IGlzIGFuIG9iamVjdCwgbWVyZ2UgdGhlIHNjaGVtYXNcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgKGlzQXJyYXkoc2NoZW1hVmFsdWVbc3ViS2V5XSkgfHwgaXNPYmplY3Qoc2NoZW1hVmFsdWVbc3ViS2V5XSkpICYmXG4gICAgICAgICAgICAgICAgICAoaXNBcnJheShjb21iaW5lZE9iamVjdFtzdWJLZXldKSB8fCBpc09iamVjdChjb21iaW5lZE9iamVjdFtzdWJLZXldKSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIC8vIElmIGVpdGhlciBrZXkgaXMgYW4gYXJyYXksIGNvbnZlcnQgaXQgdG8gYW4gb2JqZWN0IGZpcnN0XG4gICAgICAgICAgICAgICAgICBjb25zdCByZXF1aXJlZCA9IGlzQXJyYXkoY29tYmluZWRTY2hlbWEucmVxdWlyZWQpID9cbiAgICAgICAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEucmVxdWlyZWQgOiBbXTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkRGVwZW5kZW5jeSA9IGlzQXJyYXkoY29tYmluZWRPYmplY3Rbc3ViS2V5XSkgP1xuICAgICAgICAgICAgICAgICAgICB7IHJlcXVpcmVkOiB1bmlxdWVJdGVtcyguLi5yZXF1aXJlZCwgY29tYmluZWRPYmplY3Rbc3ViS2V5XSkgfSA6XG4gICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV07XG4gICAgICAgICAgICAgICAgICBjb25zdCBzY2hlbWFEZXBlbmRlbmN5ID0gaXNBcnJheShzY2hlbWFWYWx1ZVtzdWJLZXldKSA/XG4gICAgICAgICAgICAgICAgICAgIHsgcmVxdWlyZWQ6IHVuaXF1ZUl0ZW1zKC4uLnJlcXVpcmVkLCBzY2hlbWFWYWx1ZVtzdWJLZXldKSB9IDpcbiAgICAgICAgICAgICAgICAgICAgc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV0gPVxuICAgICAgICAgICAgICAgICAgICBtZXJnZVNjaGVtYXMoY29tYmluZWREZXBlbmRlbmN5LCBzY2hlbWFEZXBlbmRlbmN5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLmRlcGVuZGVuY2llcyA9IGNvbWJpbmVkT2JqZWN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnaXRlbXMnOlxuICAgICAgICAgICAgLy8gSWYgYXJyYXlzLCBrZWVwIG9ubHkgaXRlbXMgdGhhdCBhcHBlYXIgaW4gYm90aCBhcnJheXNcbiAgICAgICAgICAgIGlmIChpc0FycmF5KGNvbWJpbmVkVmFsdWUpICYmIGlzQXJyYXkoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLml0ZW1zID0gY29tYmluZWRWYWx1ZS5maWx0ZXIoaXRlbTEgPT5cbiAgICAgICAgICAgICAgICBzY2hlbWFWYWx1ZS5maW5kSW5kZXgoaXRlbTIgPT4gXy5pc0VxdWFsKGl0ZW0xLCBpdGVtMikpID4gLTFcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgaWYgKCFjb21iaW5lZFNjaGVtYS5pdGVtcy5sZW5ndGgpIHsgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07IH1cbiAgICAgICAgICAgIC8vIElmIGJvdGgga2V5cyBhcmUgb2JqZWN0cywgbWVyZ2UgdGhlbVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChjb21iaW5lZFZhbHVlKSAmJiBpc09iamVjdChzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEuaXRlbXMgPSBtZXJnZVNjaGVtYXMoY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgLy8gSWYgb2JqZWN0ICsgYXJyYXksIGNvbWJpbmUgb2JqZWN0IHdpdGggZWFjaCBhcnJheSBpdGVtXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLml0ZW1zID1cbiAgICAgICAgICAgICAgICBjb21iaW5lZFZhbHVlLm1hcChpdGVtID0+IG1lcmdlU2NoZW1hcyhpdGVtLCBzY2hlbWFWYWx1ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChjb21iaW5lZFZhbHVlKSAmJiBpc0FycmF5KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5pdGVtcyA9XG4gICAgICAgICAgICAgICAgc2NoZW1hVmFsdWUubWFwKGl0ZW0gPT4gbWVyZ2VTY2hlbWFzKGl0ZW0sIGNvbWJpbmVkVmFsdWUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ211bHRpcGxlT2YnOlxuICAgICAgICAgICAgLy8gVE9ETzogQWRqdXN0IHRvIGNvcnJlY3RseSBoYW5kbGUgZGVjaW1hbCB2YWx1ZXNcbiAgICAgICAgICAgIC8vIElmIG51bWJlcnMsIHNldCB0byBsZWFzdCBjb21tb24gbXVsdGlwbGVcbiAgICAgICAgICAgIGlmIChpc051bWJlcihjb21iaW5lZFZhbHVlKSAmJiBpc051bWJlcihzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29uc3QgZ2NkID0gKHgsIHkpID0+ICF5ID8geCA6IGdjZCh5LCB4ICUgeSk7XG4gICAgICAgICAgICAgIGNvbnN0IGxjbSA9ICh4LCB5KSA9PiAoeCAqIHkpIC8gZ2NkKHgsIHkpO1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5tdWx0aXBsZU9mID0gbGNtKGNvbWJpbmVkVmFsdWUsIHNjaGVtYVZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ21heGltdW0nOiBjYXNlICdleGNsdXNpdmVNYXhpbXVtJzogY2FzZSAnbWF4TGVuZ3RoJzpcbiAgICAgICAgICBjYXNlICdtYXhJdGVtcyc6IGNhc2UgJ21heFByb3BlcnRpZXMnOlxuICAgICAgICAgICAgLy8gSWYgbnVtYmVycywgc2V0IHRvIGxvd2VzdCB2YWx1ZVxuICAgICAgICAgICAgaWYgKGlzTnVtYmVyKGNvbWJpbmVkVmFsdWUpICYmIGlzTnVtYmVyKHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYVtrZXldID0gTWF0aC5taW4oY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbWluaW11bSc6IGNhc2UgJ2V4Y2x1c2l2ZU1pbmltdW0nOiBjYXNlICdtaW5MZW5ndGgnOlxuICAgICAgICAgIGNhc2UgJ21pbkl0ZW1zJzogY2FzZSAnbWluUHJvcGVydGllcyc6XG4gICAgICAgICAgICAvLyBJZiBudW1iZXJzLCBzZXQgdG8gaGlnaGVzdCB2YWx1ZVxuICAgICAgICAgICAgaWYgKGlzTnVtYmVyKGNvbWJpbmVkVmFsdWUpICYmIGlzTnVtYmVyKHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYVtrZXldID0gTWF0aC5tYXgoY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbm90JzpcbiAgICAgICAgICAgIC8vIENvbWJpbmUgbm90IHZhbHVlcyBpbnRvIGFueU9mIGFycmF5XG4gICAgICAgICAgICBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5vdEFueU9mID0gW2NvbWJpbmVkVmFsdWUsIHNjaGVtYVZhbHVlXVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKG5vdEFueU9mQXJyYXksIG5vdFNjaGVtYSkgPT5cbiAgICAgICAgICAgICAgICAgIGlzQXJyYXkobm90U2NoZW1hLmFueU9mKSAmJlxuICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMobm90U2NoZW1hKS5sZW5ndGggPT09IDEgP1xuICAgICAgICAgICAgICAgICAgICBbIC4uLm5vdEFueU9mQXJyYXksIC4uLm5vdFNjaGVtYS5hbnlPZiBdIDpcbiAgICAgICAgICAgICAgICAgICAgWyAuLi5ub3RBbnlPZkFycmF5LCBub3RTY2hlbWEgXVxuICAgICAgICAgICAgICAgICwgW10pO1xuICAgICAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgZHVwbGljYXRlIGl0ZW1zIGZyb20gYXJyYXlcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEubm90ID0geyBhbnlPZjogbm90QW55T2YgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3BhdHRlcm5Qcm9wZXJ0aWVzJzpcbiAgICAgICAgICAgIC8vIENvbWJpbmUgYWxsIGtleXMgZnJvbSBib3RoIG9iamVjdHNcbiAgICAgICAgICAgIC8vIGFuZCBtZXJnZSBzY2hlbWFzIG9uIG1hdGNoaW5nIGtleXNcbiAgICAgICAgICAgIGlmIChpc09iamVjdChjb21iaW5lZFZhbHVlKSAmJiBpc09iamVjdChzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29uc3QgY29tYmluZWRPYmplY3QgPSB7IC4uLmNvbWJpbmVkVmFsdWUgfTtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCBzdWJLZXkgb2YgT2JqZWN0LmtleXMoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNPd24oY29tYmluZWRPYmplY3QsIHN1YktleSkgfHxcbiAgICAgICAgICAgICAgICAgIF8uaXNFcXVhbChjb21iaW5lZE9iamVjdFtzdWJLZXldLCBzY2hlbWFWYWx1ZVtzdWJLZXldKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgY29tYmluZWRPYmplY3Rbc3ViS2V5XSA9IHNjaGVtYVZhbHVlW3N1YktleV07XG4gICAgICAgICAgICAgICAgLy8gSWYgYm90aCBrZXlzIGFyZSBvYmplY3RzLCBtZXJnZSB0aGVtXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgIGlzT2JqZWN0KHNjaGVtYVZhbHVlW3N1YktleV0pICYmIGlzT2JqZWN0KGNvbWJpbmVkT2JqZWN0W3N1YktleV0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID1cbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VTY2hlbWFzKGNvbWJpbmVkT2JqZWN0W3N1YktleV0sIHNjaGVtYVZhbHVlW3N1YktleV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEucGF0dGVyblByb3BlcnRpZXMgPSBjb21iaW5lZE9iamVjdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3Byb3BlcnRpZXMnOlxuICAgICAgICAgICAgLy8gQ29tYmluZSBhbGwga2V5cyBmcm9tIGJvdGggb2JqZWN0c1xuICAgICAgICAgICAgLy8gdW5sZXNzIGFkZGl0aW9uYWxQcm9wZXJ0aWVzID09PSBmYWxzZVxuICAgICAgICAgICAgLy8gYW5kIG1lcmdlIHNjaGVtYXMgb24gbWF0Y2hpbmcga2V5c1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGNvbWJpbmVkVmFsdWUpICYmIGlzT2JqZWN0KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb25zdCBjb21iaW5lZE9iamVjdCA9IHsgLi4uY29tYmluZWRWYWx1ZSB9O1xuICAgICAgICAgICAgICAvLyBJZiBuZXcgc2NoZW1hIGhhcyBhZGRpdGlvbmFsUHJvcGVydGllcyxcbiAgICAgICAgICAgICAgLy8gbWVyZ2Ugb3IgcmVtb3ZlIG5vbi1tYXRjaGluZyBwcm9wZXJ0eSBrZXlzIGluIGNvbWJpbmVkIHNjaGVtYVxuICAgICAgICAgICAgICBpZiAoaGFzT3duKHNjaGVtYVZhbHVlLCAnYWRkaXRpb25hbFByb3BlcnRpZXMnKSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGNvbWJpbmVkVmFsdWUpXG4gICAgICAgICAgICAgICAgICAuZmlsdGVyKGNvbWJpbmVkS2V5ID0+ICFPYmplY3Qua2V5cyhzY2hlbWFWYWx1ZSkuaW5jbHVkZXMoY29tYmluZWRLZXkpKVxuICAgICAgICAgICAgICAgICAgLmZvckVhY2gobm9uTWF0Y2hpbmdLZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZW1hVmFsdWUuYWRkaXRpb25hbFByb3BlcnRpZXMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbWJpbmVkT2JqZWN0W25vbk1hdGNoaW5nS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChzY2hlbWFWYWx1ZS5hZGRpdGlvbmFsUHJvcGVydGllcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtub25NYXRjaGluZ0tleV0gPSBtZXJnZVNjaGVtYXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtub25NYXRjaGluZ0tleV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2hlbWFWYWx1ZS5hZGRpdGlvbmFsUHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZvciAoY29uc3Qgc3ViS2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChfLmlzRXF1YWwoY29tYmluZWRPYmplY3Rbc3ViS2V5XSwgc2NoZW1hVmFsdWVbc3ViS2V5XSkgfHwgKFxuICAgICAgICAgICAgICAgICAgIWhhc093bihjb21iaW5lZE9iamVjdCwgc3ViS2V5KSAmJlxuICAgICAgICAgICAgICAgICAgIWhhc093bihjb21iaW5lZE9iamVjdCwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJylcbiAgICAgICAgICAgICAgICApKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAvLyBJZiBjb21iaW5lZCBzY2hlbWEgaGFzIGFkZGl0aW9uYWxQcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIG9yIGlnbm9yZSBub24tbWF0Y2hpbmcgcHJvcGVydHkga2V5cyBpbiBuZXcgc2NoZW1hXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICFoYXNPd24oY29tYmluZWRPYmplY3QsIHN1YktleSkgJiZcbiAgICAgICAgICAgICAgICAgIGhhc093bihjb21iaW5lZE9iamVjdCwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJylcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIC8vIElmIGNvbWJpbmVkT2JqZWN0LmFkZGl0aW9uYWxQcm9wZXJ0aWVzID09PSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgKGRvbid0IHNldCBrZXkpXG4gICAgICAgICAgICAgICAgICAvLyBJZiBhZGRpdGlvbmFsUHJvcGVydGllcyBpcyBvYmplY3QsIG1lcmdlIHdpdGggbmV3IGtleVxuICAgICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGNvbWJpbmVkT2JqZWN0LmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSkge1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gbWVyZ2VTY2hlbWFzKFxuICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0LmFkZGl0aW9uYWxQcm9wZXJ0aWVzLCBzY2hlbWFWYWx1ZVtzdWJLZXldXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgYm90aCBrZXlzIGFyZSBvYmplY3RzLCBtZXJnZSB0aGVtXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgIGlzT2JqZWN0KHNjaGVtYVZhbHVlW3N1YktleV0pICYmXG4gICAgICAgICAgICAgICAgICBpc09iamVjdChjb21iaW5lZE9iamVjdFtzdWJLZXldKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgY29tYmluZWRPYmplY3Rbc3ViS2V5XSA9XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlU2NoZW1hcyhjb21iaW5lZE9iamVjdFtzdWJLZXldLCBzY2hlbWFWYWx1ZVtzdWJLZXldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLnByb3BlcnRpZXMgPSBjb21iaW5lZE9iamVjdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3JlcXVpcmVkJzpcbiAgICAgICAgICAgIC8vIElmIGFycmF5cywgaW5jbHVkZSBhbGwgaXRlbXMgZnJvbSBib3RoIGFycmF5cywgZXhjbHVkaW5nIGR1cGxpY2F0ZXNcbiAgICAgICAgICAgIGlmIChpc0FycmF5KGNvbWJpbmVkVmFsdWUpICYmIGlzQXJyYXkoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLnJlcXVpcmVkID0gdW5pcXVlSXRlbXMoLi4uY29tYmluZWRWYWx1ZSwgLi4uc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgLy8gSWYgYm9vbGVhbnMsIGFldCB0cnVlIGlmIGVpdGhlciB0cnVlXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICB0eXBlb2Ygc2NoZW1hVmFsdWUgPT09ICdib29sZWFuJyAmJlxuICAgICAgICAgICAgICB0eXBlb2YgY29tYmluZWRWYWx1ZSA9PT0gJ2Jvb2xlYW4nXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEucmVxdWlyZWQgPSAhIWNvbWJpbmVkVmFsdWUgfHwgISFzY2hlbWFWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJyRzY2hlbWEnOiBjYXNlICckaWQnOiBjYXNlICdpZCc6XG4gICAgICAgICAgICAvLyBEb24ndCBjb21iaW5lIHRoZXNlIGtleXNcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd0aXRsZSc6IGNhc2UgJ2Rlc2NyaXB0aW9uJzpcbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgbGFzdCB2YWx1ZSwgb3ZlcndyaXRpbmcgYW55IHByZXZpb3VzIG9uZVxuICAgICAgICAgICAgLy8gVGhlc2UgcHJvcGVydGllcyBhcmUgbm90IHVzZWQgZm9yIHZhbGlkYXRpb24sIHNvIGNvbmZsaWN0cyBkb24ndCBtYXR0ZXJcbiAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hW2tleV0gPSBzY2hlbWFWYWx1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd0eXBlJzpcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgKGlzQXJyYXkoc2NoZW1hVmFsdWUpIHx8IGlzU3RyaW5nKHNjaGVtYVZhbHVlKSkgJiZcbiAgICAgICAgICAgICAgKGlzQXJyYXkoY29tYmluZWRWYWx1ZSkgfHwgaXNTdHJpbmcoY29tYmluZWRWYWx1ZSkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29uc3QgY29tYmluZWRUeXBlcyA9IGNvbW1vbkl0ZW1zKGNvbWJpbmVkVmFsdWUsIHNjaGVtYVZhbHVlKTtcbiAgICAgICAgICAgICAgaWYgKCFjb21iaW5lZFR5cGVzLmxlbmd0aCkgeyByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTsgfVxuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS50eXBlID0gY29tYmluZWRUeXBlcy5sZW5ndGggPiAxID8gY29tYmluZWRUeXBlcyA6IGNvbWJpbmVkVHlwZXNbMF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd1bmlxdWVJdGVtcyc6XG4gICAgICAgICAgICAvLyBTZXQgdHJ1ZSBpZiBlaXRoZXIgdHJ1ZVxuICAgICAgICAgICAgY29tYmluZWRTY2hlbWEudW5pcXVlSXRlbXMgPSAhIWNvbWJpbmVkVmFsdWUgfHwgISFzY2hlbWFWYWx1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbWJpbmVkU2NoZW1hO1xufVxuIl19