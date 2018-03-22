import * as express from 'express';
import * as appConstant from './../../config/config';
import { CodeConstants } from '../interfaces/code_constants';
import * as  categoryModel  from './../models/category';

//get categories
export function getAllCategories (req, res, next){
  try{
    categoryModel.getAllCategories().then(response =>{
      res.send(response);
    });
  }catch(e){
   	res.send(e);
  }
}
