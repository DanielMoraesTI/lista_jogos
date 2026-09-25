import "server-only";

/**
 * O Vercel Blob aceita duas formas de credencial no servidor:
 * - OIDC (padrão ao conectar o store ao projeto na Vercel): `BLOB_STORE_ID`
 *   + token temporário injetado automaticamente em cada execução;
 * - token fixo `BLOB_READ_WRITE_TOKEN` (usado no desenvolvimento local).
 * O SDK escolhe sozinho; aqui só verificamos se alguma está configurada.
 */
export function blobEnabled() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}
