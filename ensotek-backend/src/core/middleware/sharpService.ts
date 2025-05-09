import sharp from "sharp";
import path from "path";

export const generateThumbnails = async (filePath: string) => {
  const ext = path.extname(filePath);
  const baseName = filePath.replace(ext, "");
  const webpPath = `${baseName}.webp`;
  const thumbPath = `${baseName}.thumb${ext}`;

  try {
    // ➥ Thumbnail (300px genişlik)
    await sharp(filePath)
      .resize({ width: 300 })
      .toFile(thumbPath);

    console.log(`✅ Thumbnail oluşturuldu: ${thumbPath}`);

    // ➥ WebP versiyon
    await sharp(filePath)
      .toFormat("webp")
      .toFile(webpPath);

    console.log(`✅ WebP oluşturuldu: ${webpPath}`);
  } catch (error) {
    console.error(`❌ Thumbnail/WebP hatası: ${error}`);
    throw error;
  }
};
