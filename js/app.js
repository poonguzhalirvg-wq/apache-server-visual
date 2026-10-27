(function () {
  'use strict';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var P = {
    req: 'M150,440 L262,300 L440,300 L452,250 L470,250',
    resp: 'M470,272 L440,310 L262,325 L150,465',
    blk: 'M150,440 L262,300 L396,300',
    ssh: 'M150,90 L438,90 L438,360 L458,360',
    pkg: 'M1015,150 L1015,250 L664,250',
    doc: 'M690,345 L710,320 L840,320 L840,304',
    doc2: 'M720,250 L664,250',
    lock: 'M400,120 L1020,120 L1020,520 L400,520 L400,120',
    mag: 'M168,200 L168,385 L168,200'
  };
  var IC = {
    env: '<rect x="-13" y="-9" width="26" height="18" rx="2" fill="#f5c451"/><path d="M-13,-9L0,2L13,-9" fill="none" stroke="#5a3d00" stroke-width="1.6"/>',
    doc: '<path d="M-9,-12H4L10,-6V12H-9Z" fill="#fff" stroke="#8a6cff" stroke-width="1.5"/><path d="M-5,0H6M-5,5H6" stroke="#8a6cff"/>',
    chk: '<circle r="12" fill="#2ecc71"/><polyline points="-6,0 -2,5 6,-5" fill="none" stroke="#fff" stroke-width="3"/>',
    pkg: '<rect x="-12" y="-10" width="24" height="20" rx="2" fill="#8a6cff"/><path d="M-12,-2H12M0,-10V-2" stroke="#fff" stroke-width="2"/>',
    lock: '<rect x="-9" y="-2" width="18" height="13" rx="2" fill="#f5c451"/><path d="M-5,-2V-7a5,5 0 0 1 10,0V-2" fill="none" stroke="#f5c451" stroke-width="2.5"/>',
    x: '<circle r="12" fill="#ef4444"/><path d="M-5,-5L5,5M5,-5L-5,5" stroke="#fff" stroke-width="3"/>',
    mag: '<circle cx="-2" cy="-2" r="8" fill="rgba(255,255,255,.15)" stroke="#fff" stroke-width="3"/><path d="M4,4L12,12" stroke="#fff" stroke-width="3.5"/>'
  };
  var LEG = [['env', 'HTTP request'], ['doc', 'HTML file'], ['chk', 'HTTP 200 response'], ['pkg', 'Apache installation'], ['lock', 'Security filtering'], ['x', 'Blocked connection'], ['mag', 'Troubleshooting']];

  // mover: follows path P[k] between fractions a..b of a dur-second loop
  function mv(k, dur, a, b, ic, o) {
    o = o || {};
    if (RM.matches) {
      if (o.st === false) return '';
      var n = P[k].match(/-?\d+(\.\d+)?/g).slice(-2);
      return '<g transform="translate(' + n[0] + ',' + n[1] + ')">' + IC[ic] + '</g>';
    }
    return '<g><animateMotion dur="' + dur + 's" repeatCount="indefinite" calcMode="linear" keyPoints="' + (o.fix ? '1;1;1;1' : '0;0;1;1') +
      '" keyTimes="0;' + a + ';' + b + ';1"><mpath href="#p-' + k + '"/></animateMotion>' +
      '<animate attributeName="opacity" values="0;1;0" keyTimes="0;' + a + ';' + b + '" calcMode="discrete" dur="' + dur + 's" repeatCount="indefinite"/>' + IC[ic] + '</g>';
  }
  var wire = function (k, c) { return '<use href="#p-' + k + '" class="wire ' + c + '"/>'; };
  var T = function (x, y, s, c, a) { return '<text x="' + x + '" y="' + y + '"' + (c ? ' class="' + c + '"' : '') + (a ? ' text-anchor="' + a + '"' : '') + '>' + s + '</text>'; };
  var R = function (x, y, w, h, c, r) { return '<rect class="' + c + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r || 8) + '"/>'; };

  var TERM = { 2: 'ssh ec2-user@PUBLIC-IP', 3: 'sudo dnf install httpd -y', 4: 'sudo systemctl enable --now httpd', 5: "echo '&lt;h1&gt;..' | sudo tee ..", 6: '(console) edit inbound rules', 7: 'curl http://PUBLIC-IP', 8: 'HTTP/1.1 200 OK', 9: 'sudo tail -f access_log', 10: 'HTTP/1.1 200 OK' };
  var CHK = ['1 httpd status', '2 port 80 listener', '3 localhost test', '4 security group', '5 public IP', '6 route table', '7 logs'];

  // [firstStep, onlySteps|null, svg(step)]
  var IT = [
    [1, null, function () { return R(200, 15, 885, 590, 'aws', 14) + T(218, 38, 'AWS Cloud · the cloud city', 'lb') + T(100, 30, 'The Internet', 'lb', 'middle'); }],
    [1, null, function () { return R(310, 50, 760, 530, 'aws vpc', 10) + T(325, 72, 'VPC · private neighbourhood', 'lb'); }],
    [1, null, function () { return R(370, 90, 680, 450, 'aws sub') + T(1035, 108, 'Public subnet', 'lb', 'end'); }],
    [1, null, function () { return R(268, 240, 84, 100, 'gw') + T(310, 262, 'Internet', 'bd', 'middle').replace('bd', 'sm') + T(310, 276, 'Gateway', 'sm', 'middle') + T(310, 358, 'main entrance', 'sm', 'middle'); }],
    [1, null, function () { return R(430, 170, 560, 310, 'ec2', 10) + T(445, 192, 'EC2 · rented shop · Amazon Linux 2023', 'lb'); }],
    [2, null, function () { return R(20, 60, 130, 60, 'chip') + T(85, 85, 'Admin laptop', 'sm', 'middle') + T(85, 102, 'SSH · port 22', 'sm', 'middle'); }],
    [2, [2], function () { return wire('ssh', 'blue') + mv('ssh', 5, 0, 1, 'lock'); }],
    [2, null, function (s) { return R(460, 330, 240, 60, 'term', 6) + T(470, 352, '$ ' + TERM[s], 'mono').replace('mono', 'mono sm') + T(470, 376, s > 2 ? 'power controls: systemctl' : 'connected as ec2-user', 'sm'); }],
    [3, null, function (s) { return R(460, 200, 200, 100, 'apache') + T(560, 232, 'Apache HTTPD', 'bd', 'middle') + T(560, 250, 'the receptionist', 'sm', 'middle') + (s < 4 ? T(560, 278, 'installed · not running', 'sm', 'middle') : T(560, 278, '● running', 'sm', 'middle').replace('class="sm"', 'class="sm" style="fill:#2ecc71"')); }],
    [3, [3], function () { return wire('pkg', 'pur') + T(1015, 140, 'dnf repo', 'sm', 'end') + mv('pkg', 5, 0, 1, 'pkg'); }],
    [4, null, function () { return R(412, 236, 36, 28, 'ok', 6) + T(430, 255, ':80', 'sm', 'middle'); }],
    [5, null, function () { return R(720, 200, 240, 100, 'shelf') + T(840, 224, 'DocumentRoot · the shelf', 'lb', 'middle') + T(840, 244, '/var/www/html', 'mono sm'.replace(' sm', ''), 'middle'); }],
    [5, null, function () { return R(790, 256, 100, 32, 'file', 4) + T(840, 277, 'index.html', 'sm', 'middle'); }],
    [5, [5], function () { return wire('doc', 'pur') + mv('doc', 5, 0, 1, 'doc'); }],
    [6, null, function () { return R(400, 120, 620, 400, 'sg', 10) + T(415, 143, 'Security Group · the door guard', 'lb') + R(415, 488, 280, 24, 'ok', 5) + T(425, 504, 'HTTP · TCP 80 · from anyone', 'sm') + R(710, 488, 295, 24, 'chip', 5) + T(720, 504, 'SSH · TCP 22 · admin IP only', 'sm'); }],
    [6, [6], function () { return wire('lock', 'gold') + mv('lock', 8, 0, 1, 'lock'); }],
    [7, null, function () { return R(20, 410, 130, 100, 'chip') + R(20, 410, 130, 18, 'gw', 6) + T(28, 423, 'http://PUBLIC-IP', 'sm') + T(85, 528, 'Visitor · browser', 'sm', 'middle'); }],
    [7, null, function () { return T(975, 468, 'Public IPv4 · 203.0.113.25', 'sm', 'end'); }],
    [7, [7], function () { return wire('req', 'gold') + mv('req', 6, 0, 1, 'env'); }],
    [8, null, function () { return T(85, 455, 'Welcome to', 'bd', 'middle') + T(85, 475, 'Ravi Shop', 'bd', 'middle'); }],
    [8, [8, 10], function (s) { return wire('req', 'gold') + wire('resp', 'green') + mv('req', 10, 0, .4, 'env', { st: false }) + mv('doc2', 10, .4, .55, 'doc', { st: false }) + mv('resp', 10, .55, 1, 'chk'); }],
    [9, null, function () { return CHK.map(function (c, i) { return R(10, 200 + i * 26, 140, 22, 'chip', 5) + T(18, 215 + i * 26, c, 'sm'); }).join(''); }],
    [9, null, function () { return R(720, 340, 115, 110, 'ok') + T(777, 362, 'access_log', 'sm', 'middle') + T(777, 380, 'visitor register', 'sm', 'middle') + R(845, 340, 115, 110, 'bad') + T(902, 362, 'error_log', 'sm', 'middle') + T(902, 380, 'problem register', 'sm', 'middle'); }],
    [9, [9], function () { return wire('blk', 'red') + wire('resp', 'green') + mv('blk', 10, 0, .35, 'env') + mv('blk', 10, .35, .5, 'x', { fix: true }) + mv('req', 10, .55, .8, 'env') + mv('resp', 10, .8, 1, 'chk') + mv('mag', 3, 0, 1, 'mag'); }],
    [10, null, function () { return T(700, 560, 'Visitor → Internet → IGW → Subnet → Security Group → EC2 → Apache → index.html → Response → Visitor', 'sm', 'middle') + T(640, 598, 'Optional upgrades: HTTPS (port 443) and a domain name', 'lb', 'middle'); }]
  ];

  var STEPS = [
    ['AWS Cloud and EC2', 'Rent the shop building',
      'Ravi arrives in the cloud city (AWS) and rents a shop building (EC2) on a street (public subnet) that has a main entrance (Internet Gateway). The shop runs Amazon Linux, its operating system.',
      'An EC2 instance running Amazon Linux 2023 is launched in a public subnet of a VPC. The Internet Gateway connects the VPC to the internet and the instance gets a public IPv4 address.',
      '# Console: EC2 > Launch instance\n# AMI: Amazon Linux 2023, type t3.micro\n# Network: public subnet, auto-assign public IPv4',
      'Nested boxes: AWS Cloud, VPC, public subnet, with the gateway on the edge and the teal EC2 inside.'],
    ['Connect to EC2', 'Ravi walks in with the key',
      'Ravi needs to get inside his shop to set it up. He uses a secure remote door that only his key opens.',
      'The administrator connects over SSH (port 22) with a key pair, or uses EC2 Instance Connect from the console.',
      'ssh -i my-key.pem ec2-user@PUBLIC-IP',
      'A lock travels from the admin laptop along the dashed line to the shop terminal.'],
    ['Install Apache HTTPD', 'Hire the receptionist',
      'Ravi hires a receptionist who will greet visitors and hand them pages. The package is delivered to the shop.',
      'dnf installs the httpd package from the Amazon Linux repositories. Config lives in /etc/httpd/ and files are served from /var/www/html.',
      'sudo dnf install httpd -y',
      'A purple package slides in from the repo and the Apache desk appears.'],
    ['Start and enable Apache', 'Switch the power on',
      'The receptionist sits down at the entrance and listens for visitors. Enabling makes them return after a reboot.',
      'systemctl starts httpd now and enables it at boot. Apache listens on TCP port 80 for HTTP.',
      'sudo systemctl enable --now httpd\nsudo systemctl status httpd',
      'Apache turns green ("running") and a :80 entrance badge appears.'],
    ['Create the website file', 'Put the welcome page on the shelf',
      'Ravi writes a welcome page and puts it on the shelf where the receptionist looks first.',
      'Apache serves files from DocumentRoot /var/www/html. index.html is the default page for a directory.',
      "echo '<h1>Welcome to Ravi Shop</h1>' | sudo tee /var/www/html/index.html",
      'A document flies from the terminal to the shelf and index.html appears.'],
    ['Configure the Security Group', 'Station the door guard',
      'The guard lets anyone in through the public entrance (port 80) but only Ravi through the staff door (port 22).',
      'A Security Group is a stateful virtual firewall. Inbound: HTTP TCP 80 from 0.0.0.0/0, SSH TCP 22 from your IP only. Everything else is denied by default.',
      '# Console: EC2 > Security Groups > Inbound rules\nHTTP  TCP 80  0.0.0.0/0\nSSH   TCP 22  YOUR-IP/32',
      'A dashed gold border circles the EC2 and a lock patrols it.'],
    ['Public IP and browser', 'A visitor knocks',
      'A visitor types the shop address (public IP) in the browser, which is like asking for the website.',
      'The browser sends an HTTP GET request to the public IPv4 on port 80. It enters through the Internet Gateway and public subnet, passes the Security Group and reaches EC2.',
      'http://PUBLIC-IP\ncurl http://PUBLIC-IP',
      'A gold envelope travels from the visitor through the gateway to the Apache entrance.'],
    ['Apache serves the website', 'The receptionist hands over the page',
      'The receptionist reads the request, fetches the welcome page from the shelf and delivers it.',
      'Apache maps the request to /var/www/html/index.html and returns HTTP 200 OK with the HTML body. The browser renders it.',
      'curl -i http://localhost',
      'Envelope arrives, the document moves to Apache, a green check returns, and the page appears in the browser.'],
    ['Monitoring and troubleshooting', 'Check the registers',
      'If nobody can reach the shop, Ravi checks the receptionist, the entrance, the guard, the address and the registers.',
      'Verify httpd status, the port 80 listener, a localhost test, Security Group rules, public IP, route table (0.0.0.0/0 to the Internet Gateway) and logs.',
      'sudo systemctl status httpd\nsudo ss -tlnp | grep \':80\'\ncurl http://localhost\nsudo journalctl -u httpd\nsudo tail -f /var/log/httpd/access_log\nsudo tail -f /var/log/httpd/error_log',
      'A request is blocked with a red cross at the guard. After the fix, the request succeeds. The magnifier walks the checklist.'],
    ['Complete architecture', 'The whole journey',
      'The visitor reaches the shop and the receptionist delivers the welcome page. Later, Ravi adds a padlock (HTTPS) and a proper shop name (domain).',
      'Visitor → Internet → IGW → Public subnet → Security Group → EC2 → Apache → index.html → HTTP response. Production: HTTPS with TLS on 443 and a DNS domain name.',
      '# Optional: Route 53 / DNS A record to your IP\n# Optional: HTTPS on port 443 with a TLS certificate',
      'The full loop: request in, document fetched, green check back.']
  ];

  var step = 1, timer = null, $ = function (id) { return document.getElementById(id); };

  function svg(s) {
    var defs = Object.keys(P).map(function (k) { return '<path id="p-' + k + '" d="' + P[k] + '" fill="none"/>'; }).join('');
    var body = IT.filter(function (i) { return s >= i[0] && (!i[1] || i[1].indexOf(s) > -1); })
      .map(function (i) { return '<g class="' + (i[0] === s ? 'new' : '') + '">' + i[2](s) + '</g>'; }).join('');
    return '<svg viewBox="0 0 1100 620" xmlns="http://www.w3.org/2000/svg"><title>Step ' + s + ': ' + STEPS[s - 1][0] + '</title><defs>' + defs + '</defs>' + body + '</svg>';
  }

  function render() {
    var d = STEPS[step - 1];
    $('svgwrap').innerHTML = svg(step);
    $('caption').innerHTML = '<h2>Step ' + step + ': ' + d[0] + '</h2><div><h3>In plain words</h3><p>' + d[2] + '</p></div><div><h3>Technical explanation</h3><p>' + d[3] + '</p></div><div><h3>Commands</h3><pre><code></code></pre></div><div><h3>Watch the picture</h3><p>' + d[5] + '</p></div>';
    $('caption').querySelector('code').textContent = d[4];
    Array.prototype.forEach.call($('steps').children, function (b, i) { if (i + 1 === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    $('prev').disabled = step === 1; $('next').disabled = step === 10;
  }
  function go(n) { step = Math.max(1, Math.min(10, n)); render(); }
  function stop() { clearInterval(timer); timer = null; $('play').setAttribute('aria-pressed', 'false'); $('play').textContent = 'Auto-play'; }
  function play() {
    if (timer) return stop();
    if (step === 10) go(1);
    $('play').setAttribute('aria-pressed', 'true'); $('play').textContent = 'Pause';
    timer = setInterval(function () { if (step >= 10) stop(); else go(step + 1); }, 5000);
  }

  $('steps').innerHTML = STEPS.map(function (d, i) { return '<button type="button" class="step" data-n="' + (i + 1) + '"><b>' + (i + 1) + '</b><div><span>' + d[0] + '</span><small>' + d[1] + '</small></div></button>'; }).join('');
  $('steps').addEventListener('click', function (e) { var b = e.target.closest('.step'); if (b) go(+b.dataset.n); });
  $('legend').innerHTML = LEG.map(function (l) { return '<span><svg viewBox="-16 -16 32 32">' + IC[l[0]] + '</svg>' + l[1] + '</span>'; }).join('');
  $('prev').onclick = function () { go(step - 1); };
  $('next').onclick = function () { go(step + 1); };
  $('reset').onclick = function () { stop(); go(1); };
  $('play').onclick = play;
  $('theme').onclick = function () {
    var r = document.documentElement, t = r.dataset.theme === 'dark' ? 'light' : 'dark'; r.dataset.theme = t;
    try { localStorage.setItem('asv-theme', t); } catch (e) { /* ignore */ }
  };
  try { var sv = localStorage.getItem('asv-theme'); if (sv) document.documentElement.dataset.theme = sv; } catch (e) { /* ignore */ }
  render();
})();
