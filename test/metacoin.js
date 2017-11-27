var MetaCoin = artifacts.require("./MetaCoin.sol");
var async = require('asyncawait/async');
var await = require('asyncawait/await');

contract('MetaCoin', function(accounts) 
{
  it("should put 10000 MetaCoin in the first account", function() {
    return MetaCoin.deployed().then(function(instance) {
      return instance.getBalance.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  });
  it("should call a function that depends on a linked library", function() {
    var meta;
    var metaCoinBalance;
    var metaCoinEthBalance;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;  
      return meta.getBalance.call(accounts[0]);
    }).then(function(outCoinBalance) {
      metaCoinBalance = outCoinBalance.toNumber();
      return meta.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      metaCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpeced function, linkage may be broken");
    });
  });

  it("should send coin correctly", function() {
    var meta;

    //    Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.sendCoin(account_two, amount, {from: account_one});
    }).then(function() {
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });

  //////////////////////////////////////////////////////////////////////////
  it.only("primary", function() {
  var token;
  return MetaCoin.deployed().then(function(instance){
    token = instance;
    //console.log(accounts[0]);
    //console.log(accounts[1]);
    token.getBalance.call(accounts[0]).then(function(result){
      console.log('Watch here.....................');
     console.log(result.toNumber());

      assert.equal(result.toNumber(), 10000, 'balance is wrong');
      //resolve();
    });
  })
});

var balance = async(()=> {
  var instance = await(MetaCoin.deployed());
  var balances = await(instance.getBalance(accounts[0]));
  assert.equal(balances.toNumber(), 10000, 'balance is wrong');
   console.log(typeof balances);
   console.log(balances);
  // resolve();
});

it.only("secondary",balance);  

  it("should put 10000 MetaCoin in the first account", async function() {
    let meta = await MetaCoin.deployed();
    let balance = await meta.getBalance.call(accounts[0]);
    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account")
  });

});