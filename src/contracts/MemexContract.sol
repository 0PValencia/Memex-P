// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MemexContract
 * @dev Contrato para la plataforma Memex que permite crear y apostar por memes
 */
contract MemexContract is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Estructura para almacenar información de cada meme
    struct Meme {
        uint256 id;
        address creator;
        uint256 totalBets;
        uint256 totalPot;
        bool isActive;
        uint256 createdAt;
    }

    // Mapeo de ID de token a estructura de Meme
    mapping(uint256 => Meme) public memes;
    
    // Mapeo de apuestas para cada meme: memeId => userAddress => betAmount
    mapping(uint256 => mapping(address => uint256)) public bets;
    
    // Eventos
    event MemeCreated(uint256 indexed tokenId, address indexed creator, string tokenURI);
    event BetPlaced(uint256 indexed tokenId, address indexed better, uint256 amount);
    event MemeWentViral(uint256 indexed tokenId, uint256 totalPot);
    event RewardsClaimed(uint256 indexed tokenId, address indexed better, uint256 amount);

    // Constructor
    constructor() ERC721("Memex", "MEMX") Ownable(msg.sender) {}

    /**
     * @dev Crea un nuevo meme como NFT
     * @param tokenURI URI del metadata del meme
     * @return tokenId ID del nuevo meme creado
     */
    function createMeme(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        memes[newItemId] = Meme({
            id: newItemId,
            creator: msg.sender,
            totalBets: 0,
            totalPot: 0,
            isActive: true,
            createdAt: block.timestamp
        });
        
        emit MemeCreated(newItemId, msg.sender, tokenURI);
        
        return newItemId;
    }

    /**
     * @dev Permite a un usuario apostar por un meme
     * @param tokenId ID del meme
     */
    function betOnMeme(uint256 tokenId) public payable {
        require(memes[tokenId].isActive, "Este meme no esta activo");
        require(msg.value > 0, "La apuesta debe ser mayor que cero");
        
        // Actualizar la información de la apuesta
        bets[tokenId][msg.sender] += msg.value;
        memes[tokenId].totalBets += 1;
        memes[tokenId].totalPot += msg.value;
        
        emit BetPlaced(tokenId, msg.sender, msg.value);
    }

    /**
     * @dev Marca un meme como viral (solo el propietario del contrato puede hacerlo)
     * @param tokenId ID del meme
     */
    function markMemeAsViral(uint256 tokenId) public onlyOwner {
        require(memes[tokenId].isActive, "Este meme no esta activo");
        
        memes[tokenId].isActive = false;
        
        emit MemeWentViral(tokenId, memes[tokenId].totalPot);
    }

    /**
     * @dev Permite a un creador reclamar recompensas por un meme viral
     * @param tokenId ID del meme
     */
    function claimRewards(uint256 tokenId) public {
        require(!memes[tokenId].isActive, "El meme debe estar marcado como viral");
        require(memes[tokenId].creator == msg.sender, "Solo el creador puede reclamar recompensas");
        
        uint256 creatorShare = (memes[tokenId].totalPot * 50) / 100; // 50% para el creador
        uint256 betterShare = memes[tokenId].totalPot - creatorShare; // 50% para los apostadores
        
        // Transferir las recompensas al creador
        payable(msg.sender).transfer(creatorShare);
        
        // La lógica para distribuir el resto entre apostadores se implementaría aquí
        // Por simplicidad, este ejemplo no lo hace
        
        emit RewardsClaimed(tokenId, msg.sender, creatorShare);
    }

    /**
     * @dev Obtiene la información de un meme
     * @param tokenId ID del meme
     * @return Estructura Meme con la información
     */
    function getMemeInfo(uint256 tokenId) public view returns (Meme memory) {
        return memes[tokenId];
    }

    /**
     * @dev Obtiene la cantidad apostada por un usuario en un meme
     * @param tokenId ID del meme
     * @param user Dirección del usuario
     * @return Cantidad apostada
     */
    function getBetAmount(uint256 tokenId, address user) public view returns (uint256) {
        return bets[tokenId][user];
    }
} 