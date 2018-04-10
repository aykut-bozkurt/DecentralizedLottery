var Lottery = artifacts.require("./Lottery.sol");


contract('Lottery', function(accounts){

	it("exactly 8 finney should be send to buy a full ticket", function(){
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

    it("a value not equal to 8 finney should revert the full ticket purchase", function(){
        var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;

        return Lottery.deployed().then(function(contract){
            return contract.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(7,"finney")});
        }).catch(function(error){
            if(error.toString().indexOf("revert") != -1){
                console.log("Passed full ticket purchase revert test");
            }
            else{
                assert(false,true,"it should revert full ticket purchase when a sender sends not equal to 8 finney.");
            }
        })

    });

});


contract('Lottery', function(accounts){

    it("exactly 4 finney should be send to buy a half ticket", function(){
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

    it("a value not equal to 4 finney should revert the half ticket purchase", function(){
        var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;

        return Lottery.deployed().then(function(contract){
            return contract.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(3,"finney")});
        }).catch(function(error){
            if(error.toString().indexOf("revert") != -1){
                console.log("Passed full ticket purchase revert test");
            }
            else{
                assert(false,true,"it should revert half ticket purchase when a sender sends not equal to 4 finney.");
            }
        })

    });

});


contract('Lottery', function(accounts){

    it("exactly 2 finney should be send to buy a quarter ticket", function(){
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

    it("a value not equal to 2 finney should revert the half ticket purchase", function(){
        var ticketHash = web3.sha3(number1,number2,number3,accounts[0]);
        var number1 = 1;
        var number2 = 2;
        var number3 = 3;

        return Lottery.deployed().then(function(contract){
            return contract.buyfullticket(ticketHash,{from:accounts[0],value:web3.toWei(1,"finney")});
        }).catch(function(error){
            if(error.toString().indexOf("revert") != -1){
                console.log("Passed full ticket purchase revert test");
            }
            else{
                assert(false,true,"it should revert quarter ticket purchase when a sender sends not equal to 2 finney.");
            }
        })

    });

});



