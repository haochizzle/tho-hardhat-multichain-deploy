// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCounter {
    uint256 private counter;

    constructor() {
        counter = 0; // Initialize counter to 0 at deployment
    }

    // Function to increment the counter by 1
    function increment() public {
        counter += 1;
    }

    // Function to get the current value of the counter
    function getCounter() public view returns (uint256) {
        return counter;
    }
}
