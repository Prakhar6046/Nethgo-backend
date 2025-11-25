import mongoose from "mongoose";
const BusinessSchema = new mongoose.Schema({
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
    }
    
});

export const BusinessModel = mongoose.model("business", BusinessSchema);

