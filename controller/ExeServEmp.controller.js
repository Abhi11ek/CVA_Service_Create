/************************************************************************
 *  Date        Author    PCR No.          Description of change        *
 ************ ********  **********   ************************************
 * 11/06/2018  X087924   PCR018422   Exe. Service Employee Addition 	*
 * 									 changes							*
 * 12/17/2020  X0108534  PCR032448   FSO Productivity Super RIT			*
 ************************************************************************/

sap.ui.define([
	'jquery.sap.global',
	'serviceCaseCreation/controller/BaseController',
	'sap/ui/core/Control',
	'sap/m/MessageToast',
	"sap/m/Token"
], function(jQuery, Controller, Control, MessageToast, Token) {

	var that = this;
	var oExeServEmp = Controller.extend("serviceCaseCreation.controller.ExeServEmp", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf controller.ExeServEmp
		 */
		onInit: function() {
			that = this;
			this.resourceBundle = this.getComponent().getModel("i18n").getResourceBundle();

			this._fnAddValidatorToMultiInput();
			serviceCaseCreation.controller.BaseController.prototype.setComponentModelToCurrentViewModel.call(this, "ccServiceCaseModel");
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this._onAttachRouteMatched, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Method to fetch Exe. Service Employeed
		 * @name fetchESEList
		 * @param {String} fnSuccessCallback - success call back function ref
		 * @public
		 */
		fetchESEList: function(fnSuccessCallback) {
			var oView = that.getView(),
				oDisplayESEList = oView.byId(serviceCaseCreation.Ids.DISPESE_LIST);
			var sQuery = serviceCaseCreation.util.ServiceConfigConstants.serviceCaseEntitySet + "(Servicecasenumber='" + that._oCntx.Servicecasenumber +
				"')/ToServiceCaseRead";

			oView.byId(serviceCaseCreation.Ids.ADDESE_BTN).setEnabled(true);
			oView.byId("idEmailInpFlex").setVisible(false);
			oDisplayESEList.setBusyIndicatorDelay(0);
			oDisplayESEList.setBusy(true);

			that.finishoDataModelregistartionProcessWithParams(
				serviceCaseCreation.util.EventTriggers.ESE_READ_SUCCESS,
				fnSuccessCallback,
				serviceCaseCreation.util.EventTriggers.ESE_READ_FAIL,
				"handleFetchESEFail",
				sQuery,
				serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
				serviceCaseCreation.util.EventTriggers.TRIGGER_ESE_READ
			);
		},

		/**
		 * Success callback response for ESE read service.
		 * @name handleFetchESESuccess
		 * @public
		 */
		handleFetchESESuccess: function() {
			var oView = that.getCurrentView(),
				oDisplayESEList = oView.byId(serviceCaseCreation.Ids.DISPESE_LIST);
			var oMasterListModel = this.getModelFromCore("ccMasterListModel"),
				aExeServEmpSrvOrd = oMasterListModel.getData().aExeServEmpSrvOrd;
			
			if (aExeServEmpSrvOrd.indexOf(that._oCntx.Servicecasenumber) < 0) {
				aExeServEmpSrvOrd.push(that._oCntx.Servicecasenumber);
			}
			
			oDisplayESEList.setModel(that.getModelFromCore("displayESEModel"));		
			oView.setModel(that.getModelFromCore("displayESEModel")); //PCR032448++
			oDisplayESEList.setBusy(false);
		},

		/**
		 * Error callback response for ESE read service.
		 * @name handleFetchESEFail
		 * @param {Object} oError - Error response
		 * @public
		 */
		handleFetchESEFail: function(oError) {
			var oDisplayESEList = that.getCurrentView().byId(serviceCaseCreation.Ids.DISPESE_LIST);

			oDisplayESEList.setBusy(false);
			oDisplayESEList.setNoDataText(that.getResourceBundle().getText("eseNotAvail"));
			serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(that, oError);
		},

		/**
		 * After list data is available, this handler method updates the
		 * master list counter.
		 * @name onESEListUpdateFinished
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onESEListUpdateFinished: function(oEvent) {
			var oList = oEvent.oSource,
				aESEItems = oList.getItems();
			var iItemsCount = oEvent.getParameter("total");
			var sPath, oCntx;

			if (aESEItems.length === 1) {
				sPath = aESEItems[0].getBindingContext().getPath();
				oCntx = oList.getModel().getProperty(sPath);
				iItemsCount = (oCntx.ErrorMessage) ? 0 : iItemsCount;
			}

			if (oList.getBinding("items").isLengthFinal()) {
				if (aESEItems.length === 0) {
					oList.setNoDataText(this.getResourceBundle().getText("eseNotAvail"));
				}

				var sTitle = this.getResourceBundle().getText("eseRecipients", [iItemsCount]);
				this.getCurrentView().byId(serviceCaseCreation.Ids.ESE_HEADER).setText(sTitle);
			}
		},
		
		/**
		 * Event handler to validate the given email id.
		 * @name onInputLiveChangeEmail
		 * @public
		 */
		onInputLiveChangeEmail: function(oEvent) {
			var oEmail = oEvent.getSource(),
				sEmail = oEmail.getValue().trim(),
				sEmailVal = oEmail.getValue().trim();

			if (sEmail.match("@")) {
				if (sEmail.substr(-2) === "@a" || sEmail.substr(-2) === "@A") {
					sEmailVal = sEmail + "mat.com";
					oEmail.setValue(sEmailVal.toLowerCase());
				} else if (sEmail.substr(-2) === "@c" || sEmail.substr(-2) === "@C") {
					sEmailVal = sEmail + "ontractor.amat.com";
					oEmail.setValue(sEmailVal.toLowerCase());
				}
			}

			if (!oEmail.getTokens().length) {
				oEmail.setValueState("None");
			} else if (oEmail.getTokens().length && !oEmail.getValue()) {
				oEmail.setValueState("None");
			} else {
				oEmail.setValueState("Error");
			}
		},

		/**
		 * Event handler for adding Emails in the Exe. Service Employee Tab.
		 * @name onPressAddRecipient
		 * @public
		 */
		onPressAddESE: function() {
			var oView = this.getView();
			
			oView.byId("idEmailInpFlex").setVisible(true);
			oView.byId(serviceCaseCreation.Ids.ADDESE_LIST).setTokens([]);
			oView.byId(serviceCaseCreation.Ids.ADDESE_BTN).setEnabled(false);
		},

		/**
		 * Event handler to delete Emails in the ESE Tab.
		 * @name onPressEmailDelIcon
		 * @public
		 */
		onPressEmailDelIcon: function() {
			var oView = this.getView();

			 oView.byId("idEmailInpFlex").setVisible(false);
			 oView.byId(serviceCaseCreation.Ids.ADDESE_BTN).setEnabled(true);
		},

		/**
		 * Event handler to add Email Recipients in the ESE Tab.
		 * @name onSaveESE
		 * @public
		 */
		onSaveESE: function() {
			var oView = this.getView(),
				oEmailInp = this.getView().byId(serviceCaseCreation.Ids.ADDESE_LIST);
			var oESEAddPayload = {};
			var bEmailValid = true,
				regEmail = /^\w+([\.-]?\w+)+@\w+([\.-]?\w+)+(\.\w{2,4})+$/;
			var oItem, aEmailId, sEmail;

			oESEAddPayload.ToServiceCaseItem = [];
			oESEAddPayload.Srvcaseid = that._oCntx.Servicecasenumber;
			oESEAddPayload.ErrorMessage = "";

			if (oView.byId("idEmailInpFlex").getVisible() && oEmailInp.getTokens().length) {
				aEmailId = oEmailInp.getTokens();
				
				for (oItem in aEmailId) {
					sEmail = aEmailId[oItem].getText();
					
					if (regEmail.test(sEmail) && sEmail.match("@contractor.amat.com") || sEmail.match("@amat.com")) {
						bEmailValid = true;
					} else {
						bEmailValid = false;
						break;
					}
				}
				
				if (bEmailValid && oEmailInp.getValueState() === "None") {
					for (oItem in aEmailId) {
						oESEAddPayload.ToServiceCaseItem.push({
							Email: aEmailId[oItem].getText(),
							ErrorMessage: "",
							Partnernum: "",
							Srvcaseid: that._oCntx.Servicecasenumber
						});
					}
					
					if (oESEAddPayload.ToServiceCaseItem.length) {
						serviceCaseCreation.fragmentHelper.openBusyDialogExt.call(this,
							this.resourceBundle.getText("CreateServiceCase.BusyDialogMsg"));

						this.finishoDataModelregistartionProcessWithParams(
							serviceCaseCreation.util.EventTriggers.SERVICE_CASES_UPDATE_SUCCESS,
							"handleAddESESuccess",
							serviceCaseCreation.util.EventTriggers.SERVICE_CASES_UPDATE_FAIL,
							"handleAddESEFail",
							serviceCaseCreation.util.ServiceConfigConstants.sESEUpdate,
							serviceCaseCreation.util.ServiceConfigConstants.post, {
								d: oESEAddPayload
							}, "", "",
							serviceCaseCreation.util.EventTriggers.TRIGGER_SERVICE_CASES_UPDATE
						);
					} else {
						MessageToast.show(this.resourceBundle.getText("addESEtoCont"));
					}
				} else {
					MessageToast.show(this.resourceBundle.getText("validEmailIds"));
				}
			} else {
				MessageToast.show(this.resourceBundle.getText("addESEtoCont"));
			}
		},

		/**
		 * This method is the success call back function for ESE update event.
		 * @name handleAddESESuccess
		 * @param {Object} oSuccess - success response object
		 */
		handleAddESESuccess: function(oSuccess) {
			if (oSuccess.getParameter("d").ErrorMessage) {
				serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(this, oSuccess);
				return;
			}
			this.fetchESEList("handleESEUpdateSuccess");
		},

		/**
		 * This method is the success call back function for fetching 
		 * a desire Service Case after ESE update.
		 * @name handleESEUpdateSuccess
		 * @param {Object} oSuccess - success response object
		 */
		handleESEUpdateSuccess: function() {
			var oView = this.getView(),
				oDisplayESEList = oView.byId(serviceCaseCreation.Ids.DISPESE_LIST);

			oDisplayESEList.setModel(this.getModelFromCore("displayESEModel"));
			oDisplayESEList.setVisible(true);
			oDisplayESEList.setBusy(false);
			this.onInfoDialog();
		},

		/**
		 * This method is the error call back function for Addition Escalation
		 * Recipients update event.
		 * @name handleAddESEFail
		 * @param {Object} oError - error response object
		 */
		handleAddESEFail: function(oError) {
			this.onInfoDialog();
			serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(this, oError);
		},

		/**
		 * This method is to destroy the given dialog.
		 * @name onInfoDialog
		 * @param 
		 * @returns 
		 */
		onInfoDialog: function(oEvent) {
			this.destroyDialog();
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * If the desired route was hit and navigated to ESE Tab
		 * we have to validate whether the a correct tab was selected.
		 * @name _onAttachRouteMatched
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @private
		 */
		_onAttachRouteMatched: function(oEvent) {
			var oView = this.getCurrentView(),
				oESEList = oView.byId(serviceCaseCreation.Ids.DISPESE_LIST);
			var sContext = oEvent.getParameter("arguments").ServiceCasePath;
			var sContextPath = "/d/results/" + sContext;
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel");
			var aESEBtns = [serviceCaseCreation.Ids.SAVEESE_BTN, serviceCaseCreation.Ids.ADDESE_BTN];
			var sStatus;
			
			oView.byId("idEmailInpFlex").setVisible(false);
			oView.byId(serviceCaseCreation.Ids.ADDESE_BTN).setEnabled(true);

			if (sContext && oServiceCaseModel) {
				serviceCaseCreation.model.ResponseHandler._createModelForTheEvent.call(this, {}, "displayESEModel");
				oESEList.setModel(this.getModelFromCore("displayESEModel"));

				this.getCurrentView().bindElement(sContextPath);
				this._oCntx = oServiceCaseModel.getProperty(sContextPath);
				sStatus = this._oCntx.Orderstatus;

				if (sStatus === "Work Completed") {
					this.hideElementsWithIDs(aESEBtns);
				} else {
					this.showElementsWithIDs(aESEBtns);
				}
			}
			
			oESEList.setNoDataText(" ");
			/*Begin of PCR032448++*/
			this.getView().byId(serviceCaseCreation.Ids.ESEPANEL).setExpanded(false);
			this.getView().byId(serviceCaseCreation.Ids.LEADCEPANEL).setExpanded(false);
			this.getView().byId(serviceCaseCreation.Ids.TOOLMANGERPANEL).setExpanded(false);
			this.getView().byId(serviceCaseCreation.Ids.SRVTEAMPANEL).setExpanded(false);
			/*End of PCR032448++*/
		},
		
		/**
		 * Attach validator functions to multi-inputs .
		 * @name _fnAddValidatorToMultiInput
		 * @private
		 */
		_fnAddValidatorToMultiInput: function() {
			var oView = that.getView(),
				oEmailInp = oView.byId(serviceCaseCreation.Ids.ADDESE_LIST);

			oEmailInp.addValidator(function(args) {
				var aEmails, sEmail, aEmailVal, bValidEmail;

				if (args.text) {
					aEmails = args.text.split(",").map(function(e) {
						return e.trim();
					});

					for (sEmail in aEmails) {
						if (aEmails[sEmail]) {
							aEmailVal = aEmails[sEmail].split("@");

							if (aEmailVal[1] === "contractor.amat.com" || aEmailVal[1] === "amat.com") {
								bValidEmail = true;
								oEmailInp.setValueState("None");
							} else {
								oEmailInp.setValueState("Error");
								bValidEmail = false;
								break;
							}
						}
					}

					if (bValidEmail) {
						that._fnSetTokensToMulInp(args, serviceCaseCreation.Ids.ADDESE_LIST);
					}
				}
			});
		},
		
		/**
		 * An internal method to set tokens to mutli-input.
		 * @name _fnSetTokensToMulInp
		 * @param {Object} args - validator arguments
		 * @param {string} sElementID - mutli-input id
		 * @private
		 */
		_fnSetTokensToMulInp: function(args, sElementID) {
			var oElement = that.getView().byId(sElementID),
				aTokens = that._fnInpValidator(args, oElement);
			var aExistingTokens = [];
			var oToken;

			for (oToken in aTokens) {
				aExistingTokens.push(aTokens[oToken].getText());
			}

			oElement.setValue("");

			try {
				oElement.setTokens(aTokens);
			} catch (oError) {
				MessageToast.show(oError);
			}
		},
		
		/**
		 * Internal method to validate and add tokens to multi-inputs .
		 * @name _fnInpValidator
		 * @param {Object} args - arguments
		 * @param {object} oInp - input element
		 * @returns {Object[]} aInpTokens - array of tokens
		 * @private
		 */
		_fnInpValidator: function(args, oInp) {
			var sText = args.text.trim();
			var aInpTokens = oInp.getTokens();
			var aExistingTokens = [],
				aUniqueTokens = [];
			var aInpVal, oToken, sToken;
			var sDelimitter = ",";

			if (aInpTokens.length) {
				for (oToken in aInpTokens) {
					aExistingTokens.push(aInpTokens[oToken].getText());
				}
			}

			if (sText) {
				if (sText.indexOf(sDelimitter) > -1) {
					aInpVal = sText.split(sDelimitter).map(function(e) {
						return e.trim();
					});

					for (sToken in aInpVal) {
						if (aExistingTokens.indexOf(aInpVal[sToken]) === -1) {
							aUniqueTokens.push(aInpVal[sToken]);
						}
					}

					aInpVal = (aExistingTokens.length) ? aUniqueTokens : aInpVal;

					for (var sVal in aInpVal) {
						if (aInpVal[sVal]) {
							aInpTokens.push(new Token({
								key: aInpVal[sVal],
								text: aInpVal[sVal]
							}));
						}
					}
				} else if (sText && aExistingTokens.indexOf(sText) === -1) {
					aInpTokens.push(new Token({
						key: sText,
						text: sText
					}));
				}
			} else {
				aInpTokens = [];
			}

			return aInpTokens;
		},
		
		/*Begin of PCR032448++*/
		/**
		 * After list data is available, this handler method updates the
		 * master list counter.
		 * @name onTMListUpdateFinished
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onTMListUpdateFinished: function(oEvent) {
			var oList = oEvent.oSource,
				aTSItems = oList.getItems();
			var iItemsCount = oEvent.getParameter("total");
			var sPath, oCntx;

			if (aTSItems.length === 1) {
				sPath = aTSItems[0].getBindingContext().getPath();
				oCntx = oList.getModel().getProperty(sPath);
				iItemsCount = (oCntx.ErrorMessage) ? 0 : iItemsCount;
			}

			if (oList.getBinding("items").isLengthFinal()) {
				if (aTSItems.length === 0) {
					oList.setNoDataText(this.getResourceBundle().getText("NoTMAvail"));
				}

				var sTitle = this.getResourceBundle().getText("ToolManager", [iItemsCount]);
				this.getCurrentView().byId(serviceCaseCreation.Ids.TMHeader).setText(sTitle);
			}
		},
		
		/**
		 * After list data is available, this handler method updates the
		 * master list counter.
		 * @name onCEListUpdateFinished
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onCEListUpdateFinished: function(oEvent) {
			var oList = oEvent.oSource,
				aCEItems = oList.getItems();
			var iItemsCount = oEvent.getParameter("total");
			var sPath, oCntx;

			if (aCEItems.length === 1) {
				sPath = aCEItems[0].getBindingContext().getPath();
				oCntx = oList.getModel().getProperty(sPath);
				iItemsCount = (oCntx.ErrorMessage) ? 0 : iItemsCount;
			}

			if (oList.getBinding("items").isLengthFinal()) {
				if (aCEItems.length === 0) {
					oList.setNoDataText(this.getResourceBundle().getText("NoCEAvail"));
				}

				var sTitle = this.getResourceBundle().getText("LeadCE", [iItemsCount]);
				this.getCurrentView().byId(serviceCaseCreation.Ids.LeadCEHeader).setText(sTitle);
			}
		},
		
		/**
		 * After list data is available, this handler method updates the
		 * master list counter.
		 * @name onSTListUpdateFinished
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onSTListUpdateFinished: function(oEvent) {
			var oList = oEvent.oSource,
				aSTItems = oList.getItems();
			var iItemsCount = oEvent.getParameter("total");
			var sPath, oCntx;

			if (aSTItems.length === 1) {
				sPath = aSTItems[0].getBindingContext().getPath();
				oCntx = oList.getModel().getProperty(sPath);
				iItemsCount = (oCntx.ErrorMessage) ? 0 : iItemsCount;
			}

			if (oList.getBinding("items").isLengthFinal()) {
				if (aSTItems.length === 0) {
					oList.setNoDataText(this.getResourceBundle().getText("NoSTAvail"));
				}

				var sTitle = this.getResourceBundle().getText("ServiceTeam", [iItemsCount]);
				this.getCurrentView().byId(serviceCaseCreation.Ids.STHeader).setText(sTitle);
			}
		},
		

	});

	return oExeServEmp;

});