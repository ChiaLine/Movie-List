const BASE_URL = "https://movie-list.alphacamp.io/api/v1"
const Index_URL = BASE_URL + "/movies/"
const Posters_URL = "https://movie-list.alphacamp.io/posters/"

// 1- 取 localStorage 資料
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
// 2- 更新畫面
const dataPanel = document.querySelector('#data-panel')
function renderMoviesList(data) {
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
              <button type="button" class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>
  `
  })
  dataPanel.innerHTML = rawHTML
}
renderMoviesList(movies)

// 刪除功能 函式
function removeFromFavorite(id){
  // 找到位置
  const movieIndex = movies.findIndex(movie => {
    return movie.id === id
  })
  // 刪除一筆資料
  movies.splice(movieIndex, 1)
  // 回傳存擋
  localStorage.setItem('favoriteMovies',JSON.stringify(movies))
  // 更新畫面
  renderMoviesList(movies)
}

// 2- 點擊 按鈕事件
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')){
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

// 5-更新Modal 電影詳細資料
function showMovieModal(id) {
  const ModalTitle = document.querySelector('#movie-Modal-title')
  const ModalImage = document.querySelector('#movie-mosal-image')
  const ModalDate = document.querySelector('#movie-modal-date')
  const ModalDescription = document.querySelector('#movie-modal-description')

  axios.get(Index_URL + id).then(response => {
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