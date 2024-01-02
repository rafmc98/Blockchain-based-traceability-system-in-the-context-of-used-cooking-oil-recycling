// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

/**
 * @title FirstWifCidStorage
 * @dev Contract for storing the first Wif CID information.
 */
contract FirstWifCidStorage {

    address private owner;

    mapping (string => string) public wifStorageInfo;
    address[] public allowedAddresses;

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
     * @dev Event emitted when a refund is requested.
     * @param user The address of the user requesting the refund.
     * @param amount The amount of ether requested as a refund.
     */
    event RefundRequested(address indexed user, uint256 amount);

    /**
     * @dev Constructor of the contract. Sets the initial owner.
     */
    constructor() {
        owner = msg.sender;
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
     * @dev Changes the owner of the contract.
     * @param _newOwner The new owner.
     */
    function changeOwner(address _newOwner) public onlyOwner {
        emit OwnerSet(owner, _newOwner);
        owner = _newOwner;
    }

    /**
     * @dev Adds a new Wif CID to the storage map.
     * @param _ipfsCid The Wif CID to be added.
     * @param _docId The identifier of the Wif associated with the CID.
     */
    function addWifCid(string memory _ipfsCid, string memory _docId) public onlyEnabledAddress() {
        require(bytes(wifStorageInfo[_docId]).length == 0, "A value already exists for this key");
        wifStorageInfo[_docId] = _ipfsCid;
        uint256 refundAmount = gasleft() * tx.gasprice;
        payable(msg.sender).transfer(refundAmount);
        emit RefundRequested(msg.sender, refundAmount);
    }

    /**
     * @dev Gets the information of the CID associated with a specific Wif.
     * @param _docId The Wif identifier.
     * @return The Wif CID associated with the document.
     */
    function getWifInfo(string memory _docId) public view onlyEnabledAddress() returns (string memory) {
        return wifStorageInfo[_docId];
    }

    /**
     * @dev Adds a new address to the list of authorized addresses.
     * @param _newAddress The new authorized address.
     */
    function addEnabledAddress(address _newAddress) public onlyOwner {
        require(!isEnabledAddress(_newAddress), "Address is already allowed");
        allowedAddresses.push(_newAddress);
        emit AddressAdded(_newAddress);
    }

    /**
     * @dev Removes an address from the list of authorized addresses.
     * @param _address The address to be removed.
     */
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

    /**
     * @dev Checks if an address is among the enabled ones.
     * @param _address The address to check.
     * @return True if the address is enabled, false otherwise.
     */
    function isEnabledAddress(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < allowedAddresses.length; i++) {
            if (allowedAddresses[i] == _address) {
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
        return allowedAddresses;
    }

    /**
     * @dev Fallback function to accept ether.
     */
    receive() external payable {
    }
}
