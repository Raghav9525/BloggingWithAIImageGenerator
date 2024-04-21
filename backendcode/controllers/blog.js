require('dotenv').config();
const cors = require('cors')
const mysql = require('mysql2');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const apiKey = process.env.OPENAI; // Assuming your environment variable for OpenAI API key is OPENAI_API_KEY
const fs = require('fs');
const path = require('path');

//database connection
const pool = require('../db'); // Adjust the path as necessary




const downloadImage = async (req, imageUrl) => {
    console.log("Downloading image...");
    const imagesDir = path.join(__dirname, '../images');
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const imageResponse = await fetch(imageUrl, { timeout: 60000 }); // Increase timeout to 60 seconds
            const imageArrayBuffer = await imageResponse.arrayBuffer();
            const imageBuffer = Buffer.from(imageArrayBuffer);

            // Cloudinary logic

            // Ensure the directory exists
            if (!fs.existsSync(imagesDir)) {
                fs.mkdirSync(imagesDir, { recursive: true });
            }

            // Define the path where the image will be saved
            const imageName = `downloaded_image_${new Date().toISOString().replace(/:/g, '-')}.png`;
            const imagePath = path.join(imagesDir, imageName);

            // Write the image data to a file in the images directory
            fs.writeFileSync(imagePath, imageBuffer);

            const fullUrl = `${req.protocol}://${req.get('host')}/images/${imageName}`;
            console.log("Image downloaded and saved successfully:", fullUrl);
            return fullUrl;
        } catch (error) {
            console.error('Error downloading or saving the image:', error);
            retryCount++;
            console.log(`Retry attempt ${retryCount}...`);
        }
    }

    console.error('Max retries reached. Failed to download the image.');
    return null;
};


const generateImage = async (req, res) => {
    const { title, category, description } = req.body;
    const myprompt = title + " " + description;
    console.log("Generating image for:", myprompt);

    try {
        const prompt = myprompt;
        const url = "https://api.openai.com/v1/images/generations";

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            })
        });

        if (!response.ok) {
            console.error('Error occurred while processing the request:', response.statusText);
            return res.status(500).json({ message: 'Failed to process the request' });
        }

        // get response from OpenAI server with generated image URL
        const data = await response.json();
        console.log('Image URL:', data.data[0].url);

        // function call to downloadImage
        const downloadedImageUrl = await downloadImage(req, data.data[0].url);

        if (downloadedImageUrl) {
            // SQL query to insert blog details into the database
            const sql = "INSERT INTO blog (title,  description,category, image_url,date) VALUES (?, ?, ?, ?,?)";
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        
            const values = [title,  description,category, downloadedImageUrl,formattedDate];

            // store blog details in database
            pool.getConnection((error, connection) => {
                if (error) {
                    return res.status(500).json({ message: 'Internal server error' });
                }
                connection.query(sql, values, (err, result) => {
                    connection.release(); // Release the database connection

                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    if (result.affectedRows > 0) {
                        res.json({ message: 'Image downloaded and saved successfully', url: downloadedImageUrl });
                    } else {
                        res.status(500).json({ message: 'Failed to download and save the image' });
                    }
                });
            });
        } else {
            res.status(500).json({ message: 'Failed to download and save the image' });
        }
    } catch (error) {
        console.error('Error in fetching data from OpenAI:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




const blogPost = async (req, res) => {
    const imagesDir = path.join(__dirname, '../images');

    const { title, description, imageUrl } = req.body;

    console.log(title, description, imageUrl)

    try {
        const url = await downloadImage(req, imageUrl, imagesDir); // Pass req as the first parameter
        console.log(url);
        res.json({ message: 'Image downloaded and saved successfully', url });
    } catch (error) {
        console.error('Error occurred while processing the request:', error);
        res.status(500).json({ message: 'Failed to process the request' });
    }
}



const fetchBlogs = (req, res) => {
    const sql = 'SELECT * FROM blog';
    // const sql1 = slect name form user 
    pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        connection.query(sql, (err, result) => {
            connection.release(); // Release the database connection

            if (err) {
                console.log(err)
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (result.length > 0) {
                console.log("Data Fetched")
                return res.status(200).json(result); // Send the titles as JSON response
            } else {
                return res.status(404).json({ message: 'No titles found' });
            }
        });
    });
}




const getBlogTitle = (req, res) => {
    const sql = 'SELECT title FROM blog';
    // const sql1 = slect name form user 
    pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        connection.query(sql, (err, result) => {
            connection.release(); // Release the database connection

            if (err) {
                console.log(err)
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (result.length > 0) {
                console.log(result)
                return res.status(200).json(result); // Send the titles as JSON response
            } else {
                return res.status(404).json({ message: 'No titles found' });
            }
        });
    });
}


module.exports = {
    blogPost,
    getBlogTitle,
    fetchBlogs,
    generateImage,
    // downloadImage
}