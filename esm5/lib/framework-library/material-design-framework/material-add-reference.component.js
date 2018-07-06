/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
var MaterialAddReferenceComponent = /** @class */ (function () {
    function MaterialAddReferenceComponent(jsf) {
        this.jsf = jsf;
    }
    /**
     * @return {?}
     */
    MaterialAddReferenceComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.options = this.layoutNode.options || {};
    };
    Object.defineProperty(MaterialAddReferenceComponent.prototype, "showAddButton", {
        get: /**
         * @return {?}
         */
        function () {
            return !this.layoutNode.arrayItem ||
                this.layoutIndex[this.layoutIndex.length - 1] < this.options.maxItems;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    MaterialAddReferenceComponent.prototype.addItem = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        this.jsf.addItem(this);
    };
    Object.defineProperty(MaterialAddReferenceComponent.prototype, "buttonText", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var parent = {
                dataIndex: this.dataIndex.slice(0, -1),
                layoutIndex: this.layoutIndex.slice(0, -1),
                layoutNode: this.jsf.getParentNode(this),
            };
            return parent.layoutNode.add ||
                this.jsf.setArrayItemTitle(parent, this.layoutNode, this.itemCount);
        },
        enumerable: true,
        configurable: true
    });
    MaterialAddReferenceComponent.decorators = [
        { type: Component, args: [{
                    selector: 'material-add-reference-widget',
                    template: "\n    <section [class]=\"options?.htmlClass || ''\" align=\"end\">\n      <button mat-raised-button *ngIf=\"showAddButton\"\n        [color]=\"options?.color || 'accent'\"\n        [disabled]=\"options?.readonly\"\n        (click)=\"addItem($event)\">\n        <span *ngIf=\"options?.icon\" [class]=\"options?.icon\"></span>\n        <span *ngIf=\"options?.title\" [innerHTML]=\"buttonText\"></span>\n      </button>\n    </section>",
                    changeDetection: ChangeDetectionStrategy.Default,
                },] },
    ];
    /** @nocollapse */
    MaterialAddReferenceComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialAddReferenceComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return MaterialAddReferenceComponent;
}());
export { MaterialAddReferenceComponent };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtYWRkLXJlZmVyZW5jZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL2ZyYW1ld29yay1saWJyYXJ5L21hdGVyaWFsLWRlc2lnbi1mcmFtZXdvcmsvbWF0ZXJpYWwtYWRkLXJlZmVyZW5jZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBR2xGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOztJQXlCckUsdUNBQ1U7UUFBQSxRQUFHLEdBQUgsR0FBRztLQUNSOzs7O0lBRUwsZ0RBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7S0FDOUM7SUFFRCxzQkFBSSx3REFBYTs7OztRQUFqQjtZQUNFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUztnQkFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUN6RTs7O09BQUE7Ozs7O0lBRUQsK0NBQU87Ozs7SUFBUCxVQUFRLEtBQUs7UUFDWCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEI7SUFFRCxzQkFBSSxxREFBVTs7OztRQUFkOztZQUNFLElBQU0sTUFBTSxHQUFRO2dCQUNsQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO2FBQ3pDLENBQUM7WUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHO2dCQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN2RTs7O09BQUE7O2dCQWpERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLCtCQUErQjtvQkFDekMsUUFBUSxFQUFFLGtiQVNHO29CQUNiLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2lCQUNqRDs7OztnQkFmUSxxQkFBcUI7Ozs2QkFxQjNCLEtBQUs7OEJBQ0wsS0FBSzs0QkFDTCxLQUFLOzt3Q0ExQlI7O1NBbUJhLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtYWRkLXJlZmVyZW5jZS13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzZWN0aW9uIFtjbGFzc109XCJvcHRpb25zPy5odG1sQ2xhc3MgfHwgJydcIiBhbGlnbj1cImVuZFwiPlxuICAgICAgPGJ1dHRvbiBtYXQtcmFpc2VkLWJ1dHRvbiAqbmdJZj1cInNob3dBZGRCdXR0b25cIlxuICAgICAgICBbY29sb3JdPVwib3B0aW9ucz8uY29sb3IgfHwgJ2FjY2VudCdcIlxuICAgICAgICBbZGlzYWJsZWRdPVwib3B0aW9ucz8ucmVhZG9ubHlcIlxuICAgICAgICAoY2xpY2spPVwiYWRkSXRlbSgkZXZlbnQpXCI+XG4gICAgICAgIDxzcGFuICpuZ0lmPVwib3B0aW9ucz8uaWNvblwiIFtjbGFzc109XCJvcHRpb25zPy5pY29uXCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIm9wdGlvbnM/LnRpdGxlXCIgW2lubmVySFRNTF09XCJidXR0b25UZXh0XCI+PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9zZWN0aW9uPmAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxBZGRSZWZlcmVuY2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBvcHRpb25zOiBhbnk7XG4gIGl0ZW1Db3VudDogbnVtYmVyO1xuICBwcmV2aW91c0xheW91dEluZGV4OiBudW1iZXJbXTtcbiAgcHJldmlvdXNEYXRhSW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gIH1cblxuICBnZXQgc2hvd0FkZEJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMubGF5b3V0Tm9kZS5hcnJheUl0ZW0gfHxcbiAgICAgIHRoaXMubGF5b3V0SW5kZXhbdGhpcy5sYXlvdXRJbmRleC5sZW5ndGggLSAxXSA8IHRoaXMub3B0aW9ucy5tYXhJdGVtcztcbiAgfVxuXG4gIGFkZEl0ZW0oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuanNmLmFkZEl0ZW0odGhpcyk7XG4gIH1cblxuICBnZXQgYnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHBhcmVudDogYW55ID0ge1xuICAgICAgZGF0YUluZGV4OiB0aGlzLmRhdGFJbmRleC5zbGljZSgwLCAtMSksXG4gICAgICBsYXlvdXRJbmRleDogdGhpcy5sYXlvdXRJbmRleC5zbGljZSgwLCAtMSksXG4gICAgICBsYXlvdXROb2RlOiB0aGlzLmpzZi5nZXRQYXJlbnROb2RlKHRoaXMpLFxuICAgIH07XG4gICAgcmV0dXJuIHBhcmVudC5sYXlvdXROb2RlLmFkZCB8fFxuICAgICAgdGhpcy5qc2Yuc2V0QXJyYXlJdGVtVGl0bGUocGFyZW50LCB0aGlzLmxheW91dE5vZGUsIHRoaXMuaXRlbUNvdW50KTtcbiAgfVxufVxuIl19