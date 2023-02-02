import { createElement, qs, BASE_URL } from './utilities.js'
/**
 *Adds event handling login on submit

 Ajouter directement les données du form
 */
function addListenerSendLoginForm() {
   const loginForm = qs('.login-form')
   loginForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const user = {
         email: qs('#login-mail', event.target).value,
         password: qs('#password', event.target).value,
      }
      handleLoginSubmission(user)
   })
}

/**
 *Handles login using post request to API
 */
async function handleLoginSubmission(formData) {
   try {
      const response = await fetch(`${BASE_URL}/users/login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formData),
      })

      if (response.status === 200) {
         const result = await response.json()
         sessionStorage.setItem('userToken', result.token)
         window.open('index.html', '_self')
      } else if (response.status === 401) {
         throw 'Mot de passe incorrect'
      } else if (response.status === 404) {
         throw 'Adresse e-mail incorrecte'
      }
   } catch (e) {
      //Creates dom element to display error message
      const loginSection = qs('.login')
      const error = createElement('p', {
         text: e,
         class: 'login-error',
      })
      if (qs('.login-error')) {
         loginSection.lastChild.remove()
         loginSection.appendChild(error)
      } else {
         loginSection.appendChild(error)
      }
   }
}

addListenerSendLoginForm()
