/** Retrieves the Helius RPC API URL for the specified cluster */
export function heliusClusterApiUrl(apiKey, cluster = "devnet") {
    switch (cluster) {
        case "devnet":
            return `https://rpc-devnet.helius.xyz/?api-key=${apiKey}`;
        case "mainnet-beta":
            return `https://rpc.helius.xyz/?api-key=${apiKey}`;
        default:
            return "";
    }
}
