sap.ui.define([
    "./Basecontroller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/v2/ODataModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, JSONModel, MessageBox, Filter, FilterOperator, ODataModel) {
        "use strict";

        return Controller.extend("com.app.booklibrary.controller.Home1", {
            onInit: function () {

                var oModel = new ODataModel("/v2/CentralLibrary/");
                this.getView().setModel(oModel);

                // Optionally, you can set initial data to the model
                const oLocalModel = new JSONModel({
                    Username: "",
                    phone_no: "",
                    email: "",
                    password: ""
                });
                this.getView().setModel(oLocalModel, "localModel");
            },
            //Loading  login fragment for User

            loadFragment: async function (sFragmentName) {
                const oFragment = await Fragment.load({
                    id: this.getView().getId(),
                    name: `com.app.booklibrary.fragments.${sFragmentName}`,
                    controller: this
                });
                this.getView().addDependent(oFragment);
                return oFragment
            },
            loginbutton: async function () {
                if (!this.ologin) {
                    this.ologin = await this.loadFragment("login")
                }
                this.ologin.open()
            },
            onCloseDialog: function () {
                if (this.ologin.isOpen()) {
                    this.ologin.close()
                }
            },
            //Login function for the admin and anvigate to the admin page
            onLogin: function () {
                var oUser = this.getView().byId("idLogin").getValue();  //get input value data in oUser variable
                var oPwd = this.getView().byId("idPassword").getValue();    //get input value data in oPwd variable

                if (oUser === "admin" && oPwd === "admin") {
                    const oRouter = this.getOwnerComponent().getRouter();
                    debugger
                    oRouter.navTo("RouteAdmin")
                    MessageBox.success("Login Successfull");
                } else {
                    MessageBox.error("Re-Enter your Details");
                }

            },
            userloginbutton: async function () {
                if (!this.oUser) {
                    this.oUser = await this.loadFragment("User")
                }
                this.oUser.open()
            },
            onCloseuser: function () {
                if (this.oUser.isOpen()) {
                    this.oUser.close()
                }
            },
            // login functionality for user and navigate to the user page
            onLoginuser: function () {
                var oView = this.getView();

                var sUsername = oView.byId("iduserinput").getValue();  //get input value data in oUser variable
                var sPassword = oView.byId("idpasswordinput").getValue();    //get input value data in oPwd variable

                if (!sUsername || !sPassword) {
                    MessageBox.error("please enter username and password.");
                    return
                }

                var oModel = this.getView().getModel();
                oModel.read("/User", {
                    filters: [
                        new Filter("Username", FilterOperator.EQ, sUsername),
                        new Filter("password", FilterOperator.EQ, sPassword)

                    ],
                    success: function (oData) {
                        if (oData.results.length > 0) {

                            var userId = oData.results[0].ID;

                            MessageBox.success("Login Successful");

                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteUser", { ID: userId })

                        } else {
                            MessageBox.error("Invalid username or password.")
                        }
                    }.bind(this),
                    error: function () {
                        MessageBox.error("An error occured during login.");
                    }
                })
            },
            // Loading the Register Fragment
            ongoregister: async function () {
                if (!this.oRegister) {
                    this.oRegister = await Fragment.load({
                        id: this.getView().getId(),
                        name: "com.app.booklibrary.fragments.Register",
                        controller: this
                    });
                    this.getView().addDependent(this.oRegister);
                }

                this.oRegister.open();
            },
            //closing function for the register fragment
            cancleregister: function () {
                var oView = this.getView();
                var oDialog = oView.byId("registrationDialog");
                if (oDialog) {
                    oDialog.close();
                } else {
                    console.error("Dialog is not available.");
                }
            },
            // accept the register details and store the details
            handleRegisterPress: async function () {
                debugger
                const oPayload = this.getView().getModel("localModel").getProperty("/"),
                    sUsername = oPayload.Username,
                    oModel = this.getView().getModel("ModelV2");


                try {
                    debugger
                    const bUsernameExists = await this.checkUsernameExists(oModel, sUsername);

                    if (bUsernameExists) {
                        MessageBox.error("Username already exists. Please choose a different username.");
                        return;
                    }
                    await this.createData(oModel, oPayload, "/User");
                    // this.getView().byId("idBookTable").getBinding("items").refresh();
                    this.oRegister.close();
                    MessageBox.success("Successfully completed your Registration");
                } catch (error) {
                    this.oRegister.close();
                    MessageBox.error("Please Enter correct Details");
                }
            },
            checkUsernameExists: async function (oModel, sUsername) {
                return new Promise((resolve, reject) => {
                    oModel.read("/User", {
                        filters: [new Filter("Username", FilterOperator.EQ, sUsername)],
                        success: function (oData) {
                            resolve(oData.results.length > 0);
                        },
                        error: function () {
                            reject("An error occurred while checking username existence.");
                        }
                    });
                });
            }

        });
    });
