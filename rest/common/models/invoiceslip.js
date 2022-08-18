'use strict';


const request = require('request')
var Constants = require('../utils/constants')
var fs = require('fs');

module.exports = function(Invoiceslip) {
    var constants = Constants
    var ds = Invoiceslip.dataSource;

    /****************************    Disable all defaults Remote Method    ****************************/

    constants.disableRemomteMethods.map(r => Invoiceslip.disableRemoteMethodByName(r))

    /********************************************* Disabling Done ***************************************************/

    Invoiceslip.viewPDF =  function (data, cb) {
        if (data) {
            Invoiceslip.find(data, function(err, res){
                if (res && res.length > 0) {
                    var bitmap = fs.readFileSync(constants.slipupload + res[0].invoicefile["name"], "")
                    var file = new Buffer(bitmap).toString('base64')
                    res[0].invoicefile["content"] = file
                    cb(null, res)
                } else {
                    cb(null, {error: "Please wait while admin upload the slip"})
                }
                
            })
        } else {
            cb(null, {error: "Please wait while admin upload the slip"})
        }
    }

    Invoiceslip.remoteMethod('viewPDF', {
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


    Invoiceslip.addSlip = function(data, cb){
        /** 
         * userid, invoicefile
         **/

        let base64content = data.invoicefile.content.replace(/.*\;base64\,/, "")
        fs.writeFile(constants.slipupload + data.invoicefile.name, base64content, "base64",function(err) {
            // If an error occurred, show it and return
            if(err) return console.error(err)
            // Successfully wrote to the file!
        })

        delete data.invoicefile.content
        Invoiceslip.create(data, function (err, obj){
            cb(null, obj)
        })
        
    }

    Invoiceslip.remoteMethod('addSlip', {
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
