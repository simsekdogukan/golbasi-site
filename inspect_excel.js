const XLSX = require('xlsx');
const fs = require('fs');

const filename = 'Kategori ve Ürünler_1763993647501.xlsx';

try {
    const workbook = XLSX.readFile(filename);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON to see the structure
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Header: 1 gives array of arrays

    console.log('Sheet Name:', sheetName);
    console.log('Total Rows:', data.length);

    if (data.length > 0) {
        console.log('Headers:', data[0]);
        console.log('First Row Data:', data[1]);
        console.log('Second Row Data:', data[2]);
    } else {
        console.log('Sheet is empty');
    }

} catch (error) {
    console.error('Error reading file:', error);
}
