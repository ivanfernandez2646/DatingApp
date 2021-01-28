import { Directive, HostBinding, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '../_models/user';

@Directive({
  selector: '[appShowAdminPanel]'
})
export class ShowAdminPanelDirective {

  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  @Input() set appShowAdminPanel(userRoles: Partial<User>) {
    if(userRoles.role?.includes("admin") || userRoles.role?.includes("moderator")){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
