const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET a all products.
router.get('/', async (req, res) => {
  try 
  {
    // Call the findAll method of the Product model to get all of the rows from the Product table. 
    const productData = await Product.findAll({
      // JOIN with Category and Tag, using the ProductTag through table.
      include: 
      [
        {
          model: Category,
        },
        {
          model: Tag, through: ProductTag
        }
      ]
    });      
 
    // Return the productData - All Product rows in the table.    
    res.status(200).json(productData);
  } 
  catch (err) 
  {
    // Return the status 500 and the error object.    
    res.status(500).json(err);
  }
});

// GET a single product.
router.get('/:id', async (req, res) => {
  try 
  {
    // Call the findByPk method of the Product model to get the record from the Product table
    // that matches the id value.    
    const productData = await Product.findByPk(req.params.id, {
      // JOIN with Category and Tag, using the ProductTag through table.
      include: 
      [
        {
          model: Category,
        },
        {
          model: Tag, through: ProductTag
        }
      ]
    });

    // If the Product id not found tell the user.    
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    // Return the productData item - Row that matches the id value passed in.
    res.status(200).json(productData);
  } 
  catch (err) 
  {
    // Return the status code of 500 - the error object.    
    res.status(500).json(err);
  }
});

// create new product.
router.post('/', (req, res) => {
  // req.body should look like this...
  //  {
  //    product_name: "Basketball",
  //    price: 200.00,
  //    stock: 3,
  //    tagIds: [1, 2, 3, 4]
  //  }
  
    // Call the create method of the Product model to add a new row to the Product table.  
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond.
      res.status(200).json(product);
    })
    
    // Send the Product Tag Ids as a JSON object.
    .then((productTagIds) => res.status(200).json(productTagIds))
    
    // Send the status code of 400 and the error object.
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// DELETE a Product
router.delete('/:id', async (req, res) => {
  try 
  {
    // Call the destroy method of the Product model to delete the Product row in the table 
    // based on id given in the request parameters.    
    const productData = await Product.destroy({
      where: 
      {
        id: req.params.id
      }
    });

    // Tell the user that the Product record was deleted successfully.
    res.status(200).json({ message: "The Product record with the id value: " + req.params.id.toString() + " was deleted successfully." });    
  } 
  catch (err) 
  {
    // Return the error object.          
    res.status(500).json(err);
  }
});

module.exports = router;
