import type { CurrencyInputOptions } from "vue-currency-input";
import { useCurrencyInput } from "vue-currency-input";
export const useBRLCurrency = (
  customOptions: Partial<CurrencyInputOptions> = {}
) => {
  const defaultOptions: CurrencyInputOptions = {
    currency: "BRL",
    locale: "pt-BR",
    currencyDisplay: "symbol" as const,
    precision: 2,
    valueRange: undefined,
    useGrouping: true,
    hideCurrencySymbolOnFocus: false,
    hideGroupingSeparatorOnFocus: false,
    hideNegligibleDecimalDigitsOnFocus: false,
    autoDecimalDigits: true,
    accountingSign: false,
  };

  return useCurrencyInput({
    ...defaultOptions,
    ...customOptions,
  });
};
