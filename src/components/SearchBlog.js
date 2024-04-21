
import React, { useState, useEffect } from 'react'
import { FaMicrophone } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { SlLike } from "react-icons/sl";
import { useLocation } from 'react-router-dom';

function SearchBlog() {
    const location = useLocation();
    const apiUrl = process.env.REACT_APP_SERVER_URL;
    const [searchTitles, setSearchTitles] = useState('');
    const [blogs, setBlogs] = useState([])
    const [blogTitles, setBlogTitles] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [mostSimilarWords, setMostSimilarWords] = useState([])

    const [filteredBlog, setFilteredBlog] = useState()
    const navigate = useNavigate()

    
    useEffect(() => {
        if (location.state && location.state.searchTitle) {
            setSearchTitles(location.state.searchTitle)
            console.log('Search Title:', location.state.searchTitle);
        }
    }, [location.state]);

    useEffect(() => {
        if (searchTitles !== '') {
            searchBlog();
        }
    }, [blogTitles]);



    function getWordsFromTitle(responseData) {
        console.log("blogTitles")
        console.log(responseData)
        let words = [];
        responseData.forEach(blog_object => {
            // Extract title one by one
            let blog_title = blog_object.title;
            // Split title by space and extract words
            let titleWords = blog_title.split(" ");
            // Add words to the list
            words.push(...titleWords);
        });
        // Remove duplicates before returning: Convert array to Set and then back to array
        return [...new Set(words)];
    }

    // When page renders, get all titles to create a word list from titles

    // useEffect(() => {
    //     async function fetchBlogTitles() {
    //         try {
    //             const response = await fetch(`${apiUrl}/get_blog_title`, { // ensure endpoint is correct
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //             });

    //             if (response.ok) {
    //                 const responseData = await response.json(); // Parse the JSON response body
    //                 setBlogTitles(responseData); // Update the state with fetched titles

    //                 // Extract words from titles and remove duplicates
    //                 const words = getWordsFromTitle(responseData);
    //                 setWordList(words); // Update the state with the unique word list
    //                 console.log("Unique words from titles:", words);
    //             } else {
    //                 // Handle errors according to your API's schema
    //                 throw new Error('Failed to fetch titles');
    //             }
    //         } catch (err) {
    //             console.error("Error occurred while fetching blog titles:", err);
    //         }
    //     }

    //     fetchBlogTitles(); // Call the async function
    // }, [apiUrl]); // Dependency array to ensure useEffect runs only when apiUrl changes

    useEffect(() => {
        async function fetchBlogTitles() {
            try {
                const response = await fetch(`${apiUrl}/fetch_blogs`, { // ensure endpoint is correct
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                if (response.ok) {
                    const responseData = await response.json(); // Parse the JSON response body
                    console.log(responseData)
                    const titles = responseData.map(blog => ({ title: blog.title }));
                    console.log("titles")
                    console.log(titles)
                    setBlogTitles(titles); // Update the state with blog titles

                    setBlogs(responseData); // Update the state with fetched titles
                } else {
                    // Handle errors according to your API's schema
                    throw new Error('Failed to fetch titles');
                }
            } catch (err) {
                console.error("Error occurred while fetching blog titles:", err);
            }
        }

        fetchBlogTitles(); // Call the async function
    }, [apiUrl]); // Dependency array to ensure useEffect runs only when apiUrl changes


    function handleInput(e) {
        setSearchTitles(e.target.value);
    }

    // finding min distance to convert 1 word to other.
    function levenshteinDistance(word1, word2) {
        const m = word1.length;
        const n = word2.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) {
            for (let j = 0; j <= n; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                } else if (j === 0) {
                    dp[i][j] = i;
                } else if (word1[i - 1] === word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
                }
            }
        }

        return dp[m][n];
    }

    //pass input_word and each product or quantity item as wordList 
    function findMostSimilarWord(word1, wordList) {
        let similarWordMap = new Map();

        for (let i = 0; i < wordList.length; i++) {
            let word2 = wordList[i];
            let threshold;
            const distance = levenshteinDistance(word1, word2);
            if (word1.length > word2.length) {
                threshold = Math.floor(word1.length / 2);
            } else {
                threshold = Math.floor(word2.length / 2);
            }

            if (distance <= threshold) {
                similarWordMap.set(word2, distance);
            }
        }

        let similarWord = null;
        let minDistance = Infinity;
        for (let [word, distance] of similarWordMap) {
            if (distance < minDistance) {
                similarWord = word;
                minDistance = distance;
            }
        }
        return similarWord;
    }

    //finding similar words for voice blog title ie preprocessing voice.
    async function convertIntoSimilarWords(voice, wordList) {
        const inputWords = voice.toLowerCase().split(" ");
        const mostSimilarWord = [];

        for (let i = 0; i < inputWords.length; i++) {
            const matchWord = findMostSimilarWord(inputWords[i], wordList);
            if (matchWord !== undefined) {
                mostSimilarWord.push(matchWord);
            }
        }
        return mostSimilarWord; // Return the array
    }

    function sortBlogTitles(blogTitles, inputTitleWords) {
        // Sort the titles based on the number of matching words found in inputTitleWords
        return blogTitles.sort((a, b) => {
            const aMatches = inputTitleWords.filter(word => a.title.toLowerCase().includes(word)).length;
            const bMatches = inputTitleWords.filter(word => b.title.toLowerCase().includes(word)).length;
            return bMatches - aMatches; // Descending sort
        });
    }

    async function searchBlog() {
       
        console.log("searchTitles........")

        console.log(searchTitles)


        // Extract words from titles and remove duplicates
        const words = getWordsFromTitle(blogTitles);
        setWordList(words); // Update the state with the unique word list
        console.log("Unique words from titles:")
        console.log(words)

        //converting searched title words into most similar words present in wordlist  
        const similarWords = await convertIntoSimilarWords(searchTitles, words);

        //sort titles based on maximum matching word 
        const sortedTitles = sortBlogTitles(blogTitles, similarWords);

        console.log(sortedTitles);

        const searchedBlog = blogs.filter(blog => blog.title === sortedTitles[0].title);
        setFilteredBlog("searchedBlog......")
        setFilteredBlog(searchedBlog)
    }

    
    // display date in dd/mm/yyyy formate
    function formatDate(dateString) {
        const date = new Date(dateString); // Create a Date object from the ISO string
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' }; // Formatting options
        return date.toLocaleDateString('en-US', options); // Format the date in dd-mm-yyyy
    }


    return (
        <div className="d-flex justify-content-center">

            <div>
                <div className="container view mt-2 mb-2">
                    {filteredBlog && filteredBlog.map((blog, index) => (
                        <div className="row mt-4" key={index}>

                            <div className="col-sm-6">
                                <img className="d-block w-100 img-fluid mx-auto" src={blog.image_url} alt="blog image" style={{width:"400px",height:"400px",float:"right",borderRadius: "25px"}} />
                            </div>
                            <div className="col-sm-6">
                                <div className="" style={{ border: "none" }}>
                                    <h2>{blog.title}</h2>

                                    {/* div for like and date details */}
                                    <div className='d-flex '>
                                        <p className="text-primary">Category: {blog.category}
                                            {/* <SlLike className="text-primary" /> {5} */}
                                        </p>
                                        <p className='ms-2'>Created on: {formatDate(blog.date)}</p>
                                    </div>

                                    <p>{blog.description}</p>
                                    <button className="btn btn-primary me-2 btn btn-primary fs-5 col-3">Read More</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )


}

export default SearchBlog