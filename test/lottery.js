var Lottery = artifacts.require("./Lottery.sol");


/*rpc calls to advance last block timestamp and block number */

// advances timestamp of the last block
const increaseTime = function(addSeconds) {
    web3.currentProvider.send({
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [addSeconds],
        id: 0
    })
}

// mines one block
const mineOneBlock = function() {
     web3.currentProvider.send({
        jsonrpc: "2.0",
        method: "evm_mine",
        params: [],
        id: 0
    })
}

// mines multiple blocks
const mineBlocks = function (addBlocks) {
    var i;
    for(i = 0; i<addBlocks;i++){
        mineOneBlock();
    }
}
/*rpc calls to advance last block timestamp and block number*/

// buy three tickets, advance blocks, then reveal tickets, advance blocks and try get ticket and then getprice


contract('Lottery', function(accounts){

	it("full ticket purchase", function(){
		var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
		var number1 = "1";
		var number2 = "2";
		var number3 = "3";
		var lotteryBalanceFirst;
		var lotteryBalanceEnd;
		var instance;

		return Lottery.deployed().then(function(contract){
			instance = contract;
			return contract.getcontractbalance.call();
		}).then(function(balance){
			lotteryBalanceFirst = parseInt(balance);
			return instance.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(8,"finney")});
		}).then(function(result){
			return instance.getcontractbalance.call();
		}).then(function(balance){
			lotteryBalanceEnd = parseInt(balance);
			assert.equal(lotteryBalanceFirst + parseInt(web3.toWei(8,"finney")),lotteryBalanceEnd,"lottery balance should be 8 finneys more than the lottery balance before a full ticket sell");
		})

	});

});


contract('Lottery', function(accounts){

    it("full ticket revert", function(){
        var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;

        return Lottery.deployed().then(function(contract){
            return contract.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(7,"finney")});
        }).then(function (result) {
            assert.fail("it should revert full ticket purchase when a sender sends not equal to 8 finney.");
        }, function (error) {
            console.log("Passed full ticket purchase revert test");
        })

    });

});



contract('Lottery', function(accounts){

    it("half ticket purchase", function(){
        var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;
        var lotteryBalanceFirst;
        var lotteryBalanceEnd;
        var instance;

        return Lottery.deployed().then(function(contract){
            instance = contract;
            return contract.getcontractbalance.call();
        }).then(function(balance){
            lotteryBalanceFirst = parseInt(balance);
            return instance.buyhalfticket(ticketHash,{from:accounts[0],value:web3.toWei(4,"finney")});
        }).then(function(){
            return instance.getcontractbalance.call();
        }).then(function(balance){
            lotteryBalanceEnd = parseInt(balance);
            assert.equal(lotteryBalanceFirst + parseInt(web3.toWei(4,"finney")),lotteryBalanceEnd,"lottery balance should be 4 finneys more than the lottery balance before a half ticket sell");
        })

    });

});

contract('Lottery', function(accounts){

    it("half ticket revert", function(){
        var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;

        return Lottery.deployed().then(function(contract){
            return contract.buyhalfticket(ticketHash,{from:accounts[0],value:web3.toWei(3,"finney")});
        }).then(function (result) {
            assert.fail("it should revert half ticket purchase when a sender sends not equal to 4 finney.");
        }, function (error) {
            console.log("Passed half ticket purchase revert test");
        })

    });

});



contract('Lottery', function(accounts){

    it("half ticket purchase", function(){
        var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;
        var lotteryBalanceFirst;
        var lotteryBalanceEnd;
        var instance;

        return Lottery.deployed().then(function(contract){
            instance = contract;
            return contract.getcontractbalance.call();
        }).then(function(balance){
            lotteryBalanceFirst = parseInt(balance);
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function(){
            return instance.getcontractbalance.call();
        }).then(function(balance){
            lotteryBalanceEnd = parseInt(balance);
            assert.equal(lotteryBalanceFirst + parseInt(web3.toWei(2,"finney")),lotteryBalanceEnd,"lottery balance should be 2 finneys more than the lottery balance before a quarter ticket sell");
        })

    });

});

contract('Lottery', function(accounts){

    it("quarter ticket revert", function(){
        var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;

        return Lottery.deployed().then(function(contract){
            return contract.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(1,"finney")});
        }).then(function (result) {
            assert.fail("it should revert quarter ticket purchase when a sender sends not equal to 2 finney.");
        }, function (error) {
            console.log("Passed quarter ticket purchase revert test");
        })

    });

});




contract("Lottery", function(accounts){

    it("reveal ticket revert at purchase stage after buying it in the first lottery", function(){
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;
        var instance;
        var ticketHash;

        return Lottery.deployed().then(function (contract) {
            instance = contract;
            return instance.gethash.call(number1,number2,number3,{from:accounts[0]});
        }).then(function (hash) {
            ticketHash = hash;
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            return instance.revealticket.call(number1,number2,number3,{from:accounts[0]});
        }).catch(function (error) {
            if(error.toString().indexOf("revert") == -1){
                assert.fail("it should revert reveal at purchase stage")
            }else{
                console.log("passed")
            }
        })

    });

});

