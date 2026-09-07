// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LoanEscrow.sol";

contract LenderLiquidityPool {

    struct Offer {
        address lender;
        uint256 amount;
        uint256 duration;
        uint256 minCreditScore;
        bool active;
    }

    uint256 public offerCounter;
    mapping(uint256 => Offer) public offers;
    address public protocol;     // backend wallet
    address public loanEscrow;   // LoanEscrow contract

    error NotLender();
    error OfferInactive();
    error NotAuthorized();
    error TransferFailed();

    event OfferCreated(uint256 indexed offerId, address indexed lender);
    event OfferWithdrawn(uint256 indexed offerId);
    event OfferAccepted(
        uint256 indexed offerId,
        uint256 indexed loanId,
        address borrower
    );

    /*//////////////////////////////////////////////////////////////
                          CONFIGURATION
    //////////////////////////////////////////////////////////////*/

    function setProtocol(address _protocol) external {
        if (protocol != address(0)) revert NotAuthorized();
        protocol = _protocol;
    }

    function setLoanEscrow(address _loanEscrow) external {
        if (loanEscrow != address(0)) revert NotAuthorized();
        loanEscrow = _loanEscrow;
    }

    modifier onlyProtocol() {
        if (msg.sender != protocol) revert NotAuthorized();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                          LENDER ACTIONS
    //////////////////////////////////////////////////////////////*/

    function createOffer(
        uint256 duration,
        uint256 minCreditScore
    ) external payable {
        require(msg.value > 0, "Zero amount");
        offerCounter++;

        offers[offerCounter] = Offer({
            lender: msg.sender,
            amount: msg.value,
            duration: duration,
            minCreditScore: minCreditScore,
            active: true
        });
        emit OfferCreated(offerCounter, msg.sender);
    }

    function withdrawOffer(uint256 offerId) external {
        Offer storage offer = offers[offerId];
        if (offer.lender != msg.sender) revert NotLender();
        if (!offer.active) revert OfferInactive();

        offer.active = false;
        
        // FIX: Use .call instead of .transfer
        (bool success, ) = payable(msg.sender).call{value: offer.amount}("");
        if (!success) revert TransferFailed();

        emit OfferWithdrawn(offerId);
    }

    /*//////////////////////////////////////////////////////////////
                      BACKEND-ONLY ACTION
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Accept lender offer and create loan
     * @dev Called ONLY by backend (protocol signer)
     */
    function acceptOffer(
        uint256 offerId,
        address borrower,
        uint256 interest,
        bool isInsured,
        address insurer
    ) external onlyProtocol {
        Offer storage offer = offers[offerId];
        if (!offer.active) revert OfferInactive();

        offer.active = false;
        uint256 principal = offer.amount;

        LoanEscrow(loanEscrow).createFromOffer{ value: principal }(
            borrower,
            offer.lender,
            principal,
            interest,
            offer.duration,
            isInsured,
            insurer
        );

        emit OfferAccepted(
            offerId,
            LoanEscrow(loanEscrow).loanCounter(),
            borrower
        );
    }
}