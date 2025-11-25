
import { BusinessModel } from "../../models/BusinessModel/businessModel";


export const refreshBusinessDataDaily = async () => {
  try {
    const business = await BusinessModel.findOne({}); 

    if (!business) {
      console.error("No business record found to refresh.");
      return;
    }
    // Update the single business record
    await BusinessModel.updateOne(
      { _id: business._id },
      {
        $set: {
          DailyAverage: 0,
          averageEarningsPerRide: 0,
          totalRunsPerDay:0
        },
      }
    );
  } catch (error) {
    console.error("Error while refreshing business data:", error);
  }
};
export const refreshBusinessDataWeekly = async () => {
  try {
    const business = await BusinessModel.findOne({}); 

    if (!business) {
      console.error("No business record found to refresh.");
      return;
    }
    // Update the single business record
    await BusinessModel.updateOne(
      { _id: business._id },
      {
        $set: {
         
        },
      }
    );
  } catch (error) {
    console.error("Error while refreshing business data:", error);
  }
};




 