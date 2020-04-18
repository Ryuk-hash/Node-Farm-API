const http = require('http');
const fs = require('fs');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//FILE SYSTEM READING N WRITING ASYNCHORNOUSLY
//change to updated file location as required
// fs.readFile('./1-node-farm/starter/txt/start.txt', 'utf-8', (err, data1) => {
//   console.log('data1', data1);
//   fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log('data2', data2);
//     fs.readFile('./1-node-farm/starter/txt/append.txt', 'utf-8', (err, data3) => {
//       console.log('data3', data3);
//       fs.writeFile('./1-node-farm/starter/txt/final.txt', `${data2} \n ${data3}`, 'utf-8', err => {
//         console.log("File written......");
//       });
//     });
//   });
// });

// SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(`${__dirname}/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

// const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));

// dataObj.forEach((e) => {
//   e.slug = slugs[e.id];
// });

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }

  // Product Page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  }

  // Not Found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'own-header': 'Nigga say what?!',
    });
    res.end('<center><h1> Page Not Found!</h1><h2>Error: 404</h2></center>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server has been started .....');
});
