var Auction = artifacts.require('Auction');

contract('Auction', function(accounts) {
  it("should assert true", function(done) {
    var auction = Auction.deployed();
    assert.isTrue(true);
    done();
  });
  it('should take bids', function(done) {
    var auction; //Auction instance
    var bidderAddress = web3.eth.accounts[0];
    var bid = web3.toWei(0.1,"ether");
    var currentHighestBid, currentHighestBidder;

    Auction.deployed()
    .then(function (instance) { //send transaction
      auction = instance;
      return instance.bid.sendTransaction({value: bid, from: bidderAddress});
    })
    .then(function () { //
      return auction.highestBid.call();
    })
    .then(function (highestBid) {
      currentHighestBid = highestBid.toNumber();
      return auction.highestBidder.call();
    })
    .then(function (highestBidder) {
      currentHighestBidder = highestBidder;
      assert.equal(currentHighestBidder, bidderAddress, "address of highestBidder donot match");
      assert.equal(currentHighestBid, bid, "bid amount error");
      done();
    });
  });
  it('should send ether back on withdraw', function (done) {
    var auction;
    var balanceBefore;

    Auction.deployed()
    .then(function (instance) { //send transaction
      auction = instance;
      //bid 2 higher than
      return instance.bid.sendTransaction({value: web3.toWei(0.2,"ether"), from: web3.eth.accounts[1]});
    })
    .then(function () {
      balanceBefore = web3.eth.getBalance(web3.eth.accounts[0]).toNumber();
      //withdraw bid
      return auction.withdraw({from: web3.eth.accounts[0]});
    })
    .then(function (tx) {
      var gasUsed = tx.receipt.gasUsed;
      var gasPrice = web3.eth.getTransaction(tx.tx).gasPrice.toNumber();   
      var gasCost = gasUsed * gasPrice;
      var balanceAfter = balanceBefore + +web3.toWei(0.1,"ether") - gasCost;
      assert.equal(web3.eth.getBalance(web3.eth.accounts[0]).toNumber(), balanceAfter, "balance doesnt match calculated balance");
      done();
    });
  });
});
