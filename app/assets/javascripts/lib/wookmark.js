/*!
jQuery wookmark plugin
@name jquery.wookmark.js
@author Christoph Ono (chri@sto.ph or @gbks)
@author Sebastian Helzle (sebastian@helzle.net or @sebobo)
@version 1.4.4
@date 10/16/2013
@category jQuery plugin
@copyright (c) 2009-2013 Christoph Ono (www.wookmark.com)
@license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
(function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){var i,e,s;s=function(t,i){return function(){return t.apply(i,arguments)}},e={align:"center",autoResize:!1,comparator:null,container:t("body"),ignoreInactiveItems:!0,itemWidth:0,fillEmptySpace:!1,flexibleWidth:0,direction:void 0,offset:2,onLayoutChanged:void 0,outerOffset:0,resizeDelay:50,possibleFilters:[]},i=function(){function i(i,h){this.handler=i,this.columns=this.containerWidth=this.resizeTimer=null,this.activeItemCount=0,this.itemHeightsDirty=!0,this.placeholders=[],t.extend(!0,this,e,h),this.update=s(this.update,this),this.onResize=s(this.onResize,this),this.onRefresh=s(this.onRefresh,this),this.getItemWidth=s(this.getItemWidth,this),this.layout=s(this.layout,this),this.layoutFull=s(this.layoutFull,this),this.layoutColumns=s(this.layoutColumns,this),this.filter=s(this.filter,this),this.clear=s(this.clear,this),this.getActiveItems=s(this.getActiveItems,this),this.refreshPlaceholders=s(this.refreshPlaceholders,this),this.sortElements=s(this.sortElements,this);for(var o,n,r,a=0,l=0,f=0,u={};i.length>a;a++)if(n=i.eq(a),o=n.data("filterClass"),"object"==typeof o&&o.length>0)for(l=0;o.length>l;l++)r=t.trim(o[l]).toLowerCase(),r in u||(u[r]=[]),u[r].push(n[0]);for(var c=this.possibleFilters;c.length>f;f++){var d=t.trim(c[f]).toLowerCase();d in u||(u[d]=[])}this.filterClasses=u,this.autoResize&&t(window).bind("resize.wookmark",this.onResize),this.container.bind("refreshWookmark",this.onRefresh)}return i.prototype.update=function(i){this.itemHeightsDirty=!0,t.extend(!0,this,i)},i.prototype.onResize=function(){clearTimeout(this.resizeTimer),this.itemHeightsDirty=0!==this.flexibleWidth,this.resizeTimer=setTimeout(this.layout,this.resizeDelay)},i.prototype.onRefresh=function(){this.itemHeightsDirty=!0,this.layout()},i.prototype.filter=function(i,e){var s,h,o,n,r,a=[],l=t();if(i=i||[],e=e||"or",i.length){for(h=0;i.length>h;h++)r=t.trim(i[h].toLowerCase()),r in this.filterClasses&&a.push(this.filterClasses[r]);if(s=a.length,"or"==e||1==s)for(h=0;s>h;h++)l=l.add(a[h]);else if("and"==e){var f,u,c,d=a[0],m=!0;for(h=1;s>h;h++)a[h].length<d.length&&(d=a[h]);for(d=d||[],h=0;d.length>h;h++){for(u=d[h],m=!0,o=0;a.length>o&&m;o++)if(c=a[o],d!=c){for(n=0,f=!1;c.length>n&&!f;n++)f=c[n]==u;m&=f}m&&l.push(d[h])}}this.handler.not(l).addClass("inactive")}else l=this.handler;l.removeClass("inactive"),this.columns=null,this.layout()},i.prototype.refreshPlaceholders=function(i,e){for(var s,h,o,n,r,a,l=this.placeholders.length,f=this.columns.length,u=this.container.innerHeight();f>l;l++)s=t('<div class="wookmark-placeholder"/>').appendTo(this.container),this.placeholders.push(s);for(a=this.offset+2*parseInt(this.placeholders[0].css("borderWidth"),10),l=0;this.placeholders.length>l;l++)if(s=this.placeholders[l],o=this.columns[l],l>=f||!o[o.length-1])s.css("display","none");else{if(h=o[o.length-1],!h)continue;r=h.data("wookmark-top")+h.data("wookmark-height")+this.offset,n=u-r-a,s.css({position:"absolute",display:n>0?"block":"none",left:l*i+e,top:r,width:i-a,height:n})}},i.prototype.getActiveItems=function(){return this.ignoreInactiveItems?this.handler.not(".inactive"):this.handler},i.prototype.getItemWidth=function(){var t=this.itemWidth,i=this.container.width()-2*this.outerOffset,e=this.handler.eq(0),s=this.flexibleWidth;if(void 0===this.itemWidth||0===this.itemWidth&&!this.flexibleWidth?t=e.outerWidth():"string"==typeof this.itemWidth&&this.itemWidth.indexOf("%")>=0&&(t=parseFloat(this.itemWidth)/100*i),s){"string"==typeof s&&s.indexOf("%")>=0&&(s=parseFloat(s)/100*i);var h=~~(.5+(i+this.offset)/(s+this.offset)),o=Math.min(s,~~((i-(h-1)*this.offset)/h));t=Math.max(t,o),this.handler.css("width",t)}return t},i.prototype.layout=function(t){if(this.container.is(":visible")){var i,e=this.getItemWidth()+this.offset,s=this.container.width(),h=s-2*this.outerOffset,o=~~((h+this.offset)/e),n=0,r=0,a=0,l=this.getActiveItems(),f=l.length;if(this.itemHeightsDirty||!this.container.data("itemHeightsInitialized")){for(;f>a;a++)i=l.eq(a),i.data("wookmark-height",i.outerHeight());this.itemHeightsDirty=!1,this.container.data("itemHeightsInitialized",!0)}o=Math.max(1,Math.min(o,f)),n=this.outerOffset,"center"==this.align&&(n+=~~(.5+(h-(o*e-this.offset))>>1)),this.direction=this.direction||("right"==this.align?"right":"left"),r=t||null===this.columns||this.columns.length!=o||this.activeItemCount!=f?this.layoutFull(e,o,n):this.layoutColumns(e,n),this.activeItemCount=f,this.container.css("height",r),this.fillEmptySpace&&this.refreshPlaceholders(e,n),void 0!==this.onLayoutChanged&&"function"==typeof this.onLayoutChanged&&this.onLayoutChanged()}},i.prototype.sortElements=function(t){return"function"==typeof this.comparator?t.sort(this.comparator):t},i.prototype.layoutFull=function(i,e,s){var h,o,n=0,r=0,a=t.makeArray(this.getActiveItems()),l=a.length,f=null,u=null,c={position:"absolute"},d=[],m="left"==this.align?!0:!1;for(this.columns=[],a=this.sortElements(a);e>d.length;)d.push(this.outerOffset),this.columns.push([]);for(;l>n;n++){for(h=t(a[n]),f=d[0],u=0,r=0;e>r;r++)f>d[r]&&(f=d[r],u=r);o=s,(u>0||!m)&&(o+=u*i),c[this.direction]=o,c.top=f,h.css(c).data("wookmark-top",f),d[u]+=h.data("wookmark-height")+this.offset,this.columns[u].push(h)}return Math.max.apply(Math,d)},i.prototype.layoutColumns=function(t,i){for(var e,s,h,o,n,r=[],a=0,l=0;this.columns.length>a;a++){for(r.push(this.outerOffset),s=this.columns[a],n=a*t+i,e=r[a],l=0;s.length>l;l++)h=s[l],o={top:e},o[this.direction]=n,h.css(o).data("wookmark-top",e),e+=h.data("wookmark-height")+this.offset;r[a]=e}return Math.max.apply(Math,r)},i.prototype.clear=function(){clearTimeout(this.resizeTimer),t(window).unbind("resize.wookmark",this.onResize),this.container.unbind("refreshWookmark",this.onRefresh)},i}(),t.fn.wookmark=function(t){return this.wookmarkInstance?this.wookmarkInstance.update(t||{}):this.wookmarkInstance=new i(this,t||{}),this.wookmarkInstance.layout(!0),this.show()}});