# apache-server-visual

An animated, beginner-friendly diagram that explains how to create, configure and host a website with **Apache HTTP Server (HTTPD)** on an **AWS EC2** instance, told through Ravi, a shop owner launching his online shop.

**#Buildwithvinit**

Pure HTML, CSS and JavaScript. No dependencies, no build tools. Works on GitHub Pages.

## The story (analogies)
AWS = cloud city · EC2 = rented shop building · Amazon Linux = shop operating system · Apache HTTPD = receptionist · Public IPv4 = shop address · Port 80 = entrance for HTTP visitors · Security Group = door guard · Internet Gateway = main entrance to the network · DocumentRoot = website file storage shelf · index.html = shop welcome page · HTTP Request = visitor asking for the website · HTTP Response = receptionist delivering the website · systemctl = power controls · Access logs = visitor register · Error logs = problem register

## The 10 steps
1. **AWS Cloud and EC2** – VPC, public subnet, Internet Gateway, EC2 on Amazon Linux 2023.
2. **Connect to EC2** – SSH or EC2 Instance Connect.
3. **Install Apache HTTPD** – `sudo dnf install httpd -y`
4. **Start and enable Apache** – listening on port 80.
5. **Create website file** – `index.html` in `/var/www/html/`.
6. **Configure Security Group** – HTTP 80 open, SSH 22 restricted to your IP.
7. **Public IP and browser** – visitor requests `http://PUBLIC-IP`.
8. **Apache serves the website** – reads index.html, returns HTTP 200 OK.
9. **Monitoring and troubleshooting** – checklist, logs, blocked then fixed request.
10. **Complete architecture** – full path; HTTPS and a domain name are optional production upgrades.

## All commands
```bash
ssh -i my-key.pem ec2-user@PUBLIC-IP
sudo dnf install httpd -y
sudo systemctl enable --now httpd
sudo systemctl status httpd
echo '<h1>Welcome to Ravi Shop</h1>' | sudo tee /var/www/html/index.html
curl http://PUBLIC-IP
sudo ss -tlnp | grep ':80'
curl http://localhost
sudo journalctl -u httpd
sudo tail -f /var/log/httpd/access_log
sudo tail -f /var/log/httpd/error_log
```
Security Group inbound rules: `HTTP TCP 80 0.0.0.0/0` and `SSH TCP 22 YOUR-IP/32`.

## Packet legend
| Object | Meaning |
|---|---|
| Envelope (gold) | HTTP request |
| Document | HTML file |
| Green check | HTTP 200 response |
| Package | Apache installation |
| Lock | Security filtering |
| Red cross | Blocked connection |
| Magnifying glass | Troubleshooting |

## Run locally
Open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 8000   # then open http://localhost:8000
node --check js/app.js        # optional syntax check
```

## Deploy to GitHub Pages
1. Create a repository and push these files to the `main` branch.
2. Repository **Settings > Pages**, set source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Wait a minute and open `https://<your-user>.github.io/<repo>/`. The `.nojekyll` file is already included.

## Project structure
```
apache-server-visual/
  index.html      page layout, sidebar, caption card
  css/style.css   theme variables, SVG colours, responsive rules
  js/app.js       step data, SVG helpers, step-based rendering
  .nojekyll       tells GitHub Pages to skip Jekyll
  LICENSE         MIT
  README.md
```

## Customization
- **Text and commands:** edit the `STEPS` array in `js/app.js` (title, subtitle, plain words, technical, commands, watch).
- **Diagram parts:** each entry in the `IT` array is `[firstStep, onlySteps|null, drawFunction]`. Change coordinates inside the viewBox `0 0 1100 620`.
- **Moving objects:** edit the `P` paths and call `mv(path, seconds, startFraction, endFraction, icon)`.
- **Colours:** SVG classes (`.aws`, `.ec2`, `.apache`, `.gold`, `.green`, `.red`) and page variables are in `css/style.css`.
- **Auto-play speed:** change `5000` in `play()`.
- Animations are replaced by static icons when the visitor prefers reduced motion.

Made with care. #Buildwithvinit
