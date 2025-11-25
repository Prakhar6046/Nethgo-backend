import { BusinessModel } from "../../models/BusinessModel/businessModel";
import { CityBusinessModel } from "../../models/BusinessModel/cityBusinessModel";
import {
  BusinessResponse,
  CityBusinessResponse,
} from "../../types/businessTypeModel";

interface UserTypeCosts {
  adminCost?: number;
  cooperativeCost?: number;
  ditta_individualeCost?: number;
  adminUserId?: string;
}

const BusinessData = async (
  totalPrice: number,
  totalTime: number,
  city: string,
  userTypeCosts?: UserTypeCosts
) => {
  try {
    const business = await BusinessModel.findOne<BusinessResponse>({});
    await handleGlobalBusinessUpdate(business, totalPrice, totalTime);

    if (userTypeCosts && userTypeCosts.adminUserId) {
      const { adminCost, cooperativeCost, ditta_individualeCost, adminUserId } = userTypeCosts;
    
      
      // Update Admin BI
      if (adminCost && adminCost > 0) {
        await handleUserTypeBusinessUpdate(
          city,
          "admin",
          adminUserId!,
          adminCost,
          totalTime
        );
      }
      
      // Update Cooperative (Capoflotta) BI
      if (cooperativeCost && cooperativeCost > 0) {
        await handleUserTypeBusinessUpdate(
          city,
          "cooperative",
          adminUserId!,
          cooperativeCost,
          totalTime
        );
      }
      
      // Update Ditta Individuale BI
      if (ditta_individualeCost && ditta_individualeCost > 0) {
        await handleUserTypeBusinessUpdate(
          city,
          "ditta_individuale",
          adminUserId!,
          ditta_individualeCost,
          totalTime
        );
      }
    } else {

      const cityBusiness = await CityBusinessModel.findOne<CityBusinessResponse>({ 
        city,
        userType: { $exists: false } 
      });
      await handleCityBusinessUpdate(cityBusiness, city, totalPrice, totalTime);
    }
  } catch (error) {
    console.error("Error while updating business data:", error);
  }
};


const handleCityBusinessUpdate = async (
  cityBusiness: CityBusinessResponse | null,
  city: string,
  totalPrice: number,
  totalTime: number
) => {
  const initialCityBusinessInfo = {
    totalProfit: totalPrice,
    earningsPerPeriod: totalPrice,
    dailyAverage: totalPrice,
    totalRuns: 1,
    totalRunsPerDay: 1,
    averageEarningsPerRide: totalPrice, // Single run
    timeTravel: totalTime,
    city,
  };

  if (!cityBusiness) {
    // Create new city-specific business data
    await CityBusinessModel.create(initialCityBusinessInfo);
  } else {
    // Calculate updated values
    const newTotalRuns = (cityBusiness.totalRuns || 0) + 1;
    const newTotalRunsPerDay = (cityBusiness.totalRunsPerDay || 0) + 1;
    const newDailyAverage = (cityBusiness.dailyAverage || 0) + totalPrice;
    
    // Calculate averageEarningsPerRide safely to avoid NaN
    let averageEarningsPerRide = totalPrice; // Default to current price
    if (newTotalRunsPerDay > 0 && newDailyAverage > 0) {
      averageEarningsPerRide = newDailyAverage / newTotalRunsPerDay;
    } else if (newTotalRuns > 0) {
      // Fallback: use totalProfit / totalRuns if dailyAverage calculation fails
      const newTotalProfit = (cityBusiness.totalProfit || 0) + totalPrice;
      averageEarningsPerRide = newTotalProfit / newTotalRuns;
    }
    
    // Ensure averageEarningsPerRide is a valid number
    if (isNaN(averageEarningsPerRide) || !isFinite(averageEarningsPerRide)) {
      averageEarningsPerRide = totalPrice;
    }
    
    const updatedCityData = {
      totalProfit: (cityBusiness.totalProfit || 0) + totalPrice,
      earningsPerPeriod: (cityBusiness.earningsPerPeriod || 0) + totalPrice,
      dailyAverage: newDailyAverage,
      totalRuns: newTotalRuns,
      totalRunsPerDay: newTotalRunsPerDay,
      averageEarningsPerRide: averageEarningsPerRide,
      timeTravel: (cityBusiness.timeTravel || 0) + totalTime,
    };

    // Update the document
    await CityBusinessModel.updateOne({ _id: cityBusiness._id }, { $set: updatedCityData });
  }
};

