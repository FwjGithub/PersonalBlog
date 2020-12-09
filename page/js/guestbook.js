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
            axios({
                method: "get",
                url: "/queryCommentByBlogId?bid=-2"
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
                parentName: "",
                bid: -2//关于页面的bid默认为-2来表示留言页面
            },
            captchaData:{

            }
        }
    },
    methods: {
        addComment(){
            // console.log("发出了请求一次sendcomment");
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