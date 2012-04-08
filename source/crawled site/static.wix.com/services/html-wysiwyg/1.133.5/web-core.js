(function(){var a={};
var b=window.location.href;
var c=b.indexOf("#");
if(c>0){b=b.substr(0,c)
}b.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(d,e,f){a[e]=f
});
LOG.updateSetting("wixAppId",42);
LOG.updateSetting("metaSiteId",a.metaSiteId);
LOG.updateSetting("editorSessionId",a.editorSessionId);
client_version="web 1.133.5";
if(client_version=="web ${project.version}"){client_version="DBG"
}if(window.debugMode&&window.debugMode!=="nodebug"){document.title="(;,;) "+client_version
}$(document).addEvent("domready",function(){switch(window.viewMode){case"editor":LOG.reportEvent(wixEvents.EDITOR_DOM_LOADED);
break;
case"preview":LOG.reportEvent(wixEvents.PREVIEW_DOM_LOADED);
break;
case"site":LOG.reportEvent(wixEvents.SITE_DOM_LOADED);
break
}})
}());
W.BaseClasses.Anchor={name:"wysiwyg.viewer.managers.classdata.Anchor",Class:{ANCHOR_TOP_TOP:"TOP_TOP",ANCHOR_BOTTOM_TOP:"BOTTOM_TOP",ANCHOR_BOTTOM_BOTTOM:"BOTTOM_BOTTOM",ANCHOR_BOTTOM_PARENT:"BOTTOM_PARENT",ANCHOR_LOCK_BOTTOM:"LOCK_BOTTOM",type:"BOTTOM_TOP",distance:0,topToTop:0,locked:false,fromComp:null,toComp:null,originalValue:NaN}};
(function(){var c=W.BaseClasses.BaseComponentClassData.Class.initialize;
W.BaseComponent={ResizeSides:{TOP:"RESIZE_TOP",LEFT:"RESIZE_LEFT",BOTTOM:"RESIZE_BOTTOM",RIGHT:"RESIZE_RIGHT"},MoveDirections:{HORIZONTAL:"HORIZONTAL_MOVE",VERTICAL:"VERTICAL_MOVE"},AnchorLock:{NEVER:"never",BY_THRESHOLD:"threshold",ALWAYS:"always"}};
var a={initialize:function(f,e,d){this._onRender=this._onRender.bind(this);
this.initComponentLayout=this.initComponentLayout.bind(this);
this._anchors=[];
this._$x=this._$y=0;
this._$width=this._$height=100;
this._reverseAnchors=[];
this._actualHeight=-1;
this._autoSizeTimerIntervals=-1;
this.addEvent("render",this._onRender);
this.addEvent("autoSized",this._onAutoSized);
this.addEvent("autoSizedAnimation",this._onAutoSizedAnimation);
c.bind(this)(f,e,d);
this._wysiwygMode=true;
this._resizableSides=[W.BaseComponent.ResizeSides.TOP,W.BaseComponent.ResizeSides.LEFT,W.BaseComponent.ResizeSides.BOTTOM,W.BaseComponent.ResizeSides.RIGHT];
this._moveDirections=[W.BaseComponent.MoveDirections.HORIZONTAL,W.BaseComponent.MoveDirections.VERTICAL];
this._view.setStyle("visibility","hidden");
this.addEvent(Constants.ComponentEvents.READY_FOR_RENDER,this.initComponentLayout)
},initComponentLayout:function(){this._view.setStyle("visibility","visible");
this.removeEvent(Constants.ComponentEvents.READY_FOR_RENDER,this.initComponentLayout);
this._valueFetchingRegex=/[-\d\.]+/;
var j=["x","y","width","height"];
var g=false;
for(var e=0;
e<j.length;
e++){var h=j[e];
var f=this._view.get(h);
if(f!=null&&f!=""){g=true;
var d="set"+h.capitalize();
this[d](f,true)
}}if(g){if(this._view.getStyle("position")!="relative"){this._view.setStyle("position","absolute")
}}},_onRender:function(){if(this._intervalID){clearInterval(this._intervalID)
}this._wCheckForSizeChangeAndFireAutoSized(5);
this.flushMinPhysicalHeightCache()
},_wCheckForSizeChangeAndFireAutoSized:function(e){if(!this._view){return
}this._autoSizeTimerIntervals=Math.max(e,this._autoSizeTimerIntervals);
var d=function(){try{if(this._autoSizeTimerIntervals>1){requestAnimFrame(d)
}if(this._autoSizeTimerIntervals>-1){this._onAutoSized()
}}finally{this._autoSizeTimerIntervals--
}}.bind(this);
window.requestAnimFrame(d)
},_addedToDom:function(){if(this._pendingAutoSize){this._onAutoSized(this._pendingAutoSizeArgs);
delete this._pendingAutoSize;
delete this._pendingAutoSizeArgs
}},_onAutoSized:function(e){if(!this._view||!this._isDisplayed||this.getPhysicalHeight()==0){this._pendingAutoSize=true;
this._pendingAutoSizeArgs=e;
return
}var h=this._actualWidth;
this.flushPhysicalHeightCache();
var f=this.getPhysicalHeight();
var d=this.getWidth();
var g;
if(this._lastHeightOnAutoSize){g=this._lastHeightOnAutoSize
}else{g=0
}if(f!=g||(h!=d&&h)){this._actualWidth=d;
if(!e||!e.ignoreLayout){var j=true;
if(this.getAnchors()==null||!W.Layout._validateAnchorTargetsRendered(this.getAnchors())){j=false
}if(this.getHorizontalGroup()!=null&&!W.Layout._validateAnchorTargetsRendered(this.getHorizontalGroup())){j=false
}if(this._anchorTargetsReady||j){this._anchorsInvalidated=false;
this._anchorTargetsReady=true;
this.injects().Layout.enforceAnchors([this])
}else{this._anchorsInvalidated=true
}}}this._lastHeightOnAutoSize=f;
this.fireEvent("autoSizeChange")
},isAnchorsInvalidated:function(){return(this._anchorsInvalidated===true)
},_onAutoSizedAnimation:function(d){this._wCheckForSizeChangeAndFireAutoSized(20)
},_skinParamsChange:function(d){if(this._view){this._view.fireEvent(Constants.DisplayEvents.SKIN_CHANGE,Constants.DisplayEvents.SKIN_CHANGE)
}this._onAutoSized()
},getX:function(){return this._$x
},setX:function(d){if(this._$x!=parseInt(d,10)){if(isNaN(parseInt(d,10))){W.Utils.debugTrace("WbaseComp","setX","NaN passed as value");
return
}this._$x=parseInt(d,10);
this._view.setStyle("left",d+"px")
}},getY:function(){return this._$y
},setY:function(d){if(this._$y!=parseInt(d,10)){if(isNaN(parseInt(d,10))){W.Utils.debugTrace("WbaseComp","setY","NaN passed as value");
return
}this._$y=parseInt(d,10);
this._view.setStyle("top",d+"px")
}},getWidth:function(){return this._$width
},setWidth:function(e,d,f){if(f!=false){f=true
}e=parseInt(e,10);
if(isNaN(e)){W.Utils.debugTrace("WbaseComp","setWidth","NaN passed as value");
return
}e=this._limitWidth(e);
if(this._$width!=e||d){this._$width=e;
this._view.setStyle("width",e+"px");
if(f){this._onResize()
}this.flushMinPhysicalHeightCache();
this.flushPhysicalHeightCache()
}},setHeight:function(e,d,f){if(f!=false){f=true
}e=parseInt(e,10);
if(isNaN(e)){W.Utils.debugTrace("WbaseComp","setHeight","NaN passed as value");
return
}e=this._limitHeight(e);
if(this._$height!=e||d){this._$height=e;
this._view.setStyle("min-height",this._$height+"px");
this.flushPhysicalHeightCache();
if(f){this._onResize()
}}},getSelectableX:function(){return this.getX()
},getSelectableY:function(){return this.getY()
},getSelectableWidth:function(){return this.getWidth()
},getSelectableHeight:function(){return this.getPhysicalHeight()
},_limitWidth:function(d){return this._limitDimension(d,this.getSizeLimits().minW,this.getSizeLimits().maxW)
},_limitHeight:function(d){return this._limitDimension(d,this.getSizeLimits().minH,this.getSizeLimits().maxH)
},_limitDimension:function(e,d,f){return Math.min(Math.max(e,d),f)
},getHeight:function(){return this._$height
},_onResize:function(){this.fireEvent("resize")
},getPosition:function(){var d=this.getViewNode().getSize();
return{y:this.getY(),x:this.getX(),height:d.y,width:d.x}
},getGlobalPosition:function(){return this._view.getPosition()
},getGlobalPositionRefNode:function(){return this._getEditBoxReferenceNode().getPosition()
},getSizeRefNode:function(){return this._getEditBoxReferenceNode().getSize()
},getID:function(){return this._view.getProperty("id")
},getMinPhysicalHeight:function(){if(!this._minPhysicalHeight){var d=this.getHeight();
this.setHeight(1);
this._minPhysicalHeight=this.getPhysicalHeight();
this.flushPhysicalHeightCache();
this.setHeight(d)
}return this._minPhysicalHeight
},getPhysicalHeight:function(){this._actualHeight=this._actualHeight||this.getViewNode().getSize().y;
this._actualHeight=Math.max(this.getHeight(),this._actualHeight);
return this._actualHeight
},getExtraPixels:function(d){return this.getDivExtraPixels(this._view,d)
},getDivExtraPixels:function(j,e){var h=Number.from(j.getStyle("border-top"))+Number.from(j.getStyle("padding-top"));
var d=Number.from(j.getStyle("border-bottom"))+Number.from(j.getStyle("padding-bottom"));
var g=Number.from(j.getStyle("border-left"))+Number.from(j.getStyle("padding-left"));
var f=Number.from(j.getStyle("border-right"))+Number.from(j.getStyle("padding-right"));
if(e){h+=Number.from(j.getStyle("margin-top"));
d+=Number.from(j.getStyle("margin-bottom"));
g+=Number.from(j.getStyle("margin-left"));
f+=Number.from(j.getStyle("margin-right"))
}return{top:h,bottom:d,left:g,right:f,height:h+d,width:g+f}
},flushPhysicalHeightCache:function(){delete this._actualHeight
},flushMinPhysicalHeightCache:function(){delete this._minPhysicalHeight
},getAnchors:function(){return this._anchors
},setAnchors:function(d){this._anchors=d;
d.forEach(this.addReverseAnchor)
},addAnchor:function(d){this._anchors.push(d);
this.addReverseAnchor(d)
},addReverseAnchor:function(d){if(d.toComp===this){this._reverseAnchors.include(d)
}else{d.toComp.addReverseAnchor(d)
}},getReverseAnchors:function(){return this._reverseAnchors
},getHorizontalGroup:function(){return this._horizontalGroup
},setHorizontalGroup:function(d){this._horizontalGroup=d
},getLayoutMode:function(){return"NORMAL"
},getMinDragY:function(d){return this.injects().Layout.getComponentMinDragY(this,d)
},getParentComponent:function(){var d=this.getViewNode().getParent("[comp]");
if(d&&d.getLogic){return d.getLogic()
}return null
},getResizableSides:function(){return this._resizableSides
},isResizable:function(){return(this._resizableSides.length>0)
},isHorizResizable:function(){return this._resizableSides.contains(W.BaseComponent.ResizeSides.RIGHT)||this._resizableSides.contains(W.BaseComponent.ResizeSides.LEFT)
},isVertResizable:function(){return this._resizableSides.contains(W.BaseComponent.ResizeSides.TOP)||this._resizableSides.contains(W.BaseComponent.ResizeSides.BOTTOM)
},isHorizontallyMovable:function(){return this._moveDirections.contains(W.BaseComponent.MoveDirections.HORIZONTAL)
},isVerticallyMovable:function(){return this._moveDirections.contains(W.BaseComponent.MoveDirections.VERTICAL)
},allowHeightLock:function(){return this.isVertResizable()
},useLayoutOnDrag:function(){return false
},useLayoutOnResize:function(){return false
},isEditableInPlace:function(){return false
},getEditedContent:function(){return null
},isContainable:function(d){return true
},isAnchorable:function(){return{to:{allow:true,lock:W.BaseComponent.AnchorLock.BY_THRESHOLD},from:{allow:true,lock:W.BaseComponent.AnchorLock.BY_THRESHOLD}}
},isSelectable:function(){return true
},isContainer:function(){return false
},isDeleteable:function(){return true
},isDeleteableRecurse:function(){if(!this.isDeleteable()){return false
}var e=this.getViewNode().getElements("[comp]");
for(var d=0;
d<e.length;
d++){if(!e[d].getLogic){continue
}if(!e[d].getLogic().isDeleteable()){return false
}}return true
},isMultiSelectable:function(){return true
},_createClickOverlay:function(){if(this.injects().Viewer.isPublicMode()||this._debugMode){if(this._socialOverlayElement){this._socialOverlayElement.clear()
}return
}if(this._socialOverlayElement){return
}var d={};
this._socialOverlayElement=new Element("A",d);
var e=W.Config.getPack("VIEWER_PARAMS").staticThemeUrlWeb+"/transparent.gif";
this._socialOverlayElement.setStyles({position:"absolute",top:"0",left:"0",height:"100%",width:"100%",background:"transparent url("+e+") repeat top left;"});
this._socialOverlayElement.addEvent("click",function(f){f.stopPropagation();
var g={component:this};
this.injects().Commands.executeCommand("socialWidget.interact",g,this)
}.bind(this));
this.getViewNode().adopt(this._socialOverlayElement)
},_getEditBoxReferenceNode:function(){return this._view
},canMoveToOtherScope:function(){return true
}};
for(var b in a){W.BaseClasses.BaseComponentClassData.Class[b]=a[b]
}})();
(function(){Constants.Theme={COLOR_PALETTE_INDEX:11,COLOR_SUB_PALETTE_SIZE:5};
W.Managers.WThemeManager=new WClass({className:"ThemeManager",Extends:W.Managers.ThemeManager,_getThemeSchemaTypeName:function(){return"WFlatTheme"
},getProperty:function(a,d,b){var c=this.parent(a,d,b);
switch(this.getPropertyType(a)){case"webThemeUrl":return W.Config.getPack("VIEWER_PARAMS").staticThemeUrlWeb+"/"+c+"/";
break
}return c
}})
}());
W.Managers.LayoutManager=new WClass({className:"LayoutManager",Binds:["_getAnchoredY","_getAnchoredH"],LOCK_THRESHOLD:70,DEFAULT_MARGIN:10,SUGGEST_ANCHOR_MARGIN:20,FLAG_DIRTY_TOP:1,FLAG_DIRTY_BOTTOM:2,initialize:function(){var a=this;
W.Classes.get("wysiwyg.viewer.managers.classdata.Anchor",function(b){a._AnchorClass=b;
a._isReady=true
});
this._changedByHGroup=[];
this._emptyArr=[]
},setSavedAnchor:function(a){this._savedAnchors=a
},attachSavedAnchors:function(a){for(var b in this._savedAnchors){if(this._savedAnchors[b]){var c=$(b);
if(a&&!a.contains(c)){continue
}if(c&&c.getLogic&&c.getLogic().getAnchors().length===0){if(this.attachSavedAnchorsToComponent(c.getLogic(),this._savedAnchors[b])){delete this._savedAnchors[b]
}}}}},attachSavedAnchorsToComponent:function(d,g){var b=[];
var a=[];
var c;
for(var f=0;
f<g.length;
f++){c=this._desrializeAnchor(g[f],d);
if(c.type==c.ANCHOR_LOCK_BOTTOM){a.push(c)
}else{b.push(c)
}}d.setAnchors(b);
if(a.length>0){var e=new this._AnchorClass();
e.distance=0;
e.originalValue=0;
e.topToTop=0;
e.type=e.ANCHOR_LOCK_BOTTOM;
e.fromComp=d;
e.toComp=d;
a.unshift(e);
for(f=0;
f<a.length;
f++){a[f].toComp.setHorizontalGroup(a)
}}},_desrializeAnchor:function(c,b){var a=new this._AnchorClass();
a.distance=c.distance||0;
a.topToTop=c.topToTop||0;
a.originalValue=c.originalValue||0;
a.type=c.type;
a.toComp=$(c.targetComponent).getLogic();
a.fromComp=b;
a.locked=c.locked||false;
return a
},reportResize:function(c){var b;
if(!c||c.length===0){throw new Error("Invalid changed elements")
}this._updateAnchors(c[0],c,false);
for(b=0;
b<c.length;
b++){this._updateChildAnchors(c[b])
}var a=this._getAndClearChangedByHGroup();
for(b=0;
b<a.length;
b++){this._updateChildAnchors(a[b]);
this._updateAnchors(a[0],[a[0]],false)
}},reportMove:function(b){if(!b||b.length===0){throw new Error("Invalid changed elements")
}this._updateAnchors(b[0],b,false);
var a=this._getAndClearChangedByHGroup();
for(i=0;
i<a.length;
i++){this._updateAnchors(a[0],[a[0]],false)
}},reportReparent:function(b,a){if(!b||b.length===0){throw new Error("Invalid changed elements")
}this._updateChildAnchors(a);
this._updateAnchors(b[0],b,false)
},reportAddComponent:function(a){this._updateAnchors(a[0],a,false)
},reportDeleteComponent:function(a){this._updateChildAnchors(a)
},reportResizeStart:function(){this._getAndClearChangedByHGroup()
},getOptionalBottomLocks:function(f){var l=[];
var a=[];
var m;
var h=f.getViewNode().getParent().getChildren("[comp]");
var k=f.getHorizontalGroup();
var d,e;
if(k){for(d=0,e=k.length;
d<e;
++d){var j=k[d];
if(j.toComp!=f){l.push({locked:true,target:j.toComp});
a.push(j.toComp)
}}m=k.slice(0)
}for(d=0,e=h.length;
d<e;
++d){var g=h[d],b=g.getLogic&&g.getLogic();
if(!b){continue
}if(b!=f&&a.indexOf(b)===-1&&!this._isHorizontalOverlap(f,b)&&this._isVerticalOverlap(f,b)&&b.allowHeightLock()){if(m){var c=new this._AnchorClass();
c.fromComp=m[0].fromComp;
c.toComp=b;
m.push(c);
if(this._isValidHGroup(m)){l.push({locked:false,target:b})
}m.pop(c)
}else{l.push({locked:false,target:b})
}}}return l
},toggleHGroup:function(c,a,b){var h=c.getHorizontalGroup();
var g=a.getHorizontalGroup();
var e;
var f;
if(b){for(var d=0;
d<h.length;
d++){if(h[d].toComp===a){a.setHorizontalGroup(null);
h.splice(d,1)
}}if(h.length===1){c.setHorizontalGroup(null);
return
}e=h
}else{if(h&&g){h.combine(g);
e=h
}else{if(g){f=new this._AnchorClass();
f.type=f.ANCHOR_LOCK_BOTTOM;
f.fromComp=g[0].fromComp;
f.toComp=c;
g.push(f);
e=g
}else{if(h){f=new this._AnchorClass();
f.type=f.ANCHOR_LOCK_BOTTOM;
f.fromComp=h[0].fromComp;
f.toComp=a;
h.push(f);
e=h
}else{e=[];
f=new this._AnchorClass();
f.type=f.ANCHOR_LOCK_BOTTOM;
f.fromComp=c;
f.toComp=c;
e.push(f);
f=new this._AnchorClass();
f.type=f.ANCHOR_LOCK_BOTTOM;
f.fromComp=c;
f.toComp=a;
e.push(f)
}}}}this._updateHGroup(e)
},_updateHGroup:function(c){for(var a=0;
a<c.length;
a++){var b=c[a];
b.toComp.setHorizontalGroup(c);
b.fromComp=c[0].fromComp;
b.distance=this._getBottomDiff(b.fromComp,b.toComp);
b.topToTop=b.toComp.getY()-b.fromComp.getY()
}},_clearHGroup:function(b){for(var a=0;
a<b.length;
a++){b[a].toComp.setHorizontalGroup(null)
}},_isValidHGroup:function(g){var a;
for(a=0;
a<g.length;
a++){if(g[a].toComp.getIsDisposed()||!g[a].toComp.allowHeightLock()){return false
}}var h=g.slice();
h.sort(function(k,j){var m=k.toComp.getX();
var l=j.toComp.getX();
if(m===l){return 0
}else{return m>l?1:-1
}});
for(a=0;
a<h.length-1;
a++){if(h[a].toComp.getX()+h[a].toComp.getWidth()>=h[a+1].toComp.getX()){return false
}}var d=g[0].toComp.getViewNode().getParent();
var c=Number.MAX_VALUE;
var f=-Number.MAX_VALUE;
for(a=0;
a<g.length;
a++){if(g[a].toComp.getIsDisposed()){return false
}if(g[a].toComp.getViewNode().getParent()!=d){return false
}var b=g[a].toComp.getY();
var e=g[a].toComp.getPhysicalHeight()+b;
c=Math.min(e,c);
f=Math.max(b,f)
}return(f<c)
},_getBottomDiff:function(b,a){return a.getY()+a.getPhysicalHeight()-b.getY()-b.getPhysicalHeight()
},_validateCommonParent:function(d,a){if(d.length===0){return
}var c;
if(a){c=a.getViewNode().getParent()
}else{c=d[0].getViewNode().getParent()
}var b=function(e){return c!==e.getViewNode().getParent()
};
if(d.some(b)){throw new Error("Invalid elements scope")
}},_getSiblingsYSortedArray:function(a){var b=a.getViewNode().getParent().getChildren("[comp]");
if(b.some(function(c){return !(c.getLogic)
})){return[]
}return b.sort(function(d,c){var f=d.getLogic().getY();
var e=c.getLogic().getY();
if(f===e){return 0
}else{return f>e?1:-1
}}).map(function(c){return c.getLogic()
})
},_isHorizontalOverlap:function(b,a){var e=b.getX();
var f=e+b.getWidth();
var c=a.getX();
var d=c+a.getWidth();
return !(e>d||c>f)
},_isVerticalOverlap:function(b,a){var e=b.getY();
var f=e+b.getPhysicalHeight();
var c=a.getY();
var d=c+a.getPhysicalHeight();
return !(e>d||c>f)
},_clearReverseAnchorsByScope:function(d,b){for(var c=d.length-1;
c>-1;
c--){var a=d[c];
if(b){if(a.type==a.ANCHOR_BOTTOM_PARENT){d.splice(c,1)
}}else{if(a.type!=a.ANCHOR_BOTTOM_PARENT){d.splice(c,1)
}}}},_updateAnchors:function(q,d,p){this._validateCommonParent(d,q);
var f=this._getSiblingsYSortedArray(q);
var n=[];
var b=[];
var o,j,h,l=f.length,g=null;
for(h=0;
h<f.length;
h++){n[h]={};
this._clearReverseAnchorsByScope(f[h].getReverseAnchors(),false);
if(f[h].getHorizontalGroup()){f[h].getHorizontalGroup().$hGroupDirty=true
}}var m=q.getParentComponent();
if(m){this._clearReverseAnchorsByScope(m.getReverseAnchors(),true)
}for(o=l-1;
o>=0;
o--){var k=f[o];
this._updateOrClearHGroup(k.getHorizontalGroup());
b[o]=k.getAnchors();
var c=[];
var e=false;
if(k.isAnchorable().from.allow){for(j=o+1;
j<l;
j++){var a=f[j];
if(!a.isAnchorable()||!a.isAnchorable().to.allow){continue
}g=null;
if(!n[o][j]&&this._isHorizontalOverlap(k,a)){if(d.indexOf(k)===-1&&d.indexOf(a)===-1){g=this._findAnchorToComp(b[o],a)
}g=g||this._createToTopAnchor(k,a);
n[o][j]=true;
if(g.type==g.ANCHOR_BOTTOM_TOP){e=true;
this._mergeSets(n[o],n[j])
}if(g.type==g.ANCHOR_TOP_TOP&&k.isAnchorable().to.allow&&k.isAnchorable().to.allowBottomBottom!==false){this._checkAndAddBottomAnchor(a,k)
}c.push(g)
}}if(!e){if(m&&m.isAnchorable().to.allow){g=null;
if(d.indexOf(k)===-1&&!p){g=this._findAnchorToComp(b[o],m)
}if(!g){g=this._createToParentAnchor(k,m)
}c.push(g)
}}}k.setAnchors(c)
}},_updateOrClearHGroup:function(a){if(a&&a.$hGroupDirty){delete a.$hGroupDirty;
if(this._isValidHGroup(a)){this._updateHGroup(a)
}else{this._clearHGroup(a)
}}},_setAnchorableIsLocked:function(a){var c=a.fromComp;
var b=a.toComp;
if(c.isAnchorable().from.lock==W.BaseComponent.AnchorLock.NEVER||b.isAnchorable().to.lock==W.BaseComponent.AnchorLock.NEVER){a.locked=false
}else{if(c.isAnchorable().from.lock==W.BaseComponent.AnchorLock.ALWAYS||b.isAnchorable().to.lock==W.BaseComponent.AnchorLock.ALWAYS){a.locked=true
}else{a.locked=a.distance<=this.LOCK_THRESHOLD
}}},_setAnchorableDistance:function(a,b){var d=a.fromComp;
var c=a.toComp;
if(d.isAnchorable().from.distance!=undefined){b=d.isAnchorable().from.distance
}else{if(c.isAnchorable().to.distance!=undefined){b=c.isAnchorable().to.distance
}}a.distance=b
},_createToParentAnchor:function(d,a){var b=d.getY();
var f=d.getPhysicalHeight();
var e=a.getInlineContentContainer().getSize().y;
var c=new this._AnchorClass();
c.type=c.ANCHOR_BOTTOM_PARENT;
c.fromComp=d;
c.toComp=a;
this._setAnchorableDistance(c,e-b-f);
this._setAnchorableIsLocked(c);
c.topToTop=b;
c.originalValue=e;
return c
},_createToTopAnchor:function(b,c){var a=b.getY();
var g=c.getY();
var f=b.getPhysicalHeight();
var e=c.getPhysicalHeight();
var d=new this._AnchorClass();
d.fromComp=b;
d.toComp=c;
if(g+e>a+f&&g>a+f/2){d.type=d.ANCHOR_BOTTOM_TOP;
this._setAnchorableDistance(d,g-a-f)
}else{d.type=d.ANCHOR_TOP_TOP;
this._setAnchorableDistance(d,g-a)
}this._setAnchorableIsLocked(d);
d.topToTop=g-a;
d.originalValue=g;
return d
},_checkAndAddBottomAnchor:function(c,a){var g=a.getY();
var b=c.getY();
var d=a.getPhysicalHeight();
var f=c.getPhysicalHeight();
if(b+f<g+d){var e=new this._AnchorClass();
e.type=e.ANCHOR_BOTTOM_BOTTOM;
e.fromComp=c;
e.toComp=a;
this._setAnchorableDistance(e,g+d-b-f);
e.locked=e.distance<=this.LOCK_THRESHOLD;
e.topToTop=b-g;
e.originalValue=d;
c.addAnchor(e)
}},_getAnchoredY:function(b){switch(b.type){case b.ANCHOR_BOTTOM_TOP:var c=b.fromComp.getPhysicalHeight();
var a=b.fromComp.getY()+c;
if(b.locked){a+=b.distance
}else{a+=this.DEFAULT_MARGIN
}return Math.max(a,b.fromComp.getY()+c/2);
case b.ANCHOR_TOP_TOP:return b.fromComp.getY()+b.distance
}},_getAnchoredH:function(b){var a=b.fromComp.getPhysicalHeight();
var c=b.fromComp.getY()+a;
if(b.locked){c+=b.distance
}else{c+=this.DEFAULT_MARGIN
}if(b.type==b.ANCHOR_BOTTOM_BOTTOM){c-=b.toComp.getY()
}else{if(b.type==b.ANCHOR_BOTTOM_PARENT&&b.toComp.getInlineContentContainer){c=c-b.toComp.getInlineContentContainer().getSize().y+b.toComp.getPhysicalHeight()
}}return c
},enforceAnchors:function(b,f){if(b.length===0||b[0].getViewNode().getParent()===null){return
}this._validateCommonParent(b);
var h=b[0].getParentComponent();
var d=this._getSiblingsYSortedArray(b[0]);
if(d.length==0||!this._validateComponentsRendered(d)){for(e=0;
e<b.length;
e++){delete b[e].$layoutDirtyFlag
}return
}for(var e=0;
e<b.length;
e++){if(!f){b[e].$layoutDirtyFlag=this.FLAG_DIRTY_BOTTOM
}else{b[e].$layoutDirtyFlag=this.FLAG_DIRTY_TOP
}}var k=[];
for(e=0;
e<d.length;
e++){if(!k[e]){k[e]=0
}k[e]++;
if(k[e]>20){W.Utils.debugTrace("Layout Manager","enforceAnchors","infinite loop");
this._enforceParentIfNeeded(h);
return
}d[e].$tempIndex=e;
if(d[e].$layoutDirtyFlag){var a=Number.MAX_VALUE;
var g=d[e];
for(var c=0;
c<g.getAnchors().length;
c++){a=Math.min(this._enforceSingleAnchor(g.getAnchors()[c]),a)
}if(g.getHorizontalGroup()){a=Math.min(this._enforceHGroup(g),a)
}delete g.$layoutDirtyFlag;
if(a<e){e=a-1
}}}for(e=0;
e<d.length;
e++){delete d[e].$tempIndex;
delete d[e].$layoutDirtyFlag
}this._enforceParentIfNeeded(h)
},_enforceParentIfNeeded:function(a){if(a&&a.$layoutDirtyFlag==this.FLAG_DIRTY_BOTTOM){this.enforceAnchors([a])
}},_validateComponentsRendered:function(a){for(var b=0;
b<a.length;
b++){if(a[b].getPhysicalHeight()==0){return false
}}return true
},_validateNodesRendered:function(c){var b=[];
for(var a=0;
a<c.length;
a++){if(!c[a].getLogic){return false
}b.push(c[a].getLogic())
}return this._validateComponentsRendered(b)
},_validateAnchorTargetsRendered:function(b){for(var a=0;
a<b.length;
a++){if(!b[a].toComp.isRendered()){return false
}}return true
},_getContainerContentHeight:function(a){var d=0;
var c=a.getChildComponents();
for(var b=0;
b<c.length;
b++){d=Math.max(this._getCompBottom(c[b].getLogic()),d)
}return d
},_getCompBottom:function(b){var c=b.getY();
var a=b.getPhysicalHeight();
return Math.max(c+a,0)
},_getComponentContentHeight:function(a){var b=0;
if(a.getChildComponents&&this._validateNodesRendered(a.getChildComponents())){b=this._getContainerContentHeight(a)
}else{b=a.getMinPhysicalHeight()
}return b
},getComponentMinResizeHeight:function(a){if(a.getHorizontalGroup()){var c=this._findAnchorToComp(a.getHorizontalGroup(),a);
return this.getHGroupMinBottom(a.getHorizontalGroup())-a.getY()+c.distance
}else{if(a.getChildComponents){var b=this._getContainerContentHeight(a);
if(a.getInlineContentContainer){b=b+a.getPhysicalHeight()-a.getInlineContentContainer().getSize().y
}return b
}}return 0
},getComponentMinDragY:function(b,e){if(!e){e=this._emptyArr
}var f=0;
for(var c=0;
c<b.getReverseAnchors().length;
c++){var a=b.getReverseAnchors()[c];
if(e.contains(a.fromComp)){continue
}if(a.type==a.ANCHOR_BOTTOM_TOP){var d=this._getCompBottom(a.fromComp);
f=Math.max(d,f)
}else{if(a.type==a.ANCHOR_TOP_TOP){f=Math.max(a.fromComp.getY(),f)
}}}return f
},getHGroupMinBottom:function(d){if(d.length<2){return 0
}var b=-Number.MAX_VALUE;
for(var a=0;
a<d.length;
a++){var c=d[a];
b=Math.max(this._getComponentContentHeight(c.toComp)-c.distance+c.toComp.getY(),b)
}return b
},getHGroupMinY:function(d){if(d.length<2){return 0
}var b=-Number.MAX_VALUE;
for(var a=0;
a<d.length;
a++){var c=d[a];
b=Math.max(this.getComponentMinDragY(c.toComp)-c.topToTop,b)
}return b
},_enforceHGroup:function(k){var m=Number.MAX_VALUE;
var h=k.getHorizontalGroup();
var c=this._findAnchorToComp(h,k);
var b,d;
if(!c){return Number.MAX_VALUE
}if(k.$layoutDirtyFlag==this.FLAG_DIRTY_TOP){var a=this.getHGroupMinY(k.getHorizontalGroup());
var f=Math.max(a,c.toComp.getY()-c.topToTop);
m=Math.min(this._setHGroupPartY(c.fromComp,f),m);
for(d=0;
d<k.getHorizontalGroup().length;
d++){b=k.getHorizontalGroup()[d];
var l=b.fromComp.getY()+b.topToTop;
m=Math.min(this._setHGroupPartY(b.toComp,l),m)
}}var j=this.getHGroupMinBottom(k.getHorizontalGroup());
var e=Math.max(j-c.fromComp.getY(),c.toComp.getY()+c.toComp.getPhysicalHeight()-c.distance-c.fromComp.getY());
m=Math.min(this._setHGroupPartHeight(c.fromComp,e),m);
for(d=0;
d<k.getHorizontalGroup().length;
d++){b=k.getHorizontalGroup()[d];
var g=b.fromComp.getY()+b.fromComp.getPhysicalHeight()+b.distance-b.toComp.getY();
m=Math.min(this._setHGroupPartHeight(b.toComp,g),m)
}return m
},_setHGroupPartHeight:function(a,b){var c=a.getPhysicalHeight();
if(c!=b){b=b-a.getExtraPixels().bottom-a.getExtraPixels().top;
a.setHeight(b);
a.$layoutDirtyFlag=this.FLAG_DIRTY_BOTTOM;
this._changedByHGroup.include(a);
if(a.$tempIndex!=undefined){return a.$tempIndex
}}return Number.MAX_VALUE
},_setHGroupPartY:function(a,c){var b=a.getY();
if(b!=c){a.setY(c);
a.$layoutDirtyFlag=this.FLAG_DIRTY_TOP;
this._changedByHGroup.include(a);
if(a.$tempIndex!=undefined){return a.$tempIndex
}}return Number.MAX_VALUE
},_updateChildAnchors:function(a){if(a&&a.getChildComponents){var b=a.getChildComponents();
if(!this._validateNodesRendered(b)){return
}if(b.length>0){this._updateAnchors(b[0].getLogic(),[],true)
}else{this._clearReverseAnchorsByScope(a.getReverseAnchors(),true)
}}},_getAndClearChangedByHGroup:function(){var a=this._changedByHGroup;
this._changedByHGroup=[];
return a
},_enforceSingleAnchor:function(a){if(a.type==a.ANCHOR_TOP_TOP&&a.fromComp.$layoutDirtyFlag===this.FLAG_DIRTY_BOTTOM){return Number.MAX_VALUE
}if(a.type==a.ANCHOR_BOTTOM_PARENT||a.type==a.ANCHOR_BOTTOM_BOTTOM){return this._enforceFromBottomTypeAnchor(a)
}return this._enforceToTopTypeAnchor(a)
},_enforceToTopTypeAnchor:function(b){var d=b.toComp;
var a=this._getAnchoredY(b);
var c=d.getY();
var e=-Number.MAX_VALUE;
if(b.type==b.ANCHOR_BOTTOM_TOP&&!b.locked){e=b.originalValue
}d.setY(d.getY()<a?a:this._getMaxAnchoredY(d,e));
if(c!==d.getY()){d.$layoutDirtyFlag=this.FLAG_DIRTY_TOP
}return Number.MAX_VALUE
},_enforceFromBottomTypeAnchor:function(b){var e=b.toComp;
var a=e.getPhysicalHeight();
var d=this._getAnchoredH(b);
var c=d;
if(b.toComp.layoutMinHeight){c=b.toComp.layoutMinHeight()
}else{if(!b.locked){c=b.originalValue
}}e.setHeight(a<d?d:this._getMaxAnchoredH(e,c));
if(a!==e.getHeight()){e.$layoutDirtyFlag=this.FLAG_DIRTY_BOTTOM;
if(b.type==b.ANCHOR_BOTTOM_BOTTOM){return e.$tempIndex
}}return Number.MAX_VALUE
},_getMaxAnchoredH:function(a,d){if(!d){d=-Number.MAX_VALUE
}var b=this._getAnchoredH;
var c=d;
a.getReverseAnchors().forEach(function(e){if(e.type!=e.ANCHOR_BOTTOM_PARENT&&e.type!=e.ANCHOR_BOTTOM_BOTTOM){return
}var f=b(e);
if(!e.locked){f=Math.max(f,e.originalValue)
}c=Math.max(f,c)
});
return c
},_getMaxAnchoredY:function(b,c){var d=this._getAnchoredY;
var a=c;
b.getReverseAnchors().forEach(function(f){if(f.type!=f.ANCHOR_BOTTOM_TOP&&f.type!=f.ANCHOR_TOP_TOP){return
}var e=d(f);
a=Math.max(e,a)
});
return a
},_findAnchorToComp:function(c,a){for(var b=0;
b<c.length;
b++){if(c[b].toComp===a){return c[b]
}}},_mergeSets:function(c,b){for(var a in b){c[a]=true
}},isReady:function(){return this._isReady
},clone:function(){return new W.Managers.LayoutManager()
}});
W.Managers.ViewManager=new WClass({className:"ViewManager",Binds:["_fireScreenResizeEvent","_onSiteReady","_onPageNavigation"],Extends:W.Managers.ViewManagerBase,Static:{SCREEN_RESIZE_EVENT:"ScreenResize"},initialize:function(){this.parent();
this._isPageScrollToTopEnabled=false;
this.initScreenResizeEventPropagation();
this._registerCommands();
this.addHeightChangeCallback(function(){return W.Layout.getComponentMinResizeHeight(this.getSiteNode().getLogic())
}.bind(this))
},setSite:function(c,b,e){this.parent(c,b,e);
var d=this._siteNode.getElement("#SITE_PAGES");
if(d&&d.getProperty("comp")){this._pageGroupComp=d;
this._pageGroupComp.addEvent("pageTransitionEnded",this._onPageNavigation)
}var a=$(document.body);
if(this.getPreviewMode()){a.setStyle("overflow","hidden")
}else{a.setStyle("overflow-y","scroll");
a.setStyle("overflow-x","auto")
}},setAdData:function(a){this._adData=a
},getAdData:function(){return this._adData
},_onPageNavigation:function(a){document.title=W.Viewer.getPagesData()[a].get("title");
W.Commands.executeCommand("WViewerCommands.MediaZoom.Close");
this.fireEvent("pageTransitionEnded",a)
},_pageTransition:function(a){this._currentPageId=a;
if(this._pageGroupComp){this._pageGroupComp.getLogic().gotoPage(a)
}else{this.parent(a)
}LOG.reportPageEvent(window.location.href)
},getDocWidth:function(){var a;
switch(window.rendererModel.applicationType){case"HtmlFacebook":a="520";
break;
case"HtmlWeb":a="980";
break;
default:a=980
}return a
},initScreenResizeEventPropagation:function(){$(window).addEvent("resize",this._fireScreenResizeEvent)
},indexPages:function(j){var a=this._siteNode.getElement(j);
if(!a){return W.Utils.callLater(this.indexPages,[j],this,10)
}var c={};
var b=[];
a.getElements("[comp=mobile.core.components.Page]").each(function(l){var k=l.get("id")||W.Utils.getUniqueId("page");
c[k]=l;
l.addClass("sitePage");
var m=l.get("dataQuery");
b.push(m)
}.bind(this));
var d=this._siteStructureData.getData().pages;
if(!d){d=[]
}for(var e=0;
e<d.length;
++e){var g=d[e];
var f=b.indexOf(g);
if(f!=-1){b.splice(f,1);
b.splice(e,0,g)
}}var h=W.Data.isDataChange();
this._siteStructureData.set("pages",b);
if(this._siteStructureData.get("mainPage")==undefined||this._siteStructureData.get("mainPage")==""){this._siteStructureData.set("mainPage",b[0])
}h&&W.Data.flagDataChange();
this._pages=c
},_fireScreenResizeEvent:function(){this.fireEvent(this.SCREEN_RESIZE_EVENT)
},_onSiteReady:function(){this.parent();
W.Layout.attachSavedAnchors();
this._fireScreenResizeEvent();
if(this.getSiteNode()&&this.getSiteNode().getLogic){this.siteHeightChanged()
}W.Utils.callLater(this._notifySiteReadyForThumbnail)
},_notifySiteReadyForThumbnail:function(){if(W.Utils.getQueryParam("siteReadyAlert")==="true"){window.alert("siteReady")
}var b=W.Utils.getQueryParam("siteReadyPost");
if(b){var a=new Request.JSON({url:b});
a.post({siteReady:true})
}},getSiteHeight:function(){return this._siteHeight
},setAdHeight:function(a){this._adHeight=a
},addHeightChangeCallback:function(a){this._heightChangeCallbacks=this._heightChangeCallbacks||[];
this._heightChangeCallbacks.push(a)
},_getHeightFromCallback:function(){if(!this._heightChangeCallbacks){return 0
}var a=0;
for(var b=0;
b<this._heightChangeCallbacks.length;
b++){a+=this._heightChangeCallbacks[b]()
}return a
},siteHeightChanged:function(a){this.getSiteNode().getLogic().flushPhysicalHeightCache();
this._siteHeight=this._getHeightFromCallback();
this.fireEvent("resize",this._siteHeight);
if(!a){this.getSiteNode().getLogic().setHeight(this._siteHeight)
}this._postHeightMessage()
},_postHeightMessage:function(){var a=parent.postMessage?parent:(parent.document.postMessage?parent.document:undefined);
if(a&&typeof a!="undefined"){a.postMessage(this._siteHeight,"*")
}},addOrientationEvent:function(a){},_getAllComponentsButPageContents:function(a){var b=a.getElements("[comp]");
if(a.get("comp")){b.push(a)
}return b.filter(function(d,c,e){return(d.getParent("[comp=mobile.core.components.Page]")==null)
})
},getPageGroup:function(){return this._siteNode.getElement("#SITE_PAGES").getLogic()
},_registerCommands:function(){var a=W.Commands;
a.registerCommandAndListener("WViewerCommands.SetMediaZoomImage",this,this.setMediaZoom)
},_setDataObjectFromHash:function(b,a){this.parent(b,a);
if(b.getType&&b.getType()==="Image"){this._setMediaZoomItemAndShow(b)
}},_setMediaZoomItemAndShow:function(a){this._initIfNeededZoomMedia(function(){this._setMediaZoomDataInner({imageData:a});
this._mediaZoom.getLogic().showZoomImage()
}.bind(this))
},setMediaZoom:function(a){this._initIfNeededZoomMedia(function(){this._setMediaZoomDataInner(a)
}.bind(this))
},removeMediaZoom:function(){if(this._mediaZoom){this._mediaZoom.removeFromDOM();
delete this._mediaZoom
}},_setMediaZoomDataInner:function(a){if(a.mediaList){this._mediaZoom.getLogic().setGallery(a.mediaList,a.currentIndex)
}else{if(a.imageData){this._mediaZoom.getLogic().setImage(a.imageData)
}}},_initIfNeededZoomMedia:function(a){if(!this._mediaZoom){this._mediaZoom=W.Components.createComponent("wysiwyg.viewer.components.MediaZoom","wysiwyg.viewer.skins.MediaZoomSkin",null,null,function(b){b.getViewNode().insertInto(this._siteNode)
}.bind(this),a)
}else{if(a){a()
}}},enterFullScreenMode:function(){if(!this._isFullScreen){var a=!this.getPreviewMode()?$(document.body):$(window.parent.document.body);
this._originalBodyOverflow=a.getStyle("overflow");
a.setStyle("overflow","hidden");
this._isFullScreen=true
}},exitFullScreenMode:function(){if(this._isFullScreen){if(this._currentPageId){this._setUrlHashToPage(this._currentPageId)
}else{this.goToHomePage()
}var a=!this.getPreviewMode()?$(document.body):$(window.parent.document.body);
a.setStyle("overflow",this._originalBodyOverflow);
this._isFullScreen=false
}}});
W.Managers.CookiesManager=new WClass({className:"CookiesManager",_initializeExtra:function(){},setCookieParam:function(a,e){var c;
var b=this.getCookie(a);
if(b){if(this.getCookieParams(a).indexOf(e)>=0){return
}c=a+"="+b+","+e
}else{c=a+"="+e
}var d=this.writeCookie(c);
return d
},getCookieParams:function(a){var f=a+"=";
var e=document.cookie.split(";");
for(var c=0;
c<e.length;
c++){var b=e[c];
while(b.charAt(0)==" "){b=b.substring(1,b.length)
}if(b.indexOf(f)==0){var d=b.substring(f.length,b.length);
return d.split(",")
}}return[]
},removeCookieParam:function(a,d){var e=this.getCookieParams(a);
if(!(e.length>0)){return
}var f=e.indexOf(d);
if(f<0){return
}e.splice(f,1);
var b=a+"="+e.toString();
var c=this.writeCookie(b);
return c
},removeCookie:function(a){this.writeCookie(a+"=")
},writeCookie:function(c,f,d,e){var b;
if(f){b=(new Date((new Date()).getTime()+f))
}else{var a=new Date();
a.setYear((new Date().getFullYear()+1));
b=a
}c+=";expires="+b.toGMTString();
c+=";path="+(e||"/");
if(d){c+=";domain="+d
}document.cookie=c;
return c
},getCookie:function(a){if(document.cookie){var e=document.cookie.split(/;\s*/);
for(var d=0,f=e.length;
d<f;
d++){var c=e[d];
var b=a+"=";
if(c.indexOf(b)==0){return c.substring(b.length,c.length)
}}}return false
},isReady:function(){return true
},clone:function(){return new W.Managers.CookiesManager()
}});
W.Managers.list.combine([{Class:"LayoutManager",target:"Layout"},{Class:"CookiesManager",target:"CookiesManager"}]);
W.Managers.override([{Class:"WThemeManager",target:"Theme"}]);