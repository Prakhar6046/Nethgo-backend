export type OrderDetails = {
  _id: string;
  orderNumber: number;
  companyId: string;
  selectedRouteId: string;
  isReverse: boolean;
  from: string;
  to: string;
  totalPrice: number;
  city: string;
  driverId: string;
  driverName: string;
  driverAccept: boolean;
  preferVehicel: number;
  clientName: string;
  telePhone: number;
  customerEmail: string;
  securityPin: string;
  pinVerified: boolean;
  noOfPassengers: number;
  appointmentTime: string;
  appointmentDate: string;
  usefulInformation: string;
  completeOrder:boolean;
  driverCost:number;
  averageTravelTime:number
};
