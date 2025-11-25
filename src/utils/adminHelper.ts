import { AdminModel } from "../models/AdminModel/Admin";
import { AdminResponse } from "../types/AdminTypeModel";

export const getEffectiveAdminUserId = async (
  userId: string
): Promise<{ effectiveAdminUserId: string; adminInfo: AdminResponse }> => {
  const adminInfo: AdminResponse | null = await AdminModel.findById(userId);

  if (!adminInfo) {
    throw new Error("Admin user not found.");
  }

  // If user is Capoflotta, get their parent Admin's ID
  if (adminInfo.userType === "capoflotta" && adminInfo.parentId) {
    const parentAdmin: AdminResponse | null = await AdminModel.findById(
      adminInfo.parentId
    );

    if (!parentAdmin) {
      throw new Error("Parent Admin not found for Capoflotta.");
    }

    // Return parent Admin's ID and info (for city filtering)
    return {
      effectiveAdminUserId: parentAdmin._id.toString(),
      adminInfo: parentAdmin,
    };
  }

  // If user is Ditta individuale, get their parent Capoflotta's ID
  if (adminInfo.userType === "ditta_individuale" && adminInfo.parentId) {
    const parentCapoflotta: AdminResponse | null = await AdminModel.findById(
      adminInfo.parentId
    );

    if (!parentCapoflotta) {
      throw new Error("Parent Capoflotta not found for Ditta individuale.");
    }

    // For Ditta individuale, we need to get the effective ID from their parent Capoflotta
    // This ensures they see data from the Capoflotta's parent Admin (hierarchical access)
    if (parentCapoflotta.userType === "capoflotta" && parentCapoflotta.parentId) {
      const parentAdmin: AdminResponse | null = await AdminModel.findById(
        parentCapoflotta.parentId
      );

      if (!parentAdmin) {
        throw new Error("Parent Admin not found for Capoflotta.");
      }

      // Return parent Admin's ID and info (for city filtering)
      return {
        effectiveAdminUserId: parentAdmin._id.toString(),
        adminInfo: parentAdmin,
      };
    }

    // If parent Capoflotta doesn't have a parent, use Capoflotta's ID
    return {
      effectiveAdminUserId: parentCapoflotta._id.toString(),
      adminInfo: parentCapoflotta,
    };
  }

  // For Admin or others, use their own ID
  return {
    effectiveAdminUserId: adminInfo._id.toString(),
    adminInfo,
  };
};

export const getAdminInfo = async (
  userId: string
): Promise<AdminResponse> => {
  const adminInfo: AdminResponse | null = await AdminModel.findById(userId);

  if (!adminInfo) {
    throw new Error("Admin user not found.");
  }

  return adminInfo;
};

