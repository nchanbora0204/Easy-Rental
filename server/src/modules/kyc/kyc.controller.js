import User from "../users/user.model.js";

export const applyKyc = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      dateOfBirth,
      idNumber,
      idIssueDate,
      idFrontUrl,
      idBackUrl,
      selfieWithIdUrl,
      address,
      bankAccount,
      bankName,
      vehicleRegistrationUrl,
      vehicleInsuranceUrl,
      note,
    } = req.body;

    const required = {
      fullName,
      phone,
      dateOfBirth,
      idNumber,
      idIssueDate,
      idFrontUrl,
      idBackUrl,
      selfieWithIdUrl,
      address,
      bankAccount,
      bankName,
      vehicleRegistrationUrl,
      vehicleInsuranceUrl,
    };
    const missing = Object.entries(required)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing field: ${missing.join(", ")}`,
      });
    }

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.role = "owner";
    user.kycStatus = "pending";
    user.kycProfile = {
      fullName,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      idNumber,
      idIssueDate: new Date(idIssueDate),
      idFrontUrl,
      idBackUrl,
      selfieWithIdUrl,
      address,
      bankAccount,
      bankName,
      vehicleRegistrationUrl,
      vehicleInsuranceUrl,
      note,
      appliedAt: new Date(),
    };
    await user.save();

    return res.json({
      success: true,
      message: "KYC submitted",
      data: { role: user.role, kycStatus: user.kycStatus },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const myKycStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "role kycStatus kycProfile"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.json({
      success: true,
      data: {
        role: user.role,
        kycStatus: user.kycStatus,
        ownerStatus: user.ownerStatus,
        kycProfile: user.kycProfile,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
