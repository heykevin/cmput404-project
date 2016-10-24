/**
 * API Posts static class
 */
export default class ApiPosts {
    static getPosts(action) {
        console.log("posts api");
        const defaultPageSize = 10;
        let posts = [], response;
        // mock data below
        return [

            {
				id: 1,
                title: "GTAV Script",
                description: "Parental Advisory | Explicity Conetnt",
                author: "RockStar",
                content: "No content",
                dateTime: "02/09/2014",
				origin: "https://www.google.com",
            }, {
				id: 2,
                title: "Cinnamon Peeler",
                description: "A smelly worker loves his wifey or fiancée",
                author: "Michael Ondaatje",
                content: "If I were a cinnamon peeler/I would ride your bed/" +
                    "And leave the yellow bark dust/On your pillow./Your " +
                    "breasts and shoulders would reek/You could never walk " +
                    "through markets/without the profession of my fingers/" +
                    "floating over you.",
                dateTime: "01/01/1989",
				origin: "https://www.google.com",

            }, {
				id: 3,
                title: "Odyssey",
                description: "The Odyssey is Homer's epic of Odysseus' 10-year " +
                    "struggle to return home after the Trojan War. ",
                author: "Homer",
                content: "Oh Goddess of Inspiration, help me sing of wily Odysseus, that master of schemes",
                dateTime: "02/28/1300",
				origin: "https://www.google.com",
            },
        ];

        // FALL THROUGH BY DESIGN
        // switch (action.visibility) {
        //     case "PUBLIC":
        //         // query = /posts?visibility=PUBLIC
        //
        //     case "FRIENDS":
        //         // query += visibility in query ? query += "+FRIENDS" : /posts?visibility="FRIENDS"
        //
        //     case "PRIVATE":
        //         query += PRIVATE if visibility is defined otherwise only get private
        //     case "FOAF":
        //
        //     default:
        //     ADD paginationQuery if query is defined otherwise get public posts
		//
        // }

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
}
