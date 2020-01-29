pragma solidity 0.5.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILiquidityProvider {
    function flipEthToERC20(uint256 quantityInWei, IERC20 erc20Address, address destinationAdress) external returns(uint256);
}