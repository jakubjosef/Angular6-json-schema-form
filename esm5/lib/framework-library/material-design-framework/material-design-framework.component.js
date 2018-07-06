/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { isDefined } from '../../shared';
var MaterialDesignFrameworkComponent = /** @class */ (function () {
    function MaterialDesignFrameworkComponent(changeDetector, jsf) {
        this.changeDetector = changeDetector;
        this.jsf = jsf;
        this.frameworkInitialized = false;
        this.formControl = null;
        this.parentArray = null;
        this.isOrderable = false;
        this.dynamicTitle = null;
    }
    Object.defineProperty(MaterialDesignFrameworkComponent.prototype, "showRemoveButton", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this.layoutNode || !this.widgetOptions.removable ||
                this.widgetOptions.readonly || this.layoutNode.type === '$ref') {
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
    MaterialDesignFrameworkComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.initializeFramework();
    };
    /**
     * @return {?}
     */
    MaterialDesignFrameworkComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        if (!this.frameworkInitialized) {
            this.initializeFramework();
        }
        if (this.dynamicTitle) {
            this.updateTitle();
        }
    };
    /**
     * @return {?}
     */
    MaterialDesignFrameworkComponent.prototype.initializeFramework = /**
     * @return {?}
     */
    function () {
        if (this.layoutNode) {
            this.options = _.cloneDeep(this.layoutNode.options || {});
            this.widgetLayoutNode = tslib_1.__assign({}, this.layoutNode, { options: _.cloneDeep(this.layoutNode.options || {}) });
            this.widgetOptions = this.widgetLayoutNode.options;
            this.formControl = this.jsf.getFormControl(this);
            if (isDefined(this.widgetOptions.minimum) &&
                isDefined(this.widgetOptions.maximum) &&
                this.widgetOptions.multipleOf >= 1) {
                this.layoutNode.type = 'range';
            }
            if (!['$ref', 'advancedfieldset', 'authfieldset', 'button', 'card',
                'checkbox', 'expansion-panel', 'help', 'message', 'msg', 'section',
                'submit', 'tabarray', 'tabs'].includes(this.layoutNode.type) &&
                /{{.+?}}/.test(this.widgetOptions.title || '')) {
                this.dynamicTitle = this.widgetOptions.title;
                this.updateTitle();
            }
            if (this.layoutNode.arrayItem && this.layoutNode.type !== '$ref') {
                this.parentArray = this.jsf.getParentNode(this);
                if (this.parentArray) {
                    this.isOrderable =
                        this.parentArray.type.slice(0, 3) !== 'tab' &&
                            this.layoutNode.arrayItemType === 'list' &&
                            !this.widgetOptions.readonly &&
                            this.parentArray.options.orderable;
                }
            }
            this.frameworkInitialized = true;
        }
        else {
            this.options = {};
        }
    };
    /**
     * @return {?}
     */
    MaterialDesignFrameworkComponent.prototype.updateTitle = /**
     * @return {?}
     */
    function () {
        this.widgetLayoutNode.options.title = this.jsf.parseText(this.dynamicTitle, this.jsf.getFormControlValue(this), this.jsf.getFormControlGroup(this).value, this.dataIndex[this.dataIndex.length - 1]);
    };
    /**
     * @return {?}
     */
    MaterialDesignFrameworkComponent.prototype.removeItem = /**
     * @return {?}
     */
    function () {
        this.jsf.removeItem(this);
    };
    MaterialDesignFrameworkComponent.decorators = [
        { type: Component, args: [{
                    selector: 'material-design-framework',
                    template: "\n    <div\n      [class.array-item]=\"widgetLayoutNode?.arrayItem && widgetLayoutNode?.type !== '$ref'\"\n      [orderable]=\"isOrderable\"\n      [dataIndex]=\"dataIndex\"\n      [layoutIndex]=\"layoutIndex\"\n      [layoutNode]=\"widgetLayoutNode\">\n      <svg *ngIf=\"showRemoveButton\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        height=\"18\" width=\"18\" viewBox=\"0 0 24 24\"\n        class=\"close-button\"\n        (click)=\"removeItem()\">\n        <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z\"/>\n      </svg>\n      <select-widget-widget\n        [dataIndex]=\"dataIndex\"\n        [layoutIndex]=\"layoutIndex\"\n        [layoutNode]=\"widgetLayoutNode\"></select-widget-widget>\n    </div>\n    <div class=\"spacer\" *ngIf=\"widgetLayoutNode?.arrayItem && widgetLayoutNode?.type !== '$ref'\"></div>",
                    styles: ["\n    .array-item {\n      border-radius: 2px;\n      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),\n                  0 2px 2px  0   rgba(0,0,0,.14),\n                  0 1px 5px  0   rgba(0,0,0,.12);\n      padding: 6px;\n      position: relative;\n      transition: all 280ms cubic-bezier(.4, 0, .2, 1);\n    }\n    .close-button {\n      cursor: pointer;\n      position: absolute;\n      top: 6px;\n      right: 6px;\n      fill: rgba(0,0,0,.4);\n      visibility: hidden;\n      z-index: 500;\n    }\n    .close-button:hover { fill: rgba(0,0,0,.8); }\n    .array-item:hover > .close-button { visibility: visible; }\n    .spacer { margin: 6px 0; }\n    [draggable=true]:hover {\n      box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),\n                  0 8px 10px 1px rgba(0,0,0,.14),\n                  0 3px 14px 2px rgba(0,0,0,.12);\n      cursor: move;\n      z-index: 10;\n    }\n    [draggable=true].drag-target-top {\n      box-shadow: 0 -2px 0 #000;\n      position: relative; z-index: 20;\n    }\n    [draggable=true].drag-target-bottom {\n      box-shadow: 0 2px 0 #000;\n      position: relative; z-index: 20;\n    }\n  "],
                },] },
    ];
    /** @nocollapse */
    MaterialDesignFrameworkComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: JsonSchemaFormService }
    ]; };
    MaterialDesignFrameworkComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return MaterialDesignFrameworkComponent;
}());
export { MaterialDesignFrameworkComponent };
if (false) {
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.frameworkInitialized;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.inputType;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.options;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.widgetLayoutNode;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.widgetOptions;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.formControl;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.parentArray;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.isOrderable;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.dynamicTitle;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.layoutNode;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.layoutIndex;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.dataIndex;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.changeDetector;
    /** @type {?} */
    MaterialDesignFrameworkComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZGVzaWduLWZyYW1ld29yay5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL2ZyYW1ld29yay1saWJyYXJ5L21hdGVyaWFsLWRlc2lnbi1mcmFtZXdvcmsvbWF0ZXJpYWwtZGVzaWduLWZyYW1ld29yay5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFFdkYsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFFNUIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdkUsT0FBTyxFQUFtQixTQUFTLEVBQWUsTUFBTSxjQUFjLENBQUM7O0lBNkVyRSwwQ0FDVSxnQkFDQTtRQURBLG1CQUFjLEdBQWQsY0FBYztRQUNkLFFBQUcsR0FBSCxHQUFHO29DQWZVLEtBQUs7MkJBS1QsSUFBSTsyQkFDSixJQUFJOzJCQUNULEtBQUs7NEJBQ0ksSUFBSTtLQVF0QjtJQUVMLHNCQUFJLDhEQUFnQjs7OztRQUFwQjtZQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUztnQkFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssTUFDMUQsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUFFO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFBRTtZQUN4RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FB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QUFFLDJCQUEyQjtvQkFDckMsUUFBUSxFQUFFLHM0QkFtQjRGO29CQUN0RyxNQUFNLEVBQUUsQ0FBQyx5bUNBcUNSLENBQUM7aUJBQ0g7Ozs7Z0JBbkVRLGlCQUFpQjtnQkFJakIscUJBQXFCOzs7NkJBMEUzQixLQUFLOzhCQUNMLEtBQUs7NEJBQ0wsS0FBSzs7MkNBaEZSOztTQW9FYSxnQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi8uLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgaGFzT3duLCBpc0FycmF5LCBpc0RlZmluZWQsIHRvVGl0bGVDYXNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtZGVzaWduLWZyYW1ld29yaycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgW2NsYXNzLmFycmF5LWl0ZW1dPVwid2lkZ2V0TGF5b3V0Tm9kZT8uYXJyYXlJdGVtICYmIHdpZGdldExheW91dE5vZGU/LnR5cGUgIT09ICckcmVmJ1wiXG4gICAgICBbb3JkZXJhYmxlXT1cImlzT3JkZXJhYmxlXCJcbiAgICAgIFtkYXRhSW5kZXhdPVwiZGF0YUluZGV4XCJcbiAgICAgIFtsYXlvdXRJbmRleF09XCJsYXlvdXRJbmRleFwiXG4gICAgICBbbGF5b3V0Tm9kZV09XCJ3aWRnZXRMYXlvdXROb2RlXCI+XG4gICAgICA8c3ZnICpuZ0lmPVwic2hvd1JlbW92ZUJ1dHRvblwiXG4gICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICBoZWlnaHQ9XCIxOFwiIHdpZHRoPVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgY2xhc3M9XCJjbG9zZS1idXR0b25cIlxuICAgICAgICAoY2xpY2spPVwicmVtb3ZlSXRlbSgpXCI+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyIDE5IDYuNDF6XCIvPlxuICAgICAgPC9zdmc+XG4gICAgICA8c2VsZWN0LXdpZGdldC13aWRnZXRcbiAgICAgICAgW2RhdGFJbmRleF09XCJkYXRhSW5kZXhcIlxuICAgICAgICBbbGF5b3V0SW5kZXhdPVwibGF5b3V0SW5kZXhcIlxuICAgICAgICBbbGF5b3V0Tm9kZV09XCJ3aWRnZXRMYXlvdXROb2RlXCI+PC9zZWxlY3Qtd2lkZ2V0LXdpZGdldD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic3BhY2VyXCIgKm5nSWY9XCJ3aWRnZXRMYXlvdXROb2RlPy5hcnJheUl0ZW0gJiYgd2lkZ2V0TGF5b3V0Tm9kZT8udHlwZSAhPT0gJyRyZWYnXCI+PC9kaXY+YCxcbiAgc3R5bGVzOiBbYFxuICAgIC5hcnJheS1pdGVtIHtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICAgIGJveC1zaGFkb3c6IDAgM3B4IDFweCAtMnB4IHJnYmEoMCwwLDAsLjIpLFxuICAgICAgICAgICAgICAgICAgMCAycHggMnB4ICAwICAgcmdiYSgwLDAsMCwuMTQpLFxuICAgICAgICAgICAgICAgICAgMCAxcHggNXB4ICAwICAgcmdiYSgwLDAsMCwuMTIpO1xuICAgICAgcGFkZGluZzogNnB4O1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgdHJhbnNpdGlvbjogYWxsIDI4MG1zIGN1YmljLWJlemllciguNCwgMCwgLjIsIDEpO1xuICAgIH1cbiAgICAuY2xvc2UtYnV0dG9uIHtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogNnB4O1xuICAgICAgcmlnaHQ6IDZweDtcbiAgICAgIGZpbGw6IHJnYmEoMCwwLDAsLjQpO1xuICAgICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgICAgei1pbmRleDogNTAwO1xuICAgIH1cbiAgICAuY2xvc2UtYnV0dG9uOmhvdmVyIHsgZmlsbDogcmdiYSgwLDAsMCwuOCk7IH1cbiAgICAuYXJyYXktaXRlbTpob3ZlciA+IC5jbG9zZS1idXR0b24geyB2aXNpYmlsaXR5OiB2aXNpYmxlOyB9XG4gICAgLnNwYWNlciB7IG1hcmdpbjogNnB4IDA7IH1cbiAgICBbZHJhZ2dhYmxlPXRydWVdOmhvdmVyIHtcbiAgICAgIGJveC1zaGFkb3c6IDAgNXB4IDVweCAtM3B4IHJnYmEoMCwwLDAsLjIpLFxuICAgICAgICAgICAgICAgICAgMCA4cHggMTBweCAxcHggcmdiYSgwLDAsMCwuMTQpLFxuICAgICAgICAgICAgICAgICAgMCAzcHggMTRweCAycHggcmdiYSgwLDAsMCwuMTIpO1xuICAgICAgY3Vyc29yOiBtb3ZlO1xuICAgICAgei1pbmRleDogMTA7XG4gICAgfVxuICAgIFtkcmFnZ2FibGU9dHJ1ZV0uZHJhZy10YXJnZXQtdG9wIHtcbiAgICAgIGJveC1zaGFkb3c6IDAgLTJweCAwICMwMDA7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDIwO1xuICAgIH1cbiAgICBbZHJhZ2dhYmxlPXRydWVdLmRyYWctdGFyZ2V0LWJvdHRvbSB7XG4gICAgICBib3gtc2hhZG93OiAwIDJweCAwICMwMDA7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDIwO1xuICAgIH1cbiAgYF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsRGVzaWduRnJhbWV3b3JrQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBmcmFtZXdvcmtJbml0aWFsaXplZCA9IGZhbHNlO1xuICBpbnB1dFR5cGU6IHN0cmluZztcbiAgb3B0aW9uczogYW55OyAvLyBPcHRpb25zIHVzZWQgaW4gdGhpcyBmcmFtZXdvcmtcbiAgd2lkZ2V0TGF5b3V0Tm9kZTogYW55OyAvLyBsYXlvdXROb2RlIHBhc3NlZCB0byBjaGlsZCB3aWRnZXRcbiAgd2lkZ2V0T3B0aW9uczogYW55OyAvLyBPcHRpb25zIHBhc3NlZCB0byBjaGlsZCB3aWRnZXRcbiAgZm9ybUNvbnRyb2w6IGFueSA9IG51bGw7XG4gIHBhcmVudEFycmF5OiBhbnkgPSBudWxsO1xuICBpc09yZGVyYWJsZSA9IGZhbHNlO1xuICBkeW5hbWljVGl0bGU6IHN0cmluZyA9IG51bGw7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBnZXQgc2hvd1JlbW92ZUJ1dHRvbigpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMubGF5b3V0Tm9kZSB8fCAhdGhpcy53aWRnZXRPcHRpb25zLnJlbW92YWJsZSB8fFxuICAgICAgdGhpcy53aWRnZXRPcHRpb25zLnJlYWRvbmx5IHx8IHRoaXMubGF5b3V0Tm9kZS50eXBlID09PSAnJHJlZidcbiAgICApIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKHRoaXMubGF5b3V0Tm9kZS5yZWN1cnNpdmVSZWZlcmVuY2UpIHsgcmV0dXJuIHRydWU7IH1cbiAgICBpZiAoIXRoaXMubGF5b3V0Tm9kZS5hcnJheUl0ZW0gfHwgIXRoaXMucGFyZW50QXJyYXkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgLy8gSWYgYXJyYXkgbGVuZ3RoIDw9IG1pbkl0ZW1zLCBkb24ndCBhbGxvdyByZW1vdmluZyBhbnkgaXRlbXNcbiAgICByZXR1cm4gdGhpcy5wYXJlbnRBcnJheS5pdGVtcy5sZW5ndGggLSAxIDw9IHRoaXMucGFyZW50QXJyYXkub3B0aW9ucy5taW5JdGVtcyA/IGZhbHNlIDpcbiAgICAgIC8vIEZvciByZW1vdmFibGUgbGlzdCBpdGVtcywgYWxsb3cgcmVtb3ZpbmcgYW55IGl0ZW1cbiAgICAgIHRoaXMubGF5b3V0Tm9kZS5hcnJheUl0ZW1UeXBlID09PSAnbGlzdCcgPyB0cnVlIDpcbiAgICAgIC8vIEZvciByZW1vdmFibGUgdHVwbGUgaXRlbXMsIG9ubHkgYWxsb3cgcmVtb3ZpbmcgbGFzdCBpdGVtIGluIGxpc3RcbiAgICAgIHRoaXMubGF5b3V0SW5kZXhbdGhpcy5sYXlvdXRJbmRleC5sZW5ndGggLSAxXSA9PT0gdGhpcy5wYXJlbnRBcnJheS5pdGVtcy5sZW5ndGggLSAyO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplRnJhbWV3b3JrKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAoIXRoaXMuZnJhbWV3b3JrSW5pdGlhbGl6ZWQpIHsgdGhpcy5pbml0aWFsaXplRnJhbWV3b3JrKCk7IH1cbiAgICBpZiAodGhpcy5keW5hbWljVGl0bGUpIHsgdGhpcy51cGRhdGVUaXRsZSgpOyB9XG4gIH1cblxuICBpbml0aWFsaXplRnJhbWV3b3JrKCkge1xuICAgIGlmICh0aGlzLmxheW91dE5vZGUpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uY2xvbmVEZWVwKHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9KTtcbiAgICAgIHRoaXMud2lkZ2V0TGF5b3V0Tm9kZSA9IHtcbiAgICAgICAgLi4udGhpcy5sYXlvdXROb2RlLFxuICAgICAgICBvcHRpb25zOiBfLmNsb25lRGVlcCh0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fSlcbiAgICAgIH07XG4gICAgICB0aGlzLndpZGdldE9wdGlvbnMgPSB0aGlzLndpZGdldExheW91dE5vZGUub3B0aW9ucztcbiAgICAgIHRoaXMuZm9ybUNvbnRyb2wgPSB0aGlzLmpzZi5nZXRGb3JtQ29udHJvbCh0aGlzKTtcblxuICAgICAgaWYgKFxuICAgICAgICBpc0RlZmluZWQodGhpcy53aWRnZXRPcHRpb25zLm1pbmltdW0pICYmXG4gICAgICAgIGlzRGVmaW5lZCh0aGlzLndpZGdldE9wdGlvbnMubWF4aW11bSkgJiZcbiAgICAgICAgdGhpcy53aWRnZXRPcHRpb25zLm11bHRpcGxlT2YgPj0gMVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMubGF5b3V0Tm9kZS50eXBlID0gJ3JhbmdlJztcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICAhWyckcmVmJywgJ2FkdmFuY2VkZmllbGRzZXQnLCAnYXV0aGZpZWxkc2V0JywgJ2J1dHRvbicsICdjYXJkJyxcbiAgICAgICAgICAnY2hlY2tib3gnLCAnZXhwYW5zaW9uLXBhbmVsJywgJ2hlbHAnLCAnbWVzc2FnZScsICdtc2cnLCAnc2VjdGlvbicsXG4gICAgICAgICAgJ3N1Ym1pdCcsICd0YWJhcnJheScsICd0YWJzJ10uaW5jbHVkZXModGhpcy5sYXlvdXROb2RlLnR5cGUpICYmXG4gICAgICAgIC97ey4rP319Ly50ZXN0KHRoaXMud2lkZ2V0T3B0aW9ucy50aXRsZSB8fCAnJylcbiAgICAgICkge1xuICAgICAgICB0aGlzLmR5bmFtaWNUaXRsZSA9IHRoaXMud2lkZ2V0T3B0aW9ucy50aXRsZTtcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sYXlvdXROb2RlLmFycmF5SXRlbSAmJiB0aGlzLmxheW91dE5vZGUudHlwZSAhPT0gJyRyZWYnKSB7XG4gICAgICAgIHRoaXMucGFyZW50QXJyYXkgPSB0aGlzLmpzZi5nZXRQYXJlbnROb2RlKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRBcnJheSkge1xuICAgICAgICAgIHRoaXMuaXNPcmRlcmFibGUgPVxuICAgICAgICAgICAgdGhpcy5wYXJlbnRBcnJheS50eXBlLnNsaWNlKDAsIDMpICE9PSAndGFiJyAmJlxuICAgICAgICAgICAgdGhpcy5sYXlvdXROb2RlLmFycmF5SXRlbVR5cGUgPT09ICdsaXN0JyAmJlxuICAgICAgICAgICAgIXRoaXMud2lkZ2V0T3B0aW9ucy5yZWFkb25seSAmJlxuICAgICAgICAgICAgdGhpcy5wYXJlbnRBcnJheS5vcHRpb25zLm9yZGVyYWJsZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmZyYW1ld29ya0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlVGl0bGUoKSB7XG4gICAgdGhpcy53aWRnZXRMYXlvdXROb2RlLm9wdGlvbnMudGl0bGUgPSB0aGlzLmpzZi5wYXJzZVRleHQoXG4gICAgICB0aGlzLmR5bmFtaWNUaXRsZSxcbiAgICAgIHRoaXMuanNmLmdldEZvcm1Db250cm9sVmFsdWUodGhpcyksXG4gICAgICB0aGlzLmpzZi5nZXRGb3JtQ29udHJvbEdyb3VwKHRoaXMpLnZhbHVlLFxuICAgICAgdGhpcy5kYXRhSW5kZXhbdGhpcy5kYXRhSW5kZXgubGVuZ3RoIC0gMV1cbiAgICApO1xuICB9XG5cbiAgcmVtb3ZlSXRlbSgpIHtcbiAgICB0aGlzLmpzZi5yZW1vdmVJdGVtKHRoaXMpO1xuICB9XG59XG4iXX0=