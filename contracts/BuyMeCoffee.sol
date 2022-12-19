// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract BuyMeCoffee {
    address public owner;
    uint256 public ClientCount = 0;

    struct Client {
        uint256 id;
        string ulrImg;
        string description;
        uint256 tipAmount;
        address payable wallet;
    }

    mapping(uint256 => Client) public Coffees;

    constructor()  {
        owner = msg.sender;
    }
    //------- MODIFIERS ----------
    modifier onlyOwner() {
        require(msg.sender == owner, "Onlyowner: user not owner");
        _;
    }

    modifier validateIdCoffees(uint256 _id) {
        require(_id > 0 && _id <= ClientCount, "Id: not fount" );
        _;
    }

    modifier validateStrings(string memory _ulrImg, string memory _description) {
        require(bytes(_description).length > 0, "description not is null");
        require(bytes(_ulrImg).length > 0, "Image URl not is null");
        _;
    }

    //------ EVENTS ------
    event ClientCreated(
        uint256 indexed teamId,
        string ulrImg,
        string _description,
        uint256 amountBetted,
        address payable wallet
    );

    event CoffeesTipped(
        uint256 indexed teamId,
        uint256 amountBetted
    );


    // EXTERNAL
    function tipCoffee(uint256 _id) external payable validateIdCoffees(_id) {
        Client memory _Client = Coffees[_id];
        address payable _user = _Client.wallet;
        transferEth(_user, msg.value);
        Coffees[_id].tipAmount += msg.value;

        emit CoffeesTipped(
            _id,
            _Client.tipAmount
        );
    }

    //------- INTERNAL -------
    function transferEth(address _to, uint256 amount) internal {
        require(amount >= 0);
        (bool success,) = _to.call{value : amount}("");
        require(success, "something went wrong");
    }

    //------- ADMIN FUNCTIONS -----------
    function CreateUser(string memory _ulrImg, string memory _description, address payable wallet) public onlyOwner validateStrings(_ulrImg, _description) {
        require(wallet != address(0x0));
        ClientCount++;
        Coffees[ClientCount] = Client(
            ClientCount,
            _ulrImg,
            _description,
            0,
            wallet
        );
        emit ClientCreated(ClientCount, _ulrImg, _description, 0, wallet);
    }

    function EditUser(string memory _ulrImg, string memory _description, address payable wallet, uint256 _id) public validateIdCoffees(_id) onlyOwner validateStrings(_ulrImg, _description) {
        require(wallet != address(0x0));
        Coffees[_id] = Client(
            _id,
            _ulrImg,
            _description,
            Coffees[_id].tipAmount,
            wallet
        );
        emit ClientCreated(ClientCount, _ulrImg, _description, 0, wallet);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: newOwner is the zero address"
        );
        owner = newOwner;
    }

}
