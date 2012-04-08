var wixLogLegend=(function(){var f=function(){};
var d={};
d.type={error:10,timing:20,funnel:30,userAction:40};
d.category={editor:1,viewer:2,core:3,server:4};
d.issue={defaultVal:0,components:1,managers:2,modal:4,timing:5,skins:6};
d.severity={recoverable:10,warning:20,error:30,fatal:40};
for(var e in d){f[e]=d[e]
}f.getKey=function(b,a){b=d[b]||{};
for(var c in b){if(a==b[c]){return c
}}return""
};
return f
})();
var l=wixLogLegend;
var wixEvents={EDITOR_FLOW_OPEN_NEW:{desc:"FLOW: Mobile editor launch with new site",type:l.type.funnel,category:l.category.editor,biEventId:100,timerId:"main",callLimit:1},EDITOR_FLOW_OPEN_EDIT:{desc:"FLOW: Mobile editor launch with existing site",type:l.type.funnel,category:l.category.editor,biEventId:107,timerId:"main",callLimit:1},EDITOR_FLOW_TEMPLATE_CHOSEN:{desc:"FLOW: Mobile editor template chosen",type:l.type.funnel,category:l.category.editor,biEventId:102,timerId:"main",callLimit:1},EDITOR_FLOW_CATEGORY_CHOSEN:{desc:"FLOW: Mobile editor category chosen",type:l.type.funnel,category:l.category.editor,biEventId:103,timerId:"main",callLimit:1},EDITOR_FLOW_EDIT_PAGE:{desc:"FLOW: Mobile editor edit page step from new site",type:l.type.funnel,category:l.category.editor,biEventId:105,timerId:"main",callLimit:1},EDITOR_FLOW_PUBLISH_PAGE:{desc:"FLOW: Mobile editor publish page step",type:l.type.funnel,category:l.category.editor,biEventId:104,timerId:"main",callLimit:1},EDITOR_FLOW_CONGRATS_PAGE:{desc:"FLOW: Mobile editor congrats page step",type:l.type.funnel,category:l.category.editor,biEventId:101,timerId:"main",callLimit:1},EDITOR_ENTER_PAGE:{desc:"Mobile editor page change",type:l.type.funnel,category:l.category.editor},EMAIL_SEND:{desc:"Site url sent to mail",type:l.type.userAction,category:l.category.editor},BACK_TO_EDIT_FROM_CONGRATS:{desc:"Back to edit page from congrats page",type:l.type.userAction,category:l.category.editor},ADD_PAGE:{desc:"Page added",type:l.type.userAction,category:l.category.editor},REMOVE_PAGE:{desc:"Page removed",type:l.type.userAction,category:l.category.editor},ADD_COMPONENT:{desc:"Component added",type:l.type.userAction,category:l.category.editor},REMOVE_COMPONENT:{desc:"Component removed",type:l.type.userAction,category:l.category.editor},REORDER_COMPONENT:{desc:"Component reorder",type:l.type.userAction,category:l.category.editor},SITE_READY:{desc:"Mobile site ready",type:l.type.timing,category:l.category.viewer,timerId:"load",thresholdTime:5000,thresholdError:"SITE_READY_DELAY",biEventId:303,biAdapter:"mlt"},SITE_DOM_LOADED:{desc:"Mobile site DOM loaded",type:l.type.timing,category:l.category.viewer,timerId:"load",thresholdTime:5000,thresholdError:"SITE_DOM_DELAY",biEventId:301,biAdapter:"mlt"},PREVIEW_READY:{desc:"Mobile preview ready",type:l.type.timing,category:l.category.viewer,timerId:"load",thresholdTime:5000,thresholdError:"PREVIEW_READY_DELAY"},PREVIEW_DOM_LOADED:{desc:"Mobile preview DOM loaded",type:l.type.timing,category:l.category.viewer,timerId:"load",thresholdTime:3000,thresholdError:"PREVIEW_DOM_DELAY"},EDITOR_READY:{desc:"Mobile editor ready",type:l.type.timing,category:l.category.editor,timerId:"load",thresholdTime:8000,thresholdError:"EDITOR_READY_DELAY",biEventId:302,biAdapter:"mlt"},EDITOR_DOM_LOADED:{desc:"Mobile editor DOM loaded",type:l.type.timing,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:300,biAdapter:"mlt"},SAVE_BUTTON_CLICKED_IN_MAIN_WINDOW:{desc:"Save button was clicked in main window",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:201,biAdapter:"hed"},CLOSE_SAVE_DIALOG_CLICKED:{desc:"click close in save dialog",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:202,biAdapter:"hed"},SAVE_CLICKED_IN_SAVE_DIALOG:{desc:"click save in save dialog",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:203,biAdapter:"hed"},PUBLISH_BUTTON_CLICKED_IN_MAIN_WINDOW:{desc:"click on publish button in main window",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:204,biAdapter:"hed"},PUBLISH_BUTTON_CLICKED_IN_PUBLISH_DIALOG:{desc:"click publish in first publish dialog",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:207,biAdapter:"hed"},UPDATE_BUTTON_CLICKED_IN_PUBLISH_DIALOG:{desc:"click update in publish dialog",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:208,biAdapter:"hed"},POST_IN_FB_CLICKED_IN_PUBLISH_SHARE_DIALOG:{desc:"click on post to FB in publish dialog",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:209,biAdapter:"hed"},POST_IN_TWITTER_CLICKED_IN_PUBLISH_SHARE_DIALOG:{desc:"click on post to FB in publish dialog",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:210,biAdapter:"hed"},PREVIEW_BUTTON_CLICKED_IN_MAIN_WINDOW:{desc:"click on preview button in main window",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:211,biAdapter:"hed"},COMPONENT_ADDED:{desc:"add component",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:214,biAdapter:"hed"},COMPONENT_REMOVED:{desc:"remove component",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:215,biAdapter:"hed"},BACKGROUND_CHANGED:{desc:"some change was made in the background ",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:219,biAdapter:"hed"},COLOR_PRESET_CHANGED:{desc:"a color preset was selected",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:220,biAdapter:"hed"},FONT_PRESET_CHANGED:{desc:"a font preset was selected",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:221,biAdapter:"hed"},CUSTOMIZE_FONTS_OPENED:{desc:"customize font panel was opened",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:223,biAdapter:"hed"},CUSTOMIZE_COLORS_OPENED:{desc:"customize colors panel was opened",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:224,biAdapter:"hed"},PAGE_ADDED:{desc:"a page was added",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:222,biAdapter:"hed"},SEO_PANEL_OPENED:{desc:"seo panel was opened",type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:225,biAdapter:"hed"},SEO_CHECKED_IN_SEO_PANEL:{desc:'"allow search engines to find my site" was selected in SEO panel',type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:226,biAdapter:"hed"},SHOW_IN_ALL_PAGES_SELECTED:{desc:'"show in all pages" was selected',type:l.type.userAction,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:227,biAdapter:"hed"}};
var wixErrors={SERVER_NAME_VALIDATION_FAILED:{errorCode:33001,desc:"site name validation failed",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.error},SERVER_NAME_VALIDATION_DEAD:{errorCode:33002,desc:"site name validation failed to many times",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},EDITOR_DOM_DELAY:{errorCode:24001,desc:"Editor DOM not ready in time",type:l.type.timing,category:l.category.editor,issue:l.issue.timing,severity:l.severity.warning},SITE_DOM_DELAY:{errorCode:14001,desc:"Site DOM not ready in time",type:l.type.timing,category:l.category.viewer,issue:l.issue.timing,severity:l.severity.warning},PREVIEW_DOM_DELAY:{errorCode:14003,desc:"Preview DOM not ready in time",type:l.type.timing,category:l.category.viewer,issue:l.issue.timing,severity:l.severity.warning},EDITOR_READY_DELAY:{errorCode:24002,desc:"Editor not ready in time",type:l.type.timing,category:l.category.editor,issue:l.issue.timing,severity:l.severity.warning},SITE_READY_DELAY:{errorCode:14002,desc:"Site not ready in time",type:l.type.timing,category:l.category.viewer,issue:l.issue.timing,severity:l.severity.warning},PREVIEW_READY_DELAY:{errorCode:14004,desc:"Preview not ready in time",type:l.type.timing,category:l.category.viewer,issue:l.issue.timing,severity:l.severity.warning},UNKNOWN_ERROR:{errorCode:10000,desc:"Unknown error",type:l.type.error,category:l.category.viewer,issue:l.issue.components,severity:l.severity.fatal},NO_SKIN:{errorCode:2,desc:"No skin Found",type:l.type.error,category:l.category.viewer,issue:l.issue.components,severity:l.severity.fatal},SKIN_PARAM_REF_NOT_FOUND:{errorCode:150001,desc:"No param ref found for param",type:l.type.error,category:l.category.core,issue:l.issue.skins,severity:l.severity.warning},SKIN_PARAM_MUTATOR_FUNC_NOT_FOUND:{errorCode:150002,desc:"Mutator function was not found on value",type:l.type.error,category:l.category.core,issue:l.issue.skins,severity:l.severity.error},SKIN_PART_MISSING:{errorCode:150003,desc:"Skin did not supply required skinPart",type:l.type.error,category:l.category.core,issue:l.issue.skins,severity:l.severity.error},SKIN_CLASS_RULE_ERROR:{errorCode:150004,desc:"Skin rule write to browser failed",type:l.type.error,category:l.category.viewer,issue:l.issue.skins,severity:l.severity.error},MISSING_METHOD:{errorCode:3,desc:"Method not defined",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.fatal},MANAGERS_INVALID_NAME:{errorCode:1201,desc:"Invalid manager name",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},MANAGERS_INVALID_CLASS:{errorCode:12002,desc:"Invalid manager class: check script loading order",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},MANAGERS_INVALID:{errorCode:12012,desc:"invalid manager",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_INVALID_TYPE:{errorCode:12021,desc:"Invalid class data for",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_INVALID_NAME:{errorCode:12025,desc:"Invalid class name (must start with a capital letter, followed by alphanumeric): ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_NAME_ALREADY_EXIST:{errorCode:12026,desc:"Invalid class name - a class with the same name already exist: ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_DOUBLE_TRAIT_NAME:{errorCode:12027,desc:"Invalid trait name - a trait with the same name already exist: ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_INVALID_PENDING_OBJECT:{errorCode:12028,desc:"Invalid object found on pending list for class",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NAME_ALREADY_EXIST:{errorCode:12031,desc:"Invalid component: component already exist",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NO_EXTEND:{errorCode:12032,desc:"Invalid component extend: no component extend found",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_LOGIC_TYPE:{errorCode:12033,desc:"logic type was not supplied",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_SKIN_TYPE:{errorCode:12034,desc:"skin type was not supplied",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NO_SKINPART:{errorCode:12035,desc:"couldn't find skinPart",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NO_PART:{errorCode:12036,desc:"missing part id or type",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NO_NEW_SKIN:{errorCode:12037,desc:"we currently don't support applying new skins",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NO_DATA:{errorCode:12038,desc:"data is unavailable for skinPart",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_UNKNOWN_STATE_GROUP:{errorCode:11003,desc:"Unknown component state group",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.warning},CM_MALFORMED_STATES:{errorCode:11004,desc:"Malformed state data in component definition",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.warning},CM_DUPLICATE_STATE_NAME:{errorCode:11005,desc:"Duplicate state name in component data",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.warning},CM_UNKNOWN_STATE_NAME:{errorCode:11006,desc:"Unknown state name",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.warning},COMPONENT_PROPERTIES_PROP_NOT_FOUND:{errorCode:11010,desc:"component property not found",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.warning},COMPONENT_PROPERTIES_BAD_PROP_DEF:{errorCode:11011,desc:"bad property definition in component property schema",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.warning},COMPONENT_PROPERTIES_PROP_NOT_VALID:{errorCode:11012,desc:"Invalid property values",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.warning},LT_LINK_UNKNOWN:{errorCode:12041,desc:"LinkTypesManager unknown link subtype",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},LT_INVALID_LINK_TYPE:{errorCode:12042,desc:"LinkTypesManager.getNewLink - invalid linkType:",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},SKIN_ALREADY_EXIST:{errorCode:12051,desc:"Invalid skin: skin name already exist",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},SKIN_PARAM_NOT_PROVIDED:{errorCode:12053,desc:"Skin param error: param not provided for skin with tags",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},SKIN_PROBLEM_WITH_RULE:{errorCode:12054,desc:"problem with creating rule",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},SKIN_ALREADY_IN_USE:{errorCode:12055,desc:"Skin already in use",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},VM_INVALID_SITE_NODE:{errorCode:12061,desc:"Invalid site node",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},VM_INVALID_SITE_DATA:{errorCode:12062,desc:"Invalid site node",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},TRAIT_INVALID:{errorCode:12071,desc:"Invalid trait data",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},TRAIT_DOUBLE_NAME:{errorCode:12073,desc:"Invalid trait name - a trait with the same name already exist: ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},TRAIT_DOUBLE_CLASS_NAME:{errorCode:12074,desc:"Invalid trait name - a class with the same name already exist: ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},UTILS_RULE_ALREADY_EXIST:{errorCode:12081,desc:"Error creating a rule that already exist",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},UTILS_ERR_CREATE_STYLE:{errorCode:12082,desc:"Utils.createStyleSheet(styles.js) error creating stylesheet!",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},UTILS_STYLE_NOT_FOUND:{errorCode:12083,desc:"stylesheet not found on style node in setup",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CONFIG_MANAGER_NO_PARAM:{errorCode:12090,desc:"required param not supplied",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},UPLOAD_FAIL:{errorCode:21011,desc:"upload error",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.fatal},EM_ERROR_CLONE_SITE:{errorCode:22021,desc:"Error cloning site error",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},NO_DEFAULT_SKIN_FOUND:{errorCode:25001,desc:"Default skin not found for component",type:l.type.error,category:l.category.editor,issue:l.issue.skins,severity:l.severity.fatal},STYLE_EXTRA_PARAM_DEFINITION_MISSING:{errorCode:25002,desc:"No extra param definition found for style property",type:l.type.error,category:l.category.editor,issue:l.issue.skins,severity:l.severity.error},PREVIEW_NOT_READY:{errorCode:22031,desc:"Preview error: Preview not ready",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},PREVIEW_INVALID_ID:{errorCode:22032,desc:"Preview error: invalid div id",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},PREVIEW_COMP_NOT_READY:{errorCode:22033,desc:"Preview component not ready",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},PREVIEW_ATTEMPT_LOAD_3_TIMES:{errorCode:22034,desc:"Preview was not loaded after 3 attempts, W is undefined",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},MEDIA_ERR_GETTING_LIST:{errorCode:22043,desc:"Error getting media list",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_CLASS_EMPTY_STRING:{errorCode:23090,desc:"className must be a non empty string",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_CLASS_RESERVED:{errorCode:23091,desc:"is reserved for WClass",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_INVALID_BIND:{errorCode:23092,desc:"is not a function",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_CLASS_MUST_USE_NEW_OP:{errorCode:23093,desc:'Class must be used with the "new" operator',type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_CLASS_DATA_INVALID:{errorCode:23094,desc:"Invalid class data",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},INVALID_TRAIT_USAGE:{errorCode:23095,desc:"Invalid trait usage",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},SERVER_RETURNED_ERROR:{errorCode:30000,desc:"Server returned an error",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_CONNECTION:{errorCode:30011,desc:"Server connection error",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_CALLBACK:{errorCode:30001,desc:"Invalid callbacks: both onComplete and onError must be defined",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SITE_ID_STRING:{errorCode:30002,desc:"Invalid site id: must be a non-empty string",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SITE_ID_GUID:{errorCode:30003,desc:"Invalid site id: must be a valid GUID",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SITE_NAME_STRING:{errorCode:30004,desc:"Invalid site name: must be a non-empty string",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SITE_NAME_VALID:{errorCode:30005,desc:"Invalid site name: use only small letters, digits, _ and -",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SERVICE_URL:{errorCode:30006,desc:"invalid serviceBaseUrl",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_BASE_URL:{errorCode:30007,desc:"Invalid services base url",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},BULK_INVALID_TARGET:{errorCode:13001,desc:"Invalid targets list: must be an array or Elements",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},BULK_TIMEOUT:{errorCode:13002,desc:"Bulk operation has timed out after",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},BULK_NO_METHOD:{errorCode:13003,desc:"No such method on target",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SCHEMA_MISSING_KEY:{errorCode:12001,desc:"value request for key which is not in schema: [key, data, schema]",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SCHEMA_MISSING:{errorCode:12099,desc:"data was inserted with type that does not exist: [schema]",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SCHEMA_UNIMPLEMENTED_RESET:{errorCode:12003,desc:"re-set of data is not implemented yet",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},EDITOR_NO_SKIN:{errorCode:21001,desc:"no skin provided for item",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},EDITOR_MANAGER_MISSING_SITE_HEADER:{errorCode:22001,desc:"Can't find global var 'siteHeader' on window",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},EDITOR_MANAGER_INVALID_FLOW_EVENT:{errorCode:22002,desc:"Invalid flow event",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},EDITOR_MANAGER_NO_TEMPLATE_CHANGE_PAGE:{errorCode:22003,desc:"No site template selected and trying to change page",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},EDITOR_MANAGER_CLONING_SITE:{errorCode:22004,desc:"Error cloning site",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},EDITOR_MANAGER_SAVE_SITE:{errorCode:22005,desc:"Trying to save a site with no id or template or site is not loaded",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},RESOURCE_MANAGER_BUNDLE_NOT_FOUND:{errorCode:22006,desc:"Bundle not found",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},SITE_STRUCTURE_NO_SITE_PAGES:{errorCode:11001,desc:"No SITE_PAGES node found in site",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},IMAGE_LOAD_ERROR:{errorCode:11002,desc:"Image failed to load",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},THEME_MANAGER_UNKNOWN_PROPERTY:{errorCode:12004,desc:"Unknown property",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},THEME_MANAGER_INVALID_PROPERTY:{errorCode:12005,desc:"Invalid property name",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_NO_DATA_FOR_SKIN:{errorCode:12006,desc:"no skin data found for skin",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_MISSING_ARGUMENTS:{errorCode:12007,desc:"missing arguments for skin",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_RE_REGISTER:{errorCode:12008,desc:"can not re-register skin for component",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_METHOD_CALLED_AGAIN:{errorCode:12009,desc:"method cannot be called more than once",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_NO_INLINE_CONTENT_SKINPART_FOUND:{errorCode:12010,desc:"component has inline content, but is missing the inlineContent skinPart",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},VIEW_MANAGER_INVALID_PAGE:{errorCode:12011,desc:"invalid pageId and/or URL",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},WIXIFY_INVALID_DATA_TYPE:{errorCode:13004,desc:"data type provided didn't match component acceptable data types",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},WIXIFY_MISSING_DATA_TYPE:{errorCode:13012,desc:"The provided data object does not contain a data type",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.warning},WIXIFY_NO_COMP:{errorCode:13005,desc:"no comp attribute found",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},WIXIFY_NO_SKIN:{errorCode:13006,desc:"no skin attribute found",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},WIXIFY_ALREADY_WIXIFIED:{errorCode:13007,desc:"node has already been wixified",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},WIXIFY_TIMEOUT:{errorCode:13008,desc:"node was not wixified on time",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},SITE_NAME_NO_SELECTED_CATEGORY:{errorCode:21002,desc:"no category selected",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},EDITOR_INDEX_OUT_OF_RANGE:{errorCode:21003,desc:"The index provided was out of range",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.recoverable},COMMAND_DUPLICATE:{errorCode:13009,desc:"command is already defined",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},BAD_COMMAND:{errorCode:13010,desc:"command is neither string nor a Command object",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},MISSING_COMMAND:{errorCode:13011,desc:"A command with this name was not found",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},DM_MALFORMED_QUERY:{errorCode:12013,desc:"Malformed data query",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},CM_NO_DICTIONARY_DATA:{errorCode:12039,desc:"dictionary data is unavailable for skinPart",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},INVALID_METADATA_FIELD:{errorCode:12015,desc:"invalid metadata field name",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},DATA_MISSING_SNAPSHOT:{errorCode:12016,desc:"Missing snapshot for data item",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},GET_ALPHA_OF_NOT_COLOR_PROPERTY:{errorCode:12017,desc:"Attempt to access opacity of a property that is not of type color",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},SET_ALPHA_OF_NOT_COLOR_PROPERTY:{errorCode:12018,desc:"Attempt to set opacity of a property that is not of type color",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},SET_BOX_SHADOW_TOGGLE_OF_NOT_BOX_SHADOW_PROPERTY:{errorCode:12019,desc:"Attempt to set box shadow toggle on of a property that is not of type box shadow",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},DRAGGABLE_COMPONENT_MISSING_HANDLE_ERROR:{errorCode:11020,desc:"Draggable component don't define a drag handle skin part",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},MEDIA_GALLERY_MISSING_CONFIG:{errorCode:21004,desc:"Media Dialog opened without config",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},STYLE_ALREADY_EXISTS:{errorCode:21005,desc:"Attempt to create a style that already exists",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error}};
var WixGoogleAnalytics=function(p,n,o,r,s,q,m){this._wixAccounts=p;
this._userAccounts=n;
this._version=o;
this._userType=r;
this._userLanguage=s;
this._sendPageTrackToUser=q;
this._sendPageTrackToWix=m;
if(!window._gaq){var k=document.createElement("script");
k.type="text/javascript";
k.async=true;
k.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";
var j=document.getElementsByTagName("script")[0];
j.parentNode.insertBefore(k,j)
}};
WixGoogleAnalytics.prototype.sendEvent=function(m,i){var g=wixLogLegend.getKey("type",m.type);
var j=m.desc;
var h=i.label;
var k=i.value||i.time;
this._sendAnalyticEvent(g,j,h,k)
};
WixGoogleAnalytics.prototype.sendError=function(o,q,j,k){var p=wixLogLegend.getKey("type",o.type);
var m=o.desc;
var i=q+"."+j+" : "+k.label;
var n=k.value||k.time;
this._sendAnalyticEvent(p,m,i,n)
};
WixGoogleAnalytics.prototype.sendPageEvent=function(c){window._gaq=window._gaq||[];
var d=function(a,j,h){for(var i=0;
i<a.length;
++i){if(a[i].length>0){var b=(i==0)?"":"t"+i+".";
window._gaq.push([b+"_setAccount",a[i]]);
window._gaq.push([b+"_setAllowAnchor",true]);
if(h){window._gaq.push([b+"_setCustomVar",1,"version",this._version,1]);
window._gaq.push([b+"_setCustomVar",2,"language",this._userLanguage,1]);
window._gaq.push([b+"_setCustomVar",3,"userType",this._userType,1])
}window._gaq.push([b+"_trackPageview",j])
}}}.bind(this);
if(this._sendPageTrackToUser){d(this._userAccounts,c,false)
}else{if(this._sendPageTrackToWix){d(this._wixAccounts,c,true)
}}};
WixGoogleAnalytics.prototype._sendAnalyticEvent=function(i,h,o,k){i=i||"";
h=h||"";
o=o||"";
k=k||0;
var j=function(c,a,f,e,d,b){window._gaq=window._gaq||[];
window._gaq.push([c+"_setAccount",a]);
window._gaq.push([c+"_setCustomVar",1,"version",this._version,1]);
window._gaq.push([c+"_setCustomVar",2,"language",this._userLanguage,1]);
window._gaq.push([c+"_setCustomVar",3,"userType",this._userType,1]);
window._gaq.push([c+"_trackEvent",f,e,d,b])
};
if(this._wixAccounts){for(var n=0;
n<this._wixAccounts.length;
++n){var m=(n==0)?"":"t"+n+".";
j(m,this._wixAccounts[n],i,h,o,k)
}}};
var WixBILogger=function(q,m,s,n,o,k,p,j,r){j=encodeURIComponent(j);
r=r?r:3;
this.logScript=null;
this._floggerServerURL=(q.charAt(q.length-1)!=="/")?q+"/":q;
this._commonFieldsFiltersByAdapter={hed:["src","evid","ts","esi"],trg:["src","did","uid","gsi","cid","ver","lng","evid","ts","esi","cat","errc","iss","sev","errscp","trgt","dsc"]};
this._common={src:r,did:s,uid:n,gsi:k,cid:p,ver:m,lng:"en-US",evid:0,ts:0};
this._keyArray={errorKeys:["errc","iss","sev","dsc"],funnelKeys:["g1","i1","c1"]}
};
WixBILogger.prototype.setSrc=function(b){this._common.src=b
};
WixBILogger.prototype.setDocId=function(b){this._common.did=b
};
WixBILogger.prototype.setMetaSiteId=function(b){this._common.msid=b
};
WixBILogger.prototype.setEditorSessionId=function(b){this._common.esi=b
};
WixBILogger.prototype.sendError=function(o,v,r,u,n){if(!o){return
}this._common.evid=o.type||10;
var m=o.category;
this._common.cat=m;
this._common.ts=u.time||LOG.getSessionTime();
var q=n||o.httpResponse||0;
var s=o.errorCode;
var t;
if(typeof u=="string"){t=u
}else{t=(W&&W.Utils)?W.Utils.getStackTrace():""
}t=encodeURI(t);
var w={errc:s,iss:o.issue,sev:o.severity,errscp:v,trgt:r,dsc:t};
var p=this._combineObjectToString(w);
this._createReport("trg",p,this._common)
};
WixBILogger.prototype.sendEvent=function(e,g){var h=this.generateEventString(e,g);
var f=e.biAdapter?e.biAdapter:"mee";
this._createReport(f,h,this._common)
};
WixBILogger.prototype.generateEventString=function(d,f){if(!d){return""
}f=f||{};
var e=[f.g1,f.i1,f.c1];
this._common.evid=d.biEventId;
this._common.ts=f.time;
return this._combineArraysToString(this._keyArray.funnelKeys,e)
};
WixBILogger.prototype._createReport=function(f,g,e){var h=this._objToURLParamsStringWithFilter(e,this._commonFieldsFiltersByAdapter[f]);
this._createHit(this._floggerServerURL+f+"?"+h+g)
};
WixBILogger.prototype._createHit=function(c){if(debugMode&&!(debugMode=="unit_test")){var d=new Image(0,0);
d.src=c
}};
WixBILogger.prototype._combineArraysToString=function(f,h){var i="";
for(var g=0;
g<f.length;
g++){var j=(!h[g]&&h[g]!==0)?"":h[g];
i=i+f[g]+"="+j+"&"
}return i
};
WixBILogger.prototype._combineObjectToString=function(f){var e=[];
for(var d in f){e.push(d+"="+f[d])
}return e.join("&")
};
WixBILogger.prototype._objToURLParamsStringWithFilter=function(j,g){var h="";
for(var f in j){if(!g||(g.indexOf(f)!=-1)){var i=(!j[f]&&j[f]!==0)?"":j[f];
h+=f+"="+i+"&"
}}return h
};
var WixLogger=function(d){this.reset();
this._settings=d;
this.setDebugMode(d.debugMode||false);
try{this._analytics=new WixGoogleAnalytics(d.wixAnalytics,d.userAnalytics,d.version,d.userType,d.userLanguage,d.sendPageTrackToUser,d.sendPageTrackToWix)
}catch(f){this._analytics={sendError:function(){},sendEvent:function(){}}
}try{this._wixBI=new WixBILogger(d.floggerServerURL,d.version,d.siteId,d.userId,d.userType,d.session,d.computerId,d.creationSource,d.wixAppId)
}catch(e){this._wixBI={setDocId:function(){},sendError:function(){},sendEvent:function(){}}
}};
WixLogger.prototype.reset=function(){this._logList=[];
this._timeData={};
this._initTime=new Date().getTime()
};
WixLogger.prototype.getSessionTime=function(){return new Date().getTime()-this._initTime
};
WixLogger.prototype.updateSetting=function(f,d){var e=this._settings||{};
e[f]=d;
switch(f){case"siteId":this._wixBI.setDocId(d);
break;
case"wixAppId":this._wixBI.setSrc(d);
break;
case"editorSessionId":this._wixBI.setEditorSessionId(d);
break;
case"metaSiteId":this._wixBI.setMetaSiteId(d);
break
}};
WixLogger.prototype.getLog=function(){return this._logList.concat()
};
WixLogger.prototype.clearLog=function(){this._logList=[]
};
WixLogger.prototype.setDebugMode=function(b){this._debugMode=b
};
WixLogger.prototype.reportError=function(h,e,f,g){g=g||{};
if(this._handleLogObj("reportError",h,g,{className:e,methodName:f})){this._wixBI.sendError(h,e,f,g);
this._analytics.sendError(h,e,f,g);
this._settings.onError&&this._settings.onError(h,e,f,g)
}if(this._debugMode){return null
}return function(){}
};
WixLogger.prototype.reportEvent=function(d,c){c=c||{};
if(this._handleLogObj("reportEvent",d,c)){if(d.biEventId){this._wixBI.sendEvent(d,c)
}this._analytics.sendEvent(d,c);
this._settings.onEvent&&this._settings.onEvent(d,c)
}};
WixLogger.prototype.reportPageEvent=function(b){this._analytics.sendPageEvent(b)
};
WixLogger.prototype.addErrors=function(b){Object.forEach(b,this.addError.bind(this))
};
WixLogger.prototype.addError=function(c,d){if(!(d in this._settings.errors)&&this.isUniqueErrorCode(c.errorCode)){this._settings.errors[d]=c
}else{throw new Error("Invalid error object: "+d)
}};
WixLogger.prototype.isUniqueErrorCode=function(b){return Object.every(this._settings.errors,function(a){return b!==a.errorCode
})
};
WixLogger.prototype._handleLogObj=function(j,g,i,h){if(!g){return false
}g.callCount=g.callCount||0;
if(g.callLimit&&g.callLimit<=g.callCount){return false
}else{this._checkTime(g,i);
this._logLog(j,g,i,h);
if((g.thresholdTime||g.thresholdTime==0)&&i.time>=g.thresholdTime){if(g.thresholdError){var f=this._settings.errors[g.thresholdError];
this.reportError(f)
}}g.callCount++
}return true
};
WixLogger.prototype._logLog=function(){this._logList.push(arguments)
};
WixLogger.prototype._checkTime=function(d,c){c=c||{};
c.time=this._getTime(d.timerId)
};
WixLogger.prototype._getTime=function(e){e=e||"initTime";
var d=this._initTime;
var f=new Date().getTime();
if(e!="initTime"){d=this._timeData[e]||this._initTime;
this._timeData[e]=f
}return f-d
};
Object.merge(wixErrors,{INVALID_INPUT_BIND:{errorCode:26001,desc:"Invalid input field bind",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},STYLES_DO_NOT_EXIST:{errorCode:26002,desc:"Styles were not retrieved from editor data",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},COMPONENT_STYLES_DO_NOT_EXIST:{errorCode:26003,desc:"Component styles were not retrieved from editor data",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},AUTOPANEL_SKIN_DOES_NOT_EXIST:{errorCode:26004,desc:"Skin defined in generator does not exist",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},AUTOPANEL_SKIN_STYLES_DOES_NOT_EXIST:{errorCode:26005,desc:"Skin collection defined in generator does not exist",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},CKEDITOR__FAILED_DESTROY:{errorCode:26006,desc:"ck-editor destroy failed, entered catch block",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.warning}});