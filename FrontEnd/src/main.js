import { createElement, qs, qsa, BASE_URL } from './utilities.js'

/**
 * GET request and display of works
 */
async function showWorks() {
   const response = await fetch(`${BASE_URL}/works`)
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

/**
 * Creates Set with the categories' names
 * @param {array} data
 * @returns Set
 */
function deleteDuplicates(data) {
   return new Set(data.map((data) => data.category.name))
}

/**
 * Adds event to button executing showData based on button's name
 * @param {element} category
 * @param {string} name
 * @param {array} data
 */
function addListOnFilterToggle(category, name, data) {
   category.addEventListener('click', () => {
      if (name !== 'Tous') return showData(data, name)
      return showData(data)
   })
}

/**
 * Filters data with matching filter (default = null) and creates new figure for each one
 * @param {array} datas
 * @param {string} filter
 */
function showData(datas, filter = null) {
   const galleryNode = qs('.gallery')

   while (galleryNode.firstChild) {
      galleryNode.firstChild.remove()
   }

   if (filter) {
      datas = datas.filter((work) => {
         return work.category.name === filter
      })
   }
   datas.forEach((data) => {
      appendNewFigure(galleryNode, data)
   })
}

/**
 * Creates filter button for each item in categories
 * @param {array} categories
 * @param {array} data
 */
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

/* LOCAL STORAGE SESSION */

if (sessionStorage.getItem('userToken')) {
   addModifyBanner('body', 'header')
   addModifyLink('.modify-banner', 'Mode édition', 'button')
   addModifyLink('#introduction-photo')
   addModifyLink('#introduction-text', undefined, 'h2')
   addModifyLink('#portfolio-title')
}

/**
 * Adds banner
 * @param {*} parent
 * @param {*} referent
 */
function addModifyBanner(parent, referent) {
   const modifyBanner = createElement('div', {
      class: 'modify-banner',
   })
   const applyChangesButton = createElement('button', {
      class: 'apply-changes',
      text: 'publier les changements',
   })
   modifyBanner.appendChild(applyChangesButton)
   const referenceElement = qs(referent)
   const parentElement = qs(parent)
   parentElement.insertBefore(modifyBanner, referenceElement)
}

/**
 * Adds a modify link and icon
 * @param {string} parent
 * @param {string} linkText
 * @param {string} referent
 */
function addModifyLink(parent, linkText = 'Modifier', referent) {
   const modifyDiv = createElement('div')
   const modifyIcon = createElement('i', {
      class: 'fa-solid fa-pen-to-square',
   })
   const modifyLink = createElement('a', {
      text: linkText,
   })
   modifyDiv.append(modifyIcon, modifyLink)

   const parentElement = qs(parent)
   const referenceElement = qs(referent)

   if (parent === '#introduction-text' || '.modify-banner') {
      parentElement.insertBefore(modifyDiv, referenceElement)
   } else {
      parentElement.appendChild(modifyDiv)
   }
}

/* 
async function userLogin() {
} */

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
