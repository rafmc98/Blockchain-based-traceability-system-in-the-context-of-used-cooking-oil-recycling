// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract WifCidStorage {

    address private owner;

    mapping (string => string) public wifStorageInfo;
    address[] public allowedWriters;

    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event AddressAdded(address indexed addedAddress);
    event AddressRemoved(address indexed removedAddress);

    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyAllowedWriters() {
        require(
            isAllowedWriter(msg.sender) || msg.sender == owner,
            "Only authorized address can perform this action"
        );
        _;
    }

    function changeOwner(address _newOwner) public onlyOwner {
        emit OwnerSet(owner, _newOwner);
        owner = _newOwner;
    }

    function addWif(string memory _ipfsCid, string memory _rfj) public onlyAllowedWriters {
        wifStorageInfo[_rfj] = _ipfsCid;
    }

    function getWifInfo(string memory _rfj) public view returns (string memory) {
        return wifStorageInfo[_rfj];
    }

    function addWriter(address _newAddress) public onlyOwner {
        require(!isAllowedWriter(_newAddress), "Address is already allowed");
        allowedWriters.push(_newAddress);
        emit AddressAdded(_newAddress);
    }

    function removeWriter(address _address) public onlyOwner {
        require(isAllowedWriter(_address), "The address provided is not among those enabled for writing");
        for (uint256 i = 0; i < allowedWriters.length; i++) {
            if (allowedWriters[i] == _address) {
                allowedWriters[i] = allowedWriters[allowedWriters.length - 1];
                allowedWriters.pop();
                emit AddressRemoved(_address);
                break;
            }
        }
    }

    // Function to check if an address is in the allowedWriters array
    function isAllowedWriter(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < allowedWriters.length; i++) {
            if (allowedWriters[i] == _address) {
                return true;
            }
        }
        return false;
    }

    // Function to get the list of allowed writer addresses
    function getAllowedWriters() public view returns (address[] memory) {
        return allowedWriters;
    }
}
