'use strict';

var Constants = require('../utils/constants')
var fs = require('fs');

module.exports = function(Application) {

    var constants = Constants

    let fields = ["aocode","applicanttitle","firstname","middlename","lastname","fathername","dateofbirth","cardname","aadharno","mobileno","emailid","address","village","postoffice","tehsil","district","state","pincode","form"]
    
    /****************************    Disable all defaults Remote Method    ****************************/

    constants.disableRemomteMethods.map(r => Application.disableRemoteMethodByName(r))

    /********************************************* Disabling Done ***************************************************/

    Application.addApplication = function(data, cb){
        /** 
         * addresstype, customername, relationship, relationshipname, 
         * fathername, village, aadharno, postoffice, mobileno, tehsil, 
         * dateofbirth, district, gender, state, emailid, pincode, form
         **/
        if (data.form && data.form.content) {
            let base64content = data.form.content.replace(/.*\;base64\,/, "")
            fs.writeFile(constants.formupload + data.form.name, base64content, "base64",function(err) {
                // If an error occurred, show it and return
                if(err) return console.error(err)
                // Successfully wrote to the file!
            })
            delete data.form.content
        }
        
        Application.upsert(data, function (err, obj){
            if(err) return console.error(err)
            if (obj.id) {
                cb(null, obj)
            } else {
                cb(null, {error: "Unable to Insert data in sql server."})
            }
        })
        
    }

    Application.remoteMethod('addApplication', {
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

    Application.viewForm =  function (data, cb) {
        
        Application.find({where: {id: data.id}}, function(err, res){
            if (res && res[0]) {
                console.log("Print the value of file = " + res[0].form["name"])
                if (res[0].form["name"]) {
                    var bitmap = fs.readFileSync(constants.formupload + res[0].form["name"], "")
                    var file = new Buffer(bitmap).toString('base64')
                    res[0].form["content"] = file
                    cb(null, res)
                } else {
                    cb(null, {error: "There is no file exists."})
                }
            }
        })

    }

    Application.remoteMethod('viewForm', {
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

    Application.updateStatus =  function (data, cb) {
        
        Application.upsertWithWhere(data.where, data.field, function(err, res){
            if (err) console.log(err)
            cb(null, res)             
        })

    }

    Application.remoteMethod('updateStatus', {
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
