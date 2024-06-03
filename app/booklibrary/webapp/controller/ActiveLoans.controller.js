sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("com.app.booklibrary.controller.ActiveLoans", {
      onInit: function () {

      },
      onpresscloseLoan: async function () {
        var oSelected = this.byId("idUserLoans").getSelectedItem();
        if (oSelected) {
          var oISBN = oSelected.getBindingContext().getObject().ID;

          oSelected.getBindingContext().delete("$auto").then(function () {
            MessageBox.success(oISBN + " SuccessFully Deleted");
          },
            function (oError) {
              MessageBox.error("Deletion Error: ", oError);
            });
          this.getView().byId("idUserLoans").getBinding("items").refresh();

        } else {
          MessageBox.error("Please Select a Row to Delete");
        }

      },
      onpressBack: function () {
        window.history.back();
      }
    });
  }
);
