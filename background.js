chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.productData) {
      let productData = message.productData;
  
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Title,Sold,Price,Shipping Method,Store Link\n";
      
      productData.forEach((product) => {
        let row = `${product.title},${product.sold},${product.price},${product.shippingMethod},${product.storeLink}\n`;
        csvContent += row;
      });
  
      // Trigger CSV download
      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "product_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
  