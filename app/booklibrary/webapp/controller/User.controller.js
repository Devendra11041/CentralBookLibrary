sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/Token"
  ],
  function (Controller,Token) {
    "use strict";

    return Controller.extend("com.app.booklibrary.controller.User", {
      onInit: function () {
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
      }
    });
  }
);
