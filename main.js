var DeviceApiWeb = require('deviceatlas-deviceapi').DeviceApiWeb;

var deviceApi = (function () {
    var devApi = new DeviceApiWeb();

    try {
        devApi.loadDataFromFile('path/to/the/data/file.json');
    } catch (ex) {
        devApi.error = ex;
        console.log(ex.message);
    }

    return devApi;
})();


module.exports.ApiValues = function (request) {

    if (typeof deviceApi.error != 'undefined') {
        throw deviceApi.error;
    }

    this.api = {
        deviceApiVersion: deviceApi.apiVersion,
        dataVersion: deviceApi.tree.getDataVersion(),
        dataCreationTimestamp: deviceApi.tree.getDataCreationTimestamp()
    };

    console.log(request.headers['user-agent']);
    var properties = deviceApi.getPropertiesFromRequest(request);

    this.allProperties = allProperties(properties);
    this.propertiesExampleUsage = propertiesExampleUsage(properties);
};


function allProperties(properties) {
    var props = {};

    for (var name in properties.getMap()) {
        props[name] = {};
        props[name]['value'] = properties.get(name).getValue();
        props[name]['dataType'] = properties.get(name).getDataType();
    }
    return props;
};

function propertiesExampleUsage(properties) {

    var isMobileDevice = properties.contains('mobileDevice', true);

    var isSamsung = properties.contains('vendor', 'Samsung');

    var browserName = properties.containsKey('browserName') ?
        properties.get('browserName').getValue() : 'not available';

    var yearReleased = properties.containsKey('yearReleased') ?
        properties.get('yearReleased').getValue() : 'not available';

    var vendorDataType = properties.containsKey('vendor') ? properties.get('vendor').getDataType() : 'undefined';

    return {
        isMobileDevice: isMobileDevice,
        isSamsung: isSamsung,
        browserName: browserName,
        yearReleased: yearReleased,
        vendorDataType: vendorDataType
    };
};