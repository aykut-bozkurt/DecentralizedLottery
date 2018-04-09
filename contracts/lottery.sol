pragma	solidity	^0.4.19;	

contract	Lottery	{	
    
    struct Ticket{
        address owner;
        uint value;
    }
    
    // current lottery number
    uint    public  lotteryno;
    
    // whether next lottery is started or another
    bool nextstarted;
    
    // winner numbers that are updated by xoring the numbers given by the buyer at reveal stage
	uint    public  winnernumber1;
	uint    public  winnernumber2;
	uint    public  winnernumber3;
	
	// lottery mapping that map lotteryno to another mapping that maps ticket hash given at purchase stage to ticket value
    mapping ( uint => mapping(bytes32 => uint) ) boughttickets;

    	// holds winners' addresses
	mapping (address => uint) winners;    
    
    // revealed ticket list
	Ticket[100] revealedtickets;
	

	
	// total number of revealed tickets for the lottery to be revealed next
	uint totalrevealed;
	
	// total participants in lotteries
	uint[100]   totalparticipants;

	// constant ticket prices
	uint	constant	fullpay	= 8 finney;
	uint	constant	halfpay	= 4 finney;
	uint	constant	quarterpay = 2 finney;
	
	// purchase start, purchase end, reveal end times of lottery
	uint	public	start; 
	uint    public  buyend;
	uint	public	revealend;
	
	// current balances of lotteries
	uint[100]  lotterybalance;

	
	function()	{	
		throw	;		
	}	
		
	//	constructor		
	function	Lottery()	{	
	    lotteryno = 0;
	    
		start	=	block.number;
		buyend =	start +  20000;
		revealend = buyend + 20000;
	}
	
	//buy full ticket
	function buyfullticket(bytes32 tickethash) public payable {
	    if(block.number < buyend){
	         if(msg.value == fullpay){
	             boughttickets[lotteryno][tickethash] = 8 finney;
	             totalparticipants[lotteryno]++;
	             lotterybalance[lotteryno] += 8 finney;
	         }else{
	             throw;
	         }
	    }else{
	        startnewlottery();
	        buyfullticket(tickethash);
	    }
	}
	
	//buy half ticket
	function buyhalfticket(bytes32 tickethash) public payable {
	    if(block.number < buyend){
	         if(msg.value == halfpay){
	             boughttickets[lotteryno][tickethash] = 4 finney;
	             totalparticipants[lotteryno]++;
	             lotterybalance[lotteryno] += 4 finney;
	         }else{
	             throw;
	         }
	    }else{
	        startnewlottery();
	        buyhalfticket(tickethash);
	    }
	}
	
	//buy quarter ticket
	function buyquarterticket(bytes32 tickethash) public payable {
	    if(block.number < buyend){
	         if(msg.value == quarterpay){
	             boughttickets[lotteryno][tickethash] = 2 finney;
	             totalparticipants[lotteryno]++;
	             lotterybalance[lotteryno] += 2 finney;
	         }else{
	             throw;
	         }
	    }else{
	        startnewlottery();
	        buyquarterticket(tickethash);
	    }
	}



   //reveal ticket
   function revealticket(uint number1, uint number2, uint number3) public {
        if( (block.number - 20000) < revealend){
	         bytes32 hash = keccak256(number1,number2,number3,msg.sender);
	         uint currentlotteryno;
             if(nextstarted){
                 currentlotteryno = lotteryno-1;
             }else{
                 currentlotteryno = lotteryno;
             }
	         if(boughttickets[currentlotteryno][hash] != 0){
	             Ticket t;
	             if(boughttickets[currentlotteryno][hash] == 2 finney){
	                 t.owner = msg.sender;
	                 t.value = 2 finney;
	                 revealedtickets[totalrevealed] = t;
	                 winnernumber3 ^= number3;
	             }else if(boughttickets[currentlotteryno][hash] == 4 finney){
	                 t.owner = msg.sender;
	                 t.value = 4 finney;
	                 revealedtickets[totalrevealed] = t;
	                 winnernumber2 ^= number2;
	             }else{
	                 t.owner = msg.sender;
	                 t.value = 8 finney;
	                 revealedtickets[totalrevealed] = t;
	                 winnernumber1 ^= number1;
	             }
	             totalrevealed++;
	         }else{
	             throw;
	         }
	    }else{
	        endlottery();
	    }
   }
   
  
  //get price if sender has balance greater than zero
  function getprice() public payable {
        
     if(winners[msg.sender] != 0){
         if	(msg.sender.send(winners[msg.sender]))	{	
			 winners[msg.sender] = 0;	
		 }	
     }else{
         throw;
     }
	  
  }
  
  // get current balance of the contract
   function getcontractbalance() constant public returns(uint retval) {
       return this.balance;
   }
   
   // update start and end times of two lotteries
   function startnewlottery() private {
        
       start = buyend;
       buyend += 20000;
       
       nextstarted = true;
       lotteryno++;
   }
   
   // finds winners and loads money to their accounts
   function endlottery() private {
       
       uint revealedlotteryno;
       if(nextstarted){
          revealedlotteryno = lotteryno-1;
       }else{
          revealedlotteryno = lotteryno;
       }

       //i assumed there were at least 3 participants in each lottery at the end
       winnernumber1 = winnernumber1 % totalparticipants[revealedlotteryno];        
       winnernumber2 = winnernumber2 % totalparticipants[revealedlotteryno];        
       winnernumber3 = winnernumber3 % totalparticipants[revealedlotteryno];        
       
       //make sure that winner indexes are different
       if(winnernumber1 == winnernumber2){
           winnernumber2++;
       }
       if(winnernumber1 == winnernumber3){
           winnernumber3+=2;
       }
       if(winnernumber2 == winnernumber3){
           winnernumber3++;
       }
       
       uint prize1 = lotterybalance[revealedlotteryno]/2;
       uint prize2 = lotterybalance[revealedlotteryno]/4;
       uint prize3 = lotterybalance[revealedlotteryno]/8;
       
       // give the price first winner if there are many winners with the same number
       winners[revealedtickets[winnernumber1].owner] += prize1;
       winners[revealedtickets[winnernumber2].owner] += prize2;
       winners[revealedtickets[winnernumber3].owner] += prize3;
       
       // update balance of the next lottery
       uint leftovermoney = lotterybalance[revealedlotteryno] - prize3 - prize2 - prize1;
       lotterybalance[revealedlotteryno] += leftovermoney;
       
       // delete revealed tickets to go next lottery reveal safe
       delete revealedtickets;
       delete totalrevealed;
       
       //update revealend time
       revealend += 20000;
       
       // reset nexstarted
       nextstarted = false;

       
   }
   
   /*below methods are helpers when debug*/
   function gethash(uint i,uint j,uint k) public view returns(bytes32 retval){
       return keccak256(i,j,k,msg.sender);
   }
   
   function setstart(uint val) public {
       start = val;
   }
   
   function setbuyend(uint val) public {
       buyend = val;
   }
   
   function setrevealend(uint val) public{
       revealend = val;
   }
   
					
}	
