import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
app.use(express.json());

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;
  try {
    // Fetch the HTML content of the page
    const url = `https://www.amazon.com/s?k-${encodeURIComponent(keyword)}`;
    // Note: The URL structure may vary, adjust accordingly
    // Example: https://www.amazon.com/s?k=keyword
    console.log(`Fetching URL: ${url}`);
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    // Parse the HTML content using JSDOM
    // Extract product information
    const products = Array.from(
      dom.window.document.querySelectorAll(
        "[data-component-type='s-search-result']"
      )
    ).map((item) => {
      return {
        title: item.querySelector("h2")?.textContent || "",
        rating: item.querySelector(".a-icon-alt")?.textContent || "",
        reviews: item.querySelector(".a-size-base")?.textContent || "",
        image: item.querySelector("img")?.getAttribute("src") || "",
      };
    });
    console.log("Scraped products:", products);
    // Send the scraped data as a JSON response
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
