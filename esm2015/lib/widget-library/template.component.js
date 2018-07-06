/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class TemplateComponent {
    /**
     * @param {?} componentFactory
     * @param {?} jsf
     */
    constructor(componentFactory, jsf) {
        this.componentFactory = componentFactory;
        this.jsf = jsf;
        this.newComponent = null;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateComponent();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this.updateComponent();
    }
    /**
     * @return {?}
     */
    updateComponent() {
        if (!this.newComponent && this.layoutNode.options.template) {
            this.newComponent = this.widgetContainer.createComponent(this.componentFactory.resolveComponentFactory(this.layoutNode.options.template));
        }
        if (this.newComponent) {
            for (let input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
                this.newComponent.instance[input] = this[input];
            }
        }
    }
}
TemplateComponent.decorators = [
    { type: Component, args: [{
                selector: 'template-widget',
                template: `<div #widgetContainer></div>`,
            },] },
];
/** @nocollapse */
TemplateComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: JsonSchemaFormService }
];
TemplateComponent.propDecorators = {
    layoutNode: [{ type: Input }],
    layoutIndex: [{ type: Input }],
    dataIndex: [{ type: Input }],
    widgetContainer: [{ type: ViewChild, args: ['widgetContainer', { read: ViewContainerRef },] }]
};
if (false) {
    /** @type {?} */
    TemplateComponent.prototype.newComponent;
    /** @type {?} */
    TemplateComponent.prototype.layoutNode;
    /** @type {?} */
    TemplateComponent.prototype.layoutIndex;
    /** @type {?} */
    TemplateComponent.prototype.dataIndex;
    /** @type {?} */
    TemplateComponent.prototype.widgetContainer;
    /** @type {?} */
    TemplateComponent.prototype.componentFactory;
    /** @type {?} */
    TemplateComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbImxpYi93aWRnZXQtbGlicmFyeS90ZW1wbGF0ZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsd0JBQXdCLEVBQWdCLEtBQUssRUFDckMsU0FBUyxFQUFFLGdCQUFnQixFQUMvQyxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQU1wRSxNQUFNOzs7OztJQVFKLFlBQ1Usa0JBQ0E7UUFEQSxxQkFBZ0IsR0FBaEIsZ0JBQWdCO1FBQ2hCLFFBQUcsR0FBSCxHQUFHOzRCQVRxQixJQUFJO0tBVWpDOzs7O0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUN4Qjs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDeEI7Ozs7SUFFRCxlQUFlO1FBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FDdEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUNoRixDQUFDO1NBQ0g7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDakQ7U0FDRjtLQUNGOzs7WUFwQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRSw4QkFBOEI7YUFDekM7Ozs7WUFUWSx3QkFBd0I7WUFJNUIscUJBQXFCOzs7eUJBUTNCLEtBQUs7MEJBQ0wsS0FBSzt3QkFDTCxLQUFLOzhCQUNMLFNBQVMsU0FBQyxpQkFBaUIsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBDb21wb25lbnRSZWYsIElucHV0LFxuICBPbkNoYW5nZXMsIE9uSW5pdCwgVmlld0NoaWxkLCBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd0ZW1wbGF0ZS13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYDxkaXYgI3dpZGdldENvbnRhaW5lcj48L2Rpdj5gLFxufSlcbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgbmV3Q29tcG9uZW50OiBDb21wb25lbnRSZWY8YW55PiA9IG51bGw7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuICBAVmlld0NoaWxkKCd3aWRnZXRDb250YWluZXInLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSlcbiAgICB3aWRnZXRDb250YWluZXI6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMudXBkYXRlQ29tcG9uZW50KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudCgpO1xuICB9XG5cbiAgdXBkYXRlQ29tcG9uZW50KCkge1xuICAgIGlmICghdGhpcy5uZXdDb21wb25lbnQgJiYgdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMudGVtcGxhdGUpIHtcbiAgICAgIHRoaXMubmV3Q29tcG9uZW50ID0gdGhpcy53aWRnZXRDb250YWluZXIuY3JlYXRlQ29tcG9uZW50KFxuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkodGhpcy5sYXlvdXROb2RlLm9wdGlvbnMudGVtcGxhdGUpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5uZXdDb21wb25lbnQpIHtcbiAgICAgIGZvciAobGV0IGlucHV0IG9mIFsnbGF5b3V0Tm9kZScsICdsYXlvdXRJbmRleCcsICdkYXRhSW5kZXgnXSkge1xuICAgICAgICB0aGlzLm5ld0NvbXBvbmVudC5pbnN0YW5jZVtpbnB1dF0gPSB0aGlzW2lucHV0XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==