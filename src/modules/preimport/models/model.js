'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PreimportSchema = new Schema({
    courses: [{
        year: String,
        seq: String,
        grade: String,
        name: String,
        structures: [{
            seq: {
                type: String
            },
            code: {
                type: String
            },
            subject: {
                type: String
            },
            course_type: {
                type: String
            },
            hours: {
                type: String
            },
            weight: {
                type: String
            }
        }],
        students: [{
            seq: {
                type: String
            },
            student_id: {
                type: String
            },
            student_no: {
                type: String
            },
            title: {
                type: String
            },
            firstname: {
                type: String
            },
            lastname: {
                type: String
            },
            citizenid: {
                type: String
            },
            birthday: {
                type: String
            },
            birthmonth: {
                type: String
            },
            birthyear: {
                type: String
            },
            sex: {
                type: String
            },
            nationality: {
                type: String
            },
            religion: {
                type: String
            },
            fathername: {
                type: String
            },
            mothername: {
                type: String
            },
            attendencedate: {
                type: String
            },
            oldschool: {
                type: String
            },
            oldprovince: {
                type: String
            },
            lastclass: {
                type: String
            }
        }],
        school: String
    }],
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Preimport", PreimportSchema);