
import { useState } from "react";

async function getAllUsers(request:Request, setAllUsers:any) {
    try {
        const response = await fetch(request);
        const result = await response.json();
        console.log("Success: ", result);
        setAllUsers(JSON.stringify(result));
    } catch (error) {
        console.error("Error: ", error);
    }
}

function UsersPcTemplate() {

    const [allUsers, setAllUsers] = useState('');

    const request = new Request("http://localhost:3000/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
        }),
    })

    // const listAllUsers = allUsers.map((user) =>
    //     <li>{user}</li>
    // )

    return (
        <div>
            coucou
        </div>
    )
}

export default UsersPcTemplate;