/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
var FlexLayoutSectionComponent = /** @class */ (function () {
    function FlexLayoutSectionComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.expanded = true;
        this.containerType = 'div';
    }
    Object.defineProperty(FlexLayoutSectionComponent.prototype, "sectionTitle", {
        get: /**
         * @return {?}
         */
        function () {
            return this.options.notitle ? null : this.jsf.setItemTitle(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    FlexLayoutSectionComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.jsf.initializeControl(this);
        this.options = this.layoutNode.options || {};
        this.expanded = typeof this.options.expanded === 'boolean' ?
            this.options.expanded : !this.options.expandable;
        switch (this.layoutNode.type) {
            case 'section':
            case 'array':
            case 'fieldset':
            case 'advancedfieldset':
            case 'authfieldset':
            case 'optionfieldset':
            case 'selectfieldset':
                this.containerType = 'fieldset';
                break;
            case 'card':
                this.containerType = 'card';
                break;
            case 'expansion-panel':
                this.containerType = 'expansion-panel';
                break;
            default:
                // 'div', 'flex', 'tab', 'conditional', 'actions'
                this.containerType = 'div';
        }
    };
    /**
     * @return {?}
     */
    FlexLayoutSectionComponent.prototype.toggleExpanded = /**
     * @return {?}
     */
    function () {
        if (this.options.expandable) {
            this.expanded = !this.expanded;
        }
    };
    // Set attributes for flexbox container
    // (child attributes are set in flex-layout-root.component)
    /**
     * @param {?} attribute
     * @return {?}
     */
    FlexLayoutSectionComponent.prototype.getFlexAttribute = /**
     * @param {?} attribute
     * @return {?}
     */
    function (attribute) {
        /** @type {?} */
        var flexActive = this.layoutNode.type === 'flex' ||
            !!this.options.displayFlex ||
            this.options.display === 'flex';
        // if (attribute !== 'flex' && !flexActive) { return null; }
        switch (attribute) {
            case 'is-flex':
                return flexActive;
            case 'display':
                return flexActive ? 'flex' : 'initial';
            case 'flex-direction':
            case 'flex-wrap':
                /** @type {?} */
                var index = ['flex-direction', 'flex-wrap'].indexOf(attribute);
                return (this.options['flex-flow'] || '').split(/\s+/)[index] ||
                    this.options[attribute] || ['column', 'nowrap'][index];
            case 'justify-content':
            case 'align-items':
            case 'align-content':
                return this.options[attribute];
            case 'layout':
                return (this.options.fxLayout || 'row') +
                    this.options.fxLayoutWrap ? ' ' + this.options.fxLayoutWrap : '';
        }
    };
    FlexLayoutSectionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'flex-layout-section-widget',
                    template: "\n    <div *ngIf=\"containerType === 'div'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\">\n      <label *ngIf=\"sectionTitle\"\n        [class]=\"'legend ' + (options?.labelHtmlClass || '')\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></label>\n      <flex-layout-root-widget *ngIf=\"expanded\"\n        [layout]=\"layoutNode.items\"\n        [dataIndex]=\"dataIndex\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [fxLayout]=\"getFlexAttribute('layout')\"\n        [fxLayoutGap]=\"options?.fxLayoutGap\"\n        [fxLayoutAlign]=\"options?.fxLayoutAlign\"\n        [attr.fxFlexFill]=\"options?.fxLayoutAlign\"></flex-layout-root-widget>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </div>\n\n    <fieldset *ngIf=\"containerType === 'fieldset'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\"\n      [disabled]=\"options?.readonly\">\n      <legend *ngIf=\"sectionTitle\"\n        [class]=\"'legend ' + (options?.labelHtmlClass || '')\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></legend>\n      <flex-layout-root-widget *ngIf=\"expanded\"\n        [layout]=\"layoutNode.items\"\n        [dataIndex]=\"dataIndex\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [fxLayout]=\"getFlexAttribute('layout')\"\n        [fxLayoutGap]=\"options?.fxLayoutGap\"\n        [fxLayoutAlign]=\"options?.fxLayoutAlign\"\n        [attr.fxFlexFill]=\"options?.fxLayoutAlign\"></flex-layout-root-widget>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </fieldset>\n\n    <mat-card *ngIf=\"containerType === 'card'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\">\n      <mat-card-header *ngIf=\"sectionTitle\">\n        <legend\n          [class]=\"'legend ' + (options?.labelHtmlClass || '')\"\n          [innerHTML]=\"sectionTitle\"\n          (click)=\"toggleExpanded()\"></legend>\n      </mat-card-header>\n      <mat-card-content *ngIf=\"expanded\">\n        <fieldset [disabled]=\"options?.readonly\">\n          <flex-layout-root-widget *ngIf=\"expanded\"\n            [layout]=\"layoutNode.items\"\n            [dataIndex]=\"dataIndex\"\n            [layoutIndex]=\"layoutIndex\"\n            [isFlexItem]=\"getFlexAttribute('is-flex')\"\n            [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n            [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n            [style.display]=\"getFlexAttribute('display')\"\n            [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n            [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n            [style.justify-content]=\"getFlexAttribute('justify-content')\"\n            [style.align-items]=\"getFlexAttribute('align-items')\"\n            [style.align-content]=\"getFlexAttribute('align-content')\"\n            [fxLayout]=\"getFlexAttribute('layout')\"\n            [fxLayoutGap]=\"options?.fxLayoutGap\"\n            [fxLayoutAlign]=\"options?.fxLayoutAlign\"\n            [attr.fxFlexFill]=\"options?.fxLayoutAlign\"></flex-layout-root-widget>\n          </fieldset>\n      </mat-card-content>\n      <mat-card-footer>\n        <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n          [innerHTML]=\"options?.errorMessage\"></mat-error>\n      </mat-card-footer>\n    </mat-card>\n\n    <mat-expansion-panel *ngIf=\"containerType === 'expansion-panel'\"\n      [expanded]=\"expanded\"\n      [hideToggle]=\"!options?.expandable\">\n      <mat-expansion-panel-header>\n        <mat-panel-title>\n          <legend *ngIf=\"sectionTitle\"\n            [class]=\"options?.labelHtmlClass\"\n            [innerHTML]=\"sectionTitle\"\n            (click)=\"toggleExpanded()\"></legend>\n        </mat-panel-title>\n      </mat-expansion-panel-header>\n      <fieldset [disabled]=\"options?.readonly\">\n        <flex-layout-root-widget *ngIf=\"expanded\"\n          [layout]=\"layoutNode.items\"\n          [dataIndex]=\"dataIndex\"\n          [layoutIndex]=\"layoutIndex\"\n          [isFlexItem]=\"getFlexAttribute('is-flex')\"\n          [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n          [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n          [style.display]=\"getFlexAttribute('display')\"\n          [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n          [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n          [style.justify-content]=\"getFlexAttribute('justify-content')\"\n          [style.align-items]=\"getFlexAttribute('align-items')\"\n          [style.align-content]=\"getFlexAttribute('align-content')\"\n          [fxLayout]=\"getFlexAttribute('layout')\"\n          [fxLayoutGap]=\"options?.fxLayoutGap\"\n          [fxLayoutAlign]=\"options?.fxLayoutAlign\"\n          [attr.fxFlexFill]=\"options?.fxLayoutAlign\"></flex-layout-root-widget>\n      </fieldset>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </mat-expansion-panel>",
                    styles: ["\n    fieldset { border: 0; margin: 0; padding: 0; }\n    .legend { font-weight: bold; }\n    .expandable > .legend:before { content: '\u25B6'; padding-right: .3em; }\n    .expanded > .legend:before { content: '\u25BC'; padding-right: .2em; }\n  "],
                },] },
    ];
    /** @nocollapse */
    FlexLayoutSectionComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService }
    ]; };
    FlexLayoutSectionComponent.propDecorators = {
        layoutNode: [{ type: Input }],
        layoutIndex: [{ type: Input }],
        dataIndex: [{ type: Input }]
    };
    return FlexLayoutSectionComponent;
}());
export { FlexLayoutSectionComponent };
if (false) {
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.formControl;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.controlName;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.controlValue;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.controlDisabled;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.boundControl;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.options;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.expanded;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.containerType;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.layoutNode;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.layoutIndex;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.dataIndex;
    /** @type {?} */
    FlexLayoutSectionComponent.prototype.jsf;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC1sYXlvdXQtc2VjdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsibGliL2ZyYW1ld29yay1saWJyYXJ5L21hdGVyaWFsLWRlc2lnbi1mcmFtZXdvcmsvZmxleC1sYXlvdXQtc2VjdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBSXpELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOztJQTBKckUsb0NBQ1U7UUFBQSxRQUFHLEdBQUgsR0FBRzsrQkFWSyxLQUFLOzRCQUNSLEtBQUs7d0JBRVQsSUFBSTs2QkFDQyxLQUFLO0tBT2hCO0lBRUwsc0JBQUksb0RBQVk7Ozs7UUFBaEI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEU7OztPQUFBOzs7O0lBRUQsNkNBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDbkQsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEtBQUssU0FBUyxDQUFDO1lBQUMsS0FBSyxPQUFPLENBQUM7WUFBQyxLQUFLLFVBQVUsQ0FBQztZQUFDLEtBQUssa0JBQWtCLENBQUM7WUFDdkUsS0FBSyxjQUFjLENBQUM7WUFBQyxLQUFLLGdCQUFnQixDQUFDO1lBQUMsS0FBSyxnQkFBZ0I7Z0JBQy9ELElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDO2dCQUNoQyxLQUFLLENBQUM7WUFDUixLQUFLLE1BQU07Z0JBQ1QsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7Z0JBQzVCLEtBQUssQ0FBQztZQUNSLEtBQUssaUJBQWlCO2dCQUNwQixJQUFJLENBQUMsYUFBYSxHQUFHLGlCQUFpQixDQUFDO2dCQUN2QyxLQUFLLENBQUM7WUFDUjs7Z0JBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7U0FDOUI7S0FDRjs7OztJQUVELG1EQUFjOzs7SUFBZDtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQUU7S0FDakU7SUFFRCx1Q0FBdUM7SUFDdkMsMkRBQTJEOzs7OztJQUMzRCxxREFBZ0I7Ozs7SUFBaEIsVUFBaUIsU0FBaUI7O1FBQ2hDLElBQU0sVUFBVSxHQUNkLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLE1BQU07WUFDL0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVztZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUM7O1FBRWxDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsS0FBSyxTQUFTO2dCQUNaLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDcEIsS0FBSyxTQUFTO2dCQUNaLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3pDLEtBQUssZ0JBQWdCLENBQUM7WUFBQyxLQUFLLFdBQVc7O2dCQUNyQyxJQUFNLEtBQUssR0FBRyxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDakUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNELEtBQUssaUJBQWlCLENBQUM7WUFBQyxLQUFLLGFBQWEsQ0FBQztZQUFDLEtBQUssZUFBZTtnQkFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDakMsS0FBSyxRQUFRO2dCQUNYLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQztvQkFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1NBRXRFO0tBQ0Y7O2dCQWpORixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsUUFBUSxFQUFFLCtwTkFpSWU7b0JBQ3pCLE1BQU0sRUFBRSxDQUFDLHdQQUtSLENBQUM7aUJBQ0g7Ozs7Z0JBNUlRLHFCQUFxQjs7OzZCQXNKM0IsS0FBSzs4QkFDTCxLQUFLOzRCQUNMLEtBQUs7O3FDQTVKUjs7U0FpSmEsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IHRvVGl0bGVDYXNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2ZsZXgtbGF5b3V0LXNlY3Rpb24td2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0lmPVwiY29udGFpbmVyVHlwZSA9PT0gJ2RpdidcIlxuICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/Lmh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICBbY2xhc3MuZXhwYW5kYWJsZV09XCJvcHRpb25zPy5leHBhbmRhYmxlICYmICFleHBhbmRlZFwiXG4gICAgICBbY2xhc3MuZXhwYW5kZWRdPVwib3B0aW9ucz8uZXhwYW5kYWJsZSAmJiBleHBhbmRlZFwiPlxuICAgICAgPGxhYmVsICpuZ0lmPVwic2VjdGlvblRpdGxlXCJcbiAgICAgICAgW2NsYXNzXT1cIidsZWdlbmQgJyArIChvcHRpb25zPy5sYWJlbEh0bWxDbGFzcyB8fCAnJylcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cInNlY3Rpb25UaXRsZVwiXG4gICAgICAgIChjbGljayk9XCJ0b2dnbGVFeHBhbmRlZCgpXCI+PC9sYWJlbD5cbiAgICAgIDxmbGV4LWxheW91dC1yb290LXdpZGdldCAqbmdJZj1cImV4cGFuZGVkXCJcbiAgICAgICAgW2xheW91dF09XCJsYXlvdXROb2RlLml0ZW1zXCJcbiAgICAgICAgW2RhdGFJbmRleF09XCJkYXRhSW5kZXhcIlxuICAgICAgICBbbGF5b3V0SW5kZXhdPVwibGF5b3V0SW5kZXhcIlxuICAgICAgICBbaXNGbGV4SXRlbV09XCJnZXRGbGV4QXR0cmlidXRlKCdpcy1mbGV4JylcIlxuICAgICAgICBbY2xhc3MuZm9ybS1mbGV4LWNvbHVtbl09XCJnZXRGbGV4QXR0cmlidXRlKCdmbGV4LWRpcmVjdGlvbicpID09PSAnY29sdW1uJ1wiXG4gICAgICAgIFtjbGFzcy5mb3JtLWZsZXgtcm93XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJykgPT09ICdyb3cnXCJcbiAgICAgICAgW3N0eWxlLmRpc3BsYXldPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZGlzcGxheScpXCJcbiAgICAgICAgW3N0eWxlLmZsZXgtZGlyZWN0aW9uXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJylcIlxuICAgICAgICBbc3R5bGUuZmxleC13cmFwXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtd3JhcCcpXCJcbiAgICAgICAgW3N0eWxlLmp1c3RpZnktY29udGVudF09XCJnZXRGbGV4QXR0cmlidXRlKCdqdXN0aWZ5LWNvbnRlbnQnKVwiXG4gICAgICAgIFtzdHlsZS5hbGlnbi1pdGVtc109XCJnZXRGbGV4QXR0cmlidXRlKCdhbGlnbi1pdGVtcycpXCJcbiAgICAgICAgW3N0eWxlLmFsaWduLWNvbnRlbnRdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnYWxpZ24tY29udGVudCcpXCJcbiAgICAgICAgW2Z4TGF5b3V0XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2xheW91dCcpXCJcbiAgICAgICAgW2Z4TGF5b3V0R2FwXT1cIm9wdGlvbnM/LmZ4TGF5b3V0R2FwXCJcbiAgICAgICAgW2Z4TGF5b3V0QWxpZ25dPVwib3B0aW9ucz8uZnhMYXlvdXRBbGlnblwiXG4gICAgICAgIFthdHRyLmZ4RmxleEZpbGxdPVwib3B0aW9ucz8uZnhMYXlvdXRBbGlnblwiPjwvZmxleC1sYXlvdXQtcm9vdC13aWRnZXQ+XG4gICAgICA8bWF0LWVycm9yICpuZ0lmPVwib3B0aW9ucz8uc2hvd0Vycm9ycyAmJiBvcHRpb25zPy5lcnJvck1lc3NhZ2VcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LmVycm9yTWVzc2FnZVwiPjwvbWF0LWVycm9yPlxuICAgIDwvZGl2PlxuXG4gICAgPGZpZWxkc2V0ICpuZ0lmPVwiY29udGFpbmVyVHlwZSA9PT0gJ2ZpZWxkc2V0J1wiXG4gICAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCJcbiAgICAgIFtjbGFzcy5leHBhbmRhYmxlXT1cIm9wdGlvbnM/LmV4cGFuZGFibGUgJiYgIWV4cGFuZGVkXCJcbiAgICAgIFtjbGFzcy5leHBhbmRlZF09XCJvcHRpb25zPy5leHBhbmRhYmxlICYmIGV4cGFuZGVkXCJcbiAgICAgIFtkaXNhYmxlZF09XCJvcHRpb25zPy5yZWFkb25seVwiPlxuICAgICAgPGxlZ2VuZCAqbmdJZj1cInNlY3Rpb25UaXRsZVwiXG4gICAgICAgIFtjbGFzc109XCInbGVnZW5kICcgKyAob3B0aW9ucz8ubGFiZWxIdG1sQ2xhc3MgfHwgJycpXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJzZWN0aW9uVGl0bGVcIlxuICAgICAgICAoY2xpY2spPVwidG9nZ2xlRXhwYW5kZWQoKVwiPjwvbGVnZW5kPlxuICAgICAgPGZsZXgtbGF5b3V0LXJvb3Qtd2lkZ2V0ICpuZ0lmPVwiZXhwYW5kZWRcIlxuICAgICAgICBbbGF5b3V0XT1cImxheW91dE5vZGUuaXRlbXNcIlxuICAgICAgICBbZGF0YUluZGV4XT1cImRhdGFJbmRleFwiXG4gICAgICAgIFtsYXlvdXRJbmRleF09XCJsYXlvdXRJbmRleFwiXG4gICAgICAgIFtpc0ZsZXhJdGVtXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2lzLWZsZXgnKVwiXG4gICAgICAgIFtjbGFzcy5mb3JtLWZsZXgtY29sdW1uXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJykgPT09ICdjb2x1bW4nXCJcbiAgICAgICAgW2NsYXNzLmZvcm0tZmxleC1yb3ddPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC1kaXJlY3Rpb24nKSA9PT0gJ3JvdydcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJnZXRGbGV4QXR0cmlidXRlKCdkaXNwbGF5JylcIlxuICAgICAgICBbc3R5bGUuZmxleC1kaXJlY3Rpb25dPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC1kaXJlY3Rpb24nKVwiXG4gICAgICAgIFtzdHlsZS5mbGV4LXdyYXBdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC13cmFwJylcIlxuICAgICAgICBbc3R5bGUuanVzdGlmeS1jb250ZW50XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2p1c3RpZnktY29udGVudCcpXCJcbiAgICAgICAgW3N0eWxlLmFsaWduLWl0ZW1zXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2FsaWduLWl0ZW1zJylcIlxuICAgICAgICBbc3R5bGUuYWxpZ24tY29udGVudF09XCJnZXRGbGV4QXR0cmlidXRlKCdhbGlnbi1jb250ZW50JylcIlxuICAgICAgICBbZnhMYXlvdXRdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnbGF5b3V0JylcIlxuICAgICAgICBbZnhMYXlvdXRHYXBdPVwib3B0aW9ucz8uZnhMYXlvdXRHYXBcIlxuICAgICAgICBbZnhMYXlvdXRBbGlnbl09XCJvcHRpb25zPy5meExheW91dEFsaWduXCJcbiAgICAgICAgW2F0dHIuZnhGbGV4RmlsbF09XCJvcHRpb25zPy5meExheW91dEFsaWduXCI+PC9mbGV4LWxheW91dC1yb290LXdpZGdldD5cbiAgICAgIDxtYXQtZXJyb3IgKm5nSWY9XCJvcHRpb25zPy5zaG93RXJyb3JzICYmIG9wdGlvbnM/LmVycm9yTWVzc2FnZVwiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8uZXJyb3JNZXNzYWdlXCI+PC9tYXQtZXJyb3I+XG4gICAgPC9maWVsZHNldD5cblxuICAgIDxtYXQtY2FyZCAqbmdJZj1cImNvbnRhaW5lclR5cGUgPT09ICdjYXJkJ1wiXG4gICAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCJcbiAgICAgIFtjbGFzcy5leHBhbmRhYmxlXT1cIm9wdGlvbnM/LmV4cGFuZGFibGUgJiYgIWV4cGFuZGVkXCJcbiAgICAgIFtjbGFzcy5leHBhbmRlZF09XCJvcHRpb25zPy5leHBhbmRhYmxlICYmIGV4cGFuZGVkXCI+XG4gICAgICA8bWF0LWNhcmQtaGVhZGVyICpuZ0lmPVwic2VjdGlvblRpdGxlXCI+XG4gICAgICAgIDxsZWdlbmRcbiAgICAgICAgICBbY2xhc3NdPVwiJ2xlZ2VuZCAnICsgKG9wdGlvbnM/LmxhYmVsSHRtbENsYXNzIHx8ICcnKVwiXG4gICAgICAgICAgW2lubmVySFRNTF09XCJzZWN0aW9uVGl0bGVcIlxuICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVFeHBhbmRlZCgpXCI+PC9sZWdlbmQ+XG4gICAgICA8L21hdC1jYXJkLWhlYWRlcj5cbiAgICAgIDxtYXQtY2FyZC1jb250ZW50ICpuZ0lmPVwiZXhwYW5kZWRcIj5cbiAgICAgICAgPGZpZWxkc2V0IFtkaXNhYmxlZF09XCJvcHRpb25zPy5yZWFkb25seVwiPlxuICAgICAgICAgIDxmbGV4LWxheW91dC1yb290LXdpZGdldCAqbmdJZj1cImV4cGFuZGVkXCJcbiAgICAgICAgICAgIFtsYXlvdXRdPVwibGF5b3V0Tm9kZS5pdGVtc1wiXG4gICAgICAgICAgICBbZGF0YUluZGV4XT1cImRhdGFJbmRleFwiXG4gICAgICAgICAgICBbbGF5b3V0SW5kZXhdPVwibGF5b3V0SW5kZXhcIlxuICAgICAgICAgICAgW2lzRmxleEl0ZW1dPVwiZ2V0RmxleEF0dHJpYnV0ZSgnaXMtZmxleCcpXCJcbiAgICAgICAgICAgIFtjbGFzcy5mb3JtLWZsZXgtY29sdW1uXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJykgPT09ICdjb2x1bW4nXCJcbiAgICAgICAgICAgIFtjbGFzcy5mb3JtLWZsZXgtcm93XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJykgPT09ICdyb3cnXCJcbiAgICAgICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2Rpc3BsYXknKVwiXG4gICAgICAgICAgICBbc3R5bGUuZmxleC1kaXJlY3Rpb25dPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC1kaXJlY3Rpb24nKVwiXG4gICAgICAgICAgICBbc3R5bGUuZmxleC13cmFwXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtd3JhcCcpXCJcbiAgICAgICAgICAgIFtzdHlsZS5qdXN0aWZ5LWNvbnRlbnRdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnanVzdGlmeS1jb250ZW50JylcIlxuICAgICAgICAgICAgW3N0eWxlLmFsaWduLWl0ZW1zXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2FsaWduLWl0ZW1zJylcIlxuICAgICAgICAgICAgW3N0eWxlLmFsaWduLWNvbnRlbnRdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnYWxpZ24tY29udGVudCcpXCJcbiAgICAgICAgICAgIFtmeExheW91dF09XCJnZXRGbGV4QXR0cmlidXRlKCdsYXlvdXQnKVwiXG4gICAgICAgICAgICBbZnhMYXlvdXRHYXBdPVwib3B0aW9ucz8uZnhMYXlvdXRHYXBcIlxuICAgICAgICAgICAgW2Z4TGF5b3V0QWxpZ25dPVwib3B0aW9ucz8uZnhMYXlvdXRBbGlnblwiXG4gICAgICAgICAgICBbYXR0ci5meEZsZXhGaWxsXT1cIm9wdGlvbnM/LmZ4TGF5b3V0QWxpZ25cIj48L2ZsZXgtbGF5b3V0LXJvb3Qtd2lkZ2V0PlxuICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICA8L21hdC1jYXJkLWNvbnRlbnQ+XG4gICAgICA8bWF0LWNhcmQtZm9vdGVyPlxuICAgICAgICA8bWF0LWVycm9yICpuZ0lmPVwib3B0aW9ucz8uc2hvd0Vycm9ycyAmJiBvcHRpb25zPy5lcnJvck1lc3NhZ2VcIlxuICAgICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8uZXJyb3JNZXNzYWdlXCI+PC9tYXQtZXJyb3I+XG4gICAgICA8L21hdC1jYXJkLWZvb3Rlcj5cbiAgICA8L21hdC1jYXJkPlxuXG4gICAgPG1hdC1leHBhbnNpb24tcGFuZWwgKm5nSWY9XCJjb250YWluZXJUeXBlID09PSAnZXhwYW5zaW9uLXBhbmVsJ1wiXG4gICAgICBbZXhwYW5kZWRdPVwiZXhwYW5kZWRcIlxuICAgICAgW2hpZGVUb2dnbGVdPVwiIW9wdGlvbnM/LmV4cGFuZGFibGVcIj5cbiAgICAgIDxtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcj5cbiAgICAgICAgPG1hdC1wYW5lbC10aXRsZT5cbiAgICAgICAgICA8bGVnZW5kICpuZ0lmPVwic2VjdGlvblRpdGxlXCJcbiAgICAgICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5sYWJlbEh0bWxDbGFzc1wiXG4gICAgICAgICAgICBbaW5uZXJIVE1MXT1cInNlY3Rpb25UaXRsZVwiXG4gICAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlRXhwYW5kZWQoKVwiPjwvbGVnZW5kPlxuICAgICAgICA8L21hdC1wYW5lbC10aXRsZT5cbiAgICAgIDwvbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXI+XG4gICAgICA8ZmllbGRzZXQgW2Rpc2FibGVkXT1cIm9wdGlvbnM/LnJlYWRvbmx5XCI+XG4gICAgICAgIDxmbGV4LWxheW91dC1yb290LXdpZGdldCAqbmdJZj1cImV4cGFuZGVkXCJcbiAgICAgICAgICBbbGF5b3V0XT1cImxheW91dE5vZGUuaXRlbXNcIlxuICAgICAgICAgIFtkYXRhSW5kZXhdPVwiZGF0YUluZGV4XCJcbiAgICAgICAgICBbbGF5b3V0SW5kZXhdPVwibGF5b3V0SW5kZXhcIlxuICAgICAgICAgIFtpc0ZsZXhJdGVtXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2lzLWZsZXgnKVwiXG4gICAgICAgICAgW2NsYXNzLmZvcm0tZmxleC1jb2x1bW5dPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC1kaXJlY3Rpb24nKSA9PT0gJ2NvbHVtbidcIlxuICAgICAgICAgIFtjbGFzcy5mb3JtLWZsZXgtcm93XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJykgPT09ICdyb3cnXCJcbiAgICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJnZXRGbGV4QXR0cmlidXRlKCdkaXNwbGF5JylcIlxuICAgICAgICAgIFtzdHlsZS5mbGV4LWRpcmVjdGlvbl09XCJnZXRGbGV4QXR0cmlidXRlKCdmbGV4LWRpcmVjdGlvbicpXCJcbiAgICAgICAgICBbc3R5bGUuZmxleC13cmFwXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtd3JhcCcpXCJcbiAgICAgICAgICBbc3R5bGUuanVzdGlmeS1jb250ZW50XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2p1c3RpZnktY29udGVudCcpXCJcbiAgICAgICAgICBbc3R5bGUuYWxpZ24taXRlbXNdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnYWxpZ24taXRlbXMnKVwiXG4gICAgICAgICAgW3N0eWxlLmFsaWduLWNvbnRlbnRdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnYWxpZ24tY29udGVudCcpXCJcbiAgICAgICAgICBbZnhMYXlvdXRdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnbGF5b3V0JylcIlxuICAgICAgICAgIFtmeExheW91dEdhcF09XCJvcHRpb25zPy5meExheW91dEdhcFwiXG4gICAgICAgICAgW2Z4TGF5b3V0QWxpZ25dPVwib3B0aW9ucz8uZnhMYXlvdXRBbGlnblwiXG4gICAgICAgICAgW2F0dHIuZnhGbGV4RmlsbF09XCJvcHRpb25zPy5meExheW91dEFsaWduXCI+PC9mbGV4LWxheW91dC1yb290LXdpZGdldD5cbiAgICAgIDwvZmllbGRzZXQ+XG4gICAgICA8bWF0LWVycm9yICpuZ0lmPVwib3B0aW9ucz8uc2hvd0Vycm9ycyAmJiBvcHRpb25zPy5lcnJvck1lc3NhZ2VcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LmVycm9yTWVzc2FnZVwiPjwvbWF0LWVycm9yPlxuICAgIDwvbWF0LWV4cGFuc2lvbi1wYW5lbD5gLFxuICBzdHlsZXM6IFtgXG4gICAgZmllbGRzZXQgeyBib3JkZXI6IDA7IG1hcmdpbjogMDsgcGFkZGluZzogMDsgfVxuICAgIC5sZWdlbmQgeyBmb250LXdlaWdodDogYm9sZDsgfVxuICAgIC5leHBhbmRhYmxlID4gLmxlZ2VuZDpiZWZvcmUgeyBjb250ZW50OiAn4pa2JzsgcGFkZGluZy1yaWdodDogLjNlbTsgfVxuICAgIC5leHBhbmRlZCA+IC5sZWdlbmQ6YmVmb3JlIHsgY29udGVudDogJ+KWvCc7IHBhZGRpbmctcmlnaHQ6IC4yZW07IH1cbiAgYF0sXG59KVxuZXhwb3J0IGNsYXNzIEZsZXhMYXlvdXRTZWN0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZm9ybUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcbiAgY29udHJvbE5hbWU6IHN0cmluZztcbiAgY29udHJvbFZhbHVlOiBhbnk7XG4gIGNvbnRyb2xEaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZENvbnRyb2wgPSBmYWxzZTtcbiAgb3B0aW9uczogYW55O1xuICBleHBhbmRlZCA9IHRydWU7XG4gIGNvbnRhaW5lclR5cGUgPSAnZGl2JztcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIGdldCBzZWN0aW9uVGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ub3RpdGxlID8gbnVsbCA6IHRoaXMuanNmLnNldEl0ZW1UaXRsZSh0aGlzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMpO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuZXhwYW5kZWQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmV4cGFuZGVkID09PSAnYm9vbGVhbicgP1xuICAgICAgdGhpcy5vcHRpb25zLmV4cGFuZGVkIDogIXRoaXMub3B0aW9ucy5leHBhbmRhYmxlO1xuICAgIHN3aXRjaCAodGhpcy5sYXlvdXROb2RlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NlY3Rpb24nOiBjYXNlICdhcnJheSc6IGNhc2UgJ2ZpZWxkc2V0JzogY2FzZSAnYWR2YW5jZWRmaWVsZHNldCc6XG4gICAgICBjYXNlICdhdXRoZmllbGRzZXQnOiBjYXNlICdvcHRpb25maWVsZHNldCc6IGNhc2UgJ3NlbGVjdGZpZWxkc2V0JzpcbiAgICAgICAgdGhpcy5jb250YWluZXJUeXBlID0gJ2ZpZWxkc2V0JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjYXJkJzpcbiAgICAgICAgdGhpcy5jb250YWluZXJUeXBlID0gJ2NhcmQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V4cGFuc2lvbi1wYW5lbCc6XG4gICAgICAgIHRoaXMuY29udGFpbmVyVHlwZSA9ICdleHBhbnNpb24tcGFuZWwnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6IC8vICdkaXYnLCAnZmxleCcsICd0YWInLCAnY29uZGl0aW9uYWwnLCAnYWN0aW9ucydcbiAgICAgICAgdGhpcy5jb250YWluZXJUeXBlID0gJ2Rpdic7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlRXhwYW5kZWQoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5leHBhbmRhYmxlKSB7IHRoaXMuZXhwYW5kZWQgPSAhdGhpcy5leHBhbmRlZDsgfVxuICB9XG5cbiAgLy8gU2V0IGF0dHJpYnV0ZXMgZm9yIGZsZXhib3ggY29udGFpbmVyXG4gIC8vIChjaGlsZCBhdHRyaWJ1dGVzIGFyZSBzZXQgaW4gZmxleC1sYXlvdXQtcm9vdC5jb21wb25lbnQpXG4gIGdldEZsZXhBdHRyaWJ1dGUoYXR0cmlidXRlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBmbGV4QWN0aXZlOiBib29sZWFuID1cbiAgICAgIHRoaXMubGF5b3V0Tm9kZS50eXBlID09PSAnZmxleCcgfHxcbiAgICAgICEhdGhpcy5vcHRpb25zLmRpc3BsYXlGbGV4IHx8XG4gICAgICB0aGlzLm9wdGlvbnMuZGlzcGxheSA9PT0gJ2ZsZXgnO1xuICAgIC8vIGlmIChhdHRyaWJ1dGUgIT09ICdmbGV4JyAmJiAhZmxleEFjdGl2ZSkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHN3aXRjaCAoYXR0cmlidXRlKSB7XG4gICAgICBjYXNlICdpcy1mbGV4JzpcbiAgICAgICAgcmV0dXJuIGZsZXhBY3RpdmU7XG4gICAgICBjYXNlICdkaXNwbGF5JzpcbiAgICAgICAgcmV0dXJuIGZsZXhBY3RpdmUgPyAnZmxleCcgOiAnaW5pdGlhbCc7XG4gICAgICBjYXNlICdmbGV4LWRpcmVjdGlvbic6IGNhc2UgJ2ZsZXgtd3JhcCc6XG4gICAgICAgIGNvbnN0IGluZGV4ID0gWydmbGV4LWRpcmVjdGlvbicsICdmbGV4LXdyYXAnXS5pbmRleE9mKGF0dHJpYnV0ZSk7XG4gICAgICAgIHJldHVybiAodGhpcy5vcHRpb25zWydmbGV4LWZsb3cnXSB8fCAnJykuc3BsaXQoL1xccysvKVtpbmRleF0gfHxcbiAgICAgICAgICB0aGlzLm9wdGlvbnNbYXR0cmlidXRlXSB8fCBbJ2NvbHVtbicsICdub3dyYXAnXVtpbmRleF07XG4gICAgICBjYXNlICdqdXN0aWZ5LWNvbnRlbnQnOiBjYXNlICdhbGlnbi1pdGVtcyc6IGNhc2UgJ2FsaWduLWNvbnRlbnQnOlxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW2F0dHJpYnV0ZV07XG4gICAgICBjYXNlICdsYXlvdXQnOlxuICAgICAgICByZXR1cm4gKHRoaXMub3B0aW9ucy5meExheW91dCB8fCAncm93JykgK1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5meExheW91dFdyYXAgPyAnICcgKyB0aGlzLm9wdGlvbnMuZnhMYXlvdXRXcmFwIDogJyc7XG5cbiAgICB9XG4gIH1cbn1cbiJdfQ==