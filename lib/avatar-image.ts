import sharp from "sharp";

export const AVATAR_SIZE = 512;

/**
 * Reprocessa a imagem enviada antes de publicá-la:
 * - aplica a rotação do EXIF e REMOVE todos os metadados (GPS, câmera, data);
 * - recorta/redimensiona para 512×512 e converte para WebP (leve);
 * - rejeita "bombas de descompressão" (imagens com resolução absurda).
 * Se o arquivo não for uma imagem de verdade, o sharp falha e retornamos null.
 */
export async function processAvatar(input: Uint8Array): Promise<Buffer | null> {
  try {
    return await sharp(input, { limitInputPixels: 40_000_000, animated: false })
      .rotate()
      .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover", position: "attention" })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    return null;
  }
}
