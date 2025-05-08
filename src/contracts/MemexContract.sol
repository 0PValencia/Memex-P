// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Reemplazamos las importaciones de OpenZeppelin con implementaciones locales simplificadas
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// ERC721 simplificado
abstract contract ERC721 {
    string public name;
    string public symbol;
    
    mapping(uint256 => address) internal _owners;
    mapping(address => uint256) internal _balances;
    mapping(uint256 => address) internal _tokenApprovals;
    mapping(address => mapping(address => bool)) internal _operatorApprovals;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
    
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _owners[tokenId] = to;
        _balances[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }
    
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }
}

// ERC721URIStorage simplificado
abstract contract ERC721URIStorage is ERC721 {
    mapping(uint256 => string) private _tokenURIs;
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
}

// Ownable simplificado
abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }
}

// ReentrancyGuard simplificado
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

/**
 * @title MemexContract
 * @dev Contrato para la plataforma Memex que permite crear y apostar por memes
 * con un sistema de recompensas transparente y seguro
 */
contract MemexContract is ERC721URIStorage, Ownable, ReentrancyGuard {
    // Usamos un contador simple para los IDs de tokens
    uint256 private _nextTokenId;
    
    // Estructura para almacenar información de cada meme
    struct Meme {
        uint256 id;
        address creator;
        uint256 totalBets;
        uint256 totalPot;
        bool isActive;
        uint256 createdAt;
        uint256 viralityScore;
        uint256 lastUpdateTime;
    }
    
    // Estructura para almacenar información de cada apuesta
    struct Bet {
        address better;
        uint256 amount;
        uint256 timestamp;
    }

    // Mapeo de ID de token a estructura de Meme
    mapping(uint256 => Meme) public memes;
    
    // Mapeo de apuestas para cada meme: memeId => userAddress => betAmount
    mapping(uint256 => mapping(address => uint256)) public bets;
    
    // Historial de apuestas para cada meme: memeId => array de Bet
    mapping(uint256 => Bet[]) public betHistory;
    
    // Comisión de la plataforma (0.5%)
    uint256 public constant PLATFORM_FEE = 5; // 0.5%
    uint256 public constant FEE_DENOMINATOR = 1000;
    
    // Duración mínima antes de que un meme pueda ser marcado como viral (1 día)
    uint256 public constant MIN_VIRAL_DURATION = 1 days;
    
    // Umbral de viralidad para que un meme se considere viral
    uint256 public constant VIRALITY_THRESHOLD = 100;
    
    // Dirección del tesoro donde se envían las comisiones
    address public treasuryAddress;
    
    // Eventos
    event MemeCreated(uint256 indexed tokenId, address indexed creator, string tokenURI);
    event BetPlaced(uint256 indexed tokenId, address indexed better, uint256 amount, uint256 newTotalPot);
    event MemeWentViral(uint256 indexed tokenId, uint256 totalPot, uint256 viralityScore);
    event RewardsClaimed(uint256 indexed tokenId, address indexed claimer, uint256 amount, bool isCreator);
    event ViralityScoreUpdated(uint256 indexed tokenId, uint256 newScore);
    event TreasuryAddressUpdated(address previousAddress, address newAddress);

    // Modificadores
    modifier onlyMemeCreator(uint256 tokenId) {
        require(memes[tokenId].creator == msg.sender, unicode"Solo el creador puede realizar esta accion");
        _;
    }
    
    modifier memeExists(uint256 tokenId) {
        require(tokenId < _nextTokenId, unicode"El meme no existe");
        _;
    }
    
    modifier memeIsActive(uint256 tokenId) {
        require(memes[tokenId].isActive, unicode"El meme no esta activo");
        _;
    }
    
    modifier memeIsViral(uint256 tokenId) {
        require(!memes[tokenId].isActive, unicode"El meme debe estar marcado como viral");
        _;
    }
    
    modifier hasBet(uint256 tokenId) {
        require(bets[tokenId][msg.sender] > 0, unicode"No has apostado por este meme");
        _;
    }

    // Constructor
    constructor(address _treasuryAddress) ERC721("Memex", "MEMX") Ownable() {
        treasuryAddress = _treasuryAddress;
    }
    
    /**
     * @dev Establece una nueva dirección para el tesoro
     * @param _newTreasuryAddress La nueva dirección del tesoro
     */
    function setTreasuryAddress(address _newTreasuryAddress) external onlyOwner {
        require(_newTreasuryAddress != address(0), unicode"Dirección inválida");
        address previousAddress = treasuryAddress;
        treasuryAddress = _newTreasuryAddress;
        emit TreasuryAddressUpdated(previousAddress, _newTreasuryAddress);
    }

    /**
     * @dev Crea un nuevo meme como NFT
     * @param tokenURI URI del metadata del meme
     * @return tokenId ID del nuevo meme creado
     */
    function createMeme(string memory tokenURI) public returns (uint256) {
        uint256 newItemId = _nextTokenId++;
        
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        memes[newItemId] = Meme({
            id: newItemId,
            creator: msg.sender,
            totalBets: 0,
            totalPot: 0,
            isActive: true,
            createdAt: block.timestamp,
            viralityScore: 0,
            lastUpdateTime: block.timestamp
        });
        
        emit MemeCreated(newItemId, msg.sender, tokenURI);
        
        return newItemId;
    }

    /**
     * @dev Permite a un usuario apostar por un meme
     * @param tokenId ID del meme
     */
    function betOnMeme(uint256 tokenId) public payable 
        memeExists(tokenId) 
        memeIsActive(tokenId) 
        nonReentrant 
    {
        require(msg.value > 0, unicode"La apuesta debe ser mayor que cero");
        
        // Calcular comisión de la plataforma
        uint256 platformFee = (msg.value * PLATFORM_FEE) / FEE_DENOMINATOR;
        uint256 betAmount = msg.value - platformFee;
        
        // Enviar comisión al tesoro
        if (platformFee > 0) {
            (bool success, ) = treasuryAddress.call{value: platformFee}("");
            require(success, unicode"Error al enviar comisión");
        }
        
        // Actualizar la información de la apuesta
        bets[tokenId][msg.sender] += betAmount;
        memes[tokenId].totalBets += 1;
        memes[tokenId].totalPot += betAmount;
        
        // Registrar la apuesta en el historial
        betHistory[tokenId].push(Bet({
            better: msg.sender,
            amount: betAmount,
            timestamp: block.timestamp
        }));
        
        // Actualizar puntuación de viralidad (simulado, en producción sería calculado por un oráculo)
        updateViralityScore(tokenId);
        
        emit BetPlaced(tokenId, msg.sender, betAmount, memes[tokenId].totalPot);
    }
    
    /**
     * @dev Actualiza la puntuación de viralidad de un meme
     * @param tokenId ID del meme
     */
    function updateViralityScore(uint256 tokenId) internal {
        Meme storage meme = memes[tokenId];
        
        // Simular un cálculo de viralidad basado en:
        // 1. Número de apuestas
        // 2. Tamaño total del bote
        // 3. Tiempo transcurrido desde la creación
        
        uint256 timeFactor = (block.timestamp - meme.createdAt) / 1 hours;
        if (timeFactor == 0) timeFactor = 1; // Evitar división por cero
        
        uint256 betFactor = meme.totalBets * 10;
        uint256 potFactor = uint256(meme.totalPot / 1 ether) * 5;
        
        // Fórmula simple de viralidad: (apuestas * 10 + bote * 5) / (horas + 1)
        uint256 newScore = (betFactor + potFactor) / timeFactor;
        
        // Guardar la nueva puntuación
        meme.viralityScore = newScore;
        meme.lastUpdateTime = block.timestamp;
        
        emit ViralityScoreUpdated(tokenId, newScore);
        
        // Si supera el umbral de viralidad y ha pasado el tiempo mínimo, marcar como viral
        if (newScore >= VIRALITY_THRESHOLD && 
            (block.timestamp - meme.createdAt) >= MIN_VIRAL_DURATION) {
            markMemeAsViral(tokenId);
        }
    }

    /**
     * @dev Marca un meme como viral cuando supera el umbral de viralidad
     * @param tokenId ID del meme
     */
    function markMemeAsViral(uint256 tokenId) internal 
        memeExists(tokenId) 
        memeIsActive(tokenId) 
    {
        Meme storage meme = memes[tokenId];
        meme.isActive = false;
        
        emit MemeWentViral(tokenId, meme.totalPot, meme.viralityScore);
    }
    
    /**
     * @dev Permite al propietario del contrato forzar el marcado de un meme como viral
     * @param tokenId ID del meme
     */
    function forceMarkMemeAsViral(uint256 tokenId) external 
        onlyOwner 
        memeExists(tokenId) 
        memeIsActive(tokenId)
    {
        // Esta función sería útil para integrar con sistemas externos de monitoreo
        // de redes sociales que detecten la viralidad real
        Meme storage meme = memes[tokenId];
        meme.isActive = false;
        
        emit MemeWentViral(tokenId, meme.totalPot, meme.viralityScore);
    }

    /**
     * @dev Permite a un creador reclamar recompensas por un meme viral
     * @param tokenId ID del meme
     */
    function claimCreatorRewards(uint256 tokenId) external 
        memeExists(tokenId) 
        memeIsViral(tokenId) 
        onlyMemeCreator(tokenId)
        nonReentrant 
    {
        Meme storage meme = memes[tokenId];
        
        // El creador recibe el 50% del bote
        uint256 creatorShare = (meme.totalPot * 50) / 100;
        
        // Verificar que hay fondos para reclamar
        require(creatorShare > 0, unicode"No hay recompensas para reclamar");
        
        // Marcar como reclamado reduciendo el bote
        meme.totalPot -= creatorShare;
        
        // Transferir las recompensas al creador
        (bool success, ) = msg.sender.call{value: creatorShare}("");
        require(success, unicode"Error al enviar recompensas");
        
        emit RewardsClaimed(tokenId, msg.sender, creatorShare, true);
    }
    
    /**
     * @dev Permite a un apostador reclamar recompensas por un meme viral
     * @param tokenId ID del meme
     */
    function claimBetterRewards(uint256 tokenId) external 
        memeExists(tokenId) 
        memeIsViral(tokenId) 
        hasBet(tokenId)
        nonReentrant 
    {
        Meme storage meme = memes[tokenId];
        
        // El 50% del bote se distribuye entre los apostadores
        uint256 betterShare = (meme.totalPot * 50) / 100;
        
        // La porción del apostador es proporcional a su apuesta
        uint256 userBet = bets[tokenId][msg.sender];
        uint256 userReward = (betterShare * userBet) / meme.totalPot;
        
        // Verificar que hay recompensas para reclamar
        require(userReward > 0, unicode"No hay recompensas para reclamar");
        
        // Marcar como reclamado
        bets[tokenId][msg.sender] = 0;
        
        // Transferir las recompensas al apostador
        (bool success, ) = msg.sender.call{value: userReward}("");
        require(success, unicode"Error al enviar recompensas");
        
        emit RewardsClaimed(tokenId, msg.sender, userReward, false);
    }

    /**
     * @dev Obtiene la información de un meme
     * @param tokenId ID del meme
     * @return Estructura Meme con la información
     */
    function getMemeInfo(uint256 tokenId) public view 
        memeExists(tokenId) 
        returns (Meme memory) 
    {
        return memes[tokenId];
    }

    /**
     * @dev Obtiene la cantidad apostada por un usuario en un meme
     * @param tokenId ID del meme
     * @param user Dirección del usuario
     * @return Cantidad apostada
     */
    function getBetAmount(uint256 tokenId, address user) public view 
        memeExists(tokenId) 
        returns (uint256) 
    {
        return bets[tokenId][user];
    }
    
    /**
     * @dev Obtiene el historial de apuestas para un meme
     * @param tokenId ID del meme
     * @return Array de apuestas
     */
    function getBetHistory(uint256 tokenId) public view 
        memeExists(tokenId) 
        returns (Bet[] memory) 
    {
        return betHistory[tokenId];
    }
    
    /**
     * @dev Obtiene los memes más virales (no implementado completamente)
     * @param limit Número máximo de memes a devolver
     * @return Array de IDs de memes ordenados por viralidad
     */
    function getTopViralMemes(uint256 limit) public view returns (uint256[] memory) {
        // En una implementación real, esto requeriría un sistema de indexación o un algoritmo eficiente
        // Esta es una implementación simplificada para demostración
        
        uint256 count = _nextTokenId < limit ? _nextTokenId : limit;
        uint256[] memory result = new uint256[](count);
        
        // Esta es una implementación dummy que solo devuelve los primeros `limit` memes
        // En producción, se implementaría un algoritmo de ordenación adecuado
        for (uint256 i = 0; i < count; i++) {
            result[i] = i;
        }
        
        return result;
    }
} 