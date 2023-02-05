import { createElement, qs, qsa, BASE_URL } from './utilities.js'

try {
   showWorks()
} catch (error) {
   console.log(error)
}

/**
 * GET request and display of works
 */
async function showWorks() {
   const response = await fetch(`${BASE_URL}/works`)
   const works = await response.json()
   const categories = deleteDuplicates(works)
   addFilter(categories, works)
   showData(works)
   showGalleryModal(works)
}

// WORKS FILTER FUNCTIONS

/**
 * Creates the basics of a figure element, with an image
 * @param {} data
 * @returns
 */
function createBasicFigure(data) {
   const newFigure = createElement('figure')
   const newImage = createElement('img', {
      src: data.imageUrl,
      alt: data.title,
      crossorigin: 'anonymous',
   })
   newFigure.append(newImage)
   return newFigure
}

/**
 * Creates a full figure element with caption and appends as child to given element
 * Using const syntax for practice => refacto to function
 * @param {any} nodeElement
 * @param {any} work
 */
const appendFullFigure = (nodeElement, work) => {
   const newFigure = createBasicFigure(work)
   const newFigcaption = createElement('figcaption', {
      text: work.title,
   })

   newFigure.append(newFigcaption)
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
      appendFullFigure(galleryNode, data)
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

/* MODAL FUNCTIONS */

function showGalleryModal(datas) {
   const galleryNode = qs('.modal-gallery')
   while (galleryNode.firstChild) {
      galleryNode.firstChild.remove()
   }
   datas.forEach((data) => {
      appendFullThumbnail(galleryNode, data)
   })
}

function appendFullThumbnail(nodeElement, work) {
   const newFigure = createBasicFigure(work)
   const newEditLink = createElement('a', {
      text: 'éditer',
   })
   const newDeleteButton = createElement('button', {
      class: 'delete-work',
   })
   const newTrashIcon = createElement('i', {
      class: 'fa-solid fa-trash-can',
   })

   newDeleteButton.appendChild(newTrashIcon)
   newFigure.append(newDeleteButton, newEditLink)
   nodeElement.appendChild(newFigure)
}

/* LOCAL STORAGE SESSION */

if (sessionStorage.getItem('userToken')) {
   addModifyBanner('body', 'header')
   addModifyLink('.modify-banner', 'Mode édition', 'button')
   addModifyLink('#introduction-photo')
   addModifyLink('#introduction-text', undefined, 'h2')
   addModifyLink('#portfolio-title')

   const modal = qs('.modal')
   const overlay = qs('.overlay')
   const openModalBtn = qs('.btn-open')
   const closeModalBtn = qs('.btn-close')
   const logoutBtn = qs('.apply-changes')

   const openModal = function () {
      modal.classList.remove('hidden')
      overlay.classList.remove('hidden')
   }

   const closeModal = function () {
      modal.classList.add('hidden')
      overlay.classList.add('hidden')
   }

   const logout = function () {
      sessionStorage.clear()
      location.reload()
   }

   openModalBtn.addEventListener('click', openModal)
   closeModalBtn.addEventListener('click', closeModal)
   overlay.addEventListener('click', closeModal)
   logoutBtn.addEventListener('click', logout)
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

   switch (parent) {
      case '#introduction-text' || '.modify-banner':
         parentElement.insertBefore(modifyDiv, referenceElement)
         break

      case '#portfolio-title':
         modifyLink.classList = 'btn btn-open'
         parentElement.appendChild(modifyDiv)
         break

      default:
         parentElement.appendChild(modifyDiv)
         break
   }
}

//A débriefer

//Pourquoi le if ne fonctionne pas ?
/*    if (parent === '#introduction-text' || '.modify-banner') {
         console.log(modifyLink)
         parentElement.insertBefore(modifyDiv, referenceElement)
      } else if (parent === '#portfolio-title') {
         console.log(4)
      } else {
         parentElement.appendChild(modifyDiv)
      } */

/* 
      async function userLogin() {
      } */
