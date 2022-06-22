/** @deprecated */
export const CNYCurrency = Intl.NumberFormat('zh-CN', {
  currency: 'CNY',
  style: 'currency',
  currencyDisplay: 'narrowSymbol',
  currencySign: 'standard',
  minimumFractionDigits: 0, // 最小小數
  maximumFractionDigits: 2,
  minimumIntegerDigits: 1 // 最小整數位數
});