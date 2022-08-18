'use strict';

var Constants = require('../utils/constants')

module.exports = function(Memberamount) {

    var constants = Constants

    /****************************    Disable all defaults Remote Method    ****************************/

    constants.disableRemomteMethods.map(r => Memberamount.disableRemoteMethodByName(r))

    /********************************************* Disabling Done ***************************************************/

    Memberamount.addMemberAmount = function(data, cb){
        /** 
         * memberid, amount, amountstatus
         **/
        
        if ("id" in data) {
            data["modified"] = new Date().toISOString().slice(0, 10) + " " + new Date().toLocaleTimeString()
        } else {
            data["created"] = new Date().toISOString().slice(0, 10) + " " + new Date().toLocaleTimeString()
        }

        Memberamount.upsert(data, function (err, obj){
            cb(null, obj)
        })
        
    }

    Memberamount.remoteMethod('addMemberAmount', {
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
