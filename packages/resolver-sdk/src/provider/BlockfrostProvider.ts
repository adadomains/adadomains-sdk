import axios, { AxiosError, AxiosInstance } from "axios";
import { blockchainResources } from "../resources";
import { Asset, AssetType, Datum, SupportedNetwork } from "../types";
import { Provider } from "./Provider";
import { BlockFrostProviderConfig, BlockfrostResponse, ProviderError } from "./types";

export class BlockfrostProvider implements Provider {
  private axiosClient: AxiosInstance;
  private readonly networkConfig: BlockFrostProviderConfig;

  constructor(networkConfig: BlockFrostProviderConfig) {
    this.networkConfig = networkConfig;
    this.axiosClient = axios.create({ timeout: 5000 });
  }

  async getDatum(asset: Asset, assetType: AssetType, network: SupportedNetwork): Promise<Datum> {
    const config = this.networkConfig[network];
    if (!config?.baseUrl || !config?.projectId) {
      throw new ProviderError(400, `${network} is not configured`);
    }

    const resources = blockchainResources[network];
    const address = assetType === "Domain" ? resources.domainAddress : resources.subdomainAddress;

    try {
      const response: BlockfrostResponse[] = (
        await this.axiosClient.get(`${config.baseUrl}/addresses/${address}/utxos/${asset}`, {
          headers: { project_id: config.projectId },
        })
      ).data;

      if (response.length === 0) {
        throw new ProviderError(400, "Asset not found");
      }

      return response[0].inline_datum;
    } catch (error) {
      console.log(error);
      if (error instanceof ProviderError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (Object.hasOwn(error?.response?.data ?? {}, "status_code")) {
          const statusCode = error?.response?.data?.status_code;
          if (statusCode === 404) {
            throw new ProviderError(statusCode, "Domain not found");
          }
        }
      }

      throw new ProviderError(500, "Internal Provider error");
    }
  }
}
