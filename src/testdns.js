const dns = require('dns');

var monitor_domains;
var monitor_interval;

if( 'MONITOR_DOMAINS' in process.env) {
    monitor_domains = process.env.MONITOR_DOMAINS.split(',');
} else {
    monitor_domains = ['google.com', 'amazon.com']
}

if ( 'MONITOR_INTERVAL' in process.env) {
    monitor_interval = parseInt(process.env.MONITOR_INTERVAL)*1000;
} else {
    monitor_interval = 1000;
}

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
    const log = {
        dnsmetrics: {
            language: "nodejs",
            domain: domain,
            latency: latency,
            ttl: ttl,
            success: !err
        }
    };

    console.log(JSON.stringify(log));
}

function measureDNS(domain, interval) {
    console.log(`monitoring ${domain} every ${interval}ms`)
    return setInterval(() => {
        const start = Date.now();
        dns.resolve4(domain, {ttl: true}, (err, addresses)=>logResult(domain, start, err, addresses));
    }, interval);
}

for (const i in monitor_domains) {
    measureDNS(monitor_domains[i], monitor_interval);
}
