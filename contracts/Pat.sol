pragma solidity ^0.4.17;
contract Pat {
	address[10] public amzCodeMonkeys_;

	function pat(uint _monkeyId) public returns (uint) {
		require(_monkeyId >= 0 && _monkeyId < 10);

		amzCodeMonkeys_[_monkeyId] = msg.sender;

		return _monkeyId;
	}

	function getPatters() public view returns (address[10]) {
		return amzCodeMonkeys_;
	}



}