pragma solidity 0.5.10;

interface ISelfServeEditionCuration {
    function createEditionFor(
        address _artist,
        bool _enableAuction,
        address _optionalSplitAddress,
        uint256 _optionalSplitRate,
        uint256 _totalAvailable,
        uint256 _priceInWei,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _artistCommission,
        uint256 _editionType,
        string calldata _tokenUri
    )
    external
    returns (uint256 _editionNumber);
}