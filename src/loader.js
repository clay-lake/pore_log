const loadJsonContent = async (file) => {
    if (!file) {
        throw new Error('No file provided');
    }

    const fileContent = await file.text();
    try {
        const jsonData = JSON.parse(fileContent);
        return jsonData;
    } catch (error) {
        throw new Error('Invalid JSON format: ' + error.message);
    }
}

const defaultResult = () => {
    return {
        meta: {},
        tableHeader: [],
        tableData: []
    };
};

const transformData = (inputData) => {
    let result = defaultResult();

    // Include all fields from inputData except 'Data' in meta
    result.meta = Object.fromEntries(
        Object.entries(inputData).filter(([key]) => key !== 'Data')
    );

    if (inputData?.HasData !== true || !inputData.Data) {
        return result;
    }

    // Extract table header from inputData.Data
    const headerSet = new Set();
    headerSet.add('Index'); // Add 'Index' as the first column
    inputData.Data.forEach(row => {
        Object.keys(row).forEach(key => headerSet.add(key));
    });
    result.tableHeader = Array.from(headerSet);

    // Populate table data
    result.tableData = inputData.Data.map((row, index) => {
        return result.tableHeader.map(header => {
            if (header === 'Index') {
                return index + 1; // Add 1-based index
            }
            return row[header] || null;
        });
    });

    return result;
};


const getCSVContent = (data) => {
    if (!data || !data.tableData || data.tableData.length === 0) {
        return '';
    }

    const header = data.tableHeader.join(',');
    const rows = data.tableData.map(row => row.join(',')).join('\n');
    return `${header}\n${rows}`;

};

export { loadJsonContent, transformData, defaultResult, getCSVContent };