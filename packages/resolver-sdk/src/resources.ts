import { BlockchainResources, SupportedNetwork } from "./types";

export const blockchainResources: Record<SupportedNetwork, BlockchainResources> = {
  Preprod: {
    domainAddress: "addr_test1wz4nwshydh5slejv0xfus07cdu3009qek6y45r0u3xhddncmmczcp",
    domainPolicy: "08f134d9e639c6ab0e06644e6889b48e7c281ebe3366a6439b70f375",
    subdomainAddress: "addr_test1wqua0zwztv8g9mwyzweftl45dx04j33xgnrwp0y9uly3testykhn9",
    subdomainPolicy: "32e312dda534b51f87f68e687c86b27accea8dc0b4ea8c0ba83f056d",
  },
  Mainnet:{
    domainAddress: "addr1wxg2n6kp224ku5zg4ulsa4ldqcpfrzmwykuvn5dm0flj5kgv36pn3",
    domainPolicy: "49933b20c73dae19926b4ee0d7330f2c167c53414fa0c8308e2768d6",
    subdomainAddress: "addr1w9a08wh0c5xakve45nhxu8q6h4lk3y3f69g5hdq2z29cd0gsxvcnu",
    subdomainPolicy: "bb92a9fb6f37585d502de854aacc9b7e91269144319ce444c091a590",
  }
};
