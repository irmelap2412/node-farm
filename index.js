const fs = require("fs");
const http = require("http");
const url = require("url");

/////////////////////////////
///SERVER/////////

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

  const {query,pathname} = url.parse(req.url,true);
  if (pathname === "/favicon.ico") {
    return res.end(); // stops the request from being processed
  }
  //overview
  else if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("\n");
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
  
    res.end(output);
  }
  //product
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //api
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end("page not found");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("listening on port 3000");
});

//created a server and passed a callback
//event was fired when the server is listening
