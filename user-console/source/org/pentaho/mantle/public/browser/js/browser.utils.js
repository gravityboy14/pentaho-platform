/*
 * ******************************************************************************
 * Pentaho
 *
 * Copyright (C) 2002-2013 by Pentaho : http://www.pentaho.com
 * ******************************************************************************
 */

pen.define([
], function() {

  var local = {

    executableTypesUrl : 'api/repos/executableTypes',
    executableTypes: [],

    scheduleBlackList: ['xdash'],

    editBlackList: ['prpt','xaction','xanalyzer', 'xcdf'],

    _init: function() {

      var that = this; // trap this

      var serviceUrl = that.getUrlBase() + that.executableTypesUrl;
      that.getContent(serviceUrl, function(result) {
        that.executableTypes = result.executableFileTypeDto;
        console.log('Executable Types Loaded...');
      }, function(error) {
        console.log(error);
      });
    },

    getUrlBase : function(){
      return window.location.pathname.substring(0, window.location.pathname.indexOf("/mantle/")) + "/";
    },

    getContent: function(serviceUrl, successCallback, errorCallback, beforeSendCallback) {
      this._makeAjaxCall("GET", "json", serviceUrl, successCallback, errorCallback, beforeSendCallback);
    },

    putContent: function(serviceUrl, successCallback, errorCallback, beforeSendCallback) {
      this._makeAjaxCall("POST", "json", serviceUrl, successCallback, errorCallback, beforeSendCallback);
    },

    _makeAjaxCall: function(type, dataType, serviceUrl, successCallback, errorCallback, beforeSendCallback) {
      var now = new Date();
      var url = serviceUrl + (serviceUrl.indexOf("?") > -1 ? "&" : "?") + "ts=" + now.getTime();
      
      $.ajax({
        type: type,        
        dataType: dataType,
        url: url,
        success: function(result) {
          if(successCallback){
            successCallback(result);
          }
        },
        error: function(err) {
          console.log(err);
          if(errorCallback){
            errorCallback(err);
          }
        },
        beforeSend: function() {
          if(beforeSendCallback){
            beforeSendCallback();
          }
        }
      });
    },

    isFileExecutable: function(fileExtension){
      var isExecutable = false;
      $.each(this.executableTypes, function(idx, type) {
        if(fileExtension == type.extension) {
          isExecutable = true;
          return false; // break the $.each loop
        }
      });
      return isExecutable;
    },

    isScheduleAllowed: function(fileExtension){
      var isExecutable = this.isFileExecutable(fileExtension);
      var isInScheduleBlackList = false;
      $.each(this.scheduleBlackList, function(idx, ext) {
        if(fileExtension == ext) {
          isInScheduleBlackList = true;
          return false; // break the $.each loop
        }
      });
      return isExecutable && !isInScheduleBlackList;
    },

    isEditAllowed: function(fileExtension){
      var isExecutable = this.isFileExecutable(fileExtension);
      var isInEditBlackList = false;
      $.each(this.editBlackList, function(idx, ext) {
        if(fileExtension == ext) {
          isInEditBlackList = true;
          return false; // break the $.each loop
        }
      });
      return isExecutable && !isInEditBlackList;
    }
  };

  var BrowserUtils = function(){
    this._init();
  }
  BrowserUtils.prototype = local;

  return BrowserUtils;

});