import express from 'express';
import { tempUpload } from '../middleware/multerMiddleware';
import { Product } from '../models/models';
import { port } from '../index';
import mongoose from 'mongoose';
import * as fs from 'fs';

const router = express.Router();

router.post('/addproduct', tempUpload.array('productImg'), async (req, res) => {
  try {
    const newProductData = {
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      availableSizes: JSON.parse(req.body.availableSizes),
      availableColors: JSON.parse(req.body.availableColors),
      material: req.body.material,
      price: req.body.price,
    };

    const newProduct = await Product.create(newProductData);

    const tempPath = './upload/images/tempDir';
    const newPath = `./upload/images/${newProduct.id}`;

    fs.rename(tempPath, newPath, (err) => (err ? console.log(err) : console.log('Successfully renamed the directory with Product Id.')));

    // Update the product with image URLs
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (img: Express.Multer.File) => `http://localhost:${port}/images/${newProduct.id}/${img.filename}`,
    );

    newProduct.images = imageUrls;

    await newProduct.save(); // save new product to MongoDB

    res.json({
      success: 1,
      product: newProduct,
    });
  } catch (err) {
    res.json({
      success: 0,
      error: err,
    });
  }
});

router.post('/removeproduct', async (req, res) => {
  try {
    const id = req.body.id;
    await Product.findOneAndDelete({ _id: id });

    const imageFolderPath = `./upload/images/${id}`;

    // Remove local image file folder
    fs.rmSync(imageFolderPath, { recursive: true, force: true });

    console.log('Product removed: ' + id);
    res.json({
      success: 1,
      name: `${id} deleted`,
    });
  } catch (err) {
    res.json({
      success: 0,
      error: err,
    });
  }
});

router.get('/fetchproducts', async (req, res) => {
  try {
    const queryFilter = req.query ? req.query : {};

    const products = await Product.find(queryFilter);
    res.send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fetchproductbyid/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Convert productId to ObjectId
    const objectId = new mongoose.Types.ObjectId(productId);

    const product = await Product.findOne({ _id: objectId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
