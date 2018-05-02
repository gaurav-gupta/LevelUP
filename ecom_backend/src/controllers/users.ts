import * as express from 'express';
import * as randomstring from 'randomstring';
import * as userModel from './../models/user';
import * as LogsModel from './../models/level_up_log';
import * as  authUserModel  from './../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'underscore';
import * as appConstant from './../../config/config';
import { CodeConstants } from '../interfaces/code_constants';
import { commonHelper  } from '../helpers/common_helper';
var common = new commonHelper;

export class userController {
    //create user
    createUser(req, res, next){
        try{
            var password = req.body.password;
            userModel.getUser({email: req.body.email}).then((data: any)=>{
                if(!data.length){
                    bcrypt.hash(req.body.password, 10).then(hash =>{
                        req.body.password =  hash;
                        userModel.createUser(req.body).then(response => {
                            if(response) {
                                common.createUserWalletAddress(response, password);
                                res.send(response);
                            }
                        }).catch(err => {
                            res.status(400).json(err.message);
                        });
                    });
                }else {
                    res.status(400).json(CodeConstants.USER_ALREADY_EXIST);
                }
            });
        } catch(error) {
            res.status(400).json(error);
        }
    }

    //authenticate user
    authenticateUser(req, res, next){
        try{
            let email = req.body.email.toLowerCase().replace(/ /g, '');
            let password = req.body.password;
            userModel.getUser({email:email}).then((response: any) => {
                if(response.length){
                    bcrypt.compare(password, response[0].password).then(check =>{
                        if(check){
                            var token = jwt.sign({ email: email, id: response[0]._id}, 'shhhhh');
                            if(token){
                                res.send({ email: email, user_auth_token: token, roles: response[0].roles , wallet_address: response[0].wallet_address});
                            }
                        }else{
                            res.status(400).json(CodeConstants.PASSWORD_DO_NOT_MATCH);
                        }
                    });
                }else {
                    res.status(404).json(CodeConstants.USER_NOT_FOUND);
                }
            });
        }catch(e){
            res.status(400).json(e);
        }
    }

    // signIn Modal
    signInUser(req, res, next) {
        try {
            let html = `<div id="userBlock">
            <div class="modal fade" id="login" role="dialog">
            <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <div class="modal-header text-center">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h2>Please signIn</h2>
            </div>
            <div class="wrapper">
            <form class="form-signin">
            <span class="validationError"> </span>
            <h2 class="form-signin-heading"></h2>
            <i class="fa fa-envelope prefix grey-text"></i>
            <label>Email</label>
            <input type="email" id=email class="form-control" name="email" placeholder="Email Address" required /><br>
            <i class="fa fa-lock prefix grey-text"></i>
            <label>Password</label>
            <input type="password" id=password class="form-control" name="password" placeholder="Password" required /><br>
            <button  class="btn btn-lg btn-primary btn-block" id=signInUser type="button">Login</button><br>
            <a id="signUpUser">Sign Up</a>
            </form>
            </div>
            </div>
            </div>
            </div>
            </div>`;
            res.send(html);
        }
        catch (e) {
            res.status(400).json(e);
        }
    }

    signUpModal(req, res, next) {
        try {
            let html = `
            <div class="modal fade" id="signUp" role="dialog">
            <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <div class="modal-header text-center">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h2>Please signUp</h2>
            </div>
            <div class="modal-body">
            <form class="form-signin">
            <span class="validationError"> </span><br>
            <i class="fa fa-user prefix grey-text"></i>
            <label>Fist Name</label>
            <input type="text" id=firstname class="form-control" placeholder="First Name"  name="first_name" required><br>
            <i class="fa fa-user prefix grey-text"></i>
            <label>Last Name</label>
            <input type="text" id=lastname class="form-control" placeholder="Last Name"  name="last_name" required><br>
            <i class="fa fa-envelope prefix grey-text"></i>
            <label>Email</label>
            <input type="email" id=emailUser class="form-control" placeholder="Email address"  name="email" required><br>
            <i class="fa fa-lock prefix grey-text"></i>
            <label>Password</label>
            <input type="password" id=passwordUser class="form-control" placeholder="Password" name="password" required><br>
            <button type="button" id=createUser class="btn btn-primary  btn btn-lg btn-primary btn-block">Sign Up</button>
            </form>
            </div>
            <div class="modal-footer">
            </div>
            </div>
            </div>
            </div>`;
            res.send(html);
        }
        catch (e) {
            res.status(400).json(e);
        }
    }

