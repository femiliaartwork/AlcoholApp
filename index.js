import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Dynamic year in footer
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  next();
});

// Home page
app.get("/", (req, res) => {
  res.render("index", { alcohol: null, error: null });
});

  // Search for alcohol
  app.get("/search", async (req, res) => {
      const drink = req.query.s;
      console.log(drink);
      try {
        const response = await axios.get(API_URL+`search.php?s=${drink}`);
        // console.log(response.data);
        
        // Get the list of drinks from the response
        const drinks = response.data.drinks;
        
        if (drinks && drinks.length > 0) {
          // Map the drinks to extract required information any store in a new array called alcohols
          const alcohols = drinks.map(drink => ({
            name: drink.strDrink,
            image: drink.strDrinkThumb,
            description: drink.strInstructions
          }));
          res.render("index", { alcohol: alcohols, error: null });
        } else {
          res.render("index", { alcohol: null, error: "Drink not found. Are you drunk already?!" });
        }
      } catch (err) {
        res.render("index", { alcohol: null, error: "Something went wrong. Please try again." });
      }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  