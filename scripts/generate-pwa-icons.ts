import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicDirectory = path.join(process.cwd(), 'public');
const outputDirectory = path.join(publicDirectory, 'pwa');
const sourceIcon = path.join(publicDirectory, 'logo.svg');

const generateIcons = async () => {
  await fs.mkdir(outputDirectory, { recursive: true });

  await Promise.all([
    sharp(sourceIcon).resize(192, 192).png().toFile(path.join(outputDirectory, 'icon-192.png')),
    sharp(sourceIcon).resize(512, 512).png().toFile(path.join(outputDirectory, 'icon-512.png')),
    sharp(sourceIcon)
      .resize(360, 360)
      .extend({
        top: 76,
        bottom: 76,
        left: 76,
        right: 76,
        background: '#0f0f11',
      })
      .png()
      .toFile(path.join(outputDirectory, 'icon-maskable-512.png')),
  ]);

  console.log(`PWA icons generated in ${outputDirectory}`);
};

generateIcons().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
