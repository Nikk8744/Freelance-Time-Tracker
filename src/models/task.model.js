import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        subject: {
            type: String,
            required: true,
            trim: true,
            index: true,
            minLength: [3, "Subject must be at least 3 characters"],
            maxLength: [50, "Subject must be at most 50 characters"],
        },
        description: {
            type: String,
            required: false,
        },
        assignedUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "In-Progress", "Done"],
            default: "Pending",
        },
        startDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        dueDate: {
            type: Date,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        checklist: [{
            item: {
                type: String,
            },
            isCompleted: {
                type: Boolean,
                default: false,
            },
        }],
        totalTimeSpentOnTask: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

export const Task = mongoose.model("Task", taskSchema);