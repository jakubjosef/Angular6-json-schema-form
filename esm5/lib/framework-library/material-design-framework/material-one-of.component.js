/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
var MaterialOneOfComponent = /** @class */ (function () {
    function MaterialOneOfComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
    }
    /**
     * @return {?}
     */
    MaterialOneOfComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MaterialOneOfComponent.prototype.updateValue = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    MaterialOneOfComponent.decorators = [
        { type: Component, args: [{
                    selector: 'material-one-of-widget',
                    template: "",
                },] },
    ];
    /** @nocollapse */
    MaterialOneOfComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialOneOfComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return MaterialOneOfComponent;
}());
export { MaterialOneOfComponent };
if (false) {
    /** @type {?} */
    MaterialOneOfComponent.prototype.formControl;
    /** @type {?} */
    MaterialOneOfComponent.prototype.controlName;
    /** @type {?} */
    MaterialOneOfComponent.prototype.controlValue;
    /** @type {?} */
    MaterialOneOfComponent.prototype.controlDisabled;
    /** @type {?} */
    MaterialOneOfComponent.prototype.boundControl;
    /** @type {?} */
    MaterialOneOfComponent.prototype.options;
    /** @type {?} */
    MaterialOneOfComponent.prototype.layoutNode;
    /** @type {?} */
    MaterialOneOfComponent.prototype.layoutIndex;
    /** @type {?} */
    MaterialOneOfComponent.prototype.dataIndex;
    /** @type {?} */
    MaterialOneOfComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtb25lLW9mLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2pzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJsaWIvZnJhbWV3b3JrLWxpYnJhcnkvbWF0ZXJpYWwtZGVzaWduLWZyYW1ld29yay9tYXRlcmlhbC1vbmUtb2YuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUd6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7SUFtQnJFLGdDQUNVO1FBQUEsUUFBRyxHQUFILEdBQUc7K0JBUkssS0FBSzs0QkFDUixLQUFLO0tBUWY7Ozs7SUFFTCx5Q0FBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xDOzs7OztJQUVELDRDQUFXOzs7O0lBQVgsVUFBWSxLQUFLO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEQ7O2dCQTFCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Ozs7Z0JBUFEscUJBQXFCOzs7NkJBZTNCLEtBQUs7OEJBQ0wsS0FBSzs0QkFDTCxLQUFLOztpQ0FwQlI7O1NBV2Esc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cbi8vIFRPRE86IEFkZCB0aGlzIGNvbnRyb2xcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtb25lLW9mLXdpZGdldCcsXG4gIHRlbXBsYXRlOiBgYCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxPbmVPZkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBjb250cm9sRGlzYWJsZWQgPSBmYWxzZTtcbiAgYm91bmRDb250cm9sID0gZmFsc2U7XG4gIG9wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMpO1xuICB9XG5cbiAgdXBkYXRlVmFsdWUoZXZlbnQpIHtcbiAgICB0aGlzLmpzZi51cGRhdGVWYWx1ZSh0aGlzLCBldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG59XG4iXX0=