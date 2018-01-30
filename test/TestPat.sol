pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Pat.sol";

contract TestPat {
  	Pat pat = Pat(DeployedAddresses.Pat());

	function testUserCanPatMonkey() public {
	  uint returnedId = pat.pat(8);

	  uint expected = 8;

	  Assert.equal(returnedId, expected, "Patter 8 should be recorded.");
	}

	function testGetPatterAddressByAmazonId() public {
	  // Expected owner is this contract
	  address expected = this;

	  address returned = pat.amzCodeMonkeys_(8);

	  Assert.equal(returned, expected, "Patter should be recorded.");
	}

	function testGetPatterAddressByAmazonIdInArray() public {
	  // Expected owner is this contract
	  address expected = this;

	  // array/structs are by default created in storage, which is expensive compared to memory
	  address[10] memory monkeys = pat.getPatters();

	  Assert.equal(monkeys[8], expected, "Patter should be recorded.");
	}

}