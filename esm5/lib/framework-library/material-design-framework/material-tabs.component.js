/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
var MaterialTabsComponent = /** @class */ (function () {
    function MaterialTabsComponent(jsf) {
        this.jsf = jsf;
        this.selectedItem = 0;
        this.showAddTab = true;
    }
    /**
     * @return {?}
     */
    MaterialTabsComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.options = this.layoutNode.options || {};
        this.itemCount = this.layoutNode.items.length - 1;
        this.updateControl();
    };
    /**
     * @param {?} index
     * @return {?}
     */
    MaterialTabsComponent.prototype.select = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (this.layoutNode.items[index].type === '$ref') {
            this.jsf.addItem({
                layoutNode: this.layoutNode.items[index],
                layoutIndex: this.layoutIndex.concat(index),
                dataIndex: this.dataIndex.concat(index)
            });
            this.updateControl();
        }
        ;
        this.selectedItem = index;
    };
    /**
     * @return {?}
     */
    MaterialTabsComponent.prototype.updateControl = /**
     * @return {?}
     */
    function () {
        this.itemCount = this.layoutNode.items.length - 1;
        /** @type {?} */
        var lastItem = this.layoutNode.items[this.layoutNode.items.length - 1];
        this.showAddTab = lastItem.type === '$ref' &&
            this.itemCount < (lastItem.options.maxItems || 1000);
    };
    /**
     * @param {?} item
     * @param {?} index
     * @return {?}
     */
    MaterialTabsComponent.prototype.setTabTitle = /**
     * @param {?} item
     * @param {?} index
     * @return {?}
     */
    function (item, index) {
        return this.jsf.setArrayItemTitle(this, item, index);
    };
    MaterialTabsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'material-tabs-widget',
                    template: "\n    <nav mat-tab-nav-bar\n      [attr.aria-label]=\"options?.label || options?.title || ''\"\n      [style.width]=\"'100%'\">\n        <a mat-tab-link *ngFor=\"let item of layoutNode?.items; let i = index\"\n          [active]=\"selectedItem === i\"\n          (click)=\"select(i)\">\n          <span *ngIf=\"showAddTab || item.type !== '$ref'\"\n            [innerHTML]=\"setTabTitle(item, i)\"></span>\n        </a>\n    </nav>\n    <div *ngFor=\"let layoutItem of layoutNode?.items; let i = index\"\n      [class]=\"options?.htmlClass || ''\">\n      <select-framework-widget *ngIf=\"selectedItem === i\"\n        [class]=\"(options?.fieldHtmlClass || '') + ' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')\"\n        [dataIndex]=\"layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex\"\n        [layoutIndex]=\"(layoutIndex || []).concat(i)\"\n        [layoutNode]=\"layoutItem\"></select-framework-widget>\n    </div>",
                    styles: [" a { cursor: pointer; } "],
                },] },
    ];
    /** @nocollapse */
    MaterialTabsComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    MaterialTabsComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return MaterialTabsComponent;
}());
export { MaterialTabsComponent };
if (false) {
    /** @type {?} */
    MaterialTabsComponent.prototype.options;
    /** @type {?} */
    MaterialTabsComponent.prototype.itemCount;
    /** @type {?} */
    MaterialTabsComponent.prototype.selectedItem;
    /** @type {?} */
    MaterialTabsComponent.prototype.showAddTab;
    /** @type {?} */
    MaterialTabsComponent.prototype.layoutNode;
    /** @type {?} */
    MaterialTabsComponent.prototype.layoutIndex;
    /** @type {?} */
    MaterialTabsComponent.prototype.dataIndex;
    /** @type {?} */
    MaterialTabsComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtdGFicy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL2ZyYW1ld29yay1saWJyYXJ5L21hdGVyaWFsLWRlc2lnbi1mcmFtZXdvcmsvbWF0ZXJpYWwtdGFicy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBRXpELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOztJQWtDckUsK0JBQ1U7UUFBQSxRQUFHLEdBQUgsR0FBRzs0QkFQRSxDQUFDOzBCQUNILElBQUk7S0FPWjs7OztJQUVMLHdDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7S0FDdEI7Ozs7O0lBRUQsc0NBQU07Ozs7SUFBTixVQUFPLEtBQUs7UUFDVixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFDZixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUN4QyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUMzQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ3hDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtRQUFBLENBQUM7UUFDRixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztLQUMzQjs7OztJQUVELDZDQUFhOzs7SUFBYjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7UUFDbEQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLElBQUksS0FBSyxNQUFNO1lBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQztLQUN4RDs7Ozs7O0lBRUQsMkNBQVc7Ozs7O0lBQVgsVUFBWSxJQUFTLEVBQUUsS0FBYTtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3REOztnQkEvREYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFFBQVEsRUFBRSwrOEJBa0JEO29CQUNULE1BQU0sRUFBRSxDQUFDLDBCQUEwQixDQUFDO2lCQUNyQzs7OztnQkF4QlEscUJBQXFCOzs7NkJBOEIzQixLQUFLOzhCQUNMLEtBQUs7NEJBQ0wsS0FBSzs7Z0NBbENSOztTQTJCYSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtdGFicy13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuYXYgbWF0LXRhYi1uYXYtYmFyXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIm9wdGlvbnM/LmxhYmVsIHx8IG9wdGlvbnM/LnRpdGxlIHx8ICcnXCJcbiAgICAgIFtzdHlsZS53aWR0aF09XCInMTAwJSdcIj5cbiAgICAgICAgPGEgbWF0LXRhYi1saW5rICpuZ0Zvcj1cImxldCBpdGVtIG9mIGxheW91dE5vZGU/Lml0ZW1zOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgICBbYWN0aXZlXT1cInNlbGVjdGVkSXRlbSA9PT0gaVwiXG4gICAgICAgICAgKGNsaWNrKT1cInNlbGVjdChpKVwiPlxuICAgICAgICAgIDxzcGFuICpuZ0lmPVwic2hvd0FkZFRhYiB8fCBpdGVtLnR5cGUgIT09ICckcmVmJ1wiXG4gICAgICAgICAgICBbaW5uZXJIVE1MXT1cInNldFRhYlRpdGxlKGl0ZW0sIGkpXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgPC9uYXY+XG4gICAgPGRpdiAqbmdGb3I9XCJsZXQgbGF5b3V0SXRlbSBvZiBsYXlvdXROb2RlPy5pdGVtczsgbGV0IGkgPSBpbmRleFwiXG4gICAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCI+XG4gICAgICA8c2VsZWN0LWZyYW1ld29yay13aWRnZXQgKm5nSWY9XCJzZWxlY3RlZEl0ZW0gPT09IGlcIlxuICAgICAgICBbY2xhc3NdPVwiKG9wdGlvbnM/LmZpZWxkSHRtbENsYXNzIHx8ICcnKSArICcgJyArIChvcHRpb25zPy5hY3RpdmVDbGFzcyB8fCAnJykgKyAnICcgKyAob3B0aW9ucz8uc3R5bGU/LnNlbGVjdGVkIHx8ICcnKVwiXG4gICAgICAgIFtkYXRhSW5kZXhdPVwibGF5b3V0Tm9kZT8uZGF0YVR5cGUgPT09ICdhcnJheScgPyAoZGF0YUluZGV4IHx8IFtdKS5jb25jYXQoaSkgOiBkYXRhSW5kZXhcIlxuICAgICAgICBbbGF5b3V0SW5kZXhdPVwiKGxheW91dEluZGV4IHx8IFtdKS5jb25jYXQoaSlcIlxuICAgICAgICBbbGF5b3V0Tm9kZV09XCJsYXlvdXRJdGVtXCI+PC9zZWxlY3QtZnJhbWV3b3JrLXdpZGdldD5cbiAgICA8L2Rpdj5gLFxuICBzdHlsZXM6IFtgIGEgeyBjdXJzb3I6IHBvaW50ZXI7IH0gYF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsVGFic0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIG9wdGlvbnM6IGFueTtcbiAgaXRlbUNvdW50OiBudW1iZXI7XG4gIHNlbGVjdGVkSXRlbSA9IDA7XG4gIHNob3dBZGRUYWIgPSB0cnVlO1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gICAgdGhpcy5pdGVtQ291bnQgPSB0aGlzLmxheW91dE5vZGUuaXRlbXMubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgfVxuXG4gIHNlbGVjdChpbmRleCkge1xuICAgIGlmICh0aGlzLmxheW91dE5vZGUuaXRlbXNbaW5kZXhdLnR5cGUgPT09ICckcmVmJykge1xuICAgICAgdGhpcy5qc2YuYWRkSXRlbSh7XG4gICAgICAgIGxheW91dE5vZGU6IHRoaXMubGF5b3V0Tm9kZS5pdGVtc1tpbmRleF0sXG4gICAgICAgIGxheW91dEluZGV4OiB0aGlzLmxheW91dEluZGV4LmNvbmNhdChpbmRleCksXG4gICAgICAgIGRhdGFJbmRleDogdGhpcy5kYXRhSW5kZXguY29uY2F0KGluZGV4KVxuICAgICAgfSk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgICB9O1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gaW5kZXg7XG4gIH1cblxuICB1cGRhdGVDb250cm9sKCkge1xuICAgIHRoaXMuaXRlbUNvdW50ID0gdGhpcy5sYXlvdXROb2RlLml0ZW1zLmxlbmd0aCAtIDE7XG4gICAgY29uc3QgbGFzdEl0ZW0gPSB0aGlzLmxheW91dE5vZGUuaXRlbXNbdGhpcy5sYXlvdXROb2RlLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgIHRoaXMuc2hvd0FkZFRhYiA9IGxhc3RJdGVtLnR5cGUgPT09ICckcmVmJyAmJlxuICAgICAgdGhpcy5pdGVtQ291bnQgPCAobGFzdEl0ZW0ub3B0aW9ucy5tYXhJdGVtcyB8fCAxMDAwKTtcbiAgfVxuXG4gIHNldFRhYlRpdGxlKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuanNmLnNldEFycmF5SXRlbVRpdGxlKHRoaXMsIGl0ZW0sIGluZGV4KTtcbiAgfVxufVxuIl19