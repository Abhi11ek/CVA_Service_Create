/**
 * This class holds all handler methods from server interaction.
 *
 * @class 
 * @public
 * @author Siva Prasad Paruchuri
 * @since 13 November 2016
 * @extends 
 * @name serviceCaseCreation.model.ResponseHandler
 */
/** ----------------------------------------------------------------------------------- *
 * Modifications.                                                                       *
 * -------------                                                                        *
 * Ver.No    Date        Author  	     PCR No.           Description of change        *
 * ------ ---------- ---------------   -----------     -------------------------------- *
 * V00    13/10/2016   Siva Prasad 													    *
 * 					  Prachuri/Alok 	PCR012146		initial version		    		*
 *                     (X087050)                                                        *
 ****************************************************************************************
 ************************************************************************
 *  Date        Author    PCR No.          Description of change        *
 ************ ********  **********  *************************************
 * 02/13/2018  X087924	 PCR017437  Technology and PBG changes	and     *
 * 									 Category fields data bindings	    *
 * 11/06/2018  X087924   PCR018233  Exe. Service Employee Addition 	    *
 * 									 changes						    *
 * 07/31/2018  X087924   PCR018422	Pass Down Log and attachments events*
 * 03/02/2020  X0108534  PCR027291   Add the category 3 & Category4     *
 * 03/30/2020  X0108534  PCR027779   Shift pass down fields    			*
 * 08/31/2020  X0108534  PCR030996   ARK URL						    *
 * 09/22/2020  X0108356  PCR031702   Ibase Implementation				*
 ************************************************************************/

jQuery.sap.declare("serviceCaseCreation.model.ResponseHandler");

