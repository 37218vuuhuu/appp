const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart the worker
    cluster.fork();
  });
} else {
  // Worker code
  function generateRandomString(length) {
    const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = '';
  
    for (let i = 0; i < length; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        result += '-';
      } else {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
    }
  
    return result;
  }

  function performRequest() {
    const id = generateRandomString(36);
	console.log(`Generated ID: ${id}`); // Log the generated ID
    const url = `http://188.166.187.160:31005/message/${id}`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'YZAF6srew3IACQ6Sj9QIgIBHh9EKt4O7Kbm2qv7NVs'
      }
    };

    http.request(url, options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const jsonResponse = JSON.parse(data);

        if (jsonResponse.error) {
          console.log(`KEYCHECK Failure: ${data}`);
        } else if (jsonResponse.subject) {
          console.log(`KEYCHECK Success: ${jsonResponse.subject}`);
          console.log(`LOG Result: ${jsonResponse.subject} -> LEVEL INFO`);
          console.log("EXECUTEJS alert('henlo');");
        } else {
          console.log("KEYCHECK Custom: No specific condition matched");
        }
      });
    }).end();
  }

  setInterval(performRequest, 1000); // Adjust the interval as needed
  console.log(`Worker ${process.pid} started`);
}
