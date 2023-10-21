// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract WifCidStorage {

    address private owner;

    struct WifTrackingObj {
        string prevRfj;
        string ipfsCid;
    }

    address[] public allowedWriters;

    mapping (string => WifTrackingObj) public WifCidMapping;
    mapping (string => string) public RfjMapping;

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

    function addWifCid(string memory _prevRfj, string memory _ipfsCid, string memory _rfj) public onlyAllowedWriters {
        WifTrackingObj memory newWifTrackingObj = WifTrackingObj(_prevRfj, _ipfsCid);
        WifCidMapping[_rfj] = newWifTrackingObj;
        RfjMapping[_prevRfj] = _rfj;
    }

    function getWifInfo(string memory _rfj) public view  returns (string memory, string memory) {
        WifTrackingObj memory wifTrackingObj = WifCidMapping[_rfj];
        return (wifTrackingObj.prevRfj, wifTrackingObj.ipfsCid);
    }

    function getNextRfj(string memory _prevRfj) public view returns (string memory) {
        return RfjMapping[_prevRfj];
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

    function isAllowedWriter(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < allowedWriters.length; i++) {
            if (allowedWriters[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function getAllowedWriters() public view returns (address[] memory) {
        return allowedWriters;
    }
}
