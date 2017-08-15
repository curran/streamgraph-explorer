import ReactiveModel from 'reactive-model';
import unpackData from './unpackData';

const dataFlow = ReactiveModel();

// Declare reactive properties.
dataFlow('packedData');

// Reactive functions.
dataFlow('data', unpackData, 'packedData');

dataFlow(data => console.log(data[0]), 'data');

export default dataFlow;
