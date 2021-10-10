// API文件資料位置 主接口、電影資料、圖片
const BASE_URL = "https://movie-list.alphacamp.io/api/v1"
const Index_URL = BASE_URL + "/movies/"
const Posters_URL = "https://movie-list.alphacamp.io/posters/"

// DOM
const searchForm = document.querySelector('#search-form') 
const searchInput = document.querySelector('#search-input') 
const iconList = document.querySelector('#icon-list')
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')

// 存 API & 搜尋 資料
const movies = []
let filteredMovies = []

// 設定 初始狀態
const MOVIES_PER_PAGE = 12
let movieFettle = movies
let iconFettle = "card"
let pageFettle = 1

// 取 API 資料
axios.get(Index_URL).then(response => {
  movies.push(...response.data.results)
  renderMoviesModel(getMoviesByPage(pageFettle, movieFettle), iconFettle)
})
.catch(function (error) {
  console.log(error);
})

// search 搜尋器
searchForm.addEventListener('submit', event => {
  // 取消預設動作
  event.preventDefault()
  // 取得搜尋關鍵字值、去頭尾的空白、改一律都是小寫
  const keyWord = searchInput.value.trim().toLowerCase()
  searchConditionalFilter(keyWord)
  searchInput.value = ''
})
// 搜尋器 新增 input事件 使畫面可隨著輸入值更變
searchInput.addEventListener('input', event => {
  const keyWord = searchInput.value.trim().toLowerCase()
  searchConditionalFilter(keyWord)
})

// icon 切換畫面
iconList.addEventListener('click', event => {
  if (event.target.matches('.fa-th')){
    iconFettle = "card"
    filteredMovies = []
    renderMoviesModel(getMoviesByPage(pageFettle, movieFettle), iconFettle)
  } else if (event.target.matches('.fa-bars')) {
    iconFettle = "list"
    filteredMovies = []
    renderMoviesModel(getMoviesByPage(pageFettle, movieFettle), iconFettle)
  }
})

// 按鈕(電影介紹＆收藏電影)
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 分頁
paginator.addEventListener('click', function onPaginatorClicked(event) {
  // 如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  // 取得點擊的頁數
  const page = Number(event.target.dataset.page)
  // 更改當前頁數
  pageFettle = page
  // 更新畫面
  renderMoviesModel(getMoviesByPage(pageFettle, movieFettle), iconFettle)
})

// 判定模式
function renderMoviesModel(data, iconFettle) { 
  switch (iconFettle) {
    case "card":
      renderMoviesCard(data)
    break
    case "list":
      renderMoviesList(data)
    break
  }
}
// card 模式渲染
function renderMoviesCard(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${Posters_URL + item.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
              <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}
// list 模式渲染
function renderMoviesList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
    <div class="col-12">
      <hr>
      <div class="row">
          <div class="col-8">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="col-4">
            <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
            <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// search 搜尋器 條件篩選
function searchConditionalFilter(value){
  // 條件篩選
  filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(value)
  })
  // 錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    searchInput.value = ''
    return alert(`您輸入的關鍵字：${value} 沒有符合條件的電影`)
  }
  // 更新資料
  movieFettle = filteredMovies
  pageFettle = 1
  // 重新輸出至畫面
  renderMoviesModel(getMoviesByPage(pageFettle, movieFettle), iconFettle)
}

// 更新 Modal
function showMovieModal(id) {
  const ModalTitle = document.querySelector('#movie-modal-title')
  const ModalImage = document.querySelector('#movie-modal-image')
  const ModalDate = document.querySelector('#movie-modal-date')
  const ModalDescription = document.querySelector('#movie-modal-description')
  // 取 電影資料更新
  axios.get(Index_URL + id)
  .then(response => {
    let data = response.data.results
    ModalTitle.innerText = data.title
    ModalImage.innerHTML = `<img src=${Posters_URL + data.image} alt="movie-poster" class="img-fuid">`
    ModalDate.innerText = "Release date: " + data.release_date
    ModalDescription.innerText = data.description
  })
  .catch(function (error) {
    console.log(error);
  })
}

// 加入收藏頁面
function addToFavorite(id) {
  // 取清單 or []
  let list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  // 比對電影
  let movie = movies.find(movie => movie.id === id)
  if (list.some(movie => movie.id === id)) {
    return alert("電影已經在收藏清單中")
  }
  // 存到清單
  list.push(movie)
  // 存上清單
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 取每頁要顯示的電影區間
function getMoviesByPage(page, data){
  // 更新頁碼
  renderPaginator(page, data.length)
  // 取資料起點
  let startIndex = (page - 1) * MOVIES_PER_PAGE
  // 回傳內容區間
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}
// 依據資料做出幾個頁碼
function renderPaginator(index, amount) {
  // 取 頁碼總數量
  let numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rewHTML = ''
  for (let page = 1; page <= numberOfPages; page++){
    // 顯示目前在第幾頁
    if(page === index) {
      rewHTML += `
      <li class="page-item active"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    } else {
      rewHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
  }
  paginator.innerHTML = rewHTML
}