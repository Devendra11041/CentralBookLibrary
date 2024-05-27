sap.ui.define([
    "sap/ui/core/mvc/Controller",
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
    function (Controller, Fragment, JSONModel, MessageBox, Filter,FilterOperator,ODataModel) {
        "use strict";

        return Controller.extend("com.app.booklibrary.controller.Home1", {
            onInit: function () {

                var oModel = new ODataModel("/v2/CentralLibrary/");
                this.getView().setModel(oModel);

                var oModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oModel, "localModel");

                // Optionally, you can set initial data to the model
                oModel.setData({
                    userName: "",
                    phoneNumber: "",
                    email: "",
                    password: "",
                    rePassword: ""
                });
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
                // Get the view and the local model
                var oView = this.getView();
                var oModel = oView.getModel("localModel");

                // Get the registration data from the input fields
                var sUserName = oView.byId("userNameInput").getValue();
                var sPhoneNumber = oView.byId("phoneNumberInput").getValue();
                var sEmail = oView.byId("emailInput").getValue();
                var sPassword = oView.byId("passwordInput").getValue();
                var sRePassword = oView.byId("rePasswordInput").getValue();

                // Perform validation
                if (!sUserName || !sPhoneNumber || !sEmail || !sPassword || !sRePassword) {
                    MessageBox.error("Please fill in all fields");
                    return;
                }

                if (sPassword !== sRePassword) {
                    MessageBox.error("Password does not match, Please Try again");
                    return;
                }

                // Store the registration data in the local model
                oModel.setProperty("/userName", sUserName);
                oModel.setProperty("/phoneNumber", sPhoneNumber);
                oModel.setProperty("/email", sEmail);
                oModel.setProperty("/password", sPassword);

                // Optionally, you can clear the input fields after registration
                oView.byId("userNameInput").setValue("");
                oView.byId("phoneNumberInput").setValue("");
                oView.byId("emailInput").setValue("");
                oView.byId("passwordInput").setValue("");
                oView.byId("rePasswordInput").setValue("");

                // Show a success message
                MessageBox.success("Registration Successfull");
            }


        });
    });
