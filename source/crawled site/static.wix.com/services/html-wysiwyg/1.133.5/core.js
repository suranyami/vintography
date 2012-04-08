Constants.ComponentEvents={DISPLAYED:"displayed",READY:"componentReady",WIXIFIED:"wixified",PROPERTY_CHANGE:"componentPropertyChange",READY_FOR_RENDER:"readyForRender",RENDER:"render"};
Constants.ComponentPartTypes={HTML_ELEMENT:"htmlElement"};
var SizeLimits=new Class({minW:null,minH:null,maxW:null,maxH:null,initialize:function(){},clone:function(){var b=new SizeLimits();
b.minW=this.minW;
b.minH=this.minH;
b.maxW=this.maxW;
b.maxH=this.maxH;
return b
}});
W.BaseClasses.BaseComponentClassData={name:"mobile.core.components.base.BaseComponent",Class:{Extends:Events,Binds:["getComponentProperties","_setSkinPartElements","_onDataChange","_onDefaultAction","_replaceSkin","_replaceSkinAsync","_onRenderingTriggerEvent","_onComponentWixified","_onEditModeChanged","_skinParamsChange"],Static:{MINIMUM_WIDTH_DEFAULT:5,MINIMUM_HEIGHT_DEFAULT:5,MAXIMUM_WIDTH_DEFAULT:1500,MAXIMUM_HEIGHT_DEFAULT:1500},_renderTriggers:[],initialize:function(g,e,f){this._compId=g;
this._view=e;
this._isEnabled=!e.disabled;
this._view.setProperty("id",(f&&f.id)||g);
this._allComponentPartsReady=false;
this._componentReady=false;
this._isRenderNeeded=true;
this._autoBoundParts=null;
this._isDisposed=false;
this._isRendered=false;
this._editorMode="CURRENT_PAGE";
var h=(f&&f.command)||e.getAttribute("command");
this._commandParameter=(f&&f.commandParameter)||e.getAttribute("commandParameter");
this._command=null;
this._commandName=null;
this._usesExternalData=false;
this._callLaterIDs=[];
this._stateGrpDict={};
this._sizeLimits=this.getSizeLimits();
this._minimumTimeBetweenRenders=this._minimumTimeBetweenRenders||0;
this._lastRenderTime=-9999;
this._renderDelayed=false;
if(h){this.setCommand(h,this._commandParameter)
}this._isDisplayed=false;
e.addEvent(Constants.ComponentEvents.WIXIFIED,this._onComponentWixified);
this.injects().Commands.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._onEditModeChanged)
},toString:function(){return"[Component "+this.className+" #"+this._compId+"]"
},getComponentId:function(){return this._compId
},getComponentType:function(){return this._view.get("comp")
},_getDataManager:function(){return this._data.getDataManager()
},getViewNode:function(){return this._view
},getSizeLimits:function(){if(this._sizeLimits===undefined){this._sizeLimits=new SizeLimits();
this._sizeLimits.minW=this._sizeLimits.minW||this.MINIMUM_WIDTH_DEFAULT;
this._sizeLimits.minH=this._sizeLimits.minH||this.MINIMUM_HEIGHT_DEFAULT;
this._sizeLimits.maxW=this._sizeLimits.maxW||this.MAXIMUM_WIDTH_DEFAULT;
this._sizeLimits.maxH=this._sizeLimits.maxH||this.MAXIMUM_HEIGHT_DEFAULT;
this._originalSizeLimits=this._sizeLimits.clone()
}return this._sizeLimits
},_initSizeLimits:function(){},setMinW:function(b){this.getSizeLimits().minW=b;
this._originalSizeLimits.minW=b;
this._applySizeLimitsIfNeeded()
},setMinH:function(b){this.getSizeLimits().minH=b;
this._originalSizeLimits.minH=b;
this._applySizeLimitsIfNeeded()
},setMaxW:function(b){this.getSizeLimits().maxW=b;
this._originalSizeLimits.maxW=b;
this._applySizeLimitsIfNeeded()
},setMaxH:function(b){this.getSizeLimits().maxH=b;
this._originalSizeLimits.maxH=b;
this._applySizeLimitsIfNeeded()
},_applySizeLimitsIfNeeded:function(){if(this._$width<this.getSizeLimits().minW||this._$width>this.getSizeLimits().maxW){this.setWidth(this._$width)
}if(this._$height<this.getSizeLimits().minH||this._$height>this.getSizeLimits().maxH){this.setHeight(this._$height)
}},getAcceptableDataTypes:function(){return[""]
},getRawData:function(){return this._data?this._data.getData():undefined
},getDataItem:function(){return this._data
},isUsingExternalData:function(){return this._usesExternalData
},setDataItem:function(e){var f=this._data;
try{if(f){f.removeComponentWithInterest(this);
f.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
}}catch(d){}this._data=e;
if(e&&e!=f){this._data.addComponentWithInterest(this);
this._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
}this._onDataChange(e);
this._tryCreatingComponentParts()
},setDataByQuery:function(d,c){this.injects().Data.getDataByQuery(d,function(a){this.setDataItem(a);
c()
}.bind(this))
},_setSkinPartElements:function(b){this._validateSkinParts(b);
this._skinPartElements=b;
this._tryCreatingComponentParts()
},_validateSkinParts:function(d){for(var e in this._skinPartsSchema){var f=this._skinPartsSchema[e];
if(!d[e]&&!f.optional&&f.autoCreate!==false&&!f.repeater){LOG.reportError(wixErrors.SKIN_PART_MISSING,this.$className+" / "+this._skin.$className,"_validateSkinParts",e)()
}}},_tryCreatingComponentParts:function(){if(this._skinPartElements&&(this._data||this.getAcceptableDataTypes().indexOf("")>=0)){this._loadComponentParts()
}},_loadComponentParts:function(){this._allComponentPartsReady=false;
this._skinParts=this._skinPartElements;
var f=[];
for(var e in this._skinPartsSchema){if("view"==e){continue
}var g=this._createInnerComponent(e,this._skinParts[e],true);
if(g){f.push(g)
}}delete this._skinPartElements;
if(f.length!==0){var h=new Async.Bulk(f,null,{completeEvent:Constants.ComponentEvents.READY,onComplete:function(){for(var a=0;
a<f.length;
a++){var c=f[a];
var b=c.get("skinPart");
if(b){this._skinParts[b]=c.getLogic()
}}this._setAllPartsReady()
}.bind(this)})
}else{this._setAllPartsReady()
}},_createInnerComponent:function(e,f,g){var h=this.getSkinPartDefinition(e);
if(h.type==Constants.ComponentPartTypes.HTML_ELEMENT||h.repeater){return
}if(g&&h.autoCreate===false){return
}h.skin=h.skin||f.getProperty("skin");
return this._createComponentbyDefinition(h,f)
},_createComponentbyDefinition:function(p,h,k){h=h||new Element("div");
h.setProperty("skinPart",p.id);
var n;
if(p.dataQuery){n=p.dataQuery
}else{if(p.dataRefField){var m=p.dataRefField;
if(m=="*"){n=this._data
}else{n=this._data.get(m)
}}else{if(p.dataItem){n=p.dataItem
}}}if(this._data&&this._data.getDataManager()!=W.Data){h.set("dataQuerySource","preview")
}else{if(p.dataQuerySource){h.set("dataQuerySource",p.dataQuerySource)
}}p.argObject=p.argObject||{};
var j;
if(p.styleGroup&&this._style){j=(p.styleGroup=="inherit")?this._style:this._style.getStyleByGroupName(p.styleGroup)
}var o;
if(k||j){o=function(a){if(j){}if(k){k(a)
}}
}return this.injects().Components.createComponent({compNode:h,type:p.type,skin:p.skin,data:n,args:p.argObject,componentReadyCallback:o,innerStyle:j})
},getSkinPartDefinition:function(g){var h=this._skinPartsSchema[g];
if(!h){LOG.reportError(wixErrors.CM_NO_PART,this.className,"getSkinPartParams",skinPartName);
return ret
}var j=this._skinPartsSchema[g]||{};
var f=(this._skin&&this._skin.getCompPartsDefinition()[g])||{};
var k=Object.merge({id:g},f,j);
if(k.hookMethod&&typeOf(this[k.hookMethod])=="function"){k.argObject=k.argObject||{};
k=this[k.hookMethod](k)
}return k
},_setAllPartsReady:function(){if(this._allComponentPartsReady){LOG.reportError(wixErrors.WIXIFY_ALREADY_WIXIFIED,this.className,"_setAllPartsReady");
return
}this._allComponentPartsReady=true;
this._registerDataBindings();
this._registerSkinPartCommands();
this._applySizeLimitsIfNeeded();
this._onAllSkinPartsReady(this._skinParts);
this._renderIfReady()
},setTextContent:function(){W.Utils.debugTrace("")
},setSkin:function(e){if(this._skin){this._skin.unRegister()
}if(this._skinParts&&this._skinParts.inlineContent){var g=this._skin.getInlineContent();
this._view.empty();
this._view.adopt(g)
}this._skin=e;
var h=this.getSizeLimits();
var f=this._originalSizeLimits;
h.minW=this._skin.minW||f.minW;
h.minH=this._skin.minH||f.minH;
h.maxW=this._skin.maxW||f.maxW;
h.maxH=this._skin.maxH||f.maxH;
this._skin.register(this._view,this._setSkinPartElements,this._skinParamsChange)
},_skinParamsChange:function(b){},setStyle:function(b){if(b===this._style){return
}if(this._style){this._style.removeEvent("skinChange",this._replaceSkinAsync)
}this._style=b;
if(b.getSkin()!=this._skin.$className){this._skin.injects().Skins.getSkin(b.getSkin(),this._replaceSkin)
}else{this._skin.applyStyle(b)
}this._updateViewAttributes();
this._style.addEvent("skinChange",this._replaceSkinAsync);
this._onStyleReady()
},_onEditModeChanged:function(c){var d=this._editorMode;
this._editorMode=c;
this._editModeChanged(c,d)
},_editModeChanged:function(c,d){},_onStyleReady:function(){},getStyle:function(){return this._style
},_replaceSkinAsync:function(){this._skin.injects().Skins.getSkin(this._style.getSkin(),this._replaceSkin)
},_replaceSkin:function(c){var d=new c();
d.applyStyle(this._style);
this.setSkin(d)
},_updateViewAttributes:function(){this._view.removeAttribute("styleId");
this._view.removeAttribute("styleid");
this._view.setAttribute("skin",this._skin.$className);
if(this._style){this._view.removeAttribute("skin");
this._view.setAttribute("styleId",this._style.getId())
}},render:function(){},_onAllSkinPartsReady:function(){},_onDataChange:function(e,f,d){if(!this._preventRenderOnDataChange(e,f,d)){this._renderIfReady()
}},_preventRenderOnDataChange:function(e,f,d){},_renderIfReady:function(){if(this._componentReady){this._tryRender(true)
}else{this._testComponentReady()
}},renderIfNeeded:function(){if(this._componentReady){this._tryRender(false)
}else{this._testComponentReady()
}},_tryRender:function(f){this._isRenderNeeded=this._isRenderNeeded||(!!f);
if(!this._componentReady||!this._needsRender()){return this._componentReady
}var d=false;
if(this._minimumTimeBetweenRenders===0||this._timeSinceLastRender()>this._minimumTimeBetweenRenders){if(this._prepareForRender()){d=true;
this.fireEvent(Constants.ComponentEvents.READY_FOR_RENDER);
if(!this._skipRender&&this._isDisplayed){this._isRenderNeeded=false;
this._newlyDisplayed=false;
this._lastRenderTime=new Date().getTime();
this.render();
this._isRendered=true;
this._refreshDataBindings();
if(!this._areRenderingTriggersAttached){this._areRenderingTriggersAttached=true;
this._attachRenderTriggers()
}this.fireEvent(Constants.ComponentEvents.RENDER);
this._view.fireEvent(Constants.ComponentEvents.RENDER)
}}}else{if(!this._renderDelayed){this._renderDelayed=true;
var e=Math.max(10,this._minimumTimeBetweenRenders-this._timeSinceLastRender());
this.callLater(this._delayedRenderCB,[f],e)
}}return d
},_delayedRenderCB:function(b){this._renderDelayed=false;
this._tryRender(b)
},_timeSinceLastRender:function(){return new Date().getTime()-this._lastRenderTime
},_needsRender:function(){return this._isRenderNeeded
},isReady:function(){return this._componentReady
},isRendered:function(){return this._isRendered
},setCollapsed:function(b){if(b){this.collapse()
}else{this.uncollapse()
}},callLater:function(g,f,e){var h=this.injects().Utils.callLater(g,f,this,e);
if(h){this._callLaterIDs.push(h)
}return h
},callRenderLater:function(b){b=b||100;
if(!this._renderDelayed){this._renderDelayed=true;
this.callLater(function(){this._renderDelayed=false;
this._renderIfReady()
}.bind(this),[],b)
}},collapse:function(){if(this._view){this._view.collapse()
}},uncollapse:function(b){if(this._view){this._view.uncollapse(b)
}},setState:function(g,f){this._processStates();
var h=this._currentState;
if(!f){f=this._stateGrpDict[g]||"DEFAULT"
}f=f.toUpperCase();
var e=this._stateMap[f];
if(!e){LOG.reportError(wixErrors.CM_UNKNOWN_STATE_GROUP,this.$className,"setState",f)
}else{if(e.indexOf(g)<0){LOG.reportError(wixErrors.CM_UNKNOWN_STATE_NAME,this.$className,"setState",f+":"+g)
}else{this._currentStateMap[f]=g;
this._syncState()
}}},hasState:function(f,e){this._processStates();
if(!e){e=this._stateGrpDict[f]||"DEFAULT"
}e=e.toUpperCase();
var d=this._stateMap[e];
if(!d){return false
}else{if(d.indexOf(f)<0){return false
}else{return true
}}},removeState:function(g,f){this._processStates();
f=(f||"DEFAULT").toUpperCase();
var e=this._stateMap[f];
if(!e){LOG.reportError(wixErrors.CM_UNKNOWN_STATE_GROUP,this.$className,"removeState",f)
}else{var h=this._currentStateMap[f];
if(h==g){delete this._currentStateMap[f]
}this._syncState()
}},_syncState:function(){var j=[];
for(var h in this._stateMap){if(this._currentStateMap[h]){j.push(this._currentStateMap[h])
}}var f=j.join(" ");
var g=this._view;
var k=this._currentState||"";
this._currentState=f;
g.setProperty("state",f);
if(Browser.ie){g.addClass("FOCRE_REFLOW_PLEASE");
g.removeClass("FOCRE_REFLOW_PLEASE")
}if(f!=k){this._onStateChange(f,k);
this.fireEvent("stateChange",{newState:f,oldState:k});
g.triggerDisplayChanged()
}},getState:function(c){var d;
if(c){if(!this._currentStateMap){this._processStates()
}d=(this._currentStateMap[c.toUpperCase()])
}else{d=this._view.getProperty("state")
}return d||""
},_processStates:function(){if(this._stateMap){return
}var o,n;
this._currentStateMap={};
this._stateMap={DEFAULT:[]};
var h=this._states||[];
var j={};
if(h instanceof Array){for(o=0;
o<h.length;
++o){n=h[o];
if(typeof(n)!="string"){LOG.reportError(wixErrors.CM_MALFORMED_STATES,this.$className,"_processStates",h)
}else{this._stateMap.DEFAULT.push(n)
}}}else{if(typeof(h)=="object"){for(var k in h){var m=h[k];
if(m instanceof Array){var p=k.toUpperCase();
this._stateMap[p]=m.concat();
for(o=0;
o<m.length;
++o){n=m[o];
if(n in j){LOG.reportError(wixErrors.CM_DUPLICATE_STATE_NAME,this.$className,"_processStates",n)
}j[n]=true;
this._stateGrpDict[n]=p
}}else{LOG.reportError(wixErrors.CM_MALFORMED_STATES,this.$className,"_processStates",k)
}}}else{LOG.reportError(wixErrors.CM_MALFORMED_STATES,this.$className,"_processStates",h)
}}},dispose:function(){if(this._isDisposed){return LOG.reportError(wixErrors.COMPONENT_ALREADY_DISPOSED,this.className,"dispose",this._compId)
}if(this._view){this._view.cleanup();
this._view.destroy();
this._view=null;
this._isDisposed=true
}if(this._data){this._data.removeComponentWithInterest(this);
this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
this._data.getDataManager().removeDataItem(this._data);
delete this._data
}if(this._properties){this._properties.removeComponentWithInterest(this);
this._properties.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
this._properties.getDataManager().removeDataItem(this._properties);
delete this._properties
}while(this._callLaterIDs.length>0){var j=this._callLaterIDs.pop();
if(j){this.injects().Utils.clearCallLater(j)
}}this.removeEvents();
var h=this.injects().Commands;
if(h){h.unregisterListener(this)
}if(this.getSkin()){this.getSkin().dispose()
}if(this._skinParts){for(var e in this._skinParts){var n=this._skinParts[e];
if(n){if(n._compId){try{n.dispose()
}catch(k){}}else{try{n.cleanup();
n.destroy()
}catch(m){}}}}this._skinParts=null
}},getIsDisposed:function(){return this._isDisposed
},_onComponentWixified:function(){var p=this._view;
if(this._canFocus){p.addEvent(Constants.CoreEvents.FOCUS,this._onFocus.bind(this));
p.addEvent(Constants.CoreEvents.BLUR,this._onBlur.bind(this))
}this._isDisplayed=p.isNodeDisplayed();
this._areRenderingTriggersAttached=false;
var m=this._triggers;
if(m){for(var n=m.length-1;
n>=0;
--n){var o=m[n];
p.addEvent(o,this._onDefaultAction)
}}var k=Constants.DisplayEvents,j=this._onRenderingTriggerEvent;
for(var c in Constants.DisplayEvents){p.addEvent(k[c],j)
}},_onComponentReady:function(){var b=this._view
},_attachRenderTriggers:function(){var f=this._renderTriggers||[];
var e=this._view;
for(var d=f.length-1;
d>=0;
--d){e.addEvent(f[d],this._onRenderingTriggerEvent)
}},_testComponentReady:function(){if(this._componentReady){return
}if(this._view.getLogic){if(this._isBaseComponentReady()){this._componentReady=true;
if(this._isEnabled){this._handleEnabled()
}else{this._handleDisabled()
}if(this._tryRender()){this.fireEvent(Constants.ComponentEvents.READY);
this._view.fireEvent(Constants.ComponentEvents.READY)
}else{this._componentReady=false
}}}else{var b=function(){this._view.removeEvent(Constants.ComponentEvents.WIXIFIED,b);
this._testComponentReady()
}.bind(this);
this._view.addEvent(Constants.ComponentEvents.WIXIFIED,b)
}},_isBaseComponentReady:function(){return this._allComponentPartsReady&&!!this._skinParts&&(!!this._data||this.getAcceptableDataTypes().indexOf("")>=0)
},_prepareForRender:function(){return true
},_onStateChange:function(c,d){},fancify:function(c){var d=this.injects().Components.createComponent("mobile.editor.components.FancyItem","mobile.editor.skins.FancyItemSkin",undefined,{},null,function(){var a=this;
d.getLogic().createGui({dataPanel:this,upClickHandler:c.upCallback,downClickHandler:c.downCallback,deleteHandler:c.deleteCallback,showHideToggleHandler:c.isHiddenCallback,isHidden:c.initialIsHidden},this._skinParts.fancyContainer);
d.getLogic()._skinParts.view.insertInto(a._skinParts.view);
this._tryRender(true);
c.readyCallback&&c.readyCallback()
}.bind(this))
},_refreshDataBindings:function(){var p=this._autoBoundParts;
if(!p||!p.length){return
}var w=this._data&&this._data.getData();
var q=this.injects();
var t=q.Resources;
var r=q.Utils;
var A=this._skinParts;
for(var v=p.length-1;
v>=0;
--v){var z=p[v];
var u;
var x=A[z.skinPart];
if(!x){continue
}if(z.bindToData){u=w&&w[z.bindToData];
if(null===u||undefined===u){LOG.reportError(wixErrors.CM_NO_DATA,this.className,"refreshDataBindings",z.bindToData);
continue
}}else{if(z.bindToDictionary){u=t.get("EDITOR_LANGUAGE",z.bindToDictionary);
if(null===u||undefined===u){LOG.reportError(wixErrors.CM_NO_DICTIONARY_DATA,this.className,"refreshDataBindings",z.bindToDictionary);
continue
}}else{if(z.bindToSelf){u=this[z.bindToSelf]
}}}if(z.dictionaryFallback&&u.match(/^\s*$/)){u=t.get("EDITOR_LANGUAGE",z.dictionaryFallback)
}if(z.isView){var y=z.viewType;
if(""===y){var C=x.nodeName;
if(C.toLowerCase()=="input"){var B=x.getAttribute("type").toLowerCase();
if("text"==B){y="textinput"
}else{if("checkbox"==B||"radio"==B){y="check"
}}}else{y="text"
}z.viewType=y
}if("textinput"==y){x.setAttribute("value",u)
}else{if("check"==y){var s=r.stringToBoolean(u);
if(s){x.setAttribute("checked",true)
}else{x.removeAttribute("checked")
}}else{x.innerHTML=u
}}}else{x.setTextContent(u)
}}},hide:function(){if(this._view){this._view.hide()
}},show:function(){if(this._view){this._view.show()
}},_disableLinks:function(c){var d=this;
c.addEvent("click",function(b){var a=d.injects().Viewer;
if(a.getPreviewMode()){b.preventDefault();
if(W.Viewer.getLinkTipFunc()){var g=$(this).getProperty("href")||"";
var h=d.injects().Data.createDataItem({type:"Link",target:g,linkType:"FREE_LINK"});
W.Viewer.getLinkTipFunc()(h)
}}})
},_sanitizeLinks:function(f){for(var e=0;
e<f.length;
++e){var d=f[e];
this._sanitizeLink(d)
}},_sanitizeLink:function(c){var d=c.get("href");
if(d){if(d.indexOf("http://")!==0&&d.indexOf("https://")!==0){if(d.indexOf("telnet://")!==0&&d.indexOf("ftp://")!==0&&d.indexOf("mailto:")!==0){if(d.indexOf("@")>0){c.set("href","mailto:"+d)
}else{if(d.indexOf("www")===0||(d.indexOf("www")!==0&&d.indexOf("#")!==0)){c.set("href","http://"+d)
}}}}}},_onFocus:function(){},_onBlur:function(){},_onDefaultAction:function(){this.executeCommand()
},executeCommand:function(f){if(!this._command){if(this._commandName){var e=W.Commands.getCommand(this._commandName);
if(e){this.setCommand(e,this._commandParameter)
}}}if(this._command){var d=arguments.length>0?f:this._commandParameter;
if(d){d=this._parseDataReference(d)
}this._command.execute(d,this)
}},enable:function(){if(!this._isEnabled){this._isEnabled=true;
this._view.removeAttribute("disabled");
this._handleEnabled()
}},disable:function(){if(this._isEnabled){this._isEnabled=false;
this._view.setAttribute("disabled","disabled");
this._handleDisabled()
}},isEnabled:function(){return this._isEnabled
},setCommand:function(f,d){var e=this.injects().Commands;
if(typeof(f)=="string"){this._commandName=f;
f=e.getCommand(f)
}else{if(!(f instanceof e.Command)){LOG.reportError(wixErrors.BAD_COMMAND,this.className,"setCommand",f);
return
}}this._commandParameter=d;
if(this._command){this._command.unregisterListener(this);
this._command=null
}if(f){this._command=f;
f.registerListener(this,null,this._onCommandStatusChanged);
if(this._commandName){delete this._commandName
}}else{if(this._commandName){e.registerCommandListenerByName(this._commandName,this,null,this._onCommandStatusChanged)
}}},getCommandName:function(){return this._command?this._command.getName():this._commandName
},getCommandParameter:function(){return this._commandParameter
},_onCommandStatusChanged:function(b){if(b.isEnabled()){this.enable()
}else{this.disable()
}},_onEnabled:function(){},_handleEnabled:function(){var d=this._view;
var e=d.tabIndex;
var f=d._savedTabIndex;
if(null===e||undefined===e){e=-1
}if(-1==e){if(f!==undefined){d.tabIndex=f
}else{if(this._canFocus){d.tabIndex=0
}}}if(this._canFocus){d.addClass("focusable")
}if(this._componentReady){this._onEnabled()
}},_onDisabled:function(){},_handleDisabled:function(){var c=this._view;
var d=c.tabIndex;
if(null===d||undefined===d){d=-1
}if(d>=0){c._savedTabIndex=d;
c.tabIndex=-1
}if(document.activeElement==c){c.blur()
}if(this._canFocus){c.removeClass("focusable")
}if(this._componentReady){this._onDisabled()
}},_onRenderingTriggerEvent:function(h){var f=this._view.isNodeDisplayed();
switch(h){case Constants.DisplayEvents.COLLAPSED:case Constants.DisplayEvents.REMOVED_FROM_DOM:this._isDisplayed=false;
this._newlyDisplayed=false;
break;
case Constants.DisplayEvents.SKIN_CHANGE:if(this._renderTriggers.contains(Constants.DisplayEvents.SKIN_CHANGE)){if(f){this._renderIfReady()
}else{this._skinSizeInvalidated=true
}}break;
case Constants.DisplayEvents.MOVED_IN_DOM:if(this._view.isNodeDisplayed()&&this._renderTriggers.contains(Constants.DisplayEvents.MOVED_IN_DOM)){this._renderIfReady()
}break;
default:var g=this._isDisplayed;
this._isDisplayed=f;
this._newlyDisplayed=this._newlyDisplayed||(!g&&this._isDisplayed);
var e=this._renderTriggers.contains(h)||this._renderTriggers.contains(Constants.DisplayEvents.DISPLAY_CHANGED);
if(this._newlyDisplayed&&(e||!this._areRenderingTriggersAttached||this._skinSizeInvalidated)){this._skinSizeInvalidated=false;
this._renderIfReady()
}this._addedToDom();
break
}},getIsDisplayed:function(){return this._isDisplayed
},_addedToDom:function(){},checkVisibility:function(){this._isDisplayed=this._view.isNodeDisplayed();
return this._isDisplayed
},_setDataField:function(c,d){this._data.set(c,d,true)
},_setMetaDataField:function(c,d){this._data.setMeta(c,d)
},getFocusNode:function(){var c=this._skinParts.view;
for(var d in this._skinPartsSchema){if(this._skinPartsSchema[d].focus){c=this._skinParts[d]||c
}}return c
},getSkinPart:function(b){return this._skinParts[b]
},getSkin:function(){return this._skin
},setComponentProperties:function(c){var d=this._properties;
this._properties=c;
c.addComponentWithInterest(this);
if(c&&c!=d){this._properties.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
}},getComponentProperty:function(b){if(!this._properties){this._createComponentProperties()
}return this._properties.get(b)
},setComponentProperty:function(f,d,e){if(!this._properties){this._createComponentProperties()
}this._properties.set(f,d,e)
},_createComponentProperties:function(){var d=this._compId;
var c=this._propertiesSchemaName;
if(!c){return null
}this._properties=W.ComponentData.addDataItem(d,{type:c},this);
this._properties.addComponentWithInterest(this);
this._view.setProperty("propertyQuery",d);
this._properties.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
},deleteComponentProperty:function(b){},_onComponentPropertyChange:function(c,d){},_loadComponentProperties:function(){},getComponentProperties:function(){if(!this._properties){this._createComponentProperties()
}return this._properties
},_registerSkinPartCommands:function(){var q=this._skinPartsSchema;
var m=this.injects().Commands;
for(var k in q){var p=q[k];
var o=this._skinParts[k];
var j=this._parseDataReference(p.command);
if(!o||!j){continue
}var s;
if(typeof(j)=="string"){s=m.getCommand(j)
}else{s=j
}if("view"==k||p.type==Constants.ComponentPartTypes.HTML_ELEMENT){var r=this._parseDataReference(p.commandParameter);
if(s){o._command=s
}else{o._commandName=j
}o._commandParameter=r;
var n=o.nodeName.toLowerCase();
if(n=="select"){o.addEvent(Constants.CoreEvents.CHANGE,this._elementChangeExecuteCommand)
}else{o.addEvent(Constants.CoreEvents.CLICK,this._elementExecuteCommand)
}}else{o.setCommand(s||j,p.commandParameter)
}}},_registerDataBindings:function(){var s=[];
var p=this._skinPartsSchema;
for(var k in p){var o=p[k];
var n=this._skinParts[k];
if(!n){continue
}var r=(o.type==Constants.ComponentPartTypes.HTML_ELEMENT);
var m=r?n:n.getViewNode();
var q=null;
var j=o.autoBindData||(m&&m.getAttribute("autoBindData"));
if(j){q={bindToData:j}
}else{j=o.autoBindDictionary||(m&&m.getAttribute("autoBindDictionary"));
if(j){q={bindToDictionary:j}
}else{j=o.autoBindThis||(m&&m.getAttribute("autoBindThis"));
if(j){q={bindToSelf:j}
}}}if(q){q.skinPart=k;
q.isView=r;
q.viewType="";
q.dictionaryFallback=o.dictionaryFallback;
s.push(q)
}}if(s.length){this._autoBoundParts=s
}},_parseDataReference:function(k){if(!k||(typeof(k)!="string")){return k
}var e=k;
try{var j=k.indexOf("this.");
if(0===j){try{e=this[k.substring(5)]
}catch(h){e=null
}if(!e){W.Utils.debugTrace(this.className+" unknown part data reference "+k)
}}else{j=k.indexOf("data.");
if(0===j){if(!this._data||!(e=this._data.get(k.substring(5)))){W.Utils.debugTrace(this.className+" missing data for skinpart "+k)
}}}}catch(g){W.Utils.debugTrace(this.className+" error processing partData "+k)
}return e
},_elementExecuteCommand:function(d){var c=this._command||(this._command=W.Commands.getCommand(this._commandName));
if(c){c.execute(this._commandParameter||d,this)
}},_elementChangeExecuteCommand:function(e){var f=this.value;
var d=this._command||(this._command=W.Commands.getCommand(this._commandName));
if(d){d.execute(f)
}},onDraggedToStage:function(){},hasChildren:function(){return false
}}};
W.BaseSkinClassData={name:"mobile.core.skins.BaseSkin",Class:{Binds:["_onStylePropChange"],initialize:function(){this._isDisposed=false
},_comps:[],_params:[{type:"domId",name:"Component ID",id:"compId",inherited:true}],_html:"<div></div>",_css:["base {}"],_viewNode:null,_updatePartsCallback:null,_skinParts:null,_inlineContainer:null,applyStyle:function(b){if(!b||this._style===b){return
}this._removeOldStyle();
this._addStyle(b);
this._render()
},_removeOldStyle:function(){if(this._style){this._style.removeEvent(Constants.StyleEvents.PROPERTY_CHANGED,this._onStylePropChange)
}delete this._style
},_addStyle:function(b){this._style=b;
this._style.addEvent(Constants.StyleEvents.PROPERTY_CHANGED,this._onStylePropChange)
},register:function(e,d,f){if(!this._isRegistered()){this._viewNode=e;
this._updatePartsCallback=d;
this._skinParamChangeCallback=f;
this._render()
}else{LOG.reportError(wixErrors.SKIN_MANAGER_RE_REGISTER,"mobile.core.skins.BaseSkin","register",e.getProperty("id"))
}},unRegister:function(){this._viewNode=null;
this.dispose()
},_isRegistered:function(){return(this._viewNode&&this._updatePartsCallback)
},getInlineContent:function(){if(!this._skinParts){return this._viewNode.getChildren()
}if(this._skinParts.inlineContent){return this._skinParts.inlineContent.getChildren()
}return null
},_render:function(){if(!this._isRegistered()){return
}var c=this.getInlineContent();
this._skinParts=this._buildSkin();
if(this._skinParts.inlineContent&&c){this._skinParts.inlineContent.empty();
for(var d=0;
d<c.length;
d++){c[d].insertInto(this._skinParts.inlineContent,"bottom",Constants.DisplayEvents.MOVED_IN_DOM)
}}this._updatePartsCallback(this._skinParts)
},_onStylePropChange:function(b){this.injects().Skins.stylePropertiesChangedForSkin(this.className,this._style,b.properties);
this._skinParamChangeCallback(b.properties)
},_informLogicOfParamChanges:function(){},_buildSkin:function(c){var d=this._viewNode;
if(c&&c.viewNode){d=c.viewNode
}this.injects().Skins.buildSkinCSS(this.className,this._style);
return this.injects().Skins.buildSkinHTML(this.className,d,this._style)
},getStyle:function(){return this._style
},getParams:function(){return this._params
},getCompPartsDefinition:function(){return this.compParts||{}
},getCompPartSkinName:function(d){var c=this.compParts;
return c&&c[d].skSin
},getUniqueClass:function(b){return this.injects().Skins.getUniqueClass(b,this.$className)
},dispose:function(){this._isDisposed=true;
this._updatePartsCallback=null;
this._removeOldStyle()
}}};
W.BaseClasses.DataItemBaseClassData={name:"mobile.core.managers.data.DataItemBase",Class:{Extends:Events,Binds:["fireDataChangeEvent"],Static:{METADATA_DEFAULTS:{isPreset:false,isHidden:false,description:""},getFieldsFilterArray:function(b){if(typeOf(b)=="array"){return b
}return Object.keys(b)
}},initialize:function(c,d){this._data=c;
if(c.type&&(typeof(c.type)!="string")){throw ("invalid data type. must be string")
}this._dataType=c.type;
this._dataManager=d||this.injects().Data;
this.componentsWithInterest=[]
},setData:function(e,f){var d=(this._data!==e);
this._data=e;
this._dataType=e.type;
d&&!f&&this.fireDataChangeEvent()
},setFields:function(b){Object.forEach(b,function(d,a){this.set(a,d,true)
}.bind(this));
this.fireDataChangeEvent(b,b)
},setMeta:function(e,f,d){if(e in this.METADATA_DEFAULTS){this._data.metaData=this._data.metaData||{};
this._data.metaData[e]=f;
if(d){this.fireDataChangeEvent(e,f)
}}else{LOG.reportError(wixErrors.INVALID_METADATA_FIELD,"DataItemBase","setMeta",e)()
}},set:function(e,f,d){f=this.injects().Utils.sanitizeUnicode(f);
if(this._data[e]!==f){this._data[e]=f;
this.setMeta("isPreset",false);
if(!d){this.fireDataChangeEvent(e,f)
}}},getFields:function(f){var e={};
var d=this.getFieldsFilterArray(f);
d.forEach(function(a){e[a]=this.get(a)
}.bind(this));
return e
},getData:function(){return this._data
},getType:function(){return this._data.type
},getMeta:function(d){if(d in this.METADATA_DEFAULTS){var c=this._data.metaData&&this._data.metaData[d];
if(c!==undefined){return c
}return this.METADATA_DEFAULTS[d]
}else{LOG.reportError(wixErrors.INVALID_METADATA_FIELD,"DataItemBase","getMeta",d)()
}},get:function(b){return this._data[b]
},fireDataChangeEvent:function(d,f){this._dataManager.markDirtyObject(this);
this._dataManager.flagDataChange();
var e=(d!==undefined)?[this,d,f]:[this];
this.fireEvent(Constants.DataEvents.DATA_CHANGED,e)
},toString:function(){return"[Data Object]"
},getDataManager:function(){return this._dataManager
},addComponentWithInterest:function(b){this.componentsWithInterest.include(b)
},removeComponentWithInterest:function(b){this.componentsWithInterest.erase(b)
}}};
W.BaseClasses.DataItemWithSchemaClassData={name:"mobile.core.managers.data.DataItemWithSchema",Class:{Extends:"mobile.core.managers.data.DataItemBase",Implements:[Events],Static:{FIELD_TYPE_DEFAULTS:{refList:[],ref:"",number:Number.NaN,string:"",color:"255,255,255,1","boolean":false,object:{},list:[]}},initialize:function(f,d,e){this._schema=f;
this._snapshot={};
this.parent(d,e);
this._setSchemaDefaults()
},reset:function(){for(var c in this._schema){var d=this._schema[c]["default"];
if(this._data[c]!=d){this.set(c,d)
}}},removeField:function(b){delete this._data[b]
},takeSnapshot:function(){var b={};
this._cloneBySchema(b,this._data);
this._snapshot=b
},restoreSnapshot:function(b){if(this._snapshot){this._cloneBySchema(this._data,this._snapshot);
this.discardSnapshot();
if(b!==false){this.fireDataChangeEvent()
}}else{LOG.reportError(wixErrors.DATA_MISSING_SNAPSHOT,"DataItem","restoreSnapshot",this._dataType)
}},discardSnapshot:function(){this._snapshot=null
},getSchema:function(){return this._schema
},setSchema:function(b){this._schema=b
},getFieldSchema:function(b){return this._schema[b]
},_setSchemaDefaults:function(){for(var h in this._schema){var g=this._schema[h];
if(g&&g["default"]){var e=this._data[h];
var f=this.get(h);
if(!e&&e!=f){this.set(h,f)
}}}},get:function(e){var g=this._data[e];
var h=this._schema[e];
if(g!==undefined&&g!==null){if(Constants.DataTypes.TYPE_RESOURCE_KEY==h){var f=this.getDataManager().getResourceManager();
if(f){g=f.get("EDITOR_LANGUAGE",g,g)
}}}else{g=this._getDefaultValue(e);
this._data[e]=g
}if("color"==h){return new W.Color(value)
}return g
},getFieldType:function(b){return this._schema[b]
},_getDefaultValue:function(f){var d=this._schema[f];
var e;
if(!d){LOG.reportError(wixErrors.SCHEMA_MISSING_KEY,"DataItemWithSchema","_getDefaultValue",[this._data,this._schema,f])();
return
}if(typeof d=="string"){e=this.FIELD_TYPE_DEFAULTS[d]
}else{if(d.hasOwnProperty("default")){e=d["default"]
}else{e=this.FIELD_TYPE_DEFAULTS[d.type]
}}return this._cloneDefaultObject(e)
},_cloneDefaultObject:function(b){if(b instanceof Array){return b.splice(0,0)
}if(typeof b=="object"){return Object.clone(b)
}return b
},_cloneBySchema:function(k,j){for(var f in this._schema){var h=j[f];
var g=typeof h;
if("object"==g){k[f]=Object.clone(h)
}else{k[f]=h
}}return k
},copySchemaFieldsFrom:function(d,c){this._cloneBySchema(this._data,d._data);
if(!c){this.fireDataChangeEvent()
}},copySchemaFieldsTo:function(d,c){this._cloneBySchema(d._data,this._data);
if(!c){d.fireDataChangeEvent()
}},setData:function(d,c){if(d===this._data){return
}if(!this._data){this.parent(d,c)
}else{if(this._data.type==d.type){d.id=this._data.id;
this.parent(d,false);
this._setSchemaDefaults();
if(c!=false){this.fireDataChangeEvent()
}}}}}};
W.BaseClasses.PropertiesItemClassData={name:"mobile.core.managers.data.PropertiesItem",Class:{Extends:"mobile.core.managers.data.DataItemWithSchema",initialize:function(g,e,f,h){this.parent(g,e,f);
this._ownerComponent=h
}}};
W.BaseClasses.StylePropertiesClassData={name:"mobile.core.managers.style.StyleProperties",Class:{Extends:Events,Binds:["_onThemePropertiesChange"],Static:{STYLE_PROPERTIES_FILTER:{color:["theme"],font:["theme"],radius:["value"],size:["value"],boxShadow:["value"]},PROPERTY_TYPE_EXTRA_PARAMS:{color:{alpha:{prefix:"alpha",defaultValue:1,type:"number"}},boxShadow:{isOn:{prefix:"boxShadowToggleOn",defaultValue:true,type:"boolean"}}}},initialize:function(g,h,e,f){if(g&&h&&e&&f){this._configStyle(g,h,e,f)
}},_configStyle:function(g,h,e,f){this.StyleClass=W.Classes.get("mobile.core.managers.style.StyleProperties");
this._isStyleRendered={};
this._groupId=h.get("id")+"-"+f.getNewGroupId();
this._topLevelStyle=f;
this._styleDataItem=h;
this._styleRawData=g;
g.properties=g.properties||{};
this._properties=g.properties;
this._propertiesTypes={};
this._propertiesSource={};
this._propertiesCounter={};
this._propertiesLangKey={};
g.groups=g.groups||{};
this._groups=g.groups;
this._groupsStyleObjects={};
this._changes={};
this.createStylesAndRawData(g,e);
W.Theme.getDataItem().addEvent(Constants.DataEvents.DATA_CHANGED,this._onThemePropertiesChange)
},getRawData:function(){return this._groups
},_onThemePropertiesChange:function(f,e){for(var g in e){for(var h in this._properties){if(this._propertiesSource[h]=="theme"&&this._properties[h]==g){this._firePropertyChangesEvent(h)
}}}},_firePropertyChangesEvent:function(b){this._changes[b]=this._propertiesTypes[b];
this.injects().Utils.clearCallLater(this._dispatchEventId);
this._dispatchEventId=this.injects().Utils.callLater(this._dispatchChangeEventAndResetChanges,[],this,50)
},_dispatchChangeEventAndResetChanges:function(){this.fireEvent(Constants.StyleEvents.PROPERTY_CHANGED,{style:this,properties:this._changes});
this._changes={}
},isStyleRenderedForSkin:function(b){return this._isStyleRendered[b]||false
},setStyleRenderFlag:function(d){for(var c in this._isStyleRendered){this.setStyleRenderFlagForSkin(c,d)
}},setStyleRenderFlagForSkin:function(c,d){this._isStyleRendered[c]=d
},invalidateStyle:function(){this.setStyleRenderFlag(false);
for(var b in this._groupsStyleObjects){this._groupsStyleObjects[b].invalidateStyle()
}},get:function(b){return this._properties[b]
},getStyleByGroupName:function(b){return this._groupsStyleObjects[b]
},set:function(c,d){this._properties[c]=d;
this._styleDataItem.fireDataChangeEvent();
this._firePropertyChangesEvent(c)
},getPropertyExtraParamValue:function(h,f){var k=this.getPropertyType(h);
var g=this._getExtraParamDefinitionByType(k,f);
if(!g){LOG.reportError("STYLE_EXTRA_PARAM_DEFINITION_MISSING","StyleProperties","setPropertyExtraParamValue",k+"-"+f)();
return
}var j=this._getPropertyExtraParamId(h,g.prefix);
return this._convertStringToType(this._properties[j],g.type)
},setPropertyExtraParamValue:function(m,h,n,k){var p=this.getPropertyType(m);
var j=this._getExtraParamDefinitionByType(p,h);
if(!j){LOG.reportError("STYLE_EXTRA_PARAM_DEFINITION_MISSING","StyleProperties","setPropertyExtraParamValue",p+"-"+h)();
return
}var o=this._getPropertyExtraParamId(m,j.prefix);
this._properties[o]=String(n);
this._styleDataItem.fireDataChangeEvent();
if(k){this._firePropertyChangesEvent(m)
}},_convertStringToType:function(c,d){switch(d){case"number":c=Number(c);
break;
case"boolean":c=String(c).toLowerCase()==="true";
break
}return c
},_getExtraParamDefinitionByType:function(c,d){return this.PROPERTY_TYPE_EXTRA_PARAMS[c]&&this.PROPERTY_TYPE_EXTRA_PARAMS[c][d]
},_getPropertyExtraParamId:function(c,d){return d+"-"+c
},isPropertyAvailable:function(b){return this._propertiesTypes.hasOwnProperty(b)
},createStylesAndRawData:function(c,d){this._topLevelStyle.unprocessedSkins.add(d);
W.Skins.getSkin(d,function(u){var b=new u();
var w=b.getParams();
for(var t=0;
t<w.length;
t++){var r=w[t].id;
var j=this._getParamData(w[t]);
if(j.source!="unknown"&&!j.ignore){this._properties[r]=this._properties[r]||w[t].defaultTheme||w[t].defaultValue;
this._propertiesTypes[r]=j.type;
this._propertiesSource[r]=j.source;
this._propertiesLangKey[r]=j.langKey;
this._increasePropertyUseCount(r);
this._setPropertyExtraParams(r,j.type)
}}var y=b.getCompPartsDefinition();
var s=Object.getLength(y);
if(s==0){this._topLevelStyle.unprocessedSkins.remove(d);
return
}for(var q in y){var x=y[q].skin;
var z=y[q].styleGroup;
if(!z||z.toLowerCase()=="undefined"){continue
}if(z=="inherit"){this.createStylesAndRawData(c,x)
}else{if(!c.groups[z]){c.groups[z]={properties:{},groups:{}}
}var a=c.groups[z];
if(!this._groupsStyleObjects[z]){var v=new this.StyleClass(a,this._styleDataItem,x,this._topLevelStyle);
this._groupsStyleObjects[z]=v
}else{this._groupsStyleObjects[z].createStylesAndRawData(a,x)
}}}this._topLevelStyle.unprocessedSkins.remove(d)
}.bind(this))
},_getParamData:function(k){var f={source:"unknown"};
if(k.defaultTheme){f.source="theme";
f.value=k.defaultTheme;
f.type=W.Theme.getPropertyType(k.defaultTheme)
}else{if(k.defaultValue){f.source="value";
f.value=k.defaultValue;
f.type=this._getGeneralTypeFromCssType(k.type)
}}f.langKey=k.lang||k.id;
var h=(k.noshow==true);
var j=this.STYLE_PROPERTIES_FILTER[f.type];
var g=j&&j.contains(f.source);
f.ignore=(h==true||g!=true);
return f
},_increasePropertyUseCount:function(b){if(this._propertiesCounter[b]){this._propertiesCounter[b]+=1
}else{this._propertiesCounter[b]=1
}},_garbageCollection:function(){for(var c in this._properties){if(!this._propertiesCounter[c]){delete this._properties[c]
}}this.setStyleRenderFlag(false);
for(var d in this._groupsStyleObjects){this._groupsStyleObjects[d]._garbageCollection()
}},_getGeneralTypeFromCssType:function(b){return Constants.SkinParamCssTypesToGeneralTypesMap[b]||"unknown"
},_setPropertyExtraParams:function(j,m){var k=this.PROPERTY_TYPE_EXTRA_PARAMS[m];
if(k){for(var g in k){var h=k[g];
var n=this._getPropertyExtraParamId(j,h.prefix);
this._properties[n]=this._properties[n]||h.defaultValue;
this._propertiesTypes[n]=m+"-"+g;
this._increasePropertyUseCount(n)
}}},getId:function(){return this._groupId
},getProperties:function(){return this._properties
},getGroups:function(){return this._groupsStyleObjects
},getPropertyType:function(b){return this._propertiesTypes[b]
},getPropertySource:function(b){return this._propertiesSource[b]
},getPropertyLangKey:function(b){return this._propertiesLangKey[b]
}}};
Constants.StyleEvents={SKIN_CHANGED:"skinChange",READY:"styleReady",PROPERTY_CHANGED:"propertyChange"};
W.BaseClasses.StyleClassData={name:"mobile.core.managers.style.Style",Class:{Extends:"mobile.core.managers.style.StyleProperties",initialize:function(b){if(b){this._setStyleDataItem(b)
}},_setStyleDataItem:function(b){this._skinName=b.get("skin");
this._resetDataCollection();
if(!b.get("style")){b.set("style",{})
}this._configStyle(b.get("style"),b,this._skinName,this)
},_resetDataCollection:function(){this._groupIdCounter=0;
var b=this._onProcessAllSkins.bind(this);
this.unprocessedSkins={map:{},size:0,add:function(a){if(this.map[a]){this.map[a]=1
}else{this.map[a]++
}this.size++
},remove:function(a){if(this.map[a]){this.map[a]--
}else{}this.size--;
if(this.size==0){b()
}}}
},_onProcessAllSkins:function(){this._garbageCollection();
if(this._oldSkinName!=this._skinName){this.fireEvent(Constants.StyleEvents.SKIN_CHANGED)
}this.fireEvent(Constants.StyleEvents.READY,this)
},getNewGroupId:function(){this._groupIdCounter=this._groupIdCounter||0;
this._groupIdCounter++;
return this._groupIdCounter
},setSkin:function(b){if(this._skinName==b){return false
}this.setStyleRenderFlag(false);
this._oldSkinName=this._skinName;
this._skinName=b;
this._styleDataItem.set("skin",b);
this._styleRawData.properties={};
this._properties=this._styleRawData.properties;
this._propertiesTypes={};
this._propertiesSource={};
this._propertiesCounter={};
this._propertiesLangKey={};
this._styleRawData.groups={};
this._groups=this._styleRawData.groups;
this._groupsStyleObjects={};
this.createStylesAndRawData(this._styleRawData,b);
return true
},getSkin:function(){return this._skinName
},getId:function(){return this._styleDataItem.get("id")
}}};
W.BaseClasses.SkinParserClassData={name:"mobile.core.managers.skin.SkinParser",Class:{parseSkinData:function(e){var B=e.name;
var z=e.Class||{};
var x=z._params||[];
var t=z._html||"";
var s=z._css||[];
var q=[];
var v={};
var y={};
var u=this._addStylePlaceHolder(this.getSkinCSSName(B));
x=this._processSkinParams(x,B);
for(var w=0;
w<s.length;
++w){var A=s[w];
if(!A){var C="";
try{C=s.join(",")
}catch(r){}LOG.reportError(wixErrors.SKIN_PROBLEM_WITH_RULE,this.className,"_registerSkinData",B+"("+w+") : "+C)
}else{this._processSkinCssClass(A,x,u,y,v,q)
}}return{params:x,html:t,css:q,compParts:z.compParts||{},skinPartClasses:v,skinSpecificClasses:y,skinCSSName:u,CSSBuildFlags:{},canFocus:!!z.canFocus}
},getSkinCSSName:function(b){return b.replace(/\./g,"_")
},_processSkinParams:function(h,g){for(var k=0;
k<h.length;
++k){var j=h[k];
if(j.defaultParam){refLoop:for(var f=0;
f<h.length;
++f){if(h[f].id==j.defaultParam){j.defaultParam=h[f];
break refLoop
}}if(typeof j.defaultParam=="string"){LOG.reportError(wixErrors.SKIN_PARAM_REF_NOT_FOUND,g,"_processSkinParams",j.id)();
delete j.defaultParam;
j.defaultValue=""
}}}return h
},_processSkinCssClass:function(j,w,s,v,t,r){var z=j.indexOf("{");
var q=j.lastIndexOf("}");
if(z!=-1&&q!=-1&&(z<q-1)){var y=j.substr(0,z);
var o=j.substring(z+1,q);
var x=this._getParamsUsed(o,w);
var p=y.split(",");
for(var u=0;
u<p.length;
++u){y=this._processSkinCssSelector(p[u],s,v,t);
r.push({selector:y,rules:o,params:x})
}}},_processSkinCssSelector:function(k,q,m,n){var j=this._convertCssSelector(k,q,m,n);
var r=k.length?k.charAt(0):"";
var o=(r=="["||r==":"||r==""||r=="{"||r=="."||r==">");
if(o||(j==k)){var p=o?"":" ";
j="."+q+p+j
}return j
},_convertCssSelector:function(r,m,q,o){var n=/%(\.?[a-z0-9]+)%/i;
var j,s,p;
j=r.match(n);
while(j){if(j.length<2){break
}s=j[1];
var k=this.getUniqueClass(s,m);
if(k.type=="class"){q[s.substring(1)]=k.uniqueClass
}else{o[s]=k.uniqueClass
}r=r.replace(n,"."+k.uniqueClass);
j=r.match(n)
}return r
},getUniqueClass:function(e,h){var f={};
if(e.charAt(0)=="."){var g=e.substring(1);
f.uniqueClass=h+"-c-"+g;
f.type="class"
}else{f.uniqueClass=h+"-"+e;
f.type="skinPart"
}return f
},_getParamsUsed:function(m,n){var p=[];
if(!m||(!n||n.length===0)){return p
}for(var q=0,k=n.length;
q<k;
++q){if(m.indexOf("["+n[q].id+"]")!=-1){p[n[q].id]=n[q]
}}var r={};
for(var j in p){var o=p[j];
if(o.defaultParam){while(o.defaultParam!==undefined){o=o.defaultParam
}r[o.id]=o
}}return Object.values(Object.merge(p,r))
},_addStylePlaceHolder:function(b){return b+Constants.skinManager.STYLE_CSS_PLACEHOLDER
}}};
(function(){var b;
W.BaseClasses.SkinRendererClassData={name:"mobile.core.managers.skin.SkinRenderer",Class:{initialize:function(){this._stylesheet=this._generateSkinsStylesSheet()
},_replaceStylePlaceHolder:function(d,a){return d.split(Constants.skinManager.STYLE_CSS_PLACEHOLDER).join(a)
},registerSkinCSSNow:function(f,g){var h=f.css;
for(var a=0;
a<h.length;
++a){this.updateSkinCSSClass(h[a].selector,h[a].rules,h[a].params,f.params,g)
}},updateSkinCSSClass:function(s,e,o,a,w){styleId=this.getStyleId(w);
for(var r=0;
r<o.length;
++r){var v=o[r];
var u=v.id;
var t=this._getParamValue(v,w);
var q=this._paramValueToCss(t,v);
if(q===null){LOG.reportError(wixErrors.SKIN_PARAM_NOT_PROVIDED,this.className,"updateSkinCSSClass","param"+u)();
q=""
}e=e.split("["+u+"]").join(q)
}s=this._replaceStylePlaceHolder(s,styleId);
try{this._stylesheet.updateRule(s,e)
}catch(p){LOG.reportError(wixErrors.SKIN_CLASS_RULE_ERROR,this.className,"updateSkinCSSClass",s+"{"+e+"}")
}},getParamValue:function(a,d){return this._getParamValue(a,d)
},_getParamValue:function(p,o){var k=null;
if(p.defaultParam){var j=p.defaultParam;
return this._applyParamMutators(this._getParamValue(j,o),p)
}if(o&&o.get(p.id)){var a=o.getPropertySource(p.id);
k=o.get(p.id);
if(a=="theme"){k=this.injects().Theme.getProperty(k)
}k=this._castToType(k,p);
k=this._addExtraToParamByType(p,k,o);
return this._applyParamMutators(k,p)
}if(p.defaultTheme){var m=p.defaultTheme;
var n=W.Theme.getProperty(m);
n=this._castToType(n,p);
return this._applyParamMutators(n,p)
}if(p.defaultValue){k=this._castToType(p.defaultValue,p);
return this._applyParamMutators(k,p)
}return null
},_castToType:function(d,a){switch(a.type){case Constants.SkinParamTypes.COLOR:case Constants.SkinParamTypes.COLOR_ALPHA:case Constants.SkinParamTypes.BG_COLOR:d=new W.Color(d);
break;
case Constants.SkinParamTypes.SIZE:d=new W.Size(d);
break;
case Constants.SkinParamTypes.BOX_SHADOW:d=new W.BoxShadow(d);
break;
case Constants.SkinParamTypes.BORDER_RADIUS:d=new W.BorderRadius(d);
break
}return d
},_addExtraToParamByType:function(a,j,k){var g=k.getPropertyType(a.id);
if(g=="color"){var h=k.getPropertyExtraParamValue(a.id,"alpha");
j.setAlpha(h)
}if(g=="boxShadow"){j.setToggleOn(k.getPropertyExtraParamValue(a.id,"isOn")===true)
}return j
},_applyParamMutators:function(h,j){if(j.mutators){for(var k=0;
k<j.mutators.length;
k+=2){var g=h[j.mutators[k]];
if(g&&typeof g=="function"){var a=j.mutators[k+1];
if(!a||typeOf(a)!="array"){a=(!a)?[]:[a]
}h=g.apply(h,a)
}else{LOG.reportError(wixErrors.SKIN_PARAM_MUTATOR_FUNC_NOT_FOUND,"SkinRenderer","_applyParamMutators",g)()
}}}return h
},_paramValueToCss:function(j,n){var k=Constants.skinManager.FEATURES;
if(j!==undefined&&j!==null){n=n||{};
switch(n.type){case Constants.SkinParamTypes.BG_COLOR:var a=j;
var m=a.getAlpha();
if(m>0){if(Modernizr.rgba===true&&m<1){j="background-color:rgba("+a.getRgba()+");"
}else{j="background-color:"+a.getHex(false)+";";
if(k.filter_alpha&&m<1){j+="filter:alpha(opacity="+(m*100)+");"
}}}else{j="background-color:transparent;"
}break;
case Constants.SkinParamTypes.BORDER_RADIUS:var h=W.Utils.getCSSBrowserFeature("border-radius");
if(h){j=h+":"+j+";"
}else{j=""
}break;
case Constants.SkinParamTypes.TRANSITION:h=W.Utils.getCSSBrowserFeature("transition");
if(h){j=h+":"+j+";"
}else{j=""
}break;
case Constants.SkinParamTypes.BOX_SHADOW:if(W.Utils.getCSSBrowserFeature("box-shadow")){j=W.Utils.getCSSBrowserFeature("box-shadow")+":"+j.getCssValue()+";"
}else{j=""
}break;
case Constants.SkinParamTypes.FONT:j="font:"+j.getCssValue()+";";
break;
case Constants.SkinParamTypes.SIZE:j=j.getCssValue();
break;
case Constants.SkinParamTypes.COLOR:j=(j.getHex!==undefined)?j.getHex(false):j;
break;
case Constants.SkinParamTypes.COLOR_ALPHA:a=j;
m=a.getAlpha();
if(m>0){if(Modernizr.rgba===true&&m<1){j="rgba("+a.getRgba()+")"
}else{j=a.getHex(false)
}}else{j="transparent"
}break
}return j
}else{return null
}},buildSkinHTML:function(a,t,F){styleId=this.getStyleId(F);
var v=a.html;
var w=this._replaceStylePlaceHolder(a.skinCSSName,styleId);
t.empty();
t.set("html",v);
if(a.canFocus){t.tabIndex=0
}else{if(t.tabIndex===0){t.tabIndex=-1
}}if(t._wixCSSName){t.removeClass(t._wixCSSName);
delete t._wixCSSName
}if(w){t.addClass(w);
t._wixCSSName=w
}var G={view:t};
var B=$$(t.getElements("[skinPart]"));
var D=a.compParts||{};
var x=a.skinPartClasses||{};
for(var y=0;
y<B.length;
++y){var z=B[y];
var H=z.getAttribute("skinPart");
G[H]=z;
var I=x[H];
if(I){z.addClass(this._replaceStylePlaceHolder(I,styleId))
}var E=z.getAttribute("skin");
if(!E&&D[H]&&D[H].skin){E=D[H].skin;
if(E){z.setAttribute("skin",E)
}}}var A=a.skinSpecificClasses||{};
for(var C in A){var u=$(t).getElements("."+C);
u.removeClass(C).addClass(this._replaceStylePlaceHolder(A[C],styleId))
}return G
},getStyleId:function(a){return(a&&a.getId())||""
},_skinStyleNodeId:null,_generateSkinsStylesSheet:function(){if(!b){b=W.Utils.createStyleSheet("WIX_SKIN_STYLES")
}this._skinStyleNodeId=b.styleNode.get("id");
return b
},getCssNodeId:function(){return this._skinStyleNodeId
}}}
})();
W.BaseClasses.BufferFunctionClassData={name:"mobile.core.managers.utils.BufferFunction",Class:{Binds:["_wrapperFunction"],initialize:function(d,c){this._isFirstCallDelayed=false;
this._bufferTime=1000;
this._lastCallArguments;
this._replaceFunctionAndSaveOriginal(d,c);
this._clearBuffer()
},setBufferTime:function(b){this._bufferTime=b
},getBufferTime:function(b){return this._bufferTime
},setIsFirstCallDelayed:function(b){this._isFirstCallDelayed=b
},getIsFirstCallDelayed:function(b){return this._isFirstCallDelayed
},_replaceFunctionAndSaveOriginal:function(d,c){this._scope=d;
this._originalFunction=d[c];
d[c]=this._wrapperFunction
},_wrapperFunction:function(){this._lastCallArguments=arguments;
this._tryCallingFunction()
},_tryCallingFunction:function(){if(this.isReadyToCall()){this.callOriginalFunction();
this._delayCall(this._clearBuffer)
}else{this._delayCall(this._clearBufferAndTryCallingFunction)
}},callOriginalFunction:function(){this._originalFunction.apply(this._scope,this._lastCallArguments)
},isReadyToCall:function(){return(!this._callTimerId&&this._isFirstCallDelayed===false)
},_clearBuffer:function(){this._callTimerId=undefined
},_clearBufferAndTryCallingFunction:function(){this._clearBuffer();
this._tryCallingFunction()
},_delayCall:function(b){this.injects().Utils.clearCallLater(this._callTimerId);
this._callTimerId=this.injects().Utils.callLater(b,[],this,this._bufferTime)
}}};
W.BaseClasses.InputValidatorsClassData={name:"wysiwyg.editor.utils.InputValidators",Class:{Binds:[],initialize:function(a,b){},charactersValidator:function(c){var b=new RegExp("["+Constants.Page.INVALID_CHARACTERS+"]");
var a=c.match(b);
if(a!==null){return W.Resources.get("EDITOR_LANGUAGE","INPUT_INVALID_CHARACTERS")+" ("+a.join()+")"
}}}};
W.Managers.ClassManager=function(){this._classes={};
this._classesData=[];
this._traits={};
this._pendingNewClassesQueue=new W.Queue();
this._pendingClassesList={};
this._callbacksQueue=new W.Queue();
this._traitsQueue=new W.Queue();
this._dynamicScriptLoading=false;
this._registerBaseClasses()
};
W.Managers.ClassManager.prototype={constructor:W.Managers.ClassManager,newTrait:function(b){if(!this._validateTraitData(b)){return false
}if(!this._getDependencies(b)){return false
}b.Class=b.trait;
this._prepClassData(b);
b.trait=b.Class;
this._traits[b.name]=new WClass(b.trait,b.name);
this._classes[b.name]=this._traits[b.name];
this._pendingNewClassesQueue.getQueue(b.name).forEach(this._registerPending.bind(this));
this._pendingNewClassesQueue.removeKey(b.name);
this._callbacksQueue.getQueue(b.name).forEach(function(a){a(this.get(b.name))
}.bind(this));
this._callbacksQueue.removeKey(b.name);
return true
},_validateTraitData:function(b){if(!b||typeof(b.trait)!=="object"){LOG.reportError(wixErrors.TRAIT_INVALID,"ClassManager","newTrait","traitData.trait is not an object");
return false
}if(!b.name||!instanceOf(b.name,String)){LOG.reportError(wixErrors.TRAIT_INVALID,"ClassManager","newTrait","Trait name not defined");
return false
}if(instanceOf(this._traits[b.name],Object)){LOG.reportError(wixErrors.TRAIT_DOUBLE_NAME,"ClassManager","newTrait",b.name);
return false
}if(instanceOf(this._classes[b.name],WClass)){LOG.reportError(wixErrors.TRAIT_DOUBLE_CLASS_NAME,"ClassManager","newTrait",b.name);
return false
}return true
},newClass:function(f){if(!this._validateClassData(f)){return false
}if(!this._getDependencies(f)){return false
}this._prepClassData(f);
this._classes[f.name]=new WClass(f.Class,f.name);
var e=this._registerPending.bind(this);
var d=this._pendingNewClassesQueue.getQueue(f.name);
this._pendingNewClassesQueue.removeKey(f.name);
d.forEach(e);
if(instanceOf(f.onClassReady,Function)){f.onClassReady(this.get(f.name))
}this._callbacksQueue.getQueue(f.name).forEach(function(a){a(this.get(f.name))
}.bind(this));
this._callbacksQueue.removeKey(f.name);
return this.get(f.name)
},_validateClassData:function(c){if(!c||typeof(c.Class)!=="object"){LOG.reportError(wixErrors.CLASS_INVALID_TYPE,"ClassManager","newClass",c.name+"");
return false
}if(!c.name||!instanceOf(c.name,String)){LOG.reportError(wixErrors.CLASS_INVALID_NAME,"ClassManager","newClass")();
return false
}var d=c.name.split(".");
l=d.length-1;
for(i=0;
i<l;
i++){if(d[i].length===0){LOG.reportError(wixErrors.CLASS_INVALID_NAME,"ClassManager","newClass",c.name+"");
return false
}if(!d[i].test(/^[a-z][a-z0-9_]*$/)){LOG.reportError(wixErrors.CLASS_INVALID_NAME,"ClassManager","newClass",c.name+" ("+d[i]+")");
return false
}}if(!d[l].test(/^[A-Z][A-Za-z0-9_]*$/)){LOG.reportError(wixErrors.CLASS_INVALID_NAME,"ClassManager","newClass",c.name);
return false
}if(instanceOf(this._classes[c.name],WClass)){LOG.reportError(wixErrors.CLASS_NAME_ALREADY_EXIST,"ClassManager","newClass",c.name+"");
return false
}if(instanceOf(this._traits[c.name],Object)){LOG.reportError(wixErrors.CLASS_DOUBLE_TRAIT_NAME,"ClassManager","newClass",c.name+"");
return false
}return true
},_registerPending:function(b){if(!this._classes[b.name]){if("Class" in b){this.newClass(b)
}else{if("trait" in b){this.newTrait(b)
}else{LOG.reportError(wixErrors.CLASS_INVALID_PENDING_OBJECT,this.className,"_registerPending","")
}}}},_applyTraits:function(b){b.traits=b.traits||[];
b.traits.forEach(function(a){b.Class.Implements.push(this._traits[a])
}.bind(this))
},_prepClassData:function(f){var e={};
if(f.Class.Extends){e.Extends=f.Class.Extends
}e.Implements=f.Class.Implements||[];
for(var d in f.Class){if(d!="Extends"&&d!="Implements"){e[d]=f.Class[d]
}}f.Class=e;
if(instanceOf(f.Class.Extends,String)){f.Class.Extends=this.get(f.Class.Extends)
}f.Class._instanceOf=f.Class.Extends&&f.Class.Extends.prototype._instanceOf||[];
f.Class._instanceOf.push(f.name);
f.Class.imports={};
if(f.Class.Extends&&f.Class.Extends.prototype.imports){Object.forEach(f.Class.Extends.prototype.imports,function(a,b){f.Class.imports[b]=a
})
}f.Class.className=f.name;
f.imports=f.imports||[];
f.imports.forEach(function(a){var c=a.split(".");
var b=c.getLast();
if(f.Class.imports[b]&&f.Class.imports[b]!==this.get(a)){f.Class.imports[a]=this.get(a)
}else{f.Class.imports[b]=this.get(a)
}}.bind(this));
this._applyTraits(f);
f.Class.injects=function(){return W.Managers.getManagers()
}
},_getDependencies:function(f){if(!instanceOf(f.imports,Array)){f.imports=instanceOf(f.imports,String)?[f.imports]:[]
}if(!instanceOf(f.traits,Array)){f.traits=[]
}if(f.Class&&instanceOf(f.Class.Extends,String)){f.imports.push(f.Class.Extends)
}delete this._pendingClassesList[f.name];
var d=true;
f.imports.forEach(function(a){if(!instanceOf(this.get(a,function(){}),WClass)){this._pendingNewClassesQueue.addUnique(a,f);
this._pendingClassesList[f.name]=true;
d=false
}}.bind(this));
var e=true;
f.traits.forEach(function(a){if(!this.getTrait(a)){this._pendingNewClassesQueue.addUnique(a,f);
this._pendingClassesList[f.name]=true;
e=false
}}.bind(this));
return(d&&e)
},get:function(d,c){if(this._classes[d]){if(c){W.Utils.callLater(c,[this._classes[d]])
}return this._classes[d]
}else{if(typeof c=="function"){this._callbacksQueue.add(d,c)
}if(this._headScriptsCheckTimeout){W.Utils.clearCallLater(this._headScriptsCheckTimeout)
}this._headScriptsCheckTimeout=W.Utils.callLater(this._checkMissingScripts,null,this,30);
return null
}},getTrait:function(d,c){c=c||function(){};
if(this._traits[d]){if(c){W.Utils.callLater(c,[this._traits[d]])
}return this._traits[d]
}else{this._callbacksQueue.add(d,c);
if(this._headScriptsCheckTimeout){W.Utils.clearCallLater(this._headScriptsCheckTimeout)
}this._headScriptsCheckTimeout=W.Utils.callLater(this._checkMissingScripts,null,this,30);
return null
}},setDynamicScriptLoading:function(b){this._dynamicScriptLoading=b;
if(this._callbacksQueue.getQueueKeys().length>0){this._checkMissingScripts()
}},getCurrentPendingDependencies:function(d){var e=[];
var f=this._pendingNewClassesQueue.map;
Object.forEach(f,function(a,b){a.forEach(function(c){if(c.name==d){e.push(b)
}})
});
return e
},_checkMissingScripts:function(){if(!this._dynamicScriptLoading){return
}var p=(this._callbacksQueue.getQueueKeys()).filter(function(a){return(typeof a==="string")
});
if(!p.length){return
}var k=document.scripts||Array.from(document.getElementsByTagName("script"));
var m={};
for(var q=0,r=k.length;
q<r;
q++){var j=k[q].src;
var o=j.indexOf("?");
if(o>0){j=j.substring(0,o)
}o=j.indexOf("/javascript/");
j=j.substring(o+12);
m[j.toLowerCase()]=1
}var n=Object.map(p,function(b){var a=b.replace(/\./g,"/");
if(b.test(/^nopkg|^test/)||!a){return""
}return a+".js"
});
Object.each(n,function(a){if(a&&!(a.toLowerCase() in m)){if(a.indexOf("wysiwyg/")==0&&a.indexOf("/skins/")>0){this._loadClass(serviceTopology.staticSkinUrl+"/javascript/"+a)
}else{this._loadClass(serviceTopology.scriptsRoot+"/javascript/"+a)
}}},this);
delete this._headScriptsCheckTimeout
},_loadClass:function(d){var f=W.Utils.getAntiCacheSuffix();
var e=new Element("script",{src:d+f,type:"text/javascript"});
return e.inject(document.head)
},clone:function(){var b=new W.Managers.ClassManager();
b._classes=Object.clone(this._classes);
b._traits=Object.clone(this._traits);
b.setDynamicScriptLoading(this._dynamicScriptLoading);
return b
},getClassStatus:function(b){if(this._classes[b]){return"ready"
}if(this._pendingClassesList[b]){return"pending"
}return"missing"
},isReady:function(){var c=Object.some(this._pendingClassesList,function(b,f,a){return true
});
var d=this._callbacksQueue.hasQueue();
return !(d||c)
},naiveInstanceOf:function(c,d){if(!c){return false
}if(!instanceOf(d,String)&&instanceOf(c,d)){return true
}if(!instanceOf(d,String)){d=d.prototype.className
}if(c._instanceOf===undefined||d===undefined){return false
}return c._instanceOf.some(function(a){return a==d
})
},newClasses:function(b){Object.forEach(b,this.newClass.bind(this))
},_registerBaseClasses:function(){if(W.BaseClasses){this.newClasses(W.BaseClasses);
delete W.BaseClasses
}},removeClass:function(b){delete this._classes[b]
}};
(function(){Constants.SkinParamTypes={BORDER_RADIUS:"cssBorderRadius",BG_COLOR:"cssBgColor",BOX_SHADOW:"boxShadow",COLOR:"color",COLOR_ALPHA:"color_alpha",FONT:"cssFont",SIZE:"size",OTHER:"cssStr",URL:"url",TRANSITION:"transition"};
Constants.SkinParamCssTypesToGeneralTypesMap={cssBorderRadius:"radius",cssBgColor:"color",boxShadow:"boxShadow",color:"color",color_alpha:"color",cssFont:"font",size:"size",cssStr:"string",url:"url",transition:"transition"};
Constants.skinManager={STYLE_CSS_PLACEHOLDER:"[STYLE_PH]",FEATURES:{}};
(function(){var c=new Element("div");
var d=function(b,a,f){c.style.cssText=a;
Constants.skinManager.FEATURES[b]=f(c)
};
d("filter_alpha","filter:alpha(opacity=0.9);",function(a){return(a.style.filter!=undefined&&a.style.filter.indexOf("alpha")!=-1)
});
d("opacity","opacity:0.7;",function(a){return(a.style.opacity!=undefined&&a.style.opacity=="0.7")
});
d("background-color_rgba","background-color:rgba(255,0,0,0.5);",function(a){return(a.style.backgroundColor!=undefined&&a.style.backgroundColor.indexOf("rgba")!=-1)
});
d("border-radius","border-top-right-radius:0.1em;",function(a){return(a.style.borderTopRightRadius!=undefined&&a.style.borderTopRightRadius.indexOf("0.1em")!=-1)
});
d("-webkit-border-radius","-webkit-border-top-right-radius:0.2em;",function(a){return(a.style.webkitBorderTopRightRadius!=undefined&&a.style.webkitBorderTopRightRadius.indexOf("0.2em")!=-1)
});
d("-moz-border-radius","-moz-border-radius-topright:0.3em;",function(a){return(a.style.MozBorderRadiusTopright!=undefined&&a.style.MozBorderRadiusTopright.indexOf("0.3em")!=-1)
})
})();
W.Managers.SkinManager=new WClass({className:"SkinManager",Binds:["buildSkinCSS","_onThemeChange","_checkThemePropChanges","_checkStylePropChanges"],initialize:function(){this._SkinParserClass=W.Classes.get("mobile.core.managers.skin.SkinParser");
this._SkinRendererClass=W.Classes.get("mobile.core.managers.skin.SkinRenderer");
this._skinParser=new this._SkinParserClass();
this._skinRenderer=new this._SkinRendererClass();
this._skinQue=new W.Queue();
this._skinClassMap={};
this._skinDataMap={};
if(W.Classes.getClassStatus("mobile.core.skins.BaseSkin")=="missing"){this.newSkin(W.BaseSkinClassData)
}W.Theme.addEvent("propertyChange",this._onThemeChange)
},_skinDataMap:null,newSkin:function(m){if(this._skinClassMap[m.name]||this._skinDataMap[m.name]){LOG.reportError(wixErrors.SKIN_ALREADY_EXIST,this.className,"newSkin",m.name+"")
}var n=m.Class;
var h=(m.imports||[]);
m.imports=h;
var k=n.compParts||{};
for(var p in k){var o=k[p].skin;
if(o&&h.indexOf(o)<0){h.push(o)
}}if(m.name!="mobile.core.skins.BaseSkin"&&!instanceOf(n.Extends,String)){n.Extends="mobile.core.skins.BaseSkin"
}this._skinDataMap[m.name]=this._skinParser.parseSkinData(m);
m.onClassReady=function(a){this._onSkinReady(a,m.name)
}.bind(this);
var j=W.Classes;
j.newClass(m)
},getSkin:function(d,c){if(this._skinClassMap[d]){W.Utils.callLater(c,[this._skinClassMap[d]]);
return this._skinClassMap[d]
}else{this._skinQue.add(d,c);
W.Classes.get(d,function(){});
return null
}},_onSkinReady:function(c,d){this._skinClassMap[d]=c;
this._skinQue.getQueue(d).forEach(function(a){a(c)
});
this._skinQue.removeKey(d)
},_$getCssId:function(){return this._skinRenderer.getCssNodeId()
},clone:function(){var b=new W.Managers.SkinManager();
Object.forEach(this._skinClassMap,function(d,a){b._skinClassMap[a]=d
});
Object.forEach(this._skinDataMap,function(d,a){b._skinDataMap[a]=d
});
return b
},isReady:function(){return(this._skinClassMap["mobile.core.skins.BaseSkin"]&&!this._skinQue.hasQueue())
},buildSkinCSS:function(e,d){var f=this._skinDataMap[e];
if(!f){LOG.reportError(wixErrors.SKIN_MANAGER_NO_DATA_FOR_SKIN,"mobile.core.managers.SkinManager","buildSkinCSS",e);
return
}styleId=this._skinRenderer.getStyleId(d);
if(f.CSSBuildFlags[styleId]||(d&&d.isStyleRenderedForSkin(e))){return
}if(d){d.setStyleRenderFlagForSkin(e,true)
}else{f.CSSBuildFlags[styleId]=true
}this._skinRenderer.registerSkinCSSNow(f,d)
},buildSkinHTML:function(f,g,h){if(!(f&&g)){var k=g&&g.getProperty("id");
LOG.reportError(wixErrors.SKIN_MANAGER_MISSING_ARGUMENTS,"mobile.core.managers.SkinManager","buildSkinHTML","skinName="+f+" compId="+k+"compViewNode: "+g);
return{}
}var j=this._skinDataMap[f];
if(!j){LOG.reportError(wixErrors.SKIN_MANAGER_NO_DATA_FOR_SKIN,"mobile.core.managers.SkinManager","buildSkinHTML",f);
return{}
}return this._skinRenderer.buildSkinHTML(j,g,h)
},stylePropertiesChangedForSkin:function(g,j,k){var f=j&&j.getId();
if(g&&f&&k){if(!this._styleChangedProps){this._styleChangedProps={}
}this._styleChangedProps[g]=this._styleChangedProps[g]||{};
this._styleChangedProps[g][f]=this._styleChangedProps[g][f]||{style:j,props:{}};
for(var h in k){this._styleChangedProps[g][f].props[h]=""
}if(!this._styleChangeCallLater){this._styleChangeCallLater=W.Utils.callOnNextRender(this._checkStylePropChanges,100)
}}},_onThemeChange:function(c){var d=c.name;
if(d){if(!this._themeChangedProps){this._themeChangedProps={}
}this._themeChangedProps[d]=c;
if(!this._themeChangeCallCallLater){this._themeChangeCallCallLater=W.Utils.callOnNextRender(this._checkThemePropChanges,100)
}}},_checkStylePropChanges:function(){var k,m,o,j,n,p,q,r;
delete this._styleChangeCallLater;
for(k in this._styleChangedProps){m=this._styleChangedProps[k];
o=this._skinDataMap[k];
for(j in m){n=m[j].style;
p=m[j].props;
q=o.css;
for(r=0;
r<q.length;
++r){if(this._isSkinCssClassContainsPartialParams(q[r],p,"id")){this._skinRenderer.updateSkinCSSClass(q[r].selector,q[r].rules,q[r].params,o.params,n)
}}}}delete this._styleChangedProps
},_checkThemePropChanges:function(){delete this._themeChangeCallCallLater;
if(this===W.Skins){for(var f in this._skinDataMap){var g=this._skinDataMap[f];
var h=this._skinDataMap[f].css;
for(var e=0;
e<h.length;
++e){if(this._isSkinCssClassContainsPartialParams(h[e],this._themeChangedProps,"defaultTheme")){this._skinRenderer.updateSkinCSSClass(h[e].selector,h[e].rules,h[e].params,g.params)
}}}}delete this._themeChangedProps
},_isSkinCssClassContainsPartialParams:function(m,n,j){var k=m.params;
for(var h in n){for(var g=0;
g<k.length;
++g){if(k[g][j]&&k[g][j]==h){return true
}}}return false
},getSkinParamValue:function(h,g,m){var j=this._skinDataMap[h].params;
for(var n=0;
n<j.length;
n++){var k=j[n];
if(k.id==g){return this._skinRenderer.getParamValue(k,m)
}}return null
},getUniqueClass:function(g,e){var h=this._skinParser.getSkinCSSName(e);
var f=this._skinParser.getUniqueClass(g,h);
return f.uniqueClass
}})
})();
Constants.add("components.DEFAULT_PREFIX","c");
Constants.add("components.BASE_LIST_ITEM_PREFIX","bli");
W.Managers.ComponentManager=new WClass({className:"ComponentManager",initialize:function(){this._componentQue=new W.Queue();
this._componentMap={"mobile.core.components.base.BaseComponent":W.Classes.get("mobile.core.components.base.BaseComponent")};
if(!this._componentMap["mobile.core.components.base.BaseComponent"]){LOG.reportError(wixErrors.MANAGERS_INVALID_CLASS,"ComponentManager","initialize","W.BaseComponentClassData is missing")()
}},newComponent:function(k){if(this._componentMap[k.name]){LOG.reportError(wixErrors.CM_NAME_ALREADY_EXIST,this.className,"newComponent",k.name)();
return
}if(k.name!="mobile.core.components.base.BaseComponent"&&!instanceOf(k.Class.Extends,String)){LOG.reportError(wixErrors.CM_NO_EXTEND,this.className,"newComponent","")();
return
}var j=k.skinParts||{};
k.Class._skinPartsSchema=j;
var g=(k.imports||[]);
k.imports=g;
for(var n in j){var m=j[n].type;
if(m&&m!=Constants.ComponentPartTypes.HTML_ELEMENT&&g.indexOf(m)<0){g.push(m)
}}k.Class._propertiesSchemaName=k.propertiesSchemaName;
k.onClassReady=function(a){this._onComponentClassReady(a,k.name)
}.bind(this);
var h=W.Classes;
W.Utils.callLater(function(){h.newClass(k)
})
},getComponent:function(d,c){if(this._componentMap[d]){W.Utils.callLater(c,[this._componentMap[d]]);
return this._componentMap[d]
}else{this._componentQue.add(d,c);
W.Classes.get(d,function(){});
return null
}},_onComponentClassReady:function(f,d){this._componentMap[d]=f;
var e=this._componentQue.getQueue(d);
e.forEach(function(a){a(f)
});
this._componentQue.removeKey(d)
},createComponent:function(s,p,x,u,n,o,w,t,y,v){if(s&&typeOf(s)=="object"){var z=s;
s=z.type;
p=z.skin||p;
x=z.data||x;
u=z.args||u;
n=z.wixifyCallback||n;
o=z.componentReadyCallback||o;
w=z.domIdPrefix||w;
t=z.compNode||t;
v=z.innerStyle
}if(!s||typeOf(s)!="string"){LOG.reportError(wixErrors.CM_LOGIC_TYPE,this.className,"createComponent","created from:"+this.className+"");
return new Element("span")
}var q={comp:s,skin:p};
if(x){var r=typeof(x);
if(r=="string"){q.dataQuery=x;
x=null
}else{if(r=="object"){if(!x._dataType){LOG.reportError(wixErrors.WIXIFY_MISSING_DATA_TYPE,this.className,"createComponent","created from:"+this.className)
}}}}if(t){t.setProperties(q)
}else{t=new Element("div",q)
}if(n&&typeof n=="function"){t.addEvent("wixified",function(){n(t.getLogic())
})
}if(o&&typeof o=="function"){t.addEvent(Constants.ComponentEvents.READY,function(){t.removeEvent(Constants.ComponentEvents.READY,arguments.callee);
o(t.getLogic())
})
}if(x&&x._dataType){t.wixify(u,x,w,y,v)
}else{t.wixify(u,null,w,y,v)
}return t
},clone:function(){var c=new W.Managers.ComponentManager();
for(var d in this._componentMap){c._componentMap[d]=this._componentMap[d]
}for(d in this._componentQue.map){c._componentQue.map[d]=this._componentQue.map[d]
}return c
},isReady:function(){return(this._componentMap["mobile.core.components.base.BaseComponent"]&&!this._componentQue.hasQueue())
}});
Constants.DataEvents={DATA_CHANGED:"dataChanged"};
Constants.DataTypes={TYPE_RESOURCE_KEY:"resourceKey"};
W.Managers.DataManager=new WClass({Extends:Events,initialize:function(){this.dataMap={};
this.dirtyDataObjectsMap={};
this.dataTypesMap={};
this.dataTypesSchemaMap={};
this.callbackQueue=new W.Queue();
this._DataItemBase=W.Classes.get("mobile.core.managers.data.DataItemBase");
this._DataItemWithSchema=W.Classes.get("mobile.core.managers.data.DataItemWithSchema")
},className:"W.Managers.DataManager",flagDataChange:function(){this._dataChanged=true
},clearDataChange:function(){this._dataChanged=false
},isDataChange:function(){return(this._dataChanged===true)
},registerDataTypeSchema:function(f,h){var e=h["extends"];
if(e){var g=this.dataTypesSchemaMap[e];
if(!g){LOG.reportError(wixErrors.SCHEMA_MISSING_KEY,"DataManager","registerDataTypeSchema",[f,e])();
return
}Object.merge(h,g)
}this.dataTypesSchemaMap[f]=h
},clearDirtyObjectsMap:function(){this.dirtyDataObjectsMap={}
},hasDirtyObjects:function(){return W.Utils.objectSizeDelta(this.dirtyDataObjectsMap)
},markDirtyObject:function(e){var f=e._data;
var d=f.id;
this.dirtyDataObjectsMap[d]=e
},setInitDataItems:function(b){this.skipDirtyMarking=true;
this.addDataItems(b);
delete this.skipDirtyMarking
},addDataItems:function(d){for(var c in d){this.addDataItem(c,d[c])
}},addDataItem:function(f,d){var e=this.createDataItem(d);
e._data.id=f;
this.dataMap[f]=e;
this._runCallbacks(f,e);
if(!this.skipDirtyMarking){this.markDirtyObject(e)
}return e
},addDataItemWithUniqueId:function(h,e){var g;
do{g=h+Number.random(0,99999).toString(36);
g=g.replace(" ","_")
}while(this.dataMap[g]);
var f=this.addDataItem(g,e);
return{id:g,dataObject:f}
},_runCallbacks:function(c,d){this.callbackQueue.popQueue(c).forEach(function(a){a(d)
})
},createDataItem:function(e,d){d=d||e.type;
var f=this.dataTypesSchemaMap[d];
if(!f&&d!=undefined){LOG.reportError(wixErrors.SCHEMA_MISSING,"DataManager","createDataItem",[d])
}if(f){return new this._DataItemWithSchema(f,e,this)
}else{return new this._DataItemBase(e,this)
}},isDataItem:function(b){return b&&instanceOf(b,this._DataItemBase)
},getDataByQuery:function(g,h){var e=null;
if(g.indexOf("#")==0){var f=g.substr(1);
e=this.dataMap[f];
if(!e){this.callbackQueue.add(f,h)
}else{W.Utils.callLater(h,[e]);
return e
}}else{LOG.reportError(wixErrors.DM_MALFORMED_QUERY,"DataManager","getDataByQuery",g);
W.Utils.callLater(h,[null])
}},isDataAvailable:function(f){var d=null;
if(f.indexOf("#")==0){var e=f.substr(1);
d=this.dataMap[e];
if(d){return true
}else{return false
}}else{LOG.reportError(wixErrors.DM_MALFORMED_QUERY,"DataManager","isDataAvailable",f);
return false
}},getDataByQueryList:function(t,k){var s={};
var r=function(a){return function(c){s[a]=c;
var b=true;
for(var d=0;
d<t.length;
++d){if(!s[t[d]]){b=false;
break
}}if(b&&k){k(s)
}}
};
if(t.length==0){var o={};
W.Utils.callLater(k,[o])
}else{var n={};
var p=true;
for(var q=0;
q<t.length;
++q){var m=this.getDataByQuery(t[q],r(t[q]));
if(m){n[t[q]]=m
}else{p=false
}}if(p){return n
}}},getDataMap:function(){return this.dataMap
},getDirtyDataObjectsMap:function(){return this.dirtyDataObjectsMap
},isReady:function(){return true
},_copyData:function(d){d.dataTypesMap=Object.clone(this.dataTypesMap);
d.dataTypesSchemaMap=Object.clone(this.dataTypesSchemaMap);
for(var e in this.dataMap){var f=Object.clone(this.dataMap[e].getData());
d.addDataItem(e,f)
}},clone:function(){var b=new W.Managers.DataManager();
this._copyData(b);
return b
},toString:function(){return"[Data Manager]"
},markAllDirty:function(){for(var b in this.dataMap){this.dirtyDataObjectsMap[b]=this.dataMap[b]
}},getResourceManager:function(){return W.Resources
},removeDataItem:function(d){var c=typeof d=="string"?d:this.getQueryOfDataItem(d);
this._removeIfSafe(c)
},_removeIfSafe:function(c){var d=c&&this.dataMap[c.substr(1)];
if(!d){return
}if(d.componentsWithInterest.length===0&&!this._isReferenced(c)){d.removeAllEvents();
delete this.dataMap[c.substr(1)]
}},_isReferenced:function(d){var f,e;
for(f in this.dataMap){e=this.dataMap[f].getData();
if(e&&e.items&&e.items.indexOf&&e.items.indexOf(d)!==-1){return true
}}return false
},getQueryOfDataItem:function(d){var c;
for(c in this.dataMap){if(d===this.dataMap[c]){return"#"+c
}}}});
(function(){var b;
W.Managers.ThemeManager=new WClass({className:"ThemeManager",Extends:W.Managers.DataManager,Binds:["_onDataChanged","_onDataReady","_onPropChange","_updateEffectedProps"],Static:{INIT_STYLE_RAW_DATA:{type:"TopLevelStyle",skin:"skin-name-place-holder",style:{properties:{},groups:{}}}},getStyle:function(h,f,a){if(this._styleCache[h]){W.Utils.callLater(f,[this._styleCache[h]])
}else{this._styleQueue.add(h,f);
if(this._styleQueue.getQueue(h).length>1){return
}var g=function(c){c.removeEvent(Constants.StyleEvents.READY,g);
this._styleCache[h]=c;
this._styleQueue.getQueue(h).forEach(function(d){d(c)
});
this._styleQueue.removeKey(h)
}.bind(this);
if(this.isStyleAvailable(h)){this.getDataByQuery("#"+h,function(e){var c=e.get("style");
var d=new this.TopLevelStyleClass(e);
d.addEvent(Constants.StyleEvents.READY,g)
}.bind(this))
}else{this.createStyle(h,"",a,g)
}}},isStyleAvailable:function(a){return this.isDataAvailable("#"+a)
},invalidateStyle:function(a){if(this._styleCache[a]){this._styleCache[a].invalidateStyle()
}},createStyle:function(q,m,a,j){if(this._stylesInProcess[q]||this._styleCache[q]){LOG.reportError(wixErrors.STYLE_ALREADY_EXISTS,"ThemeManager","createStyle",q)()
}var k=Object.clone(this.INIT_STYLE_RAW_DATA);
k.skin=a;
var p=this.addDataItem(q,k);
p.fireDataChangeEvent();
var n=new this.TopLevelStyleClass(p);
this._stylesInProcess[q]=n;
var o=function(){n.removeEvent("styleReady",o);
var c=n.getId();
delete this._stylesInProcess[c];
this._styleCache[c]=n;
j(n)
}.bind(this);
n.addEvent("styleReady",o)
},initialize:function(a){this.parent();
this.TopLevelStyleClass=W.Classes.get("mobile.core.managers.style.Style");
this._placeHoldersMap={};
this._isReady=false;
this._styleQueue=new W.Queue();
this._styleCache={};
this._stylesInProcess={};
this._isOperating=false;
if(a){this._onDataReady(a)
}},setInitDataItems:function(a){this.parent(a);
var d="#THEME_DATA";
if(this.isDataAvailable(d)){this.getDataByQuery(d,this._onDataReady)
}else{W.Data.getDataByQuery(d,this._onDataReady)
}},getPropertyType:function(a){return this._data.getFieldSchema(a).type
},_onDataReady:function(a){var g=a.get("type")==="Theme";
if(g){var j=a;
a=this.addDataItem(j.get("id"),{type:this._getThemeSchemaTypeName()});
var h=j.get("properties");
for(var k in h){a.set(k,h[k].value)
}}this._setData(a);
this._isReady=true
},_getThemeSchemaTypeName:function(){return"FlatTheme"
},_setData:function(a){this._flattenData(a);
if(this._data){this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChanged)
}this._data=a;
this._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChanged);
this._indexAllPlaceholders();
W.Css.updateAllThemeCss()
},_flattenData:function(B){this._flattenedDataItems={};
var C=B.getData();
var y=B.getSchema();
var w={};
var u,x,a;
for(a in C){if(typeOf(C[a])=="array"){u=a;
var k=C[a];
var r=k.length;
var z=y[a].defaultItems;
if(z.length>r){for(var A=r;
A<z.length;
A++){k.push(z[A]);
r++
}}for(x=0;
x<r;
x++){w[u+"_"+x]=k[x];
this._flattenedDataItems[u+"_"+x]=u
}}else{w[a]=C[a]
}}B.setData(w);
var t={};
for(a in y){if(y[a].type=="array"){u=a;
var s=y[a].itemType;
var v=y[a].defaultItems;
for(x=0;
x<v.length;
x++){t[u+"_"+x]={type:s,"default":v[x]};
if(!this._flattenedDataItems[u+"_"+x]){this._flattenedDataItems[u+"_"+x]=u
}}}else{t[a]=y[a]
}}B.setSchema(t)
},_indexAllPlaceholders:function(){this._placeHoldersMap={};
var d=this._data.getSchema();
for(var a in d){this._updatePlaceholdersInProperty(a,this.getRawProperty(a))
}},_updatePlaceholdersInProperty:function(p,k,o){var n=this._getPlaceholders(k,true);
var a=(o)?this._getPlaceholders(o,true):{};
var m=Object.merge({},a,n);
for(var j in m){this._placeHoldersMap[j]=this._placeHoldersMap[j]||{};
if(n[j]&&!a[j]){this._placeHoldersMap[j][p]=p
}else{if(!n[j]){delete this._placeHoldersMap[j][p]
}}}},_getPlaceholders:function(k,n){var m=/\[([^}]+)\]/g;
var p=/\{([^}]+)\}|\[([^}]+)\]/g;
var o=(n)?p:m;
var a={};
var q;
while(q=o.exec(k)){var j=q[1]||q[2];
if(j){a[j]=j
}}return a
},clone:function(){var d=new W.Managers.ThemeManager();
this._copyData(d);
var a=d.dataMap.THEME_DATA;
d._setData(a);
return d
},isReady:function(){return this._isReady
},getProperties:function(){var a={};
var e=this._data.getSchema();
for(var f in e){a[f]={value:this.getRawProperty(f),type:this._data.getFieldSchema(f).type}
}return a
},getProperty:function(q,j,o){var k=this._data.get(q);
var m=typeOf(k)=="string"?k:Object.clone(k);
var a=this._data.getFieldSchema(q);
if(!a){LOG.reportError(wixErrors.SCHEMA_MISSING_KEY,"ThemeManager","getProperty",[q,this._data.getData(),null]);
return null
}var p=this._data.getFieldSchema(q).type;
if(!j&&typeOf(m)=="string"&&(m.indexOf("[")!=-1)){for(var n in this._data.getSchema()){if(m.indexOf("["+n+"]")!=-1){m=m.split("["+n+"]").join(this.getProperty(n))
}}}if(o){return m
}switch(p){case"themeUrl":return W.Config.getPack("VIEWER_PARAMS").staticThemeUrl+"/"+m+"/";
case"color":return new W.Color(m);
case"background":return new W.Background(m,this);
case"font":return new W.Font(m,this);
case"radius":return new W.BorderRadius(m)
}return m
},_onDataChanged:function(a,e){if(this._isOperating){return
}this._isOperating=true;
this._indexAllPlaceholders();
if(typeof e=="string"){this._updateEffectedProps(e)
}else{for(var f in e){this._updateEffectedProps(f)
}}this._isOperating=false
},getRawProperty:function(a){return this.getProperty(a,true,true)
},clearOverrides:function(){this._data.reset()
},getOverrides:function(){return this.getProperties()
},getDataItem:function(){return this._data
},setProperty:function(h,f){var a=this._data.getFieldSchema(h);
if(!a){LOG.reportError(wixErrors.SCHEMA_MISSING_KEY,"ThemeManager","setProperty",[h,this._data.getData(),null]);
return
}var g=a.type;
if(g=="color"){if(f&&f.getRgba){f=f.getRgba()
}}this._updatePlaceholdersInProperty(h,f,this.getRawProperty(h));
this._data.set(h,f);
this._updateEffectedProps(h)
},getPropertiesAccordingToType:function(h){var a=[];
var f=this._data.getSchema();
for(var g in f){if(h==this._data.getFieldSchema(g).type){a.push(g)
}}return a
},_onPropChange:function(a,g){var h=[a];
g=g||this.getProperty(a);
this.fireEvent("propertyChange",{name:a,newVal:g,type:"propertyChange"});
var j=this._placeHoldersMap[a];
for(var k in j){h.combine(this._onPropChange(k,this.getProperty(k)))
}return h
},_updateEffectedProps:function(f){var e=this._onPropChange(f);
var a={};
e.forEach(function(c){a[c]=this._data.get(c)
}.bind(this));
this._data.fireDataChangeEvent(a)
},getDirtyDataObjectsMap:function(){var g=this.parent();
if(g&&g.THEME_DATA){g.THEME_DATA=this.createDataItem(Object.clone(g.THEME_DATA.getData()),this._getThemeSchemaTypeName());
var f=g.THEME_DATA.getData();
for(var a in f){if(this._flattenedDataItems[a]){var h=this._flattenedDataItems[a];
if(!f[h]){f[h]=[]
}f[h].push(f[a]);
delete f[a]
}}}return g
}})
}());
(function(){Constants.CSS={COLORS:["transparent","aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgreen","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"],SYSTEM_FONTS:{"sans-serif":[["Arial","Helvetica"],["Arial Black","Gadget"],["Impact","Charcoal"],["Lucida Sans Unicode","Lucida Grande"],["Tahoma","Geneva"],["Verdana","Geneva"]],serif:["Georgia",["Palatino Linotype","Book Antiqua","Palatino"],["Times New Roman","Times"]],cursive:["Comic Sans MS"],monospace:["Courier New",["Lucida Console","Monaco"]]},CUSTOM_FONTS:{"sans-serif":["Anton","Basic","Jockey One","Jura","Open Sans","Overlock","Play","Signika","Spinnaker","Chelsea Market"],serif:["Caudex","EB Garamond","Enriqueta","Forum","Noticia Text","Fredericka the Great","Kelly Slab","Josefin Slab"],cursive:["Lobster","Niconne","Marck Script","Mr De Haviland","Patrick Hand","Sarina"],monospace:[]}};
var b;
W.Managers.CssManager=new WClass({className:"CssManager",Binds:["_onThemePropertyChange"],Static:{GLOBAL_THEME_CSS_TYPES:["font","color"],FONT_SERVICE_URL:"http://fonts.googleapis.com/css?family="},initialize:function(){this._themeStyleSheet=this._generateThemeStylesSheet();
this._configureSystemFonts();
this._configureCustomFonts();
W.Theme.addEvent("propertyChange",this._onThemePropertyChange)
},_configureSystemFonts:function(){this._systemFontsCssDefinition={};
this._systemFontsNames=[];
for(var a in Constants.CSS.SYSTEM_FONTS){var h=Constants.CSS.SYSTEM_FONTS[a];
for(var m=0;
m<h.length;
++m){var j=h[m];
var k=(typeOf(j)=="array")?j[0]:j;
this._systemFontsNames.push(k);
var n=(typeOf(j)=="array")?j.concat().reverse():[j];
n.push(a);
this._addQuoteToArrayElementsIfContainSpaces(n);
this._systemFontsCssDefinition[k]=n.join(",")
}}},_configureCustomFonts:function(){this._customFontsCssDefinition={};
this._customFontsNames=[];
for(var a in Constants.CSS.CUSTOM_FONTS){var h=Constants.CSS.CUSTOM_FONTS[a];
for(var m=0;
m<h.length;
++m){var j=h[m];
var k=(typeOf(j)=="array")?j[0]:j;
this._customFontsNames.push(k);
var n=(typeOf(j)=="array")?j.concat().reverse():[j];
n.push(a);
this._addQuoteToArrayElementsIfContainSpaces(n);
this._customFontsCssDefinition[k]=n.join(",")
}}},_addQuoteToArrayElementsIfContainSpaces:function(d){for(var a=0;
a<d.length;
++a){if(d[a].indexOf(" ")){d[a]='"'+d[a]+'"'
}}},_onThemePropertyChange:function(d){var a=W.Theme.getPropertyType(d.name);
if(this.GLOBAL_THEME_CSS_TYPES.contains(a)){this._updateThemeGlobalCssByPropertyName(d.name,a)
}},updateAllThemeCss:function(){for(var g=0;
g<this.GLOBAL_THEME_CSS_TYPES.length;
++g){var f=this.GLOBAL_THEME_CSS_TYPES[g];
var h=W.Theme.getPropertiesAccordingToType(f);
for(var a=0;
a<h.length;
++a){this._updateThemeGlobalCssByPropertyName(h[a],f)
}}},_updateThemeGlobalCssByPropertyName:function(k,j){var g=this.getThemeGlobalPropertyCssDefinition(k,j);
this._themeStyleSheet.updateRule(g.selector,g.rules);
if(j=="font"){var a=W.Theme.getProperty(k).getFontFamily();
var h=this.getFontType(a);
if(h=="custom"){this.loadFont(a)
}}},getThemeGlobalPropertyCssDefinition:function(m,k,j){k=k||W.Theme.getPropertyType(m);
var n=W.Theme.getProperty(m);
var a;
var h="";
switch(k){case"font":a="."+m;
if(!j){h=n.getCssRule()
}else{h="font: "+n.getCssValue()
}break;
case"color":a="."+m;
h="color:"+n.getHex(false);
break
}return{selector:a,rules:h}
},_generateThemeStylesSheet:function(){if(!b){b=W.Utils.createStyleSheet("WIX_THEME_STYLES")
}this._themeStyleNodeId=b.styleNode.get("id");
return b
},getCssNodeId:function(){return this._themeStyleNodeId
},getDefaultFont:function(){var a=Constants.CSS.SYSTEM_FONTS["sans-serif"][0];
a=(typeOf(a)==="array")?a[0]:a;
return a
},getFontFallbacksCss:function(a){return this._systemFontsCssDefinition[a]||this._customFontsCssDefinition[a]||'"'+a+'"'
},getFontList:function(){return[].concat(this._systemFontsNames,this._customFontsNames).sort()
},getFontType:function(a){if(this._systemFontsNames.indexOf(a)!=-1){return"system"
}if(this._customFontsNames.indexOf(a)!=-1){return"custom"
}return null
},getUsedFontsUrl:function(){var f=W.Theme.getPropertiesAccordingToType("font");
var h={};
for(var g=0;
g<f.length;
++g){var a=W.Theme.getProperty(f[g]).getFontFamily();
if(this.getFontType(a)=="custom"){h[a]=a
}}return this.FONT_SERVICE_URL+this._getFontsQuery(h)
},loadFont:function(g){this._readyFonts=this._readyFonts||{};
this._loadedFonts=this._loadedFonts||{};
var a=(this._customFontsNames.indexOf(g)!=-1);
var h=(this._readyFonts[g]);
var f=(this._loadedFonts[g]);
if(!a||h||f){return
}this._loadedFonts[g]=g;
if(!this._fontLoadCallLater){this._fontLoadCallLater=W.Utils.callLater(this._loadFonts,undefined,this,50)
}},_loadFonts:function(){delete this._fontLoadCallLater;
var a=this.FONT_SERVICE_URL+this._getFontsQuery(this._loadedFonts);
for(var d in this._loadedFonts){this._readyFonts[d]=d;
delete this._loadedFonts[d]
}this._addFontsLoaderCssTag(a)
},_getFontsQuery:function(d){fontQuery="";
for(var a in d){fontQuery+=a.split(" ").join("+");
fontQuery+=":n,b,i,bi|"
}return fontQuery
},_addFontsLoaderCssTag:function(e){var f=document.createElement("link");
f.rel="stylesheet";
f.type="text/css";
f.href=e;
var a=document.getElementsByTagName("link")[0];
a.parentNode.insertBefore(f,a)
},clone:function(){var a=new W.Managers.CssManager();
return a
},isReady:function(){return true
}})
}());
W.Managers.DocumentDataManager=new WClass({className:"DocumentDataManager",Extends:W.Managers.DataManager});
W.Managers.ThemeDataManager=new WClass({className:"themeDataManager",Extends:W.Managers.DataManager});
Constants.PropertyEvents={PROPERTY_CHANGED:"propertyChanged"};
W.Managers.ComponentDataManager=new WClass({className:"ComponentDataManager",Extends:W.Managers.DataManager,initialize:function(){this._PropertiesItem=W.Classes.get("mobile.core.managers.data.PropertiesItem");
this.parent()
},addDataItem:function(g,h,e){var f=this.createDataItem(h,e);
f._data.id=g;
this.dataMap[g]=f;
this._runCallbacks(g,f);
this.markDirtyObject(f);
return f
},createDataItem:function(f,h){var e=f.type;
var g=this.dataTypesSchemaMap[e];
if(g){return new this._PropertiesItem(g,f,this,h)
}else{return new this._DataItemBase(f,this)
}}});
(function(){W.Managers.ConfigurationManager=function(){this._packs={}
};
W.Managers.ConfigurationManager.prototype=new Events();
W.Managers.ConfigurationManager.prototype.createPackage=function(e,f,g){if(f&&f.length){for(var h=0;
h<f.length;
h++){if(!g[f[h]]){LOG.reportError(wixErrors.CONFIG_MANAGER_NO_PARAM,"W.Managers.ConfigurationManager","createPackage","required param not supplied",f[h])
}}}this._packs[e]=g
};
W.Managers.ConfigurationManager.prototype.getPack=function(b){return this._packs[b]
};
W.Managers.ConfigurationManager.prototype.deletePack=function(b){delete this._packs[b]
};
W.Managers.ConfigurationManager.prototype.clone=function(){var c=new W.Managers.ConfigurationManager();
for(var d in this._packs){c._packs[d]=this._packs[d]
}return c
};
W.Managers.ConfigurationManager.prototype.isReady=function(){return true
}
})();
Constants.ViewManager={VIEW_MODE_SITE:"site",VIEW_MODE_EDITOR:"editor",VIEW_MODE_PREVIEW:"preview"};
W.Managers.ViewManagerBase=new WClass({className:"ViewManagerBase",Binds:["_onTransitionFinished"],Extends:Events,initialize:function(){this._isReady=true;
this._isSiteReady=false;
this._pages=null;
this._pagesData=null;
this._mainPageData=null;
this._siteStructureData=null;
this._currentPageId=null;
this._isFullScreen=null;
this._fullScreenCallbacks=[];
this._requiredConfigParams=["staticMediaUrl","staticThemeUrl","scriptsRoot","emailServer","htmlComponentEchoUrl"];
this._scrollLock=false;
this._isPageScrollToTopEnabled=true;
this._stopAnimation=null;
this._loadedExtJS={};
this._pendingExtJS=[];
this._onHashChange=this._onHashChange.bind(this);
this._onSiteReady=this._onSiteReady.bind(this);
this._loadNextPage=this._loadNextPage.bind(this);
this._loadScript=this._loadScript.bind(this);
this._onScriptLoaded=this._onScriptLoaded.bind(this);
var b=W.Utils.getQueryParam("isEdited");
if(b=="true"){this.setPreviewMode(true)
}this.addEvent("pageTransitionEnded",this._onTransitionFinished)
},setPreviewMode:function(b){this._isPreview=b;
if(b&&document&&document.body){$(document.body).addClass("prevMode")
}},setStopAnimation:function(b){this._stopAnimation=b
},getNewUniquePageId:function(d){var c;
do{c=W.Utils.getUniqueId(d+"Page")
}while(this._pages[c]!=undefined);
return c
},isScrollLock:function(){return this._scrollLock
},setLinkTipFunc:function(b){this._linkTipFunc=b
},getLinkTipFunc:function(){return this._linkTipFunc
},getPreviewMode:function(){return !!this._isPreview
},setSite:function(h,e,g){if(!h){LOG.reportError(wixErrors.VM_INVALID_SITE_NODE,this.className,"setSite","")
}if(!e){LOG.reportError(wixErrors.VM_INVALID_SITE_DATA,this.className,"setSite","")
}this._siteNode=h;
this._siteStructureData=e;
this.indexPages("#SITE_PAGES");
if(!W.Editor){this._wixifySiteLazily(h,g)
}else{this._wixifyEntireSite(h)
}var f=this._siteNode.getProperty("comp");
if(f&&f.contains("components.SiteStructure")){this._siteNode.wixify()
}},_getUrlSearchParameters:function(){return window.location.search
},_wixifyEntireSite:function(e){var f=e.getElements("[comp]");
if(e.get("comp")){f.push(e)
}var d=new Async.Bulk(f,null,{timeout:20000,completeEvent:Constants.ComponentEvents.READY,completeCallback:function(){f.removeClass("initHidden");
this.updatePagesData();
for(var a in this._pages){this._pages[a].getLogic().setAsWixified()
}this._onSiteReady();
if(window.debugMode!="unit_test"){$("editor_preloader").collapse()
}}.bind(this)});
f.wixify()
},_getAllComponentsButPageContents:function(c){var d=c.getElements("#SITE_PAGES> div[comp]").combine([c.getElement("#SITE_HEADER")]).combine(c.getElements("#SITE_HEADER div[comp]")).combine(c.getElements("#SITE_FOOTER")).combine(c.getElements("#SITE_FOOTER div[comp]"));
if(c.get("comp")){d.push(c)
}return d
},_wixifySiteLazily:function(f,g){var h=this._getAllComponentsButPageContents(f);
var e=new Async.Bulk(h,null,{completeEvent:Constants.ComponentEvents.READY,completeCallback:function(){h.removeClass("initHidden");
this.updatePagesData();
var d=[];
if(g===false){for(var k in this._pages){d.push(this._pages[k].getLogic())
}}else{var a=this._getPageDataFromHash(W.Utils.hash.getHash());
d.push(this._pages[a.get("id")].getLogic())
}var b=new Async.Bulk(d,null,{completeEvent:"contentWixified",completeCallback:function(){this._onSiteReady()
}.bind(this)});
for(var c=0;
c<d.length;
++c){d[c].wixifyContent()
}}.bind(this)});
h.wixify()
},_onSiteReady:function(){this.setPreviewMode(this._isPreview);
this._isReady=true;
this._isSiteReady=true;
window.scrollTo(0,1);
this._onHashChange({newHash:W.Utils.hash.getHash(),isFiredAfterChange:true});
W.Utils.hash.addEvent("change",this._onHashChange);
this._loadNextPage();
this._reportBIEvents();
if(window.viewMode=="editor"&&window.location.hash=="#save=1"){window.location.hash="";
W.Commands.executeCommand("WEditorCommands.SaveSuccessDialog")
}},_reportBIEvents:function(){switch(window.viewMode){case"preview":LOG.reportEvent(wixEvents.PREVIEW_READY);
break;
case"site":LOG.reportEvent(wixEvents.SITE_READY);
break
}},getViewMode:function(){return window.viewMode
},_loadNextPage:function(){},setViewerConfig:function(b){W.Config.createPackage("VIEWER_PARAMS",this._requiredConfigParams,b)
},createElement:function(d,c){return new Element(d,c)
},clone:function(){var b=new W.Managers.ViewManager();
return b
},isReady:function(){return this._isReady
},isSiteReady:function(){return this._isSiteReady
},_onHashChange:function(c){if(this.isSiteReady()){var d=c.newHash;
if(!W.Data.isDataAvailable("#"+d)){this._changePageFromHash(d)
}else{W.Data.getDataByQuery("#"+d,function(a){this._setDataObjectFromHash(a,d)
}.bind(this))
}}},_setDataObjectFromHash:function(c,d){if(c.getType&&c.getType()==="Page"&&d){this._changePageFromHash(d)
}},_changePageFromHash:function(d){var f=this._getPageDataFromHash(d);
if(f===null){return
}var e=f.get("id");
if(e==this._currentPageId){return
}if(e){this._pageTransition(e)
}},_getPageDataFromHash:function(j){j=j||W.Utils.hash.getHash();
var h=this._mainPageData;
for(var f in this._pagesData){var k=this._pagesData[f];
var g=k.getMeta("isHidden")&&!this._isPreview;
if(k.get("id")==j&&!g){h=k;
break
}}return h
},_pageTransition:function(k){var h=this.getCurrentPageNode();
var j=this._siteNode.getElement("#"+k);
if(j){W.Utils.clearCallLater(this._setVisiblePageCallId);
this._currentPageId=k;
if(this._isFullScreen){this.exitFullScreenMode()
}if(h){h.getLogic().collapse()
}else{for(var f in this._pages){var g=this._pages[f];
if(g!=j){g.getLogic().collapse()
}}}j.getLogic().uncollapse();
this._setVisiblePageCallId=W.Utils.callLater(function(){j.getLogic().wixifyContent(function(){if(W.Editor){W.Editor.setKeysEnabled(true)
}this.fireEvent("pageTransitionEnded");
W.Utils.callLater(function(){LOG.reportPageEvent()
})
}.bind(this))
}.bind(this));
if(W.Editor){W.Editor.setKeysEnabled(false)
}this.fireEvent("pageTransitionStarted")
}},getScrollTop:function(){return document.body.scrollTop
},getPagesData:function(){return this._pagesData
},_scrollToTopOnPageChange:function(){if(this._isPageScrollToTopEnabled){if(this._isPreview){this._siteNode.setStyle("top","0px");
$(document.body).setStyle("background-position","0px 0px")
}else{$(document.body).scrollTo(0,0)
}}},goToPage:function(d){if(this._scrollLock){return
}if(this._stopAnimation!==null){this._stopAnimation.stop()
}this._scrollToTopOnPageChange();
var c=this._pagesData[d];
if(!c){return
}if(this._currentPageId==d){return
}this._pageTransition(d)
},_onTransitionFinished:function(){this._setUrlHashToPage(this._currentPageId)
},_setUrlHashToPage:function(d){var c=this._pagesData[d];
if(c){W.Utils.hash.setHash(d,c.get("pageUriSEO"))
}},goToHomePage:function(){this.goToPage(this._mainPageData.get("id"))
},isHomePage:function(){if(this._isSiteReady){return(this._currentPageId==this._mainPageData.get("id"))
}return true
},getCurrentPageId:function(){return this._currentPageId
},getCurrentPageNode:function(){var b=null;
if(this._currentPageId&&this._siteNode){b=this._siteNode.getElement("#"+this._currentPageId)
}return b
},indexPages:function(k){var t=this._siteNode.getElement(k);
if(!t){return W.Utils.callLater(this.indexPages,[k],this,10)
}var r={};
var s=[];
t.getElements("[comp=mobile.core.components.Page]").each(function(b){var c=b.get("id")||W.Utils.getUniqueId("page");
r[c]=b;
b.addClass("sitePage");
var a=b.get("dataQuery");
if(a!=this._siteStructureData.get("mainPage")){s.push(a)
}}.bind(this));
var q=this._siteStructureData.getData().pages;
if(!q){q=[]
}for(var p=0;
p<q.length;
++p){var n=q[p];
var o=s.indexOf(n);
if(o!=-1){s.splice(o,1);
s.splice(p,0,n)
}}var m=W.Data.isDataChange();
this._siteStructureData.set("pages",s);
m&&W.Data.flagDataChange();
this._pages=r
},loadExternalScript:function(g,e,f){var h=this;
if(g in this._loadedExtJS){e();
return"ALREADY_LOADED"
}else{if(g in this._pendingExtJS){this._pendingExtJS[g].push(e);
return"PENDING_LOAD"
}else{this._pendingExtJS[g]=[e];
this._loadScript(g,f);
return"FIRST_LOAD"
}}},_loadScript:function(g,f){var e=document.createElement("script");
e.type="text/javascript";
e.async=false;
if(e.readyState){e.onreadystatechange=function(){if(e.readyState==="loaded"||e.readyState==="complete"){e.onreadystatechange=null;
this._onScriptLoaded(g)
}}.bind(this)
}else{e.onload=function(){this._onScriptLoaded(g)
}.bind(this)
}e.src=g;
e.innerHTML=f;
var h=document.getElementsByTagName("script")[0];
h.parentNode.insertBefore(e,h)
},_onScriptLoaded:function(d){this._loadedExtJS[d]=true;
var f=this._pendingExtJS[d];
for(var e=0;
e<f.length;
e++){f[e]()
}delete this._pendingExtJS[d]
},_getSiteViewMode:function(){var b=window.viewMode;
if(b=="preview"&&window.top===window){return"site"
}return b
},isPublicMode:function(){return(this._getSiteViewMode()=="site")
},updatePagesData:function(){this._pagesData={};
for(var c in this._pages){var d=this._pages[c].getLogic().getDataItem();
this._pagesData[d.get("id")]=d;
if(this._siteStructureData.get("mainPage")=="#"+d.get("id")){this._mainPageData=d
}}},getPages:function(){return this._pages
},getSiteNode:function(){return this._siteNode
}});
(function(){W.Managers.LinkTypesManager=function(){this.langFlag=false;
this._allTypes={FACEBOOK:{target:"http://www.facebook.com/wix",text:"Facebook",linkType:["EXTERNAL_LINKS","NETWORKS"],protocol:"http://",tip:"navigate to"},LINKEDIN:{target:"http://www.linkedin.com/wix",text:"LinkedIn",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},TWITTER:{target:"http://www.twitter.com/wix",text:"Twitter",linkType:["EXTERNAL_LINKS","NETWORKS"],protocol:"http://",tip:"navigate to"},CALL:{target:"212.000.0000",text:"Call Me",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"tel:",tip:"call"},SMS:{target:"212.000.0000",text:"Text Me",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"sms:",tip:"text"},EMAIL:{target:"feedback@wix.com",text:"Email",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"mailto:",tip:"send an email to"},MAP:{target:"wix offices new york",text:"Address",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"http://maps.google.com/maps?f=q&source=s_q&hl=en&q=",tip:"open map for address "},BLOGGER:{target:"http://www.blogger.com/wix",text:"Blogger",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},YOUTUBE:{target:"http://www.youtube.com/wix",text:"Youtube",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},FREE_LINK:{target:"http://www.wix.com",text:"Any link",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"http://",tip:"navigate to"},FLICKR:{target:"http://www.flickr.com/wix",text:"Flickr",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},SKYPE:{target:"http://www.skype.com/wix",text:"Skype",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},MYSPACE:{target:"http://www.myspace.com/wix",text:"MySpace",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},VIMEO:{target:"http://www.vimeo.com/wix",text:"Vimeo",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},DELICIOUS:{target:"http://www.delicious.com/wix",text:"Delicious",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"}};
this.showLinkTip=this.showLinkTip.bind(this)
};
W.Managers.LinkTypesManager.prototype={getLinkTypesByMeta:function(h){var j;
if(this.langFlag===false){for(j in this._allTypes){this._allTypes[j].text=W.Resources.get("EDITOR_LANGUAGE",j+"_TITLE")
}this.langFlag=true
}var f=[];
var g={};
var k=true;
for(j in this._allTypes){f=this._allTypes[j]["linkType"];
if(f.indexOf(h)>=0){g[j]=this._allTypes[j];
k=false
}}if(k==true){LOG.reportError(wixErrors.LT_LINK_UNKNOWN,"LinkTypesManager","getLinkTypesByMeta",h+"")
}return g
},getNewLink:function(d){if(!this._allTypes[d]){LOG.reportError(wixErrors.LT_INVALID_LINK_TYPE,"LinkTypesManager","getNewLink",d+"")
}var c=Object.clone(this._allTypes[d]);
c.metaData={isPreset:true};
c.linkType=d;
c.type="Link";
delete c.tip;
delete c.protocol;
return c
},getLinkIcon:function(b){return b.toLowerCase()+".png"
},gotoLink:function(h){if(W.Viewer.isScrollLock()){return
}var j=h.get("linkType");
var o=h.get("target");
if(!W.Viewer.getPreviewMode()){var k=!this._skipForceFlash(o.toLowerCase())&&this._matchCurrentUrl(o.toLowerCase());
if(k){this.setForceFlashCookie()
}var p=(o.toLowerCase().indexOf("https://")==0);
if(p){o=o.replace("https://","")
}else{if(o.toLowerCase().indexOf("http://")==0){o=o.replace("http://","")
}}var m=this._allTypes[j]["protocol"];
if(m=="http://"&&p){m="https://"
}var n=m+o;
this._changeLocation(n)
}else{if(W.Viewer.getLinkTipFunc()){W.Viewer.getLinkTipFunc()(h,this)
}}},_changeLocation:function(b){document.location.href=b
},showLinkTip:function(d){var e=d.get("linkType");
var f=this._allTypes[e]["tip"]+" "+d.get("target");
W.Preview.showPreviewTip("Link will",f)
},isReady:function(){return true
},clone:function(){return new W.Managers.LinkTypesManager()
},stripUrl:function(f){var g=f.replace(/(\w+:\/\/)*([\w\-_]+\.)*([\w\-_]+\.[\w\-_]+).*/,"$3");
var j={com:true,org:true,net:true,edu:true,gov:true,mil:true,info:true,co:true,ac:true};
var k=g.split(".");
var h=k[0];
if(!j[h]){return g
}return f.replace(/(\w+:\/\/)*([\w\-_]+\.)*([\w\-_]+\.[\w\-_]+\.[\w\-_]+).*/,"$3")
},setForceFlashCookie:function(){var e=new Date();
e.setTime(e.getTime());
var f=20;
var d=new Date(e.getTime()+(f*1000*60));
document.cookie="forceFlashSite=true;path="+window.location.pathname+";domain=."+this.stripUrl(window.location.hostname)+";expires="+d.toGMTString()
},_skipForceFlash:function(b){return window.location.href.toLowerCase()==b
},_matchCurrentUrl:function(b){return this.stripUrl(window.location.href.toLowerCase())==this.stripUrl(b)
}}
}());
W.Managers.FeaturesManager=function(){this._disabledFeatures={highlightPreviewElement:"enabled",tinyMCETextSize:"disabled",tinyMCETextFormat:"disabled"}
};
W.Managers.FeaturesManager.prototype={constructor:W.Managers.FeaturesManager,disableFeature:function(b){this._disabledFeatures[b]="disabled"
},disableFeatures:function(b){b.each(this.disableFeature.bind(this))
},enableFeature:function(b){delete this._disabledFeatures[b]
},enableFeatures:function(b){b.each(this.enableFeature.bind(this))
},isEnabled:function(d){var c=this._disabledFeatures[d];
return(!c||c!="disabled")
},featureIsDisabled:function(b){return !this.isEnabled(b)
},clone:function(){var b=new W.Managers.FeaturesManager();
b._disabledFeatures=Object.clone(this._disabledFeatures);
return b
},isReady:function(){return true
}};
W.Managers.list=[{Class:"Utils",target:"Utils"},{Class:"FeaturesManager",target:"Features"},{Class:"ClassManager",target:"Classes"},{Class:"DocumentDataManager",target:"Data"},{Class:"ComponentDataManager",target:"ComponentData"},{Class:"ThemeManager",target:"Theme"},{Class:"CssManager",target:"Css"},{Class:"ComponentManager",target:"Components"},{Class:"SkinManager",target:"Skins"},{Class:"ConfigurationManager",target:"Config"},{Class:"LinkTypesManager",target:"LinkTypes"},{Class:"Commands",target:"Commands"},{Class:"ViewManager",target:"Viewer"}];
W.Managers.deploy=function(){W.Managers.list.forEach(W.Managers.deploySingleManager);
W.Managers._injectsList=null
};
W.Managers.deploySingleManager=function(d){if(!instanceOf(d.target,String)){LOG.reportError(wixErrors.MANAGERS_INVALID_NAME,this.className,"deploySingleManager",null);
throw new Error(wixErrors.MANAGERS_INVALID_NAME.desc)
}var c=W.Managers[d.Class];
if(!instanceOf(c,Function)&&!instanceOf(c,Class)){LOG.reportError(wixErrors.MANAGERS_INVALID_CLASS,this.className,"deploySingleManager",d.target);
throw new Error(wixErrors.MANAGERS_INVALID_CLASS.desc)
}W[d.target]=new c()
};
W.Managers.takeSnapshot=function(){var g=W.Managers.getManagers();
var e={};
if(Object.some(g,function(a){if(!instanceOf(a.isReady,Function)){LOG.reportError(wixErrors.MANAGERS_INVALID,this.className,"deploySingleManager","");
throw new Error(wixErrors.MANAGERS_INVALID.desc)
}return !a.isReady()
})){return false
}var f={};
W.Managers.list.forEach(function(a){var b=a.target;
var c=W[b];
f[b]=c;
W[b]=e[b]=c.clone()
});
for(var h in f){W[h]=f[h]
}W.Managers._snapshot=e;
return true
};
W.Managers._$notReadyList=function(){var d=W.Managers.getManagers();
var e=true;
for(var f in d){if(!d[f].isReady()){W.Utils.debugTrace(f+" is not ready");
e=false
}}if(e){return"all managers are ready :)"
}};
W.Managers.deploySnapshot=function(){if(W.Managers._snapshot===undefined){return false
}Object.forEach(W.Managers._snapshot,function(c,d){W[d]=c.clone()
});
W.Managers._injectsList=null;
return true
};
W.Managers.hasSnapShot=function(){return W.Managers._snapshot!==undefined
};
W.Managers.getManagers=function(){var b=W.Managers._injectsList;
if(!b){b={};
W.Managers.list.forEach(function(a){b[a.target]=W[a.target]
});
W.Managers._injectsList=b
}return b
};
W.Managers.override=function(b){W.Managers.list.forEach(function(d){var a=b.filter(function(c){return c.target==d.target
});
if(a.length>0){d.Class=a[a.length-1].Class
}})
};