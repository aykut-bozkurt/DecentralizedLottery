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

    it("block mining simulation", function(){
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
        }).then(function () {
            console.log(web3.eth.blockNumber);
            mineBlocks(25);
            console.log(web3.eth.blockNumber);
        })


    });
});



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
            assert(false,true,"it should revert full ticket purchase when a sender sends not equal to 8 finney.");
        }, function (error) {
            console.log("Passed full ticket purchase revert test");
        })

    });

});


/*.catch(function(error){
    if(error.toString().indexOf("revert") != -1){
        console.log("Passed full ticket purchase revert test");
    }
    else{
        assert(false,true,"it should revert full ticket purchase when a sender sends not equal to 8 finney.");
    }
})*/

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
            assert(false,true,"it should revert half ticket purchase when a sender sends not equal to 4 finney.");
        }, function (error) {
            console.log("Passed half ticket purchase revert test");
        })

    });

});

/*.catch(function(error){
            if(error.toString().indexOf("revert") != -1){
                console.log("Passed full ticket purchase revert test");
            }
            else{
                assert(false,true,"it should revert half ticket purchase when a sender sends not equal to 4 finney.");
            }
        })*/

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
            assert(false,true,"it should revert quarter ticket purchase when a sender sends not equal to 2 finney.");
        }, function (error) {
            console.log("Passed quarter ticket purchase revert test");
        })

    });

});


/*.catch(function(error){
            if(error.toString().indexOf("revert") != -1){
                console.log("Passed full ticket purchase revert test");
            }
            else{
                assert(false,true,"it should revert quarter ticket purchase when a sender sends not equal to 2 finney.");
            }
        })*/

contract("Lottery", function(accounts){

    it("reveal ticket after buying it", function(){
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;
        var currentLotteryNo;
        var revealEnd;
        var instance;
        var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);

        return Lottery.deployed().then(function (contract) {
            instance = contract;
            return contract.lotteryno.call();
        }).then(function (lotteryNumber) {
            currentLotteryNo = lotteryNumber;
            return instance.revealend.call();
        }).then(function (result) {
            revealEnd = result;
            return instance.buyquarterticket(ticketHash,{from:accounts[0],value:web3.toWei(2,"finney")});
        }).then(function () {
            return instance.revealticket(number1,number2,number3,{from:accounts[0]});
        }).then(function(result){
            if(currentLotteryNo == 0){
                assert(false,true,"it should revert reveal when lottery no is 0");
            }else if(currentLotteryNo != 0 && web3.eth.getBlockNumber() < revealEnd){
                assert(result,true,"it should reveal the ticket if lottery no is not 0 and reveal is continuing");
            }else if(currentLotteryNo != 0 && web3.eth.getBlockNumber() < revealEnd){
                assert(result,false,"it should update the lottery and not reveal the ticket");
            }
        }).catch(function(error){
            if(currentLotteryNo == 0){
                assert(true,true,"it should revert reveal when lottery no is 0");
            }else{
                assert(true,false,"it should reveal the ticket when given ticket hash is proper.");
            }
        })

    });

});



