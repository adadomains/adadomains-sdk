import axios, { AxiosInstance } from "axios";

export function recordKeys<K extends PropertyKey, T>(object: Record<K, T>): Array<K> {
  return Object.keys(object) as K[];
}

export function recordEntries<K extends PropertyKey, T>(object: Record<K, T>): Array<T> {
  return Object.values(object);
}

export type NoInfer<T> = [T, never][T extends any ? 0 : 1];

export type PartialRecord<K extends keyof any, V> = Partial<Record<K, V>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export function createDefaultAxiosClient(): AxiosInstance {
  return axios.create({ timeout: 5000 });
}
