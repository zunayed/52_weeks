+++
date = "2017-07-25"
draft = false
title = "week 7 - More vue.js"
+++


# Vue Router
The vue router is frontend equivalent to the django url conf. You'll need this if you want to make multiple route and have persistent links to your single page app. It doesn't make sense to  have to modify the window url when this library does it for you. You can also call upon it for links along with active page matching.

```js
import Vue          from 'vue'                          // (1)
import Router       from 'vue-router'

import App          from '../App.vue'

// views
import ListView   from '../views/ListView.vue'          // (2)

Vue.use(Router)

const pgHome    = { template: '<div>Home</div>' };      // (3)
const pg404     = { template: '<div>HTML 404</div>' };

export default new Router({
  routes: [
    {
      path: '/',                                        // (4)
      name: 'dashboard',
      component: pgHome,                                // (5)
      meta: { title: 'Dashboard' },                     // (6)
    },
    {
      path: '/listview',
      name: 'listview',
      component: ListView,
      meta: { title: 'List View' },
    },
  ]
})
```

Few things to digest here

**(1)** library imports -> you can install things via npm and pull in exactly what you need for a page intead of including the entire libary via a script tag<br/>
**(2)** views -> you can seperate out templates into views and pull them in. They have to have the .vue extension if you plan on mixing templates, styles and js<br/>
**(3)** js templates -> you can write it via a string. Kinda weird to do it this way imo<br/>
**(4)** define your paths and url parsing here<br/>
**(5)** pass in your component which contains your template and associated js and styles<br/>
**(6)** you can define extra properties with meta values to pull in on page renders. I use this to set the page title<br/>

Frontend dev checklist (I want to die)
- nvm > Node version 6 (currently on 0.10)
- react transpiler has been deprecated
- adding webpack
    - es6,7 etc
    - sourcemaps for debugging and breakpoints
    - autoreload
- project structure
    - in app/static/vue/
    - vue files > which can have css + js + html
    - imports of libraries and files
- breadcrumbs
- title
- vuerouter
- ace editor
- transitions
- vue plugin vim
- vue chrome extension debugger
