// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReputationRegistry
 * @author CredLoom
 *
 * @notice
 * This contract stores irreversible borrower default flags.
 * It replaces collateral by enforcing permanent, on-chain reputation.
 *
 * Rules:
 * - A borrower can be flagged only once
 * - Once flagged, a borrower can NEVER be unflagged
 * - Only authorized LoanEscrow contracts can flag borrowers
 * - No identity, credit score, or personal data is stored
 */
contract ReputationRegistry {

    /// @dev Address allowed to flag borrowers (LoanEscrow contract)
    address public loanEscrowContract;

    /// @dev borrower => permanently flagged
    mapping(address => bool) private flagged;

    /// @notice Emitted when a borrower is permanently flagged
    event BorrowerFlagged(address indexed borrower);

    /// @notice Thrown when caller is not authorized
    error NotAuthorized();

    /// @notice Thrown when borrower is already flagged
    error BorrowerAlreadyFlagged();

    /**
     * @notice Sets the LoanEscrow contract address
     * @dev Can only be set once
     */
    function setLoanEscrowContract(address _loanEscrow) external {
        if (loanEscrowContract != address(0)) {
            revert NotAuthorized();
        }
        loanEscrowContract = _loanEscrow;
    }

    /**
     * @notice Permanently flags a borrower after default
     * @dev Can only be called by LoanEscrow contract
     */
    function flagBorrower(address borrower) external {
        if (msg.sender != loanEscrowContract) {
            revert NotAuthorized();
        }
        if (flagged[borrower]) {
            revert BorrowerAlreadyFlagged();
        }

        flagged[borrower] = true;
        emit BorrowerFlagged(borrower);
    }

    /**
     * @notice Checks whether a borrower is allowed to borrow
     * @return true if borrower has never defaulted
     */
    function isBorrowerClean(address borrower) external view returns (bool) {
        return !flagged[borrower];
    }

    /**
     * @notice Checks whether a borrower is permanently flagged
     */
    function isBorrowerFlagged(address borrower) external view returns (bool) {
        return flagged[borrower];
    }
}
