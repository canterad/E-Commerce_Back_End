const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// Get all Categories.
router.get('/', async (req, res) => {
  try 
  {
    // Call the findAll method of the Category model to get all of the rows from the Category table. 
    // Include the Product model.
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });

    // Return the categoryData - All Category rows in the table.
    res.status(200).json(categoryData);
  } 
  catch (err) 
  {
    // Return the status 500 and the error object.
    res.status(500).json(err);
  }
});

// Get category by id value passed in.
router.get('/:id', async (req, res) => {
  try 
  {
    // Call the findByPk method of the Category model to get the record from the Category table
    // that matches the id value.  Include the Product model.
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    // If the Category id not found tell the user.
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    // Return the categoryData item - Row that matches the id value passed in.
    res.status(200).json(categoryData);
  } 
  catch (err) 
  {
    // Return the status code of 500 - the error object.
    res.status(500).json(err);
  }
});

// Create a new category.
router.post('/', async (req, res) => {
  try
  {
    // Call the create method of the Category model to add a new row to the Category table.
    const newCategory = await Category.create({
      category_name: req.body.category_name
    });
    
    // Send the newly created row as a JSON object.
    res.status(200).json(newCategory);
  }
  catch (err) 
  {
    // Return the status code of 500 and the error object.
    res.status(500).json(err);
  }
});

// Update a specific category.
router.put('/:id', async (req, res) => {
  try
  {
    // Calls the update method of the Category model to update the row data based on the id
    // value passed in.
    const updatedCategory = await Category.update(
      {
        // All the fields you can update and the data attached to the request body.
        category_name: req.body.category_name,
      },
      {
        // Gets the category based on the id given in the request parameters.
        where: 
        {
          id: req.params.id,
        },
      }
    )
 
    // Tell the user that the Category record was updated successfully.
    res.status(200).json({ message: "The Category record with the id value: " + req.params.id.toString() + " was updated successfully." });    
  }
  catch (err)
  {
    // Return the status code of 500 and the error object.    
    res.status(500).json(err);    
  }
});

// Delete a category by id.
router.delete('/:id', async (req, res) => {
  try
  {
    // Call the destroy method of the Category model to delete the Category row in the table 
    // based on id given in the request parameters.
    const deletedCategory = Category.destroy(
    {
      where: 
      {
        id: req.params.id,
      },
    })

    // Tell the user that the Category record was deleted successfully.
    res.status(200).json({ message: "The Category record with the id value: " + req.params.id.toString() + " was deleted successfully." });
  }
  catch (err)
  {
    // Return the error object.        
    res.json(err);
  }
});

module.exports = router;
