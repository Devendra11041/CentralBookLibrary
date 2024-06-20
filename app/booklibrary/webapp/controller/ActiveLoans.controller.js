sap.ui.define(
  [
    "./Basecontroller"
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("com.app.booklibrary.controller.ActiveLoans", {
      onInit: function () {

      },
      //Loan closing function
      // onpresscloseLoan: async function () {
      //   debugger
      //   var obj = this.byId("idUserLoans").getSelectedItem().getBindingContext().getObject(),
      //     oId = obj.books.ID,
      //     oAvaiable = obj.books.availability + 1;
      //   var aSelectedItems = this.byId("idUserLoans").getSelectedItems();
      //   console.log()
      //   const userModel = new sap.ui.model.json.JSONModel({

      //     books: {
      //       availability: oAvaiable
      //     }

      //   });
      //   this.getView().setModel(userModel, "userModel");

      //   const oPayload = this.getView().getModel("userModel").getProperty("/"),
      //     oModel = this.getView().getModel("ModelV2");

      //   try {
      //     oModel.update("/Book(" + oId + ")", oPayload.books, {
      //       success: function () {
      //         this.getView().byId("idBookTable").getBinding("items").refresh();//
      //       },
      //       error: function (oError) {
      //         //this.oEditBooksDialog.close();
      //         sap.m.MessageBox.error("Failed to update book: " + oError.message);
      //       }.bind(this)
      //     });
      //   } catch (error) {
      //     //this.oCreateBooksDialog.close();
      //     sap.m.MessageBox.error("Some technical Issue");
      //   };
      //   // var user = this.byId("idUserLoans").getSelectedItem().getBindingContext().getObject()
      //   this.byId("idUserLoans").getSelectedItem().getBindingContext().delete("$auto");
      //   sap.m.MessageBox.success("Loan Closed successfully");

      // },
      onpresscloseLoan: async function (oEvent) {
        if (this.byId("idUserLoans").getSelectedItems().length > 1) {
          MessageToast.show("Please Select only one Book");
          return
        }
        var oSelectedBook = this.byId("idUserLoans").getSelectedItem().getBindingContext().getObject(),
          oAval = oSelectedBook.books.availability + 1;

        var current = new Date();

        const userModel = new sap.ui.model.json.JSONModel({
          books_ID: oSelectedBook.books.ID,
          users_ID: oSelectedBook.users_ID,
          loanclosedDate: current,
          books: {
            availability: oAval
          }

        });
        this.getView().setModel(userModel, "userModel");

        const oPayload = this.getView().getModel("userModel").getProperty("/"),
          oModel = this.getView().getModel("ModelV2");

        try {
          await this.createData(oModel, oPayload, "/History");
          debugger
          sap.m.MessageBox.success(oSelectedBook.books.title + " Book Issued successfully");

          this.byId("idUserLoans").getSelectedItem().getBindingContext().delete("$auto");
          oModel.update("/Book(" + oSelectedBook.books.ID + ")", oPayload.books, {
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
      },
      onpressBack: function () {
        window.history.back();
      },
      //Loading history fragment
      onpresshistory: async function () {
        if (!this.ohistory) {
          this.ohistory = await this.loadFragment("history");
        }

        this.ohistory.open();
      },
      //closing the history loan fragment
      onHistoryscancelbtn: function () {
        if (this.ohistory.isOpen()) {
          this.ohistory.close()
        }
      }
    });
  }
);
