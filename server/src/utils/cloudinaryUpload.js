import cloudinary from "./cloudinary.js";

//Upload 1 buffer lên Cloudinary theo stream

export function uploadBufferToCloudinary(
  fileBuffer,
  { folder, filename, overwrite = false } = {}
) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder || process.env.CLOUDINARY_FOLDER || "carrental",
        public_id: filename,
        overwrite,
        resource_type: "image",
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(fileBuffer);
  });
}

//Upload nhiều file buffer

export async function uploadManyBuffers(files, { folder }) {
  const result = [];
  for (const f of files) {
    const r = await uploadBufferToCloudinary(f.buffer, { folder });
    result.push({
      url: r.secure_url,
      public_id: r.public_id,
      width: r.width,
      height: r.height,
      format: r.format,
    });
  }
  return result;
}

//Xóa ảnh Cloudinary theo public_id

export function deleteCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}
