/** ---------------------------------------------------------------------------------- *
 * Modifications.                                                                       *
 * -------------                                                                        *
 * Ver.No    Date        Author  	  PCR No.           Description of change          *
 * ------ ---------- ------------ ----------  ----------------------------------------- *
 * V00    13/10/2016   Siva Prasad 
 * 					 Prachuri/Alok 		PCR012146				initial version
 *                     (X087050)                                                        *
 * 
 ****************************************************************************************
 ***************************************************************************
 *  Date        Author    PCR No.          Description of change           *
 ************ ********  **********   ***************************************
 * 11/06/2018  X087924   PCR018233   Exe. Service Employee Addition changes*
 * 07/31/2018  X087924   PCR018422	 Pass Down Log and Attachment changes  *
 * 11/19/2019  Vimal 	PCR020942	 KA Project changes 				* 
 * 			   Pandu 													*
 * 08/31/2020  X0108534  PCR030996   ARK URL						    *
 * 09/22/2020  X0108356	 PCR031702	 IBase Implementation				*
 ***************************************************************************/

jQuery.sap.declare("serviceCaseCreation.util.ServiceConfigConstants");

serviceCaseCreation.util.ServiceConfigConstants = {

//	getServiceCasesInfoURL: "https://gwvddb.amat.com:8001/sap/opu/odata/sap/ZQZG_CRM_SERVICES_SRV",
	getServiceCasesInfoURL : "/sap/opu/odata/sap/ZQZG_CRM_SERVICES_SRV",
	
	getIBaseInfoURL : "/sap/opu/odata/sap/ZQIG_ECC_IMT_SRV", //IBase PCR031702++
	
	serviceCaseEntitySet: "CaseCreationSrvCaseHeaderSet",
	SserviceCaseEntitySet: "CaseCreationSrvCaseHeaderSet?$expand=Nav_CaseHdr_To_LaborItem",
	masterListSet: "CaseCreationMasterListSet",
	customerToooIdMaster: "CaseCreationCustomerToolIdMasterSet",
	CaseCreationCEUserHelpSet: "CaseCreationCEUserHelpSet",
	tierListEntitySet: "TierListSet",
	sESEUpdate: "ServiceCaseHeadSet", //PCR018233++
	passDownLog: "ServCaseNotesSet", //PCR018422++
	attachmentSet: "Attachment_listSet", //PCR018422++
	postAttachments: "AttachmentSet", //PCR018422++
	assemblyListSet: "AssemblyListSet", //PCR020942++
	ArkUrlSet: "ArkUrlSet",//PCR030996++
	updateCustToolId:"UpdCustomerToolIDSet", //PCR031702++
	assemblyPositionList:"FI_Assembly_Position",//PCR031702++
	chamberPositionSet:"GetExistAsmblSet",//PCR031702++
	updateChamberPositionSet:"UpdAsmblPosSet",//PCR031702++
	gotCodeListSet:"Get_Got_CodeSet",//PCR031702++
	addNewAssembly:"Add_Missing_AsmblSet",//PCR031702++	
	assemblyDropdownSet:"Obj_TypeSet",//PCR031702++	
	ibaseValidSet:"IMT_det_Case_ValidSet",//PCR031702++
	get: "GET",
	post: "POST",
	del: "DELETE"

}
