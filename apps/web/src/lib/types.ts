import type { ComponentType } from "svelte";

import type { EnrichedTransaction } from "helius-sdk";

import type {
    ProtonActionType,
    ProtonTransaction,
    ProtonTransactionAction,
} from "@helius-labs/xray";

import type { IconPaths, modals } from "$lib/config";

export * from "$lib/config";

export interface UIConfig {
    dev: boolean;
    devMode: boolean;
    isMocked: boolean;
    name: string;
    version: string;
}

export interface UIAccount {
    publicKey: string;
    transactions: Array<any>;
}
export interface UITransaction {
    parsed: ProtonTransaction;
    raw: EnrichedTransaction;
}

export interface UITokenMetadataAttribute {
    trait_type?: string;
    traitType?: string;
    value: string;
}
export interface UITokenMetadataCreators {
    address: string;
    share: number;
    verified: boolean;
}
export interface UITokenMetadata {
    address: string;
    image: string;
    name: string;
    collectionKey: string;
    description?: string;
    attributes?: UITokenMetadataAttribute[];
    creators?: UITokenMetadataCreators[];
    price?: number;
}

export type Icon = keyof typeof IconPaths;

export interface TransactionActionMetadata {
    icon: Icon;
    label: string;
    filterLabel?: string;
}

export interface TransactionPage {
    result: Array<ProtonTransaction>;
    oldest: string;
}

export interface UITransactionActionGroup {
    label: string;
    icon: Icon;
    type: string;
    actions: ProtonTransactionAction[];
    timestamp: number;
}

export interface TRPCTransactionsOutput {
    result: Array<ProtonTransaction>;
    oldest: string;
}

export interface Modal {
    title: string;
    component: ComponentType;
    showClose?: boolean;
    fullscreen?: boolean;
    props?: Record<string, any>;
}

// simple dict with string keys
export type Dict<T> = Map<string, T>;

export type FetchModel<T> = {
    error?: any;
    data: T;
    isLoading?: boolean;
    hasFetched?: boolean;
    nextCursor?: string;
};

export type TransactionsInput = {
    account: string;
    filter?: string;
    cursor?: string;
    user?: string;
};

export type AssetsInput = {
    limit: number;
    ownerAddress: string;
    page: number;
    sortBy: {
        sortBy: string;
        sortDirection: "asc";
    };
};

export type Asset = {
    type: "das" | "token";
    id: string;
    name: string;
    symbol: string;
    description: string;
    image: string;
    image_preview: string;
    attributes: {
        traitType: string;
        value: string;
    }[];
};

export type Modals = keyof typeof modals;
