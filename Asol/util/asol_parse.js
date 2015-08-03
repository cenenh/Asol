
exports.phoneParsing = function phoneNumberParsing(phoneNumber){
  var result = "";
  if(phoneNumber.length > 11){
    temp_phone_arr = phoneNumber.split("-");
    for(i in temp_phone_arr){
      result = result + temp_phone_arr[i];
    }
    return result;
  }
  else{
    return phoneNumber;
  }
}
