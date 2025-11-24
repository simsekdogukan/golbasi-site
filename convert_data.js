const XLSX = require('xlsx');
const fs = require('fs');

const filename = 'Kategori ve Ürünler_1763993647501.xlsx';
const outputFile = 'menu-data.json';

try {
    const workbook = XLSX.readFile(filename);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Group by Category
    const menu = {};

    rawData.forEach(row => {
        const category = row['Kategori Adı'];
        const name = row['Ürün Adı'];
        const price = row['Masa Fiyatı'];
        const unit = row['Ürün Birimi'];

        if (!category || !name) return;

        if (!menu[category]) {
            menu[category] = {
                categoryName: category,
                items: []
            };
        }

        menu[category].items.push({
            name: name,
            price: price,
            unit: unit,
            // Add a placeholder image or logic to map images if they existed
            image: null
        });
    });

    // Convert object to array
    const menuArray = Object.values(menu);

    fs.writeFileSync(outputFile, JSON.stringify(menuArray, null, 2));
    console.log(`Successfully converted ${rawData.length} rows to ${outputFile}`);
    console.log(`Found ${menuArray.length} categories.`);

} catch (error) {
    console.error('Error converting file:', error);
}
