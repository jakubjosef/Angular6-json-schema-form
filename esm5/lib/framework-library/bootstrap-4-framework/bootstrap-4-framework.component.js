/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { addClasses, inArray } from '../../shared';
/**
 * Bootstrap 4 framework for Angular JSON Schema Form.
 *
 */
var Bootstrap4FrameworkComponent = /** @class */ (function () {
    function Bootstrap4FrameworkComponent(changeDetector, jsf) {
        this.changeDetector = changeDetector;
        this.jsf = jsf;
        this.frameworkInitialized = false;
        this.formControl = null;
        this.debugOutput = '';
        this.debug = '';
        this.parentArray = null;
        this.isOrderable = false;
    }
    Object.defineProperty(Bootstrap4FrameworkComponent.prototype, "showRemoveButton", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this.options.removable || this.options.readonly ||
                this.layoutNode.type === '$ref') {
                return false;
            }
            if (this.layoutNode.recursiveReference) {
                return true;
            }
            if (!this.layoutNode.arrayItem || !this.parentArray) {
                return false;
            }
            // If array length <= minItems, don't allow removing any items
            return this.parentArray.items.length - 1 <= this.parentArray.options.minItems ? false :
                // For removable list items, allow removing any item
                this.layoutNode.arrayItemType === 'list' ? true :
                    // For removable tuple items, only allow removing last item in list
                    this.layoutIndex[this.layoutIndex.length - 1] === this.parentArray.items.length - 2;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Bootstrap4FrameworkComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.initializeFramework();
        if (this.layoutNode.arrayItem && this.layoutNode.type !== '$ref') {
            this.parentArray = this.jsf.getParentNode(this);
            if (this.parentArray) {
                this.isOrderable = this.layoutNode.arrayItemType === 'list' &&
                    !this.options.readonly && this.parentArray.options.orderable;
            }
        }
    };
    /**
     * @return {?}
     */
    Bootstrap4FrameworkComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        if (!this.frameworkInitialized) {
            this.initializeFramework();
        }
    };
    /**
     * @return {?}
     */
    Bootstrap4FrameworkComponent.prototype.initializeFramework = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.layoutNode) {
            this.options = _.cloneDeep(this.layoutNode.options);
            this.widgetLayoutNode = tslib_1.__assign({}, this.layoutNode, { options: _.cloneDeep(this.layoutNode.options) });
            this.widgetOptions = this.widgetLayoutNode.options;
            this.formControl = this.jsf.getFormControl(this);
            this.options.isInputWidget = inArray(this.layoutNode.type, [
                'button', 'checkbox', 'checkboxes-inline', 'checkboxes', 'color',
                'date', 'datetime-local', 'datetime', 'email', 'file', 'hidden',
                'image', 'integer', 'month', 'number', 'password', 'radio',
                'radiobuttons', 'radios-inline', 'radios', 'range', 'reset', 'search',
                'select', 'submit', 'tel', 'text', 'textarea', 'time', 'url', 'week'
            ]);
            this.options.title = this.setTitle();
            this.options.htmlClass =
                addClasses(this.options.htmlClass, 'schema-form-' + this.layoutNode.type);
            this.options.htmlClass =
                this.layoutNode.type === 'array' ?
                    addClasses(this.options.htmlClass, 'list-group') :
                    this.layoutNode.arrayItem && this.layoutNode.type !== '$ref' ?
                        addClasses(this.options.htmlClass, 'list-group-item') :
                        addClasses(this.options.htmlClass, 'form-group');
            this.widgetOptions.htmlClass = '';
            this.options.labelHtmlClass =
                addClasses(this.options.labelHtmlClass, 'control-label');
            this.widgetOptions.activeClass =
                addClasses(this.widgetOptions.activeClass, 'active');
            this.options.fieldAddonLeft =
                this.options.fieldAddonLeft || this.options.prepend;
            this.options.fieldAddonRight =
                this.options.fieldAddonRight || this.options.append;
            // Add asterisk to titles if required
            if (this.options.title && this.layoutNode.type !== 'tab' &&
                !this.options.notitle && this.options.required &&
                !this.options.title.includes('*')) {
                this.options.title += ' <strong class="text-danger">*</strong>';
            }
            // Set miscelaneous styles and settings for each control type
            switch (this.layoutNode.type) {
                // Checkbox controls
                case 'checkbox':
                case 'checkboxes':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'checkbox');
                    break;
                case 'checkboxes-inline':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'checkbox');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, 'checkbox-inline');
                    break;
                // Radio controls
                case 'radio':
                case 'radios':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'radio');
                    break;
                case 'radios-inline':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'radio');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, 'radio-inline');
                    break;
                // Button sets - checkboxbuttons and radiobuttons
                case 'checkboxbuttons':
                case 'radiobuttons':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'btn-group');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, 'btn');
                    this.widgetOptions.itemLabelHtmlClass = addClasses(this.widgetOptions.itemLabelHtmlClass, this.options.style || 'btn-default');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'sr-only');
                    break;
                // Single button controls
                case 'button':
                case 'submit':
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'btn');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, this.options.style || 'btn-info');
                    break;
                // Containers - arrays and fieldsets
                case 'array':
                case 'fieldset':
                case 'section':
                case 'conditional':
                case 'advancedfieldset':
                case 'authfieldset':
                case 'selectfieldset':
                case 'optionfieldset':
                    this.options.messageLocation = 'top';
                    break;
                case 'tabarray':
                case 'tabs':
                    this.widgetOptions.htmlClass = addClasses(this.widgetOptions.htmlClass, 'tab-content');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'tab-pane');
                    this.widgetOptions.labelHtmlClass = addClasses(this.widgetOptions.labelHtmlClass, 'nav nav-tabs');
                    break;
                // 'Add' buttons - references
                case '$ref':
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'btn pull-right');
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, this.options.style || 'btn-default');
                    this.options.icon = 'glyphicon glyphicon-plus';
                    break;
                // Default - including regular inputs
                default:
                    this.widgetOptions.fieldHtmlClass = addClasses(this.widgetOptions.fieldHtmlClass, 'form-control');
            }
            if (this.formControl) {
                this.updateHelpBlock(this.formControl.status);
                this.formControl.statusChanges.subscribe(function (status) { return _this.updateHelpBlock(status); });
                if (this.options.debug) {
                    /** @type {?} */
                    var vars = [];
                    this.debugOutput = _.map(vars, function (thisVar) { return JSON.stringify(thisVar, null, 2); }).join('\n');
                }
            }
            this.frameworkInitialized = true;
        }
    };
    /**
     * @param {?} status
     * @return {?}
     */
    Bootstrap4FrameworkComponent.prototype.updateHelpBlock = /**
     * @param {?} status
     * @return {?}
     */
    function (status) {
        this.options.helpBlock = status === 'INVALID' &&
            this.options.enableErrorState && this.formControl.errors &&
            (this.formControl.dirty || this.options.feedbackOnRender) ?
            this.jsf.formatErrors(this.formControl.errors, this.options.validationMessages) :
            this.options.description || this.options.help || null;
    };
    /**
     * @return {?}
     */
    Bootstrap4FrameworkComponent.prototype.setTitle = /**
     * @return {?}
     */
    function () {
        switch (this.layoutNode.type) {
            case 'button':
            case 'checkbox':
            case 'section':
            case 'help':
            case 'msg':
            case 'submit':
            case 'message':
            case 'tabarray':
            case 'tabs':
            case '$ref':
                return null;
            case 'advancedfieldset':
                this.widgetOptions.expandable = true;
                this.widgetOptions.title = 'Advanced options';
                return null;
            case 'authfieldset':
                this.widgetOptions.expandable = true;
                this.widgetOptions.title = 'Authentication settings';
                return null;
            case 'fieldset':
                this.widgetOptions.title = this.options.title;
                return null;
            default:
                this.widgetOptions.title = null;
                return this.jsf.setItemTitle(this);
        }
    };
    /**
     * @return {?}
     */
    Bootstrap4FrameworkComponent.prototype.removeItem = /**
     * @return {?}
     */
    function () {
        this.jsf.removeItem(this);
    };
    Bootstrap4FrameworkComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bootstrap-4-framework',
                    template: "\n    <div\n      [class]=\"options?.htmlClass || ''\"\n      [class.has-feedback]=\"options?.feedback && options?.isInputWidget &&\n        (formControl?.dirty || options?.feedbackOnRender)\"\n      [class.has-error]=\"options?.enableErrorState && formControl?.errors &&\n        (formControl?.dirty || options?.feedbackOnRender)\"\n      [class.has-success]=\"options?.enableSuccessState && !formControl?.errors &&\n        (formControl?.dirty || options?.feedbackOnRender)\">\n\n      <button *ngIf=\"showRemoveButton\"\n        class=\"close pull-right\"\n        type=\"button\"\n        (click)=\"removeItem()\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n      </button>\n      <div *ngIf=\"options?.messageLocation === 'top'\">\n        <p *ngIf=\"options?.helpBlock\"\n          class=\"help-block\"\n          [innerHTML]=\"options?.helpBlock\"></p>\n      </div>\n\n      <label *ngIf=\"options?.title && layoutNode?.type !== 'tab'\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [class.sr-only]=\"options?.notitle\"\n        [innerHTML]=\"options?.title\"></label>\n      <p *ngIf=\"layoutNode?.type === 'submit' && jsf?.formOptions?.fieldsRequired\">\n        <strong class=\"text-danger\">*</strong> = required fields\n      </p>\n      <div [class.input-group]=\"options?.fieldAddonLeft || options?.fieldAddonRight\">\n        <span *ngIf=\"options?.fieldAddonLeft\"\n          class=\"input-group-addon\"\n          [innerHTML]=\"options?.fieldAddonLeft\"></span>\n\n        <select-widget-widget\n          [layoutNode]=\"widgetLayoutNode\"\n          [dataIndex]=\"dataIndex\"\n          [layoutIndex]=\"layoutIndex\"></select-widget-widget>\n\n        <span *ngIf=\"options?.fieldAddonRight\"\n          class=\"input-group-addon\"\n          [innerHTML]=\"options?.fieldAddonRight\"></span>\n      </div>\n\n      <span *ngIf=\"options?.feedback && options?.isInputWidget &&\n          !options?.fieldAddonRight && !layoutNode.arrayItem &&\n          (formControl?.dirty || options?.feedbackOnRender)\"\n        [class.glyphicon-ok]=\"options?.enableSuccessState && !formControl?.errors\"\n        [class.glyphicon-remove]=\"options?.enableErrorState && formControl?.errors\"\n        aria-hidden=\"true\"\n        class=\"form-control-feedback glyphicon\"></span>\n      <div *ngIf=\"options?.messageLocation !== 'top'\">\n        <p *ngIf=\"options?.helpBlock\"\n          class=\"help-block\"\n          [innerHTML]=\"options?.helpBlock\"></p>\n      </div>\n    </div>\n\n    <div *ngIf=\"debug && debugOutput\">debug: <pre>{{debugOutput}}</pre></div>\n  ",
                    styles: ["\n    :host /deep/ .list-group-item .form-control-feedback { top: 40px; }\n    :host /deep/ .checkbox,\n    :host /deep/ .radio { margin-top: 0; margin-bottom: 0; }\n    :host /deep/ .checkbox-inline,\n    :host /deep/ .checkbox-inline + .checkbox-inline,\n    :host /deep/ .checkbox-inline + .radio-inline,\n    :host /deep/ .radio-inline,\n    :host /deep/ .radio-inline + .radio-inline,\n    :host /deep/ .radio-inline + .checkbox-inline { margin-left: 0; margin-right: 10px; }\n    :host /deep/ .checkbox-inline:last-child,\n    :host /deep/ .radio-inline:last-child { margin-right: 0; }\n    :host /deep/ .ng-invalid.ng-touched { border: 1px solid #f44336; }\n  "],
                },] },
    ];
    /** @nocollapse */
    Bootstrap4FrameworkComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: JsonSchemaFormService }
    ]; };
    Bootstrap4FrameworkComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return Bootstrap4FrameworkComponent;
}());
export { Bootstrap4FrameworkComponent };
if (false) {
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.frameworkInitialized;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.widgetOptions;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.widgetLayoutNode;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.options;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.formControl;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.debugOutput;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.debug;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.parentArray;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.isOrderable;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.layoutNode;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.layoutIndex;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.dataIndex;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.changeDetector;
    /** @type {?} */
    Bootstrap4FrameworkComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLTQtZnJhbWV3b3JrLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2pzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJsaWIvZnJhbWV3b3JrLWxpYnJhcnkvYm9vdHN0cmFwLTQtZnJhbWV3b3JrL2Jvb3RzdHJhcC00LWZyYW1ld29yay5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFFdkYsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFFNUIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdkUsT0FBTyxFQUNMLFVBQVUsRUFBVSxPQUFPLEVBQzVCLE1BQU0sY0FBYyxDQUFDOzs7Ozs7SUFtR3BCLHNDQUNTLGdCQUNBO1FBREEsbUJBQWMsR0FBZCxjQUFjO1FBQ2QsUUFBRyxHQUFILEdBQUc7b0NBZlcsS0FBSzsyQkFJVCxJQUFJOzJCQUNKLEVBQUU7cUJBQ1IsRUFBRTsyQkFDSSxJQUFJOzJCQUNULEtBQUs7S0FRZDtJQUVMLHNCQUFJLDBEQUFnQjs7OztRQUFwQjtZQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxNQUMzQixDQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQUU7WUFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzthQUFFO1lBQ3hELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQUU7O1lBRXRFLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O2dCQUVyRixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDOztvQkFFL0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ3pGOzs7T0FBQTs7OztJQUVELCtDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsS0FBSyxNQUFNO29CQUN6RCxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNoRTtTQUNGO0tBQ0Y7Ozs7SUFFRCxrREFBVzs7O0lBQVg7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztTQUFFO0tBQ2hFOzs7O0lBRUQsMERBQW1COzs7SUFBbkI7UUFBQSxpQkErSEM7UUE5SEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQix3QkFDaEIsSUFBSSxDQUFDLFVBQVUsSUFDbEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FDOUMsQ0FBQztZQUNGLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztZQUNuRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpELElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDekQsUUFBUSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsT0FBTztnQkFDaEUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVE7Z0JBQy9ELE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTztnQkFDMUQsY0FBYyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRO2dCQUNyRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTTthQUNyRSxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO2dCQUNwQixVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO2dCQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQztvQkFDaEMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ2xELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDO3dCQUM1RCxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYztnQkFDekIsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVztnQkFDNUIsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYztnQkFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlO2dCQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7WUFHdEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssS0FBSztnQkFDdEQsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7Z0JBQzlDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDbEMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUkseUNBQXlDLENBQUM7YUFDakU7O1lBRUQsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztnQkFFN0IsS0FBSyxVQUFVLENBQUM7Z0JBQUMsS0FBSyxZQUFZO29CQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUM1QyxLQUFLLENBQUM7Z0JBQ04sS0FBSyxtQkFBbUI7b0JBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUNoRCxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDLENBQUM7b0JBQzVELEtBQUssQ0FBQzs7Z0JBRVIsS0FBSyxPQUFPLENBQUM7Z0JBQUMsS0FBSyxRQUFRO29CQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxLQUFLLENBQUM7Z0JBQ04sS0FBSyxlQUFlO29CQUNsQixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLENBQUMsQ0FBQztvQkFDekQsS0FBSyxDQUFDOztnQkFFUixLQUFLLGlCQUFpQixDQUFDO2dCQUFDLEtBQUssY0FBYztvQkFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUN2QyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztvQkFDN0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUNoRCxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLGFBQWEsQ0FBQyxDQUFDO29CQUM5RSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUNsRCxLQUFLLENBQUM7O2dCQUVOLEtBQUssUUFBUSxDQUFDO2dCQUFDLEtBQUssUUFBUTtvQkFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsQ0FBQztvQkFDekUsS0FBSyxDQUFDOztnQkFFTixLQUFLLE9BQU8sQ0FBQztnQkFBQyxLQUFLLFVBQVUsQ0FBQztnQkFBQyxLQUFLLFNBQVMsQ0FBQztnQkFBQyxLQUFLLGFBQWEsQ0FBQztnQkFDbEUsS0FBSyxrQkFBa0IsQ0FBQztnQkFBQyxLQUFLLGNBQWMsQ0FBQztnQkFDN0MsS0FBSyxnQkFBZ0IsQ0FBQztnQkFBQyxLQUFLLGdCQUFnQjtvQkFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO29CQUN2QyxLQUFLLENBQUM7Z0JBQ04sS0FBSyxVQUFVLENBQUM7Z0JBQUMsS0FBSyxNQUFNO29CQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO29CQUN2RCxLQUFLLENBQUM7O2dCQUVOLEtBQUssTUFBTTtvQkFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0JBQ3ZELElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDLENBQUM7b0JBQzFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLDBCQUEwQixDQUFDO29CQUNqRCxLQUFLLENBQUM7O2dCQUVOO29CQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7YUFDeEQ7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7Z0JBRWpGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7b0JBQ3ZCLElBQUksSUFBSSxHQUFVLEVBQUUsQ0FBQztvQkFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFBLE9BQU8sSUFBSSxPQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDeEY7YUFDRjtZQUNELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7U0FDbEM7S0FFRjs7Ozs7SUFFRCxzREFBZTs7OztJQUFmLFVBQWdCLE1BQU07UUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxLQUFLLFNBQVM7WUFDM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU07WUFDeEQsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUNqRixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7S0FDM0Q7Ozs7SUFFRCwrQ0FBUTs7O0lBQVI7UUFDRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDN0IsS0FBSyxRQUFRLENBQUM7WUFBQyxLQUFLLFVBQVUsQ0FBQztZQUFDLEtBQUssU0FBUyxDQUFDO1lBQUMsS0FBSyxNQUFNLENBQUM7WUFBQyxLQUFLLEtBQUssQ0FBQztZQUN4RSxLQUFLLFFBQVEsQ0FBQztZQUFDLEtBQUssU0FBUyxDQUFDO1lBQUMsS0FBSyxVQUFVLENBQUM7WUFBQyxLQUFLLE1BQU0sQ0FBQztZQUFDLEtBQUssTUFBTTtnQkFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNkLEtBQUssa0JBQWtCO2dCQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDO2dCQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsS0FBSyxjQUFjO2dCQUNqQixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLHlCQUF5QixDQUFDO2dCQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsS0FBSyxVQUFVO2dCQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2Q7Z0JBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEM7S0FDRjs7OztJQUVELGlEQUFVOzs7SUFBVjtRQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzNCOztnQkFoU0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx1QkFBdUI7b0JBQ2pDLFFBQVEsRUFBRSw4b0ZBNkRUO29CQUNELE1BQU0sRUFBRSxDQUFDLDZwQkFhUixDQUFDO2lCQUNIOzs7O2dCQTNGUSxpQkFBaUI7Z0JBSWpCLHFCQUFxQjs7OzZCQWtHM0IsS0FBSzs4QkFDTCxLQUFLOzRCQUNMLEtBQUs7O3VDQXhHUjs7U0E0RmEsNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcbmltcG9ydCB7XG4gIGFkZENsYXNzZXMsIGhhc093biwgaW5BcnJheSwgaXNBcnJheSwgSnNvblBvaW50ZXIsIHRvVGl0bGVDYXNlXG59IGZyb20gJy4uLy4uL3NoYXJlZCc7XG5cbi8qKlxuICogQm9vdHN0cmFwIDQgZnJhbWV3b3JrIGZvciBBbmd1bGFyIEpTT04gU2NoZW1hIEZvcm0uXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdib290c3RyYXAtNC1mcmFtZXdvcmsnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIFtjbGFzc109XCJvcHRpb25zPy5odG1sQ2xhc3MgfHwgJydcIlxuICAgICAgW2NsYXNzLmhhcy1mZWVkYmFja109XCJvcHRpb25zPy5mZWVkYmFjayAmJiBvcHRpb25zPy5pc0lucHV0V2lkZ2V0ICYmXG4gICAgICAgIChmb3JtQ29udHJvbD8uZGlydHkgfHwgb3B0aW9ucz8uZmVlZGJhY2tPblJlbmRlcilcIlxuICAgICAgW2NsYXNzLmhhcy1lcnJvcl09XCJvcHRpb25zPy5lbmFibGVFcnJvclN0YXRlICYmIGZvcm1Db250cm9sPy5lcnJvcnMgJiZcbiAgICAgICAgKGZvcm1Db250cm9sPy5kaXJ0eSB8fCBvcHRpb25zPy5mZWVkYmFja09uUmVuZGVyKVwiXG4gICAgICBbY2xhc3MuaGFzLXN1Y2Nlc3NdPVwib3B0aW9ucz8uZW5hYmxlU3VjY2Vzc1N0YXRlICYmICFmb3JtQ29udHJvbD8uZXJyb3JzICYmXG4gICAgICAgIChmb3JtQ29udHJvbD8uZGlydHkgfHwgb3B0aW9ucz8uZmVlZGJhY2tPblJlbmRlcilcIj5cblxuICAgICAgPGJ1dHRvbiAqbmdJZj1cInNob3dSZW1vdmVCdXR0b25cIlxuICAgICAgICBjbGFzcz1cImNsb3NlIHB1bGwtcmlnaHRcIlxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgKGNsaWNrKT1cInJlbW92ZUl0ZW0oKVwiPlxuICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5DbG9zZTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGRpdiAqbmdJZj1cIm9wdGlvbnM/Lm1lc3NhZ2VMb2NhdGlvbiA9PT0gJ3RvcCdcIj5cbiAgICAgICAgPHAgKm5nSWY9XCJvcHRpb25zPy5oZWxwQmxvY2tcIlxuICAgICAgICAgIGNsYXNzPVwiaGVscC1ibG9ja1wiXG4gICAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5oZWxwQmxvY2tcIj48L3A+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGxhYmVsICpuZ0lmPVwib3B0aW9ucz8udGl0bGUgJiYgbGF5b3V0Tm9kZT8udHlwZSAhPT0gJ3RhYidcIlxuICAgICAgICBbYXR0ci5mb3JdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/LmxhYmVsSHRtbENsYXNzIHx8ICcnXCJcbiAgICAgICAgW2NsYXNzLnNyLW9ubHldPVwib3B0aW9ucz8ubm90aXRsZVwiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L2xhYmVsPlxuICAgICAgPHAgKm5nSWY9XCJsYXlvdXROb2RlPy50eXBlID09PSAnc3VibWl0JyAmJiBqc2Y/LmZvcm1PcHRpb25zPy5maWVsZHNSZXF1aXJlZFwiPlxuICAgICAgICA8c3Ryb25nIGNsYXNzPVwidGV4dC1kYW5nZXJcIj4qPC9zdHJvbmc+ID0gcmVxdWlyZWQgZmllbGRzXG4gICAgICA8L3A+XG4gICAgICA8ZGl2IFtjbGFzcy5pbnB1dC1ncm91cF09XCJvcHRpb25zPy5maWVsZEFkZG9uTGVmdCB8fCBvcHRpb25zPy5maWVsZEFkZG9uUmlnaHRcIj5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCJvcHRpb25zPy5maWVsZEFkZG9uTGVmdFwiXG4gICAgICAgICAgY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiXG4gICAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5maWVsZEFkZG9uTGVmdFwiPjwvc3Bhbj5cblxuICAgICAgICA8c2VsZWN0LXdpZGdldC13aWRnZXRcbiAgICAgICAgICBbbGF5b3V0Tm9kZV09XCJ3aWRnZXRMYXlvdXROb2RlXCJcbiAgICAgICAgICBbZGF0YUluZGV4XT1cImRhdGFJbmRleFwiXG4gICAgICAgICAgW2xheW91dEluZGV4XT1cImxheW91dEluZGV4XCI+PC9zZWxlY3Qtd2lkZ2V0LXdpZGdldD5cblxuICAgICAgICA8c3BhbiAqbmdJZj1cIm9wdGlvbnM/LmZpZWxkQWRkb25SaWdodFwiXG4gICAgICAgICAgY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiXG4gICAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5maWVsZEFkZG9uUmlnaHRcIj48L3NwYW4+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPHNwYW4gKm5nSWY9XCJvcHRpb25zPy5mZWVkYmFjayAmJiBvcHRpb25zPy5pc0lucHV0V2lkZ2V0ICYmXG4gICAgICAgICAgIW9wdGlvbnM/LmZpZWxkQWRkb25SaWdodCAmJiAhbGF5b3V0Tm9kZS5hcnJheUl0ZW0gJiZcbiAgICAgICAgICAoZm9ybUNvbnRyb2w/LmRpcnR5IHx8IG9wdGlvbnM/LmZlZWRiYWNrT25SZW5kZXIpXCJcbiAgICAgICAgW2NsYXNzLmdseXBoaWNvbi1va109XCJvcHRpb25zPy5lbmFibGVTdWNjZXNzU3RhdGUgJiYgIWZvcm1Db250cm9sPy5lcnJvcnNcIlxuICAgICAgICBbY2xhc3MuZ2x5cGhpY29uLXJlbW92ZV09XCJvcHRpb25zPy5lbmFibGVFcnJvclN0YXRlICYmIGZvcm1Db250cm9sPy5lcnJvcnNcIlxuICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICBjbGFzcz1cImZvcm0tY29udHJvbC1mZWVkYmFjayBnbHlwaGljb25cIj48L3NwYW4+XG4gICAgICA8ZGl2ICpuZ0lmPVwib3B0aW9ucz8ubWVzc2FnZUxvY2F0aW9uICE9PSAndG9wJ1wiPlxuICAgICAgICA8cCAqbmdJZj1cIm9wdGlvbnM/LmhlbHBCbG9ja1wiXG4gICAgICAgICAgY2xhc3M9XCJoZWxwLWJsb2NrXCJcbiAgICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LmhlbHBCbG9ja1wiPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiAqbmdJZj1cImRlYnVnICYmIGRlYnVnT3V0cHV0XCI+ZGVidWc6IDxwcmU+e3tkZWJ1Z091dHB1dH19PC9wcmU+PC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdCAvZGVlcC8gLmxpc3QtZ3JvdXAtaXRlbSAuZm9ybS1jb250cm9sLWZlZWRiYWNrIHsgdG9wOiA0MHB4OyB9XG4gICAgOmhvc3QgL2RlZXAvIC5jaGVja2JveCxcbiAgICA6aG9zdCAvZGVlcC8gLnJhZGlvIHsgbWFyZ2luLXRvcDogMDsgbWFyZ2luLWJvdHRvbTogMDsgfVxuICAgIDpob3N0IC9kZWVwLyAuY2hlY2tib3gtaW5saW5lLFxuICAgIDpob3N0IC9kZWVwLyAuY2hlY2tib3gtaW5saW5lICsgLmNoZWNrYm94LWlubGluZSxcbiAgICA6aG9zdCAvZGVlcC8gLmNoZWNrYm94LWlubGluZSArIC5yYWRpby1pbmxpbmUsXG4gICAgOmhvc3QgL2RlZXAvIC5yYWRpby1pbmxpbmUsXG4gICAgOmhvc3QgL2RlZXAvIC5yYWRpby1pbmxpbmUgKyAucmFkaW8taW5saW5lLFxuICAgIDpob3N0IC9kZWVwLyAucmFkaW8taW5saW5lICsgLmNoZWNrYm94LWlubGluZSB7IG1hcmdpbi1sZWZ0OiAwOyBtYXJnaW4tcmlnaHQ6IDEwcHg7IH1cbiAgICA6aG9zdCAvZGVlcC8gLmNoZWNrYm94LWlubGluZTpsYXN0LWNoaWxkLFxuICAgIDpob3N0IC9kZWVwLyAucmFkaW8taW5saW5lOmxhc3QtY2hpbGQgeyBtYXJnaW4tcmlnaHQ6IDA7IH1cbiAgICA6aG9zdCAvZGVlcC8gLm5nLWludmFsaWQubmctdG91Y2hlZCB7IGJvcmRlcjogMXB4IHNvbGlkICNmNDQzMzY7IH1cbiAgYF0sXG59KVxuZXhwb3J0IGNsYXNzIEJvb3RzdHJhcDRGcmFtZXdvcmtDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIGZyYW1ld29ya0luaXRpYWxpemVkID0gZmFsc2U7XG4gIHdpZGdldE9wdGlvbnM6IGFueTsgLy8gT3B0aW9ucyBwYXNzZWQgdG8gY2hpbGQgd2lkZ2V0XG4gIHdpZGdldExheW91dE5vZGU6IGFueTsgLy8gbGF5b3V0Tm9kZSBwYXNzZWQgdG8gY2hpbGQgd2lkZ2V0XG4gIG9wdGlvbnM6IGFueTsgLy8gT3B0aW9ucyB1c2VkIGluIHRoaXMgZnJhbWV3b3JrXG4gIGZvcm1Db250cm9sOiBhbnkgPSBudWxsO1xuICBkZWJ1Z091dHB1dDogYW55ID0gJyc7XG4gIGRlYnVnOiBhbnkgPSAnJztcbiAgcGFyZW50QXJyYXk6IGFueSA9IG51bGw7XG4gIGlzT3JkZXJhYmxlID0gZmFsc2U7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHVibGljIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgZ2V0IHNob3dSZW1vdmVCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZhYmxlIHx8IHRoaXMub3B0aW9ucy5yZWFkb25seSB8fFxuICAgICAgdGhpcy5sYXlvdXROb2RlLnR5cGUgPT09ICckcmVmJ1xuICAgICkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBpZiAodGhpcy5sYXlvdXROb2RlLnJlY3Vyc2l2ZVJlZmVyZW5jZSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIGlmICghdGhpcy5sYXlvdXROb2RlLmFycmF5SXRlbSB8fCAhdGhpcy5wYXJlbnRBcnJheSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAvLyBJZiBhcnJheSBsZW5ndGggPD0gbWluSXRlbXMsIGRvbid0IGFsbG93IHJlbW92aW5nIGFueSBpdGVtc1xuICAgIHJldHVybiB0aGlzLnBhcmVudEFycmF5Lml0ZW1zLmxlbmd0aCAtIDEgPD0gdGhpcy5wYXJlbnRBcnJheS5vcHRpb25zLm1pbkl0ZW1zID8gZmFsc2UgOlxuICAgICAgLy8gRm9yIHJlbW92YWJsZSBsaXN0IGl0ZW1zLCBhbGxvdyByZW1vdmluZyBhbnkgaXRlbVxuICAgICAgdGhpcy5sYXlvdXROb2RlLmFycmF5SXRlbVR5cGUgPT09ICdsaXN0JyA/IHRydWUgOlxuICAgICAgICAvLyBGb3IgcmVtb3ZhYmxlIHR1cGxlIGl0ZW1zLCBvbmx5IGFsbG93IHJlbW92aW5nIGxhc3QgaXRlbSBpbiBsaXN0XG4gICAgICAgIHRoaXMubGF5b3V0SW5kZXhbdGhpcy5sYXlvdXRJbmRleC5sZW5ndGggLSAxXSA9PT0gdGhpcy5wYXJlbnRBcnJheS5pdGVtcy5sZW5ndGggLSAyO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplRnJhbWV3b3JrKCk7XG4gICAgaWYgKHRoaXMubGF5b3V0Tm9kZS5hcnJheUl0ZW0gJiYgdGhpcy5sYXlvdXROb2RlLnR5cGUgIT09ICckcmVmJykge1xuICAgICAgdGhpcy5wYXJlbnRBcnJheSA9IHRoaXMuanNmLmdldFBhcmVudE5vZGUodGhpcyk7XG4gICAgICBpZiAodGhpcy5wYXJlbnRBcnJheSkge1xuICAgICAgICB0aGlzLmlzT3JkZXJhYmxlID0gdGhpcy5sYXlvdXROb2RlLmFycmF5SXRlbVR5cGUgPT09ICdsaXN0JyAmJlxuICAgICAgICAgICF0aGlzLm9wdGlvbnMucmVhZG9ubHkgJiYgdGhpcy5wYXJlbnRBcnJheS5vcHRpb25zLm9yZGVyYWJsZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAoIXRoaXMuZnJhbWV3b3JrSW5pdGlhbGl6ZWQpIHsgdGhpcy5pbml0aWFsaXplRnJhbWV3b3JrKCk7IH1cbiAgfVxuXG4gIGluaXRpYWxpemVGcmFtZXdvcmsoKSB7XG4gICAgaWYgKHRoaXMubGF5b3V0Tm9kZSkge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5jbG9uZURlZXAodGhpcy5sYXlvdXROb2RlLm9wdGlvbnMpO1xuICAgICAgdGhpcy53aWRnZXRMYXlvdXROb2RlID0ge1xuICAgICAgICAuLi50aGlzLmxheW91dE5vZGUsXG4gICAgICAgIG9wdGlvbnM6IF8uY2xvbmVEZWVwKHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zKVxuICAgICAgfTtcbiAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucyA9IHRoaXMud2lkZ2V0TGF5b3V0Tm9kZS5vcHRpb25zO1xuICAgICAgdGhpcy5mb3JtQ29udHJvbCA9IHRoaXMuanNmLmdldEZvcm1Db250cm9sKHRoaXMpO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuaXNJbnB1dFdpZGdldCA9IGluQXJyYXkodGhpcy5sYXlvdXROb2RlLnR5cGUsIFtcbiAgICAgICAgJ2J1dHRvbicsICdjaGVja2JveCcsICdjaGVja2JveGVzLWlubGluZScsICdjaGVja2JveGVzJywgJ2NvbG9yJyxcbiAgICAgICAgJ2RhdGUnLCAnZGF0ZXRpbWUtbG9jYWwnLCAnZGF0ZXRpbWUnLCAnZW1haWwnLCAnZmlsZScsICdoaWRkZW4nLFxuICAgICAgICAnaW1hZ2UnLCAnaW50ZWdlcicsICdtb250aCcsICdudW1iZXInLCAncGFzc3dvcmQnLCAncmFkaW8nLFxuICAgICAgICAncmFkaW9idXR0b25zJywgJ3JhZGlvcy1pbmxpbmUnLCAncmFkaW9zJywgJ3JhbmdlJywgJ3Jlc2V0JywgJ3NlYXJjaCcsXG4gICAgICAgICdzZWxlY3QnLCAnc3VibWl0JywgJ3RlbCcsICd0ZXh0JywgJ3RleHRhcmVhJywgJ3RpbWUnLCAndXJsJywgJ3dlZWsnXG4gICAgICBdKTtcblxuICAgICAgdGhpcy5vcHRpb25zLnRpdGxlID0gdGhpcy5zZXRUaXRsZSgpO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuaHRtbENsYXNzID1cbiAgICAgICAgYWRkQ2xhc3Nlcyh0aGlzLm9wdGlvbnMuaHRtbENsYXNzLCAnc2NoZW1hLWZvcm0tJyArIHRoaXMubGF5b3V0Tm9kZS50eXBlKTtcbiAgICAgIHRoaXMub3B0aW9ucy5odG1sQ2xhc3MgPVxuICAgICAgICB0aGlzLmxheW91dE5vZGUudHlwZSA9PT0gJ2FycmF5JyA/XG4gICAgICAgICAgYWRkQ2xhc3Nlcyh0aGlzLm9wdGlvbnMuaHRtbENsYXNzLCAnbGlzdC1ncm91cCcpIDpcbiAgICAgICAgICB0aGlzLmxheW91dE5vZGUuYXJyYXlJdGVtICYmIHRoaXMubGF5b3V0Tm9kZS50eXBlICE9PSAnJHJlZicgP1xuICAgICAgICAgICAgYWRkQ2xhc3Nlcyh0aGlzLm9wdGlvbnMuaHRtbENsYXNzLCAnbGlzdC1ncm91cC1pdGVtJykgOlxuICAgICAgICAgICAgYWRkQ2xhc3Nlcyh0aGlzLm9wdGlvbnMuaHRtbENsYXNzLCAnZm9ybS1ncm91cCcpO1xuICAgICAgdGhpcy53aWRnZXRPcHRpb25zLmh0bWxDbGFzcyA9ICcnO1xuICAgICAgdGhpcy5vcHRpb25zLmxhYmVsSHRtbENsYXNzID1cbiAgICAgICAgYWRkQ2xhc3Nlcyh0aGlzLm9wdGlvbnMubGFiZWxIdG1sQ2xhc3MsICdjb250cm9sLWxhYmVsJyk7XG4gICAgICB0aGlzLndpZGdldE9wdGlvbnMuYWN0aXZlQ2xhc3MgPVxuICAgICAgICBhZGRDbGFzc2VzKHRoaXMud2lkZ2V0T3B0aW9ucy5hY3RpdmVDbGFzcywgJ2FjdGl2ZScpO1xuICAgICAgdGhpcy5vcHRpb25zLmZpZWxkQWRkb25MZWZ0ID1cbiAgICAgICAgdGhpcy5vcHRpb25zLmZpZWxkQWRkb25MZWZ0IHx8IHRoaXMub3B0aW9ucy5wcmVwZW5kO1xuICAgICAgdGhpcy5vcHRpb25zLmZpZWxkQWRkb25SaWdodCA9XG4gICAgICAgIHRoaXMub3B0aW9ucy5maWVsZEFkZG9uUmlnaHQgfHwgdGhpcy5vcHRpb25zLmFwcGVuZDtcblxuICAgICAgLy8gQWRkIGFzdGVyaXNrIHRvIHRpdGxlcyBpZiByZXF1aXJlZFxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50aXRsZSAmJiB0aGlzLmxheW91dE5vZGUudHlwZSAhPT0gJ3RhYicgJiZcbiAgICAgICAgIXRoaXMub3B0aW9ucy5ub3RpdGxlICYmIHRoaXMub3B0aW9ucy5yZXF1aXJlZCAgJiZcbiAgICAgICAgIXRoaXMub3B0aW9ucy50aXRsZS5pbmNsdWRlcygnKicpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnRpdGxlICs9ICcgPHN0cm9uZyBjbGFzcz1cInRleHQtZGFuZ2VyXCI+Kjwvc3Ryb25nPic7XG4gICAgICB9XG4gICAgICAvLyBTZXQgbWlzY2VsYW5lb3VzIHN0eWxlcyBhbmQgc2V0dGluZ3MgZm9yIGVhY2ggY29udHJvbCB0eXBlXG4gICAgICBzd2l0Y2ggKHRoaXMubGF5b3V0Tm9kZS50eXBlKSB7XG4gICAgICAgIC8vIENoZWNrYm94IGNvbnRyb2xzXG4gICAgICAgIGNhc2UgJ2NoZWNrYm94JzogY2FzZSAnY2hlY2tib3hlcyc6XG4gICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5odG1sQ2xhc3MgPSBhZGRDbGFzc2VzKFxuICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5odG1sQ2xhc3MsICdjaGVja2JveCcpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY2hlY2tib3hlcy1pbmxpbmUnOlxuICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5odG1sQ2xhc3MgPSBhZGRDbGFzc2VzKFxuICAgICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLmh0bWxDbGFzcywgJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLml0ZW1MYWJlbEh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuaXRlbUxhYmVsSHRtbENsYXNzLCAnY2hlY2tib3gtaW5saW5lJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFJhZGlvIGNvbnRyb2xzXG4gICAgICAgIGNhc2UgJ3JhZGlvJzogY2FzZSAncmFkaW9zJzpcbiAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLmh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLmh0bWxDbGFzcywgJ3JhZGlvJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyYWRpb3MtaW5saW5lJzpcbiAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuaHRtbENsYXNzID0gYWRkQ2xhc3NlcyhcbiAgICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5odG1sQ2xhc3MsICdyYWRpbycpO1xuICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5pdGVtTGFiZWxIdG1sQ2xhc3MgPSBhZGRDbGFzc2VzKFxuICAgICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLml0ZW1MYWJlbEh0bWxDbGFzcywgJ3JhZGlvLWlubGluZScpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBCdXR0b24gc2V0cyAtIGNoZWNrYm94YnV0dG9ucyBhbmQgcmFkaW9idXR0b25zXG4gICAgICAgIGNhc2UgJ2NoZWNrYm94YnV0dG9ucyc6IGNhc2UgJ3JhZGlvYnV0dG9ucyc6XG4gICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLmh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuaHRtbENsYXNzLCAnYnRuLWdyb3VwJyk7XG4gICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLml0ZW1MYWJlbEh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuaXRlbUxhYmVsSHRtbENsYXNzLCAnYnRuJyk7XG4gICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLml0ZW1MYWJlbEh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuaXRlbUxhYmVsSHRtbENsYXNzLCB0aGlzLm9wdGlvbnMuc3R5bGUgfHwgJ2J0bi1kZWZhdWx0Jyk7XG4gICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLmZpZWxkSHRtbENsYXNzID0gYWRkQ2xhc3NlcyhcbiAgICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5maWVsZEh0bWxDbGFzcywgJ3NyLW9ubHknKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFNpbmdsZSBidXR0b24gY29udHJvbHNcbiAgICAgICAgY2FzZSAnYnV0dG9uJzogY2FzZSAnc3VibWl0JzpcbiAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuZmllbGRIdG1sQ2xhc3MgPSBhZGRDbGFzc2VzKFxuICAgICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLmZpZWxkSHRtbENsYXNzLCAnYnRuJyk7XG4gICAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLmZpZWxkSHRtbENsYXNzID0gYWRkQ2xhc3NlcyhcbiAgICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5maWVsZEh0bWxDbGFzcywgdGhpcy5vcHRpb25zLnN0eWxlIHx8ICdidG4taW5mbycpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgLy8gQ29udGFpbmVycyAtIGFycmF5cyBhbmQgZmllbGRzZXRzXG4gICAgICAgIGNhc2UgJ2FycmF5JzogY2FzZSAnZmllbGRzZXQnOiBjYXNlICdzZWN0aW9uJzogY2FzZSAnY29uZGl0aW9uYWwnOlxuICAgICAgICBjYXNlICdhZHZhbmNlZGZpZWxkc2V0JzogY2FzZSAnYXV0aGZpZWxkc2V0JzpcbiAgICAgICAgY2FzZSAnc2VsZWN0ZmllbGRzZXQnOiBjYXNlICdvcHRpb25maWVsZHNldCc6XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm1lc3NhZ2VMb2NhdGlvbiA9ICd0b3AnO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGFiYXJyYXknOiBjYXNlICd0YWJzJzpcbiAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuaHRtbENsYXNzID0gYWRkQ2xhc3NlcyhcbiAgICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5odG1sQ2xhc3MsICd0YWItY29udGVudCcpO1xuICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5maWVsZEh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuZmllbGRIdG1sQ2xhc3MsICd0YWItcGFuZScpO1xuICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5sYWJlbEh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMubGFiZWxIdG1sQ2xhc3MsICduYXYgbmF2LXRhYnMnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICdBZGQnIGJ1dHRvbnMgLSByZWZlcmVuY2VzXG4gICAgICAgIGNhc2UgJyRyZWYnOlxuICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5maWVsZEh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuZmllbGRIdG1sQ2xhc3MsICdidG4gcHVsbC1yaWdodCcpO1xuICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5maWVsZEh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuZmllbGRIdG1sQ2xhc3MsIHRoaXMub3B0aW9ucy5zdHlsZSB8fCAnYnRuLWRlZmF1bHQnKTtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuaWNvbiA9ICdnbHlwaGljb24gZ2x5cGhpY29uLXBsdXMnO1xuICAgICAgICBicmVhaztcbiAgICAgICAgLy8gRGVmYXVsdCAtIGluY2x1ZGluZyByZWd1bGFyIGlucHV0c1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy5maWVsZEh0bWxDbGFzcyA9IGFkZENsYXNzZXMoXG4gICAgICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuZmllbGRIdG1sQ2xhc3MsICdmb3JtLWNvbnRyb2wnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZm9ybUNvbnRyb2wpIHtcbiAgICAgICAgdGhpcy51cGRhdGVIZWxwQmxvY2sodGhpcy5mb3JtQ29udHJvbC5zdGF0dXMpO1xuICAgICAgICB0aGlzLmZvcm1Db250cm9sLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKHN0YXR1cyA9PiB0aGlzLnVwZGF0ZUhlbHBCbG9jayhzdGF0dXMpKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XG4gICAgICAgICAgbGV0IHZhcnM6IGFueVtdID0gW107XG4gICAgICAgICAgdGhpcy5kZWJ1Z091dHB1dCA9IF8ubWFwKHZhcnMsIHRoaXNWYXIgPT4gSlNPTi5zdHJpbmdpZnkodGhpc1ZhciwgbnVsbCwgMikpLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmZyYW1ld29ya0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgfVxuXG4gIHVwZGF0ZUhlbHBCbG9jayhzdGF0dXMpIHtcbiAgICB0aGlzLm9wdGlvbnMuaGVscEJsb2NrID0gc3RhdHVzID09PSAnSU5WQUxJRCcgJiZcbiAgICAgIHRoaXMub3B0aW9ucy5lbmFibGVFcnJvclN0YXRlICYmIHRoaXMuZm9ybUNvbnRyb2wuZXJyb3JzICYmXG4gICAgICAodGhpcy5mb3JtQ29udHJvbC5kaXJ0eSB8fCB0aGlzLm9wdGlvbnMuZmVlZGJhY2tPblJlbmRlcikgP1xuICAgICAgICB0aGlzLmpzZi5mb3JtYXRFcnJvcnModGhpcy5mb3JtQ29udHJvbC5lcnJvcnMsIHRoaXMub3B0aW9ucy52YWxpZGF0aW9uTWVzc2FnZXMpIDpcbiAgICAgICAgdGhpcy5vcHRpb25zLmRlc2NyaXB0aW9uIHx8IHRoaXMub3B0aW9ucy5oZWxwIHx8IG51bGw7XG4gIH1cblxuICBzZXRUaXRsZSgpOiBzdHJpbmcge1xuICAgIHN3aXRjaCAodGhpcy5sYXlvdXROb2RlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2J1dHRvbic6IGNhc2UgJ2NoZWNrYm94JzogY2FzZSAnc2VjdGlvbic6IGNhc2UgJ2hlbHAnOiBjYXNlICdtc2cnOlxuICAgICAgY2FzZSAnc3VibWl0JzogY2FzZSAnbWVzc2FnZSc6IGNhc2UgJ3RhYmFycmF5JzogY2FzZSAndGFicyc6IGNhc2UgJyRyZWYnOlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIGNhc2UgJ2FkdmFuY2VkZmllbGRzZXQnOlxuICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuZXhwYW5kYWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy50aXRsZSA9ICdBZHZhbmNlZCBvcHRpb25zJztcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICBjYXNlICdhdXRoZmllbGRzZXQnOlxuICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMuZXhwYW5kYWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMud2lkZ2V0T3B0aW9ucy50aXRsZSA9ICdBdXRoZW50aWNhdGlvbiBzZXR0aW5ncyc7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgY2FzZSAnZmllbGRzZXQnOlxuICAgICAgICB0aGlzLndpZGdldE9wdGlvbnMudGl0bGUgPSB0aGlzLm9wdGlvbnMudGl0bGU7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLnRpdGxlID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuanNmLnNldEl0ZW1UaXRsZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVJdGVtKCkge1xuICAgIHRoaXMuanNmLnJlbW92ZUl0ZW0odGhpcyk7XG4gIH1cbn1cbiJdfQ==