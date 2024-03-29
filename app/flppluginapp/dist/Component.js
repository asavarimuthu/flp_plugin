sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","com/sap/flppluginapp/model/models","sap/m/ResponsivePopover","sap/m/Text","sap/m/Button","sap/ui/core/CustomData","sap/ui/core/Element","sap/ui/core/Fragment","sap/ui/model/json/JSONModel"],function(e,t,n,a,r,o,i,s,l,p){"use strict";return e.extend("com.sap.flppluginapp.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);var t=this;this.getRouter().initialize();this.setModel(n.createDeviceModel(),"device");var a=this._getRenderer();a.then(function(e){e.addHeaderItem({id:"btnId",icon:"sap-icon://information",tooltip:"Logged User Information",press:function(e){t.getPopUp(e);t.valueSetter()}},true,false)})},valueSetter:function(){var e=sap.ui.getCore().byId("btnId");var t=new p;e.setModel(t,"UserModel");$.ajax({url:"/odata/v4/getAccountDetails",type:"POST",data:JSON.stringify(data),processData:false,contentType:"application/json",success:function(t,n){var a=t.value;var a={FullName:sap.ushell.Container.getService("UserInfo").getFullName(),UserId:sap.ushell.Container.getService("UserInfo").getId(),Date:new Date,SubDomain:a};e.getModel("UserModel").setData(a)},error:function(e){var t=e.responseText}})},getPopUp:function(e){var t=this;var n=e.getSource(),a=sap.ui.getCore().byId("btnId");if(!this._pPopover){this._pPopover=l.load({id:a.getId(),name:"com.sap.flppluginapp.view.fragments.Popover",controller:this}).then(function(e){a.addDependent(e);return e})}this._pPopover.then(function(e){e.openBy(n)})},_getRenderer:function(){var e=this,t=new jQuery.Deferred,n;e._oShellContainer=jQuery.sap.getObject("sap.ushell.Container");if(!e._oShellContainer){t.reject("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.")}else{n=e._oShellContainer.getRenderer();if(n){t.resolve(n)}else{e._onRendererCreated=function(e){n=e.getParameter("renderer");if(n){t.resolve(n)}else{t.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.")}};e._oShellContainer.attachRendererCreatedEvent(e._onRendererCreated)}}return t.promise()}})});