var blogDetail = new Vue({
    el:"#blog-detail",
    data() {
        return {
            title: "",
            tags: "",
            date: "",
            views: "",
            content: ""
        }
    },
    computed:{
        // content(content){
        //     return
        // }
    },
    methods: {
        queryBlogDetail(){
            let searchParams = location.search.indexOf("?") != -1 ? location.search.split("?")[1].split("&") : "没传id";
            // console.log("searchParam：",searchParams);
            let bid = -1;
            for (let i = 0; i < searchParams.length; i++) {
                if(searchParams[i].split("=")[0] == "bid"){
                    bid = searchParams[i].split("=")[1]
                }
            }
            // console.log("bid:",bid);

            axios({
                method:"get",
                url:"/queryBlogDetail?bid=" + bid
            }).then(result =>{
                // console.log("博客详情结果", result.data.data[0]);
                result = result.data.data[0]
                this.title = result.title;
                this.tags = result.tags;
                this.views = result.views;
                this.date = moment.utc(result.ctime).format("YYYY-MM-DD");
                this.content = result.content;
                
            })
        }
    },
    created() {
        this.queryBlogDetail();
    }, 
})




var commentList = new Vue({
    el: "#guestbooks",
    data() {
        return {
            guestbookList:[],
            totalCounts: 0
        }

    },
    methods: {
        queryCommentByBlogId(){
            let searchParams = location.search.indexOf("?") != -1 ? location.search.split("?")[1].split("&") : "没传id";
            let bid = -10;
            for (let i = 0; i < searchParams.length; i++) {
                if(searchParams[i].split("=")[0] == "bid"){
                    bid = searchParams[i].split("=")[1]
                }
            }
            axios({
                method: "get",
                url: "/queryCommentByBlogId?bid=" + bid
            }).then(result => {
                console.log(result.data.data);
                this.guestbookList = result.data.data;
                this.guestbookList.forEach(gusetbook => {
                    gusetbook.ctime = moment.utc(gusetbook.ctime).format("YYYY-MM-DD");
                });
                this.totalCounts = this.guestbookList.length;
            })
        },
        replyToSomeone(parentId, parentName){
            console.log(parentId, parentName);
            sendComment.dataObj.parent = parentId;
            sendComment.dataObj.parentName = parentName;
        }
    },
    created() {
        this.queryCommentByBlogId();
    },
})


var sendComment = new Vue({
    el: "#send-comment",
    data() {
        return {
            dataObj: {
                parent: -1,
                parentName: ""
            },
            captchaData:{

            }
        }
    },
    methods: {
        addComment(){
            // console.log("发出了请求一次sendcomment");
            let searchParams = location.search.indexOf("?") != -1 ? location.search.split("?")[1].split("&") : "没传id";
            // console.log("searchParam：",searchParams);
            this.dataObj.bid = -10;
            for (let i = 0; i < searchParams.length; i++) {
                if(searchParams[i].split("=")[0] == "bid"){
                    this.dataObj.bid = searchParams[i].split("=")[1]
                }
            }
            this.dataObj.userName = document.getElementById("user-name").value;
            this.dataObj.email = document.getElementById("email").value;
            this.dataObj.comments = document.getElementById("comments").value;
            this.dataObj.code = document.getElementById("code").value;
            if(!(this.dataObj.userName && this.dataObj.comments && this.dataObj.email && (this.dataObj.code.toLowerCase() == this.captchaData.text.toLowerCase()))){
                return;
            }
            console.log(this.dataObj);
            axios({
                method:"post",
                url: "/addComment",
                data: this.dataObj
            }).then(result => {
                // console.log(result.data.data);
                this.initInput();
                this.captcha();
                commentList.queryCommentByBlogId();
            })
        },
        initInput(){
            this.dataObj.parent = -1;
            this.dataObj.parentName = "";
            document.getElementById("comments").value = "";
            document.getElementById("code").value = "";
        },
        captcha(){
            axios({
                method: "get",
                url: "/captcha"
            }).then(result => {
                // console.log(result.data.data);
                this.captchaData = result.data.data;
            })
        }
    },
    created() {
        this.captcha();
    },

})