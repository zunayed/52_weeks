+++
date = "2017-07-17"
draft = false
title = "p5 - More vue.js"
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


<img style="max-width: 200px; margin-left: 10px;" align="right" src="http://i61.tinypic.com/vip5dl.jpg">

Frontend tooling seems like the wild west to me. The tooling around Python and Go have been largely static for the last few years but JS tooling is unbearbly complicated. Just take a look at the template for a standard [webpack + vuejs project](https://github.com/vuejs-templates/webpack/tree/master/template/build). Sure this will get you started writing Vue.js code but to add this much code into your project without actually understanding any of it seems like the wrong approach. Browsers are very complicated enviroments and I'm sure the community has done it's best with what they have but I can't help but think node should just incorporate some of the tooling and standardize compiles and outputs. 

## Frontend dev notes for getting all this working in a django enviroment  

- Use nvm (Node version manager) to install Node version 6
- Add webpack
    - es6 etc
    - sourcemaps for debugging and breakpoints
    - autoreload -> make sure you set the same port in your template as autoreload config
		- I used the livereload plugin
		- If you're developing inside a container don't forget to assign static ports unless you want to do mental gymnastics 
- figure out your project structure
    - I want each vue app to live in `{{ name of app }}/static/vue/`
    - vue files > which can have css + js + html
		- Currently imports require the *.vue extension. There is a way to avoid this but I haven't figured it out yet
    - imports of libraries and files  

