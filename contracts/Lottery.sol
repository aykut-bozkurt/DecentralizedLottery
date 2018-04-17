pragma	solidity	^0.4.19;	

contract	Lottery	{	
    
    struct Ticket{
        address owner;
        uint256 value;
        bytes32 hashVal;
    }

    // constant ticket prices
    uint	constant	fullpay = 8 finney;
    uint	constant	halfpay = 4 finney;
    uint	constant	quarterpay = 2 finney;

    // constant block period
    uint	constant	blockperiod = 50;
    
    // flag to check if it is first purchase stage (1 if it is, else 0)
    uint public firstpurchase;
    
    // current lottery number
    uint public lotteryno;
    
    
    // winner numbers that are updated by xoring the numbers given by the buyer at reveal stage
	uint public winnernumber1;
	uint public winnernumber2;
	uint public winnernumber3;
	
    
    // lottery mapping that map lotteryno to another mapping that maps ticket hash given at purchase stage to ticket value
    mapping ( uint => mapping(address => Ticket[]) ) boughttickets;

    // holds winners' addresses
    mapping (address => uint) winners;    
    
    // revealed ticket list
    Ticket[] revealedtickets;
	
	// total number of revealed tickets for the lottery to be revealed next
	uint totalrevealed;
	
	// purchase end, reveal end time block numbers of lottery
	uint    public  buyend;
	uint	public	revealend;
	
	// start time block number of the contract
	uint    public  start;
	
	// current balances of lotteries
	uint[]  lotterybalance;
		
	//	constructor		
	function Lottery() public	{
	    firstpurchase = 1;
	    lotteryno = 0;
	    lotterybalance.push(0);
	    
	    start = block.number;
		buyend =	start +  blockperiod;
		revealend = buyend + blockperiod;
	}
	
	//buy full ticket
	function buyfullticket(bytes32 tickethash) public payable {
	    if(block.number < buyend){
	         if(msg.value == fullpay){
	             Ticket memory t;
	             t.owner = msg.sender;
	             t.value = 8 finney;
	             t.hashVal = tickethash;
	             boughttickets[lotteryno][msg.sender].push(t);
	             lotterybalance[lotteryno] += 8 finney;
	         }else{
	             revert();
	         }
	    }else{
	        // update lottery and try buying ticket in the next lottery
	        updatelottery();
	        buyfullticket(tickethash);
	    }
	}
	
	//buy half ticket
	function buyhalfticket(bytes32 tickethash) public payable {
	    if(block.number < buyend){
	         if(msg.value == halfpay){
	             Ticket memory t;
	             t.owner = msg.sender;
	             t.value = 4 finney;
	             t.hashVal = tickethash;
	             boughttickets[lotteryno][msg.sender].push(t);
	             lotterybalance[lotteryno] += 4 finney;
	         }else{
	             revert();
	         }
	    }else{
	        // update lottery and try buying ticket in the next lottery
	        updatelottery();
	        buyhalfticket(tickethash);
	    }
	}
	
	//buy quarter ticket
	function buyquarterticket(bytes32 tickethash) public payable {
	    if(block.number < buyend){
	         if(msg.value == quarterpay){
	             Ticket memory t;
	             t.owner = msg.sender;
	             t.value = 2 finney;
	             t.hashVal = tickethash;
	             boughttickets[lotteryno][msg.sender].push(t);
	             lotterybalance[lotteryno] += 2 finney;
	         }else{
	             revert();
	         }
	    }else{
	        // update lottery and try buying ticket in the next lottery
	        updatelottery();
	        buyquarterticket(tickethash);
	    }
	}



   //reveal ticket
   function revealticket(uint number1, uint number2, uint number3) public returns(bool) {
        uint blockNo = block.number;
        if( firstPurchaseEnded(blockNo) ){
            if(blockNo < revealend){

                 bytes32 hash = keccak256(number1,number2,number3,msg.sender);
	             uint totalticketsnotyetrevealed = boughttickets[lotteryno-1+firstpurchase][msg.sender].length;
	             if(totalticketsnotyetrevealed != 0){
	                
	                bool found = false;
	                for(uint i=0;i<totalticketsnotyetrevealed;i++){
	                    if(boughttickets[lotteryno-1+firstpurchase][msg.sender][i].hashVal == hash){
	                       revealedtickets.push(boughttickets[lotteryno-1+firstpurchase][msg.sender][i]);
	                       totalrevealed++;      
	                       // to prevent double reveal of the same ticket
	                       boughttickets[lotteryno-1+firstpurchase][msg.sender][i] = boughttickets[lotteryno-1+firstpurchase][msg.sender][totalticketsnotyetrevealed-1];
	                       boughttickets[lotteryno-1+firstpurchase][msg.sender].length--;
	                    
	                       found = true;
	                       winnernumber3 ^= number3;
                           winnernumber2 ^= number2;
	                       winnernumber1 ^= number1;
	                       break;
	                    }
	                }
	             
	                // if found is true, then user revealed a ticket(return true), else he did not have any purchased ticket to reveal(return false)
	                if(found){
	                    return true;
	                }else{
	                    return false;
	                }
	                
	                
	            }else{
	                // user has no purchased ticket
	                return false;
	            }

            }else{
                // previous lottery reveal stage has ended, so update lottery and maybe user wanted to reveal a ticket of the current lottery
	            updatelottery();
	            revealticket(number1,number2,number3);   
            }
            
        }else{
            // it is first lottery purchase time and reveal stage has not started yet, so revert
	        revert();
        }
       
	            
   }
   
  
  // get price if sender has balance greater than zero
  function getprice() public payable {
     uint amount = winners[msg.sender];
     if(amount != 0){
         if	(!msg.sender.send(amount))	{	
			 	revert();
		 }else{
		     winners[msg.sender] = 0;
		 }
     }else{
         revert();
     }
	  
  }
  

  // updates lottery times after finding winners of the lottery
  function updatelottery() private {

     //always update purchaseend time, but update revealend time only if the first lottery has already ended
     buyend += blockperiod;

     // push next lottery balance
     lotterybalance.push(0);

     uint blockNo = block.number;
     if(firstLotteryEnded(blockNo)){

        winnernumber1 = winnernumber1 % totalrevealed;
        winnernumber2 = winnernumber2 % totalrevealed;
        winnernumber3 = winnernumber3 % totalrevealed;

        //make sure that winner indexes are different
        if(winnernumber1 == winnernumber2){
           winnernumber2 = (winnernumber2 + 1) % totalrevealed;
        }
        if(winnernumber1 == winnernumber3){
           winnernumber3 =  (winnernumber3 + 2) % totalrevealed;
        }
        if(winnernumber2 == winnernumber3){
           winnernumber3 = (winnernumber3 + 1) % totalrevealed;
        }

        uint prize1 = 0;
        uint prize2 = 0;
        uint prize3 = 0;

        if(revealedtickets[winnernumber1].value == 8 finney){
            prize1 = lotterybalance[lotteryno-1+firstpurchase]/2;
        }else if(revealedtickets[winnernumber1].value == 4 finney){
            prize1 = lotterybalance[lotteryno-1+firstpurchase]/4;
        }else{
            prize1 = lotterybalance[lotteryno-1+firstpurchase]/8;
        }

        if(revealedtickets[winnernumber2].value == 8 finney){
            prize2 = lotterybalance[lotteryno-1+firstpurchase]/4;
        }else if(revealedtickets[winnernumber2].value == 4 finney){
            prize2 = lotterybalance[lotteryno-1+firstpurchase]/8;
        }else{
            prize2 = lotterybalance[lotteryno-1+firstpurchase]/16;
        }

        if(revealedtickets[winnernumber3].value == 8 finney){
            prize3 = lotterybalance[lotteryno-1+firstpurchase]/8;
        }else if(revealedtickets[winnernumber3].value == 4 finney){
            prize3 = lotterybalance[lotteryno-1+firstpurchase]/16;
        }else{
            prize3 = lotterybalance[lotteryno-1+firstpurchase]/32;
        }


        // give the price first winner if there are many winners with the same number
        winners[revealedtickets[winnernumber1].owner] += prize1;
        winners[revealedtickets[winnernumber2].owner] += prize2;
        winners[revealedtickets[winnernumber3].owner] += prize3;

        // update balance of the next lottery
        uint leftovermoney = lotterybalance[lotteryno-1+firstpurchase] - prize3 - prize2 - prize1;
        lotterybalance[lotteryno+firstpurchase] += leftovermoney;

        // delete revealed tickets to go next lottery reveal safe
        delete revealedtickets;
        delete totalrevealed;

        revealend += blockperiod;


     }


     // set firstpurchase 0 after first purchase ends
     if(firstpurchase == 1){
        firstpurchase = 0;
      }


     // update lottery number
     lotteryno++;

  }
   
  // returns true if first purchase stage has already ended; otherwise, returns false
  function firstPurchaseEnded(uint blockNo) private view returns(bool){
      return blockNo >= start + blockperiod;
  }
   
  // returns true if first lottery has already ended; otherwise, returns false
  function firstLotteryEnded(uint blockNo) private view returns(bool){
      return blockNo >= start + 2*blockperiod;
  }
   
   
  /*below methods are helpers when debug*/
  function gethash(uint i,uint j,uint k) public view returns(bytes32 retval){
      return keccak256(i,j,k,msg.sender);
  }
   
  function getBlockNo() public view returns(uint){
      return block.number;
  }
   
  function getcontractbalance() constant public returns(uint retval) {
      return address(this).balance;
  }
   

}	
