// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ReputationRegistry.sol";
import "./InsurancePool.sol";

/**
 * @title LoanEscrow
 * @author CredLoom
 *
 * @notice
 * Manages active loans created from pre-funded lender offers.
 * Funds are escrowed BEFORE loan creation via LiquidityPool.
 * This contract:
 * - Instantiates loans from accepted offers
 * - Releases escrowed funds to borrower
 * - Enforces repayment & deadlines
 * - Handles defaults & insurance payouts
 * - Permanently flags bad borrowers
 */
contract LoanEscrow {

    /*//////////////////////////////////////////////////////////////
                                TYPES
    //////////////////////////////////////////////////////////////*/

    enum LoanState {
        FUNDED,
        REPAID,
        DEFAULTED
    }

    struct Loan {
        address borrower;
        address lender;
        address insurer;
        uint256 principal;
        uint256 interest;
        uint256 duration;
        // seconds
        uint256 deadline;
        // timestamp
        bool isInsured;
        LoanState state;
    }

    /*//////////////////////////////////////////////////////////////
                              STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 public loanCounter;
    mapping(uint256 => Loan) public loans;

    ReputationRegistry public reputationRegistry;
    InsurancePool public insurancePool;
    /// @dev Liquidity pool allowed to inject escrowed funds
    address public liquidityPool;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event LoanFunded(
        uint256 indexed loanId,
        address indexed borrower,
        address indexed lender
    );
    event LoanRepaid(uint256 indexed loanId);
    event LoanDefaulted(uint256 indexed loanId);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error BorrowerFlagged();
    error InvalidState();
    error NotBorrower();
    error DeadlineNotPassed();
    error IncorrectAmount();
    error NotAuthorized();
    error TransferFailed();

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address _reputationRegistry,
        address _insurancePool
    ) {
        reputationRegistry = ReputationRegistry(_reputationRegistry);
        insurancePool = InsurancePool(_insurancePool);
    }

    /*//////////////////////////////////////////////////////////////
                          CONFIGURATION
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice One-time wiring of LiquidityPool
     */
    function setLiquidityPool(address _liquidityPool) external {
        if (liquidityPool != address(0)) revert NotAuthorized();
        liquidityPool = _liquidityPool;
    }

    /*//////////////////////////////////////////////////////////////
                        LOAN CREATION (ESCROW)
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Creates a loan from a pre-funded lender offer
     * @dev Called ONLY by LiquidityPool
     * @dev ETH is already escrowed and forwarded in msg.value
     */
    function createFromOffer(
        address borrower,
        address lender,
        uint256 principal,
        uint256 interest,
        uint256 duration,
        bool isInsured,
        address insurer
    ) external payable {
        if (msg.sender != liquidityPool) {
            revert NotAuthorized();
        }

        if (msg.value != principal) {
            revert IncorrectAmount();
        }

        if (!reputationRegistry.isBorrowerClean(borrower)) {
            revert BorrowerFlagged();
        }

        loanCounter++;

        loans[loanCounter] = Loan({
            borrower: borrower,
            lender: lender,
            insurer: insurer,
            principal: principal,
            interest: interest,
            duration: duration,
            deadline: block.timestamp + duration,
            isInsured: isInsured,
            state: LoanState.FUNDED
        });

        // Release funds to borrower
        // FIX: Use .call instead of .transfer to prevent gas limit issues
        (bool success, ) = payable(borrower).call{value: principal}("");
        if (!success) revert TransferFailed();

        emit LoanFunded(loanCounter, borrower, lender);
    }

    /*//////////////////////////////////////////////////////////////
                          REPAYMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Borrower repays loan before deadline
     * @dev Anyone can repay on behalf of the borrower
     */
    function repayLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];

        // FIX: Removed strict msg.sender == borrower check
        // This allows recovery or 3rd party repayment

        if (loan.state != LoanState.FUNDED) {
            revert InvalidState();
        }

        if (msg.value != loan.principal + loan.interest) {
            revert IncorrectAmount();
        }

        loan.state = LoanState.REPAID;

        // FIX: Use .call instead of .transfer
        (bool success, ) = payable(loan.lender).call{value: msg.value}("");
        if (!success) revert TransferFailed();

        emit LoanRepaid(loanId);
    }

    /*//////////////////////////////////////////////////////////////
                          DEFAULT HANDLING
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Anyone can trigger default after deadline
     */
    function markDefault(uint256 loanId) external {
        Loan storage loan = loans[loanId];

        if (loan.state != LoanState.FUNDED) {
            revert InvalidState();
        }

        if (block.timestamp <= loan.deadline) {
            revert DeadlineNotPassed();
        }

        loan.state = LoanState.DEFAULTED;

        // Insurance payout (if applicable)
        // FIX: Wrapped in try/catch to ensure borrower flagging happens
        // even if insurer is insolvent or payout fails.
        if (loan.isInsured) {
            try insurancePool.payout(
                loan.insurer,
                loan.lender,
                loan.principal
            ) {
                // Payout succeeded
            } catch {
                // Payout failed (insolvency), but we continue to flag borrower
            }
        }

        // Permanent borrower reputation damage
        reputationRegistry.flagBorrower(loan.borrower);
        emit LoanDefaulted(loanId);
    }
}