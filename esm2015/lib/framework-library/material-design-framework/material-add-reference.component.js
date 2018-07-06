/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
export class MaterialAddReferenceComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
    }
    /**
     * @return {?}
     */
    get showAddButton() {
        return !this.layoutNode.arrayItem ||
            this.layoutIndex[this.layoutIndex.length - 1] < this.options.maxItems;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    addItem(event) {
        event.preventDefault();
        this.jsf.addItem(this);
    }
    /**
     * @return {?}
     */
    get buttonText() {
        /** @type {?} */
        const parent = {
            dataIndex: this.dataIndex.slice(0, -1),
            layoutIndex: this.layoutIndex.slice(0, -1),
            layoutNode: this.jsf.getParentNode(this),
        };
        return parent.layoutNode.add ||
            this.jsf.setArrayItemTitle(parent, this.layoutNode, this.itemCount);
    }
}
MaterialAddReferenceComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-add-reference-widget',
                template: `
    <section [class]="options?.htmlClass || ''" align="end">
      <button mat-raised-button *ngIf="showAddButton"
        [color]="options?.color || 'accent'"
        [disabled]="options?.readonly"
        (click)="addItem($event)">
        <span *ngIf="options?.icon" [class]="options?.icon"></span>
        <span *ngIf="options?.title" [innerHTML]="buttonText"></span>
      </button>
    </section>`,
                changeDetection: ChangeDetectionStrategy.Default,
            },] },
];
/** @nocollapse */
MaterialAddReferenceComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
MaterialAddReferenceComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MaterialAddReferenceComponent.prototype.options;
    /** @type {?} */
    MaterialAddReferenceComponent.prototype.itemCount;
    /** @type {?} */
    MaterialAddReferenceComponent.prototype.previousLayoutIndex;
    /** @type {?} */
    MaterialAddReferenceComponent.prototype.previousDataIndex;
    /** @type {?} */
    MaterialAddReferenceComponent.prototype.layoutNode;
    /** @type {?} */
    MaterialAddReferenceComponent.prototype.layoutIndex;
    /** @type {?} */
    MaterialAddReferenceComponent.prototype.dataIndex;
    /** @type {?} */
    MaterialAddReferenceComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtYWRkLXJlZmVyZW5jZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL2ZyYW1ld29yay1saWJyYXJ5L21hdGVyaWFsLWRlc2lnbi1mcmFtZXdvcmsvbWF0ZXJpYWwtYWRkLXJlZmVyZW5jZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBR2xGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBZ0J2RSxNQUFNOzs7O0lBU0osWUFDVTtRQUFBLFFBQUcsR0FBSCxHQUFHO0tBQ1I7Ozs7SUFFTCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7S0FDOUM7Ozs7SUFFRCxJQUFJLGFBQWE7UUFDZixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVM7WUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztLQUN6RTs7Ozs7SUFFRCxPQUFPLENBQUMsS0FBSztRQUNYLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qjs7OztJQUVELElBQUksVUFBVTs7UUFDWixNQUFNLE1BQU0sR0FBUTtZQUNsQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUMsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztTQUN6QyxDQUFDO1FBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRztZQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUN2RTs7O1lBakRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsK0JBQStCO2dCQUN6QyxRQUFRLEVBQUU7Ozs7Ozs7OztlQVNHO2dCQUNiLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2FBQ2pEOzs7O1lBZlEscUJBQXFCOzs7eUJBcUIzQixLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtYWRkLXJlZmVyZW5jZS13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzZWN0aW9uIFtjbGFzc109XCJvcHRpb25zPy5odG1sQ2xhc3MgfHwgJydcIiBhbGlnbj1cImVuZFwiPlxuICAgICAgPGJ1dHRvbiBtYXQtcmFpc2VkLWJ1dHRvbiAqbmdJZj1cInNob3dBZGRCdXR0b25cIlxuICAgICAgICBbY29sb3JdPVwib3B0aW9ucz8uY29sb3IgfHwgJ2FjY2VudCdcIlxuICAgICAgICBbZGlzYWJsZWRdPVwib3B0aW9ucz8ucmVhZG9ubHlcIlxuICAgICAgICAoY2xpY2spPVwiYWRkSXRlbSgkZXZlbnQpXCI+XG4gICAgICAgIDxzcGFuICpuZ0lmPVwib3B0aW9ucz8uaWNvblwiIFtjbGFzc109XCJvcHRpb25zPy5pY29uXCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIm9wdGlvbnM/LnRpdGxlXCIgW2lubmVySFRNTF09XCJidXR0b25UZXh0XCI+PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9zZWN0aW9uPmAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxBZGRSZWZlcmVuY2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBvcHRpb25zOiBhbnk7XG4gIGl0ZW1Db3VudDogbnVtYmVyO1xuICBwcmV2aW91c0xheW91dEluZGV4OiBudW1iZXJbXTtcbiAgcHJldmlvdXNEYXRhSW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gIH1cblxuICBnZXQgc2hvd0FkZEJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMubGF5b3V0Tm9kZS5hcnJheUl0ZW0gfHxcbiAgICAgIHRoaXMubGF5b3V0SW5kZXhbdGhpcy5sYXlvdXRJbmRleC5sZW5ndGggLSAxXSA8IHRoaXMub3B0aW9ucy5tYXhJdGVtcztcbiAgfVxuXG4gIGFkZEl0ZW0oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuanNmLmFkZEl0ZW0odGhpcyk7XG4gIH1cblxuICBnZXQgYnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHBhcmVudDogYW55ID0ge1xuICAgICAgZGF0YUluZGV4OiB0aGlzLmRhdGFJbmRleC5zbGljZSgwLCAtMSksXG4gICAgICBsYXlvdXRJbmRleDogdGhpcy5sYXlvdXRJbmRleC5zbGljZSgwLCAtMSksXG4gICAgICBsYXlvdXROb2RlOiB0aGlzLmpzZi5nZXRQYXJlbnROb2RlKHRoaXMpLFxuICAgIH07XG4gICAgcmV0dXJuIHBhcmVudC5sYXlvdXROb2RlLmFkZCB8fFxuICAgICAgdGhpcy5qc2Yuc2V0QXJyYXlJdGVtVGl0bGUocGFyZW50LCB0aGlzLmxheW91dE5vZGUsIHRoaXMuaXRlbUNvdW50KTtcbiAgfVxufVxuIl19