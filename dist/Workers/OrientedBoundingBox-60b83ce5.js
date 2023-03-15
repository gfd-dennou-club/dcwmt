/*! For license information please see OrientedBoundingBox-60b83ce5.js.LICENSE.txt */
define(["exports","./Transforms-0c3fa360","./Matrix2-276d97d2","./defaultValue-a6eb9f34","./EllipsoidTangentPlane-30c83574","./ComponentDatatype-7f6d9570","./Plane-17fe9d66"],(function(a,t,e,n,r,i,s){"use strict";function o(a,t){this.center=e.Cartesian3.clone(n.defaultValue(a,e.Cartesian3.ZERO)),this.halfAxes=e.Matrix3.clone(n.defaultValue(t,e.Matrix3.ZERO))}o.packedLength=e.Cartesian3.packedLength+e.Matrix3.packedLength,o.pack=function(a,t,r){return r=n.defaultValue(r,0),e.Cartesian3.pack(a.center,t,r),e.Matrix3.pack(a.halfAxes,t,r+e.Cartesian3.packedLength),t},o.unpack=function(a,t,r){return t=n.defaultValue(t,0),n.defined(r)||(r=new o),e.Cartesian3.unpack(a,t,r.center),e.Matrix3.unpack(a,t+e.Cartesian3.packedLength,r.halfAxes),r};const c=new e.Cartesian3,C=new e.Cartesian3,u=new e.Cartesian3,l=new e.Cartesian3,d=new e.Cartesian3,h=new e.Cartesian3,x=new e.Matrix3,m={unitary:new e.Matrix3,diagonal:new e.Matrix3};o.fromPoints=function(a,t){if(n.defined(t)||(t=new o),!n.defined(a)||0===a.length)return t.halfAxes=e.Matrix3.ZERO,t.center=e.Cartesian3.ZERO,t;let r;const i=a.length,s=e.Cartesian3.clone(a[0],c);for(r=1;r<i;r++)e.Cartesian3.add(s,a[r],s);const f=1/i;e.Cartesian3.multiplyByScalar(s,f,s);let M,p=0,w=0,g=0,y=0,b=0,N=0;for(r=0;r<i;r++)M=e.Cartesian3.subtract(a[r],s,C),p+=M.x*M.x,w+=M.x*M.y,g+=M.x*M.z,y+=M.y*M.y,b+=M.y*M.z,N+=M.z*M.z;p*=f,w*=f,g*=f,y*=f,b*=f,N*=f;const T=x;T[0]=p,T[1]=w,T[2]=g,T[3]=w,T[4]=y,T[5]=b,T[6]=g,T[7]=b,T[8]=N;const O=e.Matrix3.computeEigenDecomposition(T,m),A=e.Matrix3.clone(O.unitary,t.halfAxes);let P=e.Matrix3.getColumn(A,0,l),I=e.Matrix3.getColumn(A,1,d),R=e.Matrix3.getColumn(A,2,h),E=-Number.MAX_VALUE,S=-Number.MAX_VALUE,U=-Number.MAX_VALUE,L=Number.MAX_VALUE,z=Number.MAX_VALUE,B=Number.MAX_VALUE;for(r=0;r<i;r++)M=a[r],E=Math.max(e.Cartesian3.dot(P,M),E),S=Math.max(e.Cartesian3.dot(I,M),S),U=Math.max(e.Cartesian3.dot(R,M),U),L=Math.min(e.Cartesian3.dot(P,M),L),z=Math.min(e.Cartesian3.dot(I,M),z),B=Math.min(e.Cartesian3.dot(R,M),B);P=e.Cartesian3.multiplyByScalar(P,.5*(L+E),P),I=e.Cartesian3.multiplyByScalar(I,.5*(z+S),I),R=e.Cartesian3.multiplyByScalar(R,.5*(B+U),R);const V=e.Cartesian3.add(P,I,t.center);e.Cartesian3.add(V,R,V);const _=u;return _.x=E-L,_.y=S-z,_.z=U-B,e.Cartesian3.multiplyByScalar(_,.5,_),e.Matrix3.multiplyByScale(t.halfAxes,_,t.halfAxes),t};const f=new e.Cartesian3,M=new e.Cartesian3;function p(a,t,r,i,s,c,C,u,l,d,h){n.defined(h)||(h=new o);const x=h.halfAxes;e.Matrix3.setColumn(x,0,t,x),e.Matrix3.setColumn(x,1,r,x),e.Matrix3.setColumn(x,2,i,x);let m=f;m.x=(s+c)/2,m.y=(C+u)/2,m.z=(l+d)/2;const p=M;p.x=(c-s)/2,p.y=(u-C)/2,p.z=(d-l)/2;const w=h.center;return m=e.Matrix3.multiplyByVector(x,m,m),e.Cartesian3.add(a,m,w),e.Matrix3.multiplyByScale(x,p,x),h}const w=new e.Cartographic,g=new e.Cartesian3,y=new e.Cartographic,b=new e.Cartographic,N=new e.Cartographic,T=new e.Cartographic,O=new e.Cartographic,A=new e.Cartesian3,P=new e.Cartesian3,I=new e.Cartesian3,R=new e.Cartesian3,E=new e.Cartesian3,S=new e.Cartesian2,U=new e.Cartesian2,L=new e.Cartesian2,z=new e.Cartesian2,B=new e.Cartesian2,V=new e.Cartesian3,_=new e.Cartesian3,k=new e.Cartesian3,W=new e.Cartesian3,D=new e.Cartesian2,X=new e.Cartesian3,q=new e.Cartesian3,j=new e.Cartesian3,Z=new s.Plane(e.Cartesian3.UNIT_X,0);o.fromRectangle=function(a,t,o,c,C){let u,l,d,h,x,m,f;if(t=n.defaultValue(t,0),o=n.defaultValue(o,0),c=n.defaultValue(c,e.Ellipsoid.WGS84),a.width<=i.CesiumMath.PI){const n=e.Rectangle.center(a,w),i=c.cartographicToCartesian(n,g),M=new r.EllipsoidTangentPlane(i,c);f=M.plane;const V=n.longitude,_=a.south<0&&a.north>0?0:n.latitude,k=e.Cartographic.fromRadians(V,a.north,o,y),W=e.Cartographic.fromRadians(a.west,a.north,o,b),D=e.Cartographic.fromRadians(a.west,_,o,N),X=e.Cartographic.fromRadians(a.west,a.south,o,T),q=e.Cartographic.fromRadians(V,a.south,o,O),j=c.cartographicToCartesian(k,A);let Z=c.cartographicToCartesian(W,P);const v=c.cartographicToCartesian(D,I);let Y=c.cartographicToCartesian(X,R);const G=c.cartographicToCartesian(q,E),F=M.projectPointToNearestOnPlane(j,S),H=M.projectPointToNearestOnPlane(Z,U),J=M.projectPointToNearestOnPlane(v,L),K=M.projectPointToNearestOnPlane(Y,z),Q=M.projectPointToNearestOnPlane(G,B);return u=Math.min(H.x,J.x,K.x),l=-u,h=Math.max(H.y,F.y),d=Math.min(K.y,Q.y),W.height=X.height=t,Z=c.cartographicToCartesian(W,P),Y=c.cartographicToCartesian(X,R),x=Math.min(s.Plane.getPointDistance(f,Z),s.Plane.getPointDistance(f,Y)),m=o,p(M.origin,M.xAxis,M.yAxis,M.zAxis,u,l,d,h,x,m,C)}const M=a.south>0,v=a.north<0,Y=M?a.south:v?a.north:0,G=e.Rectangle.center(a,w).longitude,F=e.Cartesian3.fromRadians(G,Y,o,c,V);F.z=0;const H=Math.abs(F.x)<i.CesiumMath.EPSILON10&&Math.abs(F.y)<i.CesiumMath.EPSILON10?e.Cartesian3.UNIT_X:e.Cartesian3.normalize(F,_),J=e.Cartesian3.UNIT_Z,K=e.Cartesian3.cross(H,J,k);f=s.Plane.fromPointNormal(F,H,Z);const Q=e.Cartesian3.fromRadians(G+i.CesiumMath.PI_OVER_TWO,Y,o,c,W);l=e.Cartesian3.dot(s.Plane.projectPointOntoPlane(f,Q,D),K),u=-l,h=e.Cartesian3.fromRadians(0,a.north,v?t:o,c,X).z,d=e.Cartesian3.fromRadians(0,a.south,M?t:o,c,q).z;const $=e.Cartesian3.fromRadians(a.east,Y,o,c,j);return x=s.Plane.getPointDistance(f,$),m=0,p(F,K,J,H,u,l,d,h,x,m,C)},o.fromTransformation=function(a,t){return n.defined(t)||(t=new o),t.center=e.Matrix4.getTranslation(a,t.center),t.halfAxes=e.Matrix4.getMatrix3(a,t.halfAxes),t.halfAxes=e.Matrix3.multiplyByScalar(t.halfAxes,.5,t.halfAxes),t},o.clone=function(a,t){if(n.defined(a))return n.defined(t)?(e.Cartesian3.clone(a.center,t.center),e.Matrix3.clone(a.halfAxes,t.halfAxes),t):new o(a.center,a.halfAxes)},o.intersectPlane=function(a,n){const r=a.center,i=n.normal,s=a.halfAxes,o=i.x,c=i.y,C=i.z,u=Math.abs(o*s[e.Matrix3.COLUMN0ROW0]+c*s[e.Matrix3.COLUMN0ROW1]+C*s[e.Matrix3.COLUMN0ROW2])+Math.abs(o*s[e.Matrix3.COLUMN1ROW0]+c*s[e.Matrix3.COLUMN1ROW1]+C*s[e.Matrix3.COLUMN1ROW2])+Math.abs(o*s[e.Matrix3.COLUMN2ROW0]+c*s[e.Matrix3.COLUMN2ROW1]+C*s[e.Matrix3.COLUMN2ROW2]),l=e.Cartesian3.dot(i,r)+n.distance;return l<=-u?t.Intersect.OUTSIDE:l>=u?t.Intersect.INSIDE:t.Intersect.INTERSECTING};const v=new e.Cartesian3,Y=new e.Cartesian3,G=new e.Cartesian3,F=new e.Cartesian3,H=new e.Cartesian3,J=new e.Cartesian3;o.distanceSquaredTo=function(a,t){const n=e.Cartesian3.subtract(t,a.center,f),r=a.halfAxes;let s=e.Matrix3.getColumn(r,0,v),o=e.Matrix3.getColumn(r,1,Y),c=e.Matrix3.getColumn(r,2,G);const C=e.Cartesian3.magnitude(s),u=e.Cartesian3.magnitude(o),l=e.Cartesian3.magnitude(c);let d=!0,h=!0,x=!0;C>0?e.Cartesian3.divideByScalar(s,C,s):d=!1,u>0?e.Cartesian3.divideByScalar(o,u,o):h=!1,l>0?e.Cartesian3.divideByScalar(c,l,c):x=!1;const m=!d+!h+!x;let M,p,w;if(1===m){let a=s;M=o,p=c,h?x||(a=c,p=s):(a=o,M=s),w=e.Cartesian3.cross(M,p,H),a===s?s=w:a===o?o=w:a===c&&(c=w)}else if(2===m){M=s,h?M=o:x&&(M=c);let a=e.Cartesian3.UNIT_Y;a.equalsEpsilon(M,i.CesiumMath.EPSILON3)&&(a=e.Cartesian3.UNIT_X),p=e.Cartesian3.cross(M,a,F),e.Cartesian3.normalize(p,p),w=e.Cartesian3.cross(M,p,H),e.Cartesian3.normalize(w,w),M===s?(o=p,c=w):M===o?(c=p,s=w):M===c&&(s=p,o=w)}else 3===m&&(s=e.Cartesian3.UNIT_X,o=e.Cartesian3.UNIT_Y,c=e.Cartesian3.UNIT_Z);const g=J;g.x=e.Cartesian3.dot(n,s),g.y=e.Cartesian3.dot(n,o),g.z=e.Cartesian3.dot(n,c);let y,b=0;return g.x<-C?(y=g.x+C,b+=y*y):g.x>C&&(y=g.x-C,b+=y*y),g.y<-u?(y=g.y+u,b+=y*y):g.y>u&&(y=g.y-u,b+=y*y),g.z<-l?(y=g.z+l,b+=y*y):g.z>l&&(y=g.z-l,b+=y*y),b};const K=new e.Cartesian3,Q=new e.Cartesian3;o.computePlaneDistances=function(a,r,i,s){n.defined(s)||(s=new t.Interval);let o=Number.POSITIVE_INFINITY,c=Number.NEGATIVE_INFINITY;const C=a.center,u=a.halfAxes,l=e.Matrix3.getColumn(u,0,v),d=e.Matrix3.getColumn(u,1,Y),h=e.Matrix3.getColumn(u,2,G),x=e.Cartesian3.add(l,d,K);e.Cartesian3.add(x,h,x),e.Cartesian3.add(x,C,x);const m=e.Cartesian3.subtract(x,r,Q);let f=e.Cartesian3.dot(i,m);return o=Math.min(f,o),c=Math.max(f,c),e.Cartesian3.add(C,l,x),e.Cartesian3.add(x,d,x),e.Cartesian3.subtract(x,h,x),e.Cartesian3.subtract(x,r,m),f=e.Cartesian3.dot(i,m),o=Math.min(f,o),c=Math.max(f,c),e.Cartesian3.add(C,l,x),e.Cartesian3.subtract(x,d,x),e.Cartesian3.add(x,h,x),e.Cartesian3.subtract(x,r,m),f=e.Cartesian3.dot(i,m),o=Math.min(f,o),c=Math.max(f,c),e.Cartesian3.add(C,l,x),e.Cartesian3.subtract(x,d,x),e.Cartesian3.subtract(x,h,x),e.Cartesian3.subtract(x,r,m),f=e.Cartesian3.dot(i,m),o=Math.min(f,o),c=Math.max(f,c),e.Cartesian3.subtract(C,l,x),e.Cartesian3.add(x,d,x),e.Cartesian3.add(x,h,x),e.Cartesian3.subtract(x,r,m),f=e.Cartesian3.dot(i,m),o=Math.min(f,o),c=Math.max(f,c),e.Cartesian3.subtract(C,l,x),e.Cartesian3.add(x,d,x),e.Cartesian3.subtract(x,h,x),e.Cartesian3.subtract(x,r,m),f=e.Cartesian3.dot(i,m),o=Math.min(f,o),c=Math.max(f,c),e.Cartesian3.subtract(C,l,x),e.Cartesian3.subtract(x,d,x),e.Cartesian3.add(x,h,x),e.Cartesian3.subtract(x,r,m),f=e.Cartesian3.dot(i,m),o=Math.min(f,o),c=Math.max(f,c),e.Cartesian3.subtract(C,l,x),e.Cartesian3.subtract(x,d,x),e.Cartesian3.subtract(x,h,x),e.Cartesian3.subtract(x,r,m),f=e.Cartesian3.dot(i,m),o=Math.min(f,o),c=Math.max(f,c),s.start=o,s.stop=c,s};const $=new e.Cartesian3,aa=new e.Cartesian3,ta=new e.Cartesian3;o.computeCorners=function(a,t){n.defined(t)||(t=[new e.Cartesian3,new e.Cartesian3,new e.Cartesian3,new e.Cartesian3,new e.Cartesian3,new e.Cartesian3,new e.Cartesian3,new e.Cartesian3]);const r=a.center,i=a.halfAxes,s=e.Matrix3.getColumn(i,0,$),o=e.Matrix3.getColumn(i,1,aa),c=e.Matrix3.getColumn(i,2,ta);return e.Cartesian3.clone(r,t[0]),e.Cartesian3.subtract(t[0],s,t[0]),e.Cartesian3.subtract(t[0],o,t[0]),e.Cartesian3.subtract(t[0],c,t[0]),e.Cartesian3.clone(r,t[1]),e.Cartesian3.subtract(t[1],s,t[1]),e.Cartesian3.subtract(t[1],o,t[1]),e.Cartesian3.add(t[1],c,t[1]),e.Cartesian3.clone(r,t[2]),e.Cartesian3.subtract(t[2],s,t[2]),e.Cartesian3.add(t[2],o,t[2]),e.Cartesian3.subtract(t[2],c,t[2]),e.Cartesian3.clone(r,t[3]),e.Cartesian3.subtract(t[3],s,t[3]),e.Cartesian3.add(t[3],o,t[3]),e.Cartesian3.add(t[3],c,t[3]),e.Cartesian3.clone(r,t[4]),e.Cartesian3.add(t[4],s,t[4]),e.Cartesian3.subtract(t[4],o,t[4]),e.Cartesian3.subtract(t[4],c,t[4]),e.Cartesian3.clone(r,t[5]),e.Cartesian3.add(t[5],s,t[5]),e.Cartesian3.subtract(t[5],o,t[5]),e.Cartesian3.add(t[5],c,t[5]),e.Cartesian3.clone(r,t[6]),e.Cartesian3.add(t[6],s,t[6]),e.Cartesian3.add(t[6],o,t[6]),e.Cartesian3.subtract(t[6],c,t[6]),e.Cartesian3.clone(r,t[7]),e.Cartesian3.add(t[7],s,t[7]),e.Cartesian3.add(t[7],o,t[7]),e.Cartesian3.add(t[7],c,t[7]),t};const ea=new e.Matrix3;o.computeTransformation=function(a,t){n.defined(t)||(t=new e.Matrix4);const r=a.center,i=e.Matrix3.multiplyByUniformScale(a.halfAxes,2,ea);return e.Matrix4.fromRotationTranslation(i,r,t)};const na=new t.BoundingSphere;o.isOccluded=function(a,e){const n=t.BoundingSphere.fromOrientedBoundingBox(a,na);return!e.isBoundingSphereVisible(n)},o.prototype.intersectPlane=function(a){return o.intersectPlane(this,a)},o.prototype.distanceSquaredTo=function(a){return o.distanceSquaredTo(this,a)},o.prototype.computePlaneDistances=function(a,t,e){return o.computePlaneDistances(this,a,t,e)},o.prototype.computeCorners=function(a){return o.computeCorners(this,a)},o.prototype.computeTransformation=function(a){return o.computeTransformation(this,a)},o.prototype.isOccluded=function(a){return o.isOccluded(this,a)},o.equals=function(a,t){return a===t||n.defined(a)&&n.defined(t)&&e.Cartesian3.equals(a.center,t.center)&&e.Matrix3.equals(a.halfAxes,t.halfAxes)},o.prototype.clone=function(a){return o.clone(this,a)},o.prototype.equals=function(a){return o.equals(this,a)},a.OrientedBoundingBox=o}));