contract('Lottery', function(accounts){

    it("reval ticket with correct numbers after ticket purchase", function(){
        var ticketHash;
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;
        var instance;

        return Lottery.deployed().then(function(contract){
            instance = contract;
            return contract.getcontractbalance.call();
        }).then(function(){
            return instance.gethash.call(number1,number2,number3,{from:accounts[0]});
        }).then(function(hash){
            ticketHash = hash;
            return instance.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(8,"finney")});
        }).then(function(){
            return instance.buyhalfticket(ticketHash,{from:accounts[0],value:web3.toWei(4,"finney")});
        }).then(function(){
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            console.log(web3.eth.blockNumber);
            mineBlocks(52-web3.eth.blockNumber);
            console.log(web3.eth.blockNumber);
            //update lottery
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            return instance.revealticket.call(number1,number2,number3,{from:accounts[0]});
        }).then(function (val) {
            console.log(val);
            assert.isTrue(val,"it should reveal ticket with correct numbers in reveal stage")
        })


    });
});



contract('Lottery', function(accounts){

    it("reval ticket returns false with incorrect numbers after ticket purchase", function(){
        var ticketHash;
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;
        var instance;

        return Lottery.deployed().then(function(contract){
            instance = contract;
            return contract.getcontractbalance.call();
        }).then(function(){
            return instance.gethash.call(number1,number2,number3,{from:accounts[0]});
        }).then(function(hash){
            ticketHash = hash;
            return instance.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(8,"finney")});
        }).then(function(){
            return instance.buyhalfticket(ticketHash,{from:accounts[0],value:web3.toWei(4,"finney")});
        }).then(function(){
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            console.log(web3.eth.blockNumber);
            mineBlocks(52-web3.eth.blockNumber);
            console.log(web3.eth.blockNumber);
            //update lottery
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            return instance.revealticket.call(2,11,67,{from:accounts[0]});
        }).then(function (result) {
            console.log(result);
            assert.isFalse(result,"it should not reveal ticket with incorrect numbers in reveal stage")
        })


    });
});


contract('Lottery', function(accounts){

    it("get price if user won a prize before", function(){
        var ticketHash;
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;
        var contractBalanceFirst;
        var contractBalanceEnd;
        var instance;

        return Lottery.deployed().then(function(contract){
            instance = contract;
            contractBalanceFirst = parseInt(web3.eth.getBalance(instance.address));
            return instance.gethash.call(number1,number2,number3,{from:accounts[0]});
        }).then(function(hash){
            ticketHash = hash;
            return instance.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(8,"finney")});
        }).then(function(){
            return instance.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(8,"finney")});
        }).then(function(){
            return instance.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(8,"finney")});
        }).then(function () {
            console.log(web3.eth.blockNumber);
            mineBlocks(52-web3.eth.blockNumber);
            console.log(web3.eth.blockNumber);
            //update lottery
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            return instance.revealticket(number1,number2,number3,{from:accounts[0]});
        }).then(function () {
            return instance.revealticket(number1,number2,number3,{from:accounts[0]});
        }).then(function () {
            return instance.revealticket(number1,number2,number3,{from:accounts[0]});
        }).then(function () {
            console.log(web3.eth.blockNumber);
            mineBlocks(102-web3.eth.blockNumber);
            console.log(web3.eth.blockNumber);
            // update lottery and determine winners
            return instance.revealticket(number1,number2,number3,{from:accounts[0]});
        }).then(function () {
            return instance.getprice({from:accounts[0]});
        }).then(function () {
            contractBalanceEnd = parseInt(web3.eth.getBalance(instance.address));
            assert.equal(contractBalanceFirst,parseInt(web3.toWei(0,"finney")),"at the start of the lottery contract balance should be 0");
            assert.equal(contractBalanceEnd-contractBalanceFirst,parseInt(web3.toWei(5,"finney")),"at the end of the lottery contract balance should be less three prizes' total value.");
        })


    });
});


contract('Lottery', function(accounts){

    it("cannot get price if user did not a prize before", function(){
        var ticketHash;
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;
        var contractBalanceFirst;
        var contractBalanceEnd;
        var instance;

        return Lottery.deployed().then(function(contract){
            instance = contract;
            contractBalanceFirst = parseInt(web3.eth.getBalance(instance.address));
            return instance.gethash.call(number1,number2,number3,{from:accounts[0]});
        }).then(function(hash){
            ticketHash = hash;
            return instance.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(8,"finney")});
        }).then(function(){
            return instance.buyhalfticket(ticketHash,{from:accounts[0],value:web3.toWei(4,"finney")});
        }).then(function(){
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            console.log(web3.eth.blockNumber);
            mineBlocks(52-web3.eth.blockNumber);
            console.log(web3.eth.blockNumber);
            //update lottery
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            return instance.revealticket(number1,number2,number3,{from:accounts[0]});
        }).then(function () {
            return instance.revealticket(number1,number2,number3,{from:accounts[0]});
        }).then(function () {
            return instance.revealticket(number1,number2,number3,{from:accounts[0]});
        }).then(function () {
            console.log(web3.eth.blockNumber);
            mineBlocks(102-web3.eth.blockNumber);
            console.log(web3.eth.blockNumber);
            // update lottery and determine winners
            return instance.revealticket(number1,number2,number3,{from:accounts[0]});
        }).then(function () {
            return instance.getprice({from:accounts[1]});
        }).then(function (result) {
            assert.fail("it should revert getting price if user did not have any balance");
        }, function (error) {
            console.log("passed");
        })


    });
});


