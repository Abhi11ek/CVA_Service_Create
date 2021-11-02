/** ----------------------------------------------------------------------------------   *
 * Modifications.                                                                         *
 * -------------                                                                          *
 * Ver.No    Date        Author  	    PCR No.           Description of change          *
 * ------------------------------------------------------------------------------------   *
 * V00    13/10/2016   Siva Prasad
 * 					Prachuri/Alok 		PCR012146		  initial version
 *                     (X087050)                                                          *
 *                                                                                        *
 * V01    10/11/2017    X087924	  		PCR016459		  Persistent Filters and Sort    *
 ******************************************************************************************
 ************************************************************************
 *  Date        Author    PCR No.          Description of change        *
 ************ ********  **********   ***********************************
 * 02/13/2018   X087924	 PCR017437   Technology and PBG changes	and    *
 * 									 Category fields data bindings	   *
 * 05/27/2021   X089025  PCR035464   Upgrade issue resolution          *
 ************************************************************************/
jQuery.sap.declare("serviceCaseCreation.util.Util");

serviceCaseCreation.util.Util = {

	/**
	 * This method is for date format
	 * @name dateFormat
	 * @param value - Current event parameter
	 * @returns
	 */
	dateFormat: function(value) {

		if (value != null) {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				pattern: "dd/MM/yyyy"
			});
			return oDateFormat.format(new Date(value));
		}
	},

	/**
	 * This method for validation of input fields .
	 * @name doCompleteInputElementsValidation
	 * @param aInputElementsRef - Holds the array of input fields
	 * @returns
	 */
	doCompleteInputElementsValidation: function(aInputElementsRef) {

		var isMandatoryFieldCheckSuccess = true;
		var oErrorField;
		jQuery.each(aInputElementsRef, function(i, oInputElementsRef) {

			if (oInputElementsRef.getValue().trim() === "") {
				oInputElementsRef.setValueState(sap.ui.core.ValueState.Error);
				isMandatoryFieldCheckSuccess = false;
			} else
				oInputElementsRef.setValueState(sap.ui.core.ValueState.None);
		});

		return isMandatoryFieldCheckSuccess;
	},

	/**
	 * This method is used to check the validations for the ComboBox fields
	 * @name doCompleteComboBoxElementsValidation
	 * @param aInputElementsRef - Holds the array of ComboBox fields
	 * @param oController - Holds the object of current controller
	 * @returns
	 */
	doCompleteComboBoxElementsValidation: function(oController, aInputElementsRef) {

		var isMandatoryFieldCheckSuccess = true;
		var aComboBoxItems,
			that = oController,
			oComboBoxElement,
			aComboBoxKeys = [];

		jQuery.each(aInputElementsRef, function(i, oComboBoxElementsRef) {
			var aComboBoxItemText = [];
			oComboBoxElement = that.getCurrentView().byId(oComboBoxElementsRef);
			sComboBoxValue = oComboBoxElement.getValue();
			aComboBoxItems = oComboBoxElement.getItems();

			if (sComboBoxValue != "") {
				for (var oItem in aComboBoxItems)
					aComboBoxItemText.push(aComboBoxItems[oItem].getText());

				if (aComboBoxItemText.indexOf(sComboBoxValue) < 0) {
					oComboBoxElement.setValueState(sap.ui.core.ValueState.Error);
					isMandatoryFieldCheckSuccess = false;
				} else {
					aComboBoxKeys.push(aComboBoxItems[aComboBoxItemText.indexOf(sComboBoxValue)].getKey());
					oComboBoxElement.setValueState(sap.ui.core.ValueState.None);
				}
			} else {
				oComboBoxElement.setValueState(sap.ui.core.ValueState.None);
			}
		});

		return [isMandatoryFieldCheckSuccess, aComboBoxKeys];

	},

	/**
	 * This method is for input element validation
	 * @name onInputElementLiveChange
	 * @param oController - Holds the object of current controller
	 * @param oInputElementsRef - Holds the array of input fields
	 * @returns
	 */
	onInputElementLiveChange: function(oController, oInputElementsRef) {
		var oView = oController.getCurrentView(),
			aInputElementsRef = [
				oView.byId(oInputElementsRef),
			];

		serviceCaseCreation.util.Util.doCompleteInputElementsValidation(aInputElementsRef);
	},

	/**
	 * This method is for Reset problem description label and text visibility.
	 * @name handleProblemDescription
	 * @param oController - Holds the object of current controller
	 * @param descTxt- Holds the problem description text field parameter
	 * @param descLbl - Holds the problem description label field parameter
	 * @param linkTxt - Holds problem description link
	 * @param prbDscIcon - Holds problem description Icon
	 * @returns
	 */

	resetProblemDescriptionInitialPosition: function(oController, descTxt, descLbl, linkTxt, prbDscIcon) {

		var oView = oController.getCurrentView();
		var lSrc = serviceCaseCreation.StandardSAPIcons.ICON_SAP_SLIM_ARROW_UP,
			mSrc = serviceCaseCreation.StandardSAPIcons.ICON_SAP_SLIM_ARROW_DOWN;

		oView.byId(descTxt).setVisible(false);
		oView.byId(descLbl).setVisible(true);

		oView.byId(linkTxt).setText("More");
		if (oView.byId(prbDscIcon).getSrc() == lSrc)
			oView.byId(prbDscIcon).setSrc(mSrc);

	},

	/**
	 * This method is for handle problem description label and text visibility.
	 * @name handleProblemDescription
	 * @param oController - Holds the object of current controller
	 * @param count - Holds the counter
	 * @param prbDscTxt- Holds the problem description text field parameter
	 * @param prbDscLbl - Holds the problem description label field parameter
	 * @param descLink - Holds problem description link
	 * @param descIcon - Holds problem description Icon
	 * @returns
	 */

	handleProblemDescription: function(oController, count, prbDscTxt, prbDscLbl, descLink, descIcon) {

		var lSrc = serviceCaseCreation.StandardSAPIcons.ICON_SAP_SLIM_ARROW_UP,
			mSrc = serviceCaseCreation.StandardSAPIcons.ICON_SAP_SLIM_ARROW_DOWN;
		var oView = oController.getCurrentView();
		var oPrbDscState = {};

		if (count % 2 != 0) {

			oPrbDscState.lblVisibility = false;
			oPrbDscState.txtVisibility = true;
			oPrbDscState.dscTxt = "Less";

		} else {

			oPrbDscState.lblVisibility = true;
			oPrbDscState.txtVisibility = false;
			oPrbDscState.dscTxt = "More";

		}

		oView.byId(prbDscLbl).setVisible(oPrbDscState.lblVisibility);
		oView.byId(prbDscTxt).setVisible(oPrbDscState.txtVisibility);
		oView.byId(descLink).setText(oPrbDscState.dscTxt);

		var sIcon = (oView.byId(descIcon).getSrc() === mSrc) ? lSrc : mSrc;
		oView.byId(descIcon).setSrc(sIcon);

	},

	/* V02++
	 * PCR016459++ changes start*/

	/**
	 * This internal method helps in setting persistent filters in Settings Model.
	 * @name setPersistentFilters
	 * @param {String} sEvent - occurred event
	 * @param {String} sQuery - either filter or sort query
	 * @param [elements] array - aFilters
	 */
	setPersistentFilters: function(sEvent, sQuery, aQueries) {

		var oSettingsModel = sap.ui.getCore().getModel("SettingsModel");
		if (oSettingsModel) {
			var oSettingsModelData = oSettingsModel.getData();
			if (!oSettingsModelData.hasOwnProperty(sEvent))
				oSettingsModelData[sEvent] = {};
			oSettingsModelData[sEvent][sQuery] = aQueries;
		}

	},

	/**
	 * This method is to delete persistent filters in Settings Model.
	 * @name DeleteDesiredPersistFilterQuery
	 * @param {String} sEvent - occurred event
	 */
	DeleteDesiredPersistFilterQuery: function(sEvent) {

		var oSettingsModel = sap.ui.getCore().getModel("SettingsModel");
		if (oSettingsModel) {
			var oSettingsModelData = oSettingsModel.getData();
			if (oSettingsModelData.hasOwnProperty(sEvent))
				delete oSettingsModelData[sEvent];
		}

	},

	/**
	 * This method is to validate if the persistent filters and
	 * sorters are present or not. If so, then triggere them.
	 * @name validateAndExecutePersistFilters
	 * @param {String} sListID - List ID on which the action are to be triggered
	 * @param {String} sEvent - Event name
	 */
	validateAndExecutePersistFilters: function(sListID, sEvent) {

		var that = this;
		this.getCurrentView().byId(sListID).attachEventOnce("updateFinished", function() {
			var oSettingsModel = sap.ui.getCore().getModel("SettingsModel");
			if (oSettingsModel) {
				var oList = that.getCurrentView().byId(sListID),
					oListBindings = oList.getBinding("items");
				if (oSettingsModel.getData().hasOwnProperty(sEvent)) {
					var oFilterSetting = oSettingsModel.getProperty("/" + sEvent),
						aStatusFilters = [];
					if (oFilterSetting.hasOwnProperty("Filter")) {
						if (oFilterSetting.Filter.length) {
							if (oFilterSetting.Filter.indexOf("Other") !== -1) {
								serviceCaseCreation.util.Util.getOtherFilterItems(aStatusFilters);
								if (!aStatusFilters.length)
									aStatusFilters.push(new sap.ui.model.Filter([]));
							}
							serviceCaseCreation.util.Util.fnHandleSearchFilters(oFilterSetting.Filter, ["Orderstatus"], aStatusFilters);
							oListBindings.filter([new sap.ui.model.Filter(aStatusFilters, false)]);
						}
					}
					if (oFilterSetting.hasOwnProperty("Sort"))
						serviceCaseCreation.util.Util._onlistSort(oList, that.sSorter, oFilterSetting.Sort);
				}
				that._fnSelectFirstItem();
			}
			if (!oSettingsModel)
				serviceCaseCreation.model.ResponseHandler._createModelForTheEvent.call(that, {}, "SettingsModel");
		});

	},

	/**
	 * An internal method helps in creating all the filter objects for various actions
	 * @name _fnHandleSearch
	 * @param {array} aQuery - array of queries for creating filters
	 * @param {array} aFilterParams - array of filter parameters
	 * @param {array} aSearchFilters - array of filter objects
	 * @returns
	 */
	fnHandleSearchFilters: function(aQuery, aFilterParams, aSearchFilters) {

		var sFilterRef, aPartFilters, sQuery;

		if (aQuery.length)
			for (sQuery in aQuery)
				for (sFilterRef in aFilterParams)
					aSearchFilters.push(new sap.ui.model.Filter(aFilterParams[sFilterRef], sap.ui.model.FilterOperator.Contains, aQuery[sQuery]));

	},

	/**
	 * This method is to sort the list.
	 * @name _onlistSort
	 * @param {Object} oList - List
	 * @param {Object} order - asc or dsc order
	 * @param {Object} groupBy - groupby template
	 */
	_onlistSort: function(oList, sorter, order) {

		var oSorter = new sap.ui.model.Sorter(sorter, order),
			oListBindings = oList.getBinding("items");
		oListBindings.sort(oSorter);

	},

	/**
	 * This method is to validate if there are any persistent
	 * filters or not and check its equivalent item in the view settings dialog.
	 * @name validateAndCheckViewSettingsFilterItems
	 * @param {Object} oDialog - View Settings Dialog
	 * @Param {String} sEvent - respective event
	 */
	validateAndCheckViewSettingsFilterItems: function(oDialog, sEvent) {

		var oSettingsModel = sap.ui.getCore().getModel("SettingsModel");
		var aFilterItems = oDialog.getFilterItems()[0].getItems();
		if (oSettingsModel) {
			var oSettingsModelData = oSettingsModel.getData();
			if (oSettingsModelData.hasOwnProperty(sEvent)) {
				if (oSettingsModelData[sEvent].hasOwnProperty("Filter")) {
					var aFilters = oSettingsModelData.ServiceCases.Filter;
					if (aFilters.length) {
						for (var oFilter in aFilterItems) {
							var oFilterItem = aFilterItems[oFilter];
							var bSelected = (aFilters.indexOf(oFilterItem.getText()) != -1) ? true : false;
							oFilterItem.setSelected(bSelected);
						}
					}
				}
			} else {
				for (var oFilter in aFilterItems)
					aFilterItems[oFilter].setSelected(false);
			}
			oDialog.setModel(oSettingsModel);
		}
		oSettingsModel.updateBindings();

	},

	/**
	 * This method is to create filter items if the filter setting is set to "Other".
	 * @name getOtherFilterItems
	 * @param [elements] aFilterItems - Array in which filter items are collected
	 */
	getOtherFilterItems: function(aFilterItems) {

		var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel");
		if (oServiceCaseModel) {
			var aServiceCases = oServiceCaseModel.getData().d.results;
			var aStatus = [],
				aDefinedStatus = ["Open", "Released", "Work Completed"];
			for (var oSvc in aServiceCases) {
				if (jQuery.inArray(aServiceCases[oSvc].Orderstatus, aStatus) === -1)
					aStatus.push(aServiceCases[oSvc].Orderstatus);
			}
		}
		for (var sStatus in aStatus) {
			if (aDefinedStatus.indexOf(aStatus[sStatus]) === -1) {
				oFilter = new sap.ui.model.Filter("Orderstatus", sap.ui.model.FilterOperator.Contains, aStatus[sStatus]);
				aFilterItems.push(oFilter);
			}
		}

	},

	/*PCR016459++ changes end*/

	/***********************PCR017437++ change start***********************/

	/**
	 * This method to bind data to Symptom level fields.
	 * @name filterSymptomLevelsBindings
	 * @param {Object} oContext - Current Context
	 * @param {Object} sSymptomsRef - SymptomLevels Navigation Property
	 * @param {Object} sSymptomLevelOneId - Symptom Level One Id
	 * @returns
	 */

	filterSymptomLevelsBindings: function(oContext, sSymptomsRef) { //PCR020942--; removed sSymptomLevelOneId

		var aSymLevel1Filters = []; //PCR020942++

		if (oContext) {
			this._oSymLevels = {};
			var aSymLevels = [];
			if (oContext[sSymptomsRef]) { //PCR020942++
				if (oContext[sSymptomsRef].hasOwnProperty("results")) {
					var aSymptomLevels = oContext[sSymptomsRef].results;
					if (aSymptomLevels.length) {
						for (var oSym in aSymptomLevels) {
							if (oContext.Pbg === aSymptomLevels[oSym].Pbg && oContext.Technology === aSymptomLevels[oSym].Technology || (oContext.Pbg ===
									aSymptomLevels[oSym].Pbg && !aSymptomLevels[oSym].Technology))
								aSymLevels.push(aSymptomLevels[oSym])
						}
					}
				}
				if (aSymLevels.length) {
					for (var oSympLevel in aSymLevels) {
						var sSympLevelOne = aSymLevels[oSympLevel].Symptom1;
						if (jQuery.inArray(sSympLevelOne, Object.keys(this._oSymLevels)) === -1) {

							// in this._oSymLevels object, add symptom level1 unique values a key and assign empty array to it
							this._oSymLevels[sSympLevelOne] = [];

							//get all the unique symptom level 2 values for a given symptom level 1 value
							// by the end of this for loop, this._oSymLevels will have symptom level 1 and its corresponding symptom level 2 values
							for (var oSymLvl in aSymLevels) {
								var oSymItem = aSymLevels[oSymLvl];
								if (sSympLevelOne === oSymItem.Symptom1) {
									if (jQuery.inArray(oSymItem.Symptom2, this._oSymLevels[sSympLevelOne]) === -1)
										this._oSymLevels[sSympLevelOne].push(oSymItem.Symptom2)
								}
							}

						}
					}
					//If the existing value of Symptom Level 1 is not present in the symptom levels data fetched
					//then create a key with symptom level 1 value in this._oSymLevels object and assign an array to it
					// fill its corresponding symptom level 2 data from master data symptom level 2 values
					if (oContext && this.getModelFromCore("ccMasterListModel")) {
						var aSymptomLevelTwo = this.getModelFromCore("ccMasterListModel").getData().masterListSets.fault;
						if (oContext.SymptomDesc) {
							var sSymptomLevelOneVal = oContext.SymptomDesc.toUpperCase();
							if (jQuery.inArray(sSymptomLevelOneVal, Object.keys(this._oSymLevels)) === -1) {
								this._oSymLevels[sSymptomLevelOneVal] = [];
								for (var oSym in aSymptomLevelTwo) {
									if (oContext.Symptom === aSymptomLevelTwo[oSym].ParentGuidKey)
										this._oSymLevels[sSymptomLevelOneVal].push(aSymptomLevelTwo[oSym].KeyValue1);
								}
							}
						}
						if (oContext.FaultDesc) {
							var aSymLevelTwoUpperCase = [];
							var sSymptomLevelOneVal = oContext.SymptomDesc.toUpperCase();
							for (var sSymLevelTwo in this._oSymLevels[sSymptomLevelOneVal])
								aSymLevelTwoUpperCase.push(this._oSymLevels[sSymptomLevelOneVal][sSymLevelTwo].toUpperCase())
							if (jQuery.inArray(oContext.FaultDesc.toUpperCase(), aSymLevelTwoUpperCase) === -1) {
								this._oSymLevels[sSymptomLevelOneVal].push(oContext.FaultDesc.toUpperCase());
							}
						}
					}
				}
				var aSymLevelOne = Object.keys(this._oSymLevels);
				if (aSymLevelOne.length && this.getModelFromCore("ccMasterListModel")) {
					// var aSymLevel1Filters = []; //PCR020942--
					var aSymptomLevelOne = this.getModelFromCore("ccMasterListModel").getData().masterListSets.symptom;
					for (var sFilter in aSymLevelOne) {
						for (var oSym in aSymptomLevelOne) {
							if (aSymLevelOne[sFilter].toLowerCase() === aSymptomLevelOne[oSym].KeyValue1.toLowerCase())
								aSymLevel1Filters.push(new sap.ui.model.Filter("KeyValue1", sap.ui.model.FilterOperator.EQ, aSymptomLevelOne[oSym].KeyValue1));
						}
					}
					// this.getCurrentView().byId(sSymptomLevelOneId).getBinding("items").filter(aSymLevel1Filters);
				}
			}
		}

		return aSymLevel1Filters; //PCR020942++

	},

	/**
	 * This method is to filter symptom level 2 bindings based on symptom level one .
	 * @name filterSymptomLevelTwoBindings
	 * @param {String} sSympLevelOneVal - Symptom Level One value
	 * @param {String} sSymLvlTwoId - Symptom Level Two Id
	 * @param {String} sEvent - event from where its triggered
	 * @returns {Object[]} aSymLevel2Filters - Symptom Level 2 filters
	 */

	filterSymptomLevelTwoBindings: function(sSympLevelOneVal, sSymLvlTwoId, sEvent) { //PCR020942++ changes; added sEvent
		var oSymLvlTwoComboBox = this.getCurrentView().byId(sSymLvlTwoId),
			aSymLvlTwoComboBoxItems = oSymLvlTwoComboBox.getItems();
		var oMasterListModel = this.getModelFromCore("ccMasterListModel"),
			aSymItems = oMasterListModel.getProperty("/masterListSets/symptom");
		var aSymLevel2Filters = [],
			sSymOneKey = "";
		var sValue, oItem, oSymTwoItem;

		if (Object.keys(this._oSymLevels).length && sSympLevelOneVal) {
			/*var oSymLvlTwoComboBox = this.getCurrentView().byId(sSymLvlTwoId),
				aSymLvlTwoComboBoxItems = oSymLvlTwoComboBox.getItems();
			var aSymLevel2Filters = []; */
			var aMasterDataSymLevelTwo = [];
			var oSym, sFilter, sSympLevelTwo, iSymLevelTwoIndex;

			sSympLevelOneVal = sSympLevelOneVal.toUpperCase();

			for (oSym in aSymLvlTwoComboBoxItems) {
				aMasterDataSymLevelTwo.push(aSymLvlTwoComboBoxItems[oSym].getText().toUpperCase());
			}

			for (sFilter in this._oSymLevels[sSympLevelOneVal]) {
				sSympLevelTwo = this._oSymLevels[sSympLevelOneVal][sFilter].toUpperCase();
				iSymLevelTwoIndex = jQuery.inArray(sSympLevelTwo, aMasterDataSymLevelTwo);

				if (iSymLevelTwoIndex !== -1) {
					aSymLevel2Filters.push(new sap.ui.model.Filter("KeyValue1", sap.ui.model.FilterOperator.EQ, aSymLvlTwoComboBoxItems[
						iSymLevelTwoIndex].getText()));
				}

				if (sEvent === "onEdit") {
					oSymLvlTwoComboBox.getBinding("items").filter(aSymLevel2Filters);
				}
			}
		} else if (!Object.keys(this._oSymLevels).length && sEvent === "onCreate") {
			for (oItem in aSymLvlTwoComboBoxItems) {
				sValue = aSymLvlTwoComboBoxItems[oItem].getBindingContext().getObject().KeyValue1;
				aSymLevel2Filters.push(new sap.ui.model.Filter("KeyValue1", sap.ui.model.FilterOperator.EQ, sValue))
			}
		} else if (!Object.keys(this._oSymLevels).length && sSympLevelOneVal) {
			for (oItem in aSymItems) {
				if (sSympLevelOneVal === aSymItems[oItem].KeyValue1) {
					sSymOneKey = aSymItems[oItem].GuidKey;
					break;
				}
			}
			for (oItem in aSymLvlTwoComboBoxItems) {
				oSymTwoItem = aSymLvlTwoComboBoxItems[oItem].getBindingContext().getObject();
				
				if (sSymOneKey === oSymTwoItem.ParentGuidKey) {
					sValue = oSymTwoItem.KeyValue1;
					aSymLevel2Filters.push(new sap.ui.model.Filter("KeyValue1", sap.ui.model.FilterOperator.EQ, sValue));
				}
			}
			
		}

		return aSymLevel2Filters;
	},

	/**
	 * This method to clear Bindings and filters of Symptom level fields .
	 * @name clearSympLevelElementsBindings
	 * @param [array] aElements - category fields
	 * @returns
	 */

	clearSympLevelElementsBindings: function(aElements) {

		this._oSymLevels = {};
		var oView = this.getCurrentView();

		this.clearElementsWithIDs(aElements);
		this.clearKeyValueswithIds(aElements);
		oView.byId(aElements[0]).setModel(new sap.ui.model.json.JSONModel({}));

		for (var sElementId in aElements)
			oView.byId(aElements[sElementId]).getBinding("items").filter([]);

	},

	/***********************PCR017437++ change end***********************/

	/*Begin of PCR020942++ changes*/

	/**
	 * An internal method to set Sym Level two element's data.
	 * @name _fnSetSymLevelsFieldsData
	 * @param {String} sKey - Sym Level One key value
	 * @param {String} sId - Element id
	 * @param {Boolean} flag - flag
	 */
	//_fnSetSymLevelsFieldsData: function(sKey, sId) {                                                                                                                                //PCR035464--
	_fnSetSymLevelsFieldsData: function(sKey, sId, flag) {                                                                                                                            //PCR035464++; flag added
		var oMasterListModel = sap.ui.getCore().getModel("ccMasterListModel");
		var sProcessType = (this.ServiceCaseModel) ? this.ServiceCaseModel.Servicetype : this.sServiceType;
		var arrFix, aFixItems, oFixItem, oFixModel;

		if (oMasterListModel) {
			if (sProcessType === "ZCMO") {
				arrFix = [];
				aFixItems = oMasterListModel.getData().masterListSets.fault;

				for (oFixItem in aFixItems) {
					if (aFixItems[oFixItem].ParentGuidKey === sKey) {
						arrFix.push(aFixItems[oFixItem]);
					}
				}
				oFixModel = new sap.ui.model.json.JSONModel({
					masterListSets: {
						aFix: arrFix
					}
				});

				//this.getView().byId(sId).setModel(oFixModel);                                                                                                                       //PCR035464--
				flag ? this.getView().byId(sId).setModel(oFixModel) : "";                                                                                                             //PCR035464++
			}
		}

	},

	/*End of PCR020942++ changes*/
}