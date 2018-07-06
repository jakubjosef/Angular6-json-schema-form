/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class RootComponent {
    /**
     * @param {?} jsf
     */
    constructor(jsf) {
        this.jsf = jsf;
        this.isFlexItem = false;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    isDraggable(node) {
        return node.arrayItem && node.type !== '$ref' &&
            node.arrayItemType === 'list' && this.isOrderable !== false;
    }
    /**
     * @param {?} node
     * @param {?} attribute
     * @return {?}
     */
    getFlexAttribute(node, attribute) {
        /** @type {?} */
        const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
        return ((node.options || {}).flex || '').split(/\s+/)[index] ||
            (node.options || {})[attribute] || ['1', '1', 'auto'][index];
    }
    /**
     * @param {?} layoutNode
     * @return {?}
     */
    showWidget(layoutNode) {
        return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
    }
}
RootComponent.decorators = [
    { type: Component, args: [{
                selector: 'root-widget',
                template: `
    <div *ngFor="let layoutItem of layout; let i = index"
      [class.form-flex-item]="isFlexItem"
      [style.align-self]="(layoutItem.options || {})['align-self']"
      [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
      [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
      [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
      [style.order]="(layoutItem.options || {}).order">
      <div
        [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
        [layoutIndex]="(layoutIndex || []).concat(i)"
        [layoutNode]="layoutItem"
        [orderable]="isDraggable(layoutItem)">
        <select-framework-widget *ngIf="showWidget(layoutItem)"
          [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </div>
    </div>`,
                styles: [`
    [draggable=true] {
      transition: all 150ms cubic-bezier(.4, 0, .2, 1);
    }
    [draggable=true]:hover {
      cursor: move;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      position: relative; z-index: 10;
      margin-top: -1px;
      margin-left: -1px;
      margin-right: 1px;
      margin-bottom: 1px;
    }
    [draggable=true].drag-target-top {
      box-shadow: 0 -2px 0 #000;
      position: relative; z-index: 20;
    }
    [draggable=true].drag-target-bottom {
      box-shadow: 0 2px 0 #000;
      position: relative; z-index: 20;
    }
  `],
            },] },
];
/** @nocollapse */
RootComponent.ctorParameters = () => [
    { type: JsonSchemaFormService }
];
RootComponent.propDecorators = {
    dataIndex: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    layout: [{ type: Input }],
    isOrderable: [{ type: Input }],
    isFlexItem: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    RootComponent.prototype.options;
    /** @type {?} */
    RootComponent.prototype.dataIndex;
    /** @type {?} */
    RootComponent.prototype.layoutIndex;
    /** @type {?} */
    RootComponent.prototype.layout;
    /** @type {?} */
    RootComponent.prototype.isOrderable;
    /** @type {?} */
    RootComponent.prototype.isFlexItem;
    /** @type {?} */
    RootComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL3dpZGdldC1saWJyYXJ5L3Jvb3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBUSxNQUFNLGVBQWUsQ0FBQztBQUV2RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQStDcEUsTUFBTTs7OztJQVFKLFlBQ1U7UUFBQSxRQUFHLEdBQUgsR0FBRzswQkFIUyxLQUFLO0tBSXRCOzs7OztJQUVMLFdBQVcsQ0FBQyxJQUFTO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTTtZQUMzQyxJQUFJLENBQUMsYUFBYSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssQ0FBQztLQUMvRDs7Ozs7O0lBSUQsZ0JBQWdCLENBQUMsSUFBUyxFQUFFLFNBQWlCOztRQUMzQyxNQUFNLEtBQUssR0FBRyxDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMxRCxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hFOzs7OztJQUVELFVBQVUsQ0FBQyxVQUFlO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDL0Q7OztZQXZFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBa0JEO2dCQUNULE1BQU0sRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQlIsQ0FBQzthQUNIOzs7O1lBOUNRLHFCQUFxQjs7O3dCQWlEM0IsS0FBSzswQkFDTCxLQUFLO3FCQUNMLEtBQUs7MEJBQ0wsS0FBSzt5QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgSG9zdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgaGFzVmFsdWUsIEpzb25Qb2ludGVyIH0gZnJvbSAnLi4vc2hhcmVkJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncm9vdC13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgKm5nRm9yPVwibGV0IGxheW91dEl0ZW0gb2YgbGF5b3V0OyBsZXQgaSA9IGluZGV4XCJcbiAgICAgIFtjbGFzcy5mb3JtLWZsZXgtaXRlbV09XCJpc0ZsZXhJdGVtXCJcbiAgICAgIFtzdHlsZS5hbGlnbi1zZWxmXT1cIihsYXlvdXRJdGVtLm9wdGlvbnMgfHwge30pWydhbGlnbi1zZWxmJ11cIlxuICAgICAgW3N0eWxlLmZsZXgtYmFzaXNdPVwiZ2V0RmxleEF0dHJpYnV0ZShsYXlvdXRJdGVtLCAnZmxleC1iYXNpcycpXCJcbiAgICAgIFtzdHlsZS5mbGV4LWdyb3ddPVwiZ2V0RmxleEF0dHJpYnV0ZShsYXlvdXRJdGVtLCAnZmxleC1ncm93JylcIlxuICAgICAgW3N0eWxlLmZsZXgtc2hyaW5rXT1cImdldEZsZXhBdHRyaWJ1dGUobGF5b3V0SXRlbSwgJ2ZsZXgtc2hyaW5rJylcIlxuICAgICAgW3N0eWxlLm9yZGVyXT1cIihsYXlvdXRJdGVtLm9wdGlvbnMgfHwge30pLm9yZGVyXCI+XG4gICAgICA8ZGl2XG4gICAgICAgIFtkYXRhSW5kZXhdPVwibGF5b3V0SXRlbT8uYXJyYXlJdGVtID8gKGRhdGFJbmRleCB8fCBbXSkuY29uY2F0KGkpIDogKGRhdGFJbmRleCB8fCBbXSlcIlxuICAgICAgICBbbGF5b3V0SW5kZXhdPVwiKGxheW91dEluZGV4IHx8IFtdKS5jb25jYXQoaSlcIlxuICAgICAgICBbbGF5b3V0Tm9kZV09XCJsYXlvdXRJdGVtXCJcbiAgICAgICAgW29yZGVyYWJsZV09XCJpc0RyYWdnYWJsZShsYXlvdXRJdGVtKVwiPlxuICAgICAgICA8c2VsZWN0LWZyYW1ld29yay13aWRnZXQgKm5nSWY9XCJzaG93V2lkZ2V0KGxheW91dEl0ZW0pXCJcbiAgICAgICAgICBbZGF0YUluZGV4XT1cImxheW91dEl0ZW0/LmFycmF5SXRlbSA/IChkYXRhSW5kZXggfHwgW10pLmNvbmNhdChpKSA6IChkYXRhSW5kZXggfHwgW10pXCJcbiAgICAgICAgICBbbGF5b3V0SW5kZXhdPVwiKGxheW91dEluZGV4IHx8IFtdKS5jb25jYXQoaSlcIlxuICAgICAgICAgIFtsYXlvdXROb2RlXT1cImxheW91dEl0ZW1cIj48L3NlbGVjdC1mcmFtZXdvcmstd2lkZ2V0PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+YCxcbiAgc3R5bGVzOiBbYFxuICAgIFtkcmFnZ2FibGU9dHJ1ZV0ge1xuICAgICAgdHJhbnNpdGlvbjogYWxsIDE1MG1zIGN1YmljLWJlemllciguNCwgMCwgLjIsIDEpO1xuICAgIH1cbiAgICBbZHJhZ2dhYmxlPXRydWVdOmhvdmVyIHtcbiAgICAgIGN1cnNvcjogbW92ZTtcbiAgICAgIGJveC1zaGFkb3c6IDJweCAycHggNHB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMTA7XG4gICAgICBtYXJnaW4tdG9wOiAtMXB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IC0xcHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDFweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDFweDtcbiAgICB9XG4gICAgW2RyYWdnYWJsZT10cnVlXS5kcmFnLXRhcmdldC10b3Age1xuICAgICAgYm94LXNoYWRvdzogMCAtMnB4IDAgIzAwMDtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMjA7XG4gICAgfVxuICAgIFtkcmFnZ2FibGU9dHJ1ZV0uZHJhZy10YXJnZXQtYm90dG9tIHtcbiAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDAgIzAwMDtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMjA7XG4gICAgfVxuICBgXSxcbn0pXG5leHBvcnQgY2xhc3MgUm9vdENvbXBvbmVudCB7XG4gIG9wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBsYXlvdXQ6IGFueVtdO1xuICBASW5wdXQoKSBpc09yZGVyYWJsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgaXNGbGV4SXRlbSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBpc0RyYWdnYWJsZShub2RlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbm9kZS5hcnJheUl0ZW0gJiYgbm9kZS50eXBlICE9PSAnJHJlZicgJiZcbiAgICAgIG5vZGUuYXJyYXlJdGVtVHlwZSA9PT0gJ2xpc3QnICYmIHRoaXMuaXNPcmRlcmFibGUgIT09IGZhbHNlO1xuICB9XG5cbiAgLy8gU2V0IGF0dHJpYnV0ZXMgZm9yIGZsZXhib3ggY2hpbGRcbiAgLy8gKGNvbnRhaW5lciBhdHRyaWJ1dGVzIGFyZSBzZXQgaW4gc2VjdGlvbi5jb21wb25lbnQpXG4gIGdldEZsZXhBdHRyaWJ1dGUobm9kZTogYW55LCBhdHRyaWJ1dGU6IHN0cmluZykge1xuICAgIGNvbnN0IGluZGV4ID0gWydmbGV4LWdyb3cnLCAnZmxleC1zaHJpbmsnLCAnZmxleC1iYXNpcyddLmluZGV4T2YoYXR0cmlidXRlKTtcbiAgICByZXR1cm4gKChub2RlLm9wdGlvbnMgfHwge30pLmZsZXggfHwgJycpLnNwbGl0KC9cXHMrLylbaW5kZXhdIHx8XG4gICAgICAobm9kZS5vcHRpb25zIHx8IHt9KVthdHRyaWJ1dGVdIHx8IFsnMScsICcxJywgJ2F1dG8nXVtpbmRleF07XG4gIH1cblxuICBzaG93V2lkZ2V0KGxheW91dE5vZGU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmpzZi5ldmFsdWF0ZUNvbmRpdGlvbihsYXlvdXROb2RlLCB0aGlzLmRhdGFJbmRleCk7XG4gIH1cbn1cbiJdfQ==