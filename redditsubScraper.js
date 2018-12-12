const https = require('https');
const fs = require('fs');

const subreddit = process.argv[2];
const url = `https://www.reddit.com/r/${subreddit}/top.json`
const numResults = 10;

const writeStream = fs.createWriteStream(`${subreddit}.csv`);
// Write Headers
writeStream.write(`Score,Title,Author,Number of Comments,URL \n`);

try
{
    const request = https.get(url, response => {
        if (response.statusCode === 200)
        {
            let subredditString = '';
            response.on('data', chunk => {
                subredditString += chunk;
            });
            response.on('end', () => {
                try {
                    const subredditJson = JSON.parse(subredditString);
                    const posts = subredditJson.data.children;
                    for (let i = 0; i < numResults; i++) {
                        let score = posts[i].data.score;
                        let title = posts[i].data.title;
                        let author = posts[i].data.author;                        
                        let numComments = posts[i].data.num_comments;
                        let url = posts[i].data.url;
                        
                        //Write Row to CSV
                        writeStream.write(`${score}, ${title}, ${author}, ${numComments}, ${url}\n`);
                    }
                    console.log("Scraping done...");
                    
                } catch (error) {
                    printError(error);
                }
            });
        }
        else
        {
            const statusErrorCode = new Error(`There was an error getting the info for "${subreddit}"`);
            printError(statusErrorCode);
        }
    });
}
catch(error)
{
    printError(error);
}

function printError(error) {
    console.error(error.message);
}
