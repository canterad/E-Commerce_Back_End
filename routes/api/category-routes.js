const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try 
  {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } 
  catch (err) 
  {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try 
  {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } 
  catch (err) 
  {
    res.status(500).json(err);
  }
});

// CREATE a new category.
router.post('/', async (req, res) => {
  try
  {
    // Use Sequelize's `create()` method to add a row to the table
    // Similar to `INSERT INTO` in plain SQL
    const newCategory = await Category.create({
      category_name: req.body.category_name
    });
    
    // Send the newly created row as a JSON object
    res.json(newCategory);
  }
  catch (err) 
  {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try
  {
    // Calls the update method on the Category model
    const updatedCategory = await Category.update(
      {
        // All the fields you can update and the data attached to the request body.
        category_name: req.body.category_name,
      },
      {
        // Gets the category based on the id given in the request parameters
        where: 
        {
          id: req.params.id,
        },
      }
    )
 
    // Send the updated category as a json response.
    res.json(updatedCategory);
  }
  catch (err)
  {
    res.status(500).json(err);    
  }
});

router.delete('/:id', async (req, res) => {
  try
  {
    // Looks for the books based on isbn given in the request parameters and deletes the instance from the database
    const deletedCategory = Category.destroy(
    {
      where: 
      {
        id: req.params.id,
      },
    })
    
    res.json(deletedCategory);
  }
  catch (err)
  {
    res.json(err);
  }
});

module.exports = router;
