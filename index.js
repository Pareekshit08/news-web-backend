const express = require("express");
const cors = require("cors");
const  axios = require("axios");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const mongoose = require("mongoose");
const Users = require("./Mongo/connectDb");
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // List of allowed origins
    credentials: true, // Allow cookies to be sent
  }));
const {obj} = require("./jsonobjects");
const router = require("./Routes/routes");
const PORT = process.env.PORT || 3000;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';
const NEWS_API_KEY = 'cca19b6929e7462994626f574933ff84';
const {verifyLoggedIn} = require("./Services/auth");


app.use("/",router);

app.get('/news/search',verifyLoggedIn,async (req, res) => {

     

    //for almost all the queries
    const queries = parseInt(req.query);
    const {
        page = 1,
        limit = 20
    } = req.query;

    const {
        q='apple',
        searchIn = 'title,description,content',
        sources = null,
        domains = null,
        excludeDomains = null,
        from = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), // 7 days ago
        to = new Date().toISOString(), // Current date/time
        language = 'en',    
        sortBy = 'publishedAt'
    } = req.query;

    // Ensure `q` is provided
    if (!q) {
        return res.status(400).json({ error: "The query parameter 'q' is required." });
    }

    // try {
    //     // Build the request URL and parameters
    //     const response = await axios.get(NEWS_API_BASE_URL, {
    //         params : {
    //             q,
    //             searchIn,
    //             sources,
    //             domains,
    //             excludeDomains,
    //             from,
    //             to,
    //             language,
    //             sortBy,
    //             apiKey: NEWS_API_KEY // Include the API key here
    //         }
    //     });

    //     // Forward the response from the news API to the client
    //     res.status(200).json(response.data);
    // } catch (error) {
    //     // Handle errors
    //     console.error(error);
    //     res.status(500).json({
    //         error: "An error occurred while fetching news data.",
    //         details: error.response ? error.response.data : error.message
    //     });
    // } 
    
    res.status(200).json(obj);
});


app.get('/news/category/:category', async (req, res) => {
    // by the categories filter
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        // Simulating a database or API request for a specific category
        const articles = await fetchCategoryArticles(category, page, limit); // Custom DB/API logic here

        if (!articles.length) {
            return res.status(404).json({ message: "No articles found in this category." });
        }

        res.json(articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch category articles." });
    }
});


app.get('/api/news/filter', async (req, res) => {

    // by the domains filter

    const { sources, domains, excludeDomains = null } = req.query;


    if (!sources && !domains) {
        return res.status(400).json({ error: "Please specify at least one source or domain." });
    }

    try {
        // const filters = {
        //     sources: sources ? sources.split(',') : undefined,
        //     domains: domains ? domains.split(',') : undefined,
        //     excludeDomains: excludeDomains ? excludeDomains.split(',') : undefined
        // };
        // Fetch filtered articles
        //const articles = await fetchFilteredArticles(filters); // Custom DB/API logic here

        const response = await axios.get(NEWS_API_BASE_URL,{
            params:{
                sources,
                domains,
                excludeDomains
            }
        })

        const articles = response.date.articles;

        res.json(articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch filtered articles." });
    }
});


app.get('/api/news/daterange', async (req, res) => {
    // by dates
    const { from, to } = req.query;

    try {
        if (!from || !to) {
            return res.status(400).json({ error: "Both 'from' and 'to' date parameters are required." });
        }

        const fromDate = new Date(from).toISOString();
        const toDate = new Date(to).toISOString();

        // Fetch news within the date range
        const articles = await fetchArticlesByDateRange(fromDate, toDate); // Custom DB/API logic here

        res.json(articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch articles by date range." });
    }
});

app.get('/api/news/sort', async (req, res) => {
    // sorted by the articles
    const { sortBy = 'publishedAt' } = req.query;

    const validSortOptions = ['relevancy', 'popularity', 'publishedAt'];
    if (!validSortOptions.includes(sortBy)) {
        return res.status(400).json({ error: "Invalid 'sortBy' option. Use relevancy, popularity, or publishedAt." });
    }

    try {
        const sortedArticles = await fetchSortedArticles(sortBy); // Custom DB/API logic here

        res.json(sortedArticles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to sort articles." });
    }
});

app.post("/login",async(req,res)=>{
    const {name,email,password} = req.body;
    try{
       await Users.create({
            name,
            email,
            password
        });
        res.status(200).json({
            msg:"Successfully Registered!!!"
        });
    }catch(err){
        console.log("error occured while creating");
        console.log(err);
        res.status(404).json({
            msg:"Registration not successfull"
        });
    }
});

app.listen(PORT,()=>{
    console.log("Server is up on port "+PORT);
})
