import { Income } from '../models/Income.js';

export const createIncome = async (req, res) => {
  try {
    // Destructure the request body
    const { bankName, subHead, status, amount, total, TxnId } = req.body;

    // Create a new Income instance with the destructured values
    const income = new Income({
      bankName,
      subHead,
      status: status || 'completed',
      amount,
      total,
      TxnId
    });

    // Save the new income document
    await income.save();

    // Respond with success
    res.status(201).json({
      data: income,
      message: "Income created!!"
    });
  } catch (error) {
    console.log("Error in creating income transaction: ", error.message);
    res.status(500).json({
      message: "Error creating income transaction",
      error: error.message,
    });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const { id: incomeId } = req.params;
    console.log(`Deleting Income with ID: ${incomeId}`); // Log the Income ID for debugging

    // Find and delete the Income by its ID
    const deletedIncome = await Income.findByIdAndDelete(incomeId);

    // Check if the Income was found and deleted
    if (!deletedIncome) {
      console.log("Income not found");
      return res.status(404).json({
        message: "Income not found",
      });
    }

    // Respond with a success message
    res.status(200).json({
      message: "Income deleted successfully",
      deletedIncome: deletedIncome,
    });
  } catch (error) {
    console.log("Error deleting Income: ", error.message);
    res.status(500).json({
      message: "Error deleting Income",
      error: error.message,
    });
  }
};

// get all Income
export const getAllIncome = async (req, res) => {
    try {
      // Fetch all income records from the database
      const incomes = await Income.find();
  
      // Check if incomes were found
      if (!incomes || incomes.length === 0) {
        return res.status(404).json({
          message: "No incomes found",
        });
      }
  
      // Respond with the retrieved income data
      res.status(200).json({
        data: incomes,
        message: "All incomes retrieved successfully",
      });
    } catch (error) {
      console.log("Error fetching incomes: ", error.message);
      res.status(500).json({
        message: "Error fetching incomes",
        error: error.message,
      });
    }
  };
