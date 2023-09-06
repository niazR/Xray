import { t } from "$lib/trpc/t";
import { parseTransaction } from "$lib/xray";
import type { EnrichedTransaction } from "helius-sdk";

import { z } from "zod";

const { HELIUS_API_KEY } = process.env;

type SignaturesResponse = {
    jsonrpc: string;
    result: {
        total: number;
        limit: number;
        page: number;
        items: string[][];
    };
    id: string;
};

export const cnftTransactions = t.procedure
    .input(
        z.object({
            account: z.string(),
            cursor: z.number().optional().default(1),
        })
    )
    .query(async ({ input }) => {
        const url = `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`;

        const response: SignaturesResponse = await fetch(url, {
            body: JSON.stringify({
                id: "signatures",
                jsonrpc: "2.0",
                method: "getSignaturesForAsset",
                params: {
                    id: input.account,
                    limit: 50,
                    page: input.cursor,
                },
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        }).then((res) => res.json());

        const signatures = response.result.items.map(
            ([signature]) => signature
        );

        const transactionUrl = `https://api.helius.xyz/v0/transactions/?api-key=${HELIUS_API_KEY}`;

        const transactions: EnrichedTransaction[] =
            (await fetch(transactionUrl, {
                body: JSON.stringify({
                    transactions: signatures,
                }),
                method: "POST",
            }).then((res) => res.json())) || [];

        const result = transactions.map((tx) => parseTransaction(tx)) || [];

        return {
            page: input.cursor + 1,
            result,
        };
    });