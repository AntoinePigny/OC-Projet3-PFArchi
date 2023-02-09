import { createElement, qs, BASE_URL, qsa } from './utilities.js'

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
   category.addEventListener('click', (e) => {
      const allFilters = qsa('.filter')
      allFilters.forEach((filter) => {
         filter.classList.remove('active')
      })
      e.target.classList.add('active')
      if (name !== 'Tous') {
         return showData(data, name)
      } else return showData(data)
   })
}

/**
 * Filters data with matching filter (default = null) and creates new figure for each one
 * @param {array} works
 * @param {string} filter
 */
function showData(works, filter = null) {
   const galleryNode = qs('.gallery')

   galleryNode.replaceChildren()

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
   const filterBar = qs('#projects-filters')
   const categoryAll = ['Tous', ...categories]
   categoryAll.forEach((element) => {
      const filter = createElement('button', {
         text: element,
         class: 'filter',
      })
      if (element === 'Tous') filter.classList.add('active')
      filterBar.appendChild(filter)
      addListOnFilterToggle(filter, element, data)
   })
}

/* MODAL FUNCTIONS */

function showGalleryModal(works) {
   const galleryNode = qs('.modal-gallery')
   galleryNode.replaceChildren()
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
   })
   const trashIcon = createElement('i', {
      class: 'fa-solid fa-trash-can',
   })
   deleteButton.appendChild(trashIcon)
   figure.append(deleteButton, editLink)
   nodeElement.appendChild(figure)
   deleteButton.addEventListener('click', async (event) => {
      event.preventDefault()
      await deleteWork(work.id)
      const response = await fetch(`${BASE_URL}/works`)
      const works = await response.json()
      showData(works)
      showGalleryModal(works)
   })
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
      if (response.status === 204) {
         const modalDiv = qs('.modal-btns')
         const newMessage = createElement('p', {
            class: 'delete-message',
            text: 'Votre élément a été effacé avec succès',
         })
         const existingMessage = qs('.delete-message')
         if (existingMessage) {
            existingMessage.replaceWith(newMessage)
         } else {
            modalDiv.prepend(newMessage)
         }
      } else if (response.status === 401) {
         throw 'Vous devez être connectée pour effectuer cette action'
      } else {
         throw console.log(response.status)
      }
   } catch (error) {
      console.log(error)
   }
}

/* LOCAL STORAGE SESSION */

function onLoad() {
   if (sessionStorage.getItem('userToken')) {
      addModifyBanner('body', 'header')
      const modifiers = [
         {
            container: '#introduction-text',
            isAtStart: true,
            isClickable: false,
         },
         {
            container: '#portfolio-title',
            isAtStart: false,
            isClickable: true,
         },
         {
            container: '#introduction-photo',
            isAtStart: false,
            isClickable: false,
         },
      ]
      modifiers.forEach((modifier) => {
         addModifyLink(modifier.container, modifier.isAtStart, modifier.isClickable)
      })

      const overlay = qs('.overlay')
      const closeModalBtn = qs('.btn-close')
      const logoutBtn = qs('.apply-changes')

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

function openModal() {
   const modal = qs('.modal')
   const overlay = qs('.overlay')
   modal.classList.remove('hidden')
   overlay.classList.remove('hidden')
}

function closeModal() {
   const modal = qs('.modal')
   const overlay = qs('.overlay')
   modal.classList.add('hidden')
   overlay.classList.add('hidden')
}

function logout() {
   sessionStorage.clear()
   location.reload()
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
   const div = createElement('div')
   const icon = createElement('i', {
      class: 'fa-solid fa-pen-to-square',
   })
   const text = createElement('span', {
      text: 'Mode édition',
   })
   div.append(icon, text)

   modifyBanner.append(applyChangesButton, div)
   const referenceElement = qs(referent)
   const parentElement = qs(parent)
   parentElement.insertBefore(modifyBanner, referenceElement)
}

function addModifyLink(containerString, isAtStart, isClickable) {
   const div = createElement('div')
   const icon = createElement('i', {
      class: 'fa-solid fa-pen-to-square',
   })
   const link = createElement('a', {
      text: 'modifier',
   })
   div.append(icon, link)

   if (isClickable) {
      // add classes to button
      const arr = ['btn', 'btn-open']
      div.classList.add(...arr)

      // add event listener to open modal
      div.addEventListener('click', openModal)
   }
   const container = qs(containerString)
   if (isAtStart) {
      container.prepend(div)
   } else {
      container.appendChild(div)
   }
}

//A débriefer

/**
 * Formulaire => basculer les elements en dur de la modale dans la génération de la modale
 * =>créer fonction formulaire pour vider la modale et remplir avec le form
 * pour le file input, cacher l'input et styliser le label ! (voir createObjectURL)
 * pour le selecteur, c'est un ul>li, chercher selecteur custom js
 *
 */
