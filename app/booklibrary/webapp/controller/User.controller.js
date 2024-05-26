sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function (Controller, Token, Filter, FilterOperator) {
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
      },
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
      onClearPress: function () {

        const oView = this.getView(),
          otitleFilter = oView.byId("iduserTitleFilterValue").destroyTokens(),
          oAuthorFilter = oView.byId("iduserAuthorFilterValue").destroyTokens(),
          oGerneFilter = oView.byId("iduserGenreFilterValue").destroyTokens(),
          oisbnFilter = oView.byId("iduserISBNFilterValue").destroyTokens();
      }
    });
  }
);
