const fs = require('fs');
const d3 = Object.assign(require('d3-dsv'), require('d3-collection'), require('d3-format'));
const inputFile = 'time_series.csv';
const outputFile = 'time_series.json';
const csvStringRaw = fs.readFileSync(inputFile, 'utf8');
const csvString = csvStringRaw.substr(170); // Chop off the junk in first few lines.
const csvData = d3.csvParse(csvString);
  
const codes = {}; // value -> code
const codeValues = []; // code -> value
const getCode = value => {
  let code = codes[value];
  if (code === undefined) {
    code = codes[value] = codeValues.length;
    codeValues.push(value);
  }
  return code;
};

// csvData[0]:
//{ Year: '1951',
//  'Country / territory of asylum/residence': 'Australia',
//  Origin: 'Various/Unknown',
//  'Population type': 'Refugees (incl. refugee-like situations)',
//  Value: 180000 }

const data = csvData.map(d => ({
  year: d.Year,
  type: d['Population type'],
  src: getCode(d.Origin),
  dest: getCode(d['Country / territory of asylum/residence']),
  value: +d.Value
}));

const nested = d3.nest()
  .key(d => d.year)
  .key(d => d.type)
  .key(d => d.src)
  .key(d => d.dest)
  .rollup(values => values[0].value)
  .object(data);

const outputObject = { nested, codeValues };
const outputJSON = JSON.stringify(outputObject);
fs.writeFileSync(outputFile, outputJSON);
