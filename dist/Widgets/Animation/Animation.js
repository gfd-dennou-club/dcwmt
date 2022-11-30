import Color from"../../Core/Color.js";import defined from"../../Core/defined.js";import destroyObject from"../../Core/destroyObject.js";import DeveloperError from"../../Core/DeveloperError.js";import getElement from"../getElement.js";import subscribeAndEvaluate from"../subscribeAndEvaluate.js";const svgNS="http://www.w3.org/2000/svg",xlinkNS="http://www.w3.org/1999/xlink";let widgetForDrag;const gradientEnabledColor0=Color.fromCssColorString("rgba(247,250,255,0.384)"),gradientEnabledColor1=Color.fromCssColorString("rgba(143,191,255,0.216)"),gradientEnabledColor2=Color.fromCssColorString("rgba(153,197,255,0.098)"),gradientEnabledColor3=Color.fromCssColorString("rgba(255,255,255,0.086)"),gradientDisabledColor0=Color.fromCssColorString("rgba(255,255,255,0.267)"),gradientDisabledColor1=Color.fromCssColorString("rgba(255,255,255,0)"),gradientKnobColor=Color.fromCssColorString("rgba(66,67,68,0.3)"),gradientPointerColor=Color.fromCssColorString("rgba(0,0,0,0.5)");function getElementColor(t){return Color.fromCssColorString(window.getComputedStyle(t).getPropertyValue("color"))}const svgIconsById={animation_pathReset:{tagName:"path",transform:"translate(16,16) scale(0.85) translate(-16,-16)",d:"M24.316,5.318,9.833,13.682,9.833,5.5,5.5,5.5,5.5,25.5,9.833,25.5,9.833,17.318,24.316,25.682z"},animation_pathPause:{tagName:"path",transform:"translate(16,16) scale(0.85) translate(-16,-16)",d:"M13,5.5,7.5,5.5,7.5,25.5,13,25.5zM24.5,5.5,19,5.5,19,25.5,24.5,25.5z"},animation_pathPlay:{tagName:"path",transform:"translate(16,16) scale(0.85) translate(-16,-16)",d:"M6.684,25.682L24.316,15.5L6.684,5.318V25.682z"},animation_pathPlayReverse:{tagName:"path",transform:"translate(16,16) scale(-0.85,0.85) translate(-16,-16)",d:"M6.684,25.682L24.316,15.5L6.684,5.318V25.682z"},animation_pathLoop:{tagName:"path",transform:"translate(16,16) scale(0.85) translate(-16,-16)",d:"M24.249,15.499c-0.009,4.832-3.918,8.741-8.75,8.75c-2.515,0-4.768-1.064-6.365-2.763l2.068-1.442l-7.901-3.703l0.744,8.694l2.193-1.529c2.244,2.594,5.562,4.242,9.26,4.242c6.767,0,12.249-5.482,12.249-12.249H24.249zM15.499,6.75c2.516,0,4.769,1.065,6.367,2.764l-2.068,1.443l7.901,3.701l-0.746-8.693l-2.192,1.529c-2.245-2.594-5.562-4.245-9.262-4.245C8.734,3.25,3.25,8.734,3.249,15.499H6.75C6.758,10.668,10.668,6.758,15.499,6.75z"},animation_pathClock:{tagName:"path",transform:"translate(16,16) scale(0.85) translate(-16,-15.5)",d:"M15.5,2.374C8.251,2.375,2.376,8.251,2.374,15.5C2.376,22.748,8.251,28.623,15.5,28.627c7.249-0.004,13.124-5.879,13.125-13.127C28.624,8.251,22.749,2.375,15.5,2.374zM15.5,25.623C9.909,25.615,5.385,21.09,5.375,15.5C5.385,9.909,9.909,5.384,15.5,5.374c5.59,0.01,10.115,4.535,10.124,10.125C25.615,21.09,21.091,25.615,15.5,25.623zM8.625,15.5c-0.001-0.552-0.448-0.999-1.001-1c-0.553,0-1,0.448-1,1c0,0.553,0.449,1,1,1C8.176,16.5,8.624,16.053,8.625,15.5zM8.179,18.572c-0.478,0.277-0.642,0.889-0.365,1.367c0.275,0.479,0.889,0.641,1.365,0.365c0.479-0.275,0.643-0.887,0.367-1.367C9.27,18.461,8.658,18.297,8.179,18.572zM9.18,10.696c-0.479-0.276-1.09-0.112-1.366,0.366s-0.111,1.09,0.365,1.366c0.479,0.276,1.09,0.113,1.367-0.366C9.821,11.584,9.657,10.973,9.18,10.696zM22.822,12.428c0.478-0.275,0.643-0.888,0.366-1.366c-0.275-0.478-0.89-0.642-1.366-0.366c-0.479,0.278-0.642,0.89-0.366,1.367C21.732,12.54,22.344,12.705,22.822,12.428zM12.062,21.455c-0.478-0.275-1.089-0.111-1.366,0.367c-0.275,0.479-0.111,1.09,0.366,1.365c0.478,0.277,1.091,0.111,1.365-0.365C12.704,22.344,12.54,21.732,12.062,21.455zM12.062,9.545c0.479-0.276,0.642-0.888,0.366-1.366c-0.276-0.478-0.888-0.642-1.366-0.366s-0.642,0.888-0.366,1.366C10.973,9.658,11.584,9.822,12.062,9.545zM22.823,18.572c-0.48-0.275-1.092-0.111-1.367,0.365c-0.275,0.479-0.112,1.092,0.367,1.367c0.477,0.275,1.089,0.113,1.365-0.365C23.464,19.461,23.3,18.848,22.823,18.572zM19.938,7.813c-0.477-0.276-1.091-0.111-1.365,0.366c-0.275,0.48-0.111,1.091,0.366,1.367s1.089,0.112,1.366-0.366C20.581,8.702,20.418,8.089,19.938,7.813zM23.378,14.5c-0.554,0.002-1.001,0.45-1.001,1c0.001,0.552,0.448,1,1.001,1c0.551,0,1-0.447,1-1C24.378,14.949,23.929,14.5,23.378,14.5zM15.501,6.624c-0.552,0-1,0.448-1,1l-0.466,7.343l-3.004,1.96c-0.478,0.277-0.642,0.889-0.365,1.365c0.275,0.479,0.889,0.643,1.365,0.367l3.305-1.676C15.39,16.99,15.444,17,15.501,17c0.828,0,1.5-0.671,1.5-1.5l-0.5-7.876C16.501,7.072,16.053,6.624,15.501,6.624zM15.501,22.377c-0.552,0-1,0.447-1,1s0.448,1,1,1s1-0.447,1-1S16.053,22.377,15.501,22.377zM18.939,21.455c-0.479,0.277-0.643,0.889-0.366,1.367c0.275,0.477,0.888,0.643,1.366,0.365c0.478-0.275,0.642-0.889,0.366-1.365C20.028,21.344,19.417,21.18,18.939,21.455z"},animation_pathWingButton:{tagName:"path",d:"m 4.5,0.5 c -2.216,0 -4,1.784 -4,4 l 0,24 c 0,2.216 1.784,4 4,4 l 13.71875,0 C 22.478584,27.272785 27.273681,22.511272 32.5,18.25 l 0,-13.75 c 0,-2.216 -1.784,-4 -4,-4 l -24,0 z"},animation_pathPointer:{tagName:"path",d:"M-15,-65,-15,-55,15,-55,15,-65,0,-95z"},animation_pathSwooshFX:{tagName:"path",d:"m 85,0 c 0,16.617 -4.813944,35.356 -13.131081,48.4508 h 6.099803 c 8.317138,-13.0948 13.13322,-28.5955 13.13322,-45.2124 0,-46.94483 -38.402714,-85.00262 -85.7743869,-85.00262 -1.0218522,0 -2.0373001,0.0241 -3.0506131,0.0589 45.958443,1.59437 82.723058,35.77285 82.723058,81.70532 z"}};function svgFromObject(t){const e=document.createElementNS(svgNS,t.tagName);for(const o in t)if(t.hasOwnProperty(o)&&"tagName"!==o)if("children"===o){const o=t.children.length;for(let n=0;n<o;++n)e.appendChild(svgFromObject(t.children[n]))}else 0===o.indexOf("xlink:")?e.setAttributeNS(xlinkNS,o.substring(6),t[o]):"textContent"===o?e.textContent=t[o]:e.setAttribute(o,t[o]);return e}function svgText(t,e,o){const n=document.createElementNS(svgNS,"text");n.setAttribute("x",t),n.setAttribute("y",e),n.setAttribute("class","cesium-animation-svgText");const i=document.createElementNS(svgNS,"tspan");return i.textContent=o,n.appendChild(i),n}function setShuttleRingPointer(t,e,o){t.setAttribute("transform",`translate(100,100) rotate(${o})`),e.setAttribute("transform",`rotate(${o})`)}const makeColorStringScratch=new Color;function makeColorString(t,e){const o=e.alpha,n=1-o;return makeColorStringScratch.red=t.red*n+e.red*o,makeColorStringScratch.green=t.green*n+e.green*o,makeColorStringScratch.blue=t.blue*n+e.blue*o,makeColorStringScratch.toCssColorString()}function rectButton(t,e,o){const n=svgIconsById[o];return svgFromObject({tagName:"g",class:"cesium-animation-rectButton",transform:`translate(${t},${e})`,children:[{tagName:"rect",class:"cesium-animation-buttonGlow",width:32,height:32,rx:2,ry:2},{tagName:"rect",class:"cesium-animation-buttonMain",width:32,height:32,rx:4,ry:4},{class:"cesium-animation-buttonPath",id:o,tagName:n.tagName,transform:n.transform,d:n.d},{tagName:"title",textContent:""}]})}function wingButton(t,e,o){const n=svgIconsById[o],i=svgIconsById.animation_pathWingButton;return svgFromObject({tagName:"g",class:"cesium-animation-rectButton",transform:`translate(${t},${e})`,children:[{class:"cesium-animation-buttonGlow",id:"animation_pathWingButton",tagName:i.tagName,d:i.d},{class:"cesium-animation-buttonMain",id:"animation_pathWingButton",tagName:i.tagName,d:i.d},{class:"cesium-animation-buttonPath",id:o,tagName:n.tagName,transform:n.transform,d:n.d},{tagName:"title",textContent:""}]})}function setShuttleRingFromMouseOrTouch(t,e){const o=t._viewModel,n=o.shuttleRingDragging;if(!n||widgetForDrag===t)if("mousedown"===e.type||n&&"mousemove"===e.type||"touchstart"===e.type&&1===e.touches.length||n&&"touchmove"===e.type&&1===e.touches.length){const i=t._centerX,s=t._centerY,a=t._svgNode.getBoundingClientRect();let r,l;if("touchstart"===e.type||"touchmove"===e.type?(r=e.touches[0].clientX,l=e.touches[0].clientY):(r=e.clientX,l=e.clientY),!n&&(r>a.right||r<a.left||l<a.top||l>a.bottom))return;const c=t._shuttleRingPointer.getBoundingClientRect(),m=r-i-a.left,d=l-s-a.top;let h=180*Math.atan2(d,m)/Math.PI+90;h>180&&(h-=360);const g=o.shuttleRingAngle;n||r<c.right&&r>c.left&&l>c.top&&l<c.bottom?(widgetForDrag=t,o.shuttleRingDragging=!0,o.shuttleRingAngle=h):h<g?o.slower():h>g&&o.faster(),e.preventDefault()}else t===widgetForDrag&&(widgetForDrag=void 0),o.shuttleRingDragging=!1}function SvgButton(t,e){this._viewModel=e,this.svgElement=t,this._enabled=void 0,this._toggled=void 0;const o=this;this._clickFunction=function(){const t=o._viewModel.command;t.canExecute&&t()},t.addEventListener("click",this._clickFunction,!0),this._subscriptions=[subscribeAndEvaluate(e,"toggled",this.setToggled,this),subscribeAndEvaluate(e,"tooltip",this.setTooltip,this),subscribeAndEvaluate(e.command,"canExecute",this.setEnabled,this)]}function Animation(t,e){if(!defined(t))throw new DeveloperError("container is required.");if(!defined(e))throw new DeveloperError("viewModel is required.");t=getElement(t),this._viewModel=e,this._container=t,this._centerX=0,this._centerY=0,this._defsElement=void 0,this._svgNode=void 0,this._topG=void 0,this._lastHeight=void 0,this._lastWidth=void 0;const o=t.ownerDocument,n=document.createElement("style");n.textContent=".cesium-animation-rectButton .cesium-animation-buttonGlow { filter: url(#animation_blurred); }.cesium-animation-rectButton .cesium-animation-buttonMain { fill: url(#animation_buttonNormal); }.cesium-animation-buttonToggled .cesium-animation-buttonMain { fill: url(#animation_buttonToggled); }.cesium-animation-rectButton:hover .cesium-animation-buttonMain { fill: url(#animation_buttonHovered); }.cesium-animation-buttonDisabled .cesium-animation-buttonMain { fill: url(#animation_buttonDisabled); }.cesium-animation-shuttleRingG .cesium-animation-shuttleRingSwoosh { fill: url(#animation_shuttleRingSwooshGradient); }.cesium-animation-shuttleRingG:hover .cesium-animation-shuttleRingSwoosh { fill: url(#animation_shuttleRingSwooshHovered); }.cesium-animation-shuttleRingPointer { fill: url(#animation_shuttleRingPointerGradient); }.cesium-animation-shuttleRingPausePointer { fill: url(#animation_shuttleRingPointerPaused); }.cesium-animation-knobOuter { fill: url(#animation_knobOuter); }.cesium-animation-knobInner { fill: url(#animation_knobInner); }",o.head.insertBefore(n,o.head.childNodes[0]);const i=document.createElement("div");i.className="cesium-animation-theme",i.innerHTML='<div class="cesium-animation-themeNormal"></div><div class="cesium-animation-themeHover"></div><div class="cesium-animation-themeSelect"></div><div class="cesium-animation-themeDisabled"></div><div class="cesium-animation-themeKnob"></div><div class="cesium-animation-themePointer"></div><div class="cesium-animation-themeSwoosh"></div><div class="cesium-animation-themeSwooshHover"></div>',this._theme=i,this._themeNormal=i.childNodes[0],this._themeHover=i.childNodes[1],this._themeSelect=i.childNodes[2],this._themeDisabled=i.childNodes[3],this._themeKnob=i.childNodes[4],this._themePointer=i.childNodes[5],this._themeSwoosh=i.childNodes[6],this._themeSwooshHover=i.childNodes[7];const s=document.createElementNS(svgNS,"svg:svg");this._svgNode=s,s.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink",xlinkNS);const a=document.createElementNS(svgNS,"g");this._topG=a,this._realtimeSVG=new SvgButton(wingButton(3,4,"animation_pathClock"),e.playRealtimeViewModel),this._playReverseSVG=new SvgButton(rectButton(44,99,"animation_pathPlayReverse"),e.playReverseViewModel),this._playForwardSVG=new SvgButton(rectButton(124,99,"animation_pathPlay"),e.playForwardViewModel),this._pauseSVG=new SvgButton(rectButton(84,99,"animation_pathPause"),e.pauseViewModel);const r=document.createElementNS(svgNS,"g");r.appendChild(this._realtimeSVG.svgElement),r.appendChild(this._playReverseSVG.svgElement),r.appendChild(this._playForwardSVG.svgElement),r.appendChild(this._pauseSVG.svgElement);const l=svgFromObject({tagName:"circle",class:"cesium-animation-shuttleRingBack",cx:100,cy:100,r:99});this._shuttleRingBackPanel=l;const c=svgIconsById.animation_pathSwooshFX,m=svgIconsById.animation_pathPointer,d=svgFromObject({tagName:"g",class:"cesium-animation-shuttleRingSwoosh",children:[{tagName:c.tagName,transform:"translate(100,97) scale(-1,1)",id:"animation_pathSwooshFX",d:c.d},{tagName:c.tagName,transform:"translate(100,97)",id:"animation_pathSwooshFX",d:c.d},{tagName:"line",x1:100,y1:8,x2:100,y2:22}]});this._shuttleRingSwooshG=d,this._shuttleRingPointer=svgFromObject({class:"cesium-animation-shuttleRingPointer",id:"animation_pathPointer",tagName:m.tagName,d:m.d});const h=svgFromObject({tagName:"g",transform:"translate(100,100)"});this._knobOuter=svgFromObject({tagName:"circle",class:"cesium-animation-knobOuter",cx:0,cy:0,r:71});const g=svgFromObject({tagName:"circle",class:"cesium-animation-knobInner",cx:0,cy:0,r:61});this._knobDate=svgText(0,-24,""),this._knobTime=svgText(0,-7,""),this._knobStatus=svgText(0,-41,"");const u=svgFromObject({tagName:"circle",class:"cesium-animation-blank",cx:0,cy:0,r:61}),p=document.createElementNS(svgNS,"g");p.setAttribute("class","cesium-animation-shuttleRingG"),t.appendChild(i),a.appendChild(p),a.appendChild(h),a.appendChild(r),p.appendChild(l),p.appendChild(d),p.appendChild(this._shuttleRingPointer),h.appendChild(this._knobOuter),h.appendChild(g),h.appendChild(this._knobDate),h.appendChild(this._knobTime),h.appendChild(this._knobStatus),h.appendChild(u),s.appendChild(a),t.appendChild(s);const v=this;function C(t){setShuttleRingFromMouseOrTouch(v,t)}this._mouseCallback=C,l.addEventListener("mousedown",C,!0),l.addEventListener("touchstart",C,!0),d.addEventListener("mousedown",C,!0),d.addEventListener("touchstart",C,!0),o.addEventListener("mousemove",C,!0),o.addEventListener("touchmove",C,!0),o.addEventListener("mouseup",C,!0),o.addEventListener("touchend",C,!0),o.addEventListener("touchcancel",C,!0),this._shuttleRingPointer.addEventListener("mousedown",C,!0),this._shuttleRingPointer.addEventListener("touchstart",C,!0),this._knobOuter.addEventListener("mousedown",C,!0),this._knobOuter.addEventListener("touchstart",C,!0);const b=this._knobTime.childNodes[0],f=this._knobDate.childNodes[0],_=this._knobStatus.childNodes[0];let N;this._subscriptions=[subscribeAndEvaluate(e.pauseViewModel,"toggled",(function(t){N!==t&&(N=t,N?v._shuttleRingPointer.setAttribute("class","cesium-animation-shuttleRingPausePointer"):v._shuttleRingPointer.setAttribute("class","cesium-animation-shuttleRingPointer"))})),subscribeAndEvaluate(e,"shuttleRingAngle",(function(t){setShuttleRingPointer(v._shuttleRingPointer,v._knobOuter,t)})),subscribeAndEvaluate(e,"dateLabel",(function(t){f.textContent!==t&&(f.textContent=t)})),subscribeAndEvaluate(e,"timeLabel",(function(t){b.textContent!==t&&(b.textContent=t)})),subscribeAndEvaluate(e,"multiplierLabel",(function(t){_.textContent!==t&&(_.textContent=t)}))],this.applyThemeChanges(),this.resize()}SvgButton.prototype.destroy=function(){this.svgElement.removeEventListener("click",this._clickFunction,!0);const t=this._subscriptions;for(let e=0,o=t.length;e<o;e++)t[e].dispose();destroyObject(this)},SvgButton.prototype.isDestroyed=function(){return!1},SvgButton.prototype.setEnabled=function(t){if(this._enabled!==t){if(this._enabled=t,!t)return void this.svgElement.setAttribute("class","cesium-animation-buttonDisabled");if(this._toggled)return void this.svgElement.setAttribute("class","cesium-animation-rectButton cesium-animation-buttonToggled");this.svgElement.setAttribute("class","cesium-animation-rectButton")}},SvgButton.prototype.setToggled=function(t){this._toggled!==t&&(this._toggled=t,this._enabled&&(t?this.svgElement.setAttribute("class","cesium-animation-rectButton cesium-animation-buttonToggled"):this.svgElement.setAttribute("class","cesium-animation-rectButton")))},SvgButton.prototype.setTooltip=function(t){this.svgElement.getElementsByTagName("title")[0].textContent=t},Object.defineProperties(Animation.prototype,{container:{get:function(){return this._container}},viewModel:{get:function(){return this._viewModel}}}),Animation.prototype.isDestroyed=function(){return!1},Animation.prototype.destroy=function(){defined(this._observer)&&(this._observer.disconnect(),this._observer=void 0);const t=this._container.ownerDocument,e=this._mouseCallback;this._shuttleRingBackPanel.removeEventListener("mousedown",e,!0),this._shuttleRingBackPanel.removeEventListener("touchstart",e,!0),this._shuttleRingSwooshG.removeEventListener("mousedown",e,!0),this._shuttleRingSwooshG.removeEventListener("touchstart",e,!0),t.removeEventListener("mousemove",e,!0),t.removeEventListener("touchmove",e,!0),t.removeEventListener("mouseup",e,!0),t.removeEventListener("touchend",e,!0),t.removeEventListener("touchcancel",e,!0),this._shuttleRingPointer.removeEventListener("mousedown",e,!0),this._shuttleRingPointer.removeEventListener("touchstart",e,!0),this._knobOuter.removeEventListener("mousedown",e,!0),this._knobOuter.removeEventListener("touchstart",e,!0),this._container.removeChild(this._svgNode),this._container.removeChild(this._theme),this._realtimeSVG.destroy(),this._playReverseSVG.destroy(),this._playForwardSVG.destroy(),this._pauseSVG.destroy();const o=this._subscriptions;for(let t=0,e=o.length;t<e;t++)o[t].dispose();return destroyObject(this)},Animation.prototype.resize=function(){const t=this._container.clientWidth,e=this._container.clientHeight;if(t===this._lastWidth&&e===this._lastHeight)return;const o=this._svgNode,n=200,i=132;let s=t,a=e;0===t&&0===e?(s=n,a=i):0===t?(a=e,s=n*(e/i)):0===e&&(s=t,a=i*(t/n));const r=s/n,l=a/i;o.style.cssText=`width: ${s}px; height: ${a}px; position: absolute; bottom: 0; left: 0; overflow: hidden;`,o.setAttribute("width",s),o.setAttribute("height",a),o.setAttribute("viewBox",`0 0 ${s} ${a}`),this._topG.setAttribute("transform",`scale(${r},${l})`),this._centerX=Math.max(1,100*r),this._centerY=Math.max(1,100*l),this._lastHeight=t,this._lastWidth=e},Animation.prototype.applyThemeChanges=function(){const t=this._container.ownerDocument;if(!t.body.contains(this._container)){if(defined(this._observer))return;const e=this;return e._observer=new MutationObserver((function(){t.body.contains(e._container)&&(e._observer.disconnect(),e._observer=void 0,e.applyThemeChanges())})),void e._observer.observe(t,{childList:!0,subtree:!0})}const e=getElementColor(this._themeNormal),o=getElementColor(this._themeHover),n=getElementColor(this._themeSelect),i=getElementColor(this._themeDisabled),s=getElementColor(this._themeKnob),a=getElementColor(this._themePointer),r=getElementColor(this._themeSwoosh),l=getElementColor(this._themeSwooshHover),c=svgFromObject({tagName:"defs",children:[{id:"animation_buttonNormal",tagName:"linearGradient",x1:"50%",y1:"0%",x2:"50%",y2:"100%",children:[{tagName:"stop",offset:"0%","stop-color":makeColorString(e,gradientEnabledColor0)},{tagName:"stop",offset:"12%","stop-color":makeColorString(e,gradientEnabledColor1)},{tagName:"stop",offset:"46%","stop-color":makeColorString(e,gradientEnabledColor2)},{tagName:"stop",offset:"81%","stop-color":makeColorString(e,gradientEnabledColor3)}]},{id:"animation_buttonHovered",tagName:"linearGradient",x1:"50%",y1:"0%",x2:"50%",y2:"100%",children:[{tagName:"stop",offset:"0%","stop-color":makeColorString(o,gradientEnabledColor0)},{tagName:"stop",offset:"12%","stop-color":makeColorString(o,gradientEnabledColor1)},{tagName:"stop",offset:"46%","stop-color":makeColorString(o,gradientEnabledColor2)},{tagName:"stop",offset:"81%","stop-color":makeColorString(o,gradientEnabledColor3)}]},{id:"animation_buttonToggled",tagName:"linearGradient",x1:"50%",y1:"0%",x2:"50%",y2:"100%",children:[{tagName:"stop",offset:"0%","stop-color":makeColorString(n,gradientEnabledColor0)},{tagName:"stop",offset:"12%","stop-color":makeColorString(n,gradientEnabledColor1)},{tagName:"stop",offset:"46%","stop-color":makeColorString(n,gradientEnabledColor2)},{tagName:"stop",offset:"81%","stop-color":makeColorString(n,gradientEnabledColor3)}]},{id:"animation_buttonDisabled",tagName:"linearGradient",x1:"50%",y1:"0%",x2:"50%",y2:"100%",children:[{tagName:"stop",offset:"0%","stop-color":makeColorString(i,gradientDisabledColor0)},{tagName:"stop",offset:"75%","stop-color":makeColorString(i,gradientDisabledColor1)}]},{id:"animation_blurred",tagName:"filter",width:"200%",height:"200%",x:"-50%",y:"-50%",children:[{tagName:"feGaussianBlur",stdDeviation:4,in:"SourceGraphic"}]},{id:"animation_shuttleRingSwooshGradient",tagName:"linearGradient",x1:"50%",y1:"0%",x2:"50%",y2:"100%",children:[{tagName:"stop",offset:"0%","stop-opacity":.2,"stop-color":r.toCssColorString()},{tagName:"stop",offset:"85%","stop-opacity":.85,"stop-color":r.toCssColorString()},{tagName:"stop",offset:"95%","stop-opacity":.05,"stop-color":r.toCssColorString()}]},{id:"animation_shuttleRingSwooshHovered",tagName:"linearGradient",x1:"50%",y1:"0%",x2:"50%",y2:"100%",children:[{tagName:"stop",offset:"0%","stop-opacity":.2,"stop-color":l.toCssColorString()},{tagName:"stop",offset:"85%","stop-opacity":.85,"stop-color":l.toCssColorString()},{tagName:"stop",offset:"95%","stop-opacity":.05,"stop-color":l.toCssColorString()}]},{id:"animation_shuttleRingPointerGradient",tagName:"linearGradient",x1:"0%",y1:"50%",x2:"100%",y2:"50%",children:[{tagName:"stop",offset:"0%","stop-color":a.toCssColorString()},{tagName:"stop",offset:"40%","stop-color":a.toCssColorString()},{tagName:"stop",offset:"60%","stop-color":makeColorString(a,gradientPointerColor)},{tagName:"stop",offset:"100%","stop-color":makeColorString(a,gradientPointerColor)}]},{id:"animation_shuttleRingPointerPaused",tagName:"linearGradient",x1:"0%",y1:"50%",x2:"100%",y2:"50%",children:[{tagName:"stop",offset:"0%","stop-color":"#CCC"},{tagName:"stop",offset:"40%","stop-color":"#CCC"},{tagName:"stop",offset:"60%","stop-color":"#555"},{tagName:"stop",offset:"100%","stop-color":"#555"}]},{id:"animation_knobOuter",tagName:"linearGradient",x1:"20%",y1:"0%",x2:"90%",y2:"100%",children:[{tagName:"stop",offset:"5%","stop-color":makeColorString(s,gradientEnabledColor0)},{tagName:"stop",offset:"60%","stop-color":makeColorString(s,gradientKnobColor)},{tagName:"stop",offset:"85%","stop-color":makeColorString(s,gradientEnabledColor1)}]},{id:"animation_knobInner",tagName:"linearGradient",x1:"20%",y1:"0%",x2:"90%",y2:"100%",children:[{tagName:"stop",offset:"5%","stop-color":makeColorString(s,gradientKnobColor)},{tagName:"stop",offset:"60%","stop-color":makeColorString(s,gradientEnabledColor0)},{tagName:"stop",offset:"85%","stop-color":makeColorString(s,gradientEnabledColor3)}]}]});defined(this._defsElement)?this._svgNode.replaceChild(c,this._defsElement):this._svgNode.appendChild(c),this._defsElement=c};export default Animation;