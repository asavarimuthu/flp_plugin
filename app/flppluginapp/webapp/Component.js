/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/sap/flppluginapp/model/models",
        "sap/m/ResponsivePopover",
        "sap/m/Text",
        "sap/m/Button",
        "sap/ui/core/CustomData",
        "sap/ui/core/Element",
        "sap/ui/core/Fragment",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models,ResponsivePopover,Text,Button,CustomData,Element,Fragment,JSONModel) {
        "use strict";

        return UIComponent.extend("com.sap.flppluginapp.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                var that=this;

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                var rendererPromise = this._getRenderer();
                rendererPromise.then(function(oRenderer) {
                    oRenderer.addHeaderItem({
                        id:"btnId",
                        icon: "sap-icon://information",
                        tooltip: "Logged User Information",
                        press: function(oEvent) {
                            that.getPopUp(oEvent);
                            that.valueSetter();
                        }
                    }, true, false);
                });

            },

            valueSetter:function(){
              
                //Method to get the subaccount details
                var oView=sap.ui.getCore().byId("btnId");

                var oModel = new JSONModel();
                oView.setModel(oModel,"UserModel");
              

                    $.ajax({
                        url: "/odata/v4/getAccountDetails",
                        type: 'POST',
                        data: JSON.stringify(data),
                        processData: false,
                        contentType: 'application/json',
                        success:function(oData, oResponse){
                         var data=oData.value;
                         var data={
                            "FullName":sap.ushell.Container.getService("UserInfo").getFullName(),
                            "UserId":sap.ushell.Container.getService("UserInfo").getId(),
                            "Date":new Date(),
                            "SubDomain":data
                        };
                        oView.getModel("UserModel").setData(data);
                     },
                        error:function(oError){
                         var sMsg=oError.responseText
                     }
                     });

                
            },
            
            getPopUp:function(oEvent){
                var that=this;
                var oButton = oEvent.getSource(),
				//oView = this.getView();
                oView=sap.ui.getCore().byId("btnId");
                

			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "com.sap.flppluginapp.view.fragments.Popover",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
          
			this._pPopover.then(function(oPopover) {
				oPopover.openBy(oButton);
			});
            },
            _getRenderer: function () {
                var that = this,
                    oDeferred = new jQuery.Deferred(),
                    oRenderer;
    
    
                that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
                if (!that._oShellContainer) {
                    oDeferred.reject(
                        "Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
                } else {
                    oRenderer = that._oShellContainer.getRenderer();
                    if (oRenderer) {
                        oDeferred.resolve(oRenderer);
                    } else {
                        // renderer not initialized yet, listen to rendererCreated event
                        that._onRendererCreated = function (oEvent) {
                            oRenderer = oEvent.getParameter("renderer");
                            if (oRenderer) {
                                oDeferred.resolve(oRenderer);
                            } else {
                                oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
                            }
                        };
                        that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
                    }
                }
                return oDeferred.promise();
            }
        });
    }
);