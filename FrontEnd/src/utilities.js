/**
 * Creates a html element with desired options passed in an object
 * @param {string}type
 * @param {obj}options
 */

export function createElement(type, options = {}) {
   const element = document.createElement(type)

   Object.entries(options).forEach(([key, value]) => {
      if (key === 'class') {
         element.classList.add(value)
         return
      }

      if (key === 'dataset') {
         Object.entries(value).forEach(([dataKey, dataValue]) => {
            element.dataset[dataKey] = dataValue
         })
         return
      }

      if (key === 'text') {
         element.textContent = value
         return
      }

      element.setAttribute(key, value)
   })
   return element
}

/**
 * returns the first element matching a specified selector on the desired interface (default : document)
 * @param {string} selector
 * @param {interface} parent
 */

export function qs(selector, parent = document) {
   return parent.querySelector(selector)
}

/**
 * Returns all elements matching a selector and spreads them in an array
 * @param {string} selector
 * @param {interface} parent
 * @returns {array}
 */

export function qsa(selector, parent = document) {
   return [...parent.querySelectorAll(selector)]
}
