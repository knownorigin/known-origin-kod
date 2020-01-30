pragma solidity 0.5.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import "./mock/WETH9.sol";

contract GuildBank is Ownable {
    using SafeMath for uint256;

    IERC20 public approvedToken; // approved token contract reference

    event Withdrawal(address indexed receiver, uint256 amount);

    constructor(address approvedTokenAddress) public {
        approvedToken = IERC20(approvedTokenAddress);
    }

    function withdraw(address receiver, uint256 shares, uint256 totalShares) public onlyOwner returns (bool) {
        uint256 amount = approvedToken.balanceOf(address(this)).mul(shares).div(totalShares);
        emit Withdrawal(receiver, amount);
        return approvedToken.transfer(receiver, amount);
    }

    // Non-moloch v1 code below

    // allow direct ETH to be sent to the bank
    function() external payable {}

    // this allows us to flip the ETH accrued
    // presumes the IERC20 has a defualt payment to convert ETH to token
    // wETH does as we will be using that!
    function flip() public returns (bool) {
        (bool success,) = address(approvedToken).call.value(address(this).balance)("");
        require(success, "Conversion failed :(");
        return success;
    }
}