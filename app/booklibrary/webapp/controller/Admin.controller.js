sap.ui.define([
    "./Basecontroller",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast"


],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Token, Filter, FilterOperator, JSONModel, Fragment, MessageBox, ODataModel, MessageToast) {
        "use strict";

        return Controller.extend("com.app.booklibrary.controller.Admin", {
            onInit: function () {

                this.oQuantity = null;
                this.oAq = null;

                //Function for loading the multiple inputs or tokens
                const oView1 = this.getView();
                const otitle = oView1.byId("idTitleFilterValue");
                const oAuthor = oView1.byId("idAuthorFilterValue");
                const oGerne = oView1.byId("idGenreFilterValue");
                const oisbn = oView1.byId("idISBNFilterValue");

                let validate = function (arg) {
                    if (true) {
                        var text = arg.text;
                        return new Token({ key: text, text: text });
                    }
                }
                otitle.addValidator(validate);
                oAuthor.addValidator(validate);
                oGerne.addValidator(validate);
                oisbn.addValidator(validate);

                // Creating the Json Model
                const oLocalModel = new JSONModel({
                    ID: "",
                    title: "",
                    Author: "",
                    ISBN: "",
                    Price: "",
                    genre: "",
                    Language: "",
                    total_books: "",
                    availability: ""
                });
                this.getView().setModel(oLocalModel, "localModel");

                const oTable = this.getView().byId("idBookTable");
                oTable.attachBrowserEvent("dblclick", this.onRowDoubleClick.bind(this));

            },
            // Function for searching the multiple items
            onGoPress: function () {

                const oView = this.getView(),
                    otitleFilter = oView.byId("idTitleFilterValue"),
                    oAuthorFilter = oView.byId("idAuthorFilterValue"),
                    oGerneFilter = oView.byId("idGenreFilterValue"),
                    oisbnFilter = oView.byId("idISBNFilterValue"),
                    stitle = otitleFilter.getTokens(),
                    sAuthor = oAuthorFilter.getTokens(),
                    sGerne = oGerneFilter.getTokens(),
                    sisbn = oisbnFilter.getTokens(),
                    oTable = oView.byId("idBookTable"),
                    aFilters = [];
                stitle.filter((ele) => {
                    ele ? aFilters.push(new Filter("title", FilterOperator.EQ, ele.getKey())) : "";

                })

                sAuthor.filter((ele) => {
                    ele ? aFilters.push(new Filter("Author", FilterOperator.EQ, ele.getKey())) : "";

                })

                sGerne.filter((ele) => {
                    ele ? aFilters.push(new Filter("genre", FilterOperator.EQ, ele.getKey())) : "";
                })

                sisbn.filter((ele) => {
                    ele ? aFilters.push(new Filter("ISBN", FilterOperator.EQ, ele.getKey())) : "";
                })
                oTable.getBinding("items").filter(aFilters);
            },
            // Clearing the multiple inputs
            onClearPress: function () {
                const view = this.getView();

                if (!view) {
                    // Handle the case where the view is not available
                    return;
                }
                const filterIds = [
                    "idTitleFilterValue",
                    "idAuthorFilterValue",
                    "idGenreFilterValue",
                    "idISBNFilterValue"
                ];
                filterIds.forEach(filterId => {
                    const filterControl = view.byId(filterId);

                    if (filterControl) {
                        filterControl.removeAllTokens();
                    } else {
                        console.error(`Filter control with ID ${filterId} not found.`);
                    }
                });
            },
            //Loading the create fragment
            onCreateBtnPress: async function () {
                if (!this.ocreate) {
                    this.ocreate = await Fragment.load({
                        id: this.getView().getId(),
                        name: "com.app.booklibrary.fragments.create",
                        controller: this
                    });
                    this.getView().addDependent(this.ocreate);
                }

                this.ocreate.open();
            },
            onCloseBook: function () {
                if (this.ocreate.isOpen()) {
                    this.ocreate.close()
                }
            },
            //Creating or adding the book 
            onCreateBook: async function () {
                debugger
                const oPayload = this.getView().getModel("localModel").getProperty("/");
                const isEmpty = Object.values(oPayload).some(value => value === "");

                if (isEmpty) {
                    MessageBox.error("Please fill in all fields.");
                    return;
                }
                oModel = this.getView().getModel("ModelV2");

                try {
                    debugger
                    await this.createData(oModel, oPayload, "/Book");
                    this.getView().byId("idBookTable").getBinding("items").refresh();
                    this.ocreate.close();
                    MessageBox.success("book added successfully");
                } catch (error) {
                    this.ocreate.close();
                    MessageBox.error("Some technical Issue");
                }
            },
            //Delete the selected row
            onDeleteButtonPress: async function () {

                var oSelected = this.byId("idBookTable").getSelectedItem();
                if (oSelected) {
                    var oISBN = oSelected.getBindingContext().getObject().ID;

                    oSelected.getBindingContext().delete("$auto").then(function () {
                        MessageBox.success(oISBN + " SuccessFully Deleted");
                    },
                        function (oError) {
                            MessageBox.error("Deletion Error: ", oError);
                        });
                    this.getView().byId("idBookTable").getBinding("items").refresh();

                } else {
                    MessageBox.error("Please Select a Row to Delete");
                }

            },
            // close function for the dynamic page
            onclosepage: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteHome1", {}, true);
            },
            //click the row you navigates to the books page
            onRowDoubleClick: function () {
                var oSelected = this.byId("idBookTable").getSelectedItem();
                var ID = oSelected.getBindingContext().getObject().ID;

                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteBookData", {
                    BookId: ID,

                })
            },
            //Routing to the active loans page
            onGoPreseeActive: async function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteActiveLoans");
            },
            //Closing the edit fragment
            onCancelPress: function () {
                if (this.oedit.isOpen()) {
                    this.oedit.close()
                }

            },
            //loading the edit fragment
            onEditPress: async function () {
                var oSelected = this.byId("idBookTable").getSelectedItems();
                if (oSelected.length === 0) {
                    MessageBox.error("Please Select atleast one Book to Edit");
                    return
                }
                var oSelect = oSelected[0]
                if (oSelect) {
                    var oAuthor = oSelect.getBindingContext().getProperty("Author");
                    var oGenre = oSelect.getBindingContext().getProperty("genre");
                    var oLanguage = oSelect.getBindingContext().getProperty("Language");
                    var oPrice = oSelect.getBindingContext().getProperty("Price");
                    this.oQuantity = oSelect.getBindingContext().getProperty("total_books");
                    var oISBN = oSelect.getBindingContext().getProperty("ISBN");
                    var oBookname = oSelect.getBindingContext().getProperty("title");
                    var oID = oSelect.getBindingContext().getProperty("ID");
                    this.oAq = oSelect.getBindingContext().getProperty("availability");

                    var newBookModel = new sap.ui.model.json.JSONModel({
                        ID: oID,
                        Author: oAuthor,
                        genre: oGenre,
                        Language: oLanguage,
                        Price: oPrice,
                        total_books: this.oQuantity,
                        ISBN: oISBN,
                        title: oBookname,
                        availability: this.oAq

                    });

                    this.getView().setModel(newBookModel, "newBookModel");

                    if (!this.oedit) {
                        this.oedit = await this.loadFragment("edit"); // Load your fragment asynchronously
                    }

                    this.oedit.open();
                    var oPayload = this.getView().getModel("newBookModel").getData();
                    console.log(oPayload)
                }
            },
            // Saving function for edit values.
            onSavePress: function () {
                console.log(this.oQuantity)
                console.log(this.oAq)
                var oQ = parseInt(this.getView().byId("totalbookInput").getValue());
                var oAq = parseInt(this.getView().byId("availabilitynput").getValue());
                if (this.oQuantity < oQ) {
                    oQ = oQ - this.oQuantity
                    oAq = oAq + oQ
                }
                else if (this.oQuantity > oQ) {
                    oQ = this.oQuantity - oQ
                    oAq = oAq - oQ
                }
                else {
                    oAq = oAq
                }
                console.log(oQ)
                var oPayload = this.getView().getModel("newBookModel").getData();
                oPayload.availability = oAq
                this.getView().getModel("newBookModel").setData(oPayload);
                var oDataModel = this.getOwnerComponent().getModel("ModelV2");// Assuming this is your OData V2 model
                console.log(oDataModel.getMetadata().getName());

                try {
                    // Assuming your update method is provided by your OData V2 model
                    oDataModel.update("/Book(" + oPayload.ID + ")", oPayload, {
                        success: function () {
                            this.getView().byId("idBookTable").getBinding("items").refresh();
                            this.oedit.close();
                            MessageBox.success("Book Data Updated successfully")
                        }.bind(this),
                        error: function (oError) {
                            this.oedit.close();
                            sap.m.MessageBox.error("Failed to update book: " + oError.message);
                        }.bind(this)
                    });
                } catch (error) {
                    this.oedit.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }


                var oDataModel = new sap.ui.model.odata.v2.ODataModel({
                    serviceUrl: "https://port4004-workspaces-ws-rntqs.us10.trial.applicationstudio.cloud.sap/v2/CentralLibrary",
                    defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
                    // Configure message parser
                    messageParser: sap.ui.model.odata.ODataMessageParser
                })
            },
            // Loading function for issubook fragment
            onIssueBook: async function () {
                if (!this.oissuebook) {
                    this.oissuebook = await this.loadFragment("issuebook");
                }

                this.oissuebook.open();
            },
            //close function for issue book fragment
            onissuebookscancelbtn: function () {
                if (this.oissuebook.isOpen()) {
                    this.oissuebook.close()
                }
            },
            //Admin Issue the book
            onReservebtnpress: async function (oEvent) {
                console.log(this.byId("issuebooksTable").getSelectedItem().getBindingContext().getObject())
                if (this.byId("issuebooksTable").getSelectedItems().length > 1) {
                    MessageToast.show("Please Select only one Book");
                    return
                }
                var oSelectedBook = this.byId("issuebooksTable").getSelectedItem().getBindingContext().getObject(),
                    oAval = oSelectedBook.book.availability - 1;

                var current = new Date();
                let due = new Date(current.getFullYear(), current.getMonth() + 1)

                const userModel = new sap.ui.model.json.JSONModel({
                    books_ID: oSelectedBook.book.ID,
                    users_ID: oSelectedBook.user.ID,
                    issuseDate: new Date(),
                    DueDate: due,
                    books: {
                        availability: oAval
                    }

                });
                this.getView().setModel(userModel, "userModel");

                const oPayload = this.getView().getModel("userModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");

                try {
                    await this.createData(oModel, oPayload, "/ActiveLoans");
                    sap.m.MessageBox.success("Book Issued successfully");

                    this.byId("issuebooksTable").getSelectedItem().getBindingContext().delete("$auto");
                    oModel.update("/Book(" + oSelectedBook.book.ID + ")", oPayload.books, {
                        success: function () {

                        },
                        error: function (oError) {
                            //this.oEditBooksDialog.close();
                            sap.m.MessageBox.error("Failed to update book: " + oError.message);
                        }.bind(this)
                    });
                } catch (error) {
                    //this.oCreateBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
            }

        });
    }
);