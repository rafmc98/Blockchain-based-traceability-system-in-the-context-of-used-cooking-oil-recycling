// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

/**
 * @title FirstWifCidStorageInterface
 * @dev Interface for interacting with the FirstWifCidStorage contract.
 */
interface FirstWifCidStorageInterface {
    /**
     * @dev Retrieves information associated with a specific document identifier.
     * @param docId The identifier of the document.
     * @return The IPFS CID associated with the provided document identifier.
     */
    function getWifInfo(string calldata docId) external view returns (string memory);
}

/**
 * @title SecondWifCidStoragefCidStorage
 * @dev Contract for storing the second Wif CID information.
 */
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
        previousContract = FirstWifCidStorageInterface(_previousContractAddress);
        emit PreviousContractAddressSet(_previousContractAddress);
        emit OwnerSet(address(0), owner);
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
     * @dev Changes the address of the previous contract.
     * @param _newAddress The new address of the previous contract.
     */
    function changePreviousAddress(address _newAddress) public onlyOwner {
        previousContract = FirstWifCidStorageInterface(_newAddress);
        emit PreviousContractAddressSet(_newAddress);
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
     * @dev Adds a new Wif CID to the storage map, linking it to a previous Wif's CID.
     * @param _prevDocId The identifier of the previous Wif, to which the new CID is linked.
     * @param _ipfsCid The Wif CID to be added.
     * @param _docId The identifier of the current Wif associated with the CID.
     */
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

    /**
     * @dev Gets the information of the CID associated with a specific Wif.
     * @param _docId The Wif identifier.
     * @return The Wif CID associated with the document.
     */
    function getWifInfo(string memory _docId) public view onlyEnabledAddress returns (string memory, string memory) {
        WifTrackingObj memory wifTrackingObj = WifCidMapping[_docId];
        return (wifTrackingObj.prevDocId, wifTrackingObj.ipfsCid);
    }

    /**
     * @dev Retrieves the identifier of the next Wif linked to the given previous Wif identifier.
     * @param _prevDocId The identifier of the previous Wif.
     * @return The identifier of the next Wif associated with the provided previous Wif identifier.
     */
    function getNextDocId(string memory _prevDocId) public view onlyEnabledAddress returns (string memory) {
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
