/*
Author: Matthew Lancaster
Date last updated: 4/17/23
Modularized Functions:
cardNum():
Checks for credit card validation through the use of the Luhn algorithm.
The Luhn algorithm is an error-checking algorithm supported by all major credit card networks used 
to verify each card numbers' length and validity. In this instance, it is checked using multiple Regex patterns.
Supports American Express (Amex/AmEx), Visa, Mastercard, Discover, Diners club, and JCB.
Regex also prevents anything outside of numbers.

cardExp():
Validates credit expiration in the format MM.YYYY.

cardCVC():
Validates credit CVC based on major credit card network determined by cardNum() function.
Also prevents anything that isn't a number.

These are modified functions from the frontend part of the application.
*/
export function cardNum(_creditCardNumber) {
  let cardno;
  let cardNoValid = false;
  //Validate card numbers' length and pattern using regex
  for (let i = 0; i < 6; ++i) {
    switch (i) {
      case 0: //American Express (Amex/AmEx)
        cardno = /^(?:3[47][0-9]{13})$/;
        if (_creditCardNumber.match(cardno)) {
          cardNoValid = true;
        }
        break;
      case 1: //Visa
        cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        if (_creditCardNumber.match(cardno)) {
          cardNoValid = true;
        }
        break;
      case 2: //Mastercard
        cardno = /^(?:5[1-5][0-9]{14})$/;
        if (_creditCardNumber.match(cardno)) {
          cardNoValid = true;
        }
        break;
      case 3: //Discover
        cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        if (_creditCardNumber.match(cardno)) {
          cardNoValid = true;
        }
        break;
      case 4: //Diners club
        cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
        if (_creditCardNumber.match(cardno)) {
          cardNoValid = true;
        }
        break;
      case 5: //JCB
        cardno = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
        if (_creditCardNumber.match(cardno)) {
          cardNoValid = true;
        }
        break;
    }
  }

  return cardNoValid;
}

//Validates credit expiration in the format MM.YYYY
export function cardExp(_creditExp) {
  let regExp = /^(0[1-9]|1[0-2])\.\d{4}$/;

  return regExp.test(_creditExp);
}

//Validates credit CVC based on major credit card network determined by cardNum() function; also prevents anything that isn't a number
export function cardCVC(_cvcCode, _creditCardType) {
  let valid = false;
  switch (_creditCardType) {
    case "Amex":
      if (_cvcCode.length == 4 && !isNaN(_cvcCode)) valid = true;
      break;
    case "Visa":
      if (_cvcCode.length == 3 && !isNaN(_cvcCode)) valid = true;
      break;
    case "Mastercard":
      if (_cvcCode.length == 3 && !isNaN(_cvcCode)) valid = true;
      break;
    case "Discover":
      if (_cvcCode.length == 3 && !isNaN(_cvcCode)) valid = true;
      break;
    case "Amex/Discover":
      if ((_cvcCode.length == 3 || _cvcCode.length == 4) && !_cvcCode.isNaN())
        valid = true;
      break;
  }

  return valid;
}
