// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

/**
 * @title CertificationNFTInterface
 * @dev Interface for minting Certification NFTs.
 */
interface CertificationNFTInterface {
    /**
     * @dev Mints a new Certification NFT for the specified user address with tracked documents associated identifiers.
     * @param userAddress The address of the user receiving the NFT.
     * @param id1 The first identifier associated with the NFT.
     * @param id2 The second identifier associated with the NFT.
     * @param id3 The third identifier associated with the NFT.
     */
    function mintNFT(address userAddress, string memory id1, string memory id2, string memory id3) external;
}

/**
 * @title SecondWifCidStorageInterface
 * @dev Interface for interacting with the SecondWifCidStorage contract.
 */
interface SecondWifCidStorageInterface {

    /**
     * @dev Retrieves information associated with a specific document identifier.
     * @param docId The identifier of the document.
     * @return The IPFS CID and additional information associated with the provided document identifier.
     */
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

    /**
     * @dev Event emitted when the contract owner is changed.
     * @param oldOwner The address of the previous owner.
     * @param newOwner The address of the new owner.
     */
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    /**
     * @dev Event emitted when a new address is added to the list of authorized addresses.
     * @param addedAddress The address being added.
     */
    event AddressAdded(address indexed addedAddress);

    /**
     * @dev Event emitted when an address is removed from the list of authorized addresses.
     * @param removedAddress The address being removed.
     */
    event AddressRemoved(address indexed removedAddress);

    /**
     * @dev Event emitted when the address of the previous contract is set.
     * @param newAddress The address of the new contract.
     */
    event PreviousContractAddressSet(address indexed newAddress);

    /**
    * @dev Event emitted when the address of the CertificationNFT contract is set.
    * @param newAddress The address of the new CertificationNFT contract.
    */
    event CertificationNFTContractAddressSet(address indexed newAddress);
    
    /**
     * @dev Event emitted when a refund is requested.
     * @param user The address of the user requesting the refund.
     * @param amount The amount of ether requested as a refund.
     */
    event RefundRequested(address indexed user, uint256 amount);

    /**
     * @dev Constructor of the contract. Sets the initial owner and the address of the previous contract.
     * @param _previousContractAddress The address of the previous contract.
     */
    constructor(address _previousContractAddress) {
        owner = msg.sender;
        previousContract = SecondWifCidStorageInterface(_previousContractAddress);
        emit OwnerSet(address(0), owner);
        emit PreviousContractAddressSet(_previousContractAddress);
    }

    /**
     * @dev Modifier: Requires that the function is called only by the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    /**
     * @dev Modifier: Requires that the function is called only by an authorized address.
     */
    modifier onlyEnabledAddress() {
        require( isEnabledAddress(msg.sender) || msg.sender == owner, "Only authorized address can perform this action");
        _;
    }

    /**
     * @dev Changes the owner of the contract.
     * @param _newOwner The new owner.
     */
    function changeOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
        emit OwnerSet(owner, _newOwner);
    }

    /**
     * @dev Changes the address of the previous contract.
     * @param _newAddress The new address of the previous contract.
     */
    function changePreviousAddress(address _newAddress) public onlyOwner {
        previousContract = SecondWifCidStorageInterface(_newAddress);
        emit PreviousContractAddressSet(_newAddress);
    }

    /**
     * @dev Sets the address of the CertificationNFT contract responsible for minting NFTs.
     * @param _newCertificationNFTContractAddress The address of the new CertificationNFT contract.
     */
    function setNFTMinterAddress(address _newCertificationNFTContractAddress) external onlyOwner {
        certificationNFTContract = CertificationNFTInterface(_newCertificationNFTContractAddress);
        emit CertificationNFTContractAddressSet(_newCertificationNFTContractAddress);
    }

    /**
     * @dev Adds a new Regeneration document CID to the RegenerationCidMapping, linking it to a previous Wif's CID.
     * @param _secondDocId The identifier of the second Wif, to which the new CID is linked.
     * @param _ipfsCid The Regeneration document CID to be added.
     * @param _docId The identifier of the current Regeneration document associated with the CID.
     */
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

    /**
     * @dev Retrieves information associated with a specific Regeneration document identifier.
     * @param _docId The identifier of the Regeneration document.
     * @return The identifier of the previous Wif and the associated CID.
     */
    function getRegenerationInfo(string memory _docId) public view  onlyEnabledAddress returns (string memory, string memory) {
        RegenerationTrackingObj memory regenerationTrackingObj = RegenerationCidMapping[_docId];
        return (regenerationTrackingObj.prevDocId, regenerationTrackingObj.ipfsCid);
    }

    /**
     * @dev Retrieves the identifier of the next Regeneration document linked to the given previous Wif identifier.
     * @param _prevDocId The identifier of the previous Wif.
     * @return The identifier of the next Regeneration document associated with the provided previous Wif identifier.
     */
    function getNextDocId(string memory _prevDocId) public onlyEnabledAddress() view returns (string memory) {
        return DocIdMapping[_prevDocId];
    }

    /**
     * @dev Adds a new address to the list of authorized addresses.
     * @param _newAddress The new authorized address.
     */
    function addEnabledAddress(address _newAddress) public onlyOwner {
        require(!isEnabledAddress(_newAddress), "Address is already allowed");
        enabledAddresses.push(_newAddress);
        emit AddressAdded(_newAddress);
    }

    /**
     * @dev Removes an address from the list of authorized addresses.
     * @param _address The address to be removed.
     */
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

    /**
     * @dev Checks if an address is among the enabled ones.
     * @param _address The address to check.
     * @return True if the address is enabled, false otherwise.
     */
    function isEnabledAddress(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < enabledAddresses.length; i++) {
            if (enabledAddresses[i] == _address) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Gets the list of enabled addresses.
     * @return An array containing the enabled addresses.
     */
    function getEnabledAddresses() public view returns (address[] memory) {
        return enabledAddresses;
    }

    /**
     * @dev Fallback function to accept ether.
     */
    receive() external payable {
    }
}
