// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificationNFT is ERC721, Ownable {

    uint256 private _tokenIdCounter;
    address private authorizedRegenerationContract;
    address private authorizedOTCoinContract;

    struct CertificationData {
        string id1;
        string id2;
        string id3;
        bool validity;
    }

    mapping(uint256 => CertificationData) private certificationDataMapping;

    event certificationNFTMinted(address indexed to, uint256 tokenId, string id1, string id2, string id3);
    event NFTValiditySet(uint256 tokenId, bool newValidity);

    constructor(address _authorizedRegenerationContract) ERC721("CertificationToken", "CERT") Ownable(msg.sender) {
        authorizedRegenerationContract = _authorizedRegenerationContract;
    }

    modifier onlyRegenerationContract() {
        require(msg.sender == authorizedRegenerationContract, "Not authorized contract caller");
        _;
    }

    modifier onlyAuthorizedOTCoinCaller() {
        require(msg.sender == authorizedOTCoinContract, "Not authorized contract caller");
        _;
    }

    function changeRegenerationContract(address newRegenerationContract) public onlyOwner {
        authorizedRegenerationContract = newRegenerationContract;
    }

    function changeOTCoinContract(address newOTCoinContract) public onlyOwner {
        authorizedOTCoinContract = newOTCoinContract;
    }

    function mintNFT(address userAddress, string memory id1, string memory id2, string memory id3) external onlyRegenerationContract {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(userAddress, tokenId);
        certificationDataMapping[tokenId] = CertificationData(id1, id2, id3, true);
        _tokenIdCounter++;
        emit certificationNFTMinted(userAddress, tokenId, id1, id2, id3);
    }

    function getOwnerOfNFT(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function getCertificationData(uint256 tokenId) public view returns (string memory, string memory, string memory) {
        return (certificationDataMapping[tokenId].id1, certificationDataMapping[tokenId].id2, certificationDataMapping[tokenId].id3);
    }

    function setNFTValidity(uint256 tokenId) external onlyAuthorizedOTCoinCaller {
        require(certificationDataMapping[tokenId].validity == true, "Validity cannot be changed anymore");
        certificationDataMapping[tokenId].validity = false;
        emit NFTValiditySet(tokenId, false);
    }

    function getNFTValidity(uint256 tokenId) public view returns (bool) {
        return certificationDataMapping[tokenId].validity;
    }
}
