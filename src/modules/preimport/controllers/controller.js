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
    var courses = [];
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




        courses.push({
            year: educate_year_num,
            seq: arrClass.indexOf(class_room) + 1 > 6 ?
                arrClass.indexOf(class_room) + 1 > 9 ? arrClassSeq2.indexOf(class_room + " " + term) + 5 : arrClassSeq2.indexOf(class_room + " " + term) + 1
                : arrClassSeq1.indexOf(class_room) + 1,
            grade: arrClass.indexOf(class_room) + 1,
            name: educate_year + " ระดับชั้น" + class_room + " " + term,
            structures: [],
            students: [],
            school: req.user.ref1
        });
    });

    req.data = {
        courses: courses
    };
    next();
}

exports.getCourseStructure = function (req, res, next) {
    var idx = 0;
    req.body.forEach(course => {
        var structures = []
        var key = Object.keys(course.data[2]);
        for (var i = 0; i < key.length; i++) {
            if (key[i].startsWith("__EMPTY_")) {
                var jsonInfo = {
                    key: key[i],
                    value: course.data[2][key[i]],
                    start: parseInt(key[i].replace("__EMPTY_", "")),
                    end: parseInt(key[i].replace("__EMPTY_", ""))
                }
                structures.push(jsonInfo)

                if (structures[structures.length - 2]) {
                    structures[structures.length - 2].end = jsonInfo.start - 1
                }
            }
        }

        var cnt = 1;
        var seq = 0;
        structures.forEach(stuct => {

            for (var i = stuct.start; i <= stuct.end; i++) {

                if (cnt === 1) {
                    if (course.data[4]["__EMPTY_" + i]) {
                        var subjectDesc = course.data[4]["__EMPTY_" + i].replace(/\s/g, "");
                        if (subjectDesc.match(/[ก-ฮ][0-9][0-9][0-9][0-9][0-9]/g)) {
                            seq++;
                            var subject = {
                                seq: seq,
                                code: subjectDesc.match(/[ก-ฮ][0-9][0-9][0-9][0-9][0-9]/g)[0],
                                subject: subjectDesc.split("(")[0],
                                course_type: "พื้นฐาน",
                                hours: "0",
                                weight: course.data[5]["__EMPTY_" + i]
                            }
                            // console.log(subject);
                            req.data.courses[idx].structures.push(subject);
                        }
                    }
                } else if (cnt === 2) {
                    if (course.data[4]["__EMPTY_" + i]) {
                        var subjectDesc = course.data[4]["__EMPTY_" + i].replace(/\s/g, "");
                        if (subjectDesc.match(/[ก-ฮ][0-9][0-9][0-9][0-9][0-9]/g)) {
                            seq++;
                            var subject = {
                                seq: seq,
                                code: subjectDesc.match(/[ก-ฮ][0-9][0-9][0-9][0-9][0-9]/g)[0],
                                subject: subjectDesc.split("(")[0],
                                course_type: "เพิ่มเติม",
                                hours: "0",
                                weight: course.data[5]["__EMPTY_" + i]
                            }
                            // console.log(subject);
                            req.data.courses[idx].structures.push(subject);
                        }

                    }
                } else if (cnt === 3) {
                    seq++;
                    var subject = {
                        seq: seq,
                        code: "",
                        subject: course.data[3]["__EMPTY_" + i],
                        course_type: "กิจกรรม",
                        hours: "0",
                        weight: "-"
                    }
                    // console.log(subject);
                    req.data.courses[idx].structures.push(subject);
                }

            }
            cnt++;
        })
        idx++;
    });
    next();
}

exports.getCourceStudent = function (req, res, next) {
    var idx = 0;
    req.body.forEach(course => {
        course.data.forEach(row => {
            if (row["__rowNum__"] > 6) {

                if (row["__EMPTY_1"]) {
                    var studentTitleName = row["__EMPTY_1"].match(/เด็กชาย/g)
                        || row["__EMPTY_1"].match(/เด็กหญิง/g)
                        || row["__EMPTY_1"].match(/นาย/g)
                        || row["__EMPTY_1"].match(/นางสาว/g);
                    if (studentTitleName) {
                        studentTitleName = studentTitleName[0]
                        var studentFulname = row["__EMPTY_1"].replace(studentTitleName, "");
                        var arrFL = studentFulname.split(" ");
                        if (arrFL.length === 2) {
                            // studentFirstName = arrFL[0];
                            // studentLastName = sarrFL[1];
                            var student = {
                                seq: req.data.courses[idx].students.length+1,
                                student_id: row["__EMPTY"],
                                title: studentTitleName,
                                firstname: arrFL[0],
                                lastname: arrFL[1],
                                student_no: row["__EMPTY"]
                            };
                            req.data.courses[idx].students.push(student);
                        } else {
                            //error fullname format
                        }

                    } else {
                        //error format excel
                    }
                }

            }
        })
        idx++;
    });
    next();
}

exports.create = function (req, res) {
    var newPreimport = new Preimport(req.data);
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
