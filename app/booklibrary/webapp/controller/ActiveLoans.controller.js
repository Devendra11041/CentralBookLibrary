sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("com.app.booklibrary.controller.ActiveLoans", {
      onInit: function () {

      },
      //Loan closing function
      onpresscloseLoan: async function () {
        console.log(this.byId("idUserLoans").getSelectedItem().getBindingContext().getObject())
        var obj = this.byId("idUserLoans").getSelectedItem().getBindingContext().getObject(),
          oId = obj.books.ID,
          oAvaiable = obj.books.availability + 1;
        var aSelectedItems = this.byId("idUserLoans").getSelectedItems();
        console.log()
        const userModel = new sap.ui.model.json.JSONModel({

          books: {
            availability: oAvaiable
          }

        });
        this.getView().setModel(userModel, "userModel");

        const oPayload = this.getView().getModel("userModel").getProperty("/"),
          oModel = this.getView().getModel("ModelV2");
         
        try {
          oModel.update("/Book(" + oId + ")", oPayload.books, {
            success: function () {
              this.getView().byId("idBookTable").getBinding("items").refresh();//
              //this.oEditBooksDialog.close();
            },
            error: function (oError) {
              //this.oEditBooksDialog.close();
              sap.m.MessageBox.error("Failed to update book: " + oError.message);
            }.bind(this)
          });
        } catch (error) {
          //this.oCreateBooksDialog.close();
          sap.m.MessageBox.error("Some technical Issue");
        };
        this.byId("idUserLoans").getSelectedItem().getBindingContext().delete("$auto");
      },
      onpressBack: function () {
        window.history.back();
      }
    });
  }
);
