// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract RegenerationCidStorage {

    address private owner;

    struct RegenerationTrackingObj {
        string prevIdDoc;
        string ipfsCid;
    }

    address[] public allowedWriters;

    mapping (string => RegenerationTrackingObj) public RegenerationCidMapping;
    mapping (string => string) public IdDocMapping;

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

    function addRegenerationCid(string memory _prevIdDoc, string memory _ipfsCid, string memory _docId) public onlyAllowedWriters {
        RegenerationTrackingObj memory newRegenerationTrackingObj = RegenerationTrackingObj(_prevIdDoc, _ipfsCid);
        RegenerationCidMapping[_docId] = newRegenerationTrackingObj;
        IdDocMapping[_prevIdDoc] = _docId;
    }

    function getRegenerationInfo(string memory _docId) public view  returns (string memory, string memory) {
        RegenerationTrackingObj memory regenerationTrackingObj = RegenerationCidMapping[_docId];
        return (regenerationTrackingObj.prevIdDoc, regenerationTrackingObj.ipfsCid);
    }

    function getNextIdDoc(string memory _prevIdDoc) public view returns (string memory) {
        return IdDocMapping[_prevIdDoc];
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
