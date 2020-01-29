pragma solidity 0.5.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import "./ILiquidityProvider.sol";

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
    ILiquidityProvider public liquidityProvider; // KOD needs a way to flip native ETH to ERC20 tokens

    function setLiquidityProvider(ILiquidityProvider _liquidityProvider) public onlyOwner returns (bool) {
        liquidityProvider = _liquidityProvider;
        return true;
    }

    function flipToApprovedToken() public returns (bool) {
        liquidityProvider.flipEthToERC20(address(this).balance, approvedToken, address(this));
        return true;
    }
}