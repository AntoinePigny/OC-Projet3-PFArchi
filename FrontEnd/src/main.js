import { createElement, qs, BASE_URL, qsa, createLabel } from './utilities.js'

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
   showModalGallery(works)
}

/* SHOW WORKS & FILTER FUNCTIONS (main gallery)*/

/**
 * Creates the basics of a figure element, with an image
 * @param {} work
 * @returns
 */
function createFigureBase(work) {
   const figure = createElement('figure', {
      dataset: { id: work.id },
   })
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

function createModal(titleText) {
   const section = qs('.modal')
   const title = createElement('h3', {
      text: titleText,
   })
   const btnsContainer = createElement('div', {
      class: 'modal-btns',
   })
   const closeBtn = createElement('button', {
      text: '⨯',
      class: 'btn-close',
   })
   section.append(title, btnsContainer, closeBtn)
   closeBtn.addEventListener('click', closeModal)
}

/* Modal gallery and work deletion */

function showModalGallery(works) {
   const modal = qs('.modal')
   modal.replaceChildren()
   createModal('Galerie Photo')
   const galleryNode = createElement('div', {
      class: 'modal-gallery',
   })
   const btnsContainer = qs('.modal-btns')
   const toFormBtn = createElement('input', {
      type: 'submit',
      value: 'Ajouter une photo',
   })
   const deleteAllWorks = createElement('a', {
      text: 'Supprimer la galerie',
   })
   galleryNode.replaceChildren(...works.map(createFullThumbnail))
   btnsContainer.prepend(galleryNode)
   btnsContainer.append(toFormBtn, deleteAllWorks)
   //toFormBtn.addEventListener('click', showModalForm(works))
}

function createFullThumbnail(work) {
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
   deleteButton.addEventListener('click', (event) => {
      event.preventDefault()
      deleteWork(work.id)
   })
   return figure
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
         const workNodes = qsa(`figure[data-id = "${workId}"]`)
         workNodes.forEach((workNode) => {
            workNode.remove()
         })
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

/* Modal form for new work */

/* function showModalForm(works) {
   console.log(works)
   const modal = qs('.modal')
   modal.replaceChildren()
   createModal('Ajout photo')
   const form = createElement('form', {
      id: 'new-work-form',
   })
   const photoLabel = createLabel('add-photo', 'add-photo-label')
   const photoInput = createElement('input', {
      type: 'file',
      id: 'add-photo',
      class: 'hidden',
   })
   const titleLabel = createLabel('photo-title', 'photo-title-label', 'Titre')
   const titleInput = createElement('input', {
      type: 'text',
      id: 'photo-title',
   })
   const categoryLabel = createElement('p', {
      text: 'Catégorie',
   })
   const submit = createElement('input', {
      type: 'submit',
      value: 'Valider',
   })
   form.append(photoLabel, photoInput, titleLabel, titleInput, categoryLabel)
   //const categories = deleteDuplicates(works.category)
   console.log(works)
   //dropdown(categories)
   const btnsContainer = qs('.modal-btns')
   btnsContainer.appendChild(submit)
   form.appendChild(btnsContainer)
}

function dropdown(categories) {
   const form = qs('#new-work-form')
   const component = createElement('div')

   const input = createInput()
   const dropdown = showDropdown(categories)

   component.appendChild(input)
   component.appendChild(dropdown)
   form.appendChild(component)
}

function createInput() {
   // Creates the input outline
   const input = createElement('div', {
      class: 'input',
   })
   input.addEventListener('click', toggleDropdown)

   // Creates the input placeholder content
   const inputPlaceholder = createElement('div', {
      class: 'input-placeholder',
   })

   const placeholder = createElement('p', {
      text: 'Catégorie',
      class: 'placeholder',
   })

   const dropdownIcon = createElement('i', {
      class: 'fa-regular fa-chevron-down',
   })

   // Appends the placeholder and chevron (stored in assets.js)
   inputPlaceholder.appendChild(placeholder)
   inputPlaceholder.appendChild(dropdownIcon)
   input.appendChild(inputPlaceholder)

   return input
}

function showDropdown(categories) {
   const structure = createElement('div', {
      class: 'structure hide',
   })

   categories.forEach((category) => {
      const { id, name } = category
      const option = createElement('div', {
         id: id,
      })
      option.addEventListener('click', () => selectOption(name))

      const n = createElement('h5', {
         text: name,
      })

      option.appendChild(n)
      structure.appendChild(option)
   })
   return structure
}

function toggleDropdown() {
   const dropdown = qs('.structure')
   dropdown.classList.toggle('hide')

   const input = qs('.input')
   input.classList.toggle('input-active')
}

function selectOption(name) {
   const text = qs('.placeholder')
   text.textContent = name
   text.classList.add('input-selected')
   toggleDropdown()
} */

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
      const logoutBtn = qs('.apply-changes')

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
 * pour le file input, cacher l'input et styliser le label ! (voir createObjectURL)
 * pour le selecteur, c'est un ul>li, chercher selecteur custom js
 *
 */
