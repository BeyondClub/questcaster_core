export const shortenAddress = (address: string, chars = 4): null | string => {
  if (!address) {
    return null;
  }
  const parsed = address;
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(
    address.length - chars
  )}`;
};
