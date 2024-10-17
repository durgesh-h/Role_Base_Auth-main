import { ExpenseModel, CommentModel } from "../models/expense.js";
import UserModel from "../models/user.js";
import { Income } from '../models/Income.js';
let count = 0;

export const createExpense = async (req, res) => {
  try {
    const { bankName, subHead, purpose, amount, total, status, TxnId, expenseId } = req.body;
     count ++;
     console.log(count)
     const currentDate = new Date();
     const date = currentDate.toLocaleDateString('en-CA');
    const voucherNo = `${date}/${count}`;
    let expense;

    if (!TxnId?.trim()) {
      expense = new ExpenseModel({
        bankName,
        subHead,
        purpose,
        amount,
        total,
        status,
        userId: req.user._id,
        voucherNo: voucherNo,
      });


      await expense.save();
    }
    else {
      expense = await ExpenseModel.findById(expenseId);

      if (expense) {
        expense.TxnId = TxnId || '';
        await expense.save();
      }
    }

    return res.status(201).json({
      message: "Expense created successfully",
      expense,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error creating expense",
      error: error.message,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { expenseId, commentText } = req.body;
    console.log("55" , commentText)

    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = req.user;

    const newComment = await CommentModel.create({
      commentText,
      userId: user._id,
      userName: user.name,
      userRole: user.role,
    })
    
    expense.comments.push(newComment);

    console.log(expense)

    await expense.save();

    res.status(200).json({
      message: "Comment created successfully",
      comment: newComment,
      expenseComments: expense.comments,
    });
  } catch (error) {
    console.log("Error in creating comment: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status, expenseId } = req.body;

    const updatedStatus = await ExpenseModel.updateOne(
      { _id: expenseId },
      { $set: { status: status } }
    );

    res.status(200).json({
      message: "status updated uccesfully",
      user: updatedStatus,
    });
  } catch (error) {
    console.log("error in updateStatus ", error.message);
  }
};

export const getExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    let getExpense
    const user = await UserModel.findById(userId);
    const userRole = user.role;
    console.log(userRole);

    // setting conditions
    if (userRole === 'accountant') {
      getExpense = await ExpenseModel.find({ status: 'approved' }).populate('comments', 'userName userRole commentText createdAt');
    }
    else if (userRole == 'bursar') {
      getExpense = await ExpenseModel.find({ status: 'pending' }).populate('comments', 'userName userRole commentText createdAt');
    }
    else if (userRole == 'principal') {
      getExpense = await ExpenseModel.find({ status: 'verified' }).populate('comments', 'userName userRole commentText createdAt');
    }
    else if (userRole == 'admin') {
      getExpense = await ExpenseModel.find().populate('comments', 'userName userRole commentText createdAt');
    }
    else {
      return res.status(403).json({
        message: "you are unauthorized to access data",
      });
    }

    console.log(getExpense)

    res.status(200).json({
      message: "expense get succesfulley",
      Id: userId,
      role: userRole,
      Expenses: getExpense,
    });

  } catch (error) {
    console.log("error in getting Expense ", error.message);
  }
};
export const filterExpensesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, subHead, status } = req.body;
    console.log('Body startDate:', startDate); // Log the body parameter
    console.log('Body endDate:', endDate);     // Log the body parameter

    // Initialize the filter object
    const filter = {};

    // Handle date filtering: only if both startDate and endDate are provided
    if (startDate || endDate) {
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Please provide both startDate and endDate in the format YYYY-MM-DD.' });
      }

      const providedStartDate = new Date(startDate);
      const providedEndDate = new Date(endDate);

      // Check if dates are valid
      if (isNaN(providedStartDate.getTime()) || isNaN(providedEndDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
      }

      // Ensure the start date is before or equal to the end date
      if (providedStartDate > providedEndDate) {
        return res.status(400).json({ message: 'startDate must be before or equal to endDate.' });
      }

      // Set the start of the startDate and the end of the endDate
      const startOfDay = new Date(providedStartDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(providedEndDate.setHours(23, 59, 59, 999));

      console.log('Start of Day:', startOfDay); // Log startOfDay
      console.log('End of Day:', endOfDay);     // Log endOfDay

      // Add the date range filter to the query
      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Handle subHead filtering if provided
    if (subHead?.trim()) {
      filter.subHead = subHead;
    }

    // Handle status filtering if provided
    if (status?.trim()) {
      filter.status = status;
    }

    // Log the constructed filter object
    console.log('Filter:', filter);

    // Fetch expenses based on the dynamically constructed filter
    const expenses = await ExpenseModel.find(filter);

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses by filters:', error);
    res.status(500).json({ message: 'Server error. Could not fetch expenses.' });
  }
};



// api to update expense 
export const updateExpense = async (req, res) => {
  try {
    const updateFields = req.body;
    const { id: expenseId } = req.params;
    const userId = req.user._id

    const user = await UserModel.findById(userId);
    if (user.role !== 'accountant') {
      return res.status(403).json({
        message: 'you are not authorized to edit expense'
      })

    }

    const updatedExpense = await ExpenseModel.findByIdAndUpdate(expenseId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    const Expense = await ExpenseModel.findById(expenseId);


    console.log(' Expense', Expense)
    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense
    });
  } catch (error) {
    console.log("Error updating expense: ", error.message);
    res.status(500).json({
      message: "Error updating expense",
      error: error.message
    });
  }
};

export const getTotalExpenseAmount = async (req, res) => {
  try {
    // Aggregate total of all amounts
    const totalAmount = await ExpenseModel.aggregate([
      {
        $group: {
          _id: null, // We don't want to group by any specific field, so use null
          totalAmount: { $sum: "$amount" } // Sum the 'amount' field for all documents
        }
      }
    ]);

    const totalExpence = await ExpenseModel.countDocuments()
    const totalIncome  = await Income.countDocuments()
    const totalPendingExpenses = await ExpenseModel.countDocuments({ status: 'pending' });
    res.status(200).json({
      message: "Total amount calculated successfully",
      totalAmount: totalAmount,
      totalExpence: totalExpence,
      totalIncome:totalIncome,
      totalPendingExpenses: totalPendingExpenses
    });
  } catch (error) {
    console.log("Error calculating total amount: ", error.message);
    res.status(500).json({
      message: "Error calculating total amount",
      error: error.message
    });
  }
};


export const deleteExpense = async (req, res) => {
  try {
    const { id: expenseId } = req.params;
    console.log(`Deleting expense with ID: ${expenseId}`);  // Log the expense ID for debugging

    // Find and delete the expense by its ID
    const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);

    // Check if the expense was found and deleted
    if (!deletedExpense) {
      console.log("Expense not found");
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // If comments are stored in a separate collection, delete those as well
    await CommentModel.deleteMany({ _id: { $in: deletedExpense.comments } });

    // Respond with a success message
    res.status(200).json({
      message: "Expense and related comments deleted successfully",
      deletedExpense: deletedExpense,
    });

  } catch (error) {
    console.log("Error deleting expense: ", error.message);
    res.status(500).json({
      message: "Error deleting expense",
      error: error.message,
    });
  }
};
