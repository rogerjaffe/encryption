const R = require('ramda');

/** Port of public key encryption functions written originally in Python
 * for CSE section 2.1.5.
 * JS version used for APCSP section 2.2D
 *
 * Defines 13 functions for understanding RSA encryption.
 * numerize() and denumerize(),
 * make_keys() and use_key() are intended to be called in a
 * functional programming paradigm. The other functions are helpers.
 * Set up paired_key functions.  Ported from Python code
 * in CSE course, section 2.1.5
 *
 * @returns {{make_keys: (function(): [[number, number], [number, number]]), use_key: (function(*=, *=, *): (function(): *)|(function(*): *)|(function(*, *): *)|(function(*, *, *): *)|(function(*, *, *, *): *)|(function(*, *, *, *, *): *)|(function(*, *, *, *, *, *): *)|(function(*, *, *, *, *, *, *): *)|(function(*, *, *, *, *, *, *, *): *)|(function(*, *, *, *, *, *, *, *, *): *)|(function(*, *, *, *, *, *, *, *, *, *): *)), denumerize: (function(*): string), numerize: (function(*, *=): string)}|{letter_to_number: (function(*)), letters_to_numberstring: (function(*): string), make_keys_from_primes: (function(*, *): [[number, number], [number, number]]), calculate_primes: (function(*, *): number[]), get_primes: (function(*=, *=): [(number), (number)]), denumerize: (function(*): string), make_keys: (function(): [[number, number], [number, number]]), number_to_letter: (function(*): string), use_key: (function(*=, *=, *): (function(): *)|(function(*): *)|(function(*, *): *)|(function(*, *, *): *)|(function(*, *, *, *): *)|(function(*, *, *, *, *): *)|(function(*, *, *, *, *, *): *)|(function(*, *, *, *, *, *, *): *)|(function(*, *, *, *, *, *, *, *): *)|(function(*, *, *, *, *, *, *, *, *): *)|(function(*, *, *, *, *, *, *, *, *, *): *)), crypt_number: (function(*, *): number), factor: (function(*=): *[]), numerize: (function(*, *=): string), prime_factors: (function(*=): *[])}}
 * @constructor
 */
