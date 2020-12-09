var everyday = new Vue({
    el:'#every-day',
    data(){
        return {
            content: "默认句子，占位"
        }
    },
    computed: {
        getContent(){
            return this.content;
        }
    },
    created() {
        axios({
            method: "get",
            url: "/queryEveryDay"
        }).then(function(resp) {
            // console.log(resp);
            // resp = JSON.parse(resp);
            // console.log(JSON.parse(resp.data[0]));
            everyday.content = resp.data.data[0].content;
        }).catch(function (resp) {
            console.log("请求失败");
        });
    },
});

var articleList = new Vue({
    el: "#article-list",
    data(){
        return {
            page: 1,
            pageSize: 5,
            pageCount: 0,
            tag:"",
            totalBlogs: 0,
            articleList:[
                {   
                    id:1,
                    title:"为幸福而奋斗 因奋斗而幸福",
                    content:"在这个手机“霸占”眼球的时代，轻阅读、浅阅读、碎片化阅读成为社会常态，如何让学生爱上阅读？在海南省保亭黎族苗族自治县，保亭中学校长周小华推出一项创举——全校实施“开放式自主阅读”，将沉睡在图书馆里的上万册图书搬到教室、走廊、架空层大厅，设置书架、摆好桌椅，让书籍全方位包围学生，静候孩子们的翻阅。在这个手机“霸占”眼球的时代，轻阅读、浅阅读、碎片化阅读成为社会常态，如何让学生爱上阅读？在海南省保亭黎族苗族自治县，保亭中学校长周小华推出一项创举——全校实施“开放式自主阅读”，将沉睡在图书馆里的上万册图书搬到教室、走廊、架空层大厅，设置书架、摆好桌椅，让书籍全方位包围学生，静候孩子们的翻阅。",
                    date: "2020-6-6",
                    views: 2333,
                    tags: 'abc test2',
                    link: "/",
                }
            ]
        };
    },
    computed: {
        

    },
    methods: {
        queryBlog(){
            let searchParams = location.search.indexOf("?") != -1 ? location.search.split("?")[1].split("&") : "没传id";
            // console.log("searchParam：",searchParams);
            for (let i = 0; i < searchParams.length; i++) {
                if(searchParams[i].split("=")[0] == "tag"){
                    this.tag = searchParams[i].split("=")[1]
                }
            }
            if(this.tag){
                // console.log(this.tag);
                axios({
                    method: "get",
                    url: "/queryBlogByTag?page=" + (this.page - 1) + "&pageSize=" + this.pageSize + "&tag=" + this.tag
                }).then(result => {
                    this.articleList = result.data.data;
                    this.articleList = this.articleList.map((article => {
                        article.date = moment(article.ctime).format("YYYY-MM-DD");
                        article.link = "/blog_detail.html?bid=" + article.id;
                        delete article.ctime;
                        article.tags = article.tags.replace(/(，|,|, )/g," ");
                        return article;
                    }));
                    console.log(this.articleList);
                    //每次请求博客就更新分页组件
                    this.queryBlogCount();
                    
                })
            }else{
                axios({
                    method: "get",
                    url: "/queryBlogByPage?page=" + (this.page - 1) + "&pageSize=" + this.pageSize
                }).then(result => {
                    this.articleList = result.data.data;
                    this.articleList = this.articleList.map((article => {
                        article.date = moment(article.ctime).format("YYYY-MM-DD");
                        article.link = "/blog_detail.html?bid=" + article.id;
                        delete article.ctime;
                        article.tags = article.tags.replace(/(，|,|, )/g," ");
                        return article;
                    }));
                    console.log(this.articleList);
                    //每次请求博客就更新分页组件
                    this.queryBlogCount();
                })
            }
            
        },
        queryBlogCount(){
            axios({
                method:"get",
                url:"/queryBlogCount?tag=" + this.tag
            }).then(result =>{
                // console.log("总博客数：",result.data.data[0].count);
                this.totalBlogs = result.data.data[0].count;
                this.pageCount = Math.ceil(this.totalBlogs / this.pageSize);
            });
        },
        turnPage(page){
            this.page = page;
            this.queryBlog();
        },
        addViews(blog_id){
            axios({
                method: "get",
                url: "/addViewsByBlogId?bid=" + blog_id
            }).then(result =>{
                console.log(result.data.data);
            })
        }
    },
    created(){
        // console.log(this);
        this.queryBlog();
    },
});

