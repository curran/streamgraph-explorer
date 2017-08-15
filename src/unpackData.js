// Unpack and decode the data.
const unpackData = packedData => {
  const packedDataNested = packedData.nested;
  const decode = i => packedData.codeValues[i];
  const data = [];
  const years = Object.keys(packedDataNested);
  years.forEach(year => {
    const nestedByType = packedDataNested[year];
    const types = Object.keys(nestedByType);
    types.forEach(type => {
      const nestedBySrcCode = nestedByType[type];
      const srcCodes = Object.keys(nestedBySrcCode);
      srcCodes.forEach(srcCode => {
        const src = decode(srcCode);
        const valueByDestCode = nestedBySrcCode[srcCode];
        const destCodes = Object.keys(valueByDestCode);
        destCodes.forEach(destCode => {
          const dest = decode(destCode);
          const value = valueByDestCode[destCode];
          data.push({ year, type, src, dest, value });
        });
      });
    });
  });
  return data;
};

export default unpackData;
