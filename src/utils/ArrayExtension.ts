function groupby<T, K>(arr: Array<T>, keySelector: (v: T) => K): Map<K, Array<T>>
function groupby<T, K, V>(arr: Array<T>, keySelector: (v: T) => K, valueSelector: (v: T) => V): Map<K, Array<V>>
function groupby<T, K, V>(arr: Array<T>, keySelector: (v: T) => K, valueSelector?: (v: T) => V): Map<K, Array<T | V>> {

  let ret = new Map<K, Array<T | V>>();
  arr.forEach((v: T) => {
    let key = keySelector(v);
    let value = valueSelector ? valueSelector(v) : v;
    ret.has(key) ? ret.get(key)?.push(value) : ret.set(key, [value]);
  })

  return ret;
}
export {
    groupby
}