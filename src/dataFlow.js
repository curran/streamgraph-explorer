import ReactiveModel from 'reactive-model';

const dataFlow = ReactiveModel();

// Declare reactive properties.
dataFlow
  ('packedData');

// Reactive functions.
dataFlow
  ('packedDataNested', packedData => packedData.nested, 'packedData')
  ('decode', packedData => i => packedData.codeValues[i], 'packedData')
  ('data', (packedDataNested, decode) => {
    // Unpack and decode the data.
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
  }, 'packedDataNested, decode');

dataFlow
  (data => console.log(data[0]), 'data');

export default dataFlow;
