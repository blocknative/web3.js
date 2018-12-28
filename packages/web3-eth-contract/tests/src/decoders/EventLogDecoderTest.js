import EventLogDecoder from '../../../src/decoders/EventLogDecoder';
import {formatters} from 'web3-core-helpers';
import {AbiCoder} from 'web3-eth-abi';
import AbiItemModel from '../../../src/models/abi/AbiItemModel';

// Mocks
jest.mock('formatters');
jest.mock('AbiCoder');
jest.mock('../../../src/models/abi/AbiItemModel');

/**
 * EventLogDecoder test
 */
describe('EventLogDecoderTest', () => {
    let eventLogDecoder,
        abiCoder,
        abiCoderMock;

    beforeEach(() => {
        abiCoder = new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];
        abiCoderMock.decodeLog = jest.fn();

        eventLogDecoder = new EventLogDecoder(abiCoderMock, formatters);
    });

    it('constructor check', () => {
        expect(eventLogDecoder.abiCoder)
            .toEqual(abiCoderMock);

        expect(eventLogDecoder.formatters)
            .toEqual(formatters);
    });

    it('calls decode and returns the expected value', () => {
        new AbiItemModel({});
        const abiItemModel = AbiItemModel.mock.instances[0],
              response = {
                  topics: ['0x0'],
                  data: '0x0',
              };

        abiItemModel.name = 'Event';
        abiItemModel.signature = 'Event()';

        abiItemModel.getInputs
            .mockReturnValueOnce([]);

        abiCoderMock.decodeLog
            .mockReturnValueOnce(['0x0']);

        const decodedLog = eventLogDecoder.decode(abiItemModel, response);

        expect(decodedLog.data)
            .toEqual(undefined);

        expect(decodedLog.topics)
            .toEqual(undefined);

        expect(decodedLog.raw.data)
            .toEqual('0x0');

        expect(decodedLog.raw.topics)
            .toEqual(['0x0']);

        expect(decodedLog.signature)
            .toEqual(abiItemModel.signature);

        expect(decodedLog.event)
            .toEqual(abiItemModel.name);

        expect(decodedLog.returnValues)
            .toEqual(['0x0']);

        expect(abiCoderMock.decodeLog)
            .toHaveBeenCalledWith([], '0x0', ['0x0']);

        expect(abiItemModel.getInputs)
            .toHaveBeenCalled();
    });

    it('calls decode without topics and with the anonymous property and returns the expected value', () => {
        new AbiItemModel({});
        const abiItemModel = AbiItemModel.mock.instances[0],
            response = {
                topics: [],
                data: '0x0'
            };

        abiItemModel.name = 'Event';
        abiItemModel.signature = 'Event()';
        abiItemModel.anonymous = true;

        abiItemModel.getInputs
            .mockReturnValueOnce([]);

        abiCoderMock.decodeLog
            .mockReturnValueOnce(['0x0']);

        const decodedLog = eventLogDecoder.decode(abiItemModel, response);

        expect(decodedLog.data)
            .toEqual(undefined);

        expect(decodedLog.topics)
            .toEqual(undefined);

        expect(decodedLog.raw.data)
            .toEqual('0x0');

        expect(decodedLog.raw.topics)
            .toEqual([]);

        expect(decodedLog.signature)
            .toEqual(null);

        expect(decodedLog.event)
            .toEqual(abiItemModel.name);

        expect(decodedLog.returnValues)
            .toEqual(['0x0']);

        expect(abiCoderMock.decodeLog)
            .toHaveBeenCalledWith([],  '0x0', []);

        expect(abiItemModel.getInputs)
            .toHaveBeenCalled();
    });
});
