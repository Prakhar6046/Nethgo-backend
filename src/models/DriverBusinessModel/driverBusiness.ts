import mongoose from "mongoose";
const DriverBusinessSchema = new mongoose.Schema({
    driverId:{
        type:String
    },
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

export const DriverBusinessModel = mongoose.model("driverBusiness", DriverBusinessSchema);

