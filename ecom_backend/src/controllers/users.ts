import * as express from 'express';
import * as  userModel  from './../models/user';
import * as  authUserModel  from './../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'underscore';
import * as appConstant from './../../config/config';
import { CodeConstants } from '../interfaces/code_constants';
import * as common from '../helpers/common_helper';

//create user
export function createUser (req, res, next){
  try{
    console.log(">>>>>>>>>>>>in controlsers >>>>>data");
    userModel.getUser(req.body.email).then((data: any)=>{
      if(!data.length){
        console.log("data >?>>>>>>>>>>>>>>>>>")
        bcrypt.hash(req.body.password, 10).then(hash =>{
        console.log("data >?>>>>>>>>>>>>>>>>>", hash)
          req.body.password =  hash;
          userModel.createUser(req.body).then(response => {
            console.log("response >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            console.log(response)
            if(response) {
              common.assignLevelUpToUser(response);
              res.send(response);
            }
          }).catch(err => {
            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeee", err)
          });
        });
      }else {
        res.status(409).json({ "status": 409, "error": CodeConstants.USER_ALREADY_EXIST});
      }
    });
  } catch(error) {
    res.send({message:error});
  }
}

// authenticate user
export function authenticateUser(req, res, next){
  try{
    let email = req.body.email.toLowerCase().replace(/ /g, '');
    let password = req.body.password;
    userModel.authenticateUser({email:email}).then((response: any) => {
    console.log('>>>>>>>>>>usermosel', response);
      if(response.length){
        bcrypt.compare(password, response[0].password).then(check =>{
          if(check){
            var token = jwt.sign({ email: email, id: response[0]._id}, 'shhhhh');
            if(token){
              console.log('>>>>>>>>token', token);
                res.send({ email: email, user_auth_token: token });
            }
          }else{
            res.send({message: CodeConstants.PASSWORD_DO_NOT_MATCH});
          }
        });
      }else {
        res.status(404).json({ "status":404,"error": CodeConstants.USER_NOT_FOUND});
      }
    });
  }catch(e){
    res.send({message:e});
  }
}

//get user
export function getUser(req, res, next){
  try {
    let email = req.params.email;
    userModel.getUser(email).then(response =>{
      if(response){
        res.send(response);
      }else{
        res.send({message: CodeConstants.USER_NOT_FOUND});
      }
    });
  }catch(e){
    res.send({message:e});
  }
}

//get all user
export function getAllUser(req,res,next){
  try{
    userModel.getAllUser().then(response =>{
      if(response){
        res.send(response);
      }else {
        res.send({message: CodeConstants.USER_NOT_FOUND});
      }
    });
  }catch(e){
    res.send({message:e});
  }
}

//update user
export function updateUser(req,res,next){
  try{
    let email = req.params.email;
    userModel.updateUser(email, req.body).then(response =>{
      if(response){
        res.send(response);
      }else{
        res.send({message: CodeConstants.USER_NOT_FOUND});
      }
    });
  }catch(e){
    res.send({message:e});
  }
}

//delete all user
export function deleteUser(req,res,next){
  try{
    let email = req.params.email;
    userModel.deleteUser(email).then(response =>{
      if(response){
        res.send(response);
      }else{
        res.send({message: CodeConstants.USER_NOT_FOUND});
      }
    });
  }catch(e){
    res.send({message:e});
  }
}

//logout user
export function logoutUser(req,res,next){
  try{
    let email = req.params.email;
    userModel.logoutUser(email).then(response =>{
      res.send({message:CodeConstants.OK});
    });
  }catch(e){
    res.send({message:e});
  }
}

//update user token amount
export function updateUserToken(user, token){
  try{
    console.log("data >>>>>>>>>>>>>>>>>>>>>");
    console.log(token);
    // let email = req.params.email;
    // userModel.logoutUser(email).then(response =>{
    //   res.send({message:CodeConstants.OK});
    // });
    user.wallet_amount = token;
    console.log(user);
    userModel.updateUser(user.email, user).then(function(user){
      console.log(user)
    });
  }catch(e){
    // res.send({message:e});
    console.log("e >>>>>>>>>>>>>>>>>>>")
    console.log(e)
  }
}
