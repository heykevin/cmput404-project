/**
 * API Users static class
 */
export default class ApiUsers
{
    static getList(action)
    {
        let users = [];
        return fetch('http://rest.learncode.academy/api/learncode/friends').then((res) => {
            return res.json();
        }).then((list) => {
            console.log(list)
            list.forEach((person, i) => {
                if (person.name && person.drink && person.id) {
                    users.push({
                        id: i,
                        username: person.name,
                        drink: person.drink
                    });
                }
            });
            console.log(users)
            return users;
        });
    }

    static addUser(action) {

        const searchParams = Object.keys(action).map((key) => {
            let encodedKey = encodeURIComponent(key)
            if(key === "username") {
                encodedKey = encodeURIComponent("name");
            }
            return encodedKey + '=' + encodeURIComponent(action[key]);
        }).join('&');

        let users = [];
        return fetch('http://rest.learncode.academy/api/learncode/friends', ({
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: searchParams
        })
        )
    }
}
