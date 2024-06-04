sap.ui.define(
  [
    "./Basecontroller",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"

  ],
  function (Controller, Token, Filter, FilterOperator, Fragment, MessageBox) {
    "use strict";

    return Controller.extend("com.app.booklibrary.controller.Allbooks", {
      onInit: function () {
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
      //Function for Reserv book 
      onReserrveBtnPress: async function (oEvent) {
        var oSelectedItem = oEvent.getSource();
        //console.log(oSelectedItem)
        console.log(this.ID)
        console.log(oEvent.getSource().getParent())
        var userId = this.ID
        if (this.byId("iduserBookTable").getSelectedItems().length > 1) {
          MessageToast.show("Please Select only one Book");
          return
        }
        var oSelectedBook = this.byId("iduserBookTable").getSelectedItem().getBindingContext().getObject()
        console.log(oSelectedBook)

        const userModel = new sap.ui.model.json.JSONModel({
          user_ID: userId,
          book_ID: oSelectedBook.ID,
          reservedDate: new Date(),
        });
        this.getView().setModel(userModel, "userModel");

        const oPayload = this.getView().getModel("userModel").getProperty("/"),
          oModel = this.getView().getModel("ModelV2");

        try {
          await this.createData(oModel, oPayload, "/IssueBook");
          MessageBox.success("Book Reserved");
        } catch (error) {
          //this.oCreateBooksDialog.close();
          MessageBox.error("Some technical Issue");
        }
      }
    });
  }
);
