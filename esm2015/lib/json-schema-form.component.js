/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { FrameworkLibraryService } from './framework-library/framework-library.service';
import { WidgetLibraryService } from './widget-library/widget-library.service';
import { JsonSchemaFormService } from './json-schema-form.service';
import { convertSchemaToDraft6 } from './shared/convert-schema-to-draft6.function';
import { resolveSchemaReferences } from './shared/json-schema.functions';
import { hasValue, inArray, isArray, isEmpty, isObject } from './shared/validator.functions';
import { forEach, hasOwn } from './shared/utility.functions';
import { JsonPointer } from './shared/jsonpointer.functions';
/** @type {?} */
export const JSON_SCHEMA_FORM_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => JsonSchemaFormComponent),
    multi: true,
};
/**
 * \@module 'JsonSchemaFormComponent' - Angular JSON Schema Form
 *
 * Root module of the Angular JSON Schema Form client-side library,
 * an Angular library which generates an HTML form from a JSON schema
 * structured data model and/or a JSON Schema Form layout description.
 *
 * This library also validates input data by the user, using both validators on
 * individual controls to provide real-time feedback while the user is filling
 * out the form, and then validating the entire input against the schema when
 * the form is submitted to make sure the returned JSON data object is valid.
 *
 * This library is similar to, and mostly API compatible with:
 *
 * - JSON Schema Form's Angular Schema Form library for AngularJs
 *   http://schemaform.io
 *   http://schemaform.io/examples/bootstrap-example.html (examples)
 *
 * - Mozilla's react-jsonschema-form library for React
 *   https://github.com/mozilla-services/react-jsonschema-form
 *   https://mozilla-services.github.io/react-jsonschema-form (examples)
 *
 * - Joshfire's JSON Form library for jQuery
 *   https://github.com/joshfire/jsonform
 *   http://ulion.github.io/jsonform/playground (examples)
 *
 * This library depends on:
 *  - Angular (obviously)                  https://angular.io
 *  - lodash, JavaScript utility library   https://github.com/lodash/lodash
 *  - ajv, Another JSON Schema validator   https://github.com/epoberezkin/ajv
 *
 * In addition, the Example Playground also depends on:
 *  - brace, Browserified Ace editor       http://thlorenz.github.io/brace
 */
