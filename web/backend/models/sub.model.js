import mongoose, {Schema} from "mongoose";

const SubSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    price:{
        type: Number,
        required: true,
        min: [0, "price must be greater than 0!"],
    },
    currency:{
        type: String,
        required: true,
        enum: ["EUR", "USD","INR"],
        default: "INR",
    },
    frequency:{
        type: String,
        enum: ["daily", "weekly", "monthly"],
        required: true,
    },
    category:{
        type: String,
        enum: ["sports", "entertainment", "Education"],
    },
    paymentMethod:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        // required: true,
    },
    startDate:{
        type: Date,
        required: true,
        validate: {
            validator: (val) => val <= new Date(),
            message: "Invalid Date/Start Date must be in past",
        },
    },
    renewalDate:{
        type: Date,
        validate: {
            validator: function (val) {
                return val > this.startDate;
            },
            message: "Renewal date must be after start date",
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    }
},{timestamps:true});
//
// SubSchema.pre("save",  function (next) {
//     if(!this.renewalDate){
//         const renewalPeriods = {
//             daily: 1,
//             weekly: 7,
//             monthly: 30,
//             yearly: 365,
//         };
//         this.renewalDate = new Date(this.startDate);
//         this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
//     }
//
//         if(this.renewalDate > new Date()){
//             this.status = "inactive";
//         }
//
//     next();
// })




// SubSchema.pre("save", function (next) {
//     if (!this.startDate) {
//         this.startDate = new Date();
//     }
//
//     if (!this.renewalDate) {
//         const renewalPeriods = {
//             daily: 1,
//             weekly: 7,
//             monthly: 30
//         };
//
//         const daysToAdd = renewalPeriods[this.frequency];
//
//         if (daysToAdd) {
//             this.renewalDate = new Date(this.startDate);
//             this.renewalDate.setDate(this.renewalDate.getDate() + daysToAdd);
//         } else {
//             // If frequency is not valid, skip renewalDate calculation
//             console.warn('Invalid frequency value:', this.frequency);
//         }
//     }
//
//     // Set status based on renewalDate
//     if (this.renewalDate && this.renewalDate > new Date()) {
//         this.status = "inactive";
//     }
//
//     next();
// });



function setRenewalAndStatus(next) {
    if (!this.startDate) {
        this.startDate = new Date();
    }

    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30
        };

        const daysToAdd = renewalPeriods[this.frequency];
        if (daysToAdd) {
            this.renewalDate = new Date(this.startDate);
            this.renewalDate.setDate(this.renewalDate.getDate() + daysToAdd);
        }
    }

    if (this.renewalDate && this.renewalDate > new Date()) {
        this.status = "active";
    } else {
        this.status = "inactive";
    }

    next();
}

SubSchema.pre("save", setRenewalAndStatus);

// For updates using findOneAndUpdate etc
SubSchema.pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (!update) return next();

    if (!update.startDate) {
        update.startDate = new Date();
    }

    if (!update.renewalDate && update.frequency) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30
        };

        const daysToAdd = renewalPeriods[update.frequency];
        if (daysToAdd) {
            const newRenewalDate = new Date(update.startDate);
            newRenewalDate.setDate(newRenewalDate.getDate() + daysToAdd);
            update.renewalDate = newRenewalDate;
        }
    }

    if (update.renewalDate && update.renewalDate > new Date()) {
        update.status = "inactive";
    } else {
        update.status = "active";
    }

    this.setUpdate(update);
    next();
});



const sub = new mongoose.model("Sub",SubSchema);

export default sub;