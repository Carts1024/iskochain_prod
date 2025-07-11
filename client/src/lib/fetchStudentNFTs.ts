import { createClient, gql } from 'urql';
import { cacheExchange, fetchExchange } from "@urql/core";

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
if (!SUBGRAPH_URL) {
  throw new Error("NEXT_PUBLIC_SUBGRAPH_URL environment variable is not set");
}

const client = createClient({
  url: SUBGRAPH_URL,
  exchanges: [cacheExchange, fetchExchange],
});

const CREDENTIALS_AND_TRANSFERS = gql`
  query CredentialsAndTransfers($owner: Bytes!) {
    transfers(where: { to: $owner }, orderBy: blockTimestamp, orderDirection: desc) {
      id
      from
      to
      tokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export async function fetchCredentialsAndTransfers(walletAddress: string) {
  const owner = walletAddress.toLowerCase();
  const result = await client
    .query(CREDENTIALS_AND_TRANSFERS, { owner })
    .toPromise();

  if (result.error) throw new Error(result.error.message);

  return {
    credentials: result.data.credentials,
    transfers: result.data.transfers,
  };
}