// Port of a rotation cypher function written originally in Python
// for CSE section 2.1.5.
// JS version used for APCSP section 2.2C
// 
$(document).ready(function () {
  // Self-calling function to set up the encrypt/decrypt functions
  // and the KnockoutJS view model and controls
  (function() {
    // Set up encrypt / decrypt functions
    var cryptoFcns = function(shifted) {
      // Convert character to ASCII code
      var getCharCode = function(char) {
        return char.charCodeAt(char);
      }

      // Convert ASCII code to character
      var getChar = function(code) {
        return String.fromCharCode(code);
      }

      // Execute the shift:
      // low:     Lowest character to shift
      // high:    Highest character to shift
      // n:       Number of characters to shift
      // encrypt: true->shift forward; false->shift backward
      // code:    Character code to shift
      var rotate = R.curry(function(low, high, n, encrypt, code) {
        var sign = (encrypt) ? 1 : -1;
        if ((low <= code) && (code <= high)) {
          var newVal = code + (sign * n);
          if (newVal < low) {
            newVal = high + (newVal - low+1);
          } else {
            if (newVal > high) {
              newVal = low + (newVal - high-1);
            }
          }
          return newVal;
        } else {
          return code;
        }
      });

      // ASCII codes of the low and high lowercase and uppercase characters
      var boundaries = {
        a: getCharCode('a'),
        z: getCharCode('z'),
        A: getCharCode('A'),
        Z: getCharCode('Z')      
      }

      // Define the functions to do the encryption and decryption
      // These are curried, so the only additional parameter needed
      // is the character code on which the operation will be done
      var encryptLowerCase = R.map(rotate(boundaries.a, boundaries.z, shifted, true));
      var encryptUpperCase = R.map(rotate(boundaries.A, boundaries.Z, shifted, true));
      var decryptLowerCase = R.map(rotate(boundaries.a, boundaries.z, shifted, false));
      var decryptUpperCase = R.map(rotate(boundaries.A, boundaries.Z, shifted, false));

      // Functions to break the input string into an array of character codes
      // and to put the array of character codes back into a string
      var charCodes = R.compose(R.map(getCharCode), R.split(''));
      var chars = R.compose(R.join(''), R.map(getChar));

      // Building the encrypt and decrypt functions
      // Curried function, the last parameter to send is the string to
      // be encrypted or decrypted
      var encrypt = R.compose(chars, encryptUpperCase, encryptLowerCase, charCodes);
      var decrypt = R.compose(chars, decryptUpperCase, decryptLowerCase, charCodes);

      return {
        encrypt:      encrypt,
        decrypt:      decrypt,
        getChar:      getChar,
        getCharCode:  getCharCode
      }
    }

    // Encrypt the alphabet to show the current shift
    // View model for KnockoutJS
    var vm = {
      enInput: ko.observable(''),
      deCipher: ko.observable(''),
      shifted: ko.observable(5),
      letters: ko.observable('')
    }

    var addPipe = R.compose(R.join(' | '), R.split(''));

    vm.shiftedText = ko.computed(function() {return "Current shift: "+this.shifted();}, vm);
    vm.crypto = ko.computed(function() {return cryptoFcns(vm.shifted())}, vm);
    vm.letters(R.join('', R.map(vm.crypto().getChar, R.range(vm.crypto().getCharCode('A'), vm.crypto().getCharCode('Z')+1))));
    vm.encryptedLetters = ko.computed(function() {
      return vm.crypto().encrypt(vm.letters());
    }, vm);
    vm.lettersText = ko.computed(function() {
      return addPipe(vm.letters());
    }, vm);
    vm.encryptedLettersText = ko.computed(function() {
      return addPipe(vm.encryptedLetters());
    })
    vm.shiftUp = function() {vm.shifted(Math.min(vm.shifted()+1, 26))};
    vm.shiftDown = function() {vm.shifted(Math.max(vm.shifted()-1, 0))};
    vm.shiftDownEnable = function() {return vm.shifted()>0;}

    vm.enCipher = ko.computed(function() {
      return vm.crypto().encrypt(vm.enInput()).replace(/\n/g,"<br/>");
    });
    vm.deInput = ko.computed(function() {
      return vm.crypto().decrypt(vm.deCipher()).replace(/\n/g,"<br/>");
    });

    ko.applyBindings(vm, document.getElementById('container'));
    window.vm = vm;
  })();
});
// # ciphers.py
// ''' ciphers.py provides a function for working with ciphers.
// '''

// def rotate(string,n):
//     '''Returns the ciphertext of string after it has been shited n letters.
    
//     Works on both upper and lower case letters. Other characters are unchanged.
//     '''    
//     output=''
//     for character in string:
//         #if lower case letter
//         if ord('a')<=ord(character)<=ord('z'): 
//             new_ord = ord(character) + n # shift by n
//             if new_ord>ord('z'): # wrap around the alphabet to the right
//                 new_ord -= 26
//             if new_ord<ord('a'): #wrap around the alphabet to the left
//                 new_ord += 26 
//             output += chr(new_ord)
//         #if upper case letter
//         elif ord('A')<=ord(character)<=ord('Z'): 
//             new_ord = ord(character) + n # shift by n
//             if new_ord>ord('Z'): # wrap around the alphabet to the right
//                 new_ord -= 26
//             if new_ord<ord('A'): #wrap around the alphabet to the left
//                 new_ord += 26
//             output += chr(new_ord)
//         else: #not a letter
//             output += character
//     return output

// def try_all_25(str):
//     """ Use brute force to crack a Caesar-like cipher.
//     """
//     for shift in range(1,26):
//         print(rotate(str,shift))
//                 