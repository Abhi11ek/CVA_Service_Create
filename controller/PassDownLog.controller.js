/**
 * PassDownLog Controller handles all the events related to 
 * Pass Down Notes Tab in Escalation Details view. Features Rich
 * Text Editor for updating the Pass Down Notes on Header details.
 *
 * @class 
 * @public
 * @extends com.amat.escmgmt.controller.BaseController
 * @file com.amat.escmgmt.controller.document.PassDownLog
 * @extends sap.ui.core.mvc.Controller
 * @author Vimal Pandu
 * @since 16 April 2018
 * ----------------------------------------------------------------------*
 *    Date       Author    PCR No.           Description of change       *
 * ----------  ---------- ---------    ----------------------------------*
 * 08/01/2018  X087924    PCR018422    Initial Version					 *
 * ----------------------------------------------------------------------*/

sap.ui.define([
	"serviceCaseCreation/controller/BaseController",
	"serviceCaseCreation/util/ServiceConfigConstants",
	"serviceCaseCreation/util/EventTriggers",
	"serviceCaseCreation/helper/fragmentHelper",
	"sap/m/MessageToast",
	"sap/ui/Device" 
], function(BaseController, ServiceConfigConstants, EventTriggers, FragmentHelper, MessageToast, Device) {
	"use strict";

	var that = this;
	return BaseController.extend("serviceCaseCreation.controller.PassDownLog", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the passDownLog controller is instantiated. It sets up all the required event handling for the controller.
		 * @public
		 */
		onInit: function() {
			that = this;
			this._oResourceBundle = this.getComponent().getModel("i18n").getResourceBundle();

			BaseController.prototype.createViewModel.call(this, {
				sModelName: "passDownLogView",
				busy: false,
				delay: 0,
				title: this._oResourceBundle.getText("passDownLogTitleCount", [0]),
				noDataText: this._oResourceBundle.getText("passDownLogListNoDataText")
			});

			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this._onAttachRouteMatched, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * Pass Down Notes list counter.
		 * @name onUpdateFinished
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the master list object counter after new data is loaded
			BaseController.prototype.updateListItemCount.call(this, {
				sListId: serviceCaseCreation.Ids.PSDNLOG_LIST,
				sStringRef: "passDownLogTitleCount",
				iTotalItems: oEvent.getParameter("total"),
				sModelName: "passDownLogView"
			});
		},

		/**
		 * This method will fetch pass down log data via service call.
		 * @name fnFetchPassDownLogData
		 */
		fnFetchPassDownLogData: function() {
			if (that._oCntx) {
				var oView = that.getView(),
					oPDLList = oView.byId(serviceCaseCreation.Ids.PSDNLOG_LIST);
				var sQuery = serviceCaseCreation.util.ServiceConfigConstants.passDownLog + "?$filter=IvServiceCaseNo%20eq%20%27" + that._oCntx.Servicecasenumber +
					"%27";

				oPDLList.setBusyIndicatorDelay(0);
				oPDLList.setBusy(true);

				that.finishoDataModelregistartionProcessWithParams(
					serviceCaseCreation.util.EventTriggers.PSDN_LOG_READ_SUCCESS,
					"handlePassDownLogFetchSuccess",
					serviceCaseCreation.util.EventTriggers.PSDN_LOG_READ_FAIL,
					"handlePassDownLogFetchError",
					sQuery,
					serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
					serviceCaseCreation.util.EventTriggers.TRIGGER_PSDN_LOG_READ);
			}
		},

		/**
		 * Success call back function of Pass Down Log service call. 
		 * Will create assign pass down log model to a fragment and opens it.
		 * @name handlePassDownLogFetchSuccess
		 */
		handlePassDownLogFetchSuccess: function() {
			var oView = that.getView(),
				oPDLList = oView.byId(serviceCaseCreation.Ids.PSDNLOG_LIST);
			var oPsdnLogModel = this.getModelFromCore("passDownLogModel"),
				aPassDownNotes = oPsdnLogModel.getData().d.results;
			var oMasterListModel = this.getModelFromCore("ccMasterListModel"),
				aPsdnLogSrvOrd = oMasterListModel.getData().aPsdnLogSrvOrd;
			var aNotes = [],
				aResponse = [],
				aPsdnNotes = [];
			var sNote, oNote, oPsdnNote;
			
			for (oPsdnNote in aPassDownNotes) {
			    if(aPassDownNotes[oPsdnNote].Noteslog.indexOf("$*") > -1) {
			        aNotes = aPassDownNotes[oPsdnNote].Noteslog.split("$*sknSLvdlSDFxdflbIHfd*$");
	
			        for (sNote in aNotes) {
			            aResponse = [];
			            
			            if (aNotes[sNote].indexOf("Pass Down Note Type:") > -1 && aNotes[sNote].indexOf("Confirmation Number:") > -1) {
							aResponse = aNotes[sNote].split(":");
							oNote = {};
							oNote.ConfirmationNumber = aResponse[1].split(" Pass Down Note Type")[0].trim();
							oNote.NoteType = aResponse[2].split(" Pass Down Note")[0].trim() + " Pass Down Note";
							oNote.Noteslog = aResponse[2].split(" Pass Down Note")[1].trim();
							oNote.Timestamp = aPassDownNotes[oPsdnNote].Timestamp.trim();
							oNote.Username = aPassDownNotes[oPsdnNote].Username.trim();
							aPsdnNotes.push(oNote);
						}
			        }
			    } else {
					aPassDownNotes[oPsdnNote].ConfirmationNumber = "";
					aPassDownNotes[oPsdnNote].NoteType = "";
					aPsdnNotes.push(aPassDownNotes[oPsdnNote]);
				}
			}
			
			oPsdnLogModel.getData().d.results = aPsdnNotes;
			oPsdnLogModel.updateBindings();
			
			if (aPsdnLogSrvOrd.indexOf(that._oCntx.Servicecasenumber) < 0) {
				aPsdnLogSrvOrd.push(that._oCntx.Servicecasenumber);
			}

			oPDLList.setBusy(false);
			oPDLList.setModel(oPsdnLogModel);
		},

		/**
		 * Error call back function of Pass Down Log service call. 
		 * @name handlePassDownLogFetchError
		 * @param {Object} oErrorResponse - Error Response
		 */
		handlePassDownLogFetchError: function(oErrorResponse) {
			that.getView().byId(serviceCaseCreation.Ids.PSDNLOG_LIST).setBusy(false);
			serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(this, oErrorResponse);
		},

		/**
		 * This method is called on change of Pass Down Notes Text Area.
		 * @name onLiveChange
		 * @param oEvent - Current Event Parameter
		 */

		onLiveChange: function(oEvent) {
			var oTextArea = oEvent.getSource();

			if (oTextArea.getValue().trim()) {
				oTextArea.setValueState("None");
			} else {
				oTextArea.setValueState("Error");
			}
		},

		/**
		 * Event handler for  Pass Down Notes Send event.
		 * Creates Pass Down Notes Payload and posts the respective data.
		 * @name onPressPassDownNoteSend
		 * @param {sap.ui.base.Event} oEvent Pass Down Notes action buttons 
		 * @public
		 */
		onPressPassDownNoteSend: function(oEvent) {
			var oViewModel = this.getModel("passDownLogView");
			var oPsdnTextArea = this.getCurrentView().byId(serviceCaseCreation.Ids.PSDNNOTE_TEXTAREA),
				sPassDownLogVal = oPsdnTextArea.getValue().trim();
			var oPDNPayload, oALCreateEvt;

			if (sPassDownLogVal) {
				oPDNPayload = {};
				oPDNPayload.Servicecasenumber = this._oCntx.Servicecasenumber;
				oPDNPayload.NotesLog = sPassDownLogVal;

				serviceCaseCreation.fragmentHelper.openBusyDialogExt.call(this,
					this._oResourceBundle.getText("CreateServiceCase.BusyDialogMsg"));

				this.finishoDataModelregistartionProcessWithParams(
					serviceCaseCreation.util.EventTriggers.PASSDOWNLOG_CREATE_SUCCESS,
					"handlePassDownLogCreateSuccess",
					serviceCaseCreation.util.EventTriggers.PASSDOWNLOG_CREATE_FAIL,
					"handlePassDownLogCreateFail",
					serviceCaseCreation.util.ServiceConfigConstants.serviceCaseEntitySet,
					serviceCaseCreation.util.ServiceConfigConstants.post, {
						d: oPDNPayload
					}, "", "",
					serviceCaseCreation.util.EventTriggers.TRIGGER_PASSDOWNLOG_CREATE
				);
			} else {
				oPsdnTextArea.setValueState("Error");
				MessageToast.show(this._oResourceBundle.getText("fillInPassDown"));
			}
		},

		/**
		 * This method is the success call back function for Pass Down Notes Create event.
		 * @name handlePassDownLogCreateSuccess
		 * @param {Object} oSuccess - success response object
		 */
		handlePassDownLogCreateSuccess: function(oSuccess) {
			if (oSuccess.getParameter("d").ErrorMessage) {
				serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(this, oSuccess);
				return;
			}

			this.onPressPassDownNoteClear();
			this.onInfoDialog();
			this.fnFetchPassDownLogData();
		},

		/**
		 * This method is the error call back function for Pass Down Notes Create event.
		 * @name handlePassDownLogCreateFail
		 * @param {Object} oError - error response object
		 */
		handlePassDownLogCreateFail: function(oError) {
			this.onInfoDialog();
			serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(this, oError);
		},

		/**
		 * Event handler for  Pass Down Notes Clear event.
		 * Clears the value in the  Pass Down Notes RichTextEditor.
		 * @name onPressPassDownNoteClear
		 * @public
		 */
		onPressPassDownNoteClear: function() {
			var oPsdnTextArea = this.getCurrentView().byId(serviceCaseCreation.Ids.PSDNNOTE_TEXTAREA);

			oPsdnTextArea.setValueState("None");
			oPsdnTextArea.setValue("");
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
			var oView = this.getCurrentView();
			var sContext = oEvent.getParameter("arguments").ServiceCasePath,
				sContextPath = "/d/results/" + sContext;
			var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel"),
				oViewModel = this.getModel("passDownLogView");
			var oPassDownTextBox = oView.byId(serviceCaseCreation.Ids.PSDNNOTE_FLXBX);
			var sStatus, oPDLList, oPsdnLogModel;

			if (sContext && oServiceCaseModel) {
				serviceCaseCreation.model.ResponseHandler._createModelForTheEvent.call(this, {}, "passDownLogModel");
				oPDLList = oView.byId(serviceCaseCreation.Ids.PSDNLOG_LIST);
				oPDLList.setModel(this.getModelFromCore("passDownLogModel"));

				oView.bindElement(sContextPath);
				this.onPressPassDownNoteClear();
				this._oCntx = oServiceCaseModel.getProperty(sContextPath);
				sStatus = this._oCntx.Orderstatus;

				if (Device.system.desktop) {
					oPassDownTextBox.removeStyleClass("pdlFlexBox");
				} else {
					oPassDownTextBox.addStyleClass("pdlFlexBox");
				}

				if (sStatus === "Work Completed") {
					oViewModel.setProperty("/bDisableElements", false);
				} else {
					oViewModel.setProperty("/bDisableElements", true);
				}
				oViewModel.updateBindings();
			}
		}

	});

});