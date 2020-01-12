let generatedUserName = '........'
const displayGeneratedName = document.getElementById("name")
const joinChatButton = document.getElementById("join-chat-button")
const landingContent = document.getElementById("landing-content")
const chatContent = document.getElementById("chat-content")
const chat = document.getElementById("chat")
const chatInput = document.getElementById("chatInput")

// Watches database, populates chat upon changes
firebase.database().ref('messages').limitToLast(10)
    .on('value', (value) => {
      let messageKeys = Object.keys(value.val())
      let messagesArray = []
      messageKeys.forEach(key => {
        let userNameAndMessagePair = []
        userNameAndMessagePair.push(value.val()[key].displayName)
        userNameAndMessagePair.push(value.val()[key].message)
        messagesArray.push(userNameAndMessagePair)
      })
      populateChat(messagesArray)
    })

chatInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
      event.preventDefault()
      document.getElementById("send-message-button").click()
  }
})

function populateChat(messagesToPopulate) {
  chat.innerHTML = ''
  messagesToPopulate.forEach(message => {
    chat.innerHTML += `<p>${message[0]} ${message[1]}</p>`
  })
}

function writeMessageToDatabase(name, message, uid) {
  firebase.database().ref('messages').push({ 
    message: message, 
    displayName: name,
    uid: firebase.auth().currentUser.uid
  })
  chatInput.value = ''
}

function sendMessage() {
  let inputVal = chatInput.value
  let nameFormatted = `<b>${firebase.auth().currentUser.displayName}:</b> `
  writeMessageToDatabase(nameFormatted, inputVal)
}

//--- Name generator functions
function makeRandomNames(allTheNames) {
  let randomNames = []
  for (let i = 0; i < 40; i++) {
    randomNames.push(allTheNames[Math.floor(Math.random() * allTheNames.length)])
  }
  return randomNames
}

const fetchNames = async () => {
  const response = await fetch("https://data.ssb.no/api/v0/no/table/10501")
  const results = await response.json()
  return makeRandomNames(results.variables[0].valueTexts)
}

const startNameGenerator = async() => {
  if (firebase.auth().currentUser !== null) firebase.auth().currentUser.delete()
  let names = await fetchNames()
  generatedUserName = names[names.length-1]
  for (let i=0; i<40; i++) {
    timer(i, names[i])
  }
  function timer(i, name) { 
   setTimeout(function() { 
    displayGeneratedName.innerHTML = name
    if (generatedUserName === name) joinChatButton.style.display = 'block'
   }, 2.2 * i * i ) 
 }
}


function startChat() {
  joinChatButton.innerHTML = '<span class="loader"></span>'
  //Sign in new user anonymously
  firebase.auth().signInAnonymously().catch(function(error) {
    alert(error.code + ' | ' + error.message)
  })
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //Set the current user's display name to the generatedUserName
      var current = firebase.auth().currentUser
      current.updateProfile({
        displayName: generatedUserName,
      }).then(function() {
        // Simple "router". Chat is shown when user is successfully
        // logged in and assigned the generated name
        let joinedChatName = '*' + firebase.auth().currentUser.displayName
        writeMessageToDatabase(joinedChatName, "har flyttet inn i kommunen")
        landingContent.style.display = 'none'
        chatContent.style.display = 'flex'
      }).catch(function(error) {
        alert('Kunne ikke oppdatere brukeren med nytt navn')
      })
    } else {
      // Chat cannot be shown when user doesn't exist
      chatContent.style.display = 'none'
      landingContent.style.display = 'flex'
    }
  })
}

// Activate to add a "leave chat"-button

// function endSession() {
//   firebase.auth().currentUser.delete().then(function() {
//     startNameGenerator()
//   }).catch(function(error) {
//     alert('Kunne ikke forlate Tjattvik. Du må bli her for alltid')
// })
// }

startNameGenerator()