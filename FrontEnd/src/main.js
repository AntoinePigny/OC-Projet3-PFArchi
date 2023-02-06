import { createElement, qs, BASE_URL } from './utilities.js'

document.addEventListener('DOMContentLoaded', onLoad())

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
 * @param {} work
 * @returns
 */
function createFigureBase(work) {
   const figure = createElement('figure')
   const image = createElement('img', {
      src: work.imageUrl,
      alt: work.title,
      crossorigin: 'anonymous',
   })
   figure.append(image)
   return figure
}

/**
 * Creates a full figure element with caption and appends as child to given element
 * Using const syntax for practice => refacto to function
 * @param {any} nodeElement
 * @param {any} work
 */
const appendFullFigure = (nodeElement, work) => {
   const figure = createFigureBase(work)
   const figcaption = createElement('figcaption', {
      text: work.title,
   })

   figure.append(figcaption)
   nodeElement.appendChild(figure)
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
 * @param {array} works
 * @param {string} filter
 */
function showData(works, filter = null) {
   const galleryNode = qs('.gallery')

   while (galleryNode.firstChild) {
      galleryNode.firstChild.remove()
   }

   if (filter) {
      works = works.filter((work) => {
         return work.category.name === filter
      })
   }
   works.forEach((work) => {
      appendFullFigure(galleryNode, work)
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
      const filter = createElement('button', {
         text: element,
         class: 'filter',
      })
      filterBar.appendChild(filter)
      addListOnFilterToggle(filter, element, data)
   })
}

/* MODAL FUNCTIONS */

function showGalleryModal(works) {
   const galleryNode = qs('.modal-gallery')
   //maybe while is unecessary
   while (galleryNode.firstChild) {
      galleryNode.firstChild.remove()
   }
   works.forEach((work) => {
      appendFullThumbnail(galleryNode, work)
   })
}

function appendFullThumbnail(nodeElement, work) {
   const figure = createFigureBase(work)
   const editLink = createElement('a', {
      text: 'éditer',
   })
   const deleteButton = createElement('button', {
      class: 'delete-work',
      dataset: { id: work.id },
   })
   deleteButton.addEventListener('click', (e) => {
      e.preventDefault()
      console.log(e.cancelable)
      const workDeleteTarget = deleteButton.dataset.id
      deleteWork(workDeleteTarget)
   })
   const trashIcon = createElement('i', {
      class: 'fa-solid fa-trash-can',
   })
   deleteButton.appendChild(trashIcon)
   figure.append(deleteButton, editLink)
   nodeElement.appendChild(figure)
}

async function deleteWork(workId) {
   try {
      const token = sessionStorage.getItem('userToken')
      const response = await fetch(`${BASE_URL}/works/${workId}`, {
         method: 'DELETE',
         headers: {
            Authorization: `Bearer ${token}`,
         },
      })
      console.log(response)
   } catch (error) {
      console.log(error)
   }
}

/* LOCAL STORAGE SESSION */

function onLoad() {
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

      function openModal() {
         modal.classList.remove('hidden')
         overlay.classList.remove('hidden')
      }

      function closeModal() {
         modal.classList.add('hidden')
         overlay.classList.add('hidden')
      }

      function logout() {
         sessionStorage.clear()
         location.reload()
      }

      openModalBtn.addEventListener('click', openModal)
      closeModalBtn.addEventListener('click', closeModal)
      overlay.addEventListener('click', closeModal)
      logoutBtn.addEventListener('click', logout)
   }

   try {
      showWorks()
   } catch (error) {
      console.log(error)
   }
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
   const div = createElement('div')
   const icon = createElement('i', {
      class: 'fa-solid fa-pen-to-square',
   })
   const link = createElement('a', {
      text: linkText,
   })
   div.append(icon, link)

   const parentElement = qs(parent)
   const referenceElement = qs(referent)

   switch (parent) {
      case '#introduction-text' || '.modify-banner':
         parentElement.insertBefore(div, referenceElement)
         break

      case '#portfolio-title':
         link.classList = 'btn btn-open'
         parentElement.appendChild(div)
         break

      default:
         parentElement.appendChild(div)
         break
   }
}

//A débriefer

/**
 * Changer fonction addModifyLink => code cyril
 * Finir requete delete (gestion erreurs)
 * Formulaire => basculer les elements en dur de la modale dans la génération de la modale
 * =>créer fonction formulaire pour vider la modale et remplir avec le form
 * pour le file input, cacher l'input et styliser le label ! (voir createObjectURL)
 * pour le selecteur, c'est un ul>li, chercher selecteur custom js
 *
 */

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
