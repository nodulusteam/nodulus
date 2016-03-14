/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */


var dal = require("../classes/dal.js");


export class users {
    public static login(email, password, callback): void {

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

    public static register(user, callback): void {
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
 
 