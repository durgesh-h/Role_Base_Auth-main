import express from 'express'
import { createExpense, createComment, updateStatus, getExpense,filterExpensesByDateRange , updateExpense , getTotalExpenseAmount  , deleteExpense} from '../controllers/Expense.js'
import { IsUser } from '../middleware/verifyToken.js'
const ExpenseRoutes = express.Router();

ExpenseRoutes.post('/createExpense', IsUser, createExpense);
ExpenseRoutes.post('/createComment', IsUser, createComment);
ExpenseRoutes.patch('/updateStatus', IsUser, updateStatus);
ExpenseRoutes.get('/getExpense', IsUser, getExpense);
ExpenseRoutes.post('/filterDate', IsUser, filterExpensesByDateRange);
ExpenseRoutes.post('/updateExpense/:id', IsUser, updateExpense);

ExpenseRoutes.get('/getTotal', IsUser, getTotalExpenseAmount);
ExpenseRoutes.delete('/deleteExpense/:id', IsUser, deleteExpense );

export default ExpenseRoutes;