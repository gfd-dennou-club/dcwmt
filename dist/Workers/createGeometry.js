/*! For license information please see createGeometry.js.LICENSE.txt */
define(["./defaultValue-a6eb9f34","./PrimitivePipeline-8eee2efd","./createTaskProcessorWorker","./Transforms-0c3fa360","./Matrix2-276d97d2","./ComponentDatatype-7f6d9570","./WebGLConstants-d81b330d","./RuntimeError-07496d94","./_commonjsHelpers-89c9b271","./combine-7cf28d88","./GeometryAttribute-54019f82","./GeometryAttributes-aff51037","./GeometryPipeline-f46d7519","./AttributeCompression-28a6d524","./EncodedCartesian3-32c625e4","./IndexDatatype-856d3a0c","./IntersectionTests-fbcff83c","./Plane-17fe9d66","./WebMercatorProjection-412ca883"],(function(e,t,r,n,o,i,s,c,f,a,d,u,m,l,b,p,y,P,k){"use strict";const C={};function G(t){let r=C[t];return e.defined(r)||("object"==typeof exports?C[r]=r=require(`Workers/${t}`):require([`Workers/${t}`],(function(e){r=e,C[r]=e}))),r}return r((function(r,n){const o=r.subTasks,i=o.length,s=new Array(i);for(let t=0;t<i;t++){const r=o[t],n=r.geometry,i=r.moduleName;if(e.defined(i)){const e=G(i);s[t]=e(n,r.offset)}else s[t]=n}return Promise.all(s).then((function(e){return t.PrimitivePipeline.packCreateGeometryResults(e,n)}))}))}));