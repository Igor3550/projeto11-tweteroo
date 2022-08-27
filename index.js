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

function userIsInList (user, list) {
  for (let u of list){
    if(u.username === user){
      return true
    }
  }
  return false;
}

const arrayUsers = []
const arrayTweets = []

app.post('/sign-up', (req, res) => {
  const user = req.body
  arrayUsers.push(user);
  console.log(user)
  res.send('OK');
})

app.post('/tweets', (req, res) => {
  const tweet = req.body
  if(userIsInList(tweet.username, arrayUsers)){
    arrayTweets.push(tweet)
    res.send('OK');
  }else{
    res.sendStatus(401);
  }
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

app.listen(5000, () => console.log('Listen on port 5000...'))