
import * as userModel from './../models/user';
export class userHelper{


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
