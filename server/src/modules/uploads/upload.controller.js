import {
  uploadBufferToCloudinary,
  uploadManyBuffers,
  deleteCloudinary,
} from "../../utils/cloudinaryUpload.js";

//Helper: Tạo folder tự động dựa theo loại và userId
const makeFolderPath = (req, type) => {
  const base = process.env.CLOUDINARY_FOLDER || "carrental";
  const userId = req.user?.id || "anonymous";
  return `${base}/${type}/${userId}`;
};

//Upload ảnh KYC (1 ảnh)
export const uploadKycImage = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Không có file nào được tải lên" });

    const folder = makeFolderPath(req, "kyc");
    const result = await uploadBufferToCloudinary(req.file.buffer, { folder });
    return res.status(201).json({ success: true, data: result });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Upload KYC 3 ảnh trong 1 request
export const uploadKycBatch = async (req, res) => {
  try {
    const files = req.files || {};
    const folder = makeFolderPath(req, "kyc");

    //helper lấy url từ file buffer -> cloudinary
    const upOne = async (f) => {
      if (!f || !f.buffer) return null;
      const r = await uploadBufferToCloudinary(f.buffer, { folder });
      return { url: r.secure_url, public_id: r.public_id };
    };

    const data = {
      idFrontUrl: await upOne(files.idFrontUrl?.[0]),
      idBackUrl: await upOne(files.idBackUrl?.[0]),
      selfieWithIdUrl: await upOne(files.selfieWithIdUrl?.[0]),
      vehicleRegistrationUrl: await upOne(files.vehicleRegistrationUrl?.[0]),
      vehicleInsuranceUrl: await upOne(files.vehicleInsuranceUrl?.[0]),
    };

    if (
      !data.idFrontUrl ||
      !data.idBackUrl ||
      !data.selfieWithIdUrl ||
      !data.vehicleRegistrationUrl ||
      !data.vehicleInsuranceUrl
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Thiếu ảnh KYC/KYA. Cần đủ 5 ảnh: CCCD (mặt trước, mặt sau, selfie) + Giấy đăng ký xe + Bảo hiểm xe.",
        received: Object.keys(files),
      });
    }

    //trả về chỉ URL
    return res.status(201).json({
      success: true,
      data: {
        idFrontUrl: data.idFrontUrl.url,
        idBackUrl: data.idBackUrl.url,
        selfieWithIdUrl: data.selfieWithIdUrl.url,
        vehicleRegistrationUrl: data.vehicleRegistrationUrl.url,
        vehicleInsuranceUrl: data.vehicleInsuranceUrl.url,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Upload nhiều ảnh xe (Car)
export const uploadCarImages = async (req, res) => {
  try {
    if (!req.files?.length)
      return res
        .status(400)
        .json({ success: false, message: "Không có file nào được tải lên" });

    const folder = makeFolderPath(req, "cars");
    const results = await uploadManyBuffers(req.files, { folder });
    return res.status(201).json({ success: true, data: results });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Upload ảnh avatar người dùng (1 ảnh)
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Không có file nào được tải lên" });

    const folder = makeFolderPath(req, "avatars");
    const result = await uploadBufferToCloudinary(req.file.buffer, { folder });
    return res.status(201).json({ success: true, data: result });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Xoá ảnh Cloudinary (public_id)
export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body || {};
    if (!public_id)
      return res
        .status(400)
        .json({ success: false, message: "Yêu cầu public_id" });

    const result = await deleteCloudinary(public_id);
    return res.json({ success: true, data: result });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
