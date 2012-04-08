W.Components.newComponent({name:"mobile.core.components.BaseList",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onItemReady","_onDataItemsReady","_onChildAutoSized","_onChildAutoSizedAnimation"],initialize:function(f,e,d){this.parent(f,e,d);
this._itemClassName=(d&&d.itemClassName)||this._itemClassName;
this._itemsNodes=[]
},_renderItems:function(c,d){c=c||[];
if(c.length==0){this.getItemsContainer().empty();
this._onAllItemsReady()
}else{if(d){this._onDataItemsReady(null,c)
}else{this._data.getDataManager().getDataByQueryList(c,function(a){this._onDataItemsReady(c,a)
}.bind(this))
}}},_createHiddenItems:function(){return true
},_createItem:function(r,j,k,o){var n=this._skin.itemSkinClassName;
var l=this.getItemClassName();
if(!n){LOG.reportError(wixErrors.NO_SKIN,this.className,"_createItem","");
return new Element("b")
}if(!l){LOG.reportError(wixErrors.MISSING_METHOD,this.className,"_createItem","");
return new Element("b")
}var m=W.Utils.getUniqueId(Constants.components.BASE_LIST_ITEM_PREFIX);
var q=new Element("div",{id:m});
var p=this;
this._getParamsToPassToItem(r,function(b){var a=r;
if(!this.injects().Data.isDataItem(r)){a=null
}this.injects().Components.createComponent(l,n,a,b,function(){j(q,true,r,o)
},undefined,undefined,q)
}.bind(this));
return q
},getSkinElementByIndex:function(d){var c=this.getItemsContainer().getChildren();
return c[d]
},_getParamsToPassToItem:function(d,c){c(undefined)
},_onItemReady:function(d,e,f){},_onAllItemsReady:function(){},getItemClassName:function(){return this._itemClassName
},getItemsContainer:function(){return this._view
},_onChildAutoSizedAnimation:function(){this.fireEvent("autoSizedAnimation")
},_onChildAutoSized:function(){this.fireEvent("autoSized")
},_onDataItemsReady:function(n,t){var o=this._itemsNodes||[];
this._itemsNodes=[];
this.getItemsContainer().empty();
var r=[];
var m=0;
var p=function(c,a,b,d){if(c){var e=c.getLogic();
this.fireEvent("itemReady",[e,e.getDataItem(),a]);
e.addEvent("autoSizedAnimation",this._onChildAutoSizedAnimation);
e.addEvent("autoSized",this._onChildAutoSized);
this._onItemReady(e,a,b)
}else{}if(++m>=d){var f=this._itemsNodes.clean();
if(f.length>1){f[0].addClass("firstItem");
f[f.length-1].addClass("lastItem")
}this._itemsNodes=f;
this._onAllItemsReady()
}}.bind(this);
var u=this.getItemsContainer();
var i=function(f,g,e){if((!this._createHiddenItems())&&f.getMeta("isHidden")){p(null,false,f,e);
return
}var d=undefined;
var b=this.injects().Data;
for(var a=0;
a<o.length;
++a){var c=o[a];
if(c&&c.getLogic){if(f===c.getLogic().getDataItem()){d=c;
o.splice(a,1);
break
}}}if(d){p(d,false,f,e)
}else{d=this._createItem(f,p,g,e)
}this._itemsNodes[g]=d;
d.removeClass("firstItem").removeClass("lastItem");
d.insertInto(u)
}.bind(this);
var q,s,v;
if(n){for(s=0,q=n.length;
s<q;
++s){v=t[n[s]];
i(v,s,q)
}}else{for(s=0,q=t.length;
s<q;
++s){v=t[s];
i(v,s,q)
}}if(r.length>1){r[0].addClass("firstItem");
r[r.length-1].addClass("lastItem")
}},_disposeItems:function(f){if(!f){return
}for(var e=f.length-1;
e>=0;
--e){var g=f[e];
var h=g.getLogic&&g.getLogic();
if(h){this._disposeItem(h);
h.dispose()
}}},_disposeItem:function(){}}});
Constants.repeaterStates={INITIATE:"init",LOADING:"loading",READY:"ready"};
W.Components.newComponent({name:"mobile.core.components.BaseRepeater",Class:{Extends:"mobile.core.components.base.BaseComponent",_elementPool:[],_onDataChange:function(){this._allRepeatersReady=false;
this.parent()
},_setSkinPartElements:function(b){this._allRepeatersReady=false;
this.parent(b)
},_prepareForRender:function(){if(!this._data||this._data.length===0){return true
}if(this._allRepeatersReady===false){this._repeaterDefinitions=this._getRepeaterDefinitions();
this._startRepeaterCreations();
return false
}return this._allRepeatersReady
},_getRepeaterDefinitions:function(){var d=[];
for(var e in this._skinPartsSchema){if(this._skinPartsSchema[e].repeater&&this._skinPartsSchema[e].autoCreate!==false){var f=this.getSkinPartDefinition(e);
if(f.hookMethod&&typeOf(this[f.hookMethod])=="function"){f=this[f.hookMethod](f)
}d.push(f)
}}return d
},_startRepeaterCreations:function(){this._beforeRepeatersCreation();
this._repeatersDataOld=this._repeatersData;
this._repeatersData={};
for(var f=0;
f<this._repeaterDefinitions.length;
++f){var d=this._repeaterDefinitions[f];
var e={};
this._repeatersData[d.id]=e;
e.defintion=d;
e.pendingItems=[];
e.readyItems=[];
e.readyItemsLogic=[];
e.state=Constants.repeaterStates.INITIATE;
this._loadRepeater(e)
}this._checkIfRepeatersReady()
},_checkIfRepeatersReady:function(){for(var d in this._repeatersData){var c=this._repeatersData[d];
if(c.state!=Constants.repeaterStates.READY){return false
}}return true
},_loadRepeater:function(j){if(j.defintion.autoCreate!==false){var l=function(d,e){var c=!e;
var a=d.getViewNode();
var b=j.pendingItems.indexOf(a);
var f=d.getDataItem();
j.pendingItems.splice(b,1);
j.readyItems.push(a);
j.readyItemsLogic.push(d);
if(j.defintion.hideHidden&&f.getMeta("isHidden")){a.collapse()
}this._onRepeaterItemReady(j,d,f,c);
if(j.readyItems.length==j.itemsAmount){j.state=Constants.repeaterStates.READY;
if(this._checkIfRepeatersReady()){this._disposeOldRepeaters();
this._onRepeaterReady(j);
this._allRepeatersReady=true;
this._renderIfReady()
}}}.bind(this);
var h=this._getRepeaterContainer(j);
if(h){h.empty()
}var i=this._getRepeaterDataList(j.defintion);
i=this._processDataRefs(i);
j.itemsAmount=i.length;
if(i.length>0){for(var k=0;
k<i.length;
++k){var g=Object.clone(j.defintion);
g.dataQuery=i[k];
this._createRepeaterItem(g,j,h,l)
}}else{this._disposeOldRepeaters();
this._onRepeaterReady(j);
this._allRepeatersReady=true;
this._renderIfReady()
}}else{j.state=Constants.repeaterStates.READY
}},_disposeOldRepeaters:function(){var b=[];
this._elementPool.forEach(function(a){if(a.getParent("html")){b.push(a)
}else{a.getLogic().dispose()
}});
this._elementPool=b
},_processDataRefs:function(b){return b
},_createRepeaterItem:function(m,p,x,s){var u=this._getOldRepeaterItemMatchingDefintion(p.defintion.id,m);
if(!u){var v=new Element("div");
this._elementPool.push(v);
v.repeaterDefinition=m;
p.pendingItems.push(v);
if(x){v.insertInto(x)
}this._createComponentbyDefinition(m,v,s)
}else{if(x){u.insertInto(x)
}var o=u.getLogic();
var n=o.getSkin();
var r=false;
var q,w;
if(m.styleGroup&&this._style){q=(m.styleGroup=="inherit")?this._style:this._style.getStyleByGroupName(m.styleGroup);
w=n.getStyle();
r=(q!==w)
}if(r){var t=function(){o.removeEvent(Constants.ComponentEvents.READY_FOR_RENDER,t);
s(o,true)
};
o.addEvent(Constants.ComponentEvents.READY_FOR_RENDER,t);
n.applyStyle(q)
}else{s(o,true)
}}},_getOldRepeaterItemMatchingDefintion:function(g,j){if(this._repeatersDataOld){var i=this._repeatersDataOld[g].readyItems;
for(var h=0;
h<i.length;
++h){var f=i[h].repeaterDefinition;
if(f.skin==j.skin&&f.dataQuery===j.dataQuery){return i.splice(h,1)[0]
}}}return null
},_getRepeaterContainer:function(d){var c=d.defintion.container;
if(c&&this._skinParts[c]){return this._skinParts[c]
}return null
},_getRepeaterDataList:function(d){if(d.dataRefList){return d.dataRefList
}if(d.dataRefField){var c=[];
if(d.dataRefField=="*"){}else{c=this._data.get(d.dataRefField)
}return c
}},dispose:function(){this._elementPool.forEach(function(b){b.getLogic().dispose()
});
this._elementPool=[];
this.parent()
},_beforeRepeatersCreation:function(){},_onRepeaterItemReady:function(g,h,f,e){},_onRepeaterReady:function(b){}}});
W.Components.newComponent({name:"mobile.core.components.Button",skinParts:{icon:{type:"htmlElement",optional:"true"},label:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["up","over","selected","pressed"],_triggers:["click"],Binds:["_onClick","_onOver","_onOut","_onMouseDown","_onMouseUp","render"],_canFocus:true,initialize:function(f,d,e){this.parent(f,d,e);
e=e||{};
this.setParameters({label:e.label||d.getAttribute("label"),toggleMode:e.toggleMode||false,disabled:e.disabled||false,iconSrc:e.iconSrc||"",command:e.command||"",commandParameter:e.commandParameter||""})
},_onDataChange:function(b){if(b.getType()=="Button"){this.setParameters({label:b.get("label"),toggleMode:b.get("toggleMode"),disabled:b.get("disabled"),iconSrc:b.get("iconSrc"),command:b.get("command"),commandParameter:b.get("commandParameter")})
}this.parent()
},render:function(){this._skinParts.label.set("html",this._label||"");
if(this._skinParts.icon){if(this._iconSrc){this._skinParts.icon.setStyle("background","url("+this._iconSrc+") no-repeat 50% 50%");
this._skinParts.icon.uncollapse()
}else{this._skinParts.icon.setStyle("background","");
this._skinParts.icon.collapse()
}}},_onEnabled:function(){var b=this._skinParts.view;
b.addEvent(Constants.CoreEvents.CLICK,this._onClick);
b.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onOver);
b.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onOut);
b.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
b.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp)
},_onDisabled:function(){var b=this._skinParts.view;
b.removeEvent(Constants.CoreEvents.CLICK,this._onClick);
b.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._onOver);
b.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onOut);
b.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
b.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp)
},setLabel:function(b){this._label=b;
this._renderIfReady()
},setIcon:function(b){this._iconSrc=b;
this._renderIfReady()
},setTextContent:function(b){this.setLabel(b)
},setToggleMode:function(b){this._toggleMode=b
},setDisabled:function(b){this._disabled=!!b;
this._renderIfReady()
},setParameters:function(d){d=d||{};
this._label=d.label||this._label;
this._toggleMode=d.toggleMode||this._toggleMode;
this._disabled=d.disabled||this._disabled;
this._iconSrc=d.iconSrc||this._iconSrc;
var c=d.commandParameter||this._commandParameter;
if(d.command){this.setCommand(d.command,c)
}this._renderIfReady()
},getLabel:function(){return this._label
},toggleSelected:function(c){var d=false;
if(typeof c!=="undefined"){d=c
}else{if(this.getState()!="selected"){d=true
}}(d)?this.setState("selected"):this.removeState("selected")
},_onClick:function(c){if(this.isEnabled()){if(!this._command){c=c||{};
c.target=this.getViewNode();
this.fireEvent(Constants.CoreEvents.CLICK,c)
}if(this._toggleMode){var d=(this.getState()!="selected")?"selected":"over";
this.setState(d)
}}},_onOver:function(b){if(this.isEnabled()&&this.getState()!="selected"){this.fireEvent("over",b);
this.setState("over")
}},_onOut:function(b){if(this.isEnabled()&&this.getState()!="selected"){this.fireEvent("up",b);
this.setState("up")
}},_onMouseDown:function(){if(this.isEnabled()&&this.getState()!="selected"){this.setState("pressed")
}},_onMouseUp:function(){this.removeState("pressed")
},getAcceptableDataTypes:function(){return["","Button"]
}}});
W.Components.newComponent({name:"mobile.core.components.ContactList",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onButtonClick"],_onItemReady:function(h,e,g){if(e){var f=h.getDataItem();
h.addEvent("click",function(){this._onButtonClick(f)
}.bind(this))
}},_onButtonClick:function(b){this.injects().LinkTypes.gotoLink(b)
},getItemClassName:function(){return"mobile.core.components.MenuButton"
},_getParamsToPassToItem:function(d,c){c({listSubType:"CONTACT"})
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["LinkList"]
}}});
W.Components.newComponent({name:"mobile.core.components.Container",skinParts:{inlineContent:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Z_INDEX_CHANGE_TYPES:{BACK:"BACK",FORWARD:"FORWARD",TOP:"TOP",BOTTOM:"BOTTOM"},initialize:function(f,e,d){this.parent(f,e,d);
this.setMaxH(8000)
},getInlineContentContainer:function(){if(this._skinParts.inlineContent){return this._skinParts.inlineContent
}return this._view
},getChildren:function(){return this.getInlineContentContainer().getChildren()
},addChild:function(b){b.getViewNode().insertInto(this.getInlineContentContainer());
this.moveChild(b,this.Z_INDEX_CHANGE_TYPES.TOP)
},removeChild:function(c){var d=c.getViewNode?c.getViewNode():c;
this.getInlineContentContainer().removeChild(d)
},canMoveForward:function(f){var e=this.getChildren();
var d=e.indexOf(f.getViewNode());
if(d==-1){return false
}return d<e.length-1
},canMoveBack:function(c){var d=this.getChildren().indexOf(c.getViewNode());
if(d==-1){return false
}return d>0
},moveChild:function(k,j){var o=this.getChildren();
var i=k.getViewNode();
var m=this.getViewNode();
var l=o.indexOf(i);
var p=l;
switch(j){case this.Z_INDEX_CHANGE_TYPES.BACK:p=l-1;
break;
case this.Z_INDEX_CHANGE_TYPES.FORWARD:p=l+1;
break;
case this.Z_INDEX_CHANGE_TYPES.BOTTOM:p=0;
break;
case this.Z_INDEX_CHANGE_TYPES.TOP:p=o.length-1;
break
}W.Utils.setChildIndex(this.getInlineContentContainer(),l,p);
var n=this.injects().Commands.getCommand("WViewerCommands.ComponentZIndexChanged");
if(n){n.execute(k)
}},hasChildren:function(){return true
},isContainer:function(){return true
},getChildComponents:function(){return this.getInlineContentContainer().getChildren("[comp]")
},getDescendantComponents:function(){return this.getDescendantComponentsRecurse(this,[])
},getDescendantComponentsRecurse:function(g,f){var h=g.getChildComponents();
for(var e=0;
e<h.length;
e++){f.push(h[e]);
if(h[e].getLogic&&h[e].getLogic().getChildComponents){this.getDescendantComponentsRecurse(h[e].getLogic(),f)
}}return f
},dispose:function(){var c=this.getChildren();
for(var d=0;
d<c.length;
d++){if(c[d].getLogic){c[d].getLogic().dispose()
}}this.parent()
}}});
W.Components.newComponent({name:"mobile.core.components.ExternalLinksList",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onButtonClick"],_onItemReady:function(h,e,g){if(e){var f=h.getDataItem();
h.addEvent("click",function(){this._onButtonClick(f)
}.bind(this));
h.setListSubtype(this._data.get("subType"))
}},_onButtonClick:function(b){this.injects().LinkTypes.gotoLink(b)
},getItemClassName:function(){return"mobile.core.components.MenuButton"
},_getParamsToPassToItem:function(d,c){c({listSubType:"EXTERNAL_LINKS"})
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["LinkList"]
}}});
W.Components.newComponent({name:"mobile.core.components.FacebookComment",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{facebook:{type:"htmlElement"}},propertiesSchema:"WFacebookCommentProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onResizeComponent"],initialize:function(c,d){this.parent(c,d)
},render:function(){this._addFacebookScript(document,"script","facebook-jssdk")
},_onComponentPropertyChange:function(c,d){this._rebuildFbCommentElement()
},_rebuildFbCommentElement:function(){this._skinParts.facebook.empty();
var c={"class":"fb-comments","data-href":document.URL,"data-num-posts":this.getComponentProperty("numPosts"),width:this.getComponentProperty("width"),colorscheme:this.getComponentProperty("colorscheme")};
var d=new Element("fb-root",c);
this._skinParts.facebook.adopt(d);
if(window.FB!=undefined){FB.XFBML.parse((this._skinParts.facebook).get(0))
}},_addFacebookScript:function(e,d,f){this.injects().Viewer.loadExternalScript("//connect.facebook.net/en_US/all.js#xfbml=1",function(){this._rebuildFbCommentElement()
}.bind(this))
}}});
W.Components.newComponent({name:"mobile.core.components.FacebookLike",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{facebook:{type:"htmlElement"}},propertiesSchema:{layout:{type:"string","enum":["standard","button_count","box_count"],"default":"standard",description:"the layout of the button"},send:{type:"boolean","default":"false",description:"enable/disable the send button"},show_faces:{type:"boolean","default":"false",description:"show the faces of your friends that liked this item"},width:{type:"string","default":"225",description:"the width of the Like button"},action:{type:"string","enum":["like","recommend"],"default":"like",description:" the verb to display on the button. Options: *like*, *recommend*"},font:{type:"string","enum":["arial","lucida grande","segoe ui","tahoma","trebuchet ms","verdana"],"default":"tahoma",description:"the font to display in the button"},colorscheme:{type:"string","enum":["light","dark"],"default":"light",description:"the color scheme for the like button"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(c,d){this.parent(c,d)
},render:function(){var b=new Iframe();
b.innerHTML='<iframe name="IFrame_gzgu1msw" width="200" height="200" id="IFrame_gzgu1msw" src="http://htmlcomponentservice.appspot.com/get_draft?id=00897b_989caa15e140d9d9f9576d40d24b4d69.html">';
if(this._iframe){b.replaces(this._iframe)
}else{this._view.adopt(b)
}this._iframe=b
}}});
W.Components.newComponent({name:"mobile.core.components.GooglePlusOne",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{googlePlus:{type:"htmlElement"}},propertiesSchema:{size:{type:"string","enum":["small","medium","standard","tall"],"default":"standard",description:"The button size to render"},annotation:{type:"string","enum":["none","bubble","inline"],"default":"inline",description:"The annotation to display next to the button."},width:{type:"string","default":"",description:"If annotation is set to *inline*, the width in pixels to use for the button and its inline annotation. If omitted, a button and its inline annotation use 450px."}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(c,d){this.parent(c,d)
},render:function(){this._runGooglePlusOneScript()
},_onComponentPropertyChange:function(c,d){this._rebuildGooglePlusElement()
},_rebuildGooglePlusElement:function(){this._skinParts.googlePlus.empty();
var c={"class":"googlePlusOne",href:"",size:this.getComponentProperty("size"),annotation:this.getComponentProperty("annotation"),width:this.getComponentProperty("width")};
var d=new Element("g\\:plusone",c);
this._skinParts.googlePlus.adopt(d);
if(window.gapi!=undefined){gapi.plusone.go()
}},_runGooglePlusOneScript:function(e,d,f){this.injects().Viewer.loadExternalScript("//apis.google.com/js/plusone.js",function(){this._rebuildGooglePlusElement()
}.bind(this))
}}});
W.Components.newComponent({name:"mobile.core.components.Header",imports:["mobile.core.components.Image"],skinParts:{title:{type:"htmlElement",autoBindData:"title"},image:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onImageDataUpdate"],_states:["showImage","hideImage"],render:function(){document.title=this._data.get("title");
this.setCollapsed(this._data.getMeta("isHidden"));
var b=this._data.get("imageSize");
switch(b){case"small":this._skinParts.image.set("class","smallHeaderImage");
break;
case"large":this._skinParts.image.set("class","largeHeaderImage");
break;
case"medium":this._skinParts.image.set("class","mediumHeaderImage");
break
}},isReady:function(){return !!this._isImageReady&&this.parent()
},_onDataChange:function(){if(!this._imageSkinContainer){var b=this._data.get("image");
if(b){this.injects().Data.getDataByQuery(b,function(a){this._imageSkinContainer=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",b,{cropMode:"full",align:"center",valign:"middle"},undefined,function(d){this._isImageReady=true;
this._imageData=a;
this._imageData.addEvent(Constants.DataEvents.DATA_CHANGED,this._onImageDataUpdate);
this._onImageDataUpdate()
}.bind(this));
this._imageSkinContainer.insertInto(this._skinParts.image)
}.bind(this))
}}else{if(this._imageSkinContainer.getLogic){this._imageSkinContainer.getLogic().refresh()
}}this.parent()
},_onImageDataUpdate:function(){if(this._imageData&&!this._imageData.getMeta("isHidden")){this._imageSkinContainer.uncollapse();
this.setState("showImage")
}else{this._imageSkinContainer.collapse();
this.setState("hideImage")
}},getAcceptableDataTypes:function(){return["Header"]
}}});
W.Components.newComponent({name:"mobile.core.components.HomeButton",skinParts:{text:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(g,f,h){this.parent(g,f,h);
this._allowClick=false;
var e=this.injects().Viewer;
e.addEvent("pageTransitionStarted",this._onNavigationPrepPage.bind(this));
e.addEvent("pageTransitionEnded",this._onNavigation.bind(this))
},render:function(){this._skinParts.text.set("html",this._data.get("text"));
this._onNavigationPrepPage();
this._onNavigation()
},_onAllSkinPartsReady:function(b){b.view.addEvent("click",this._onButtonClick.bind(this))
},_onButtonClick:function(b){if(this._allowClick){this.injects().Viewer.goToHomePage()
}},_onNavigationPrepPage:function(){this._allowClick=false;
if(this.injects().Viewer.isHomePage()){this._skinParts.view.collapse()
}else{this._skinParts.view.uncollapse()
}},_onNavigation:function(){this._allowClick=true
},getAcceptableDataTypes:function(){return["Text"]
}}});
(function(){var y=[128,256,400,512,650,850,1024];
var x="fill";
var D="full";
var M="stretch";
var A=[x,D,M];
var R="left";
var G="center";
var F="right";
var C=[R,G,F];
var T="top";
var S="middle";
var H="bottom";
var B=[T,S,H];
var L="em";
var z="px";
var N="%";
var O=[L,z,N];
var Q="auto";
var E="fixed";
var I="width";
var P="width_height";
var J=[Q,E,I,P];
var K=Q;
W.Components.newComponent({name:"mobile.core.components.Image",imports:["mobile.core.components.base.BaseComponent"],skinParts:{image:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onImageLoaded","_onOrientationChenge"],_renderTriggers:[Constants.DisplayEvents.DISPLAY_CHANGED],_states:["loading","loaded"],initialize:function(b,a,c){this.parent(b,a,c);
this.lockRefresh();
c=c||{};
this.setSize(c.width,c.height);
this.setUnit(c.unit);
this.setCropMode(c.cropMode);
this.setAlign(c.align,c.valign);
this.setScaleMode(c.scaleMode||K);
this._renderDelay=c.renderDelay||1;
this._useWebUrl=c.useWebUrl||false;
this._resultWidth=0;
this._resultHeight=0;
this._requestExactSize=false&&this.injects().Viewer.getPreviewMode()!==true;
this._scaleToCanvas=false&&Modernizr.canvas;
this.injects().Viewer.addOrientationEvent(this._onOrientationChenge)
},_onOrientationChenge:function(){setTimeout(this.refresh.bind(this,true),50)
},render:function(){this.unLockRefresh();
if(this._renderDelay===0){this.refresh(true)
}else{this.injects().Utils.callLater(this.refresh,[true],this,this._renderDelay)
}},_needsRender:function(){var a=this._getMeasureSize();
return(this._resultWidth!=a.x||this._resultHeight!=a.y||this._isPropInvalid("size")||this._isPropInvalid("unit")||this._isPropInvalid("cropMode"))
},_onAllSkinPartsReady:function(){this._skinParts.image.setStyle("position","absolute");
this._skinParts.view.setStyles({position:"relative",overflow:"hidden"})
},lockRefresh:function(){this._isLock=true
},unLockRefresh:function(){this._isLock=false
},refresh:function(a){if(this._renderDelay===0){this._onRefresh(a)
}else{this.injects().Utils.callLater(this._onRefresh,[a],this,this._renderDelay)
}},_onRefresh:function(e){if(this._isLock&&!e){return false
}if(!this._data){return
}this._skinParts.image.set("alt",this._data.get("alt"));
var d=parseInt(this._data.get("width"),10);
var h=parseInt(this._data.get("height"),10);
var c=(d/h)||1;
if(e||(this._isPropInvalid("size")||this._isPropInvalid("unit"))){this._skinParts.view.setStyles({width:this._getTargetSize("width"),height:this._getTargetSize("height")});
var j=this._getMeasureSize();
this._resultWidth=j.x;
if(this._scaleMode==I){this._resultHeight=j.x/c;
this._skinParts.view.setStyles({width:this._resultWidth,height:this._resultHeight})
}else{this._resultHeight=j.y
}}if(e||this._isPropInvalid("size")||this._isPropInvalid("scaleMode")||(this._isPropInvalid("cropMode")||this._isPropInvalid("unit"))){var i=this._resultWidth/this._resultHeight;
var m,l;
switch(this._cropMode){case x:if(c>i){l=this._resultHeight;
m=l*c
}else{m=this._resultWidth;
l=m/c
}break;
case D:if(c<i){l=this._resultHeight;
m=l*c
}else{m=this._resultWidth;
l=m/c
}break;
case M:m=this._resultWidth;
l=this._resultHeight;
break
}var b;
if(!this._requestExactSize){b=this._getPyramidSize((l>m)?l:m)
}var n=this._imgRequestSize;
this._maxImgRequestSize=Math.max(b,this._maxImgRequestSize)||b;
this._imgRequestSize=b;
var g;
this._oldUri=this._uri;
if(this._useWebUrl){g=this._data.get("uri");
this._uri=g
}else{var f=this.injects().Config.getPack("VIEWER_PARAMS").staticMediaUrl+"/";
this._uri=this._data.get("uri");
if(/[^.]+$/.exec(this._uri)[0]=="ico"){f=f.replace("media","ficons")
}if(this._maxImgRequestSize>=b&&this._oldUri==this._uri){b=this._maxImgRequestSize
}g=this._createImageRequest(f+this._uri,b,m,l)
}var k,a;
switch(this._align){case R:k=0;
break;
case G:k=(this._resultWidth/2)-(m/2);
break;
case F:k=this._resultWidth-m;
break
}switch(this._valign){case T:a=0;
break;
case S:a=(this._resultHeight/2)-(l/2);
break;
case H:a=this._resultHeight-l;
break
}m=isNaN(m)?0:Math.ceil(m);
l=isNaN(l)?0:Math.ceil(l);
a=isNaN(a)?0:Math.ceil(a);
k=isNaN(k)?0:Math.ceil(k);
this.fireEvent("loading",{url:g,imgWidth:m,imgHeight:l,requestSize:b,imgX:k,imgY:a});
this._skinParts.image.setStyles({width:m+"px",height:l+"px",top:a+"px",left:k+"px"});
if(g!=this._skinParts.image.get("src")){if(this._oldUri!=this._uri||b>n){this.setState("loading")
}this._skinParts.image.addEvent("load",this._onImageLoaded);
this._skinParts.image.removeEvents("error");
this._skinParts.image.addEvent("error",this._onImageError.bind(this,g));
this._skinParts.image.set("src",g)
}else{this._moveImageToBackground()
}}this._validate();
return true
},_createImageRequest:function(f,e,d,b){var c;
if(this._requestExactSize){var a=/[.]([^.]+)$/.exec(f)[1]||"";
c=f+"_srz_"+parseInt(d,10)+"_"+parseInt(b,10)+"_85_22_0.50_1.20_0.00_"+a+"_srz"
}else{c=f+"_"+e
}return c
},_getPyramidSize:function(b){var a=y[y.length-1];
for(var c=0;
c<y.length;
++c){if(y[c]>=b){a=y[c];
break
}}return a
},_onImageError:function(a){LOG.reportError(wixErrors.IMAGE_LOAD_ERROR,"Image","refresh",a);
this._renderIfReady()
},_onImageLoaded:function(){var a=(window.Browser.ie7)?7000:1;
this.injects().Utils.callLater(this._validateResultImageSize,[],this,a);
this.setState("loaded");
this._moveImageToBackground();
this._renderIfReady()
},_validateResultImageSize:function(){this._renderIfReady()
},_moveImageToBackground:function(){var e=this._skinParts.image;
if(this._resultWidth&&this._resultWidth!==0&&this._resultHeight&&this._resultHeight!==0){if(this._scaleToCanvas===true){this._renderImageIntoCanvas()
}else{if(Modernizr.backgroundsize){var g=this.injects().Utils.getCSSBrowserFeature("backgroundSize");
var c={};
c["background-image"]="url('"+e.get("src")+"')";
if(this._requestExactSize){var f=parseInt(e.getStyle("width"),10);
var d=parseInt(e.getStyle("height"),10);
var b,a;
if(Math.abs(f-this._resultWidth)<=1){b="auto"
}else{b=f+"px"
}if(Math.abs(d-this._resultHeight)<=1){a="auto"
}else{a=d+"px"
}c[g]=b+" "+a
}else{c[g]=e.getStyle("width")+" "+e.getStyle("height")
}c["background-position"]=parseInt(e.getStyle("left"),10)+"px "+parseInt(e.getStyle("top"),10)+"px";
c["background-repeat"]="no-repeat";
this._skinParts.view.setStyles(c);
e.setStyles({visibility:"hidden"})
}}}},_renderImageIntoCanvas:function(){if(Modernizr.canvas&&this._resultWidth&&this._resultWidth!==0&&this._resultHeight&&this._resultHeight!==0){var c;
var e=this._skinParts.image;
var b=this.injects().Utils.getCSSBrowserFeature("backgroundSize");
var a=e.getCoordinates(this._skinParts.view);
var d=this._skinParts.view.getSize();
if(!this._imgCanvas){this._imgCanvas=new Element("canvas");
this._skinParts.view.grab(this._imgCanvas);
this._virtualCanvas=new Element("canvas")
}this._virtualCanvas.width=e.getWidth();
this._virtualCanvas.height=e.getHeight();
this._imgCanvas.width=this._resultWidth;
this._imgCanvas.height=this._resultHeight;
c=this._virtualCanvas.getContext("2d");
c.drawImage(e,0,0,e.getWidth(),e.getHeight());
c=this._imgCanvas.getContext("2d");
if(this._cropMode==D){c.drawImage(this._virtualCanvas,a.left,a.top)
}else{c.drawImage(this._virtualCanvas,-a.left,-a.top,this._resultWidth,this._resultHeight,0,0,this._resultWidth,this._resultHeight)
}}},_getTargetSize:function(b){var a="100%";
if(!isNaN(this["_"+b])){a=Number(this["_"+b])+this._unit
}return a
},_getMeasureSize:function(){return(this._unit!=z)?this._skinParts.view.getSize():{x:Number(this._width),y:Number(this._height)}
},_invalidProps:{},_invalidate:function(b){switch(typeOf(b)){case"string":this._invalidProps[b]="invalid";
break;
case"array":for(var a=0;
a<b.length;
++a){this._invalidProps[b[a]]="invalid"
}break
}},_validate:function(b){switch(typeOf(b)){case"string":delete this._invalidProps[b];
break;
case"array":for(var a=0;
a<b.length;
++a){delete this._currentProps[b[a]]
}break;
default:this._currentProps={};
break
}},_isPropInvalid:function(a){return Boolean(this._invalidProps[a])
},setCropMode:function(a){a=(A.contains(a))?a:this._cropMode||x;
if(a!=this._cropMode){this._cropMode=a;
this._invalidate("cropMode");
this._renderIfReady()
}},setScaleMode:function(a){if(!J.contains(a)){a=K
}if(a!=this._scaleMode){this._scaleMode=a;
this._invalidate("scaleMode");
this._renderIfReady()
}},setAlign:function(b,a){b=(C.contains(b))?b:this._align||G;
a=(B.contains(a))?a:this._valign||S;
if(b!=this._align||a!=this._valign){this._align=b;
this._valign=a;
this._invalidate("align");
this._renderIfReady()
}},setSize:function(b,a){b=(b)?parseInt(b,10):this._width;
a=(a)?parseInt(a,10):this._height;
if(b!=this._width||a!=this._height){this._width=b;
this._height=a;
this._invalidate("size");
this._renderIfReady()
}},getImageSize:function(){var a=this._skinParts.image;
return{x:this._width,y:this._height}
},setUnit:function(a){a=(O.contains(a))?a:this._unit||N;
if(a!=this._unit){this._unit=a;
this._invalidate("unit");
this._renderIfReady()
}},getAcceptableDataTypes:function(){return["Image",""]
}}})
})();
W.Components.newComponent({name:"mobile.core.components.MenuButton",skinParts:{label:{type:"htmlElement"},icon:{type:"htmlElement",optional:true},description:{type:"htmlElement",optional:true},bullet:{type:"htmlElement",optional:true}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_buttonClick","_onMouseOver","_onMouseOut","_setImages","_onThemePropChange"],_states:["selected","idle","up","over","down","disable"],initialize:function(f,d,e){this.parent(f,d,e);
this._listSubType="NONE";
if(e&&e.listSubType){this.setListSubtype(e.listSubType)
}this.injects().Theme.addEvent("propertyChange",this._onThemePropChange)
},_onThemePropChange:function(b){this._setImages(b)
},_onDataChange:function(b){this._updateButtonView();
this.fireEvent("dataChanged");
return this.parent(b)
},render:function(){this._updateButtonView()
},_updateButtonView:function(){if(!this._data){return
}var f=(this._data.getType()=="Page")?"title":"text";
var g=this._data.get(f);
this._skinParts.label.set("html",this._getNonEmptyText(g));
var h=this._skinParts.description;
if(h){var e=this._data.get("target");
h.set("html",this._getNonEmptyText(e))
}this._setImages()
},getID:function(){return this._data.get("id")
},_getNonEmptyText:function(b){b=b.trim().replace(/ /g,"&nbsp;");
return b||"&nbsp;"
},_onAllSkinPartsReady:function(b){this.injects().Theme.addEvent(Constants.ComponentEvents.PROPERTY_CHANGE,this._setImages);
b.view.addEvent(Constants.CoreEvents.CLICK,this._buttonClick);
b.view.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
b.view.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut)
},_setImages:function(h){var e;
var i=this._listSubType+"_DIRECTORY";
if(h&&h.name!=i){return
}var g=this.injects().Theme.getProperty(i);
if(this._data.getType()=="Link"){this._skinParts.icon.uncollapse();
if(this._listSubType=="PAGES"){e=g+this._data.get("icon")
}else{e=g+this.injects().LinkTypes.getLinkIcon(this._data.get("linkType"))
}this._skinParts.icon.set("src",e)
}else{if(this._skinParts.icon){var j=this._data.get("icon");
if(j){e=g+this._data.get("icon");
this._skinParts.icon.set("src",e)
}else{this._skinParts.icon.setStyle("display","none")
}}}},setLabel:function(b){this._skinParts.label.set("html",this._getNonEmptyText(b))
},setListSubtype:function(b){this._listSubType=b
},_buttonClick:function(){this.fireEvent("click")
},_onMouseOver:function(){this.fireEvent("over")
},_onMouseOut:function(){this.fireEvent("out")
},getAcceptableDataTypes:function(){return["Link","Page",""]
}}});
W.Components.newComponent({name:"mobile.core.components.NetworkList",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],image:[{itemsContainer:"htmlElement"}],Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onButtonClick"],_onItemReady:function(h,e,g){if(e){var f=h.getDataItem();
h.addEvent("click",function(){this._onButtonClick(f)
}.bind(this))
}},_onButtonClick:function(b){this.injects().LinkTypes.gotoLink(b)
},getItemClassName:function(){return"mobile.core.components.MenuButton"
},_getParamsToPassToItem:function(d,c){c({listSubType:"NETWORKS"})
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["LinkList"]
}}});
W.Components.newComponent({name:"mobile.core.components.Page",skinParts:{},Class:{Extends:"mobile.core.components.Container",initialize:function(f,e,d){this.parent(f,e,d);
this._isContentWixified=false;
this._isContentWixifyStarted=false;
this._wixifyCBList=[];
this._contentReady=false;
this.setMaxH(10000);
this.setMinH(500);
e.collapse()
},listenForContentRendered:function(){var g=this.getDescendantComponents();
var h=[];
for(var e=0;
e<g.length;
e++){if(!g[e].getLogic||g[e].getLogic().isRendered()!==true){h.push(g[e])
}}if(h.length==0){this._setContentRendered()
}else{var f=new Async.Bulk(h,null,{completeEvent:Constants.ComponentEvents.RENDER,completeCallback:function(){this._setContentRendered()
}.bind(this)})
}},getAcceptableDataTypes:function(){return["Page"]
},wixifyContent:function(e){if(e){this._wixifyCBList.push(e)
}if(!this._isContentWixified){if(this._isContentWixifyStarted){return
}this._isContentWixifyStarted=true;
var f=this._view.getElements("[comp]");
if(f.length==0){this._setWixified();
this.listenForContentRendered();
return
}var d=new Async.Bulk(f,null,{completeEvent:"wixified",completeCallback:function(){this._setWixified()
}.bind(this)});
this.listenForContentRendered();
f.wixify()
}else{this._setWixified()
}},render:function(){var b=W.Layout.getComponentMinResizeHeight(this);
this.setHeight(b)
},isContentWixify:function(){return this._isContentWixified
},_setWixified:function(){if(!this._isContentWixified){this._view.getElements(".initHidden").removeClass("initHidden");
this._view.removeClass("initHidden");
this._isContentWixified=true
}this.fireEvent("contentWixified",this);
for(var b=0;
b<this._wixifyCBList.length;
++b){this._wixifyCBList[b]()
}this._wixifyCBList=[];
if(this.injects().Layout){this.injects().Layout.attachSavedAnchors(this._view)
}},_setContentRendered:function(){this._contentReady=true;
this._findAndEnforceInvalidatedAnchors(this);
this.render();
this.fireEvent("pageContentReady")
},_findAndEnforceInvalidatedAnchors:function(g){if(!g.getChildComponents){return
}var e=g.getChildComponents();
var h=[];
for(var f=0;
f<e.length;
f++){this._findAndEnforceInvalidatedAnchors(e[f].getLogic());
if(e[f].getLogic().isAnchorsInvalidated()){h.push(e[f].getLogic())
}}W.Layout.enforceAnchors(h)
},setAsWixified:function(){this._setWixified()
},isAnchorable:function(){return{to:{allow:true,lock:W.BaseComponent.AnchorLock.NEVER},from:false}
},isSelectable:function(){return false
},isContentReady:function(){return this._contentReady
},getInlineContentContainer:function(){if(this._skinParts.inlineContent){return this._skinParts.inlineContent
}return this._view
}}});
W.Components.newComponent({name:"mobile.core.components.PageTitle",skinParts:{view:{type:"htmlElement",autoBindData:"title"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_render:function(){this._skinParts.view.setCollapsed(this.getDataItem().get("hideTitle"))
},getAcceptableDataTypes:function(){return["Page"]
}}});
var IMAGE_SIZES=["small","medium","large"];
W.Components.newComponent({name:"mobile.core.components.Photo",traits:["mobile.core.components.traits.SizeMeasurement"],skinParts:{img:{type:"mobile.core.components.Image",dataRefField:"*",argObject:{scaleMode:"width"}},photoFullScreen:{type:"mobile.core.components.PhotoFullScreen",dataRefField:"*"}},propertiesSchemaName:"PhotoProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",_states:IMAGE_SIZES,Binds:["_enterFullScreenMode","_exitFullScreenMode"],initialize:function(j,g,f,h){this.parent(j,g,f,h);
this._scrollPos={x:0,y:0};
var i=this.getComponentProperty("imageSize");
if(i){this.setState(i)
}},_onAllSkinPartsReady:function(){this._skinParts.view.addEvent("click",this._enterFullScreenMode)
},_onDataChange:function(d,e,f){if(e!="imageSize"){return
}this.setState(f);
this._skinParts.img.refresh(true)
},_saveScrollPosition:function(){this._scrollPos.x=document.body.scrollLeft;
this._scrollPos.y=document.body.scrollTop
},_enterFullScreenMode:function(){if(this.injects().Viewer.isScrollLock()){return
}this._saveScrollPosition();
this._fullScreenContainer=this.injects().Viewer.enterFullScreenMode(this._exitFullScreenMode);
this._skinParts.photoFullScreen.getViewNode().insertInto(this._fullScreenContainer);
this._skinParts.photoFullScreen.showImage()
},_exitFullScreenMode:function(){this._skinParts.photoFullScreen.exitFullScreen();
window.scrollTo(this._scrollPos.x,this._scrollPos.y)
},getAcceptableDataTypes:function(){return["Image"]
}}});
W.Components.newComponent({name:"mobile.core.components.PhotoFullScreen",traits:["mobile.core.components.traits.TouchSupport"],skinParts:{exitButton:{type:"htmlElement"},infoButton:{type:"htmlElement"},title:{type:"htmlElement"},description:{type:"htmlElement"},controls:{type:"htmlElement"},img:{type:"mobile.core.components.Image",dataRefField:"*",argObject:{cropMode:"full"}}},states:[],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_dragStartHandler","_setCloseButton","_updateScreenSize","_onInfoButtonClick"],_renderTriggers:[Constants.DisplayEvents.DISPLAY_CHANGED],initialize:function(f,e,d){this.parent(f,e,d);
this.injects().Viewer.addOrientationEvent(this._updateScreenSize);
this._setEventsType()
},render:function(){if(!this._guiCreated){this.collapse();
this._createGui()
}this._imageDataOnChange()
},_prepareForRender:function(){this._updateScreenSize();
return true
},_onAllSkinPartsReady:function(){this.injects().Theme.addEvent("propertyChange",this._setCloseButton)
},_switchFromInfoPresentationToPhotoPresentation:function(){this._skinParts.controls.collapse();
this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_info.png");
this._skinParts.exitButton.uncollapse()
},_createGui:function(){this.hideOverlayControls();
this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_info.png");
this._skinParts.infoButton.addEvent(this._eventNames.down,this._onInfoButtonClick);
this._skinParts.controls.addEvent(this._eventNames.down,function(b){this._switchFromInfoPresentationToPhotoPresentation();
b.preventDefault();
return false
}.bind(this));
this._skinParts.exitButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_back.png");
this._skinParts.exitButton.addEvent(this._eventNames.down,function(f){this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_info.png");
this._skinParts.exitButton.uncollapse();
var e=f.event;
var d=(e.currentTarget)?e.currentTarget:e.srcElement;
if(!this._touchSupported||(this._touchSupported&&e.touches.length==1)){this._skinParts.infoButton.uncollapse();
this.injects().Viewer.exitFullScreenMode();
f.stop();
return false
}}.bind(this));
this._view.addEvent(this._eventNames.down,this._onInfoButtonClick);
this._guiCreated=true
},_onInfoButtonClick:function(b){if(this._isInfoButtonPressed()){this._switchFromInfoPresentationToPhotoPresentation()
}else{this._skinParts.controls.uncollapse();
this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_x_info.png");
this._skinParts.exitButton.collapse()
}b.preventDefault();
return false
},_isInfoButtonPressed:function(){return !this._skinParts.controls.hasClass(Constants.CoreClasses.HIDDEN)
},_imageDataOnChange:function(){this._skinParts.title.set("html",this._data.get("title"));
this._skinParts.description.set("html",this._data.get("description"))
},showImage:function(){this.uncollapse()
},showOverlayControls:function(){this._skinParts.controls.uncollapse();
this._fullScreenControlsHidden=false
},hideOverlayControls:function(){this._skinParts.controls.collapse();
this._fullScreenControlsHidden=true
},_dragStartHandler:function(c){var d=c.event;
if(!this._touchSupported||(this._touchSupported&&d.touches.length==1)){this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_info.png");
this._skinParts.exitButton.uncollapse();
this.injects().Viewer.exitFullScreenMode();
c.stop();
return false
}},exitFullScreen:function(){this.isInView=false;
this._view.removeEvent(this._eventNames.move,this._dragMoveHandler);
this._view.removeEvent(this._eventNames.up,this._dragStopHandler);
this.hideOverlayControls()
},_setCloseButton:function(b){if(b.name=="THEME_DIRECTORY"){this._skinParts.exitButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_back.png")
}},_updateScreenSize:function(){this._skinParts.img.refresh(true)
},getAcceptableDataTypes:function(){return["Image"]
}}});
W.Components.newComponent({name:"mobile.core.components.PhotoGalleryFullScreen",traits:["mobile.core.components.traits.TouchSupport"],skinParts:{exitButton:{type:"htmlElement"},title:{type:"htmlElement"},description:{type:"htmlElement"},nextButton:{type:"htmlElement"},prevButton:{type:"htmlElement"},controls:{type:"htmlElement"},imagesContainer:{type:"htmlElement"}},states:[],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_dragStartHandler","_dragMoveHandler","_dragStopHandler","_setOrientationChangeEvent","_imageDataOnChange"],initialize:function(f,e,d){this.parent(f,e,d);
this._fullScreenImages=[];
this._setEventsType();
this._setCloseButton=this._setCloseButton.bind(this);
this.injects().Viewer.addOrientationEvent(this._setOrientationChangeEvent)
},render:function(){if(!this._guiCreated){this._createGui()
}this.injects().Theme.addEvent("propertyChange",this._setCloseButton)
},_imageDataOnChange:function(){this._skinParts.title.set("html",this._trackedImageData.get("title"));
this._skinParts.description.set("html",this._trackedImageData.get("description"))
},showImageAt:function(d){var e=this._imagesData.length;
if(e<1){return
}$(window).scrollTo(0,0);
if(d<0||d>=e){LOG.reportError(wixErrors.EDITOR_INDEX_OUT_OF_RANGE,"mobile.core.components.PhotoGalleryFullScreen","showImageAt",d);
d=0
}this._selectedImageIndex=d;
var f=this._imagesData[d].dataObj;
if(this._trackedImageData){this._trackedImageData.removeEvent(Constants.DataEvents.DATA_CHANGED,this._imageDataOnChange)
}this._trackedImageData=f;
f.addEvent(Constants.DataEvents.DATA_CHANGED,this._imageDataOnChange);
this._updateDisplay();
this.hideOverlayControls();
if(this._fullScreenImages.length==0){this._createImages(d)
}else{this._updateImages(d)
}this._skinParts.title.set("html",f.get("title"));
this._skinParts.description.set("html",f.get("description"));
this._view.removeEvent(this._eventNames.down,this._IOS5Bridge);
this._view.addEvent(this._eventNames.down,this._IOS5Bridge)
},_updateDisplay:function(){var b=document.getSize();
this._screenSize=b;
this._skinParts.imagesContainer.setStyles({width:(b.x*3)+"px",left:(0-this._screenSize.x-1)+"px"})
},showOverlayControls:function(){this._skinParts.controls.uncollapse();
this._fullScreenControlsHidden=false
},hideOverlayControls:function(){this._skinParts.controls.collapse();
this._fullScreenControlsHidden=true
},_createImages:function(e){this._skinParts.imagesContainer.empty();
for(var d=0;
d<3;
d++){var f=this.injects().Components.createComponent("mobile.core.components.Image",this._skin.imageSkinClassName,this._imagesData[this._getRotatedImageIndex(e+d-1)].dataObj,{renderDelay:0,width:this._screenSize.x,height:this._screenSize.y,unit:"px",valign:"middle",align:"center",cropMode:"full"});
this._fullScreenImages[d]=f;
f.insertInto(this._skinParts.imagesContainer);
f.setPosition({x:(this._screenSize.x*d),y:0})
}},_updateImages:function(f){for(var e=0;
e<3;
e++){var h=this._fullScreenImages[e];
var g=h.getLogic();
g.setDataItem(this._imagesData[this._getRotatedImageIndex(f+e-1)].dataObj);
g.setSize(this._screenSize.x,this._screenSize.y);
h.setPosition({x:(this._screenSize.x*e),y:0})
}},_onDataChange:function(){this._imagesData=this._data.get("items").clone();
if(this._imagesData.length>0){this.injects().Data.getDataByQueryList(this._data.get("items"),function(d){for(var c=0;
c<this._imagesData.length;
c++){this._imagesData[c]={query:this._imagesData[c],dataObj:d[this._imagesData[c]]}
}this._renderIfReady()
}.bind(this))
}},_getRotatedImageIndex:function(b){if(b<0){b=this._imagesData.length+b
}else{if(b>=this._imagesData.length){b=b-this._imagesData.length
}}return b
},_createGui:function(){this._skinParts.nextButton.addEvent(this._eventNames.down,function(b){this._moveImages(1);
b.stop();
return false
}.bind(this));
this._skinParts.prevButton.addEvent(this._eventNames.down,function(b){this._moveImages(-1);
b.stop();
return false
}.bind(this));
this._skinParts.exitButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/close.png");
this._skinParts.exitButton.addEvent(this._eventNames.down,function(b){if(this._trackedImageData){this._trackedImageData.removeEvent(Constants.DataEvents.DATA_CHANGED,this._imageDataOnChange)
}this.injects().Viewer.exitFullScreenMode();
b.stop();
return false
}.bind(this));
this._IOS5Bridge=function(b){this._dragStartHandler(b)
}.bind(this);
this._view.addEvent(this._eventNames.down,this._IOS5Bridge);
this._guiCreated=true
},_setOrientationChangeEvent:function(b){this._screenSize=b;
if(this._selectedImageIndex>-1){this.showImageAt(this._selectedImageIndex)
}},_moveImages:function(f){this._fullScreenImages[1].removeEvent(this._eventNames.down,this._dragStartHandler);
var e=0-(f+1)*this._screenSize.x;
var d=new Fx.Tween(this._skinParts.imagesContainer,{fps:25,duration:300,transition:"sine:out",property:"left"});
d.addEvent("complete",function(){if(f!=0){var b=this._selectedImageIndex+f;
if(b<0){b=this._imagesData.length+b
}else{if(b>this._imagesData.length-1){b=b-this._imagesData.length
}}var a;
if(f>0){a=this._fullScreenImages.splice(0,1)[0];
this._fullScreenImages[2]=a
}else{a=this._fullScreenImages.splice(2,1)[0];
this._fullScreenImages.unshift(a)
}this.showImageAt(b)
}else{this._fullScreenImages[1].addEvent(this._eventNames.down,this._dragStartHandler)
}}.bind(this));
d.start(e)
},_dragStartHandler:function(f){var e=f.event;
var d=(e.currentTarget)?e.currentTarget:e.srcElement;
if(!this._touchSupported||(this._touchSupported&&e.touches.length==1)){this._skinParts.controls.collapse();
this._dragStartTime=new Date().getTime();
if(this._touchSupported){this._dragStartX=e.touches[0].pageX
}else{if(e.pageX){this._dragStartX=e.pageX
}else{this._dragStartX=e.clientX
}}this._containerDragStartX=this._skinParts.imagesContainer.getPosition().x;
this._dX=0;
this._dragging=true;
d.addEvent(this._eventNames.move,this._dragMoveHandler);
d.addEvent(this._eventNames.up,this._dragStopHandler);
f.preventDefault();
return false
}},_dragMoveHandler:function(e){var f=e.event;
var g;
if(this._touchSupported){g=f.touches[0].pageX
}else{if(f.pageX){g=f.pageX
}else{g=f.clientX
}}this._dX=g-this._dragStartX;
var h=this._containerDragStartX+this._dX;
this._skinParts.imagesContainer.setStyle("left",h+"px");
e.preventDefault();
return false
},_dragStopHandler:function(i){var g=i.event;
var j=(g.currentTarget)?g.currentTarget:g.srcElement;
j.removeEvent(this._eventNames.move,this._dragMoveHandler);
j.removeEvent(this._eventNames.up,this._dragStopHandler);
this._dragStopTime=new Date().getTime();
var f;
if(Math.abs(this._dX)<10){if(this._fullScreenControlsHidden){this.showOverlayControls()
}else{this.hideOverlayControls()
}}else{this._fullScreenControlsHidden=true;
if(this._dragStopTime-this._dragStartTime<1000&&Math.abs(this._dX)>30){f=(this._dX>0)?0-1:1
}else{var h=this._skinParts.imagesContainer.getPosition().x;
f=Math.round(Math.abs(h)/this._screenSize.x)-1
}this._moveImages(f)
}this._dX=this._dragStartPoint=this._divDragStartPoint=this._dragStartTime=this._dragStopTime=null;
this._dragging=false;
i.preventDefault();
return false
},exitFullScreen:function(){this._view.removeEvent(this._eventNames.move,this._dragMoveHandler);
this._view.removeEvent(this._eventNames.up,this._dragStopHandler);
this.hideOverlayControls()
},_setCloseButton:function(b){if(b.name=="THEME_DIRECTORY"){this._skinParts.exitButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/close.png")
}},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"mobile.core.components.PhotoGalleryGrid",imports:["mobile.core.components.Image"],traits:["mobile.core.components.traits.TouchSupport"],skinParts:{imagesContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",_states:["grid","fullScreen"],initialize:function(f,d,e){this.parent(f,d,e);
this.isFullScreen=false;
this._firstRun=true;
this._loadedEreas=0;
this._requiredAreasSum=3;
this._fullScreenViewReady=false;
this._loadedImagesSum=0;
this._setEventsType()
},_prepareForRender:function(){if(!this._fullScreenViewReady){this._createFullScreenView();
return(!!this._fullScreenView)
}return this.parent()
},_onItemReady:function(d,e,f){d.getViewNode().addEvent("click",function(){this._enterFullScreenMode(this._itemsNodes.indexOf(d.getViewNode()))
}.bind(this))
},getSkinElementByIndex:function(d){var c=this._skinParts.imagesContainer.getChildren();
return c[d]
},_createFullScreenView:function(){this._fullScreenView=this.injects().Components.createComponent("mobile.core.components.PhotoGalleryFullScreen",this._skin.fullScreenViewSkinClassName,this._data,{},function(){this._fullScreenViewReady=true;
this._renderIfReady()
}.bind(this))
},_enterFullScreenMode:function(b){if(this._fullScreenViewReady&&!this.isFullScreen){this._fullScreenContainer=this.injects().Viewer.enterFullScreenMode(this._exitFullScreenMode.bind(this));
this._fullScreenView.insertInto(this._fullScreenContainer);
this._fullScreenView.getLogic().showImageAt(b);
this.isFullScreen=true
}},_exitFullScreenMode:function(){this._fullScreenView.getLogic().exitFullScreen();
this.isFullScreen=false;
var f=this._skinParts.imagesContainer.getChildren();
for(var e=0;
e<f.length;
++e){var d=f[e];
if(d.getLogic){d.getLogic().refresh(true)
}}},getItemClassName:function(){return"mobile.core.components.Image"
},getItemsContainer:function(){return this._skinParts.imagesContainer
},_getParamsToPassToItem:function(d,c){c({width:5.2,height:5.4,unit:"em",cropMode:"fill"})
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"mobile.core.components.RichText",imports:["mobile.core.components.base.BaseComponent"],skinParts:{richTextContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",render:function(){var c=this._data.get("text");
this._skinParts.richTextContainer.set("html",c);
var d=$(this._skinParts.richTextContainer).getElements("a");
this._sanitizeLinks(d);
this._disableLinks(d)
},getAcceptableDataTypes:function(){return["Text","RichText"]
}}});
var NO_IMAGE_STATE="noImage";
var IMAGE_ON_RIGHT_STATE="imageOnRight";
var IMAGE_ON_LEFT_STATE="imageOnLeft";
W.Components.newComponent({name:"mobile.core.components.RichTextImage",skinParts:{image:{type:"htmlElement"},text:{type:"htmlElement"}},states:[NO_IMAGE_STATE,IMAGE_ON_RIGHT_STATE,IMAGE_ON_LEFT_STATE],Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(f,e,d){this.parent(f,e,d);
this.setState(NO_IMAGE_STATE);
this.imageDataQuery=undefined
},render:function(){var h=this._data.get("imagePosition");
this.setState(h);
var f=this._data.get("text");
if(f!=this.textDataQuery){this.injects().Data.getDataByQuery(f,function(a){a.addEvent(Constants.DataEvents.DATA_CHANGED,this._onTextDataChange.bind(this,a));
this._onTextDataChange(a)
}.bind(this));
this.textDataQuery=f
}var g=this._data.get("image");
var e=this.injects().Components;
if(g!=this.imageDataQuery){this._imageSkinContainer=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",g,{width:6,height:6,cropMode:"leftCenter"},function(a){var b=a._data;
b.addEvent(Constants.DataEvents.DATA_CHANGED,this._onImageDataChange.bind(this,b))
}.bind(this));
this._skinParts.image.empty();
this._imageSkinContainer.insertInto(this._skinParts.image);
this.imageDataQuery=g
}},_onTextDataChange:function(f){var d=f.get("text");
this._skinParts.text.set("html",d);
var e=$(this._skinParts.text).getElements("a");
this._disableLinks(e)
},_onImageDataChange:function(b){},getAcceptableDataTypes:function(){return["RichTextImage"]
}}});
W.Components.newComponent({name:"mobile.core.components.ServiceItem",skinParts:{icon:{type:"htmlElement"},label:{type:"htmlElement"},readMore:{type:"htmlElement"},description:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_toggleOpen","_onImageReady"],_states:["uncut","cutClosed","cutOpened"],initialize:function(f,d,e){this.parent(f,d,e);
this._opened=false;
this._uncut=true;
this.imageDataQuery=undefined
},render:function(){this._skinParts.label.set("html",this._data.get("title"));
var f=this._data.get("description");
f=f.replace(/\n/g,"<br/>");
this._skinParts.description.set("html",f);
var e=$(this._skinParts.description).getElements("a");
this._sanitizeLinks(e);
this._disableLinks(e);
this._skinParts.readMore.set("html","Read More");
this._testOpenState();
this._view.addEvent("click",this._toggleOpen);
var d=this._data.get("image");
if(d!=this.imageDataQuery){this._imageSkinContainer=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",d,{width:6,height:6,unit:"em",align:"center",valign:"top",cropMode:"fill"},this._onImageReady);
this._skinParts.icon.empty();
this._imageSkinContainer.insertInto(this._skinParts.icon);
this.imageDataQuery=d
}},_testOpenState:function(){var d=this._skinParts.allText.getSize();
var c=parseInt(this.injects().Utils.getComputedStyle(this._skinParts.description).fontSize,10);
if(d.y>c*6.5){this._opened=!this._opened;
this._uncut=false;
this._toggleOpen()
}else{this._uncut=true;
this.setState("uncut")
}},_toggleOpen:function(){if(this._uncut||W.Viewer.isScrollLock()){return
}if(this._opened){this._skinParts.readMore.set("html","Read More");
this.setState("cutClosed")
}else{this._skinParts.readMore.set("html","Close");
this.setState("cutOpened")
}this.fireEvent("autoSizedAnimation");
this._opened=!this._opened
},_onAutoSizedAnimtion:function(){},_onImageReady:function(b){b._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._onImageDataChange.bind(this,b._data));
this._onImageDataChange(b._data)
},_onImageDataChange:function(b){if(b.getMeta("isHidden")){this._skinParts.icon.collapse();
this._skinParts.view.removeClass("showImage");
this._skinParts.view.addClass("hideImage")
}else{this._skinParts.icon.uncollapse();
this._skinParts.view.addClass("showImage");
this._skinParts.view.removeClass("hideImage")
}},getAcceptableDataTypes:function(){return["Service"]
}}});
W.Components.newComponent({name:"mobile.core.components.ServiceList",skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",getItemClassName:function(){return"mobile.core.components.ServiceItem"
},_getParamsToPassToItem:function(d,c){c(undefined)
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["ServiceList"]
}}});
W.Components.newComponent({name:"mobile.core.components.SimpleBaseList",Class:{Extends:"mobile.core.components.BaseList",initialize:function(f,d,e){this.parent(f,d,e);
this._allItemsLoaded=false;
this._isLoadingItems=false
},getAcceptableDataTypes:function(){return["PropertyList"]
},getItemsContainer:function(){return this._skinParts.itemsContainer||this._view
},_prepareForRender:function(){if(this._allItemsLoaded){return true
}if(this._isLoadingItems){return false
}this._isLoadingItems=true;
var b=this._getItemsData();
this._renderItems(b);
return this._allItemsLoaded
},_onDataChange:function(){this._allItemsLoaded=false;
this._isLoadingItems=false;
this.parent()
},_getItemsData:function(){if(this._data){return this._data.get("items")
}},_onAllItemsReady:function(){this._isLoadingItems=false;
this._allItemsLoaded=true;
this._renderIfReady()
}}});
W.Components.newComponent({name:"mobile.core.components.SimpleButton",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{label:{type:"htmlElement"},hitArea:{type:"htmlElement"}},states:["up","over","down","disable"],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_buttonClick"],render:function(){var b=(this._data.getType()=="Page")?"title":"text";
this._skinParts.label.set("html",this._data.get(b))
},_onAllSkinPartsReady:function(b){b.hitArea.addEvent("click",this._buttonClick)
},_buttonClick:function(){this.fireEvent("click")
},getAcceptableDataTypes:function(){return["Button","Link","Page"]
}}});
W.Components.newComponent({name:"mobile.core.components.SiteMenu",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],skinParts:{},Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onButtonClick"],_getItemsData:function(){if(this._data){return this._data.get("pages")
}},_onItemReady:function(h,e,g){if(e){var f=h.getDataItem();
h.addEvent("click",function(){this._onButtonClick(f)
}.bind(this))
}},_onButtonClick:function(b){this.injects().Viewer.goToPage(b.get("id"))
},getItemClassName:function(){return"mobile.core.components.MenuButton"
},_createHiddenItems:function(){return false
},_getParamsToPassToItem:function(d,c){c({listSubType:"PAGES"})
},getAcceptableDataTypes:function(){return["Document"]
}}});
(function(){var f="BG_USES_CUSTOM_IMAGE";
var d="BG_USES_THEME_IMAGE";
var e="BG_USES_CUSTOM_COLOR";
W.Components.newComponent({name:"mobile.core.components.SiteStructure",Class:{Extends:"mobile.core.components.Container",Binds:["changeBGImage"],_bgSizes:[{w:204,h:309},{w:320,h:452},{w:320,h:646},{w:320,h:800},{w:400,h:591},{w:480,h:480},{w:533,h:239},{w:683,h:334},{w:768,h:896},{w:1024,h:640}],initialize:function(a,c,b){this.parent(a,c,b);
window.onorientationchange&&window.addEvent("orientationchange",this.changeBGImage);
window.addEvent("resize",this.changeBGImage);
W.Theme.addEvent("propertyChange",this.changeBGImage);
this.changeBGImage({type:"init"})
},render:function(){this.sitePagesNode=this._view.getElement("#SITE_PAGES");
if(!this.sitePagesNode){LOG.reportError(wixErrors.SITE_STRUCTURE_NO_SITE_PAGES,"mobile.core.components.SiteStructure","render")
}var a=this.injects().Theme.getProperty("padding1");
a=a.split(" ");
var b="0";
switch(a.length){case 1:b="0 "+a[0];
break;
case 2:case 3:b="0 "+a[1];
break;
case 4:b="0 "+a[1]+" 0 "+a[3];
break
}this.sitePagesNode.setStyle("margin",b)
},_getReformattedBgColor:function(){var a=this.injects().Theme.getProperty("bgSize").split(",");
return{width:a[0],height:a[1]}
},changeBGImage:function(b){var c=this.injects().Utils.getWindowSize();
var v=this._getBestFit(c,this._bgSizes);
var s,x=this.injects().Theme.getProperty("bgType");
switch(x){case d:s=this.injects().Theme.getProperty("BG_DIRECTORY")+"bg_"+v.w+"x"+v.h+".jpg";
$(document.body).setStyle("background",'url("'+s+'") repeat');
break;
case f:var w=this.injects().Config.getPack("VIEWER_PARAMS").staticMediaUrl+"/";
var p=this.injects().Theme.getProperty("bgId");
var q=this._getReformattedBgColor();
var a=q.width;
var u=q.height;
if(a>100){a=v.w;
var r=q.width/q.height;
u=Math.round(a/r)
}var t=w+p+"_crp_0_0_"+q.width+"_"+q.height+"_"+a+"_"+u+"_crp";
$(document.body).setStyle("background",'url("'+t+'") repeat');
break;
default:$(document.body).setStyle("background","")
}s=this.injects().Theme.getProperty("siteBgColor");
$(document.body).setStyle("background-color",s.getHex(false))
},_getWantedBgSize:function(){var a,q,r;
var t=this._getReformattedBgColor();
var c=t.width;
var u=t.height;
var w=this._view.clientWidth;
var i=this._view.clientHeight;
var s=u/c;
var b=i/w;
if(s<b){q=i;
a=q/s
}else{a=w;
q=a*s
}var x=(a>q)?q:a;
for(var v=0;
v<this._bgSizes.length;
v++){if(this._bgSizes[v]>=x){r=this._bgSizes[v];
break
}}return r
},_getBestFit:function(c,i){var l=i[0];
for(var b=1;
b<i.length;
++b){var m=i[b];
var n=m.w-c.width;
var a=l.w-c.width;
if(n>=0){if(a<0){l=i[b]
}else{l=(n<a)?i[b]:l
}}else{if(a<0){l=(n>a)?i[b]:l
}}}return l
}}})
})();
W.Components.newComponent({name:"mobile.core.components.TwitterFollow",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{twitter:{type:"htmlElement"}},propertiesSchema:{showCount:{type:"string","enum":["true","false"],"default":"true",description:"Followers count display"},button:{type:"string","enum":["blue","gray"],"default":"blue",description:"Button color"},textColor:{type:"string","default":"",description:"HEX color code for the text color"},linkColor:{type:"string","default":"",description:"HEX color code for the Username link color"},width:{type:"string","default":"",description:"width of the Follow Button"},align:{type:"string","default":"",description:"alignment of the Follow Button"},dataLang:{type:"string","enum":["en","fr","de","it","es","ko","ja"],"default":"en",description:"The language for the Tweet Button"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(c,d){this.parent(c,d)
},render:function(){this._runTwitterScript();
this._rebuildTwitterElement()
},_onComponentPropertyChange:function(c,d){this._rebuildTwitterElement()
},_rebuildTwitterElement:function(){this._skinParts.twitter.empty();
var d=this._data.get("accountToFollow").replace("@","");
if(d==""){d="wix"
}var f={"class":"twitter-follow-button",href:"https://twitter.com/"+d,"data-show-count":this.getComponentProperty("showCount"),"data-button":this.getComponentProperty("button"),"data-text-color":this.getComponentProperty("textColor"),"data-link-color":this.getComponentProperty("linkColor"),"data-lang":this.getComponentProperty("dataLang"),"data-width":this.getComponentProperty("width"),"data-align":this.getComponentProperty("align")};
var e=new Element("a",f);
this._skinParts.twitter.adopt(e);
if(window.twttr!=undefined){twttr.widgets.load()
}},getAcceptableDataTypes:function(){return["TwitterFollow"]
},_runTwitterScript:function(){this.injects().Viewer.loadExternalScript("//platform.twitter.com/widgets.js")
}}});
W.Components.newComponent({name:"mobile.core.components.TwitterTweet",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{twitter:{type:"htmlElement"}},propertiesSchema:{dataCount:{type:"string","enum":["none","horizontal","vertical"],"default":"horizontal",description:"Count box position"},dataLang:{type:"string","enum":["en","fr","de","it","es","ko","ja"],"default":"en",description:"The language for the Tweet Button"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(c,d){this.parent(c,d)
},render:function(){this._runTwitterScript()
},_onComponentPropertyChange:function(c,d){this._rebuildTwitterElement()
},_rebuildTwitterElement:function(){this._skinParts.twitter.empty();
var c={"class":"twitter-share-button",href:"https://twitter.com/share","data-count":this.getComponentProperty("dataCount"),"data-lang":this.getComponentProperty("dataLang"),"data-url":"","data-via":"","data-text":this._data.get("defaultText"),"data-related":this._data.get("accountToFollow"),"data-counturl":""};
var d=new Element("a",c);
d.set("text","Tweet");
this._skinParts.twitter.adopt(d);
if(window.twttr!=undefined){twttr.widgets.load()
}},getAcceptableDataTypes:function(){return["TwitterTweet"]
},_runTwitterScript:function(){this.injects().Viewer.loadExternalScript("//platform.twitter.com/widgets.js",function(){this._rebuildTwitterElement()
}.bind(this))
}}});
W.Classes.newTrait({name:"mobile.core.components.traits.InputFieldEvents",trait:{_bindInputToDataField:function(n,k,l,h){this._boundFields=this._boundFields||[];
this._inputEventHandlersMap=this._inputEventHandlersMap||{};
if(this._boundFields.indexOf(n)==-1){var m=this;
var i=function(c){var f=window.debugMode=="unit_test"&&!c.code;
if(f||!W.Utils.isInputKey(c.code)){return
}var d=m._inputEventHandlersMap[k];
if(d._skinNextInputChange){d._skinNextInputChange=false;
return
}var e=m._data;
var b=m.injects().Utils.convertToHtmlText(n.get("value"));
if(e.get(k)==b){return
}var a=n.get("text")||n.value||"";
if(h!=undefined&&a.length>h){n.set("value",e.get(k));
return
}e.set(k,b);
if(l){e.setMeta("isPreset",false)
}};
if(this._inputEventHandlersMap[k]){var j=this._inputEventHandlersMap[k];
this._stopListeningToInput(j.inputElement,j.changeEventHandler)
}this._inputEventHandlersMap[k]={inputElement:n,eventHandler:i};
this._boundFields.push(n);
this._selectPresetFieldContent(n,k);
this._listenToInput(n,i)
}},_skinNextInputChange:function(b){this._inputEventHandlersMap[b]._skinNextInputChange=true
},_selectPresetFieldContent:function(b){b.addEvent("click",function(a){if(this._data.getMeta("isPreset")){if(!b.get("isSelected")){b.set("isSelected","true");
b.select()
}}}.bind(this));
b.addEvent("blur",function(){b.set("isSelected","")
})
},_listenToInput:function(c,d){c.addEvent("keyup",d);
c.addEvent("cut",d);
c.addEvent("paste",d);
c.addEvent("change",d);
c.addEvent("click",d)
},_stopListeningToInput:function(c,d){c.removeEvent("keyup",d);
c.removeEvent("cut",d);
c.removeEvent("paste",d);
c.removeEvent("change",d);
c.removeEvent("click",d)
}}});
W.Classes.newTrait({name:"mobile.core.components.traits.LinkableComponent",trait:{Binds:["_linkify","renderLinks","_promptLinkInfo","_canOpenInNewWindow"],Static:{linkType:{SMS:"SMS",CALL:"CALL",SKYPE:"SKYPE",MAP:"MAP",EMAIL:"EMAIL",FACEBOOK:"FACEBOOK",FLICKR:"FLICKR",BLOGGER:"BLOGGER",MYSPACE:"MYSPACE",LINKEDIN:"LINKEDIN",TWITTER:"TWITTER",TUMBLR:"TUMBLR",YOUTUBE:"YOUTUBE",VIMEO:"VIMEO",PAGE:"PAGE",FREE_LINK:"FREE_LINK",TEXT:"TEXT",DELICIOUS:"DELICIOUS",WEBSITE:"WEBSITE",DOCUMENT:"DOCUMENT"},linkTarget:{SAME_WINDOW:"_self",NEW_WINDOW:"_blank"}},initialize:function(){var b=this.render.bind(this);
this.render=function(){b();
this.renderLinks()
};
this.injects().Commands.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._linkableComponentEditModeChanged)
},renderLinks:function(){var j=this.getDataItem();
var g=j.get("href");
var h=j.get("target");
if(h=="same"||h=="self"){h="_self";
j.set("target","_self")
}var f=j.get("linkType");
var i=this._skinParts.link;
this._linkify(f,i,g,h);
if(this._NO_LINK_PROPAGATION){this._disableLinkClickPropagation(i)
}},_disableLinkClickPropagation:function(b){b.addEvent("click",function(a){a.stopPropagation()
})
},_linkify:function(e,h,f,g){if(!h){return
}if(f&&f!==""){h.set("href",f);
h.setStyle("cursor","pointer");
this._setTarget(h,g)
}else{h.setStyle("cursor","default");
h.erase("href");
h.erase("target");
if(this.hasState("noLink","linkableComponent")){this.setState("noLink","linkableComponent")
}}},_setTarget:function(d,c){d.set("target",c)
},_canOpenInNewWindow:function(b){return(b==this.linkType.WEBSITE||b==this.linkType.DOCUMENT||b==this.linkType.EMAIL)
},_linkableComponentEditModeChanged:function(n){var m;
if(this._isDisposed===false){var k=false;
var i=false;
var l=this.getDataItem();
var h=l.get("linkType");
if(this._canOpenInNewWindow(h)){var j=l.get("target");
if(j==this.linkTarget.SAME_WINDOW){k=true
}}if(h==this.linkType.EMAIL){i=true
}if(k){if(n=="PREVIEW"){m=this._skinParts.link;
m.erase("href");
m.erase("target");
m.addEvent("click",function(a){a.preventDefault();
this._promptLinkInfo()
}.bind(this))
}else{this.renderLinks()
}}else{if(i){if(n=="PREVIEW"){m=this._skinParts.link;
m.addEvent("click",function(a){window.enableNavigationConfirmation=false;
setTimeout(function(){window.enableNavigationConfirmation=true
},50)
}.bind(this))
}else{this.renderLinks()
}}}}},_promptLinkInfo:function(){var b={component:this};
this.injects().Commands.executeCommand("linkableComponent.navigateSameWindow",b,this)
}}});
var UNIT_EM="em",UNIT_PX="px",UNIT_PERCENT="%";
W.Classes.newTrait({name:"mobile.core.components.traits.SizeMeasurement",trait:{_initSizeMeasurement:function(b){b=b||{};
this._setSize(b.width,b.height);
this._setUnit(b.unit)
},_getTargetWidth:function(){var b="100%";
if(!isNaN(this._width)){b=Number(this._width)+this._unit
}return b
},_getTargetHeight:function(){var b="100%";
if(!isNaN(this._height)){b=Number(this._height)+this._unit
}return b
},_setRequestedSize:function(){this._view.setStyles({width:this._getTargetWidth(),height:this._getTargetHeight()})
},_getMeasureSize:function(){this._setRequestedSize();
return(this._unit!=UNIT_PX)?this._skinParts.view.getSize():{x:Number(this._width),y:Number(this._height)}
},_setSize:function(c,d){c=(c)?Number(c):this._width;
d=(d)?Number(d):this._height;
if(c!=this._width||d!=this._height){this._width=c;
this._height=d;
return true
}return false
},_setUnit:function(b){b=this.isValidUnit(b)?b:this._unit||UNIT_PERCENT;
if(b!=this._unit){this._unit=b;
return true
}return false
},isValidUnit:function(b){return b==UNIT_EM||b==UNIT_PX||b==UNIT_PERCENT
}}});
W.Classes.newTrait({name:"mobile.core.components.traits.SwipeSupport",trait:{Binds:["_onTouchDown","_onTouchMove","_onTouchUp"],_swipeMovementSpeedProp:"_movementSpeed",_swipeOrientation:"horizontal",_swipeEmulate:false,_swipeLastPos:[],_swipeActive:false,_swipeFrameCount:0,_touchSupported:false,initialize:function(){this._touchSupported="ontouchend" in document||this._swipeEmulate;
if(this._touchSupported){this.addEvent(Constants.ComponentEvents.READY,this._onComponentReady);
this._view.addEvent(!this._swipeEmulate?"touchstart":"mousedown",this._onTouchDown,true);
this._Tween=this.injects().Utils.Tween
}},_onComponentReady:function(){this._skinParts.swipeLeftHitArea.setStyle("display","none");
this._skinParts.swipeRightHitArea.setStyle("display","none")
},_onTouchDown:function(b){this._view.addEvent(!this._swipeEmulate?"touchmove":"mousemove",this._onTouchMove,true);
this._view.addEvent(!this._swipeEmulate?"touchend":"mouseup",this._onTouchUp,true);
this._swipeLastPos=[{x:b.client.x,y:b.client.y,time:new Date().getTime()}];
this._swipeActive=true;
this._swipeFrameCount=0;
this._enableMovement(true)
},_setSwipeMovementSpeed:function(b){this[this._swipeMovementSpeedProp]=b
},_addLastPos:function(b){this._swipeLastPos.unshift(b);
if(this._swipeLastPos.length>5){this._swipeLastPos.pop()
}},_onTouchMove:function(d){d.preventDefault();
var e={x:d.client.x,y:d.client.y,time:new Date().getTime()};
var f=this._getSwipeDistance(e,this._swipeLastPos[0]);
this._shiftOffset-=f;
this._Tween.to(this,1,{_shiftOffset:this._shiftOffset-f,ease:"strong_easeInOut"});
this._addLastPos(e)
},_onTouchUp:function(e){var f={x:e.client.x,y:e.client.y,time:new Date().getTime()};
f=this._swipeLastPos[0];
this._view.removeEvent(!this._swipeEmulate?"touchend":"mouseup",this._onTouchUp,true);
this._view.removeEvent(!this._swipeEmulate?"touchmove":"mousemove",this._onTouchMove,true);
var h=this._calculateSwipeSpeed(this._swipeLastPos[this._swipeLastPos.length-1],f);
this._Tween.killTweensOf(this);
this._setSwipeMovementSpeed(-h*20);
var g={ease:"linear",onComplete:function(){this._enableMovement(false)
}.bind(this)};
g[this._swipeMovementSpeedProp]=0;
this._Tween.to(this,1,g)
},_getSwipeDistance:function(c,d){if(this._swipeOrientation=="horizontal"){return d.x-c.x
}else{if(this._swipeOrientation=="vertical"){return d.y-c.y
}}},_calculateSwipeSpeed:function(c,d){return this._getSwipeDistance(c,d)/(d.time-c.time)
}}});
W.Classes.newTrait({name:"mobile.core.components.traits.TouchRollOverSupport",trait:{Binds:["_onComponentTouchStart","_onStageTouchStart","_onRender","_onComponentReady"],initialize:function(){this._touchSupported="ontouchend" in document||this._swipeEmulate;
if(this._touchSupported){this._states.touchRollOverSupport=["touchRollOver","touchRollOut"];
this.addEvent(Constants.ComponentEvents.READY,this._onComponentReady);
this.addEvent(Constants.ComponentEvents.RENDER,this._onRender)
}},_onComponentReady:function(){this.setState("touchRollOut")
},_onRender:function(){this._view.addEvent("touchstart",this._onComponentTouchStart);
document.addEvent("touchstart",this._onStageTouchStart)
},_onComponentTouchStart:function(b){if(this.getState().indexOf("touchRollOut")!==-1){b.preventDefault();
b.stopPropagation();
this.setState("touchRollOver")
}},_onStageTouchStart:function(b){if(this.getState().indexOf("touchRollOver")!==-1){if(b.target.getParents().indexOf(this._view)===-1&&b.target!==this._view){this.setState("touchRollOut")
}}},dispose:function(){document.removeEvent("touchstart",this._onStageTouchStart);
this.parent()
}}});
W.Classes.newTrait({name:"mobile.core.components.traits.TouchSupport",trait:{_setEventsType:function(){this._touchSupported="ontouchend" in document;
if(this._touchSupported){this._eventNames={down:"touchstart",up:"touchend",move:"touchmove"}
}else{this._eventNames={down:"mousedown",up:"mouseup",move:"mousemove"}
}}}});