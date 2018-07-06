/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Inject, Injectable } from '@angular/core';
import { WidgetLibraryService } from '../widget-library/widget-library.service';
import { hasOwn } from '../shared/utility.functions';
import { Framework } from './framework';
export class FrameworkLibraryService {
    /**
     * @param {?} frameworks
     * @param {?} widgetLibrary
     */
    constructor(frameworks, widgetLibrary) {
        this.frameworks = frameworks;
        this.widgetLibrary = widgetLibrary;
        this.activeFramework = null;
        this.loadExternalAssets = false;
        this.frameworkLibrary = {};
        this.frameworks.forEach(framework => this.frameworkLibrary[framework.name] = framework);
        this.defaultFramework = this.frameworks[0].name;
        this.setFramework(this.defaultFramework);
    }
    /**
     * @param {?=} loadExternalAssets
     * @return {?}
     */
    setLoadExternalAssets(loadExternalAssets = true) {
        this.loadExternalAssets = !!loadExternalAssets;
    }
    /**
     * @param {?=} framework
     * @param {?=} loadExternalAssets
     * @return {?}
     */
    setFramework(framework = this.defaultFramework, loadExternalAssets = this.loadExternalAssets) {
        this.activeFramework =
            typeof framework === 'string' && this.hasFramework(framework) ?
                this.frameworkLibrary[framework] :
                typeof framework === 'object' && hasOwn(framework, 'framework') ?
                    framework :
                    this.frameworkLibrary[this.defaultFramework];
        return this.registerFrameworkWidgets(this.activeFramework);
    }
    /**
     * @param {?} framework
     * @return {?}
     */
    registerFrameworkWidgets(framework) {
        return hasOwn(framework, 'widgets') ?
            this.widgetLibrary.registerFrameworkWidgets(framework.widgets) :
            this.widgetLibrary.unRegisterFrameworkWidgets();
    }
    /**
     * @param {?} type
     * @return {?}
     */
    hasFramework(type) {
        return hasOwn(this.frameworkLibrary, type);
    }
    /**
     * @return {?}
     */
    getFramework() {
        if (!this.activeFramework) {
            this.setFramework('default', true);
        }
        return this.activeFramework.framework;
    }
    /**
     * @return {?}
     */
    getFrameworkWidgets() {
        return this.activeFramework.widgets || {};
    }
    /**
     * @param {?=} load
     * @return {?}
     */
    getFrameworkStylesheets(load = this.loadExternalAssets) {
        return (load && this.activeFramework.stylesheets) || [];
    }
    /**
     * @param {?=} load
     * @return {?}
     */
    getFrameworkScripts(load = this.loadExternalAssets) {
        return (load && this.activeFramework.scripts) || [];
    }
}
FrameworkLibraryService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
FrameworkLibraryService.ctorParameters = () => [
    { type: Array, decorators: [{ type: Inject, args: [Framework,] }] },
    { type: WidgetLibraryService, decorators: [{ type: Inject, args: [WidgetLibraryService,] }] }
];
if (false) {
    /** @type {?} */
    FrameworkLibraryService.prototype.activeFramework;
    /** @type {?} */
    FrameworkLibraryService.prototype.stylesheets;
    /** @type {?} */
    FrameworkLibraryService.prototype.scripts;
    /** @type {?} */
    FrameworkLibraryService.prototype.loadExternalAssets;
    /** @type {?} */
    FrameworkLibraryService.prototype.defaultFramework;
    /** @type {?} */
    FrameworkLibraryService.prototype.frameworkLibrary;
    /** @type {?} */
    FrameworkLibraryService.prototype.frameworks;
    /** @type {?} */
    FrameworkLibraryService.prototype.widgetLibrary;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWV3b3JrLWxpYnJhcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2pzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJsaWIvZnJhbWV3b3JrLWxpYnJhcnkvZnJhbWV3b3JrLWxpYnJhcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDaEYsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXJELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFXeEMsTUFBTTs7Ozs7SUFRSixZQUM2QixVQUFpQixFQUNOLGFBQW1DO1FBRDlDLGVBQVUsR0FBVixVQUFVLENBQU87UUFDTixrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7K0JBVDlDLElBQUk7a0NBR1osS0FBSztnQ0FFd0IsRUFBRTtRQU1sRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUNsQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FDbEQsQ0FBQztRQUNGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQzFDOzs7OztJQUVNLHFCQUFxQixDQUFDLGtCQUFrQixHQUFHLElBQUk7UUFDcEQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQzs7Ozs7OztJQUcxQyxZQUFZLENBQ2pCLFlBQThCLElBQUksQ0FBQyxnQkFBZ0IsRUFDbkQsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQjtRQUU1QyxJQUFJLENBQUMsZUFBZTtZQUNsQixPQUFPLFNBQVMsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxTQUFTLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsU0FBUyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7Ozs7SUFHN0Qsd0JBQXdCLENBQUMsU0FBb0I7UUFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxhQUFhLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztLQUNuRDs7Ozs7SUFFTSxZQUFZLENBQUMsSUFBWTtRQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQzs7Ozs7SUFHdEMsWUFBWTtRQUNqQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FBRTtRQUNsRSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7Ozs7O0lBR2pDLG1CQUFtQjtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDOzs7Ozs7SUFHckMsdUJBQXVCLENBQUMsT0FBZ0IsSUFBSSxDQUFDLGtCQUFrQjtRQUNwRSxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7OztJQUduRCxtQkFBbUIsQ0FBQyxPQUFnQixJQUFJLENBQUMsa0JBQWtCO1FBQ2hFLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7OztZQTdEdkQsVUFBVTs7Ozt3Q0FVTixNQUFNLFNBQUMsU0FBUztZQXZCWixvQkFBb0IsdUJBd0J4QixNQUFNLFNBQUMsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFdpZGdldExpYnJhcnlTZXJ2aWNlIH0gZnJvbSAnLi4vd2lkZ2V0LWxpYnJhcnkvd2lkZ2V0LWxpYnJhcnkuc2VydmljZSc7XG5pbXBvcnQgeyBoYXNPd24gfSBmcm9tICcuLi9zaGFyZWQvdXRpbGl0eS5mdW5jdGlvbnMnO1xuXG5pbXBvcnQgeyBGcmFtZXdvcmsgfSBmcm9tICcuL2ZyYW1ld29yayc7XG5cbi8vIFBvc3NpYmxlIGZ1dHVyZSBmcmFtZXdvcmtzOlxuLy8gLSBGb3VuZGF0aW9uIDY6XG4vLyAgIGh0dHA6Ly9qdXN0aW5kYXZpcy5jby8yMDE3LzA2LzE1L3VzaW5nLWZvdW5kYXRpb24tNi1pbi1hbmd1bGFyLTQvXG4vLyAgIGh0dHBzOi8vZ2l0aHViLmNvbS96dXJiL2ZvdW5kYXRpb24tc2l0ZXNcbi8vIC0gU2VtYW50aWMgVUk6XG4vLyAgIGh0dHBzOi8vZ2l0aHViLmNvbS9lZGNhcnJvbGwvbmcyLXNlbWFudGljLXVpXG4vLyAgIGh0dHBzOi8vZ2l0aHViLmNvbS92bGFkb3Rlc2Fub3ZpYy9uZ1NlbWFudGljXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBGcmFtZXdvcmtMaWJyYXJ5U2VydmljZSB7XG4gIGFjdGl2ZUZyYW1ld29yazogRnJhbWV3b3JrID0gbnVsbDtcbiAgc3R5bGVzaGVldHM6IChIVE1MU3R5bGVFbGVtZW50fEhUTUxMaW5rRWxlbWVudClbXTtcbiAgc2NyaXB0czogSFRNTFNjcmlwdEVsZW1lbnRbXTtcbiAgbG9hZEV4dGVybmFsQXNzZXRzID0gZmFsc2U7XG4gIGRlZmF1bHRGcmFtZXdvcms6IHN0cmluZztcbiAgZnJhbWV3b3JrTGlicmFyeTogeyBbbmFtZTogc3RyaW5nXTogRnJhbWV3b3JrIH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KEZyYW1ld29yaykgcHJpdmF0ZSBmcmFtZXdvcmtzOiBhbnlbXSxcbiAgICBASW5qZWN0KFdpZGdldExpYnJhcnlTZXJ2aWNlKSBwcml2YXRlIHdpZGdldExpYnJhcnk6IFdpZGdldExpYnJhcnlTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuZnJhbWV3b3Jrcy5mb3JFYWNoKGZyYW1ld29yayA9PlxuICAgICAgdGhpcy5mcmFtZXdvcmtMaWJyYXJ5W2ZyYW1ld29yay5uYW1lXSA9IGZyYW1ld29ya1xuICAgICk7XG4gICAgdGhpcy5kZWZhdWx0RnJhbWV3b3JrID0gdGhpcy5mcmFtZXdvcmtzWzBdLm5hbWU7XG4gICAgdGhpcy5zZXRGcmFtZXdvcmsodGhpcy5kZWZhdWx0RnJhbWV3b3JrKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRMb2FkRXh0ZXJuYWxBc3NldHMobG9hZEV4dGVybmFsQXNzZXRzID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMubG9hZEV4dGVybmFsQXNzZXRzID0gISFsb2FkRXh0ZXJuYWxBc3NldHM7XG4gIH1cblxuICBwdWJsaWMgc2V0RnJhbWV3b3JrKFxuICAgIGZyYW1ld29yazogc3RyaW5nfEZyYW1ld29yayA9IHRoaXMuZGVmYXVsdEZyYW1ld29yayxcbiAgICBsb2FkRXh0ZXJuYWxBc3NldHMgPSB0aGlzLmxvYWRFeHRlcm5hbEFzc2V0c1xuICApOiBib29sZWFuIHtcbiAgICB0aGlzLmFjdGl2ZUZyYW1ld29yayA9XG4gICAgICB0eXBlb2YgZnJhbWV3b3JrID09PSAnc3RyaW5nJyAmJiB0aGlzLmhhc0ZyYW1ld29yayhmcmFtZXdvcmspID9cbiAgICAgICAgdGhpcy5mcmFtZXdvcmtMaWJyYXJ5W2ZyYW1ld29ya10gOlxuICAgICAgdHlwZW9mIGZyYW1ld29yayA9PT0gJ29iamVjdCcgJiYgaGFzT3duKGZyYW1ld29yaywgJ2ZyYW1ld29yaycpID9cbiAgICAgICAgZnJhbWV3b3JrIDpcbiAgICAgICAgdGhpcy5mcmFtZXdvcmtMaWJyYXJ5W3RoaXMuZGVmYXVsdEZyYW1ld29ya107XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJGcmFtZXdvcmtXaWRnZXRzKHRoaXMuYWN0aXZlRnJhbWV3b3JrKTtcbiAgfVxuXG4gIHJlZ2lzdGVyRnJhbWV3b3JrV2lkZ2V0cyhmcmFtZXdvcms6IEZyYW1ld29yayk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBoYXNPd24oZnJhbWV3b3JrLCAnd2lkZ2V0cycpID9cbiAgICAgIHRoaXMud2lkZ2V0TGlicmFyeS5yZWdpc3RlckZyYW1ld29ya1dpZGdldHMoZnJhbWV3b3JrLndpZGdldHMpIDpcbiAgICAgIHRoaXMud2lkZ2V0TGlicmFyeS51blJlZ2lzdGVyRnJhbWV3b3JrV2lkZ2V0cygpO1xuICB9XG5cbiAgcHVibGljIGhhc0ZyYW1ld29yayh0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaGFzT3duKHRoaXMuZnJhbWV3b3JrTGlicmFyeSwgdHlwZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0RnJhbWV3b3JrKCk6IGFueSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZUZyYW1ld29yaykgeyB0aGlzLnNldEZyYW1ld29yaygnZGVmYXVsdCcsIHRydWUpOyB9XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlRnJhbWV3b3JrLmZyYW1ld29yaztcbiAgfVxuXG4gIHB1YmxpYyBnZXRGcmFtZXdvcmtXaWRnZXRzKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlRnJhbWV3b3JrLndpZGdldHMgfHwge307XG4gIH1cblxuICBwdWJsaWMgZ2V0RnJhbWV3b3JrU3R5bGVzaGVldHMobG9hZDogYm9vbGVhbiA9IHRoaXMubG9hZEV4dGVybmFsQXNzZXRzKTogc3RyaW5nW10ge1xuICAgIHJldHVybiAobG9hZCAmJiB0aGlzLmFjdGl2ZUZyYW1ld29yay5zdHlsZXNoZWV0cykgfHwgW107XG4gIH1cblxuICBwdWJsaWMgZ2V0RnJhbWV3b3JrU2NyaXB0cyhsb2FkOiBib29sZWFuID0gdGhpcy5sb2FkRXh0ZXJuYWxBc3NldHMpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIChsb2FkICYmIHRoaXMuYWN0aXZlRnJhbWV3b3JrLnNjcmlwdHMpIHx8IFtdO1xuICB9XG59XG4iXX0=