// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title PromiseCheckinVault
/// @notice Minimal Base mini app contract for one-wallet daily promise check-ins.
contract PromiseCheckinVault {
    uint256 private constant DAY_SECONDS = 1 days;

    struct PromiseState {
        uint64 lastDay;
        uint32 streak;
        bool active;
    }

    mapping(address => PromiseState) private promises;

    event PromiseCreated(address indexed owner, string title);
    event PromiseCheckedIn(
        address indexed owner,
        uint256 indexed dayId,
        uint256 streak,
        bytes32 proofHash
    );

    error EmptyPromiseTitle();
    error TitleTooLong();
    error ActivePromiseExists();
    error PromiseNotFound();
    error AlreadyCheckedInToday();

    constructor() {}

    function createPromise(string calldata title) external {
        bytes calldata titleBytes = bytes(title);
        if (titleBytes.length == 0) revert EmptyPromiseTitle();
        if (titleBytes.length > 96) revert TitleTooLong();

        PromiseState storage state = promises[msg.sender];
        if (state.active) revert ActivePromiseExists();

        state.active = true;
        emit PromiseCreated(msg.sender, title);
    }

    function checkInToday() external returns (bytes32 proofHash) {
        PromiseState storage state = promises[msg.sender];
        if (!state.active) revert PromiseNotFound();

        uint256 dayId = block.timestamp / DAY_SECONDS;
        if (state.lastDay == dayId) revert AlreadyCheckedInToday();

        if (state.lastDay != 0 && state.lastDay + 1 == dayId) {
            state.streak += 1;
        } else {
            state.streak = 1;
        }

        state.lastDay = uint64(dayId);
        proofHash = keccak256(
            abi.encodePacked(block.chainid, address(this), msg.sender, dayId, state.streak)
        );

        emit PromiseCheckedIn(msg.sender, dayId, state.streak, proofHash);
    }
}
