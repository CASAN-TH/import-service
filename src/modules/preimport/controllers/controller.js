'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Preimport = mongoose.model('Preimport'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    Preimport.find({}, {}, query, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

exports.getCourseInfo = function (req, res, next) {
    req.courses = [];
    req.body.forEach(course => {

        var key = Object.keys(course.data[1])[0];
        var info = course.data[1][key];

        var term = info.match(/ภาคเรียนที่  [0-9]/g)
            || info.match(/ภาคเรียนที่ [0-9]/g)
            || info.match(/ภาคเรียนที่[0-9]/g);

        term = term[0].replace("  ", " ")

        var class_room = info.match(/ประถมศึกษาปีที่  [0-9]/g)
            || info.match(/ประถมศึกษาปีที่ [0-9]/g)
            || info.match(/ประถมศึกษาปีที่[0-9]/g)
            || info.match(/มัธยมศึกษาปีที่  [0-9]/g)
            || info.match(/มัธยมศึกษาปีที่ [0-9]/g)
            || info.match(/มัธยมศึกษาปีที่[0-9]/g);

        class_room = class_room[0].replace("  ", " ")

        var educate_year = info.match(/ปีการศึกษา  [0-9][0-9][0-9][0-9]/g)
            || info.match(/ปีการศึกษา [0-9][0-9][0-9][0-9]/g)
        info.match(/ปีการศึกษา[0-9][0-9][0-9][0-9]/g);

        educate_year = educate_year[0].replace("  ", " ")

        var educate_year_num = educate_year.match(/[0-9][0-9][0-9][0-9]/g);
        educate_year_num = educate_year_num[0];

        var arrClass = [
            "ประถมศึกษาปีที่ 1",
            "ประถมศึกษาปีที่ 2",
            "ประถมศึกษาปีที่ 3",
            "ประถมศึกษาปีที่ 4",
            "ประถมศึกษาปีที่ 5",
            "ประถมศึกษาปีที่ 6",
            "มัธยมศึกษาปีที่ 1",
            "มัธยมศึกษาปีที่ 2",
            "มัธยมศึกษาปีที่ 3",
            "มัธยมศึกษาปีที่ 4",
            "มัธยมศึกษาปีที่ 5",
            "มัธยมศึกษาปีที่ 6",
        ]

        var arrClassSeq1 = [
            "ประถมศึกษาปีที่ 1",
            "ประถมศึกษาปีที่ 3",
            "ประถมศึกษาปีที่ 5",
            "ประถมศึกษาปีที่ 2",
            "ประถมศึกษาปีที่ 4",
            "ประถมศึกษาปีที่ 6"
        ]

        var arrClassSeq2 = [
            "มัธยมศึกษาปีที่ 1 ภาคเรียนที่ 1",
            "มัธยมศึกษาปีที่ 2 ภาคเรียนที่ 1",
            "มัธยมศึกษาปีที่ 3 ภาคเรียนที่ 1",
            "มัธยมศึกษาปีที่ 1 ภาคเรียนที่ 2",
            "มัธยมศึกษาปีที่ 2 ภาคเรียนที่ 2",
            "มัธยมศึกษาปีที่ 3 ภาคเรียนที่ 2",
            "มัธยมศึกษาปีที่ 4 ภาคเรียนที่ 1",
            "มัธยมศึกษาปีที่ 5 ภาคเรียนที่ 1",
            "มัธยมศึกษาปีที่ 6 ภาคเรียนที่ 1",
            "มัธยมศึกษาปีที่ 4 ภาคเรียนที่ 2",
            "มัธยมศึกษาปีที่ 5 ภาคเรียนที่ 2",
            "มัธยมศึกษาปีที่ 6 ภาคเรียนที่ 2"
        ]
        

        console.log(info);

        req.courses.push({
            year: educate_year_num,
            seq: arrClass.indexOf(class_room) + 1 > 6 ? 
            arrClass.indexOf(class_room) + 1 > 9 ? arrClassSeq2.indexOf(class_room + " " + term) + 5: arrClassSeq2.indexOf(class_room + " " + term) + 1
              : arrClassSeq1.indexOf(class_room) + 1,
            grade: arrClass.indexOf(class_room) + 1,
            name: educate_year + " ระดับชั้น" + class_room + " " + term,
            structures: [],
            students: [],
            school: req.user.ref1
        });
    });
    console.log(req.courses);
}

exports.create = function (req, res) {
    var newPreimport = new Preimport(req.body);
    newPreimport.createby = req.user;
    newPreimport.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Preimport.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updPreimport = _.extend(req.data, req.body);
    updPreimport.updated = new Date();
    updPreimport.updateby = req.user;
    updPreimport.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};
