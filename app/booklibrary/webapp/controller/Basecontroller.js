sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment"
    ],
    function (BaseController,Fragment) {
        "use strict";

        return BaseController.extend("com.app.booklibrary.controller.Basecontroller", {
            onInit: function () {

            },
            //Performing curd operations
            createData: function (oModel, oPayload, sPath) {
                return new Promise((resolve, reject) => {
                    oModel.create(sPath, oPayload, {
                        refreshAfterChange: true,
                        success: function (oSuccessData) {
                            resolve(oSuccessData);
                        },
                        error: function (oErrorData) {
                            reject(oErrorData)
                        }
                    })
                })
            },
            //Function for loading the fragment
            loadFragment: async function (sFragmentName) {
                const oFragment = await Fragment.load({
                    id: this.getView().getId(),
                    name: `com.app.booklibrary.fragments.${sFragmentName}`,
                    controller: this
                });
                this.getView().addDependent(oFragment);
                return oFragment
            }
        });
    }
);
