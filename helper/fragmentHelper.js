/** ----------------------------------------------------------------------------------  *
* Modifications.                                                                       *
* -------------                                                                        *
* Ver.No    Date        Author  	  PCR No.           Description of change          *
* ------ ---------- ------------ ----------  ----------------------------------------- *
* V00    13/10/2016   Siva Prasad 
* 					Prachuri/Alok 		PCR012146		initial version
*                     (X087050)                                                        *
*                                                                                      *
* V01	  08/11/2017	X087924			PCRXXXXXX		Error handling
****************************************************************************************
** ----------------------------------------------------------------------*
 *  Date        Author    PCR No.            Description of change       *
 * -------     ---------- ----------   ----------------------------------*
 * 01/31/2018   X087924	  PCR017285	   Disabling Esc key for busy dialog *
 * 01/20/2019   Vimal	  PCR020942	   KA Project changes 				 * 
 * 				Pandu 													 *
 * ----------------------------------------------------------------------*/
jQuery.sap.declare("serviceCaseCreation.fragmentHelper");

serviceCaseCreation.fragmentHelper = {
	
	/**
     * This method is to create dialog fragment .
     * @name createDialogFragment
     * @param oController - Holds the current Controller object
     * @param oFragment -Holds the fragment object
     * @returns 
     */
	createDialogFragment : function(sID, oController, oFragment){
		
		if(!oController._oDialog) {
			oController._oDialog = sap.ui.xmlfragment(sID, oFragment, oController);
		} else {
			oController._oDialog = null;
			oController._oDialog = sap.ui.xmlfragment(sID, oFragment, oController);
		}
        oController.getView().addDependent(oController._oDialog);
		jQuery.sap.syncStyleClass("sapUiSizeCompact", oController.getView(), oController._oDialog);
		return oController._oDialog;
		
	},
	
	/**
     * This method is to simulate the fragment .
     * @name simulateDelayAndCloseFragment
     * @param oController - Holds the current Controller object
     * @param expectedDelayInMS -Delay time in minutes
     * @param successMessage - Holds the success message
     * @returns 
     */
	simulateDelayAndCloseFragment : function(oController, expectedDelayInMS, successMessage) {
		
		setTimeout(
				  function() {
						sap.m.MessageToast.show(successMessage);
						oController._oDialog.close();
				  }, expectedDelayInMS);
		
	},
	
	/**
     * This method is to set the properties of  busy indicator .
     * @name setBusyIndicatorProperties
     * @param title - Title of Busy Indicator
     * @param text - Text in Busy Indicator which has to show
     * @returns 
     */
	setBusyIndicatorProperties : function(title, text) {
		
		sap.ui.getCore().getModel("ccServiceCaseModel").getData().busyDialogDescription = {};
		var oBusyDialogModelData = sap.ui.getCore().getModel("ccServiceCaseModel").getData().busyDialogDescription;
		oBusyDialogModelData.busyDialogTitle = title,
		oBusyDialogModelData.busyDialogText = text;

	},
	
	/**
     * This method holds all information to make dialog object .
     * @name dialogFragmentContent
     * @param oController - Holds the current Controller object reference.
     * @param title - Title of DialogFragment
     * @param icon - Icon in DialogFragment which has to be shown
     * @param color - Color of icon in the DialogFragment
     * @param  description - Description in DialogFragment which has to be shown
     * @returns 
     */
    dialogFragmentContent : function(oController, title, icon , color, description){
    
    	var oServiceCaseModelData;
    	if(!oController.getModel()) {
    		var oModel = new sap.ui.model.json.JSONModel();	
    		oModel.setData({});
    		oController.setModel(oModel);
    		oServiceCaseModelData = oModel.getData().dialogDescription = {};
    	}
    	else {
    		oServiceCaseModelData = oController.getModel().getData().dialogDescription = {};
    	}
    	
		oServiceCaseModelData.infoDialogTitle = title,
		oServiceCaseModelData.infoDialogIconSrc = icon,
		oServiceCaseModelData.infoDialogIconColor =  color,
		oServiceCaseModelData.infoDialogDescription = description;

	},
	
	/*V01
	Error Handling*/
	
	/**
     * This method is to handle error response dialog.
     * @name handleErrorResponseDialog
     * @param oController - Holds the current Controller object reference.
     * @param  oResponse - Response object
     * @returns 
     */

	handleErrorResponseDialog : function(oController, oResponse) {
		
		oController._resourceBundle = oController.getComponent().getModel("i18n").getResourceBundle();
		serviceCaseCreation.fragmentHelper.dialogFragmentContent(oController, "Error", serviceCaseCreation.StandardSAPIcons.ICON_SAP_MSG_ERROR,
				"#cc1919", oResponse.getParameter("d").ErrorMessage);
		serviceCaseCreation.fragmentHelper.createDialogFragment(oController.getView().getId(), oController, "serviceCaseCreation.view.fragments.InfoDialog").open();
	
	},
	
	/*------------------*/
	
	/*********PCR017285 start*********/
    
    /**
     * This method is to open busy dialog extension.
     * @name openBusyDialogExt
     * @param oController - Holds the current Controller object reference.
     * @returns 
     */
	openBusyDialogExt : function(sMsg){
		
		var sBusyDialogFragment = this.getComponent().getModel("i18n").getResourceBundle().getText("caseCreation_busyDialog");
		serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sMsg);
		serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this, sBusyDialogFragment).open();
		
	},
	
	/*********PCR017285 end*********/
	/********* start of PCR017437 *********/
	
	/**
     * This method is to open busy dialog.
     * @name openBusyDialog
     * @param oController - Holds the current Controller object reference.
     * @returns 
     */
	openBusyDialog : function(sMsg){
		
		serviceCaseCreation.fragmentHelper.dialogFragmentContent(this, "", "", "", sMsg);
		serviceCaseCreation.fragmentHelper.createDialogFragment(this.getCurrentView().getId(), this, "serviceCaseCreation.view.fragments.BusyDialog").open();
		
	},
	
	/********* end of PCR017437 *********/
	
	/********* Start of PCR020942++; KA Project changes *********/ 
	
	/**
     * This method is to capture all the 'resource not found' errors.
     * @name handleResourceNotFoundError
     * @param oController - Holds the current Controller object reference.
     * @param  {String} sType - message box type
     * @param  {String} sMsg - message box message
     * @param  {String} sDetails - message box details
     * @returns 
     */
	handleResourceNotFoundError : function (oController, sType, sMsg, sDetails) {
        
		var bCompact = !!oController.getCurrentView().$().closest(".sapUiSizeCompact").length;
        if (oController._bMessageOpen) {
               return;
        }
        oController._bMessageOpen = true;
        var oMsgBox = {
                details : (sDetails.length) ? sDetails : "",
                actions : [sap.m.MessageBox.Action.OK],
                styleClass: bCompact ? "sapUiSizeCompact" : "",
                onClose : function () {
              	  oController._bMessageOpen = false;
                }.bind(oController)
         };
        
        switch (sType) {
	        case "error" : 
	        	sap.m.MessageBox.error(sMsg, oMsgBox);
	        	break;
	        case "information" :
	        	sap.m.MessageBox.information(sMsg, oMsgBox);
	        	break;
        	default :
        		break;
        }
        
    }
    
   /*********PCR020942 end*********/
		
}