var allBlog = new Vue({
    el: "#all-blog",
    data() {
        return {
            blogList:[{
                title:"文章标题",
                link: "/"
            }]
        }
    },
    methods: {
        queryALLBlog(){
            axios({
                method: "get",
                url: "/queryAllBlog"
            }).then(result => {
                console.log(result.data.data);
                result = result.data.data;
                this.blogList = [];
                result.forEach(ele => {
                    const temp = {};
                    temp.title = ele.title;
                    temp.link = "/blog_detail.html?bid=" + ele.id;
                    this.blogList.push(temp);
                })
            })
        }
    },
    created() {
        this.queryALLBlog()
    },
})