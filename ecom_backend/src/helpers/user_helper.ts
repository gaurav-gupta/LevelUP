
import * as userModel from './../models/user';
export class userHelper{

  getUserByWalletAddress(args) {
   try {
     console.log(args);
     userModel.getUser({wallet_address: args.buyer}).then((user:any) => {
       console.log(user)
       if(user.length > 0){
         this.updateUserToken(user[0], parseInt(args._balanceTokens));
       }else{
        throw new Error("User not exists");
       }
     }).catch((err) => {
       throw new Error(err);
     })
   } catch(e) {
     throw new Error(e);
   }
 }

  updateUserToken(user, token){
    try{
      user.wallet_amount = token;
      userModel.updateUser({email: user.email}, user).then(function(user){
        console.log(user)
      }).catch((err) => {
        throw new Error(err);
      })
    }catch(e){
      throw new Error(e);
    }
  }


}
