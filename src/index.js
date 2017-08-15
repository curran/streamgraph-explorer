import { json } from 'd3-request';
import dataFlow from './dataFlow';
json('data/time_series.json', packedData => {
  dataFlow.packedData(packedData);
});
//var fs = require('fs'),
//    d3 = Object.assign(
//      require('d3-dsv'),
//      require('d3-collection'),
//      require('d3-array')
//    ),
//    inputFile = 'time_series.csv',
//    outputFile = 'sumByCountryByYear.json',
//    csvString = fs.readFileSync(inputFile, 'utf8'),
//    csvData = d3.csvParse(csvString).map(function (d) {
//      d.Value = +d.Value;
//      //console.log(d['Population type']);
//      return d;
//    }),
//    nested = d3.nest()
//      .key(function (d) { return d.Origin; })
//      .key(function (d) { return d.Year; })
//      .rollup(function(values) {
//        return d3.sum(values, function(d) {
//          return d.Value;
//        })
//      })
//      .entries(csvData),
//    outputJSON = JSON.stringify(nested, null, 2);
//
//fs.writeFileSync(outputFile, outputJSON);
