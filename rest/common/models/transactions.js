'use strict';

var Constants = require('../utils/constants')

module.exports = function(Transactions) {
    var constants = Constants
    

    /****************************    Disable all defaults Remote Method    ****************************/

    //constants.disableRemomteMethods.map(r => Transactions.disableRemoteMethodByName(r))

    /********************************************* Disabling Done ***************************************************/

    Transactions.addChargedAmount = function(data, cb){
        /** 
         * userid, applicationid,amountcharged
         **/
        Transactions.replaceOrCreate(data, function (err, obj){
            if (err) return console.log(err)
            cb(null, obj)
        })
        
    }

    Transactions.remoteMethod('addChargedAmount', {
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

    Transactions.updateChargedAmount = function(data, cb){
        /** 
         * userid, applicationid,amountcharged
         **/
        Transactions.upsertWithWhere(data.condition, data.field, function (err, obj){
            if (err) return console.log(err)
            cb(null, obj)
        })
        
    }

    Transactions.remoteMethod('updateChargedAmount', {
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

    Transactions.totalChargedAmount = function(data, cb){
        /** 
         * userid, applicationid,amountcharged
         **/
        var db = Transactions.dataSource
        var sql = "select sum(amountcharged) as totalcharged from transactions where userid = ?"

        db.connector.query(sql, data.userid,function (err, obj){
            if (err) return console.log(err)
            cb(null, obj)
        })
        
    }

    Transactions.remoteMethod('totalChargedAmount', {
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
