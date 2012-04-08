Constants.TransitionTypes={SWIPE_HORIZONTAL:"swipeHorizontal",SWIPE_HORIZONTAL_FULLSCREEN:"swipeHorizontalFullScreen",SWIPE_VERTICAL:"swipeVertical",SWIPE_VERTICAL_FULLSCREEN:"swipeVerticalFullScreen",CROSS_FADE:"crossfade",OUT_IN:"outIn",NONE:"none"};
W.Classes.newClass({name:"wysiwyg.viewer.utils.TransitionUtils",Class:{Binds:["_swipeHorizontalTransition","_swipeHorizontalTransitionFullScreen","_swipeVerticalTransition","_swipeVerticalTransitionFullScreen","_noTransition","_inOutTransition","_crossFadeTransition","_trackCallback"],_useCSS3:false,initialize:function(){this._Tween=W.Utils.Tween
},getTransition:function(a){switch(a){case Constants.TransitionTypes.SWIPE_HORIZONTAL:return this._swipeHorizontalTransition;
case Constants.TransitionTypes.SWIPE_HORIZONTAL_FULLSCREEN:return this._swipeHorizontalTransitionFullScreen;
case Constants.TransitionTypes.SWIPE_VERTICAL:return this._swipeVerticalTransition;
case Constants.TransitionTypes.SWIPE_VERTICAL_FULLSCREEN:return this._swipeVerticalTransitionFullScreen;
case Constants.TransitionTypes.CROSS_FADE:return this._crossFadeTransition;
case Constants.TransitionTypes.OUT_IN:return this._inOutTransition;
case Constants.TransitionTypes.NONE:default:return this._noTransition
}},_noTransition:function(b,a,e,d,c){c()
},_swipeHorizontalTransition:function(b,a,e,d,c){var f=b.getWidth();
this._swipeHorizontalTransitionCommon(b,a,e,d,f,c)
},_swipeHorizontalTransitionFullScreen:function(d,b,g,f,e){var c=d.getContentRect();
var a=Math.max($(document).getSize().x-c.left,c.right);
var h=a-b.getContentRect(b).left;
this._swipeHorizontalTransitionCommon(d,b,g,f,h,e)
},_swipeHorizontalTransitionCommon:function(i,g,h,d,f,c){var b=i.getParent();
var a=this.injects().Utils.getCSSBrowserFeature("animation");
var e=this.injects().Utils.getCSSBrowserFeature("animation-timing-function");
var j={};
i.setStyles({position:"absolute"});
g.setStyles({position:"absolute"});
if(h!==0){f=-f
}g.setStyle("left",f+"px");
if(this._useCSS3&&a){j.left=f+"px";
j["margin-left"]=String(-f)+"px";
j[a]="swipeHoriz "+d+"s";
j[e]="ease-in-out";
b.setStyles(j);
setTimeout(function(){b.setStyle(a,"");
b.setStyles({left:"0px","margin-left":"0px"});
g.setStyles({left:"0px"});
c()
},1000*d)
}else{this._Tween.to(b,d,{left:String(-f),ease:"strong_easeInOut",onComplete:function(){g.setStyles({left:"0px"});
b.setStyles({top:"0px",left:"0px"});
c()
}})
}},_swipeVerticalTransition:function(b,a,e,d,c){var f=b.getHeight();
this._swipeVerticalTransitionCommon(b,a,e,d,f,c)
},_swipeVerticalTransitionFullScreen:function(b,a,e,d,c){var f=b.getCoordinates().top+a.getHeight();
this._swipeVerticalTransitionCommon(b,a,e,d,f,c)
},_swipeVerticalTransitionCommon:function(i,g,h,d,f,c){var b=i.getParent();
var a=this.injects().Utils.getCSSBrowserFeature("animation");
var e=this.injects().Utils.getCSSBrowserFeature("animation-timing-function");
var j={};
i.setStyles({position:"absolute"});
g.setStyles({position:"absolute"});
if(h!==0){f=-f
}g.setStyle("top",f+"px");
if(this._useCSS3&&a){j.top=f+"px";
j["margin-top"]=String(-f)+"px";
j[a]="swipeVert "+d+"s";
j[e]="ease-in-out";
b.setStyles(j);
setTimeout(function(){b.setStyle(a,"");
b.setStyles({top:"0px","margin-top":"0px"});
g.setStyles({top:"0px"});
c()
},1000*d)
}else{this._Tween.to(b,d,{top:String(-f),ease:"strong_easeInOut",onComplete:function(){g.setStyles({top:"0px"});
b.setStyles({top:"0px",left:"0px"});
c()
}})
}},_crossFadeTransition:function(c,a,f,e,d){var b=this.injects().Utils.getCSSBrowserFeature("animation");
c.setStyles({position:"absolute"});
a.setStyles({position:"relative",top:"0px",left:"0px",opacity:"0.0"});
if(this._useCSS3&&b){c.setStyle(b,"fadeOut "+e+"s");
a.setStyle(b,"fadeIn "+e+"s");
setTimeout(function(){a.setStyle(b,"");
c.setStyle(b,"");
a.setStyles({position:"absolute"});
d()
},1000*e)
}else{c.setStyles({opacity:"1.0"});
a.setStyles({opacity:"0.0",visibility:"visible"});
this._Tween.to(c,e,{opacity:0,ease:"swing"});
this._Tween.to(a,e,{opacity:1,ease:"swing",onComplete:function(){d()
}})
}},_inOutTransition:function(c,a,f,e,d){var b=this.injects().Utils.getCSSBrowserFeature("animation");
c.setStyles({position:"absolute"});
a.setStyles({position:"relative",top:"0px",left:"0px",opacity:"0.0",visibility:"visible"});
if(this._useCSS3&&b){c.setStyle(b,"fadeOut "+e+"s");
a.setStyle(b,"fadeIn "+e+"s "+e+"s");
setTimeout(function(){c.setStyle(b,"");
c.setStyles({opacity:"0.0"});
setTimeout(function(){a.setStyle(b,"");
a.setStyles({opacity:"1.0"});
a.setStyles({position:"absolute"});
d()
},1000*e)
},1000*e)
}else{c.setStyles({opacity:"1.0"});
a.setStyles({opacity:"0.0",visibility:"visible"});
this._Tween.to(c,e*1.2,{opacity:0,ease:"strong_easeOut"});
this._Tween.to(a,e,{opacity:1,ease:"strong_easeIn",onComplete:function(){d()
}})
}},_frameRateTrackingActive:false,_frameRateCount:0,_trackStartTime:0,_startTracking:function(){this._frameRateTrackingActive=true;
this._frameRateCount=0;
this._trackStartTime=new Date().getTime();
window.requestAnimFrame(this._trackCallback)
},_stopTracking:function(){this._frameRateTrackingActive=false;
var a=(new Date().getTime()-this._trackStartTime)/1000
},_trackCallback:function(){this._frameRateCount++;
if(this._frameRateTrackingActive){window.requestAnimFrame(this._trackCallback)
}}}});
W.Skins.newSkin({name:"mobile.core.skins.InlineSkin",imports:[],Class:{Extends:"mobile.core.skins.BaseSkin",_params:[],_html:"",_css:[],_buildSkin:function(){return{view:this._viewNode,inlineContent:this._viewNode}
}}});
W.Theme.registerDataTypeSchema("TopLevelStyle",{skin:"string",style:"object"});
W.Data.registerDataTypeSchema("Document",{name:"string",mainPage:"ref",pages:"refList"});
W.Data.registerDataTypeSchema("Page",{title:"string",hideTitle:"boolean",icon:"string",windowTitle:"string",descriptionSEO:"string",metaKeywordsSEO:"string",pageTitleSEO:"string",pageUriSEO:"string",hidePage:"boolean",underConstruction:"boolean"});
W.Data.registerDataTypeSchema("Header",{title:"string",imageSize:{type:"string","default":"medium"},image:"ref"});
W.Data.registerDataTypeSchema("ServiceList",{serviceType:"string",items:"refList"});
W.Data.registerDataTypeSchema("LinkList",{items:"refList",subType:"string"});
W.Data.registerDataTypeSchema("Link",{linkType:{type:"string","default":"FREE_LINK"},href:"string",text:"string",target:"string",icon:"string"});
W.Data.registerDataTypeSchema("TextLink",{linkType:{type:"string","default":"FREE_LINK"},href:"string",text:"string",target:"string",icon:"string"});
W.Data.registerDataTypeSchema("Image",{"extends":"Link",title:"string",uri:"string",description:"string",height:"number",width:"number",borderSize:"string",alt:"string"});
W.Data.registerDataTypeSchema("Service",{title:"string",description:"string",image:"ref"});
W.Data.registerDataTypeSchema("Text",{text:"string"});
W.Data.registerDataTypeSchema("RichText",{text:"string",defaultStyle:"string"});
W.Data.registerDataTypeSchema("RichTextImage",{text:"ref",image:"ref"});
W.Theme.registerDataTypeSchema("Theme",{properties:"object"});
W.Data.registerDataTypeSchema("ImageList",{items:"refList"});
W.Data.registerDataTypeSchema("TwitterTweet",{defaultText:"string",accountToFollow:"string"});
W.Data.registerDataTypeSchema("TwitterFollow",{accountToFollow:"string"});
W.Data.registerDataTypeSchema("Button",{label:"resourceKey",toggleMode:"boolean",disabled:"boolean",iconSrc:"string",command:"string",commandParameter:"string",action:"string"});
W.Theme.registerDataTypeSchema("WFlatTheme",{THEME_DIRECTORY:{type:"themeUrl","default":"base"},BG_DIRECTORY:{type:"themeUrl","default":"base"},CONTACT_DIRECTORY:{type:"themeUrl","default":"base"},NETWORKS_DIRECTORY:{type:"themeUrl","default":"base"},EXTERNAL_LINKS_DIRECTORY:{type:"themeUrl","default":"base"},PAGES_DIRECTORY:{type:"themeUrl","default":"base"},WEB_THEME_DIRECTORY:{type:"webThemeUrl","default":"base"},BASE_THEME_DIRECTORY:{type:"webThemeUrl","default":"base"},siteBg:{type:"background","default":"none 0 0 center center auto repeat no-repeat fixed {color_2}"},color:{type:"array",itemType:"color",defaultItems:["#000000","#000000","#FFFFFF","#FF0000","#00FF00","#0000FF","#333333","#666666","#999999","#AAAAAA","#DCDCDC","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"]},font:{type:"array",itemType:"font",defaultItems:["normal normal normal 24px/1.2em Arial {color_5}","normal normal bold 16px/1.1em Arial {color_5}","italic normal bold 18px/1.1em Lobster {color_5}","normal normal bold 22px/1.1em Arial {color_5}","normal normal bold 20px/1.1em Arial {color_5}","normal normal normal 18px/1.3em Arial {color_5}","normal normal normal 16px/1.2em Arial {color_6}","normal normal normal 14px/1.3em Arial {color_6}","normal normal normal 12px/1.3em Arial {color_6}","normal normal normal 10px/1.3em Arial {color_6}","normal normal normal 8px/1.3em Arial {color_6}"]},border:{type:"array",itemType:"border",defaultItems:["0.15em solid [color_0]","0.15em solid [color_0]","0.15em solid [color_0]"]},padding1:{type:"padding","default":"0 0 0 0"},padding2:{type:"padding","default":"0.0em 0.5em 0.0em 0.5em"},padding3:{type:"padding","default":"1.0em 0.0em 1.0em 0.0em"},iconSize:{type:"number","default":"3.2"},bulletSize:{type:"number","default":"1.5"},headerSpacing:{type:"number","default":"0em"},componentSpacing:{type:"number","default":"0.45em"},itemSpacing:{type:"number","default":"0.75em"},thumbSpacing:{type:"number","default":"0.23em"},iconSpacing:{type:"number","default":"0.75em"}});
W.Data.registerDataTypeSchema("Video",{videoId:"string",videoType:"string"});
W.Data.registerDataTypeSchema("SiteButton",{"extends":"Link",label:{type:"string","default":"MY BUTTON"}});
W.Data.registerDataTypeSchema("GeoMap",{address:{type:"string","default":"10 West 18th St. New york, NY 10011"},latitude:{type:"number","default":"40.73"},longitude:{type:"number","default":"-74"},addressInfo:{type:"string","default":"Wix Lounge NYC"}});
W.Data.registerDataTypeSchema("ContactForm",{toEmailAddress:"string",bccEmailAddress:"string"});
W.Data.registerDataTypeSchema("HtmlComponent",{sourceType:"string",url:"string"});
W.Data.registerDataTypeSchema("SoundCloudWidget",{url:{type:"string","default":""},showArtWork:{type:"Boolean","default":true},autoPlay:{type:"Boolean","default":false},embedSource:{type:"string","default":""}});
W.Data.registerDataTypeSchema("EbayItemsBySeller",{sellerId:"string",registrationSite:"string"});
W.Data.registerDataTypeSchema("FlickrBadgeWidget",{userId:{type:"string","default":"74009459@N07"},userName:"string",tag:"string",imageCount:{type:"number","default":3},whichImages:{type:"string","default":"latest"},imageSize:{type:"string","default":"t"},layoutOrientation:{type:"string","default":"v"}});
W.Data.registerDataTypeSchema("SiteSettings",{siteName:{type:"string","default":""},siteTitleSEO:{type:"string","default":""},siteDescriptionSEO:{type:"string","default":""},keywordsSEO:{type:"string","default":""},allowSEFindSite:{type:"boolean","default":""},favicon:{type:"string","default":""},thumbnail:{type:"string","default":""},googleAnalyticsID:{type:"string","default":""}});
W.Data.registerDataTypeSchema("Font",{font:"string"});
W.Data.registerDataTypeSchema("Document",{name:"string",mainPage:"string"});
W.Data.registerDataTypeSchema("TemplateList",{templates:"array"});
W.Data.registerDataTypeSchema("map",{templates:"object"});
W.Data.registerDataTypeSchema("Tooltips",{toolTips:"object"});
W.Data.registerDataTypeSchema("PageList",{items:"array"});
W.Data.registerDataTypeSchema("ComponentList",{title:"string",list:"array"});
W.Data.registerDataTypeSchema("Theme",{properties:"array"});
W.Data.registerDataTypeSchema("PropertyList",{properties:"array"});
W.Data.registerDataTypeSchema("ColorPropList",{properties:"array"});
W.Data.registerDataTypeSchema("list",{items:"array"});
W.Data.registerDataTypeSchema("StyleList",{styleItems:"object"});
W.Data.registerDataTypeSchema("EditorSettings",{palletsFilterTags:"array",fontsFilterTags:"array",pagesFilterTags:"array"});
W.Data.registerDataTypeSchema("MediaItem",{componentType:"string",dateCreated:"string",description:"",fileName:"string",fileSize:"number",height:"number",width:"number",iconURL:"string",mediaType:"string",mimeType:"string",originalFileName:"string",sourceURL:null,tags:null,title:"",version:null});
W.ComponentData.registerDataTypeSchema("PhotoProperties",{imageSize:{type:"string","enum":["small","medium","large"],"default":"medium",description:"size of the image in runtime"}});
W.ComponentData.registerDataTypeSchema("PageGroupProperties",{transition:{type:"string","enum":["none","swipeHorizontalFullScreen","swipeVerticalFullScreen","crossfade","outIn"],"default":"slide",description:"page transition"}});
W.ComponentData.registerDataTypeSchema("WGooglePlusOneProperties",{size:{type:"string","enum":["small","medium","standard","tall"],"default":"standard",description:"The button size to render"},annotation:{type:"string","enum":["none","bubble","inline"],"default":"inline",description:"The annotation to display next to the button."},width:{type:"string","default":"",description:"If annotation is set to *inline*, the width in pixels to use for the button and its inline annotation. If omitted, a button and its inline annotation use 450px."}});
W.ComponentData.registerDataTypeSchema("WFacebookLikeProperties",{layout:{type:"string","enum":["standard","button_count","box_count"],"default":"standard",description:"the layout of the button"},send:{type:"boolean","default":false,description:"enable/disable the send button"},show_faces:{type:"boolean","default":false,description:"show the faces of your friends that liked this item"},width:{type:"string","default":"225",description:"the width of the Like button"},action:{type:"string","enum":["like","recommend"],"default":"like",description:" the verb to display on the button. Options: *like*, *recommend*"},font:{type:"string","enum":["helvetica","arial","lucida grande","segoe ui","tahoma","trebuchet ms","verdana"],"default":"helvetica",description:"the font to display in the button"},colorScheme:{type:"string","enum":["light","dark"],"default":"light",description:"the color scheme for the like button"}});
W.ComponentData.registerDataTypeSchema("GalleryExpandProperties",{expandEnabled:{type:"boolean","default":true}});
W.ComponentData.registerDataTypeSchema("MatrixGalleryProperties",{"extends":"GalleryExpandProperties",imageMode:{type:"string","default":"clipImage","enum":["clipImage","flexibleWidthFixed"]},numCols:{type:"number","default":3,description:"Number of columns",minimum:1,maximum:10},maxRows:{type:"number","default":2,description:"Maximum number of rows",minimum:1,maximum:10},incRows:{type:"number","default":2,description:"Row number increase",minimum:1,maximum:10},margin:{type:"number","default":15,description:"Margin around each item",minimum:0,maximum:250}});
W.ComponentData.registerDataTypeSchema("SlideShowGalleryProperties",{"extends":"GalleryExpandProperties",imageMode:{type:"string","default":"clipImage","enum":["clipImage","flexibleHeight"]},transition:{type:"string","enum":["none","swipeVertical","swipeHorizontal","crossfade","outIn"],"default":"swipeHorizontal",description:"Transition between items of the gallery"},autoplayInterval:{type:"number","default":"5",minimum:0,maximum:30,description:"Autplay interval"},autoplay:{type:"boolean","default":false,description:""},transDuration:{type:"number",minimum:0,maximum:5,"default":1,description:"Duration of the transition in sec"},bidirectional:{type:"boolean","default":true,description:"Decides whether the transition direction reflects Prev/Next"},reverse:{type:"boolean","default":false,description:"If bidirectional, inverts the direction of transitions"},showAutoplay:{type:"boolean","default":true,description:""},showNavigation:{type:"boolean","default":true,description:""},showCounter:{type:"boolean","default":true,description:""},showExpand:{type:"boolean","default":true,description:""},showSocial:{type:"boolean","default":true,description:""}});
W.ComponentData.registerDataTypeSchema("SliderGalleryProperties",{"extends":"GalleryExpandProperties",imageMode:{type:"string","default":"clipImage","enum":["clipImage","flexibleWidth"]},margin:{type:"number","default":15,description:"Margin around each item",minimum:0,maximum:250},maxSpeed:{type:"number","default":"5",minimum:1,maximum:30,description:"Speed"},aspectRatio:{type:"number",minimum:0.1,maximum:3,"default":1,description:""},aspectRatioPreset:{type:"string","enum":["16:9","4:3","1:1","3:4","9:16"],"default":"4:3"},loop:{type:"boolean","default":true,description:""},showCounter:{type:"boolean","default":true,description:""}});
W.ComponentData.registerDataTypeSchema("EbayItemsBySellerProperties",{headerImage:{type:"string","enum":["0","2","3","4","5","6","7","8","9","10","11"],"default":0,description:"The widget's header"}});
W.ComponentData.registerDataTypeSchema("ButtonProperties",{align:{type:"string","enum":["left","center","right"],"default":"center",description:"alignment of the menu"},margin:{type:"number","default":0,description:"text left and right margins"}});
W.ComponentData.registerDataTypeSchema("WPhotoProperties",{displayMode:{type:"string","enum":["fill","full","stretch","fitWidth"],"default":"fill",description:"displayMode of the photo"}});
W.ComponentData.registerDataTypeSchema("GoogleMapProperties",{showZoom:{type:"boolean","default":true,description:"show zoom control"},showPosition:{type:"boolean","default":true,description:"show position control"},showStreetView:{type:"boolean","default":true,description:"show Street View control"},showMapType:{type:"boolean","default":true,description:"show map type control"},mapDragging:{type:"boolean","default":true,description:"show map type control"},mapType:{type:"string","enum":["ROADMAP","TERRAIN","SATELLITE","HYBRID"],"default":"ROADMAP",description:"show zoom control"}});
W.ComponentData.registerDataTypeSchema("LinkBarProperties",{gallery:{type:"string","default":"clipart",description:"gallery type (photos, icons, backgrounds, etc..)"},iconSize:{type:"number","default":30,description:"Icon Size",minimum:16,maximum:128},spacing:{type:"number","default":5,description:"Spacing",minimum:1,maximum:50},bgScale:{type:"number","default":1,description:"Background scale",minimum:0,maximum:2},orientation:{type:"string","enum":["HORIZ","VERT"],"default":"HORIZ",description:"Orientation"}});
W.ComponentData.registerDataTypeSchema("WTwitterFollowProperties",{showCount:{type:"boolean","default":true,description:"Followers count display"},showScreenName:{type:"boolean","default":true,description:"Show screen name"},textColor:{type:"hexcolor","default":"",description:"HEX color code for the text color"},linkColor:{type:"hexcolor","default":"",description:"HEX color code for the Username link color"},width:{type:"number","default":"100",description:"width of the Follow Button"},dataLang:{type:"string","enum":["en","fr","de","it","es","ko","ja"],"default":"en",description:"The language for the Tweet Button"}});
W.ComponentData.registerDataTypeSchema("TwitterFeedProperties",{numOfTweets:{type:"number","default":"5",description:"Number of tweets in feed"},subject:{type:"string","default":"What's being said about...",description:"subject line"},title:{type:"string","default":"Me...",description:"title line"}});
W.ComponentData.registerDataTypeSchema("WFacebookCommentProperties",{numPosts:{type:"number","default":2,minimum:0,maximum:10,description:"the number of posts display by default"},width:{type:"number","default":"555",description:"the width of the plugin, in pixels"},colorScheme:{type:"string","enum":["light","dark"],"default":"light",description:"the color scheme of the plugin"}});
W.ComponentData.registerDataTypeSchema("HorizontalMenuProperties",{alignButtons:{type:"string","enum":["left","center","right"],"default":"center",description:"alignment of the menu buttons"},alignText:{type:"string","enum":["left","center","right"],"default":"center",description:"alignment of the menu buttons' text"},sameWidthButtons:{type:"boolean","default":false,description:"Keep buttons the same size"},moreButtonLabel:{type:"string","default":"More",description:'Label to use for "more button"'},moreItemHeight:{type:"number","default":15,description:"height of items in the more menu"},stretchButtonsToMenuWidth:{type:"boolean","default":true,description:""}});
W.ComponentData.registerDataTypeSchema("WTwitterTweetProperties",{dataCount:{type:"string","enum":["none","horizontal","vertical"],"default":"horizontal",description:"Count box position"},dataLang:{type:"string","enum":["en","fr","de","it","es","ko","ja"],"default":"en",description:"The language for the Tweet Button"}});
W.ComponentData.registerDataTypeSchema("VideoProperties",{autoplay:{type:"boolean","default":false,description:"video autoplay on load"},loop:{type:"boolean","default":false,description:"play video in a loop"},showinfo:{type:"boolean","default":false,description:"show video title and author"},lightTheme:{type:"boolean","default":false,description:"show video with light theme"},showControls:{type:"string","enum":["always_show","always_hide","temp_show"],"default":"always_show",description:"show / hide controls"}});