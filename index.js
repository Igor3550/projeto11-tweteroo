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

function filterUserTweets(tweet, user) {
  if(tweet.username === user) return true;
  return false;
}

const arrayUsers = []
const arrayTweets = []

app.post('/sign-up', (req, res) => {
  const user = req.body

  if(!user.username || !user.avatar){
    return res.status(400).send(`Todos os campos são obrigatórios!`)
  }

  arrayUsers.push(user);
  console.log(user)
  res.status(201).send({message: 'OK'});
})

app.post('/tweets', (req, res) => {
  const tweet = req.body

  if(!tweet.username || !tweet.tweet){
    return res.status(400).send(`Todos os campos são obrigatórios!`)
  }

  arrayTweets.push(tweet)
  res.status(201).send({message: 'OK'});
})

app.get('/tweets', (req, res) => {
  
  let tweetsList = []
  if(arrayTweets.length <= 10){
    tweetsList = arrayTweets
  }else{
    tweetsList = arrayTweets.slice(arrayTweets.length-10);
  }

  const newTweetsList = tweetsList.map((tweet) => {
    let avatar = ''
    arrayUsers.forEach(user => {
      if(user.username === tweet.username) avatar = user.avatar
    })
    return {...tweet, avatar: avatar}
  })
  console.log(tweetsList);
  console.log(arrayTweets);

  res.send(newTweetsList)
})

app.get('/tweets/:username', (req, res) => {
  const { username } = req.params;
  const tweetsFiltrados = arrayTweets.filter((tweet) => {
    return (
      filterUserTweets(tweet, username)
    )
  })
  const returnTweetsList = tweetsFiltrados.map((tweet) => {
    const user = arrayUsers.find(u => {
      return u.username === username
    })
    return {...tweet, avatar:user.avatar}
  })
  res.send(returnTweetsList);
})

app.listen(5000, () => console.log('Listen on port 5000...'))