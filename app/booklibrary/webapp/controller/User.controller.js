sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/Token"

  ],
  function (Controller) {
    "use strict";

    return Controller.extend("com.app.booklibrary.controller.User", {
      onInit: function () {

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);
      },
      onUserDetailsLoad: function (oEvent) {
        const { ID } = oEvent.getParameter("arguments");
        this.ID = ID;
        // const sRouterName = oEvent.getParameter("name");
        const oObjectPage = this.getView().byId("iduserpage");

        oObjectPage.bindElement(`/User(${ID})`);
      },
      // close function for the dynamic page
      onpageclose: function () {
        window.history.back();
      },
      onPressallBooks:async function () {
        const userId=this.ID
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteAllbooks",
        {
          id:userId
        });
    }
    });
  }
);
