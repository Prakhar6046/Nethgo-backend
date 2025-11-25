export type BusinessResponse = {
  _id: string;
  totalProfit:number,
  earningsPerPeriod:number,
  dailyAverage:number,
  totalRuns:number,
  totalRunsPerDay:number,
  averageEarningsPerRide:number,
  timeTravel:number
};
export type CityBusinessResponse = {
_id: string;
totalProfit:number,
earningsPerPeriod:number,
dailyAverage:number,
totalRuns:number,
totalRunsPerDay:number,
averageEarningsPerRide:number,
timeTravel:number
city:string
userType?: "admin" | "cooperative" | "ditta_individuale";
adminUserId?: string;
};