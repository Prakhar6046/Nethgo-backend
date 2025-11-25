export type AdminResponse = {
    _id: string;
    email: string;
    password: string;
    city:string;
    cityId:string;
    superAdmin:string;
    userType?: "admin" | "capoflotta" | "ditta_individuale";
    parentId?: string | null;
  };