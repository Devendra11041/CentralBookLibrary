sap.ui.define(
  [
    "./Basecontroller",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel"

  ],
  function (Controller, Token, Filter, FilterOperator, Fragment, MessageBox,MessageToast,ODataModel) {
    "use strict";

    return Controller.extend("com.app.booklibrary.controller.Allbooks", {
      onInit: function () {

        const oTable = this.getView().byId("iduserBookTable");
        oTable.attachBrowserEvent("dblclick", this.onRowDoubleClick.bind(this));

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);

        const oView1 = this.getView();
        const otitle = oView1.byId("iduserTitleFilterValue");
        const oAuthor = oView1.byId("iduserAuthorFilterValue");
        const oGerne = oView1.byId("iduserGenreFilterValue");
        const oisbn = oView1.byId("iduserISBNFilterValue");

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
      },
      onUserDetailsLoad: function (oEvent) {
        const { id } = oEvent.getParameter("arguments");
        this.ID = id;
        // const sRouterName = oEvent.getParameter("name");
        const oObjectPage = this.getView().byId("iduserpage");

        oObjectPage.bindElement(`/User(${id})`);
      },

      //wroking functionalities for multiple search options.
      onGoPress: function () {

        const oView = this.getView(),
          otitleFilter = oView.byId("iduserTitleFilterValue"),
          oAuthorFilter = oView.byId("iduserAuthorFilterValue"),
          oGerneFilter = oView.byId("iduserGenreFilterValue"),
          oisbnFilter = oView.byId("iduserISBNFilterValue"),
          stitle = otitleFilter.getTokens(),
          sAuthor = oAuthorFilter.getTokens(),
          sGerne = oGerneFilter.getTokens(),
          sisbn = oisbnFilter.getTokens(),
          oTable = oView.byId("iduserBookTable"),
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
      // clear function for the multiple input tokens
      onClearPress: function () {

        const oView = this.getView(),
          otitleFilter = oView.byId("iduserTitleFilterValue").destroyTokens(),
          oAuthorFilter = oView.byId("iduserAuthorFilterValue").destroyTokens(),
          oGerneFilter = oView.byId("iduserGenreFilterValue").destroyTokens(),
          oisbnFilter = oView.byId("iduserISBNFilterValue").destroyTokens();
      },
      // close function for the dynamic page
      onpageclose: function () {
        window.history.back();
      },
      //Function for USer Reserv book 
      onReserrveBtnPress: async function (oEvent) {
        debugger;
        var oSelectedItem = oEvent.getSource().getParent();
        var oSelectedUser = oSelectedItem.getBindingContext().getObject();
        var oSelectedBook = this.byId("iduserBookTable").getSelectedItem().getBindingContext().getObject();
        var oModel = this.getView().getModel("ModelV2");
    
        if (!oSelectedBook) {
            MessageToast.show("Please select a Book");
            return;
        }
    
        // Confirmation dialog before proceeding with reservation
        MessageBox.confirm("Are you sure you want to reserve this book?", {
            title: "Confirm Reservation",
            onClose: async function (oAction) {
                if (oAction === MessageBox.Action.OK) {
                    // User confirmed reservation
                    if (this.byId("iduserBookTable").getSelectedItems().length > 1) {
                        MessageToast.show("Please Select only one Book");
                        return;
                    }
    
                    if (oSelectedBook.availability === 0) {
                        MessageToast.show("Book is not available")
                        return;
                    }
    
                    var oQuantity = oSelectedBook.availability - 1;
                    const bIsInActiveLones = await this.bookInactiveLoans(oSelectedBook.ID, this.ID);
    
                    if (bIsInActiveLones) {
                        MessageToast.show("You have an active loan for the selected book.");
                        return;
                    }
    
                    const bIsBookReserved = await this.checkIfBookIsReservedByUser(oSelectedBook.ID, this.ID);
    
                    if (bIsBookReserved) {
                        MessageBox.error("This book is already reserved by you.");
                        return;
                    }
    
                    const userModel = new sap.ui.model.json.JSONModel({
                        user_ID: this.ID,
                        book_ID: oSelectedBook.ID,
                        reservedDate: new Date(),
                        book: {
                            availability: oQuantity
                        }
                    });
    
                    this.getView().setModel(userModel, "userModel");
    
                    const oPayload = this.getView().getModel("userModel").getProperty("/");
    
                    try {
                        await this.createData(oModel, oPayload, "/IssueBook");
                        oModel.refresh();
                        // Update the selected book's context to mark it as reserved
                        sap.m.MessageBox.success(`${oSelectedBook.title} Book Reserved`);
                        this.getView().byId("iduserBookTable").getBinding("items").refresh();
                    } catch (error) {
                        MessageBox.error("Some technical issue occurred.");
                    }
                } else {
                    // User canceled reservation
                    MessageToast.show("Reservation canceled.");
                }
            }.bind(this)  // Bind 'this' to the onClose function to maintain the context
        });
    },
    
    checkIfBookIsReservedByUser: function (bookID, userID) {
        return new Promise((resolve, reject) => {
            const oModel = this.getView().getModel("ModelV2");
            const oFilters = [
                new Filter("book_ID", FilterOperator.EQ, bookID),
                new Filter("user_ID", FilterOperator.EQ, userID)
            ];
    
            oModel.read("/IssueBook", {
                filters: oFilters,
                success: function (oData) {
                    resolve(oData.results.length > 0);
                },
                error: function (oError) {
                    reject(oError);
                }
            });
        });
    },
    
    bookInactiveLoans: function (bookID, userID) {
        return new Promise((resolve, reject) => {
            const oModel = this.getView().getModel("ModelV2");
            const oFilters = [
                new Filter("books_ID", FilterOperator.EQ, bookID),
                new Filter("users_ID", FilterOperator.EQ, userID)
            ];
    
            oModel.read("/ActiveLoans", {
                filters: oFilters,
                success: function (oData) {
                    // Check if any of the loans are still active (no return date)
                    const bIsBorrowed = oData.results.some(loan => !loan.returndate);
                    resolve(bIsBorrowed);
                },
                error: function (oError) {
                    reject(oError);
                }
            });
        });
    },    
      onRowDoubleClick: function () {
        var oSelected = this.byId("iduserBookTable").getSelectedItem();
        var ID = oSelected.getBindingContext().getObject().ID;

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteBookData", {
          BookId: ID,

        })
      }
    });
  }
);
