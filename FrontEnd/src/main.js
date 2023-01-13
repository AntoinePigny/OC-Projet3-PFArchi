const appendNewFigure = (nodeElement, work) => {
   const newFigure = document.createElement('figure')
   const newImage = document.createElement('img')
   newImage.setAttribute('src', work.imageUrl)
   newImage.setAttribute('alt', work.title)
   newImage.setAttribute('crossorigin', 'anonymous')
   const newFigcaption = document.createElement('figcaption')
   const newCaption = document.createTextNode(work.title)
   newFigcaption.appendChild(newCaption)
   newFigure.append(newImage, newFigcaption)
   nodeElement.appendChild(newFigure)
}

fetch('http://localhost:5678/api/works')
.then((res) => {
    if (res.ok) {
         return res.json()
      }
   })
   .then((data) => {
       const galleryNode = document.querySelector('.gallery')
       data.forEach((work) => {
           appendNewFigure(galleryNode, work)
        })
    })
    
    
    // const appendNewFigcaption = (caption, nodeElement) => {
    //    const newFigcaption = document.createElement('figcaption')
    //    const newCaption = document.createTextNode(caption)
    //    newFigcaption.appendChild(newCaption)
    //    nodeElement.appendChild(newFigcaption)
    // }
    
    // const appendWorksCaptionsToGallery = (works) => {
    //    const galleryNode = document.querySelector('.gallery')
    //    works.forEach((work) => {
    //       appendNewFigCaption(work.title, galleryNode)
    //    })
    // }