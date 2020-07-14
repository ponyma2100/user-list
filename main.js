const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const data = []
const dataPanel = document.getElementById('data-panel')
const pagination = document.getElementById('pagination')
const btngroup = document.getElementById('btngroup')
const ITEM_PER_PAGE = 8
const searchForm = document.getElementById('search')
const searchInput = document.getElementById('search-input')
const followBtn = document.getElementsByClassName('.btn-add-follower')
const unfollowBtn = document.getElementsByClassName('.btn-remove-follower')
const slider = document.getElementById('demo')
const filterRegion = document.getElementById('search-region')
const regionInput = document.getElementById('region-input')
const filterCountry = document.getElementById('country')
const favoriteHtml = document.getElementById('favorite')
const mainHTML = document.getElementById('mainpage')
const dataFavorite = JSON.parse(localStorage.getItem('followUser')) || []

let paginationData = []

axios.get(INDEX_URL).then((response) => {
  data.push(...response.data.results)
  displayMainPage(data)
}).catch((err) => { console.log(err) })

dataPanel.addEventListener('click', function (event) {
  console.log(event.target)
  console.log(event.target.dataset.id)
  if (event.target.matches('.card-img-top')) {
    showUser(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-follower')) {
    addFollower(event.target.dataset.id)
    changeFollowBtn()
  } else if (event.target.matches('.btn-remove-follower')) {
    removeFollower(event.target.dataset.id)
    changeFollowBtn()
  }
})


slider.addEventListener('click', function () {
  if (event.target.matches('.img-responsive')) {
    console.log(event.target.dataset.id)
    showUser(event.target.dataset.id)
  }
})

pagination.addEventListener('click', function (event) {
  console.log(event.target.dataset.page)
  if (event.target.tagName === 'A') {
    getPageData(event.target.dataset.page)
  }
})

btngroup.addEventListener('click', function (event) {
  const resultsMale = data.filter(data => data.gender === 'male')
  const resultsFemale = data.filter(data => data.gender === 'female')
  console.log(event.target)
  if (event.target.dataset.item === '2') {
    dataFilter(resultsMale)
  } else if (event.target.dataset.item === '3') {
    dataFilter(resultsFemale)
  } else {
    dataFilter(data)
  }
})

// filterRegion.addEventListener('submit', event => {
//   event.preventDefault()
//   let input = regionInput.value.toLowerCase()
//   let results = data.filter(
//     data => data.region.toLowerCase().includes(input)
//   )
//   dataFilter(results)
//   regionInput.value = ''
// })

favoriteHtml.addEventListener('click', event => {
  displayFavoriteList(dataFavorite)
  showFavorite()
  getTotalPages(dataFavorite)
  getFavoritePageData(1, dataFavorite)
  if (dataFavorite.length === 0) {
    dataPanel.textContent = 'Your favorite list is empty !'
  }
})

mainHTML.addEventListener('click', event => {
  displayMainPage(data)
})

filterCountry.addEventListener('change', event => {
  event.preventDefault()
  let results = data.filter(data => data.region === event.target.value)
  dataFilter(results)
  if (event.target.value === 'ALL') {
    dataFilter(data)
  }
})

searchForm.addEventListener('submit', event => {
  event.preventDefault()
  let input = searchInput.value.toLowerCase()
  let results = data.filter(
    data => data.name.toLowerCase().includes(input)
  )
  dataFilter(results)
  searchInput.value = ''
})

function showUser(id) {
  const modalName = document.getElementById('show-user-title')
  const modalAvatar = document.getElementById('show-user-avatar')
  const modalBirthday = document.getElementById('show-user-birthday')
  const modalAge = document.getElementById('show-user-age')
  const modalGender = document.getElementById('show-user-gender')
  const modalRegion = document.getElementById('show-user-region')
  const modalEmail = document.getElementById('show-user-email')
  // set request url
  const url = INDEX_URL + id
  // send request to show api
  axios.get(url).then((response) => {
    const data = response.data
    // insert data into modal ui
    modalName.textContent = `${data.name} ${data.surname}`
    modalAvatar.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`
    modalBirthday.textContent = `Birthday: ${data.birthday}`
    modalAge.textContent = `Age: ${data.age}`
    modalGender.textContent = `Gender: ${data.gender}`
    modalRegion.textContent = `Region: ${data.region}`
    modalEmail.textContent = `Email: ${data.email}`
  }).catch((err) => { console.log(err) })
}



function displayUserList(data) {
  let htmlContent = ''
  data.forEach(function (item, index) {
    htmlContent += `
        <div class="col-sm-3">
          <div class="card sm-3 ">
            <h5 class="card-title">${item.name}</h5>
            <img class="card-img-top" data-id="${item.id}"  src="${item.avatar}" alt="Card image cap" data-toggle="modal" data-target="#show-user-modal">
            <div class="user-region" data-id=${item.region}>${item.region}</div>
            <div class="card-body user-item-body">
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing eiusmod tempor incididunt ut labore et dolore magna.</div>
            <button class="btn btn-info btn-add-follower" data-id="${item.id}">Follow</button>
            </div>
          </div>
        </div>
      `
  })
  dataPanel.innerHTML = htmlContent
}

function addFollower(id) {
  const follower = data.find(item => item.id === Number(id))
  if (dataFavorite.some(item => item.id === Number(id))) {
    alert(`${follower.name} is already followed !`)
  } else {
    dataFavorite.push(follower)
    alert(`${follower.name} Followed !`)
  }
  localStorage.setItem('followUser', JSON.stringify(dataFavorite))
  console.log(dataFavorite)
}

function removeFollower(id) {
  const index = dataFavorite.findIndex(item => item.id === Number(id))
  const follower = dataFavorite.find(item => item.id === Number(id))
  if (index === -1) return
  alert(`${follower.name} Unfollowed!`)
  dataFavorite.splice(index, 1)
  localStorage.setItem('followUser', JSON.stringify(dataFavorite))
}


function getTotalPages(data) {
  const totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
  let pageItemContent = ''
  for (let i = 0; i < totalPages; i++) {
    pageItemContent += `
      <li class= "page-item" >
        <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li >
      `
  }
  pagination.innerHTML = pageItemContent
}

function getPageData(pageNum, data) {
  paginationData = data || paginationData
  const offset = (pageNum - 1) * ITEM_PER_PAGE
  const pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
  displayUserList(pageData)
}

function getFavoritePageData(pageNum, dataFavorite) {
  paginationData = dataFavorite || paginationData
  const offset = (pageNum - 1) * ITEM_PER_PAGE
  const pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
  displayFavoriteList(pageData)
}

function changeFollowBtn() {
  if (event.target.matches('.btn-add-follower')) {
    event.target.classList.remove('btn-add-follower')
    event.target.classList.add('btn-remove-follower')
    event.target.innerHTML = 'Unfollow'
  } else if (event.target.matches('.btn-remove-follower')) {
    event.target.classList.remove('btn-remove-follower')
    event.target.classList.add('btn-add-follower')
    event.target.innerHTML = 'Follow'
  }
}

function displayCarousel(data) {
  const carouselTop = document.getElementById('carousel-active')
  const carouselSec = document.getElementById('carousel')
  const ageL = data.filter(data => data.age <= 22)
  const ageH = data.filter(data => data.age > 74)
  carouselTop.innerHTML = generateHtml(ageL)
  carouselSec.innerHTML = generateHtml(ageH)
}

function dataFilter(data) {
  displayUserList(data)
  getTotalPages(data)
  getPageData(1, data)
}

function generateHtml(data) {
  let htmlContentTop = ""
  let htmlContentSec = ""
  data.forEach(function (item, index) {
    htmlContentTop += `
      <div class="col-lg-3 col-md-3 col-sm-6">
        <div class="full blog_img_popular">
          <img class="img-responsive" data-id="${item.id}"  src="${item.avatar}" data-toggle="modal" data-target="#show-user-modal" alt="#" />
          <h5 class="carousel-name">${item.name}</h5>
          <div class="overlay_bt">
          </div>
        </div>
      </div>
      `
  })
  data.forEach(function (item, index) {
    htmlContentSec += `
      <div class="col-lg-3 col-md-3 col-sm-6">
        <div class="full blog_img_popular">
          <img class="img-responsive" data-id="${item.id}"  src="${item.avatar}" data-toggle="modal" data-target="#show-user-modal" alt="#" />
          <h5 class="carousel-name">${item.name}</h5>
          <div class="overlay_bt">
          </div>
        </div>
      </div>
      `
  })
  return htmlContentTop
  return htmlContentSec
}

function displayMainPage(data) {
  displayCarousel(data)
  displayUserList(data)
  getTotalPages(data)
  getPageData(1, data)
}


function showFavorite() {
  console.log(dataFavorite)
  const dataPanel = document.getElementById('data-panel')
  displayFavoriteList(dataFavorite)
  dataPanel.addEventListener('click', function (event) {
    if (event.target.matches('.btn-show-user')) {
      showUser(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavorite(event.target.dataset.id)
    }
  })
}

function displayFavoriteList(dataFavorite) {
  let htmlContent = ''
  dataFavorite.forEach(function (item, index) {
    htmlContent += `
      <div class="col-sm-3">
        <div class="card sm-3 ">
          <h5 class="card-title">${item.name}</h5>
          <img class="card-img-top" data-id="${item.id}" src="${item.avatar}" alt="Card image cap" data-toggle="modal" data-target="#show-user-modal">
          <div class="user-region" data-id=${item.region}>${item.region}</div>
            <div class="card-body user-item-body">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing eiusmod tempor incididunt ut labore et dolore magna.</div>
              <button class="btn btn-info btn-remove-favorite" data-id="${item.id}">Unfollow</button>
            </div>
          </div>
      </div>
      `
  })
  dataPanel.innerHTML = htmlContent
}

function removeFavorite(id) {
  const index = dataFavorite.findIndex(item => item.id === Number(id))
  if (index === -1) return
  dataFavorite.splice(index, 1)
  localStorage.setItem('followUser', JSON.stringify(dataFavorite))
  displayFavoriteList(dataFavorite)
}