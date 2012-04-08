W.Components.newComponent({name:"wysiwyg.viewer.components.ClipArt",skinParts:{link:{type:"htmlElement"},img:{type:"mobile.core.components.Image",dataRefField:"*"}},propertiesSchemaName:"WPhotoProperties",traits:["mobile.core.components.traits.LinkableComponent"],Class:{Extends:"wysiwyg.viewer.components.WPhoto",initialize:function(c,a,b){this.parent(c,a,b);
this.setComponentProperty("displayMode","stretch")
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.ContactForm",skinParts:{nameLabel:{type:"htmlElement"},name:{type:"htmlElement"},emailLabel:{type:"htmlElement"},email:{type:"htmlElement"},subjectLabel:{type:"htmlElement"},subject:{type:"htmlElement"},messageLabel:{type:"htmlElement"},message:{type:"htmlElement"},notifications:{type:"htmlElement"},send:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onButtonClick","_sendEmailCompleted"],_states:["editing","errors","processing"],initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this._lists={enabled:true,storeId:null,accessToken:null};
this._metaSiteId=null;
this._resizableSides=[W.BaseComponent.ResizeSides.LEFT,W.BaseComponent.ResizeSides.RIGHT]
},Resources:{en:{CONTACT_FORM_LABEL_NAME:"Name",CONTACT_FORM_LABEL_EMAIL:"Email",CONTACT_FORM_LABEL_SUBJECT:"Subject",CONTACT_FORM_LABEL_MESSAGE:"Message",CONTACT_FORM_LABEL_SENDING:"Sending...",CONTACT_FORM_LABEL_SENT_SUCCESSFULLY:"Your email was sent successfully!",CONTACT_FORM_BUTTON_SEND:"Send",CONTACT_FORM_ERROR_NAME_MISSING:"Please add your name",CONTACT_FORM_ERROR_EMAIL_INVALID:"Please add a valid email",CONTACT_FORM_ERROR_MESSAGE_MISSING:"Please add a message",CONTACT_FORM_ERROR_OWNER_NOT_DEFINED:"Owner email address not set",CONTACT_FORM_ERROR_GENERAL:"Error sending email, please try again later",CONTACT_FORM_EMAIL_SUBJECT:"New message via your Wix website",CONTACT_FORM_EMAIL_SUBSTITUTE_NO_SUBJECT:"<no subject>",CONTACT_FORM_EMAIL_HTML_TEMPLATE:"<strong>You have a new message</strong><br/>via: WIX___THE_CURRENT_WEBSITE___<br/><br/><strong>Message details:</strong><br/>From: WIX___SENDER_NAME___<br/>Email: WIX___SENDER_EMAIL___<br/>Date: WIX___FORMATTED_DATE___<br/>Subject: WIX___MESSAGE_SUBJECT___<br/><br/><strong>Message:</strong><br/>WIX___MESSAGE_BODY___<br/><br/><br/>Thank you for using Wix.com!",CONTACT_FORM_EMAIL_TEXT_TEMPLATE:"You have a new message\nvia: WIX___THE_CURRENT_WEBSITE___\n\nMessage details:\nFrom: WIX___SENDER_NAME___\nEmail: WIX___SENDER_EMAIL___\nDate: WIX___FORMATTED_DATE___\nSubject: WIX___MESSAGE_SUBJECT___\n\nMessage:\nWIX___MESSAGE_BODY___\n\n\nThank you for using Wix.com!"},get:function(b,a){return this.en[a]
}},_onAllSkinPartsReady:function(){this.setHeight(this._skin._height||180);
this.setState("editing");
this._skinParts.send.addEvent("click",this._onButtonClick);
this._skinParts.send.enable=function(){this.removeProperty("disabled")
}.bind(this._skinParts.send);
this._skinParts.send.disable=function(){this.set("disabled","true")
}.bind(this._skinParts.send);
function a(d){this.set("placeholder",d);
if(window.Modernizr&&!window.Modernizr.input.placeholder){var c=function(){var e=this;
if(e.get("value")==""&&e.get("placeholder")){e.addClass("isPlaceholder");
e.set("value",e.get("placeholder"))
}}.bind(this);
var b=function(){var e=this;
if(e.hasClass("isPlaceholder")){e.removeClass("isPlaceholder");
e.set("value","")
}}.bind(this);
if(!this.hasPlaceholder){this.hasPlaceholder=true;
this.addEvent("focus",b);
this.addEvent("blur",c)
}c()
}}this._skinParts.name.setPlaceholder=a.bind(this._skinParts.name);
this._skinParts.email.setPlaceholder=a.bind(this._skinParts.email);
this._skinParts.subject.setPlaceholder=a.bind(this._skinParts.subject)
},render:function(){this._skinParts.nameLabel.set("text",this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_LABEL_NAME"));
this._skinParts.emailLabel.set("text",this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_LABEL_EMAIL"));
this._skinParts.subjectLabel.set("text",this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_LABEL_SUBJECT"));
this._skinParts.messageLabel.set("text",this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_LABEL_MESSAGE"));
if(this._skin.hidePlaceholders!==true){this._skinParts.name.setPlaceholder(this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_LABEL_NAME"));
this._skinParts.email.setPlaceholder(this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_LABEL_EMAIL"));
this._skinParts.subject.setPlaceholder(this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_LABEL_SUBJECT"))
}this._skinParts.send.set("text",this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_BUTTON_SEND"))
},_prepareForRender:function(){try{this._metaSiteId=rendererModel.metaSiteId;
if(!this._metaSiteId){this._metaSiteId="dc853130-4fb2-464f-878d-3b6667dc4f97"
}if(this._lists.enabled){var c=rendererModel.serviceMappings;
for(var a in c){if(c[a].applicationType=="WixLists"){this._lists.storeId=c[a].idInApp;
break
}}}}catch(b){}return this.parent()
},_onButtonClick:function(){try{var a={name:this._skinParts.name.get("value").trim(),email:this._skinParts.email.get("value").trim(),subject:this._skinParts.subject.get("value").trim(),message:this._skinParts.message.get("value").trim()};
this._validateForm(a);
this._submitForm(a,this._metaSiteId,this._getWebsiteUrl(),new Date())
}catch(b){this._skinParts.send.enable();
this.setState("errors");
this._setNotificationMessage(b.type=="validation-error"?b.message:this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_ERROR_GENERAL"))
}},_getWebsiteUrl:function(){var a=window.location.origin||window.location.href.substring(0,window.location.href.indexOf(window.location.pathname));
return this._isPreviewMode()?a:((window.publicModel&&publicModel.externalBaseUrl)||a)
},_isPreviewMode:function(){return this.injects().Viewer.getViewMode()!="site"
},_validateForm:function(a){if(a.name.length<1){throw {type:"validation-error",message:this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_ERROR_NAME_MISSING")}
}var c=/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
if(!c.test(a.email)){throw {type:"validation-error",message:this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_ERROR_EMAIL_INVALID")}
}if(a.message.length<1){throw {type:"validation-error",message:this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_ERROR_MESSAGE_MISSING")}
}var b=this._data.get("toEmailAddress");
if(!b||b.trim()==0){throw {type:"validation-error",message:this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_ERROR_OWNER_NOT_DEFINED")}
}},_submitForm:function(g,h,b,c){this.setState("processing");
this._setNotificationMessage(this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_LABEL_SENDING"));
this._skinParts.send.disable();
if(g.subject.length==0){g.subject=this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_EMAIL_SUBSTITUTE_NO_SUBJECT")
}var k=this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_EMAIL_SUBJECT");
var f=this._formatMessage(this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_EMAIL_HTML_TEMPLATE"),g,b,true,c);
var d=this._formatMessage(this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_EMAIL_TEXT_TEMPLATE"),g,b,false,c);
var l=this._data.get("toEmailAddress");
var a=this._data.get("bccEmailAddress");
this.sendEmail([{address:l,personal:l}],[],a?[{address:a,personal:a}]:[],{address:g.email,personal:g.name},k,f,d,h,this._sendEmailCompleted);
try{this._createListEntry(g)
}catch(j){}},_sendEmailCompleted:function(b,a){this._skinParts.send.enable();
if(b){this.setState("editing");
this._setNotificationMessage(this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_LABEL_SENT_SUCCESSFULLY"));
this._cleanForm()
}else{this.setState("errors");
this._setNotificationMessage(this.Resources.get("VIEWER_LANGUAGE","CONTACT_FORM_ERROR_GENERAL"))
}},_cleanForm:function(){this._skinParts.name.set("value","");
this._skinParts.email.set("value","");
this._skinParts.subject.set("value","");
this._skinParts.message.set("value","")
},_formatMessage:function(g,a,e,f,d){var h=function(j){if(!j){return j
}return String(j).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
};
var b=function(j){return f?h(j):j
};
var c=g;
c=c.replace(/WIX___THE_CURRENT_WEBSITE___/g,e);
c=c.replace("WIX___SENDER_NAME___",b(a.name));
c=c.replace("WIX___SENDER_EMAIL___",a.email);
c=c.replace("WIX___MESSAGE_SUBJECT___",b(a.subject));
c=c.replace("WIX___MESSAGE_BODY___",b(a.message));
c=c.replace("WIX___FORMATTED_DATE___",this._formatDate(d));
return c
},_formatDate:function(c){var a=["January","February","March","April","May","June","July","August","September","October","November","December"];
var b=c.getDate();
var e=c.getMonth();
var d=c.getFullYear();
return(b<10?"0":"")+b+" "+a[e]+" "+d
},_setNotificationMessage:function(a){this._skinParts.notifications.set("text",a);
if(a.trim()==""){this._skinParts.notifications.collapse()
}else{this._skinParts.notifications.uncollapse()
}},sendEmail:function(l,c,j,m,k,n,d,h,b){var f={to:l,cc:c,bcc:j,from:m,subject:k,htmlMessage:n,plainTextMessage:d,metaSiteId:h};
var e=this.injects();
var o=e.Config.getPack("VIEWER_PARAMS").emailServer;
var g=this._isPreviewMode();
if(g){o=o+"Secured"
}var a=[];
a.push(o);
a.push("?accept=json&contentType=json");
a.push("&appUrl="+encodeURIComponent(window.location.href));
if(g){a.push("&wixSession="+e.CookiesManager.getCookie("wixSession"))
}this._sendJsonCORS(a.join(""),f,"POST",b)
},_sendJsonCORS:function(url,data,method,onComplete){var createXHR=function(method,url){var xhr=new XMLHttpRequest();
if("withCredentials" in xhr){xhr.open(method,url,true);
xhr.withCredentials="true"
}else{if(typeof XDomainRequest!="undefined"){xhr=new XDomainRequest();
xhr.open(method,url);
xhr.setRequestHeader=function(key,value){}
}}return xhr
};
var parseResponseJSON=function(responseText){if(!xhr.responseText){return{success:false,errorDescription:"Invalid ajax response, no responseText",errorCode:-9001}
}var parser=JSON.parse?JSON.parse:eval;
try{return parser(responseText)
}catch(e){return{success:false,errorDescription:"Invalid JSON object",errorCode:-9000}
}};
var errorToString=function(err){return err.errorDescription+" ("+err.errorCode+")"
};
var xhr=createXHR(method,url);
xhr.onabort=function(){onComplete(false,"request aborted")
};
xhr.ontimeout=function(){onComplete(false,"request timeout")
};
xhr.onerror=function(){onComplete(false,errorToString(parseResponseJSON(xhr.responseText)))
};
xhr.onload=function(){var ret=parseResponseJSON(xhr.responseText);
onComplete(ret.success,ret.success?ret:errorToString(ret))
};
xhr.setRequestHeader("Content-Type","application/json");
xhr.send(JSON.encode(data))
},_createListEntry:function(a){if(!this._lists.enabled||!this._lists.storeId){return
}var c=window.location.origin||window.location.href.substring(0,window.location.href.indexOf(window.location.pathname));
var b="/apps/lists/1/stores/"+this._lists.storeId+"/collections/ContactForms,online";
var d={_type:"BasicForms.ContactForm",name:a.name,email:a.email,subject:a.subject,message:a.message,createdAt:new Date().getTime(),sourceForm:this._view.get("id")};
var e=function(){var g=function(h){}.bind(this);
var f=new Request.JSON({url:c+b,urlEncoded:false,headers:{"If-Modified-Since":"Sat, 1 Jan 2005 00:00:00 GMT","Content-Type":"application/json; charset=utf-8",Accept:"application/json",AccessToken:this._lists.accessToken},onSuccess:g,onFailure:g});
f.post(JSON.encode(d))
}.bind(this);
this._validateListAccessToken(e)
},_validateListAccessToken:function(f){if(!this._lists.enabled){return
}if(this._lists.accessToken){f();
return
}var d=window.location.origin||window.location.href.substring(0,window.location.href.indexOf(window.location.pathname));
var b="/apps/lists/1/auth/contact-forms?storeId="+this._lists.storeId;
var e=function(g){try{if(g.success){this._lists.accessToken=g.payload;
f()
}}catch(h){}}.bind(this);
var a=function(g){};
var c=new Request.JSON({url:d+b,urlEncoded:false,headers:{"If-Modified-Since":"Sat, 1 Jan 2005 00:00:00 GMT",Accept:"application/json"},onSuccess:e,onFailure:a});
c.get()
},getAcceptableDataTypes:function(){return["ContactForm"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.Displayer",skinParts:{image:{type:"mobile.core.components.Image",dataRefField:"*",optional:false},imageWrapper:{type:"htmlElement",optional:false},title:{type:"htmlElement",optional:false},description:{type:"htmlElement",optional:false},zoom:{type:"htmlElement",optional:true},link:{type:"htmlElement",optional:false},rolloverHitArea:{type:"htmlElement",optional:true}},traits:["mobile.core.components.traits.LinkableComponent"],Class:{Extends:"mobile.core.components.base.BaseComponent",_renderTriggers:[Constants.DisplayEvents.SKIN_CHANGE],Binds:["_onMouseOver","_onMouseOut","_onZoomClick","_onImageStateChange","_onOwnerPropsChanged"],_states:{general:["loading","normal","rollover"],transitionPhase:["noTransition","transIn","transOut"],linkableComponent:["link","noLink"]},_parentList:null,_owner:null,_expandEnabled:true,_debugMode:false,_lastSetSizeParams:null,initialize:function(c,a,b){this._NO_LINK_PROPAGATION=true;
a.setStyle("visibility","hidden");
this.parent(c,a,b)
},render:function(){this._refreshImage();
this.parent()
},setOwner:function(a){if(this._owner){this._owner.getComponentProperties().removeEvent(Constants.DataEvents.DATA_CHANGED,this._onOwnerPropsChanged)
}this._owner=a;
this._parentList=this._owner.getDataItem();
this._owner.getComponentProperties().addEvent(Constants.DataEvents.DATA_CHANGED,this._onOwnerPropsChanged);
this._onOwnerPropsChanged();
if(this._debugMode){var d=this._data.get("id");
var b=this._parentList.getData()["items"].indexOf("#"+d);
var c=new Element("div");
this._debugMode=false;
c.set("text",String(b));
c.setStyles({position:"relative",top:"-20px"});
this.getViewNode().adopt(c)
}},_onOwnerPropsChanged:function(){this._expandEnabled=this._owner.getComponentProperty("expandEnabled")===true;
if(!this._expandEnabled&&this.getState().indexOf("rollover")!=-1){this.setState("rollover","general")
}this._updateParts()
},setParentList:function(a){this._parentList=a
},_setupParts:function(){var c=this._skinParts.rollOverHitArea||this._view;
var a=this._skinParts.zoom||this._skinParts.imageWrapper;
this._skinParts.image.addEvent("stateChange",this._onImageStateChange);
a.addEvent(Constants.CoreEvents.CLICK,this._onZoomClick);
c.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
c.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
var b={overflow:"hidden","text-overflow":"ellipsis"};
this._skinParts.title.setStyles(b);
this._skinParts.description.setStyles(b)
},_updateParts:function(){var b;
if(this._skinParts){this._skinParts.title.set("text",this._data.get("title"));
this._skinParts.description.set("text",this._data.get("description"));
var a=this._skinParts.zoom||this._skinParts.imageWrapper;
a.setStyle("cursor",this._expandEnabled?"pointer":"default")
}},_onImageStateChange:function(a){switch(a.newState){case"loading":this.setState("loading","general");
break;
case"loaded":this.setState("normal","general");
break
}},_onMouseOver:function(){if(this._expandEnabled&&this.getState().indexOf("normal")!=-1){this.setState("rollover","general")
}},_onMouseOut:function(){if(this._expandEnabled&&this.getState().indexOf("rollover")!=-1){this.setState("normal","general")
}},_onZoomClick:function(b){if(b.rightClick===false&&this._expandEnabled){var c=this._data.get("id");
var a=this._parentList.getData()["items"].indexOf("#"+c);
this.injects().Commands.executeCommand("WViewerCommands.SetMediaZoomImage",{mediaList:this._parentList,currentIndex:a})
}},setSize:function(e,a,h){var f,b;
var d,g;
var c=0;
if(this._lastSetSizeParams&&this._lastSetSizeParams[0]===e&&this._lastSetSizeParams[1]===a&&this._lastSetSizeParams[2]===h){return
}if(this._componentReady){this._skinParts.image.checkVisibility();
d=this._skin.widthDiff||0;
g=this._skin.heightDiff||0;
h=h||"clipImage";
switch(h){case"clipImage":this._clipImage(e,a,d,g);
break;
case"flexibleHeight":this._setFlexibleHeight(e,a,d,g);
break;
case"flexibleWidth":this._setFlexibleWidth(e,a,d,g,true);
break;
case"flexibleWidthFixed":this._setFlexibleWidth(e,a,d,g,false);
break
}this._refreshImage();
this._lastSetSizeParams=[arguments[0],arguments[1],arguments[2]]
}},invalidateSize:function(){this._lastSetSizeParams=null
},getWidthDiff:function(){return this._skin.widthDiff||0
},getHeightDiff:function(){return this._skin.heightDiff||0
},_refreshImage:function(){if(this._componentReady){this._skinParts.image._invalidate("size");
this._skinParts.image._renderIfReady()
}},_clipImage:function(d,a,c,f){c=this._skin.widthDiff||0;
f=this._skin.heightDiff||0;
var e=d-c;
var b=a-f;
this._setWrapperSize(e,b);
this._setDisplayerSize(d,a)
},_setFlexibleHeight:function(d,a,c,f){c=this._skin.widthDiff||0;
f=this._skin.heightDiff||0;
var e=d-c;
var b=Math.floor(e/this._getAspectRatio());
this._setWrapperSize(e,b-f);
this._setDisplayerSize(d,b)
},_setFlexibleWidth:function(b,k,g,d,j){g=this._skin.widthDiff||0;
d=this._skin.heightDiff||0;
var h;
var c=0;
var f=0;
var a=k-d;
var e=a*this._getAspectRatio();
if(!j&&e>(b-g)){h=(b-g)/e;
e=(b-g);
a=h*a
}if(!j){c=Math.floor((b-e-g)/2);
f=Math.floor(k-a-d)/2
}this._view.setStyle("width",String(e+g)+"px");
this._setWrapperSize(e,a,c,f);
if(j){this._setDisplayerSize(e,k)
}else{this._setDisplayerSize(b,k)
}},_getAspectRatio:function(){var b=this._skinParts.image.getDataItem();
var a=parseInt(b.get("width"))/parseInt(this._data.get("height"));
return a
},_setWrapperSize:function(e,b,d,f){d=d||0;
f=f||0;
var a=(b<0)?0:b;
var c=(e<0)?0:e;
this._skinParts.imageWrapper.setStyles({width:String(c)+"px",height:String(a)+"px","margin-left":String(d)+"px","margin-right":String(d)+"px","margin-top":String(f)+"px","margin-bottom":String(f)+"px"})
},_setDisplayerSize:function(b,a){this._view.setStyles({width:String(b)+"px",height:String(a)+"px"});
this.setWidth(b);
this.setHeight(a);
this.fireEvent("autoSized")
},_onDataChange:function(a){this.parent();
this._updateParts()
},_onAllSkinPartsReady:function(){this.parent();
this._view.setStyle("visibility","visible");
this._updateParts();
this._setupParts()
},_onResize:function(){this.parent();
this._refreshImage()
},getAcceptableDataTypes:function(){return["Image"]
},getImageRef:function(){var a="";
if(this._skinParts){a=String(this._skinParts.image.getDataItem().get("id"))
}return a
},isImageLoading:function(){var a=false;
if(this._componentReady){a=this._skinParts.image.getState().indexOf("loading")!=-1
}return a
},dispose:function(){if(this._owner){this._owner.getComponentProperties().removeEvent(Constants.DataEvents.DATA_CHANGED,this._onOwnerPropsChanged)
}this.parent()
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.EbayItemsBySeller",skinParts:{iFrameHolder:{type:"htmlElement"}},propertiesSchemaName:"EbayItemsBySellerProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_applyThemeColors"],_renderTriggers:[Constants.DisplayEvents.MOVED_IN_DOM,Constants.DisplayEvents.ADDED_TO_DOM,Constants.DisplayEvents.DISPLAYED,Constants.DisplayEvents.DISPLAY_CHANGED],_states:["hasContent","noContent"],initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this.addEvent("resizeEnd",this._onResizeEnd);
this._iframe=null
},options:{width:0,height:0,url:""},render:function(){var b=this._data.get("sellerId");
this.setState(b?"hasContent":"noContent");
if(b){var a=this._createUrl(b,this._data.get("registrationSite"),this._prepareOptions());
var c=this._createIFrame(a.width,a.height);
this.injects().Utils.prepareIFrameForWrite(c,function(d,e){e.write('<html><body style="margin:0px;"><div><script type="text/javascript" src="'+a.url+'"><\/script></div></body></html>');
d.setStyles({height:a.height,width:a.width})
})
}},_onStyleReady:function(){this.parent();
this._style.addEvent(Constants.StyleEvents.PROPERTY_CHANGED,this._applyThemeColors)
},dispose:function(){this._style.removeEvent(Constants.StyleEvents.PROPERTY_CHANGED,this._applyThemeColors);
this.parent()
},_applyThemeColors:function(b){var a=["fontColor","borderColor","headerColor","backgroundColor","linkColor"];
for(var c in b.properties){if(a.indexOf(c)>-1){this._renderIfReady();
return
}}},_onResizeEnd:function(){this._renderIfReady()
},_prepareOptions:function(){var d=this.injects().Skins;
var f=this._skin.className;
var e=d.getSkinParamValue(f,"fontColor",this._style).getHex(false);
var g=d.getSkinParamValue(f,"borderColor",this._style).getHex(false);
var a=d.getSkinParamValue(f,"headerColor",this._style).getHex(false);
var c=d.getSkinParamValue(f,"backgroundColor",this._style).getHex(false);
var b=d.getSkinParamValue(f,"linkColor",this._style).getHex(false);
return{width:this._view.getWidth(),height:this._view.getHeight(),headerImage:this.getComponentProperty("headerImage"),fontColor:e.replace("#",""),borderColor:g.replace("#",""),headerColor:a.replace("#",""),backgroundColor:c.replace("#",""),linkColor:b.replace("#","")}
},_createUrl:function(f,c,b){var d=Math.floor((b.height-100)/70);
var e={Australia:"15",Austria:"16",Belgium_Dutch:"123",Belgium_French:"23",Canada:"2",CanadaFrench:"210",China:"223",eBayMotors:"100",France:"71",Germany:"77",HongKong:"201",India:"203",Ireland:"205",Italy:"101",Malaysia:"207",Netherlands:"146",Philippines:"211",Poland:"212",Singapore:"216",Spain:"186",Sweden:"218",Switzerland:"193",Taiwan:"196",UK:"3",US:"0",findId:function(h){var g=this[h];
if(!g){g=0
}return g
}};
var a=this.urlCreator("http://lapi.ebay.com/ws/eBayISAPI.dll").addParam("EKServer").addParam("ai","aj|kvpqvqlvxwkl").addParam("bdrcolor",b.borderColor).addParam("fntcolor",b.fontColor).addParam("hdrcolor",b.headerColor).addParam("hdrimage",b.headerImage).addParam("lnkcolor",b.linkColor).addParam("tbgcolor",b.backgroundColor).addParam("si",f).addParam("sid",f).addParam("num",d).addParam("width",b.width).addParam("cid","0").addParam("eksize","1").addParam("encode","UTF-8").addParam("endcolor","FF0000").addParam("endtime","y").addParam("fbgcolor","FFFFFF").addParam("fs","0").addParam("hdrsrch","n").addParam("img","y").addParam("logo","6").addParam("numbid","n").addParam("paypal","n").addParam("popup","y").addParam("prvd","9").addParam("r0","3").addParam("shipcost","y").addParam("siteid",e.findId(c)).addParam("sort","MetaEndSort").addParam("sortby","endtime").addParam("sortdir","asc").addParam("srchdesc","n").addParam("title","").addParam("tlecolor","FFFFFF").addParam("tlefs","0").addParam("tlfcolor","000000").addParam("toolid","10004").addParam("track","5335838312");
b.url=a.toString();
return b
},_createIFrame:function(c,a){var b=new IFrame();
b.width=this.options.width;
b.height=this.options.height;
if(this._iframe){b.replaces(this._iframe)
}else{b.insertInto(this._skinParts.iFrameHolder)
}this._iframe=b;
return b
},urlCreator:function(a){return{_baseUrl:a,_params:[],addParam:function(b,c){this._params.push({key:b,value:c});
return this
},toString:function(){var b=[];
b.push(this._baseUrl);
if(this._params.length>0){b.push("?")
}for(var c=0;
c<this._params.length;
c++){var d=this._params[c];
if(c>0){b.push("&")
}b.push(d.key);
if(d.value){b.push("=");
b.push(encodeURIComponent(d.value))
}}return b.join("")
}}
},getAcceptableDataTypes:function(){return["EbayItemsBySeller"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.FiveGridLine",skinParts:{line:{type:"htmlElement"},lineCnt:{type:"htmlElement",optional:true},leftKnobCnt:{type:"htmlElement",optional:true},leftKnob:{type:"htmlElement",optional:true},middleKnobCnt:{type:"htmlElement",optional:true},middleKnob:{type:"htmlElement",optional:true},rightKnobCnt:{type:"htmlElement",optional:true},rightKnob:{type:"htmlElement",optional:true}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,a,b){this.parent(c,a,b);
this.injects().Theme.setProperty("WEB_THEME_DIRECTORY","viewer");
this._resizableSides=[W.BaseComponent.ResizeSides.LEFT,W.BaseComponent.ResizeSides.RIGHT]
},render:function(){var a=this.getHeight()
},setWidth:function(b){var a=this._getNumberOfKnobs();
this.width=b;
this.parent(b)
},setHeight:function(a){this.parent(a)
},_getNumberOfKnobs:function(){var a=0;
if(this._skinParts){if(this._skinParts.rightKnob){a++
}if(this._skinParts.leftKnob){a++
}if(this._skinParts.middleKnob){a++
}}return a
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.FlickrBadgeWidget",skinParts:{iframe:{type:"htmlElement"},overlay:{type:"htmlElement"},overlayClick:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_applyThemeColors","_updateIframeDimensions"],_renderTriggers:[Constants.DisplayEvents.MOVED_IN_DOM,Constants.DisplayEvents.ADDED_TO_DOM,Constants.DisplayEvents.DISPLAYED,Constants.DisplayEvents.DISPLAY_CHANGED,Constants.DisplayEvents.SKIN_CHANGE],_backgroundColor:undefined,_backgroundAlpha:undefined,_borderColor:undefined,_borderAlpha:undefined,_currentDimensions:{w:-1,h:-1},_totalSizeSamplingAttempts:10,_sizeSamplingAttemptsCount:0,initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this.addEvent("resizeEnd",this._onResizeEnd);
this._minimumTimeBetweenRenders=1000;
this._disableResizeHandlers();
this._resizableSides=[];
this._iframeDimensions={w:0,h:0}
},_disableResizeHandlers:function(){this._resizableSides=[]
},_onStyleReady:function(){this.parent();
this._applyThemeColors({propName:"borderColor"});
this._applyThemeColors({propName:"backgroundColor"});
this._style.addEvent(Constants.StyleEvents.PROPERTY_CHANGED,this._applyThemeColors)
},_applyThemeColors:function(c){var b;
var a;
var e;
for(var d in c.properties){b=this.injects().Skins.getSkinParamValue(this._skin.className,d,this._style);
a=b.getHex(false);
e=b.getAlpha();
if(d=="borderColor"){this._borderColor=a;
this._borderAlpha=e
}if(d=="backgroundColor"){this._backgroundColor=a;
this._backgroundAlpha=e
}}this._tryRender()
},render:function(){this._updateFrameSize();
this._clearFrame();
this.callLater(this._fillFrame,[],100)
},_onResizeEnd:function(){this._tryRender()
},_clearFrame:function(){var a=this._getFrame();
if(a!==undefined){a.src="about:blank"
}},_getFrame:function(){if(this._skinParts){return this._skinParts.iframe
}return undefined
},_getOverlay:function(){if(this._skinParts){return this._skinParts.overlayClick
}return undefined
},_updateFrameSize:function(a,c){var b;
a=a||this._view.getWidth()-1;
c=c||this._view.getHeight()-1;
b=this._getFrame();
if(b){b.set({width:a,height:c})
}},_fillFrame:function(){var d={};
var a;
d.userID=this._data.get("userId");
d.userName=this._data.get("userName");
d.tag=this._data.get("tag");
d.imageCount=this._data.get("imageCount");
d.whichImages=this._data.get("whichImages");
d.imageSize=this._data.get("imageSize");
d.layoutOrientation=this._data.get("layoutOrientation");
var c=this._getFlickrEmbedCode(d);
var b=this._getFrame();
if(b!==undefined){this.injects().Utils.prepareIFrameForWrite(b,function(e,f){f.write(c)
}.bind(this));
a="http://www.flickr.com/photos/"+d.userID+"/";
this._getOverlay().set("href",a);
this._sizeSamplingAttemptsCount=0;
this.callLater(this._updateIframeDimensions,[],1000)
}},_updateIframeDimensions:function(){this._sizeSamplingAttemptsCount++;
var a=this._sampleIframeDimensions();
if(a){if(a.w!=this._currentDimensions.w||a.h!=this._currentDimensions.h){this._currentDimensions.w=a.w;
this._currentDimensions.h=a.h;
this.setWidth(this._currentDimensions.w+5);
this.setHeight(this._currentDimensions.h+5);
this._updateFrameSize(this._currentDimensions.w+5,this._currentDimensions.h+5);
this._wCheckForSizeChangeAndFireAutoSized(0)
}}if(this._sizeSamplingAttemptsCount<this._totalSizeSamplingAttempts){this.callLater(this._updateIframeDimensions,[],500)
}},_sampleIframeDimensions:function(){var a;
var e;
var d=this._getFrame();
if(d!=undefined){if(Browser.ie){var b=this._data.get("imageSize")+this._data.get("layoutOrientation");
switch(b){case"sv":a=130;
e=83+this._data.get("imageCount")*75;
break;
case"tv":a=130;
e=83+this._data.get("imageCount")*67;
break;
case"mv":a=260;
e=83+this._data.get("imageCount")*160;
break;
case"sh":a=55+this._data.get("imageCount")*75;
e=130;
break;
case"th":a=55+this._data.get("imageCount")*100;
e=55+67;
break;
case"mh":a=55+this._data.get("imageCount")*240;
e=55+160;
break
}}else{var c=d.contentWindow.document.getElementById("flickr_badge_uber_wrapper");
if(c){a=c.clientWidth;
e=c.clientHeight
}}if(isNaN(a)==false&&isNaN(e)==false){this._iframeDimensions.w=a;
this._iframeDimensions.h=e
}}return this._iframeDimensions
},_rgbToHex:function(b){var a;
a=new W.Color(b);
return a.getHex(false)
},getAcceptableDataTypes:function(){return["FlickrBadgeWidget"]
},_getFlickrEmbedCode:function(c){var a;
var b;
var d="";
if(c.tag!==undefined&&c.tag!==""){b="user_tag";
a="&tag="+c.tag
}else{b="user";
a=""
}if(Browser.ie){d="a:link{color:"+this._backgroundColor+"}a:visited{color:"+this._backgroundColor+"}"
}return'<style type="text/css">#flickr_badge_source_txt {padding:0; font: 11px Arial, Helvetica, Sans serif; color:#666666;}#flickr_badge_source_txt {padding:0; font: 11px Arial, Helvetica, Sans serif; color:#666666;}#flickr_badge_icon {display:block !important; margin:0 !important; border: 1px solid rgb(0, 0, 0) !important;}#flickr_icon_td {padding:0 5px 0 0 !important;}.flickr_badge_image {text-align:center !important;}.flickr_badge_image img {border: 1px solid black !important;}#flickr_badge_uber_wrapper {width:150px;}#flickr_www {display:block; text-align:center; padding:0 10px 0 10px !important; font: 11px Arial, Helvetica, Sans serif !important; color:#3993ff !important;}#flickr_badge_uber_wrapper a:hover,#flickr_badge_uber_wrapper a:link,#flickr_badge_uber_wrapper a:active,#flickr_badge_uber_wrapper a:visited {text-decoration:none !important; background:inherit !important;}#flickr_badge_wrapper {opacity: '+this._backgroundAlpha+";background-color: "+this._backgroundColor+";border: solid 1px "+this._borderColor+"}#flickr_badge_source {padding:0 !important; font: 11px Arial, Helvetica, Sans serif !important; }body {overflow: hidden;}"+d+'</style><table id="flickr_badge_uber_wrapper" cellpadding="0" cellspacing="10" border="0"><tr><td><a href="http://www.flickr.com" id="flickr_www">www.<strong style="color:#3993ff">flick<span style="color:#ff1c92">r</span></strong>.com</a><table cellpadding="0" cellspacing="10" border="0" id="flickr_badge_wrapper"><script type="text/javascript" src="http://www.flickr.com/badge_code_v2.gne?show_name=1&count='+c.imageCount+"&display="+c.whichImages+"&size="+c.imageSize+"&layout="+c.layoutOrientation+"&source="+b+"&user="+c.userID+a+'"><\/script></table></td></tr></table></td></tr></table>'
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.FooterContainer",skinParts:{inlineContent:{type:"htmlElement"},screenWidthBackground:{type:"htmlElement"},bg:{type:"htmlElement"},centeredContent:{type:"htmlElement"}},Class:{Extends:"wysiwyg.viewer.components.ScreenWidthContainer",initialize:function(c,a,b){this.parent(c,a,b);
this._resizableSides=[W.BaseComponent.ResizeSides.TOP,W.BaseComponent.ResizeSides.BOTTOM]
},useLayoutOnDrag:function(){return true
},useLayoutOnResize:function(){return true
},isDeleteable:function(){return false
},isAnchorable:function(){return{to:{allow:true,lock:W.BaseComponent.AnchorLock.BY_THRESHOLD},from:{allow:true,lock:W.BaseComponent.AnchorLock.ALWAYS}}
},canMoveToOtherScope:function(){return false
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.GoogleMap",propertiesSchemaName:"GoogleMapProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_initializeParams","_onIframeLoad"],_states:["normal","error"],_renderTriggers:[Constants.DisplayEvents.MOVED_IN_DOM,Constants.DisplayEvents.ADDED_TO_DOM,Constants.DisplayEvents.DISPLAYED,Constants.DisplayEvents.DISPLAY_CHANGED],API_KEY:"AIzaSyDMbN5wvwwR2ePDQ1QquKP_0VAhvAFNWes",MIN_SIZE:130,initialize:function(c,a,b){b=b||{};
this.parent(c,a,b)
},_editModeChanged:function(b,a){if(a=="PREVIEW"&&b=="CURRENT_PAGE"){this.render()
}},_initializeParams:function(){this.iframeCreated=false;
this._map=null;
this._marker=null;
this._infoWindow=null;
this._google=null
},render:function(){this._initializeParams();
this._renderGoogleMapsIframe();
this.addEvent("resizeEnd",this._renderGoogleMapsIframe)
},_renderGoogleMapsIframe:function(){if(!this.isReady()){return
}if(!this.iframeCreated){this._createIframe();
this.iframeCreated=true
}else{this._updateIframe()
}},_createIframe:function(){var a=new IFrame({src:"",width:"100%",height:"100%",webkitAllowFullScreen:"true",mozallowfullscreen:"true",allowfullscreen:"allowfullscreen",frameBorder:"1",events:{load:this._onIframeLoad}});
this._iframe=a;
this._view.empty();
this._view.grab(a)
},_onIframeLoad:function(){this._iframe.removeEvent("load",this._onIframeLoad);
this.injects().Utils.prepareIFrameForWrite(this._iframe,function(c,e){var g=new Element("div",{id:"map_canvas",style:"width:100%; height:100%"});
e.body.appendChild(g);
var d=new Element("meta",{name:"viewport",content:"initial-scale=1.0, user-scalable=no"});
var b=new Element("style",{type:"text/css"});
b.cssText="  html { height: 100% }  body { height: 100%; margin: 0; padding: 0 }  #map_canvas { height: 100% }";
var a=new Element("script",{type:"text/javascript",src:"http://maps.googleapis.com/maps/api/js?key="+this.API_KEY+"&sensor=false&callback=initialize"});
var f=new Element("script",{type:"text/javascript"});
f.text="  function initialize(optionsObj) {    var latlng = new google.maps.LatLng("+this._data.get("latitude")+","+this._data.get("longitude")+'); var myOptions = {      zoom: 14,      disableDefaultUI: true,      center: latlng,      mapTypeId: google.maps.MapTypeId.ROADMAP    };    window.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);  }';
e.body.appendChild(d);
e.body.appendChild(b);
e.body.appendChild(f);
e.body.appendChild(a);
this._checkIframeLoaded()
}.bind(this))
},_checkIframeLoaded:function(){var a=this._iframe.contentWindow;
this._map=a.map;
this._google=a.google;
if(!this._map||!this._google){setTimeout(this._checkIframeLoaded.bind(this),100);
return
}this._updateIframe()
},_getLatLongObj:function(){var a=this._data.get("latitude");
var b=this._data.get("longitude");
if(this._google){return new this._google.maps.LatLng(a,b)
}else{return null
}},_updateIframe:function(){var e=this.getComponentProperty("mapType");
var g=this.getComponentProperty("mapDragging");
var c={zoomControl:this.getComponentProperty("showZoom"),panControl:this.getComponentProperty("showPosition"),streetViewControl:this.getComponentProperty("showStreetView"),mapTypeControl:this.getComponentProperty("showMapType"),scaleControl:true,draggable:g,disableDefaultUI:!g,disableDoubleClickZoom:!g,scrollwheel:g};
this._map.setOptions(c);
if(e){this._map.setMapTypeId(this._google.maps.MapTypeId[e])
}var h=this._getLatLongObj();
var a=this._data.get("address");
if(h){this._map.setCenter(h);
if(!this._marker){this._marker=new this._google.maps.Marker();
this._marker.setMap(this._map)
}this._marker.setPosition(h);
var d=this._data.get("addressInfo");
var f=false;
if(!d||d.trim()==""){f=true
}d=d.replace(/\n/g,"<BR>");
if(!this._infoWindow){this._infoWindow=new this._google.maps.InfoWindow();
this._google.maps.event.addListener(this._marker,"click",function(){this._marker.setTitle("");
this._infoWindow.open(this._map,this._marker)
}.bind(this));
this._google.maps.event.addListener(this._infoWindow,"closeclick",function(){this._marker.setTitle("Click to see more...");
this._map.setCenter(h)
}.bind(this))
}this._infoWindow.setPosition(h);
this._marker.setTitle("");
var b=f?this._data.get("address"):d;
this._infoWindow.setContent("<p>"+b+"</p>");
if(f){this._marker.setTitle("Click to see more...")
}else{this._infoWindow.open(this._map,this._marker)
}}else{if(this._marker){this._marker.setMap(null)
}}},_onResize:function(){this.parent()
},setHeight:function(b,a,c){b=this._enforceSize(b);
this._view.setStyle("height",parseInt(b)+"px");
this.parent(b,a,c)
},setWidth:function(b,a,c){b=this._enforceSize(b);
this._view.setStyle("width",parseInt(b)+"px");
this.parent(b,a,c)
},_enforceSize:function(a){a=Math.max(a,this.MIN_SIZE);
return a
},getAcceptableDataTypes:function(){return["GeoMap"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.HeaderContainer",skinParts:{inlineContent:{type:"htmlElement"},screenWidthBackground:{type:"htmlElement"},bg:{type:"htmlElement"},centeredContent:{type:"htmlElement"}},Class:{Extends:"wysiwyg.viewer.components.ScreenWidthContainer",initialize:function(c,a,b){this.parent(c,a,b);
this._resizableSides=[W.BaseComponent.ResizeSides.TOP,W.BaseComponent.ResizeSides.BOTTOM]
},useLayoutOnDrag:function(){return true
},useLayoutOnResize:function(){return true
},isDeleteable:function(){return false
},isAnchorable:function(){return{to:{allow:true,lock:W.BaseComponent.AnchorLock.BY_THRESHOLD},from:{allow:true,lock:W.BaseComponent.AnchorLock.ALWAYS}}
},canMoveToOtherScope:function(){return false
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.HorizontalMenu",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],skinParts:{repeaterButton:{type:"mobile.core.components.MenuButton",repeater:true,dataRefField:"pages",container:"itemsContainer",hookMethod:"_changePagesRefData",argObject:{listSubType:"PAGES"}},moreButton:{type:"mobile.core.components.MenuButton"},itemsContainer:{type:"htmlElement"},moreContainer:{type:"htmlElement"}},propertiesSchemaName:"HorizontalMenuProperties",Class:{Extends:"mobile.core.components.BaseRepeater",Binds:["_onButtonDataChange","_onMoreButtonClick","_onThemeChange","_arrangeButtons","_onButtonClick","_onMoreButtonOver","_onMoreButtonOut","_onMoreContainerOver","_onMoreContainerOut","_closeMoreMenu","_onPageChanged"],_renderTriggers:[Constants.DisplayEvents.ADDED_TO_DOM,Constants.DisplayEvents.DISPLAYED,Constants.DisplayEvents.SKIN_CHANGE],initialize:function(c,a,b){this.parent(c,a,b);
this.injects().Theme.addEvent("propertyChange",this._onThemeChange);
this._arrangeWaitID=-1;
this.injects().Viewer.addEvent("pageTransitionEnded",this._onPageChanged);
this._usesExternalData=true;
this._staticWidth=0;
this._preWidthModifier=this._nullModifier;
this._postWidthModifier=this._nullModifier;
this._hiddenButtonsContainer=new Element("div",{id:"hiddenButtonsContainer",style:"visibility:hidden"});
this._hiddenButtonsContainer.inject(this.getViewNode())
},_prevButtonsWidth:0,_testOverFlowCount:50,_testOverFlow:function(){var a=this._getButtonsWidth();
this.injects().Utils.clearCallLater(this._overflowID);
if(this._prevButtonsWidth==0){this._prevButtonsWidth=a
}if(a!=this._prevButtonsWidth){this._arrangeButtons()
}else{this._testOverFlowCount--;
if(this._testOverFlowCount>0){this._overflowID=this.callLater(this._testOverFlow,[],100)
}}},_onPageChanged:function(a){var c;
var b;
if(this._skinParts==null){return
}if(this._allButtons){for(c=0;
c<this._allButtons.length;
c++){b=this._allButtons[c];
if(b.getID()==a){b.setState("selected")
}else{b.removeState("selected")
}this.injects().Utils.forceBrowserRepaint(b.getViewNode())
}}},_onThemeChange:function(){this._changeTriggeredBy="themeChange";
this._arrangeButtonsDelayed()
},_beforeRepeatersCreation:function(){this._allButtons=[]
},_onRepeaterItemReady:function(b,d,a,c){if(c){d.addEvent("click",function(){this._onButtonClick(a)
}.bind(this))
}this._allButtons.push(d);
this.parent(b,d,a,c)
},_onRepeaterReady:function(a){this.addEvent(Constants.PropertyEvents.PROPERTY_CHANGED,this._arrangeButtons);
this._addPartsListeners();
this._arrangeButtons()
},_addPartsListeners:function(){this._skinParts.moreButton.addEvent("over",this._onMoreButtonOver);
this._skinParts.moreButton.addEvent("out",this._onMoreButtonOut);
this._skinParts.moreButton.addEvent("click",this._onMoreButtonClick);
this._skinParts.moreContainer.addEvent("mouseover",this._onMoreContainerOver);
this._skinParts.moreContainer.addEvent("mouseout",this._onMoreContainerOut);
this._skinParts.moreContainer.addEvent("mouseout",this._onMoreContainerOut);
for(var a=0;
a<this._allButtons.length;
a++){this._allButtons[a].getViewNode().uncollapse();
this._allButtons[a].addEvent("dataChanged",this._onButtonDataChange)
}},render:function(){this.parent();
if(this._changeTriggeredBy=="styleChange"){this._arrangeButtonsDelayed()
}else{this._arrangeButtons()
}},setSkin:function(a){this._staticWidth=a.staticWidth||0;
this.parent(a)
},_onButtonDataChange:function(a){this._changeTriggeredBy="dataChange";
this.render()
},_onDataChange:function(a){this.getComponentProperties().removeField("spacing");
this._changeTriggeredBy="dataChange";
this.parent(a)
},_applySettings:function(){this._preWidthModifier=this._nullModifier;
this._postWidthModifier=this._nullModifier;
if(this._staticWidth>0){this._preWidthModifier=this._staticWidthModifier
}else{if(this.getComponentProperty("sameWidthButtons")){this._preWidthModifier=this._sameWidthModifier
}if(this.getComponentProperty("stretchButtonsToMenuWidth")){this._postWidthModifier=this._stretchToFillModifier
}}},_skinSizeChange:function(){this._changeTriggeredBy="styleChange";
this.parent()
},_skinParamsChange:function(a){this._changeTriggeredBy="styleChange";
this.parent(a)
},_arrangeButtonsDelayed:function(){if(this._arrangeWaitID!=-1){this.injects().Utils.clearCallLater(this._arrangeWaitID)
}this._arrangeWaitID=this.callLater(this._arrangeButtonsCapture,[],100);
this._changeTriggeredBy="";
this._skinParts.itemsContainer.setStyle("overflow","hidden")
},_arrangeButtonsCapture:function(){this._arrangeButtons();
if(this._arrangeWaitID!=-1){this._arrangeButtonsDelayed()
}},_arrangeButtons:function(){if(this._skinParts==undefined||!this._allButtons||this._allButtons.length==0||!this._isDisplayed||!this.isReady()){return
}this.injects().Utils.clearCallLater(this._overflowID);
this._prevButtonsWidth=0;
this._arrangeWaitID=-1;
this._applySettings();
var e=this._allButtons[0].getViewNode().getStyle("-webkit-transition-duration");
this._initItemsContainer();
this._skinParts.itemsContainer.setStyle("overflow","hidden");
this._skinParts.itemsContainer.setStyle("white-space","normal");
this._initMoreContainer();
this._skinParts.moreButton.setLabel(this.getComponentProperty("moreButtonLabel"));
this._skinParts.moreButton.skipMe=true;
var d=this._getDisplayedButtons();
d.push(this._skinParts.moreButton);
var c=this._getSampleButton();
this._sampleButtonBorder(c);
this._setMinimumDimensions(c);
this._preArrangeButtons(d);
this._preWidthModifier(d);
this._calculateButtonsAmount(d);
this._postWidthModifier(d);
this._arrangeMoreContainer();
d=this._getDisplayedButtons();
d.push(this._skinParts.moreButton);
this._alignButtonsText(d);
for(var b=0;
b<d.length;
b++){var a=d[b];
a.getViewNode().setStyle("-webkit-transition-duration",e)
}this._skinParts.itemsContainer.setStyle("overflow","visible");
this._skinParts.itemsContainer.setStyle("white-space","nowrap");
this._setListPositions();
this._testOverFlow()
},_calculateButtonsAmount:function(a){a=this._arrangementAlgorithm(a);
if(this._skinParts.moreButton.skipMe){this._skinParts.moreButton.getViewNode().setStyle("visibility","hidden");
this._skinParts.moreButton.getViewNode().inject(this._skinParts.moreContainer);
if(a[a.length-1]===this._skinParts.moreButton){a.pop()
}}},_getButtonsWidth:function(){var b=0;
var a=0;
for(i=0;
i<this._skinParts.itemsContainer.children.length;
i++){b+=parseInt(this._skinParts.itemsContainer.children[i].offsetWidth)
}return b
},_getDisplayedButtons:function(){var a=[];
for(var b=0;
b<this._allButtons.length;
b++){if(!this._allButtons[b].getDataItem()._data.hidePage){a.push(this._allButtons[b])
}else{this._allButtons[b].getViewNode().setStyle("visibility","inherit");
this._allButtons[b].getViewNode().inject(this._hiddenButtonsContainer)
}}return a
},_setListPositions:function(){var c;
var b;
var a;
for(c=0;
c<this._skinParts.itemsContainer.children.length;
c++){b=this._skinParts.itemsContainer.children[c];
if(c==0&&this._setPositionForFirst()){a="first"
}else{if(c==this._skinParts.itemsContainer.children.length-1&&this._setPositionForLast()){a="last"
}else{a="center"
}}b.setProperty("listposition",a)
}for(c=0;
c<this._skinParts.moreContainer.children.length;
c++){b=this._skinParts.moreContainer.children[c];
b.setProperty("listposition","more")
}},_setPositionForFirst:function(){var a=false;
if(this._postWidthModifier==this._stretchToFillModifier){a=true
}else{if(this.getComponentProperty("alignButtons")=="left"){a=true
}}return a
},_setPositionForLast:function(){var a=false;
if(this._postWidthModifier==this._stretchToFillModifier){a=true
}else{if(this.getComponentProperty("alignButtons")=="right"){a=true
}}return a
},_getSampleButton:function(){if(this._allButtons[0].getViewNode().getStyle("visibility")=="visible"){return this._allButtons[0]
}else{return this._skinParts.moreButton
}},_sampleButtonBorder:function(a){if(a._skinParts.borderWrapper){this._buttonsBorder=this._getBorder(a._skinParts.borderWrapper)
}else{this._buttonsBorder=this._getBorder(a.getViewNode())
}},_setMinimumDimensions:function(b){b._skinParts.label.setStyle("line-height","100%");
var c=0;
if(b.getSkin()&&!isNaN(b.getSkin().addToMinH)){c=b.getSkin().addToMinH
}var a=this._getBorder(this._skinParts.itemsContainer).y+this._buttonsBorder.y;
this.setMinH(c+a+parseInt(b._skinParts.label.getComputedStyle("line-height")))
},_initItemsContainer:function(){this._skinParts.itemsContainer.setStyle("text-align",this.getComponentProperty("alignButtons"));
var a=this.getHeight()-this._getBorder(this._skinParts.itemsContainer).y-this._getMargin(this._skinParts.itemsContainer).y;
var b=this.getWidth()-this._getBorder(this._skinParts.itemsContainer).x-this._getMargin(this._skinParts.itemsContainer).x;
this._skinParts.itemsContainer.setStyle("height",a+"px");
this._skinParts.itemsContainer.setStyle("width",b+"px")
},_initMoreContainer:function(){this._skinParts.moreContainer.setStyle("visibility","hidden");
this._skinParts.moreContainer.setStyle("opacity","0");
this._skinParts.moreContainer.setStyle("width","0px");
this._skinParts.moreContainer.setStyle("left","0px")
},_preArrangeButtons:function(c){for(var b=0;
b<c.length;
b++){var a=c[b];
a.getViewNode().setStyle("visibility","inherit");
a.getViewNode().setStyle("-webkit-transition-duration","0s");
a.getViewNode().inject(this._skinParts.moreContainer);
a._skinParts.bg.setStyle("padding","0px 0px")
}},_arrangeMoreContainer:function(){var d=this._skinParts.moreButton.getViewNode().offsetWidth;
var c;
var b;
for(c=0;
c<this._skinParts.moreContainer.children.length;
c++){b=this._skinParts.moreContainer.children[c];
d=Math.max(d,b.offsetWidth)
}this._skinParts.moreContainer.setStyle("width",d+"px");
for(c=0;
c<this._skinParts.moreContainer.children.length;
c++){b=this._skinParts.moreContainer.children[c];
this._fillWidthByPadding(b,d)
}var a=this._skinParts.moreButton.getViewNode().offsetLeft;
if(!isNaN(a)){this._skinParts.moreContainer.setStyle("left",a+"px")
}},_alignButtonsText:function(c){for(var a=0;
a<c.length;
a++){var b=c[a].getViewNode();
var d=parseInt(b.getLogic()._skinParts.bg.getComputedStyle("padding-left"))+parseInt(b.getLogic()._skinParts.bg.getComputedStyle("padding-right"));
switch(this.getComponentProperty("alignText")){case"left":b.getLogic()._skinParts.bg.setStyle("padding-left","0px");
b.getLogic()._skinParts.bg.setStyle("padding-right",d+"px");
break;
case"right":b.getLogic()._skinParts.bg.setStyle("padding-left",d+"px");
b.getLogic()._skinParts.bg.setStyle("padding-right","0px");
break
}}},_setPadding:function(a,b){a.getLogic()._skinParts.bg.setStyle("padding","0px "+b+"px")
},_fillWidthByPadding:function(b,a){var d=parseInt(b.getLogic()._skinParts.bg.getComputedStyle("padding-left"));
var c=d+Math.floor((a-b.offsetWidth)/2);
this._setPadding(b,c)
},_arrangementAlgorithm:function(b){var c=false;
while(!c){c=this._arrangementIteration(b);
if(!c){if(b.length==1){c=true
}else{this._skinParts.moreButton.skipMe=false;
var a=b.splice(b.length-2,1)[0];
a.getViewNode().setStyle("visibility","inherit");
a.getViewNode().inject(this._skinParts.moreContainer,"top")
}}}return b
},_buttonsPadding:{},_stretchToFillModifier:function(k,a){a=a||0;
var m=false;
if(a==0){m=true;
this._buttonsPadding={}
}var n=this._getButtonsWidth();
var b;
var d=parseInt(this._skinParts.itemsContainer.getStyle("width"));
var l=d-n-a-1;
if(Browser.ie){l=l-1
}var h=this;
function j(q,r){if(g>0){var p=Math.floor(l/g);
var o=parseInt(q._skinParts.bg.getStyle(r));
if(m){if(!h._buttonsPadding[q]){h._buttonsPadding[q]={}
}h._buttonsPadding[q][r]=o
}q._skinParts.bg.setStyle(r,(o+p)+"px");
g--;
l-=p
}}if(k.length>0&&l>0){var g=k.length*2;
for(b=0;
b<k.length/2;
b++){var f=k[b];
var e=k[k.length-b-1];
j(f,"padding-left");
j(e,"padding-right");
j(f,"padding-right");
j(e,"padding-left")
}}if((this._skinParts.itemsContainer.scrollHeight-k[0].getViewNode().offsetHeight)>=k[0].getViewNode().offsetHeight){for(b=0;
b<k.length;
b++){var c=k[b];
c._skinParts.bg.setStyle("padding-left",this._buttonsPadding[c]["padding-left"]+"px");
c._skinParts.bg.setStyle("padding-right",this._buttonsPadding[c]["padding-right"]+"px")
}if(a>20){return
}this._stretchToFillModifier(k,a+1)
}},_sameWidthModifier:function(d){var e=0;
var c;
var b;
for(c=0;
c<d.length;
c++){b=d[c];
var a=parseInt(b.getViewNode().offsetWidth-this._buttonsBorder.x);
if(!isNaN(a)){e=Math.max(e,a)
}}if(e>0){for(c=0;
c<d.length;
c++){b=d[c];
this._fillWidthByPadding(b.getViewNode(),e)
}}},_staticWidthModifier:function(c){var b;
var a;
for(b=0;
b<c.length;
b++){a=c[b];
if(a.offsetWidth<this._staticWidth){this._fillWidthByPadding(a.getViewNode(),this._staticWidth)
}else{a.getViewNode().setStyle("width",this._staticWidth+"px")
}}},_nullModifier:function(a){},_arrangementIteration:function(d){var a;
for(var c=0;
c<d.length;
c++){var b=d[c];
if(b.skipMe){b.collapse();
continue
}b.uncollapse();
b.getViewNode().setStyle("visibility","visible");
b.getViewNode().inject(this._skinParts.itemsContainer);
a=parseInt(this._skinParts.itemsContainer.getStyle("height"))-this._buttonsBorder.y;
b.getViewNode().setStyle("height",a+"px");
if(b._skinParts.labelPad!=undefined){a=a-b._skinParts.labelPad.offsetHeight
}b._skinParts.label.setStyle("line-height",a+"px");
b._skinParts.label.setStyle("width","auto")
}return(this._skinParts.itemsContainer.scrollHeight-d[0].getViewNode().offsetHeight)<d[0].getViewNode().offsetHeight
},_getBorder:function(c){var a=0;
var b=0;
if(c){a=parseInt(c.getStyle("border-left-width"))+parseInt(c.getStyle("border-right-width"));
b=parseInt(c.getStyle("border-top-width"))+parseInt(c.getStyle("border-bottom-width"))
}return{x:a,y:b}
},_getMargin:function(c){var a=0;
var b=0;
if(c){a=parseInt(c.getStyle("margin-left"))+parseInt(c.getStyle("margin-right"));
b=parseInt(c.getStyle("margin-top"))+parseInt(c.getStyle("margin-bottom"))
}return{x:a,y:b}
},_onResize:function(){this._arrangeButtons()
},_onButtonClick:function(a){this.injects().Viewer.goToPage(a.get("id"))
},_openMoreMenu:function(){this._skinParts.moreButton.setState("selected");
this._skinParts.moreContainer.setStyle("visibility","visible");
this._skinParts.moreContainer.setStyle("opacity","1");
this._isMoreContainerOpen=true;
this._toCloseMoreMenu=false;
this.injects().Utils.forceBrowserRepaint(this._skinParts.moreButton.getViewNode());
this.injects().Utils.forceBrowserRepaint(this._skinParts.moreContainer)
},_closeMoreMenuTimer:function(){this.injects().Utils.clearCallLater(this._closeMoreMenuTimerID);
this._closeMoreMenuTimerID=this.injects().Utils.callLater(this._closeMoreMenu,[],this,500)
},_closeMoreMenu:function(a){if(a||this._toCloseMoreMenu){this._skinParts.moreButton.removeState("selected");
this._skinParts.moreContainer.setStyle("visibility","hidden");
this._skinParts.moreContainer.setStyle("opacity","0");
this._toCloseMoreMenu=false;
this._isMoreContainerOpen=false;
this._moreButtonClicked=false
}},_forceCloseMoreMenu:function(){this._closeMoreMenu(true)
},_onMoreButtonOver:function(){this._toCloseMoreMenu=false;
if(!this._moreButtonClicked){this._openMoreMenu()
}},_onMoreButtonOut:function(){this._toCloseMoreMenu=true;
this._closeMoreMenuTimer()
},_onMoreContainerOver:function(){this._toCloseMoreMenu=false
},_moreButtonClicked:false,_onMoreButtonClick:function(){this._moreButtonClicked=true;
if(this._isMoreContainerOpen===false){this._openMoreMenu()
}else{this._forceCloseMoreMenu()
}},_onMoreContainerOut:function(){this._toCloseMoreMenu=true;
this._closeMoreMenuTimer()
},dispose:function(){this.injects().Viewer.removeEvent("pageTransitionEnded",this._onPageChanged);
this.injects().Theme.removeEvent("propertyChange",this._onThemeChange);
this.parent()
},getAcceptableDataTypes:function(){return["Document"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.HtmlComponent",skinParts:{iFrameHolder:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["hasContent","noContent"],initialize:function(c,a,b){this.parent(c,a,b);
this.addEvent("resizeEnd",this._onResizeEnd);
this._iframe=null;
this._renderOnResize=false
},_onResizeEnd:function(){if(this._iframe){this._iframe.width=this._view.getWidth();
this._iframe.height=this._view.getHeight()
}if(this._renderOnResize){this._renderIfReady()
}},render:function(){this._createIFrame(this._view.getWidth(),this._view.getHeight());
this.setState(this.hasContent()?"hasContent":"noContent");
if(this.hasContent()){this._setFrameWithSrc(this._iframe)
}},getIFrameSrc:function(){var b=this._data.get("url");
var a=/^(ftps|ftp|http|https).*$/;
if(!a.test(b)){b="http://"+b
}return b
},hasContent:function(){return !!this._data.get("url")
},_createIFrame:function(c,a){var b=new IFrame();
b.width=c;
b.height=a;
if(navigator.userAgent.match(/(iPod|iPhone|iPad)/)){this._view.setStyles({overflow:"scroll","-webkit-overflow-scrolling":"touch"})
}if(this._iframe){b.replaces(this._iframe)
}else{b.insertInto(this._skinParts.iFrameHolder)
}this._iframe=b
},_setFrameWithSrc:function(a){a.set("src",this.getIFrameSrc())
},getAcceptableDataTypes:function(){return["HtmlComponent"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.IFrameComponent",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_changeSize"],initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this._iframe=null
},render:function(){this._renderIframe()
},_onResize:function(){this.parent();
if(this._skinParts){this._renderIframe()
}},_renderIframe:function(a){if(!this._iframe){this._createIframe()
}else{this._updateIframe(a)
}},_createIframe:function(){this._iframe=new IFrame({src:"",width:"100%",height:"100%",webkitAllowFullScreen:"true",mozallowfullscreen:"true",allowfullscreen:"allowfullscreen",frameBorder:"0",scrolling:"no",frameborder:"0",style:{overflow:"visible"}});
this._setBasicIframeParams();
this._setIframeParams();
this._iframe.insertInto(this._view)
},_changeSize:function(c){var b=c.x||c.w;
var a=c.y||c.h;
if(b){this.setWidth(b,false,false);
this._iframe.setStyle("width",b+"px")
}if(a){this.setHeight(a,false,false);
this._iframe.setStyle("height",a+"px")
}this._wCheckForSizeChangeAndFireAutoSized(0)
},_updateIframe:function(a){this._setBasicIframeParams(a);
this._setIframeParams()
},_setBasicIframeParams:function(a){a=a||false;
if(a||this._iframe.src!==this._getUrl()){this._iframe.src=this._getUrl()
}this._iframe.width=this.getWidth()+"px";
this._iframe.height=this.getHeight()+"px"
},_setIframeParams:function(){},_getUrl:function(){throw new Error("IFrameComponent::_getUrl() must be overridden.")
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.LinkBar",skinParts:{imageItem:{type:"wysiwyg.viewer.components.LinkBarItem",repeater:true,container:"itemsContainer",dataRefField:"items",argObject:{unit:"px"}},itemsContainer:{type:"htmlElement"}},imports:[],propertiesSchemaName:"LinkBarProperties",Class:{Extends:"mobile.core.components.BaseRepeater",Binds:["_setComponentSize"],initialize:function(c,a,b){this.parent(c,a,b);
this._resizableSides=[];
this.setMaxH(9999);
this.setMaxW(9999)
},_onDataChange:function(a){this.parent()
},getAcceptableDataTypes:function(){return["ImageList"]
},render:function(){this._iconSize=this.getComponentProperty("iconSize")||30;
this._orientation=this.getComponentProperty("orientation");
this._spacing=this.getComponentProperty("spacing");
this._bgScale=this.getComponentProperty("bgScale");
this._setComponentSize()
},_processDataRefs:function(a){return a
},_onRepeaterReady:function(a){this._itemsAmount=a.itemsAmount;
this._items=a.readyItemsLogic
},_setComponentSize:function(){var g=0;
var e=0;
var j=(this._orientation=="HORIZ");
for(var d=0;
d<this._items.length;
d++){var f=this._items[d];
var k=f.getViewNode();
var a=this._spacing;
if(d==this._items.length-1){a=0
}f.setSize(this._iconSize,a,this._bgScale,j);
var c=k.offsetWidth;
var b=k.offsetHeight;
if(j){k.setStyle("display","inline-block");
e=Math.max(e,b);
g+=c
}else{k.setStyle("display","block");
e+=b;
g=Math.max(g,c)
}}this.setWidth(g+5,true);
this.setHeight(e,true);
this._wCheckForSizeChangeAndFireAutoSized(3)
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.LinkBarItem",skinParts:{image:{type:"mobile.core.components.Image",dataRefField:"*",optional:false},imageBG:{type:"htmlElement",optional:true},link:{type:"htmlElement",optional:false}},traits:["mobile.core.components.traits.LinkableComponent"],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onMouseOver","_onMouseOut","_onLinkMouseDown","_onImageStateChange"],_states:["loading","normal","rollover"],_parentList:null,initialize:function(c,a,b){this.parent(c,a,b)
},setParentList:function(a){this._parentList=a
},render:function(){var a=this._data.get("title")?this._data.get("title"):"";
this._skinParts.image.getViewNode().set("title",a)
},_onImageStateChange:function(a){switch(this._skinParts.image.getState()){case"loading":this.setState("loading");
break;
case"loaded":this.setState("normal");
break
}},_onMouseOver:function(){if(this.getState()=="normal"){this.setState("rollover")
}},_onMouseOut:function(){if(this.getState()=="rollover"){this.setState("normal")
}},_onLinkMouseDown:function(b){var a=this._data.get("link");
var c=this._data.get("target")||"_blank";
if(a){window.open(a,c)
}},setSize:function(e,f,h,c){var d,b;
if(c){d=f;
b=0
}else{d=0;
b=f
}var g;
var a={};
this._skinParts.image.setUnit("px");
this._skinParts.image.setSize(e,e);
g=e;
a.x=a.y=g/2;
this._skinParts.image.getViewNode().setStyles({left:a.x-(e/2),top:a.y-(e/2)});
this.getViewNode().setStyles({width:String(g+d)+"px",height:String(g+b)+"px"})
},_onDataChange:function(a){this.parent()
},_onAllSkinPartsReady:function(){this.parent()
},_onResize:function(){this.parent();
if(this._skinParts.image){this._skinParts.image._invalidate("size");
this._skinParts.image._renderIfReady()
}},getAcceptableDataTypes:function(){return["Image"]
},getImageRef:function(){var a="";
if(this._skinParts){a=String(this._skinParts.image.getDataItem().get("id"))
}return a
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.MatrixGallery",skinParts:{imageItem:{type:"wysiwyg.viewer.components.Displayer",repeater:true,container:"itemsContainer",dataRefField:"items",argObject:{unit:"px"}},itemsContainer:{type:"htmlElement"},showMore:{type:"htmlElement"}},imports:[],propertiesSchemaName:"MatrixGalleryProperties",Class:{Extends:"mobile.core.components.BaseRepeater",Binds:["_increaseTotalMaxRows"],_states:["fullView","hiddenChildren"],_itemsRef:[],_galleryItems:[],_totalMaxRows:0,_numCols:0,_numRows:0,_gap:0,_itemWidth:-1,_itemHeight:-1,_transitionProp:"",_numItems:0,_imageMode:"",_transitionsOn:false,_Tween:null,_widthDiff:0,_heightDiff:0,_minDisplayerWidth:5,_minDisplayerHeight:5,initialize:function(c,a,b){this.parent(c,a,b);
this._transitionProp=this.injects().Utils.getCSSBrowserFeature("transition");
this._Tween=this.injects().Utils.Tween;
this.setMaxW(10000);
this.setMaxH(10000)
},_onDataChange:function(b,e){var c,a,d;
this._numItems=this._data.get("items").length;
this._numCols=parseInt(this.getComponentProperty("numCols"));
this._numRows=this._normalizeRows(parseInt(this.getComponentProperty("maxRows")));
this._gap=parseInt(this.getComponentProperty("margin"));
this._imageMode=String(this.getComponentProperty("imageMode"));
this._updateState();
this._updateSizeLimits();
if(this._itemWidth==-1){this._calculateItemSize()
}else{if(this._numItems>0){c=Math.floor((this._numCols*this._itemWidth)+((this._numCols-1)*this._gap));
a=Math.floor((this._numRows*this._itemHeight)+((this._numRows-1)*this._gap));
this._setContainerWidth(c);
this._setContainerHeight(a);
this._positionAllItems();
this.fireEvent("autoSized")
}}this._transitionsOn=false;
if(e=="margin"){this.render()
}else{this.parent()
}},_updateSizeLimits:function(){this.setMinW((this._numCols*this._minDisplayerWidth)+this._widthDiff);
this.setMinH((this._numRows*this._minDisplayerHeight)+this._heightDiff)
},_editModeChanged:function(b,a){this.parent(b);
this._transitionsOn=false;
if(a=="PREVIEW"){this._setTotalMaxRows(this._normalizeRows(parseInt(this.getComponentProperty("maxRows"))))
}},_setContainerWidth:function(b){var a=b+this._widthDiff;
this._skinParts.itemsContainer.setStyle("width",String(b)+"px");
this._view.setStyle("width",String(a)+"px");
this.setWidth(a,false,false)
},_setContainerHeight:function(a){var b=a+this._heightDiff;
this._skinParts.itemsContainer.setStyle("height",String(a)+"px");
this.setHeight(b,false,false);
this._view.setStyle("height",String(b)+"px")
},_calculateItemSize:function(){if(this._skinParts&&this._data.get("items").length>0){var b=this.getWidth()-this._widthDiff;
var a=this.getHeight()-this._heightDiff;
this._itemWidth=Math.max(Math.floor((b-((this._numCols-1)*this._gap))/this._numCols),0);
this._itemHeight=Math.max(Math.floor((a-((this._numRows-1)*this._gap))/this._numRows),0)
}},_onAllSkinPartsReady:function(){this._skinParts.showMore.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._increaseTotalMaxRows);
this._skinParts.showMore.setStyles({"white-space":"nowrap"});
this._widthDiff=this._skin.widthDiff||0;
this._heightDiff=this._skin.heightDiff||0;
this._calculateItemSize();
this._updateSizeLimits()
},getAcceptableDataTypes:function(){return["ImageList"]
},_beforeRepeatersCreation:function(){this._newItems=[]
},_processDataRefs:function(b){this._itemsRef=b.slice(0);
var a=this._numCols*this._numRows;
a=Math.min(a,b.length);
return b.slice(0,a)
},_onRepeaterReady:function(a){this._galleryItems=this._repeatersData.imageItem.readyItems.slice(0);
this._totalMaxRows=this.getComponentProperty("maxRows");
this._positionAllItems();
this._setupAllItems()
},_setupItem:function(b){var c=this._skinParts.itemsContainer.children[b];
var a=c.getLogic();
a.setOwner(this);
a.invalidateSize();
a.setSize(this._itemWidth,this._itemHeight,this._imageMode);
if(this._transitionsOn&&parseFloat(c.getStyle("opacity"))<1){if(this._transitionProp){c.setStyle(this._transitionProp,"opacity 1s");
setTimeout(function(){c.setStyle("opacity","1.0")
},150)
}else{this._Tween.to(c,1,{opacity:1})
}}},_onRepeaterItemReady:function(d,c,a,b){if(b&&this._transitionsOn){c.getViewNode().setStyle("opacity","0.0")
}},_normalizeRows:function(b){var a=Math.floor(this._numItems/this._numCols)+((this._numItems%this._numCols>0)?1:0);
return Math.min(b,a)
},_updateState:function(){if(this._numItems<=(this._numRows*this._numCols)){this.setState("fullView")
}else{this.setState("hiddenChildren")
}},_positionAllItems:function(){var a;
var d;
var c={position:"absolute"};
for(var b=0;
b<this._skinParts.itemsContainer.children.length;
b++){a=b%this._numCols;
d=Math.floor((b-a)/this._numCols);
c.left=String((a*(this._itemWidth+this._gap)))+"px";
c.top=String((d*(this._itemHeight+this._gap)))+"px";
this._skinParts.itemsContainer.children[b].setStyles(c)
}},_setupAllItems:function(){for(var a=0;
a<this._skinParts.itemsContainer.children.length;
a++){this._setupItem(a)
}},_onResize:function(){this.parent();
this._view.setStyle("height",this.getHeight()+"px");
this._calculateItemSize();
this._checkExtremeValues();
if(this._skinParts){this._positionAllItems();
this._setupAllItems()
}},_checkExtremeValues:function(){if(this._itemWidth<this._minDisplayerWidth){var b=this.getWidth()-this._widthDiff;
this._itemWidth=this._minDisplayerWidth;
this._gap=Math.floor((b-(this._numCols*this._itemWidth))/(this._numCols-1));
this.setComponentProperty("margin",this._gap)
}else{if(this._itemHeight<this._minDisplayerHeight){var a=this.getHeight()-this._heightDiff;
this._itemHeight=this._minDisplayerHeight;
this._gap=Math.floor((a-(this._numRows*this._itemHeight))/(this._numRows-1));
this.setComponentProperty("margin",this._gap)
}}},_increaseTotalMaxRows:function(){this._setTotalMaxRows(this._normalizeRows(this._numRows+parseInt(this.getComponentProperty("incRows"))))
},_setTotalMaxRows:function(b){this._numRows=b;
var a=Math.floor((this._numRows*this._itemHeight)+((this._numRows-1)*this._gap));
this._updateState();
this._setContainerHeight(a);
this._calculateItemSize();
this.fireEvent("autoSized");
this._allRepeatersReady=false;
this._transitionsOn=true;
this._renderIfReady()
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.MediaZoom",traits:["wysiwyg.viewer.components.traits.ListIterator"],skinParts:{blockingLayer:{type:"htmlElement",command:"WViewerCommands.MediaZoom.Close"},dialogBox:{type:"htmlElement"},xButton:{type:"htmlElement",command:"WViewerCommands.MediaZoom.Close"},virtualContainer:{type:"htmlElement"},itemsContainer:{type:"htmlElement"},counter:{type:"htmlElement"},buttonPrev:{type:"htmlElement",command:"WViewerCommands.MediaZoom.Prev"},buttonNext:{type:"htmlElement",command:"WViewerCommands.MediaZoom.Next"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_handleCurrentItemChange","_transitionToCurrentDisplayer"],transitionTime:"normal",initialize:function(d,b,c){this.parent(d,b,c);
var a=this.injects().Commands;
a.registerCommandAndListener("WViewerCommands.MediaZoom.Close",this,this._closeZoom,null,true);
a.registerCommandAndListener("WViewerCommands.MediaZoom.Next",this,this.gotoNext,null,true);
a.registerCommandAndListener("WViewerCommands.MediaZoom.Prev",this,this.gotoPrev,null,true);
a.registerCommandAndListener("WPreviewCommands.WEditModeChanged",this,this._editModeChanged,null,true);
this.addEvent("currentItemChanged",this._handleCurrentItemChange);
this.collapse()
},_onAllSkinPartsReady:function(){var a=function(b){b.stopPropagation()
};
this._skinParts.dialogBox.addEvent("click",a);
this._skinParts.buttonNext.addEvent("click",a);
this._skinParts.buttonPrev.addEvent("click",a);
this._skinParts.xButton.addEvent("click",a)
},setGallery:function(b,a){if(!this._validateArgs(b,a)){return
}if(!this._data||this._getItemId(this._currentItem)!==this._getItemId(b.get("items")[a])){this.setDataItem(b);
this.setListAndCurrentIndex(b,a);
this._setNextPrevVisibility()
}},setImage:function(a){this.setGallery(W.Data.createDataItem({type:"ImageList",isPreset:true,items:[a]}),0)
},_lastCurrentItem:null,showZoomImage:function(){if(this._currentItem&&this._currentItem!=this._lastCurrentItem){var b=this.injects().Utils.getWindowSize();
var a=this.getSkin().getParams().first(function(c){return c.id==="$marginIncludingArrow"
});
this._imageMaxWidth=b.width-(a.defaultValue*2);
this._imageMaxHeight=b.height-60;
this._lastCurrentItem=this._currentItem;
this._renderCurrentDisplayer(this._transitionToCurrentDisplayer);
this._skinParts.counter.set("text",String(this._currentItemIndex+1)+"/"+String(this._numItems));
this.injects().Viewer.enterFullScreenMode();
this.uncollapse()
}},_editModeChanged:function(c,b){var a;
this._closeZoom();
this.injects().Viewer.removeMediaZoom()
},_closeZoom:function(){this.collapse();
this.injects().Viewer.exitFullScreenMode();
this.setDataItem(null);
this.resetIterator();
this._skinParts.virtualContainer.empty();
this._skinParts.itemsContainer.empty();
this._skinParts.dialogBox.setStyles({width:"100px"});
this.unlock();
this._lastCurrentItem=null
},_handleCurrentItemChange:function(){this.lock();
var a=function(c){var b=c.getData();
if(this.injects().Utils.hash.getHash()!=b.id){this.injects().Utils.hash.setHash(b.id,b.title)
}}.bind(this);
if(typeof(this._currentItem)=="string"){this.injects().Data.getDataByQuery(this._currentItem,a)
}else{a(this._currentItem)
}},_renderCurrentDisplayer:function(d){var a=this._skinParts.virtualContainer;
for(var c=0;
c<a.childNodes.length;
c++){a.childNodes[c].destroy()
}var b=this.injects().Components.createComponent("wysiwyg.viewer.components.MediaZoomDisplayer","wysiwyg.viewer.skins.displayers.MediaZoomDisplayerSkin",this._currentItem,{maxWidth:this._imageMaxWidth,maxHeight:this._imageMaxHeight},null,function(e){e.addEvent("sizeSet",this._transitionToCurrentDisplayer)
}.bind(this));
b.insertInto(this._skinParts.virtualContainer)
},_inTransition:false,_transitionToCurrentDisplayer:function(){if(this._inTransition){return
}this._inTransition=true;
var c=this._skinParts.virtualContainer.firstChild;
c.setStyle("opacity","0.0");
var b=this._skinParts.itemsContainer;
var e=this;
var a=function(){for(var h=0;
h<b.childNodes.length;
h++){b.childNodes[h].destroy()
}b.empty();
var g=c.getStyles("width","height");
var f=e._getTopGap(g.height.replace("px",""));
b.adopt(c);
var j=new Fx.Morph(e._skinParts.dialogBox,{duration:e.transitionTime,link:"chain"});
j.addEvent("complete",function(){var k=new Fx.Tween(c,{duration:e.transitionTime,link:"chain"});
k.addEvent("complete",function(){e.unlock();
e._inTransition=false;
e.injects().Utils.forceBrowserRepaint();
k.removeEvent("complete",arguments.callee)
});
k.start("opacity","1.0");
j.removeEvent("complete",arguments.callee)
});
j.start({width:g.width,"min-height":g.height,"margin-top":f+"px"});
if(d){d.removeEvent("complete",arguments.callee)
}};
if(b.hasChildNodes()){var d=new Fx.Tween(b.firstChild,{duration:e.transitionTime,link:"chain",property:"opacity"});
d.addEvent("complete",a);
d.start("0.0")
}else{a()
}},_getTopGap:function(b){var a=this.injects().Utils.getWindowSize();
var c=(a.height-b)/2;
return c>0?c:0
},_validateArgs:function(c,b){if(!c||!typeof(b)=="number"){return false
}var a=c.length;
if(c.length<1){return false
}if(b<0||b>=a){LOG.reportError(wixErrors.EDITOR_INDEX_OUT_OF_RANGE,"wysiwyg.viewer.components.MediaZoom","setGallery",b);
return false
}return true
},_setNextPrevVisibility:function(){this._skinParts.buttonNext.uncollapse();
this._skinParts.buttonPrev.uncollapse();
if(this.getDataItem().get("items").length<=1){this._skinParts.buttonNext.collapse();
this._skinParts.buttonPrev.collapse()
}},_getItemId:function(a){var b=typeof(a)=="string"?a:a.get("id");
return b.indexOf("#")==0?b.substr(1):b
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.MediaZoomDisplayer",imports:["mobile.core.components.traits.LinkableComponent"],skinParts:{title:{type:"htmlElement",optional:false},description:{type:"htmlElement",optional:false},link:{type:"htmlElement",optional:true},imageWrapper:{type:"htmlElement",command:"WViewerCommands.MediaZoom.Next"},image:{type:"mobile.core.components.Image",dataRefField:"*",optional:false,argObject:{unit:"px",cropMode:"full",align:"center",scaleMode:"width_height"}}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_setCorrectImageSize"],_minWidth:100,_maxWidth:-1,_maxHeight:-1,initialize:function(c,a,b){this.parent(c,a,b);
this._maxWidth=b.maxWidth;
this._maxHeight=b.maxHeight
},_tweetHookMethod:function(a){a.dataItem=this.injects().Data.createDataItem({defaultText:"",accountToFollow:"",type:"TwitterTweet"},"TwitterTweet");
return a
},_onAllSkinPartsReady:function(){this.parent();
if(this._skinParts.comments){this._minWidth=600
}var a=this.getSkin().getParams().first(function(b){return b.id==="imgPadding"
});
this._maxWidth=this._maxWidth-(a.defaultValue*2);
this._updateParts();
this._skinParts.image.addEvent("loading",this._setCorrectImageSize)
},getAcceptableDataTypes:function(){return["Image"]
},_updateParts:function(){if(this._skinParts){this._skinParts.title.set("text",this._data.get("title"));
this._skinParts.description.set("text",this._data.get("description"));
var b=this._data.get("linkType");
var c=this._data.get("href");
var d=false;
switch(b){case this.imports.LinkableComponent.linkType.PAGE:d=true;
break;
case this.imports.LinkableComponent.linkType.WEBSITE:break;
case this.imports.LinkableComponent.linkType.DOCUMENT:d=true;
break;
case this.imports.LinkableComponent.linkType.EMAIL:d=true;
break;
default:}var a=this._skinParts.link;
if(d||a&&!c){a.setStyle("display","none")
}else{if(c){a.set("href",c);
if(this.injects().Viewer.getPreviewMode()==true){a.set("target","_blank")
}else{a.set("target",this._data.get("target"))
}}}this._skinParts.image.setSize(this._getImageWidth(),this._getImageHeight())
}},_imgWrapperWidth:-1,_imgWrapperHeight:-1,_tmpFlag:false,_setCorrectImageSize:function(c){if(this._tmpFlag){return
}var b=this._getDisplayerWidth(Math.ceil(c.imgWidth));
var a=Math.ceil(c.imgHeight);
if(c.imgHeight<=this._maxHeight&&c.imgWidth<=this._maxWidth&&(this._imgWrapperHeight!=a||this._imgWrapperWidth!=b)){this._imgWrapperHeight=a;
this._imgWrapperWidth=b;
this._skinParts.image.setSize(c.imgWidth,c.imgHeight);
this._skinParts.imageWrapper.setStyles({width:this._imgWrapperWidth+"px",height:this._imgWrapperHeight+"px"});
this._skinParts.title.setStyles({"max-width":b,"word-wrap":"break-word"});
this._skinParts.description.setStyles({"max-width":b,"word-wrap":"break-word"});
this._tmpFlag=true;
this.fireEvent("sizeSet")
}},_getDisplayerWidth:function(a){if(a<this._minWidth){return this._minWidth
}return a
},_getImageWidth:function(){var a=this._data.get("width");
if(this._maxWidth<0||a<=this._maxWidth){return a
}return this._maxWidth
},_getImageHeight:function(){var a=this._data.get("height");
if(this._maxHeight<0||a<=this._maxHeight){return a
}return this._maxHeight
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.PageGroup",skinParts:{grid:{type:"htmlElement"}},propertiesSchemaName:"PageGroupProperties",imports:["wysiwyg.viewer.utils.TransitionUtils"],Class:{Extends:"mobile.core.components.Container",_states:["showGridLines"],Binds:["onCurrentPageResize","_setHorizontalGrid","_setVerticalGrid","toggleGrid","refreshGrid","_resizePage","_onTransitionFinished"],_transitionQueue:[],initialize:function(c,a,b){this.parent(c,a,b);
this.setMaxH(10000);
this._runAnimations=false;
this._transitionDurationMap={};
this._transitionDurationMap[Constants.TransitionTypes.NONE]=0;
this._transitionDurationMap[Constants.TransitionTypes.SWIPE_HORIZONTAL_FULLSCREEN]=1.1;
this._transitionDurationMap[Constants.TransitionTypes.SWIPE_VERTICAL_FULLSCREEN]=1.1;
this._transitionDurationMap[Constants.TransitionTypes.CROSS_FADE]=1.2;
this._transitionDurationMap[Constants.TransitionTypes.OUT_IN]=1.5
},getInlineContentContainer:function(){return this._skinParts.inlineContent
},editModeChange:function(a){if(a=="MASTER_PAGE"){}else{this._skinParts.overlay.collapse()
}},_onDataChanged:function(){var a=this.getComponentProperty("transition");
if(a=="slide"){this.setComponentProperty("transition",Constants.TransitionTypes.SWIPE_HORIZONTAL_FULLSCREEN,true)
}},_onAllSkinPartsReady:function(){this._transitionUtils=new this.imports.TransitionUtils();
this._Tween=this.injects().Utils.Tween;
this._skinParts.overlay.collapse();
this._view.setStyles({"-webkit-transform":"translateZ(0)"});
this.parent()
},gotoPage:function(b){var a=document.getElementById(b);
a.getLogic().setWidth(this.getWidth());
this._setVisiblePageCallId=W.Utils.callLater(function(){a.getLogic().wixifyContent(function(){this.actualGotoPage(a)
}.bind(this))
}.bind(this))
},actualGotoPage:function(a){this._transitionQueue.push(a);
if(this._transitionQueue.length==1){this._executeTransition(this._transitionQueue[0])
}},_onTransitionFinished:function(){this._currentPage.getLogic().addEvent("resize",this.onCurrentPageResize);
this._transitionQueue.shift();
if(this._transitionQueue.length>0){var a=this._transitionQueue.pop();
this._transitionQueue=[a];
this._executeTransition(this._transitionQueue[0])
}else{var b=this._currentPage.getLogic()._data.get("id");
this._view.fireEvent("pageTransitionEnded",b);
W.Viewer.fireEvent("pageTransitionEnded",b);
this._resizePage()
}},_executeTransition:function(a){this._view.fireEvent("pageTransitionStarted");
W.Viewer.fireEvent("pageTransitionStarted");
a.setStyle("opacity","0.0");
a.getLogic().uncollapse();
if(a.getLogic().isContentReady()===true){this._executeTransitionPageReady(a)
}else{a.getLogic().addEvent("pageContentReady",function(){a.getLogic().removeEvent("pageContentReady",arguments.callee);
this._executeTransitionPageReady(a)
}.bind(this))
}},_executeTransitionPageReady:function(c){var g=this.getComponentProperty("transition");
var e=this._transitionDurationMap[g]||0;
var d=(g==Constants.TransitionTypes.SWIPE_VERTICAL_FULLSCREEN)?1:0;
var b=c.getLogic().getHeight();
c.setStyles({opacity:"1.0"});
if(this._currentPage&&!this._currentPage.getLogic().getIsDisposed()){this._currentPage.getLogic().removeEvent("resize",this.onCurrentPageResize);
var f=this._currentPage.getLogic().getHeight();
if(e>0){this._Tween.execute(f,b,e,{onUpdate:this._resizePage,ease:"strong_easeInOut"})
}else{this._resizePage(b)
}var a=this._transitionUtils.getTransition(g);
a(this._currentPage,c,d,e,function(){this._currentPage.getLogic().collapse();
this._currentPage=c;
this._onTransitionFinished()
}.bind(this))
}else{this._currentPage=c;
this._resizePage(b);
this._onTransitionFinished()
}},onCurrentPageResize:function(a){this._resizePage()
},_resizePage:function(a){if(!a){a=this._currentPage.getLogic().getHeight()
}this.setHeight(a);
W.Layout.enforceAnchors([this]);
this.refreshGrid()
},useLayoutOnDrag:function(){return true
},isSelectable:function(){return false
},isContainer:function(){return false
},getAcceptableDataTypes:function(){return[""]
},isAnchorable:function(){return{to:{allow:true,lock:W.BaseComponent.AnchorLock.BY_THRESHOLD},from:{allow:true,lock:W.BaseComponent.AnchorLock.ALWAYS}}
},isDeleteable:function(){return false
},toggleGrid:function(){this._setVerticalGrid();
this._setHorizontalGrid();
var b="showGridLines";
var a=this.getState()==b;
a?this.removeState(b):this.setState(b)
},refreshGrid:function(){if(this.getState()=="showGridLines"){this._setVerticalGrid();
this._setHorizontalGrid()
}},_setHorizontalGrid:function(){var c=window.getSize().x;
var a=this._view.getSize().x;
var b=c-a;
var d=(b/2)*-1;
this._skinParts.gridHeader.setStyle("width",c);
this._skinParts.gridFooter.setStyle("width",c);
this._skinParts.gridHeader.setStyle("left",d);
this._skinParts.gridFooter.setStyle("left",d)
},_setVerticalGrid:function(){var c=this._view.getPosition().y;
var d=window.getSize().y;
var b=c*-1;
var a=parseInt(document.id("SITE_STRUCTURE").getStyle("height"));
this._skinParts.gridBodyRight.setStyle("height",a);
this._skinParts.gridBodyLeft.setStyle("height",a);
this._skinParts.gridBodyRight.setStyle("top",b);
this._skinParts.gridBodyLeft.setStyle("top",b)
},getMinPhysicalHeight:function(){return this._currentPage.getLogic().getHeight()
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.PagesContainer",skinParts:{inlineContent:{type:"htmlElement"},screenWidthBackground:{type:"htmlElement"},bg:{type:"htmlElement"},centeredContent:{type:"htmlElement"}},Class:{Extends:"wysiwyg.viewer.components.ScreenWidthContainer",initialize:function(c,a,b){this.parent(c,a,b);
this.setMaxH(10000);
this._resizableSides=[]
},useLayoutOnDrag:function(){return true
},useLayoutOnResize:function(){return true
},isMultiSelectable:function(){return false
},getSelectableX:function(){return this.getX()
},getSelectableWidth:function(){return this.getWidth()
},isAnchorable:function(){return{to:{allow:true,allowBottomBottom:false,lock:W.BaseComponent.AnchorLock.BY_THRESHOLD},from:{allow:true,lock:W.BaseComponent.AnchorLock.ALWAYS}}
},canMoveToOtherScope:function(){return false
},isContainer:function(){return false
},layoutMinHeight:function(){return this.injects().Viewer.getCurrentPageNode().getLogic().getHeight()
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.ScreenWidthArea",skinParts:{inlineContent:{type:"htmlElement"},background:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",getInlineContentContainer:function(){if(this._skinParts.inlineContent){return this._skinParts.inlineContent
}return this._view
},getLayoutMode:function(){return"BACKGROUND_STRIP"
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.ScreenWidthContainer",skinParts:{inlineContent:{type:"htmlElement"},screenWidthBackground:{type:"htmlElement"},bg:{type:"htmlElement"},centeredContent:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.Container",Binds:["_onScreenResize","_stretchBackgroundAndCenterContent"],initialize:function(c,a,b){this._pendingSizeUpdates={};
this.parent(c,a,b);
this._resizableSides=[W.BaseComponent.ResizeSides.TOP,W.BaseComponent.ResizeSides.BOTTOM];
this._moveDirections=[W.BaseComponent.MoveDirections.VERTICAL]
},_onScreenResize:function(){if(this.getIsDisplayed()){this._stretchBackgroundAndCenterContent()
}},_onResize:function(){},_stretchBackgroundAndCenterContent:function(){var b=this._view;
var e=$(document).getSize();
var c=b.getSize();
var d=this.injects().Viewer.getDocWidth();
var a=b.getParent("[comp=mobile.core.components.Page]");
if(a){}var f=-(e.x-d)/2;
this._skinParts.screenWidthBackground.setStyles({position:"absolute",width:e.x+"px",height:c.y+"px",left:f})
},render:function(){this.injects().Viewer.addEvent(this.injects().Viewer.SCREEN_RESIZE_EVENT,this._onScreenResize);
this._stretchBackgroundAndCenterContent()
},dispose:function(){this.parent();
this.injects().Viewer.removeEvent(this.injects().Viewer.SCREEN_RESIZE_EVENT,this._onScreenResize)
},_onAllSkinPartsReady:function(){this._applyPendingSizeUpdates(true)
},_applyPendingSizeUpdates:function(a){if(this._pendingSizeUpdates.width!=null){this.setWidth(this._pendingSizeUpdates.width);
this._pendingSizeUpdates.width=null
}else{if(a){this.setWidth(this.getWidth(),true)
}}if(this._pendingSizeUpdates.height!=null){this.setHeight(this._pendingSizeUpdates.height);
this._pendingSizeUpdates.height=null
}else{if(a){this.setHeight(this.getHeight(),true)
}}},setX:function(){},getX:function(){return 0
},setHeight:function(b,a,c){this.parent(b,a,c);
if(this._skinParts){this._view.setStyle("min-height",b+"px");
this._stretchBackgroundAndCenterContent();
this.flushPhysicalHeightCache();
this._onResize()
}else{this._pendingSizeUpdates.height=b
}},setWidth:function(d,c,e){this.parent(d,c,e);
if(this._skinParts){var b=this.injects().Viewer.getDocWidth();
var a=d+"px";
var f=((b-d)/2)+"px";
this._skinParts.centeredContent.setStyles({width:a,"margin-left":f})
}else{this._pendingSizeUpdates.width=d
}},getSelectableX:function(){var a=$(document).getSize().x;
return this.getX()-(a-this.getWidth())/2
},getSelectableWidth:function(){var a=$(document).getSize().x;
return a
},isContainable:function(a){return instanceOf(a,this.constructor)
},onDraggedToStage:function(){var a=this.injects().Viewer.getDocWidth();
this.setWidth(a);
this._onAutoSized()
},_getEditBoxReferenceNode:function(){return this._skinParts.inlineContent
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.SiteButton",skinParts:{label:{type:"htmlElement"},link:{type:"htmlElement"}},propertiesSchemaName:"ButtonProperties",traits:["mobile.core.components.traits.LinkableComponent"],Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["up","over","selected","pressed"],_triggers:["click"],Binds:["_onClick","_onOver","_onOut","_onMouseDown","_onMouseUp"],_canFocus:true,initialize:function(c,b,a){this.parent(c,b,a);
this._userSelectedWidth=0;
this._resizeTriggeredByData=false
},_onClick:function(b){if(this.isEnabled()){b.target=this.getViewNode();
this.fireEvent(Constants.CoreEvents.CLICK,b);
if(this._toggleMode){var a=(this.getState()!="selected")?"selected":"over";
this.setState(a)
}}},_onOver:function(a){if(this.isEnabled()&&this.getState()!="selected"){this.fireEvent("over",a);
this.setState("over")
}},_onOut:function(a){if(this.isEnabled()&&this.getState()!="selected"){this.fireEvent("up",a);
this.setState("up")
}},_onMouseDown:function(){if(this.isEnabled()&&this.getState()!="selected"){this.setState("pressed")
}},_onMouseUp:function(){this.removeState("pressed")
},_onEnabled:function(){var a=this._skinParts.view;
a.addEvent(Constants.CoreEvents.CLICK,this._onClick);
a.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onOver);
a.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onOut);
a.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
a.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp)
},_onDisabled:function(){var a=this._skinParts.view;
a.removeEvent(Constants.CoreEvents.CLICK,this._onClick);
a.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._onOver);
a.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onOut);
a.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
a.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp)
},render:function(){var a=this._data.get("label");
this._skinParts.label.set("text",a);
if(!this._userSelectedWidth&&!a){this._userSelectedWidth=parseInt(this._view.getStyle("width"),10)
}this._updateMinimumWidth();
this._updateWidthFromText();
this._updateMinimumHeight();
this._setLineHeight();
this._setTextAlignment();
this._wCheckForSizeChangeAndFireAutoSized(0)
},_skinParamsChange:function(){this.injects().Utils.callLater(function(){this._renderIfReady()
}.bind(this),[],this,0);
this.parent()
},setHeight:function(c,b,a){this.parent(c,b,a);
this._setLineHeight()
},_setLineHeight:function(){if(this.isReady()){var a=parseInt(this._view.getStyle("padding-top"));
var c=parseInt(this._view.getStyle("padding-bottom"));
var b=this.getHeight()-a-c;
this._skinParts.label.setStyle("line-height",b+"px")
}},_setTextAlignment:function(){var a=this.getComponentProperty("align");
this._skinParts.link.setStyle("text-align",a);
this._setTextMargin()
},_setTextMargin:function(){var c=this.getComponentProperty("margin");
var d=this.getComponentProperty("align");
var a=parseInt(this._skinParts.label.offsetWidth);
var b=this.getWidth();
if(a+c>b){c=b-a
}if(d=="left"){this._skinParts.label.setStyle("margin-right","");
this._skinParts.label.setStyle("margin-left",c+"px")
}else{if(d=="right"){this._skinParts.label.setStyle("margin-left","");
this._skinParts.label.setStyle("margin-right",c+"px")
}else{this._skinParts.label.setStyle("margin-left","");
this._skinParts.label.setStyle("margin-right","")
}}},_setMinimumWidthAccordingToText:function(){var a=parseInt(this._skinParts.label.offsetWidth);
var c=parseInt(this._view.getStyle("padding-left"));
var b=parseInt(this._view.getStyle("padding-right"));
this.setMinW(a+c+b)
},_setMinimumHeightAccordingToText:function(){var a=parseInt(this._view.getStyle("padding-top"));
var b=parseInt(this._view.getStyle("padding-bottom"));
this._skinParts.label.setStyle("line-height","");
this.setMinH(this._skinParts.label.offsetHeight+a+b)
},_updateMinimumHeight:function(){this._setMinimumHeightAccordingToText();
this.setHeight(this.getHeight(),false,false)
},_updateMinimumWidth:function(){this._setMinimumWidthAccordingToText();
this.setWidth(this.getWidth(),false,false)
},_updateWidthFromText:function(){this._userSelectedWidth=this._userSelectedWidth==0?this.getWidth():this._userSelectedWidth;
var a=Math.max(this.getSizeLimits().minW,this._userSelectedWidth);
this.setWidth(a,false,false)
},_onResize:function(){this.parent();
if(this._resizeTriggeredByData==false){this._userSelectedWidth=parseInt(this._view.getStyle("width"))
}else{this._resizeTriggeredByData=false
}if(!this.isReady()){return 0
}this._setTextMargin()
},_onDataChange:function(a,c,b){this._resizeTriggeredByData=true;
this.parent(a,c,b)
},getAcceptableDataTypes:function(){return["SiteButton"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.SlideShowGallery",traits:["wysiwyg.viewer.components.traits.GalleryAutoplay"],skinParts:{imageItem:{type:"wysiwyg.viewer.components.Displayer",repeater:true,container:"virtualContainer",dataRefField:"items",argObject:{unit:"px"}},virtualContainer:{type:"htmlElement",optional:true},itemsContainer:{type:"htmlElement"},buttonPrev:{type:"htmlElement"},buttonNext:{type:"htmlElement"},counter:{type:"htmlElement"},autoplay:{type:"htmlElement"}},propertiesSchemaName:"SlideShowGalleryProperties",imports:["wysiwyg.viewer.utils.TransitionUtils"],traits:["mobile.core.components.traits.TouchRollOverSupport","wysiwyg.viewer.components.traits.GalleryAutoplay"],Class:{Extends:"mobile.core.components.BaseRepeater",Binds:["gotoNext","gotoPrev"],_states:{},_currentItemIndex:0,_currentItemRef:"",_prevItemIndex:-1,_numItems:-1,_itemHolder:null,_currentDisplayer:null,_locked:false,_lastCommand:"",_transitionUtils:null,_displayedImages:[],_imageMode:"",_widthDiff:0,_heightDiff:0,_galleryItems:[],_expandEnabled:true,initialize:function(c,a,b){this.parent(c,a,b);
this._Tween=this.injects().Utils.Tween
},_onDataChange:function(a,b){this._numItems=this._data.get("items").length;
this._imageMode=String(this.getComponentProperty("imageMode"));
this._expandEnabled=(this.getComponentProperty("expandEnabled")===true);
if(this._imageMode=="flexibleHeight"){this._resizableSides=[W.BaseComponent.ResizeSides.LEFT,W.BaseComponent.ResizeSides.RIGHT]
}else{this._resizableSides=[W.BaseComponent.ResizeSides.TOP,W.BaseComponent.ResizeSides.LEFT,W.BaseComponent.ResizeSides.BOTTOM,W.BaseComponent.ResizeSides.RIGHT]
}this._checkSkinPartsVisibility();
this.parent()
},_checkSkinPartsVisibility:function(){if(this._skinParts){this._skinParts.buttonPrev.setStyle("visibility",this.getComponentProperty("showNavigation")?"visible":"hidden");
this._skinParts.buttonNext.setStyle("visibility",this.getComponentProperty("showNavigation")?"visible":"hidden");
this._skinParts.counter.setStyle("visibility",this.getComponentProperty("showCounter")?"visible":"hidden")
}},_processDataRefs:function(c){var b=[];
if(c.length>0){b=[c[this._currentItemIndex]];
var a;
this._currentItemRef=c[this._currentItemIndex];
if(c.length>2){a=this._normalizeIndex(this._currentItemIndex+1);
if(this._prevItemIndex!=a){b.push(c[a])
}else{b.push(c[this._normalizeIndex(this._currentItemIndex+2)])
}a=this._normalizeIndex(this._currentItemIndex-1);
if(this._prevItemIndex!=a){b.push(c[a])
}else{b.push(c[this._normalizeIndex(this._currentItemIndex-2)])
}}}else{this._itemHolder.empty()
}return b
},_onAllSkinPartsReady:function(){this._view.setStyle("overflow","hidden");
this._itemHolder=new Element("div");
this._itemHolder.setStyles({position:"absolute",width:"100%",height:"100%","-webkit-transform":"translateZ(0)"});
this._skinParts.itemsContainer.appendChild(this._itemHolder);
this._skinParts.buttonPrev.addEvent(Constants.CoreEvents.MOUSE_DOWN,this.gotoPrev);
this._skinParts.buttonNext.addEvent(Constants.CoreEvents.MOUSE_DOWN,this.gotoNext);
this._transitionUtils=new this.imports.TransitionUtils();
if(!this._skinParts.virtualContainer){this._skinParts.virtualContainer=new Element("div");
this._view.grab(this._skinParts.virtualContainer,"top");
this._skinParts.virtualContainer.setStyles({visibility:"hidden",display:"block",width:"1px",height:"1px",overflow:"hidden"})
}this._widthDiff=this._skin.widthDiff||0;
this._heightDiff=this._skin.heightDiff||0;
var b={cursor:"pointer"};
var a=this.injects().Utils.getCSSBrowserFeature("user-select");
if(a){b[a]="none"
}this._skinParts.buttonPrev.setStyles(b);
this._skinParts.buttonNext.setStyles(b);
this._checkSkinPartsVisibility()
},getAcceptableDataTypes:function(){return["ImageList"]
},_onRepeaterItemReady:function(d,c,a,b){c.getViewNode().setStyles({position:"relative"})
},_onRepeaterReady:function(a){this._galleryItems=a.readyItems
},render:function(){var a;
for(var b=0;
b<this._galleryItems.length;
b++){a=this._galleryItems[b].getLogic();
a.invalidateSize();
this._setupDisplayer(a);
if(this._currentItemRef=="#"+a.getDataItem().get("id")){this._insertNewDisplayer(a)
}else{a.getViewNode().setStyle("visibility","hidden")
}}this._skinParts.counter.set("text",String(this._currentItemIndex+1)+"/"+String(this._numItems));
this._prevItemIndex=this._currentItemIndex
},_setupDisplayer:function(a){a.setOwner(this);
a.setSize(this.getWidth()-this._widthDiff,this.getHeight()-this._heightDiff,this._imageMode)
},_insertNewDisplayer:function(b){var a=this._itemHolder;
var e=this._currentDisplayer;
var d=b.getViewNode();
var f=parseFloat(this.getComponentProperty("transDuration"));
this._currentDisplayer=b;
a.setStyles({"-webkit-transform":"translateZ(0)"});
a.adopt(b.getViewNode());
d.setStyles({position:"absolute",top:"0px",left:"0px",visibility:"visible"});
b.setSize(this.getWidth()-this._widthDiff,this.getHeight()-this._heightDiff,this._imageMode);
if(this._imageMode=="flexibleHeight"){this._adjustFlexibleHeight(this._currentDisplayer,f)
}var c=this._currentDisplayer.getImageRef();
if(c&&this._displayedImages.indexOf(c)==-1){this._displayedImages.push(c)
}if(a.children.length>1){b.setState("transIn");
if(e){e.setState("transOut")
}this._locked=true;
this._transitionUtils.getTransition(String(this.getComponentProperty("transition")))(a.children[0],a.children[1],this._getTransitionDirection(),f,function(){if(a.children.length>1){a.children[1].setStyle("position","static");
a.removeChild(a.children[0])
}this._locked=false;
if(e){e.setState("normal")
}b.setState("noTransition");
this.fireEvent("transitionFinished")
}.bind(this))
}},_adjustFlexibleHeight:function(b,c){var a=b.getHeight()+this._heightDiff;
this._Tween.to(this._view,c,{height:a,onUpdate:function(d){this.setHeight(parseInt(d));
this.fireEvent("autoSized")
}.bind(this)})
},_getTransitionDirection:function(){var d=this.getComponentProperty("bidirectional")===true;
var c=this.getComponentProperty("reverse")===true;
var a={next:0,prev:1};
var b=0;
if(d){b=a[this._lastCommand]||0;
if(c){b=(b==1)?0:1
}}return b
},_onResize:function(){var a;
this.parent();
if(this._currentDisplayer){this._currentDisplayer.setSize(this.getWidth()-this._widthDiff,this.getHeight()-this._heightDiff,this._imageMode);
if(this._imageMode=="flexibleHeight"){window.requestAnimFrame(function(){a=this._currentDisplayer.getHeight()+this._heightDiff;
this._view.setStyle("height",String(a)+"px");
this.setHeight(a);
this.fireEvent("autoSized")
}.bind(this))
}else{a=this.getHeight();
this._view.setStyle("height",String(a)+"px");
this.setHeight(a)
}}},gotoPrev:function(){if(!this._locked&&this._galleryItems.length>0){this._lastCommand="prev";
this._currentItemIndex=this._getPrevItemIndex();
this._allRepeatersReady=false;
this._renderIfReady()
}},gotoNext:function(){if(!this._locked&&this._galleryItems.length>0){this._lastCommand="next";
this._currentItemIndex=this._getNextItemIndex();
this._allRepeatersReady=false;
this._renderIfReady()
}},_getNextItemIndex:function(){return this._normalizeIndex(this._currentItemIndex+1)
},_getPrevItemIndex:function(){return this._normalizeIndex(this._currentItemIndex-1)
},_normalizeIndex:function(a){return((a%this._numItems)+this._numItems)%this._numItems
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.SliderGallery",skinParts:{imageItem:{type:"wysiwyg.viewer.components.Displayer",repeater:true,container:"itemsContainer",dataRefField:"items"},itemsContainer:{type:"htmlElement"},swipeLeftHitArea:{type:"htmlElement"},swipeRightHitArea:{type:"htmlElement"}},propertiesSchemaName:"SliderGalleryProperties",traits:["mobile.core.components.traits.SwipeSupport"],Class:{Extends:"mobile.core.components.BaseRepeater",Binds:["_moveToRight","_moveToLeft","_updateMovementNoLoop","_updateMovementInLoop","_stopMovement"],_states:{},_itemHolder:null,_itemWidth:0,_itemHeight:0,_gap:20,_movementSpeed:0,_shiftOffset:0,_shiftOffsetMax:0,_shiftOffsetMin:0,_maxSpeed:0.05,_aspectRatio:0,_movementActive:false,_debugMode:false,_imageMode:"",_lastUpdate:NaN,_updateMovementFunc:null,_loop:false,_itemsHolderSize:0,_contentOverflow:false,_segment:0,initialize:function(c,a,b){this.parent(c,a,b);
this.addEvent("resizeEnd",this._onResizeEnd)
},_onResizeEnd:function(){this._recalcItemSize();
this._allRepeatersReady=false;
this._renderIfReady()
},_recalcItemSize:function(){if(this._skinParts){this._itemHeight=Math.floor(this._skinParts.itemsContainer.getHeight());
this._itemWidth=Math.floor(this._itemHeight*this._aspectRatio)
}},_processDataRefs:function(a){if(this._loop===true){return a.concat(a)
}else{return a
}},_onDataChange:function(a){this._enableMovement(false);
this._aspectRatio=this._parseAspectRatioPreset(this.getComponentProperty("aspectRatioPreset"));
if(this._aspectRatio){this.setComponentProperty("aspectRatio",this._aspectRatio,true)
}else{this._aspectRatio=parseFloat(this.getComponentProperty("aspectRatio"))
}this._loop=this.getComponentProperty("loop")===true;
this._maxSpeed=parseInt(this.getComponentProperty("maxSpeed"));
this._imageMode=String(this.getComponentProperty("imageMode"));
this._gap=parseInt(this.getComponentProperty("margin"));
this.parent()
},_parseAspectRatioPreset:function(c){var a=c.split(":");
var b=0;
if(a.length==2){b=parseFloat(a[0])/parseFloat(a[1])
}return b
},_onAllSkinPartsReady:function(){this._itemHolder=this._skinParts.itemsContainer;
this._itemHolder.setStyles({position:"absolute",left:"0px",right:"0px",top:"0px",bottom:"0px","white-space":"nowrap","-webkit-transform":"translateZ(0)"});
this._skinParts.itemsContainer.setStyles({overflow:(this._debugMode)?"visible":"hidden",border:(this._debugMode)?"1px solid black":"0"});
this._skinParts.swipeLeftHitArea.addEvent(Constants.CoreEvents.MOUSE_MOVE,this._moveToLeft);
this._skinParts.swipeRightHitArea.addEvent(Constants.CoreEvents.MOUSE_MOVE,this._moveToRight);
this._skinParts.swipeLeftHitArea.addEvent(Constants.CoreEvents.MOUSE_OUT,this._stopMovement);
this._skinParts.swipeRightHitArea.addEvent(Constants.CoreEvents.MOUSE_OUT,this._stopMovement)
},getAcceptableDataTypes:function(){return["ImageList"]
},render:function(){var a;
this._recalcItemSize();
this._updateMovementFunc=(this._loop===true)?this._updateMovementInLoop:this._updateMovementNoLoop;
if(this._loop===false){this._segment=0
}this._shiftOffset=0;
this._itemsHolderSize=0;
for(a=0;
a<this._itemHolder.children.length;
a++){this._setupDisplayer(this._itemHolder.children[a].getLogic());
this._itemsHolderSize+=this._itemHolder.children[a].getLogic().getWidth()+this._gap
}this._checkItemsVisibility();
this._applyShiftOffset()
},_checkItemsVisibility:function(){var b=this._itemHolder.children.length/2;
var a=(this._loop===true?this._itemsHolderSize/2:this._itemsHolderSize);
this._contentOverflow=(a>this._skinParts.itemsContainer.getWidth());
if(this._loop===true&&this._contentOverflow===false){this._segment=0
}for(i=0;
i<this._itemHolder.children.length;
i++){if(this._loop===true&&this._contentOverflow===false&&i>=b){this._itemHolder.children[i].setStyle("opacity","0.0")
}else{this._itemHolder.children[i].setStyle("opacity","1.0")
}}},_setupDisplayer:function(a){a.invalidateSize();
a.setSize(this._itemWidth,this._itemHeight,this._imageMode);
a.setOwner(this);
a.getViewNode().setStyles({position:"static",display:"inline-block","vertical-align":"top","margin-right":String(this._gap)+"px","margin-left":"0px",opacity:"1.0"})
},_moveToRight:function(){if(this._contentOverflow){this._setMovementSpeed(this._maxSpeed);
this._enableMovement(true)
}},_moveToLeft:function(){if(this._contentOverflow){this._setMovementSpeed(-this._maxSpeed);
this._enableMovement(true)
}},_enableMovement:function(a){if(a===true&&this._movementActive===false){window.requestAnimFrame(this._updateMovementFunc)
}if(a===true){if(!this._movementActive){this._shiftOffsetMin=-(this._itemsHolderSize-this._skinParts.itemsContainer.getWidth()-this._gap);
this._movementActive=true
}}else{this._movementActive=false;
this._movementSpeed=0
}},_stopMovement:function(){var a=this.injects().Utils.Tween;
a.to(this,1,{_movementSpeed:0,onComplete:function(){this._enableMovement(false)
}.bind(this)})
},_setMovementSpeed:function(a){var b=this.injects().Utils.Tween;
b.to(this,1,{_movementSpeed:a})
},_calcMovementCoeficient:function(){var b=1;
var a=new Date().getTime();
if(!isNaN(this._lastUpdate)){b=((a-this._lastUpdate)/16)
}this._lastUpdate=a;
return b
},_updateMovementNoLoop:function(){var a=this._calcMovementCoeficient();
if(this._movementActive){this._shiftOffset+=-this._movementSpeed*a;
if(this._shiftOffset>this._shiftOffsetMax){this._shiftOffset=this._shiftOffsetMax;
this._enableMovement(false)
}if(this._shiftOffset<this._shiftOffsetMin){this._shiftOffset=this._shiftOffsetMin;
this._enableMovement(false)
}this._applyShiftOffset()
}if(this._movementActive){window.requestAnimFrame(this._updateMovementFunc)
}},_updateMovementInLoop:function(){var a=this._calcMovementCoeficient();
if(this._movementActive){this._shiftOffset+=-this._movementSpeed*a;
if(this._movementSpeed<0){this._segment=0;
if(this._shiftOffset>(this._shiftOffsetMax)){this._shiftOffset-=this._itemsHolderSize/2
}}if(this._movementSpeed>0){this._segment=1;
if(this._shiftOffset<0){this._shiftOffset+=this._itemsHolderSize/2
}}this._applyShiftOffset()
}if(this._movementActive){window.requestAnimFrame(this._updateMovementFunc)
}},_applyShiftOffset:function(){var a=this._shiftOffset-(this._segment*this._itemsHolderSize/2);
if(this._itemHolder.children.length>0){this._itemHolder.children[0].setStyle("margin-left",String(Math.floor(a))+"px")
}}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.SocialBaseComponent",skinParts:{iFrameHolder:{type:"htmlElement"}},Class:{Extends:"wysiwyg.viewer.components.IFrameComponent",Binds:["_createClickOverlay","_getUrl"],initialize:function(c,a,b){this.parent(c,a);
this._resizableSides=[];
if(b&&b.propObj){for(var d in b.propObj){var e=b.propObj[d];
this.setComponentProperty(d,e)
}}this._iframeCallback=0
},render:function(){this._createClickOverlay();
this._renderComponent()
},_renderComponent:function(){this._renderIframe(false);
if(this._getSizeAccordingToProperties){var a=this._getSizeAccordingToProperties();
this._changeSize(a)
}},_getSizeAccordingToProperties:function(){return{w:225,h:55}
},_getUrl:function(){var b=this.injects().Config.getPack("VIEWER_PARAMS").scriptsRoot+"/html/external/";
var a=this._getUrlParams();
return b+this._getPageName()+"?"+Object.toQueryString(a)
},_getPageName:function(){},_getUrlParams:function(){return{}
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.SoundCloudWidget",Class:{Extends:"wysiwyg.viewer.components.IFrameComponent",Binds:["_stopPlayback","_getSoundCloudUrl"],_states:["hasContent","noContent"],_renderTriggers:[Constants.DisplayEvents.DISPLAY_CHANGED],initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this._urlExists=false;
this._view.addEvent(Constants.DisplayEvents.COLLAPSED,this._stopPlayback);
this.setMinW(250)
},_stopPlayback:function(){this._iframe.set("src","about:blank")
},_updateIFrameSize:function(){var a;
a=this._iframe;
if(a){a.set({width:this._view.getWidth()-1,height:this._view.getHeight()-1})
}},_getUrl:function(){var a=this._getSoundCloudUrl();
if(a!=undefined&&a!=""){var b=this.injects().Config.getPack("VIEWER_PARAMS").scriptsRoot+"/html/external/soundcloud.html";
a=b+"?src="+encodeURIComponent(a)
}return a
},_getSoundCloudUrl:function(){var a=this._data.get("url");
this._urlExists=false;
if(a!=undefined&&a!=""){a=this.injects().Utils.setUrlParam(a,"show_artwork",this._isDataTrue("showArtWork"));
var b=this._isDataTrue("autoPlay");
if(this.injects().Viewer.getPreviewMode()&&this._editorMode!="PREVIEW"){b=false
}a=this.injects().Utils.setUrlParam(a,"auto_play",b);
this._urlExists=true
}return a||""
},_isDataTrue:function(b){var a=false;
if(this._data.get(b)===true||this._data.get(b)==="true"){a=true
}return a
},_setIframeParams:function(){this._iframe["class"]="html5player";
this._iframe.setStyles({position:"absolute"});
if(this._urlExists===false){this.setState("noContent")
}else{this.setState("hasContent")
}this._updateIFrameSize()
},_editModeChanged:function(b,a){if(b=="PREVIEW"||a=="PREVIEW"){this._updateIframe(true)
}},setHeight:function(b,a,c){b=Math.max(b,50);
this._view.setStyle("height",parseInt(b)+"px");
this.parent(b,a,c)
},setWidth:function(b,a,c){b=Math.max(b,200);
this._view.setStyle("width",parseInt(b)+"px");
this.parent(b,a,c)
},getAcceptableDataTypes:function(){return["SoundCloudWidget"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.TwitterFeed",skinParts:{feedHolder:{type:"htmlElement"}},propertiesSchemaName:"TwitterFeedProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_renderFeed","_applyThemeColors","_onResizeEnd","_sizeChangeRender"],initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this.addEvent("resizeEnd",this._onResizeEnd)
},render:function(){this._renderFeed(true)
},_onStyleReady:function(){this.parent();
this._style.addEvent(Constants.StyleEvents.PROPERTY_CHANGED,this._applyThemeColors)
},_applyThemeColors:function(b){var a=["bg","txt1","bg2","txt2","linkColor"];
for(var c in b.properties){if(a.indexOf(c)>-1){this._renderIfReady();
return
}}},_renderFeed:function(n){if(!this.isReady()){return
}if(!this._scriptLoaded){this._loadTwitterScript();
return
}var k=this._getFeedHolderId();
var m=this._data.get("accountToFollow")||"wix";
var d=this.getComponentProperty("numOfTweets")||1;
var c=this._view.getWidth();
var o=this._view.getHeight()-90;
var f=this.injects().Skins;
var e=this._skin.className;
var a=f.getSkinParamValue(e,"bg",this._style).getHex(false);
var b=f.getSkinParamValue(e,"txt1",this._style).getHex(false);
var h=f.getSkinParamValue(e,"bg2",this._style).getHex(false);
var g=f.getSkinParamValue(e,"txt2",this._style).getHex(false);
var j=f.getSkinParamValue(e,"linkColor",this._style).getHex(false);
var l={id:k,version:2,type:"profile",height:o,width:c,rpp:d,interval:30000,features:{scrollbar:true,loop:false,live:false,behavior:"all"},theme:{shell:{background:a,color:b},tweets:{background:h,color:g,links:j}}};
if(window.TWTR&&window.TWTR.Widget){this._elWidgeto=new window.TWTR.Widget(l).render().setUser(m);
if(n){this._elWidgeto.start()
}}},_getFeedHolderId:function(){var a=this._skinParts.feedHolder.getProperty("id");
if(!a){a=this.injects().Utils.getUniqueId("feedHolder");
this._skinParts.feedHolder.setProperty("id",a)
}return a
},_loadTwitterScript:function(){this.injects().Viewer.loadExternalScript("//widgets.twimg.com/j/2/widget.js",function(){this._scriptLoaded=true;
this._renderFeed(true)
}.bind(this))
},setHeight:function(b,a,c){b=Math.max(220,b);
this._view.setStyle("height",parseInt(b+"px"));
this.parent(b,true,false);
this._sizeChangeRender()
},setWidth:function(b,a,c){b=Math.max(220,b);
this._view.setStyle("width",parseInt(b)+"px");
this.parent(b,true,false);
this._sizeChangeRender()
},_sizeChangeRender:function(){if(!this.resizeInAction){this._renderFeed(false);
this._onResizeEnd()
}},_onResize:function(){this.resizeInAction=true;
this.parent();
this._renderFeed(false)
},_onResizeEnd:function(){this.resizeInAction=false;
if(this._elWidgeto){this._elWidgeto.start()
}},dispose:function(){if(this._elWidgeto){this._elWidgeto.destroy()
}return this.parent()
},getAcceptableDataTypes:function(){return["TwitterFollow"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.VerticalLine",skinParts:{},Class:{Extends:"mobile.core.components.base.BaseComponent",_renderTriggers:[Constants.DisplayEvents.SKIN_CHANGE],Binds:["render"],initialize:function(c,a,b){this.parent(c,a,b);
this.injects().Theme.setProperty("WEB_THEME_DIRECTORY","viewer");
this._resizableSides=[W.BaseComponent.ResizeSides.TOP,W.BaseComponent.ResizeSides.BOTTOM]
},render:function(){this.setWidth(this.getViewNode().getSize().x)
},setHeight:function(c,b,d){var a=this._getNumberOfKnobs();
this.height=c;
this.parent(c,b,d)
},_getNumberOfKnobs:function(){var a=0;
if(this._skinParts){if(this._skinParts.bottomKnob){a++
}if(this._skinParts.topKnob){a++
}if(this._skinParts.middleKnob){a++
}}return a
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.VerticalMenu",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],skinParts:{repeaterButton:{type:"mobile.core.components.MenuButton",repeater:true,dataRefField:"pages",container:"itemsContainer",hookMethod:"_changePagesRefData",argObject:{listSubType:"PAGES"}},moreButton:{type:"mobile.core.components.MenuButton"},itemsContainer:{type:"htmlElement"},moreContainer:{type:"htmlElement"}},propertiesSchemaName:"HorizontalMenuProperties",Class:{Extends:"mobile.core.components.BaseRepeater",Binds:["_onMoreButtonClick","_onThemeChange","_arrangeButtons","_onButtonClick","_onMoreButtonOver","_onMoreButtonOut","_onMoreContainerOver","_onMoreContainerOut","_closeMoreMenu","_onPageChanged"],_renderTriggers:[Constants.DisplayEvents.ADDED_TO_DOM,Constants.DisplayEvents.DISPLAYED,Constants.DisplayEvents.SKIN_CHANGE],initialize:function(c,a,b){this.parent(c,a,b);
this.injects().Theme.addEvent("propertyChange",this._onThemeChange);
this._arrangeWaitID=-1;
this.injects().Viewer.addEvent("pageTransitionEnded",this._onPageChanged);
this._usesExternalData=true
},_onPageChanged:function(a){var c;
var b;
if(this._allButtons){for(c=0;
c<this._allButtons.length;
c++){b=this._allButtons[c];
if(b.getID()==a){b.setState("selected")
}else{b.removeState("selected")
}}}},_onThemeChange:function(){this._changeTriggeredBy="themeChange";
this._arrangeButtonsDelayed()
},_beforeRepeatersCreation:function(){this._allButtons=[]
},_onRepeaterItemReady:function(b,d,a,c){if(c){d.addEvent("click",function(){this._onButtonClick(a)
}.bind(this))
}this._allButtons.push(d);
this.parent(b,d,a,c)
},_onRepeaterReady:function(a){this.addEvent(Constants.PropertyEvents.PROPERTY_CHANGED,this._arrangeButtons);
this._addPartsListeners();
this._arrangeButtons()
},_addPartsListeners:function(){this._skinParts.moreButton.addEvent("over",this._onMoreButtonOver);
this._skinParts.moreButton.addEvent("out",this._onMoreButtonOut);
this._skinParts.moreButton.addEvent("click",this._onMoreButtonClick);
this._skinParts.moreContainer.addEvent("mouseover",this._onMoreContainerOver);
this._skinParts.moreContainer.addEvent("mouseout",this._onMoreContainerOut);
this._skinParts.moreContainer.addEvent("mouseout",this._onMoreContainerOut);
for(var a=0;
a<this._allButtons.length;
a++){this._allButtons[a].getViewNode().uncollapse();
this._allButtons[a].addEvent("dataChanged",this._arrangeButtons)
}},render:function(){this.parent();
if(this._changeTriggeredBy=="styleChange"){this._arrangeButtonsDelayed()
}else{this._arrangeButtons()
}this._changeTriggeredBy=""
},_onDataChange:function(a){this.getComponentProperties().removeField("spacing");
this._changeTriggeredBy="dataChange";
this.parent(a)
},_skinParamsChange:function(){this._changeTriggeredBy="styleChange";
this.parent()
},_arrangeButtonsDelayed:function(){if(this._arrangeWaitID!=-1){this.injects().Utils.clearCallLater(this._arrangeWaitID)
}this._arrangeWaitID=this.callLater(this._arrangeButtons,[],50)
},_arrangeButtons:function(){if(this._skinParts==undefined||!this._allButtons||this._allButtons.length==0||!this._isDisplayed||!this.isReady()){return
}this._skinParts.moreButton.getViewNode().collapse();
this._skinParts.moreContainer.collapse();
this._skinParts.itemsContainer.setStyle("width","0px");
this._skinParts.itemsContainer.setStyle("text-align",this.getComponentProperty("alignText"));
this._arrangeWaitID=-1;
var b=this._getWidestLabelWidth();
this.setMinW(b);
var e=Math.max(b,this.getWidth());
var a=Math.max(this._allButtons[0]._skinParts.label.offsetHeight,Math.floor(this.getHeight()/this._allButtons.length));
for(var d=0;
d<this._allButtons.length;
d++){var c=this._allButtons[d];
c.setWidth(e,true);
c.setHeight(a,true);
c._skinParts.label.setStyle("line-height",a+"px")
}this._wCheckForSizeChangeAndFireAutoSized(0)
},_getWidestLabelWidth:function(){var f=0;
for(var c=0;
c<this._allButtons.length;
c++){var b=this._allButtons[c];
var a=parseInt(b._skinParts.label.offsetWidth);
var e=parseInt(b._view.getStyle("padding-left"));
var d=parseInt(b._view.getStyle("padding-right"));
f=Math.max(f,a+b.getExtraPixels(true).width)
}return f
},_setMinimumWidthAccordingToText:function(){this.setMinW(labelWidth+viewNodePaddingLeft+viewNodePaddingRight)
},_onResize:function(){this._arrangeButtons()
},_onButtonClick:function(a){this.injects().Viewer.goToPage(a.get("id"))
},_openMoreMenu:function(){this._skinParts.moreContainer.setStyle("display","block");
if(!this._isMoreContainerOpen){}this._isMoreContainerOpen=true;
this._toCloseMoreMenu=false
},_closeMoreMenuTimer:function(){if(!this._toCloseMoreMenu){this._toCloseMoreMenu=true;
this.injects().Utils.callLater(this._closeMoreMenu,[],this,500)
}},_closeMoreMenu:function(a){if(a||this._toCloseMoreMenu){this._skinParts.moreContainer.setStyle("display","none");
this._toCloseMoreMenu=false;
this._isMoreContainerOpen=false
}},_forceCloseMoreMenu:function(){this._closeMoreMenu(true)
},_onMoreButtonOver:function(){this._openMoreMenu()
},_onMoreButtonOut:function(){this._closeMoreMenuTimer()
},_onMoreContainerOver:function(){this._openMoreMenu()
},_onMoreButtonClick:function(){if(this._isMoreContainerOpen===false){this._openMoreMenu()
}else{this._forceCloseMoreMenu()
}},_onMoreContainerOut:function(){this._closeMoreMenuTimer()
},getAcceptableDataTypes:function(){return["Document"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.Video",skinParts:{videoFrame:{type:"htmlElement"},preview:{type:"htmlElement"}},propertiesSchemaName:"VideoProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_stopVideo","_onEditModeChanged","_getYouTubeParams","_getVimeoParams","_onResize"],_renderTriggers:[Constants.DisplayEvents.DISPLAY_CHANGED],MIN_SIZE:100,_defaultPlayerParams:{wmode:"transparent"},_options:{videoType:"",videoId:"",resize:[]},_getServices:function(){var a={YOUTUBE:{url:"http://www.youtube.com/embed/",preview:this._getYouTubePreview.bind(this),getParams:this._getYouTubeParams},VIMEO:{url:"http://player.vimeo.com/video/",preview:this._getViemoPreviewUrl.bind(this),getParams:this._getVimeoParams}};
return a
},initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this.setMinW(this.MIN_SIZE);
this.setMinH(this.MIN_SIZE);
this._iframe=null;
this._inPublicMode=this.injects().Viewer.isPublicMode();
this._view.addEvent(Constants.DisplayEvents.COLLAPSED,this._stopVideo)
},_stopVideo:function(){this._iframe.set("src","about:blank")
},render:function(){this._renderIframe()
},_onResize:function(){this.parent();
var a=this._view.getWidth();
var d=this._view.getHeight();
var b=this._options.resize;
for(var c=0;
c<b.length;
c++){b[c].setStyles({height:d,width:a})
}},_editModeChanged:function(c,a){if(this.injects().Viewer.isPublicMode()){return
}var b="PREVIEW";
this._inPublicMode=(c==b);
if(a==b||c==b){this._renderIframe()
}},setHeight:function(b,a,c){b=Math.max(b,this.MIN_SIZE);
this._view.setStyle("height",parseInt(b,10)+"px");
this.parent(b,a,c)
},setWidth:function(b,a,c){b=Math.max(b,this.MIN_SIZE);
this._view.setStyle("width",parseInt(b,10)+"px");
this.parent(b,a,c)
},_renderIframe:function(){this._options.videoType=this._getVideoType();
this._options.videoId=this._getVideoId();
if(!this._options.videoId||!this._options.videoType){return
}if(!this._iframe){this._createIframe(this._getUrl(),this._view.getWidth(),this._view.getHeight())
}else{this._updateIframe(this._getUrl(),this._view.getWidth(),this._view.getHeight())
}if(Browser.ie){if(!this._inPublicMode){this._createPreview()
}else{this._skinParts.videoFrame.removeClass("hidden");
this._skinParts.preview.addClass("hidden")
}}},_getContainerIframe:function(){return this.injects().Config.getPack("VIEWER_PARAMS").scriptsRoot+"/html/external/video.html"
},_createIframe:function(c,d,a){var b=this._getContainerIframe()+"?url="+encodeURIComponent(c)+"&width="+d+"&height="+a;
this._iframe=new IFrame({src:b,width:d,height:a,webkitAllowFullScreen:"true",mozallowfullscreen:"true",allowfullscreen:"allowfullscreen",frameborder:"0"});
this._iframe.insertInto(this._skinParts.videoFrame);
this._options.resize.push(this._iframe)
},_updateIframe:function(c,d,a){var b=this._getContainerIframe()+"?url="+encodeURIComponent(c)+"&width="+d+"&height="+a;
this._iframe.set({width:d,height:a,src:b})
},_getPlayerParamsAsQueryString:function(){var b=this._getServices()[this._options.videoType]["getParams"]();
var a=[];
Object.forEach(b,function(d,c){a.push(c+"="+d)
});
return a.join("&")
},_getYouTubeParams:function(){var f={};
var b=this.getComponentProperty("showControls");
var d=this.getComponentProperty("autoplay");
var e=this.getComponentProperty("lightTheme");
var c=this.getComponentProperty("loop");
var a=this.getComponentProperty("showinfo");
f.wmode="transparent";
if(this._inPublicMode){f.autoplay=(d?"1":"0")
}if(e){f.theme="light"
}else{f.theme="dark"
}switch(b){case"always_show":f.controls="1";
f.autohide="0";
break;
case"always_hide":f.controls="0";
break;
case"temp_show":f.autohide="1";
break;
default:break
}if(c){f.loop="1";
f.playlist=this._options.videoId
}else{f.loop="0"
}f.showinfo=(a?"1":"0");
return f
},_getVimeoParams:function(){var a={};
if(this._inPublicMode){a.autoplay=(this.getComponentProperty("autoplay"))
}a.loop=(this.getComponentProperty("loop"));
a.byline=(this.getComponentProperty("showinfo"));
a.portrait=(this.getComponentProperty("showinfo"));
a.title=(this.getComponentProperty("showinfo"));
return a
},_getUrl:function(){return this._getServices()[this._options.videoType]["url"]+this._options.videoId+"?"+this._getPlayerParamsAsQueryString()
},getAcceptableDataTypes:function(){return["Video"]
},_getVideoType:function(){return this._data&&this._data.get("videoType")
},_getVideoId:function(){return this._data&&this._data.get("videoId")
},_createPreview:function(){this._getServices()[this._options.videoType]["preview"]()
},_waitForPreviewUrl:function(a){this._renderPreviewImage(a)
},_renderPreviewImage:function(b){var c=this._view.getWidth();
var a=this._view.getHeight();
if(this._image){this._updatePreviewImage(b,a,c)
}else{this._createPreviewImage(b,a,c)
}},_createPreviewImage:function(b,a,c){this._image=new Image();
this._image.src=b;
this._image.setStyles({height:a,width:c});
this._image.insertInto(this._skinParts.preview);
this._options.resize.push(this._image);
this._skinParts.videoFrame.addClass("hidden");
this._skinParts.preview.removeClass("hidden")
},_updatePreviewImage:function(b,a,c){if(this._image.get("src")!=b){this._image.set("src",b)
}this._image.setStyles("height:"+a+";width:+"+c+";");
this._skinParts.videoFrame.addClass("hidden");
this._skinParts.preview.removeClass("hidden")
},_getYouTubePreview:function(){var b="http://img.youtube.com/vi/[repLace]/0.jpg";
var a=b.replace("[repLace]",this._options.videoId);
this._waitForPreviewUrl(a)
},_getViemoPreviewUrl:function(){var b="http://vimeo.com/api/v2/video/[repLace].json";
var a=b.replace("[repLace]",this._options.videoId);
var c=new Request.JSONP({url:a+"?r="+Math.random(),onComplete:this.onVimeoRetrun.bind(this)});
c.send()
},onVimeoRetrun:function(a){this._waitForPreviewUrl(a[0].thumbnail_large)
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WFacebookComment",propertiesSchemaName:"WFacebookCommentProperties",skinParts:{facebook:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onResizeEnd","_onFacebookComponentRender","_onEditModeChanged","_checkIframeSize","_renderComponentOnViewer","_rebuildFacebookComponent"],_states:{EDITOR:["light","dark"],VIEWER:["scriptLoading","scriptLoaded","loading","idle"]},initialize:function(b,a){this.parent(b,a);
this.addEvent("resizeEnd",this._onResizeEnd);
this._resizableSides=[W.BaseComponent.ResizeSides.RIGHT,W.BaseComponent.ResizeSides.LEFT];
W.Utils.hash.addEvent("change",function(){this.callRenderLater(500)
}.bind(this));
this._iframeOldHeight=0
},render:function(){this._createClickOverlay();
this._renderComponent()
},_editModeChanged:function(b,a){if(b=="PREVIEW"||a=="PREVIEW"){this._rebuildFbCommentElement()
}},_onResizeEnd:function(){if(this._skinParts){this.setComponentProperty("width",this.getWidth());
this._rebuildFbCommentElement()
}},_renderComponent:function(){if(this.injects().Viewer.isPublicMode()||!Browser.ie){this._renderComponentOnViewer()
}else{this._renderComponentOnEditor()
}},_renderComponentOnEditor:function(){var a=this.getComponentProperty("colorScheme");
this.setState(a,"editor")
},_renderComponentOnViewer:function(){var a=this.getState("viewer");
if(!a||a==""){this.setState("scriptLoading","viewer");
this._loadScript(function(){this.setState("scriptLoaded","viewer")
}.bind(this));
this.callRenderLater();
return false
}if(a=="loading"||a=="scriptLoading"){this.callRenderLater();
return false
}this.setState("loading","viewer");
this._rebuildFacebookComponent(function(){this.setState("idle","viewer")
}.bind(this))
},_rebuildFacebookComponent:function(){var a={"class":"fb-comments","data-href":location.href,"data-num-posts":this.getComponentProperty("numPosts"),"data-width":this.getComponentProperty("width"),"data-colorscheme":this.getComponentProperty("colorScheme")};
this._fbCommentElement=new Element("DIV",a);
this._skinParts.facebook.adopt(this._fbCommentElement);
if(window.FB&&FB.XFBML&&FB.XFBML.parse){FB.XFBML.parse(this._skinParts.facebook)
}},_onFacebookComponentRender:function(){if(!this.isReady()){return
}var b=this._skinParts.facebook.getSize();
var a=b.y;
this.setHeight(a);
this._wCheckForSizeChangeAndFireAutoSized(1)
},dispose:function(){if(this._iframeAuditor){clearInterval(this._iframeAuditor)
}if(window.FB){FB.Event.unsubscribe("xfbml.render",this._onFacebookComponentRender);
FB.Event.subscribe("comment.create",this._onFacebookComponentRender);
FB.Event.subscribe("comment.remove",this._onFacebookComponentRender)
}this.parent()
},setWidth:function(b,a,c){var d=400;
if(b>=d){this.parent(b,a,c)
}else{this.parent(d,a,c)
}},_checkIframeSize:function(){if(!this.isReady()){return
}var a=this._skinParts.facebook.getElement("iframe");
if(a){var b=a.getSize().y;
if(this._iframeOldHeight!=b){this._iframeOldHeight=b;
this._onFacebookComponentRender()
}}},_loadScript:function(a){var b="129982580378550";
this.injects().Viewer.loadExternalScript("//connect.facebook.net/en_GB/all.js",function(){FB.Event.subscribe("xfbml.render",this._onFacebookComponentRender);
FB.Event.subscribe("comment.create",this._onFacebookComponentRender);
FB.Event.subscribe("comment.remove",this._onFacebookComponentRender);
this._iframeAuditor=setInterval(function(){this._checkIframeSize()
}.bind(this),500);
FB.init({appId:b,xfbml:1});
a()
}.bind(this))
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WFacebookLike",skinParts:{facebook:{type:"htmlElement"}},propertiesSchemaName:"WFacebookLikeProperties",Class:{Extends:"wysiwyg.viewer.components.SocialBaseComponent",initialize:function(c,b,a){W.Utils.hash.addEvent("change",function(){this.callRenderLater(500)
}.bind(this));
this.parent(c,b,a)
},render:function(){this._layout=this.getComponentProperty("layout");
this._showFaces=this.getComponentProperty("show_faces");
this._action=this.getComponentProperty("action");
this._colorScheme=this.getComponentProperty("colorScheme");
this._send=this.getComponentProperty("send");
this.parent()
},_getPageName:function(){return"fblike.html"
},_getUrlParams:function(){return{href:location.href,layout:this._layout,show_faces:this._showFaces,action:this._action,colorscheme:this._colorScheme,send:this._send,width:this._getSizeAccordingToProperties().x}
},_getSizeAccordingToProperties:function(){var a,b;
if(this._layout=="standard"){a=250;
if(this._action=="recommend"){a+=40
}if(this._showFaces){b=85
}else{b=40
}}else{if(this._layout=="button_count"){a=90;
b=20;
if(this._action=="recommend"){a+=40
}}else{if(this._layout=="box_count"){a=55;
if(this._action=="recommend"){a+=40
}b=65
}}}return{w:a,h:b}
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WGooglePlusOne",propertiesSchemaName:"WGooglePlusOneProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_renderComponentOnViewer","_renderComponentOnEditor","_rebuildComponent","_getSizeAccordingToState","_setComponentSize"],_states:{LAYOUT:["small_bubble","small_none","small_inline","medium_bubble","medium_none","medium_inline","standard_bubble","standard_none","standard_inline","tall_bubble","tall_none","tall_inline"],VIEWER:["scriptLoading","scriptLoaded","loading","idle"]},initialize:function(c,a,b){this.parent(c,a,b);
W.Utils.hash.addEvent("change",function(){this.callRenderLater(500)
}.bind(this));
this._resizableSides=[]
},render:function(){this._createClickOverlay();
this._size=this.getComponentProperty("size");
this._annotation=this.getComponentProperty("annotation");
this._renderComponent()
},_renderComponent:function(){this.setState(this._size+"_"+this._annotation,"LAYOUT");
if(this.injects().Viewer.isPublicMode()||!Browser.ie){this._renderComponentOnViewer()
}else{this._renderComponentOnEditor()
}},_renderComponentOnEditor:function(){this._setComponentSize()
},_renderComponentOnViewer:function(){this._view.setStyles({background:"none"});
var a=this.getState("viewer");
if(!a||a==""){this.setState("scriptLoading","viewer");
this._loadScript(function(){this.setState("scriptLoaded","VIEWER")
}.bind(this));
this.callRenderLater();
return false
}if(a=="loading"||a=="scriptLoading"){this.callRenderLater();
return false
}this.setState("loading","VIEWER");
this._rebuildComponent(function(){this.setState("idle","VIEWER")
}.bind(this))
},_rebuildComponent:function(b){this._skinParts.googlePlus.empty();
var a={"class":"googlePlusOne",href:location.href,size:this._size,annotation:this._annotation,width:this._view.getWidth()};
this._googlePlusOneElement=new Element("g\\:plusone",a);
this._skinParts.googlePlus.adopt(this._googlePlusOneElement);
if(window.gapi&&gapi.plusone&&gapi.plusone.go){gapi.plusone.go(this._skinParts.googlePlus)
}this.callLater(this._setComponentSize,null,100);
b()
},_setComponentSize:function(b){var a=this._getSizeAccordingToState();
this.setHeight(a.h);
this.setWidth(a.w);
this._wCheckForSizeChangeAndFireAutoSized(5)
},_loadScript:function(a){this.injects().Viewer.loadExternalScript("https://apis.google.com/js/plusone.js",function(){a()
}.bind(this),'{"parsetags": "explicit"}')
},_getSizeAccordingToState:function(){switch(this.getState("LAYOUT")){case"small_bubble":return{w:70,h:15};
break;
case"small_none":return{w:24,h:15};
break;
case"small_inline":return{w:250,h:15};
break;
case"medium_bubble":return{w:90,h:20};
break;
case"medium_none":return{w:32,h:20};
break;
case"medium_inline":return{w:250,h:20};
break;
case"standard_bubble":return{w:106,h:24};
break;
case"standard_none":return{w:38,h:24};
break;
case"standard_inline":return{w:250,h:24};
break;
case"tall_bubble":return{w:50,h:60};
break;
case"tall_none":return{w:50,h:20};
break;
case"tall_inline":return{w:250,h:20};
break
}}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WPhoto",skinParts:{link:{type:"htmlElement"},img:{type:"mobile.core.components.Image",dataRefField:"*"}},propertiesSchemaName:"WPhotoProperties",traits:["mobile.core.components.traits.LinkableComponent"],Class:{Extends:"mobile.core.components.base.BaseComponent",_renderTriggers:[Constants.DisplayEvents.ADDED_TO_DOM,Constants.DisplayEvents.DISPLAYED,Constants.DisplayEvents.DISPLAY_CHANGED,Constants.DisplayEvents.SKIN_CHANGE],Binds:["render"],initialize:function(c,a,b){this.parent(c,a,b);
this.addEvent("componentPropertyChange",this._arrangeImage);
this._firstRender=true;
this._dontRearange=true;
this._heightDiff=0;
this._widthDiff=0
},render:function(){this.parent();
if(this._firstRender){this._firstRender=false;
this._dontRearange=false;
this._computeSizeDiff()
}this._setTitle();
this._arrangeImage()
},_arrangeImage:function(d,b){var e;
if(this._allComponentPartsReady){e=this._getDisplayMode();
if(e!="fitWidth"){this._setDisplayMode(e)
}else{if(this._isDisplayed){if(this._sizeDiffInvalidated){this._computeSizeDiff()
}this._skinParts.img.setCropMode("fill");
var c=this.getWidth()-this._widthDiff;
var a=(this._data.get("height")/this._data.get("width")*c)+this._heightDiff;
this._dontRearange=true;
this.setWidth(this.getWidth());
this.setHeight(a+this._heightDiff);
this._dontRearange=false;
this.fireEvent("autoSized",{ignoreLayout:b})
}}this._skinParts.img.refresh(true)
}},_getWantedWidth:function(){if(this._sizeDiffInvalidated){this._computeSizeDiff()
}this._setDisplayMode("fill");
var a=this.getPhysicalHeight()-this._heightDiff;
return this._data.get("width")/this._data.get("height")*a+this._widthDiff
},setWidth:function(b,a,c){this.parent(b,a,c);
if(!this._dontRearange){this._arrangeImage(null,true)
}},setHeight:function(c,a,d){this.parent(c,a,d);
if(!this._dontRearange){var b=this._getDisplayMode();
if(b=="fitWidth"&&this._isDisplayed){this._dontRearange=true;
this.setWidth(this._getWantedWidth());
this._dontRearange=false
}this._arrangeImage(null,true)
}},_setTitle:function(){var a=this._data.get("title");
if(a){this._skinParts.view.set("title",a)
}},getAcceptableDataTypes:function(){return["Image"]
},_onAllSkinPartsReady:function(a){a.img.setCropMode(this._getDisplayMode());
this._sizeDiffInvalidated=true;
this._computeSizeDiff()
},_computeSizeDiff:function(){if(this._isDisplayed){this._widthDiff=this._view.getSize().x-this._skinParts.img.getViewNode().getSize().x;
this._heightDiff=this._view.getSize().y-this._skinParts.img.getViewNode().getSize().y;
this._sizeDiffInvalidated=false
}},_getDisplayMode:function(){return this.getComponentProperty("displayMode")
},_setDisplayMode:function(a){this._skinParts.img.setCropMode(a)
},allowHeightLock:function(){return this._getDisplayMode()!="fitWidth"
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WRichText",imports:["mobile.core.components.base.BaseComponent"],skinParts:{richTextContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_modeChanged","_updateText"],_renderTriggers:[Constants.DisplayEvents.ADDED_TO_DOM,Constants.DisplayEvents.DISPLAYED],initialize:function(c,a,b){if(this.injects().Commands){this.injects().Commands.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._modeChanged)
}this.parent(c,a,b);
this.setMaxH(5000)
},_onAllSkinPartsReady:function(){var b=this._data.get("text");
this._skinParts.richTextContainer.set("html",b);
this._modeChanged("VIEW");
this._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._updateText);
var a=this._data.getMeta("isPreset");
this._surroundFreeTextWithSpan();
this._data.set("text",this._skinParts.richTextContainer.innerHTML);
this._data.setMeta("isPreset",a)
},_surroundFreeTextWithSpan:function(){var b=this;
var a=this._skinParts.richTextContainer.getElements("p, div, li, pre, td, dt, dd, h1, h2, h3, h4, h5, h6");
a.push(this._skinParts.richTextContainer);
Array.forEach(a,function(c){c.normalize();
var d=c.childNodes;
var e=Array.filter(d,function(f){return f.nodeType===3
});
Array.forEach(e,function(h){var f=h.data.match(/\s.*/g);
if(!f||f.length<1||f[0]!=h.data){var g=new Element("span",{"class":b._data.get("defaultStyle")});
g.innerText=h.data;
c.replaceChild(g,h)
}})
})
},_updateText:function(){var a=this._data.get("text");
this._skinParts.richTextContainer.set("html",a)
},_modeChanged:function(f){var a;
if((f=="PREVIEW"||f=="VIEW")&&this._skinParts){var b=$(this._skinParts.richTextContainer).getElements("a");
for(var c=0;
c<b.length;
c++){var d=b[c];
var e=d.getAttribute("dataquery");
if(e){(function(g){this.injects().Data.getDataByQuery("#"+e,function(k){var h=k.get("href");
var j=k.get("linkType");
g.set("href",h);
if(f=="PREVIEW"&&j!="PAGE"){g.set("target","_blank")
}else{a=k.get("target");
if(a){g.set("target",a)
}}this._sanitizeLink(g)
}.bind(this))
}.bind(this))(d)
}}}},getRichTextContainer:function(){if(this._skinParts){return this._skinParts.richTextContainer
}else{return null
}},isEditableInPlace:function(){return true
},getAcceptableDataTypes:function(){return["RichText","Text"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WRichText2",imports:["mobile.core.components.base.BaseComponent"],skinParts:{richTextContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],richTextContainer:null,render:function(){var a=this._data.get("text");
this._skinParts.richTextContainer.set("html",a)
},_onAllSkinPartsReady:function(a){this.richTextContainer=this._skinParts.richTextContainer
},getAcceptableDataTypes:function(){return["Text","RichText"]
},isEditableInPlace:function(){return true
},startEditingInPlace:function(){this._skinParts.richTextContainer.set("contenteditable","true")
},stopEditingInPlace:function(){this._skinParts.richTextContainer.set("contenteditable","false")
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WSiteStructure",Class:{Extends:"mobile.core.components.Container",Binds:["_onThemePropertyChange","_updateSiteBgPosition","_updateSiteBgSize","_validateBg","_delayedInvalidateBg","_invalidateBg","_setBgAsImageViewMode"],initialize:function(c,a,b){this._bgNode=new Element("div",{id:"bgNode"});
this._bgNode.setStyles({position:"absolute",width:"100%"});
this._bgNode.inject(document.body,"top");
this._bgStyle={};
this._lastBgStyle={};
this.parent(c,a,b);
window.onorientationchange&&window.addEvent("orientationchange",this._invalidateBg);
window.addEvent("scroll",this._delayedInvalidateBg);
window.addEvent("resize",this._delayedInvalidateBg);
W.Theme.addEvent("propertyChange",this._onThemePropertyChange);
this._updateBgProperty();
this._validateBg();
this.setMaxH(10000);
if(W.Viewer.getPreviewMode()){this._view.setStyle("padding-bottom",100)
}},render:function(){var a=this.injects().Viewer.getDocWidth();
this.setWidth(a);
this.parent()
},_getReformattedBgColor:function(){return this.parent()
},_onThemePropertyChange:function(a){if(a&&a.type=="propertyChange"&&a.name!="siteBg"){return
}this._updateBgProperty();
this._invalidateBg()
},_updateBgProperty:function(){this._siteBgDef=this.injects().Theme.getProperty("siteBg");
this._bgFixed=(this._siteBgDef.getAttachment()=="fixed");
this._bgStyle["background-image"]=this._siteBgDef.getUrl();
this._bgStyle["background-size"]=this._siteBgDef.getCssSizeValue();
this._bgStyle["background-position"]=this._siteBgDef.getPosition();
this._bgStyle["background-repeat"]=this._siteBgDef.getRepeatUnified();
this._bgStyle["background-color"]=this._siteBgDef.getColor()
},_updateSiteBgSize:function(){if(this._bgFixed){this._bgStyle.height=$(document.body).getSize().y+"px"
}else{this._bgStyle.height=(this._siteHeight||50)+"px"
}},_updateSiteBgPosition:function(){if(Modernizr.positionfixed){this._bgStyle.position=(this._bgFixed)?"fixed":"absolute"
}else{this._bgStyle.top=(this._bgFixed)?document.body.scrollTop+"px":0
}},_delayedInvalidateBg:function(){if(this._delayedInvalidateBgTimeout){clearTimeout(this._delayedInvalidateBgTimeout)
}this._delayedInvalidateBgTimeout=W.Utils.callLater(this._invalidateBg,null,this,150)
},_invalidateBg:function(){if(!this._bgRenderCall){this._bgRenderCall=this.injects().Utils.callOnNextRender(this._validateBg,10)
}},_validateBg:function(){delete this._bgRenderCall;
this._updateSiteBgSize();
this._updateSiteBgPosition();
if(!this._isBgStyleChanged()){return
}this._lastBgStyle=Object.clone(this._bgStyle);
this._bgNode.setStyles(this._bgStyle);
if(!Modernizr.backgroundsize){if(this._bgStyle["background-image"]!=="none"&&(this._bgStyle["background-size"]==="contain"||this._bgStyle["background-size"]==="cover")){this._bgNode.setStyle("background-image","none");
this._setBgAsImage(this._bgNode)
}else{if(this._bgAsImage){this._bgAsImage.collapse()
}}}},_setBgAsImage:function(){if(!this._bgAsImage){this._bgAsImageDataItem=W.Data.createDataItem({type:"Image",uri:this._siteBgDef.getImageId(),width:this._siteBgDef.getImageSize()[0],height:this._siteBgDef.getImageSize()[1],borderSize:0,title:"",description:"",alt:""});
this._bgAsImage=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",this._bgAsImageDataItem,{width:"100",height:"100",unit:"%"},null,this._setBgAsImageViewMode);
this._bgAsImage.insertInto(this._bgNode)
}else{this._setBgAsImageDataItemValues(this._siteBgDef.getImageId(),this._siteBgDef.getImageSize());
this._setBgAsImageViewMode(this._bgAsImage.getLogic())
}},_setBgAsImageDataItemValues:function(b,a){if(this._bgAsImageDataItem){this._bgAsImageDataItem.setFields({uri:b,width:a[0],height:a[1]})
}},_setBgAsImageViewMode:function(c){var b=(this._bgStyle["background-size"]==="contain")?"full":"fill";
var a=this._bgStyle["background-position"].split(" ");
c.setCropMode(b);
c.setAlign(a[0],a[1]);
c.uncollapse()
},_isBgStyleChanged:function(){for(var a in this._bgStyle){if(this._bgStyle[a]!=this._lastBgStyle[a]){return true
}}return false
},setHeight:function(a){if(this._siteHeight==a){return
}this._siteHeight=a;
this._delayedInvalidateBg();
this.parent(a);
this.injects().Viewer.siteHeightChanged(true)
},_getBestFit:function(b,a){return this.parent(b,a)
},_getWantedBgSize:function(){return this.parent()
},getChildComponents:function(){return this.getViewNode().getChildren("[comp]")
},isAnchorable:function(){return{to:{allow:true,lock:W.BaseComponent.AnchorLock.ALWAYS,distance:0},from:{allow:false,lock:W.BaseComponent.AnchorLock.NEVER}}
},layoutMinHeight:function(){return 0
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WTwitterFollow",propertiesSchemaName:"WTwitterFollowProperties",skinParts:{twitter:{type:"htmlElement"}},Class:{Extends:"wysiwyg.viewer.components.SocialBaseComponent",render:function(){this._showCount=this.getComponentProperty("showCount");
this._showScreenName=this.getComponentProperty("showScreenName");
var a=this._data.get("accountToFollow").replace("@","");
if(a==""){a="wix"
}this._screenName=a;
this.parent()
},_getPageName:function(){return"twfollow.html"
},_getUrlParams:function(){return{screen_name:this._screenName,href:"https://twitter.com/"+this._screenName,show_count:this._showCount,show_screen_name:this._showScreenName,lang:this.getComponentProperty("dataLang"),align:"left"}
},_getSizeAccordingToProperties:function(){var a=80;
var b=20;
if(this._showCount){a+=85
}if(this._showScreenName){a+=(this._screenName.length*6)
}return{w:a,h:b}
},getAcceptableDataTypes:function(){return["TwitterFollow"]
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WTwitterTweet",propertiesSchemaName:"WTwitterTweetProperties",skinParts:{twitter:{type:"htmlElement"}},Class:{Extends:"wysiwyg.viewer.components.SocialBaseComponent",initialize:function(c,b,a){W.Utils.hash.addEvent("change",function(){this.callRenderLater(500)
}.bind(this));
this.parent(c,b,a)
},_getPageName:function(){return"twtweet.html"
},_getUrlParams:function(){return{href:"https://twitter.com/share",count:this.getComponentProperty("dataCount"),lang:this.getComponentProperty("dataLang"),url:location.href,via:"",text:this._data.get("defaultText"),related:this._data.get("accountToFollow"),counturl:location.href}
},getAcceptableDataTypes:function(){return["TwitterTweet"]
},_getSizeAccordingToProperties:function(){var a,b;
var c=this.getComponentProperty("dataCount");
b=20;
switch(c){case"none":a=60;
break;
case"horizontal":a=100;
break;
case"vertical":a=60;
b=62;
break
}return{w:a,h:b}
}}});
W.Components.newComponent({name:"wysiwyg.viewer.components.WixAds",skinParts:{footerLabel:{type:"htmlElement",optional:false},topRectLabel:{type:"htmlElement",optional:false},topRectContent:{type:"htmlElement",optional:false}},Class:{Extends:"mobile.core.components.base.BaseComponent",_renderTriggers:[Constants.DisplayEvents.ADDED_TO_DOM,Constants.DisplayEvents.DISPLAYED,Constants.DisplayEvents.DISPLAY_CHANGED],Binds:["_getAdHeight"],initialize:function(d,b,c){this.parent(d,b,c);
var a=this.injects().Commands;
a.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._onModeChange);
a.registerCommandListenerByName("WViewerCommands.SetMediaZoomImage",this,function(){this._showHideAds(false)
});
a.registerCommandListenerByName("WViewerCommands.MediaZoom.Close",this,function(){this._showHideAds(!this._isPremium())
});
this.injects().Viewer.addHeightChangeCallback(this._getAdHeight)
},_onAllSkinPartsReady:function(){this.setCollapsed(this.injects().Viewer.getPreviewMode()||this._isPremium());
this._skinParts.view.addEvent("click",function(){var c=!this.injects().Viewer.getPreviewMode();
var b=c?adData.adUrl.replace("[site_id]",window.siteId):adData.adUrl;
var a=!c||this._isFacebook();
if(a){window.open(b,"_blank")
}else{window.location.assign(b)
}}.bind(this))
},render:function(){this.parent();
var a=this.injects().Viewer.getAdData();
this._skinParts.topRectLabel.set("html",a.topLabel);
this._skinParts.topRectContent.set("html",a.topContent);
this._skinParts.footerLabel.set("html",a.footerLabel)
},_onModeChange:function(a){this._showHideAds(this._shouldShowAds(a))
},_showHideAds:function(a){this.setCollapsed(!a);
this.injects().Viewer.siteHeightChanged(false)
},_shouldShowAds:function(a){return this._isInPreviewMode(a)&&!this._isPremium()
},_isInPreviewMode:function(a){return a.toLowerCase()===Constants.ViewManager.VIEW_MODE_PREVIEW.toLowerCase()
},_isPremium:function(){var a=window.rendererModel||window.editorModel&&window.editorModel.metaSiteData||window.top&&window.top.editorModel&&window.top.editorModel.metaSiteData;
if(!a||!a.premiumFeatures){return false
}var b=a.premiumFeatures;
if(this._isFacebook()){return b.contains("NoAdsInSocialSites")
}else{return b.contains("AdsFree")||b.contains("ShowWixWhileLoading")
}},_isFacebook:function(){var a=window.siteHeader.applicationType||window.rendererModel.applicationType;
return a==="HtmlFacebook"
},_getAdHeight:function(){if(this._view.isCollapsed()){return 0
}else{return this._skinParts.footerLabel.getHeight()
}}}});
W.Classes.newTrait({name:"wysiwyg.viewer.components.traits.GalleryAutoplay",trait:{Binds:["_onComponentReady","_onMouseDown","_autoplayCallback","_onPropertyChanged","_onTransitionFinished","_onModeChange","_onMediaZoomClosed","_onMediaZoomOpened"],_autoplayOn:false,_timeoutID:null,_suppressAutoplay:false,initialize:function(){this._states.slideshow=["autoplayOn","autoplayOff"];
this.addEvent(Constants.ComponentEvents.RENDER,this._onComponentRender);
this.addEvent(Constants.ComponentEvents.READY,this._onComponentReady);
if(this.injects().Viewer.getPreviewMode()===true){this._suppressAutoplay=true;
this.injects().Commands.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._onModeChange)
}this.injects().Commands.registerCommandListenerByName("WViewerCommands.MediaZoom.Close",this,this._onMediaZoomClosed);
this.injects().Commands.registerCommandListenerByName("WViewerCommands.SetMediaZoomImage",this,this._onMediaZoomOpened)
},_onComponentReady:function(){this._autoplayOn=this.getComponentProperty("autoplay")===true;
this._updateAutoplayState()
},_onComponentRender:function(){this._properties.addEvent(Constants.DataEvents.DATA_CHANGED,this._onPropertyChanged);
this.addEvent("transitionFinished",this._onTransitionFinished);
this._skinParts.autoplay.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.autoplay.setStyle("cursor","pointer")
},_onModeChange:function(a){this._autoplayOn=this.getComponentProperty("autoplay")===true;
this._suppressAutoplay=!(a=="PREVIEW");
this._updateAutoplayState()
},_onMediaZoomOpened:function(){this._lastAutoplayState=this._autoplayOn;
this._suppressAutoplay=true;
this._updateAutoplayState()
},_onMediaZoomClosed:function(){this._suppressAutoplay=false;
this._autoplayOn=this._lastAutoplayState===true;
this._updateAutoplayState()
},_validateHostComponent:function(){var a=this.getComponentProperties().getSchema();
if(!this._skinPartsSchema.hasOwnProperty("autoplay")){this._validationErr("Must require 'autoplay' skinPart.")
}if(!a.hasOwnProperty("autoplay")){this._validationErr("Must contain 'autoplay' among the component properties.")
}if(!a.hasOwnProperty("autoplayInterval")){this._validationErr("Must contain 'autoplayInterval' among the component properties.")
}if(typeOf(this["gotoNext"])!="function"){this._validationErr("Host component must implement gotoNext() method.")
}},_validationErr:function(a){throw new Error("GalleryAutoplay trait's host component validation failed. "+a)
},_onMouseDown:function(a){this._toggleAutoplay()
},_toggleAutoplay:function(){this._autoplayOn=!this._autoplayOn;
this._updateAutoplayState()
},_updateAutoplayState:function(){if(this._suppressAutoplay){this._autoplayOn=false
}this.setState(this._autoplayOn?"autoplayOn":"autoplayOff","slideshow");
this._startAutoplayTimer()
},_getAutoplayInterval:function(){var b=parseFloat(this.getComponentProperty("autoplayInterval"));
var c=parseFloat(this.getComponentProperty("transDuration"));
var a=Math.floor(b*1000);
return a
},_startAutoplayTimer:function(){if(this._timeoutID!=null){clearTimeout(this._timeoutID);
this._timeoutID=null
}if(this._autoplayOn){this._timeoutID=setTimeout(this._autoplayCallback,this._getAutoplayInterval())
}},_autoplayCallback:function(){this.gotoNext()
},_onPropertyChanged:function(){this._autoplayOn=this.getComponentProperty("autoplay")===true;
this._updateAutoplayState();
this._checkAutoPlaySkinPartsVisibility()
},_checkAutoPlaySkinPartsVisibility:function(){if(this._skinParts){this._skinParts.autoplay.setStyle("visibility",this.getComponentProperty("showAutoplay")?"visible":"hidden")
}},_onTransitionFinished:function(){this._startAutoplayTimer()
}}});
W.Classes.newTrait({name:"wysiwyg.viewer.components.traits.ListIterator",trait:{_currentItemIndex:0,_oldItem:null,_currentItem:null,_numItems:-1,_locked:false,_lastCommand:"",lock:function(){this._locked=true
},unlock:function(){this._locked=false
},isLocked:function(){return this._locked
},setListAndCurrentIndex:function(b,a){this._numItems=b.get("items").length;
this._currentItemIndex=a;
this._onCurrentItemChanged()
},resetIterator:function(){this._currentItemIndex=0;
this._numItems=-1;
this._locked=false;
this._lastCommand="";
this._currentItem=null
},_onCurrentItemChanged:function(){this._oldItem=this._currentItem;
this._currentItem=this.getDataItem().getData().items[this._currentItemIndex];
this.fireEvent("currentItemChanged")
},gotoPrev:function(){if(!this._locked){this._lastCommand="prev";
this._currentItemIndex=this._getPrevItemIndex();
this._onCurrentItemChanged()
}},gotoNext:function(){if(!this._locked){this._lastCommand="next";
this._currentItemIndex=this._getNextItemIndex();
this._onCurrentItemChanged()
}},_getNextItemIndex:function(){var a=this._currentItemIndex;
a++;
if(a>=this._numItems){a=0
}return a
},_getPrevItemIndex:function(){var a=this._currentItemIndex;
a--;
if(a==-1){a=this._numItems-1
}return a
}}});