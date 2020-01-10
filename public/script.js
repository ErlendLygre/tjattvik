let generatedUserName = '........';
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

const fetchNames = async () => {
  const response = await fetch("https://data.ssb.no/api/v0/no/table/10501")
  const results = await response.json()
  return getRandomNames(results.variables[0].valueTexts)
}

const startNameGenerator = async() => {
  let names = await fetchNames()
  generatedUserName = names[names.length-1]
  for (let i=0; i<40; i++) {
    timer(i, names[i])
  }
  function timer(i, name) { 
   setTimeout(function() { 
    displayName.innerHTML = name
    if (generatedUserName === name) joinChatButton.style.display = 'block'
   }, 1 * i * i ) 
 }
}

function startChat() {
  //Sign in new user anonymously
  firebase.auth().signInAnonymously().catch(function(error) {
    alert(error.code + ' | ' + error.message)
  })
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //Set the current user's display name to the generatedUserName
      var current = firebase.auth().currentUser;
      current.updateProfile({
        displayName: generatedUserName,
      }).then(function() {
        // Simple "router". Chat is shown when user is successfully
        // logged in and assigned the generated name
        landingContent.style.display = 'none'
        chatContent.style.display = 'flex'
      }).catch(function(error) {
        alert('Kunne ikke oppdatere brukeren med nytt navn')
      });
    } else {
      // Chat cannot be shown when user doesn't exist
      chatContent.style.display = 'none'
      landingContent.style.display = 'flex'
    }
  });
}

function endSession() {
  firebase.auth().currentUser.delete().then(function() {
    startNameGenerator()
  }).catch(function(error) {
    alert('Kunne ikke forlate Tjattvik. Du må bli her for alltid')
});
}

startNameGenerator()