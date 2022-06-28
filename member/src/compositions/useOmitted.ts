export function $omitted (val: string) {
  return val.length > 10 ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` : val;
}