// Handles updating or creating user type-specific business data
const handleUserTypeBusinessUpdate = async (
  city: string,
  userType: "admin" | "cooperative" | "ditta_individuale",
  adminUserId: string,
  userTypeProfit: number,
  totalTime: number
) => {
  try {
 
    const existingBusiness = await CityBusinessModel.findOne<CityBusinessResponse>({
      city,
      userType,
      adminUserId,
    });

    const initialBusinessInfo = {
      totalProfit: userTypeProfit,
      earningsPerPeriod: userTypeProfit,
      dailyAverage: userTypeProfit,
      totalRuns: 1,
      totalRunsPerDay: 1,
      averageEarningsPerRide: userTypeProfit,
      timeTravel: totalTime,
      city,
      userType,
      adminUserId,
    };

    if (!existingBusiness) {
      // Create new user type-specific business data
      const created = await CityBusinessModel.create(initialBusinessInfo);
    } else {
      // Calculate updated values
      const newTotalRuns = (existingBusiness.totalRuns || 0) + 1;
      const newTotalRunsPerDay = (existingBusiness.totalRunsPerDay || 0) + 1;
      const newDailyAverage = (existingBusiness.dailyAverage || 0) + userTypeProfit;
      
      // Calculate averageEarningsPerRide safely to avoid NaN
      let averageEarningsPerRide = userTypeProfit; // Default to current profit
      if (newTotalRunsPerDay > 0 && newDailyAverage > 0) {
        averageEarningsPerRide = newDailyAverage / newTotalRunsPerDay;
      } else if (newTotalRuns > 0) {
        // Fallback: use totalProfit / totalRuns if dailyAverage calculation fails
        const newTotalProfit = (existingBusiness.totalProfit || 0) + userTypeProfit;
        averageEarningsPerRide = newTotalProfit / newTotalRuns;
      }
      
      // Ensure averageEarningsPerRide is a valid number
      if (isNaN(averageEarningsPerRide) || !isFinite(averageEarningsPerRide)) {
        averageEarningsPerRide = userTypeProfit;
      }
      
      const updatedData = {
        totalProfit: (existingBusiness.totalProfit || 0) + userTypeProfit,
        earningsPerPeriod: (existingBusiness.earningsPerPeriod || 0) + userTypeProfit,
        dailyAverage: newDailyAverage,
        totalRuns: newTotalRuns,
        totalRunsPerDay: newTotalRunsPerDay,
        averageEarningsPerRide: averageEarningsPerRide,
        timeTravel: (existingBusiness.timeTravel || 0) + totalTime,
      };
      // Update the document
      const updateResult = await CityBusinessModel.updateOne(
        { _id: existingBusiness._id },
        { $set: updatedData }
      );
    }
  } catch (error) {
    console.error(`[BI Update] Error updating ${userType} BI:`, error);
    throw error;
  }
};

// Handles updating or creating global business data
const handleGlobalBusinessUpdate = async (
  business: BusinessResponse | null,
  totalPrice: number,
  totalTime: number
) => {
  const initialGlobalBusinessInfo = {
    totalProfit: totalPrice,
    earningsPerPeriod: totalPrice,
    dailyAverage: totalPrice,
    totalRuns: 1,
    totalRunsPerDay: 1,
    averageEarningsPerRide: totalPrice, // Single run
    timeTravel: totalTime,
  };

  if (!business) {
    // Create new global business data
    await BusinessModel.create(initialGlobalBusinessInfo);
  } else {
    // Calculate updated values
    const newTotalRuns = (business.totalRuns || 0) + 1;
    const newTotalRunsPerDay = (business.totalRunsPerDay || 0) + 1;
    const newDailyAverage = (business.dailyAverage || 0) + totalPrice;
    
    // Calculate averageEarningsPerRide safely to avoid NaN
    let averageEarningsPerRide = totalPrice; // Default to current price
    if (newTotalRunsPerDay > 0 && newDailyAverage > 0) {
      averageEarningsPerRide = newDailyAverage / newTotalRunsPerDay;
    } else if (newTotalRuns > 0) {
      // Fallback: use totalProfit / totalRuns if dailyAverage calculation fails
      const newTotalProfit = (business.totalProfit || 0) + totalPrice;
      averageEarningsPerRide = newTotalProfit / newTotalRuns;
    }
    
    // Ensure averageEarningsPerRide is a valid number
    if (isNaN(averageEarningsPerRide) || !isFinite(averageEarningsPerRide)) {
      averageEarningsPerRide = totalPrice;
    }
    
    const updatedGlobalData = {
      totalProfit: (business.totalProfit || 0) + totalPrice,
      earningsPerPeriod: (business.earningsPerPeriod || 0) + totalPrice,
      dailyAverage: newDailyAverage,
      totalRuns: newTotalRuns,
      totalRunsPerDay: newTotalRunsPerDay,
      averageEarningsPerRide: averageEarningsPerRide,
      timeTravel: (business.timeTravel || 0) + totalTime,
    };

    // Update the document
    await BusinessModel.updateOne({ _id: business._id }, { $set: updatedGlobalData });
  }
};

export default BusinessData;
