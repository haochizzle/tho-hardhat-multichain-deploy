// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SetName {
    address payable public owner;
    string public name;

    event NameSet(string name);

    constructor(address _owner) {
        owner = payable(_owner);
    }

    function setName(string memory _name) external {
        require(bytes(name).length == 0, "Name has already been set");
        name = _name;
        emit NameSet(_name);
    }
}
