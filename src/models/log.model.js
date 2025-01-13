import mongoose, { Schema } from "mongoose";

const logSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        startTimeOfLog: {
            type: Date,
            required: true,
        },
        endTimeOfLog: {
            type: Date,
        },
        timeSpent: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    { 
        timestamps: true,
    }
);

export const Log = mongoose.model('Log', logSchema);