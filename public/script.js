let userName = '........';
const displayName = document.getElementById("name")
const joinChatButton = document.getElementById("join-chat-button")
const landingContent = document.getElementById("landing-content")
const chatContent = document.getElementById("chat-content")

function getRandomNames(allTheNames) {
  let randomNames = []
  for (let i = 0; i < 40; i++) {
    randomNames.push(allTheNames[Math.floor(Math.random() * allTheNames.length)])
  }
  return randomNames
}

//----remember error-handling
const fetchNames = async () => {
  const response = await fetch("https://data.ssb.no/api/v0/no/table/10501")
  const results = await response.json()
  return getRandomNames(results.variables[0].valueTexts)
}

const startNameGenerator = async() => {
  let names = await fetchNames()
  userName = names[names.length-1]
  for (let i=0; i<40; i++) {
    timer(i, names[i])
  }
  function timer(i, name) { 
   setTimeout(function() { 
    displayName.innerHTML = name
    if (userName === name) joinChatButton.style.display = 'block'
   }, 1 * i * i ) 
 }
}

function startChat() {
  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      // ...
    } else {
      // User is signed out.
      // ...
    }
    // ...
  });
  landingContent.style.display = 'none'
  chatContent.style.display = 'flex'
}

startNameGenerator()