import dynamoDBClient from "../database/index";
import ProductService from "./products"

const productService = new ProductService(dynamoDBClient());
export default productService;