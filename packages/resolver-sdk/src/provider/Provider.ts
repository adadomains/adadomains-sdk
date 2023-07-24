import { Asset, AssetType, Datum, SupportedNetwork } from "../types";

export interface Provider {
  getDatum: (asset: Asset, assetType: AssetType, network: SupportedNetwork) => Promise<Datum>;
}
