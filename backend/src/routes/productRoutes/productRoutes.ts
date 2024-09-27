import express, { Request, Response } from 'express';
import { tempUpload } from '../../middleware/multerMiddleware';
import { Product } from '../../models/models';
import * as fs from 'fs';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      sortBy = 'createdAt',
      sortOrder = '-1',
      page = '1',
      search,
      pageSize = '12',
      minPrice,
      maxPrice,
      onSale,
      availableSizes,
      brands,
      ...filters
    } = req.query;

    const parsedPageSize = Number(pageSize);
    const parsedPage = Number(page);
    const sort = { [sortBy as string]: parseInt(sortOrder as string, 10) as 1 | -1 };

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter: any = {};
      if (minPrice) {
        priceFilter.$gte = Number(minPrice);
      }
      if (maxPrice) {
        priceFilter.$lte = Number(maxPrice);
      }
      filters.price = priceFilter;
    }

    // onSale filter (products where lastPrice > price)
    if (onSale === 'true') {
      filters.$expr = { $gt: ['$lastPrice', '$price'] };
    }

    // Available Sizes filter (filter products by selected sizes)
    if (availableSizes) {
      const sizesArray = Array.isArray(availableSizes) ? availableSizes : [availableSizes as string];
      filters.availableSizes = { $all: sizesArray };
    }

    // Brand filter (filter products by selected brands)
    if (brands) {
      const brandArray = Array.isArray(brands) ? brands : [brands as string];

      filters.brand = { $in: brandArray };
    }

    let pipeline = [];

    if (search) {
      pipeline.push({
        $search: {
          index: 'SearchProducts',
          text: { query: search, path: { wildcard: '*' } },
        },
      });
    }

    pipeline.push(
      { $match: filters },
      {
        $facet: {
          data: [
            { $sort: sort },
            ...(parsedPageSize > 0 ? [{ $skip: (parsedPage - 1) * parsedPageSize }, { $limit: parsedPageSize }] : []), // Apply pagination only if pageSize > 0
          ],
          metadata: [{ $count: 'totalCount' }],
        },
      },
    );

    // Execute the aggregation pipeline
    const [{ data: products, metadata }] = await Product.aggregate(pipeline);
    const totalCount = metadata[0]?.totalCount || 0;

    return res.status(200).json({ success: true, products, totalCount });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}` });
  }
});

router.get('/:productId', async (req, res) => {
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

router.post('/', tempUpload.array('productImg'), async (req: Request, res: Response) => {
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

router.patch('/:productId', async (req: Request, res: Response) => {
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

router.delete('/:productId', async (req: Request, res: Response) => {
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

export default router;
