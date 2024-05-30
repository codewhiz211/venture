
const lrvTimberError = (fieldValue, sourceFieldValue) => {
    return fieldValue < 45 &&
        (sourceFieldValue === 'Timber Weatherboard 150mm Cover' || sourceFieldValue === 'Timber Vertical Weatherboard 150mm Cover');
};

const lrvRockcoteError = (fieldValue, sourceFieldValue) => {
    return fieldValue < 25 &&
        (sourceFieldValue === 'Rockcote plaster');
};

export const errorsConfig = [
    { id: 1, field: 'lrv1', sourceField: 'claddingType',  method: lrvTimberError, msg: 'Error: LRV should be greater than 45% when using Timber Weatherboard' },
    { id: 2, field: 'lrv1', sourceField: 'claddingType', method: lrvRockcoteError, msg: 'Error: LRV should be greater than 25% when using Rockcote plaster' },
    { id: 3, field: 'lrv2', sourceField: 'claddingType',  method: lrvTimberError, msg: 'Error: LRV should be greater than 45% when using Timber Weatherboard' },
    { id: 4, field: 'lrv2', sourceField: 'claddingType', method: lrvRockcoteError, msg: 'Error: LRV should be greater than 25% when using Rockcote plaster' },
];
