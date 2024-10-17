import mongoose from "mongoose";

// Comment Schema (as before)
const commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true,
        enum: ['admin', 'user', 'accountant', 'bursar', 'principal'] // Match with user roles
    },
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference the User model
        required: true
    }
}, { timestamps: true });

// Expense Schema with additional status field and comments
const expenseSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required: true,
        default: 'Corpus Fund'
    },
    subHead: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    TxnId: {
        type: String,
        required: false,
        default: null
    },
    amount: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    // New Status field with ENUM values
    status: {
        type: String,
        enum: ['pending', 'verified', 'approved', 'completed', 'rejected'],
        default: 'pending' // Default value is pending
    },
    verifiedDate: {
        type: Date,
        default: null
    },
    approvedDate: {
        type: Date,
        default: null
    },
    completedDate: {
        type: Date,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference the User model
        required: true
    },
    voucherNo:{
        type:String,
        require:true
    },
    comments: [{
        type: commentSchema
    }]
}, { timestamps: true });

// Models
export const ExpenseModel = mongoose.model('expenses', expenseSchema);
export const CommentModel = mongoose.model('comment', commentSchema);

