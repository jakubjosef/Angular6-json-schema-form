/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
export class MaterialCheckboxComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
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
    ngOnInit() {
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateValue(event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.checked ? this.trueValue : this.falseValue);
    }
    /**
     * @return {?}
     */
    get isChecked() {
        return this.jsf.getFormControlValue(this) === this.trueValue;
    }
}
MaterialCheckboxComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-checkbox-widget',
                template: `
    <mat-checkbox *ngIf="boundControl && !showSlideToggle"
      [formControl]="formControl"
      align="left"
      [color]="options?.color || 'primary'"
      [id]="'control' + layoutNode?._id"
      labelPosition="after"
      [name]="controlName"
      (blur)="options.showErrors = true">
      <span *ngIf="options?.title"
        class="checkbox-name"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </mat-checkbox>
    <mat-checkbox *ngIf="!boundControl && !showSlideToggle"
      align="left"
      [color]="options?.color || 'primary'"
      [disabled]="controlDisabled || options?.readonly"
      [id]="'control' + layoutNode?._id"
      labelPosition="after"
      [name]="controlName"
      [checked]="isChecked"
      (blur)="options.showErrors = true"
      (change)="updateValue($event)">
      <span *ngIf="options?.title"
        class="checkbox-name"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </mat-checkbox>
    <mat-slide-toggle *ngIf="boundControl && showSlideToggle"
      [formControl]="formControl"
      align="left"
      [color]="options?.color || 'primary'"
      [id]="'control' + layoutNode?._id"
      labelPosition="after"
      [name]="controlName"
      (blur)="options.showErrors = true">
      <span *ngIf="options?.title"
        class="checkbox-name"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </mat-slide-toggle>
    <mat-slide-toggle *ngIf="!boundControl && showSlideToggle"
      align="left"
      [color]="options?.color || 'primary'"
      [disabled]="controlDisabled || options?.readonly"
      [id]="'control' + layoutNode?._id"
      labelPosition="after"
      [name]="controlName"
      [checked]="isChecked"
      (blur)="options.showErrors = true"
      (change)="updateValue($event)">
      <span *ngIf="options?.title"
        class="checkbox-name"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </mat-slide-toggle>
    <mat-error *ngIf="options?.showErrors && options?.errorMessage"
      [innerHTML]="options?.errorMessage"></mat-error>`,
                styles: [`
    .checkbox-name { white-space: nowrap; }
    mat-error { font-size: 75%; }
  `],
            },] },
];
/** @nocollapse */
MaterialCheckboxComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
MaterialCheckboxComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtY2hlY2tib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi9mcmFtZXdvcmstbGlicmFyeS9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrL21hdGVyaWFsLWNoZWNrYm94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFxRXZFLE1BQU07Ozs7SUFjSixZQUNVO1FBQUEsUUFBRyxHQUFILEdBQUc7K0JBWEssS0FBSzs0QkFDUixLQUFLO3lCQUVILElBQUk7MEJBQ0gsS0FBSzsrQkFDTCxLQUFLO0tBT2xCOzs7O0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLGNBQWM7WUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssY0FDN0IsQ0FBQyxDQUFDLENBQUM7WUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztTQUM3QjtLQUNGOzs7OztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDOUU7Ozs7SUFFRCxJQUFJLFNBQVM7UUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDO0tBQzlEOzs7WUF6R0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwwQkFBMEI7Z0JBQ3BDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1REEwRDJDO2dCQUNyRCxNQUFNLEVBQUUsQ0FBQzs7O0dBR1IsQ0FBQzthQUNIOzs7O1lBcEVRLHFCQUFxQjs7O3lCQStFM0IsS0FBSzswQkFDTCxLQUFLO3dCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcbmltcG9ydCB7IGhhc093biB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL3V0aWxpdHkuZnVuY3Rpb25zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtY2hlY2tib3gtd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bWF0LWNoZWNrYm94ICpuZ0lmPVwiYm91bmRDb250cm9sICYmICFzaG93U2xpZGVUb2dnbGVcIlxuICAgICAgW2Zvcm1Db250cm9sXT1cImZvcm1Db250cm9sXCJcbiAgICAgIGFsaWduPVwibGVmdFwiXG4gICAgICBbY29sb3JdPVwib3B0aW9ucz8uY29sb3IgfHwgJ3ByaW1hcnknXCJcbiAgICAgIFtpZF09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWRcIlxuICAgICAgbGFiZWxQb3NpdGlvbj1cImFmdGVyXCJcbiAgICAgIFtuYW1lXT1cImNvbnRyb2xOYW1lXCJcbiAgICAgIChibHVyKT1cIm9wdGlvbnMuc2hvd0Vycm9ycyA9IHRydWVcIj5cbiAgICAgIDxzcGFuICpuZ0lmPVwib3B0aW9ucz8udGl0bGVcIlxuICAgICAgICBjbGFzcz1cImNoZWNrYm94LW5hbWVcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJvcHRpb25zPy5ub3RpdGxlID8gJ25vbmUnIDogJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LnRpdGxlXCI+PC9zcGFuPlxuICAgIDwvbWF0LWNoZWNrYm94PlxuICAgIDxtYXQtY2hlY2tib3ggKm5nSWY9XCIhYm91bmRDb250cm9sICYmICFzaG93U2xpZGVUb2dnbGVcIlxuICAgICAgYWxpZ249XCJsZWZ0XCJcbiAgICAgIFtjb2xvcl09XCJvcHRpb25zPy5jb2xvciB8fCAncHJpbWFyeSdcIlxuICAgICAgW2Rpc2FibGVkXT1cImNvbnRyb2xEaXNhYmxlZCB8fCBvcHRpb25zPy5yZWFkb25seVwiXG4gICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgIGxhYmVsUG9zaXRpb249XCJhZnRlclwiXG4gICAgICBbbmFtZV09XCJjb250cm9sTmFtZVwiXG4gICAgICBbY2hlY2tlZF09XCJpc0NoZWNrZWRcIlxuICAgICAgKGJsdXIpPVwib3B0aW9ucy5zaG93RXJyb3JzID0gdHJ1ZVwiXG4gICAgICAoY2hhbmdlKT1cInVwZGF0ZVZhbHVlKCRldmVudClcIj5cbiAgICAgIDxzcGFuICpuZ0lmPVwib3B0aW9ucz8udGl0bGVcIlxuICAgICAgICBjbGFzcz1cImNoZWNrYm94LW5hbWVcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJvcHRpb25zPy5ub3RpdGxlID8gJ25vbmUnIDogJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LnRpdGxlXCI+PC9zcGFuPlxuICAgIDwvbWF0LWNoZWNrYm94PlxuICAgIDxtYXQtc2xpZGUtdG9nZ2xlICpuZ0lmPVwiYm91bmRDb250cm9sICYmIHNob3dTbGlkZVRvZ2dsZVwiXG4gICAgICBbZm9ybUNvbnRyb2xdPVwiZm9ybUNvbnRyb2xcIlxuICAgICAgYWxpZ249XCJsZWZ0XCJcbiAgICAgIFtjb2xvcl09XCJvcHRpb25zPy5jb2xvciB8fCAncHJpbWFyeSdcIlxuICAgICAgW2lkXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZFwiXG4gICAgICBsYWJlbFBvc2l0aW9uPVwiYWZ0ZXJcIlxuICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgKGJsdXIpPVwib3B0aW9ucy5zaG93RXJyb3JzID0gdHJ1ZVwiPlxuICAgICAgPHNwYW4gKm5nSWY9XCJvcHRpb25zPy50aXRsZVwiXG4gICAgICAgIGNsYXNzPVwiY2hlY2tib3gtbmFtZVwiXG4gICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L3NwYW4+XG4gICAgPC9tYXQtc2xpZGUtdG9nZ2xlPlxuICAgIDxtYXQtc2xpZGUtdG9nZ2xlICpuZ0lmPVwiIWJvdW5kQ29udHJvbCAmJiBzaG93U2xpZGVUb2dnbGVcIlxuICAgICAgYWxpZ249XCJsZWZ0XCJcbiAgICAgIFtjb2xvcl09XCJvcHRpb25zPy5jb2xvciB8fCAncHJpbWFyeSdcIlxuICAgICAgW2Rpc2FibGVkXT1cImNvbnRyb2xEaXNhYmxlZCB8fCBvcHRpb25zPy5yZWFkb25seVwiXG4gICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgIGxhYmVsUG9zaXRpb249XCJhZnRlclwiXG4gICAgICBbbmFtZV09XCJjb250cm9sTmFtZVwiXG4gICAgICBbY2hlY2tlZF09XCJpc0NoZWNrZWRcIlxuICAgICAgKGJsdXIpPVwib3B0aW9ucy5zaG93RXJyb3JzID0gdHJ1ZVwiXG4gICAgICAoY2hhbmdlKT1cInVwZGF0ZVZhbHVlKCRldmVudClcIj5cbiAgICAgIDxzcGFuICpuZ0lmPVwib3B0aW9ucz8udGl0bGVcIlxuICAgICAgICBjbGFzcz1cImNoZWNrYm94LW5hbWVcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJvcHRpb25zPy5ub3RpdGxlID8gJ25vbmUnIDogJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LnRpdGxlXCI+PC9zcGFuPlxuICAgIDwvbWF0LXNsaWRlLXRvZ2dsZT5cbiAgICA8bWF0LWVycm9yICpuZ0lmPVwib3B0aW9ucz8uc2hvd0Vycm9ycyAmJiBvcHRpb25zPy5lcnJvck1lc3NhZ2VcIlxuICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5lcnJvck1lc3NhZ2VcIj48L21hdC1lcnJvcj5gLFxuICBzdHlsZXM6IFtgXG4gICAgLmNoZWNrYm94LW5hbWUgeyB3aGl0ZS1zcGFjZTogbm93cmFwOyB9XG4gICAgbWF0LWVycm9yIHsgZm9udC1zaXplOiA3NSU7IH1cbiAgYF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsQ2hlY2tib3hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBmb3JtQ29udHJvbDogQWJzdHJhY3RDb250cm9sO1xuICBjb250cm9sTmFtZTogc3RyaW5nO1xuICBjb250cm9sVmFsdWU6IGFueTtcbiAgY29udHJvbERpc2FibGVkID0gZmFsc2U7XG4gIGJvdW5kQ29udHJvbCA9IGZhbHNlO1xuICBvcHRpb25zOiBhbnk7XG4gIHRydWVWYWx1ZTogYW55ID0gdHJ1ZTtcbiAgZmFsc2VWYWx1ZTogYW55ID0gZmFsc2U7XG4gIHNob3dTbGlkZVRvZ2dsZSA9IGZhbHNlO1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gICAgdGhpcy5qc2YuaW5pdGlhbGl6ZUNvbnRyb2wodGhpcywgIXRoaXMub3B0aW9ucy5yZWFkb25seSk7XG4gICAgaWYgKHRoaXMuY29udHJvbFZhbHVlID09PSBudWxsIHx8IHRoaXMuY29udHJvbFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY29udHJvbFZhbHVlID0gZmFsc2U7XG4gICAgICB0aGlzLmpzZi51cGRhdGVWYWx1ZSh0aGlzLCB0aGlzLmZhbHNlVmFsdWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sYXlvdXROb2RlLnR5cGUgPT09ICdzbGlkZS10b2dnbGUnIHx8XG4gICAgICB0aGlzLmxheW91dE5vZGUuZm9ybWF0ID09PSAnc2xpZGUtdG9nZ2xlJ1xuICAgICkge1xuICAgICAgdGhpcy5zaG93U2xpZGVUb2dnbGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVZhbHVlKGV2ZW50KSB7XG4gICAgdGhpcy5vcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlO1xuICAgIHRoaXMuanNmLnVwZGF0ZVZhbHVlKHRoaXMsIGV2ZW50LmNoZWNrZWQgPyB0aGlzLnRydWVWYWx1ZSA6IHRoaXMuZmFsc2VWYWx1ZSk7XG4gIH1cblxuICBnZXQgaXNDaGVja2VkKCkge1xuICAgIHJldHVybiB0aGlzLmpzZi5nZXRGb3JtQ29udHJvbFZhbHVlKHRoaXMpID09PSB0aGlzLnRydWVWYWx1ZTtcbiAgfVxufVxuIl19