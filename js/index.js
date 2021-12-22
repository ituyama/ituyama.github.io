// 0. モジュールシステムを使っている場合 (例: vue-cli 経由で)、Vue と VueRouter をインポートし、`Vue.use(VueRouter)` を呼び出します。

// 1. ルートコンポーネントを定義します
// 他のファイルからインポートすることもできます




Vue.component('NavHeader', {
  
    template:`
    <nav class="navbar navbar-expand-lg ">
    <router-link class="navbar-brand" to="/">YamanoItsuki</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="bi-signpost-2"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item active">
                <router-link class="nav-link" to="/Skill">Skill</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" to="/Product">Product</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/Career">Career</router-link>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://twitter.com/PM80437319">Twitter</a>
            </li>
        </ul>
    </div>
    </nav>`
  })

const Skill = { template: `

<div>
<NavHeader></NavHeader>
    <div class="container">
        <div class="row">
            <h1>&#x1f4bb;Skill</h1>


        </div>

        <div class="row">
            <div class="col-md-12">
                <h2>&#x270f;Language</h2>
                <ul>
                    <li>JavaScript</li>
                    <li>HTML</li>
                    <li>SCSS</li>
                    <li>Python</li>
                    <li>PHP</li>

                </ul>
                <h2>&#x1f4cb;FrameWork</h2>
                <ul>
                    <li>Vue.js</li>
                    <li>Flask</li>
                    <li>React</li>
                </ul>
                <h2>&#x1f6e0;Tool</h2>
                <ul>
                    <li>GIMP</li>
                    <li>Figma</li>
                    <li>Word/Excel/PowerPoint</li>
                </ul>

          
            </div>
        </div>  
    </div>


    ` }
    const Career = {template:`
        <div>
            <NavHeader></NavHeader>
            <div class="container">
                <div class="row">
                    <h1>&#x1f4bc;Career</h1>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <div class="row">
                            <img src="https://www.about.xtraveler.jp/img/yamano.png" class="icons" alt="">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div>
                            <h1>YamanoItsuki</h1>
                            <h2>About</h2>
                            <p>山野一樹　2002年生まれ。茨城県水戸市出身。<br>
                                主な職種はフロントエンド。<br>
                                モットーは「すべての人々にITソリューションの恩恵を。」<br>
                                高校生の時に非営利のプログラミング道場運営を経験。<br>
                                その後、合同会社STOPOVERにでフロントエンドエンジニアとして勤務。<br>
                                武蔵野大学入学後株式会社Xtravelerを立ち上げ、CTOとして勤務。<br>
                                各種イベントで登壇経験あり。
                            </p>
                              
                            
                            <h2>History</h2>
                            <ul>
                                <li>2019 合同会社STOPOVER入社</li>
                                <li>2021 水城高等学校卒業</li>
                                <li>2021 武蔵野大学データサイエンス学部入学</li>
                                <li>2021 株式会社Xtraveler入社</li>
                            </ul>
                        </div>
              
                    </div>
                </div>
            </div>
  
        
        </div>
        `}
    const Bar = { template: '<div>bar</div>' }
    const Product={template:`
    <div>
    <NavHeader></NavHeader>
    <div class="container">
        <div class="row">
            <h1>&#x1f4bb;Product</h1>


        </div>

        <div class="row">
      
            <div class="col-md-4">
                <a href="https://ituyama.com/Oracle-Generator">           
                     <div class="card">
                    <div class="card-img-top">
                        <img src="https://ituyama.com/Oracle-Generator/img/ogp.png" alt="">
                    </div>
                    <div class="card-body">
                        神託ジェネレータ
                    </div>
                </div></a>
    
            </div>
            <div class="col-md-4">
                <a href="https://ituyama.com/JS-haiku-generator">
                    <div class="card">
                        <div class="card-img-top">
                            <img src="https://ituyama.com/JS-haiku-generator/img/ogp.png" alt="">
                        </div>
                        <div class="card-body">
                            俳句ジェネレータ
                        </div>
                    </div>
                </a>
              
            </div>
            <div class="col-md-4">
                <a href="https://ituyama.com/errorsearch">
                    <div class="card">
                        <div class="card-img-top">
                            <img src="https://ituyama.com/errorsearch/imgs/ogp.png" alt="">
                        </div>
                        <div class="card-body">
                            ErrorSearch
                        </div>
                    </div>
                </a>
             
            </div>
            <div class="col-md-4">
                <a href="https://ituyama.com/zoom-newtab">
                    <div class="card">
                        <div class="card-img-top">
                            <img src="../noimages.png" alt="">
                        </div>
                        <div class="card-body">
                            Zoom-Newtab
                        </div>
                    </div>
                </a>
        
            </div>
            <div class="col-md-4">
                <a href="https://ituyama.com/sdgs-checker">      <div class="card">
                    <div class="card-img-top">
                        <img src="https://ituyama.com/sdgs-checker/img/ogp.png" alt="">
                    </div>
                    <div class="card-body">
                        SDGsChecker
                    </div>
                </div></a>
          
            </div>
            <div class="col-md-4">
                <a href="https://ituyama.com/MU-Generator">
                    <div class="card">
                        <div class="card-img-top">
                            <img src="https://ituyama.com/MU-Generator/img/ogp.png" alt="">
                        </div>
                        <div class="card-body">
                            MU掲示板ジェネレータ
                        </div>
                    </div>
                </a>
             
            </div>
        </div>
    </div>
`}
    const index = { template:
    `<div>
        <div class="title"> YamanoItsuki</div>
        <div class="row">
            <div class="col-md-12 cent">
                <router-link to="/Skill">Skill</router-link>/<router-link to="/Product">Product</router-link>/<router-link to="/Career">Career</router-link>/<a href="https://twitter.com/PM80437319">Twitter</a>
            </div>
        </div>
        `}


        // 2. ルートをいくつか定義します
        // 各ルートは 1 つのコンポーネントとマッピングされる必要があります。
        // このコンポーネントは実際の `Vue.extend()`、
        // またはコンポーネントオプションのオブジェクトでも構いません。
        // ネストされたルートに関しては後で説明します
        const routes = [
        { path: '/', component: index},
        { path: '/Skill', component: Skill },
        { path: '/Career', component: Career },
        { path: '/Product', component: Product },
        { path: '/bar', component: Bar }
        
        ]

        // 3. ルーターインスタンスを作成して、ルートオプションを渡します
        // 追加のオプションをここで指定できますが、
        // この例ではシンプルにしましょう
        const router = new VueRouter({
        routes // `routes: routes` の短縮表記
        })

        // 4. root となるインスタンスを作成してマウントします
        // アプリケーション全体がルーターを認知できるように、
        // ルーターをインジェクトすることを忘れないでください。
        const app = new Vue({
        router
        }).$mount('#app')

        // これで開始です!