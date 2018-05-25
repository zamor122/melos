var User=function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},r.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=11)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,o,i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=(n=c(regeneratorRuntime.mark(function e(t){var r,n,o,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=void 0,n=void 0,e.prev=1,e.next=4,fetch(d+"/oauth/token",{headers:b,method:h,body:JSON.stringify(t)});case 4:return r=e.sent,e.next=7,r.json();case 7:if(v(n=e.sent)&&!m(n)){e.next=10;break}return e.abrupt("return",null);case 10:return o=(new Date).getTime()+1e3*n.expires_in,g(i=Object.assign({},n,{expiresAt:o})),e.abrupt("return",i);case 16:return e.prev=16,e.t0=e.catch(1),e.abrupt("return",null);case 19:case"end":return e.stop()}},e,this,[[1,16]])})),function(e){return n.apply(this,arguments)}),s=(o=c(regeneratorRuntime.mark(function e(t){var r,n,o,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=void 0,n=void 0,e.prev=1,e.next=4,fetch(d+"/oauth/refresh",{headers:b,method:h,body:JSON.stringify({refresh_token:t})});case 4:return r=e.sent,e.next=7,r.json();case 7:if(v(n=e.sent)&&!m(n)){e.next=10;break}return e.abrupt("return",null);case 10:return o=(new Date).getTime()+1e3*n.expires_in,g(i=Object.assign({},n,{expiresAt:o})),e.abrupt("return",i);case 16:return e.prev=16,e.t0=e.catch(1),e.abrupt("return",e.t0);case 19:case"end":return e.stop()}},e,this,[[1,16]])})),function(e){return o.apply(this,arguments)});function c(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){return function n(o,i){try{var a=t[o](i),u=a.value}catch(e){return void r(e)}if(!a.done)return Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)});e(u)}("next")})}}var f="undefined"!=typeof window&&window&&window.YV_API_HOST,l="undefined"!=typeof window&&window&&window.YV_API_PORT,d=("undefined"!=typeof window&&window&&window.location.protocol)+"//"+f+(l?":"+l:""),p="YouVersion:OAuth",y=3e5,h="POST",b={"Content-Type":"application/json"};function v(e){return null!==e&&"object"===(void 0===e?"undefined":a(e))&&"refresh_token"in e&&"expires_in"in e&&!Number.isNaN(e.expires_in)}function m(e){if("expiresAt"in e){var t=(new Date).getTime();return e.expiresAt-t<=y}return!1}function w(){var e=void 0;try{e=JSON.parse(localStorage.getItem(p))}catch(t){e=null}return e}function g(e){if(v(e)&&!m(e))try{return localStorage.setItem(p,JSON.stringify(e)),!0}catch(e){return!1}return!1}var x=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return i(e,null,[{key:"getToken",value:function(){var e=c(regeneratorRuntime.mark(function e(t){var r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!v(r=w())){e.next=7;break}if(!m(r)){e.next=6;break}return e.abrupt("return",s(r.refresh_token));case 6:return e.abrupt("return",r);case 7:return e.abrupt("return",u(t));case 8:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"deleteToken",value:function(){return localStorage.removeItem(p)}}]),e}();t.default=x},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){return!!window&&"undefined"!=typeof window}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){return(0,i.default)()?window.__ENV__||"development":"production"};var n,o=r(1),i=(n=o)&&n.__esModule?n:{default:n}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e=void 0;e="production"===(0,i.default)()?"youversionapi.com":"youversionapistaging.com";return{host:e,protocol:"https",port:443,getUrl:function(t){var r=t.endpoint,n=t.method,o=t.version,i=void 0===o?"3.1":o;return"https://"+r+"."+e+":443/"+i+"/"+n}}};var n,o=r(2),i=(n=o)&&n.__esModule?n:{default:n}},function(e,t,r){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=new RegExp("%[a-f0-9]{2}","gi"),i=new RegExp("(%[a-f0-9]{2})+","gi");function a(e,t){try{return decodeURIComponent(e.join(""))}catch(e){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],a(r),a(n))}function u(e){try{return decodeURIComponent(e)}catch(n){for(var t=e.match(o),r=1;r<t.length;r++)t=(e=a(t,r).join("")).match(o);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+(void 0===e?"undefined":n(e))+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},r=i.exec(e);r;){try{t[r[0]]=decodeURIComponent(r[0])}catch(e){var n=u(r[0]);n!==r[0]&&(t[r[0]]=n)}r=i.exec(e)}t["%C2"]="�";for(var o=Object.keys(t),a=0;a<o.length;a++){var s=o[a];e=e.replace(new RegExp(s,"g"),t[s])}return e}(e)}}},function(e,t,r){"use strict";e.exports=function(e){return encodeURIComponent(e).replace(/[!'()*]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}},function(e,t,r){"use strict";var n=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(n=(a=u.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){o=!0,i=e}finally{try{!n&&u.return&&u.return()}finally{if(o)throw i}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=r(5),a=r(4);function u(e,t){return t.encode?t.strict?i(e):encodeURIComponent(e):e}function s(e,t){return t.decode?a(e):e}function c(e){var t=e.indexOf("?");return-1===t?"":e.slice(t+1)}function f(e,t){var r=function(e){var t=void 0;switch(e.arrayFormat){case"index":return function(e,r,n){t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return function(e,r,n){t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};default:return function(e,t,r){void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t=Object.assign({decode:!0,arrayFormat:"none"},t)),i=Object.create(null);if("string"!=typeof e)return i;if(!(e=e.trim().replace(/^[?#&]/,"")))return i;var a=!0,u=!1,c=void 0;try{for(var f,l=e.split("&")[Symbol.iterator]();!(a=(f=l.next()).done);a=!0){var d=f.value.replace(/\+/g," ").split("="),p=n(d,2),y=p[0],h=p[1];h=void 0===h?null:s(h,t),r(s(y,t),h,i)}}catch(e){u=!0,c=e}finally{try{!a&&l.return&&l.return()}finally{if(u)throw c}}return Object.keys(i).sort().reduce(function(e,t){var r=i[t];return Boolean(r)&&"object"===(void 0===r?"undefined":o(r))&&!Array.isArray(r)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"===(void 0===t?"undefined":o(t))?e(Object.keys(t)).sort(function(e,t){return Number(e)-Number(t)}).map(function(e){return t[e]}):t}(r):e[t]=r,e},Object.create(null))}t.extract=c,t.parse=f,t.stringify=function(e,t){!1===(t=Object.assign({encode:!0,strict:!0,arrayFormat:"none"},t)).sort&&(t.sort=function(){});var r=function(e){switch(e.arrayFormat){case"index":return function(t,r,n){return null===r?[u(t,e),"[",n,"]"].join(""):[u(t,e),"[",u(n,e),"]=",u(r,e)].join("")};case"bracket":return function(t,r){return null===r?[u(t,e),"[]"].join(""):[u(t,e),"[]=",u(r,e)].join("")};default:return function(t,r){return null===r?u(t,e):[u(t,e),"=",u(r,e)].join("")}}}(t);return e?Object.keys(e).sort(t.sort).map(function(n){var o=e[n];if(void 0===o)return"";if(null===o)return u(n,t);if(Array.isArray(o)){var i=[],a=!0,s=!1,c=void 0;try{for(var f,l=o.slice()[Symbol.iterator]();!(a=(f=l.next()).done);a=!0){var d=f.value;void 0!==d&&i.push(r(n,d,i.length))}}catch(e){s=!0,c=e}finally{try{!a&&l.return&&l.return()}finally{if(s)throw c}}return i.join("&")}return u(n,t)+"="+u(o,t)}).filter(function(e){return e.length>0}).join("&"):""},t.parseUrl=function(e,t){return{url:e.split("?")[0]||"",query:f(c(e),t)}}},function(e,t,r){"use strict";e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,r){"use strict";(function(e){var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=function(e){function t(){this.fetch=!1}return t.prototype=e,new t}("undefined"!=typeof self?self:void 0);(function(e){!function(e){if(!e.fetch){var t={searchParams:"URLSearchParams"in e,iterable:"Symbol"in e&&"iterator"in Symbol,blob:"FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),formData:"FormData"in e,arrayBuffer:"ArrayBuffer"in e};if(t.arrayBuffer)var r=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],n=function(e){return e&&DataView.prototype.isPrototypeOf(e)},o=ArrayBuffer.isView||function(e){return e&&r.indexOf(Object.prototype.toString.call(e))>-1};f.prototype.append=function(e,t){e=u(e),t=s(t);var r=this.map[e];this.map[e]=r?r+","+t:t},f.prototype.delete=function(e){delete this.map[u(e)]},f.prototype.get=function(e){return e=u(e),this.has(e)?this.map[e]:null},f.prototype.has=function(e){return this.map.hasOwnProperty(u(e))},f.prototype.set=function(e,t){this.map[u(e)]=s(t)},f.prototype.forEach=function(e,t){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(t,this.map[r],r,this)},f.prototype.keys=function(){var e=[];return this.forEach(function(t,r){e.push(r)}),c(e)},f.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),c(e)},f.prototype.entries=function(){var e=[];return this.forEach(function(t,r){e.push([r,t])}),c(e)},t.iterable&&(f.prototype[Symbol.iterator]=f.prototype.entries);var i=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];b.prototype.clone=function(){return new b(this,{body:this._bodyInit})},h.call(b.prototype),h.call(m.prototype),m.prototype.clone=function(){return new m(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},m.error=function(){var e=new m(null,{status:0,statusText:""});return e.type="error",e};var a=[301,302,303,307,308];m.redirect=function(e,t){if(-1===a.indexOf(t))throw new RangeError("Invalid status code");return new m(null,{status:t,headers:{location:e}})},e.Headers=f,e.Request=b,e.Response=m,e.fetch=function(e,r){return new Promise(function(n,o){var i=new b(e,r),a=new XMLHttpRequest;a.onload=function(){var e,t,r={status:a.status,statusText:a.statusText,headers:(e=a.getAllResponseHeaders()||"",t=new f,e.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(e){var r=e.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();t.append(n,o)}}),t)};r.url="responseURL"in a?a.responseURL:r.headers.get("X-Request-URL");var o="response"in a?a.response:a.responseText;n(new m(o,r))},a.onerror=function(){o(new TypeError("Network request failed"))},a.ontimeout=function(){o(new TypeError("Network request failed"))},a.open(i.method,i.url,!0),"include"===i.credentials?a.withCredentials=!0:"omit"===i.credentials&&(a.withCredentials=!1),"responseType"in a&&t.blob&&(a.responseType="blob"),i.headers.forEach(function(e,t){a.setRequestHeader(t,e)}),a.send(void 0===i._bodyInit?null:i._bodyInit)})},e.fetch.polyfill=!0}function u(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function s(e){return"string"!=typeof e&&(e=String(e)),e}function c(e){var r={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return t.iterable&&(r[Symbol.iterator]=function(){return r}),r}function f(e){this.map={},e instanceof f?e.forEach(function(e,t){this.append(t,e)},this):Array.isArray(e)?e.forEach(function(e){this.append(e[0],e[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function l(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function d(e){return new Promise(function(t,r){e.onload=function(){t(e.result)},e.onerror=function(){r(e.error)}})}function p(e){var t=new FileReader,r=d(t);return t.readAsArrayBuffer(e),r}function y(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function h(){return this.bodyUsed=!1,this._initBody=function(e){if(this._bodyInit=e,e)if("string"==typeof e)this._bodyText=e;else if(t.blob&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(t.formData&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else if(t.arrayBuffer&&t.blob&&n(e))this._bodyArrayBuffer=y(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!t.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(e)&&!o(e))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=y(e)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},t.blob&&(this.blob=function(){var e=l(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?l(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(p)}),this.text=function(){var e,t,r,n=l(this);if(n)return n;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,r=d(t),t.readAsText(e),r;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),r=new Array(t.length),n=0;n<t.length;n++)r[n]=String.fromCharCode(t[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},t.formData&&(this.formData=function(){return this.text().then(v)}),this.json=function(){return this.text().then(JSON.parse)},this}function b(e,t){var r,n,o=(t=t||{}).body;if(e instanceof b){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new f(e.headers)),this.method=e.method,this.mode=e.mode,o||null==e._bodyInit||(o=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"omit",!t.headers&&this.headers||(this.headers=new f(t.headers)),this.method=(r=t.method||this.method||"GET",n=r.toUpperCase(),i.indexOf(n)>-1?n:r),this.mode=t.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function v(e){var t=new FormData;return e.trim().split("&").forEach(function(e){if(e){var r=e.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");t.append(decodeURIComponent(n),decodeURIComponent(o))}}),t}function m(e,t){t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new f(t.headers),this.url=t.url||"",this._initBody(e)}}(void 0!==e?e:this)}).call(r,void 0);var n=r.fetch;n.Response=r.Response,n.Request=r.Request,n.Headers=r.Headers;"object"===t(e)&&e.exports&&(e.exports=n)}).call(this,r(7)(e))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,o=(n=f(regeneratorRuntime.mark(function e(t,r){var n,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n={},!r){e.next=7;break}return e.next=4,s.default.getToken();case 4:(o=e.sent)&&"access_token"in o||console.error("OAuth token could not be found or refreshed."),n.Authorization="Bearer "+o.access_token;case 7:return e.abrupt("return",Object.assign({},{"X-YouVersion-App-Version":"3","X-YouVersion-Client":"youversion","X-YouVersion-App-Platform":"web"},t,n));case 8:case"end":return e.stop()}},e,this)})),function(e,t){return n.apply(this,arguments)}),i=c(r(8)),a=c(r(6)),u=c(r(3)),s=c(r(0));function c(e){return e&&e.__esModule?e:{default:e}}function f(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){return function n(o,i){try{var a=t[o](i),u=a.value}catch(e){return void r(e)}if(!a.done)return Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)});e(u)}("next")})}}var l=(0,u.default)();function d(e){var t=e.endpoint,r=e.method,n=e.version;return l.getUrl({endpoint:t,method:r,version:n})}function p(e){return a.default.stringify(e)}t.default=function(){var e=f(regeneratorRuntime.mark(function e(t){var r,n,a,u,s,c=t.endpoint,f=t.method,l=t.params,y=t.version,h=void 0===y?"4.0":y,b=t.additionalHeaders,v=void 0===b?{}:b,m=t.auth,w=void 0!==m&&m,g=t.parseJson,x=void 0===g||g;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=d({endpoint:c,method:f,version:h}),n=p(l),e.next=4,o(v,w);case 4:return a=e.sent,console.log("Headers",a),u=void 0,s=void 0,e.prev=7,e.next=10,(0,i.default)(r+"?"+n,{headers:a});case 10:u=e.sent,e.next=16;break;case 13:return e.prev=13,e.t0=e.catch(7),e.abrupt("return",e.t0);case 16:if(!x){e.next=29;break}return e.prev=17,e.next=20,u.json();case 20:return s=e.sent,e.abrupt("return",s.response.data);case 24:return e.prev=24,e.t1=e.catch(17),e.abrupt("return",e.t1);case 27:e.next=30;break;case 29:return e.abrupt("return",u);case 30:case"end":return e.stop()}},e,this,[[7,13],[17,24]])}));return function(t){return e.apply(this,arguments)}}()},function(e,t,r){"use strict";var n,o,i;"function"==typeof Symbol&&Symbol.iterator;o=[],void 0===(i="function"==typeof(n=function(){return function e(t,r,n){var o,i,a=window,u="application/octet-stream",s=n||u,c=t,f=!r&&!n&&c,l=document.createElement("a"),d=function(e){return String(e)},p=a.Blob||a.MozBlob||a.WebKitBlob||d,y=r||"download";if(p=p.call?p.bind(a):Blob,"true"===String(this)&&(s=(c=[c,s])[0],c=c[1]),f&&f.length<2048&&(y=f.split("/").pop().split("?")[0],l.href=f,-1!==l.href.indexOf(f))){var h=new XMLHttpRequest;return h.open("GET",f,!0),h.responseType="blob",h.onload=function(t){e(t.target.response,y,u)},setTimeout(function(){h.send()},0),h}if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(c)){if(!(c.length>2096103.424&&p!==d))return navigator.msSaveBlob?navigator.msSaveBlob(w(c),y):g(c);c=w(c),s=c.type||u}else if(/([\x80-\xff])/.test(c)){for(var b=0,v=new Uint8Array(c.length),m=v.length;b<m;++b)v[b]=c.charCodeAt(b);c=new p([v],{type:s})}function w(e){for(var t=e.split(/[:;,]/),r=t[1],n="base64"==t[2]?atob:decodeURIComponent,o=n(t.pop()),i=o.length,a=0,u=new Uint8Array(i);a<i;++a)u[a]=o.charCodeAt(a);return new p([u],{type:r})}function g(e,t){if("download"in l)return l.href=e,l.setAttribute("download",y),l.className="download-js-link",l.innerHTML="downloading...",l.style.display="none",document.body.appendChild(l),setTimeout(function(){l.click(),document.body.removeChild(l),!0===t&&setTimeout(function(){a.URL.revokeObjectURL(l.href)},250)},66),!0;if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent))return/^data:/.test(e)&&(e="data:"+e.replace(/^data:([\w\/\-\+]+)/,u)),window.open(e)||confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=e),!0;var r=document.createElement("iframe");document.body.appendChild(r),!t&&/^data:/.test(e)&&(e="data:"+e.replace(/^data:([\w\/\-\+]+)/,u)),r.src=e,setTimeout(function(){document.body.removeChild(r)},333)}if(o=c instanceof p?c:new p([c],{type:s}),navigator.msSaveBlob)return navigator.msSaveBlob(o,y);if(a.URL)g(a.URL.createObjectURL(o),!0);else{if("string"==typeof o||o.constructor===d)try{return g("data:"+s+";base64,"+a.btoa(o))}catch(e){return g("data:"+s+","+encodeURIComponent(o))}(i=new FileReader).onload=function(e){g(this.result)},i.readAsDataURL(o)}return!0}})?n.apply(t,o):n)||(e.exports=i)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),o=a(r(10)),i=a(r(9));function a(e){return e&&e.__esModule?e:{default:e}}var u=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return n(e,null,[{key:"download",value:function(){var e,t=(e=regeneratorRuntime.mark(function e(){var t,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=void 0,r=void 0,e.prev=1,e.next=4,(0,i.default)({endpoint:"users-service",method:"download",parseJson:!1,auth:!0,additionalHeaders:{Accept:"application/zip application/octet-stream"}});case 4:t=e.sent,e.next=10;break;case 7:e.prev=7,e.t0=e.catch(1),console.error("Error dowloading User data.",e.t0);case 10:return e.prev=10,e.next=13,t.blob();case 13:r=e.sent,e.next=19;break;case 16:e.prev=16,e.t1=e.catch(10),console.error("Error parsing User data.",e.t1);case 19:(0,o.default)(r,"YouVersionUserData.zip","application/zip");case 20:case"end":return e.stop()}},e,this,[[1,7],[10,16]])}),function(){var t=e.apply(this,arguments);return new Promise(function(e,r){return function n(o,i){try{var a=t[o](i),u=a.value}catch(e){return void r(e)}if(!a.done)return Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)});e(u)}("next")})});return function(){return t.apply(this,arguments)}}()}]),e}();t.default=u}]).default;