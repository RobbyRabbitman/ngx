/*! For license information please see common-src-icon-svg-icon-directive-stories.e0f5beb7.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_robby_rabbitman_ngx=self.webpackChunk_robby_rabbitman_ngx||[]).push([[797],{"./libs/common/src/icon/svg-icon.directive.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,Custom:()=>Custom,default:()=>svg_icon_directive_stories});var tslib_es6=__webpack_require__("./node_modules/tslib/tslib.es6.js"),core=__webpack_require__("./node_modules/@angular/core/fesm2022/core.mjs"),client=__webpack_require__("./node_modules/@storybook/angular/dist/client/index.js"),filter=__webpack_require__("./node_modules/rxjs/dist/esm5/internal/operators/filter.js");var first=__webpack_require__("./node_modules/rxjs/dist/esm5/internal/operators/first.js"),Observable=__webpack_require__("./node_modules/rxjs/dist/esm5/internal/Observable.js"),lift=__webpack_require__("./node_modules/rxjs/dist/esm5/internal/util/lift.js"),OperatorSubscriber=__webpack_require__("./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js"),innerFrom=__webpack_require__("./node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js"),noop=__webpack_require__("./node_modules/rxjs/dist/esm5/internal/util/noop.js");function takeUntilDestroyed(destroyRef){destroyRef||((0,core.assertInInjectionContext)(takeUntilDestroyed),destroyRef=(0,core.inject)(core.DestroyRef));const destroyed$=new Observable.y((observer=>destroyRef.onDestroy(observer.next.bind(observer))));return source=>source.pipe(function takeUntil(notifier){return(0,lift.e)((function(source,subscriber){(0,innerFrom.Xf)(notifier).subscribe((0,OperatorSubscriber.x)(subscriber,(function(){return subscriber.complete()}),noop.Z)),!subscriber.closed&&source.subscribe(subscriber)}))}(destroyed$))}Symbol("SIGNAL");const _global=(()=>"undefined"!=typeof globalThis&&globalThis||void 0!==__webpack_require__.g&&__webpack_require__.g||"undefined"!=typeof window&&window||"undefined"!=typeof self&&"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&self)();_global.WeakRef;Symbol("UNSET"),Symbol("COMPUTING"),Symbol("ERRORED");var _class;const resized=element=>new Observable.y((subscriber=>{const observer=new ResizeObserver((entries=>subscriber.next(entries.at(0))));return observer.observe(element),()=>observer.disconnect()})),RESIZED=new core.InjectionToken("NGX Resized");let Resized=((_class=class Resized{constructor(){this.resized$=(()=>{const cdr=(0,core.inject)(core.ChangeDetectorRef),resized$=new core.EventEmitter;return(0,core.inject)(RESIZED).pipe(takeUntilDestroyed()).subscribe({next:entry=>{resized$.emit(entry),cdr.detectChanges()}}),resized$})()}}).propDecorators={resized$:[{type:core.Output,args:["ngxResized"]}]},_class);var svg_icon_directive_class;Resized=(0,tslib_es6.gn)([(0,core.Directive)({selector:"[ngxResized]",standalone:!0,providers:[{provide:RESIZED,useFactory:()=>resized((0,core.inject)(core.ElementRef).nativeElement)}]})],Resized);let IconSprites=class IconSprites{constructor(){this.sprites=new Map,this.register=sprite=>this.sprites.set(sprite.name,sprite),this.get=name=>this.sprites.get(name)}};IconSprites=(0,tslib_es6.gn)([(0,core.Injectable)({providedIn:"root"})],IconSprites);let SvgIcon=((svg_icon_directive_class=class SvgIcon{constructor(){this._element=(0,core.inject)(core.ElementRef).nativeElement,this._sprites=(0,core.inject)(IconSprites),this.icon=(0,core.signal)(void 0),this.sprite=(0,core.signal)(void 0),this._renderEffect=(0,core.effect)((()=>{const sprite=this.sprite();this._render(this._element,this.icon(),null!=sprite?this._sprites.get(sprite):void 0)})),this._render=(()=>{let classes=[];return(element,icon,sprite)=>{if(element.replaceChildren(),element.classList.remove(...classes),null!=icon&&null!=sprite){const useElement=document.createElementNS(element.namespaceURI,"use");null!=sprite.classes&&element.classList.add(...classes=sprite.classes(icon)),useElement.setAttribute("href",sprite.path(icon)),resized(useElement).pipe(function skip(count){return(0,filter.h)((function(_,index){return count<=index}))}(1),(0,first.P)()).subscribe({next:({contentRect})=>element.setAttribute("viewBox",`0 0 ${contentRect.width} ${contentRect.height}`)}),element.appendChild(useElement)}}})()}set _icon(icon){this.icon.set(icon)}set _sprite(sprite){this.sprite.set(sprite)}}).propDecorators={_icon:[{type:core.Input,args:["ngxSvgIcon"]}],_sprite:[{type:core.Input,args:["sprite"]}]},svg_icon_directive_class);var svg_icon_directive_stories_class;SvgIcon=(0,tslib_es6.gn)([(0,core.Directive)({selector:"svg[ngxSvgIcon]",standalone:!0})],SvgIcon);let FontAwesomeIcon=((svg_icon_directive_stories_class=class FontAwesomeIcon{constructor(){this.svg=(0,core.inject)(SvgIcon),this.type="regular"}set type(type){this.svg.sprite.set(`fa-${type}`)}}).ctorParameters=()=>[],svg_icon_directive_stories_class.propDecorators={type:[{type:core.Input}]},svg_icon_directive_stories_class);FontAwesomeIcon=(0,tslib_es6.gn)([(0,core.Directive)({standalone:!0,selector:"svg[faIcon]",hostDirectives:[{directive:SvgIcon,inputs:["ngxSvgIcon:faIcon"]}]}),(0,tslib_es6.w6)("design:paramtypes",[])],FontAwesomeIcon);const svg_icon_directive_stories={title:"Common/SVG Icon",decorators:[(0,client.applicationConfig)({providers:[((...sprites)=>({provide:core.ENVIRONMENT_INITIALIZER,multi:!0,useFactory:()=>{const service=(0,core.inject)(IconSprites);return()=>sprites.forEach((sprite=>service.register(sprite)))}}))({name:"fa-solid",path:icon=>`assets/icons/font-awesome-solid.svg#${icon}`},{name:"fa-regular",path:icon=>`assets/icons/font-awesome-regular.svg#${icon}`})]}),(0,client.moduleMetadata)({imports:[SvgIcon,FontAwesomeIcon]})],argTypes:{icon:{control:{type:"text"}}},args:{icon:"newspaper"}},Basic={argTypes:{sprite:{options:["fa-regular","fa-solid"],control:{type:"select"}}},args:{sprite:"fa-solid"},render:args=>({props:args,template:'<svg [ngxSvgIcon]="icon" [sprite]="sprite" height="1em"></svg>'})},Custom={argTypes:{type:{options:["regular","solid"],control:{type:"select"}}},args:{type:"solid"},render:args=>({props:args,template:'<svg [faIcon]="icon" [type]="type" height="1em"></svg>'})}},"./node_modules/@storybook/angular/dist/client/decorators.js":(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.componentWrapperDecorator=exports.applicationConfig=exports.moduleMetadata=void 0;const ComputesTemplateFromComponent_1=__webpack_require__("./node_modules/@storybook/angular/dist/client/angular-beta/ComputesTemplateFromComponent.js"),NgComponentAnalyzer_1=__webpack_require__("./node_modules/@storybook/angular/dist/client/angular-beta/utils/NgComponentAnalyzer.js");exports.moduleMetadata=metadata=>storyFn=>{const story=storyFn(),storyMetadata=story.moduleMetadata||{};return metadata=metadata||{},{...story,moduleMetadata:{declarations:[...metadata.declarations||[],...storyMetadata.declarations||[]],entryComponents:[...metadata.entryComponents||[],...storyMetadata.entryComponents||[]],imports:[...metadata.imports||[],...storyMetadata.imports||[]],schemas:[...metadata.schemas||[],...storyMetadata.schemas||[]],providers:[...metadata.providers||[],...storyMetadata.providers||[]]}}},exports.applicationConfig=function applicationConfig(config){return storyFn=>{const story=storyFn(),storyConfig=story.applicationConfig;return{...story,applicationConfig:storyConfig||config?{...config,...storyConfig,providers:[...config?.providers||[],...storyConfig?.providers||[]]}:void 0}}};exports.componentWrapperDecorator=(element,props)=>(storyFn,storyContext)=>{const story=storyFn(),currentProps="function"==typeof props?props(storyContext):props,template=(0,NgComponentAnalyzer_1.isComponent)(element)?(0,ComputesTemplateFromComponent_1.computesTemplateFromComponent)(element,currentProps??{},story.template):element(story.template);return{...story,template,...currentProps||story.props?{props:{...currentProps,...story.props}}:{}}}},"./node_modules/@storybook/angular/dist/client/index.js":function(__unused_webpack_module,exports,__webpack_require__){var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k);var desc=Object.getOwnPropertyDescriptor(m,k);desc&&!("get"in desc?!m.__esModule:desc.writable||desc.configurable)||(desc={enumerable:!0,get:function(){return m[k]}}),Object.defineProperty(o,k2,desc)}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__exportStar=this&&this.__exportStar||function(m,exports){for(var p in m)"default"===p||Object.prototype.hasOwnProperty.call(exports,p)||__createBinding(exports,m,p)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.applicationConfig=exports.componentWrapperDecorator=exports.moduleMetadata=void 0,__webpack_require__("./node_modules/@storybook/angular/dist/client/globals.js"),__exportStar(__webpack_require__("./node_modules/@storybook/angular/dist/client/public-api.js"),exports),__exportStar(__webpack_require__("./node_modules/@storybook/angular/dist/client/public-types.js"),exports);var decorators_1=__webpack_require__("./node_modules/@storybook/angular/dist/client/decorators.js");Object.defineProperty(exports,"moduleMetadata",{enumerable:!0,get:function(){return decorators_1.moduleMetadata}}),Object.defineProperty(exports,"componentWrapperDecorator",{enumerable:!0,get:function(){return decorators_1.componentWrapperDecorator}}),Object.defineProperty(exports,"applicationConfig",{enumerable:!0,get:function(){return decorators_1.applicationConfig}})},"./node_modules/@storybook/angular/dist/client/public-api.js":function(__unused_webpack_module,exports,__webpack_require__){var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k);var desc=Object.getOwnPropertyDescriptor(m,k);desc&&!("get"in desc?!m.__esModule:desc.writable||desc.configurable)||(desc={enumerable:!0,get:function(){return m[k]}}),Object.defineProperty(o,k2,desc)}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__exportStar=this&&this.__exportStar||function(m,exports){for(var p in m)"default"===p||Object.prototype.hasOwnProperty.call(exports,p)||__createBinding(exports,m,p)},__importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.raw=exports.forceReRender=exports.configure=exports.storiesOf=void 0;const core_client_1=__webpack_require__("@storybook/core-client"),render_1=__webpack_require__("./node_modules/@storybook/angular/dist/client/render.js"),decorateStory_1=__importDefault(__webpack_require__("./node_modules/@storybook/angular/dist/client/decorateStory.js"));__exportStar(__webpack_require__("./node_modules/@storybook/angular/dist/client/public-types.js"),exports);const api=(0,core_client_1.start)(render_1.renderToCanvas,{decorateStory:decorateStory_1.default,render:render_1.render});exports.storiesOf=(kind,m)=>api.clientApi.storiesOf(kind,m).addParameters({renderer:"angular"});exports.configure=(...args)=>api.configure("angular",...args),exports.forceReRender=api.forceReRender,exports.raw=api.clientApi.raw},"./node_modules/@storybook/angular/dist/client/public-types.js":(__unused_webpack_module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0})}}]);