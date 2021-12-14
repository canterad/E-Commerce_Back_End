const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags
router.get('/', async (req, res) => {
  try 
  {
    const tagData = await Tag.findAll({
      // JOIN with Products, using the ProductTag through table.
      include: [{ model: Product, through: ProductTag }]
    });

    res.status(200).json(tagData);
  } 
  catch (err) 
  {
    res.status(500).json(err);
  }
});

// GET a single tag
router.get('/:id', async (req, res) => {
  try 
  {
    const tagData = await Tag.findByPk(req.params.id, {
      // JOIN with Product using the ProductTag through table.
      include: [{ model: Product, through: ProductTag }]      
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(tagData);
  } 
  catch (err) 
  {
    res.status(500).json(err);
  }
});

// CREATE a new Tag.
router.post('/', async (req, res) => {
  try
  {
    // Use Sequelize's `create()` method to add a row to the table
    // Similar to `INSERT INTO` in plain SQL.
    const newTag = await Tag.create({
      tag_name: req.body.tag_name
    });
    
    // Send the newly created row as a JSON object.
    res.json(newTag);
  }
  catch (err) 
  {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try
  {
    // Calls the update method on the Tag model
    const updatedTag = await Tag.update(
      {
        // All the fields you can update and the data attached to the request body.
        tag_name: req.body.tag_name,
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
    res.json(updatedTag);
  }
  catch (err)
  {
    res.status(500).json(err);    
  }
});

router.delete('/:id', async (req, res) => {
  try
  {
    // Looks for the tag based on id given in the request parameters and deletes the instance from the database.
    const deletedTag = Tag.destroy(
    {
      where: 
      {
        id: req.params.id,
      },
    })
    
    res.json(deletedTag);
  }
  catch (err)
  {
    res.json(err);
  }
});

module.exports = router;
