import { Router } from "express";
import { createIncome  , deleteIncome , getAllIncome} from "../controllers/Income.js";
import { IsUser } from "../middleware/verifyToken.js";
const IncomeRoutes = Router();


IncomeRoutes.post('/createIncome', IsUser, createIncome);
IncomeRoutes.delete('/deleteIncome/:id', IsUser, deleteIncome);
IncomeRoutes.get('/getIncome', IsUser, getAllIncome);

export default IncomeRoutes
