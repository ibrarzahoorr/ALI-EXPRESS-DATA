console.log("Content script loaded.");

function getDataByXPath(xpath, contextNode) {
  let result = document.evaluate(xpath, contextNode, null, XPathResult.STRING_TYPE, null);
  return result.stringValue.trim();
}

function scrapeData() {
  let extractedData = [];
  let products = document.querySelectorAll('#card-list > div');

  products.forEach((product) => {
    let title = getDataByXPath('.//div[2]/div[1]/h3', product);
    let productsSold = getDataByXPath('.//div[2]/div[2]/span', product);
    let price = getDataByXPath('.//div[2]/div[3]', product);
    let shippingMethod = getDataByXPath('.//div[2]/div[5]/span', product);
    let storeLink = getDataByXPath('.//div[2]/span', product);

    extractedData.push({
      title: title || 'N/A',
      productsSold: productsSold || 'N/A',
      price: price || 'N/A',
      shippingMethod: shippingMethod || 'N/A',
      storeLink: storeLink || 'N/A'
    });
  });

  return extractedData;
}

// Message listener to handle scrape request
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrapeData') {
    let data = scrapeData();
    sendResponse({ products: data });
  }
});