export class JsonSchemaFormComponent {
    /**
     * @param {?} changeDetector
     * @param {?} frameworkLibrary
     * @param {?} widgetLibrary
     * @param {?} jsf
     * @param {?} sanitizer
     */
    constructor(changeDetector, frameworkLibrary, widgetLibrary, jsf, sanitizer) {
        this.changeDetector = changeDetector;
        this.frameworkLibrary = frameworkLibrary;
        this.widgetLibrary = widgetLibrary;
        this.jsf = jsf;
        this.sanitizer = sanitizer;
        this.formValueSubscription = null;
        this.formInitialized = false;
        this.objectWrap = false;
        this.previousInputs = {
            schema: null, layout: null, data: null, options: null, framework: null,
            widgets: null, form: null, model: null, JSONSchema: null, UISchema: null,
            formData: null, loadExternalAssets: null, debug: null,
        };
        // Outputs
        this.onChanges = new EventEmitter();
        this.onSubmit = new EventEmitter();
        this.isValid = new EventEmitter();
        this.validationErrors = new EventEmitter();
        this.formSchema = new EventEmitter();
        this.formLayout = new EventEmitter();
        // Outputs for possible 2-way data binding
        // Only the one input providing the initial form data will be bound.
        // If there is no inital data, input '{}' to activate 2-way data binding.
        // There is no 2-way binding if inital data is combined inside the 'form' input.
        this.dataChange = new EventEmitter();
        this.modelChange = new EventEmitter();
        this.formDataChange = new EventEmitter();
        this.ngModelChange = new EventEmitter();
    }
    /**
     * @return {?}
     */
    get value() {
        return this.objectWrap ? this.jsf.data['1'] : this.jsf.data;
    }
    ;
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        this.setFormValues(value, false);
    }
    /**
     * @return {?}
     */
    get stylesheets() {
        /** @type {?} */
        const stylesheets = this.frameworkLibrary.getFrameworkStylesheets();
        /** @type {?} */
        const load = this.sanitizer.bypassSecurityTrustResourceUrl;
        return stylesheets.map(stylesheet => load(stylesheet));
    }
    /**
     * @return {?}
     */
    get scripts() {
        /** @type {?} */
        const scripts = this.frameworkLibrary.getFrameworkScripts();
        /** @type {?} */
        const load = this.sanitizer.bypassSecurityTrustResourceUrl;
        return scripts.map(script => load(script));
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateForm();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this.updateForm();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.setFormValues(value, false);
        if (!this.formValuesInput) {
            this.formValuesInput = 'ngModel';
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        if (this.jsf.formOptions.formDisabled !== !!isDisabled) {
            this.jsf.formOptions.formDisabled = !!isDisabled;
            this.initializeForm();
        }
    }
    /**
     * @return {?}
     */
    updateForm() {
        if (!this.formInitialized || !this.formValuesInput ||
            (this.language && this.language !== this.jsf.language)) {
            this.initializeForm();
        }
        else {
            if (this.language && this.language !== this.jsf.language) {
                this.jsf.setLanguage(this.language);
            }
            /** @type {?} */
            let changedInput = Object.keys(this.previousInputs)
                .filter(input => this.previousInputs[input] !== this[input]);
            /** @type {?} */
            let resetFirst = true;
            if (changedInput.length === 1 && changedInput[0] === 'form' &&
                this.formValuesInput.startsWith('form.')) {
                // If only 'form' input changed, get names of changed keys
                changedInput = Object.keys(this.previousInputs.form || {})
                    .filter(key => !_.isEqual(this.previousInputs.form[key], this.form[key]))
                    .map(key => `form.${key}`);
                resetFirst = false;
            }
            // If only input values have changed, update the form values
            if (changedInput.length === 1 && changedInput[0] === this.formValuesInput) {
                if (this.formValuesInput.indexOf('.') === -1) {
                    this.setFormValues(this[this.formValuesInput], resetFirst);
                }
                else {
                    const [input, key] = this.formValuesInput.split('.');
                    this.setFormValues(this[input][key], resetFirst);
                }
                // If anything else has changed, re-render the entire form
            }
            else if (changedInput.length) {
                this.initializeForm();
                if (this.onChange) {
                    this.onChange(this.jsf.formValues);
                }
                if (this.onTouched) {
                    this.onTouched(this.jsf.formValues);
                }
            }
            // Update previous inputs
            Object.keys(this.previousInputs)
                .filter(input => this.previousInputs[input] !== this[input])
                .forEach(input => this.previousInputs[input] = this[input]);
        }
    }
    /**
     * @param {?} formValues
     * @param {?=} resetFirst
     * @return {?}
     */
    setFormValues(formValues, resetFirst = true) {
        if (formValues) {
            /** @type {?} */
            let newFormValues = this.objectWrap ? formValues['1'] : formValues;
            if (!this.jsf.formGroup) {
                this.jsf.formValues = formValues;
                this.activateForm();
            }
            else if (resetFirst) {
                this.jsf.formGroup.reset();
            }
            if (this.jsf.formGroup) {
                this.jsf.formGroup.patchValue(newFormValues);
            }
            if (this.onChange) {
                this.onChange(newFormValues);
            }
            if (this.onTouched) {
                this.onTouched(newFormValues);
            }
        }
        else {
            this.jsf.formGroup.reset();
        }
    }
    /**
     * @return {?}
     */
    submitForm() {
        /** @type {?} */
        const validData = this.jsf.validData;
        this.onSubmit.emit(this.objectWrap ? validData['1'] : validData);
    }
    /**
     * 'initializeForm' function
     *
     * - Update 'schema', 'layout', and 'formValues', from inputs.
     *
     * - Create 'schemaRefLibrary' and 'schemaRecursiveRefMap'
     *   to resolve schema $ref links, including recursive $ref links.
     *
     * - Create 'dataRecursiveRefMap' to resolve recursive links in data
     *   and corectly set output formats for recursively nested values.
     *
     * - Create 'layoutRefLibrary' and 'templateRefLibrary' to store
     *   new layout nodes and formGroup elements to use when dynamically
     *   adding form components to arrays and recursive $ref points.
     *
     * - Create 'dataMap' to map the data to the schema and template.
     *
     * - Create the master 'formGroupTemplate' then from it 'formGroup'
     *   the Angular formGroup used to control the reactive form.
     * @return {?}
     */
    initializeForm() {
        if (this.schema || this.layout || this.data || this.form || this.model ||
            this.JSONSchema || this.UISchema || this.formData || this.ngModel ||
            this.jsf.data) {
            this.jsf.resetAllValues(); // Reset all form values to defaults
            this.initializeOptions(); // Update options
            this.initializeSchema(); // Update schema, schemaRefLibrary,
            // schemaRecursiveRefMap, & dataRecursiveRefMap
            this.initializeLayout(); // Update layout, layoutRefLibrary,
            this.initializeData(); // Update formValues
            this.activateForm(); // Update dataMap, templateRefLibrary,
            // formGroupTemplate, formGroup
            // Uncomment individual lines to output debugging information to console:
            // (These always work.)
            // console.log('loading form...');
            // console.log('schema', this.jsf.schema);
            // console.log('layout', this.jsf.layout);
            // console.log('options', this.options);
            // console.log('formValues', this.jsf.formValues);
            // console.log('formGroupTemplate', this.jsf.formGroupTemplate);
            // console.log('formGroup', this.jsf.formGroup);
            // console.log('formGroup.value', this.jsf.formGroup.value);
            // console.log('schemaRefLibrary', this.jsf.schemaRefLibrary);
            // console.log('layoutRefLibrary', this.jsf.layoutRefLibrary);
            // console.log('templateRefLibrary', this.jsf.templateRefLibrary);
            // console.log('dataMap', this.jsf.dataMap);
            // console.log('arrayMap', this.jsf.arrayMap);
            // console.log('schemaRecursiveRefMap', this.jsf.schemaRecursiveRefMap);
            // console.log('dataRecursiveRefMap', this.jsf.dataRecursiveRefMap);
            // Uncomment individual lines to output debugging information to browser:
            // (These only work if the 'debug' option has also been set to 'true'.)
            if (this.debug || this.jsf.formOptions.debug) {
                /** @type {?} */
                const vars = [];
                // vars.push(this.jsf.schema);
                // vars.push(this.jsf.layout);
                // vars.push(this.options);
                // vars.push(this.jsf.formValues);
                // vars.push(this.jsf.formGroup.value);
                // vars.push(this.jsf.formGroupTemplate);
                // vars.push(this.jsf.formGroup);
                // vars.push(this.jsf.schemaRefLibrary);
                // vars.push(this.jsf.layoutRefLibrary);
                // vars.push(this.jsf.templateRefLibrary);
                // vars.push(this.jsf.dataMap);
                // vars.push(this.jsf.arrayMap);
                // vars.push(this.jsf.schemaRecursiveRefMap);
                // vars.push(this.jsf.dataRecursiveRefMap);
                this.debugOutput = vars.map(v => JSON.stringify(v, null, 2)).join('\n');
            }
            this.formInitialized = true;
        }
    }
    /**
     * 'initializeOptions' function
     *
     * Initialize 'options' (global form options) and set framework
     * Combine available inputs:
     * 1. options - recommended
     * 2. form.options - Single input style
     * @return {?}
     */
    initializeOptions() {
        if (this.language && this.language !== this.jsf.language) {
            this.jsf.setLanguage(this.language);
        }
        this.jsf.setOptions({ debug: !!this.debug });
        /** @type {?} */
        let loadExternalAssets = this.loadExternalAssets || false;
        /** @type {?} */
        let framework = this.framework || 'default';
        if (isObject(this.options)) {
            this.jsf.setOptions(this.options);
            loadExternalAssets = this.options.loadExternalAssets || loadExternalAssets;
            framework = this.options.framework || framework;
        }
        if (isObject(this.form) && isObject(this.form.options)) {
            this.jsf.setOptions(this.form.options);
            loadExternalAssets = this.form.options.loadExternalAssets || loadExternalAssets;
            framework = this.form.options.framework || framework;
        }
        if (isObject(this.widgets)) {
            this.jsf.setOptions({ widgets: this.widgets });
        }
        this.frameworkLibrary.setLoadExternalAssets(loadExternalAssets);
        this.frameworkLibrary.setFramework(framework);
        this.jsf.framework = this.frameworkLibrary.getFramework();
        if (isObject(this.jsf.formOptions.widgets)) {
            for (let widget of Object.keys(this.jsf.formOptions.widgets)) {
                this.widgetLibrary.registerWidget(widget, this.jsf.formOptions.widgets[widget]);
            }
        }
        if (isObject(this.form) && isObject(this.form.tpldata)) {
            this.jsf.setTpldata(this.form.tpldata);
        }
    }
    /**
     * 'initializeSchema' function
     *
     * Initialize 'schema'
     * Use first available input:
     * 1. schema - recommended / Angular Schema Form style
     * 2. form.schema - Single input / JSON Form style
     * 3. JSONSchema - React JSON Schema Form style
     * 4. form.JSONSchema - For testing single input React JSON Schema Forms
     * 5. form - For testing single schema-only inputs
     *
     * ... if no schema input found, the 'activateForm' function, below,
     *     will make two additional attempts to build a schema
     * 6. If layout input - build schema from layout
     * 7. If data input - build schema from data
     * @return {?}
     */
    initializeSchema() {
        // TODO: update to allow non-object schemas
        if (isObject(this.schema)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.schema = _.cloneDeep(this.schema);
        }
        else if (hasOwn(this.form, 'schema') && isObject(this.form.schema)) {
            this.jsf.schema = _.cloneDeep(this.form.schema);
        }
        else if (isObject(this.JSONSchema)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.jsf.schema = _.cloneDeep(this.JSONSchema);
        }
        else if (hasOwn(this.form, 'JSONSchema') && isObject(this.form.JSONSchema)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.jsf.schema = _.cloneDeep(this.form.JSONSchema);
        }
        else if (hasOwn(this.form, 'properties') && isObject(this.form.properties)) {
            this.jsf.schema = _.cloneDeep(this.form);
        }
        else if (isObject(this.form)) {
            // TODO: Handle other types of form input
        }
        if (!isEmpty(this.jsf.schema)) {
            // If other types also allowed, render schema as an object
            if (inArray('object', this.jsf.schema.type)) {
                this.jsf.schema.type = 'object';
            }
            // Wrap non-object schemas in object.
            if (hasOwn(this.jsf.schema, 'type') && this.jsf.schema.type !== 'object') {
                this.jsf.schema = {
                    'type': 'object',
                    'properties': { 1: this.jsf.schema }
                };
                this.objectWrap = true;
            }
            else if (!hasOwn(this.jsf.schema, 'type')) {
                // Add type = 'object' if missing
                if (isObject(this.jsf.schema.properties) ||
                    isObject(this.jsf.schema.patternProperties) ||
                    isObject(this.jsf.schema.additionalProperties)) {
                    this.jsf.schema.type = 'object';
                    // Fix JSON schema shorthand (JSON Form style)
                }
                else {
                    this.jsf.JsonFormCompatibility = true;
                    this.jsf.schema = {
                        'type': 'object',
                        'properties': this.jsf.schema
                    };
                }
            }
            // If needed, update JSON Schema to draft 6 format, including
            // draft 3 (JSON Form style) and draft 4 (Angular Schema Form style)
            this.jsf.schema = convertSchemaToDraft6(this.jsf.schema);
            // Initialize ajv and compile schema
            this.jsf.compileAjvSchema();
            // Create schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, & arrayMap
            this.jsf.schema = resolveSchemaReferences(this.jsf.schema, this.jsf.schemaRefLibrary, this.jsf.schemaRecursiveRefMap, this.jsf.dataRecursiveRefMap, this.jsf.arrayMap);
            if (hasOwn(this.jsf.schemaRefLibrary, '')) {
                this.jsf.hasRootReference = true;
            }
            // TODO: (?) Resolve external $ref links
            // // Create schemaRefLibrary & schemaRecursiveRefMap
            // this.parser.bundle(this.schema)
            //   .then(schema => this.schema = resolveSchemaReferences(
            //     schema, this.jsf.schemaRefLibrary,
            //     this.jsf.schemaRecursiveRefMap, this.jsf.dataRecursiveRefMap
            //   ));
        }
    }
    /**
     * 'initializeData' function
     *
     * Initialize 'formValues'
     * defulat or previously submitted values used to populate form
     * Use first available input:
     * 1. data - recommended
     * 2. model - Angular Schema Form style
     * 3. form.value - JSON Form style
     * 4. form.data - Single input style
     * 5. formData - React JSON Schema Form style
     * 6. form.formData - For easier testing of React JSON Schema Forms
     * 7. (none) no data - initialize data from schema and layout defaults only
     * @return {?}
     */
    initializeData() {
        if (hasValue(this.data)) {
            this.jsf.formValues = _.cloneDeep(this.data);
            this.formValuesInput = 'data';
        }
        else if (hasValue(this.model)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.formValues = _.cloneDeep(this.model);
            this.formValuesInput = 'model';
        }
        else if (hasValue(this.ngModel)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.formValues = _.cloneDeep(this.ngModel);
            this.formValuesInput = 'ngModel';
        }
        else if (isObject(this.form) && hasValue(this.form.value)) {
            this.jsf.JsonFormCompatibility = true;
            this.jsf.formValues = _.cloneDeep(this.form.value);
            this.formValuesInput = 'form.value';
        }
        else if (isObject(this.form) && hasValue(this.form.data)) {
            this.jsf.formValues = _.cloneDeep(this.form.data);
            this.formValuesInput = 'form.data';
        }
        else if (hasValue(this.formData)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.formValuesInput = 'formData';
        }
        else if (hasOwn(this.form, 'formData') && hasValue(this.form.formData)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            this.jsf.formValues = _.cloneDeep(this.form.formData);
            this.formValuesInput = 'form.formData';
        }
        else {
            this.formValuesInput = null;
        }
    }
    /**
     * 'initializeLayout' function
     *
     * Initialize 'layout'
     * Use first available array input:
     * 1. layout - recommended
     * 2. form - Angular Schema Form style
     * 3. form.form - JSON Form style
     * 4. form.layout - Single input style
     * 5. (none) no layout - set default layout instead
     *    (full layout will be built later from the schema)
     *
     * Also, if alternate layout formats are available,
     * import from 'UISchema' or 'customFormItems'
     * used for React JSON Schema Form and JSON Form API compatibility
     * Use first available input:
     * 1. UISchema - React JSON Schema Form style
     * 2. form.UISchema - For testing single input React JSON Schema Forms
     * 2. form.customFormItems - JSON Form style
     * 3. (none) no input - don't import
     * @return {?}
     */
    initializeLayout() {
        /** @type {?} */
        const fixJsonFormOptions = (layout) => {
            if (isObject(layout) || isArray(layout)) {
                forEach(layout, (value, key) => {
                    if (hasOwn(value, 'options') && isObject(value.options)) {
                        value.titleMap = value.options;
                        delete value.options;
                    }
                }, 'top-down');
            }
            return layout;
        };
        // Check for layout inputs and, if found, initialize form layout
        if (isArray(this.layout)) {
            this.jsf.layout = _.cloneDeep(this.layout);
        }
        else if (isArray(this.form)) {
            this.jsf.AngularSchemaFormCompatibility = true;
            this.jsf.layout = _.cloneDeep(this.form);
        }
        else if (this.form && isArray(this.form.form)) {
            this.jsf.JsonFormCompatibility = true;
            this.jsf.layout = fixJsonFormOptions(_.cloneDeep(this.form.form));
        }
        else if (this.form && isArray(this.form.layout)) {
            this.jsf.layout = _.cloneDeep(this.form.layout);
        }
        else {
            this.jsf.layout = ['*'];
        }
        /** @type {?} */
        let alternateLayout = null;
        if (isObject(this.UISchema)) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            alternateLayout = _.cloneDeep(this.UISchema);
        }
        else if (hasOwn(this.form, 'UISchema')) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            alternateLayout = _.cloneDeep(this.form.UISchema);
        }
        else if (hasOwn(this.form, 'uiSchema')) {
            this.jsf.ReactJsonSchemaFormCompatibility = true;
            alternateLayout = _.cloneDeep(this.form.uiSchema);
        }
        else if (hasOwn(this.form, 'customFormItems')) {
            this.jsf.JsonFormCompatibility = true;
            alternateLayout = fixJsonFormOptions(_.cloneDeep(this.form.customFormItems));
        }
        // if alternate layout found, copy alternate layout options into schema
        if (alternateLayout) {
            JsonPointer.forEachDeep(alternateLayout, (value, pointer) => {
                /** @type {?} */
                const schemaPointer = pointer
                    .replace(/\//g, '/properties/')
                    .replace(/\/properties\/items\/properties\//g, '/items/properties/')
                    .replace(/\/properties\/titleMap\/properties\//g, '/titleMap/properties/');
                if (hasValue(value) && hasValue(pointer)) {
                    /** @type {?} */
                    let key = JsonPointer.toKey(pointer);
                    /** @type {?} */
                    const groupPointer = (JsonPointer.parse(schemaPointer) || []).slice(0, -2);
                    /** @type {?} */
                    let itemPointer;
                    // If 'ui:order' object found, copy into object schema root
                    if (key.toLowerCase() === 'ui:order') {
                        itemPointer = [...groupPointer, 'ui:order'];
                        // Copy other alternate layout options to schema 'x-schema-form',
                        // (like Angular Schema Form options) and remove any 'ui:' prefixes
                    }
                    else {
                        if (key.slice(0, 3).toLowerCase() === 'ui:') {
                            key = key.slice(3);
                        }
                        itemPointer = [...groupPointer, 'x-schema-form', key];
                    }
                    if (JsonPointer.has(this.jsf.schema, groupPointer) &&
                        !JsonPointer.has(this.jsf.schema, itemPointer)) {
                        JsonPointer.set(this.jsf.schema, itemPointer, value);
                    }
                }
            });
        }
    }
    /**
     * 'activateForm' function
     *
     * ...continued from 'initializeSchema' function, above
     * If 'schema' has not been initialized (i.e. no schema input found)
     * 6. If layout input - build schema from layout input
     * 7. If data input - build schema from data input
     *
     * Create final layout,
     * build the FormGroup template and the Angular FormGroup,
     * subscribe to changes,
     * and activate the form.
     * @return {?}
     */
    activateForm() {
        // If 'schema' not initialized
        if (isEmpty(this.jsf.schema)) {
            // TODO: If full layout input (with no '*'), build schema from layout
            // if (!this.jsf.layout.includes('*')) {
            //   this.jsf.buildSchemaFromLayout();
            // } else
            // If data input, build schema from data
            if (!isEmpty(this.jsf.formValues)) {
                this.jsf.buildSchemaFromData();
            }
        }
        if (!isEmpty(this.jsf.schema)) {
            // If not already initialized, initialize ajv and compile schema
            this.jsf.compileAjvSchema();
            // Update all layout elements, add values, widgets, and validators,
            // replace any '*' with a layout built from all schema elements,
            // and update the FormGroup template with any new validators
            this.jsf.buildLayout(this.widgetLibrary);
            // Build the Angular FormGroup template from the schema
            this.jsf.buildFormGroupTemplate(this.jsf.formValues);
            // Build the real Angular FormGroup from the FormGroup template
            this.jsf.buildFormGroup();
        }
        if (this.jsf.formGroup) {
            // Reset initial form values
            if (!isEmpty(this.jsf.formValues) &&
                this.jsf.formOptions.setSchemaDefaults !== true &&
                this.jsf.formOptions.setLayoutDefaults !== true) {
                this.setFormValues(this.jsf.formValues);
            }
            // TODO: Figure out how to display calculated values without changing object data
            // See http://ulion.github.io/jsonform/playground/?example=templating-values
            // Calculate references to other fields
            // if (!isEmpty(this.jsf.formGroup.value)) {
            //   forEach(this.jsf.formGroup.value, (value, key, object, rootObject) => {
            //     if (typeof value === 'string') {
            //       object[key] = this.jsf.parseText(value, value, rootObject, key);
            //     }
            //   }, 'top-down');
            // }
            // Subscribe to form changes to output live data, validation, and errors
            this.jsf.dataChanges.subscribe(data => {
                this.onChanges.emit(this.objectWrap ? data['1'] : data);
                if (this.formValuesInput && this.formValuesInput.indexOf('.') === -1) {
                    this[`${this.formValuesInput}Change`].emit(this.objectWrap ? data['1'] : data);
                }
            });
            // Trigger change detection on statusChanges to show updated errors
            this.jsf.formGroup.statusChanges.subscribe(() => this.changeDetector.markForCheck());
            this.jsf.isValidChanges.subscribe(isValid => this.isValid.emit(isValid));
            this.jsf.validationErrorChanges.subscribe(err => this.validationErrors.emit(err));
            // Output final schema, final layout, and initial data
            this.formSchema.emit(this.jsf.schema);
            this.formLayout.emit(this.jsf.layout);
            this.onChanges.emit(this.objectWrap ? this.jsf.data['1'] : this.jsf.data);
            /** @type {?} */
            const validateOnRender = JsonPointer.get(this.jsf, '/formOptions/validateOnRender');
            if (validateOnRender) {
                /** @type {?} */
                const touchAll = (control) => {
                    if (validateOnRender === true || hasValue(control.value)) {
                        control.markAsTouched();
                    }
                    Object.keys(control.controls || {})
                        .forEach(key => touchAll(control.controls[key]));
                };
                touchAll(this.jsf.formGroup);
                this.isValid.emit(this.jsf.isValid);
                this.validationErrors.emit(this.jsf.ajvErrors);
            }
        }
    }
}
JsonSchemaFormComponent.decorators = [
    { type: Component, args: [{
                selector: 'json-schema-form',
                template: `
    <div *ngFor="let stylesheet of stylesheets">
      <link rel="stylesheet" [href]="stylesheet">
    </div>
    <div *ngFor="let script of scripts">
      <script type="text/javascript" [src]="script"></script>
    </div>
    <form class="json-schema-form" (ngSubmit)="submitForm()">
      <root-widget [layout]="jsf?.layout"></root-widget>
    </form>
    <div *ngIf="debug || jsf?.formOptions?.debug">
      Debug output: <pre>{{debugOutput}}</pre>
    </div>`,
                changeDetection: ChangeDetectionStrategy.OnPush,
                // Adding 'JsonSchemaFormService' here, instead of in the module,
                // creates a separate instance of the service for each component
                providers: [JsonSchemaFormService, JSON_SCHEMA_FORM_VALUE_ACCESSOR],
            },] },
];
/** @nocollapse */
JsonSchemaFormComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: FrameworkLibraryService },
    { type: WidgetLibraryService },
    { type: JsonSchemaFormService },
    { type: DomSanitizer }
];
JsonSchemaFormComponent.propDecorators = {
    schema: [{ type: Input }],
    layout: [{ type: Input }],
    data: [{ type: Input }],
    options: [{ type: Input }],
    framework: [{ type: Input }],
    widgets: [{ type: Input }],
    form: [{ type: Input }],
    model: [{ type: Input }],
    JSONSchema: [{ type: Input }],
    UISchema: [{ type: Input }],
    formData: [{ type: Input }],
    ngModel: [{ type: Input }],
    language: [{ type: Input }],
    loadExternalAssets: [{ type: Input }],
    debug: [{ type: Input }],
    value: [{ type: Input }],
    onChanges: [{ type: Output }],
    onSubmit: [{ type: Output }],
    isValid: [{ type: Output }],
    validationErrors: [{ type: Output }],
    formSchema: [{ type: Output }],
    formLayout: [{ type: Output }],
    dataChange: [{ type: Output }],
    modelChange: [{ type: Output }],
    formDataChange: [{ type: Output }],
    ngModelChange: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    JsonSchemaFormComponent.prototype.debugOutput;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formValueSubscription;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formInitialized;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.objectWrap;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formValuesInput;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.previousInputs;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.schema;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.layout;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.data;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.options;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.framework;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.widgets;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.form;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.model;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.JSONSchema;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.UISchema;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formData;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.ngModel;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.language;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.loadExternalAssets;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.debug;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.onChanges;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.onSubmit;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.isValid;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.validationErrors;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formSchema;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formLayout;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.dataChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.modelChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.formDataChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.ngModelChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.onChange;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.onTouched;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.changeDetector;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.frameworkLibrary;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.widgetLibrary;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.jsf;
    /** @type {?} */
    JsonSchemaFormComponent.prototype.sanitizer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEtZm9ybS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL2pzb24tc2NoZW1hLWZvcm0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFDbkUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQzFCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFtQixNQUFNLDJCQUEyQixDQUFDO0FBRTFFLE9BQU8sS0FBSyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBRTVCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3pFLE9BQU8sRUFDTCxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQVksUUFBUSxFQUN4RCxNQUFNLDhCQUE4QixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOztBQUU3RCxhQUFhLCtCQUErQixHQUFRO0lBQ2xELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx1QkFBdUIsQ0FB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QUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pEO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEdBQUcsSUFBSSxDQUFDO1lBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2hEO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxHQUFHLElBQUksQ0FBQztZQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckQ7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FB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QUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO1NBQy9CO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDO1lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDO1NBQ2hDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDO1lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1NBQ2xDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsZUFBZSxHQUFHLFlBQVksQ0FBQztTQUNyQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxXQUFXLENBQUM7U0FDcEM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsR0FBRyxJQUFJLENBQUM7WUFDakQsSUFBSSxDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUM7U0FDbkM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEdBQUcsSUFBSSxDQUFDO1lBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztTQUN4QztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7U0FDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCSyxnQkFBZ0I7O1FBSXRCLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxNQUFXLEVBQU8sRUFBRTtZQUM5QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtvQkFDN0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDeEQsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO3dCQUMvQixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUM7cUJBQ3RCO2lCQUNGLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDaEI7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ2YsQ0FBQTs7UUFHRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQztZQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNuRTtRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakQ7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7O1FBR0QsSUFBSSxlQUFlLEdBQVEsSUFBSSxDQUFDO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEdBQUcsSUFBSSxDQUFDO1lBQ2pELGVBQWUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM5QztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsR0FBRyxJQUFJLENBQUM7WUFDakQsZUFBZSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNuRDtRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsR0FBRyxJQUFJLENBQUM7WUFDakQsZUFBZSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNuRDtRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztZQUN0QyxlQUFlLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7U0FDOUU7O1FBR0QsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNwQixXQUFXLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTs7Z0JBQzFELE1BQU0sYUFBYSxHQUFHLE9BQU87cUJBQzFCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDO3FCQUM5QixPQUFPLENBQUMsb0NBQW9DLEVBQUUsb0JBQW9CLENBQUM7cUJBQ25FLE9BQU8sQ0FBQyx1Q0FBdUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUM3RSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7b0JBQ3pDLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7O29CQUNyQyxNQUFNLFlBQVksR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOztvQkFDM0UsSUFBSSxXQUFXLENBQW9COztvQkFHbkMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQ3JDLFdBQVcsR0FBRyxDQUFDLEdBQUcsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7cUJBSTdDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQUU7d0JBQ3BFLFdBQVcsR0FBRyxDQUFDLEdBQUcsWUFBWSxFQUFFLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDdkQ7b0JBQ0QsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7d0JBQ2hELENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQy9DLENBQUMsQ0FBQyxDQUFDO3dCQUNELFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO3FCQUN0RDtpQkFDRjthQUNGLENBQUMsQ0FBQztTQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JLLFlBQVk7O1FBR2xCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7O1lBUTdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDaEM7U0FDRjtRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztZQUc5QixJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7Ozs7WUFLNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztZQUd6QyxJQUFJLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7O1lBR3JELElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDM0I7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7O1lBR3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO2dCQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsS0FBSyxJQUFJO2dCQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsS0FBSyxJQUM3QyxDQUFDLENBQUMsQ0FBQztnQkFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDekM7Ozs7Ozs7Ozs7OztZQWNELElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNoRjthQUNGLENBQUMsQ0FBQzs7WUFHSCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUNyRixJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztZQUdsRixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O1lBRzFFLE1BQU0sZ0JBQWdCLEdBQ3BCLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQzs7Z0JBQ3JCLE1BQU0sUUFBUSxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQzNCLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixLQUFLLElBQUksSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDekQsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO3FCQUN6QjtvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO3lCQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3BELENBQUM7Z0JBQ0YsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNoRDtTQUNGOzs7O1lBL3BCSixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7V0FZRDtnQkFDVCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7O2dCQUcvQyxTQUFTLEVBQUcsQ0FBRSxxQkFBcUIsRUFBRSwrQkFBK0IsQ0FBRTthQUN2RTs7OztZQTlFMEIsaUJBQWlCO1lBUW5DLHVCQUF1QjtZQUN2QixvQkFBb0I7WUFDcEIscUJBQXFCO1lBTnJCLFlBQVk7OztxQkE2RmxCLEtBQUs7cUJBQ0wsS0FBSzttQkFDTCxLQUFLO3NCQUNMLEtBQUs7d0JBQ0wsS0FBSztzQkFDTCxLQUFLO21CQUdMLEtBQUs7b0JBR0wsS0FBSzt5QkFHTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSztzQkFFTCxLQUFLO3VCQUVMLEtBQUs7aUNBR0wsS0FBSztvQkFDTCxLQUFLO29CQUVMLEtBQUs7d0JBU0wsTUFBTTt1QkFDTixNQUFNO3NCQUNOLE1BQU07K0JBQ04sTUFBTTt5QkFDTixNQUFNO3lCQUNOLE1BQU07eUJBTU4sTUFBTTswQkFDTixNQUFNOzZCQUNOLE1BQU07NEJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsIElucHV0LCBPdXRwdXQsIE9uQ2hhbmdlcywgT25Jbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlUmVzb3VyY2VVcmwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBGcmFtZXdvcmtMaWJyYXJ5U2VydmljZSB9IGZyb20gJy4vZnJhbWV3b3JrLWxpYnJhcnkvZnJhbWV3b3JrLWxpYnJhcnkuc2VydmljZSc7XG5pbXBvcnQgeyBXaWRnZXRMaWJyYXJ5U2VydmljZSB9IGZyb20gJy4vd2lkZ2V0LWxpYnJhcnkvd2lkZ2V0LWxpYnJhcnkuc2VydmljZSc7XG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBjb252ZXJ0U2NoZW1hVG9EcmFmdDYgfSBmcm9tICcuL3NoYXJlZC9jb252ZXJ0LXNjaGVtYS10by1kcmFmdDYuZnVuY3Rpb24nO1xuaW1wb3J0IHsgcmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXMgfSBmcm9tICcuL3NoYXJlZC9qc29uLXNjaGVtYS5mdW5jdGlvbnMnO1xuaW1wb3J0IHtcbiAgaGFzVmFsdWUsIGluQXJyYXksIGlzQXJyYXksIGlzRW1wdHksIGlzTnVtYmVyLCBpc09iamVjdFxufSBmcm9tICcuL3NoYXJlZC92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IGZvckVhY2gsIGhhc093biB9IGZyb20gJy4vc2hhcmVkL3V0aWxpdHkuZnVuY3Rpb25zJztcbmltcG9ydCB7IEpzb25Qb2ludGVyIH0gZnJvbSAnLi9zaGFyZWQvanNvbnBvaW50ZXIuZnVuY3Rpb25zJztcblxuZXhwb3J0IGNvbnN0IEpTT05fU0NIRU1BX0ZPUk1fVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEpzb25TY2hlbWFGb3JtQ29tcG9uZW50KSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIEBtb2R1bGUgJ0pzb25TY2hlbWFGb3JtQ29tcG9uZW50JyAtIEFuZ3VsYXIgSlNPTiBTY2hlbWEgRm9ybVxuICpcbiAqIFJvb3QgbW9kdWxlIG9mIHRoZSBBbmd1bGFyIEpTT04gU2NoZW1hIEZvcm0gY2xpZW50LXNpZGUgbGlicmFyeSxcbiAqIGFuIEFuZ3VsYXIgbGlicmFyeSB3aGljaCBnZW5lcmF0ZXMgYW4gSFRNTCBmb3JtIGZyb20gYSBKU09OIHNjaGVtYVxuICogc3RydWN0dXJlZCBkYXRhIG1vZGVsIGFuZC9vciBhIEpTT04gU2NoZW1hIEZvcm0gbGF5b3V0IGRlc2NyaXB0aW9uLlxuICpcbiAqIFRoaXMgbGlicmFyeSBhbHNvIHZhbGlkYXRlcyBpbnB1dCBkYXRhIGJ5IHRoZSB1c2VyLCB1c2luZyBib3RoIHZhbGlkYXRvcnMgb25cbiAqIGluZGl2aWR1YWwgY29udHJvbHMgdG8gcHJvdmlkZSByZWFsLXRpbWUgZmVlZGJhY2sgd2hpbGUgdGhlIHVzZXIgaXMgZmlsbGluZ1xuICogb3V0IHRoZSBmb3JtLCBhbmQgdGhlbiB2YWxpZGF0aW5nIHRoZSBlbnRpcmUgaW5wdXQgYWdhaW5zdCB0aGUgc2NoZW1hIHdoZW5cbiAqIHRoZSBmb3JtIGlzIHN1Ym1pdHRlZCB0byBtYWtlIHN1cmUgdGhlIHJldHVybmVkIEpTT04gZGF0YSBvYmplY3QgaXMgdmFsaWQuXG4gKlxuICogVGhpcyBsaWJyYXJ5IGlzIHNpbWlsYXIgdG8sIGFuZCBtb3N0bHkgQVBJIGNvbXBhdGlibGUgd2l0aDpcbiAqXG4gKiAtIEpTT04gU2NoZW1hIEZvcm0ncyBBbmd1bGFyIFNjaGVtYSBGb3JtIGxpYnJhcnkgZm9yIEFuZ3VsYXJKc1xuICogICBodHRwOi8vc2NoZW1hZm9ybS5pb1xuICogICBodHRwOi8vc2NoZW1hZm9ybS5pby9leGFtcGxlcy9ib290c3RyYXAtZXhhbXBsZS5odG1sIChleGFtcGxlcylcbiAqXG4gKiAtIE1vemlsbGEncyByZWFjdC1qc29uc2NoZW1hLWZvcm0gbGlicmFyeSBmb3IgUmVhY3RcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEtc2VydmljZXMvcmVhY3QtanNvbnNjaGVtYS1mb3JtXG4gKiAgIGh0dHBzOi8vbW96aWxsYS1zZXJ2aWNlcy5naXRodWIuaW8vcmVhY3QtanNvbnNjaGVtYS1mb3JtIChleGFtcGxlcylcbiAqXG4gKiAtIEpvc2hmaXJlJ3MgSlNPTiBGb3JtIGxpYnJhcnkgZm9yIGpRdWVyeVxuICogICBodHRwczovL2dpdGh1Yi5jb20vam9zaGZpcmUvanNvbmZvcm1cbiAqICAgaHR0cDovL3VsaW9uLmdpdGh1Yi5pby9qc29uZm9ybS9wbGF5Z3JvdW5kIChleGFtcGxlcylcbiAqXG4gKiBUaGlzIGxpYnJhcnkgZGVwZW5kcyBvbjpcbiAqICAtIEFuZ3VsYXIgKG9idmlvdXNseSkgICAgICAgICAgICAgICAgICBodHRwczovL2FuZ3VsYXIuaW9cbiAqICAtIGxvZGFzaCwgSmF2YVNjcmlwdCB1dGlsaXR5IGxpYnJhcnkgICBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaFxuICogIC0gYWp2LCBBbm90aGVyIEpTT04gU2NoZW1hIHZhbGlkYXRvciAgIGh0dHBzOi8vZ2l0aHViLmNvbS9lcG9iZXJlemtpbi9hanZcbiAqXG4gKiBJbiBhZGRpdGlvbiwgdGhlIEV4YW1wbGUgUGxheWdyb3VuZCBhbHNvIGRlcGVuZHMgb246XG4gKiAgLSBicmFjZSwgQnJvd3NlcmlmaWVkIEFjZSBlZGl0b3IgICAgICAgaHR0cDovL3RobG9yZW56LmdpdGh1Yi5pby9icmFjZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdqc29uLXNjaGVtYS1mb3JtJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBzdHlsZXNoZWV0IG9mIHN0eWxlc2hlZXRzXCI+XG4gICAgICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgW2hyZWZdPVwic3R5bGVzaGVldFwiPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgKm5nRm9yPVwibGV0IHNjcmlwdCBvZiBzY3JpcHRzXCI+XG4gICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBbc3JjXT1cInNjcmlwdFwiPjwvc2NyaXB0PlxuICAgIDwvZGl2PlxuICAgIDxmb3JtIGNsYXNzPVwianNvbi1zY2hlbWEtZm9ybVwiIChuZ1N1Ym1pdCk9XCJzdWJtaXRGb3JtKClcIj5cbiAgICAgIDxyb290LXdpZGdldCBbbGF5b3V0XT1cImpzZj8ubGF5b3V0XCI+PC9yb290LXdpZGdldD5cbiAgICA8L2Zvcm0+XG4gICAgPGRpdiAqbmdJZj1cImRlYnVnIHx8IGpzZj8uZm9ybU9wdGlvbnM/LmRlYnVnXCI+XG4gICAgICBEZWJ1ZyBvdXRwdXQ6IDxwcmU+e3tkZWJ1Z091dHB1dH19PC9wcmU+XG4gICAgPC9kaXY+YCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIC8vIEFkZGluZyAnSnNvblNjaGVtYUZvcm1TZXJ2aWNlJyBoZXJlLCBpbnN0ZWFkIG9mIGluIHRoZSBtb2R1bGUsXG4gIC8vIGNyZWF0ZXMgYSBzZXBhcmF0ZSBpbnN0YW5jZSBvZiB0aGUgc2VydmljZSBmb3IgZWFjaCBjb21wb25lbnRcbiAgcHJvdmlkZXJzOiAgWyBKc29uU2NoZW1hRm9ybVNlcnZpY2UsIEpTT05fU0NIRU1BX0ZPUk1fVkFMVUVfQUNDRVNTT1IgXSxcbn0pXG5leHBvcnQgY2xhc3MgSnNvblNjaGVtYUZvcm1Db21wb25lbnQgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkluaXQge1xuICBkZWJ1Z091dHB1dDogYW55OyAvLyBEZWJ1ZyBpbmZvcm1hdGlvbiwgaWYgcmVxdWVzdGVkXG4gIGZvcm1WYWx1ZVN1YnNjcmlwdGlvbjogYW55ID0gbnVsbDtcbiAgZm9ybUluaXRpYWxpemVkID0gZmFsc2U7XG4gIG9iamVjdFdyYXAgPSBmYWxzZTsgLy8gSXMgbm9uLW9iamVjdCBpbnB1dCBzY2hlbWEgd3JhcHBlZCBpbiBhbiBvYmplY3Q/XG5cbiAgZm9ybVZhbHVlc0lucHV0OiBzdHJpbmc7IC8vIE5hbWUgb2YgdGhlIGlucHV0IHByb3ZpZGluZyB0aGUgZm9ybSBkYXRhXG4gIHByZXZpb3VzSW5wdXRzOiB7IC8vIFByZXZpb3VzIGlucHV0IHZhbHVlcywgdG8gZGV0ZWN0IHdoaWNoIGlucHV0IHRyaWdnZXJzIG9uQ2hhbmdlc1xuICAgIHNjaGVtYTogYW55LCBsYXlvdXQ6IGFueVtdLCBkYXRhOiBhbnksIG9wdGlvbnM6IGFueSwgZnJhbWV3b3JrOiBhbnl8c3RyaW5nLFxuICAgIHdpZGdldHM6IGFueSwgZm9ybTogYW55LCBtb2RlbDogYW55LCBKU09OU2NoZW1hOiBhbnksIFVJU2NoZW1hOiBhbnksXG4gICAgZm9ybURhdGE6IGFueSwgbG9hZEV4dGVybmFsQXNzZXRzOiBib29sZWFuLCBkZWJ1ZzogYm9vbGVhbixcbiAgfSA9IHtcbiAgICBzY2hlbWE6IG51bGwsIGxheW91dDogbnVsbCwgZGF0YTogbnVsbCwgb3B0aW9uczogbnVsbCwgZnJhbWV3b3JrOiBudWxsLFxuICAgIHdpZGdldHM6IG51bGwsIGZvcm06IG51bGwsIG1vZGVsOiBudWxsLCBKU09OU2NoZW1hOiBudWxsLCBVSVNjaGVtYTogbnVsbCxcbiAgICBmb3JtRGF0YTogbnVsbCwgbG9hZEV4dGVybmFsQXNzZXRzOiBudWxsLCBkZWJ1ZzogbnVsbCxcbiAgfTtcblxuICAvLyBSZWNvbW1lbmRlZCBpbnB1dHNcbiAgQElucHV0KCkgc2NoZW1hOiBhbnk7IC8vIFRoZSBKU09OIFNjaGVtYVxuICBASW5wdXQoKSBsYXlvdXQ6IGFueVtdOyAvLyBUaGUgZm9ybSBsYXlvdXRcbiAgQElucHV0KCkgZGF0YTogYW55OyAvLyBUaGUgZm9ybSBkYXRhXG4gIEBJbnB1dCgpIG9wdGlvbnM6IGFueTsgLy8gVGhlIGdsb2JhbCBmb3JtIG9wdGlvbnNcbiAgQElucHV0KCkgZnJhbWV3b3JrOiBhbnl8c3RyaW5nOyAvLyBUaGUgZnJhbWV3b3JrIHRvIGxvYWRcbiAgQElucHV0KCkgd2lkZ2V0czogYW55OyAvLyBBbnkgY3VzdG9tIHdpZGdldHMgdG8gbG9hZFxuXG4gIC8vIEFsdGVybmF0ZSBjb21iaW5lZCBzaW5nbGUgaW5wdXRcbiAgQElucHV0KCkgZm9ybTogYW55OyAvLyBGb3IgdGVzdGluZywgYW5kIEpTT04gU2NoZW1hIEZvcm0gQVBJIGNvbXBhdGliaWxpdHlcblxuICAvLyBBbmd1bGFyIFNjaGVtYSBGb3JtIEFQSSBjb21wYXRpYmlsaXR5IGlucHV0XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7IC8vIEFsdGVybmF0ZSBpbnB1dCBmb3IgZm9ybSBkYXRhXG5cbiAgLy8gUmVhY3QgSlNPTiBTY2hlbWEgRm9ybSBBUEkgY29tcGF0aWJpbGl0eSBpbnB1dHNcbiAgQElucHV0KCkgSlNPTlNjaGVtYTogYW55OyAvLyBBbHRlcm5hdGUgaW5wdXQgZm9yIEpTT04gU2NoZW1hXG4gIEBJbnB1dCgpIFVJU2NoZW1hOiBhbnk7IC8vIFVJIHNjaGVtYSAtIGFsdGVybmF0ZSBmb3JtIGxheW91dCBmb3JtYXRcbiAgQElucHV0KCkgZm9ybURhdGE6IGFueTsgLy8gQWx0ZXJuYXRlIGlucHV0IGZvciBmb3JtIGRhdGFcblxuICBASW5wdXQoKSBuZ01vZGVsOiBhbnk7IC8vIEFsdGVybmF0ZSBpbnB1dCBmb3IgQW5ndWxhciBmb3Jtc1xuXG4gIEBJbnB1dCgpIGxhbmd1YWdlOiBzdHJpbmc7IC8vIExhbmd1YWdlXG5cbiAgLy8gRGV2ZWxvcG1lbnQgaW5wdXRzLCBmb3IgdGVzdGluZyBhbmQgZGVidWdnaW5nXG4gIEBJbnB1dCgpIGxvYWRFeHRlcm5hbEFzc2V0czogYm9vbGVhbjsgLy8gTG9hZCBleHRlcm5hbCBmcmFtZXdvcmsgYXNzZXRzP1xuICBASW5wdXQoKSBkZWJ1ZzogYm9vbGVhbjsgLy8gU2hvdyBkZWJ1ZyBpbmZvcm1hdGlvbj9cblxuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5vYmplY3RXcmFwID8gdGhpcy5qc2YuZGF0YVsnMSddIDogdGhpcy5qc2YuZGF0YTtcbiAgfTtcbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnNldEZvcm1WYWx1ZXModmFsdWUsIGZhbHNlKTtcbiAgfVxuXG4gIC8vIE91dHB1dHNcbiAgQE91dHB1dCgpIG9uQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpOyAvLyBMaXZlIHVudmFsaWRhdGVkIGludGVybmFsIGZvcm0gZGF0YVxuICBAT3V0cHV0KCkgb25TdWJtaXQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTsgLy8gQ29tcGxldGUgdmFsaWRhdGVkIGZvcm0gZGF0YVxuICBAT3V0cHV0KCkgaXNWYWxpZCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTsgLy8gSXMgY3VycmVudCBkYXRhIHZhbGlkP1xuICBAT3V0cHV0KCkgdmFsaWRhdGlvbkVycm9ycyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpOyAvLyBWYWxpZGF0aW9uIGVycm9ycyAoaWYgYW55KVxuICBAT3V0cHV0KCkgZm9ybVNjaGVtYSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpOyAvLyBGaW5hbCBzY2hlbWEgdXNlZCB0byBjcmVhdGUgZm9ybVxuICBAT3V0cHV0KCkgZm9ybUxheW91dCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpOyAvLyBGaW5hbCBsYXlvdXQgdXNlZCB0byBjcmVhdGUgZm9ybVxuXG4gIC8vIE91dHB1dHMgZm9yIHBvc3NpYmxlIDItd2F5IGRhdGEgYmluZGluZ1xuICAvLyBPbmx5IHRoZSBvbmUgaW5wdXQgcHJvdmlkaW5nIHRoZSBpbml0aWFsIGZvcm0gZGF0YSB3aWxsIGJlIGJvdW5kLlxuICAvLyBJZiB0aGVyZSBpcyBubyBpbml0YWwgZGF0YSwgaW5wdXQgJ3t9JyB0byBhY3RpdmF0ZSAyLXdheSBkYXRhIGJpbmRpbmcuXG4gIC8vIFRoZXJlIGlzIG5vIDItd2F5IGJpbmRpbmcgaWYgaW5pdGFsIGRhdGEgaXMgY29tYmluZWQgaW5zaWRlIHRoZSAnZm9ybScgaW5wdXQuXG4gIEBPdXRwdXQoKSBkYXRhQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBtb2RlbENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZm9ybURhdGFDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIG5nTW9kZWxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBvbkNoYW5nZTogRnVuY3Rpb247XG4gIG9uVG91Y2hlZDogRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBmcmFtZXdvcmtMaWJyYXJ5OiBGcmFtZXdvcmtMaWJyYXJ5U2VydmljZSxcbiAgICBwcml2YXRlIHdpZGdldExpYnJhcnk6IFdpZGdldExpYnJhcnlTZXJ2aWNlLFxuICAgIHB1YmxpYyBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZSxcbiAgICBwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyXG4gICkgeyB9XG5cbiAgZ2V0IHN0eWxlc2hlZXRzKCk6IFNhZmVSZXNvdXJjZVVybFtdIHtcbiAgICBjb25zdCBzdHlsZXNoZWV0cyA9IHRoaXMuZnJhbWV3b3JrTGlicmFyeS5nZXRGcmFtZXdvcmtTdHlsZXNoZWV0cygpO1xuICAgIGNvbnN0IGxvYWQgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmw7XG4gICAgcmV0dXJuIHN0eWxlc2hlZXRzLm1hcChzdHlsZXNoZWV0ID0+IGxvYWQoc3R5bGVzaGVldCkpO1xuICB9XG5cbiAgZ2V0IHNjcmlwdHMoKTogU2FmZVJlc291cmNlVXJsW10ge1xuICAgIGNvbnN0IHNjcmlwdHMgPSB0aGlzLmZyYW1ld29ya0xpYnJhcnkuZ2V0RnJhbWV3b3JrU2NyaXB0cygpO1xuICAgIGNvbnN0IGxvYWQgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmw7XG4gICAgcmV0dXJuIHNjcmlwdHMubWFwKHNjcmlwdCA9PiBsb2FkKHNjcmlwdCkpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy51cGRhdGVGb3JtKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLnVwZGF0ZUZvcm0oKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMuc2V0Rm9ybVZhbHVlcyh2YWx1ZSwgZmFsc2UpO1xuICAgIGlmICghdGhpcy5mb3JtVmFsdWVzSW5wdXQpIHsgdGhpcy5mb3JtVmFsdWVzSW5wdXQgPSAnbmdNb2RlbCc7IH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmpzZi5mb3JtT3B0aW9ucy5mb3JtRGlzYWJsZWQgIT09ICEhaXNEaXNhYmxlZCkge1xuICAgICAgdGhpcy5qc2YuZm9ybU9wdGlvbnMuZm9ybURpc2FibGVkID0gISFpc0Rpc2FibGVkO1xuICAgICAgdGhpcy5pbml0aWFsaXplRm9ybSgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUZvcm0oKSB7XG4gICAgaWYgKCF0aGlzLmZvcm1Jbml0aWFsaXplZCB8fCAhdGhpcy5mb3JtVmFsdWVzSW5wdXQgfHxcbiAgICAgICh0aGlzLmxhbmd1YWdlICYmIHRoaXMubGFuZ3VhZ2UgIT09IHRoaXMuanNmLmxhbmd1YWdlKVxuICAgICkge1xuICAgICAgdGhpcy5pbml0aWFsaXplRm9ybSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5sYW5ndWFnZSAmJiB0aGlzLmxhbmd1YWdlICE9PSB0aGlzLmpzZi5sYW5ndWFnZSkge1xuICAgICAgICB0aGlzLmpzZi5zZXRMYW5ndWFnZSh0aGlzLmxhbmd1YWdlKTtcbiAgICAgIH1cblxuICAgICAgLy8gR2V0IG5hbWVzIG9mIGNoYW5nZWQgaW5wdXRzXG4gICAgICBsZXQgY2hhbmdlZElucHV0ID0gT2JqZWN0LmtleXModGhpcy5wcmV2aW91c0lucHV0cylcbiAgICAgICAgLmZpbHRlcihpbnB1dCA9PiB0aGlzLnByZXZpb3VzSW5wdXRzW2lucHV0XSAhPT0gdGhpc1tpbnB1dF0pO1xuICAgICAgbGV0IHJlc2V0Rmlyc3QgPSB0cnVlO1xuICAgICAgaWYgKGNoYW5nZWRJbnB1dC5sZW5ndGggPT09IDEgJiYgY2hhbmdlZElucHV0WzBdID09PSAnZm9ybScgJiZcbiAgICAgICAgdGhpcy5mb3JtVmFsdWVzSW5wdXQuc3RhcnRzV2l0aCgnZm9ybS4nKVxuICAgICAgKSB7XG4gICAgICAgIC8vIElmIG9ubHkgJ2Zvcm0nIGlucHV0IGNoYW5nZWQsIGdldCBuYW1lcyBvZiBjaGFuZ2VkIGtleXNcbiAgICAgICAgY2hhbmdlZElucHV0ID0gT2JqZWN0LmtleXModGhpcy5wcmV2aW91c0lucHV0cy5mb3JtIHx8IHt9KVxuICAgICAgICAgIC5maWx0ZXIoa2V5ID0+ICFfLmlzRXF1YWwodGhpcy5wcmV2aW91c0lucHV0cy5mb3JtW2tleV0sIHRoaXMuZm9ybVtrZXldKSlcbiAgICAgICAgICAubWFwKGtleSA9PiBgZm9ybS4ke2tleX1gKTtcbiAgICAgICAgcmVzZXRGaXJzdCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBvbmx5IGlucHV0IHZhbHVlcyBoYXZlIGNoYW5nZWQsIHVwZGF0ZSB0aGUgZm9ybSB2YWx1ZXNcbiAgICAgIGlmIChjaGFuZ2VkSW5wdXQubGVuZ3RoID09PSAxICYmIGNoYW5nZWRJbnB1dFswXSA9PT0gdGhpcy5mb3JtVmFsdWVzSW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybVZhbHVlc0lucHV0LmluZGV4T2YoJy4nKSA9PT0gLTEpIHtcbiAgICAgICAgICB0aGlzLnNldEZvcm1WYWx1ZXModGhpc1t0aGlzLmZvcm1WYWx1ZXNJbnB1dF0sIHJlc2V0Rmlyc3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IFtpbnB1dCwga2V5XSA9IHRoaXMuZm9ybVZhbHVlc0lucHV0LnNwbGl0KCcuJyk7XG4gICAgICAgICAgdGhpcy5zZXRGb3JtVmFsdWVzKHRoaXNbaW5wdXRdW2tleV0sIHJlc2V0Rmlyc3QpO1xuICAgICAgICB9XG5cbiAgICAgIC8vIElmIGFueXRoaW5nIGVsc2UgaGFzIGNoYW5nZWQsIHJlLXJlbmRlciB0aGUgZW50aXJlIGZvcm1cbiAgICAgIH0gZWxzZSBpZiAoY2hhbmdlZElucHV0Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVGb3JtKCk7XG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7IHRoaXMub25DaGFuZ2UodGhpcy5qc2YuZm9ybVZhbHVlcyk7IH1cbiAgICAgICAgaWYgKHRoaXMub25Ub3VjaGVkKSB7IHRoaXMub25Ub3VjaGVkKHRoaXMuanNmLmZvcm1WYWx1ZXMpOyB9XG4gICAgICB9XG5cbiAgICAgIC8vIFVwZGF0ZSBwcmV2aW91cyBpbnB1dHNcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMucHJldmlvdXNJbnB1dHMpXG4gICAgICAgIC5maWx0ZXIoaW5wdXQgPT4gdGhpcy5wcmV2aW91c0lucHV0c1tpbnB1dF0gIT09IHRoaXNbaW5wdXRdKVxuICAgICAgICAuZm9yRWFjaChpbnB1dCA9PiB0aGlzLnByZXZpb3VzSW5wdXRzW2lucHV0XSA9IHRoaXNbaW5wdXRdKTtcbiAgICB9XG4gIH1cblxuICBzZXRGb3JtVmFsdWVzKGZvcm1WYWx1ZXM6IGFueSwgcmVzZXRGaXJzdCA9IHRydWUpIHtcbiAgICBpZiAoZm9ybVZhbHVlcykge1xuICAgICAgbGV0IG5ld0Zvcm1WYWx1ZXMgPSB0aGlzLm9iamVjdFdyYXAgPyBmb3JtVmFsdWVzWycxJ10gOiBmb3JtVmFsdWVzO1xuICAgICAgaWYgKCF0aGlzLmpzZi5mb3JtR3JvdXApIHtcbiAgICAgICAgdGhpcy5qc2YuZm9ybVZhbHVlcyA9IGZvcm1WYWx1ZXM7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVGb3JtKCk7XG4gICAgICB9IGVsc2UgaWYgKHJlc2V0Rmlyc3QpIHtcbiAgICAgICAgdGhpcy5qc2YuZm9ybUdyb3VwLnJlc2V0KCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5qc2YuZm9ybUdyb3VwKSB7XG4gICAgICAgIHRoaXMuanNmLmZvcm1Hcm91cC5wYXRjaFZhbHVlKG5ld0Zvcm1WYWx1ZXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25DaGFuZ2UpIHsgdGhpcy5vbkNoYW5nZShuZXdGb3JtVmFsdWVzKTsgfVxuICAgICAgaWYgKHRoaXMub25Ub3VjaGVkKSB7IHRoaXMub25Ub3VjaGVkKG5ld0Zvcm1WYWx1ZXMpOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuanNmLmZvcm1Hcm91cC5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIHN1Ym1pdEZvcm0oKSB7XG4gICAgY29uc3QgdmFsaWREYXRhID0gdGhpcy5qc2YudmFsaWREYXRhO1xuICAgIHRoaXMub25TdWJtaXQuZW1pdCh0aGlzLm9iamVjdFdyYXAgPyB2YWxpZERhdGFbJzEnXSA6IHZhbGlkRGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogJ2luaXRpYWxpemVGb3JtJyBmdW5jdGlvblxuICAgKlxuICAgKiAtIFVwZGF0ZSAnc2NoZW1hJywgJ2xheW91dCcsIGFuZCAnZm9ybVZhbHVlcycsIGZyb20gaW5wdXRzLlxuICAgKlxuICAgKiAtIENyZWF0ZSAnc2NoZW1hUmVmTGlicmFyeScgYW5kICdzY2hlbWFSZWN1cnNpdmVSZWZNYXAnXG4gICAqICAgdG8gcmVzb2x2ZSBzY2hlbWEgJHJlZiBsaW5rcywgaW5jbHVkaW5nIHJlY3Vyc2l2ZSAkcmVmIGxpbmtzLlxuICAgKlxuICAgKiAtIENyZWF0ZSAnZGF0YVJlY3Vyc2l2ZVJlZk1hcCcgdG8gcmVzb2x2ZSByZWN1cnNpdmUgbGlua3MgaW4gZGF0YVxuICAgKiAgIGFuZCBjb3JlY3RseSBzZXQgb3V0cHV0IGZvcm1hdHMgZm9yIHJlY3Vyc2l2ZWx5IG5lc3RlZCB2YWx1ZXMuXG4gICAqXG4gICAqIC0gQ3JlYXRlICdsYXlvdXRSZWZMaWJyYXJ5JyBhbmQgJ3RlbXBsYXRlUmVmTGlicmFyeScgdG8gc3RvcmVcbiAgICogICBuZXcgbGF5b3V0IG5vZGVzIGFuZCBmb3JtR3JvdXAgZWxlbWVudHMgdG8gdXNlIHdoZW4gZHluYW1pY2FsbHlcbiAgICogICBhZGRpbmcgZm9ybSBjb21wb25lbnRzIHRvIGFycmF5cyBhbmQgcmVjdXJzaXZlICRyZWYgcG9pbnRzLlxuICAgKlxuICAgKiAtIENyZWF0ZSAnZGF0YU1hcCcgdG8gbWFwIHRoZSBkYXRhIHRvIHRoZSBzY2hlbWEgYW5kIHRlbXBsYXRlLlxuICAgKlxuICAgKiAtIENyZWF0ZSB0aGUgbWFzdGVyICdmb3JtR3JvdXBUZW1wbGF0ZScgdGhlbiBmcm9tIGl0ICdmb3JtR3JvdXAnXG4gICAqICAgdGhlIEFuZ3VsYXIgZm9ybUdyb3VwIHVzZWQgdG8gY29udHJvbCB0aGUgcmVhY3RpdmUgZm9ybS5cbiAgICovXG4gIGluaXRpYWxpemVGb3JtKCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMuc2NoZW1hIHx8IHRoaXMubGF5b3V0IHx8IHRoaXMuZGF0YSB8fCB0aGlzLmZvcm0gfHwgdGhpcy5tb2RlbCB8fFxuICAgICAgdGhpcy5KU09OU2NoZW1hIHx8IHRoaXMuVUlTY2hlbWEgfHwgdGhpcy5mb3JtRGF0YSB8fCB0aGlzLm5nTW9kZWwgfHxcbiAgICAgIHRoaXMuanNmLmRhdGFcbiAgICApIHtcblxuICAgICAgdGhpcy5qc2YucmVzZXRBbGxWYWx1ZXMoKTsgIC8vIFJlc2V0IGFsbCBmb3JtIHZhbHVlcyB0byBkZWZhdWx0c1xuICAgICAgdGhpcy5pbml0aWFsaXplT3B0aW9ucygpOyAgIC8vIFVwZGF0ZSBvcHRpb25zXG4gICAgICB0aGlzLmluaXRpYWxpemVTY2hlbWEoKTsgICAgLy8gVXBkYXRlIHNjaGVtYSwgc2NoZW1hUmVmTGlicmFyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzY2hlbWFSZWN1cnNpdmVSZWZNYXAsICYgZGF0YVJlY3Vyc2l2ZVJlZk1hcFxuICAgICAgdGhpcy5pbml0aWFsaXplTGF5b3V0KCk7ICAgIC8vIFVwZGF0ZSBsYXlvdXQsIGxheW91dFJlZkxpYnJhcnksXG4gICAgICB0aGlzLmluaXRpYWxpemVEYXRhKCk7ICAgICAgLy8gVXBkYXRlIGZvcm1WYWx1ZXNcbiAgICAgIHRoaXMuYWN0aXZhdGVGb3JtKCk7ICAgICAgICAvLyBVcGRhdGUgZGF0YU1hcCwgdGVtcGxhdGVSZWZMaWJyYXJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvcm1Hcm91cFRlbXBsYXRlLCBmb3JtR3JvdXBcblxuICAgICAgLy8gVW5jb21tZW50IGluZGl2aWR1YWwgbGluZXMgdG8gb3V0cHV0IGRlYnVnZ2luZyBpbmZvcm1hdGlvbiB0byBjb25zb2xlOlxuICAgICAgLy8gKFRoZXNlIGFsd2F5cyB3b3JrLilcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdsb2FkaW5nIGZvcm0uLi4nKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzY2hlbWEnLCB0aGlzLmpzZi5zY2hlbWEpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ2xheW91dCcsIHRoaXMuanNmLmxheW91dCk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnb3B0aW9ucycsIHRoaXMub3B0aW9ucyk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZm9ybVZhbHVlcycsIHRoaXMuanNmLmZvcm1WYWx1ZXMpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ2Zvcm1Hcm91cFRlbXBsYXRlJywgdGhpcy5qc2YuZm9ybUdyb3VwVGVtcGxhdGUpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ2Zvcm1Hcm91cCcsIHRoaXMuanNmLmZvcm1Hcm91cCk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZm9ybUdyb3VwLnZhbHVlJywgdGhpcy5qc2YuZm9ybUdyb3VwLnZhbHVlKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzY2hlbWFSZWZMaWJyYXJ5JywgdGhpcy5qc2Yuc2NoZW1hUmVmTGlicmFyeSk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnbGF5b3V0UmVmTGlicmFyeScsIHRoaXMuanNmLmxheW91dFJlZkxpYnJhcnkpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ3RlbXBsYXRlUmVmTGlicmFyeScsIHRoaXMuanNmLnRlbXBsYXRlUmVmTGlicmFyeSk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZGF0YU1hcCcsIHRoaXMuanNmLmRhdGFNYXApO1xuICAgICAgLy8gY29uc29sZS5sb2coJ2FycmF5TWFwJywgdGhpcy5qc2YuYXJyYXlNYXApO1xuICAgICAgLy8gY29uc29sZS5sb2coJ3NjaGVtYVJlY3Vyc2l2ZVJlZk1hcCcsIHRoaXMuanNmLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZGF0YVJlY3Vyc2l2ZVJlZk1hcCcsIHRoaXMuanNmLmRhdGFSZWN1cnNpdmVSZWZNYXApO1xuXG4gICAgICAvLyBVbmNvbW1lbnQgaW5kaXZpZHVhbCBsaW5lcyB0byBvdXRwdXQgZGVidWdnaW5nIGluZm9ybWF0aW9uIHRvIGJyb3dzZXI6XG4gICAgICAvLyAoVGhlc2Ugb25seSB3b3JrIGlmIHRoZSAnZGVidWcnIG9wdGlvbiBoYXMgYWxzbyBiZWVuIHNldCB0byAndHJ1ZScuKVxuICAgICAgaWYgKHRoaXMuZGVidWcgfHwgdGhpcy5qc2YuZm9ybU9wdGlvbnMuZGVidWcpIHtcbiAgICAgICAgY29uc3QgdmFyczogYW55W10gPSBbXTtcbiAgICAgICAgLy8gdmFycy5wdXNoKHRoaXMuanNmLnNjaGVtYSk7XG4gICAgICAgIC8vIHZhcnMucHVzaCh0aGlzLmpzZi5sYXlvdXQpO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5vcHRpb25zKTtcbiAgICAgICAgLy8gdmFycy5wdXNoKHRoaXMuanNmLmZvcm1WYWx1ZXMpO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2YuZm9ybUdyb3VwLnZhbHVlKTtcbiAgICAgICAgLy8gdmFycy5wdXNoKHRoaXMuanNmLmZvcm1Hcm91cFRlbXBsYXRlKTtcbiAgICAgICAgLy8gdmFycy5wdXNoKHRoaXMuanNmLmZvcm1Hcm91cCk7XG4gICAgICAgIC8vIHZhcnMucHVzaCh0aGlzLmpzZi5zY2hlbWFSZWZMaWJyYXJ5KTtcbiAgICAgICAgLy8gdmFycy5wdXNoKHRoaXMuanNmLmxheW91dFJlZkxpYnJhcnkpO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2YudGVtcGxhdGVSZWZMaWJyYXJ5KTtcbiAgICAgICAgLy8gdmFycy5wdXNoKHRoaXMuanNmLmRhdGFNYXApO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2YuYXJyYXlNYXApO1xuICAgICAgICAvLyB2YXJzLnB1c2godGhpcy5qc2Yuc2NoZW1hUmVjdXJzaXZlUmVmTWFwKTtcbiAgICAgICAgLy8gdmFycy5wdXNoKHRoaXMuanNmLmRhdGFSZWN1cnNpdmVSZWZNYXApO1xuICAgICAgICB0aGlzLmRlYnVnT3V0cHV0ID0gdmFycy5tYXAodiA9PiBKU09OLnN0cmluZ2lmeSh2LCBudWxsLCAyKSkuam9pbignXFxuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLmZvcm1Jbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICdpbml0aWFsaXplT3B0aW9ucycgZnVuY3Rpb25cbiAgICpcbiAgICogSW5pdGlhbGl6ZSAnb3B0aW9ucycgKGdsb2JhbCBmb3JtIG9wdGlvbnMpIGFuZCBzZXQgZnJhbWV3b3JrXG4gICAqIENvbWJpbmUgYXZhaWxhYmxlIGlucHV0czpcbiAgICogMS4gb3B0aW9ucyAtIHJlY29tbWVuZGVkXG4gICAqIDIuIGZvcm0ub3B0aW9ucyAtIFNpbmdsZSBpbnB1dCBzdHlsZVxuICAgKi9cbiAgcHJpdmF0ZSBpbml0aWFsaXplT3B0aW9ucygpIHtcbiAgICBpZiAodGhpcy5sYW5ndWFnZSAmJiB0aGlzLmxhbmd1YWdlICE9PSB0aGlzLmpzZi5sYW5ndWFnZSkge1xuICAgICAgdGhpcy5qc2Yuc2V0TGFuZ3VhZ2UodGhpcy5sYW5ndWFnZSk7XG4gICAgfVxuICAgIHRoaXMuanNmLnNldE9wdGlvbnMoeyBkZWJ1ZzogISF0aGlzLmRlYnVnIH0pO1xuICAgIGxldCBsb2FkRXh0ZXJuYWxBc3NldHM6IGJvb2xlYW4gPSB0aGlzLmxvYWRFeHRlcm5hbEFzc2V0cyB8fCBmYWxzZTtcbiAgICBsZXQgZnJhbWV3b3JrOiBhbnkgPSB0aGlzLmZyYW1ld29yayB8fCAnZGVmYXVsdCc7XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMub3B0aW9ucykpIHtcbiAgICAgIHRoaXMuanNmLnNldE9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICAgIGxvYWRFeHRlcm5hbEFzc2V0cyA9IHRoaXMub3B0aW9ucy5sb2FkRXh0ZXJuYWxBc3NldHMgfHwgbG9hZEV4dGVybmFsQXNzZXRzO1xuICAgICAgZnJhbWV3b3JrID0gdGhpcy5vcHRpb25zLmZyYW1ld29yayB8fCBmcmFtZXdvcms7XG4gICAgfVxuICAgIGlmIChpc09iamVjdCh0aGlzLmZvcm0pICYmIGlzT2JqZWN0KHRoaXMuZm9ybS5vcHRpb25zKSkge1xuICAgICAgdGhpcy5qc2Yuc2V0T3B0aW9ucyh0aGlzLmZvcm0ub3B0aW9ucyk7XG4gICAgICBsb2FkRXh0ZXJuYWxBc3NldHMgPSB0aGlzLmZvcm0ub3B0aW9ucy5sb2FkRXh0ZXJuYWxBc3NldHMgfHwgbG9hZEV4dGVybmFsQXNzZXRzO1xuICAgICAgZnJhbWV3b3JrID0gdGhpcy5mb3JtLm9wdGlvbnMuZnJhbWV3b3JrIHx8IGZyYW1ld29yaztcbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMud2lkZ2V0cykpIHtcbiAgICAgIHRoaXMuanNmLnNldE9wdGlvbnMoeyB3aWRnZXRzOiB0aGlzLndpZGdldHMgfSk7XG4gICAgfVxuICAgIHRoaXMuZnJhbWV3b3JrTGlicmFyeS5zZXRMb2FkRXh0ZXJuYWxBc3NldHMobG9hZEV4dGVybmFsQXNzZXRzKTtcbiAgICB0aGlzLmZyYW1ld29ya0xpYnJhcnkuc2V0RnJhbWV3b3JrKGZyYW1ld29yayk7XG4gICAgdGhpcy5qc2YuZnJhbWV3b3JrID0gdGhpcy5mcmFtZXdvcmtMaWJyYXJ5LmdldEZyYW1ld29yaygpO1xuICAgIGlmIChpc09iamVjdCh0aGlzLmpzZi5mb3JtT3B0aW9ucy53aWRnZXRzKSkge1xuICAgICAgZm9yIChsZXQgd2lkZ2V0IG9mIE9iamVjdC5rZXlzKHRoaXMuanNmLmZvcm1PcHRpb25zLndpZGdldHMpKSB7XG4gICAgICAgIHRoaXMud2lkZ2V0TGlicmFyeS5yZWdpc3RlcldpZGdldCh3aWRnZXQsIHRoaXMuanNmLmZvcm1PcHRpb25zLndpZGdldHNbd2lkZ2V0XSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc09iamVjdCh0aGlzLmZvcm0pICYmIGlzT2JqZWN0KHRoaXMuZm9ybS50cGxkYXRhKSkge1xuICAgICAgdGhpcy5qc2Yuc2V0VHBsZGF0YSh0aGlzLmZvcm0udHBsZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICdpbml0aWFsaXplU2NoZW1hJyBmdW5jdGlvblxuICAgKlxuICAgKiBJbml0aWFsaXplICdzY2hlbWEnXG4gICAqIFVzZSBmaXJzdCBhdmFpbGFibGUgaW5wdXQ6XG4gICAqIDEuIHNjaGVtYSAtIHJlY29tbWVuZGVkIC8gQW5ndWxhciBTY2hlbWEgRm9ybSBzdHlsZVxuICAgKiAyLiBmb3JtLnNjaGVtYSAtIFNpbmdsZSBpbnB1dCAvIEpTT04gRm9ybSBzdHlsZVxuICAgKiAzLiBKU09OU2NoZW1hIC0gUmVhY3QgSlNPTiBTY2hlbWEgRm9ybSBzdHlsZVxuICAgKiA0LiBmb3JtLkpTT05TY2hlbWEgLSBGb3IgdGVzdGluZyBzaW5nbGUgaW5wdXQgUmVhY3QgSlNPTiBTY2hlbWEgRm9ybXNcbiAgICogNS4gZm9ybSAtIEZvciB0ZXN0aW5nIHNpbmdsZSBzY2hlbWEtb25seSBpbnB1dHNcbiAgICpcbiAgICogLi4uIGlmIG5vIHNjaGVtYSBpbnB1dCBmb3VuZCwgdGhlICdhY3RpdmF0ZUZvcm0nIGZ1bmN0aW9uLCBiZWxvdyxcbiAgICogICAgIHdpbGwgbWFrZSB0d28gYWRkaXRpb25hbCBhdHRlbXB0cyB0byBidWlsZCBhIHNjaGVtYVxuICAgKiA2LiBJZiBsYXlvdXQgaW5wdXQgLSBidWlsZCBzY2hlbWEgZnJvbSBsYXlvdXRcbiAgICogNy4gSWYgZGF0YSBpbnB1dCAtIGJ1aWxkIHNjaGVtYSBmcm9tIGRhdGFcbiAgICovXG4gIHByaXZhdGUgaW5pdGlhbGl6ZVNjaGVtYSgpIHtcblxuICAgIC8vIFRPRE86IHVwZGF0ZSB0byBhbGxvdyBub24tb2JqZWN0IHNjaGVtYXNcblxuICAgIGlmIChpc09iamVjdCh0aGlzLnNjaGVtYSkpIHtcbiAgICAgIHRoaXMuanNmLkFuZ3VsYXJTY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICB0aGlzLmpzZi5zY2hlbWEgPSBfLmNsb25lRGVlcCh0aGlzLnNjaGVtYSk7XG4gICAgfSBlbHNlIGlmIChoYXNPd24odGhpcy5mb3JtLCAnc2NoZW1hJykgJiYgaXNPYmplY3QodGhpcy5mb3JtLnNjaGVtYSkpIHtcbiAgICAgIHRoaXMuanNmLnNjaGVtYSA9IF8uY2xvbmVEZWVwKHRoaXMuZm9ybS5zY2hlbWEpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodGhpcy5KU09OU2NoZW1hKSkge1xuICAgICAgdGhpcy5qc2YuUmVhY3RKc29uU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgdGhpcy5qc2Yuc2NoZW1hID0gXy5jbG9uZURlZXAodGhpcy5KU09OU2NoZW1hKTtcbiAgICB9IGVsc2UgaWYgKGhhc093bih0aGlzLmZvcm0sICdKU09OU2NoZW1hJykgJiYgaXNPYmplY3QodGhpcy5mb3JtLkpTT05TY2hlbWEpKSB7XG4gICAgICB0aGlzLmpzZi5SZWFjdEpzb25TY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICB0aGlzLmpzZi5zY2hlbWEgPSBfLmNsb25lRGVlcCh0aGlzLmZvcm0uSlNPTlNjaGVtYSk7XG4gICAgfSBlbHNlIGlmIChoYXNPd24odGhpcy5mb3JtLCAncHJvcGVydGllcycpICYmIGlzT2JqZWN0KHRoaXMuZm9ybS5wcm9wZXJ0aWVzKSkge1xuICAgICAgdGhpcy5qc2Yuc2NoZW1hID0gXy5jbG9uZURlZXAodGhpcy5mb3JtKTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuZm9ybSkpIHtcbiAgICAgIC8vIFRPRE86IEhhbmRsZSBvdGhlciB0eXBlcyBvZiBmb3JtIGlucHV0XG4gICAgfVxuXG4gICAgaWYgKCFpc0VtcHR5KHRoaXMuanNmLnNjaGVtYSkpIHtcblxuICAgICAgLy8gSWYgb3RoZXIgdHlwZXMgYWxzbyBhbGxvd2VkLCByZW5kZXIgc2NoZW1hIGFzIGFuIG9iamVjdFxuICAgICAgaWYgKGluQXJyYXkoJ29iamVjdCcsIHRoaXMuanNmLnNjaGVtYS50eXBlKSkge1xuICAgICAgICB0aGlzLmpzZi5zY2hlbWEudHlwZSA9ICdvYmplY3QnO1xuICAgICAgfVxuXG4gICAgICAvLyBXcmFwIG5vbi1vYmplY3Qgc2NoZW1hcyBpbiBvYmplY3QuXG4gICAgICBpZiAoaGFzT3duKHRoaXMuanNmLnNjaGVtYSwgJ3R5cGUnKSAmJiB0aGlzLmpzZi5zY2hlbWEudHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5qc2Yuc2NoZW1hID0ge1xuICAgICAgICAgICd0eXBlJzogJ29iamVjdCcsXG4gICAgICAgICAgJ3Byb3BlcnRpZXMnOiB7IDE6IHRoaXMuanNmLnNjaGVtYSB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub2JqZWN0V3JhcCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKCFoYXNPd24odGhpcy5qc2Yuc2NoZW1hLCAndHlwZScpKSB7XG5cbiAgICAgICAgLy8gQWRkIHR5cGUgPSAnb2JqZWN0JyBpZiBtaXNzaW5nXG4gICAgICAgIGlmIChpc09iamVjdCh0aGlzLmpzZi5zY2hlbWEucHJvcGVydGllcykgfHxcbiAgICAgICAgICBpc09iamVjdCh0aGlzLmpzZi5zY2hlbWEucGF0dGVyblByb3BlcnRpZXMpIHx8XG4gICAgICAgICAgaXNPYmplY3QodGhpcy5qc2Yuc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLmpzZi5zY2hlbWEudHlwZSA9ICdvYmplY3QnO1xuXG4gICAgICAgIC8vIEZpeCBKU09OIHNjaGVtYSBzaG9ydGhhbmQgKEpTT04gRm9ybSBzdHlsZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmpzZi5Kc29uRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuanNmLnNjaGVtYSA9IHtcbiAgICAgICAgICAgICd0eXBlJzogJ29iamVjdCcsXG4gICAgICAgICAgICAncHJvcGVydGllcyc6IHRoaXMuanNmLnNjaGVtYVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgbmVlZGVkLCB1cGRhdGUgSlNPTiBTY2hlbWEgdG8gZHJhZnQgNiBmb3JtYXQsIGluY2x1ZGluZ1xuICAgICAgLy8gZHJhZnQgMyAoSlNPTiBGb3JtIHN0eWxlKSBhbmQgZHJhZnQgNCAoQW5ndWxhciBTY2hlbWEgRm9ybSBzdHlsZSlcbiAgICAgIHRoaXMuanNmLnNjaGVtYSA9IGNvbnZlcnRTY2hlbWFUb0RyYWZ0Nih0aGlzLmpzZi5zY2hlbWEpO1xuXG4gICAgICAvLyBJbml0aWFsaXplIGFqdiBhbmQgY29tcGlsZSBzY2hlbWFcbiAgICAgIHRoaXMuanNmLmNvbXBpbGVBanZTY2hlbWEoKTtcblxuICAgICAgLy8gQ3JlYXRlIHNjaGVtYVJlZkxpYnJhcnksIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCwgZGF0YVJlY3Vyc2l2ZVJlZk1hcCwgJiBhcnJheU1hcFxuICAgICAgdGhpcy5qc2Yuc2NoZW1hID0gcmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXMoXG4gICAgICAgIHRoaXMuanNmLnNjaGVtYSwgdGhpcy5qc2Yuc2NoZW1hUmVmTGlicmFyeSwgdGhpcy5qc2Yuc2NoZW1hUmVjdXJzaXZlUmVmTWFwLFxuICAgICAgICB0aGlzLmpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLCB0aGlzLmpzZi5hcnJheU1hcFxuICAgICAgKTtcbiAgICAgIGlmIChoYXNPd24odGhpcy5qc2Yuc2NoZW1hUmVmTGlicmFyeSwgJycpKSB7XG4gICAgICAgIHRoaXMuanNmLmhhc1Jvb3RSZWZlcmVuY2UgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiAoPykgUmVzb2x2ZSBleHRlcm5hbCAkcmVmIGxpbmtzXG4gICAgICAvLyAvLyBDcmVhdGUgc2NoZW1hUmVmTGlicmFyeSAmIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcFxuICAgICAgLy8gdGhpcy5wYXJzZXIuYnVuZGxlKHRoaXMuc2NoZW1hKVxuICAgICAgLy8gICAudGhlbihzY2hlbWEgPT4gdGhpcy5zY2hlbWEgPSByZXNvbHZlU2NoZW1hUmVmZXJlbmNlcyhcbiAgICAgIC8vICAgICBzY2hlbWEsIHRoaXMuanNmLnNjaGVtYVJlZkxpYnJhcnksXG4gICAgICAvLyAgICAgdGhpcy5qc2Yuc2NoZW1hUmVjdXJzaXZlUmVmTWFwLCB0aGlzLmpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwXG4gICAgICAvLyAgICkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAnaW5pdGlhbGl6ZURhdGEnIGZ1bmN0aW9uXG4gICAqXG4gICAqIEluaXRpYWxpemUgJ2Zvcm1WYWx1ZXMnXG4gICAqIGRlZnVsYXQgb3IgcHJldmlvdXNseSBzdWJtaXR0ZWQgdmFsdWVzIHVzZWQgdG8gcG9wdWxhdGUgZm9ybVxuICAgKiBVc2UgZmlyc3QgYXZhaWxhYmxlIGlucHV0OlxuICAgKiAxLiBkYXRhIC0gcmVjb21tZW5kZWRcbiAgICogMi4gbW9kZWwgLSBBbmd1bGFyIFNjaGVtYSBGb3JtIHN0eWxlXG4gICAqIDMuIGZvcm0udmFsdWUgLSBKU09OIEZvcm0gc3R5bGVcbiAgICogNC4gZm9ybS5kYXRhIC0gU2luZ2xlIGlucHV0IHN0eWxlXG4gICAqIDUuIGZvcm1EYXRhIC0gUmVhY3QgSlNPTiBTY2hlbWEgRm9ybSBzdHlsZVxuICAgKiA2LiBmb3JtLmZvcm1EYXRhIC0gRm9yIGVhc2llciB0ZXN0aW5nIG9mIFJlYWN0IEpTT04gU2NoZW1hIEZvcm1zXG4gICAqIDcuIChub25lKSBubyBkYXRhIC0gaW5pdGlhbGl6ZSBkYXRhIGZyb20gc2NoZW1hIGFuZCBsYXlvdXQgZGVmYXVsdHMgb25seVxuICAgKi9cbiAgcHJpdmF0ZSBpbml0aWFsaXplRGF0YSgpIHtcbiAgICBpZiAoaGFzVmFsdWUodGhpcy5kYXRhKSkge1xuICAgICAgdGhpcy5qc2YuZm9ybVZhbHVlcyA9IF8uY2xvbmVEZWVwKHRoaXMuZGF0YSk7XG4gICAgICB0aGlzLmZvcm1WYWx1ZXNJbnB1dCA9ICdkYXRhJztcbiAgICB9IGVsc2UgaWYgKGhhc1ZhbHVlKHRoaXMubW9kZWwpKSB7XG4gICAgICB0aGlzLmpzZi5Bbmd1bGFyU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgdGhpcy5qc2YuZm9ybVZhbHVlcyA9IF8uY2xvbmVEZWVwKHRoaXMubW9kZWwpO1xuICAgICAgdGhpcy5mb3JtVmFsdWVzSW5wdXQgPSAnbW9kZWwnO1xuICAgIH0gZWxzZSBpZiAoaGFzVmFsdWUodGhpcy5uZ01vZGVsKSkge1xuICAgICAgdGhpcy5qc2YuQW5ndWxhclNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuanNmLmZvcm1WYWx1ZXMgPSBfLmNsb25lRGVlcCh0aGlzLm5nTW9kZWwpO1xuICAgICAgdGhpcy5mb3JtVmFsdWVzSW5wdXQgPSAnbmdNb2RlbCc7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdCh0aGlzLmZvcm0pICYmIGhhc1ZhbHVlKHRoaXMuZm9ybS52YWx1ZSkpIHtcbiAgICAgIHRoaXMuanNmLkpzb25Gb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICB0aGlzLmpzZi5mb3JtVmFsdWVzID0gXy5jbG9uZURlZXAodGhpcy5mb3JtLnZhbHVlKTtcbiAgICAgIHRoaXMuZm9ybVZhbHVlc0lucHV0ID0gJ2Zvcm0udmFsdWUnO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodGhpcy5mb3JtKSAmJiBoYXNWYWx1ZSh0aGlzLmZvcm0uZGF0YSkpIHtcbiAgICAgIHRoaXMuanNmLmZvcm1WYWx1ZXMgPSBfLmNsb25lRGVlcCh0aGlzLmZvcm0uZGF0YSk7XG4gICAgICB0aGlzLmZvcm1WYWx1ZXNJbnB1dCA9ICdmb3JtLmRhdGEnO1xuICAgIH0gZWxzZSBpZiAoaGFzVmFsdWUodGhpcy5mb3JtRGF0YSkpIHtcbiAgICAgIHRoaXMuanNmLlJlYWN0SnNvblNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm9ybVZhbHVlc0lucHV0ID0gJ2Zvcm1EYXRhJztcbiAgICB9IGVsc2UgaWYgKGhhc093bih0aGlzLmZvcm0sICdmb3JtRGF0YScpICYmIGhhc1ZhbHVlKHRoaXMuZm9ybS5mb3JtRGF0YSkpIHtcbiAgICAgIHRoaXMuanNmLlJlYWN0SnNvblNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuanNmLmZvcm1WYWx1ZXMgPSBfLmNsb25lRGVlcCh0aGlzLmZvcm0uZm9ybURhdGEpO1xuICAgICAgdGhpcy5mb3JtVmFsdWVzSW5wdXQgPSAnZm9ybS5mb3JtRGF0YSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9ybVZhbHVlc0lucHV0ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ2luaXRpYWxpemVMYXlvdXQnIGZ1bmN0aW9uXG4gICAqXG4gICAqIEluaXRpYWxpemUgJ2xheW91dCdcbiAgICogVXNlIGZpcnN0IGF2YWlsYWJsZSBhcnJheSBpbnB1dDpcbiAgICogMS4gbGF5b3V0IC0gcmVjb21tZW5kZWRcbiAgICogMi4gZm9ybSAtIEFuZ3VsYXIgU2NoZW1hIEZvcm0gc3R5bGVcbiAgICogMy4gZm9ybS5mb3JtIC0gSlNPTiBGb3JtIHN0eWxlXG4gICAqIDQuIGZvcm0ubGF5b3V0IC0gU2luZ2xlIGlucHV0IHN0eWxlXG4gICAqIDUuIChub25lKSBubyBsYXlvdXQgLSBzZXQgZGVmYXVsdCBsYXlvdXQgaW5zdGVhZFxuICAgKiAgICAoZnVsbCBsYXlvdXQgd2lsbCBiZSBidWlsdCBsYXRlciBmcm9tIHRoZSBzY2hlbWEpXG4gICAqXG4gICAqIEFsc28sIGlmIGFsdGVybmF0ZSBsYXlvdXQgZm9ybWF0cyBhcmUgYXZhaWxhYmxlLFxuICAgKiBpbXBvcnQgZnJvbSAnVUlTY2hlbWEnIG9yICdjdXN0b21Gb3JtSXRlbXMnXG4gICAqIHVzZWQgZm9yIFJlYWN0IEpTT04gU2NoZW1hIEZvcm0gYW5kIEpTT04gRm9ybSBBUEkgY29tcGF0aWJpbGl0eVxuICAgKiBVc2UgZmlyc3QgYXZhaWxhYmxlIGlucHV0OlxuICAgKiAxLiBVSVNjaGVtYSAtIFJlYWN0IEpTT04gU2NoZW1hIEZvcm0gc3R5bGVcbiAgICogMi4gZm9ybS5VSVNjaGVtYSAtIEZvciB0ZXN0aW5nIHNpbmdsZSBpbnB1dCBSZWFjdCBKU09OIFNjaGVtYSBGb3Jtc1xuICAgKiAyLiBmb3JtLmN1c3RvbUZvcm1JdGVtcyAtIEpTT04gRm9ybSBzdHlsZVxuICAgKiAzLiAobm9uZSkgbm8gaW5wdXQgLSBkb24ndCBpbXBvcnRcbiAgICovXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUxheW91dCgpIHtcblxuICAgIC8vIFJlbmFtZSBKU09OIEZvcm0tc3R5bGUgJ29wdGlvbnMnIGxpc3RzIHRvXG4gICAgLy8gQW5ndWxhciBTY2hlbWEgRm9ybS1zdHlsZSAndGl0bGVNYXAnIGxpc3RzLlxuICAgIGNvbnN0IGZpeEpzb25Gb3JtT3B0aW9ucyA9IChsYXlvdXQ6IGFueSk6IGFueSA9PiB7XG4gICAgICBpZiAoaXNPYmplY3QobGF5b3V0KSB8fCBpc0FycmF5KGxheW91dCkpIHtcbiAgICAgICAgZm9yRWFjaChsYXlvdXQsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgaWYgKGhhc093bih2YWx1ZSwgJ29wdGlvbnMnKSAmJiBpc09iamVjdCh2YWx1ZS5vcHRpb25zKSkge1xuICAgICAgICAgICAgdmFsdWUudGl0bGVNYXAgPSB2YWx1ZS5vcHRpb25zO1xuICAgICAgICAgICAgZGVsZXRlIHZhbHVlLm9wdGlvbnM7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAndG9wLWRvd24nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsYXlvdXQ7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGxheW91dCBpbnB1dHMgYW5kLCBpZiBmb3VuZCwgaW5pdGlhbGl6ZSBmb3JtIGxheW91dFxuICAgIGlmIChpc0FycmF5KHRoaXMubGF5b3V0KSkge1xuICAgICAgdGhpcy5qc2YubGF5b3V0ID0gXy5jbG9uZURlZXAodGhpcy5sYXlvdXQpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh0aGlzLmZvcm0pKSB7XG4gICAgICB0aGlzLmpzZi5Bbmd1bGFyU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgdGhpcy5qc2YubGF5b3V0ID0gXy5jbG9uZURlZXAodGhpcy5mb3JtKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZm9ybSAmJiBpc0FycmF5KHRoaXMuZm9ybS5mb3JtKSkge1xuICAgICAgdGhpcy5qc2YuSnNvbkZvcm1Db21wYXRpYmlsaXR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuanNmLmxheW91dCA9IGZpeEpzb25Gb3JtT3B0aW9ucyhfLmNsb25lRGVlcCh0aGlzLmZvcm0uZm9ybSkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtICYmIGlzQXJyYXkodGhpcy5mb3JtLmxheW91dCkpIHtcbiAgICAgIHRoaXMuanNmLmxheW91dCA9IF8uY2xvbmVEZWVwKHRoaXMuZm9ybS5sYXlvdXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmpzZi5sYXlvdXQgPSBbJyonXTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgYWx0ZXJuYXRlIGxheW91dCBpbnB1dHNcbiAgICBsZXQgYWx0ZXJuYXRlTGF5b3V0OiBhbnkgPSBudWxsO1xuICAgIGlmIChpc09iamVjdCh0aGlzLlVJU2NoZW1hKSkge1xuICAgICAgdGhpcy5qc2YuUmVhY3RKc29uU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgYWx0ZXJuYXRlTGF5b3V0ID0gXy5jbG9uZURlZXAodGhpcy5VSVNjaGVtYSk7XG4gICAgfSBlbHNlIGlmIChoYXNPd24odGhpcy5mb3JtLCAnVUlTY2hlbWEnKSkge1xuICAgICAgdGhpcy5qc2YuUmVhY3RKc29uU2NoZW1hRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgYWx0ZXJuYXRlTGF5b3V0ID0gXy5jbG9uZURlZXAodGhpcy5mb3JtLlVJU2NoZW1hKTtcbiAgICB9IGVsc2UgaWYgKGhhc093bih0aGlzLmZvcm0sICd1aVNjaGVtYScpKSB7XG4gICAgICB0aGlzLmpzZi5SZWFjdEpzb25TY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IHRydWU7XG4gICAgICBhbHRlcm5hdGVMYXlvdXQgPSBfLmNsb25lRGVlcCh0aGlzLmZvcm0udWlTY2hlbWEpO1xuICAgIH0gZWxzZSBpZiAoaGFzT3duKHRoaXMuZm9ybSwgJ2N1c3RvbUZvcm1JdGVtcycpKSB7XG4gICAgICB0aGlzLmpzZi5Kc29uRm9ybUNvbXBhdGliaWxpdHkgPSB0cnVlO1xuICAgICAgYWx0ZXJuYXRlTGF5b3V0ID0gZml4SnNvbkZvcm1PcHRpb25zKF8uY2xvbmVEZWVwKHRoaXMuZm9ybS5jdXN0b21Gb3JtSXRlbXMpKTtcbiAgICB9XG5cbiAgICAvLyBpZiBhbHRlcm5hdGUgbGF5b3V0IGZvdW5kLCBjb3B5IGFsdGVybmF0ZSBsYXlvdXQgb3B0aW9ucyBpbnRvIHNjaGVtYVxuICAgIGlmIChhbHRlcm5hdGVMYXlvdXQpIHtcbiAgICAgIEpzb25Qb2ludGVyLmZvckVhY2hEZWVwKGFsdGVybmF0ZUxheW91dCwgKHZhbHVlLCBwb2ludGVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjaGVtYVBvaW50ZXIgPSBwb2ludGVyXG4gICAgICAgICAgLnJlcGxhY2UoL1xcLy9nLCAnL3Byb3BlcnRpZXMvJylcbiAgICAgICAgICAucmVwbGFjZSgvXFwvcHJvcGVydGllc1xcL2l0ZW1zXFwvcHJvcGVydGllc1xcLy9nLCAnL2l0ZW1zL3Byb3BlcnRpZXMvJylcbiAgICAgICAgICAucmVwbGFjZSgvXFwvcHJvcGVydGllc1xcL3RpdGxlTWFwXFwvcHJvcGVydGllc1xcLy9nLCAnL3RpdGxlTWFwL3Byb3BlcnRpZXMvJyk7XG4gICAgICAgIGlmIChoYXNWYWx1ZSh2YWx1ZSkgJiYgaGFzVmFsdWUocG9pbnRlcikpIHtcbiAgICAgICAgICBsZXQga2V5ID0gSnNvblBvaW50ZXIudG9LZXkocG9pbnRlcik7XG4gICAgICAgICAgY29uc3QgZ3JvdXBQb2ludGVyID0gKEpzb25Qb2ludGVyLnBhcnNlKHNjaGVtYVBvaW50ZXIpIHx8IFtdKS5zbGljZSgwLCAtMik7XG4gICAgICAgICAgbGV0IGl0ZW1Qb2ludGVyOiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAgICAgICAgIC8vIElmICd1aTpvcmRlcicgb2JqZWN0IGZvdW5kLCBjb3B5IGludG8gb2JqZWN0IHNjaGVtYSByb290XG4gICAgICAgICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSAndWk6b3JkZXInKSB7XG4gICAgICAgICAgICBpdGVtUG9pbnRlciA9IFsuLi5ncm91cFBvaW50ZXIsICd1aTpvcmRlciddO1xuXG4gICAgICAgICAgLy8gQ29weSBvdGhlciBhbHRlcm5hdGUgbGF5b3V0IG9wdGlvbnMgdG8gc2NoZW1hICd4LXNjaGVtYS1mb3JtJyxcbiAgICAgICAgICAvLyAobGlrZSBBbmd1bGFyIFNjaGVtYSBGb3JtIG9wdGlvbnMpIGFuZCByZW1vdmUgYW55ICd1aTonIHByZWZpeGVzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChrZXkuc2xpY2UoMCwgMykudG9Mb3dlckNhc2UoKSA9PT0gJ3VpOicpIHsga2V5ID0ga2V5LnNsaWNlKDMpOyB9XG4gICAgICAgICAgICBpdGVtUG9pbnRlciA9IFsuLi5ncm91cFBvaW50ZXIsICd4LXNjaGVtYS1mb3JtJywga2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKEpzb25Qb2ludGVyLmhhcyh0aGlzLmpzZi5zY2hlbWEsIGdyb3VwUG9pbnRlcikgJiZcbiAgICAgICAgICAgICFKc29uUG9pbnRlci5oYXModGhpcy5qc2Yuc2NoZW1hLCBpdGVtUG9pbnRlcilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldCh0aGlzLmpzZi5zY2hlbWEsIGl0ZW1Qb2ludGVyLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ2FjdGl2YXRlRm9ybScgZnVuY3Rpb25cbiAgICpcbiAgICogLi4uY29udGludWVkIGZyb20gJ2luaXRpYWxpemVTY2hlbWEnIGZ1bmN0aW9uLCBhYm92ZVxuICAgKiBJZiAnc2NoZW1hJyBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgKGkuZS4gbm8gc2NoZW1hIGlucHV0IGZvdW5kKVxuICAgKiA2LiBJZiBsYXlvdXQgaW5wdXQgLSBidWlsZCBzY2hlbWEgZnJvbSBsYXlvdXQgaW5wdXRcbiAgICogNy4gSWYgZGF0YSBpbnB1dCAtIGJ1aWxkIHNjaGVtYSBmcm9tIGRhdGEgaW5wdXRcbiAgICpcbiAgICogQ3JlYXRlIGZpbmFsIGxheW91dCxcbiAgICogYnVpbGQgdGhlIEZvcm1Hcm91cCB0ZW1wbGF0ZSBhbmQgdGhlIEFuZ3VsYXIgRm9ybUdyb3VwLFxuICAgKiBzdWJzY3JpYmUgdG8gY2hhbmdlcyxcbiAgICogYW5kIGFjdGl2YXRlIHRoZSBmb3JtLlxuICAgKi9cbiAgcHJpdmF0ZSBhY3RpdmF0ZUZvcm0oKSB7XG5cbiAgICAvLyBJZiAnc2NoZW1hJyBub3QgaW5pdGlhbGl6ZWRcbiAgICBpZiAoaXNFbXB0eSh0aGlzLmpzZi5zY2hlbWEpKSB7XG5cbiAgICAgIC8vIFRPRE86IElmIGZ1bGwgbGF5b3V0IGlucHV0ICh3aXRoIG5vICcqJyksIGJ1aWxkIHNjaGVtYSBmcm9tIGxheW91dFxuICAgICAgLy8gaWYgKCF0aGlzLmpzZi5sYXlvdXQuaW5jbHVkZXMoJyonKSkge1xuICAgICAgLy8gICB0aGlzLmpzZi5idWlsZFNjaGVtYUZyb21MYXlvdXQoKTtcbiAgICAgIC8vIH0gZWxzZVxuXG4gICAgICAvLyBJZiBkYXRhIGlucHV0LCBidWlsZCBzY2hlbWEgZnJvbSBkYXRhXG4gICAgICBpZiAoIWlzRW1wdHkodGhpcy5qc2YuZm9ybVZhbHVlcykpIHtcbiAgICAgICAgdGhpcy5qc2YuYnVpbGRTY2hlbWFGcm9tRGF0YSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNFbXB0eSh0aGlzLmpzZi5zY2hlbWEpKSB7XG5cbiAgICAgIC8vIElmIG5vdCBhbHJlYWR5IGluaXRpYWxpemVkLCBpbml0aWFsaXplIGFqdiBhbmQgY29tcGlsZSBzY2hlbWFcbiAgICAgIHRoaXMuanNmLmNvbXBpbGVBanZTY2hlbWEoKTtcblxuICAgICAgLy8gVXBkYXRlIGFsbCBsYXlvdXQgZWxlbWVudHMsIGFkZCB2YWx1ZXMsIHdpZGdldHMsIGFuZCB2YWxpZGF0b3JzLFxuICAgICAgLy8gcmVwbGFjZSBhbnkgJyonIHdpdGggYSBsYXlvdXQgYnVpbHQgZnJvbSBhbGwgc2NoZW1hIGVsZW1lbnRzLFxuICAgICAgLy8gYW5kIHVwZGF0ZSB0aGUgRm9ybUdyb3VwIHRlbXBsYXRlIHdpdGggYW55IG5ldyB2YWxpZGF0b3JzXG4gICAgICB0aGlzLmpzZi5idWlsZExheW91dCh0aGlzLndpZGdldExpYnJhcnkpO1xuXG4gICAgICAvLyBCdWlsZCB0aGUgQW5ndWxhciBGb3JtR3JvdXAgdGVtcGxhdGUgZnJvbSB0aGUgc2NoZW1hXG4gICAgICB0aGlzLmpzZi5idWlsZEZvcm1Hcm91cFRlbXBsYXRlKHRoaXMuanNmLmZvcm1WYWx1ZXMpO1xuXG4gICAgICAvLyBCdWlsZCB0aGUgcmVhbCBBbmd1bGFyIEZvcm1Hcm91cCBmcm9tIHRoZSBGb3JtR3JvdXAgdGVtcGxhdGVcbiAgICAgIHRoaXMuanNmLmJ1aWxkRm9ybUdyb3VwKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuanNmLmZvcm1Hcm91cCkge1xuXG4gICAgICAvLyBSZXNldCBpbml0aWFsIGZvcm0gdmFsdWVzXG4gICAgICBpZiAoIWlzRW1wdHkodGhpcy5qc2YuZm9ybVZhbHVlcykgJiZcbiAgICAgICAgdGhpcy5qc2YuZm9ybU9wdGlvbnMuc2V0U2NoZW1hRGVmYXVsdHMgIT09IHRydWUgJiZcbiAgICAgICAgdGhpcy5qc2YuZm9ybU9wdGlvbnMuc2V0TGF5b3V0RGVmYXVsdHMgIT09IHRydWVcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNldEZvcm1WYWx1ZXModGhpcy5qc2YuZm9ybVZhbHVlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IEZpZ3VyZSBvdXQgaG93IHRvIGRpc3BsYXkgY2FsY3VsYXRlZCB2YWx1ZXMgd2l0aG91dCBjaGFuZ2luZyBvYmplY3QgZGF0YVxuICAgICAgLy8gU2VlIGh0dHA6Ly91bGlvbi5naXRodWIuaW8vanNvbmZvcm0vcGxheWdyb3VuZC8/ZXhhbXBsZT10ZW1wbGF0aW5nLXZhbHVlc1xuICAgICAgLy8gQ2FsY3VsYXRlIHJlZmVyZW5jZXMgdG8gb3RoZXIgZmllbGRzXG4gICAgICAvLyBpZiAoIWlzRW1wdHkodGhpcy5qc2YuZm9ybUdyb3VwLnZhbHVlKSkge1xuICAgICAgLy8gICBmb3JFYWNoKHRoaXMuanNmLmZvcm1Hcm91cC52YWx1ZSwgKHZhbHVlLCBrZXksIG9iamVjdCwgcm9vdE9iamVjdCkgPT4ge1xuICAgICAgLy8gICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyAgICAgICBvYmplY3Rba2V5XSA9IHRoaXMuanNmLnBhcnNlVGV4dCh2YWx1ZSwgdmFsdWUsIHJvb3RPYmplY3QsIGtleSk7XG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICB9LCAndG9wLWRvd24nKTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gU3Vic2NyaWJlIHRvIGZvcm0gY2hhbmdlcyB0byBvdXRwdXQgbGl2ZSBkYXRhLCB2YWxpZGF0aW9uLCBhbmQgZXJyb3JzXG4gICAgICB0aGlzLmpzZi5kYXRhQ2hhbmdlcy5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VzLmVtaXQodGhpcy5vYmplY3RXcmFwID8gZGF0YVsnMSddIDogZGF0YSk7XG4gICAgICAgIGlmICh0aGlzLmZvcm1WYWx1ZXNJbnB1dCAmJiB0aGlzLmZvcm1WYWx1ZXNJbnB1dC5pbmRleE9mKCcuJykgPT09IC0xKSB7XG4gICAgICAgICAgdGhpc1tgJHt0aGlzLmZvcm1WYWx1ZXNJbnB1dH1DaGFuZ2VgXS5lbWl0KHRoaXMub2JqZWN0V3JhcCA/IGRhdGFbJzEnXSA6IGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gVHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIG9uIHN0YXR1c0NoYW5nZXMgdG8gc2hvdyB1cGRhdGVkIGVycm9yc1xuICAgICAgdGhpcy5qc2YuZm9ybUdyb3VwLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCkpO1xuICAgICAgdGhpcy5qc2YuaXNWYWxpZENoYW5nZXMuc3Vic2NyaWJlKGlzVmFsaWQgPT4gdGhpcy5pc1ZhbGlkLmVtaXQoaXNWYWxpZCkpO1xuICAgICAgdGhpcy5qc2YudmFsaWRhdGlvbkVycm9yQ2hhbmdlcy5zdWJzY3JpYmUoZXJyID0+IHRoaXMudmFsaWRhdGlvbkVycm9ycy5lbWl0KGVycikpO1xuXG4gICAgICAvLyBPdXRwdXQgZmluYWwgc2NoZW1hLCBmaW5hbCBsYXlvdXQsIGFuZCBpbml0aWFsIGRhdGFcbiAgICAgIHRoaXMuZm9ybVNjaGVtYS5lbWl0KHRoaXMuanNmLnNjaGVtYSk7XG4gICAgICB0aGlzLmZvcm1MYXlvdXQuZW1pdCh0aGlzLmpzZi5sYXlvdXQpO1xuICAgICAgdGhpcy5vbkNoYW5nZXMuZW1pdCh0aGlzLm9iamVjdFdyYXAgPyB0aGlzLmpzZi5kYXRhWycxJ10gOiB0aGlzLmpzZi5kYXRhKTtcblxuICAgICAgLy8gSWYgdmFsaWRhdGVPblJlbmRlciwgb3V0cHV0IGluaXRpYWwgdmFsaWRhdGlvbiBhbmQgYW55IGVycm9yc1xuICAgICAgY29uc3QgdmFsaWRhdGVPblJlbmRlciA9XG4gICAgICAgIEpzb25Qb2ludGVyLmdldCh0aGlzLmpzZiwgJy9mb3JtT3B0aW9ucy92YWxpZGF0ZU9uUmVuZGVyJyk7XG4gICAgICBpZiAodmFsaWRhdGVPblJlbmRlcikgeyAvLyB2YWxpZGF0ZU9uUmVuZGVyID09PSAnYXV0bycgfHwgdHJ1ZVxuICAgICAgICBjb25zdCB0b3VjaEFsbCA9IChjb250cm9sKSA9PiB7XG4gICAgICAgICAgaWYgKHZhbGlkYXRlT25SZW5kZXIgPT09IHRydWUgfHwgaGFzVmFsdWUoY29udHJvbC52YWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBPYmplY3Qua2V5cyhjb250cm9sLmNvbnRyb2xzIHx8IHt9KVxuICAgICAgICAgICAgLmZvckVhY2goa2V5ID0+IHRvdWNoQWxsKGNvbnRyb2wuY29udHJvbHNba2V5XSkpO1xuICAgICAgICB9O1xuICAgICAgICB0b3VjaEFsbCh0aGlzLmpzZi5mb3JtR3JvdXApO1xuICAgICAgICB0aGlzLmlzVmFsaWQuZW1pdCh0aGlzLmpzZi5pc1ZhbGlkKTtcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uRXJyb3JzLmVtaXQodGhpcy5qc2YuYWp2RXJyb3JzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==