import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from "cloudinary";

function getCloudinaryEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Faltan variables de entorno de Cloudinary");
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
  };
}

function getCloudinaryClient() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return cloudinary;
}

export async function uploadProductImage(buffer: Buffer): Promise<string> {
  const client = getCloudinaryClient();

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: "ecommerce-nextjs/products",
        resource_type: "image",
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary no devolvió una URL pública"));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}
