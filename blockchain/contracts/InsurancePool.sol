// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InsurancePool
 * @author CredLoom
 *
 * @notice
 * Holds insurer capital and guarantees automatic lender payouts on borrower default.
 * Insurers must pre-fund this contract.
 *
 * Rules:
 * - Only LoanEscrow contract can trigger payouts
 * - Insurers cannot block or cancel payouts
 * - Payouts fail if insurer balance is insufficient
 */
contract InsurancePool {

    /// @dev Address of LoanEscrow contract
    address public loanEscrowContract;

    /// @dev insurer => available insured balance
    mapping(address => uint256) private insurerBalance;

    /// @notice Emitted when insurer deposits funds
    event InsurerDeposited(address indexed insurer, uint256 amount);

    /// @notice Emitted when insurance payout is executed
    event InsurancePayout(
        address indexed insurer,
        address indexed lender,
        uint256 amount
    );

    /// @notice Unauthorized caller
    error NotAuthorized();

    /// @notice Insufficient insurer balance
    error InsufficientBalance();

    /**
     * @notice Sets the LoanEscrow contract address (one-time)
     */
    function setLoanEscrowContract(address _loanEscrow) external {
        if (loanEscrowContract != address(0)) {
            revert NotAuthorized();
        }
        loanEscrowContract = _loanEscrow;
    }

    /**
     * @notice Insurer deposits funds to cover loans
     */
    function deposit() external payable {
        require(msg.value > 0, "Zero deposit");
        insurerBalance[msg.sender] += msg.value;
        emit InsurerDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Pays lender on borrower default
     * @dev Can only be called by LoanEscrow contract
     */
    function payout(
        address insurer,
        address lender,
        uint256 amount
    ) external {
        if (msg.sender != loanEscrowContract) {
            revert NotAuthorized();
        }

        if (insurerBalance[insurer] < amount) {
            revert InsufficientBalance();
        }

        insurerBalance[insurer] -= amount;
        payable(lender).transfer(amount);

        emit InsurancePayout(insurer, lender, amount);
    }

    /**
     * @notice Returns insurer available balance
     */
    function getInsurerBalance(address insurer) external view returns (uint256) {
        return insurerBalance[insurer];
    }
}
