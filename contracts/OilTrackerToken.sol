// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificationNFTInterface
 * @dev Interface for interacting with the Certification NFT contract.
 */
interface CertificationNFTInterface {
    
    /**
     * @dev Retrieves the validity status of a Certification NFT.
     * @param tokenId The unique identifier of the Certification NFT.
     * @return The validity status.
     */
    function getNFTValidity(uint256 tokenId) external view returns (bool);

    /**
     * @dev Retrieves the owner of a Certification NFT.
     * @param tokenId The unique identifier of the Certification NFT.
     * @return The address of the owner.
     */
    function getOwnerOfNFT(uint256 tokenId) external view returns (address);

    /**
     * @dev Sets the validity status of a Certification NFT.
     * @param tokenId The unique identifier of the Certification NFT.
     */
    function setNFTValidity(uint256 tokenId) external;
}

/**
 * @title OilTrackerToken
 * @dev ERC20 token contract representing OilTrackerToken.
 */
contract OilTrackerToken is ERC20, Ownable {

    address private certificationNFTContractAddress;
    uint256 public exchangeRate;

    /**
     * @dev Event emitted when OilTrackerToken is minted.
     * @param to The address to which OilTrackerToken is minted.
     * @param tokenId The unique identifier of the associated Certification NFT token.
     */
    event OilTrackerTokenMinted(address indexed to, uint256 tokenId);

    /**
     * @dev Event emitted when the exchange rate for OilTrackerToken is updated.
     * @param newExchangeRate The new exchange rate.
     */
    event ExchangeRateUpdate(uint256 newExchangeRate);

    /**
     * @dev Event emitted when OilTrackerToken is burned.
     * @param from The address from which OilTrackerToken is burned.
     * @param amount The amount of OilTrackerToken burned.
     */
    event Burn(address indexed from, uint256 amount);

    /**
     * @dev Constructor for the OilTrackerToken contract.
     * @param _certificationNFTContractAddress The address of the CertificationNFT contract.
     * @param _exchangeRate The initial exchange rate for minting OilTrackerToken.
     */
    constructor(address _certificationNFTContractAddress, uint256 _exchangeRate) ERC20("OilTrackerToken", "OT") Ownable(msg.sender){
        certificationNFTContractAddress = _certificationNFTContractAddress;
        exchangeRate = _exchangeRate;
    }

    /**
     * @dev Changes the address of the CertificationNFT contract.
     * @param newcertificationNFTContractAddress The new address of the CertificationNFT contract.
     */
    function changeCertificationNFTContractAddress(address newcertificationNFTContractAddress) public onlyOwner {
        certificationNFTContractAddress = newcertificationNFTContractAddress;
    }

    /**
     * @dev Mints OilTrackerToken based on a Certification NFT.
     * @param tokenId The Certification NFT token identifier.
     */
    function mintToken(uint256 tokenId) public {
        CertificationNFTInterface certificationNFT = CertificationNFTInterface(certificationNFTContractAddress);
        require(certificationNFT.getOwnerOfNFT(tokenId) == msg.sender, "The user is not the owner of this token");
        require(certificationNFT.getNFTValidity(tokenId), "NFT is not valid anymore");
        certificationNFT.setNFTValidity(tokenId);
        _mint(msg.sender, exchangeRate * (10 ** 18));
        emit OilTrackerTokenMinted(msg.sender, tokenId);
    }

    /**
     * @dev Retrieves the current exchange rate for minting OilTrackerToken.
     * @return The current exchange rate.
     */
    function getExchangeRate() public view returns (uint256) {
        return exchangeRate;
    }

    /**
     * @dev Changes the exchange rate for minting OilTrackerToken.
     * @param _newExchangeRate The new exchange rate.
     */
    function changeExchangeRate(uint256 _newExchangeRate) public onlyOwner {
        exchangeRate = _newExchangeRate;
        emit ExchangeRateUpdate(_newExchangeRate);
    }

    /**
     * @dev Burns a specified amount of OilTrackerToken.
     * @param amount The amount to be burned.
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount * (10 ** 18));
        emit Burn(msg.sender, amount * (10 ** 18));
    }
}
