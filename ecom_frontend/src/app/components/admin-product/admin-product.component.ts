import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import * as CodeConstants from "../../constants/levelUp"
import * as ipfsAPI from 'ipfs-api';
import * as buffer from 'buffer';
const LevelJson = CodeConstants.LevelUp;
const Buffer1 = buffer.Buffer;
const ipfs = ipfsAPI({host: '13.250.35.159', port: '5001', protocol: 'http'});
import * as contract from 'truffle-contract';
import * as Web3 from 'web3';
var web3 = new Web3( new Web3.providers.HttpProvider("http://13.250.35.159:9545"));
var LevelUp = contract(LevelJson);
LevelUp.setProvider(web3.currentProvider);

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})

export class AdminProductComponent implements OnInit {
  data: any;
  Categories: any;
  file: any;
  reader: any;
  formData: any;
  xhr: any;
  constructor(private _productService: ProductService) { }

  ngOnInit() {
    this.getCategories();
    this.getproducts();
  }

  getCategories() {
    this._productService.getCategories().subscribe(res => {
      if (res) {
        this.Categories = res;
      }
    });
  }

  getproducts() {
    this._productService.getProduct().subscribe(res => {
      this.data = res;
    });
  }

  changeListener(event) {
    this.file = event.target.files[0];
  }

  createProduct(data) {
    var file = this.file;
    var that = this;
    const reader = new FileReader(); 
    reader.onloadend = function() {
      var buf = Buffer1.from(reader.result);
      ipfs.files.add(buf).then((response)=>{
        const buf1 = Buffer1.from(data.descripton);
        ipfs.files.add(buf1).then((resp) => {
          LevelUp.deployed().then(function(i){
            i.addProductToStore(data.product_name, data.selectName, response[0].hash, resp[0].hash, data.Price, {from: web3.eth.accounts[0], gas: 440000})
            .then(function(f){
              console.log(f);
              that._productService.saveProductTxLogs(f.logs).subscribe(res => {
                console.log(res);
              });
            }).catch((e) =>{
              console.log("e >>>>>>>>>>>>>>>>>>>>>>>>>>>> addProductToStore");
              console.log(e)
            })
          }).catch((e) => {
              console.log("e >>>>>>>>>>>>>>>>>>>>>>>>>>>> deployed");
              console.log(e);
          })
        }).catch((err) => {
          console.log("err ?<<<<<<<<<<<<<<<<,");
          console.log(err);
        })
      }).catch((err) => {
        console.log("err >>>>>>>>>>>>>>>>>>>>>");
        console.log(err);
      })
    }
    reader.readAsArrayBuffer(file);
  }
}