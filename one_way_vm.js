$(document).ready(function() {
  var rsa = keys();

  // View model for KnockoutJS
  var vm = {
    keys: ko.observableArray(rsa.make_keys()),
    message: ko.observable(''),
    sentMessage: ko.observable(''),
    newKeyClick: function() {
      vm.keys(rsa.make_keys());
    }
  }
  window.vm = vm;

  var makeKeyText = function(key) {
    if (key[0]) {
      return "(modulus, key) <br/> ("+R.join(', ', key)+")";
    } else {
      return 'No key';
    }
  }
  vm.key1Text = ko.computed(function() {
    console.log(vm.keys());
    return makeKeyText(vm.keys()[0])
  }, vm);
  // vm.key2Text = ko.computed(function() {
  //   console.log(vm.keys());
  //   return makeKeyText(vm.keys()[1])
  // }, vm);

  vm.numerizedMessage = ko.computed(function() {
    if (this.message().length>0) {
      return rsa.numerize(this.message());
    } else {
      return '';
    }
  }, vm);
  vm.encryptedMessage = ko.computed(function() {
    if (vm.numerizedMessage() == '') {
      return '';
    } else {
      return rsa.use_key(vm.keys()[0], vm.numerizedMessage())
    }
  }, vm);

  vm.encryptedMsg = ko.computed(function() {
    return vm.encryptedMessage();
  }, vm);    
  // vm.decryptedNumerizedMsg = ko.computed(function() {
  //   if (vm.sentMessage() == '') {
  //     return '';
  //   } else {
  //     return rsa.use_key(vm.keys()[1], vm.sentMessage());
  //   }
  // }, vm);
  // vm.plainText = ko.computed(function() {
  //   if (vm.decryptedNumerizedMsg() == '') {
  //     return '';
  //   } else {
  //     return rsa.denumerize(vm.decryptedNumerizedMsg());
  //   }
  // }, vm);
  vm.enterKeyClick = function() {
    bootbox.dialog({
      message: $('.enter-key-dlg').html(),
      title: 'Enter public/private keys',
      buttons: {
        ok: {
          label: 'OK',
          className: 'btn-primary',
          callback: function() {
            var mod1 = parseInt($('#publicModulus','.bootbox').val());
            var publicKey = parseInt($('#publicKey','.bootbox').val());
            var publicKey = [mod1,publicKey];
            var msg = "test message";
            var encrypt = rsa.use_key(publicKey, rsa.numerize(msg));
            vm.keys([publicKey]);
          }
        },
        cancel: {
          label: 'Cancel',
          className: 'btn-primary'
        }
      }
    });
  }

  window.k = keys();
  ko.applyBindings(vm, document.getElementById('container'));
});

