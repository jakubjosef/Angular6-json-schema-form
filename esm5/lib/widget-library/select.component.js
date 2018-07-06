/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { buildTitleMap, isArray } from '../shared';
var SelectComponent = /** @class */ (function () {
    function SelectComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.selectList = [];
        this.isArray = isArray;
    }
    /**
     * @return {?}
     */
    SelectComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.options = this.layoutNode.options || {};
        this.selectList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, !!this.options.required, !!this.options.flatList);
        this.jsf.initializeControl(this);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SelectComponent.prototype.updateValue = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.jsf.updateValue(this, event.target.value);
    };
    SelectComponent.decorators = [
        { type: Component, args: [{
                    selector: 'select-widget',
                    template: "\n    <div\n      [class]=\"options?.htmlClass || ''\">\n      <label *ngIf=\"options?.title\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <select *ngIf=\"boundControl\"\n        [formControl]=\"formControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\">\n        <ng-template ngFor let-selectItem [ngForOf]=\"selectList\">\n          <option *ngIf=\"!isArray(selectItem?.items)\"\n            [value]=\"selectItem?.value\">\n            <span [innerHTML]=\"selectItem?.name\"></span>\n          </option>\n          <optgroup *ngIf=\"isArray(selectItem?.items)\"\n            [label]=\"selectItem?.group\">\n            <option *ngFor=\"let subItem of selectItem.items\"\n              [value]=\"subItem?.value\">\n              <span [innerHTML]=\"subItem?.name\"></span>\n            </option>\n          </optgroup>\n        </ng-template>\n      </select>\n      <select *ngIf=\"!boundControl\"\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [class]=\"options?.fieldHtmlClass || ''\"\n        [disabled]=\"controlDisabled\"\n        [id]=\"'control' + layoutNode?._id\"\n        [name]=\"controlName\"\n        (change)=\"updateValue($event)\">\n        <ng-template ngFor let-selectItem [ngForOf]=\"selectList\">\n          <option *ngIf=\"!isArray(selectItem?.items)\"\n            [selected]=\"selectItem?.value === controlValue\"\n            [value]=\"selectItem?.value\">\n            <span [innerHTML]=\"selectItem?.name\"></span>\n          </option>\n          <optgroup *ngIf=\"isArray(selectItem?.items)\"\n            [label]=\"selectItem?.group\">\n            <option *ngFor=\"let subItem of selectItem.items\"\n              [attr.selected]=\"subItem?.value === controlValue\"\n              [value]=\"subItem?.value\">\n              <span [innerHTML]=\"subItem?.name\"></span>\n            </option>\n          </optgroup>\n        </ng-template>\n      </select>\n    </div>",
                },] },
    ];
    /** @nocollapse */
    SelectComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    SelectComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return SelectComponent;
}());
export { SelectComponent };
if (false) {
    /** @type {?} */
    SelectComponent.prototype.formControl;
    /** @type {?} */
    SelectComponent.prototype.controlName;
    /** @type {?} */
    SelectComponent.prototype.controlValue;
    /** @type {?} */
    SelectComponent.prototype.controlDisabled;
    /** @type {?} */
    SelectComponent.prototype.boundControl;
    /** @type {?} */
    SelectComponent.prototype.options;
    /** @type {?} */
    SelectComponent.prototype.selectList;
    /** @type {?} */
    SelectComponent.prototype.isArray;
    /** @type {?} */
    SelectComponent.prototype.layoutNode;
    /** @type {?} */
    SelectComponent.prototype.layoutIndex;
    /** @type {?} */
    SelectComponent.prototype.dataIndex;
    /** @type {?} */
    SelectComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2pzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJsaWIvd2lkZ2V0LWxpYnJhcnkvc2VsZWN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7O0lBMEVqRCx5QkFDVTtRQUFBLFFBQUcsR0FBSCxHQUFHOytCQVZLLEtBQUs7NEJBQ1IsS0FBSzswQkFFQSxFQUFFO3VCQUNaLE9BQU87S0FPWjs7OztJQUVMLGtDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FDcEUsQ0FBQztRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbEM7Ozs7O0lBRUQscUNBQVc7Ozs7SUFBWCxVQUFZLEtBQUs7UUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoRDs7Z0JBdkZGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLG84RUF1REQ7aUJBQ1Y7Ozs7Z0JBN0RRLHFCQUFxQjs7OzZCQXVFM0IsS0FBSzs4QkFDTCxLQUFLOzRCQUNMLEtBQUs7OzBCQTVFUjs7U0FpRWEsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgYnVpbGRUaXRsZU1hcCwgaXNBcnJheSB9IGZyb20gJy4uL3NoYXJlZCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NlbGVjdC13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIFtjbGFzc109XCJvcHRpb25zPy5odG1sQ2xhc3MgfHwgJydcIj5cbiAgICAgIDxsYWJlbCAqbmdJZj1cIm9wdGlvbnM/LnRpdGxlXCJcbiAgICAgICAgW2F0dHIuZm9yXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZFwiXG4gICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5sYWJlbEh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L2xhYmVsPlxuICAgICAgPHNlbGVjdCAqbmdJZj1cImJvdW5kQ29udHJvbFwiXG4gICAgICAgIFtmb3JtQ29udHJvbF09XCJmb3JtQ29udHJvbFwiXG4gICAgICAgIFthdHRyLmFyaWEtZGVzY3JpYmVkYnldPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkICsgJ1N0YXR1cydcIlxuICAgICAgICBbYXR0ci5yZWFkb25seV09XCJvcHRpb25zPy5yZWFkb25seSA/ICdyZWFkb25seScgOiBudWxsXCJcbiAgICAgICAgW2F0dHIucmVxdWlyZWRdPVwib3B0aW9ucz8ucmVxdWlyZWRcIlxuICAgICAgICBbY2xhc3NdPVwib3B0aW9ucz8uZmllbGRIdG1sQ2xhc3MgfHwgJydcIlxuICAgICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1zZWxlY3RJdGVtIFtuZ0Zvck9mXT1cInNlbGVjdExpc3RcIj5cbiAgICAgICAgICA8b3B0aW9uICpuZ0lmPVwiIWlzQXJyYXkoc2VsZWN0SXRlbT8uaXRlbXMpXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJzZWxlY3RJdGVtPy52YWx1ZVwiPlxuICAgICAgICAgICAgPHNwYW4gW2lubmVySFRNTF09XCJzZWxlY3RJdGVtPy5uYW1lXCI+PC9zcGFuPlxuICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRncm91cCAqbmdJZj1cImlzQXJyYXkoc2VsZWN0SXRlbT8uaXRlbXMpXCJcbiAgICAgICAgICAgIFtsYWJlbF09XCJzZWxlY3RJdGVtPy5ncm91cFwiPlxuICAgICAgICAgICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgc3ViSXRlbSBvZiBzZWxlY3RJdGVtLml0ZW1zXCJcbiAgICAgICAgICAgICAgW3ZhbHVlXT1cInN1Ykl0ZW0/LnZhbHVlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIFtpbm5lckhUTUxdPVwic3ViSXRlbT8ubmFtZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgIDwvb3B0Z3JvdXA+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8L3NlbGVjdD5cbiAgICAgIDxzZWxlY3QgKm5nSWY9XCIhYm91bmRDb250cm9sXCJcbiAgICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWQgKyAnU3RhdHVzJ1wiXG4gICAgICAgIFthdHRyLnJlYWRvbmx5XT1cIm9wdGlvbnM/LnJlYWRvbmx5ID8gJ3JlYWRvbmx5JyA6IG51bGxcIlxuICAgICAgICBbYXR0ci5yZXF1aXJlZF09XCJvcHRpb25zPy5yZXF1aXJlZFwiXG4gICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5maWVsZEh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sRGlzYWJsZWRcIlxuICAgICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgICAoY2hhbmdlKT1cInVwZGF0ZVZhbHVlKCRldmVudClcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1zZWxlY3RJdGVtIFtuZ0Zvck9mXT1cInNlbGVjdExpc3RcIj5cbiAgICAgICAgICA8b3B0aW9uICpuZ0lmPVwiIWlzQXJyYXkoc2VsZWN0SXRlbT8uaXRlbXMpXCJcbiAgICAgICAgICAgIFtzZWxlY3RlZF09XCJzZWxlY3RJdGVtPy52YWx1ZSA9PT0gY29udHJvbFZhbHVlXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJzZWxlY3RJdGVtPy52YWx1ZVwiPlxuICAgICAgICAgICAgPHNwYW4gW2lubmVySFRNTF09XCJzZWxlY3RJdGVtPy5uYW1lXCI+PC9zcGFuPlxuICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRncm91cCAqbmdJZj1cImlzQXJyYXkoc2VsZWN0SXRlbT8uaXRlbXMpXCJcbiAgICAgICAgICAgIFtsYWJlbF09XCJzZWxlY3RJdGVtPy5ncm91cFwiPlxuICAgICAgICAgICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgc3ViSXRlbSBvZiBzZWxlY3RJdGVtLml0ZW1zXCJcbiAgICAgICAgICAgICAgW2F0dHIuc2VsZWN0ZWRdPVwic3ViSXRlbT8udmFsdWUgPT09IGNvbnRyb2xWYWx1ZVwiXG4gICAgICAgICAgICAgIFt2YWx1ZV09XCJzdWJJdGVtPy52YWx1ZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBbaW5uZXJIVE1MXT1cInN1Ykl0ZW0/Lm5hbWVcIj48L3NwYW4+XG4gICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICA8L29wdGdyb3VwPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPC9zZWxlY3Q+XG4gICAgPC9kaXY+YCxcbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZm9ybUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcbiAgY29udHJvbE5hbWU6IHN0cmluZztcbiAgY29udHJvbFZhbHVlOiBhbnk7XG4gIGNvbnRyb2xEaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZENvbnRyb2wgPSBmYWxzZTtcbiAgb3B0aW9uczogYW55O1xuICBzZWxlY3RMaXN0OiBhbnlbXSA9IFtdO1xuICBpc0FycmF5ID0gaXNBcnJheTtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuc2VsZWN0TGlzdCA9IGJ1aWxkVGl0bGVNYXAoXG4gICAgICB0aGlzLm9wdGlvbnMudGl0bGVNYXAgfHwgdGhpcy5vcHRpb25zLmVudW1OYW1lcyxcbiAgICAgIHRoaXMub3B0aW9ucy5lbnVtLCAhIXRoaXMub3B0aW9ucy5yZXF1aXJlZCwgISF0aGlzLm9wdGlvbnMuZmxhdExpc3RcbiAgICApO1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMpO1xuICB9XG5cbiAgdXBkYXRlVmFsdWUoZXZlbnQpIHtcbiAgICB0aGlzLmpzZi51cGRhdGVWYWx1ZSh0aGlzLCBldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG59XG4iXX0=