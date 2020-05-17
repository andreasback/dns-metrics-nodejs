const dns = require('dns'); 

function logResult(domain, startTime, err, addresses) {
    const now = Date.now();
    latency = now - startTime;
    var ttl = -1;

    if(err) {
        console.log(err.stack);
    } else {
        ttl = addresses[0].ttl
//        console.log(addresses);
    }
//todo: put error in log?
    console.log( {
        dnsmetrics: {
            language: "nodejs",
            domain: domain,
            latency: latency,
            ttl: ttl,
            success: !err
        }
    });
}

function measureDNS(domain, interval) {
    console.log(`monitoring ${domain} every ${interval}ms`)
    return setInterval(() => {
        const start = Date.now();
        dns.resolve4(domain, {ttl: true}, (err, addresses)=>logResult(domain, start, err, addresses));
    }, interval);
}

const testInterval = 2000;
const domains = ['aftonbladet.se', 'dn.se', 'google.com'];

for (const i in domains) {
    measureDNS(domains[i], testInterval);
}



