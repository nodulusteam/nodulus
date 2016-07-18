"use strict";
var consts = require("@nodulus/config").consts;
var dal = require("@nodulus/data");
class users {
    static login(email, password, callback) {
        var query = "SELECT * FROM users WHERE email=@email AND password=@password;";
        dal.query(query, { "email": email, "password": password }, function (user) {
            if (user.length == 0) {
                user = { error: { message: "not found" } };
                callback(user);
            }
            else {
                callback(user[0]);
            }
        });
    }
    static register(user, callback) {
        var query = "SELECT * FROM users WHERE email=@email;";
        dal.query(query, { "email": user.Email }, function (exuser) {
            if (exuser.length == 0) {
                var query = "INSERT INTO users email=@email,password=@password;";
                dal.query(query, { "email": user.Email, "password": user.Password }, function (user) {
                    callback(user.result.upserted[0]);
                });
            }
            else {
                user = { error: { message: "user exists" } };
                callback(user);
            }
        });
    }
}
exports.users = users;
