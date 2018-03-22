import * as express from 'express';
import * as userModel from './../models/user';
import * as  authUserModel  from './../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'underscore';
import * as appConstant from './../../config/config';
import { CodeConstants } from '../interfaces/code_constants';
import { commonHelper  }from '../helpers/common_helper';
export class userController {
  private common: commonHelper;
  constructor() {
    this.common = new commonHelper();
    console.log('>>>>>>>>>this<<<<<<<<<common', this.common);
  }

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
                this.common.assignLevelUpToUser(response, password);
                res.send(response);
              }
            }).catch(err => {
              res.send(err.message);
            });
          });
        }else {
          res.send(CodeConstants.USER_ALREADY_EXIST);
        }
      });
    } catch(error) {
        console.log('>>>>>>>ervvvvvvvvvvvvvvror', error);
      res.send({message:error});
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
              res.send(CodeConstants.PASSWORD_DO_NOT_MATCH);
            }
          });
        }else {
          res.status(404).json(CodeConstants.USER_NOT_FOUND);
        }
      });
    }catch(e){
      res.send({message:e});
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
          res.send(CodeConstants.USER_NOT_FOUND);
        }
      });
    }catch(e){
      res.send({message:e});
    }
  }

  //get all user
  getAllUser(req,res,next){
    try{
      userModel.getAllUser().then(response =>{
        if(response){
          res.send(response);
        }else {
          res.send(CodeConstants.USER_NOT_FOUND);
        }
      });
    }catch(e){
      res.send({message:e});
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
          res.send(CodeConstants.USER_NOT_FOUND);
        }
      });
    }catch(e){
      res.send({message:e});
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
          res.send(CodeConstants.USER_NOT_FOUND);
        }
      });
    }catch(e){
      res.send({message:e});
    }
  }

}
