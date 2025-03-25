document.getElementById('extractBtn').addEventListener('click', async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: extractProductData
        },
        (results) => {
          if (chrome.runtime.lastError || !results[0].result || results[0].result.length === 0) {
            document.getElementById('status').innerText = "Error: No product data found!";
          } else {
            exportToCSV(results[0].result);
            document.getElementById('status').innerText = "Data extracted and CSV file downloaded.";
          }
        }
      );
    });
  });
  
  function extractProductData() {
    let products = [];
    
    // Select product containers
    let productElements = document.querySelectorAll('#card-list > div'); // Adjust this selector as needed
  
    productElements.forEach((product) => {
      let title = product.querySelector('div > div > a > div:nth-child(2) > div:nth-child(1)')?.innerText || 'N/A';
      let sold = product.querySelector('div > div > a > div:nth-child(2) > div:nth-child(2)')?.innerText || 'N/A';
      let price = product.querySelector('div > div > a > div:nth-child(2) > div:nth-child(3)')?.innerText || 'N/A';
      let shippingMethod = product.querySelector('div > div > a > div:nth-child(2) > div:nth-child(5)')?.innerText || 'N/A';
      let storeLink = product.querySelector('div > div > a')?.href || 'N/A'; // Store link if available
      let productLink = product.querySelector('div > div > a')?.href || 'N/A'; // Product link
  
      // Extracting product image URL
      let imageUrl = product.querySelector('img')?.src || 'N/A';
  
      products.push({
        title: title,
        sold: sold,
        price: price,
        shippingMethod: shippingMethod,
        storeLink: storeLink,
        productLink: productLink, // Adding product link
        imageUrl: imageUrl // Adding image URL to the data
      });
    });
  
    return products; // Return the products array to be sent back to the popup.js
  }
  
  function exportToCSV(data) {
    const csvRows = [];
    const headers = ['Title', 'Sold', 'Price', 'Shipping Method', 'Store Link', 'Product Link', 'Image URL'];
    csvRows.push(headers.join(','));
  
    data.forEach(product => {
      const row = [
        `"${product.title}"`, // Quoting to handle commas in titles
        product.sold,
        product.price,
        `"${product.shippingMethod}"`, // Quoting to handle commas in shipping method
        product.storeLink,
        product.productLink, // Product link in the row
        product.imageUrl // Image URL column
      ];
      csvRows.push(row.join(','));
    });
  
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
  
    chrome.downloads.download({
      url: url,
      filename: 'aliexpress_products.csv'
    });
  }
  