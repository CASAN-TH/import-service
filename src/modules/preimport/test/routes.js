'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Preimport = mongoose.model('Preimport');

var credentials,
    token,
    mockup;

describe('Preimport CRUD routes tests', function () {

    before(function (done) {
        mockup = [
            {
                "name": "2561-ม2-1",
                "data": [
                    {
                        "โรงเรียน": "สรุปผลการเรียน",
                        "__rowNum__": 1
                    },
                    {
                        "โรงเรียน": "ภาคเรียนที่  1               ปีการศึกษา  2561          ชั้น มัธยมศึกษาปีที่ 2",
                        "__rowNum__": 2
                    },
                    {
                        "__EMPTY_2": "รายวิชาพื้นฐาน (11 นก.)",
                        "__EMPTY_12": "รายวิชาเพิ่มเติม (2.5 นก.)",
                        "__EMPTY_21": "กิจกรรมพัฒนาผู้เรียน",
                        "__EMPTY_25": "การอ่าน คิดวิเคราะห์ และเขียน",
                        "__EMPTY_26": "คุณลักษณะอังพึงประสงค์",
                        "__EMPTY_27": "สมรรถนะสำคัญของผู้เรียน",
                        "__EMPTY_28": "หมายเหตุ",
                        "__rowNum__": 3
                    },
                    {
                        "__EMPTY_2": "ไทย",
                        "__EMPTY_3": "คณิต",
                        "__EMPTY_4": "วิทย์",
                        "__EMPTY_5": "สังคมฯ",
                        "__EMPTY_7": "สุขศึกษาฯ",
                        "__EMPTY_8": "ศิลปะ",
                        "__EMPTY_9": "การงานฯ",
                        "__EMPTY_10": "อังกฤษ",
                        "__EMPTY_12": "คณิต",
                        "__EMPTY_13": "วิทย์",
                        "__EMPTY_14": "สังคมฯ",
                        "__EMPTY_15": "ศิลปะ",
                        "__EMPTY_17": "การงานฯ",
                        "__EMPTY_21": "กิจกรรมแนะแนว",
                        "__EMPTY_22": "กิจกรรมชุมนุมศิลปะและดนตรี",
                        "__EMPTY_23": "กิจกรรมลูกเสือ-เนตรนารี",
                        "__EMPTY_24": "กิจกรรมเพื่อสังคมฯ",
                        "__rowNum__": 4
                    },
                    {
                        "โรงเรียน": "ลำดับที่",
                        "__EMPTY": "เลขประจำตัว",
                        "__EMPTY_1": "ชื่อ - สกุล",
                        "__EMPTY_2": "ภาษาไทย (ท22101)",
                        "__EMPTY_3": "คณิตศาสตร์ (ค22101)",
                        "__EMPTY_4": "วิทยาศาสตร์ (ว22101)",
                        "__EMPTY_5": "สังคมศึกษาฯ (ส22101)",
                        "__EMPTY_6": "ประวัติศาสตร์ (ส22102)",
                        "__EMPTY_7": "สุขศึกษาฯ (พ22101)",
                        "__EMPTY_8": "ศิลปะ (ศ22101)",
                        "__EMPTY_9": "การงานอาชีพฯ (ง22101)",
                        "__EMPTY_10": "ภาษาอังกฤษ (อ22101)",
                        "__EMPTY_11": "รวมหน่วยกิต (พฐ.)",
                        "__EMPTY_12": "เสริมทักษะคณิตศาสตร์ (ค20204)",
                        "__EMPTY_13": "วิทยาศาสตร์-ฟิสิกส์ (ว22201) ",
                        "__EMPTY_14": "สังคมฯ-หน้าที่พลเมือง (ส22233)",
                        "__EMPTY_15": "ศิลปะ-ดนตรีไทย (ศ20210)",
                        "__EMPTY_17": "เสริมการงานอาชีพฯ-หัตถกรรม (ง22201)",
                        "__EMPTY_19": "รวมหน่วยกิต (พต.)",
                        "__EMPTY_20": "รวมหน่วยกิต/เกรดเฉลีย",
                        "__EMPTY_30": "คำนวนเกรดเฉลี่ย",
                        "__rowNum__": 5
                    },
                    {
                        "__EMPTY_1": "หน่วยกิต",
                        "__EMPTY_2": 1.5,
                        "__EMPTY_3": 1.5,
                        "__EMPTY_4": 1.5,
                        "__EMPTY_5": 1.5,
                        "__EMPTY_6": 0.5,
                        "__EMPTY_7": 1,
                        "__EMPTY_8": 1,
                        "__EMPTY_9": 1,
                        "__EMPTY_10": 1.5,
                        "__EMPTY_11": 11,
                        "__EMPTY_12": 0.5,
                        "__EMPTY_13": 0.5,
                        "__EMPTY_14": 0.5,
                        "__EMPTY_15": 0.5,
                        "__EMPTY_17": 0.5,
                        "__EMPTY_19": 2.5,
                        "__EMPTY_20": 13.5,
                        "__EMPTY_30": "ไทย",
                        "__EMPTY_31": "คณิต",
                        "__EMPTY_32": "วิทย์",
                        "__EMPTY_33": "สังคม",
                        "__EMPTY_34": "สุขศึกษา",
                        "__EMPTY_35": "ศิลปะ",
                        "__EMPTY_36": "การงานฯ",
                        "__EMPTY_37": "อังกฤษ",
                        "__rowNum__": 6
                    },
                    {
                        "โรงเรียน": 1,
                        "__EMPTY": "00112",
                        "__EMPTY_1": "เด็กหญิงปาณิศา สงเนียม",
                        "__EMPTY_2": 2,
                        "__EMPTY_3": 2,
                        "__EMPTY_4": 2,
                        "__EMPTY_5": 2,
                        "__EMPTY_6": 2,
                        "__EMPTY_7": 2,
                        "__EMPTY_8": 2,
                        "__EMPTY_9": 2,
                        "__EMPTY_10": 2,
                        "__EMPTY_11": 2,
                        "__EMPTY_12": 2,
                        "__EMPTY_13": 2,
                        "__EMPTY_14": 2,
                        "__EMPTY_15": 2,
                        "__EMPTY_16": 2,
                        "__EMPTY_17": 2,
                        "__EMPTY_18": 2,
                        "__EMPTY_19": 2,
                        "__EMPTY_20": 2,
                        "__EMPTY_21": "ผ",
                        "__EMPTY_22": "ผ",
                        "__EMPTY_23": "ผ",
                        "__EMPTY_24": "ผ",
                        "__EMPTY_25": "ดี",
                        "__EMPTY_26": "ดี",
                        "__EMPTY_27": "ดี",
                        "__EMPTY_30": 3,
                        "__EMPTY_31": 4,
                        "__EMPTY_32": 4,
                        "__EMPTY_33": 5,
                        "__EMPTY_34": 2,
                        "__EMPTY_35": 3,
                        "__EMPTY_36": 3,
                        "__EMPTY_37": 3,
                        "__EMPTY_38": 2,
                        "__rowNum__": 7
                    },
                    {
                        "โรงเรียน": 2,
                        "__EMPTY": "00113",
                        "__EMPTY_1": "เด็กหญิงสวรินทร์ แก้วถาวร",
                        "__EMPTY_2": 2,
                        "__EMPTY_3": 2,
                        "__EMPTY_4": 2,
                        "__EMPTY_5": 2,
                        "__EMPTY_6": 2,
                        "__EMPTY_7": 2,
                        "__EMPTY_8": 2,
                        "__EMPTY_9": 2,
                        "__EMPTY_10": 2,
                        "__EMPTY_11": 2,
                        "__EMPTY_12": 2,
                        "__EMPTY_13": 2,
                        "__EMPTY_14": 2,
                        "__EMPTY_15": 2,
                        "__EMPTY_16": 2,
                        "__EMPTY_17": 2,
                        "__EMPTY_18": 2,
                        "__EMPTY_19": 2,
                        "__EMPTY_20": 2,
                        "__EMPTY_21": "ผ",
                        "__EMPTY_22": "ผ",
                        "__EMPTY_23": "ผ",
                        "__EMPTY_24": "ผ",
                        "__EMPTY_25": "ดี",
                        "__EMPTY_26": "ดี",
                        "__EMPTY_27": "ดี",
                        "__EMPTY_30": 3,
                        "__EMPTY_31": 4,
                        "__EMPTY_32": 4,
                        "__EMPTY_33": 5,
                        "__EMPTY_34": 2,
                        "__EMPTY_35": 3,
                        "__EMPTY_36": 3,
                        "__EMPTY_37": 3,
                        "__EMPTY_38": 2,
                        "__rowNum__": 8
                    },
                    {
                        "โรงเรียน": 3,
                        "__EMPTY": "00114",
                        "__EMPTY_1": "เด็กหญิงพีรดา วงศ์พัฒนเลิศ",
                        "__EMPTY_2": 2,
                        "__EMPTY_3": 2,
                        "__EMPTY_4": 2,
                        "__EMPTY_5": 2,
                        "__EMPTY_6": 2,
                        "__EMPTY_7": 2,
                        "__EMPTY_8": 2,
                        "__EMPTY_9": 2,
                        "__EMPTY_10": 2,
                        "__EMPTY_11": 2,
                        "__EMPTY_12": 2,
                        "__EMPTY_13": 2,
                        "__EMPTY_14": 2,
                        "__EMPTY_15": 2,
                        "__EMPTY_16": 2,
                        "__EMPTY_17": 2,
                        "__EMPTY_18": 2,
                        "__EMPTY_19": 2,
                        "__EMPTY_20": 2,
                        "__EMPTY_21": "ผ",
                        "__EMPTY_22": "ผ",
                        "__EMPTY_23": "ผ",
                        "__EMPTY_24": "ผ",
                        "__EMPTY_25": "ดี",
                        "__EMPTY_26": "ดี",
                        "__EMPTY_27": "ดี",
                        "__EMPTY_30": 3,
                        "__EMPTY_31": 4,
                        "__EMPTY_32": 4,
                        "__EMPTY_33": 5,
                        "__EMPTY_34": 2,
                        "__EMPTY_35": 3,
                        "__EMPTY_36": 3,
                        "__EMPTY_37": 3,
                        "__EMPTY_38": 2,
                        "__rowNum__": 9
                    },
                    {
                        "__EMPTY": "ความหมายระดับคะแนน",
                        "__rowNum__": 27
                    }
                ]
            },
            {
                "name": "2561-ม2-2",
                "data": [
                    {
                        "โรงเรียน": "สรุปผลการเรียน",
                        "__rowNum__": 1
                    },
                    {
                        "โรงเรียน": "ภาคเรียนที่  2               ปีการศึกษา  2561          ชั้น มัธยมศึกษาปีที่ 2",
                        "__rowNum__": 2
                    },
                    {
                        "__EMPTY_2": "รายวิชาพื้นฐาน (11 นก.)",
                        "__EMPTY_12": "รายวิชาเพิ่มเติม (2.5 นก.)",
                        "__EMPTY_21": "กิจกรรมพัฒนาผู้เรียน",
                        "__EMPTY_25": "การอ่าน คิดวิเคราะห์ และเขียน",
                        "__EMPTY_26": "คุณลักษณะอังพึงประสงค์",
                        "__EMPTY_27": "สมรรถนะสำคัญของผู้เรียน",
                        "__EMPTY_28": "หมายเหตุ",
                        "__rowNum__": 3
                    },
                    {
                        "__EMPTY_2": "ไทย",
                        "__EMPTY_3": "คณิต",
                        "__EMPTY_4": "วิทย์",
                        "__EMPTY_5": "สังคมฯ",
                        "__EMPTY_7": "สุขศึกษาฯ",
                        "__EMPTY_8": "ศิลปะ",
                        "__EMPTY_9": "การงานฯ",
                        "__EMPTY_10": "อังกฤษ",
                        "__EMPTY_12": "คณิต",
                        "__EMPTY_13": "วิทย์",
                        "__EMPTY_14": "สังคมฯ",
                        "__EMPTY_15": "ศิลปะ",
                        "__EMPTY_17": "การงานฯ",
                        "__EMPTY_21": "กิจกรรมแนะแนว",
                        "__EMPTY_22": "กิจกรรมชุมนุมศิลปะและดนตรี",
                        "__EMPTY_23": "กิจกรรมลูกเสือ-เนตรนารี",
                        "__EMPTY_24": "กิจกรรมเพื่อสังคมฯ",
                        "__rowNum__": 4
                    },
                    {
                        "โรงเรียน": "ลำดับที่",
                        "__EMPTY": "เลขประจำตัว",
                        "__EMPTY_1": "ชื่อ - สกุล",
                        "__EMPTY_2": "ภาษาไทย (ท22101)",
                        "__EMPTY_3": "คณิตศาสตร์ (ค22101)",
                        "__EMPTY_4": "วิทยาศาสตร์ (ว22101)",
                        "__EMPTY_5": "สังคมศึกษาฯ (ส22101)",
                        "__EMPTY_6": "ประวัติศาสตร์ (ส22102)",
                        "__EMPTY_7": "สุขศึกษาฯ (พ22101)",
                        "__EMPTY_8": "ศิลปะ (ศ22101)",
                        "__EMPTY_9": "การงานอาชีพฯ (ง22101)",
                        "__EMPTY_10": "ภาษาอังกฤษ (อ22101)",
                        "__EMPTY_11": "รวมหน่วยกิต (พฐ.)",
                        "__EMPTY_12": "เสริมทักษะคณิตศาสตร์ (ค20204)",
                        "__EMPTY_13": "วิทยาศาสตร์-ฟิสิกส์ (ว22201) ",
                        "__EMPTY_14": "สังคมฯ-หน้าที่พลเมือง (ส22233)",
                        "__EMPTY_15": "ศิลปะ-ดนตรีไทย (ศ20210)",
                        "__EMPTY_17": "เสริมการงานอาชีพฯ-หัตถกรรม (ง22201)",
                        "__EMPTY_19": "รวมหน่วยกิต (พต.)",
                        "__EMPTY_20": "รวมหน่วยกิต/เกรดเฉลีย",
                        "__EMPTY_30": "คำนวนเกรดเฉลี่ย",
                        "__rowNum__": 5
                    },
                    {
                        "__EMPTY_1": "หน่วยกิต",
                        "__EMPTY_2": 1.5,
                        "__EMPTY_3": 1.5,
                        "__EMPTY_4": 1.5,
                        "__EMPTY_5": 1.5,
                        "__EMPTY_6": 0.5,
                        "__EMPTY_7": 1,
                        "__EMPTY_8": 1,
                        "__EMPTY_9": 1,
                        "__EMPTY_10": 1.5,
                        "__EMPTY_11": 11,
                        "__EMPTY_12": 0.5,
                        "__EMPTY_13": 0.5,
                        "__EMPTY_14": 0.5,
                        "__EMPTY_15": 0.5,
                        "__EMPTY_17": 0.5,
                        "__EMPTY_19": 2.5,
                        "__EMPTY_20": 13.5,
                        "__EMPTY_30": "ไทย",
                        "__EMPTY_31": "คณิต",
                        "__EMPTY_32": "วิทย์",
                        "__EMPTY_33": "สังคม",
                        "__EMPTY_34": "สุขศึกษา",
                        "__EMPTY_35": "ศิลปะ",
                        "__EMPTY_36": "การงานฯ",
                        "__EMPTY_37": "อังกฤษ",
                        "__rowNum__": 6
                    },
                    {
                        "โรงเรียน": 1,
                        "__EMPTY": "00112",
                        "__EMPTY_1": "เด็กหญิงปาณิศา สงเนียม",
                        "__EMPTY_2": 2,
                        "__EMPTY_3": 2,
                        "__EMPTY_4": 2,
                        "__EMPTY_5": 2,
                        "__EMPTY_6": 2,
                        "__EMPTY_7": 2,
                        "__EMPTY_8": 2,
                        "__EMPTY_9": 2,
                        "__EMPTY_10": 2,
                        "__EMPTY_11": 2,
                        "__EMPTY_12": 2,
                        "__EMPTY_13": 2,
                        "__EMPTY_14": 2,
                        "__EMPTY_15": 2,
                        "__EMPTY_16": 2,
                        "__EMPTY_17": 2,
                        "__EMPTY_18": 2,
                        "__EMPTY_19": 2,
                        "__EMPTY_20": 2,
                        "__EMPTY_21": "ผ",
                        "__EMPTY_22": "ผ",
                        "__EMPTY_23": "ผ",
                        "__EMPTY_24": "ผ",
                        "__EMPTY_25": "ดี",
                        "__EMPTY_26": "ดี",
                        "__EMPTY_27": "ดี",
                        "__EMPTY_30": 3,
                        "__EMPTY_31": 4,
                        "__EMPTY_32": 4,
                        "__EMPTY_33": 5,
                        "__EMPTY_34": 2,
                        "__EMPTY_35": 3,
                        "__EMPTY_36": 3,
                        "__EMPTY_37": 3,
                        "__EMPTY_38": 2,
                        "__rowNum__": 7
                    },
                    {
                        "โรงเรียน": 2,
                        "__EMPTY": "00113",
                        "__EMPTY_1": "เด็กหญิงสวรินทร์ แก้วถาวร",
                        "__EMPTY_2": 2,
                        "__EMPTY_3": 2,
                        "__EMPTY_4": 2,
                        "__EMPTY_5": 2,
                        "__EMPTY_6": 2,
                        "__EMPTY_7": 2,
                        "__EMPTY_8": 2,
                        "__EMPTY_9": 2,
                        "__EMPTY_10": 2,
                        "__EMPTY_11": 2,
                        "__EMPTY_12": 2,
                        "__EMPTY_13": 2,
                        "__EMPTY_14": 2,
                        "__EMPTY_15": 2,
                        "__EMPTY_16": 2,
                        "__EMPTY_17": 2,
                        "__EMPTY_18": 2,
                        "__EMPTY_19": 2,
                        "__EMPTY_20": 2,
                        "__EMPTY_21": "ผ",
                        "__EMPTY_22": "ผ",
                        "__EMPTY_23": "ผ",
                        "__EMPTY_24": "ผ",
                        "__EMPTY_25": "ดี",
                        "__EMPTY_26": "ดี",
                        "__EMPTY_27": "ดี",
                        "__EMPTY_30": 3,
                        "__EMPTY_31": 4,
                        "__EMPTY_32": 4,
                        "__EMPTY_33": 5,
                        "__EMPTY_34": 2,
                        "__EMPTY_35": 3,
                        "__EMPTY_36": 3,
                        "__EMPTY_37": 3,
                        "__EMPTY_38": 2,
                        "__rowNum__": 8
                    },
                    {
                        "โรงเรียน": 3,
                        "__EMPTY": "00114",
                        "__EMPTY_1": "เด็กหญิงพีรดา วงศ์พัฒนเลิศ",
                        "__EMPTY_2": 2,
                        "__EMPTY_3": 2,
                        "__EMPTY_4": 2,
                        "__EMPTY_5": 2,
                        "__EMPTY_6": 2,
                        "__EMPTY_7": 2,
                        "__EMPTY_8": 2,
                        "__EMPTY_9": 2,
                        "__EMPTY_10": 2,
                        "__EMPTY_11": 2,
                        "__EMPTY_12": 2,
                        "__EMPTY_13": 2,
                        "__EMPTY_14": 2,
                        "__EMPTY_15": 2,
                        "__EMPTY_16": 2,
                        "__EMPTY_17": 2,
                        "__EMPTY_18": 2,
                        "__EMPTY_19": 2,
                        "__EMPTY_20": 2,
                        "__EMPTY_21": "ผ",
                        "__EMPTY_22": "ผ",
                        "__EMPTY_23": "ผ",
                        "__EMPTY_24": "ผ",
                        "__EMPTY_25": "ดี",
                        "__EMPTY_26": "ดี",
                        "__EMPTY_27": "ดี",
                        "__EMPTY_30": 3,
                        "__EMPTY_31": 4,
                        "__EMPTY_32": 4,
                        "__EMPTY_33": 5,
                        "__EMPTY_34": 2,
                        "__EMPTY_35": 3,
                        "__EMPTY_36": 3,
                        "__EMPTY_37": 3,
                        "__EMPTY_38": 2,
                        "__rowNum__": 9
                    },
                    {
                        "__EMPTY": "ความหมายระดับคะแนน",
                        "__rowNum__": 27
                    }
                ]
            }
        ];
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user'],
            ref1: "1234"
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Preimport get use token', (done) => {
        request(app)
            .get('/api/preimports')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Preimport get by id', function (done) {

        request(app)
            .post('/api/preimports')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/preimports/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.courses.length, 2);
                        assert.equal(resp.data.courses[0].structures.length,18);
                        assert.equal(resp.data.courses[1].structures.length,18);
                        assert.equal(resp.data.courses[0].students.length,3);
                        assert.equal(resp.data.courses[1].students.length,3);
                        //console.log(resp.data.summary[0]);
                        //structures: { basic: 11, advance: 2.5, activity: 4 }
                        assert.equal(resp.data.summary.length, 2);
                        assert.equal(resp.data.summary[0].structures.basic, 11);
                        assert.equal(resp.data.summary[0].structures.advance, 2.5);
                        assert.equal(resp.data.summary[0].structures.activity, 4);
                        assert.equal(resp.data.summary[0].students, 3);
                        assert.equal(resp.data.summary[1].structures.basic, 11);
                        assert.equal(resp.data.summary[1].structures.advance, 2.5);
                        assert.equal(resp.data.summary[1].structures.activity, 4);
                        assert.equal(resp.data.summary[1].students, 3);
                        done();
                    });
            });

    });

    xit('should be Preimport post use token', (done) => {
        request(app)
            .post('/api/preimports')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.name, mockup.name);
                done();
            });
    });

    xit('should be preimport put use token', function (done) {

        request(app)
            .post('/api/preimports')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/preimports/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.name, update.name);
                        done();
                    });
            });

    });

    xit('should be preimport delete use token', function (done) {

        request(app)
            .post('/api/preimports')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/preimports/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be preimport get not use token', (done) => {
        request(app)
            .get('/api/preimports')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be preimport post not use token', function (done) {

        request(app)
            .post('/api/preimports')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be preimport put not use token', function (done) {

        request(app)
            .post('/api/preimports')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/preimports/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be preimport delete not use token', function (done) {

        request(app)
            .post('/api/preimports')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/preimports/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Preimport.remove().exec(done);
    });

});