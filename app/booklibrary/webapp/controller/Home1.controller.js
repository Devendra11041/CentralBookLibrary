sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment) {
        "use strict";

        return Controller.extend("com.app.booklibrary.controller.Home1", {
            onInit: function () {

            },
            loadFragment: async function (sFragmentName) {
                const oFragment = await Fragment.load({
                    id: this.getView().getId(),
                    name: `com.app.booklibrary.fragments.${sFragmentName}`,
                    controller: this
                });
                this.getView().addDependent(oFragment);
                return oFragment
            },
            loginbutton: async function(){
                if (!this.ologin){
                    this.ologin= await this.loadFragment("login")
                }
                this.ologin.open()
            },
            onCloseDialog: function(){
                if(this.ologin.isOpen()){
                    this.ologin.close()
                }
            },
            onLogin: function(){
                var oUser = this.getView().byId("idLogin").getValue();  //get input value data in oUser variable
                var oPwd = this.getView().byId("idPassword").getValue();    //get input value data in oPwd variable
               
                if(oUser==="admin" && oPwd==="admin"){              
                    const oRouter = this.getOwnerComponent().getRouter();
                    debugger
                    oRouter.navTo("RouteAdmin")
                }else{
                    sap.m.MessageToast.show("Re-Enter your Details")
                }

            },
            userloginbutton: async function(){
                if (!this.oUser){
                    this.oUser= await this.loadFragment("User")
                }
                this.oUser.open()
            },
            onCloseuser: function(){
                if(this.oUser.isOpen()){
                    this.oUser.close()
                }
            },
            onLoginuser: function(){
                var oUser = this.getView().byId("iduserinput").getValue();  //get input value data in oUser variable
                var oPwd = this.getView().byId("idpasswordinput").getValue();    //get input value data in oPwd variable
               
                if(oUser==="user" && oPwd==="user"){              
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteUser")
                }else{
                    sap.m.MessageToast.show("Re-Enter your Details")
                }
            }
        });
    });
