import { createElement, qs, qsa } from './utilities.js'
import { BASE_URL } from './main.js'

/**
 *Adds event handling login on submit
 */
function addListenerSendLoginForm() {
   const loginForm = qs('.login-form')
   loginForm.addEventListener('submit', () => {
      event.preventDefault()
      handleLoginSubmission()
   })
}

/**
 *Handles login using post request to API
 */
async function handleLoginSubmission() {
   try {
      const user = {
         email: qs('#login-mail', event.target).value,
         password: qs('#password', event.target).value,
      }
      const response = await fetch(`${BASE_URL}/users/login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(user),
      })

      if (response.status === 200) {
         const result = await response.json()
         localStorage.setItem('userToken', result.token)
         window.open('index.html', '_self')
      } else {
         throw 'E-mail/Mot de passe incorrect'
      }
   } catch (e) {
      //Creates dom element to display error message
      const loginSection = qs('.login')
      const error = createElement('p', {
         text: e,
         class: 'login-error',
      })
      if (loginSection.lastChild.previousSibling.className === 'login-form') {
         loginSection.lastChild.remove()
         loginSection.appendChild(error)
      } else {
         loginSection.appendChild(error)
      }
   }
}

addListenerSendLoginForm()
