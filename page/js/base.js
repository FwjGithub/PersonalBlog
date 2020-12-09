var randomTags = new Vue({
    el: "#random-tags",
    data(){
        return {
            tags:[]
        }
    },
    methods: {
        getRandomColor(){
			var red = Math.random() * 255 + 80;
			var blue = Math.random() * 255 + 80;
			var green = Math.random() * 255 + 80;
			return `rgba(${red},${green},${blue})`;
            
        },
        getRandomFontsize(){
			return Math.random() * 20 + 12;
		},
		queryRandomTags(){
			axios({
				method: "get",
				url: "/queryRandomTags"
			}).then(result => {
                result = result.data.data;
                result.forEach(ele => {
                    const temp = {};
                    temp.tag = ele.tag;
                    temp.link = "/?tag=" + ele.tag;
                    this.tags.push(temp);
                })
				// console.log(result);
			})
		}
	},
	created() {
		this.queryRandomTags();
	},
});
var newHot = new Vue({
    el:"#new-hot",
    data(){
        return {
            titleList:[
                {
                    title: "一个文章的标题",
                    link:"/"
                }
            ]
        }
    },
    methods: {
        queryHotBlog(size=8){
            axios({
                method: "get",
                url: "/queryHotBlog?size=" + size
            }).then(result => {
                // console.log(result);
                result = result.data.data;
                this.titleList = [];
                result.forEach(ele => {
                    const temp = {};
                    temp.title = ele.title;
                    temp.link = "/blog_detail.html?bid=" + ele.id;
                    this.titleList.push(temp);
                })
            })
        }
    },
    created() {
        this.queryHotBlog();
    },
});
var newComments = new Vue({
    el: "#new-comments",
    data(){
        return {
            commentsList: [
                
            ]
        }
    },
    methods: {
        queryNewComment(size = 8){
            axios({
                method: "get",
                url: "/queryNewComment?size=" + size
            }).then(result => {
                this.commentsList = result.data.data;
                this.commentsList.forEach(ele => {
                    ele.ctime = moment.utc(ele.ctime).format("YYYY-MM-DD hh:mm")
                })
            })
        }
    },
    created() {
        this.queryNewComment();
    },
})