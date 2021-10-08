import env from "react-dotenv";
var aes256 = require("aes256");

//the secret key used for encrypting and decrypting messages
var secret_key = env.SECRET_KEY;

//returns the encrypted text
export const to_Encrypt = (text) => {
  var encrypted = aes256.encrypt(secret_key, text);
  return encrypted;
};

export const to_Decrypt = (cipher) => {
  //decryped message is returned
//   console.log(cipher);
  var decrypted = aes256.decrypt(secret_key, cipher);
  return decrypted;
};
