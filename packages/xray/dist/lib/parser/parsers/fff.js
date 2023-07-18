import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { traverseAccountData } from "../utils/account-data";
export const parseBorrowFox = (transaction, address) => {
    const { type, source, signature, timestamp, tokenTransfers, accountData } = transaction;
    const fee = transaction.fee / LAMPORTS_PER_SOL;
    const actions = [];
    const accounts = [];
    if (tokenTransfers === null) {
        return {
            accounts,
            actions,
            fee,
            primaryUser: "",
            signature,
            source,
            timestamp,
            type,
        };
    }
    const primaryUser = tokenTransfers[0]?.fromUserAccount || "";
    for (let i = 0; i < tokenTransfers.length; i++) {
        const tx = tokenTransfers[i];
        const from = tx?.fromUserAccount || "";
        const to = tx?.toUserAccount || "";
        const amount = tx?.tokenAmount;
        // This is the first transfer, which is the foxy transfer
        if (i === 0) {
            if (!address) {
                const sent = tx?.mint;
                actions.push({
                    actionType: "TRANSFER",
                    amount,
                    from,
                    sent,
                    to,
                });
            }
            else {
                const actionType = tx.fromUserAccount === address
                    ? "TRANSFER_SENT"
                    : "TRANSFER_RECEIVED";
                if (actionType === "TRANSFER_SENT") {
                    const sent = tx?.mint;
                    actions.push({
                        actionType,
                        amount,
                        from,
                        sent,
                        to,
                    });
                }
                else if (actionType === "TRANSFER_RECEIVED") {
                    const received = tx?.mint;
                    actions.push({
                        actionType,
                        amount,
                        from,
                        received,
                        to,
                    });
                }
            }
            // This is the second transfer, which is the foxy burn
        }
        else if (i === 1) {
            const sent = tx?.mint;
            actions.push({
                actionType: "BURN",
                amount,
                from,
                sent,
                to,
            });
        }
    }
    traverseAccountData(accountData, accounts);
    return {
        accounts,
        actions,
        fee,
        primaryUser,
        signature,
        source,
        timestamp,
        type,
    };
};
export const parseLoanFox = (transaction) => {
    const { signature, timestamp, type, source, accountData } = transaction;
    const fee = transaction.fee / LAMPORTS_PER_SOL;
    const actions = [];
    const accounts = [];
    if (!accountData) {
        return {
            accounts,
            actions,
            fee,
            primaryUser: "",
            signature,
            source,
            timestamp,
            type,
        };
    }
    const primaryUser = accountData[0]?.account || "";
    const sent = accountData[8]?.account;
    actions.push({
        actionType: "FREEZE",
        amount: 0,
        from: primaryUser,
        sent,
        to: "",
    });
    traverseAccountData(accountData, accounts);
    return {
        accounts,
        actions,
        fee,
        primaryUser,
        signature,
        source,
        timestamp,
        type,
    };
};
