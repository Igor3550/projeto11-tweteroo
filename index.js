import express from "express";
import cors from 'cors';

const app = express()
app.use(cors())
app.use(express.json())

/*Estrutura
{
	username: 'bobesponja', 
	avatar: "https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info" 
}
{
	username: "bobesponja",
  tweet: "eu amo o hub"
}
*/

const arrayUsers = []
const arrayTweets = []

app.post('/sign-up', (req, res) => {
  const user = req.body
  arrayUsers.push(user);
  res.send('OK');
})

app.post('/tweets', (req, res) => {
  const tweet = req.body
  arrayTweets.push(tweet)
  console.log(arrayTweets)
  res.send('OK');
})

app.listen(5000, () => console.log('Listen on port 5000...'))