    userTransaction(req, res, next) {
        try {
            let publisher_id = req.body.publisher_id;
            let gamer = req.user_data[0];
            userModel.getUser({_id: publisher_id, roles: "publisher"}).then((publisher:any) =>{
                if(publisher.length){
                    common.updateUserToken(publisher[0], gamer).then((response) => {
                        res.send(response);
                    }).catch((err) => {
                        res.status(400).json(err);
                    });
                } else {
                    res.status(400).json("Publisher not present...");
                }
            });
        } catch(e) {
            res.status(400).json(e);
        }
    }

    getUserTransaction(req, res, next) {
        try {
            let id = req.params.id;
            userModel.getUser({_id: id}).then(response =>{
                if(response) {
                    LogsModel.getUserTransaction(response).then(res1 => {
                        res.send(res1);
                    });
                }
            });
        } catch(e) {
            res.status(400).json(e);
        }
    }

    //Fetch logs
    getTransactions(req, res, next){
        try{
            LogsModel.getAllTransaction({}).then((response: any) => {
                res.status(200).json(response);
            });
        }catch(e){
            res.status(400).json(e);
        }
    }

    //Fetch logs
    getUserTransactions(req, res, next){
        try{
            var user = req.user_data;
            LogsModel.getUserTransaction(user).then((response: any) => {
                res.status(200).json(response);
            });
        }catch(e){
            res.status(400).json(e);
        }
    }

    //get user
    getUser(req, res, next){
        try {
            let email = req.params.email;
            userModel.getUser({email: email}).then(response =>{
                if(response){
                    res.send(response);
                }else{
                    res.status(400).json(CodeConstants.USER_NOT_FOUND);
                }
            });
        }catch(e){
            res.status(400).json(e);
        }
    }

    //get all user
    getAllUser(req,res,next){
        try{
            userModel.getUser({ roles: "user" }).then(response =>{
                if(response){
                    res.send(response);
                }else {
                    res.status(400).json(CodeConstants.USER_NOT_FOUND);
                }
            });
        }catch(e){
            res.status(400).json(e);
        }
    }

    //update user
    updateUser(req,res,next){
        try{
            let email = req.params.email;
            userModel.updateUser({email: email}, req.body).then(response =>{
                if(response){
                    res.send(response);
                }else{
                    res.status(400).json(CodeConstants.USER_NOT_FOUND);
                }
            });
        }catch(e){
            res.status(400).json(e);
        }
    }

    //delete all user
    deleteUser(req,res,next){
        try{
            let email = req.params.email;
            userModel.deleteUser({email: email}).then(response =>{
                if(response){
                    res.send(response);
                }else{
                    res.status(400).json(CodeConstants.USER_NOT_FOUND);
                }
            });
        }catch(e){
            res.status(400).json(e);
        }
    }

    //create publisher
    createPublisher(req, res, next){
        try{
            var token = req.body.token;
            var password = req.body.password;
            req.body.roles = "publisher";
            req.body.uuid =  randomstring.generate();
            userModel.getUser({email: req.body.email}).then((data: any)=>{
                if(!data.length){
                    bcrypt.hash(req.body.password, 10).then(hash =>{
                        req.body.password =  hash;
                        userModel.createUser(req.body).then(response =>{
                            if(response) {
                                common.assignLevelUpToPublisher(response, password, token);
                                res.send(response);
                            }
                        }).catch(e =>{
                            res.status(400).json(e);
                        });
                    });
                }else{
                    res.status(400).json(CodeConstants.USER_ALREADY_EXIST);
                }
            });
        }catch(e){
            res.status(400).json(e);
        }
    }

    //get publisher
    getPublisher(req, res, next){
        try{
            req.url = req.url.split('/')[1];
            var data =  {"roles" : req.url};
            userModel.getUser(data).then(response =>{
                if(response){
                    res.send(response);
                }else{
                    res.status(400).json(CodeConstants.USER_NOT_FOUND);
                }
            });
        }catch(e){
            res.status(400).json(e);
        }
    }

    checkPublisher(req, res, next){
        try{
            let id = req.params.id;
            userModel.getUser({_id: id, roles: "publisher"}).then((response:any) =>{
                if(response.length){
                    res.send(response);
                }else{
                    res.status(400).json(CodeConstants.USER_NOT_FOUND);
                }
            });
        }catch(e){
            res.status(400).json(e);
        }
    }
}
