import { createElement, qs, qsa } from './utilities.js'

const appendNewFigure = (nodeElement, work) => {
   const newFigure = createElement('figure')
   const newImage = createElement('img', {
      src: work.imageUrl,
      alt: work.title,
      crossorigin: 'anonymous',
   })
   const newFigcaption = createElement('figcaption', {
      text: work.title,
   })
   newFigure.append(newImage, newFigcaption)
   nodeElement.appendChild(newFigure)
}

const appendNewFilter = (nodeElement, filter) => {
   const newFilter = createElement()
}

fetch('http://localhost:5678/api/works')
   .then((res) => {
      if (res.ok) {
         return res.json()
      }
   })
   .then((data) => {
      console.log(data)
      const galleryNode = qs('.gallery')
      data.forEach((work) => {
         appendNewFigure(galleryNode, work)
      })
   })

fetch('http://localhost:5678/api/categories')
   .then((res) => {
      if (res.ok) {
         return res.json()
      }
   })
   .then((data) => {
      console.log(data)
   })
