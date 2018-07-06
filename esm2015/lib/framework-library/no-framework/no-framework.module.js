/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetLibraryModule } from '../../widget-library/widget-library.module';
import { Framework } from '../framework';
import { NoFrameworkComponent } from './no-framework.component';
import { NoFramework } from './no.framework';
export class NoFrameworkModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: NoFrameworkModule,
            providers: [
                { provide: Framework, useClass: NoFramework, multi: true }
            ]
        };
    }
}
NoFrameworkModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, WidgetLibraryModule],
                declarations: [NoFrameworkComponent],
                exports: [NoFrameworkComponent],
                entryComponents: [NoFrameworkComponent]
            },] },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tZnJhbWV3b3JrLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2pzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJsaWIvZnJhbWV3b3JrLWxpYnJhcnkvbm8tZnJhbWV3b3JrL25vLWZyYW1ld29yay5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUcvQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNqRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXpDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVE3QyxNQUFNOzs7O0lBQ0osTUFBTSxDQUFDLE9BQU87UUFDWixNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO2FBQzNEO1NBQ0YsQ0FBQztLQUNIOzs7WUFkRixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFVLENBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFFO2dCQUN0RCxZQUFZLEVBQUssQ0FBRSxvQkFBb0IsQ0FBRTtnQkFDekMsT0FBTyxFQUFVLENBQUUsb0JBQW9CLENBQUU7Z0JBQ3pDLGVBQWUsRUFBRSxDQUFFLG9CQUFvQixDQUFFO2FBQzFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBXaWRnZXRMaWJyYXJ5TW9kdWxlIH0gZnJvbSAnLi4vLi4vd2lkZ2V0LWxpYnJhcnkvd2lkZ2V0LWxpYnJhcnkubW9kdWxlJztcbmltcG9ydCB7IEZyYW1ld29yayB9IGZyb20gJy4uL2ZyYW1ld29yayc7XG4vLyBObyBmcmFtZXdvcmsgLSBwbGFpbiBIVE1MIGNvbnRyb2xzIChzdHlsZXMgZnJvbSBmb3JtIGxheW91dCBvbmx5KVxuaW1wb3J0IHsgTm9GcmFtZXdvcmtDb21wb25lbnQgfSBmcm9tICcuL25vLWZyYW1ld29yay5jb21wb25lbnQnO1xuaW1wb3J0IHsgTm9GcmFtZXdvcmsgfSBmcm9tICcuL25vLmZyYW1ld29yayc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6ICAgICAgICAgWyBDb21tb25Nb2R1bGUsIFdpZGdldExpYnJhcnlNb2R1bGUgXSxcbiAgZGVjbGFyYXRpb25zOiAgICBbIE5vRnJhbWV3b3JrQ29tcG9uZW50IF0sXG4gIGV4cG9ydHM6ICAgICAgICAgWyBOb0ZyYW1ld29ya0NvbXBvbmVudCBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFsgTm9GcmFtZXdvcmtDb21wb25lbnQgXVxufSlcbmV4cG9ydCBjbGFzcyBOb0ZyYW1ld29ya01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTm9GcmFtZXdvcmtNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBGcmFtZXdvcmssIHVzZUNsYXNzOiBOb0ZyYW1ld29yaywgbXVsdGk6IHRydWUgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbn1cbiJdfQ==