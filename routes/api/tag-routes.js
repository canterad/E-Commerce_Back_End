const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags.
router.get('/', async (req, res) => {
  try 
  {
    // Call the findAll method of the Tag model to get all of the rows from the Tag table.     
    const tagData = await Tag.findAll({

      // JOIN with Products, using the ProductTag through table.
      include: [{ model: Product, through: ProductTag }]
    });

    // Return the tagData - All Tag rows in the table.    
    res.status(200).json(tagData);
  } 
  catch (err) 
  {
    // Return the status 500 and the error object.    
    res.status(500).json(err);
  }
});

// GET a single tag by id.
router.get('/:id', async (req, res) => {
  try 
  {
    // Call the findByPk method of the Tag model to get the record from the Tag table
    // that matches the id value.    
    const tagData = await Tag.findByPk(req.params.id, {

      // JOIN with Product using the ProductTag through table.
      include: [{ model: Product, through: ProductTag }]      
    });

       // If the Tag id not found tell the user.
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    // Return the tagData item - Row that matches the id value passed in.
    res.status(200).json(tagData);
  } 
  catch (err) 
  {
    // Return the status code of 500 - the error object.    
    res.status(500).json(err);
  }
});

// Create a new Tag.
router.post('/', async (req, res) => {
  try
  {
    // Call the create method of the Tag model to add a new row to the Tag table.
    const newTag = await Tag.create({
      tag_name: req.body.tag_name
    });
    
    // Send the newly created row as a JSON object.
    res.status(200).json(newTag);
  }
  catch (err) 
  {
    // Return the status code of 500 and the error object.    
    res.status(500).json(err);
  }
});

// Update a tag by id.
router.put('/:id', async (req, res) => {
  try
  {
    // Calls the update method on the Tag model.
    const updatedTag = await Tag.update(
      {
        // All the fields you can update and the data attached to the request body.
        tag_name: req.body.tag_name,
      },
      {
        // Gets the tag based on the id given in the request parameters.
        where: 
        {
          id: req.params.id,
        },
      }
    )
 
    // Tell the user that the Tag record was updated successfully.
    res.status(200).json({ message: "The Tag record with the id value: " + req.params.id.toString() + " was updated successfully." });    
  }
  catch (err)
  {
    // Return the status code of 500 and the error object.      
    res.status(500).json(err);    
  }
});

// Delete a tag by id.
router.delete('/:id', async (req, res) => {
  try
  {
    // Call the destroy method of the Tag model to delete the Tag row in the table.     
    const deletedTag = Tag.destroy(
    {
      where: 
      {
        id: req.params.id,
      },
    })
    
    // Tell the user that the Tag record was deleted successfully.
    res.status(200).json({ message: "The Tag record with the id value: " + req.params.id.toString() + " was deleted successfully." });    
  }
  catch (err)
  {
    // Return the error object.          
    res.json(err);
  }
});

module.exports = router;
