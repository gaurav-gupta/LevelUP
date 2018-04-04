import * as express from 'express';
import * as  productModel from './../models/product';
import { CodeConstants } from '../interfaces/code_constants';
import { commonHelper  } from '../helpers/common_helper';
var common = new commonHelper;
export class ProductsController{
    //get product
    getProduct (req, res, next){
        try {
            let id = req.params.id;
            productModel.getProduct({_id: id}).then(response => {
                if(response) {
                    res.send(response);
                }
            });
        } catch(error) {
            res.status(400).json(error);
        }
    }

    //get products
    getAllProduct(req,res,next){
        try {
            productModel.getAllProduct().then(response => {
                if(response){
                    res.send(response);
                }
            });
        } catch(e) {
            res.status(400).json(e);
        }
    }

    //create product
    createProduct(req, res, next) {
        try {
            var data = req.body;
            var user = req.user_data[0];
            console.log("user >>>>>>>>>>>>>>>>>>>>>>>>")
            console.log(user)
            common.addProductToStore(data, user).then((response) => {
                console.log("response >>>>>>>>>>>>>>>>>>>>>", response)
                res.send(response);
            }).catch((e)=> {
                // var e = JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e))).message;
                console.log("e >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                console.log(e)
                res.status(400).json(e);
            })
        } catch (err) {
            res.status(400).json(err);
        }
    }
}
