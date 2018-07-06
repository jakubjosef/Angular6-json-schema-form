/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as Ajv from 'ajv';
import * as _ from 'lodash';
import { hasValue, isArray, isDefined, isEmpty, isObject } from './shared/validator.functions';
import { fixTitle, forEach, hasOwn, toTitleCase } from './shared/utility.functions';
import { JsonPointer } from './shared/jsonpointer.functions';
import { buildSchemaFromData, buildSchemaFromLayout, removeRecursiveReferences } from './shared/json-schema.functions';
import { buildFormGroup, buildFormGroupTemplate, formatFormData, getControl } from './shared/form-group.functions';
import { buildLayout, getLayoutNode } from './shared/layout.functions';
import { enValidationMessages } from './locale/en-validation-messages';
import { frValidationMessages } from './locale/fr-validation-messages';
/**
 * @record
 */
export function TitleMapItem() { }
/** @type {?|undefined} */
TitleMapItem.prototype.name;
/** @type {?|undefined} */
TitleMapItem.prototype.value;
/** @type {?|undefined} */
TitleMapItem.prototype.checked;
/** @type {?|undefined} */
TitleMapItem.prototype.group;
/** @type {?|undefined} */
TitleMapItem.prototype.items;
;
/**
 * @record
 */
export function ErrorMessages() { }
;
var JsonSchemaFormService = /** @class */ (function () {
    function JsonSchemaFormService() {
        this.JsonFormCompatibility = false;
        this.ReactJsonSchemaFormCompatibility = false;
        this.AngularSchemaFormCompatibility = false;
        this.tpldata = {};
        this.ajvOptions = { allErrors: true, jsonPointers: true, unknownFormats: 'ignore' };
        this.ajv = new Ajv(this.ajvOptions);
        this.validateFormData = null;
        this.formValues = {};
        this.data = {};
        this.schema = {};
        this.layout = [];
        this.formGroupTemplate = {};
        this.formGroup = null;
        this.framework = null;
        this.validData = null;
        this.isValid = null;
        this.ajvErrors = null;
        this.validationErrors = null;
        this.dataErrors = new Map();
        this.formValueSubscription = null;
        this.dataChanges = new Subject();
        this.isValidChanges = new Subject();
        this.validationErrorChanges = new Subject();
        this.arrayMap = new Map();
        this.dataMap = new Map();
        this.dataRecursiveRefMap = new Map();
        this.schemaRecursiveRefMap = new Map();
        this.schemaRefLibrary = {};
        this.layoutRefLibrary = { '': null };
        this.templateRefLibrary = {};
        this.hasRootReference = false;
        this.language = 'en-US';
        // Default global form options
        this.defaultFormOptions = {
            addSubmit: 'auto',
            // Add a submit button if layout does not have one?
            // for addSubmit: true = always, false = never,
            // 'auto' = only if layout is undefined (form is built from schema alone)
            debug: false,
            // Show debugging output?
            disableInvalidSubmit: true,
            // Disable submit if form invalid?
            formDisabled: false,
            // Set entire form as disabled? (not editable, and disables outputs)
            formReadonly: false,
            // Set entire form as read only? (not editable, but outputs still enabled)
            fieldsRequired: false,
            // (set automatically) Are there any required fields in the form?
            framework: 'no-framework',
            // The framework to load
            loadExternalAssets: false,
            // Load external css and JavaScript for framework?
            pristine: { errors: true, success: true },
            supressPropertyTitles: false,
            setSchemaDefaults: 'auto',
            // Set fefault values from schema?
            // true = always set (unless overridden by layout default or formValues)
            // false = never set
            // 'auto' = set in addable components, and everywhere if formValues not set
            setLayoutDefaults: 'auto',
            // Set fefault values from layout?
            // true = always set (unless overridden by formValues)
            // false = never set
            // 'auto' = set in addable components, and everywhere if formValues not set
            validateOnRender: 'auto',
            // Validate fields immediately, before they are touched?
            // true = validate all fields immediately
            // false = only validate fields after they are touched by user
            // 'auto' = validate fields with values immediately, empty fields after they are touched
            widgets: {},
            // Any custom widgets to load
            defautWidgetOptions: {
                // Default options for form control widgets
                listItems: 1,
                // Number of list items to initially add to arrays with no default value
                addable: true,
                // Allow adding items to an array or $ref point?
                orderable: true,
                // Allow reordering items within an array?
                removable: true,
                // Allow removing items from an array or $ref point?
                enableErrorState: true,
                // Apply 'has-error' class when field fails validation?
                // disableErrorState: false, // Don't apply 'has-error' class when field fails validation?
                enableSuccessState: true,
                // Apply 'has-success' class when field validates?
                // disableSuccessState: false, // Don't apply 'has-success' class when field validates?
                feedback: false,
                // Show inline feedback icons?
                feedbackOnRender: false,
                // Show errorMessage on Render?
                notitle: false,
                // Hide title?
                disabled: false,
                // Set control as disabled? (not editable, and excluded from output)
                readonly: false,
                // Set control as read only? (not editable, but included in output)
                returnEmptyFields: true,
                // return values for fields that contain no data?
                validationMessages: {} // set by setLanguage()
            },
        };
        this.setLanguage(this.language);
    }
    /**
     * @param {?=} language
     * @return {?}
     */
    JsonSchemaFormService.prototype.setLanguage = /**
     * @param {?=} language
     * @return {?}
     */
    function (language) {
        if (language === void 0) { language = 'en-US'; }
        this.language = language;
        /** @type {?} */
        var validationMessages = language.slice(0, 2) === 'fr' ?
            frValidationMessages : enValidationMessages;
        this.defaultFormOptions.defautWidgetOptions.validationMessages =
            _.cloneDeep(validationMessages);
    };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.getData = /**
     * @return {?}
     */
    function () { return this.data; };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.getSchema = /**
     * @return {?}
     */
    function () { return this.schema; };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.getLayout = /**
     * @return {?}
     */
    function () { return this.layout; };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.resetAllValues = /**
     * @return {?}
     */
    function () {
        this.JsonFormCompatibility = false;
        this.ReactJsonSchemaFormCompatibility = false;
        this.AngularSchemaFormCompatibility = false;
        this.tpldata = {};
        this.validateFormData = null;
        this.formValues = {};
        this.schema = {};
        this.layout = [];
        this.formGroupTemplate = {};
        this.formGroup = null;
        this.framework = null;
        this.data = {};
        this.validData = null;
        this.isValid = null;
        this.validationErrors = null;
        this.arrayMap = new Map();
        this.dataMap = new Map();
        this.dataRecursiveRefMap = new Map();
        this.schemaRecursiveRefMap = new Map();
        this.layoutRefLibrary = {};
        this.schemaRefLibrary = {};
        this.templateRefLibrary = {};
        this.formOptions = _.cloneDeep(this.defaultFormOptions);
    };
    /**
     * 'buildRemoteError' function
     *
     * Example errors:
     * {
     *   last_name: [ {
     *     message: 'Last name must by start with capital letter.',
     *     code: 'capital_letter'
     *   } ],
     *   email: [ {
     *     message: 'Email must be from example.com domain.',
     *     code: 'special_domain'
     *   }, {
     *     message: 'Email must contain an @ symbol.',
     *     code: 'at_symbol'
     *   } ]
     * }
     * //{ErrorMessages} errors
     */
    /**
     * 'buildRemoteError' function
     *
     * Example errors:
     * {
     *   last_name: [ {
     *     message: 'Last name must by start with capital letter.',
     *     code: 'capital_letter'
     *   } ],
     *   email: [ {
     *     message: 'Email must be from example.com domain.',
     *     code: 'special_domain'
     *   }, {
     *     message: 'Email must contain an \@ symbol.',
     *     code: 'at_symbol'
     *   } ]
     * }
     * //{ErrorMessages} errors
     * @param {?} errors
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildRemoteError = /**
     * 'buildRemoteError' function
     *
     * Example errors:
     * {
     *   last_name: [ {
     *     message: 'Last name must by start with capital letter.',
     *     code: 'capital_letter'
     *   } ],
     *   email: [ {
     *     message: 'Email must be from example.com domain.',
     *     code: 'special_domain'
     *   }, {
     *     message: 'Email must contain an \@ symbol.',
     *     code: 'at_symbol'
     *   } ]
     * }
     * //{ErrorMessages} errors
     * @param {?} errors
     * @return {?}
     */
    function (errors) {
        var _this = this;
        forEach(errors, function (value, key) {
            if (key in _this.formGroup.controls) {
                try {
                    for (var value_1 = tslib_1.__values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                        var error = value_1_1.value;
                        /** @type {?} */
                        var err = {};
                        err[error['code']] = error['message'];
                        _this.formGroup.get(key).setErrors(err, { emitEvent: true });
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            var e_1, _a;
        });
    };
    /**
     * @param {?} newValue
     * @param {?=} updateSubscriptions
     * @return {?}
     */
    JsonSchemaFormService.prototype.validateData = /**
     * @param {?} newValue
     * @param {?=} updateSubscriptions
     * @return {?}
     */
    function (newValue, updateSubscriptions) {
        if (updateSubscriptions === void 0) { updateSubscriptions = true; }
        // Format raw form data to correct data types
        this.data = formatFormData(newValue, this.dataMap, this.dataRecursiveRefMap, this.arrayMap, this.formOptions.returnEmptyFields);
        this.isValid = this.validateFormData(this.data);
        this.validData = this.isValid ? this.data : null;
        /** @type {?} */
        var compileErrors = function (errors) {
            /** @type {?} */
            var compiledErrors = {};
            (errors || []).forEach(function (error) {
                if (!compiledErrors[error.dataPath]) {
                    compiledErrors[error.dataPath] = [];
                }
                compiledErrors[error.dataPath].push(error.message);
            });
            return compiledErrors;
        };
        this.ajvErrors = this.validateFormData.errors;
        this.validationErrors = compileErrors(this.validateFormData.errors);
        if (updateSubscriptions) {
            this.dataChanges.next(this.data);
            this.isValidChanges.next(this.isValid);
            this.validationErrorChanges.next(this.ajvErrors);
        }
    };
    /**
     * @param {?=} formValues
     * @param {?=} setValues
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildFormGroupTemplate = /**
     * @param {?=} formValues
     * @param {?=} setValues
     * @return {?}
     */
    function (formValues, setValues) {
        if (formValues === void 0) { formValues = null; }
        if (setValues === void 0) { setValues = true; }
        this.formGroupTemplate = buildFormGroupTemplate(this, formValues, setValues);
    };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildFormGroup = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.formGroup = /** @type {?} */ (buildFormGroup(this.formGroupTemplate));
        if (this.formGroup) {
            this.compileAjvSchema();
            this.validateData(this.formGroup.value);
            // Set up observables to emit data and validation info when form data changes
            if (this.formValueSubscription) {
                this.formValueSubscription.unsubscribe();
            }
            this.formValueSubscription = this.formGroup.valueChanges
                .subscribe(function (formValue) { return _this.validateData(formValue); });
        }
    };
    /**
     * @param {?} widgetLibrary
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildLayout = /**
     * @param {?} widgetLibrary
     * @return {?}
     */
    function (widgetLibrary) {
        this.layout = buildLayout(this, widgetLibrary);
    };
    /**
     * @param {?} newOptions
     * @return {?}
     */
    JsonSchemaFormService.prototype.setOptions = /**
     * @param {?} newOptions
     * @return {?}
     */
    function (newOptions) {
        if (isObject(newOptions)) {
            /** @type {?} */
            var addOptions = _.cloneDeep(newOptions);
            // Backward compatibility for 'defaultOptions' (renamed 'defautWidgetOptions')
            if (isObject(addOptions.defaultOptions)) {
                Object.assign(this.formOptions.defautWidgetOptions, addOptions.defaultOptions);
                delete addOptions.defaultOptions;
            }
            if (isObject(addOptions.defautWidgetOptions)) {
                Object.assign(this.formOptions.defautWidgetOptions, addOptions.defautWidgetOptions);
                delete addOptions.defautWidgetOptions;
            }
            Object.assign(this.formOptions, addOptions);
            /** @type {?} */
            var globalDefaults_1 = this.formOptions.defautWidgetOptions;
            ['ErrorState', 'SuccessState']
                .filter(function (suffix) { return hasOwn(globalDefaults_1, 'disable' + suffix); })
                .forEach(function (suffix) {
                globalDefaults_1['enable' + suffix] = !globalDefaults_1['disable' + suffix];
                delete globalDefaults_1['disable' + suffix];
            });
        }
    };
    /**
     * @return {?}
     */
    JsonSchemaFormService.prototype.compileAjvSchema = /**
     * @return {?}
     */
    function () {
        if (!this.validateFormData) {
            // if 'ui:order' exists in properties, move it to root before compiling with ajv
            if (Array.isArray(this.schema.properties['ui:order'])) {
                this.schema['ui:order'] = this.schema.properties['ui:order'];
                delete this.schema.properties['ui:order'];
            }
            this.ajv.removeSchema(this.schema);
            this.validateFormData = this.ajv.compile(this.schema);
        }
    };
    /**
     * @param {?=} data
     * @param {?=} requireAllFields
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildSchemaFromData = /**
     * @param {?=} data
     * @param {?=} requireAllFields
     * @return {?}
     */
    function (data, requireAllFields) {
        if (requireAllFields === void 0) { requireAllFields = false; }
        if (data) {
            return buildSchemaFromData(data, requireAllFields);
        }
        this.schema = buildSchemaFromData(this.formValues, requireAllFields);
    };
    /**
     * @param {?=} layout
     * @return {?}
     */
    JsonSchemaFormService.prototype.buildSchemaFromLayout = /**
     * @param {?=} layout
     * @return {?}
     */
    function (layout) {
        if (layout) {
            return buildSchemaFromLayout(layout);
        }
        this.schema = buildSchemaFromLayout(this.layout);
    };
    /**
     * @param {?=} newTpldata
     * @return {?}
     */
    JsonSchemaFormService.prototype.setTpldata = /**
     * @param {?=} newTpldata
     * @return {?}
     */
    function (newTpldata) {
        if (newTpldata === void 0) { newTpldata = {}; }
        this.tpldata = newTpldata;
    };
    /**
     * @param {?=} text
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @return {?}
     */
    JsonSchemaFormService.prototype.parseText = /**
     * @param {?=} text
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @return {?}
     */
    function (text, value, values, key) {
        var _this = this;
        if (text === void 0) { text = ''; }
        if (value === void 0) { value = {}; }
        if (values === void 0) { values = {}; }
        if (key === void 0) { key = null; }
        if (!text || !/{{.+?}}/.test(text)) {
            return text;
        }
        return text.replace(/{{(.+?)}}/g, function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            return _this.parseExpression(a[1], value, values, key, _this.tpldata);
        });
    };
    /**
     * @param {?=} expression
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @param {?=} tpldata
     * @return {?}
     */
    JsonSchemaFormService.prototype.parseExpression = /**
     * @param {?=} expression
     * @param {?=} value
     * @param {?=} values
     * @param {?=} key
     * @param {?=} tpldata
     * @return {?}
     */
    function (expression, value, values, key, tpldata) {
        var _this = this;
        if (expression === void 0) { expression = ''; }
        if (value === void 0) { value = {}; }
        if (values === void 0) { values = {}; }
        if (key === void 0) { key = null; }
        if (tpldata === void 0) { tpldata = null; }
        if (typeof expression !== 'string') {
            return '';
        }
        /** @type {?} */
        var index = typeof key === 'number' ? (key + 1) + '' : (key || '');
        expression = expression.trim();
        if ((expression[0] === "'" || expression[0] === '"') &&
            expression[0] === expression[expression.length - 1] &&
            expression.slice(1, expression.length - 1).indexOf(expression[0]) === -1) {
            return expression.slice(1, expression.length - 1);
        }
        if (expression === 'idx' || expression === '$index') {
            return index;
        }
        if (expression === 'value' && !hasOwn(values, 'value')) {
            return value;
        }
        if (['"', "'", ' ', '||', '&&', '+'].every(function (delim) { return expression.indexOf(delim) === -1; })) {
            /** @type {?} */
            var pointer = JsonPointer.parseObjectPath(expression);
            return pointer[0] === 'value' && JsonPointer.has(value, pointer.slice(1)) ?
                JsonPointer.get(value, pointer.slice(1)) :
                pointer[0] === 'values' && JsonPointer.has(values, pointer.slice(1)) ?
                    JsonPointer.get(values, pointer.slice(1)) :
                    pointer[0] === 'tpldata' && JsonPointer.has(tpldata, pointer.slice(1)) ?
                        JsonPointer.get(tpldata, pointer.slice(1)) :
                        JsonPointer.has(values, pointer) ? JsonPointer.get(values, pointer) : '';
        }
        if (expression.indexOf('[idx]') > -1) {
            expression = expression.replace(/\[idx\]/g, /** @type {?} */ (index));
        }
        if (expression.indexOf('[$index]') > -1) {
            expression = expression.replace(/\[$index\]/g, /** @type {?} */ (index));
        }
        // TODO: Improve expression evaluation by parsing quoted strings first
        // let expressionArray = expression.match(/([^"']+|"[^"]+"|'[^']+')/g);
        if (expression.indexOf('||') > -1) {
            return expression.split('||').reduce(function (all, term) {
                return all || _this.parseExpression(term, value, values, key, tpldata);
            }, '');
        }
        if (expression.indexOf('&&') > -1) {
            return expression.split('&&').reduce(function (all, term) {
                return all && _this.parseExpression(term, value, values, key, tpldata);
            }, ' ').trim();
        }
        if (expression.indexOf('+') > -1) {
            return expression.split('+')
                .map(function (term) { return _this.parseExpression(term, value, values, key, tpldata); })
                .join('');
        }
        return '';
    };
    /**
     * @param {?=} parentCtx
     * @param {?=} childNode
     * @param {?=} index
     * @return {?}
     */
    JsonSchemaFormService.prototype.setArrayItemTitle = /**
     * @param {?=} parentCtx
     * @param {?=} childNode
     * @param {?=} index
     * @return {?}
     */
    function (parentCtx, childNode, index) {
        if (parentCtx === void 0) { parentCtx = {}; }
        if (childNode === void 0) { childNode = null; }
        if (index === void 0) { index = null; }
        /** @type {?} */
        var parentNode = parentCtx.layoutNode;
        /** @type {?} */
        var parentValues = this.getFormControlValue(parentCtx);
        /** @type {?} */
        var isArrayItem = (parentNode.type || '').slice(-5) === 'array' && isArray(parentValues);
        /** @type {?} */
        var text = JsonPointer.getFirst(isArrayItem && childNode.type !== '$ref' ? [
            [childNode, '/options/legend'],
            [childNode, '/options/title'],
            [parentNode, '/options/title'],
            [parentNode, '/options/legend'],
        ] : [
            [childNode, '/options/title'],
            [childNode, '/options/legend'],
            [parentNode, '/options/title'],
            [parentNode, '/options/legend']
        ]);
        if (!text) {
            return text;
        }
        /** @type {?} */
        var childValue = isArray(parentValues) && index < parentValues.length ?
            parentValues[index] : parentValues;
        return this.parseText(text, childValue, parentValues, index);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.setItemTitle = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        return !ctx.options.title && /^(\d+|-)$/.test(ctx.layoutNode.name) ?
            null :
            this.parseText(ctx.options.title || toTitleCase(ctx.layoutNode.name), this.getFormControlValue(this), (this.getFormControlGroup(this) || /** @type {?} */ ({})).value, ctx.dataIndex[ctx.dataIndex.length - 1]);
    };
    /**
     * @param {?} layoutNode
     * @param {?} dataIndex
     * @return {?}
     */
    JsonSchemaFormService.prototype.evaluateCondition = /**
     * @param {?} layoutNode
     * @param {?} dataIndex
     * @return {?}
     */
    function (layoutNode, dataIndex) {
        /** @type {?} */
        var arrayIndex = dataIndex && dataIndex[dataIndex.length - 1];
        /** @type {?} */
        var result = true;
        if (hasValue((layoutNode.options || {}).condition)) {
            if (typeof layoutNode.options.condition === 'string') {
                /** @type {?} */
                var pointer = layoutNode.options.condition;
                if (hasValue(arrayIndex)) {
                    pointer = pointer.replace('[arrayIndex]', "[" + arrayIndex + "]");
                }
                pointer = JsonPointer.parseObjectPath(pointer);
                result = !!JsonPointer.get(this.data, pointer);
                if (!result && pointer[0] === 'model') {
                    result = !!JsonPointer.get({ model: this.data }, pointer);
                }
            }
            else if (typeof layoutNode.options.condition === 'function') {
                result = layoutNode.options.condition(this.data);
            }
            else if (typeof layoutNode.options.condition.functionBody === 'string') {
                try {
                    /** @type {?} */
                    var dynFn = new Function('model', 'arrayIndices', layoutNode.options.condition.functionBody);
                    result = dynFn(this.data, dataIndex);
                }
                catch (e) {
                    result = true;
                    console.error("condition functionBody errored out on evaluation: " + layoutNode.options.condition.functionBody);
                }
            }
        }
        return result;
    };
    /**
     * @param {?} ctx
     * @param {?=} bind
     * @return {?}
     */
    JsonSchemaFormService.prototype.initializeControl = /**
     * @param {?} ctx
     * @param {?=} bind
     * @return {?}
     */
    function (ctx, bind) {
        var _this = this;
        if (bind === void 0) { bind = true; }
        if (!isObject(ctx)) {
            return false;
        }
        if (isEmpty(ctx.options)) {
            ctx.options = !isEmpty((ctx.layoutNode || {}).options) ?
                ctx.layoutNode.options : _.cloneDeep(this.formOptions);
        }
        ctx.formControl = this.getFormControl(ctx);
        ctx.boundControl = bind && !!ctx.formControl;
        if (ctx.formControl) {
            ctx.controlName = this.getFormControlName(ctx);
            ctx.controlValue = ctx.formControl.value;
            ctx.controlDisabled = ctx.formControl.disabled;
            ctx.options.errorMessage = ctx.formControl.status === 'VALID' ? null :
                this.formatErrors(ctx.formControl.errors, ctx.options.validationMessages);
            ctx.options.showErrors = this.formOptions.validateOnRender === true ||
                (this.formOptions.validateOnRender === 'auto' && hasValue(ctx.controlValue));
            ctx.formControl.statusChanges.subscribe(function (status) {
                return ctx.options.errorMessage = status === 'VALID' ? null :
                    _this.formatErrors(ctx.formControl.errors, ctx.options.validationMessages);
            });
            ctx.formControl.valueChanges.subscribe(function (value) {
                if (!_.isEqual(ctx.controlValue, value)) {
                    ctx.controlValue = value;
                }
            });
        }
        else {
            ctx.controlName = ctx.layoutNode.name;
            ctx.controlValue = ctx.layoutNode.value || null;
            /** @type {?} */
            var dataPointer = this.getDataPointer(ctx);
            if (bind && dataPointer) {
                console.error("warning: control \"" + dataPointer + "\" is not bound to the Angular FormGroup.");
            }
        }
        return ctx.boundControl;
    };
    /**
     * @param {?} errors
     * @param {?=} validationMessages
     * @return {?}
     */
    JsonSchemaFormService.prototype.formatErrors = /**
     * @param {?} errors
     * @param {?=} validationMessages
     * @return {?}
     */
    function (errors, validationMessages) {
        if (validationMessages === void 0) { validationMessages = {}; }
        if (isEmpty(errors)) {
            return null;
        }
        if (!isObject(validationMessages)) {
            validationMessages = {};
        }
        /** @type {?} */
        var addSpaces = function (string) { return string[0].toUpperCase() + (string.slice(1) || '')
            .replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' '); };
        /** @type {?} */
        var formatError = function (error) { return typeof error === 'object' ?
            Object.keys(error).map(function (key) {
                return error[key] === true ? addSpaces(key) :
                    error[key] === false ? 'Not ' + addSpaces(key) :
                        addSpaces(key) + ': ' + formatError(error[key]);
            }).join(', ') :
            addSpaces(error.toString()); };
        /** @type {?} */
        var messages = [];
        return Object.keys(errors)
            .filter(function (errorKey) { return errorKey !== 'required' || Object.keys(errors).length === 1; })
            .map(function (errorKey) {
            // If validationMessages is a string, return it
            return typeof validationMessages === 'string' ? validationMessages :
                // If custom error message is a function, return function result
                typeof validationMessages[errorKey] === 'function' ?
                    validationMessages[errorKey](errors[errorKey]) :
                    // If custom error message is a string, replace placeholders and return
                    typeof validationMessages[errorKey] === 'string' ?
                        // Does error message have any {{property}} placeholders?
                        !/{{.+?}}/.test(validationMessages[errorKey]) ?
                            validationMessages[errorKey] :
                            // Replace {{property}} placeholders with values
                            Object.keys(errors[errorKey])
                                .reduce(function (errorMessage, errorProperty) { return errorMessage.replace(new RegExp('{{' + errorProperty + '}}', 'g'), errors[errorKey][errorProperty]); }, validationMessages[errorKey]) :
                        // If no custom error message, return formatted error data instead
                        addSpaces(errorKey) + ' Error: ' + formatError(errors[errorKey]);
        }).join('<br>');
    };
    /**
     * @param {?} ctx
     * @param {?} value
     * @return {?}
     */
    JsonSchemaFormService.prototype.updateValue = /**
     * @param {?} ctx
     * @param {?} value
     * @return {?}
     */
    function (ctx, value) {
        // Set value of current control
        ctx.controlValue = value;
        if (ctx.boundControl) {
            ctx.formControl.setValue(value);
            ctx.formControl.markAsDirty();
        }
        ctx.layoutNode.value = value;
        // Set values of any related controls in copyValueTo array
        if (isArray(ctx.options.copyValueTo)) {
            try {
                for (var _a = tslib_1.__values(ctx.options.copyValueTo), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var item = _b.value;
                    /** @type {?} */
                    var targetControl = getControl(this.formGroup, item);
                    if (isObject(targetControl) && typeof targetControl.setValue === 'function') {
                        targetControl.setValue(value);
                        targetControl.markAsDirty();
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        var e_2, _c;
    };
    /**
     * @param {?} ctx
     * @param {?} checkboxList
     * @return {?}
     */
    JsonSchemaFormService.prototype.updateArrayCheckboxList = /**
     * @param {?} ctx
     * @param {?} checkboxList
     * @return {?}
     */
    function (ctx, checkboxList) {
        /** @type {?} */
        var formArray = /** @type {?} */ (this.getFormControl(ctx));
        // Remove all existing items
        while (formArray.value.length) {
            formArray.removeAt(0);
        }
        /** @type {?} */
        var refPointer = removeRecursiveReferences(ctx.layoutNode.dataPointer + '/-', this.dataRecursiveRefMap, this.arrayMap);
        try {
            for (var checkboxList_1 = tslib_1.__values(checkboxList), checkboxList_1_1 = checkboxList_1.next(); !checkboxList_1_1.done; checkboxList_1_1 = checkboxList_1.next()) {
                var checkboxItem = checkboxList_1_1.value;
                if (checkboxItem.checked) {
                    /** @type {?} */
                    var newFormControl = buildFormGroup(this.templateRefLibrary[refPointer]);
                    newFormControl.setValue(checkboxItem.value);
                    formArray.push(newFormControl);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (checkboxList_1_1 && !checkboxList_1_1.done && (_a = checkboxList_1.return)) _a.call(checkboxList_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        formArray.markAsDirty();
        var e_3, _a;
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getFormControl = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === '$ref') {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx));
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getFormControlValue = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === '$ref') {
            return null;
        }
        /** @type {?} */
        var control = getControl(this.formGroup, this.getDataPointer(ctx));
        return control ? control.value : null;
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getFormControlGroup = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer)) {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx), true);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getFormControlName = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) || !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toKey(this.getDataPointer(ctx));
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getLayoutArray = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -1);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getParentNode = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -2);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getDataPointer = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) || !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toIndexedPointer(ctx.layoutNode.dataPointer, ctx.dataIndex, this.arrayMap);
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.getLayoutPointer = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!hasValue(ctx.layoutIndex)) {
            return null;
        }
        return '/' + ctx.layoutIndex.join('/items/');
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.isControlBound = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) || !hasValue(ctx.dataIndex)) {
            return false;
        }
        /** @type {?} */
        var controlGroup = this.getFormControlGroup(ctx);
        /** @type {?} */
        var name = this.getFormControlName(ctx);
        return controlGroup ? hasOwn(controlGroup.controls, name) : false;
    };
    /**
     * @param {?} ctx
     * @param {?=} name
     * @return {?}
     */
    JsonSchemaFormService.prototype.addItem = /**
     * @param {?} ctx
     * @param {?=} name
     * @return {?}
     */
    function (ctx, name) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.$ref) ||
            !hasValue(ctx.dataIndex) || !hasValue(ctx.layoutIndex)) {
            return false;
        }
        /** @type {?} */
        var newFormGroup = buildFormGroup(this.templateRefLibrary[ctx.layoutNode.$ref]);
        // Add the new form control to the parent formArray or formGroup
        if (ctx.layoutNode.arrayItem) {
            // Add new array item to formArray
            (/** @type {?} */ (this.getFormControlGroup(ctx))).push(newFormGroup);
        }
        else {
            // Add new $ref item to formGroup
            (/** @type {?} */ (this.getFormControlGroup(ctx)))
                .addControl(name || this.getFormControlName(ctx), newFormGroup);
        }
        /** @type {?} */
        var newLayoutNode = getLayoutNode(ctx.layoutNode, this);
        newLayoutNode.arrayItem = ctx.layoutNode.arrayItem;
        if (ctx.layoutNode.arrayItemType) {
            newLayoutNode.arrayItemType = ctx.layoutNode.arrayItemType;
        }
        else {
            delete newLayoutNode.arrayItemType;
        }
        if (name) {
            newLayoutNode.name = name;
            newLayoutNode.dataPointer += '/' + JsonPointer.escape(name);
            newLayoutNode.options.title = fixTitle(name);
        }
        // Add the new layoutNode to the form layout
        JsonPointer.insert(this.layout, this.getLayoutPointer(ctx), newLayoutNode);
        return true;
    };
    /**
     * @param {?} ctx
     * @param {?} oldIndex
     * @param {?} newIndex
     * @return {?}
     */
    JsonSchemaFormService.prototype.moveArrayItem = /**
     * @param {?} ctx
     * @param {?} oldIndex
     * @param {?} newIndex
     * @return {?}
     */
    function (ctx, oldIndex, newIndex) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex) || !hasValue(ctx.layoutIndex) ||
            !isDefined(oldIndex) || !isDefined(newIndex) || oldIndex === newIndex) {
            return false;
        }
        /** @type {?} */
        var formArray = /** @type {?} */ (this.getFormControlGroup(ctx));
        /** @type {?} */
        var arrayItem = formArray.at(oldIndex);
        formArray.removeAt(oldIndex);
        formArray.insert(newIndex, arrayItem);
        formArray.updateValueAndValidity();
        /** @type {?} */
        var layoutArray = this.getLayoutArray(ctx);
        layoutArray.splice(newIndex, 0, layoutArray.splice(oldIndex, 1)[0]);
        return true;
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    JsonSchemaFormService.prototype.removeItem = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex) || !hasValue(ctx.layoutIndex)) {
            return false;
        }
        // Remove the Angular form control from the parent formArray or formGroup
        if (ctx.layoutNode.arrayItem) {
            // Remove array item from formArray
            (/** @type {?} */ (this.getFormControlGroup(ctx)))
                .removeAt(ctx.dataIndex[ctx.dataIndex.length - 1]);
        }
        else {
            // Remove $ref item from formGroup
            (/** @type {?} */ (this.getFormControlGroup(ctx)))
                .removeControl(this.getFormControlName(ctx));
        }
        // Remove layoutNode from layout
        JsonPointer.remove(this.layout, this.getLayoutPointer(ctx));
        return true;
    };
    JsonSchemaFormService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    JsonSchemaFormService.ctorParameters = function () { return []; };
    return JsonSchemaFormService;
}());
export { JsonSchemaFormService };
if (false) {
    /** @type {?} */
    JsonSchemaFormService.prototype.JsonFormCompatibility;
    /** @type {?} */
    JsonSchemaFormService.prototype.ReactJsonSchemaFormCompatibility;
    /** @type {?} */
    JsonSchemaFormService.prototype.AngularSchemaFormCompatibility;
    /** @type {?} */
    JsonSchemaFormService.prototype.tpldata;
    /** @type {?} */
    JsonSchemaFormService.prototype.ajvOptions;
    /** @type {?} */
    JsonSchemaFormService.prototype.ajv;
    /** @type {?} */
    JsonSchemaFormService.prototype.validateFormData;
    /** @type {?} */
    JsonSchemaFormService.prototype.formValues;
    /** @type {?} */
    JsonSchemaFormService.prototype.data;
    /** @type {?} */
    JsonSchemaFormService.prototype.schema;
    /** @type {?} */
    JsonSchemaFormService.prototype.layout;
    /** @type {?} */
    JsonSchemaFormService.prototype.formGroupTemplate;
    /** @type {?} */
    JsonSchemaFormService.prototype.formGroup;
    /** @type {?} */
    JsonSchemaFormService.prototype.framework;
    /** @type {?} */
    JsonSchemaFormService.prototype.formOptions;
    /** @type {?} */
    JsonSchemaFormService.prototype.validData;
    /** @type {?} */
    JsonSchemaFormService.prototype.isValid;
    /** @type {?} */
    JsonSchemaFormService.prototype.ajvErrors;
    /** @type {?} */
    JsonSchemaFormService.prototype.validationErrors;
    /** @type {?} */
    JsonSchemaFormService.prototype.dataErrors;
    /** @type {?} */
    JsonSchemaFormService.prototype.formValueSubscription;
    /** @type {?} */
    JsonSchemaFormService.prototype.dataChanges;
    /** @type {?} */
    JsonSchemaFormService.prototype.isValidChanges;
    /** @type {?} */
    JsonSchemaFormService.prototype.validationErrorChanges;
    /** @type {?} */
    JsonSchemaFormService.prototype.arrayMap;
    /** @type {?} */
    JsonSchemaFormService.prototype.dataMap;
    /** @type {?} */
    JsonSchemaFormService.prototype.dataRecursiveRefMap;
    /** @type {?} */
    JsonSchemaFormService.prototype.schemaRecursiveRefMap;
    /** @type {?} */
    JsonSchemaFormService.prototype.schemaRefLibrary;
    /** @type {?} */
    JsonSchemaFormService.prototype.layoutRefLibrary;
    /** @type {?} */
    JsonSchemaFormService.prototype.templateRefLibrary;
    /** @type {?} */
    JsonSchemaFormService.prototype.hasRootReference;
    /** @type {?} */
    JsonSchemaFormService.prototype.language;
    /** @type {?} */
    JsonSchemaFormService.prototype.defaultFormOptions;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFL0IsT0FBTyxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFDM0IsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFFNUIsT0FBTyxFQUNMLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQ2hELE1BQU0sOEJBQThCLENBQUM7QUFDdEMsT0FBTyxFQUNMLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFDdkMsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDN0QsT0FBTyxFQUNMLG1CQUFtQixFQUFFLHFCQUFxQixFQUFFLHlCQUF5QixFQUV0RSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3hDLE9BQU8sRUFDTCxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFDbkUsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFJdEUsQ0FBQzs7Ozs7QUFHRCxDQUFDOztJQTBGQTtxQ0FyRndCLEtBQUs7Z0RBQ00sS0FBSzs4Q0FDUCxLQUFLO3VCQUN2QixFQUFFOzBC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LElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsRUFBQztpQkFDdkMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0RDtRQUFDLElBQUksQ0FBQyxDQUFDOztZQUNOLG1CQUFZLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsRUFBQztpQkFDdkMsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2hEOztRQUdELFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsSUFBSSxDQUFDO0tBQ2I7O2dCQS9uQkYsVUFBVTs7OztnQ0FsQ1g7O1NBbUNhLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgRm9ybUFycmF5LCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCAqIGFzIEFqdiBmcm9tICdhanYnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQge1xuICBoYXNWYWx1ZSwgaXNBcnJheSwgaXNEZWZpbmVkLCBpc0VtcHR5LCBpc09iamVjdCwgaXNTdHJpbmdcbn0gZnJvbSAnLi9zaGFyZWQvdmFsaWRhdG9yLmZ1bmN0aW9ucyc7XG5pbXBvcnQge1xuICBmaXhUaXRsZSwgZm9yRWFjaCwgaGFzT3duLCB0b1RpdGxlQ2FzZVxufSBmcm9tICcuL3NoYXJlZC91dGlsaXR5LmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBKc29uUG9pbnRlciB9IGZyb20gJy4vc2hhcmVkL2pzb25wb2ludGVyLmZ1bmN0aW9ucyc7XG5pbXBvcnQge1xuICBidWlsZFNjaGVtYUZyb21EYXRhLCBidWlsZFNjaGVtYUZyb21MYXlvdXQsIHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMsXG4gIHJlc29sdmVTY2hlbWFSZWZlcmVuY2VzXG59IGZyb20gJy4vc2hhcmVkL2pzb24tc2NoZW1hLmZ1bmN0aW9ucyc7XG5pbXBvcnQge1xuICBidWlsZEZvcm1Hcm91cCwgYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZSwgZm9ybWF0Rm9ybURhdGEsIGdldENvbnRyb2xcbn0gZnJvbSAnLi9zaGFyZWQvZm9ybS1ncm91cC5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgYnVpbGRMYXlvdXQsIGdldExheW91dE5vZGUgfSBmcm9tICcuL3NoYXJlZC9sYXlvdXQuZnVuY3Rpb25zJztcbmltcG9ydCB7IGVuVmFsaWRhdGlvbk1lc3NhZ2VzIH0gZnJvbSAnLi9sb2NhbGUvZW4tdmFsaWRhdGlvbi1tZXNzYWdlcyc7XG5pbXBvcnQgeyBmclZhbGlkYXRpb25NZXNzYWdlcyB9IGZyb20gJy4vbG9jYWxlL2ZyLXZhbGlkYXRpb24tbWVzc2FnZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRpdGxlTWFwSXRlbSB7XG4gIG5hbWU/OiBzdHJpbmcsIHZhbHVlPzogYW55LCBjaGVja2VkPzogYm9vbGVhbiwgZ3JvdXA/OiBzdHJpbmcsIGl0ZW1zPzogVGl0bGVNYXBJdGVtW11cbn07XG5leHBvcnQgaW50ZXJmYWNlIEVycm9yTWVzc2FnZXMge1xuICBbY29udHJvbF9uYW1lOiBzdHJpbmddOiB7IG1lc3NhZ2U6IHN0cmluZ3xGdW5jdGlvbnxPYmplY3QsIGNvZGU6IHN0cmluZyB9W11cbn07XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEpzb25TY2hlbWFGb3JtU2VydmljZSB7XG4gIEpzb25Gb3JtQ29tcGF0aWJpbGl0eSA9IGZhbHNlO1xuICBSZWFjdEpzb25TY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IGZhbHNlO1xuICBBbmd1bGFyU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSBmYWxzZTtcbiAgdHBsZGF0YTogYW55ID0ge307XG5cbiAgYWp2T3B0aW9uczogYW55ID0geyBhbGxFcnJvcnM6IHRydWUsIGpzb25Qb2ludGVyczogdHJ1ZSwgdW5rbm93bkZvcm1hdHM6ICdpZ25vcmUnIH07XG4gIGFqdjogYW55ID0gbmV3IEFqdih0aGlzLmFqdk9wdGlvbnMpOyAvLyBBSlY6IEFub3RoZXIgSlNPTiBTY2hlbWEgVmFsaWRhdG9yXG4gIHZhbGlkYXRlRm9ybURhdGE6IGFueSA9IG51bGw7IC8vIENvbXBpbGVkIEFKViBmdW5jdGlvbiB0byB2YWxpZGF0ZSBhY3RpdmUgZm9ybSdzIHNjaGVtYVxuXG4gIGZvcm1WYWx1ZXM6IGFueSA9IHt9OyAvLyBJbnRlcm5hbCBmb3JtIGRhdGEgKG1heSBub3QgaGF2ZSBjb3JyZWN0IHR5cGVzKVxuICBkYXRhOiBhbnkgPSB7fTsgLy8gT3V0cHV0IGZvcm0gZGF0YSAoZm9ybVZhbHVlcywgZm9ybWF0dGVkIHdpdGggY29ycmVjdCBkYXRhIHR5cGVzKVxuICBzY2hlbWE6IGFueSA9IHt9OyAvLyBJbnRlcm5hbCBKU09OIFNjaGVtYVxuICBsYXlvdXQ6IGFueVtdID0gW107IC8vIEludGVybmFsIGZvcm0gbGF5b3V0XG4gIGZvcm1Hcm91cFRlbXBsYXRlOiBhbnkgPSB7fTsgLy8gVGVtcGxhdGUgdXNlZCB0byBjcmVhdGUgZm9ybUdyb3VwXG4gIGZvcm1Hcm91cDogYW55ID0gbnVsbDsgLy8gQW5ndWxhciBmb3JtR3JvdXAsIHdoaWNoIHBvd2VycyB0aGUgcmVhY3RpdmUgZm9ybVxuICBmcmFtZXdvcms6IGFueSA9IG51bGw7IC8vIEFjdGl2ZSBmcmFtZXdvcmsgY29tcG9uZW50XG4gIGZvcm1PcHRpb25zOiBhbnk7IC8vIEFjdGl2ZSBvcHRpb25zLCB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgZm9ybVxuXG4gIHZhbGlkRGF0YTogYW55ID0gbnVsbDsgLy8gVmFsaWQgZm9ybSBkYXRhIChvciBudWxsKSAoPT09IGlzVmFsaWQgPyBkYXRhIDogbnVsbClcbiAgaXNWYWxpZDogYm9vbGVhbiA9IG51bGw7IC8vIElzIGN1cnJlbnQgZm9ybSBkYXRhIHZhbGlkP1xuICBhanZFcnJvcnM6IGFueSA9IG51bGw7IC8vIEFqdiBlcnJvcnMgZm9yIGN1cnJlbnQgZGF0YVxuICB2YWxpZGF0aW9uRXJyb3JzOiBhbnkgPSBudWxsOyAvLyBBbnkgdmFsaWRhdGlvbiBlcnJvcnMgZm9yIGN1cnJlbnQgZGF0YVxuICBkYXRhRXJyb3JzOiBhbnkgPSBuZXcgTWFwKCk7IC8vXG4gIGZvcm1WYWx1ZVN1YnNjcmlwdGlvbjogYW55ID0gbnVsbDsgLy8gU3Vic2NyaXB0aW9uIHRvIGZvcm1Hcm91cC52YWx1ZUNoYW5nZXMgb2JzZXJ2YWJsZSAoZm9yIHVuLSBhbmQgcmUtc3Vic2NyaWJpbmcpXG4gIGRhdGFDaGFuZ2VzOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpOyAvLyBGb3JtIGRhdGEgb2JzZXJ2YWJsZVxuICBpc1ZhbGlkQ2hhbmdlczogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTsgLy8gaXNWYWxpZCBvYnNlcnZhYmxlXG4gIHZhbGlkYXRpb25FcnJvckNoYW5nZXM6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7IC8vIHZhbGlkYXRpb25FcnJvcnMgb2JzZXJ2YWJsZVxuXG4gIGFycmF5TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCgpOyAvLyBNYXBzIGFycmF5cyBpbiBkYXRhIG9iamVjdCBhbmQgbnVtYmVyIG9mIHR1cGxlIHZhbHVlc1xuICBkYXRhTWFwOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcCgpOyAvLyBNYXBzIHBhdGhzIGluIGZvcm0gZGF0YSB0byBzY2hlbWEgYW5kIGZvcm1Hcm91cCBwYXRoc1xuICBkYXRhUmVjdXJzaXZlUmVmTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpOyAvLyBNYXBzIHJlY3Vyc2l2ZSByZWZlcmVuY2UgcG9pbnRzIGluIGZvcm0gZGF0YVxuICBzY2hlbWFSZWN1cnNpdmVSZWZNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgcmVjdXJzaXZlIHJlZmVyZW5jZSBwb2ludHMgaW4gc2NoZW1hXG4gIHNjaGVtYVJlZkxpYnJhcnk6IGFueSA9IHt9OyAvLyBMaWJyYXJ5IG9mIHNjaGVtYXMgZm9yIHJlc29sdmluZyBzY2hlbWEgJHJlZnNcbiAgbGF5b3V0UmVmTGlicmFyeTogYW55ID0geyAnJzogbnVsbCB9OyAvLyBMaWJyYXJ5IG9mIGxheW91dCBub2RlcyBmb3IgYWRkaW5nIHRvIGZvcm1cbiAgdGVtcGxhdGVSZWZMaWJyYXJ5OiBhbnkgPSB7fTsgLy8gTGlicmFyeSBvZiBmb3JtR3JvdXAgdGVtcGxhdGVzIGZvciBhZGRpbmcgdG8gZm9ybVxuICBoYXNSb290UmVmZXJlbmNlID0gZmFsc2U7IC8vIERvZXMgdGhlIGZvcm0gaW5jbHVkZSBhIHJlY3Vyc2l2ZSByZWZlcmVuY2UgdG8gaXRzZWxmP1xuXG4gIGxhbmd1YWdlID0gJ2VuLVVTJzsgLy8gRG9lcyB0aGUgZm9ybSBpbmNsdWRlIGEgcmVjdXJzaXZlIHJlZmVyZW5jZSB0byBpdHNlbGY/XG5cbiAgLy8gRGVmYXVsdCBnbG9iYWwgZm9ybSBvcHRpb25zXG4gIGRlZmF1bHRGb3JtT3B0aW9uczogYW55ID0ge1xuICAgIGFkZFN1Ym1pdDogJ2F1dG8nLCAvLyBBZGQgYSBzdWJtaXQgYnV0dG9uIGlmIGxheW91dCBkb2VzIG5vdCBoYXZlIG9uZT9cbiAgICAgIC8vIGZvciBhZGRTdWJtaXQ6IHRydWUgPSBhbHdheXMsIGZhbHNlID0gbmV2ZXIsXG4gICAgICAvLyAnYXV0bycgPSBvbmx5IGlmIGxheW91dCBpcyB1bmRlZmluZWQgKGZvcm0gaXMgYnVpbHQgZnJvbSBzY2hlbWEgYWxvbmUpXG4gICAgZGVidWc6IGZhbHNlLCAvLyBTaG93IGRlYnVnZ2luZyBvdXRwdXQ/XG4gICAgZGlzYWJsZUludmFsaWRTdWJtaXQ6IHRydWUsIC8vIERpc2FibGUgc3VibWl0IGlmIGZvcm0gaW52YWxpZD9cbiAgICBmb3JtRGlzYWJsZWQ6IGZhbHNlLCAvLyBTZXQgZW50aXJlIGZvcm0gYXMgZGlzYWJsZWQ/IChub3QgZWRpdGFibGUsIGFuZCBkaXNhYmxlcyBvdXRwdXRzKVxuICAgIGZvcm1SZWFkb25seTogZmFsc2UsIC8vIFNldCBlbnRpcmUgZm9ybSBhcyByZWFkIG9ubHk/IChub3QgZWRpdGFibGUsIGJ1dCBvdXRwdXRzIHN0aWxsIGVuYWJsZWQpXG4gICAgZmllbGRzUmVxdWlyZWQ6IGZhbHNlLCAvLyAoc2V0IGF1dG9tYXRpY2FsbHkpIEFyZSB0aGVyZSBhbnkgcmVxdWlyZWQgZmllbGRzIGluIHRoZSBmb3JtP1xuICAgIGZyYW1ld29yazogJ25vLWZyYW1ld29yaycsIC8vIFRoZSBmcmFtZXdvcmsgdG8gbG9hZFxuICAgIGxvYWRFeHRlcm5hbEFzc2V0czogZmFsc2UsIC8vIExvYWQgZXh0ZXJuYWwgY3NzIGFuZCBKYXZhU2NyaXB0IGZvciBmcmFtZXdvcms/XG4gICAgcHJpc3RpbmU6IHsgZXJyb3JzOiB0cnVlLCBzdWNjZXNzOiB0cnVlIH0sXG4gICAgc3VwcmVzc1Byb3BlcnR5VGl0bGVzOiBmYWxzZSxcbiAgICBzZXRTY2hlbWFEZWZhdWx0czogJ2F1dG8nLCAvLyBTZXQgZmVmYXVsdCB2YWx1ZXMgZnJvbSBzY2hlbWE/XG4gICAgICAvLyB0cnVlID0gYWx3YXlzIHNldCAodW5sZXNzIG92ZXJyaWRkZW4gYnkgbGF5b3V0IGRlZmF1bHQgb3IgZm9ybVZhbHVlcylcbiAgICAgIC8vIGZhbHNlID0gbmV2ZXIgc2V0XG4gICAgICAvLyAnYXV0bycgPSBzZXQgaW4gYWRkYWJsZSBjb21wb25lbnRzLCBhbmQgZXZlcnl3aGVyZSBpZiBmb3JtVmFsdWVzIG5vdCBzZXRcbiAgICBzZXRMYXlvdXREZWZhdWx0czogJ2F1dG8nLCAvLyBTZXQgZmVmYXVsdCB2YWx1ZXMgZnJvbSBsYXlvdXQ/XG4gICAgICAvLyB0cnVlID0gYWx3YXlzIHNldCAodW5sZXNzIG92ZXJyaWRkZW4gYnkgZm9ybVZhbHVlcylcbiAgICAgIC8vIGZhbHNlID0gbmV2ZXIgc2V0XG4gICAgICAvLyAnYXV0bycgPSBzZXQgaW4gYWRkYWJsZSBjb21wb25lbnRzLCBhbmQgZXZlcnl3aGVyZSBpZiBmb3JtVmFsdWVzIG5vdCBzZXRcbiAgICB2YWxpZGF0ZU9uUmVuZGVyOiAnYXV0bycsIC8vIFZhbGlkYXRlIGZpZWxkcyBpbW1lZGlhdGVseSwgYmVmb3JlIHRoZXkgYXJlIHRvdWNoZWQ/XG4gICAgICAvLyB0cnVlID0gdmFsaWRhdGUgYWxsIGZpZWxkcyBpbW1lZGlhdGVseVxuICAgICAgLy8gZmFsc2UgPSBvbmx5IHZhbGlkYXRlIGZpZWxkcyBhZnRlciB0aGV5IGFyZSB0b3VjaGVkIGJ5IHVzZXJcbiAgICAgIC8vICdhdXRvJyA9IHZhbGlkYXRlIGZpZWxkcyB3aXRoIHZhbHVlcyBpbW1lZGlhdGVseSwgZW1wdHkgZmllbGRzIGFmdGVyIHRoZXkgYXJlIHRvdWNoZWRcbiAgICB3aWRnZXRzOiB7fSwgLy8gQW55IGN1c3RvbSB3aWRnZXRzIHRvIGxvYWRcbiAgICBkZWZhdXRXaWRnZXRPcHRpb25zOiB7IC8vIERlZmF1bHQgb3B0aW9ucyBmb3IgZm9ybSBjb250cm9sIHdpZGdldHNcbiAgICAgIGxpc3RJdGVtczogMSwgLy8gTnVtYmVyIG9mIGxpc3QgaXRlbXMgdG8gaW5pdGlhbGx5IGFkZCB0byBhcnJheXMgd2l0aCBubyBkZWZhdWx0IHZhbHVlXG4gICAgICBhZGRhYmxlOiB0cnVlLCAvLyBBbGxvdyBhZGRpbmcgaXRlbXMgdG8gYW4gYXJyYXkgb3IgJHJlZiBwb2ludD9cbiAgICAgIG9yZGVyYWJsZTogdHJ1ZSwgLy8gQWxsb3cgcmVvcmRlcmluZyBpdGVtcyB3aXRoaW4gYW4gYXJyYXk/XG4gICAgICByZW1vdmFibGU6IHRydWUsIC8vIEFsbG93IHJlbW92aW5nIGl0ZW1zIGZyb20gYW4gYXJyYXkgb3IgJHJlZiBwb2ludD9cbiAgICAgIGVuYWJsZUVycm9yU3RhdGU6IHRydWUsIC8vIEFwcGx5ICdoYXMtZXJyb3InIGNsYXNzIHdoZW4gZmllbGQgZmFpbHMgdmFsaWRhdGlvbj9cbiAgICAgIC8vIGRpc2FibGVFcnJvclN0YXRlOiBmYWxzZSwgLy8gRG9uJ3QgYXBwbHkgJ2hhcy1lcnJvcicgY2xhc3Mgd2hlbiBmaWVsZCBmYWlscyB2YWxpZGF0aW9uP1xuICAgICAgZW5hYmxlU3VjY2Vzc1N0YXRlOiB0cnVlLCAvLyBBcHBseSAnaGFzLXN1Y2Nlc3MnIGNsYXNzIHdoZW4gZmllbGQgdmFsaWRhdGVzP1xuICAgICAgLy8gZGlzYWJsZVN1Y2Nlc3NTdGF0ZTogZmFsc2UsIC8vIERvbid0IGFwcGx5ICdoYXMtc3VjY2VzcycgY2xhc3Mgd2hlbiBmaWVsZCB2YWxpZGF0ZXM/XG4gICAgICBmZWVkYmFjazogZmFsc2UsIC8vIFNob3cgaW5saW5lIGZlZWRiYWNrIGljb25zP1xuICAgICAgZmVlZGJhY2tPblJlbmRlcjogZmFsc2UsIC8vIFNob3cgZXJyb3JNZXNzYWdlIG9uIFJlbmRlcj9cbiAgICAgIG5vdGl0bGU6IGZhbHNlLCAvLyBIaWRlIHRpdGxlP1xuICAgICAgZGlzYWJsZWQ6IGZhbHNlLCAvLyBTZXQgY29udHJvbCBhcyBkaXNhYmxlZD8gKG5vdCBlZGl0YWJsZSwgYW5kIGV4Y2x1ZGVkIGZyb20gb3V0cHV0KVxuICAgICAgcmVhZG9ubHk6IGZhbHNlLCAvLyBTZXQgY29udHJvbCBhcyByZWFkIG9ubHk/IChub3QgZWRpdGFibGUsIGJ1dCBpbmNsdWRlZCBpbiBvdXRwdXQpXG4gICAgICByZXR1cm5FbXB0eUZpZWxkczogdHJ1ZSwgLy8gcmV0dXJuIHZhbHVlcyBmb3IgZmllbGRzIHRoYXQgY29udGFpbiBubyBkYXRhP1xuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2VzOiB7fSAvLyBzZXQgYnkgc2V0TGFuZ3VhZ2UoKVxuICAgIH0sXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZXRMYW5ndWFnZSh0aGlzLmxhbmd1YWdlKTtcbiAgfVxuXG4gIHNldExhbmd1YWdlKGxhbmd1YWdlOiBzdHJpbmcgPSAnZW4tVVMnKSB7XG4gICAgdGhpcy5sYW5ndWFnZSA9IGxhbmd1YWdlO1xuICAgIGNvbnN0IHZhbGlkYXRpb25NZXNzYWdlcyA9IGxhbmd1YWdlLnNsaWNlKDAsIDIpID09PSAnZnInID9cbiAgICAgIGZyVmFsaWRhdGlvbk1lc3NhZ2VzIDogZW5WYWxpZGF0aW9uTWVzc2FnZXM7XG4gICAgdGhpcy5kZWZhdWx0Rm9ybU9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucy52YWxpZGF0aW9uTWVzc2FnZXMgPVxuICAgICAgXy5jbG9uZURlZXAodmFsaWRhdGlvbk1lc3NhZ2VzKTtcbiAgfVxuXG4gIGdldERhdGEoKSB7IHJldHVybiB0aGlzLmRhdGE7IH1cblxuICBnZXRTY2hlbWEoKSB7IHJldHVybiB0aGlzLnNjaGVtYTsgfVxuXG4gIGdldExheW91dCgpIHsgcmV0dXJuIHRoaXMubGF5b3V0OyB9XG5cbiAgcmVzZXRBbGxWYWx1ZXMoKSB7XG4gICAgdGhpcy5Kc29uRm9ybUNvbXBhdGliaWxpdHkgPSBmYWxzZTtcbiAgICB0aGlzLlJlYWN0SnNvblNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gICAgdGhpcy5Bbmd1bGFyU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSBmYWxzZTtcbiAgICB0aGlzLnRwbGRhdGEgPSB7fTtcbiAgICB0aGlzLnZhbGlkYXRlRm9ybURhdGEgPSBudWxsO1xuICAgIHRoaXMuZm9ybVZhbHVlcyA9IHt9O1xuICAgIHRoaXMuc2NoZW1hID0ge307XG4gICAgdGhpcy5sYXlvdXQgPSBbXTtcbiAgICB0aGlzLmZvcm1Hcm91cFRlbXBsYXRlID0ge307XG4gICAgdGhpcy5mb3JtR3JvdXAgPSBudWxsO1xuICAgIHRoaXMuZnJhbWV3b3JrID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICB0aGlzLnZhbGlkRGF0YSA9IG51bGw7XG4gICAgdGhpcy5pc1ZhbGlkID0gbnVsbDtcbiAgICB0aGlzLnZhbGlkYXRpb25FcnJvcnMgPSBudWxsO1xuICAgIHRoaXMuYXJyYXlNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5kYXRhTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZGF0YVJlY3Vyc2l2ZVJlZk1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxheW91dFJlZkxpYnJhcnkgPSB7fTtcbiAgICB0aGlzLnNjaGVtYVJlZkxpYnJhcnkgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlUmVmTGlicmFyeSA9IHt9O1xuICAgIHRoaXMuZm9ybU9wdGlvbnMgPSBfLmNsb25lRGVlcCh0aGlzLmRlZmF1bHRGb3JtT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogJ2J1aWxkUmVtb3RlRXJyb3InIGZ1bmN0aW9uXG4gICAqXG4gICAqIEV4YW1wbGUgZXJyb3JzOlxuICAgKiB7XG4gICAqICAgbGFzdF9uYW1lOiBbIHtcbiAgICogICAgIG1lc3NhZ2U6ICdMYXN0IG5hbWUgbXVzdCBieSBzdGFydCB3aXRoIGNhcGl0YWwgbGV0dGVyLicsXG4gICAqICAgICBjb2RlOiAnY2FwaXRhbF9sZXR0ZXInXG4gICAqICAgfSBdLFxuICAgKiAgIGVtYWlsOiBbIHtcbiAgICogICAgIG1lc3NhZ2U6ICdFbWFpbCBtdXN0IGJlIGZyb20gZXhhbXBsZS5jb20gZG9tYWluLicsXG4gICAqICAgICBjb2RlOiAnc3BlY2lhbF9kb21haW4nXG4gICAqICAgfSwge1xuICAgKiAgICAgbWVzc2FnZTogJ0VtYWlsIG11c3QgY29udGFpbiBhbiBAIHN5bWJvbC4nLFxuICAgKiAgICAgY29kZTogJ2F0X3N5bWJvbCdcbiAgICogICB9IF1cbiAgICogfVxuICAgKiAvL3tFcnJvck1lc3NhZ2VzfSBlcnJvcnNcbiAgICovXG4gIGJ1aWxkUmVtb3RlRXJyb3IoZXJyb3JzOiBFcnJvck1lc3NhZ2VzKSB7XG4gICAgZm9yRWFjaChlcnJvcnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBpZiAoa2V5IGluIHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzKSB7XG4gICAgICAgIGZvciAoY29uc3QgZXJyb3Igb2YgdmFsdWUpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSB7fTtcbiAgICAgICAgICBlcnJbZXJyb3JbJ2NvZGUnXV0gPSBlcnJvclsnbWVzc2FnZSddO1xuICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmdldChrZXkpLnNldEVycm9ycyhlcnIsIHsgZW1pdEV2ZW50OiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YWxpZGF0ZURhdGEobmV3VmFsdWU6IGFueSwgdXBkYXRlU3Vic2NyaXB0aW9ucyA9IHRydWUpOiB2b2lkIHtcblxuICAgIC8vIEZvcm1hdCByYXcgZm9ybSBkYXRhIHRvIGNvcnJlY3QgZGF0YSB0eXBlc1xuICAgIHRoaXMuZGF0YSA9IGZvcm1hdEZvcm1EYXRhKFxuICAgICAgbmV3VmFsdWUsIHRoaXMuZGF0YU1hcCwgdGhpcy5kYXRhUmVjdXJzaXZlUmVmTWFwLFxuICAgICAgdGhpcy5hcnJheU1hcCwgdGhpcy5mb3JtT3B0aW9ucy5yZXR1cm5FbXB0eUZpZWxkc1xuICAgICk7XG4gICAgdGhpcy5pc1ZhbGlkID0gdGhpcy52YWxpZGF0ZUZvcm1EYXRhKHRoaXMuZGF0YSk7XG4gICAgdGhpcy52YWxpZERhdGEgPSB0aGlzLmlzVmFsaWQgPyB0aGlzLmRhdGEgOiBudWxsO1xuICAgIGNvbnN0IGNvbXBpbGVFcnJvcnMgPSBlcnJvcnMgPT4ge1xuICAgICAgY29uc3QgY29tcGlsZWRFcnJvcnMgPSB7fTtcbiAgICAgIChlcnJvcnMgfHwgW10pLmZvckVhY2goZXJyb3IgPT4ge1xuICAgICAgICBpZiAoIWNvbXBpbGVkRXJyb3JzW2Vycm9yLmRhdGFQYXRoXSkgeyBjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0gPSBbXTsgfVxuICAgICAgICBjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0ucHVzaChlcnJvci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbXBpbGVkRXJyb3JzO1xuICAgIH07XG4gICAgdGhpcy5hanZFcnJvcnMgPSB0aGlzLnZhbGlkYXRlRm9ybURhdGEuZXJyb3JzO1xuICAgIHRoaXMudmFsaWRhdGlvbkVycm9ycyA9IGNvbXBpbGVFcnJvcnModGhpcy52YWxpZGF0ZUZvcm1EYXRhLmVycm9ycyk7XG4gICAgaWYgKHVwZGF0ZVN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZGF0YUNoYW5nZXMubmV4dCh0aGlzLmRhdGEpO1xuICAgICAgdGhpcy5pc1ZhbGlkQ2hhbmdlcy5uZXh0KHRoaXMuaXNWYWxpZCk7XG4gICAgICB0aGlzLnZhbGlkYXRpb25FcnJvckNoYW5nZXMubmV4dCh0aGlzLmFqdkVycm9ycyk7XG4gICAgfVxuICB9XG5cbiAgYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShmb3JtVmFsdWVzOiBhbnkgPSBudWxsLCBzZXRWYWx1ZXMgPSB0cnVlKSB7XG4gICAgdGhpcy5mb3JtR3JvdXBUZW1wbGF0ZSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUodGhpcywgZm9ybVZhbHVlcywgc2V0VmFsdWVzKTtcbiAgfVxuXG4gIGJ1aWxkRm9ybUdyb3VwKCkge1xuICAgIHRoaXMuZm9ybUdyb3VwID0gPEZvcm1Hcm91cD5idWlsZEZvcm1Hcm91cCh0aGlzLmZvcm1Hcm91cFRlbXBsYXRlKTtcbiAgICBpZiAodGhpcy5mb3JtR3JvdXApIHtcbiAgICAgIHRoaXMuY29tcGlsZUFqdlNjaGVtYSgpO1xuICAgICAgdGhpcy52YWxpZGF0ZURhdGEodGhpcy5mb3JtR3JvdXAudmFsdWUpO1xuXG4gICAgICAvLyBTZXQgdXAgb2JzZXJ2YWJsZXMgdG8gZW1pdCBkYXRhIGFuZCB2YWxpZGF0aW9uIGluZm8gd2hlbiBmb3JtIGRhdGEgY2hhbmdlc1xuICAgICAgaWYgKHRoaXMuZm9ybVZhbHVlU3Vic2NyaXB0aW9uKSB7IHRoaXMuZm9ybVZhbHVlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7IH1cbiAgICAgIHRoaXMuZm9ybVZhbHVlU3Vic2NyaXB0aW9uID0gdGhpcy5mb3JtR3JvdXAudmFsdWVDaGFuZ2VzXG4gICAgICAgIC5zdWJzY3JpYmUoZm9ybVZhbHVlID0+IHRoaXMudmFsaWRhdGVEYXRhKGZvcm1WYWx1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIGJ1aWxkTGF5b3V0KHdpZGdldExpYnJhcnk6IGFueSkge1xuICAgIHRoaXMubGF5b3V0ID0gYnVpbGRMYXlvdXQodGhpcywgd2lkZ2V0TGlicmFyeSk7XG4gIH1cblxuICBzZXRPcHRpb25zKG5ld09wdGlvbnM6IGFueSkge1xuICAgIGlmIChpc09iamVjdChuZXdPcHRpb25zKSkge1xuICAgICAgY29uc3QgYWRkT3B0aW9ucyA9IF8uY2xvbmVEZWVwKG5ld09wdGlvbnMpO1xuICAgICAgLy8gQmFja3dhcmQgY29tcGF0aWJpbGl0eSBmb3IgJ2RlZmF1bHRPcHRpb25zJyAocmVuYW1lZCAnZGVmYXV0V2lkZ2V0T3B0aW9ucycpXG4gICAgICBpZiAoaXNPYmplY3QoYWRkT3B0aW9ucy5kZWZhdWx0T3B0aW9ucykpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmZvcm1PcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMsIGFkZE9wdGlvbnMuZGVmYXVsdE9wdGlvbnMpO1xuICAgICAgICBkZWxldGUgYWRkT3B0aW9ucy5kZWZhdWx0T3B0aW9ucztcbiAgICAgIH1cbiAgICAgIGlmIChpc09iamVjdChhZGRPcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMpKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5mb3JtT3B0aW9ucy5kZWZhdXRXaWRnZXRPcHRpb25zLCBhZGRPcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMpO1xuICAgICAgICBkZWxldGUgYWRkT3B0aW9ucy5kZWZhdXRXaWRnZXRPcHRpb25zO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmZvcm1PcHRpb25zLCBhZGRPcHRpb25zKTtcblxuICAgICAgLy8gY29udmVydCBkaXNhYmxlRXJyb3JTdGF0ZSAvIGRpc2FibGVTdWNjZXNzU3RhdGUgdG8gZW5hYmxlLi4uXG4gICAgICBjb25zdCBnbG9iYWxEZWZhdWx0cyA9IHRoaXMuZm9ybU9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucztcbiAgICAgIFsnRXJyb3JTdGF0ZScsICdTdWNjZXNzU3RhdGUnXVxuICAgICAgICAuZmlsdGVyKHN1ZmZpeCA9PiBoYXNPd24oZ2xvYmFsRGVmYXVsdHMsICdkaXNhYmxlJyArIHN1ZmZpeCkpXG4gICAgICAgIC5mb3JFYWNoKHN1ZmZpeCA9PiB7XG4gICAgICAgICAgZ2xvYmFsRGVmYXVsdHNbJ2VuYWJsZScgKyBzdWZmaXhdID0gIWdsb2JhbERlZmF1bHRzWydkaXNhYmxlJyArIHN1ZmZpeF07XG4gICAgICAgICAgZGVsZXRlIGdsb2JhbERlZmF1bHRzWydkaXNhYmxlJyArIHN1ZmZpeF07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBpbGVBanZTY2hlbWEoKSB7XG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlRm9ybURhdGEpIHtcblxuICAgICAgLy8gaWYgJ3VpOm9yZGVyJyBleGlzdHMgaW4gcHJvcGVydGllcywgbW92ZSBpdCB0byByb290IGJlZm9yZSBjb21waWxpbmcgd2l0aCBhanZcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2NoZW1hLnByb3BlcnRpZXNbJ3VpOm9yZGVyJ10pKSB7XG4gICAgICAgIHRoaXMuc2NoZW1hWyd1aTpvcmRlciddID0gdGhpcy5zY2hlbWEucHJvcGVydGllc1sndWk6b3JkZXInXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuc2NoZW1hLnByb3BlcnRpZXNbJ3VpOm9yZGVyJ107XG4gICAgICB9XG4gICAgICB0aGlzLmFqdi5yZW1vdmVTY2hlbWEodGhpcy5zY2hlbWEpO1xuICAgICAgdGhpcy52YWxpZGF0ZUZvcm1EYXRhID0gdGhpcy5hanYuY29tcGlsZSh0aGlzLnNjaGVtYSk7XG4gICAgfVxuICB9XG5cbiAgYnVpbGRTY2hlbWFGcm9tRGF0YShkYXRhPzogYW55LCByZXF1aXJlQWxsRmllbGRzID0gZmFsc2UpOiBhbnkge1xuICAgIGlmIChkYXRhKSB7IHJldHVybiBidWlsZFNjaGVtYUZyb21EYXRhKGRhdGEsIHJlcXVpcmVBbGxGaWVsZHMpOyB9XG4gICAgdGhpcy5zY2hlbWEgPSBidWlsZFNjaGVtYUZyb21EYXRhKHRoaXMuZm9ybVZhbHVlcywgcmVxdWlyZUFsbEZpZWxkcyk7XG4gIH1cblxuICBidWlsZFNjaGVtYUZyb21MYXlvdXQobGF5b3V0PzogYW55KTogYW55IHtcbiAgICBpZiAobGF5b3V0KSB7IHJldHVybiBidWlsZFNjaGVtYUZyb21MYXlvdXQobGF5b3V0KTsgfVxuICAgIHRoaXMuc2NoZW1hID0gYnVpbGRTY2hlbWFGcm9tTGF5b3V0KHRoaXMubGF5b3V0KTtcbiAgfVxuXG5cbiAgc2V0VHBsZGF0YShuZXdUcGxkYXRhOiBhbnkgPSB7fSk6IHZvaWQge1xuICAgIHRoaXMudHBsZGF0YSA9IG5ld1RwbGRhdGE7XG4gIH1cblxuICBwYXJzZVRleHQoXG4gICAgdGV4dCA9ICcnLCB2YWx1ZTogYW55ID0ge30sIHZhbHVlczogYW55ID0ge30sIGtleTogbnVtYmVyfHN0cmluZyA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICBpZiAoIXRleHQgfHwgIS97ey4rP319Ly50ZXN0KHRleHQpKSB7IHJldHVybiB0ZXh0OyB9XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgve3soLis/KX19L2csICguLi5hKSA9PlxuICAgICAgdGhpcy5wYXJzZUV4cHJlc3Npb24oYVsxXSwgdmFsdWUsIHZhbHVlcywga2V5LCB0aGlzLnRwbGRhdGEpXG4gICAgKTtcbiAgfVxuXG4gIHBhcnNlRXhwcmVzc2lvbihcbiAgICBleHByZXNzaW9uID0gJycsIHZhbHVlOiBhbnkgPSB7fSwgdmFsdWVzOiBhbnkgPSB7fSxcbiAgICBrZXk6IG51bWJlcnxzdHJpbmcgPSBudWxsLCB0cGxkYXRhOiBhbnkgPSBudWxsXG4gICkge1xuICAgIGlmICh0eXBlb2YgZXhwcmVzc2lvbiAhPT0gJ3N0cmluZycpIHsgcmV0dXJuICcnOyB9XG4gICAgY29uc3QgaW5kZXggPSB0eXBlb2Yga2V5ID09PSAnbnVtYmVyJyA/IChrZXkgKyAxKSArICcnIDogKGtleSB8fCAnJyk7XG4gICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udHJpbSgpO1xuICAgIGlmICgoZXhwcmVzc2lvblswXSA9PT0gXCInXCIgfHwgZXhwcmVzc2lvblswXSA9PT0gJ1wiJykgJiZcbiAgICAgIGV4cHJlc3Npb25bMF0gPT09IGV4cHJlc3Npb25bZXhwcmVzc2lvbi5sZW5ndGggLSAxXSAmJlxuICAgICAgZXhwcmVzc2lvbi5zbGljZSgxLCBleHByZXNzaW9uLmxlbmd0aCAtIDEpLmluZGV4T2YoZXhwcmVzc2lvblswXSkgPT09IC0xXG4gICAgKSB7XG4gICAgICByZXR1cm4gZXhwcmVzc2lvbi5zbGljZSgxLCBleHByZXNzaW9uLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gJ2lkeCcgfHwgZXhwcmVzc2lvbiA9PT0gJyRpbmRleCcpIHsgcmV0dXJuIGluZGV4OyB9XG4gICAgaWYgKGV4cHJlc3Npb24gPT09ICd2YWx1ZScgJiYgIWhhc093bih2YWx1ZXMsICd2YWx1ZScpKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgIGlmIChbJ1wiJywgXCInXCIsICcgJywgJ3x8JywgJyYmJywgJysnXS5ldmVyeShkZWxpbSA9PiBleHByZXNzaW9uLmluZGV4T2YoZGVsaW0pID09PSAtMSkpIHtcbiAgICAgIGNvbnN0IHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZU9iamVjdFBhdGgoZXhwcmVzc2lvbik7XG4gICAgICByZXR1cm4gcG9pbnRlclswXSA9PT0gJ3ZhbHVlJyAmJiBKc29uUG9pbnRlci5oYXModmFsdWUsIHBvaW50ZXIuc2xpY2UoMSkpID9cbiAgICAgICAgICBKc29uUG9pbnRlci5nZXQodmFsdWUsIHBvaW50ZXIuc2xpY2UoMSkpIDpcbiAgICAgICAgcG9pbnRlclswXSA9PT0gJ3ZhbHVlcycgJiYgSnNvblBvaW50ZXIuaGFzKHZhbHVlcywgcG9pbnRlci5zbGljZSgxKSkgP1xuICAgICAgICAgIEpzb25Qb2ludGVyLmdldCh2YWx1ZXMsIHBvaW50ZXIuc2xpY2UoMSkpIDpcbiAgICAgICAgcG9pbnRlclswXSA9PT0gJ3RwbGRhdGEnICYmIEpzb25Qb2ludGVyLmhhcyh0cGxkYXRhLCBwb2ludGVyLnNsaWNlKDEpKSA/XG4gICAgICAgICAgSnNvblBvaW50ZXIuZ2V0KHRwbGRhdGEsIHBvaW50ZXIuc2xpY2UoMSkpIDpcbiAgICAgICAgSnNvblBvaW50ZXIuaGFzKHZhbHVlcywgcG9pbnRlcikgPyBKc29uUG9pbnRlci5nZXQodmFsdWVzLCBwb2ludGVyKSA6ICcnO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCdbaWR4XScpID4gLTEpIHtcbiAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UoL1xcW2lkeFxcXS9nLCA8c3RyaW5nPmluZGV4KTtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24uaW5kZXhPZignWyRpbmRleF0nKSA+IC0xKSB7XG4gICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5yZXBsYWNlKC9cXFskaW5kZXhcXF0vZywgPHN0cmluZz5pbmRleCk7XG4gICAgfVxuICAgIC8vIFRPRE86IEltcHJvdmUgZXhwcmVzc2lvbiBldmFsdWF0aW9uIGJ5IHBhcnNpbmcgcXVvdGVkIHN0cmluZ3MgZmlyc3RcbiAgICAvLyBsZXQgZXhwcmVzc2lvbkFycmF5ID0gZXhwcmVzc2lvbi5tYXRjaCgvKFteXCInXSt8XCJbXlwiXStcInwnW14nXSsnKS9nKTtcbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCd8fCcpID4gLTEpIHtcbiAgICAgIHJldHVybiBleHByZXNzaW9uLnNwbGl0KCd8fCcpLnJlZHVjZSgoYWxsLCB0ZXJtKSA9PlxuICAgICAgICBhbGwgfHwgdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSwgJydcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoJyYmJykgPiAtMSkge1xuICAgICAgcmV0dXJuIGV4cHJlc3Npb24uc3BsaXQoJyYmJykucmVkdWNlKChhbGwsIHRlcm0pID0+XG4gICAgICAgIGFsbCAmJiB0aGlzLnBhcnNlRXhwcmVzc2lvbih0ZXJtLCB2YWx1ZSwgdmFsdWVzLCBrZXksIHRwbGRhdGEpLCAnICdcbiAgICAgICkudHJpbSgpO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCcrJykgPiAtMSkge1xuICAgICAgcmV0dXJuIGV4cHJlc3Npb24uc3BsaXQoJysnKVxuICAgICAgICAubWFwKHRlcm0gPT4gdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBzZXRBcnJheUl0ZW1UaXRsZShcbiAgICBwYXJlbnRDdHg6IGFueSA9IHt9LCBjaGlsZE5vZGU6IGFueSA9IG51bGwsIGluZGV4OiBudW1iZXIgPSBudWxsXG4gICk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHBhcmVudEN0eC5sYXlvdXROb2RlO1xuICAgIGNvbnN0IHBhcmVudFZhbHVlczogYW55ID0gdGhpcy5nZXRGb3JtQ29udHJvbFZhbHVlKHBhcmVudEN0eCk7XG4gICAgY29uc3QgaXNBcnJheUl0ZW0gPVxuICAgICAgKHBhcmVudE5vZGUudHlwZSB8fCAnJykuc2xpY2UoLTUpID09PSAnYXJyYXknICYmIGlzQXJyYXkocGFyZW50VmFsdWVzKTtcbiAgICBjb25zdCB0ZXh0ID0gSnNvblBvaW50ZXIuZ2V0Rmlyc3QoXG4gICAgICBpc0FycmF5SXRlbSAmJiBjaGlsZE5vZGUudHlwZSAhPT0gJyRyZWYnID8gW1xuICAgICAgICBbY2hpbGROb2RlLCAnL29wdGlvbnMvbGVnZW5kJ10sXG4gICAgICAgIFtjaGlsZE5vZGUsICcvb3B0aW9ucy90aXRsZSddLFxuICAgICAgICBbcGFyZW50Tm9kZSwgJy9vcHRpb25zL3RpdGxlJ10sXG4gICAgICAgIFtwYXJlbnROb2RlLCAnL29wdGlvbnMvbGVnZW5kJ10sXG4gICAgICBdIDogW1xuICAgICAgICBbY2hpbGROb2RlLCAnL29wdGlvbnMvdGl0bGUnXSxcbiAgICAgICAgW2NoaWxkTm9kZSwgJy9vcHRpb25zL2xlZ2VuZCddLFxuICAgICAgICBbcGFyZW50Tm9kZSwgJy9vcHRpb25zL3RpdGxlJ10sXG4gICAgICAgIFtwYXJlbnROb2RlLCAnL29wdGlvbnMvbGVnZW5kJ11cbiAgICAgIF1cbiAgICApO1xuICAgIGlmICghdGV4dCkgeyByZXR1cm4gdGV4dDsgfVxuICAgIGNvbnN0IGNoaWxkVmFsdWUgPSBpc0FycmF5KHBhcmVudFZhbHVlcykgJiYgaW5kZXggPCBwYXJlbnRWYWx1ZXMubGVuZ3RoID9cbiAgICAgIHBhcmVudFZhbHVlc1tpbmRleF0gOiBwYXJlbnRWYWx1ZXM7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VUZXh0KHRleHQsIGNoaWxkVmFsdWUsIHBhcmVudFZhbHVlcywgaW5kZXgpO1xuICB9XG5cbiAgc2V0SXRlbVRpdGxlKGN0eDogYW55KSB7XG4gICAgcmV0dXJuICFjdHgub3B0aW9ucy50aXRsZSAmJiAvXihcXGQrfC0pJC8udGVzdChjdHgubGF5b3V0Tm9kZS5uYW1lKSA/XG4gICAgICBudWxsIDpcbiAgICAgIHRoaXMucGFyc2VUZXh0KFxuICAgICAgICBjdHgub3B0aW9ucy50aXRsZSB8fCB0b1RpdGxlQ2FzZShjdHgubGF5b3V0Tm9kZS5uYW1lKSxcbiAgICAgICAgdGhpcy5nZXRGb3JtQ29udHJvbFZhbHVlKHRoaXMpLFxuICAgICAgICAodGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKHRoaXMpIHx8IDxhbnk+e30pLnZhbHVlLFxuICAgICAgICBjdHguZGF0YUluZGV4W2N0eC5kYXRhSW5kZXgubGVuZ3RoIC0gMV1cbiAgICAgICk7XG4gIH1cblxuICBldmFsdWF0ZUNvbmRpdGlvbihsYXlvdXROb2RlOiBhbnksIGRhdGFJbmRleDogbnVtYmVyW10pOiBib29sZWFuIHtcbiAgICBjb25zdCBhcnJheUluZGV4ID0gZGF0YUluZGV4ICYmIGRhdGFJbmRleFtkYXRhSW5kZXgubGVuZ3RoIC0gMV07XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKGhhc1ZhbHVlKChsYXlvdXROb2RlLm9wdGlvbnMgfHwge30pLmNvbmRpdGlvbikpIHtcbiAgICAgIGlmICh0eXBlb2YgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbGV0IHBvaW50ZXIgPSBsYXlvdXROb2RlLm9wdGlvbnMuY29uZGl0aW9uXG4gICAgICAgIGlmIChoYXNWYWx1ZShhcnJheUluZGV4KSkge1xuICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyLnJlcGxhY2UoJ1thcnJheUluZGV4XScsIGBbJHthcnJheUluZGV4fV1gKTtcbiAgICAgICAgfVxuICAgICAgICBwb2ludGVyID0gSnNvblBvaW50ZXIucGFyc2VPYmplY3RQYXRoKHBvaW50ZXIpO1xuICAgICAgICByZXN1bHQgPSAhIUpzb25Qb2ludGVyLmdldCh0aGlzLmRhdGEsIHBvaW50ZXIpO1xuICAgICAgICBpZiAoIXJlc3VsdCAmJiBwb2ludGVyWzBdID09PSAnbW9kZWwnKSB7XG4gICAgICAgICAgcmVzdWx0ID0gISFKc29uUG9pbnRlci5nZXQoeyBtb2RlbDogdGhpcy5kYXRhIH0sIHBvaW50ZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsYXlvdXROb2RlLm9wdGlvbnMuY29uZGl0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJlc3VsdCA9IGxheW91dE5vZGUub3B0aW9ucy5jb25kaXRpb24odGhpcy5kYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxheW91dE5vZGUub3B0aW9ucy5jb25kaXRpb24uZnVuY3Rpb25Cb2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGR5bkZuID0gbmV3IEZ1bmN0aW9uKFxuICAgICAgICAgICAgJ21vZGVsJywgJ2FycmF5SW5kaWNlcycsIGxheW91dE5vZGUub3B0aW9ucy5jb25kaXRpb24uZnVuY3Rpb25Cb2R5XG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXN1bHQgPSBkeW5Gbih0aGlzLmRhdGEsIGRhdGFJbmRleCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb25kaXRpb24gZnVuY3Rpb25Cb2R5IGVycm9yZWQgb3V0IG9uIGV2YWx1YXRpb246IFwiICsgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbi5mdW5jdGlvbkJvZHkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpbml0aWFsaXplQ29udHJvbChjdHg6IGFueSwgYmluZCA9IHRydWUpOiBib29sZWFuIHtcbiAgICBpZiAoIWlzT2JqZWN0KGN0eCkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKGlzRW1wdHkoY3R4Lm9wdGlvbnMpKSB7XG4gICAgICBjdHgub3B0aW9ucyA9ICFpc0VtcHR5KChjdHgubGF5b3V0Tm9kZSB8fCB7fSkub3B0aW9ucykgP1xuICAgICAgICBjdHgubGF5b3V0Tm9kZS5vcHRpb25zIDogXy5jbG9uZURlZXAodGhpcy5mb3JtT3B0aW9ucyk7XG4gICAgfVxuICAgIGN0eC5mb3JtQ29udHJvbCA9IHRoaXMuZ2V0Rm9ybUNvbnRyb2woY3R4KTtcbiAgICBjdHguYm91bmRDb250cm9sID0gYmluZCAmJiAhIWN0eC5mb3JtQ29udHJvbDtcbiAgICBpZiAoY3R4LmZvcm1Db250cm9sKSB7XG4gICAgICBjdHguY29udHJvbE5hbWUgPSB0aGlzLmdldEZvcm1Db250cm9sTmFtZShjdHgpO1xuICAgICAgY3R4LmNvbnRyb2xWYWx1ZSA9IGN0eC5mb3JtQ29udHJvbC52YWx1ZTtcbiAgICAgIGN0eC5jb250cm9sRGlzYWJsZWQgPSBjdHguZm9ybUNvbnRyb2wuZGlzYWJsZWQ7XG4gICAgICBjdHgub3B0aW9ucy5lcnJvck1lc3NhZ2UgPSBjdHguZm9ybUNvbnRyb2wuc3RhdHVzID09PSAnVkFMSUQnID8gbnVsbCA6XG4gICAgICAgIHRoaXMuZm9ybWF0RXJyb3JzKGN0eC5mb3JtQ29udHJvbC5lcnJvcnMsIGN0eC5vcHRpb25zLnZhbGlkYXRpb25NZXNzYWdlcyk7XG4gICAgICBjdHgub3B0aW9ucy5zaG93RXJyb3JzID0gdGhpcy5mb3JtT3B0aW9ucy52YWxpZGF0ZU9uUmVuZGVyID09PSB0cnVlIHx8XG4gICAgICAgICh0aGlzLmZvcm1PcHRpb25zLnZhbGlkYXRlT25SZW5kZXIgPT09ICdhdXRvJyAmJiBoYXNWYWx1ZShjdHguY29udHJvbFZhbHVlKSk7XG4gICAgICBjdHguZm9ybUNvbnRyb2wuc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUoc3RhdHVzID0+XG4gICAgICAgIGN0eC5vcHRpb25zLmVycm9yTWVzc2FnZSA9IHN0YXR1cyA9PT0gJ1ZBTElEJyA/IG51bGwgOlxuICAgICAgICAgIHRoaXMuZm9ybWF0RXJyb3JzKGN0eC5mb3JtQ29udHJvbC5lcnJvcnMsIGN0eC5vcHRpb25zLnZhbGlkYXRpb25NZXNzYWdlcylcbiAgICAgICk7XG4gICAgICBjdHguZm9ybUNvbnRyb2wudmFsdWVDaGFuZ2VzLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghXy5pc0VxdWFsKGN0eC5jb250cm9sVmFsdWUsIHZhbHVlKSkgeyBjdHguY29udHJvbFZhbHVlID0gdmFsdWUgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5jb250cm9sTmFtZSA9IGN0eC5sYXlvdXROb2RlLm5hbWU7XG4gICAgICBjdHguY29udHJvbFZhbHVlID0gY3R4LmxheW91dE5vZGUudmFsdWUgfHwgbnVsbDtcbiAgICAgIGNvbnN0IGRhdGFQb2ludGVyID0gdGhpcy5nZXREYXRhUG9pbnRlcihjdHgpO1xuICAgICAgaWYgKGJpbmQgJiYgZGF0YVBvaW50ZXIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgd2FybmluZzogY29udHJvbCBcIiR7ZGF0YVBvaW50ZXJ9XCIgaXMgbm90IGJvdW5kIHRvIHRoZSBBbmd1bGFyIEZvcm1Hcm91cC5gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGN0eC5ib3VuZENvbnRyb2w7XG4gIH1cblxuICBmb3JtYXRFcnJvcnMoZXJyb3JzOiBhbnksIHZhbGlkYXRpb25NZXNzYWdlczogYW55ID0ge30pOiBzdHJpbmcge1xuICAgIGlmIChpc0VtcHR5KGVycm9ycykpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAoIWlzT2JqZWN0KHZhbGlkYXRpb25NZXNzYWdlcykpIHsgdmFsaWRhdGlvbk1lc3NhZ2VzID0ge307IH1cbiAgICBjb25zdCBhZGRTcGFjZXMgPSBzdHJpbmcgPT4gc3RyaW5nWzBdLnRvVXBwZXJDYXNlKCkgKyAoc3RyaW5nLnNsaWNlKDEpIHx8ICcnKVxuICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpLnJlcGxhY2UoL18vZywgJyAnKTtcbiAgICBjb25zdCBmb3JtYXRFcnJvciA9IChlcnJvcikgPT4gdHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyA/XG4gICAgICBPYmplY3Qua2V5cyhlcnJvcikubWFwKGtleSA9PlxuICAgICAgICBlcnJvcltrZXldID09PSB0cnVlID8gYWRkU3BhY2VzKGtleSkgOlxuICAgICAgICBlcnJvcltrZXldID09PSBmYWxzZSA/ICdOb3QgJyArIGFkZFNwYWNlcyhrZXkpIDpcbiAgICAgICAgYWRkU3BhY2VzKGtleSkgKyAnOiAnICsgZm9ybWF0RXJyb3IoZXJyb3Jba2V5XSlcbiAgICAgICkuam9pbignLCAnKSA6XG4gICAgICBhZGRTcGFjZXMoZXJyb3IudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZXJyb3JzKVxuICAgICAgLy8gSGlkZSAncmVxdWlyZWQnIGVycm9yLCB1bmxlc3MgaXQgaXMgdGhlIG9ubHkgb25lXG4gICAgICAuZmlsdGVyKGVycm9yS2V5ID0+IGVycm9yS2V5ICE9PSAncmVxdWlyZWQnIHx8IE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID09PSAxKVxuICAgICAgLm1hcChlcnJvcktleSA9PlxuICAgICAgICAvLyBJZiB2YWxpZGF0aW9uTWVzc2FnZXMgaXMgYSBzdHJpbmcsIHJldHVybiBpdFxuICAgICAgICB0eXBlb2YgdmFsaWRhdGlvbk1lc3NhZ2VzID09PSAnc3RyaW5nJyA/IHZhbGlkYXRpb25NZXNzYWdlcyA6XG4gICAgICAgIC8vIElmIGN1c3RvbSBlcnJvciBtZXNzYWdlIGlzIGEgZnVuY3Rpb24sIHJldHVybiBmdW5jdGlvbiByZXN1bHRcbiAgICAgICAgdHlwZW9mIHZhbGlkYXRpb25NZXNzYWdlc1tlcnJvcktleV0gPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgIHZhbGlkYXRpb25NZXNzYWdlc1tlcnJvcktleV0oZXJyb3JzW2Vycm9yS2V5XSkgOlxuICAgICAgICAvLyBJZiBjdXN0b20gZXJyb3IgbWVzc2FnZSBpcyBhIHN0cmluZywgcmVwbGFjZSBwbGFjZWhvbGRlcnMgYW5kIHJldHVyblxuICAgICAgICB0eXBlb2YgdmFsaWRhdGlvbk1lc3NhZ2VzW2Vycm9yS2V5XSA9PT0gJ3N0cmluZycgP1xuICAgICAgICAgIC8vIERvZXMgZXJyb3IgbWVzc2FnZSBoYXZlIGFueSB7e3Byb3BlcnR5fX0gcGxhY2Vob2xkZXJzP1xuICAgICAgICAgICEve3suKz99fS8udGVzdCh2YWxpZGF0aW9uTWVzc2FnZXNbZXJyb3JLZXldKSA/XG4gICAgICAgICAgICB2YWxpZGF0aW9uTWVzc2FnZXNbZXJyb3JLZXldIDpcbiAgICAgICAgICAgIC8vIFJlcGxhY2Uge3twcm9wZXJ0eX19IHBsYWNlaG9sZGVycyB3aXRoIHZhbHVlc1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoZXJyb3JzW2Vycm9yS2V5XSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgoZXJyb3JNZXNzYWdlLCBlcnJvclByb3BlcnR5KSA9PiBlcnJvck1lc3NhZ2UucmVwbGFjZShcbiAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKCd7eycgKyBlcnJvclByb3BlcnR5ICsgJ319JywgJ2cnKSxcbiAgICAgICAgICAgICAgICBlcnJvcnNbZXJyb3JLZXldW2Vycm9yUHJvcGVydHldXG4gICAgICAgICAgICAgICksIHZhbGlkYXRpb25NZXNzYWdlc1tlcnJvcktleV0pIDpcbiAgICAgICAgICAvLyBJZiBubyBjdXN0b20gZXJyb3IgbWVzc2FnZSwgcmV0dXJuIGZvcm1hdHRlZCBlcnJvciBkYXRhIGluc3RlYWRcbiAgICAgICAgICBhZGRTcGFjZXMoZXJyb3JLZXkpICsgJyBFcnJvcjogJyArIGZvcm1hdEVycm9yKGVycm9yc1tlcnJvcktleV0pXG4gICAgICApLmpvaW4oJzxicj4nKTtcbiAgfVxuXG4gIHVwZGF0ZVZhbHVlKGN0eDogYW55LCB2YWx1ZTogYW55KTogdm9pZCB7XG5cbiAgICAvLyBTZXQgdmFsdWUgb2YgY3VycmVudCBjb250cm9sXG4gICAgY3R4LmNvbnRyb2xWYWx1ZSA9IHZhbHVlO1xuICAgIGlmIChjdHguYm91bmRDb250cm9sKSB7XG4gICAgICBjdHguZm9ybUNvbnRyb2wuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgY3R4LmZvcm1Db250cm9sLm1hcmtBc0RpcnR5KCk7XG4gICAgfVxuICAgIGN0eC5sYXlvdXROb2RlLnZhbHVlID0gdmFsdWU7XG5cbiAgICAvLyBTZXQgdmFsdWVzIG9mIGFueSByZWxhdGVkIGNvbnRyb2xzIGluIGNvcHlWYWx1ZVRvIGFycmF5XG4gICAgaWYgKGlzQXJyYXkoY3R4Lm9wdGlvbnMuY29weVZhbHVlVG8pKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgY3R4Lm9wdGlvbnMuY29weVZhbHVlVG8pIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0Q29udHJvbCA9IGdldENvbnRyb2wodGhpcy5mb3JtR3JvdXAsIGl0ZW0pO1xuICAgICAgICBpZiAoaXNPYmplY3QodGFyZ2V0Q29udHJvbCkgJiYgdHlwZW9mIHRhcmdldENvbnRyb2wuc2V0VmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0YXJnZXRDb250cm9sLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICB0YXJnZXRDb250cm9sLm1hcmtBc0RpcnR5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVBcnJheUNoZWNrYm94TGlzdChjdHg6IGFueSwgY2hlY2tib3hMaXN0OiBUaXRsZU1hcEl0ZW1bXSk6IHZvaWQge1xuICAgIGNvbnN0IGZvcm1BcnJheSA9IDxGb3JtQXJyYXk+dGhpcy5nZXRGb3JtQ29udHJvbChjdHgpO1xuXG4gICAgLy8gUmVtb3ZlIGFsbCBleGlzdGluZyBpdGVtc1xuICAgIHdoaWxlIChmb3JtQXJyYXkudmFsdWUubGVuZ3RoKSB7IGZvcm1BcnJheS5yZW1vdmVBdCgwKTsgfVxuXG4gICAgLy8gUmUtYWRkIGFuIGl0ZW0gZm9yIGVhY2ggY2hlY2tlZCBib3hcbiAgICBjb25zdCByZWZQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICAgIGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyICsgJy8tJywgdGhpcy5kYXRhUmVjdXJzaXZlUmVmTWFwLCB0aGlzLmFycmF5TWFwXG4gICAgKTtcbiAgICBmb3IgKGNvbnN0IGNoZWNrYm94SXRlbSBvZiBjaGVja2JveExpc3QpIHtcbiAgICAgIGlmIChjaGVja2JveEl0ZW0uY2hlY2tlZCkge1xuICAgICAgICBjb25zdCBuZXdGb3JtQ29udHJvbCA9IGJ1aWxkRm9ybUdyb3VwKHRoaXMudGVtcGxhdGVSZWZMaWJyYXJ5W3JlZlBvaW50ZXJdKTtcbiAgICAgICAgbmV3Rm9ybUNvbnRyb2wuc2V0VmFsdWUoY2hlY2tib3hJdGVtLnZhbHVlKTtcbiAgICAgICAgZm9ybUFycmF5LnB1c2gobmV3Rm9ybUNvbnRyb2wpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3JtQXJyYXkubWFya0FzRGlydHkoKTtcbiAgfVxuXG4gIGdldEZvcm1Db250cm9sKGN0eDogYW55KTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHwgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHxcbiAgICAgIGN0eC5sYXlvdXROb2RlLnR5cGUgPT09ICckcmVmJ1xuICAgICkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiBnZXRDb250cm9sKHRoaXMuZm9ybUdyb3VwLCB0aGlzLmdldERhdGFQb2ludGVyKGN0eCkpO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xWYWx1ZShjdHg6IGFueSk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgaWYgKFxuICAgICAgIWN0eC5sYXlvdXROb2RlIHx8ICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8XG4gICAgICBjdHgubGF5b3V0Tm9kZS50eXBlID09PSAnJHJlZidcbiAgICApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBjb25zdCBjb250cm9sID0gZ2V0Q29udHJvbCh0aGlzLmZvcm1Hcm91cCwgdGhpcy5nZXREYXRhUG9pbnRlcihjdHgpKTtcbiAgICByZXR1cm4gY29udHJvbCA/IGNvbnRyb2wudmFsdWUgOiBudWxsO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHg6IGFueSk6IEZvcm1BcnJheSB8IEZvcm1Hcm91cCB7XG4gICAgaWYgKCFjdHgubGF5b3V0Tm9kZSB8fCAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiBnZXRDb250cm9sKHRoaXMuZm9ybUdyb3VwLCB0aGlzLmdldERhdGFQb2ludGVyKGN0eCksIHRydWUpO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xOYW1lKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHwgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHwgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpXG4gICAgKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIEpzb25Qb2ludGVyLnRvS2V5KHRoaXMuZ2V0RGF0YVBvaW50ZXIoY3R4KSk7XG4gIH1cblxuICBnZXRMYXlvdXRBcnJheShjdHg6IGFueSk6IGFueVtdIHtcbiAgICByZXR1cm4gSnNvblBvaW50ZXIuZ2V0KHRoaXMubGF5b3V0LCB0aGlzLmdldExheW91dFBvaW50ZXIoY3R4KSwgMCwgLTEpO1xuICB9XG5cbiAgZ2V0UGFyZW50Tm9kZShjdHg6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIEpzb25Qb2ludGVyLmdldCh0aGlzLmxheW91dCwgdGhpcy5nZXRMYXlvdXRQb2ludGVyKGN0eCksIDAsIC0yKTtcbiAgfVxuXG4gIGdldERhdGFQb2ludGVyKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHwgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHwgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpXG4gICAgKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIEpzb25Qb2ludGVyLnRvSW5kZXhlZFBvaW50ZXIoXG4gICAgICBjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlciwgY3R4LmRhdGFJbmRleCwgdGhpcy5hcnJheU1hcFxuICAgICk7XG4gIH1cblxuICBnZXRMYXlvdXRQb2ludGVyKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoIWhhc1ZhbHVlKGN0eC5sYXlvdXRJbmRleCkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gJy8nICsgY3R4LmxheW91dEluZGV4LmpvaW4oJy9pdGVtcy8nKTtcbiAgfVxuXG4gIGlzQ29udHJvbEJvdW5kKGN0eDogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKFxuICAgICAgIWN0eC5sYXlvdXROb2RlIHx8ICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8ICFoYXNWYWx1ZShjdHguZGF0YUluZGV4KVxuICAgICkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBjb25zdCBjb250cm9sR3JvdXAgPSB0aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KTtcbiAgICByZXR1cm4gY29udHJvbEdyb3VwID8gaGFzT3duKGNvbnRyb2xHcm91cC5jb250cm9scywgbmFtZSkgOiBmYWxzZTtcbiAgfVxuXG4gIGFkZEl0ZW0oY3R4OiBhbnksIG5hbWU/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHwgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS4kcmVmKSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpIHx8ICFoYXNWYWx1ZShjdHgubGF5b3V0SW5kZXgpXG4gICAgKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IEFuZ3VsYXIgZm9ybSBjb250cm9sIGZyb20gYSB0ZW1wbGF0ZSBpbiB0ZW1wbGF0ZVJlZkxpYnJhcnlcbiAgICBjb25zdCBuZXdGb3JtR3JvdXAgPSBidWlsZEZvcm1Hcm91cCh0aGlzLnRlbXBsYXRlUmVmTGlicmFyeVtjdHgubGF5b3V0Tm9kZS4kcmVmXSk7XG5cbiAgICAvLyBBZGQgdGhlIG5ldyBmb3JtIGNvbnRyb2wgdG8gdGhlIHBhcmVudCBmb3JtQXJyYXkgb3IgZm9ybUdyb3VwXG4gICAgaWYgKGN0eC5sYXlvdXROb2RlLmFycmF5SXRlbSkgeyAvLyBBZGQgbmV3IGFycmF5IGl0ZW0gdG8gZm9ybUFycmF5XG4gICAgICAoPEZvcm1BcnJheT50aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KSkucHVzaChuZXdGb3JtR3JvdXApO1xuICAgIH0gZWxzZSB7IC8vIEFkZCBuZXcgJHJlZiBpdGVtIHRvIGZvcm1Hcm91cFxuICAgICAgKDxGb3JtR3JvdXA+dGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKGN0eCkpXG4gICAgICAgIC5hZGRDb250cm9sKG5hbWUgfHwgdGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KSwgbmV3Rm9ybUdyb3VwKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IGEgbmV3IGxheW91dE5vZGUgZnJvbSBsYXlvdXRSZWZMaWJyYXJ5XG4gICAgY29uc3QgbmV3TGF5b3V0Tm9kZSA9IGdldExheW91dE5vZGUoY3R4LmxheW91dE5vZGUsIHRoaXMpO1xuICAgIG5ld0xheW91dE5vZGUuYXJyYXlJdGVtID0gY3R4LmxheW91dE5vZGUuYXJyYXlJdGVtO1xuICAgIGlmIChjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW1UeXBlKSB7XG4gICAgICBuZXdMYXlvdXROb2RlLmFycmF5SXRlbVR5cGUgPSBjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW1UeXBlO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbmV3TGF5b3V0Tm9kZS5hcnJheUl0ZW1UeXBlO1xuICAgIH1cbiAgICBpZiAobmFtZSkge1xuICAgICAgbmV3TGF5b3V0Tm9kZS5uYW1lID0gbmFtZTtcbiAgICAgIG5ld0xheW91dE5vZGUuZGF0YVBvaW50ZXIgKz0gJy8nICsgSnNvblBvaW50ZXIuZXNjYXBlKG5hbWUpO1xuICAgICAgbmV3TGF5b3V0Tm9kZS5vcHRpb25zLnRpdGxlID0gZml4VGl0bGUobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBuZXcgbGF5b3V0Tm9kZSB0byB0aGUgZm9ybSBsYXlvdXRcbiAgICBKc29uUG9pbnRlci5pbnNlcnQodGhpcy5sYXlvdXQsIHRoaXMuZ2V0TGF5b3V0UG9pbnRlcihjdHgpLCBuZXdMYXlvdXROb2RlKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZUFycmF5SXRlbShjdHg6IGFueSwgb2xkSW5kZXg6IG51bWJlciwgbmV3SW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgICFjdHgubGF5b3V0Tm9kZSB8fCAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpIHx8ICFoYXNWYWx1ZShjdHgubGF5b3V0SW5kZXgpIHx8XG4gICAgICAhaXNEZWZpbmVkKG9sZEluZGV4KSB8fCAhaXNEZWZpbmVkKG5ld0luZGV4KSB8fCBvbGRJbmRleCA9PT0gbmV3SW5kZXhcbiAgICApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAvLyBNb3ZlIGl0ZW0gaW4gdGhlIGZvcm1BcnJheVxuICAgIGNvbnN0IGZvcm1BcnJheSA9IDxGb3JtQXJyYXk+dGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKGN0eCk7XG4gICAgY29uc3QgYXJyYXlJdGVtID0gZm9ybUFycmF5LmF0KG9sZEluZGV4KTtcbiAgICBmb3JtQXJyYXkucmVtb3ZlQXQob2xkSW5kZXgpO1xuICAgIGZvcm1BcnJheS5pbnNlcnQobmV3SW5kZXgsIGFycmF5SXRlbSk7XG4gICAgZm9ybUFycmF5LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcblxuICAgIC8vIE1vdmUgbGF5b3V0IGl0ZW1cbiAgICBjb25zdCBsYXlvdXRBcnJheSA9IHRoaXMuZ2V0TGF5b3V0QXJyYXkoY3R4KTtcbiAgICBsYXlvdXRBcnJheS5zcGxpY2UobmV3SW5kZXgsIDAsIGxheW91dEFycmF5LnNwbGljZShvbGRJbmRleCwgMSlbMF0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVtb3ZlSXRlbShjdHg6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgICFjdHgubGF5b3V0Tm9kZSB8fCAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpIHx8ICFoYXNWYWx1ZShjdHgubGF5b3V0SW5kZXgpXG4gICAgKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgLy8gUmVtb3ZlIHRoZSBBbmd1bGFyIGZvcm0gY29udHJvbCBmcm9tIHRoZSBwYXJlbnQgZm9ybUFycmF5IG9yIGZvcm1Hcm91cFxuICAgIGlmIChjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW0pIHsgLy8gUmVtb3ZlIGFycmF5IGl0ZW0gZnJvbSBmb3JtQXJyYXlcbiAgICAgICg8Rm9ybUFycmF5PnRoaXMuZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHgpKVxuICAgICAgICAucmVtb3ZlQXQoY3R4LmRhdGFJbmRleFtjdHguZGF0YUluZGV4Lmxlbmd0aCAtIDFdKTtcbiAgICB9IGVsc2UgeyAvLyBSZW1vdmUgJHJlZiBpdGVtIGZyb20gZm9ybUdyb3VwXG4gICAgICAoPEZvcm1Hcm91cD50aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KSlcbiAgICAgICAgLnJlbW92ZUNvbnRyb2wodGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KSk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGxheW91dE5vZGUgZnJvbSBsYXlvdXRcbiAgICBKc29uUG9pbnRlci5yZW1vdmUodGhpcy5sYXlvdXQsIHRoaXMuZ2V0TGF5b3V0UG9pbnRlcihjdHgpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIl19