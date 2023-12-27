// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract FirstWifCidStorage {

    address private owner;

    mapping (string => string) public wifStorageInfo;
    address[] public allowedAddresses;

    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event AddressAdded(address indexed addedAddress);
    event AddressRemoved(address indexed removedAddress);
    event RefundRequested(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyEnabledAddress() {
        require( isEnabledAddress(msg.sender) || msg.sender == owner, "Only authorized address can perform this action");
        _;
    }

    function changeOwner(address _newOwner) public onlyOwner {
        emit OwnerSet(owner, _newOwner);
        owner = _newOwner;
    }

    function addWifCid(string memory _ipfsCid, string memory _docId) public onlyEnabledAddress() {
        require(bytes(wifStorageInfo[_docId]).length == 0, "A value already exists for this key");
        wifStorageInfo[_docId] = _ipfsCid;
        uint256 refundAmount = gasleft() * tx.gasprice;
        payable(msg.sender).transfer(refundAmount);
        emit RefundRequested(msg.sender, refundAmount);
    }

    function getWifInfo(string memory _docId) public view onlyEnabledAddress() returns (string memory) {
        return wifStorageInfo[_docId];
    }

    function addEnabledAddress(address _newAddress) public onlyOwner {
        require(!isEnabledAddress(_newAddress), "Address is already allowed");
        allowedAddresses.push(_newAddress);
        emit AddressAdded(_newAddress);
    }

    function removeEnabledAddress(address _address) public onlyOwner {
        require(isEnabledAddress(_address), "The address provided is not among those enabled for writing");
        for (uint256 i = 0; i < allowedAddresses.length; i++) {
            if (allowedAddresses[i] == _address) {
                allowedAddresses[i] = allowedAddresses[allowedAddresses.length - 1];
                allowedAddresses.pop();
                emit AddressRemoved(_address);
                break;
            }
        }
    }

    function isEnabledAddress(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < allowedAddresses.length; i++) {
            if (allowedAddresses[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function getEnabledAddresses() public view returns (address[] memory) {
        return allowedAddresses;
    }

    receive() external payable {
    }
}
