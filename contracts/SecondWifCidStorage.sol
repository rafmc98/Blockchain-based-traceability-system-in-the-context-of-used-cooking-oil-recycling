// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

interface FirstWifCidStorageInterface {
    function getWifInfo(string calldata docId) external view returns (string memory);
}

contract SecondWifCidStorage {

    FirstWifCidStorageInterface private previousContract;
    address private owner;

    struct WifTrackingObj {
        string prevDocId;
        string ipfsCid;
    }

    address[] public enabledAddresses;

    mapping (string => WifTrackingObj) public WifCidMapping;
    mapping (string => string) public DocIdMapping;
    
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event AddressAdded(address indexed addedAddress);
    event AddressRemoved(address indexed removedAddress);
    event PreviousContractAddressSet(address indexed newAddress);
    event RefundRequested(address indexed user, uint256 amount);

    constructor(address _previousContractAddress) {
        owner = msg.sender;
        previousContract = FirstWifCidStorageInterface(_previousContractAddress);
        emit PreviousContractAddressSet(_previousContractAddress);
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

    function changePreviousAddress(address _newAddress) public onlyOwner {
        previousContract = FirstWifCidStorageInterface(_newAddress);
        emit PreviousContractAddressSet(_newAddress);
    }

    function changeOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
        emit OwnerSet(owner, _newOwner);
    }

    function addWifCid(string memory _prevDocId, string memory _ipfsCid, string memory _docId) public onlyEnabledAddress {
        require(bytes(WifCidMapping[_docId].ipfsCid).length == 0, "A value already exists for this key");
        require(bytes(previousContract.getWifInfo(_prevDocId)).length > 0, "No value exists for this key");
        WifTrackingObj memory newWifTrackingObj = WifTrackingObj(_prevDocId, _ipfsCid);
        WifCidMapping[_docId] = newWifTrackingObj;
        DocIdMapping[_prevDocId] = _docId;
        uint256 refundAmount = gasleft() * tx.gasprice;
        payable(msg.sender).transfer(refundAmount);
        emit RefundRequested(msg.sender, refundAmount);
    }

    function getWifInfo(string memory _docId) public view onlyEnabledAddress returns (string memory, string memory) {
        WifTrackingObj memory wifTrackingObj = WifCidMapping[_docId];
        return (wifTrackingObj.prevDocId, wifTrackingObj.ipfsCid);
    }

    function getNextDocId(string memory _prevDocId) public view onlyEnabledAddress returns (string memory) {
        return DocIdMapping[_prevDocId];
    }

    function addEnabledAddress(address _newAddress) public onlyOwner {
        require(!isEnabledAddress(_newAddress), "Address is already allowed");
        enabledAddresses.push(_newAddress);
        emit AddressAdded(_newAddress);
    }

    function removeEnabledAddress(address _address) public onlyOwner {
        require(isEnabledAddress(_address), "The address provided is not among those enabled for writing");
        for (uint256 i = 0; i < enabledAddresses.length; i++) {
            if (enabledAddresses[i] == _address) {
                enabledAddresses[i] = enabledAddresses[enabledAddresses.length - 1];
                enabledAddresses.pop();
                emit AddressRemoved(_address);
                break;
            }
        }
    }

    function isEnabledAddress(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < enabledAddresses.length; i++) {
            if (enabledAddresses[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function getEnabledAddresses() public view returns (address[] memory) {
        return enabledAddresses;
    }

    receive() external payable {
    }
}
