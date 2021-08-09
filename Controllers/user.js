const sql = require('../db.js');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient();

//register api
exports.singup = async (req, res) => {
    sql.query(
        `CALL spRegisterUser(?,?,?,?,?,?,?,?,?)`,
        // `INSERT INTO
        //  register(first_name,last_name,birth_date,phone,address,city,state,email,password)
        //  VALUES (?,?,?,?,?,?,?,?,?) `,
        [
            req.body.first_name,
            req.body.last_name,
            req.body.birth_date,
            req.body.phone,
            req.body.address,
            req.body.city,
            req.body.state,
            req.body.email,
            req.body.password
        ],
        (error, results) => {
            if (error) {
                res.send({ Error: error, Msg: "not register" })
            }
            else {

                res.send({ UserDetails: results, Msg: "registred succe" })
            }
        }
    );

}

//login api
exports.signin = async (req, res) => {
    // const user = users.find(u => u.email === req.email && u.password === req.password);

    sql.query(`CALL spLoginUser(?,?)`,
        [
            req.body.email,
            req.body.password
        ],
        (error, results) => {
            if (error) {
                res.send({ Error: error, Msg: "login failed" })
            }
            else {
                var user_email = results[0][0].email;
                const token = jwt.sign({ email: user_email }, 'my_secret_key');
                // users=results;
                // res.json({
                //     token:token
                // });
                client.SETEX('LoginData', 3000, JSON.stringify(token));
                client.SETEX('UserData', 3000,JSON.stringify(results[0][0]));

                res.send({ UserDetails: results[0][0], token: token })
            }
        }
    );
}
//token varification
exports.varification = (req, res, next) => {

    client.get("LoginData", (err, data) => {
        if (err) throw err;

        if (data !== null) {
            var token = data.slice(1, -1);
            // verify the jwt and redis token values
            jwt.verify(token, "my_secret_key", (err, authData) => {
                if (err) {
                    res.send(err);

                } else {
                    if (authData.email == req.body.email) {
                        console.log("data fetch from redis");
                        next();
                    } else {
                        res.sendStatus(403);
                    }
                }
            });
        }
        else {
            next();
        }
    })
}



//GetUserData api
exports.getdata = async (req, res) => {
    client.get('UserData', (err, data) => {
        if (err) {
            throw err;
        } else if (data != null) {
            res.json({ UserDetail: data });
        } else {
            sql.query(`CALL spGetUserData(?)`,
                [
                    req.body.email
                ],
                (error, results) => {
                    if (error) {
                        res.send({ Error: error, Msg: "request failed" })
                    }
                    else {
                        res.send({ UserDetails: results[0][0], Msg: "successfully retrieved data" })
                    }
                }
            );
        }
    })
}



//delete user api
exports.deletedata = async (req, res) => {
            sql.query(`CALL spDeleteUserData(?)`,
                [
                    req.params.id
                ],
                (error, results) => {
                    if (error) {
                        res.send({ Error: error, Msg: "request failed" })
                    }
                    else {
                        res.send({ UserDetails: results, Msg: "successfully Deleted data" })
                    }
                }
            );
        
}



//update user api
exports.Updatedata = async (req, res) => {
    sql.query(`CALL spUpdateUserData(?,?,?,?,?,?,?,?,?,?)`,
        [    
            req.params.id,
            req.body.first_name,
            req.body.last_name,
            req.body.birth_date,
            req.body.phone,
            req.body.address,
            req.body.city,
            req.body.state,
            req.body.email,
            req.body.password
        ],
        (error, results) => {
            if (error) {
                res.send({ Error: error, Msg: "request failed" })
            }
            else {
                res.send({ UserDetails: results, Msg: "successfully update data" })
            }
        }
    );

}
