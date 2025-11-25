export type CarDriverResponse = {
  _id: string;
  adminUserId: string;
  driverName: string;
  driverSurname: string;
  accessTheApp: Boolean;
  driverEmail: string;
  driverPassword: string;
  cityOfService:string,
  carModel:string,
  fmcToken:string
};
export type DriverBusinessInfo = {
  driverId:string,
  totalProfit:number,
  earningsPerPeriod:number,
  dailyAverage:number,
  totalRuns:number,
  totalRunsPerDay:number,
  averageEarningsPerRide:number,
  timeTravel:number
  
}