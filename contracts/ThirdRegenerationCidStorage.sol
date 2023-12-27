// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

interface CertificationNFTInterface {
    function mintNFT(address userAddress, string memory id1, string memory id2, string memory id3) external;
}

interface SecondWifCidStorageInterface {
    function getWifInfo(string calldata docId) external view returns (string memory, string memory);
}

contract ThirdRegenerationCidStorage {

    SecondWifCidStorageInterface private previousContract;
    CertificationNFTInterface private certificationNFTContract;
    address private owner;

    struct RegenerationTrackingObj {
        string prevDocId;
        string ipfsCid;
    }

    address[] public enabledAddresses;

    mapping (string => RegenerationTrackingObj) public RegenerationCidMapping;
    mapping (string => string) public DocIdMapping;

    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event AddressAdded(address indexed addedAddress);
    event AddressRemoved(address indexed removedAddress);
    event PreviousContractAddressSet(address indexed newAddress);
    event CertificationNFTContractAddressSet(address indexed newAddress);
    event RefundRequested(address indexed user, uint256 amount);

    constructor(address _previousContractAddress) {
        owner = msg.sender;
        previousContract = SecondWifCidStorageInterface(_previousContractAddress);
        emit OwnerSet(address(0), owner);
        emit PreviousContractAddressSet(_previousContractAddress);
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
        owner = _newOwner;
        emit OwnerSet(owner, _newOwner);
    }

    function changePreviousAddress(address _newAddress) public onlyOwner {
        previousContract = SecondWifCidStorageInterface(_newAddress);
        emit PreviousContractAddressSet(_newAddress);
    }

    function setNFTMinterAddress(address _newCertificationNFTContractAddress) external onlyOwner {
        certificationNFTContract = CertificationNFTInterface(_newCertificationNFTContractAddress);
        emit CertificationNFTContractAddressSet(_newCertificationNFTContractAddress);
    }

    function addRegenerationCid(string memory _secondDocId, string memory _ipfsCid, string memory _docId) public onlyEnabledAddress {
        require(bytes(RegenerationCidMapping[_docId].ipfsCid).length == 0, "A value already exists for this key");
        (string memory firstDocId, ) = previousContract.getWifInfo(_secondDocId);
        require(bytes(firstDocId).length > 0, "No value exists for this key");
        
        RegenerationTrackingObj memory newRegenerationTrackingObj = RegenerationTrackingObj(_secondDocId, _ipfsCid);
        RegenerationCidMapping[_docId] = newRegenerationTrackingObj;
        DocIdMapping[_secondDocId] = _docId;
        
        certificationNFTContract.mintNFT(msg.sender, firstDocId, _secondDocId, _docId);

        uint256 refundAmount = gasleft() * tx.gasprice;
        payable(msg.sender).transfer(refundAmount);
        emit RefundRequested(msg.sender, refundAmount);
    }

    function getRegenerationInfo(string memory _docId) public view  onlyEnabledAddress returns (string memory, string memory) {
        RegenerationTrackingObj memory regenerationTrackingObj = RegenerationCidMapping[_docId];
        return (regenerationTrackingObj.prevDocId, regenerationTrackingObj.ipfsCid);
    }

    function getNextDocId(string memory _prevDocId) public onlyEnabledAddress() view returns (string memory) {
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
