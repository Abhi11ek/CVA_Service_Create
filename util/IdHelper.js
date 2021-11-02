jQuery.sap.declare("serviceCaseCreation.IdHelper");
/**
 * @file: This file consists of all static IDs used in the Service Case Creation application
 * @author Alok/Siva Paruchuri
 * @since 13 October 2016
 * @name serviceCaseConfirmation.IdHelper
 *  
 * -----------------------------------------------------------------------------*
 * Modifications.                                                               *
 * -------------                                                                *
 * Ver.No    Date        Author    		PCR No.     Description of change       *
 * ------ ---------- 	------------ 	----------  ----------------------------*
 * V00    13/10/2016	Alok/Siva                   Initial version             *
 *                    	Prasad Paruchuri                            			*
 *                     	(X087050)                                               *
 * V01   30/11/2017    	X087924    		PCR016664	CR 56-2 changes             *
 ********************************************************************************
 ********************************************************************************
 *  Date        Author    	PCR No.      Description of change       			*
 ************ 	********	**********   ****************************************
 * 02/13/2018	X087924  	PCR017437   Technology and PBG changes      		*
 * 11/06/2018   X087924   	PCR018233   Exe. Service Employee Addition changes  *
 * 08/01/2018   X087924	 	PCR018422   Pass Down and Attachment changes  		*
 * 10/03/2018   X087924  	PCR020161   Indirect Labor changes        			*
 * 11/19/2019   Vimal Pandu PCR020942   KA Project changes         				*
 * 03/02/2020   X0108534 	PCR027291   Add the category 3 & Category4     		*
 * 03/30/2020   X0108534 	PCR027779   Shift pass down fields             		*
 * 07/13/2020   X0108534  	PCR030427   internal external notes issue     		*
 * 07/15/2020  	X0106207  	PCR029992   SOW ID                        			*
 * 08/31/2020  	X0108534  	PCR030996   ARK URL						    		*
 * 09/22/2020  	X0108356  	PCR031702	IBase Impementation						*
 * 12/17/2020   X0108534    PCR032448   FSO Productivity Super RIT			    *
 * 12/18/2020  	Vimal Pandu PCR032539	PSE Sprint 10 changes					*
 ********************************************************************************/
  