function Keys() {
  // Functions for prime numbers
  // Return a list of all primes between minimum and maximum
  let calculate_primes = function(minimum, maximum) {
    let primes = [2,3,5,7]            // initialize the list with the first few primes
    for (let new_number=11; new_number<maximum+1; new_number+=2) {
      let is_prime = true;
      for (let idx=0; idx<primes.length; idx++) {
        let test_prime = primes[idx];
        if (new_number % test_prime === 0) {
          is_prime = false;
        }
      }
      if (is_prime) {
        primes.push(new_number);
      }
    }
    let min_index = 0
    while (primes[min_index] < minimum) {
      min_index += 1;
    }
    return primes.slice(min_index);
  }

  // Returns a list of factors of 'a' other than 1 and a itself
  let factor = function(a) {
    let factors = [];
    // Test all numbers from 2 up to square root of a
    for (let i=2; i<Math.sqrt(a); i++) {
      // console.log(i)
      if (a % i === 0) {
        factors.push(i);
        factors.push(parseInt(a/i));
      }
    }
    // Include the square root if a is a perfect square
    if (Math.sqrt(a) - parseInt(Math.sqrt(a)) < 0.01) {
      factors.push(parseInt(Math.sqrt(a)));
    }
    return factors.sort(function(a,b) {return a-b;});
  }

  // Returns a list of prime factors of a
  let prime_factors = function(a) {
    let prime_factor_list = [];
    // Remove the factors of 2
    while (a % 2 === 0) {
      a = a/2;
      prime_factor_list.push(2);
    }
    let prime = false;
    while (!prime) {
      prime = true;
      for (let test=3; test<parseInt(Math.sqrt(a))+1; test+=2) {
        if (a % test === 0) {
          prime_factor_list.push(test);
          a /= test;
          prime = false;
          break;
        }
      }
    }
    prime_factor_list.push(a);
    return prime_factor_list;
  }

  // Returns two distinct prime numbers between minimum and maximum
  let get_primes = function(minimum, maximum) {
    minimum = (minimum) ? minimum : 100;
    maximum = (maximum) ? maximum : 300;
    let primes = calculate_primes(minimum, maximum);
    // Pick any two distinct prime numbers
    let p = primes[Math.floor(Math.random() * primes.length)];
    let q = primes[Math.floor(Math.random() * primes.length)];
    // Keep picking second prime until we have two distinct primes
    while (q === p) {
      q = primes[Math.floor(Math.random() * primes.length)];
    }
    return [p, q];
  }

  // Functions for RSA encryption
  //
  // Finds two integers d, e such that (d,pq) and (e,pq) are
  // paired RSA keys.  Returns an array of two pairs.
  // p and q are distinct prime numbers
  let make_keys_from_primes = function(p, q) {
    // Find n and phi
    // n is part of public and private keys
    // phi is used to find the other part of each key
    // n is the modulus; its length is the key length
    // eulers_phi is the number of positive integers 1 to n-1 that are
    // relatively prime to n
    let n = p * q;
    let eulers_phi = (p-1)*(q-1);

    // Find d and e, the other parts of the public and private keys
    // d*e = 1 (mod n) so find a pair of factors d*e = n+1 or 2n+1 or 3n+1 or...
    let product = eulers_phi+1;
    let d = 1, e = 1;
    while (d * e === 1) {
      let factors = factor(product);
      if (factors.length > 1) {
        // Remove the square root if its among the factors
        // since we need 2 distinct factors
        if (parseInt(Math.sqrt(product))*parseInt(Math.sqrt(product)) === product) {
          let idx = factors.indexOf(parseInt(Math.sqrt(product)));
          factors.splice(idx, 1);
        }
        // Pick one key
        d = factors[Math.floor(Math.random() * factors.length)];
        // Get the other key
        e = parseInt(product / d);
      }
      product += eulers_phi;    // Prepare for next iteration in case this one didn't factor
    }
    return [[n,d],[n,e]];
  }

  // Returns a pair of keys for RSA encryption
  // Each key is a 2-tuple of modulus, factor
  let make_keys = function() {
    let primes = get_primes();
    let keys = make_keys_from_primes(primes[0], primes[1]);
    return keys;
  }

  // Transforms a numeric message with the (n, d_or_e) key.
  // This is the inverse operation of using crypt_number() with the other key from
  // the same pair.
  let crypt_number = function(key, number_message) {
    // Return message ** d mod n
    // To reduce calculate time, compute message ** d one multiplication
    // at a time, taking modulus n each step'
    let n = key[0];
    let d_or_e = key[1];
    let new_number_message = 1;
    for (let i=0; i<d_or_e; i++) {
      new_number_message = (new_number_message * number_message) % n;
    }
    return new_number_message;
  }

  // Transforms a message with the (n, d_or_e) key.
  // This is the inverse operation of using use_key() with the other key
  // from the same pair.
  // The message should be a string of digits in groups separated by "-"
  let use_key = function(thisKey, number_message, chunk_size) {
    if (number_message.length === 0) return '';
    chunk_size = (chunk_size) ? chunk_size : 4;
    let n = thisKey[0];
    let d_or_e = thisKey[1];
    let output = [];
    let numbers = R.split('-', number_message);
    for (let i=0; i<numbers.length; i++) {
      let number = numbers[i];
      let crypted = crypt_number(thisKey, parseInt(number));
      let short = chunk_size - (''+crypted).length;
      for (let j=0; j<short; j++) {
        crypted = '0'+crypted;
      }
      output.push(crypted);
    }
    return R.join('-', output);
  }

  // Functions for turning a message into numbers and back to letters
  //
  // Turn one character into a number 01-99
  let letter_to_number = function(letter) {
    return letter.charCodeAt()-26;
  }


  // Returns a string of digits from a string of letters
  // two digits per letter
  let letters_to_numberstring = function(string) {
    let number = '';
    for (let i=0; i<string.length; i++) {
      let charToNumber = letter_to_number(string[i]);
      if (charToNumber < 10) {
        charToNumber = '0'+charToNumber;
      } else {
        charToNumber = ''+charToNumber;
      }
      // number *= 100;            // Shift the number over two decimal places
      number += charToNumber;
    }
    return number;
  }

  // Turns a string of characters into a string of digits
  // Each two decimal digits represents one character
  // The string is split into groups of letters, separated by "-".
  // chunk_size says how many letters are in each group.
  let numerize = function(string, chunk_size) {
    chunk_size = (chunk_size) ? chunk_size : 2;
    let numerized = '';
    // Make the string to be a multiple of chunk_size
    let extras = string.length % chunk_size;
    if (extras !== 0) {
      for (let i=0; i<(chunk_size-extras); i++) {
        string = ' '+string;
      }
    }
    while (string.length > 0) {
      if (numerized.length > 0) {
        numerized += "-";
      }
      let chunk = string.substring(0, chunk_size);
      string = string.substring(chunk_size);
      numerized += letters_to_numberstring(chunk);
    }
    return numerized;
  }

  // Turn one number 01-99 into one character
  let number_to_letter = function(number) {
    return String.fromCharCode(number+26);
  }

  // Reverses the effect of numerize(), turning a sequence of two-digit
  // numbers into characters, dropping the hyphens between digits.
  let denumerize = function(numberstring) {
    let string = '';
    while (numberstring.length > 0) {
      if (numberstring[0] === '-') {
        numberstring = numberstring.substring(1);
      } else {
        string += number_to_letter(parseInt(numberstring.substring(0, 2)));
        numberstring = numberstring.substring(2);
      }
    }
    return string.trim();
  }

  let toObject = keyPair => ({
    modulus: keyPair[0][0],
    key1: keyPair[0][1],
    key2: keyPair[1][1]
  });

  return {
    make_keys: make_keys,
    use_key: use_key,
    numerize: numerize,
    denumerize: denumerize
  }
}

export default Keys;
