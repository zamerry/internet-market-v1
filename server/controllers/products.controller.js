import ProductsService from "../services/products.service.js";

class ProductsController {
    async search(req, res, next) {
        try {
            const {product} = req.body
            const productData = await ProductsService.search(product)
            return res.json({result: productData})
        } catch (e) {
            next(e)
        }
    }
}

export default new ProductsController()