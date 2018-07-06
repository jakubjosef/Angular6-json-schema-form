/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
var MaterialCheckboxComponent = /** @class */ (function () {
    function MaterialCheckboxComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.trueValue = true;
        this.falseValue = false;
        this.showSlideToggle = false;
    }
    /**
     * @return {?}
     */
    MaterialCheckboxComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this, !this.options.readonly);
        if (this.controlValue === null || this.controlValue === undefined) {
            this.controlValue = false;
            this.jsf.updateValue(this, this.falseValue);
        }
        if (this.layoutNode.type === 'slide-toggle' ||
            this.layoutNode.format === 'slide-toggle') {
            this.showSlideToggle = true;
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MaterialCheckboxComponent.prototype.updateValue = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.checked ? this.trueValue : this.falseValue);
    };
    Object.defineProperty(MaterialCheckboxComponent.prototype, "isChecked", {
        get: /**
         * @return {?}
         */
        function () {
            return this.jsf.getFormControlValue(this) === this.trueValue;
        },
        enumerable: true,
        configurable: true
    });
    MaterialCheckboxComponent.decorators = [
        { type: Component, args: [{
                    selector: 'material-checkbox-widget',
                    template: "\n    <mat-checkbox *ngIf=\"boundControl && !showSlideToggle\"\n      [formControl]=\"formControl\"\n      align=\"left\"\n      [color]=\"options?.color || 'primary'\"\n      [id]=\"'control' + layoutNode?._id\"\n      labelPosition=\"after\"\n      [name]=\"controlName\"\n      (blur)=\"options.showErrors = true\">\n      <span *ngIf=\"options?.title\"\n        class=\"checkbox-name\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></span>\n    </mat-checkbox>\n    <mat-checkbox *ngIf=\"!boundControl && !showSlideToggle\"\n      align=\"left\"\n      [color]=\"options?.color || 'primary'\"\n      [disabled]=\"controlDisabled || options?.readonly\"\n      [id]=\"'control' + layoutNode?._id\"\n      labelPosition=\"after\"\n      [name]=\"controlName\"\n      [checked]=\"isChecked\"\n      (blur)=\"options.showErrors = true\"\n      (change)=\"updateValue($event)\">\n      <span *ngIf=\"options?.title\"\n        class=\"checkbox-name\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></span>\n    </mat-checkbox>\n    <mat-slide-toggle *ngIf=\"boundControl && showSlideToggle\"\n      [formControl]=\"formControl\"\n      align=\"left\"\n      [color]=\"options?.color || 'primary'\"\n      [id]=\"'control' + layoutNode?._id\"\n      labelPosition=\"after\"\n      [name]=\"controlName\"\n      (blur)=\"options.showErrors = true\">\n      <span *ngIf=\"options?.title\"\n        class=\"checkbox-name\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></span>\n    </mat-slide-toggle>\n    <mat-slide-toggle *ngIf=\"!boundControl && showSlideToggle\"\n      align=\"left\"\n      [color]=\"options?.color || 'primary'\"\n      [disabled]=\"controlDisabled || options?.readonly\"\n      [id]=\"'control' + layoutNode?._id\"\n      labelPosition=\"after\"\n      [name]=\"controlName\"\n      [checked]=\"isChecked\"\n      (blur)=\"options.showErrors = true\"\n      (change)=\"updateValue($event)\">\n      <span *ngIf=\"options?.title\"\n        class=\"checkbox-name\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></span>\n    </mat-slide-toggle>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                    styles: ["\n    .checkbox-name { white-space: nowrap; }\n    mat-error { font-size: 75%; }\n  "],
                },] },
    ];
    /** @nocollapse */
    MaterialCheckboxComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialCheckboxComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return MaterialCheckboxComponent;
}());
export { MaterialCheckboxComponent };
if (false) {
    /** @type {?} */
    MaterialCheckboxComponent.prototype.formControl;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.controlName;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.controlValue;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.controlDisabled;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.boundControl;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.options;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.trueValue;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.falseValue;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.showSlideToggle;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.layoutNode;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.layoutIndex;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.dataIndex;
    /** @type {?} */
    MaterialCheckboxComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtY2hlY2tib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi9mcmFtZXdvcmstbGlicmFyeS9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrL21hdGVyaWFsLWNoZWNrYm94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7O0lBbUZyRSxtQ0FDVTtRQUFBLFFBQUcsR0FBSCxHQUFHOytCQVhLLEtBQUs7NEJBQ1IsS0FBSzt5QkFFSCxJQUFJOzBCQUNILEtBQUs7K0JBQ0wsS0FBSztLQU9sQjs7OztJQUVMLDRDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLGNBQWM7WUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssY0FDN0IsQ0FBQyxDQUFDLENBQUM7WUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztTQUM3QjtLQUNGOzs7OztJQUVELCtDQUFXOzs7O0lBQVgsVUFBWSxLQUFLO1FBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDOUU7SUFFRCxzQkFBSSxnREFBUzs7OztRQUFiO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUM5RDs7O09BQUE7O2dCQXpHRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsUUFBUSxFQUFFLHEyRUEwRDJDO29CQUNyRCxNQUFNLEVBQUUsQ0FBQyxzRkFHUixDQUFDO2lCQUNIOzs7O2dCQXBFUSxxQkFBcUI7Ozs2QkErRTNCLEtBQUs7OEJBQ0wsS0FBSzs0QkFDTCxLQUFLOztvQ0FwRlI7O1NBd0VhLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi8uLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgaGFzT3duIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvdXRpbGl0eS5mdW5jdGlvbnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXRlcmlhbC1jaGVja2JveC13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxtYXQtY2hlY2tib3ggKm5nSWY9XCJib3VuZENvbnRyb2wgJiYgIXNob3dTbGlkZVRvZ2dsZVwiXG4gICAgICBbZm9ybUNvbnRyb2xdPVwiZm9ybUNvbnRyb2xcIlxuICAgICAgYWxpZ249XCJsZWZ0XCJcbiAgICAgIFtjb2xvcl09XCJvcHRpb25zPy5jb2xvciB8fCAncHJpbWFyeSdcIlxuICAgICAgW2lkXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZFwiXG4gICAgICBsYWJlbFBvc2l0aW9uPVwiYWZ0ZXJcIlxuICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgKGJsdXIpPVwib3B0aW9ucy5zaG93RXJyb3JzID0gdHJ1ZVwiPlxuICAgICAgPHNwYW4gKm5nSWY9XCJvcHRpb25zPy50aXRsZVwiXG4gICAgICAgIGNsYXNzPVwiY2hlY2tib3gtbmFtZVwiXG4gICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L3NwYW4+XG4gICAgPC9tYXQtY2hlY2tib3g+XG4gICAgPG1hdC1jaGVja2JveCAqbmdJZj1cIiFib3VuZENvbnRyb2wgJiYgIXNob3dTbGlkZVRvZ2dsZVwiXG4gICAgICBhbGlnbj1cImxlZnRcIlxuICAgICAgW2NvbG9yXT1cIm9wdGlvbnM/LmNvbG9yIHx8ICdwcmltYXJ5J1wiXG4gICAgICBbZGlzYWJsZWRdPVwiY29udHJvbERpc2FibGVkIHx8IG9wdGlvbnM/LnJlYWRvbmx5XCJcbiAgICAgIFtpZF09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWRcIlxuICAgICAgbGFiZWxQb3NpdGlvbj1cImFmdGVyXCJcbiAgICAgIFtuYW1lXT1cImNvbnRyb2xOYW1lXCJcbiAgICAgIFtjaGVja2VkXT1cImlzQ2hlY2tlZFwiXG4gICAgICAoYmx1cik9XCJvcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlXCJcbiAgICAgIChjaGFuZ2UpPVwidXBkYXRlVmFsdWUoJGV2ZW50KVwiPlxuICAgICAgPHNwYW4gKm5nSWY9XCJvcHRpb25zPy50aXRsZVwiXG4gICAgICAgIGNsYXNzPVwiY2hlY2tib3gtbmFtZVwiXG4gICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L3NwYW4+XG4gICAgPC9tYXQtY2hlY2tib3g+XG4gICAgPG1hdC1zbGlkZS10b2dnbGUgKm5nSWY9XCJib3VuZENvbnRyb2wgJiYgc2hvd1NsaWRlVG9nZ2xlXCJcbiAgICAgIFtmb3JtQ29udHJvbF09XCJmb3JtQ29udHJvbFwiXG4gICAgICBhbGlnbj1cImxlZnRcIlxuICAgICAgW2NvbG9yXT1cIm9wdGlvbnM/LmNvbG9yIHx8ICdwcmltYXJ5J1wiXG4gICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgIGxhYmVsUG9zaXRpb249XCJhZnRlclwiXG4gICAgICBbbmFtZV09XCJjb250cm9sTmFtZVwiXG4gICAgICAoYmx1cik9XCJvcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlXCI+XG4gICAgICA8c3BhbiAqbmdJZj1cIm9wdGlvbnM/LnRpdGxlXCJcbiAgICAgICAgY2xhc3M9XCJjaGVja2JveC1uYW1lXCJcbiAgICAgICAgW3N0eWxlLmRpc3BsYXldPVwib3B0aW9ucz8ubm90aXRsZSA/ICdub25lJyA6ICcnXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy50aXRsZVwiPjwvc3Bhbj5cbiAgICA8L21hdC1zbGlkZS10b2dnbGU+XG4gICAgPG1hdC1zbGlkZS10b2dnbGUgKm5nSWY9XCIhYm91bmRDb250cm9sICYmIHNob3dTbGlkZVRvZ2dsZVwiXG4gICAgICBhbGlnbj1cImxlZnRcIlxuICAgICAgW2NvbG9yXT1cIm9wdGlvbnM/LmNvbG9yIHx8ICdwcmltYXJ5J1wiXG4gICAgICBbZGlzYWJsZWRdPVwiY29udHJvbERpc2FibGVkIHx8IG9wdGlvbnM/LnJlYWRvbmx5XCJcbiAgICAgIFtpZF09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWRcIlxuICAgICAgbGFiZWxQb3NpdGlvbj1cImFmdGVyXCJcbiAgICAgIFtuYW1lXT1cImNvbnRyb2xOYW1lXCJcbiAgICAgIFtjaGVja2VkXT1cImlzQ2hlY2tlZFwiXG4gICAgICAoYmx1cik9XCJvcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlXCJcbiAgICAgIChjaGFuZ2UpPVwidXBkYXRlVmFsdWUoJGV2ZW50KVwiPlxuICAgICAgPHNwYW4gKm5nSWY9XCJvcHRpb25zPy50aXRsZVwiXG4gICAgICAgIGNsYXNzPVwiY2hlY2tib3gtbmFtZVwiXG4gICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L3NwYW4+XG4gICAgPC9tYXQtc2xpZGUtdG9nZ2xlPlxuICAgIDxtYXQtZXJyb3IgKm5nSWY9XCJvcHRpb25zPy5zaG93RXJyb3JzICYmIG9wdGlvbnM/LmVycm9yTWVzc2FnZVwiXG4gICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LmVycm9yTWVzc2FnZVwiPjwvbWF0LWVycm9yPmAsXG4gIHN0eWxlczogW2BcbiAgICAuY2hlY2tib3gtbmFtZSB7IHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbiAgICBtYXQtZXJyb3IgeyBmb250LXNpemU6IDc1JTsgfVxuICBgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxDaGVja2JveENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBjb250cm9sRGlzYWJsZWQgPSBmYWxzZTtcbiAgYm91bmRDb250cm9sID0gZmFsc2U7XG4gIG9wdGlvbnM6IGFueTtcbiAgdHJ1ZVZhbHVlOiBhbnkgPSB0cnVlO1xuICBmYWxzZVZhbHVlOiBhbnkgPSBmYWxzZTtcbiAgc2hvd1NsaWRlVG9nZ2xlID0gZmFsc2U7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmpzZi5pbml0aWFsaXplQ29udHJvbCh0aGlzLCAhdGhpcy5vcHRpb25zLnJlYWRvbmx5KTtcbiAgICBpZiAodGhpcy5jb250cm9sVmFsdWUgPT09IG51bGwgfHwgdGhpcy5jb250cm9sVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jb250cm9sVmFsdWUgPSBmYWxzZTtcbiAgICAgIHRoaXMuanNmLnVwZGF0ZVZhbHVlKHRoaXMsIHRoaXMuZmFsc2VWYWx1ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxheW91dE5vZGUudHlwZSA9PT0gJ3NsaWRlLXRvZ2dsZScgfHxcbiAgICAgIHRoaXMubGF5b3V0Tm9kZS5mb3JtYXQgPT09ICdzbGlkZS10b2dnbGUnXG4gICAgKSB7XG4gICAgICB0aGlzLnNob3dTbGlkZVRvZ2dsZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlVmFsdWUoZXZlbnQpIHtcbiAgICB0aGlzLm9wdGlvbnMuc2hvd0Vycm9ycyA9IHRydWU7XG4gICAgdGhpcy5qc2YudXBkYXRlVmFsdWUodGhpcywgZXZlbnQuY2hlY2tlZCA/IHRoaXMudHJ1ZVZhbHVlIDogdGhpcy5mYWxzZVZhbHVlKTtcbiAgfVxuXG4gIGdldCBpc0NoZWNrZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuanNmLmdldEZvcm1Db250cm9sVmFsdWUodGhpcykgPT09IHRoaXMudHJ1ZVZhbHVlO1xuICB9XG59XG4iXX0=