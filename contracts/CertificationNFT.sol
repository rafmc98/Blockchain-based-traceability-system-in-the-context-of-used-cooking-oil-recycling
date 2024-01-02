// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificationNFT
 * @dev ERC721 token contract for Certification NFTs.
 */
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

    /**
     * @dev Event emitted when a new Certification NFT is minted.
     * @param to The address to which the NFT is minted.
     * @param tokenId The unique identifier of the minted NFT.
     * @param id1 The first identifier associated with the minted NFT.
     * @param id2 The second identifier associated with the minted NFT.
     * @param id3 The third identifier associated with the minted NFT.
     */
    event certificationNFTMinted(address indexed to, uint256 tokenId, string id1, string id2, string id3);
    
    /**
     * @dev Event emitted when the validity status of a Certification NFT is set.
     * @param tokenId The unique identifier of the Certification NFT.
     * @param newValidity The new validity status of the Certification NFT.
     */
    event NFTValiditySet(uint256 tokenId, bool newValidity);

    /**
     * @dev Constructor for the CertificationNFT contract.
     * @param _authorizedRegenerationContract The address of the authorized Regeneration contract.
     */
    constructor(address _authorizedRegenerationContract) ERC721("CertificationToken", "CERT") Ownable(msg.sender) {
        authorizedRegenerationContract = _authorizedRegenerationContract;
    }

    /**
     * @dev Modifier: Ensures that the caller is the authorized Regeneration contract.
     */
    modifier onlyRegenerationContract() {
        require(msg.sender == authorizedRegenerationContract, "Not authorized contract caller");
        _;
    }

    /**
     * @dev Modifier: Ensures that the caller is the authorized OTCoin contract.
     */
    modifier onlyAuthorizedOTCoinCaller() {
        require(msg.sender == authorizedOTCoinContract, "Not authorized contract caller");
        _;
    }

    /**
     * @dev Changes the address of the authorized Regeneration contract.
     * @param newRegenerationContract The new address of the authorized Regeneration contract.
     */
    function changeRegenerationContract(address newRegenerationContract) public onlyOwner {
        authorizedRegenerationContract = newRegenerationContract;
    }

    /**
     * @dev Changes the address of the authorized OTCoin contract.
     * @param newOTCoinContract The new address of the authorized OTCoin contract.
     */
    function changeOTCoinContract(address newOTCoinContract) public onlyOwner {
        authorizedOTCoinContract = newOTCoinContract;
    }

    /**
     * @dev Mints a new Certification NFT for the specified user with associated identifiers.
     * @param userAddress The address of the user receiving the NFT.
     * @param id1 The first Wif identifier associated with the NFT.
     * @param id2 The second Wif identifier associated with the NFT.
     * @param id3 The third Regeneration document identifier associated with the NFT.
     */
    function mintNFT(address userAddress, string memory id1, string memory id2, string memory id3) external onlyRegenerationContract {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(userAddress, tokenId);
        certificationDataMapping[tokenId] = CertificationData(id1, id2, id3, true);
        _tokenIdCounter++;
        emit certificationNFTMinted(userAddress, tokenId, id1, id2, id3);
    }

    /**
     * @dev Retrieves the owner of a specific Certification NFT.
     * @param tokenId The token identifier.
     * @return The address of the owner.
     */
    function getOwnerOfNFT(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    /**
     * @dev Retrieves the Certification data associated with a specific Certification NFT.
     * @param tokenId The token identifier.
     * @return The three identifiers associated with the NFT.
     */
    function getCertificationData(uint256 tokenId) public view returns (string memory, string memory, string memory) {
        return (certificationDataMapping[tokenId].id1, certificationDataMapping[tokenId].id2, certificationDataMapping[tokenId].id3);
    }

    /**
     * @dev Sets the validity status of a specific Certification NFT.
     * @param tokenId The token identifier.
     */
    function setNFTValidity(uint256 tokenId) external onlyAuthorizedOTCoinCaller {
        require(certificationDataMapping[tokenId].validity == true, "Validity cannot be changed anymore");
        certificationDataMapping[tokenId].validity = false;
        emit NFTValiditySet(tokenId, false);
    }

    /**
     * @dev Retrieves the validity status of a specific Certification NFT.
     * @param tokenId The token identifier.
     * @return The validity status.
     */
    function getNFTValidity(uint256 tokenId) public view returns (bool) {
        return certificationDataMapping[tokenId].validity;
    }
}
