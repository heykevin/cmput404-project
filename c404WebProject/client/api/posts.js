/**
 * API Posts static class
 */
 const data = [
     {
         id: "DI-1",
         title: "GTAV Script",
         description: "Parental Advisory | Explicity Conetnt",
         author: "RockStar",
         content: "No content",
         dateTime: "02/09/2014",
         origin: "/post/1",
         visibility: "PUBLIC",
         isMarkdownContent: false

     }, {
         id: "DI-2",
         title: "Cinnamon Peeler",
         description: "A smelly worker loves his wifey or fiancée",
         author: "Michael Ondaatje",
         content: "If I were a cinnamon peeler/I would ride your bed/" +
             "And leave the yellow bark dust/On your pillow./Your " +
             "breasts and shoulders would reek/You could never walk " +
             "through markets/without the profession of my fingers/" +
             "floating over you.",
         dateTime: "01/01/1989",
         origin: "/post/2",
         visibility: "PUBLIC",
         isMarkdownContent: true

     }, {
         id: "DI-3",
         title: "Odyssey",
         description: "The Odyssey is Homer's epic of Odysseus' 10-year " +
             "struggle to return home after the Trojan War. ",
         author: "Homer",
         content: "Oh Goddess of Inspiration, help me sing of wily Odysseus, that master of schemes",
         dateTime: "02/28/1300",
         origin: "/post/3",
         visibility: "PUBLIC",
         isMarkdownContent: true
     },
 ];

export default class ApiPosts {
    static getPosts(action) {
        console.log("posts api");
        const defaultPageSize = 10;
        let query, post = [];
        // if the method is author, then it'll be /author/posts or author/{author_id}/posts
        if (action.method == "author") {
            query = action.authorId ? "/author/" + action.authorId + "/posts" : "/author/posts";
        } else {
            query = action.postId ? "/posts/" + action.postId + "/posts" : "/posts";
            query += action.comments ? "/comments" : "";
        }

        // Add pagination query here.

        // mock data return mechanism
        if (action.postId) {
            for (const post of data) {
                if (post.id === action.postId) {
                    return [post];
                }
            }
        } else {
            return data;
        }

		// HANDLE RESPONSE
        // return fetch(query).then((res) => {
        //     return res.json();
        // }).then((postsObj) => {
        //     console.log(postsObj.posts);
        //     postsObj.posts.forEach((post, i) => {
        //         if (post.title && post.description && post.id && post.author.displayName) {
        //             posts.push({
        //                 id: i,
        //                 title: post.author.displayName,
        //                 description: post.description,
        //				   content: post.content ? post.content.substring(0,100) + "..." : "No content",
        //             });
        //         }
        //     });
        //     console.log(posts);
        //     return posts;
        // });
    }

    static savePost(action) {
        console.log("api - save post");
        // add Authorization
        // refer to auth.js
        return {
            status: 201
        }
    }

    static deletePost(action) {
        console.log("api - delete post id: " + action.id);
        return {data: data, id:action.id};
    }
}
