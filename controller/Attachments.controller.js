/**
 * Attachments Controller handles the events related to 
 * Attachments Tab in Service Order Details view like Attachment
 * Upload/Delete.
 *
 * @name
 * @public
 * @extends com.amat.escmgmt.controller.BaseController
 * @file com.amat.escmgmt.controller.document.Attachments
 * @author Vimal Pandu
 * @since 16 April 2018 
 * ----------------------------------------------------------------------*
 *    Date       Author    PCR No.           Description of change       *
 * ----------  ---------- ---------    ----------------------------------*
 * 04/16/2018  X087924    PCR018422    Initial Version					 *
 * 10/18/2018  X087924    PCR020161    MIME Type issue changes 			 *
 * ----------------------------------------------------------------------*/

sap.ui.define([
	"serviceCaseCreation/controller/BaseController",
	"sap/m/MessageToast",
	"serviceCaseCreation/util/ServiceConfigConstants",
	"serviceCaseCreation/util/EventTriggers",
	"sap/ui/Device"
], function(BaseController, MessageToast, ServiceConfigConstants, EventTriggers, Device) {
	"use strict";

	var that = this;
	return BaseController.extend("serviceCaseCreation.controller.Attachments", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the Attachments controller is instantiated. It sets up all the required event handling for the controller.
		 * @public
		 */
		onInit: function() {
			var oView = this.getView();
			that = this;
			this._oAttCollections = (Device.system.desktop) ? oView.byId(serviceCaseCreation.Ids.ATT_UPLOAD_CONT) : oView.byId(
				serviceCaseCreation.Ids.ATT_LIST);
			this._oAttCollections.setBusyIndicatorDelay(0);
			this._oAttCollections.setBusy(true);
			this._oResourceBundle = this.getComponent().getModel("i18n").getResourceBundle();

			BaseController.prototype.createViewModel.call(this, {
				delay: 0,
				sModelName: "attachmentsView",
				title: this._oResourceBundle.getText("attachmentsTitleCount", [0]),
				maximumFilenameLength: 64,												//PCR020161++ changing 255 to 64
				maximumFileSize: 10,
				uploadEnabled: true,
				uploadButtonVisible: (Device.system.phone) ? true : false,
				enableEdit: false,
				visibleEdit: false,
				visibleDelete: (Device.system.phone) ? false : true,
				bRouteMatchFired: true,
				downloadBtn: (Device.system.phone) ? "" : this._oResourceBundle.getText("attDownloadBtn")
			});

			// Sets the text to the label
			this._oAttCollections.addEventDelegate({
				onBeforeRendering: function() {
					this._getAttachmentTitleText();
				}.bind(this)
			});

			serviceCaseCreation.controller.BaseController.prototype.setComponentModelToCurrentViewModel.call(this, "ccServiceCaseModel");
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this._onAttachRouteMatched, this);

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * This method will fetch pass down log data via service call.
		 * @name fnFetchAttachments
		 */
		fnFetchAttachments: function() {
			if (that._oCntx) {
				var sQuery = serviceCaseCreation.util.ServiceConfigConstants.attachmentSet + "?$filter=IServiceCaseNo%20eq%20%27" + that._oCntx.Servicecasenumber +
					"%27";
				that._oAttCollections.setBusy(true);

				that.finishoDataModelregistartionProcessWithParams(
					serviceCaseCreation.util.EventTriggers.ATTACHMENTS_READ_SUCCESS,
					"handleAttachmentsFetchSuccess",
					serviceCaseCreation.util.EventTriggers.ATTACHMENTS_READ_FAIL,
					"handleAttachmentsFetchError",
					sQuery,
					serviceCaseCreation.util.ServiceConfigConstants.get, "", "", "",
					serviceCaseCreation.util.EventTriggers.TRIGGER_ATTACHMENTS_READ);
			}
		},

		/**
		 * Success call back function of Pass Down Log service call. 
		 * Will create assign pass down log model to a fragment and opens it.
		 * @name handleAttachmentsFetchSuccess
		 */
		handleAttachmentsFetchSuccess: function() {
			var oMasterListModel = this.getModelFromCore("ccMasterListModel"),
				aAttachmentsSrvOrd = oMasterListModel.getData().aAttachmentsSrvOrd;

			if (aAttachmentsSrvOrd.indexOf(that._oCntx.Servicecasenumber) < 0) {
				aAttachmentsSrvOrd.push(that._oCntx.Servicecasenumber);
			}

			that._oAttCollections.setModel(that.getModelFromCore("attachmentsModel"));
			that._oAttCollections.setBusy(false);
		},

		/**
		 * Error call back function of Pass Down Log service call. 
		 * @name handleAttachmentsFetchError
		 */
		handleAttachmentsFetchError: function(oErrorResponse) {
			that._oAttCollections.setBusy(false);
			serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(this, oErrorResponse);
		},

		/**
		 * This method helps in downloading all the attachments available.
		 * @name onDownloadItem
		 */
		onDownloadItem: function() {
			var aItems = this._oAttCollections.getItems();
			var iAttchmnt;

			if (aItems.length) {
				for (iAttchmnt in aItems) {
					this._oAttCollections.downloadItem(aItems[iAttchmnt], true);
				}
				MessageToast.show(this.getResourceBundle().getText("attDownloadAll"));
			} else {
				MessageToast.show(this.getResourceBundle().getText("attNotAvailtoDownload"));
			}
		},

		/**
		 * This method is triggered on File Upload.
		 * @name onChange
		 * @param {sap.ui.base.Event} oEvent - Current Event Parameter
		 */
		onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			var sGetServiceCaseInfoURL = serviceCaseCreation.util.ServiceConfigConstants.getServiceCasesInfoURL;
			var oAttachmentsModel = new sap.ui.model.odata.ODataModel(sGetServiceCaseInfoURL, true);
			var oHeaders = oAttachmentsModel.oHeaders,
				sToken = oHeaders["x-csrf-token"];
			var oUploadCollection = oEvent.getSource();
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			var sAttachmentsUrl = serviceCaseCreation.util.ServiceConfigConstants.getServiceCasesInfoURL + "/" + serviceCaseCreation.util.ServiceConfigConstants
				.postAttachments;
			var oContentTypeCustomHeader; 	//PCR020161++
			
			/*************** Start of PCR020161++ changes;
			 * MIME Type issue changes ***************/
			
			if (!oEvent.getParameter("files")[0].type) {
				oContentTypeCustomHeader = new sap.m.UploadCollectionParameter({
					name: "content-type",
					value: "application/unknown",
				});
				
				oUploadCollection.addHeaderParameter(oContentTypeCustomHeader);
			}
			
			/******* End of PCR020161++ changes ********/

			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			oUploadCollection.setUploadUrl(sAttachmentsUrl);
		},

		/**
		 * This method is triggered before the file starts uploading.
		 * @name onBeforeUploadStarts
		 * @param {sap.ui.base.Event} oEvent - Current Event Parameter
		 */
		onBeforeUploadStarts: function(oEvent) {
			var oCustomerHeaderSlug;

			this.getModel("attachmentsView").setProperty("/uploadEnabled", false);

			if (this._oCntx) {
				oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
					name: "slug",
					value: that._oCntx.Servicecasenumber + "$$" + oEvent.getParameter("fileName")
				});
				oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
				MessageToast.show(this.getResourceBundle().getText("attUploadStarted"));
			}
		},

		/**
		 * This method is triggered when file starts uploading.
		 * @name onStartUpload
		 * @param {sap.ui.base.Event} oEvent - Current Event Parameter
		 */
		onStartUpload: function() {
			var cFiles = this._oAttCollections.getItems().length,
				uploadInfo = "";

			this._oAttCollections.upload();
			uploadInfo = cFiles + " " + this._oResourceBundle.getText("attFiles");
			MessageToast.show(uploadInfo + this._oResourceBundle.getText("attUploading"));
		},

		/**
		 * This method is triggered when file is uploaded to the view.
		 * @name onUploadComplete
		 * @param {sap.ui.base.Event} oEvent - Current Event Parameter
		 */
		onUploadComplete: function(oEvent) {
			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			var i;

			for (i = 0; i < this._oAttCollections.getItems().length; i++) {
				if (this._oAttCollections.getItems()[i].getFileName() === sUploadedFileName) {
					break;
				}
			}

			this.fnFetchAttachments();
			MessageToast.show(this._oResourceBundle.getText("attUploadSuccess"));
			this.getModel("attachmentsView").setProperty("/uploadEnabled", true);
		},

		/**
		 * This method is triggered when item from the attachments get deleted.
		 * @name onFileDeleted
		 * @param {sap.ui.base.Event} oEvent - Current Event Parameter
		 */
		onFileDeleted: function(oEvent) {
			var sQuery = oEvent.getParameter("documentId");
			var oAttDelEvt;
			var sGetServiceCaseInfoURL = serviceCaseCreation.util.ServiceConfigConstants.getServiceCasesInfoURL;
			var oAttDelModel = new sap.ui.model.odata.ODataModel(sGetServiceCaseInfoURL, {
				json: true,
				loadMetadataAsync: true,
				defaultCountMode: "None",
				headers: {
					'User-Agent': navigator.userAgent,
					"X-Requested-With": "XMLHttpRequest",
					"Content-Type": "application/json",
				}
			});

			MessageToast.show(this._oResourceBundle.getText("attFileDelEvent"));
			this._oAttCollections.setBusyIndicatorDelay(0);
			this._oAttCollections.setBusy(true);

			oAttDelModel.remove(sQuery, {
				method: serviceCaseCreation.util.ServiceConfigConstants.del,
				success: this.handleAttachmentsDeleteSuccess,
				error: this.handleAttachmentsDeleteFail
			});
		},

		/**
		 * This method is the success call back function for Attachments delete event.
		 * @name handleAttachmentsDeleteSuccess
		 * @param {Object} oSuccess - success response object
		 */
		handleAttachmentsDeleteSuccess: function(oSuccess) {
			that.fnFetchAttachments();
			MessageToast.show(that._oResourceBundle.getText("AttDelSuccess"));
		},

		/**
		 * This method is the error call back function for Attachments delete event.
		 * @name handleAttachmentsDeleteFail
		 * @param {Object} oError - error response object
		 */
		handleAttachmentsDeleteFail: function(oError) {
			that._oAttCollections.setBusy(false);
			MessageToast.show(that._oResourceBundle.getText("AttDelFail"));
			serviceCaseCreation.fragmentHelper.handleErrorResponseDialog(that, oErrorResponse);
		},

		/**
		 * This method is triggered when file name length exceeds the maximum length.
		 * @name onFilenameLengthExceed
		 */
		onFilenameLengthExceed: function() {
			MessageToast.show(this._oResourceBundle.getText("attFileLength"));
		},

		/**
		 * This method is triggered when file length exceeds the maximum length.
		 * @name onTypeMissmatch
		 */
		onTypeMissmatch: function() {
			MessageToast.show(this._oResourceBundle.getText("attTypeMismatch"));
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
				oViewModel = this.getModel("attachmentsView");
			var sStatus;
			this._sToken = "";

			if (sContext && oServiceCaseModel) {
				serviceCaseCreation.model.ResponseHandler._createModelForTheEvent.call(this, {}, "attachmentsModel");
				this._oAttCollections.setModel(this.getModelFromCore("attachmentsModel"));

				oView.bindElement(sContextPath);
				this._oCntx = oServiceCaseModel.getProperty(sContextPath);
				sStatus = this._oCntx.Orderstatus;

				if (sStatus === "Work Completed") {
					oViewModel.setProperty("/bDisableElements", false);
				} else {
					oViewModel.setProperty("/bDisableElements", true);
				}

				oViewModel.updateBindings();
				this.getModelFromCore("attachmentsModel").updateBindings();
			}
		},

		/**
		 * An internal method which will update the title of the upload
		 * collection control, once the list is updated with proper data.
		 * @name _getAttachmentTitleText
		 * @private
		 */
		_getAttachmentTitleText: function() {
			var aItems = this._oAttCollections.getItems(),
				sTitle = this.getResourceBundle().getText("attachmentsTitleCount"),
				sCount = (aItems.length) ? aItems.length.toString() : "0";

			sTitle = sTitle + " (" + sCount + ")";
			this.getModel("attachmentsView").setProperty("/title", sTitle);
		}

	});

});