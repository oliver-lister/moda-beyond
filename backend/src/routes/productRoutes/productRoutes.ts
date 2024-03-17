import express, { Request, Response } from 'express';
import { tempUpload } from '../../middleware/multerMiddleware';
import { Product } from '../../models/models';
import { port } from '../../index';
import { SortOrder } from 'mongoose';
import * as fs from 'fs';

const router = express.Router();

router.post('/add', tempUpload.array('productImg'), async (req, res) => {
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

    fs.rename(tempPath, newPath, (err: any) => (err ? console.log(err.message) : console.log('Successfully renamed the directory with Product Id.')));

    // Update the product with image URLs
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (img: Express.Multer.File) => `http://localhost:${port}/images/${newProduct.id}/${img.filename}`,
    );

    newProduct.images = imageUrls;

    await newProduct.save();

    return res.status(201).json({ success: true, message: 'Product added', product: newProduct });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

router.delete('/remove/:productId', async (req, res) => {
  try {
    const id = req.params.productId;
    await Product.findOneAndDelete({ _id: id });

    const imageFolderPath = `./upload/images/${id}`;

    // Remove local image file folder
    fs.rmSync(imageFolderPath, { recursive: true, force: true });

    return res.status(204).json({ success: true, message: `Product deleted: ${id}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

router.get('/fetchproducts', async (req: Request, res: Response) => {
  try {
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = parseInt(req.query.sortOrder as string) || 1;

    const query = req.query ? req.query : {};
    delete query.sortBy;
    delete query.sortOrder;

    const sort = { [sortBy as string]: sortOrder as SortOrder };
    const products = await Product.find(query).sort(sort);

    return res.status(200).json({ success: true, message: 'Products fetched successfully', products });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

router.get('/searchproducts', async (req: Request, res: Response) => {
  try {
    const sortBy = req.query.sortBy as string | undefined;
    const search = req.query.search as string | undefined;
    const sortOrder = parseInt(req.query.sortOrder as string) || 1;

    const searchQuery = search ? { $text: { $search: search, $caseSensitive: false } } : {};

    const sort = { [sortBy as string]: sortOrder as SortOrder };

    // Uncomment next line to create text indexes on startup
    // Product.createIndexes();

    const products = await Product.find(
      { ...searchQuery },
      {
        score: { $meta: 'textScore' },
      },
    ).sort({ score: { $meta: 'textScore' }, ...sort });

    return res.status(200).json({ success: true, message: 'Products searched and fetched successfully', products });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

router.get('/fetchproductbyid/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found', errorCode: 'PRODUCT_NOT_FOUND' });
    }
    res.status(200).json({ success: true, message: 'Product fetched successfully', product });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
