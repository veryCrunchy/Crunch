declare module "node-cache" {
  export interface Options {
    /* Define the options here based on your usage */
    stdTTL?: number;
    checkperiod?: number;
    useClones?: boolean;
  }

  export default class NodeCache<K, V> {
    constructor(options?: Options);

    set(key: K, value: V, ttl?: number): boolean;
    get(key: K): V | undefined;
    /* Add other methods you are using in your code */

    /* Add any additional types or interfaces you need */
  }
}
