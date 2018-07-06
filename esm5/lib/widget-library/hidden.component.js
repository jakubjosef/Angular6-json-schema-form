/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
var HiddenComponent = /** @class */ (function () {
    function HiddenComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    HiddenComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.jsf.initializeControl(this);
    };
    HiddenComponent.decorators = [
        { type: Component, args: [{
                    selector: 'hidden-widget',
                    template: "\n    <input *ngIf=\"boundControl\"\n      [formControl]=\"formControl\"\n      [id]=\"'control' + layoutNode?._id\"\n      [name]=\"controlName\"\n      type=\"hidden\">\n    <input *ngIf=\"!boundControl\"\n      [disabled]=\"controlDisabled\"\n      [name]=\"controlName\"\n      [id]=\"'control' + layoutNode?._id\"\n      type=\"hidden\"\n      [value]=\"controlValue\">",
                },] },
    ];
    /** @nocollapse */
    HiddenComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    HiddenComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return HiddenComponent;
}());
export { HiddenComponent };
if (false) {
    /** @type {?} */
    HiddenComponent.prototype.formControl;
    /** @type {?} */
    HiddenComponent.prototype.controlName;
    /** @type {?} */
    HiddenComponent.prototype.controlValue;
    /** @type {?} */
    HiddenComponent.prototype.controlDisabled;
    /** @type {?} */
    HiddenComponent.prototype.boundControl;
    /** @type {?} */
    HiddenComponent.prototype.layoutNode;
    /** @type {?} */
    HiddenComponent.prototype.layoutIndex;
    /** @type {?} */
    HiddenComponent.prototype.dataIndex;
    /** @type {?} */
    HiddenComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlkZGVuLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2pzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJsaWIvd2lkZ2V0LWxpYnJhcnkvaGlkZGVuLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0lBMkJsRSx5QkFDVTtRQUFBLFFBQUcsR0FBSCxHQUFHOytCQVBLLEtBQUs7NEJBQ1IsS0FBSztLQU9mOzs7O0lBRUwsa0NBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQzs7Z0JBL0JGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLHdYQVdrQjtpQkFDN0I7Ozs7Z0JBaEJRLHFCQUFxQjs7OzZCQXVCM0IsS0FBSzs4QkFDTCxLQUFLOzRCQUNMLEtBQUs7OzBCQTVCUjs7U0FvQmEsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdoaWRkZW4td2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8aW5wdXQgKm5nSWY9XCJib3VuZENvbnRyb2xcIlxuICAgICAgW2Zvcm1Db250cm9sXT1cImZvcm1Db250cm9sXCJcbiAgICAgIFtpZF09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWRcIlxuICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgdHlwZT1cImhpZGRlblwiPlxuICAgIDxpbnB1dCAqbmdJZj1cIiFib3VuZENvbnRyb2xcIlxuICAgICAgW2Rpc2FibGVkXT1cImNvbnRyb2xEaXNhYmxlZFwiXG4gICAgICBbbmFtZV09XCJjb250cm9sTmFtZVwiXG4gICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgIHR5cGU9XCJoaWRkZW5cIlxuICAgICAgW3ZhbHVlXT1cImNvbnRyb2xWYWx1ZVwiPmAsXG59KVxuZXhwb3J0IGNsYXNzIEhpZGRlbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBjb250cm9sRGlzYWJsZWQgPSBmYWxzZTtcbiAgYm91bmRDb250cm9sID0gZmFsc2U7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmpzZi5pbml0aWFsaXplQ29udHJvbCh0aGlzKTtcbiAgfVxufVxuIl19