serviceCaseCreation.model.ResponseHandler = {

	handleSuccessResponse: function(oResponeData, eventName, entitySet) {

		switch (eventName) {

			case "SERVICE_CASES_READ_SUCCESS":
				if (entitySet === 0) {
					var masterListObject = {
						"masterListSets": {
							symptom: [],
							fault: [],
							tier: [],
							catagorization: [],
							TandM: [],
							serviceClassification: [],
							serviceType: [],
							delay: [],
							status: [],
							labor: [],
							pmcatagorization: [],
							accountassignment: [],
							nonconform: [],
							category2: [],
							category3: [], //PCR027291++
							category4: [], //PCR027291++
							toolStatus: [], //PCR020942++
							assemblyStatus: [], //PCR027779++
							custoolStatus:[] //PCR027779++
						}
					};

					var masterListCategories = ["ZSYMPTOM", "ZFAULT", "ZCIFIXED_BILL", "ZCIDELAY", "ZLABOR", "ZTIER", "ZSTATUS",
						"ZCISRV_CLS", "ZPMCATEGORY", "ZACC_CAT", "ZCINON_CON", "ZCATEGORY2", "ZCITOOL_STS","ZCATEGORY3","ZCATEGORY4",
						"ZCIASMBLY_STS", "ZCICUST_TOOLSTS"
					]; //PCR020942++; added "ZCITOOL_STS"
					//PCR027291++ added ""ZCATEGORY3" and ""ZCATEGORY4"
					////PCR027779++ added ZCIASMBLY_STS and ZCICUST_TOOLSTS

					var oItem = {
						FieldGroup: "ZCIFIXED_BILL",
						GuidKey: "",
						KeyValue1: "",
						KeyValue2: "",
						KeyValue3: "",
					};

					masterListObject.masterListSets.TandM.push(oItem);

					for (var obj in oResponeData.d.results) {
						switch (oResponeData.d.results[obj].FieldGroup) {

							case "ZSYMPTOM":
								masterListObject.masterListSets.symptom.push(oResponeData.d.results[obj]);
								break;

							case "ZFAULT":
								masterListObject.masterListSets.fault.push(oResponeData.d.results[obj]);
								break;

							case "ZCIFIXED_BILL":
								masterListObject.masterListSets.TandM.push(oResponeData.d.results[obj]);
								break;

							case "ZCIDELAY":
								masterListObject.masterListSets.delay.push(oResponeData.d.results[obj]);
								break;

							case "ZCISRV_CLS":
								masterListObject.masterListSets.serviceClassification.push(oResponeData.d.results[obj]);
								break;

							case "ZSTATUS":
								masterListObject.masterListSets.status.push(oResponeData.d.results[obj]);
								break;

							case "ZLABOR":
								masterListObject.masterListSets.labor.push(oResponeData.d.results[obj]);
								break;

							case "ZTIER":
								masterListObject.masterListSets.tier.push(oResponeData.d.results[obj]);
								break;

							case "ZCATEGORY":
								masterListObject.masterListSets.catagorization.push(oResponeData.d.results[obj]);
								break;

							case "ZPMCATEGORY":
								masterListObject.masterListSets.pmcatagorization.push(oResponeData.d.results[obj]);
								break;

							case "ZACC_CAT":
								masterListObject.masterListSets.accountassignment.push(oResponeData.d.results[obj]);
								break;

							case "ZCINON_CON":
								masterListObject.masterListSets.nonconform.push(oResponeData.d.results[obj]);
								break;

							case "ZCATEGORY2":
								masterListObject.masterListSets.category2.push(oResponeData.d.results[obj]);
								break;
								
							/*Begin of PCR020942++ changes*/
								
							case "ZCITOOL_STS":
								masterListObject.masterListSets.toolStatus.push(oResponeData.d.results[obj]);
								break;
								
							/*End of PCR020942++ changes*/
							
							/*Begin of PCR027291++ changes*/
								
							case "ZCATEGORY3":
								masterListObject.masterListSets.category3.push(oResponeData.d.results[obj]);
								break;
								
							case "ZCATEGORY4":
								masterListObject.masterListSets.category4.push(oResponeData.d.results[obj]);
								break;
								
							/*End of PCR027291++ changes*/
								
							/*Begin of PCR027779++ changes*/
								
							case "ZCIASMBLY_STS":
								masterListObject.masterListSets.assemblyStatus.push(oResponeData.d.results[obj]);
								break;
								
							case "ZCICUST_TOOLSTS":
								masterListObject.masterListSets.custoolStatus.push(oResponeData.d.results[obj]);
								break;
								
							/*End of PCR027779++ changes*/

							default:
								break;

						}
					}
					this._createModelForTheEvent(masterListObject, "ccMasterListModel");
				}
				if (entitySet === 1)
					this._createModelForTheEvent(oResponeData, "ccServiceCaseModel");
				/*Begin of PCR030996++*/
				if (entitySet === 2)
					this._createModelForTheEvent(oResponeData, "ccARKModel");
				/*End of PCR030996++*/

				break;

			case "CUSTOMER_TOOLID_READ_SUCCESS":

				this._createModelForTheEvent(oResponeData, "ccServiceCaseCreateModel");
				break;

			case "CASE_CREATION_USER_HELP_SUCCESS":

				this._createModelForTheEvent(oResponeData, "ccUserHelpListModel");
				break;

			case "SERVICE_CASES_SEARCH_SUCCESS":

				this._createModelForTheEvent(oResponeData, "ccServiceCaseModel");
				break;

			case "TIER_LIST_READ_SUCCESS":

				this._createModelForTheEvent(oResponeData, "ccTierListModel");
				break;

			case "SERVICE_CASE_READ_SUCCESS":
				if (entitySet === 0) { //PCR020942++
					var oServiceCaseModel = sap.ui.getCore().getModel("ccServiceCaseModel");
					var arrList = oServiceCaseModel.getData().d.results;
					for (var i in arrList) {
						if (arrList[i].Servicecasenumber === oResponeData.d.results[0].Servicecasenumber) {
							arrList[i] = oResponeData.d.results[0];
						}
					}
					this._createModelForTheEvent(oServiceCaseModel.getData(), "ccServiceCaseModel");
					this._createModelForTheEvent(oResponeData, "ccServiceOrderModel"); //PCR017437++
				
				/*Begin PCR020942++ changes*/
					
				} else if (entitySet === 1) {
					var oAssemblyObject = {
						"assemblyListSets": {
							assembly: []
						}
					},
					assemblyCategories = [
						"ASSEMBLY"
					];
					
					for (var obj = 0; obj < oResponeData.d.results.length; obj++) {
						switch (oResponeData.d.results[obj].FieldGroup) {
							case "ASSEMBLY":
								oAssemblyObject.assemblyListSets.assembly.push(oResponeData.d.results[obj]);
								break;
								
							default:
								break;
						}
					}
					
					this._createModelForTheEvent(oAssemblyObject, "ccEditAssemListModel");
				}
				
				/*End of PCR020942++ changes*/
				
				break;

				/*start of PCR018233++ changes*/
			case "ESE_READ_SUCCESS":
				
				this._createModelForTheEvent(oResponeData, "displayESEModel");
				break;
				/*end of PCR018233++ changes*/

				/*Start of PCR018422++ changes
			Pass Down Log Read and attachments events*/

			case "PSDN_LOG_READ_SUCCESS":
				
				this._createModelForTheEvent(oResponeData, "passDownLogModel");
				break;

			case "ATTACHMENTS_READ_SUCCESS":
				
				this._createModelForTheEvent(oResponeData, "attachmentsModel");
				break;

				/*End of PCR018422++ changes*/
				
			/*Begin of PCR020942++ changes; KA Project changes*/
				
			case "ASSEM_READ_SUCCESS":
				var oAssemblyObject = {
					"assemblyListSets": {
						assembly: []
					}
				},
				assemblyCategories = [
					"ASSEMBLY"
				];
				
				for (var obj = 0; obj < oResponeData.d.results.length; obj++) {
					switch (oResponeData.d.results[obj].FieldGroup) {
						case "ASSEMBLY":
							oAssemblyObject.assemblyListSets.assembly.push(oResponeData.d.results[obj]);
							break;
							
						default:
							break;
					}
				}
				
				this._createModelForTheEvent(oAssemblyObject, "ccAssemListModel");
				break;
				
			/*End of PCR020942++ changes*/
			
			/*Begin of IBase PCR031702++ changes*/
			case "IBASE_ASSEMBLYPOSITION_READ_SUCCESS":
				if (entitySet === 0){
					this._createModelForTheEvent(oResponeData, "ibaseNewPosListModel");
				}
				else if (entitySet === 1){
					this._createModelForTheEvent(oResponeData, "ibaseChamberSetModel");
				}
				else if (entitySet === 2){
					var data = oResponeData.d.results;
					var IbaseListObject = {
								objType:[],
								cleanerType: [],
								inlineMetrology: [],
								platen1: [],
								platen2: [],
								platen3: [],
								platen1Pad: [],
								platen2Pad: [],
								platen3Pad: [],
								polishingHead:[]
					};
								
							
					for(var j = 0; j < data.length; j++){
						var selObject = oResponeData.d.results[j].Eqart;
						var objTypSet = {
							Value:selObject	
						};
						IbaseListObject.objType.push(objTypSet);
						switch (selObject){
							case serviceCaseCreation.constants.ObjTypeCleaner:
								IbaseListObject.cleanerType = oResponeData.d.results[j].Nav_CharName.results[0].Nav_CharValuesSet;
							break;
							case serviceCaseCreation.constants.ObjTypeMetrology:
								var metrologyData = oResponeData.d.results[j].Nav_CharName.results;
								for(var k = 0; k < metrologyData.length; k++){
									var charName =  oResponeData.d.results[j].Nav_CharName.results[k].CharName;
									switch (charName){
									case serviceCaseCreation.constants.InlineMetrology:
										IbaseListObject.inlineMetrology = oResponeData.d.results[j].Nav_CharName.results[k].Nav_CharValuesSet;
									break;	
									case serviceCaseCreation.constants.Platen1Insitumetrology:
										IbaseListObject.platen1 = oResponeData.d.results[j].Nav_CharName.results[k].Nav_CharValuesSet;
									break;	
									case serviceCaseCreation.constants.Platen2Insitumetrology:
										IbaseListObject.platen2 = oResponeData.d.results[j].Nav_CharName.results[k].Nav_CharValuesSet;
									break;	
									case serviceCaseCreation.constants.Platen3Insitumetrology:
										IbaseListObject.platen3 = oResponeData.d.results[j].Nav_CharName.results[k].Nav_CharValuesSet;
									break;	
									default:
									break;	
									}
								}
							break;
							case serviceCaseCreation.constants.ObjTypePolisher:
								var polisherData = oResponeData.d.results[j].Nav_CharName.results;
								for( k = 0; k < polisherData.length; k++){
									charName =  oResponeData.d.results[j].Nav_CharName.results[k].CharName;
									switch (charName){
										case serviceCaseCreation.constants.Platen1Pad:
											IbaseListObject.platen1Pad = oResponeData.d.results[j].Nav_CharName.results[k].Nav_CharValuesSet;
										break;	
										case serviceCaseCreation.constants.Platen2Pad:
											IbaseListObject.platen2Pad = oResponeData.d.results[j].Nav_CharName.results[k].Nav_CharValuesSet;
										break;	
										case serviceCaseCreation.constants.Platen3Pad:
											IbaseListObject.platen3Pad = oResponeData.d.results[j].Nav_CharName.results[k].Nav_CharValuesSet;
										break;	
										case serviceCaseCreation.constants.PolishingHead:
											IbaseListObject.polishingHead = oResponeData.d.results[j].Nav_CharName.results[k].Nav_CharValuesSet;
										break;	
										default:
										break;	
									
									}
								}
							break;
													
							default:
							break;
						}
					}
					this._createModelForTheEvent(IbaseListObject, "ibaseDropDownModel");
				}
				break;	
			
			case "IBASE_GOTCODE_READ_SUCCESS":
				this._createModelForTheEvent(oResponeData, "ibaseGotCodeModel");
				break;
			
			case "IBASE_VALID_READ_SUCCESS":
				this._createModelForTheEvent(oResponeData, "ibaseMandateModel");
				break;	
			/*End of IBase PCR031702++ changes*/
				
			default:
				break;
		}

	},

	_createModelForTheEvent: function(oData, modelName) {
		var eventModel = new sap.ui.model.json.JSONModel();
		eventModel.setData(oData);
		eventModel.setSizeLimit(3000); //PCR017437++
		sap.ui.getCore().setModel(eventModel, modelName);
		return;
	},

	handleErrorResponse: function(oError) {
		//error handling goes here
	}

}
