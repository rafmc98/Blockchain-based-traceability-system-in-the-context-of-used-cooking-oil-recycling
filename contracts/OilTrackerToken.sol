// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface CertificationNFTInterface {
    function getNFTValidity(uint256 tokenId) external view returns (bool);
    function getOwnerOfNFT(uint256 tokenId) external view returns (address);
    function setNFTValidity(uint256 tokenId) external;
}

contract OilTrackerToken is ERC20, Ownable {

    address private certificationNFTContractAddress;
    uint256 public exchangeRate;

    event OilTrackerTokenMinted(address indexed to, uint256 tokenId);
    event ExchangeRateUpdate(uint256 newExchangeRate);
    event Burn(address indexed from, uint256 amount);

    constructor(address _certificationNFTContractAddress, uint256 _exchangeRate) ERC20("OilTrackerToken", "OT") Ownable(msg.sender){
        certificationNFTContractAddress = _certificationNFTContractAddress;
        exchangeRate = _exchangeRate;
    }

    function changeCertificationNFTContractAddress(address newcertificationNFTContractAddress) public onlyOwner {
        certificationNFTContractAddress = newcertificationNFTContractAddress;
    }

    function mintToken(uint256 tokenId) public {
        CertificationNFTInterface certificationNFT = CertificationNFTInterface(certificationNFTContractAddress);
        require(certificationNFT.getOwnerOfNFT(tokenId) == msg.sender, "The user is not the owner of this token");
        require(certificationNFT.getNFTValidity(tokenId), "NFT is not valid anymore");
        certificationNFT.setNFTValidity(tokenId);
        _mint(msg.sender, exchangeRate * (10 ** 18));
        emit OilTrackerTokenMinted(msg.sender, tokenId);
    }

    function getExchangeRate() public view returns (uint256) {
        return exchangeRate;
    }

    function changeExchangeRate(uint256 _newExchangeRate) public onlyOwner {
        exchangeRate = _newExchangeRate;
        emit ExchangeRateUpdate(_newExchangeRate);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount * (10 ** 18));
        emit Burn(msg.sender, amount * (10 ** 18));
    }
}
