import { createElement, qs, qsa } from './utilities.js'

export const BASE_URL = 'http://localhost:5678/api/'

async function showWorks() {
   const response = await fetch(`${BASE_URL}works`)
   const works = await response.json()
   const categories = deleteDuplicates(works)
   addFilter(categories, works)
   showData(works)
}

try {
   showWorks()
} catch (error) {
   console.log(error)
}

// WORKS FILTER FUNCTIONS

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

function deleteDuplicates(data) {
   return new Set(data.map((data) => data.category.name))
}

function addListOnFilterToggle(categorie, nom, data) {
   categorie.addEventListener('click', () => {
      if (nom !== 'Tous') return showData(data, nom)
      return showData(data)
   })
}

function showData(datas, filtre = null) {
   const galleryNode = qs('.gallery')
   galleryNode.innerHTML = ''
   if (filtre) {
      datas = datas.filter((work) => {
         return work.category.name === filtre
      })
   }
   datas.forEach((data) => {
      appendNewFigure(galleryNode, data)
   })
}

function addFilter(categories, data) {
   const filterBar = qs('#projectsFilters')
   const categoryAll = ['Tous', ...categories]
   categoryAll.forEach((element) => {
      const newFilter = createElement('button', {
         text: element,
         class: 'filter',
      })
      filterBar.appendChild(newFilter)
      addListOnFilterToggle(newFilter, element, data)
   })
}

//REFACTO en utilisant try & catch

/* old_function main() {
   fetch(`${BASE_URL}works`).then((res) => {
      if (res.ok)
         return res.json().then((data) => {
            const categories = deleteDuplicates(data)
            addFilter(categories, data)
            showData(data)
         })
   })
}

main() */

// old_fetch('http://localhost:5678/api/works')
//    .then((res) => {
//       if (res.ok) {
//          return res.json()
//         }
//       })
//       .then((data) => {
//         const categoriesList = new Set(data.map((data) => data.category.name))
//         const galleryNode = qs('.gallery')
//         appendNewFilterDefault(data, '#projectsFilters', galleryNode)
//         appendNewFilter(data, '#projectsFilters', 'Tous', galleryNode)
//         categoriesList.forEach((category) => {
//           appendNewFilter(data, '#projectsFilters', category, galleryNode)
//         })
//    })

// function appendNewFilterDefault(works, elementId, elementNode) {
//    const selectedElement = qs(elementId)
//    works.forEach((work) => {
//       appendNewFigure(elementNode, work)
//    })
// }

// /**
//  *
//  * @param {*} works => fetch result
//  * @param {string} elementId
//  * @param {*} categoryName
//  * @param {*} elementNode
//  */
// function appendNewFilter(works, elementId, categoryName, elementNode) {
//    const selectedElement = qs(elementId)
//    const newFilter = createElement('button', {
//       text: categoryName,
//       class: 'filter',
//    })
//    newFilter.addEventListener('click', () => {
//       if (categoryName != 'Tous') {
//          const filteredWorks = works.filter((work) => {
//             return work.category.name === categoryName
//          })
//          elementNode.innerHTML = ''
//          filteredWorks.forEach((work) => {
//             appendNewFigure(elementNode, work)
//          })
//       } else {
//          elementNode.innerHTML = ''
//          works.forEach((work) => {
//             appendNewFigure(elementNode, work)
//          })
//       }
//    })
//    selectedElement.appendChild(newFilter)
// }
