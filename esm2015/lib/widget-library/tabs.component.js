/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class TabsComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.selectedItem = 0;
        this.showAddTab = true;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.itemCount = this.layoutNode.items.length - 1;
        this.updateControl();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    select(index) {
        if (this.layoutNode.items[index].type === '$ref') {
            this.itemCount = this.layoutNode.items.length;
            this.jsf.addItem({
                layoutNode: this.layoutNode.items[index],
                layoutIndex: this.layoutIndex.concat(index),
                dataIndex: this.dataIndex.concat(index)
            });
            this.updateControl();
        }
        ;
        this.selectedItem = index;
    }
    /**
     * @return {?}
     */
    updateControl() {
        /** @type {?} */
        const lastItem = this.layoutNode.items[this.layoutNode.items.length - 1];
        if (lastItem.type === '$ref' &&
            this.itemCount >= (lastItem.options.maxItems || 1000)) {
            this.showAddTab = false;
        }
    }
    /**
     * @param {?} item
     * @param {?} index
     * @return {?}
     */
    setTabTitle(item, index) {
        return this.jsf.setArrayItemTitle(this, item, index);
    }
}
TabsComponent.decorators = [
    { type: Component, args: [{
                selector: 'tabs-widget',
                template: `
    <ul
      [class]="options?.labelHtmlClass || ''">
      <li *ngFor="let item of layoutNode?.items; let i = index"
        [class]="(options?.itemLabelHtmlClass || '') + (selectedItem === i ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + options?.style?.unselected))"
        role="presentation"
        data-tabs>
        <a *ngIf="showAddTab || item.type !== '$ref'"
           [class]="'nav-link' + (selectedItem === i ? (' ' + options?.activeClass + ' ' + options?.style?.selected) :
            (' ' + options?.style?.unselected))"
          [innerHTML]="setTabTitle(item, i)"
          (click)="select(i)"></a>
      </li>
    </ul>

    <div *ngFor="let layoutItem of layoutNode?.items; let i = index"
      [class]="options?.htmlClass || ''">

      <select-framework-widget *ngIf="selectedItem === i"
        [class]="(options?.fieldHtmlClass || '') +
          ' ' + (options?.activeClass || '') +
          ' ' + (options?.style?.selected || '')"
        [dataIndex]="layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex"
        [layoutIndex]="(layoutIndex || []).concat(i)"
        [layoutNode]="layoutItem"></select-framework-widget>

    </div>`,
                styles: [` a { cursor: pointer; } `],
            },] },
];
/** @nocollapse */
TabsComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
TabsComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    TabsComponent.prototype.options;
    /** @type {?} */
    TabsComponent.prototype.itemCount;
    /** @type {?} */
    TabsComponent.prototype.selectedItem;
    /** @type {?} */
    TabsComponent.prototype.showAddTab;
    /** @type {?} */
    TabsComponent.prototype.layoutNode;
    /** @type {?} */
    TabsComponent.prototype.layoutIndex;
    /** @type {?} */
    TabsComponent.prototype.dataIndex;
    /** @type {?} */
    TabsComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL3dpZGdldC1saWJyYXJ5L3RhYnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUV6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQW1DcEUsTUFBTTs7OztJQVNKLFlBQ1U7UUFBQSxRQUFHLEdBQUgsR0FBRzs0QkFQRSxDQUFDOzBCQUNILElBQUk7S0FPWjs7OztJQUVMLFFBQVE7UUFDTixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0tBQ3RCOzs7OztJQUVELE1BQU0sQ0FBQyxLQUFLO1FBQ1YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQ2YsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDeEMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDM0MsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUN4QyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7UUFBQSxDQUFDO1FBQ0YsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7S0FDM0I7Ozs7SUFFRCxhQUFhOztRQUNYLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLE1BQU07WUFDMUIsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FDdEQsQ0FBQyxDQUFDLENBQUM7WUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUN6QjtLQUNGOzs7Ozs7SUFFRCxXQUFXLENBQUMsSUFBUyxFQUFFLEtBQWE7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN0RDs7O1lBNUVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBNEJEO2dCQUNULE1BQU0sRUFBRSxDQUFDLDBCQUEwQixDQUFDO2FBQ3JDOzs7O1lBbENRLHFCQUFxQjs7O3lCQXdDM0IsS0FBSzswQkFDTCxLQUFLO3dCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndGFicy13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bFxuICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/LmxhYmVsSHRtbENsYXNzIHx8ICcnXCI+XG4gICAgICA8bGkgKm5nRm9yPVwibGV0IGl0ZW0gb2YgbGF5b3V0Tm9kZT8uaXRlbXM7IGxldCBpID0gaW5kZXhcIlxuICAgICAgICBbY2xhc3NdPVwiKG9wdGlvbnM/Lml0ZW1MYWJlbEh0bWxDbGFzcyB8fCAnJykgKyAoc2VsZWN0ZWRJdGVtID09PSBpID9cbiAgICAgICAgICAoJyAnICsgKG9wdGlvbnM/LmFjdGl2ZUNsYXNzIHx8ICcnKSArICcgJyArIChvcHRpb25zPy5zdHlsZT8uc2VsZWN0ZWQgfHwgJycpKSA6XG4gICAgICAgICAgKCcgJyArIG9wdGlvbnM/LnN0eWxlPy51bnNlbGVjdGVkKSlcIlxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgICAgZGF0YS10YWJzPlxuICAgICAgICA8YSAqbmdJZj1cInNob3dBZGRUYWIgfHwgaXRlbS50eXBlICE9PSAnJHJlZidcIlxuICAgICAgICAgICBbY2xhc3NdPVwiJ25hdi1saW5rJyArIChzZWxlY3RlZEl0ZW0gPT09IGkgPyAoJyAnICsgb3B0aW9ucz8uYWN0aXZlQ2xhc3MgKyAnICcgKyBvcHRpb25zPy5zdHlsZT8uc2VsZWN0ZWQpIDpcbiAgICAgICAgICAgICgnICcgKyBvcHRpb25zPy5zdHlsZT8udW5zZWxlY3RlZCkpXCJcbiAgICAgICAgICBbaW5uZXJIVE1MXT1cInNldFRhYlRpdGxlKGl0ZW0sIGkpXCJcbiAgICAgICAgICAoY2xpY2spPVwic2VsZWN0KGkpXCI+PC9hPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gICAgPGRpdiAqbmdGb3I9XCJsZXQgbGF5b3V0SXRlbSBvZiBsYXlvdXROb2RlPy5pdGVtczsgbGV0IGkgPSBpbmRleFwiXG4gICAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCI+XG5cbiAgICAgIDxzZWxlY3QtZnJhbWV3b3JrLXdpZGdldCAqbmdJZj1cInNlbGVjdGVkSXRlbSA9PT0gaVwiXG4gICAgICAgIFtjbGFzc109XCIob3B0aW9ucz8uZmllbGRIdG1sQ2xhc3MgfHwgJycpICtcbiAgICAgICAgICAnICcgKyAob3B0aW9ucz8uYWN0aXZlQ2xhc3MgfHwgJycpICtcbiAgICAgICAgICAnICcgKyAob3B0aW9ucz8uc3R5bGU/LnNlbGVjdGVkIHx8ICcnKVwiXG4gICAgICAgIFtkYXRhSW5kZXhdPVwibGF5b3V0Tm9kZT8uZGF0YVR5cGUgPT09ICdhcnJheScgPyAoZGF0YUluZGV4IHx8IFtdKS5jb25jYXQoaSkgOiBkYXRhSW5kZXhcIlxuICAgICAgICBbbGF5b3V0SW5kZXhdPVwiKGxheW91dEluZGV4IHx8IFtdKS5jb25jYXQoaSlcIlxuICAgICAgICBbbGF5b3V0Tm9kZV09XCJsYXlvdXRJdGVtXCI+PC9zZWxlY3QtZnJhbWV3b3JrLXdpZGdldD5cblxuICAgIDwvZGl2PmAsXG4gIHN0eWxlczogW2AgYSB7IGN1cnNvcjogcG9pbnRlcjsgfSBgXSxcbn0pXG5leHBvcnQgY2xhc3MgVGFic0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIG9wdGlvbnM6IGFueTtcbiAgaXRlbUNvdW50OiBudW1iZXI7XG4gIHNlbGVjdGVkSXRlbSA9IDA7XG4gIHNob3dBZGRUYWIgPSB0cnVlO1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gICAgdGhpcy5pdGVtQ291bnQgPSB0aGlzLmxheW91dE5vZGUuaXRlbXMubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgfVxuXG4gIHNlbGVjdChpbmRleCkge1xuICAgIGlmICh0aGlzLmxheW91dE5vZGUuaXRlbXNbaW5kZXhdLnR5cGUgPT09ICckcmVmJykge1xuICAgICAgdGhpcy5pdGVtQ291bnQgPSB0aGlzLmxheW91dE5vZGUuaXRlbXMubGVuZ3RoO1xuICAgICAgdGhpcy5qc2YuYWRkSXRlbSh7XG4gICAgICAgIGxheW91dE5vZGU6IHRoaXMubGF5b3V0Tm9kZS5pdGVtc1tpbmRleF0sXG4gICAgICAgIGxheW91dEluZGV4OiB0aGlzLmxheW91dEluZGV4LmNvbmNhdChpbmRleCksXG4gICAgICAgIGRhdGFJbmRleDogdGhpcy5kYXRhSW5kZXguY29uY2F0KGluZGV4KVxuICAgICAgfSk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgICB9O1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gaW5kZXg7XG4gIH1cblxuICB1cGRhdGVDb250cm9sKCkge1xuICAgIGNvbnN0IGxhc3RJdGVtID0gdGhpcy5sYXlvdXROb2RlLml0ZW1zW3RoaXMubGF5b3V0Tm9kZS5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICBpZiAobGFzdEl0ZW0udHlwZSA9PT0gJyRyZWYnICYmXG4gICAgICB0aGlzLml0ZW1Db3VudCA+PSAobGFzdEl0ZW0ub3B0aW9ucy5tYXhJdGVtcyB8fCAxMDAwKVxuICAgICkge1xuICAgICAgdGhpcy5zaG93QWRkVGFiID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc2V0VGFiVGl0bGUoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5qc2Yuc2V0QXJyYXlJdGVtVGl0bGUodGhpcywgaXRlbSwgaW5kZXgpO1xuICB9XG59XG4iXX0=