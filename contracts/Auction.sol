pragma solidity ^0.4.11;

contract Auction {
  address public auctioneer;
  bool ended;

  bytes32 public itemName;
  uint public startTime;
  uint public duration; //days
  uint startBid; 
  uint limitBid; //threshold amount

  address public highestBidder;
  uint public highestBid;
  mapping(address => uint) pendingBid;

  event topBidIncreased(address bidder, uint amount);

  function Auction(bytes32 _itemName, uint _duration, uint _startBid, uint _limitBid) {
    auctioneer = msg.sender; //bid creator
    ended = false;
    startTime = now;
    itemName = _itemName;
    duration = _duration;
    startBid = _startBid;
    limitBid = _limitBid;
  }
  function bid() payable {
    require(!ended && now <= startTime + duration * 1 days); //check bid ended or expired
    require(msg.value > highestBid); //bid must be higher than current highest bid
    pendingBid[highestBidder] += highestBid; //incase of old pendingBid, adds up
    highestBid = msg.value;
    highestBidder = msg.sender;
    topBidIncreased(msg.sender, msg.value);
  }
  function withdraw() returns (bool) {
    var amount = pendingBid[msg.sender];
    pendingBid[msg.sender] = 0;
    if(!msg.sender.send(amount)){ //if send fails
      pendingBid[msg.sender] = amount;
      return false;
    }
    return true;
  }
  function end() {
    require(limitBid < highestBid); //should satisfy min bid amount
    ended = true;
  }
}