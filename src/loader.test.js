import { loadJsonContent, transformData } from './loader';

describe('loadJsonContent', () => {
    it('should throw an error if no file is provided', async () => {
        await expect(loadJsonContent(null)).rejects.toThrow('No file provided');
    });

    it('should throw an error for invalid JSON format', async () => {
        const mockFile = {
            text: async () => 'invalid json',
        };
        await expect(loadJsonContent(mockFile)).rejects.toThrow('Invalid JSON format');
    });

    it('should parse valid JSON content', async () => {
        const mockFile = {
            text: async () => JSON.stringify({ key: 'value' }),
        };
        const result = await loadJsonContent(mockFile);
        expect(result).toEqual({ key: 'value' });
    });
});



describe('transformData', () => {
    it('should return empty tableData, tableHeader, and meta if inputData has no data', () => {
        const inputData = { HasData: false };
        const result = transformData(inputData);
        expect(result).toEqual({
            tableData: [],
            tableHeader: [],
            meta: { HasData: false },
        });
    });

    it('should return empty tableData, tableHeader, and meta if HasData is false and Data does not exist', () => {
        const inputData = { HasData: false };
        const result = transformData(inputData);
        expect(result).toEqual({
            tableData: [],
            tableHeader: [],
            meta: { HasData: false },
        });
    });

    it('should populate meta excluding the "Data" field', () => {
        const inputData = {
            HasData: true,
            SerialNumber: 12345,
            First: '2025-01-01T00:00:00',
            Last: '2025-01-01T00:00:01',
            Data: [],
        };
        const result = transformData(inputData);
        expect(result.meta).toEqual({
            HasData: true,
            SerialNumber: 12345,
            First: '2025-01-01T00:00:00',
            Last: '2025-01-01T00:00:01',
        });
    });

    it('should extract table headers and populate table data', () => {
        const inputData = {
            HasData: true,
            Data: [
                {
                    SerialNumber: 12345,
                    DateTime: '2025-01-01T00:00:00',
                    MillimeterWaterPressure: 10000,
                    Voltage: 50,
                    Temperature: 100,
                    IsDataValid: true,
                },
                {
                    SerialNumber: 12345,
                    DateTime: '2025-01-01T00:00:01',
                    MillimeterWaterPressure: 10000,
                    Voltage: 50,
                    Temperature: 100,
                    IsDataValid: true,
                },
            ],
        };
        const result = transformData(inputData);
        expect(result.tableHeader).toEqual([
            'Index',
            'SerialNumber',
            'DateTime',
            'MillimeterWaterPressure',
            'Voltage',
            'Temperature',
            'IsDataValid',
        ]);
        expect(result.tableData).toEqual([
            [1, 12345, '2025-01-01T00:00:00', 10000, 50, 100, true],
            [2, 12345, '2025-01-01T00:00:01', 10000, 50, 100, true],
        ]);
    });
});