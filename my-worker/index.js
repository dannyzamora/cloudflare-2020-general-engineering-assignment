const imgUrl = "https://media-exp1.licdn.com/dms/image/C5603AQFmUIwTx-rkjA/profile-displayphoto-shrink_400_400/0?e=1608768000&v=beta&t=IJLYF0sX9ORG-iLFXqeSeBPrNx-rqlsQTLh5YooOIHg"
const links = [
  { "name": "Danny", "url": "https://linkurl.danny" },
  { "name": "dan", "url": "https://linkurl.dan" },
  { "name": "zamora", "url": "https://linkurl.zamora" }
  
]

const socialLinks = [{
  "url":"https://instagram.com",
  "svg":"https://simpleicons.org/icons/instagram.svg"
},{
  "url":"https://Facebook.com",
  "svg":"https://simpleicons.org/icons/facebook.svg"
},{
  "url":"https://amazon.com",
  "svg":"https://simpleicons.org/icons/amazon.svg"
}
]



const json = JSON.stringify(links, null, 2)

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
      this.links.forEach(link=>{
        element.append(`
          <a href=${link.url} target="_blank">${link.name}</a>
        `, { html: true })
      })
    
  }
}
class SocialLinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
      this.links.forEach(link=>{
        element.removeAttribute('style')
        element.append(`
          <a href=${link.url} target="_blank"><img src=${link.svg}></a>
        `, { html: true })
      })
    
  }
}

const rewriter = new HTMLRewriter()
  .on("div#links", new LinksTransformer(links))
  .on("div#profile", {element: e=> e.removeAttribute('style')}  )
  .on("img#avatar",{element: e=>e.setAttribute('src',imgUrl)})
  .on("h1#name", {element: e=>e.setInnerContent("Danny Zamora")})
  .on("div#social", new SocialLinksTransformer(socialLinks))
  .on("title", {element: e=>e.setInnerContent("Danny")})
  .on("body",{element: e=>e.setAttribute('class','bg-yellow-400')})




async function handleRequest(request) {
  if(request.url === "https://my-worker.dannyzamora-js.workers.dev/links"){
    return new Response(json,{
      headers:{
        "content-type": "application/json;charset=UTF-8"
      }
    })
  }
  else{
    const init = {    headers: {      "content-type": "text/html;charset=UTF-8",    },  }
    const  response  = await fetch("https://static-links-page.signalnerve.workers.dev",init)
    
  return rewriter.transform(response)
  }
  
}