serviceCaseCreation.Ids = {

  /******App******/
  APP_PAGE: "App",
  FIORI_CONTENT: "fioriContent",

  /******Advance Search******/
  TOOL_NUMBER_INPUT: "idToolNumber",
  SERIAL_NUMBER_INPUT: "idSerialNumber",
  SERVICE_CASE_NUMBER_INPUT: "idAdvServiceCaseNumber",
  LEGACY_NUMBER_INPUT: "idLegacyNumber",
  OPPORTUNITY_NUMER_INPUT: "idOpportunityNumber",
  EMPOLYEE_ID_INPUT: "idEmployeeID",
  START_DATE_DTPCKR: "idStartDate",
  END_DATE_DTPCKR: "idEndDate",

  //Start of PCR018422++ changes

  /******Attachments******/
  ATT_UPLOAD_CONT: "idUploadCollection", 
  ATT_LIST: "attListMobile", 

  /******Pass Down Log******/
  PSDNLOG_LIST: "passDownLogList",
  PSDNNOTE_TEXTAREA: "passDownTextArea",
  PSDNNOTE_FLXBX: "passDownTextBox",

  //End of PCR018422++ changes

  /******Case Confirmation******/
  PARTS_LIST: "partsList",
  CASE_CONFIRMATION_ICON_TAB_BAR: "caseConfirmationIconTab",
  LABOR_ICON_TAB_FILTER: "laborIconTab",
  PARTS_ICON_TAB_FILTER: "partsIconTab",
  CANCEL_BTN: "cancelPartBtn",

  /******DashBoard******/
  MASTER_LIST: "SorderstList",
  RESET_BTN: "CreateBut", //PCR016664++
  RESET_LIST_BTN: "_resetListBtn", //PCR016664++
  SEARCH_FIELD: "searchField",
  CREATE_BTN: "CreateBut",
  SORT_BTN: "_sortBtn",
  FILTER_BTN: "_filterBtn",
  ADV_SEARC_NAV_CONT: "idAdvanceSearchNavCon", //PCR016664++
  ADV_SEARCH_CONT_SEARCHVIEW: "advanceSearchPage", //PCR016664++
  ADV_SEARCH_ASSIGNEDTO: "assignedToPage", //PCR016664++
  ADV_SEARCH_ASSIGNEDTO_RESULTS: "assignedToResults", //PCR016664++
  ADV_SEARCH_RESULTS_TABLE: "assignedSearchResult", //PCR016664++
  EMP_RESULTS_OK_BTN: "employeeResultsOkBtn", //PCR016664++
  FIL_SET_RESET_BTN: "-resetbutton", //PCR016664++
  FIL_SET_RESET_BTN_IMG: "-resetbutton-img", //PCR016664++
  FIL_SET_GRPLIST: "-grouporderlist", //PCR016664++

  /*****Assigned Search Fragment*****/
  ASSIGNED_SEARCH_RESULT_TABLE: "assignedSearchResult",
  ASSIGNED_TO_ID_INPUT: "AssignedToId",

  /******ServiceOrder******/
  DELAY_STATUS_COMBOBOX: "delayStatusComboBox",
  DELAY_STATUS_TEXT: "Delay",
  MAL_FCTN_START_DATEPICKER: "malStartdateDatePicker",
  MAL_FCTN_STARTDATE_TEXT: "malfunctionStartDateText",
  MAL_FCTN_START_TIMEPICKER: "malStartTimePicker",
  MAL_FCTN_STARTTIME_TEXT: "malFunctionStartTimeText",
  TIMEZONE_TEXT: "timeZone",
  COMBOBOX_ORDERSTATUS: "orderStatus",
  PROBLEM_DESC_TEXT: "svOProblemDescriptionText",
  PROBLEM_DESC_LABEL: "svOProblemDescriptionText2",
  PROBLEM_DESC_TEXT_AREA: "problemDescriptionId",
  LINK_TEXT: "linkText",
  DESC_ICON: "descriptionIcon",
  EDIT_BUTTON: "serviceOrderEditBtn",
  UPDATE_BUTTON: "serviceOrderUpdateBtn",
  CANCEL_BUTTON: "serviceOrderCancelBtn",
  NAV_BTN: "idOtherAppsTabGoBtn",
  LABOR_LIST: "laborList",
  LABOR_LIST_EXPENCES: "laborListexpences",
  COMBOBOBX_LABOUR_ID: "idLabor",
  ASSIGNED_TO: "AssignedToId",
  NAV_ITEMS: "idNavigateItemsComboBox",
  ASSIGNED_TO_TEXT: "assignedTo",
  COMBOBOX_IDSYMPTOM: "idSymptom",
  COMBOBOX_IDSYMPTOM_TEXT: "Symptom",
  COMBOBOX_IDFAULT: "idFault",
  COMBOBOX_FAULT_TEXT: "Fault",
  COMBOBOX_IDTIER: "idTier",
  COMBOBOX_IDTIER_TEXT: "Tier",
  COMBOBOX_IDPMTPE_TEXT: "PmType",
  COMBOBOX_IDCATEGORIZATION: "idCategorization",
  COMBOBOX_IDCATEGORIZATION_TEXT: "Categorization",
  INPUT_FIXBILLING: "idFixBilling",
  FIXBILLING_TEXT: "FixBilling",
  SERVICECLASSIFICATION_TEXT: "Serviceclassification",
  COMBOBOX_SERVICECLASSIFICATION: "idServiceclassification",
  CUSTPO_INPUT: "idCustPo",
  CUSTPO_TEXT: "CustPo",
  SERVICECASE_TYPE_TEXT: "idServiceCaseType",
  EQUIPMENT_TEXT: "equipment",
  SOLDPARTY_TEXT: "soldToParty",
  ORDER_STATUS_TEXT: "orderStatusText",
  ORDER_STATUS: "orderStatus",
  TOOLBAR_PAID_SERVICE1: "PaidServiceToolbarid",
  CURRENCY_DISP_ID: "idCurrencydisp",
  INPUT_ACCASSIGNMENT_DISPLAY: "idAccountAssignment",
  ACCASSIGN_FLEX_DISPLAY: "idaccassignflex",
  ACCCAT_FLEX_DISPLAY: "idaccflex",
  CATEGORY_GRID1: "CategoryGrid1",
  COMBOBOX_ACCCAT_FLEX_DISPLAY1: "idAccAssign",
  ACCOUNT_ASSIGN_TEXT: "accAsignText",
  ASSIGNMENT_CAT1: "assigmentCaTId1",
  ACCASSIGN_CAT_TEXT: "accAsignCatText1",
  CONTRACT_GRID1: "ContractGrid1",
  ACC_FLEX_ID: "idaccflex1",
  OPPNO_LBL1: "oppNo1",
  INPUT_OPPNUM1: "idCustPo1",
  LABOR_SAVE: "_saveBtn",
  LABOR_ADD: "_addBtn",
  ICOTAB_BAR: "_iconTabBar",
  PROBDESC_FLEX: "prbDscFlx",
  CATEGORY2_TXT: "Category2txt",
  CATEGORY3_TXT: "Category3txt",//PCR027291++
  CATEGORY4_TXT: "Category4txt",//PCR027291++
  EXPENSE_ADD: "_addBtnexpence",
  EXPENSE_SAVE: "_saveBtnexpence",
  STARTDATE_LBL: "startDatelbl",
  STARTTIME_LBL: "startTimelbl",
  ASSIGNTO_LBL: "assignTolbl",
  NONCONFIRM_LBL: "nonConfirmlbl",
  PROBLEMDESCRIPTION_LBL: "problemDescriptionlbl",
  SYMPTOM_LBL: "symptomlbl",
  FAULT_LBL: "faultlbl",
  TIER_LBL: "tierlbl",
  CATEGORY_LBL: "categorylbl",
  DELAY_PMO_PRJ: "delayZinsAndPrj", //PCR017437++
  DELAY_CMO: "delayCmoAndPmo", //PCR017437++
  ESE_HEADER: "idESEHeader", //PCR018233++
  ADDESE_LIST: "idAddESEList", //PCR018233++
  DISPESE_LIST: "idDisplayESEList", //PCR018233++
  SAVEESE_BTN: "idSaveESEBtn", //PCR018233++
  ADDESE_BTN: "idAddESEBtn", //PCR018233++
  MALFUNCDTFLXBX: "malFuncDateFlexBox", //PCR018422++
  MALFUNCTMLBL: "malFunctionTimeLabel", //PCR018422++
  MALFUNCDTLBL: "malFunctionDateLabel", //PCR018422++
  MALFUNCDATELBL: "malFunctionDateLbl", //PCR018422++
  MALFUNCTIMELBL: "malFunctionTimeLbl", //PCR018422++
  MALFUNCDTPKR: "idMalFuncStartDateDtpkr", //PCR018422++
  MALFUNCTMPKR: "idMalFuncStartTimeTmPkr", //PCR018422++
  DELAYFLXBX: "idDelayFlexBox", //PCR018422++
  C_MALFUNCDT_FLXBX: "idCreateMalFuncDtFlxbx", //PCR018422++
  C_MALFUNCTM_FLXBX: "idCreateMalFuncTmFlxbx", //PCR018422++
  KA_BUTTON: "staticContentLayout", //PCR020942++
  KA_HTML: "htmlControl", //PCR020942++
  ARKLINKCREATE: "arklinkcreate", //PCR030996++

  /*******AssignedToFragment*****/
  FIRST_NAME_INPUT: "firstName",
  LAST_NAME_INPUT: "lastName",
  USERID_INPUT: "userdId",

  /******CreateServiceCase******/
  SERVICE_TYPE: "ServiceType",
  CREATE_CUSTOMER_TOOLID: "createCustomertoolid",
  CREATE_SERIAL_NUMBER: "createSerialno",
  CREATE_FABID: "createFabid",
  TEXT_CHAMBER: "chamber",
  TEXT_FABNAME: "fabname",
  TEXT_SOLDTO: "cidsoldToParty",
  TOOLBAR_CATEGORY: "CategoryToolbar",
  CATEGORY_GRID: "CategoryGrid",
  SYMPTOM_FLEXBOX: "symptomFlex",
  FAULT_FLEXBOX: "faultFlex",
  TIER_FLEXBOX: "tierFlex",
  CATEGORIZATION_FLEXBOX: "categorisationflex",

  TOOLBAR_CONTRACT: "ContractToolbar",
  GRID_CONTRACT: "ContractGrid",
  TOOLBAR_PAID_SERVICE: "PaidServiceToolbar",
  GRID_PAID_SERVICE: "PaidServiceGrid",
  START_DATE_DATEPICKER: "startdatedatepicker",
  START_TIME_TIMEPICKER: "startTime",
  TEXT_ZONE_ID: "zone",
  ASSIGNEDTO_INPUT: "assignedto",
  COMBOBOX_EQUIPMENT: "idEquipmentCombobox",
  COMBOBOX_EQUIPMENT_FLEX: "idMajorAssemblyflex",
  COMBOBOX_DELAY: "idDelayCombobox",
  PROBLEM_DESCRIPTION: "problemDescription",
  COMBOBOX_CIDSYMPTOM: "CidSymptom",
  COMBOBOX_CIDFAULT: "CidFault",
  COMBOBOX_CIDTIER: "CidTier",
  COMBOBOX_CIDCATEGORIZATION: "CidCategorization",
  TEXT_SERVICECONTRACT: "servicecontract",
  TEXT_WARRANTYID: "idWarranty",
  COMBOBOX_FIXBILLING: "FixBilling",
  COMBOBOX_SERVICECLASSIFICATION_CREATE: "Serviceclassification",
  INPUT_CUSTPO: "CustPo",
  SAVE_BUTTON: "CreateserviceSave",
  CREATE_CANCEL_BUTTON: "CreateserviceCancelBtn",
  CATEGORIZATION_FLEX: "categorisationflex",
  PM_TYPE_FLEX: "pmtypeflex",
  COMBOBOX_CIDPMTYPE: "cidPMType",
  CATEGORY_GRID: "CategoryGrid",
  CATEGORY_TOOLBAR: "categoryToolbar",
  SYMPTOM_FLEX: "symptomFlex",
  TIER_FLEX: "tierFlex",
  FAULT_FLEX: "faultFlex",
  PAID_SERVICE_GRID: "PaidServiceGrid",
  PAID_SERVICE_TOOLBAR: "PaidServiceToolbar",
  SERVICE_CONTRACT_TEXT: "idServiceContract",
  WARRANTY_TEXT: "idWarranty",
  UPDATE_SERVICEORDER_BTN: "serviceOrderUpdateBtn",
  CANCEL_SERVICEORDER_BTN: "serviceOrderCancelBtn",
  CURRENCY_FLEX: "idCurrencyFlex",
  CURRENCY_ID: "idCurrency",
  PM_FLEX: "PmGrid",
  CATEGORY_TOOLBAR1: "categoryToolbar1",
  CUST_LBL: "custpoNum",
  OPPNO_LBL: "oppNo",
  COMBOBOX_ACC: "AccAssign",
  COMBOBOX_ACC1: "AccAssign1",
  INPUT_ASSIGNMENT: "AccountAssignment",
  ACC_FLEX: "accflex",
  ACC_ASSIGN_FLEX: "accassignflex",
  SERVICECLASSIFICATION_FLEX: "cidClassFlex",
  FIXBILL_FLEX: "cidFixbillFlex",
  INPUT_CUSTPO_FLEX: "cidcustPoFlex",
  PAID_GRID1: "PaidServiceGrid1",
  CUST_PO1: "CustPo1",
  CUST_PO_FLEX1: "cidcustPoFlex1",
  ACC_FLEX1: "accflex1",
  COMBOBOX_NONCONFIRM: "idNonconfirm",
  INPUT_WAFERSCRAP: "idWaferScrap",
  NONCONFORM_TXT: "NonConfirmtxt",
  WAFERSCRAP_TXT: "waferscraptxt",
  CONFIRM_FLEX: "idNonconfirmflex",
  WAFER_FLEX: "idWaferScrapflex",
  COMBOBOX_CATEGORY2: "Cidcategory2",
  CAT_TWO_LBL: "idCateTwoLabel", //PCR020161++
  CATEGORY2_FLEX: "category2Flex",
  PAGE_ID: "serviceCreatePage",
  SERVICETYPE_LBL: "serviceTypelbl",
  FAB_LBL: "fablbl",
  MAJORASSEMBLY_LBL: "majorAssemblylbl",
  ASSIGNTO_LBL: "assignTolbl",
  DATEPKR_LBL: "datePkrlbl",
  TIMEPKR_LBL: "timePkrlbl",
  NONCONFIRM_LBL: "nonConfirmlbl",
  PROBLEMDESCRIPTION_LBL: "problemDescriptionlbl",
  CURRENCY_LBL: "currencylbl",
  SYMPTOM_LBL: "symptomlbl",
  FAULT_LBL: "faultlbl",
  CATEGORIZATION_LBL: "categorizationlbl",
  PMTYPE_LBL: "pmTypelbl",
  CTIER_LBL: "ctierlbl",
  C_MALFUNCSTRTDT_DTPKR: "idCMalFuncStartDateDtpkr", //PCR018422++
  C_MALFUNCSTRTTM_TMPKR: "idCMalFuncStartTimeTmPkr", //PCR018422++
  ASSEM_LABEL: "idAssemblyLabel", //PCR020942++
  ASSEM_CMBX: "idAssemblyCmbx", //PCR020942++
  TOOLSTAT_LABEL: "idToolStatLabel",  //PCR020942++
  TOOLSTAT_CMBX: "idToolStatCmbx",  //PCR020942++
  TOOLSTAT_FLEX: "idToolStatFlex",  //PCR020942++
  ASSEM_FLEX: "idAssemblyFlexbox",  //PCR020942++
  TOOLSTAT_TEXT: "idToolStatText",  //PCR020942++
  ASSEM_TEXT: "idAssembText", //PCR020942++
  CATEGORY3_FLEX: "category3Flex",//PCR027291++
  CATEGORY4_FLEX: "category4Flex",//PCR027291++
  COMBOBOX_CATEGORY3: "Cidcategory3",//PCR027291++
  COMBOBOX_CATEGORY4: "Cidcategory4",//PCR027291++
  SOW_ID: "crSOWid", //PCR029992++
  /******Begin of PCR027779++******/
  ASSEMBLY_STAT: "idAssemblySatCmbx", 
  CUSTOMER_STAT: "idCustomerStatusCmbx", 
  EXPECTED_DEL: "idExpectedDelDP",
 // INTERNAL_NOTES: "internalnotes",//PCR030427--
 // EXTERNAL_NOTES: "externalnotes",//PCR030427--
  CUST_CONT_PERS: "idcuscontpers",
  CUST_CONT_TXT: "cusconttxt",
  ASSEMBLY_STAT_TXT: "idAssemblyStatText", 
  CUSTOMER_STAT_TXT: "idCusToolStatText", 
  EXPECTED_DEL_TXT: "ExpectedDelLabel",
  //INTERNAL_NOTES_TXT: "internalnotestxt",//PCR030427--
  //EXTERNAL_NOTES_TXT: "externalnotestxt",//PCR030427--
  /******End of PCR027779++******/

  /******Service Case Master******/
  SRV_CASE_MASTER: "serviceCaseMaster", //PCR016664++

  /*Begin of IBase PCR031702++*/
  IBASE_INP_CUSTTOOLID:"inpCustToolId",
  IBASE_BTN_CUSTTOOLID:"custSuggestBtn",	  
  IBASE_BTN_POSITION:"posSuggestBtn",	  
  IBASE_BTN_ADDASSEMBLY:"assmSuggestBtn",	
  IBASE_DIALOG_ADDASSEMBLY:"idNewAssembly",
  IBASE_DIALOG_CHNGPOSITION:"idChangePositionDialog",
  IBASE_SEL_OBJECTTYPE:"idObjectType",
  IBASE_INP_GOTCODEDESC:"idGotCodeDesc",
  IBASE_SEL_POSITION : "idNewPos",
  IBASE_INP_GOTCODE:"idGotCode",
  IBASE_CMB_CLEANERTYPE:"idCleanerType",
  IBASE_CMB_INLINEMETROLOGY:"idInLineMetrology",
  IBASE_CMB_PLATEN1INSITUMETROLOGY:"idPlaten1Insitumetrology",
  IBASE_CMB_PLATEN2INSITUMETROLOGY:"idPlaten2Insitumetrology",
  IBASE_CMB_PLATEN3INSITUMETROLOGY:"idPlaten3Insitumetrology",
  IBASE_CMB_POLISHINGHEAD:"idPolishingHead",
  IBASE_CMB_PLATEN1PAD:"idPlaten1Pad",
  IBASE_CMB_PLATEN2PAD:"idPlaten2Pad",
  IBASE_CMB_PLATEN3PAD:"idPlaten3Pad",
  IBASE_BTN_CANCEL_NEWASSM:"btnCancelNewAssm",
  IBASE_BTN_SUBMIT_NEWASSM:"btnSubmitNewAssm",
  IBASE_POS_MSG_STRIP:"idMsgStrip",
  IBASE_GOTCODE_MSG_STRIP:"idMsgStrip2",
  IBASE_DLGBTN_POSCHG:"btnDlgPosChg",
  IBASE_DLGBTN_POSCHG_CANCEL:"btnDlgPosChgCancel",
  IBASE_DLG_SEARCHFIELD : "idGotCodeSearchField",
  
	  
  
  /*End of IBase PCR031702++*/
 /*Begin of PCR032448++*/
  ESEPANEL:"idDisplayESEListPanel",
  SRVTEAMPANEL:"idDisplaySTListPanel",
  LEADCEPANEL:"idDisplayCEListPanel",
  TOOLMANGERPANEL:"idDisplayTMListPanel",
  LeadCEHeader:"idLeadCEHeader",  
  STHeader:"idSTHeader",
  TMHeader:"idTMHeader",
  /*End of PCR032448++*/
  
  PSE_COMP_CONT: "idPseCompCont", //PCR032539++
  PSE_COMP : "idPSEComp", //PCR032539++
};

serviceCaseCreation.Images = {
  IMG_PNG_SAVE: "save.png"
};

serviceCaseCreation.StandardSAPIcons = {
  ICON_SAP_REFRESH: "sap-icon://refresh",
  ICON_SAP_SAVE: "sap-icon://save",
  ICON_SAP_MSG_SUCCESS: "sap-icon://message-success",
  ICON_SAP_SLIM_ARROW_DOWN: "sap-icon://slim-arrow-down",
  ICON_SAP_SLIM_ARROW_UP: "sap-icon://slim-arrow-up",
  ICON_SAP_MSG_ERROR: "sap-icon://message-error"
};

serviceCaseCreation.Elements = {
  BUTTON_CREATE_SALES_ORDER: "CreateSalesOrderButton",
  BUTTON_ADD_PART: "AddPartButton"
};

/*Begin of PCR030996++*/
serviceCaseCreation.Constants = {
		  ARKEQUIP: "?k=ARKSOEquipmentNum=",
		  ARKSN: " OR sn=",
		  ARKT1: "&t1=",
		  ARKMAJASS: "&ARKSOMAssembly=",
		  ARKMAJASSID: "&ARKSOMAssemblyID="
};
/*End of PCR030996++*/

