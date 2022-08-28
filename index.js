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

function breakTweetsArray (array){
  let qntPages = Math.ceil(array.length/10);
  let pageList = []
  
  for(let j=1; j<=qntPages; j++){

    let page = []
    
    for (let i=((j-1)*10)+1; i<=j*10; i++){
      if(array[array.length-i]){
        page.push(array[array.length-i])
      }

      if(i===array.length) break
    }

    pageList.push(page)

  }

  return pageList;
}

const arrayUsers = []
const arrayTweets = []

app.post('/sign-up', (req, res) => {
  const user = req.body

  if(!user.username || !user.avatar){
    return res.status(400).send(`Todos os campos são obrigatórios!`)
  }

  arrayUsers.push(user);
  res.status(201).send({message: 'OK'});
})

app.post('/tweets', (req, res) => {
  const { tweet } = req.body
  const { user } = req.headers

  if(!tweet || !user){
    return res.status(400).send(`Todos os campos são obrigatórios!`)
  }

  arrayTweets.push({username: user, tweet: tweet})
  res.status(201).send({username: user, tweet: tweet});
})

app.get('/tweets', (req, res) => {

  const { page } = req.query;
  let index = 0;

  if(page) {
    if(page >= 1){
      index = page-1;
    }else{
      return res.status(400).send(`Informe uma página válida!`);
    }
  }
  
  let tweetsList = []
  
  tweetsList = breakTweetsArray(arrayTweets);

  if(tweetsList[index] && index < tweetsList.length){
    const newTweetsList = tweetsList[index].map((tweet) => {
      let avatar = ''
      arrayUsers.forEach(user => {
        if(user.username === tweet.username) avatar = user.avatar
      })
      return {...tweet, avatar: avatar}
    })
    return res.send(newTweetsList)
  }
  res.send([])
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