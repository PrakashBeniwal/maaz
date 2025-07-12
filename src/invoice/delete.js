
const fs = require('fs');

async function DeleteInvoice(filePath) {


  // Delete the file after sending
  fs.unlink(filePath, (err) => {
    if (err) console.error('Error deleting file:', err);
    else console.log('Invoice file deleted.');
  });
}

module.exports = DeleteInvoice;

