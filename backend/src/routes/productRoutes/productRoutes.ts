import express, { Request, Response } from 'express';
import { tempUpload } from '../../middleware/multerMiddleware';
import { Product } from '../../models/models';
import { port } from '../../index';
import { SortOrder } from 'mongoose';
import * as fs from 'fs';

const router = express.Router();

router.post('/add', tempUpload.array('productImg'), async (req: Request, res: Response) => {
  try {
    const newProductData = {
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      availableSizes: JSON.parse(req.body.availableSizes),
      availableColors: JSON.parse(req.body.availableColors),
      description: req.body.description,
      material: req.body.material,
      price: req.body.price,
    };

    const newProduct = await Product.create(newProductData);

    const tempPath = './upload/images/tempDir';
    const newPath = `./upload/images/${newProduct.id}`;

    fs.rename(tempPath, newPath, (err: any) => (err ? console.log(err.message) : console.log('Successfully renamed the directory with Product Id.')));

    // Update the product with image URLs
    const imageUrls = (req.files as Express.Multer.File[]).map((img: Express.Multer.File) => `/images/${newProduct.id}/${img.filename}`);

    newProduct.images = imageUrls;

    await newProduct.save();

    return res.status(201).json({ success: true, message: 'Product added', product: newProduct });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

router.patch('/edit/:productId', async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    if (!productId) return res.status(404).json({ success: false, error: 'Product ID not supplied', errorCode: 'NO_PRODUCT_ID' });

    const newProductData = {
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      availableSizes: req.body.availableSizes,
      availableColors: req.body.availableColors,
      description: req.body.description,
      material: req.body.material,
      price: req.body.price,
    };
    console.log(newProductData);

    const productToUpdate = await Product.findById(productId);
    if (!productToUpdate) return res.status(404).json({ success: false, error: 'Cannot find product to update', errorCode: 'PRODUCT_NOT_FOUND' });

    // Update each property individually
    if (newProductData.name) productToUpdate.name = newProductData.name;
    if (newProductData.category) productToUpdate.category = newProductData.category;
    if (newProductData.brand) productToUpdate.brand = newProductData.brand;
    if (newProductData.availableSizes) productToUpdate.availableSizes = newProductData.availableSizes;
    if (newProductData.availableColors) productToUpdate.availableColors = newProductData.availableColors;
    if (newProductData.description) productToUpdate.description = newProductData.description;
    if (newProductData.material) productToUpdate.material = newProductData.material;
    productToUpdate.lastPrice = productToUpdate.price;
    if (newProductData.price) productToUpdate.price = newProductData.price;

    await productToUpdate.save();

    return res.status(200).json({ success: true, message: 'Product edited', product: productToUpdate });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

router.delete('/remove/:productId', async (req: Request, res: Response) => {
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

router.get('/fetch', async (req: Request, res: Response) => {
  try {
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = parseInt(req.query.sortOrder as string) || 1;
    const page = req.query.page !== undefined ? parseInt(req.query.page as string) : 1;
    const pageSize = 12;
    const search = req.query.search as string | undefined;

    const query = req.query ? { ...req.query } : {};

    delete query.sortBy;
    delete query.sortOrder;
    delete query.page;
    delete query.search;

    const sort = { [sortBy as string]: sortOrder as 1 | -1 };

    let pipeline = [];

    if (search) {
      pipeline = [
        {
          $search: {
            index: 'SearchProducts',
            text: {
              query: search,
              path: {
                wildcard: '*',
              },
            },
          },
        },
        { $match: query },
        {
          $facet: {
            products: [{ $sort: sort }, { $skip: (page - 1) * pageSize }, { $limit: pageSize }],
            totalCount: [{ $count: 'value' }],
          },
        },
      ];
    } else {
      pipeline = [
        { $match: query },
        {
          $facet: {
            products: [{ $sort: sort }, { $skip: (page - 1) * pageSize }, { $limit: pageSize }],
            count: [{ $count: 'value' }],
          },
        },
      ];
    }

    const [{ products, count }] = await Product.aggregate(pipeline);
    let totalCount = count[0].value;

    if (totalCount === undefined) totalCount = 0;

    return res.status(200).json({ success: true, message: 'Products fetched successfully', products, totalCount });
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
