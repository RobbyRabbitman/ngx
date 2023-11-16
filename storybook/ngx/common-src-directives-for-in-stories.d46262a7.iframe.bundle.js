"use strict";(self.webpackChunk_robby_rabbitman_ngx=self.webpackChunk_robby_rabbitman_ngx||[]).push([[855],{"./libs/common/src/directives/for-in.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>for_in_stories,map:()=>map,object:()=>object,string:()=>string});var tslib_es6=__webpack_require__("./node_modules/tslib/tslib.es6.mjs"),common=__webpack_require__("./node_modules/@angular/common/fesm2022/common.mjs"),core=__webpack_require__("./node_modules/@angular/core/fesm2022/core.mjs");const COMMON_ERRORS={"Can't iterate over {{}}":value=>[value]},throwCommonError=(message,...parameters)=>{throw new Error(((message,...parameters)=>`NGX Common: ${COMMON_ERRORS[message](parameters).reduce(((populated,arg)=>populated.replace("{{}}",String(arg))),String(message))}`)(message,...parameters))};let ForIn=class ForIn{constructor(){this._ngFor=(0,core.inject)(common.NgFor),this._viewContainerRef=(0,core.inject)(core.ViewContainerRef),this._ngxForIn$=(0,core.signal)(void 0)}set ngxForIn(ngxForIn){this._ngxForIn$.set(ngxForIn);let iterable=null;ngxForIn instanceof Map||ngxForIn instanceof Set?iterable=[...ngxForIn.keys()]:ngxForIn instanceof Object?iterable=Object.keys(ngxForIn):"string"==typeof ngxForIn?iterable=Object.keys(Array.from({length:ngxForIn.length})):null==ngxForIn?iterable=ngxForIn:throwCommonError("Can't iterate over {{}}",ngxForIn),this._ngFor.ngForOf=iterable}get ngxForIn(){return this._ngxForIn$()}set ngxForTemplate(template){this._ngFor.ngForTemplate=template}get ngxForTemplate(){return this._ngFor._template}set ngxForTrackBy(trackBy){this._ngFor.ngForTrackBy=trackBy}get ngxForTrackBy(){return this._ngFor.ngForTrackBy}ngDoCheck(){for(let index=0;index<this._viewContainerRef.length;index++)Object.assign(this._viewContainerRef.get(index).context,{ngxForIn:this._ngxForIn$()})}static#_=this.ngTemplateContextGuard=(directive,context)=>!0;static#_2=this.propDecorators={ngxForIn:[{type:core.Input,args:["ngxForIn"]}],ngxForTemplate:[{type:core.Input,args:["ngxForTemplate"]}],ngxForTrackBy:[{type:core.Input,args:["ngxForTrackBy"]}]}};ForIn=(0,tslib_es6.gn)([(0,core.Directive)({selector:"[ngxForIn][ngxFor]",standalone:!0,hostDirectives:[common.NgFor]})],ForIn);const for_in_stories={title:"Common/For in",component:ForIn,render:args=>({props:args,template:'<div *ngxFor="let key in object">{{ key }}</div>'})},object={args:{object:{foo:"what",bar:"ever"}}},map={args:{object:new Map([["foo","what"],["bar","ever"]])}},string={args:{object:"whatever"}}}}]);