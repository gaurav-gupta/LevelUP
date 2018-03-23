import * as express from 'express';
import * as randomstring from 'randomstring';
import * as userModel from './../models/user';
import * as  authUserModel  from './../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'underscore';
import * as appConstant from './../../config/config';
import { CodeConstants } from '../interfaces/code_constants';
import { commonHelper  }from '../helpers/common_helper';
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
                common.assignLevelUpToUser(response, password);
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
                res.send({ email: email, user_auth_token: token });
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
      userModel.getAllUser().then(response =>{
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
      var password = req.body.password;
      req.body.roles = "publisher";
      req.body.uuid =  randomstring.generate();
      userModel.getUser({email: req.body.email}).then((data: any)=>{
        if(!data.length){
          bcrypt.hash(req.body.password, 10).then(hash =>{
            req.body.password =  hash;
            userModel.createPublisher(req.body).then(response =>{
              if(response) {
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
      console.log(">>.get user >>>>>>>>>>>");
      req.url = req.url.split('/')[1];
      var data =  {"roles" : req.url};
      userModel.getPublisher(data).then(response =>{
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

}
