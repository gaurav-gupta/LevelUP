import * as jwt from 'jsonwebtoken';
import * as userModel  from './../models/user';
import { CodeConstants } from '../interfaces/code_constants';
var atob = require('atob');

export function ValidateAuthToken(req,res,next) {
    var token = req.headers["authorization"];
    token = token.split(' ')[1];
    token = atob(token);
    token = token.split(':')[1];
    if (token) {
        try {
            jwt.verify(token, 'shhhhh', function(err, decoded) {
                if(err){
                    return res.status(401).json({"status": CodeConstants.FAILURE, "msg": CodeConstants.INVALID_TOKEN});
                }else{                    
                    userModel.getUser({email: decoded.email}).then(response =>{
                        if(response){
                            req.user_data = response;
                            next();
                        } else {
                            return res.status(401).json({"status": CodeConstants.FAILURE, "msg": CodeConstants.ACCESS_TOKEN_IS_EXPIRED});
                        }
                    });
                }
            });
        }catch(e){
            return res.status(401).json(e);
        }
    }else {
        return res.status(401).json({"status": CodeConstants.FAILURE, "msg": CodeConstants.TOKEN_REQUIRED});
    }
}
