import db from "../database/db.js"

class ProductsService {
    async search(product) {

        if (!product || !product.trim()) {
            const getAll = await db.query(
                'select * from products where status = true'
            )
            return getAll.rows
        }

        const searchProducts = await db.query(
            'select * from products where product_name ilike $1', [`%${product}%`]
        )

        if (searchProducts.rows.length <= 0) {
            return []
        }

        return searchProducts.rows

    }
}

export default new ProductsService()