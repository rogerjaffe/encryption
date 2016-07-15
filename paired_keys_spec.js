describe("Encryption functions", function() {
  var keysFcns = keys(true);

  // beforeEach(function() {
  //   keysFcns = keys(true);
  // });

  describe("calculate_primes", function() {

    it('should return primes between 100 and 300', function() {
      expect(keysFcns.calculate_primes(100, 300)).toEqual(
        [101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293]
      );
    });
    it('should return primes between 1 and 50', function() {
      expect(keysFcns.calculate_primes(1,50)).toEqual([2,3,5,7,11,13,17,19,23,29,31,37,41,43,47])
    });

  });

  describe("factor", function() {

    it('should factor 25 into [5]', function() {
      expect(keysFcns.factor(25)).toEqual([5]);
    });
    it('should factor 24 into [2, 3, 4, 8, 12]', function() {
      expect(keysFcns.factor(24)).toEqual([2, 3, 4, 6, 8, 12]);
    });
    it('should factor 144 into [2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 36, 48, 72]', function() {
      expect(keysFcns.factor(144)).toEqual([2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 36, 48, 72]);
    });
  });

  describe("prime_factors", function() {

    it('should factor 25 into [5,5]', function() {
      expect(keysFcns.prime_factors(25)).toEqual([5,5]);
    });
    it('should factor 24 into [2, 2, 2, 3]', function() {
      expect(keysFcns.prime_factors(24)).toEqual([2, 2, 2, 3]);
    });
    it('should factor 144 into [2, 2, 2, 2, 3, 3]', function() {
      expect(keysFcns.prime_factors(144)).toEqual([2, 2, 2, 2, 3, 3]);
    });
    it('should factor 686 into [2, 7, 7, 7]', function() {
      expect(keysFcns.prime_factors(686)).toEqual([2, 7, 7, 7]);
    });
  });

  describe("get_primes - repeat 10 times", function() {
    var fail = false;
    for (var i=0; i<10; i++) {
      var primes = keysFcns.get_primes();
      fail = fail || (keysFcns.factor(primes[0]).length > 0);
      fail = fail || (keysFcns.factor(primes[1]).length > 0);
      fail = fail || (primes[0] == primes[1]);
    };
    it('generate 10 sets of primes, none should have factors and they should not be equal', function() {
      expect(fail).toBeFalsy();
    });
  });

  describe("make_keys_from_primes", function() {
    it('check that the key-pair created from 13,19 has the same modulus and that d * e != 1', function() {
      var kp = keysFcns.make_keys_from_primes(13,19);
      expect(kp[0][0]).toEqual(kp[1][0]);
      expect(kp[0][1] * kp[1][1] == 1).toBeFalsy();
    });
    it('check that the key-pair created from 263,107 has the same modulus and that d * e != 1', function() {
      var kp = keysFcns.make_keys_from_primes(263,107);
      expect(kp[0][0]).toEqual(kp[1][0]);
      expect(kp[0][1] * kp[1][1] == 1).toBeFalsy();
    });
  });

  describe("make_keys", function() {
    it('check that the key-pair has the same modulus and that d * e != 1', function() {
      var kp = keysFcns.make_keys();
      expect(kp[0][0]).toEqual(kp[1][0]);
      expect(kp[0][1] * kp[1][1] == 1).toBeFalsy();
    });
    it('check that the key-pair has the same modulus and that d * e != 1', function() {
      var kp = keysFcns.make_keys();
      expect(kp[0][0]).toEqual(kp[1][0]);
      expect(kp[0][1] * kp[1][1] == 1).toBeFalsy();
    });
  });

  describe("crypt_number", function() {
    it('check encryption on single number sequence 12345', function() {
      expect(keysFcns.crypt_number([43657,23],12345)).toEqual(43067);
    });
    it('check encryption on single number sequence 13579', function() {
      expect(keysFcns.crypt_number([43657,23],13579)).toEqual(7273);
    });
    it('check encryption on single number sequence 3579', function() {
      expect(keysFcns.crypt_number([43657,23],3579)).toEqual(43649);
    });
  });

  describe("letter_to_number", function() {
    it("'a' -> 71", function() {
      expect(keysFcns.letter_to_number('a')).toEqual(71);
    });
    it("'z' -> 96", function() {
      expect(keysFcns.letter_to_number('z')).toEqual(96);
    });
    it("'A' -> 39", function() {
      expect(keysFcns.letter_to_number('A')).toEqual(39);
    });
    it("'$' -> 10", function() {
      expect(keysFcns.letter_to_number('$')).toEqual(10);
    });
  });

  describe("letters_to_numberstring", function() {
    it("'Roger' -> '5685777588'", function() {
      expect(keysFcns.letters_to_numberstring('Roger')).toEqual('5685777588');
    });
    it("'Now is the time' -> '528593067989069078750690798375'", function() {
      expect(keysFcns.letters_to_numberstring('Now is the time')).toEqual('528593067989069078750690798375');
    });
  });

  describe('numerize', function() {
    it("roger jaffe -> '0688-8577-7588-0680-7176-7675'", function() {
      expect(keysFcns.numerize('roger jaffe')).toEqual('0688-8577-7588-0680-7176-7675');
    });
    it("Now is the time -> '0652-8593-0679-8906-9078-7506-9079-8375'", function() {
      expect(keysFcns.numerize('Now is the time')).toEqual('0652-8593-0679-8906-9078-7506-9079-8375');
    });
    it("Special characters !@#$%^&*()+}{| -> '0657-8675-7379-7182-0673-7871-8871-7390-7588-8906-0738-0910-1168-1216-1415-1799-9798'", function() {
      expect(keysFcns.numerize('Special characters !@#$%^&*()+}{|')).toEqual('0657-8675-7379-7182-0673-7871-8871-7390-7588-8906-0738-0910-1168-1216-1415-1799-9798');
    });
  });

  describe('denumerize', function() {
    it("'0688-8577-7588-0680-7176-7675' -> 'roger jaffe'", function() {
      expect(keysFcns.denumerize('0688-8577-7588-0680-7176-7675')).toEqual('roger jaffe');
    });
    it("'0652-8593-0679-8906-9078-7506-9079-8375' -> Now is the time", function() {
      expect(keysFcns.denumerize('0652-8593-0679-8906-9078-7506-9079-8375')).toEqual('Now is the time');
    });
    it("'0657-8675-7379-7182-0673-7871-8871-7390-7588-8906-0738-0910-1168-1216-1415-1799-9798' -> Special characters !@#$%^&*()+}{|", function() {
      expect(keysFcns.denumerize('0657-8675-7379-7182-0673-7871-8871-7390-7588-8906-0738-0910-1168-1216-1415-1799-9798')).toEqual('Special characters !@#$%^&*()+}{|');
    });
  });

  describe("use_key", function() {
    console.log('----------------');
    var generateMsg = function(length, chunkSize) {
      var msg = '';
      for (i=0; i<length; i++) {
        for (j=0; j<chunkSize; j++) {
          msg += parseInt(Math.random()*10);
        }
        if (i+1 < length) {
          msg += '-';
        };
      }
      return msg;
    }
    describe('generates 10 random key-pairs & messages, encrypts, the decrypts the single number sequence', function() {
      for(var q=0; q<10; q++) { 
        (function(idx) {
          var keys = keysFcns.make_keys();
          var msg = generateMsg(parseInt(Math.random()*19+1), 4);
          // console.log(msg);
          it('Iteration '+q+': keys:('+keys[0][0]+','+keys[0][1]+'),('+keys[1][0]+','+keys[1][1]+'), msg:'+msg, function() {
            var encrypt = keysFcns.use_key(keys[0], msg, 4);
            var decrypt = keysFcns.use_key(keys[1], encrypt, 4);
            var txt = '['+keys[0]+','+keys[1]+'] msg:'+msg+' encrypt:'+encrypt+' decrypt:'+decrypt;
            txt += (msg == decrypt) ? ' pass' : ' fail';
            expect(decrypt).toEqual(msg);
          });
        })(q);
      }
    });
  })

});
