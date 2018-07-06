/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import * as _ from 'lodash';
/**
 * 'convertSchemaToDraft6' function
 *
 * Converts a JSON Schema from draft 1 through 4 format to draft 6 format
 *
 * Inspired by on geraintluff's JSON Schema 3 to 4 compatibility function:
 *   https://github.com/geraintluff/json-schema-compatibility
 * Also uses suggestions from AJV's JSON Schema 4 to 6 migration guide:
 *   https://github.com/epoberezkin/ajv/releases/tag/5.0.0
 * And additional details from the official JSON Schema documentation:
 *   http://json-schema.org
 *
 * //  { object } originalSchema - JSON schema (draft 1, 2, 3, 4, or 6)
 * //  { OptionObject = {} } options - options: parent schema changed?, schema draft number?
 * // { object } - JSON schema (draft 6)
 * @record
 */
export function OptionObject() { }
/** @type {?|undefined} */
OptionObject.prototype.changed;
/** @type {?|undefined} */
OptionObject.prototype.draft;
;
/**
 * @param {?} schema
 * @param {?=} options
 * @return {?}
 */
export function convertSchemaToDraft6(schema, options) {
    if (options === void 0) { options = {}; }
    /** @type {?} */
    var draft = options.draft || null;
    /** @type {?} */
    var changed = options.changed || false;
    if (typeof schema !== 'object') {
        return schema;
    }
    if (typeof schema.map === 'function') {
        return tslib_1.__spread(schema.map(function (subSchema) { return convertSchemaToDraft6(subSchema, { changed: changed, draft: draft }); }));
    }
    /** @type {?} */
    var newSchema = tslib_1.__assign({}, schema);
    /** @type {?} */
    var simpleTypes = ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];
    if (typeof newSchema.$schema === 'string' &&
        /http\:\/\/json\-schema\.org\/draft\-0\d\/schema\#/.test(newSchema.$schema)) {
        draft = newSchema.$schema[30];
    }
    // Convert v1-v2 'contentEncoding' to 'media.binaryEncoding'
    // Note: This is only used in JSON hyper-schema (not regular JSON schema)
    if (newSchema.contentEncoding) {
        newSchema.media = { binaryEncoding: newSchema.contentEncoding };
        delete newSchema.contentEncoding;
        changed = true;
    }
    // Convert v1-v3 'extends' to 'allOf'
    if (typeof newSchema.extends === 'object') {
        newSchema.allOf = typeof newSchema.extends.map === 'function' ?
            newSchema.extends.map(function (subSchema) { return convertSchemaToDraft6(subSchema, { changed: changed, draft: draft }); }) :
            [convertSchemaToDraft6(newSchema.extends, { changed: changed, draft: draft })];
        delete newSchema.extends;
        changed = true;
    }
    // Convert v1-v3 'disallow' to 'not'
    if (newSchema.disallow) {
        if (typeof newSchema.disallow === 'string') {
            newSchema.not = { type: newSchema.disallow };
        }
        else if (typeof newSchema.disallow.map === 'function') {
            newSchema.not = {
                anyOf: newSchema.disallow
                    .map(function (type) { return typeof type === 'object' ? type : { type: type }; })
            };
        }
        delete newSchema.disallow;
        changed = true;
    }
    // Convert v3 string 'dependencies' properties to arrays
    if (typeof newSchema.dependencies === 'object' &&
        Object.keys(newSchema.dependencies)
            .some(function (key) { return typeof newSchema.dependencies[key] === 'string'; })) {
        newSchema.dependencies = tslib_1.__assign({}, newSchema.dependencies);
        Object.keys(newSchema.dependencies)
            .filter(function (key) { return typeof newSchema.dependencies[key] === 'string'; })
            .forEach(function (key) { return newSchema.dependencies[key] = [newSchema.dependencies[key]]; });
        changed = true;
    }
    // Convert v1 'maxDecimal' to 'multipleOf'
    if (typeof newSchema.maxDecimal === 'number') {
        newSchema.multipleOf = 1 / Math.pow(10, newSchema.maxDecimal);
        delete newSchema.divisibleBy;
        changed = true;
        if (!draft || draft === 2) {
            draft = 1;
        }
    }
    // Convert v2-v3 'divisibleBy' to 'multipleOf'
    if (typeof newSchema.divisibleBy === 'number') {
        newSchema.multipleOf = newSchema.divisibleBy;
        delete newSchema.divisibleBy;
        changed = true;
    }
    // Convert v1-v2 boolean 'minimumCanEqual' to 'exclusiveMinimum'
    if (typeof newSchema.minimum === 'number' && newSchema.minimumCanEqual === false) {
        newSchema.exclusiveMinimum = newSchema.minimum;
        delete newSchema.minimum;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    else if (typeof newSchema.minimumCanEqual === 'boolean') {
        delete newSchema.minimumCanEqual;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    // Convert v3-v4 boolean 'exclusiveMinimum' to numeric
    if (typeof newSchema.minimum === 'number' && newSchema.exclusiveMinimum === true) {
        newSchema.exclusiveMinimum = newSchema.minimum;
        delete newSchema.minimum;
        changed = true;
    }
    else if (typeof newSchema.exclusiveMinimum === 'boolean') {
        delete newSchema.exclusiveMinimum;
        changed = true;
    }
    // Convert v1-v2 boolean 'maximumCanEqual' to 'exclusiveMaximum'
    if (typeof newSchema.maximum === 'number' && newSchema.maximumCanEqual === false) {
        newSchema.exclusiveMaximum = newSchema.maximum;
        delete newSchema.maximum;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    else if (typeof newSchema.maximumCanEqual === 'boolean') {
        delete newSchema.maximumCanEqual;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    // Convert v3-v4 boolean 'exclusiveMaximum' to numeric
    if (typeof newSchema.maximum === 'number' && newSchema.exclusiveMaximum === true) {
        newSchema.exclusiveMaximum = newSchema.maximum;
        delete newSchema.maximum;
        changed = true;
    }
    else if (typeof newSchema.exclusiveMaximum === 'boolean') {
        delete newSchema.exclusiveMaximum;
        changed = true;
    }
    // Search object 'properties' for 'optional', 'required', and 'requires' items,
    // and convert them into object 'required' arrays and 'dependencies' objects
    if (typeof newSchema.properties === 'object') {
        /** @type {?} */
        var properties_1 = tslib_1.__assign({}, newSchema.properties);
        /** @type {?} */
        var requiredKeys_1 = Array.isArray(newSchema.required) ?
            new Set(newSchema.required) : new Set();
        // Convert v1-v2 boolean 'optional' properties to 'required' array
        if (draft === 1 || draft === 2 ||
            Object.keys(properties_1).some(function (key) { return properties_1[key].optional === true; })) {
            Object.keys(properties_1)
                .filter(function (key) { return properties_1[key].optional !== true; })
                .forEach(function (key) { return requiredKeys_1.add(key); });
            changed = true;
            if (!draft) {
                draft = 2;
            }
        }
        // Convert v3 boolean 'required' properties to 'required' array
        if (Object.keys(properties_1).some(function (key) { return properties_1[key].required === true; })) {
            Object.keys(properties_1)
                .filter(function (key) { return properties_1[key].required === true; })
                .forEach(function (key) { return requiredKeys_1.add(key); });
            changed = true;
        }
        if (requiredKeys_1.size) {
            newSchema.required = Array.from(requiredKeys_1);
        }
        // Convert v1-v2 array or string 'requires' properties to 'dependencies' object
        if (Object.keys(properties_1).some(function (key) { return properties_1[key].requires; })) {
            /** @type {?} */
            var dependencies_1 = typeof newSchema.dependencies === 'object' ? tslib_1.__assign({}, newSchema.dependencies) : {};
            Object.keys(properties_1)
                .filter(function (key) { return properties_1[key].requires; })
                .forEach(function (key) { return dependencies_1[key] =
                typeof properties_1[key].requires === 'string' ?
                    [properties_1[key].requires] : properties_1[key].requires; });
            newSchema.dependencies = dependencies_1;
            changed = true;
            if (!draft) {
                draft = 2;
            }
        }
        newSchema.properties = properties_1;
    }
    // Revove v1-v2 boolean 'optional' key
    if (typeof newSchema.optional === 'boolean') {
        delete newSchema.optional;
        changed = true;
        if (!draft) {
            draft = 2;
        }
    }
    // Revove v1-v2 'requires' key
    if (newSchema.requires) {
        delete newSchema.requires;
    }
    // Revove v3 boolean 'required' key
    if (typeof newSchema.required === 'boolean') {
        delete newSchema.required;
    }
    // Convert id to $id
    if (typeof newSchema.id === 'string' && !newSchema.$id) {
        if (newSchema.id.slice(-1) === '#') {
            newSchema.id = newSchema.id.slice(0, -1);
        }
        newSchema.$id = newSchema.id + '-CONVERTED-TO-DRAFT-06#';
        delete newSchema.id;
        changed = true;
    }
    // Check if v1-v3 'any' or object types will be converted
    if (newSchema.type && (typeof newSchema.type.every === 'function' ?
        !newSchema.type.every(function (type) { return simpleTypes.includes(type); }) :
        !simpleTypes.includes(newSchema.type))) {
        changed = true;
    }
    // If schema changed, update or remove $schema identifier
    if (typeof newSchema.$schema === 'string' &&
        /http\:\/\/json\-schema\.org\/draft\-0[1-4]\/schema\#/.test(newSchema.$schema)) {
        newSchema.$schema = 'http://json-schema.org/draft-06/schema#';
        changed = true;
    }
    else if (changed && typeof newSchema.$schema === 'string') {
        /** @type {?} */
        var addToDescription = 'Converted to draft 6 from ' + newSchema.$schema;
        if (typeof newSchema.description === 'string' && newSchema.description.length) {
            newSchema.description += '\n' + addToDescription;
        }
        else {
            newSchema.description = addToDescription;
        }
        delete newSchema.$schema;
    }
    // Convert v1-v3 'any' and object types
    if (newSchema.type && (typeof newSchema.type.every === 'function' ?
        !newSchema.type.every(function (type) { return simpleTypes.includes(type); }) :
        !simpleTypes.includes(newSchema.type))) {
        if (newSchema.type.length === 1) {
            newSchema.type = newSchema.type[0];
        }
        if (typeof newSchema.type === 'string') {
            // Convert string 'any' type to array of all standard types
            if (newSchema.type === 'any') {
                newSchema.type = simpleTypes;
                // Delete non-standard string type
            }
            else {
                delete newSchema.type;
            }
        }
        else if (typeof newSchema.type === 'object') {
            if (typeof newSchema.type.every === 'function') {
                // If array of strings, only allow standard types
                if (newSchema.type.every(function (type) { return typeof type === 'string'; })) {
                    newSchema.type = newSchema.type.some(function (type) { return type === 'any'; }) ?
                        newSchema.type = simpleTypes :
                        newSchema.type.filter(function (type) { return simpleTypes.includes(type); });
                    // If type is an array with objects, convert the current schema to an 'anyOf' array
                }
                else if (newSchema.type.length > 1) {
                    /** @type {?} */
                    var arrayKeys = ['additionalItems', 'items', 'maxItems', 'minItems', 'uniqueItems', 'contains'];
                    /** @type {?} */
                    var numberKeys = ['multipleOf', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum'];
                    /** @type {?} */
                    var objectKeys = ['maxProperties', 'minProperties', 'required', 'additionalProperties',
                        'properties', 'patternProperties', 'dependencies', 'propertyNames'];
                    /** @type {?} */
                    var stringKeys = ['maxLength', 'minLength', 'pattern', 'format'];
                    /** @type {?} */
                    var filterKeys_1 = {
                        'array': tslib_1.__spread(numberKeys, objectKeys, stringKeys),
                        'integer': tslib_1.__spread(arrayKeys, objectKeys, stringKeys),
                        'number': tslib_1.__spread(arrayKeys, objectKeys, stringKeys),
                        'object': tslib_1.__spread(arrayKeys, numberKeys, stringKeys),
                        'string': tslib_1.__spread(arrayKeys, numberKeys, objectKeys),
                        'all': tslib_1.__spread(arrayKeys, numberKeys, objectKeys, stringKeys),
                    };
                    /** @type {?} */
                    var anyOf = [];
                    var _loop_1 = function (type) {
                        /** @type {?} */
                        var newType = typeof type === 'string' ? { type: type } : tslib_1.__assign({}, type);
                        Object.keys(newSchema)
                            .filter(function (key) { return !newType.hasOwnProperty(key) &&
                            !tslib_1.__spread((filterKeys_1[newType.type] || filterKeys_1.all), ['type', 'default']).includes(key); })
                            .forEach(function (key) { return newType[key] = newSchema[key]; });
                        anyOf.push(newType);
                    };
                    try {
                        for (var _a = tslib_1.__values(newSchema.type), _b = _a.next(); !_b.done; _b = _a.next()) {
                            var type = _b.value;
                            _loop_1(type);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    newSchema = newSchema.hasOwnProperty('default') ?
                        { anyOf: anyOf, default: newSchema.default } : { anyOf: anyOf };
                    // If type is an object, merge it with the current schema
                }
                else {
                    /** @type {?} */
                    var typeSchema = newSchema.type;
                    delete newSchema.type;
                    Object.assign(newSchema, typeSchema);
                }
            }
        }
        else {
            delete newSchema.type;
        }
    }
    // Convert sub schemas
    Object.keys(newSchema)
        .filter(function (key) { return typeof newSchema[key] === 'object'; })
        .forEach(function (key) {
        if (['definitions', 'dependencies', 'properties', 'patternProperties']
            .includes(key) && typeof newSchema[key].map !== 'function') {
            /** @type {?} */
            var newKey_1 = {};
            Object.keys(newSchema[key]).forEach(function (subKey) { return newKey_1[subKey] =
                convertSchemaToDraft6(newSchema[key][subKey], { changed: changed, draft: draft }); });
            newSchema[key] = newKey_1;
        }
        else if (['items', 'additionalItems', 'additionalProperties',
            'allOf', 'anyOf', 'oneOf', 'not'].includes(key)) {
            newSchema[key] = convertSchemaToDraft6(newSchema[key], { changed: changed, draft: draft });
        }
        else {
            newSchema[key] = _.cloneDeep(newSchema[key]);
        }
    });
    return newSchema;
    var e_1, _c;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydC1zY2hlbWEtdG8tZHJhZnQ2LmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvY29udmVydC1zY2hlbWEtdG8tZHJhZnQ2LmZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0J1QyxDQUFDOzs7Ozs7QUFDcEUsTUFBTSxnQ0FBZ0MsTUFBTSxFQUFFLE9BQTBCO0lBQTFCLHdCQUFBLEVBQUEsWUFBMEI7O0lBQ3RFLElBQUksS0FBSyxHQUFXLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDOztJQUMxQyxJQUFJLE9BQU8sR0FBWSxPQUFPLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQztJQUVoRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUFFO0lBQ2xELEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLEdBQUcsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sa0JBQU0sTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sU0FBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsRUFBcEQsQ0FBb0QsQ0FBQyxFQUFHO0tBQzdGOztJQUNELElBQUksU0FBUyx3QkFBUSxNQUFNLEVBQUc7O0lBQzlCLElBQU0sV0FBVyxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFMUYsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUMsT0FBTyxLQUFL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RSxPQUFPLFNBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7U0FDNUU7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzlDO0tBQ0YsQ0FBQyxDQUFDO0lBRUwsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7Q0FDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbi8qKlxuICogJ2NvbnZlcnRTY2hlbWFUb0RyYWZ0NicgZnVuY3Rpb25cbiAqXG4gKiBDb252ZXJ0cyBhIEpTT04gU2NoZW1hIGZyb20gZHJhZnQgMSB0aHJvdWdoIDQgZm9ybWF0IHRvIGRyYWZ0IDYgZm9ybWF0XG4gKlxuICogSW5zcGlyZWQgYnkgb24gZ2VyYWludGx1ZmYncyBKU09OIFNjaGVtYSAzIHRvIDQgY29tcGF0aWJpbGl0eSBmdW5jdGlvbjpcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL2dlcmFpbnRsdWZmL2pzb24tc2NoZW1hLWNvbXBhdGliaWxpdHlcbiAqIEFsc28gdXNlcyBzdWdnZXN0aW9ucyBmcm9tIEFKVidzIEpTT04gU2NoZW1hIDQgdG8gNiBtaWdyYXRpb24gZ3VpZGU6XG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS9lcG9iZXJlemtpbi9hanYvcmVsZWFzZXMvdGFnLzUuMC4wXG4gKiBBbmQgYWRkaXRpb25hbCBkZXRhaWxzIGZyb20gdGhlIG9mZmljaWFsIEpTT04gU2NoZW1hIGRvY3VtZW50YXRpb246XG4gKiAgIGh0dHA6Ly9qc29uLXNjaGVtYS5vcmdcbiAqXG4gKiAvLyAgeyBvYmplY3QgfSBvcmlnaW5hbFNjaGVtYSAtIEpTT04gc2NoZW1hIChkcmFmdCAxLCAyLCAzLCA0LCBvciA2KVxuICogLy8gIHsgT3B0aW9uT2JqZWN0ID0ge30gfSBvcHRpb25zIC0gb3B0aW9uczogcGFyZW50IHNjaGVtYSBjaGFuZ2VkPywgc2NoZW1hIGRyYWZ0IG51bWJlcj9cbiAqIC8vIHsgb2JqZWN0IH0gLSBKU09OIHNjaGVtYSAoZHJhZnQgNilcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPcHRpb25PYmplY3QgeyBjaGFuZ2VkPzogYm9vbGVhbiwgZHJhZnQ/OiBudW1iZXIgfTtcbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0U2NoZW1hVG9EcmFmdDYoc2NoZW1hLCBvcHRpb25zOiBPcHRpb25PYmplY3QgPSB7fSkge1xuICBsZXQgZHJhZnQ6IG51bWJlciA9IG9wdGlvbnMuZHJhZnQgfHwgbnVsbDtcbiAgbGV0IGNoYW5nZWQ6IGJvb2xlYW4gPSBvcHRpb25zLmNoYW5nZWQgfHwgZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBzY2hlbWEgIT09ICdvYmplY3QnKSB7IHJldHVybiBzY2hlbWE7IH1cbiAgaWYgKHR5cGVvZiBzY2hlbWEubWFwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIFsgLi4uc2NoZW1hLm1hcChzdWJTY2hlbWEgPT4gY29udmVydFNjaGVtYVRvRHJhZnQ2KHN1YlNjaGVtYSwgeyBjaGFuZ2VkLCBkcmFmdCB9KSkgXTtcbiAgfVxuICBsZXQgbmV3U2NoZW1hID0geyAuLi5zY2hlbWEgfTtcbiAgY29uc3Qgc2ltcGxlVHlwZXMgPSBbJ2FycmF5JywgJ2Jvb2xlYW4nLCAnaW50ZWdlcicsICdudWxsJywgJ251bWJlcicsICdvYmplY3QnLCAnc3RyaW5nJ107XG5cbiAgaWYgKHR5cGVvZiBuZXdTY2hlbWEuJHNjaGVtYSA9PT0gJ3N0cmluZycgJiZcbiAgICAvaHR0cFxcOlxcL1xcL2pzb25cXC1zY2hlbWFcXC5vcmdcXC9kcmFmdFxcLTBcXGRcXC9zY2hlbWFcXCMvLnRlc3QobmV3U2NoZW1hLiRzY2hlbWEpXG4gICkge1xuICAgIGRyYWZ0ID0gbmV3U2NoZW1hLiRzY2hlbWFbMzBdO1xuICB9XG5cbiAgLy8gQ29udmVydCB2MS12MiAnY29udGVudEVuY29kaW5nJyB0byAnbWVkaWEuYmluYXJ5RW5jb2RpbmcnXG4gIC8vIE5vdGU6IFRoaXMgaXMgb25seSB1c2VkIGluIEpTT04gaHlwZXItc2NoZW1hIChub3QgcmVndWxhciBKU09OIHNjaGVtYSlcbiAgaWYgKG5ld1NjaGVtYS5jb250ZW50RW5jb2RpbmcpIHtcbiAgICBuZXdTY2hlbWEubWVkaWEgPSB7IGJpbmFyeUVuY29kaW5nOiBuZXdTY2hlbWEuY29udGVudEVuY29kaW5nIH07XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5jb250ZW50RW5jb2Rpbmc7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBDb252ZXJ0IHYxLXYzICdleHRlbmRzJyB0byAnYWxsT2YnXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLmV4dGVuZHMgPT09ICdvYmplY3QnKSB7XG4gICAgbmV3U2NoZW1hLmFsbE9mID0gdHlwZW9mIG5ld1NjaGVtYS5leHRlbmRzLm1hcCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICBuZXdTY2hlbWEuZXh0ZW5kcy5tYXAoc3ViU2NoZW1hID0+IGNvbnZlcnRTY2hlbWFUb0RyYWZ0NihzdWJTY2hlbWEsIHsgY2hhbmdlZCwgZHJhZnQgfSkpIDpcbiAgICAgIFsgY29udmVydFNjaGVtYVRvRHJhZnQ2KG5ld1NjaGVtYS5leHRlbmRzLCB7IGNoYW5nZWQsIGRyYWZ0IH0pIF07XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5leHRlbmRzO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gQ29udmVydCB2MS12MyAnZGlzYWxsb3cnIHRvICdub3QnXG4gIGlmIChuZXdTY2hlbWEuZGlzYWxsb3cpIHtcbiAgICBpZiAodHlwZW9mIG5ld1NjaGVtYS5kaXNhbGxvdyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5ld1NjaGVtYS5ub3QgPSB7IHR5cGU6IG5ld1NjaGVtYS5kaXNhbGxvdyB9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5ld1NjaGVtYS5kaXNhbGxvdy5tYXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG5ld1NjaGVtYS5ub3QgPSB7XG4gICAgICAgIGFueU9mOiBuZXdTY2hlbWEuZGlzYWxsb3dcbiAgICAgICAgICAubWFwKHR5cGUgPT4gdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnID8gdHlwZSA6IHsgdHlwZSB9KVxuICAgICAgfTtcbiAgICB9XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5kaXNhbGxvdztcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIENvbnZlcnQgdjMgc3RyaW5nICdkZXBlbmRlbmNpZXMnIHByb3BlcnRpZXMgdG8gYXJyYXlzXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLmRlcGVuZGVuY2llcyA9PT0gJ29iamVjdCcgJiZcbiAgICBPYmplY3Qua2V5cyhuZXdTY2hlbWEuZGVwZW5kZW5jaWVzKVxuICAgICAgLnNvbWUoa2V5ID0+IHR5cGVvZiBuZXdTY2hlbWEuZGVwZW5kZW5jaWVzW2tleV0gPT09ICdzdHJpbmcnKVxuICApIHtcbiAgICBuZXdTY2hlbWEuZGVwZW5kZW5jaWVzID0geyAuLi5uZXdTY2hlbWEuZGVwZW5kZW5jaWVzIH07XG4gICAgT2JqZWN0LmtleXMobmV3U2NoZW1hLmRlcGVuZGVuY2llcylcbiAgICAgIC5maWx0ZXIoa2V5ID0+IHR5cGVvZiBuZXdTY2hlbWEuZGVwZW5kZW5jaWVzW2tleV0gPT09ICdzdHJpbmcnKVxuICAgICAgLmZvckVhY2goa2V5ID0+IG5ld1NjaGVtYS5kZXBlbmRlbmNpZXNba2V5XSA9IFsgbmV3U2NoZW1hLmRlcGVuZGVuY2llc1trZXldIF0pO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gQ29udmVydCB2MSAnbWF4RGVjaW1hbCcgdG8gJ211bHRpcGxlT2YnXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLm1heERlY2ltYWwgPT09ICdudW1iZXInKSB7XG4gICAgbmV3U2NoZW1hLm11bHRpcGxlT2YgPSAxIC8gTWF0aC5wb3coMTAsIG5ld1NjaGVtYS5tYXhEZWNpbWFsKTtcbiAgICBkZWxldGUgbmV3U2NoZW1hLmRpdmlzaWJsZUJ5O1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIGlmICghZHJhZnQgfHwgZHJhZnQgPT09IDIpIHsgZHJhZnQgPSAxOyB9XG4gIH1cblxuICAvLyBDb252ZXJ0IHYyLXYzICdkaXZpc2libGVCeScgdG8gJ211bHRpcGxlT2YnXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLmRpdmlzaWJsZUJ5ID09PSAnbnVtYmVyJykge1xuICAgIG5ld1NjaGVtYS5tdWx0aXBsZU9mID0gbmV3U2NoZW1hLmRpdmlzaWJsZUJ5O1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEuZGl2aXNpYmxlQnk7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBDb252ZXJ0IHYxLXYyIGJvb2xlYW4gJ21pbmltdW1DYW5FcXVhbCcgdG8gJ2V4Y2x1c2l2ZU1pbmltdW0nXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLm1pbmltdW0gPT09ICdudW1iZXInICYmIG5ld1NjaGVtYS5taW5pbXVtQ2FuRXF1YWwgPT09IGZhbHNlKSB7XG4gICAgbmV3U2NoZW1hLmV4Y2x1c2l2ZU1pbmltdW0gPSBuZXdTY2hlbWEubWluaW11bTtcbiAgICBkZWxldGUgbmV3U2NoZW1hLm1pbmltdW07XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gICAgaWYgKCFkcmFmdCkgeyBkcmFmdCA9IDI7IH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgbmV3U2NoZW1hLm1pbmltdW1DYW5FcXVhbCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5taW5pbXVtQ2FuRXF1YWw7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gICAgaWYgKCFkcmFmdCkgeyBkcmFmdCA9IDI7IH1cbiAgfVxuXG4gIC8vIENvbnZlcnQgdjMtdjQgYm9vbGVhbiAnZXhjbHVzaXZlTWluaW11bScgdG8gbnVtZXJpY1xuICBpZiAodHlwZW9mIG5ld1NjaGVtYS5taW5pbXVtID09PSAnbnVtYmVyJyAmJiBuZXdTY2hlbWEuZXhjbHVzaXZlTWluaW11bSA9PT0gdHJ1ZSkge1xuICAgIG5ld1NjaGVtYS5leGNsdXNpdmVNaW5pbXVtID0gbmV3U2NoZW1hLm1pbmltdW07XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5taW5pbXVtO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBuZXdTY2hlbWEuZXhjbHVzaXZlTWluaW11bSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5leGNsdXNpdmVNaW5pbXVtO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gQ29udmVydCB2MS12MiBib29sZWFuICdtYXhpbXVtQ2FuRXF1YWwnIHRvICdleGNsdXNpdmVNYXhpbXVtJ1xuICBpZiAodHlwZW9mIG5ld1NjaGVtYS5tYXhpbXVtID09PSAnbnVtYmVyJyAmJiBuZXdTY2hlbWEubWF4aW11bUNhbkVxdWFsID09PSBmYWxzZSkge1xuICAgIG5ld1NjaGVtYS5leGNsdXNpdmVNYXhpbXVtID0gbmV3U2NoZW1hLm1heGltdW07XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5tYXhpbXVtO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIGlmICghZHJhZnQpIHsgZHJhZnQgPSAyOyB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIG5ld1NjaGVtYS5tYXhpbXVtQ2FuRXF1YWwgPT09ICdib29sZWFuJykge1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEubWF4aW11bUNhbkVxdWFsO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIGlmICghZHJhZnQpIHsgZHJhZnQgPSAyOyB9XG4gIH1cblxuICAvLyBDb252ZXJ0IHYzLXY0IGJvb2xlYW4gJ2V4Y2x1c2l2ZU1heGltdW0nIHRvIG51bWVyaWNcbiAgaWYgKHR5cGVvZiBuZXdTY2hlbWEubWF4aW11bSA9PT0gJ251bWJlcicgJiYgbmV3U2NoZW1hLmV4Y2x1c2l2ZU1heGltdW0gPT09IHRydWUpIHtcbiAgICBuZXdTY2hlbWEuZXhjbHVzaXZlTWF4aW11bSA9IG5ld1NjaGVtYS5tYXhpbXVtO1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEubWF4aW11bTtcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbmV3U2NoZW1hLmV4Y2x1c2l2ZU1heGltdW0gPT09ICdib29sZWFuJykge1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEuZXhjbHVzaXZlTWF4aW11bTtcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFNlYXJjaCBvYmplY3QgJ3Byb3BlcnRpZXMnIGZvciAnb3B0aW9uYWwnLCAncmVxdWlyZWQnLCBhbmQgJ3JlcXVpcmVzJyBpdGVtcyxcbiAgLy8gYW5kIGNvbnZlcnQgdGhlbSBpbnRvIG9iamVjdCAncmVxdWlyZWQnIGFycmF5cyBhbmQgJ2RlcGVuZGVuY2llcycgb2JqZWN0c1xuICBpZiAodHlwZW9mIG5ld1NjaGVtYS5wcm9wZXJ0aWVzID09PSAnb2JqZWN0Jykge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB7IC4uLm5ld1NjaGVtYS5wcm9wZXJ0aWVzIH07XG4gICAgY29uc3QgcmVxdWlyZWRLZXlzID0gQXJyYXkuaXNBcnJheShuZXdTY2hlbWEucmVxdWlyZWQpID9cbiAgICAgIG5ldyBTZXQobmV3U2NoZW1hLnJlcXVpcmVkKSA6IG5ldyBTZXQoKTtcblxuICAgIC8vIENvbnZlcnQgdjEtdjIgYm9vbGVhbiAnb3B0aW9uYWwnIHByb3BlcnRpZXMgdG8gJ3JlcXVpcmVkJyBhcnJheVxuICAgIGlmIChkcmFmdCA9PT0gMSB8fCBkcmFmdCA9PT0gMiB8fFxuICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllcykuc29tZShrZXkgPT4gcHJvcGVydGllc1trZXldLm9wdGlvbmFsID09PSB0cnVlKVxuICAgICkge1xuICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllcylcbiAgICAgICAgLmZpbHRlcihrZXkgPT4gcHJvcGVydGllc1trZXldLm9wdGlvbmFsICE9PSB0cnVlKVxuICAgICAgICAuZm9yRWFjaChrZXkgPT4gcmVxdWlyZWRLZXlzLmFkZChrZXkpKTtcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgaWYgKCFkcmFmdCkgeyBkcmFmdCA9IDI7IH1cbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IHYzIGJvb2xlYW4gJ3JlcXVpcmVkJyBwcm9wZXJ0aWVzIHRvICdyZXF1aXJlZCcgYXJyYXlcbiAgICBpZiAoT2JqZWN0LmtleXMocHJvcGVydGllcykuc29tZShrZXkgPT4gcHJvcGVydGllc1trZXldLnJlcXVpcmVkID09PSB0cnVlKSkge1xuICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllcylcbiAgICAgICAgLmZpbHRlcihrZXkgPT4gcHJvcGVydGllc1trZXldLnJlcXVpcmVkID09PSB0cnVlKVxuICAgICAgICAuZm9yRWFjaChrZXkgPT4gcmVxdWlyZWRLZXlzLmFkZChrZXkpKTtcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChyZXF1aXJlZEtleXMuc2l6ZSkgeyBuZXdTY2hlbWEucmVxdWlyZWQgPSBBcnJheS5mcm9tKHJlcXVpcmVkS2V5cyk7IH1cblxuICAgIC8vIENvbnZlcnQgdjEtdjIgYXJyYXkgb3Igc3RyaW5nICdyZXF1aXJlcycgcHJvcGVydGllcyB0byAnZGVwZW5kZW5jaWVzJyBvYmplY3RcbiAgICBpZiAoT2JqZWN0LmtleXMocHJvcGVydGllcykuc29tZShrZXkgPT4gcHJvcGVydGllc1trZXldLnJlcXVpcmVzKSkge1xuICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gdHlwZW9mIG5ld1NjaGVtYS5kZXBlbmRlbmNpZXMgPT09ICdvYmplY3QnID9cbiAgICAgICAgeyAuLi5uZXdTY2hlbWEuZGVwZW5kZW5jaWVzIH0gOiB7fTtcbiAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpXG4gICAgICAgIC5maWx0ZXIoa2V5ID0+IHByb3BlcnRpZXNba2V5XS5yZXF1aXJlcylcbiAgICAgICAgLmZvckVhY2goa2V5ID0+IGRlcGVuZGVuY2llc1trZXldID1cbiAgICAgICAgICB0eXBlb2YgcHJvcGVydGllc1trZXldLnJlcXVpcmVzID09PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICBbIHByb3BlcnRpZXNba2V5XS5yZXF1aXJlcyBdIDogcHJvcGVydGllc1trZXldLnJlcXVpcmVzXG4gICAgICAgICk7XG4gICAgICBuZXdTY2hlbWEuZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzO1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICBpZiAoIWRyYWZ0KSB7IGRyYWZ0ID0gMjsgfVxuICAgIH1cblxuICAgIG5ld1NjaGVtYS5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgfVxuXG4gIC8vIFJldm92ZSB2MS12MiBib29sZWFuICdvcHRpb25hbCcga2V5XG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLm9wdGlvbmFsID09PSAnYm9vbGVhbicpIHtcbiAgICBkZWxldGUgbmV3U2NoZW1hLm9wdGlvbmFsO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIGlmICghZHJhZnQpIHsgZHJhZnQgPSAyOyB9XG4gIH1cblxuICAvLyBSZXZvdmUgdjEtdjIgJ3JlcXVpcmVzJyBrZXlcbiAgaWYgKG5ld1NjaGVtYS5yZXF1aXJlcykge1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEucmVxdWlyZXM7XG4gIH1cblxuICAvLyBSZXZvdmUgdjMgYm9vbGVhbiAncmVxdWlyZWQnIGtleVxuICBpZiAodHlwZW9mIG5ld1NjaGVtYS5yZXF1aXJlZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgZGVsZXRlIG5ld1NjaGVtYS5yZXF1aXJlZDtcbiAgfVxuXG4gIC8vIENvbnZlcnQgaWQgdG8gJGlkXG4gIGlmICh0eXBlb2YgbmV3U2NoZW1hLmlkID09PSAnc3RyaW5nJyAmJiAhbmV3U2NoZW1hLiRpZCkge1xuICAgIGlmIChuZXdTY2hlbWEuaWQuc2xpY2UoLTEpID09PSAnIycpIHtcbiAgICAgIG5ld1NjaGVtYS5pZCA9IG5ld1NjaGVtYS5pZC5zbGljZSgwLCAtMSk7XG4gICAgfVxuICAgIG5ld1NjaGVtYS4kaWQgPSBuZXdTY2hlbWEuaWQgKyAnLUNPTlZFUlRFRC1UTy1EUkFGVC0wNiMnO1xuICAgIGRlbGV0ZSBuZXdTY2hlbWEuaWQ7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBDaGVjayBpZiB2MS12MyAnYW55JyBvciBvYmplY3QgdHlwZXMgd2lsbCBiZSBjb252ZXJ0ZWRcbiAgaWYgKG5ld1NjaGVtYS50eXBlICYmICh0eXBlb2YgbmV3U2NoZW1hLnR5cGUuZXZlcnkgPT09ICdmdW5jdGlvbicgP1xuICAgICFuZXdTY2hlbWEudHlwZS5ldmVyeSh0eXBlID0+IHNpbXBsZVR5cGVzLmluY2x1ZGVzKHR5cGUpKSA6XG4gICAgIXNpbXBsZVR5cGVzLmluY2x1ZGVzKG5ld1NjaGVtYS50eXBlKVxuICApKSB7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gIH1cblxuICAvLyBJZiBzY2hlbWEgY2hhbmdlZCwgdXBkYXRlIG9yIHJlbW92ZSAkc2NoZW1hIGlkZW50aWZpZXJcbiAgaWYgKHR5cGVvZiBuZXdTY2hlbWEuJHNjaGVtYSA9PT0gJ3N0cmluZycgJiZcbiAgICAvaHR0cFxcOlxcL1xcL2pzb25cXC1zY2hlbWFcXC5vcmdcXC9kcmFmdFxcLTBbMS00XVxcL3NjaGVtYVxcIy8udGVzdChuZXdTY2hlbWEuJHNjaGVtYSlcbiAgKSB7XG4gICAgbmV3U2NoZW1hLiRzY2hlbWEgPSAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNi9zY2hlbWEjJztcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChjaGFuZ2VkICYmIHR5cGVvZiBuZXdTY2hlbWEuJHNjaGVtYSA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBhZGRUb0Rlc2NyaXB0aW9uID0gJ0NvbnZlcnRlZCB0byBkcmFmdCA2IGZyb20gJyArIG5ld1NjaGVtYS4kc2NoZW1hO1xuICAgIGlmICh0eXBlb2YgbmV3U2NoZW1hLmRlc2NyaXB0aW9uID09PSAnc3RyaW5nJyAmJiBuZXdTY2hlbWEuZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICBuZXdTY2hlbWEuZGVzY3JpcHRpb24gKz0gJ1xcbicgKyBhZGRUb0Rlc2NyaXB0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdTY2hlbWEuZGVzY3JpcHRpb24gPSBhZGRUb0Rlc2NyaXB0aW9uXG4gICAgfVxuICAgIGRlbGV0ZSBuZXdTY2hlbWEuJHNjaGVtYTtcbiAgfVxuXG4gIC8vIENvbnZlcnQgdjEtdjMgJ2FueScgYW5kIG9iamVjdCB0eXBlc1xuICBpZiAobmV3U2NoZW1hLnR5cGUgJiYgKHR5cGVvZiBuZXdTY2hlbWEudHlwZS5ldmVyeSA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgIW5ld1NjaGVtYS50eXBlLmV2ZXJ5KHR5cGUgPT4gc2ltcGxlVHlwZXMuaW5jbHVkZXModHlwZSkpIDpcbiAgICAhc2ltcGxlVHlwZXMuaW5jbHVkZXMobmV3U2NoZW1hLnR5cGUpXG4gICkpIHtcbiAgICBpZiAobmV3U2NoZW1hLnR5cGUubGVuZ3RoID09PSAxKSB7IG5ld1NjaGVtYS50eXBlID0gbmV3U2NoZW1hLnR5cGVbMF07IH1cbiAgICBpZiAodHlwZW9mIG5ld1NjaGVtYS50eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gQ29udmVydCBzdHJpbmcgJ2FueScgdHlwZSB0byBhcnJheSBvZiBhbGwgc3RhbmRhcmQgdHlwZXNcbiAgICAgIGlmIChuZXdTY2hlbWEudHlwZSA9PT0gJ2FueScpIHtcbiAgICAgICAgbmV3U2NoZW1hLnR5cGUgPSBzaW1wbGVUeXBlcztcbiAgICAgIC8vIERlbGV0ZSBub24tc3RhbmRhcmQgc3RyaW5nIHR5cGVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBuZXdTY2hlbWEudHlwZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuZXdTY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICh0eXBlb2YgbmV3U2NoZW1hLnR5cGUuZXZlcnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gSWYgYXJyYXkgb2Ygc3RyaW5ncywgb25seSBhbGxvdyBzdGFuZGFyZCB0eXBlc1xuICAgICAgICBpZiAobmV3U2NoZW1hLnR5cGUuZXZlcnkodHlwZSA9PiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgICAgbmV3U2NoZW1hLnR5cGUgPSBuZXdTY2hlbWEudHlwZS5zb21lKHR5cGUgPT4gdHlwZSA9PT0gJ2FueScpID9cbiAgICAgICAgICAgIG5ld1NjaGVtYS50eXBlID0gc2ltcGxlVHlwZXMgOlxuICAgICAgICAgICAgbmV3U2NoZW1hLnR5cGUuZmlsdGVyKHR5cGUgPT4gc2ltcGxlVHlwZXMuaW5jbHVkZXModHlwZSkpO1xuICAgICAgICAvLyBJZiB0eXBlIGlzIGFuIGFycmF5IHdpdGggb2JqZWN0cywgY29udmVydCB0aGUgY3VycmVudCBzY2hlbWEgdG8gYW4gJ2FueU9mJyBhcnJheVxuICAgICAgICB9IGVsc2UgaWYgKG5ld1NjaGVtYS50eXBlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBjb25zdCBhcnJheUtleXMgPSBbICdhZGRpdGlvbmFsSXRlbXMnLCAnaXRlbXMnLCAnbWF4SXRlbXMnLCAnbWluSXRlbXMnLCAndW5pcXVlSXRlbXMnLCAnY29udGFpbnMnXTtcbiAgICAgICAgICBjb25zdCBudW1iZXJLZXlzID0gWyAnbXVsdGlwbGVPZicsICdtYXhpbXVtJywgJ2V4Y2x1c2l2ZU1heGltdW0nLCAnbWluaW11bScsICdleGNsdXNpdmVNaW5pbXVtJ107XG4gICAgICAgICAgY29uc3Qgb2JqZWN0S2V5cyA9IFsgJ21heFByb3BlcnRpZXMnLCAnbWluUHJvcGVydGllcycsICdyZXF1aXJlZCcsICdhZGRpdGlvbmFsUHJvcGVydGllcycsXG4gICAgICAgICAgICAncHJvcGVydGllcycsICdwYXR0ZXJuUHJvcGVydGllcycsICdkZXBlbmRlbmNpZXMnLCAncHJvcGVydHlOYW1lcyddO1xuICAgICAgICAgIGNvbnN0IHN0cmluZ0tleXMgPSBbICdtYXhMZW5ndGgnLCAnbWluTGVuZ3RoJywgJ3BhdHRlcm4nLCAnZm9ybWF0J107XG4gICAgICAgICAgY29uc3QgZmlsdGVyS2V5cyA9IHtcbiAgICAgICAgICAgICdhcnJheSc6ICAgWyAuLi5udW1iZXJLZXlzLCAuLi5vYmplY3RLZXlzLCAuLi5zdHJpbmdLZXlzIF0sXG4gICAgICAgICAgICAnaW50ZWdlcic6IFsgIC4uLmFycmF5S2V5cywgLi4ub2JqZWN0S2V5cywgLi4uc3RyaW5nS2V5cyBdLFxuICAgICAgICAgICAgJ251bWJlcic6ICBbICAuLi5hcnJheUtleXMsIC4uLm9iamVjdEtleXMsIC4uLnN0cmluZ0tleXMgXSxcbiAgICAgICAgICAgICdvYmplY3QnOiAgWyAgLi4uYXJyYXlLZXlzLCAuLi5udW1iZXJLZXlzLCAuLi5zdHJpbmdLZXlzIF0sXG4gICAgICAgICAgICAnc3RyaW5nJzogIFsgIC4uLmFycmF5S2V5cywgLi4ubnVtYmVyS2V5cywgLi4ub2JqZWN0S2V5cyBdLFxuICAgICAgICAgICAgJ2FsbCc6ICAgICBbICAuLi5hcnJheUtleXMsIC4uLm51bWJlcktleXMsIC4uLm9iamVjdEtleXMsIC4uLnN0cmluZ0tleXMgXSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnN0IGFueU9mID0gW107XG4gICAgICAgICAgZm9yIChjb25zdCB0eXBlIG9mIG5ld1NjaGVtYS50eXBlKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdUeXBlID0gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8geyB0eXBlIH0gOiB7IC4uLnR5cGUgfTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG5ld1NjaGVtYSlcbiAgICAgICAgICAgICAgLmZpbHRlcihrZXkgPT4gIW5ld1R5cGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJlxuICAgICAgICAgICAgICAgICFbIC4uLihmaWx0ZXJLZXlzW25ld1R5cGUudHlwZV0gfHwgZmlsdGVyS2V5cy5hbGwpLCAndHlwZScsICdkZWZhdWx0JyBdXG4gICAgICAgICAgICAgICAgICAuaW5jbHVkZXMoa2V5KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5mb3JFYWNoKGtleSA9PiBuZXdUeXBlW2tleV0gPSBuZXdTY2hlbWFba2V5XSk7XG4gICAgICAgICAgICBhbnlPZi5wdXNoKG5ld1R5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXdTY2hlbWEgPSBuZXdTY2hlbWEuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSA/XG4gICAgICAgICAgICB7IGFueU9mLCBkZWZhdWx0OiBuZXdTY2hlbWEuZGVmYXVsdCB9IDogeyBhbnlPZiB9O1xuICAgICAgICAvLyBJZiB0eXBlIGlzIGFuIG9iamVjdCwgbWVyZ2UgaXQgd2l0aCB0aGUgY3VycmVudCBzY2hlbWFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB0eXBlU2NoZW1hID0gbmV3U2NoZW1hLnR5cGU7XG4gICAgICAgICAgZGVsZXRlIG5ld1NjaGVtYS50eXBlO1xuICAgICAgICAgIE9iamVjdC5hc3NpZ24obmV3U2NoZW1hLCB0eXBlU2NoZW1hKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbmV3U2NoZW1hLnR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29udmVydCBzdWIgc2NoZW1hc1xuICBPYmplY3Qua2V5cyhuZXdTY2hlbWEpXG4gICAgLmZpbHRlcihrZXkgPT4gdHlwZW9mIG5ld1NjaGVtYVtrZXldID09PSAnb2JqZWN0JylcbiAgICAuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBbICdkZWZpbml0aW9ucycsICdkZXBlbmRlbmNpZXMnLCAncHJvcGVydGllcycsICdwYXR0ZXJuUHJvcGVydGllcycgXVxuICAgICAgICAgIC5pbmNsdWRlcyhrZXkpICYmIHR5cGVvZiBuZXdTY2hlbWFba2V5XS5tYXAgIT09ICdmdW5jdGlvbidcbiAgICAgICkge1xuICAgICAgICBjb25zdCBuZXdLZXkgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMobmV3U2NoZW1hW2tleV0pLmZvckVhY2goc3ViS2V5ID0+IG5ld0tleVtzdWJLZXldID1cbiAgICAgICAgICBjb252ZXJ0U2NoZW1hVG9EcmFmdDYobmV3U2NoZW1hW2tleV1bc3ViS2V5XSwgeyBjaGFuZ2VkLCBkcmFmdCB9KVxuICAgICAgICApO1xuICAgICAgICBuZXdTY2hlbWFba2V5XSA9IG5ld0tleTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIFsgJ2l0ZW1zJywgJ2FkZGl0aW9uYWxJdGVtcycsICdhZGRpdGlvbmFsUHJvcGVydGllcycsXG4gICAgICAgICAgJ2FsbE9mJywgJ2FueU9mJywgJ29uZU9mJywgJ25vdCcgXS5pbmNsdWRlcyhrZXkpXG4gICAgICApIHtcbiAgICAgICAgbmV3U2NoZW1hW2tleV0gPSBjb252ZXJ0U2NoZW1hVG9EcmFmdDYobmV3U2NoZW1hW2tleV0sIHsgY2hhbmdlZCwgZHJhZnQgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdTY2hlbWFba2V5XSA9IF8uY2xvbmVEZWVwKG5ld1NjaGVtYVtrZXldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICByZXR1cm4gbmV3U2NoZW1hO1xufVxuIl19