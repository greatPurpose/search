import COMMON_TOKENS from './common-tokens.json';

export const formatMoney = (v) => {
    
  const s = v? Number(v).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2}): '0';
  return s.replace(',','');
}

export const formatMoneyPlus = (v) => {
  let p = '';
  if(v >= 0) p = '+';
  return p+v.toLocaleString(undefined,{minimumFractionDigits: 0, maximumFractionDigits: 2});

}
export const formatNumber = (v) => {
  return Number(v).toLocaleString(undefined,{minimumFractionDigits: 0, maximumFractionDigits: 2}).replace(',','');
}

export const formatNumberPlus = (v) => {
  let p = '';
  if(v >= 0) p = '+';
  return p+Number(v).toLocaleString(undefined,{minimumFractionDigits: 0, maximumFractionDigits: 0});
}

export const getConcentrated = (text) => {
  if(text.length > 12)
    return text.slice(0,10)+'...'+text.slice(-10);
  else
    return text;
}

export const getConcentratedAddr = (text) => {
  if (text.length > 10)
      return text.slice(0,6)+'...'+text.slice(-4);
  else
      return text;
}

export const formatFirstText = (v, length = 6) => {
  if(v === undefined || v == 0 || v == null) {
    return '0'.repeat(length);
  } else {
    let s = formatNumber(v);
    
    s = s.replace('.','');
    if (s.length > length) return '';
    return '0'.repeat(length-s.length);
  }
}

export const formatSecondText = (v, length = 6) => {
  if(v === undefined || v == 0 || v == null) {
    return '';
  } else {
    return formatNumber(v);
  }
}

export const isValidAddress = (maybeAddress) => {
  if (typeof maybeAddress !== "string") {
      return false;
  }
  return /^0x[a-fA-F0-9]{40}$/.test(maybeAddress);
}

export const getCommonTokenAddress = (networkId, ticker) => {
  if (!COMMON_TOKENS[networkId]) {
      return null;
  }
  const address = COMMON_TOKENS[networkId][ticker];
  if (!address) {
      return null;
  }
  return address;
}

