import { getSFloat, toDataView } from "../utils";
export const GlucoseMeasurementCallback = (data) => {
    const view = toDataView(data);
    const flags = view.getUint8(0);
    let index = 1;
    let measurement = {};
    const sequenceNumber = view.getUint16(index, true);
    index += 2;
    const year = view.getUint16(index, true);
    index += 2;
    // Months start at 0 in JS
    const month = view.getUint8(index) - 1;
    index += 1;
    const day = view.getUint8(index);
    index += 1;
    const hours = view.getUint8(index);
    index += 1;
    const minutes = view.getUint8(index);
    index += 1;
    const seconds = view.getUint8(index);
    index += 1;
    const baseTime = new Date(year, month, day, hours, minutes, seconds);
    measurement = Object.assign({}, measurement, { sequenceNumber, baseTime });
    const timeOffsetPresent = flags & 0x1;
    if (timeOffsetPresent) {
        const timeOffset = view.getInt16(index, true);
        measurement = Object.assign({}, measurement, { timeOffset });
        index += 2;
    }
    const concentrationTypeAndSampleLocationPresent = flags & 0x2;
    if (concentrationTypeAndSampleLocationPresent) {
        const glucoseConcentrationUnit = (flags & 0x4) ? "mol/L" : "kg/L";
        const glucoseConcentration = getSFloat(view, index);
        index += 2;
        const sampleAndLocationByte = view.getUint8(index);
        index += 1;
        const type = sampleAndLocationByte & 0xF;
        const sampleLocation = (sampleAndLocationByte >> 4) & 0xF;
        measurement = Object.assign({}, measurement, { glucoseConcentrationUnit, glucoseConcentration, type, sampleLocation });
    }
    const sensorStatusAnnunciationPresent = flags & 0x8;
    if (sensorStatusAnnunciationPresent) {
        const sensorStatusBits = view.getUint16(index, true);
        index += 2;
        const sensorStatus = {
            batteryLow: !!(sensorStatusBits & 0x1),
            sensorMalfunction: !!(sensorStatusBits & 0x2),
            sampleSizeInsufficient: !!(sensorStatusBits & 0x4),
            stripInsertionError: !!(sensorStatusBits & 0x8),
            stripTypeIncorrect: !!(sensorStatusBits & 0x10),
            sensorResultTooHigh: !!(sensorStatusBits & 0x20),
            sensorResultTooLow: !!(sensorStatusBits & 0x40),
            sensorTemperatureTooHigh: !!(sensorStatusBits & 0x80),
            sensorTemperatureTooLow: !!(sensorStatusBits & 0x100),
            stripPulledTooSoon: !!(sensorStatusBits & 0x200),
            generalDeviceFault: !!(sensorStatusBits & 0x400),
            timeFault: !!(sensorStatusBits & 0x800)
        };
        measurement = Object.assign({}, measurement, { sensorStatus });
    }
    const contextInformationFollows = !!(flags & 0x10);
    measurement = Object.assign({}, measurement, { contextInformationFollows });
    return measurement;
};
export var GlucoseMeasurementSampleType;
(function (GlucoseMeasurementSampleType) {
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["CAPILLARY_WHOLE_BLOOD"] = 1] = "CAPILLARY_WHOLE_BLOOD";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["CAPILLARY_PLASMA"] = 2] = "CAPILLARY_PLASMA";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["VENOUS_WHOLE_BLOOD"] = 3] = "VENOUS_WHOLE_BLOOD";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["VENOUS_PLASMA"] = 4] = "VENOUS_PLASMA";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["ARTERIAL_WHOLE_BLOOD"] = 5] = "ARTERIAL_WHOLE_BLOOD";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["ARTERIAL_PLASMA"] = 6] = "ARTERIAL_PLASMA";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["UNDETERMINED_WHOLE_BLOOD"] = 7] = "UNDETERMINED_WHOLE_BLOOD";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["UNDETERMINED_PLASMA"] = 8] = "UNDETERMINED_PLASMA";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["ISF"] = 9] = "ISF";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["CONTROL_SOLUTION"] = 10] = "CONTROL_SOLUTION";
})(GlucoseMeasurementSampleType || (GlucoseMeasurementSampleType = {}));
export var GlucoseMeasurementSampleLocation;
(function (GlucoseMeasurementSampleLocation) {
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["FINGER"] = 1] = "FINGER";
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["AST"] = 2] = "AST";
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["EAR_LOBE"] = 3] = "EAR_LOBE";
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["CONTROL_SOLUTION"] = 4] = "CONTROL_SOLUTION";
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["LOCATION_NOT_AVAILABLE"] = 15] = "LOCATION_NOT_AVAILABLE";
})(GlucoseMeasurementSampleLocation || (GlucoseMeasurementSampleLocation = {}));
//# sourceMappingURL=glucose-measurement.js.map