export const numberFormat = (number: number | string) =>
  new Intl.NumberFormat().format(Number(number));

export const showSortAddress = (address?: string): string => {
  return `${address?.substring(0, 4)}...${address?.substring(
    address.length - 4,
    address.length
  )}`;
};

export const formatAccountBalance = (balance: number) => {
  const suffixes = ["", "k", "m", "b", "t"];
  const suffixNum = Math.floor(balance.toString().length / 3) - 1;
  let shortBalance = parseFloat(
    (suffixNum !== 0
      ? balance / Math.pow(1000, suffixNum)
      : balance
    ).toPrecision(3)
  );

  if (shortBalance % 1 !== 0) {
    return shortBalance.toFixed(1) + suffixes[suffixNum];
  }

  return shortBalance + suffixes[suffixNum];
};

export const showTransactionHash = (tranHash: String) => {
  return `${tranHash?.substring(0, 10)}
  ${"".padStart(5, "*")}
  ${tranHash?.substring(tranHash.length - 10, tranHash.length)}`;
};
