'use strict';

const request = require('request')
var Constants = require('../utils/constants')
var fs = require('fs');

module.exports = function(Member) {
    var constants = Constants

    /****************************    Disable all defaults Remote Method    ****************************/

    constants.disableRemomteMethods.map(r => Member.disableRemoteMethodByName(r))

    /********************************************* Disabling Done ***************************************************/

    Member.addMember = function(data, cb){
        /** 
         * username, email, mobileno, password, flag
         **/
        if (! ("id" in data)) {
            data["password"] = "member2020"
            data["flag"] = "Y"
        }
        
        Member.upsert(data, function (err, obj){
            if (err || ! ("id" in obj)) {
                cb(null, {error: "Error in adding user"})
            } else {
                cb(null, obj)
            }
            
        })
        
    }

    Member.remoteMethod('addMember', {
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

    Member.addAmount = function(data, cb){
        /** 
         * userid, amount
         **/
        Member.upsertWithWhere(data.condition, data.field, function (err, obj){
            if(err) return console.error(err)
            cb(null, obj)
        })
        
    }

    Member.remoteMethod('addAmount', {
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
