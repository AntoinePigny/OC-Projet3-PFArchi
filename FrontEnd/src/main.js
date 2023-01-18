import { createElement, qs, qsa } from './utilities.js'

/**
 * Creates a figure element with img and caption and appends as child to given element
 * Using const syntax for practice => refacto to function
 * @param {any} nodeElement
 * @param {any} work
 */
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

/**
 *
 * @param {*} works => fetch result
 * @param {string} elementId
 * @param {*} categoryName
 * @param {*} elementNode
 */
function appendNewFilter(works, elementId, categoryName, elementNode) {
   const selectedElement = qs(elementId)
   const newFilter = createElement('button', {
      text: categoryName,
      class: 'filter',
   })
   newFilter.addEventListener('click', () => {
      const filteredWorks = works.filter((work) => {
         return work.category.name === categoryName
      })
      elementNode.innerHTML = ''
      filteredWorks.forEach((work) => {
         appendNewFigure(elementNode, work)
      })
   })
   selectedElement.appendChild(newFilter)
}

//REFACTO en utilisant try & catch

fetch('http://localhost:5678/api/works')
   .then((res) => {
      if (res.ok) {
         return res.json()
      }
   })
   .then((data) => {
      const categoriesList = new Set(data.map((data) => data.category.name))
      const galleryNode = qs('.gallery')
      categoriesList.forEach((category) => {
         appendNewFilter(data, '#projectsFilters', category, galleryNode)
      })
   })

/*       data.forEach((work) => {
      appendNewFigure(galleryNode, work)
   }) */
// fetch('http://localhost:5678/api/categories')
//    .then((res) => {
//       if (res.ok) {
//          return res.json()
//       }
//    })
//    .then((data) => {
//       console.log(data)
//    })
