import mongoose from "mongoose";
const CityBusinessSchema = new mongoose.Schema({
    // Since the beginning of the activity
    totalProfit:{
        type:Number,    
    },
    // Last 7 days in analysis
    earningsPerPeriod:{
        type:Number,
    },
    // Average turnover per day
    dailyAverage:{
        type:Number,  
    },
    // Since the beginning of the activity
    totalRuns:{
        type:Number,
    },
    totalRunsPerDay:{
        type:Number,
    },
    // Calculated on a daily basis
    averageEarningsPerRide:{
        type:Number,
    },
    // Total driving time
    timeTravel:{
        type:Number
    },
    city:{
        type:String
    },
    userType: {
        type: String,
        enum: ["admin", "cooperative", "ditta_individuale"],
        default: "admin"
    },
    adminUserId: {
        type: String
    }
    
    
});

export const CityBusinessModel = mongoose.model("citybusiness", CityBusinessSchema);

