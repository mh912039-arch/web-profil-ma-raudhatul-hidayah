const sharp = require('sharp');
const path = require('path');

async function generatePwaIcons() {
  const sourceLogo = path.join(process.cwd(), 'public', 'school-logo.png');

  // 1. Buat logo yang di-resize dengan margin aman (350x350 dari canvas 512x512)
  // Safe zone Android maskable icon adalah radius 40% (diameter 80% = ~409px).
  // Dengan ukuran 350px dan background putih murni, logo memiliki padding ~81px di semua sisi.
  // Saat Android memotong ikon menjadi bentuk squircle/lingkaran, logo tidak akan terpotong sama sekali!
  const logo512Buffer = await sharp(sourceLogo)
    .resize(350, 350, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo512Buffer, gravity: 'center' }])
    .png()
    .toFile(path.join(process.cwd(), 'public', 'icon-512.png'));

  // 2. Buat versi 192x192
  const logo192Buffer = await sharp(sourceLogo)
    .resize(132, 132, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo192Buffer, gravity: 'center' }])
    .png()
    .toFile(path.join(process.cwd(), 'public', 'icon-192.png'));

  // 3. Buat versi Apple Touch Icon (180x180)
  const logoAppleBuffer = await sharp(sourceLogo)
    .resize(126, 126, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logoAppleBuffer, gravity: 'center' }])
    .png()
    .toFile(path.join(process.cwd(), 'src', 'app', 'apple-icon.png'));

  // 4. Buat src/app/icon.png
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo512Buffer, gravity: 'center' }])
    .png()
    .toFile(path.join(process.cwd(), 'src', 'app', 'icon.png'));

  console.log('Semua ikon PWA MAS RH Mobile berhasil dibuat dengan squircle background putih & padding rapi!');
}

generatePwaIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
