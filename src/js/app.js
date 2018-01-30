App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Ethereum browsers like Mist or Chrome with the MetaMask extension will inject their own web3 instances
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Pat.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PatArtifact = data;
      App.contracts.Pat = TruffleContract(PatArtifact);

      // Set the provider for our contract
      App.contracts.Pat.setProvider(App.web3Provider);

      return App.markPat();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handlePat);
  },

  markPat: function() {
    // In the outer function scope to be potentially accessed later
    var contractInstance;

    App.contracts.Pat.deployed().then(function(instance) {
      contractInstance = instance;

      return contractInstance.getPatters.call();
    }).then(function(patters) {
      console.log("received pats");
      console.log(patters);
      var i;

      for (i = 0; i < patters.length; i++) {
        if (patters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }

    }).catch(function(err) {
      console.log(err);
    });

  },

  handlePat: function(event) {
    event.preventDefault();

    var monkeyId = parseInt($(event.target).data('id'));

    var contractInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Pat.deployed().then(function(instance) {
        contractInstance = instance;

        return contractInstance.pat(monkeyId, {from: account});
      }).then(function(result) {
        console.log(result);

        return App.markPat();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
