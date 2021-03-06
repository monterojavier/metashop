const { Category, Item, User } = require("./models");
const express = require("express");
const app = express();
const cors = require("cors");

// const { body, validationResult } = require("express-validator");
const PORT = 3001;
app.use(cors());
const seed = require("./seed");

app.use(express.json());
require("./models");

app.use(cors());
//invoke our seed function
seed();

// GET User
app.get("/user/:email", async (req, res, next) => {
  const email = req.params.email;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  res.send(user);
});

app.get("/categories", async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.send(categories);
  } catch (err) {
    next(err);
  }
});

app.get("/categories/:id/items", async (req, res, next) => {
  try {
    const itemsInCategory = await Item.findAll({
      where: {
        CategoryId: req.params.id,
      },
    });
    res.send(itemsInCategory);
  } catch (err) {
    next(err);
  }
});

// GET items
app.get("/items", async (req, res, next) => {
  const items = await Item.findAll();
  res.json(items);
});

// GET single item
app.get("/items/:itemId", async (req, res, next) => {
  try {
    const item = await Item.findOne({
      where: {
        id: req.params.itemId,
      },
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// GET cart
app.get("/user/:email/cart", async (req, res, next) => {
  const email = req.params.email;

  try {
    //Finds the User by email and with that retrival includes the their added items in the cart
    const cart = await User.findOne({
      where: {
        email: email,
      },
      include: [Item],
    });

    res.send(cart);
  } catch (error) {
    next(error);
  }
});

// POST/Create item
app.post("/items", async (req, res, next) => {
  try {
    const item = await Item.create(req.body);
    res.send(item);
  } catch (error) {
    next(error);
  }
});

// PUT: ADD TO CART
app.put("/items/:id/user/:email/cart", async (req, res, next) => {
  try {
    const id = req.params.id;
    const email = req.params.email;

    // Finds user by email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    // Finds item by PK
    const item = await Item.findByPk(id);

    // Sequelize magic method to link the item to the user in the db
    user.addItems(item);

    res.send(200);
  } catch (error) {
    console.log("Issue with adding item to cart");
  }
});

//PUT/Update item
app.put("/items/:itemId", async (req, res, next) => {
  try {
    let updatedInfo = req.body;
    const updatedItem = await Item.update(updatedInfo, {
      where: {
        id: req.params.itemId,
      },
    });
    res.send(updatedItem);
  } catch (error) {
    next(error);
  }
});

//DELETE/Destroy item
app.delete("/items/:itemId", async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.itemId);
    const destroyedItem = await item.destroy();
    res.redirect("/items");
  } catch (error) {
    next(error);
  }
});

// DELETE remove from cart
app.delete("/items/:id/user/:email/cart", async (req, res, next) => {
  const id = req.params.id;
  const email = req.params.email;

  // Finds user by email
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  const item = await Item.findByPk(id);

  // Sequelize magic method to remove the item from the user in the db
  user.removeItems(item);
  res.send(200);
});

app.listen(PORT, () => {
  console.log(`Your server is now listening to port: ${PORT}`);
});
