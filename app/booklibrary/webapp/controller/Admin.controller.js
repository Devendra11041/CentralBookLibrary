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
                    total_books: ""
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
                const oPayload = this.getView().getModel("localModel").getProperty("/"),
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
                window.history.back();
            },
            onRowDoubleClick: function () {
                var oSelected = this.byId("idBookTable").getSelectedItem();
                var ID = oSelected.getBindingContext().getObject().ID;

                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteBookData", {
                    BookId: ID,

                })
            },
            onGoPreseeActive: async function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteActiveLoans");
            },
            //loading the edit fragment
            onEditPress: async function () {
                var oTable = this.byId("idBookTable");
                var oSelectedItem = oTable.getSelectedItem();

                if (!oSelectedItem) {
                    sap.m.MessageToast.show("Please select a row to edit.");
                    return;
                }
                var oSelectedData = oSelectedItem.getBindingContext().getObject();

                if (!this.oedit) {
                    this.oedit = await Fragment.load({
                        id: this.getView().getId(),
                        name: "com.app.booklibrary.fragments.edit",
                        controller: this
                    });
                    this.getView().addDependent(this.oedit);
                }

                // Set the model with selected row data
                var oModel = new sap.ui.model.json.JSONModel(oSelectedData);
                this.oedit.setModel(oModel, "editModel");

                this.oedit.open();
            },
            onCancelPress: function () {
                if (this.oedit.isOpen()) {
                    this.oedit.close()
                }

            },
            onSavePress: function () {
                // Get the view and table
                var oView = this.getView();
                var oTable = oView.byId("idBookTable");

                // Get the selected item
                var oSelectedItem = oTable.getSelectedItem();

                if (!oSelectedItem) {
                    console.error("No row selected.");
                    return;
                }

                // Get the binding context of the selected item
                var oContext = oSelectedItem.getBindingContext();

                // Get the edited data from the dialog
                var oEditedData = {
                    Author: oView.byId("authorInput").getValue(),
                    Genre: oView.byId("genreInput").getValue(),
                    Language: oView.byId("languageInput").getValue(),
                    Price: parseFloat(oView.byId("priceInput").getValue()),
                    total_books: parseInt(oView.byId("pricebook").getValue())
                };

                // Update specific properties of the selected row
                oContext.getModel().setProperty(oContext.getPath() + "/Author", oEditedData.Author);
                oContext.getModel().setProperty(oContext.getPath() + "/Genre", oEditedData.Genre);
                oContext.getModel().setProperty(oContext.getPath() + "/Language", oEditedData.Language);
                oContext.getModel().setProperty(oContext.getPath() + "/Price", oEditedData.Price);
                oContext.getModel().setProperty(oContext.getPath() + "/total_books", oEditedData.total_books);

                // Close the dialog
                var oDialog = oView.byId("editDialog");
                if (oDialog.isOpen()) {
                    oDialog.close();
                }
            }
        });
    }
);