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
    
    // winner numbers that are updated by xoring the numbers given by the buyer at reveal stage
	uint    public  winnernumber1;
	uint    public  winnernumber2;
	uint    public  winnernumber3;
	
    
    // mapping that maps address to tickets purchased by that address
    mapping ( address => Ticket[] ) boughttickets;

    	// holds winners' addresses
	mapping (address => uint) winners;    
    
    // revealed ticket list
	Ticket[] revealedtickets;
	
	// total number of revealed tickets for the lottery to be revealed next
	uint totalrevealed;
	
	
	// purchase start, purchase end, reveal end times of the lottery
	uint	public	start; 
	uint    public  buyend;
	uint	public	revealend;
	
	// current balance of the lottery
	uint  lotterybalance;
		
	//	constructor		
	function Lottery() public	{	
		start	=	block.number;
		buyend =	start +  10;
		revealend = buyend + 10;
	}
	
	//buy full ticket
	function buyfullticket(bytes32 tickethash) public payable {
	    uint currentblockno = block.number;
	    if( currentblockno >= start && currentblockno < buyend){
	         if(msg.value == fullpay){
	             Ticket memory t;
	             t.owner = msg.sender;
	             t.value = 8 finney;
	             t.hashVal = tickethash;
	             boughttickets[msg.sender].push(t);
	             lotterybalance += 8 finney;
	         }else{
	             // not 8 finney
	             revert();
	         }
	    }else{
	        
	        // it is reveal stage
	        revert();
	         
	    }
	}
	
	//buy half ticket
	function buyhalfticket(bytes32 tickethash) public payable {
	    uint currentblockno = block.number;
	    if( currentblockno >= start && currentblockno < buyend){
	         if(msg.value == halfpay){
	             Ticket memory t;
	             t.owner = msg.sender;
	             t.value = 4 finney;
	             t.hashVal = tickethash;
	             boughttickets[msg.sender].push(t);
	             lotterybalance += 4 finney;
	         }else{
	             // not 4 finney
	             revert();
	         }
	    }else{
	        
	        // it is not purchase stage
	        revert();
	        
	    }
	}
	
	//buy quarter ticket
	function buyquarterticket(bytes32 tickethash) public payable {
	    uint currentblockno = block.number;
	    if( currentblockno >= start && currentblockno < buyend){
	         if(msg.value == quarterpay){
	             Ticket memory t;
	             t.owner = msg.sender;
	             t.value = 2 finney;
	             t.hashVal = tickethash;
	             boughttickets[msg.sender].push(t);
	             lotterybalance += 2 finney;
	         }else{
	             // not 2 finney
	             revert();
	         }
	    }else{
	       
	         // it is reveal stage
	         revert();
	         
	    }
	}



   //reveal ticket
   function revealticket(uint number1, uint number2, uint number3) public returns(bool) {
        uint currentblockno = block.number;
        if( currentblockno >= buyend && currentblockno < revealend ){
	         bytes32 hash = keccak256(number1,number2,number3,msg.sender);
	         uint totalticketsnotyetrevealed = boughttickets[msg.sender].length;
	         if(totalticketsnotyetrevealed != 0){
	                
	             bool found = false;
	             for(uint i=0;i<totalticketsnotyetrevealed;i++){
	                 if(boughttickets[msg.sender][i].hashVal == hash){
	                     
	                    revealedtickets.push(boughttickets[msg.sender][i]);
	                    totalrevealed++;
	                    
	                    // delete revealed ticket from bought tickets to prevent double reveal try of the same ticket
	                    delete boughttickets[msg.sender][i];
	                          
	                    winnernumber3 ^= number3;
                        winnernumber2 ^= number2;
	                    winnernumber1 ^= number1;
	                    found = true;
	                    break;
	                 }
	             }
	             
	             if(found){
	                 // user revealed a ticket
	                 return true;
	             }else{
	                 // user had no unrevealed ticket left
	                 revert();
	             }
	         }else{
	             // user had no purchased ticket
	             revert();
	         }
	    }else if(currentblockno < buyend ){
	        
	        // it is buy stage
	        revert();
	        
	    }else{
	        // reveal time has ended
	        updatelottery();
	        return false;
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
       // calculate winner indexes so that array does not go out of bounds
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
           prize1 = lotterybalance/2;
       }else if(revealedtickets[winnernumber1].value == 4 finney){
           prize1 = lotterybalance/4;
       }else{
           prize1 = lotterybalance/8;
       }
       
       if(revealedtickets[winnernumber2].value == 8 finney){
           prize2 = lotterybalance/4;
       }else if(revealedtickets[winnernumber2].value == 4 finney){
           prize2 = lotterybalance/8;
       }else{
           prize2 = lotterybalance/16;
       }
       
       if(revealedtickets[winnernumber3].value == 8 finney){
           prize3 = lotterybalance/8;
       }else if(revealedtickets[winnernumber3].value == 4 finney){
           prize3 = lotterybalance/16;
       }else{
           prize3 = lotterybalance/32;
       }
    
       
       // give the price first winner if there are many winners with the same number
       winners[revealedtickets[winnernumber1].owner] += prize1;
       winners[revealedtickets[winnernumber2].owner] += prize2;
       winners[revealedtickets[winnernumber3].owner] += prize3;
       
       // update balance of the next lottery
       uint leftovermoney = lotterybalance - prize3 - prize2 - prize1;
       lotterybalance = leftovermoney;
       
       // delete revealed tickets and bought tickets to go next lottery reveal safe
       delete revealedtickets;
       delete totalrevealed;
       
       //update times
       start = block.number;
       buyend = start +  10;
       revealend = buyend + 10;
       
       
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
