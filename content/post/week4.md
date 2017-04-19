+++
date = "2017-03-29T17:12:16-05:00"
title = "week 4 - Learning a little bit of Vue.js"
draft = false

+++

I asked an old college friend who is a front end engineer to show me the frontend framework he's been working with for the last year, Vue.js

I was curious to see what it was like to use a framework vs vanilla js and quickly we prototyped a table that rapidly updates. I was able to pick it up much faster than react.js and it doesn't require anything to be compiled. Take a look at the source (only 103 lines!!) and demo.


<head>
<script src="https://unpkg.com/vue"></script>
<link rel="stylesheet" href="/css/bootstrap.css" type="text/css" media="screen, projection" />
</head>
<body>

<div id="app">
    <p>
        <button v-on:click="toggle_filtered" type="button" class="btn btn-primary">{{ button_label }}</button>
        <button v-on:click="mock_recieve_status" type="button" class="btn btn-primary">Add Status</button>
    </p>
    <div class="table-responsive">

        <table class="table">
        <thead>
            <tr>
            <th>Item</th>
            <th>Status</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="item in statuses">
                <td>{{ item.circuit }}</td>
                <td>
                    <span v-if="item.status" class="label label-success">{{ item.status }}</span>
                    <span v-else class="label label-danger">{{ item.status }}</span>
                </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

</body>

<script>
var app = new Vue({
  el: '#app',
  data: {
    all_statuses: [
    ],
    is_filtered: false
  },
  computed: {
      statuses: function () {
          return this.is_filtered ? this.all_statuses.filter( ({ status }) => !status): this.all_statuses
      },
      button_label: function () { return this.is_filtered ? `Show all` : `Show critical`}
  },
  methods: {
      toggle_filtered: function () { this.is_filtered = !this.is_filtered},
      mock_recieve_status: function () {
          this.all_statuses.push({"circuit": `tid${this.all_statuses.length + 1}`, "status": false})
      },
      mock_flip_random_status: function () {
          this.all_statuses[Math.floor(Math.random() * this.all_statuses.length)].status = !this.all_statuses[Math.floor(Math.random() * this.all_statuses.length)].status
      },
      get_all_statuses: function () {
          // mocked xhr request
          // mocking async call to backend
          return Promise.resolve([
            {"circuit": "tid1", "status": true},
            {"circuit": "tid2", "status": true},
            {"circuit": "tid3", "status": false},
            {"circuit": "tid4", "status": false},
            {"circuit": "tid5", "status": false},
          ])
      },
      set_all_statuses: function (statuses) {
          this.all_statuses = statuses
      },
      refresh_statuses: function() {
        this.get_all_statuses().then(this.set_all_statuses)
      }

  },
  created: function () {
      this.refresh_statuses()

      setInterval(this.mock_recieve_status, 2000)
      setInterval(this.mock_flip_random_status, 500)
      setInterval(this.refresh_statuses, 5000)

  }
})
</script>



```html
<head>
<script src="https://unpkg.com/vue"></script>
<link rel="stylesheet" href="/css/bootstrap.css" type="text/css" media="screen, projection" />
</head>
<body>

<div id="app">
    <p>
        <button v-on:click="toggle_filtered" type="button" class="btn btn-primary">{{ button_label }}</button>
        <button v-on:click="mock_recieve_status" type="button" class="btn btn-primary">Add Status</button>
    </p>
    <div class="table-responsive">
        <table class="table">
        <thead>
            <tr>
            <th>Item</th>
            <th>Status</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="item in statuses">
                <td>{{ item.circuit }}</td>
                <td>
                    <span v-if="item.status" class="label label-success">{{ item.status }}</span>
                    <span v-else class="label label-danger">{{ item.status }}</span>
                </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

</body>

<script>
var app = new Vue({
  el: '#app',
  data: {
    all_statuses: [
    ],
    is_filtered: false
  },
  computed: {
      statuses: function () {
          return this.is_filtered ? this.all_statuses.filter( ({ status }) => !status): this.all_statuses
      },
      button_label: function () { return this.is_filtered ? `Show all` : `Show critical`}
  },
  methods: {
      toggle_filtered: function () { this.is_filtered = !this.is_filtered},
      mock_recieve_status: function () {
          this.all_statuses.push({"circuit": `tid${this.all_statuses.length + 1}`, "status": false})
      },
      mock_flip_random_status: function () {
          this.all_statuses[Math.floor(Math.random() * this.all_statuses.length)].status = !this.all_statuses[Math.floor(Math.random() * this.all_statuses.length)].status
      },
      get_all_statuses: function () {
          // mocked xhr request
          // mocking async call to backend
          return Promise.resolve([
            {"circuit": "tid1", "status": true},
            {"circuit": "tid2", "status": true},
            {"circuit": "tid3", "status": false},
            {"circuit": "tid4", "status": false},
            {"circuit": "tid5", "status": false},
          ])
      },
      set_all_statuses: function (statuses) {
          this.all_statuses = statuses
      },
      refresh_statuses: function() {
        this.get_all_statuses().then(this.set_all_statuses)
      }

  },
  created: function () {
      this.refresh_statuses()

      setInterval(this.mock_recieve_status, 2000)
      setInterval(this.mock_flip_random_status, 500)
      setInterval(this.refresh_statuses, 5000)

  }
})
</script>
```

