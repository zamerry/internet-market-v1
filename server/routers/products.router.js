import {Router} from "express"
import ProductsController from "../controllers/products.controller.js";

const router = new Router()

router.post('/search', ProductsController.search)

export default router