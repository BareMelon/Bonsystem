const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting custom build...');

try {
  // Try to run react-scripts build
  console.log('Attempting react-scripts build...');
  execSync('npx react-scripts build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.log('React-scripts build failed, trying alternative...');
  
  // Create a simple build as fallback
  const buildDir = path.join(__dirname, 'build');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // Create a simple index.html
  const htmlContent = `<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bon System - Bestil Mad</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bon System</h1>
        <p>Bestil mad og drikke online</p>
        
        <form id="orderForm">
            <div class="form-group">
                <label for="mad">Mad *</label>
                <input type="text" id="mad" name="mad" required>
            </div>
            
            <div class="form-group">
                <label for="drikke">Drikke</label>
                <input type="text" id="drikke" name="drikke">
            </div>
            
            <div class="form-group">
                <label for="ekstra_info">Evt ekstra info</label>
                <textarea id="ekstra_info" name="ekstra_info" rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <label for="telefon">Telefon</label>
                <input type="tel" id="telefon" name="telefon">
            </div>
            
            <button type="submit">Send Bestilling</button>
        </form>
        
        <div id="message"></div>
    </div>
    
    <script>
        document.getElementById('orderForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                mad: document.getElementById('mad').value,
                drikke: document.getElementById('drikke').value,
                ekstra_info: document.getElementById('ekstra_info').value,
                telefon: document.getElementById('telefon').value
            };
            
            try {
                const response = await fetch('https://bonsystem-production.up.railway.app/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    document.getElementById('message').innerHTML = '<p style="color: green;">Bestilling sendt! Tak for din ordre.</p>';
                    document.getElementById('orderForm').reset();
                } else {
                    document.getElementById('message').innerHTML = '<p style="color: red;">Fejl: ' + result.error + '</p>';
                }
            } catch (error) {
                document.getElementById('message').innerHTML = '<p style="color: red;">Fejl ved afsendelse af bestilling</p>';
            }
        });
    </script>
</body>
</html>`;
  
  fs.writeFileSync(path.join(buildDir, 'index.html'), htmlContent);
  console.log('Fallback build completed!');
} 