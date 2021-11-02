/** ----------------------------------------------------------------------------------  *
 * Modifications.                                                                       *
 * -------------                                                                        *
 * Ver.No    Date        Author  	    PCR No.          Description of change          *
 * ------ ---------- ---------------- ----------  --------------------------------------*
 * V00    13/10/2016   Siva Prasad														*
 * 					  Prachuri/Alok    PCR012146		 initial version				*
 *                     (X087050)                                                        *
 ****************************************************************************************
 * -------------------------------------------------------------------------*
 *  Date        Author    		PCR No.     Description of change         	*
 * -------     ---------- 		---------   --------------------------------*
 * 07/31/2018   X087924   		PCR018422	Pass Down Log changes 			*
 * 12/18/2020   Vimal Pandu 	PCR032539  	PSE Phase 10 changes 			*
 * -------------------------------------------------------------------------*/
jQuery.sap.declare("serviceCaseCreation.formatter.formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
 
serviceCaseCreation.formatter.formatter = {

	/**
	 * This method is to set format for service case type on master list 
	 * @name serviceCaseType
	 * @param scType - Holds the value of Status field
	 * @returns service case type acronym based on scType value
	 */
	serviceCaseType: function(scType, PSE) {
		var sAcrnymScType;

		switch (scType) {
			case "ZCMO":
				sAcrnymScType = "CM";
				break;
			case "ZPMO":
				sAcrnymScType = "PM";
				break;
			case "ZPRJ":
				sAcrnymScType = "PRJ";
				break;
			case "ZINS":
				sAcrnymScType = "INS";
				break;
			default:
				sAcrnymScType = "";
				break;
		}

		//Start of PCR032539++ changes
		
		if (PSE) {
			sAcrnymScType = "PSE";
		} 
		
		//End of PCR032539++ changes

		return sAcrnymScType;
	},

	/**
	 * This method is to set format for status 
	 * @name status
	 * @param sStatus - Holds the value of Status field
	 * @returns objectState based on status values
	 */
	status: function(sStatus) {
		var sReturnStatus;

		switch (sStatus) {
			case "Open":
				sReturnStatus = "Error";
				break;
			case "Work Completed":
				sReturnStatus = "Success";
				break;
			case "Released":
				sReturnStatus = "Error";
				break;
			default:
				sReturnStatus = "None";
				break;
		}

		return sReturnStatus;
	},

	/**
	 * This method is to set format for Date to display
	 * @name dateFormat
	 * @param value - Holds current event parameter
	 * @returns formatted dateObject 
	 */
	dateFormat: function(value) {
		if (value && value.length == 14) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd-MMM-yyyy"
			});
			return oDateFormat.format(new Date(value.substr(4, 2) + "/" + value.substr(6, 2) + "/" + value.substr(0, 4)));
		} 
		/*Start of PCR018422++ changes*/
		else if (value && value.length == 8) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd-MMM-yyyy"
			});
			return oDateFormat.format(new Date(value.substr(4, 2) + "/" + value.substr(6, 2) + "/" + value.substr(0, 4)));
		} 
		/*End of PCR018422++ changes*/
		else
			return null;
	},

	/**
	 * This method is to set format for Time to display
	 * @name timeFormat
	 * @param value - Holds current event parameter
	 * @returns formatted dateObject 
	 */
	timeFormat: function(value) {
		if (value && value.length == 14) {
			return value.substr(8, 2) + ":" + value.substr(10, 2);
		} else
			return null;
	},

	/**
	 * This method is to set format for posting DateValue  
	 * @name dateFormatInPost
	 * @param oDate - Holds the date value
	 * @returns formatted dateObject 
	 */
	dateFormatInPost: function(oDate) {
		if (oDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyyMMdd"
			});
			return oDateFormat.format(oDate);
		}
	},

	dateFormatIntoPost: function(oDate) {
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern: "yyyy-MM-dd"
		});
		return oDateFormat.format(oDate);
	},

	/**
	 * This method is to set format for posting DateValue  
	 * @name dateFormatForPost
	 * @param oDate - Holds the date value
	 * @returns formatted dateObject 
	 */
	dateFormatForPost: function(oDate) {
		if (oDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyyMMdd"
			});
			return oDateFormat.format(oDate);
		}
	},

	/**
	 * This method is to set format for posting TimeValue  
	 * @name timeFormatInPost
	 * @param oTime - Holds the time value
	 * @returns formatted dateObject 
	 */
	timeFormatInPost: function(oTime) {
		var oTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
			//pattern: "PThh'H'mm'M'ss'S'" //PCR018422--
			pattern: "PTHH'H'mm'M'ss'S'" //PCR018422++
		});
		return oTimeFormat.format(new Date(oTime));
	},

	/*Start of PCR018422++ changes
	Pass Down Log Read date and time formats*/
	
	/**
    * This method is used for formatting the time values
    * @name malFuncTimeFormat
    * @param {String} sMalDt - date value
    * @param {String} sMalTm - time value
    * @returns {String} oJSONTime - time object
    */
	malFuncTimeFormat : function (sMalDt, sMalTm) {
		var sMalTime = "";
		
		if (sMalDt) {
			sMalTime = (sMalTm) ? sMalTm.substr(0,2) + ":" + sMalTm.substr(2,2) : sMalTm;
		}
		
		return sMalTime;
	},
	
	/**
    * This method is used for formatting the Time values
    * @name malFuncTimeFormatInPost
    * @param {Object} oMalTm - date value
    * @returns {String} oJSONTime - date object
    */
	malFuncTimeFormatInPost : function (oMalTm) {
		var sMalTime = "";
		var oTimeFormat;
		
		if (oMalTm) {
			oTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "HHmmss"
			});
			
			sMalTime = oTimeFormat.format(oMalTm)
		}
		
		return sMalTime;
	},

	/**
	 * This method is used for formatting the date value in the pass down log
	 * @name passDownLogDateFormat
	 * @param {String} sTimeStamp - time stamp value
	 * @returns {String} sDate - time object
	 */
	passDownLogDateFormat: function(sTimeStamp) {
		if (sTimeStamp) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MMM-yyyy"
			});
			var sDate = oDateFormat.format(new Date(sTimeStamp.slice(0, 4) + "-" + sTimeStamp.slice(4, 6) + "-" + sTimeStamp.slice(6, 8))),
				sTime = sTimeStamp.slice(8, 10) + ":" + sTimeStamp.slice(10, 12) + ":" + sTimeStamp.slice(12, 14);
			return sDate + " " + sTime;
		}
	},

	/**
	 * This method will create the download URL for an attachment.
	 * @param {String} sSvcNo - Service Case Number
	 * @param {String} sLoioClass - Attachment class
	 * @param {String} sLoioObjid - Attachment Object Id
	 * @returns {String} download URL
	 */
	createAttDownloadUrl: function(sSvcNo, sLoioClass, sLoioObjid) {
		return serviceCaseCreation.util.ServiceConfigConstants.getServiceCasesInfoURL + "/" + serviceCaseCreation.util.ServiceConfigConstants.attachmentSet +
			"(IServiceCaseNo='" + sSvcNo + "',LoioClass='" + sLoioClass + "',LoioObjid='" + sLoioObjid + "')/$value";
	},

	/**
	 * This method will create the delete URL for an attachment.
	 * @param {String} sSvcNo - Service Case Number
	 * @param {String} sLoioClass - Attachment class
	 * @param {String} sLoioObjid - Attachment Object Id
	 * @returns {String} delete URL
	 */
	createAttDeleteUrl: function(sSvcNo, sLoioClass, sLoioObjid) {
		return "/" + serviceCaseCreation.util.ServiceConfigConstants.attachmentSet + "(IServiceCaseNo='" + sSvcNo + "',LoioClass='" +
			sLoioClass + "',LoioObjid='" +
			sLoioObjid + "')";
	},

	/**
	 * This method is to set the icon for appropriate 
	 * attachment in the mobile view.
	 * @param {String} sType - Attachment extension ref
	 * @returns {String} sIconSrc - attachment source 
	 */
	attIconSrc: function(sType) {
		var sIconSrc;

		switch (sType) {
			case "PNG":
			case "JPG":
				sIconSrc = "sap-icon://camera";
				break;
			case "TXT":
				sIconSrc = "sap-icon://document-text";
				break;
			case "PPTX":
				sIconSrc = "sap-icon://ppt-attachment";
				break;
			case "DOC":
				sIconSrc = "sap-icon://doc-attachment";
				break;
			case "XLS":
			case "XLSX":
				sIconSrc = "sap-icon://excel-attachment";
				break;
			case "PDF":
				sIconSrc = "sap-icon://pdf-attachment";
				break;
			default:
				sIconSrc = "sap-icon://attachment";
				break;
		}

		return sIconSrc;
	}

	/*End of PCR018422++ changes*/

};