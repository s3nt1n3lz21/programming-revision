import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[showN]'
})
export class ShowNDirective {
	private _n = 0;

	constructor(
		private _templateRef: TemplateRef<any>,
		private _viewContainer: ViewContainerRef) { 
	}

  @Input('showN') set showN(n: number) {
		this._n = n;
	}

  ngOnInit() {
  	for (let index = 0; index < this._n; index++) {
  		this._viewContainer.createEmbeddedView(this._templateRef);
  	}
  }
}
