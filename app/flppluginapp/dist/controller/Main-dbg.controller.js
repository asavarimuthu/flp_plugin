sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("com.sap.flppluginapp.controller.Main", {
            onInit: function () {
                var that=this;
                var oModel = new JSONModel();
                this.getView().setModel(oModel,"UserModel");
              var data={};
                $.ajax({
                    url: "/odata/v4/getAccountDetails",
                    type: 'POST',
                    data: JSON.stringify(data),
                    processData: false,
                    contentType: 'application/json',
                    success:function(oData, oResponse){
                     var data=oData.value;
                     var data={
                        "FullName":(sap.ushell.Container)?sap.ushell.Container.getService("UserInfo").getFullName():"Savarimuthu",
                        "UserId":(sap.ushell.Container)?sap.ushell.Container.getService("UserInfo").getId():"asavarimuthu@gmail.com",
                        "Date":new Date(),
                        "SubDomain":data
                    };
                    that.getView().getModel("UserModel").setData(data);
                 },
                    error:function(oError){
                     var sMsg=oError.responseText
                 }
                 });

            }

        });
    });
