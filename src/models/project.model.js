import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        name: {
            type: String, 
            required: true,
            unique: true,
            index: true
        },
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value >= this.startDate;
                },
                message: "End date must be later than start date",
            }
        },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "In-Progress", "Completed"],
        },
        logs: [{
            type: Schema.Types.ObjectId,
            ref: "Log"
        }],
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        totalHours: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
) 

export const Project = mongoose.model('Project', projectSchema);