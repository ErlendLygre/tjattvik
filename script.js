let userName = '........';
const displayName = document.getElementById("name")
const joinChatButton = document.getElementById("join-chat-button")

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
   }, 4 * i * i ) 
 } 
}

startNameGenerator()