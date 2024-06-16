sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("com.app.booklibrary.controller.allusers", {
            onInit: function () {

            },

            onpressBackuser: function () {
                window.history.back();
              }
        });
    }
);
