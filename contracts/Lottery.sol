pragma	solidity	^0.4.19;	

contract	Lottery	{	
    
    struct Ticket{
        address owner;
        uint256 value;
        bytes32 hashVal;
        bool revealed;
    }
    
    // current lottery number
    uint    public  lotteryno;
    
    
    // winner numbers that are updated by xoring the numbers given by the buyer at reveal stage
	uint    public  winnernumber1;
	uint    public  winnernumber2;
	uint    public  winnernumber3;
	
	// lottery mapping that map lotteryno to another mapping that maps ticket hash given at purchase stage to ticket value
    //mapping ( uint => mapping(bytes32 => uint) ) boughttickets;
    
    // lottery mapping that map lotteryno to another mapping that maps ticket hash given at purchase stage to ticket value
    mapping ( uint => mapping(address => Ticket[]) ) boughttickets;

    	// holds winners' addresses
	mapping (address => uint) winners;    
    
    // revealed ticket list
	Ticket[] revealedtickets;
	
	// total number of revealed tickets for the lottery to be revealed next
	uint totalrevealed;
	
	// constant ticket prices
	uint	constant	fullpay = 8 finney;
	uint	constant	halfpay = 4 finney;
	uint	constant	quarterpay = 2 finney;
	
	// purchase start, purchase end, reveal end times of lottery
	uint	public	start; 
	uint    public  buyend;
	uint	public	revealend;
	
	// current balances of lotteries
	uint[]  lotterybalance;

	
	function() public	{	
		revert();	
	}	
		
	//	constructor		
	function Lottery() public	{	
	    lotteryno = 0;
	    lotterybalance.push(0);
	    
		start	=	block.number;
		buyend =	start +  10;
		revealend = buyend + 10;
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
	        if(lotteryno != 0){
	            updatelottery();
	        }else{
	            start = buyend;
	            buyend += 10;
	            lotterybalance.push(0);
	            lotteryno++;
	        }
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
	        if(lotteryno != 0){
	            updatelottery();
	        }else{
	            start = buyend;
	            buyend += 10;
	            lotteryno++;
	        }
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
	        if(lotteryno != 0){
	            updatelottery();
	        }else{
	            start = buyend;
	            buyend += 10;
	            lotterybalance.push(0);
	            lotteryno++;
	        }
	        buyquarterticket(tickethash);
	    }
	}



   //reveal ticket
   function revealticket(uint number1, uint number2, uint number3) public returns(bool) {
        if( (lotteryno != 0 && block.number < revealend) ){
	         bytes32 hash = keccak256(number1,number2,number3,msg.sender);
	         uint totalticketsnotyetrevealed = boughttickets[lotteryno-1][msg.sender].length;
	         if(totalticketsnotyetrevealed != 0){
	                
	             bool flag = false;
	             for(uint i=0;i<totalticketsnotyetrevealed;i++){
	                 if(boughttickets[lotteryno-1][msg.sender][i].hashVal == hash && boughttickets[lotteryno-1][msg.sender][i].revealed == false){
	                    revealedtickets.push(boughttickets[lotteryno-1][msg.sender][i]);
	                    totalrevealed++;      
	                    // to prevent double reveal of the same ticket
	                    boughttickets[lotteryno-1][msg.sender][i].revealed = true;
	                    flag = true;
	                    winnernumber3 ^= number3;
                        winnernumber2 ^= number2;
	                    winnernumber1 ^= number1;
	                    break;
	                 }
	             }
	             // if flag is true, then user revealed a ticket, else he did not have any purchased ticket to reveal, so revert
	             if(flag){
	                 return true;
	             }else{
	                 revert();
	             }
	         }else{
	             revert();
	         }
	    }else{
	        /*if this is not the first lottery, then reveal end has reached and update lottery and return false because user missed reveal, 
	            else do not let him reveal because reveal time has not came yet, so revert*/
	        if(lotteryno != 0){
	            updatelottery();
	            return false;
	        }else{
	            revert();
	        }
	    }
   }
   
  
  //get price if sender has balance greater than zero
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
       //i assumed there were at least 3 participants in each lottery at the end
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
           prize1 = lotterybalance[lotteryno-1]/2;
       }else if(revealedtickets[winnernumber1].value == 4 finney){
           prize1 = lotterybalance[lotteryno-1]/4;
       }else{
           prize1 = lotterybalance[lotteryno-1]/8;
       }
       
       if(revealedtickets[winnernumber2].value == 8 finney){
           prize2 = lotterybalance[lotteryno-1]/4;
       }else if(revealedtickets[winnernumber2].value == 4 finney){
           prize2 = lotterybalance[lotteryno-1]/8;
       }else{
           prize2 = lotterybalance[lotteryno-1]/16;
       }
       
       if(revealedtickets[winnernumber3].value == 8 finney){
           prize3 = lotterybalance[lotteryno-1]/8;
       }else if(revealedtickets[winnernumber3].value == 4 finney){
           prize3 = lotterybalance[lotteryno-1]/16;
       }else{
           prize3 = lotterybalance[lotteryno-1]/32;
       }
    
       
       // give the price first winner if there are many winners with the same number
       winners[revealedtickets[winnernumber1].owner] += prize1;
       winners[revealedtickets[winnernumber2].owner] += prize2;
       winners[revealedtickets[winnernumber3].owner] += prize3;
       
       // update balance of the next lottery
       uint leftovermoney = lotterybalance[lotteryno-1] - prize3 - prize2 - prize1;
       lotterybalance[lotteryno] += leftovermoney;
       
       // delete revealed tickets to go next lottery reveal safe
       delete revealedtickets;
       delete totalrevealed;
       
       //update times
       start = buyend;
       buyend += 10;
       revealend += 10;
       
       // push next lottery balance and update lottery number
       lotterybalance.push(0);
       lotteryno++;
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
