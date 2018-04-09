var Lottery = artifacts.require("./Lottery.sol");

contract('Lottery', function(accounts){

	var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
	var number1 = 1;
	var number2 = 2;
	var number3 = 3;
	var contractAddress = "0xf400c673623a30f8c625095594dae935b4494e80";

	it("exactly 8 finney should be send to buy a full ticket", function(){		
		var lotteryBalanceFirst;
		var lotteryBalanceEnd; 
		
		return Promise.resolve(Lottery.at(contractAddress)).then(function(instance){
						return web3.eth.getBalance(contractAddress);
					}).then(function(balance){
						lotteryBalanceFirst = balance;
						return Lottery.at(contractAddress).buyfullticket.call(ticketHash,{from:accounts[0],value:web3.toWei(8,"finney")});
					}).then(function(){
						return web3.eth.getBalance(contractAddress);
					}).then(function(balance){
						lotteryBalanceEnd = balance;
						assert.equal(lotteryBalanceFirst + parseInt(web3.toWei(8,"finney")), lotteryBalanceEnd, "lottery balance should be 8 finney more than the lottery balance before a full ticket sold");							
					});
	});


	/*it("exactly 4 finney should be send to buy a half ticket", function(){	
		var lotteryBalanceFirst;
		var lotteryBalanceEnd; 
		
		return Lottery.at(contractAddress).then(function(instance){
						return web3.eth.getBalance(contractAddress);
					}).then(function(balance){
						lotteryBalanceFirst = balance;
						return Lottery.at(contractAddress).buyfullticket.call(ticketHash,{from:accounts[0],value:web3.toWei(4,"finney")});
					}).then(function(){
						return web3.eth.getBalance(contractAddress);
					}).then(function(balance){
						lotteryBalanceEnd = balance;
						assert.equal(lotteryBalanceFirst + parseInt(web3.toWei(4,"finney")), lotteryBalanceEnd, "lottery balance should be 4 finney more than the lottery balance before a half ticket sold");							
					});
	});	

	
	it("exactly 2 finney should be send to buy a quarter ticket", function(){
		var lotteryBalanceFirst;
		var lotteryBalanceEnd; 
		
		return Lottery.at(contractAddress).then(function(instance){
						return web3.eth.getBalance(contractAddress);
					}).then(function(balance){
						lotteryBalanceFirst = balance;
						return Lottery.at(contractAddress).buyfullticket.call(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
					}).then(function(){
						return web3.eth.getBalance(contractAddress);
					}).then(function(balance){
						lotteryBalanceEnd = balance;
						assert.equal(lotteryBalanceFirst + parseInt(web3.toWei(2,"finney")), lotteryBalanceEnd, "lottery balance should be 2 finney more than the lottery balance before a quarter ticket sold");							
					});
	});*/


});



