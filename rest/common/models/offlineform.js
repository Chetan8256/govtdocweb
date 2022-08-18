'use strict';

const request = require('request')
var Constants = require('../utils/constants')
var fs = require('fs');

module.exports = function(Offlineform) {
    var constants = Constants
    var ds = Offlineform.dataSource;

    /****************************    Disable all defaults Remote Method    ****************************/

    constants.disableRemomteMethods.map(r => Offlineform.disableRemoteMethodByName(r))

    /********************************************* Disabling Done ***************************************************/

    Offlineform.uploadOfflineForm = function(data, cb){
        /** 
         * name, size, type
         **/
        console.log(data.form.name)
        let base64content = data.form.content.replace("data:application/pdf;base64,", "")
        fs.writeFile(constants.formupload + data.form.name, base64content, "base64",function(err) {
            // If an error occurred, show it and return
            if(err) return console.error(err);
            //cb(null, "File has been successfully uploaded")
            // Successfully wrote to the file!
        });
        
        delete data.form.content
        
        Offlineform.create(data, function (err, obj){
            cb(null, obj)
        })
        
    }

    Offlineform.remoteMethod('uploadOfflineForm', {
        accepts: [
            {
                arg: 'data', 
                type: "object", 
                http: {source: 'body'}
            }
        ],
        returns: [
            {arg: 'message', type: 'string'}
        ]
    })

};
